const Core = artifacts.require('Core')
const TestToken = artifacts.require('TestToken')
const EvilSyntheticNormal = artifacts.require('EvilSyntheticNormal')
const TokenSpender = artifacts.require('TokenSpender')
const OracleIdMock = artifacts.require('OracleIdMock')
const OracleAggregator = artifacts.require('OracleAggregator')

const SyntheticAggregator = artifacts.require('SyntheticAggregator')

const { takeSnapshot, restoreSnapshot, timeTravel } = require('./utils/timeTravel')
const { derivativeFactory, getDerivativeHash } = require('./utils/derivatives')
const { calculateLongTokenId, calculateShortTokenId } = require('./utils/positions')
const { zeroAddress, oneAddress } = require('./utils/addresses')

contract('CoreExecutionCheck', accounts => {
    const executeOne = 'execute(uint256,uint256,(uint256,uint256,uint256[],address,address,address))'
    const SECONDS_40_MINS = 60 * 40

    const [owner, trader1, trader2, oracle] = accounts

    let testToken, evilSyntheticNormal, core, syntheticAggregator, tokenSpender, oracleIdMock, oracleAggregator

    const test = async(x, y, errorMessage) => {
        assert.equal(+x.toString(), +y.toString(), errorMessage)
    }

    beforeEach(async () => {
        // Take a snapshot before running tests
        await takeSnapshot()
        oracleAggregator = await OracleAggregator.deployed()
        oracleIdMock = await OracleIdMock.deployed()
        tokenSpender = await TokenSpender.deployed()
        core = await Core.deployed()
        syntheticAggregator = await SyntheticAggregator.deployed()

        evilSyntheticNormal = await EvilSyntheticNormal.new()
        // deploy new test token for each test to have clean balances
        testToken = await TestToken.new('Opium DAI Token', 'DAI', 18)

    })

    after(async () => {
        // Restore snapshot after running tests
        await restoreSnapshot()
    })

    it('should distribute the cached payouts', async () => {
        // Define malicious dummyDerivative
        const dummyDerivative = derivativeFactory({
            oracleId: zeroAddress,
            token: testToken.address,
            syntheticId: evilSyntheticNormal.address
        })
        const dummyDerivativeHash = getDerivativeHash(dummyDerivative)
        const longTokenId = calculateLongTokenId(dummyDerivativeHash)
        const shortTokenId = calculateShortTokenId(dummyDerivativeHash)
        // Prepare evil synthetic with margin
        await evilSyntheticNormal.setMargin(100)
        // Set cache
        await syntheticAggregator.isPool(dummyDerivativeHash, dummyDerivative)

        const bigAmount = 1000e6

        // Send some tokens to fill Core's vault
        await testToken.transfer(core.address, bigAmount)
        await testToken.approve(tokenSpender.address, bigAmount)

        // Create LONG + SHORT
        await core.create(dummyDerivative, 1, [ trader1, trader2 ])
        // ensures that the balance of p2pVault is equal to the derivative's margin
        test(await core.p2pVaults(dummyDerivativeHash), 200, 'wrong p2p vault balance')
        // Execute LONG
        await core.methods[executeOne](longTokenId, 1, dummyDerivative, { from: trader1 })
        // saves the cached buyer/seller payouts after the first execution
        const cachedBuyerPayout = await core.derivativePayouts(dummyDerivativeHash, 0)
        const cachedSellerPayout = await core.derivativePayouts(dummyDerivativeHash, 1)

        // Override malicious payout
        await evilSyntheticNormal.overrideBuyerExecutionPayout()
        // ensures the cached buyer/seller payouts are the same after the evil synthetic overrides its payout function
        await test(await core.derivativePayouts(dummyDerivativeHash, 0), cachedBuyerPayout, 'wrong buyer payout')
        await test(await core.derivativePayouts(dummyDerivativeHash, 1), cachedSellerPayout, 'wrong seller payout')

        // Execute short
        await core.methods[executeOne](shortTokenId, 1, dummyDerivative, { from: trader2 })

        // ensures the consistency of the the buyer/seller payouts after the second execution
        await test(await core.derivativePayouts(dummyDerivativeHash, 0), cachedBuyerPayout, 'wrong buyer payout')
        await test(await core.derivativePayouts(dummyDerivativeHash, 1), cachedSellerPayout, 'wrong seller payout')
        test(await core.p2pVaults(dummyDerivativeHash), 0, 'wrong p2p vault balance')

        const trader1Balance = await testToken.balanceOf(trader1)
        const trader2Balance = await testToken.balanceOf(trader2)

        // Check that SHORT didn't get any additional tokens
        assert.equal(+trader1Balance.toString(), 200, 'Buyer balance is wrong')
        assert.equal(+trader2Balance.toString(), 0, 'Seller balance is wrong')
    })

    it("should should distribute the cached payouts", async() => {
        // Define malicious derivative
        const derivative = derivativeFactory({
            oracleId: oracle,
            token: testToken.address,
            syntheticId: evilSyntheticNormal.address,
            endTime: ~~(Date.now() / 1000) + SECONDS_40_MINS,
            params: [100]
        })
        const derivativeHash = getDerivativeHash(derivative)
        const longTokenId = calculateLongTokenId(derivativeHash)
        const shortTokenId = calculateShortTokenId(derivativeHash)

        await evilSyntheticNormal.setMargin(100)

        const bigAmount = 1000e6
        // Send some tokens to fill Core's vault
        await testToken.transfer(core.address, bigAmount)
        await testToken.approve(tokenSpender.address, bigAmount)

        // Create LONG + SHORT
        await core.create(derivative, 1, [ trader1, trader2 ])
        // ensures that the balance of p2pVault is equal to the derivative's margin
        test(await core.p2pVaults(derivativeHash), 200, 'wrong p2p vault balance')
        await timeTravel(SECONDS_40_MINS + 1000)
        await oracleAggregator.__callback(derivative.endTime, 120, { from: oracle })

        // Execute LONG
        await core.methods[executeOne](longTokenId, 1, derivative, { from: trader1 })
        // saves the cached buyer/seller payouts after the first execution
        const cachedBuyerPayout = await core.derivativePayouts(derivativeHash, 0)
        const cachedSellerPayout = await core.derivativePayouts(derivativeHash, 1)

        test(await core.p2pVaults(derivativeHash), 0, 'wrong p2p vault balance')

        // Override malicious payout
        await evilSyntheticNormal.overrideBuyerExecutionPayout()
        // ensures the cached buyer/seller payouts are the same after the evil synthetic overrides its payout function
        await test(await core.derivativePayouts(derivativeHash, 0), cachedBuyerPayout, 'wrong buyer payout')
        await test(await core.derivativePayouts(derivativeHash, 1), cachedSellerPayout, 'wrong seller payout')

        // Execute short
        await core.methods[executeOne](shortTokenId, 1, derivative, { from: trader2 })
        // ensures the consistency of the the buyer/seller payouts after the second execution
        await test(await core.derivativePayouts(derivativeHash, 0), cachedBuyerPayout, 'wrong buyer payout')
        await test(await core.derivativePayouts(derivativeHash, 1), cachedSellerPayout, 'wrong seller payout')
        test(await core.p2pVaults(derivativeHash), 0, 'wrong p2p vault balance')

        const trader1Balance = await testToken.balanceOf(trader1)
        const trader2Balance = await testToken.balanceOf(trader2)
        console.log(`trader1Balance: ${trader1Balance}`)
        console.log(`trader2Balance: ${trader2Balance}`)

        // Check that SHORT didn't get any additional tokens
        test(await core.p2pVaults(derivativeHash), 0, 'wrong p2p vault balance')
        test(trader1Balance, 200, 'wrong p2p vault balance')
        test(trader2Balance, 0, 'Seller balance is wrong')
    })
})
