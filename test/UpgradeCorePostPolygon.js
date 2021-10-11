const Core = artifacts.require('Core')
const TestToken = artifacts.require('TestToken')
const TokenSpender = artifacts.require('TokenSpender')
const TokenMinter = artifacts.require('TokenMinter')

const OnchainSubIdsOracleId = artifacts.require('OnchainSubIdsOracleId')

const { derivativeFactory } = require('./utils/derivatives')
const { timeTravel } = require('./utils/timeTravel')
const { calculateLongTokenId, calculateShortTokenId } = require('./utils/positions')

const millionaire = '0x49854708a8c42eeb837a97dd97d597890ceb1334'
const governor = '0x964C04B87D14dF4aa74169874C4B15A87EED360d'

const DAI = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
const tokenSpenderAddress = '0xC7b068B897507312c2DACEd5E537eB658c49608D'

const oracleIdAddress = '0x0D876632F321fdcAbC540eEA5867c4799A627ed8'
const syntheticId = '0x419aa1B768D1476305574a3cb61B7acBF6bD4308'

const coreAddress = '0xB3F6281655276150E97e5029B607a6D4d2E21972'
const tokenMinterAddress = '0x880e37B98f7c058b3563970F256614FF4a580637'

const toE18 = amount => web3.utils.toWei(amount.toString())

const executeOneWithAddress = 'execute(address,uint256,uint256,(uint256,uint256,uint256[],address,address,address))'
const batchTransferFromFour = 'batchTransferFrom(address,address,uint256[],uint256[])'

contract.skip('UpgradeCorePost', accounts => {

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
            toE18(1),
            0
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

        // Set new whitelist
        await web3.eth.sendTransaction({
            from: owner,
            to: governor,
            value: toE18(1),
        })
        await tokenSpender.proposeWhitelist([ core.address ], { from: governor })
        await timeTravel(SECONDS_1_HOUR + 60)
        await tokenSpender.commitWhitelist({ from: governor })

        // Approve dai from millionare
        await web3.eth.sendTransaction({
            from: owner,
            to: millionaire,
            value: toE18(1),
        })
        await dai.approve(tokenSpenderAddress, toE18(1e6), { from: millionaire })
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
        // const result = await oracleId.getResult()
        // console.log('Oracle Result', result.toString())

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
