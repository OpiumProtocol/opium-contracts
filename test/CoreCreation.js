const Core = artifacts.require('Core')
const TestToken = artifacts.require('TestToken')
const OptionCallSyntheticIdMock = artifacts.require('OptionCallSyntheticIdMock')
const TokenMinter = artifacts.require('TokenMinter')
const TokenSpender = artifacts.require('TokenSpender')

const { derivativeFactory } = require('./utils/derivatives')
const { calculateLongTokenId, calculateShortTokenId } = require('./utils/positions')

contract('Core', accounts => {

    const owner = accounts[0]
    const buyer = accounts[1]
    const seller = accounts[2]

    let testToken, core, optionCallLogic, tokenMinter, tokenSpender

    let optionCall

    let quantity, endTime

    let hash

    const SECONDS_40_MINS = 60 * 40

    before(async () => {
        testToken = await TestToken.deployed()
        optionCallLogic = await OptionCallSyntheticIdMock.deployed()
        tokenMinter = await TokenMinter.deployed()
        core = await Core.deployed()
        tokenSpender = await TokenSpender.deployed()

        endTime = ~~(Date.now() / 1000) + SECONDS_40_MINS // Now + 40 mins
    })

    context('Functionality', () => {
        before(async () => {
            optionCall = derivativeFactory({
                margin: 30,
                endTime,
                params: [
                    20000 // Strike Price 200.00$
                ],
                token: testToken.address,
                syntheticId: optionCallLogic.address
            })
            hash = await core.getDerivativeHash(optionCall)
        })

        it('should return correct getDerivativeHash', async () => {
            const web3Hash = web3.utils.soliditySha3(
                optionCall.margin,
                optionCall.endTime,
                {
                    type: 'uint256[]',
                    value: optionCall.params
                },
                optionCall.oracleId,
                optionCall.token,
                optionCall.syntheticId
            )

            assert.notEmpty(hash, 'Hash is incorrect')
            assert.equal(hash, web3Hash, 'Hashes doesn\'t match')
        })
    })

    context('Option Call', () => {
        beforeEach(async () => {
            optionCall = derivativeFactory({
                margin: 30,
                endTime,
                params: [
                    20000 // Strike Price 200.00$
                ],
                token: testToken.address,
                syntheticId: optionCallLogic.address
            })
            quantity = 3
        })

        it('should revert create OptionCall derivative with SYNTHETIC_AGGREGATOR:WRONG_MARGIN', async () => {
            optionCall.margin = 0
            try {
                await core.create(
                    optionCall,
                    quantity,
                    [
                        buyer,
                        seller
                    ],
                    { from: owner }
                )
                throw null
            } catch (e) {
                assert.ok(e.message.match(/SYNTHETIC_AGGREGATOR:WRONG_MARGIN/), 'SYNTHETIC_AGGREGATOR:WRONG_MARGIN')
            }
        })

        it('should revert create OptionCall derivative with CORE:SYNTHETIC_VALIDATION_ERROR', async () => {
            optionCall.margin = 30
            optionCall.endTime = 0
            try {
                await core.create(
                    optionCall,
                    quantity,
                    [
                        buyer,
                        seller
                    ],
                    { from: owner }
                )
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:SYNTHETIC_VALIDATION_ERROR/), 'CORE:SYNTHETIC_VALIDATION_ERROR')
            }
        })

        it('should revert create OptionCall derivative with CORE:NOT_ENOUGH_TOKEN_ALLOWANCE', async () => {
            optionCall.endTime = endTime
            try {
                await core.create(
                    optionCall,
                    quantity,
                    [
                        buyer,
                        seller
                    ],
                    { from: owner }
                )
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:NOT_ENOUGH_TOKEN_ALLOWANCE/), 'CORE:NOT_ENOUGH_TOKEN_ALLOWANCE')
            }
        })

        it('should create OptionCall derivative', async () => {
            await testToken.approve(tokenSpender.address, optionCall.margin * quantity, { from: owner })

            hash = await core.getDerivativeHash(optionCall)

            const longTokenId = calculateLongTokenId(hash)
            const shortTokenId = calculateShortTokenId(hash)

            const oldCoreTokenBalance = await testToken.balanceOf(core.address, { from: owner })

            const callParams = [
                optionCall,
                quantity,
                [
                    buyer,
                    seller
                ],
                { from: owner }
            ]

            // Calculate gas used
            const gas = await core.create.estimateGas(...callParams)
            console.log('Gas used during creation =', gas)

            // Create derivative
            await core.create(...callParams)

            const newCoreTokenBalance = await testToken.balanceOf(core.address, { from: owner })
            assert.equal(newCoreTokenBalance, oldCoreTokenBalance.toNumber() + optionCall.margin * quantity, 'Wrong core token balance')

            const buyerPositionsBalance = await tokenMinter.balanceOf(buyer)
            const buyerPositionsLongBalance = await tokenMinter.balanceOf(buyer, longTokenId)
            const buyerPositionsShortBalance = await tokenMinter.balanceOf(buyer, shortTokenId)
            
            assert.equal(buyerPositionsBalance, 1, 'Buyer positions balance is wrong')
            assert.equal(buyerPositionsLongBalance, quantity, 'Buyer long positions balance is wrong')
            assert.equal(buyerPositionsShortBalance, 0, 'Buyer short positions balance is wrong')

            const sellerPositionsBalance = await tokenMinter.balanceOf(seller)
            const sellerPositionsLongBalance = await tokenMinter.balanceOf(seller, longTokenId)
            const sellerPositionsShortBalance = await tokenMinter.balanceOf(seller, shortTokenId)

            assert.equal(sellerPositionsBalance, 1, 'Seller positions balance is wrong')
            assert.equal(sellerPositionsLongBalance, 0, 'Seller long positions balance is wrong')
            assert.equal(sellerPositionsShortBalance, quantity, 'Seller short positions balance is wrong')
        })

        it('should create second exactly the same OptionCall derivative', async () => {
            await testToken.approve(tokenSpender.address, optionCall.margin * quantity, { from: owner })

            hash = await core.getDerivativeHash(optionCall)

            const longTokenId = calculateLongTokenId(hash)
            const shortTokenId = calculateShortTokenId(hash)

            const oldCoreTokenBalance = await testToken.balanceOf(core.address, { from: owner })

            const callParams = [
                optionCall,
                quantity,
                [
                    buyer,
                    seller
                ],
                { from: owner }
            ]

            const oldBuyerPositionsLongBalance = await tokenMinter.balanceOf(buyer, longTokenId)
            const oldSellerPositionsShortBalance = await tokenMinter.balanceOf(seller, shortTokenId)

            // Calculate gas used
            const gas = await core.create.estimateGas(...callParams)
            console.log('Gas used during second creation =', gas)

            // Create derivative
            await core.create(...callParams)

            const newCoreTokenBalance = await testToken.balanceOf(core.address, { from: owner })
            assert.equal(newCoreTokenBalance, oldCoreTokenBalance.toNumber() + optionCall.margin * quantity, 'Wrong core token balance')
            
            const buyerPositionsBalance = await tokenMinter.balanceOf(buyer)
            const buyerPositionsLongBalance = await tokenMinter.balanceOf(buyer, longTokenId)
            const buyerPositionsShortBalance = await tokenMinter.balanceOf(buyer, shortTokenId)
            
            assert.equal(buyerPositionsBalance, 1, 'Buyer positions balance is wrong')
            assert.equal(buyerPositionsLongBalance, oldBuyerPositionsLongBalance.toNumber() + quantity, 'Buyer long positions balance is wrong')
            assert.equal(buyerPositionsShortBalance, 0, 'Buyer short positions balance is wrong')

            const sellerPositionsBalance = await tokenMinter.balanceOf(seller)
            const sellerPositionsLongBalance = await tokenMinter.balanceOf(seller, longTokenId)
            const sellerPositionsShortBalance = await tokenMinter.balanceOf(seller, shortTokenId)

            assert.equal(sellerPositionsBalance, 1, 'Seller positions balance is wrong')
            assert.equal(sellerPositionsLongBalance, 0, 'Seller long positions balance is wrong')
            assert.equal(sellerPositionsShortBalance, oldSellerPositionsShortBalance.toNumber() + quantity, 'Seller short positions balance is wrong')
        })
    })
})
