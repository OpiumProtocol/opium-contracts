const Core = artifacts.require('Core')
const TestToken = artifacts.require('TestToken')
const TokenSpender = artifacts.require('TokenSpender')
const TokenMinter = artifacts.require('TokenMinter')

const OnchainSubIdsOracleId = artifacts.require('OnchainSubIdsOracleId')
const EthDaiChainlinkOracleSubId = artifacts.require('EthDaiChainlinkOracleSubId')

const { derivativeFactory } = require('./utils/derivatives')
const { timeTravel } = require('./utils/timeTravel')
const { calculateLongTokenId, calculateShortTokenId } = require('./utils/positions')

const millionaire = '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'
const governor = '0xF80D12E55F6cdA587a26a05f2e6477054e8255e5'

const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f'
const tokenSpenderAddress = '0x8bd75f96EfA089aEcf6Ac4CD0B671e2428f4B2af'
const coreAddress = '0xa809d9d82a59166a61b86b7b89feb9c47739a3e1'
const tokenMinterAddress = '0x212fe617ba1641cc84302687a4fbc83f13584a8b'

const oracleIdAddress = '0x54657c50c7c9f04812be0e3144af7003c6978f90'
const oracleSubIdAddress = '0x7f19bd488fd7a9192cb065c70491d586e8088035'
const syntheticId = '0x108AAD9e03D2Ccdfc22a0F082e3Bb4653F4fcF62'

const toE18 = amount => web3.utils.toWei(amount.toString())

const executeOneWithAddress = 'execute(address,uint256,uint256,(uint256,uint256,uint256[],address,address,address))'
const batchTransferFromFour = 'batchTransferFrom(address,address,uint256[],uint256[])'

contract('UpgradeCorePost', accounts => {

    const owner = accounts[0]
    const buyer = accounts[1]
    const seller = accounts[2]

    let dai, core, tokenSpender, oracleId, subid, tokenMinter

    const SECONDS_1_HOUR = 3600
    const SECONDS_2_HOURS = 7200

    const endTime = ~~(Date.now() / 1000) + SECONDS_2_HOURS // Now + 40 mins

    const optionCall = derivativeFactory({
        margin: toE18(100),
        endTime,
        params: [
            toE18(1000),
            toE18(1)
        ],
        token: DAI,
        syntheticId,
        oracleId: oracleIdAddress
    })

    const quantity = 1

    before(async () => {
        core = await Core.at(coreAddress)
        tokenMinter = await TokenMinter.at(tokenMinterAddress)
        dai = await TestToken.at(DAI)
        tokenSpender = await TokenSpender.at(tokenSpenderAddress)
        oracleId = await OnchainSubIdsOracleId.at(oracleIdAddress)
        subid = await EthDaiChainlinkOracleSubId.at(oracleSubIdAddress)

        // Set new whitelist
        // await web3.eth.sendTransaction({
        //     from: owner,
        //     to: governor,
        //     value: toE18(1),
        // })
        // await tokenSpender.proposeWhitelist([ core.address ], { from: governor })
        await timeTravel(SECONDS_1_HOUR + 60)
        await tokenSpender.commitWhitelist({ from: governor })

        // Approve dai from millionare
        await web3.eth.sendTransaction({
            from: owner,
            to: millionaire,
            value: toE18(1),
        })
        await dai.approve(tokenSpenderAddress, toE18(1e6), { from: millionaire })

        // Setup oracle
        await oracleId.registerResolver(endTime, oracleSubIdAddress, { from: owner })
    })

    it('should create', async () => {
        const buyerBalanceBefore = await dai.balanceOf(buyer)
        console.log('Buyer balance BEFORE', buyerBalanceBefore.toString())
        const sellerBalanceBefore = await dai.balanceOf(seller)
        console.log('Seller balance BEFORE', sellerBalanceBefore.toString())

        // Create
        await core.create(
            optionCall,
            quantity,
            [
                buyer,
                seller
            ],
            { from: millionaire }
        )

        const hash = await core.getDerivativeHash(optionCall)
        console.log('Hash', hash)

        const longTokenId = calculateLongTokenId(hash)
        const shortTokenId = calculateShortTokenId(hash)
        console.log('Long token', longTokenId)
        console.log('Short token', shortTokenId)

        // Call oracle
        await timeTravel(SECONDS_2_HOURS)
        await oracleId._callback(endTime, { from: owner })
        const result = await subid.getResult()
        console.log('Oracle Result', result.toString())

        console.log('Test issue...')

        // Test issue
        const positionBalanceBefore = await tokenMinter.balanceOf(buyer, longTokenId)
        await tokenMinter.methods[batchTransferFromFour](buyer, buyer, [longTokenId], [1], { from: buyer })
        const positionBalanceAfter = await tokenMinter.balanceOf(buyer, longTokenId)

        console.log('Tested')

        console.log('Position balance BEFORE', positionBalanceBefore.toString())
        console.log('Position balance AFTER', positionBalanceAfter.toString())

        // Execute
        
        await core.methods[executeOneWithAddress](buyer, longTokenId, 1, optionCall, { from: buyer })

        const buyerBalance = await dai.balanceOf(buyer)
        console.log('Buyer balance', buyerBalance.toString())
        
        await core.methods[executeOneWithAddress](seller, shortTokenId, 1, optionCall, { from: seller })

        const sellerBalance = await dai.balanceOf(seller)
        console.log('Seller balance', sellerBalance.toString())
    })

    // context('Option Call', () => {
    //     beforeEach(async () => {
    //         optionCall = derivativeFactory({
    //             margin: 30,
    //             endTime,
    //             params: [
    //                 20000 // Strike Price 200.00$
    //             ],
    //             token: testToken.address,
    //             syntheticId: optionCallLogic.address
    //         })
    //         quantity = 3
    //     })

        

    //     it('should revert create OptionCall derivative with CORE:SYNTHETIC_VALIDATION_ERROR', async () => {
    //         optionCall.margin = 30
    //         optionCall.endTime = 0
    //         try {
    //             await core.create(
    //                 optionCall,
    //                 quantity,
    //                 [
    //                     buyer,
    //                     seller
    //                 ],
    //                 { from: owner }
    //             )
    //             throw null
    //         } catch (e) {
    //             assert.ok(e.message.match(/CORE:SYNTHETIC_VALIDATION_ERROR/), 'CORE:SYNTHETIC_VALIDATION_ERROR')
    //         }
    //     })

    //     it('should revert create OptionCall derivative with CORE:NOT_ENOUGH_TOKEN_ALLOWANCE', async () => {
    //         optionCall.endTime = endTime
    //         try {
    //             await core.create(
    //                 optionCall,
    //                 quantity,
    //                 [
    //                     buyer,
    //                     seller
    //                 ],
    //                 { from: owner }
    //             )
    //             throw null
    //         } catch (e) {
    //             assert.ok(e.message.match(/CORE:NOT_ENOUGH_TOKEN_ALLOWANCE/), 'CORE:NOT_ENOUGH_TOKEN_ALLOWANCE')
    //         }
    //     })

    //     it('should create OptionCall derivative', async () => {
    //         await testToken.approve(tokenSpender.address, optionCall.margin * quantity, { from: owner })

    //         hash = await core.getDerivativeHash(optionCall)

    //         const longTokenId = calculateLongTokenId(hash)
    //         const shortTokenId = calculateShortTokenId(hash)

    //         const oldCoreTokenBalance = await testToken.balanceOf(core.address, { from: owner })

    //         const callParams = [
    //             optionCall,
    //             quantity,
    //             [
    //                 buyer,
    //                 seller
    //             ],
    //             { from: owner }
    //         ]

    //         // Calculate gas used
    //         const gas = await core.create.estimateGas(...callParams)
    //         console.log('Gas used during creation =', gas)

    //         // Create derivative
    //         await core.create(...callParams)

    //         const newCoreTokenBalance = await testToken.balanceOf(core.address, { from: owner })
    //         assert.equal(newCoreTokenBalance, oldCoreTokenBalance.toNumber() + optionCall.margin * quantity, 'Wrong core token balance')

    //         const buyerPositionsBalance = await tokenMinter.balanceOf(buyer)
    //         const buyerPositionsLongBalance = await tokenMinter.balanceOf(buyer, longTokenId)
    //         const buyerPositionsShortBalance = await tokenMinter.balanceOf(buyer, shortTokenId)
            
    //         assert.equal(buyerPositionsBalance, 1, 'Buyer positions balance is wrong')
    //         assert.equal(buyerPositionsLongBalance, quantity, 'Buyer long positions balance is wrong')
    //         assert.equal(buyerPositionsShortBalance, 0, 'Buyer short positions balance is wrong')

    //         const sellerPositionsBalance = await tokenMinter.balanceOf(seller)
    //         const sellerPositionsLongBalance = await tokenMinter.balanceOf(seller, longTokenId)
    //         const sellerPositionsShortBalance = await tokenMinter.balanceOf(seller, shortTokenId)

    //         assert.equal(sellerPositionsBalance, 1, 'Seller positions balance is wrong')
    //         assert.equal(sellerPositionsLongBalance, 0, 'Seller long positions balance is wrong')
    //         assert.equal(sellerPositionsShortBalance, quantity, 'Seller short positions balance is wrong')
    //     })

    //     it('should create second exactly the same OptionCall derivative', async () => {
    //         await testToken.approve(tokenSpender.address, optionCall.margin * quantity, { from: owner })

    //         hash = await core.getDerivativeHash(optionCall)

    //         const longTokenId = calculateLongTokenId(hash)
    //         const shortTokenId = calculateShortTokenId(hash)

    //         const oldCoreTokenBalance = await testToken.balanceOf(core.address, { from: owner })

    //         const callParams = [
    //             optionCall,
    //             quantity,
    //             [
    //                 buyer,
    //                 seller
    //             ],
    //             { from: owner }
    //         ]

    //         const oldBuyerPositionsLongBalance = await tokenMinter.balanceOf(buyer, longTokenId)
    //         const oldSellerPositionsShortBalance = await tokenMinter.balanceOf(seller, shortTokenId)

    //         // Calculate gas used
    //         const gas = await core.create.estimateGas(...callParams)
    //         console.log('Gas used during second creation =', gas)

    //         // Create derivative
    //         await core.create(...callParams)

    //         const newCoreTokenBalance = await testToken.balanceOf(core.address, { from: owner })
    //         assert.equal(newCoreTokenBalance, oldCoreTokenBalance.toNumber() + optionCall.margin * quantity, 'Wrong core token balance')
            
    //         const buyerPositionsBalance = await tokenMinter.balanceOf(buyer)
    //         const buyerPositionsLongBalance = await tokenMinter.balanceOf(buyer, longTokenId)
    //         const buyerPositionsShortBalance = await tokenMinter.balanceOf(buyer, shortTokenId)
            
    //         assert.equal(buyerPositionsBalance, 1, 'Buyer positions balance is wrong')
    //         assert.equal(buyerPositionsLongBalance, oldBuyerPositionsLongBalance.toNumber() + quantity, 'Buyer long positions balance is wrong')
    //         assert.equal(buyerPositionsShortBalance, 0, 'Buyer short positions balance is wrong')

    //         const sellerPositionsBalance = await tokenMinter.balanceOf(seller)
    //         const sellerPositionsLongBalance = await tokenMinter.balanceOf(seller, longTokenId)
    //         const sellerPositionsShortBalance = await tokenMinter.balanceOf(seller, shortTokenId)

    //         assert.equal(sellerPositionsBalance, 1, 'Seller positions balance is wrong')
    //         assert.equal(sellerPositionsLongBalance, 0, 'Seller long positions balance is wrong')
    //         assert.equal(sellerPositionsShortBalance, oldSellerPositionsShortBalance.toNumber() + quantity, 'Seller short positions balance is wrong')
    //     })
    // })
})
