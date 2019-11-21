const Match = artifacts.require('Match')
const TestToken = artifacts.require('TestToken')
const OptionCallSyntheticIdMock = artifacts.require('OptionCallSyntheticIdMock')
const TokenMinter = artifacts.require('TokenMinter')
const TokenSpender = artifacts.require('TokenSpender')
const Core = artifacts.require('Core')
const WETH = artifacts.require('WETH')

const { zeroAddress } = require('../../utils/addresses')
const { derivativeFactory } = require('../../utils/derivatives')
const { calculateLongTokenId, calculateShortTokenId } = require('../../utils/positions')
const orders = require('../../utils/orders')

contract('Match and MatchCreate', accounts => {
    const owner = accounts[0]
    const relayer = accounts[1]
    const erc20 = accounts[2]
    const buyer = accounts[3]
    const seller = accounts[4]
    const guyOne = accounts[5]
    const guyTwo = accounts[6]

    let match, testToken, optionCallLogic, tokenMinter, core, tokenSpender, weth

    let derivative, derivativeHash, longTokenId, shortTokenId, wrongTokenId

    let orderFactory, sharedOrderFactory

    const dai = amount => web3.utils.toWei(amount.toString(), 'ether')

    before(async () => {
        match = await Match.deployed()
        testToken = await TestToken.deployed()
        optionCallLogic = await OptionCallSyntheticIdMock.deployed()
        tokenMinter = await TokenMinter.deployed()
        tokenSpender = await TokenSpender.deployed()
        core = await Core.deployed()
        weth = await WETH.deployed()

        derivative = derivativeFactory({
            margin: dai(200),
            endTime: ~~(Date.now() / 1000) + 60 * 10, // + 10 mins
            params: [ dai(220) ], // strikePrice
            oracleId: zeroAddress,
            token: testToken.address,
            syntheticId: optionCallLogic.address
        })

        derivativeHash = web3.utils.soliditySha3(
            derivative.margin,
            derivative.endTime,
            {
                type: 'uint256[]',
                value: derivative.params
            },
            derivative.oracleId,
            derivative.token,
            derivative.syntheticId
        )

        longTokenId = calculateLongTokenId(derivativeHash).toString()
        shortTokenId = calculateShortTokenId(derivativeHash).toString()

        wrongTokenId = web3.utils.soliditySha3(derivativeHash, 'WRONG')

        orderFactory = order => orders.orderFactory({ order, testToken, relayer, match })
        sharedOrderFactory = order => orders.orderFactory({ order, testToken, relayer: zeroAddress, match })
    })

    it('should revert incorrect position creation, right taker token is wrong', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: wrongTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:DERIVATIVE_NOT_MATCH/), 'MATCH:DERIVATIVE_NOT_MATCH')
        }
    })

    it('should revert incorrect signature', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        leftOrder.signature = '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: wrongTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:SIGNATURE_NOT_VERIFIED/), 'MATCH:SIGNATURE_NOT_VERIFIED')
        }
    })

    it('should revert incorrect signature length', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: 10,
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        leftOrder.signature = '0x00'

        const rightOrder = await orderFactory({
            makerMarginAmount: 200,
            takerTokenId: wrongTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 4,

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/ORDER:INVALID_SIGNATURE_LENGTH/), 'ORDER:INVALID_SIGNATURE_LENGTH')
        }
    })

    it('should revert incorrect position creation, left maker margin < right taker margin', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(6),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })
        
        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:PREMIUM_IS_NOT_ENOUGH/), 'MATCH:PREMIUM_IS_NOT_ENOUGH')
        }
    })

    it('should revert incorrect position creation, left maker margin address != right taker margin address', async () => {
        const leftOrder = await orderFactory({
            makerMarginAddress: testToken.address,
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAddress: testToken.address,
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: erc20,
            takerMarginAmount: dai(4),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:MARGIN_ADDRESS_NOT_MATCH/), 'MATCH:MARGIN_ADDRESS_NOT_MATCH')
        }
    })

    it('should revert incorrect position creation, left maker token id is non-zero', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: wrongTokenId,
            makerTokenAmount: 1,
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:NOT_CREATION/), 'MATCH:NOT_CREATION')
        }
    })

    it('should revert incorrect position creation, provided margin currency is wrong', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAddress: erc20,
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:PROVIDED_MARGIN_CURRENCY_WRONG/), 'MATCH:PROVIDED_MARGIN_CURRENCY_WRONG')
        }
    })

    it('should revert incorrect position creation, provided margin is not enough', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(199),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:PROVIDED_MARGIN_NOT_ENOUGH/), 'MATCH:PROVIDED_MARGIN_NOT_ENOUGH')
        }
    })

    it('should revert incorrect position creation, not enough allowed margin', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:NOT_ENOUGH_ALLOWED_MARGIN/), 'MATCH:NOT_ENOUGH_ALLOWED_MARGIN')
        }
    })

    it('should revert incorrect position creation, taker address is different', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
            takerAddress: relayer
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:TAKER_ADDRESS_WRONG/), 'MATCH:TAKER_ADDRESS_WRONG')
        }
    })

    it('should revert incorrect position creation, sender address is different', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
            senderAddress: owner
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:SENDER_ADDRESS_WRONG/), 'MATCH:SENDER_ADDRESS_WRONG')
        }
    })

    it('should revert incorrect position creation, order is expired', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: ~~(Date.now() / 1000) - 60 * 20, // - 20 mins

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:ORDER_IS_EXPIRED/), 'MATCH:ORDER_IS_EXPIRED')
        }
    })

    it('should revert cancellation of the order by different person', async () => {
        const order = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        try {
            await match.cancel(order, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:CANCELLATION_NOT_ALLOWED/), 'MATCH:CANCELLATION_NOT_ALLOWED')
        }
    })

    it('should successfully cancel the order', async () => {
        const order = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const gas = await match.cancel.estimateGas(order, { from: buyer })
        console.log('Gas used during cancellation =', gas)
        await match.cancel(order, { from: buyer })
    })

    it('should revert repeated cancellation of the order', async () => {
        const order = await orderFactory({
            makerMarginAmount: dai(10),
            takerTokenId: longTokenId,
            takerTokenAmount: 2,

            nonce: 0,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        try {
            await match.cancel(order, { from: buyer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:ALREADY_CANCELED/), 'MATCH:ALREADY_CANCELED')
        }
    })

    it('should revert creation with not enough premium form buyer', async () => {
        await testToken.transfer(seller, dai(600), { from: owner })
        // Buyer doesn't really have 9 for premium
        await testToken.approve(tokenSpender.address, dai(400), { from: seller })
        await testToken.approve(tokenSpender.address, dai(9), { from: buyer })

        const leftOrder = await orderFactory({
            makerMarginAmount: dai(5),
            takerTokenId: longTokenId,
            takerTokenAmount: 1,

            nonce: 2,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(600),
            takerTokenId: shortTokenId,
            takerTokenAmount: 3,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(12),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/revert/), 'Didn\'t reverted well')
        }
    })

    it('should partially fill right (maker) order by 1, and have 2 left (taker)', async () => {
        await testToken.transfer(buyer, dai(9), { from: owner })

        // Seller balance: 600
        // Buyer balance: 9

        const leftOrder = await orderFactory({
            makerMarginAmount: dai(5),
            takerTokenId: longTokenId,
            takerTokenAmount: 1,

            nonce: 2,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(600),
            takerTokenId: shortTokenId,
            takerTokenAmount: 3,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(12),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        const gas = await match.create.estimateGas(leftOrder, rightOrder, derivative, false, { from: relayer })
        console.log('Gas used during matching creation =', gas)
        await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })

        const buyerBalanceAfter = await testToken.balanceOf(buyer)
        const buyerPositionBalanceAfter = await tokenMinter.balanceOf(buyer, longTokenId)
        const sellerBalanceAfter = await testToken.balanceOf(seller)
        const sellerPositionBalanceAfter = await tokenMinter.balanceOf(seller, shortTokenId)

        // Buyer spent his 8 on premium
        assert.equal(buyerBalanceAfter, dai(5), 'Wrong buyer balance after')
        assert.equal(buyerPositionBalanceAfter, 1, 'Wrong buyer position balance after')
        // Seller received 8 as premium and spent 400 as margin for 2 contracts
        assert.equal(sellerBalanceAfter, dai(404), 'Wrong seller balance after')
        assert.equal(sellerPositionBalanceAfter, 1, 'Wrong seller position balance after')
    })

    it('should partially fill right (taker) order by 1, and have 1 left (maker)', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(5),
            takerTokenId: longTokenId,
            takerTokenAmount: 1,

            nonce: 3,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(600),
            takerTokenId: shortTokenId,
            takerTokenAmount: 3,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(12),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        const gas = await match.create.estimateGas(leftOrder, rightOrder, derivative, true, { from: relayer })
        console.log('Gas used during matching creation =', gas)
        await match.create(leftOrder, rightOrder, derivative, true, { from: relayer })

        const buyerBalanceAfter = await testToken.balanceOf(buyer)
        const buyerPositionBalanceAfter = await tokenMinter.balanceOf(buyer, longTokenId)
        const sellerBalanceAfter = await testToken.balanceOf(seller)
        const sellerPositionBalanceAfter = await tokenMinter.balanceOf(seller, shortTokenId)

        // Buyer spent his 8 on premium
        assert.equal(buyerBalanceAfter, 0, 'Wrong buyer balance after')
        assert.equal(buyerPositionBalanceAfter, 2, 'Wrong buyer position balance after')
        // Seller received 8 as premium and spent 400 as margin for 2 contracts
        assert.equal(sellerBalanceAfter, dai(209), 'Wrong seller balance after')
        assert.equal(sellerPositionBalanceAfter, 2, 'Wrong seller position balance after')
    })

    it('should settle shared order (no senderAddress)', async () => {
        await testToken.transfer(buyer, dai(4), { from: owner })
        await testToken.transfer(seller, dai(200), { from: owner })

        await testToken.approve(tokenSpender.address, dai(4), { from: buyer })
        await testToken.approve(tokenSpender.address, dai(200), { from: seller })

        const leftOrder = await sharedOrderFactory({
            makerMarginAmount: dai(4),
            takerTokenId: longTokenId,
            takerTokenAmount: 1,

            nonce: 5,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await sharedOrderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 7,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        const gas = await match.create.estimateGas(leftOrder, rightOrder, derivative, false, { from: relayer })
        console.log('Gas used during matching shared creation =', gas)
        await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })

        const buyerBalanceAfter = await testToken.balanceOf(buyer)
        const buyerPositionBalanceAfter = await tokenMinter.balanceOf(buyer, longTokenId)
        const sellerBalanceAfter = await testToken.balanceOf(seller)
        const sellerPositionBalanceAfter = await tokenMinter.balanceOf(seller, shortTokenId)

        // Buyer spent his 4 on premium
        assert.equal(buyerBalanceAfter, 0, 'Wrong buyer balance after')
        assert.equal(buyerPositionBalanceAfter, 3, 'Wrong buyer position balance after')
        // Seller received 4 as premium and spent 200 as margin for 1 contract
        assert.equal(sellerBalanceAfter, dai(213), 'Wrong seller balance after')
        assert.equal(sellerPositionBalanceAfter, 3, 'Wrong seller position balance after')
    })

    it('should revert already filled order', async () => {
        const leftOrder = await sharedOrderFactory({
            makerMarginAmount: dai(4),
            takerTokenId: longTokenId,
            takerTokenAmount: 1,

            nonce: 5,
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await sharedOrderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 7,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:NO_FILLABLE_POSITIONS/), 'MATCH:NO_FILLABLE_POSITIONS')
        }
        
    })

    it('should fully fill right order by 1 buy reselling short position of left\'s', async () => {
        // Create one position for test
        // guyTwo would have 1 x shortTokenId
        await testToken.approve(tokenSpender.address, derivative.margin, { from: owner })
        await core.create(derivative, 1, [ guyOne, guyTwo ], { from: owner })

        await testToken.transfer(guyTwo, dai(5), { from: owner })
        await testToken.approve(tokenSpender.address, dai(5), { from: guyTwo })
        await testToken.approve(tokenSpender.address, dai(200), { from: seller })

        // GuyOne balance: 0 DAI + 1 LONG position
        // GuyTwo balance: 5 DAI + 1 SHORT position
        // Seller balance: 213 DAI + 3 SHORT positions

        const leftOrder = await orderFactory({
            makerTokenId: shortTokenId,
            makerTokenAmount: 1,
            makerMarginAmount: dai(5),
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(200),

            nonce: 3,
            expiresAt: derivative.endTime,

            makerAddress: guyTwo,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(600),
            takerTokenId: shortTokenId,
            takerTokenAmount: 3,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(12),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        const gas = await match.swap.estimateGas(leftOrder, rightOrder, { from: relayer })
        console.log('Gas used during matching swap =', gas)
        await match.swap(leftOrder, rightOrder, { from: relayer })

        const guyTwoBalanceAfter = await testToken.balanceOf(guyTwo)
        const sellerBalanceAfter = await testToken.balanceOf(seller)
        const sellerPositionBalanceAfter = await tokenMinter.balanceOf(seller, shortTokenId)
        
        assert.equal(guyTwoBalanceAfter, dai(201), 'Wrong guy two balance after')
        assert.equal(sellerBalanceAfter, dai(17), 'Wrong seller balance after')
        assert.equal(sellerPositionBalanceAfter, 4, 'Wrong seller position balance after')
    })

    it('should revert non-fillable swaps', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: shortTokenId,
            makerTokenAmount: 1,
            makerMarginAmount: dai(5),
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(200),

            nonce: 3,
            expiresAt: derivative.endTime,

            makerAddress: guyTwo,
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(600),
            takerTokenId: shortTokenId,
            takerTokenAmount: 3,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(12),

            nonce: 1,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:NO_FILLABLE_POSITIONS/), 'MATCH:NO_FILLABLE_POSITIONS')
        }
    })

    it('should revert order without WETH fee allowance', async () => {
        const leftOrder = await orderFactory({
            makerMarginAmount: dai(4),
            takerTokenId: longTokenId,
            takerTokenAmount: 1,

            nonce: 6,
            expiresAt: derivative.endTime,

            makerAddress: buyer,

            relayerFee: dai(0.5),
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 9,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:NOT_ENOUGH_ALLOWED_FEES/), 'MATCH:NOT_ENOUGH_ALLOWED_FEES')
        } 
    })

    it('should revert order without WETH fee balance', async () => {
        await weth.approve(tokenSpender.address, dai(0.5), { from: buyer })

        const leftOrder = await orderFactory({
            makerMarginAmount: dai(4),
            takerTokenId: longTokenId,
            takerTokenAmount: 1,

            nonce: 6,
            expiresAt: derivative.endTime,

            makerAddress: buyer,

            relayerFee: dai(0.5),
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 9,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/revert/), 'Didn\'t revert with not enough WETH balance')
        } 
    })

    it('should successfully settle order with ETH fee to relayer', async () => {
        await web3.eth.sendTransaction({
            from: buyer,
            to: WETH.address,
            value: dai(0.5)
        })

        await testToken.transfer(buyer, dai(4), { from: owner })
        await testToken.transfer(seller, dai(200), { from: owner })

        await testToken.approve(tokenSpender.address, dai(4), { from: buyer })
        await testToken.approve(tokenSpender.address, dai(200), { from: seller })

        const relayerFeeBalanceBefore = await match.balances.call(relayer)

        const leftOrder = await orderFactory({
            makerMarginAmount: dai(4),
            takerTokenId: longTokenId,
            takerTokenAmount: 1,

            nonce: 6,
            expiresAt: derivative.endTime,

            makerAddress: buyer,

            relayerFee: dai(0.5),
        })

        const rightOrder = await orderFactory({
            makerMarginAmount: dai(200),
            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: dai(4),

            nonce: 9,
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        await match.create(leftOrder, rightOrder, derivative, false, { from: relayer })
    
        const relayerFeeBalanceAfter = await match.balances.call(relayer)

        assert.equal(relayerFeeBalanceBefore, 0, 'Relayer fee balance before is wrong')
        assert.equal(relayerFeeBalanceAfter, dai(0.5), 'Relayer fee balance after is wrong')
    })

    it('should successfully withdraw relayer fee', async () => {
        const relayerFeeBalanceBefore = await match.balances.call(relayer)
        const relayerWETHBalanceBefore = await weth.balanceOf(relayer)

        await match.withdraw({ from: relayer })

        const relayerFeeBalanceAfter = await match.balances.call(relayer)
        const relayerWETHBalanceAfter = await weth.balanceOf(relayer)

        assert.equal(relayerFeeBalanceBefore, dai(0.5), 'Relayer fee balance before is wrong')
        assert.equal(relayerFeeBalanceAfter, 0, 'Relayer fee balance after is wrong')

        assert.equal(relayerWETHBalanceBefore, 0, 'Relayer WETH balance before is wrong')
        assert.equal(relayerWETHBalanceAfter, dai(0.5), 'Relayer WETH balance after is wrong')
    })
})
