const Core = artifacts.require('Core')
const TestToken = artifacts.require('TestToken')
const EvilSynthetic = artifacts.require('EvilSynthetic')
const SyntheticAggregator = artifacts.require('SyntheticAggregator')

const { takeSnapshot, restoreSnapshot } = require('./utils/timeTravel')
const { derivativeFactory, getDerivativeHash } = require('./utils/derivatives')
const { calculateLongTokenId } = require('./utils/positions')
const { zeroAddress, oneAddress } = require('./utils/addresses')

contract('Core', accounts => {

    const owner = accounts[0]
    const trader = accounts[1]

    let testToken, evilSynthetic, core, syntheticAggregator

    let derivative, derivativeHash, longTokenId

    before(async () => {
        // Take a snapshot before running tests
        await takeSnapshot()

        testToken = await TestToken.deployed()
        evilSynthetic = await EvilSynthetic.new()
        core = await Core.deployed()
        syntheticAggregator = await SyntheticAggregator.deployed()

        // Define malicious derivative
        derivative = derivativeFactory({
            oracleId: oneAddress,
            token: testToken.address,
            syntheticId: evilSynthetic.address
        })
        derivativeHash = getDerivativeHash(derivative)
        longTokenId = calculateLongTokenId(derivativeHash)
    })

    after(async () => {
        // Restore snapshot after running tests
        await restoreSnapshot()
    })

    it('should revert cancellation of malicious pooled derivative', async () => {
        // Prepare evil synthetic
        await evilSynthetic.setMargin(1)
        // Set cache
        await syntheticAggregator.isPool(derivativeHash, derivative)

        // Change evil synthetic
        await evilSynthetic.setMargin(0)

        const bigAmount = 1000e6

        // Send some tokens to fill Core's vault
        await testToken.transfer(core.address, bigAmount)

        await core.create(derivative, 1, [ trader, zeroAddress ])

        // Change evil synthetic margin
        await evilSynthetic.setMargin(bigAmount)

        // Execute evilSynthetic
        try {
            await core.cancel(longTokenId, 1, derivative, { from: trader })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/CORE:INSUFFICIENT_POOL_BALANCE/), 'CORE:INSUFFICIENT_POOL_BALANCE')
        }
    })
})
