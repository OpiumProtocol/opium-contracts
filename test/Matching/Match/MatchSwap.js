const Match = artifacts.require('Match')
const TestToken = artifacts.require('TestToken')
const OptionCallSyntheticIdMock = artifacts.require('OptionCallSyntheticIdMock')
const Core = artifacts.require('Core')
const TokenMinter = artifacts.require('TokenMinter')
const TokenSpender = artifacts.require('TokenSpender')

const { zeroAddress } = require('../../utils/addresses')
const { derivativeFactory } = require('../../utils/derivatives')
const { calculateLongTokenId, calculateShortTokenId } = require('../../utils/positions')
const orders = require('../../utils/orders')

contract('MatchSwap', accounts => {
    const owner = accounts[0]
    const relayer = accounts[1]
    const erc20 = accounts[2]
    const buyer = accounts[3]
    const seller = accounts[4]

    let match, testToken, optionCallLogic, core, tokenMinter, tokenSpender

    let derivative, derivativeHash, longTokenId, shortTokenId

    let orderFactory

    before(async () => {
        match = await Match.deployed()
        testToken = await TestToken.deployed()
        optionCallLogic = await OptionCallSyntheticIdMock.deployed()
        core = await Core.deployed()
        tokenMinter = await TokenMinter.deployed()
        tokenSpender = await TokenSpender.deployed()

        derivative = derivativeFactory({
            margin: 200,
            endTime: ~~(Date.now() / 1000) + 60 * 10, // + 10 mins
            params: [ 220 ], // strikePrice
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
        
        orderFactory = order => orders.orderFactory({ order, testToken, relayer, match })
    })

    it('should revert incorrect swap, right requires more shorts for long', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: shortTokenId,
            makerTokenAmount: 5,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 200,

            takerTokenId: longTokenId,
            takerTokenAmount: 2,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 0,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: longTokenId,
            makerTokenAmount: 1,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 0,

            takerTokenId: shortTokenId,
            takerTokenAmount: 3,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 100,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:OFFERS_CONDITIONS_ARE_NOT_MET/), 'MATCH:OFFERS_CONDITIONS_ARE_NOT_MET')
        }
    })

    it('should revert incorrect swap, right requires more margin', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: shortTokenId,
            makerTokenAmount: 6,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 200,

            takerTokenId: longTokenId,
            takerTokenAmount: 2,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 0,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: longTokenId,
            makerTokenAmount: 1,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 0,

            takerTokenId: shortTokenId,
            takerTokenAmount: 3,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 120,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:OFFERS_CONDITIONS_ARE_NOT_MET/), 'MATCH:OFFERS_CONDITIONS_ARE_NOT_MET')
        }
    })

    it('should revert incorrect swap, left requires more margin', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: shortTokenId,
            makerTokenAmount: 6,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 200,

            takerTokenId: longTokenId,
            takerTokenAmount: 2,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 10,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: longTokenId,
            makerTokenAmount: 1,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 0,

            takerTokenId: shortTokenId,
            takerTokenAmount: 3,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 100,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:OFFERS_CONDITIONS_ARE_NOT_MET/), 'MATCH:OFFERS_CONDITIONS_ARE_NOT_MET')
        }
    })

    it('should revert incorrect swap, left requires more margin without tokens', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 200,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 10,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 9,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 200,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:OFFERS_CONDITIONS_ARE_NOT_MET/), 'MATCH:OFFERS_CONDITIONS_ARE_NOT_MET')
        }
    })

    it('should revert incorrect swap, right requires more tokens', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 200,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 10,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 9,

            takerTokenId: longTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 200,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:OFFERS_CONDITIONS_ARE_NOT_MET/), 'MATCH:OFFERS_CONDITIONS_ARE_NOT_MET')
        }
    })

    it('should revert incorrect swap, wrong left tokenIds ', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: shortTokenId,
            makerTokenAmount: 1,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 200,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 10,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 10,

            takerTokenId: longTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 200,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:NOT_VALID_SWAP/), 'MATCH:NOT_VALID_SWAP')
        }
    })

    it('should revert incorrect swap, wrong left margin ', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: erc20,
            makerMarginAmount: 200,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 10,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 10,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 200,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:NOT_VALID_SWAP/), 'MATCH:NOT_VALID_SWAP')
        }
    })

    it('should revert incorrect swap, wrong right tokenIds ', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: shortTokenId,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 200,

            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 10,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: longTokenId,
            makerTokenAmount: 1,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 10,

            takerTokenId: longTokenId,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 200,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:NOT_VALID_SWAP/), 'MATCH:NOT_VALID_SWAP')
        }
    })

    it('should revert incorrect swap, wrong right margin ', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 0,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 10,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: erc20,
            makerMarginAmount: 10,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 0,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/MATCH:NOT_VALID_SWAP/), 'MATCH:NOT_VALID_SWAP')
        }
    })

    it('should revert incorrect swap, no positions to swap ', async () => {
        const leftOrder = await orderFactory({
            makerTokenId: longTokenId,
            makerTokenAmount: 1,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 0,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 0,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 0,

            takerTokenId: longTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 0,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        try {
            await match.swap(leftOrder, rightOrder, { from: relayer })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/revert/), 'revert')
        }
    })

    it('should successfully swap 1 position left -> right', async () => {
        await testToken.approve(tokenSpender.address, derivative.margin, { from: owner })
        await core.create(derivative, 1, [ buyer, seller ], { from: owner })

        // NOTE: Approval was already made above

        // Buyer balance: 1 LONG
        // Seller balance: 1 SHORT

        const leftOrder = await orderFactory({
            makerTokenId: longTokenId,
            makerTokenAmount: 1,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 0,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 0,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 0,

            takerTokenId: longTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 0,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        const leftLongTokenBalanceBefore = await tokenMinter.balanceOf(buyer, longTokenId)
        const rightLongTokenBalanceBefore = await tokenMinter.balanceOf(seller, longTokenId)

        const gas = await match.swap.estimateGas(leftOrder, rightOrder, { from: relayer })
        console.log('Gas used during swap =', gas)
        await match.swap(leftOrder, rightOrder, { from: relayer })

        const leftLongTokenBalanceAfter = await tokenMinter.balanceOf(buyer, longTokenId)
        const rightLongTokenBalanceAfter = await tokenMinter.balanceOf(seller, longTokenId)

        assert.equal(leftLongTokenBalanceBefore, 1, 'Wrong left long token balance before')
        assert.equal(rightLongTokenBalanceBefore, 0, 'Wrong right long token balance before')

        assert.equal(leftLongTokenBalanceAfter, 0, 'Wrong left long token balance after')
        assert.equal(rightLongTokenBalanceAfter, 1, 'Wrong right long token balance after')

        // Buyer balance: 0
        // Seller balance: 1 LONG + 1 SHORT
    })

    it('should successfully swap 1 position right -> left for margin left -> right', async () => {
        await testToken.transfer(buyer, 5000, { from: owner })
        await testToken.approve(tokenSpender.address, 5000, { from: buyer })

        // Buyer balance: 5000 DAI

        const leftOrder = await orderFactory({
            makerTokenId: 0,
            makerTokenAmount: 0,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 5000,

            takerTokenId: shortTokenId,
            takerTokenAmount: 1,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 0,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: buyer,
        })

        const rightOrder = await orderFactory({
            makerTokenId: shortTokenId,
            makerTokenAmount: 1,
            makerMarginAddress: testToken.address,
            makerMarginAmount: 0,

            takerTokenId: 0,
            takerTokenAmount: 0,
            takerMarginAddress: testToken.address,
            takerMarginAmount: 3000,

            nonce: Date.now(),
            expiresAt: derivative.endTime,

            makerAddress: seller,
        })

        const leftShortTokenBalanceBefore = await tokenMinter.balanceOf(buyer, shortTokenId)
        const rightShortTokenBalanceBefore = await tokenMinter.balanceOf(seller, shortTokenId)
        const leftTokenBalanceBefore = await testToken.balanceOf(buyer)
        const rightTokenBalanceBefore = await testToken.balanceOf(seller)

        const gas = await match.swap.estimateGas(leftOrder, rightOrder, { from: relayer })
        console.log('Gas used during swap =', gas)
        await match.swap(leftOrder, rightOrder, { from: relayer })

        const leftShortTokenBalanceAfter = await tokenMinter.balanceOf(buyer, shortTokenId)
        const rightShortTokenBalanceAfter = await tokenMinter.balanceOf(seller, shortTokenId)
        const leftTokenBalanceAfter = await testToken.balanceOf(buyer)
        const rightTokenBalanceAfter = await testToken.balanceOf(seller)

        assert.equal(leftShortTokenBalanceBefore, 0, 'Wrong left short token balance before')
        assert.equal(rightShortTokenBalanceBefore, 1, 'Wrong right short token balance before')
        assert.equal(leftTokenBalanceBefore, 5000, 'Wrong left token balance before')
        assert.equal(rightTokenBalanceBefore, 0, 'Wrong right token balance before')

        assert.equal(leftShortTokenBalanceAfter, 1, 'Wrong left short token balance after')
        assert.equal(rightShortTokenBalanceAfter, 0, 'Wrong right short token balance after')
        assert.equal(leftTokenBalanceAfter, 2000, 'Wrong left token balance after')
        assert.equal(rightTokenBalanceAfter, 3000, 'Wrong right token balance after')
    })
})
