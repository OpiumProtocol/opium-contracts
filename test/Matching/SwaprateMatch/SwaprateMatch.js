const SwaprateMatch = artifacts.require('SwaprateMatch')
const TestToken = artifacts.require('TestToken')
const DummySyntheticIdMock = artifacts.require('DummySyntheticIdMock')
const TokenSpender = artifacts.require('TokenSpender')
const WETH = artifacts.require('WETH')

const { zeroAddress } = require('../../utils/addresses')
const { derivativeFactory } = require('../../utils/derivatives')
const swaprateOrders = require('../../utils/swaprateOrders')

contract('SwaprateMatch', accounts => {
    const owner = accounts[0]
    const relayer = accounts[1]
    const buyer = accounts[2]
    const seller = accounts[3]

    let swaprateMatch, testToken, syntheticIdMock, tokenSpender, weth

    let derivative

    let orderFactory, commonOrder

    const big = amount => web3.utils.toWei(amount.toString(), 'ether')

    const big200 = big(200)
    const big05 = big(0.5)

    before(async () => {
        swaprateMatch = await SwaprateMatch.deployed()
        testToken = await TestToken.deployed()
        syntheticIdMock = await DummySyntheticIdMock.deployed()
        tokenSpender = await TokenSpender.deployed()
        weth = await WETH.deployed()

        derivative = derivativeFactory({
            margin: big200, // 200 tokens
            endTime: ~~(Date.now() / 1000) + 60 * 10, // + 10 mins
            params: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // strikePrice
            oracleId: zeroAddress,
            token: testToken.address,
            syntheticId: syntheticIdMock.address
        })

        orderFactory = order => swaprateOrders.orderFactory({
            order,
            relayer,
            match: swaprateMatch,
        })

        commonOrder = (order) => orderFactory({
            syntheticId: derivative.syntheticId,
            oracleId: derivative.oracleId,
            token: derivative.token,
            endTime: derivative.endTime,
            ...order
        })
    })

    it('should successfully settle order with WETH fee to relayer', async () => {
        // Deposit 0.5 eth to WETH to obtain WETH tokens
        await web3.eth.sendTransaction({
            from: buyer,
            to: WETH.address,
            value: big05
        })
        await weth.approve(tokenSpender.address, big05, { from: buyer })

        // Give buyer and seller enough tokens for trade
        await testToken.transfer(buyer, big200, { from: owner })
        await testToken.transfer(seller, big200, { from: owner })

        await testToken.approve(tokenSpender.address, big200, { from: buyer })
        await testToken.approve(tokenSpender.address, big200, { from: seller })

        const relayerFeeBalanceBefore = await swaprateMatch.balances.call(relayer, weth.address)

        const leftOrder = await commonOrder({
            makerAddress: buyer,

            feeTokenAddress: weth.address,

            quantity: 1,
            partialFill: 1,

            relayerFee: big05,
        })

        const rightOrder = await commonOrder({
            makerAddress: seller,

            quantity: 1,
            partialFill: 1,
        })

        await swaprateMatch.create(leftOrder, rightOrder, derivative, { from: relayer })
    
        const relayerFeeBalanceAfter = await swaprateMatch.balances.call(relayer, weth.address)

        assert.equal(relayerFeeBalanceBefore, 0, 'Relayer fee balance before is wrong')
        assert.equal(relayerFeeBalanceAfter, big05, 'Relayer fee balance after is wrong')
    })

    it('should successfully withdraw relayer fee', async () => {
        const relayerFeeBalanceBefore = await swaprateMatch.balances.call(relayer, weth.address)
        const relayerWETHBalanceBefore = await weth.balanceOf(relayer)

        await swaprateMatch.withdraw(weth.address, { from: relayer })

        const relayerFeeBalanceAfter = await swaprateMatch.balances.call(relayer, weth.address)
        const relayerWETHBalanceAfter = await weth.balanceOf(relayer)

        assert.equal(relayerFeeBalanceBefore, big05, 'Relayer fee balance before is wrong')
        assert.equal(relayerFeeBalanceAfter, 0, 'Relayer fee balance after is wrong')

        assert.equal(relayerWETHBalanceBefore, 0, 'Relayer WETH balance before is wrong')
        assert.equal(relayerWETHBalanceAfter, big05, 'Relayer WETH balance after is wrong')
    })
})
