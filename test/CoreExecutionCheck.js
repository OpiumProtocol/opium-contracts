const Core = artifacts.require('Core')
const TestToken = artifacts.require('TestToken')
const EvilSyntheticNormal = artifacts.require('EvilSyntheticNormal')
const TokenSpender = artifacts.require('TokenSpender')

const SyntheticAggregator = artifacts.require('SyntheticAggregator')

const { takeSnapshot, restoreSnapshot } = require('./utils/timeTravel')
const { derivativeFactory, getDerivativeHash } = require('./utils/derivatives')
const { calculateLongTokenId, calculateShortTokenId } = require('./utils/positions')
const { zeroAddress, oneAddress } = require('./utils/addresses')

contract('CoreExecutionCheck', accounts => {
    let executeOne = 'execute(uint256,uint256,(uint256,uint256,uint256[],address,address,address))'

    const [owner, trader1, trader2] = accounts

    let testToken, evilSyntheticNormal, core, syntheticAggregator, tokenSpender

    let derivative, derivativeHash, longTokenId, shortTokenId

    before(async () => {
        // Take a snapshot before running tests
        await takeSnapshot()
        tokenSpender = await TokenSpender.deployed()
        testToken = await TestToken.deployed()
        evilSyntheticNormal = await EvilSyntheticNormal.new()
        core = await Core.deployed()
        syntheticAggregator = await SyntheticAggregator.deployed()

        // Define malicious derivative
        derivative = derivativeFactory({
            oracleId: zeroAddress,
            token: testToken.address,
            syntheticId: evilSyntheticNormal.address
        })
        derivativeHash = getDerivativeHash(derivative)
        longTokenId = calculateLongTokenId(derivativeHash)
        shortTokenId = calculateShortTokenId(derivativeHash)
    })

    after(async () => {
        // Restore snapshot after running tests
        await restoreSnapshot()
    })

    it('should revert cancellation of malicious pooled derivative', async () => {
        // Prepare evil synthetic with margin
        await evilSyntheticNormal.setMargin(100)
        // Set cache
        await syntheticAggregator.isPool(derivativeHash, derivative)

        const bigAmount = 1000e6

        // Send some tokens to fill Core's vault
        await testToken.transfer(core.address, bigAmount)
        await testToken.approve(tokenSpender.address, bigAmount)

        // Create LONG + SHORT
        await core.create(derivative, 1, [ trader1, trader2 ])

        // Execute LONG
        await core.methods[executeOne](longTokenId, 1, derivative, { from: trader1 })

        // Override malicious payout
        await evilSyntheticNormal.overrideBuyerExecutionPayout()

        // Execute short
        await core.methods[executeOne](shortTokenId, 1, derivative, { from: trader2 })

        const trader1Balance = await testToken.balanceOf(trader1)
        const trader2Balance = await testToken.balanceOf(trader2)

        // Check that SHORT didn't get any additional tokens
        assert.equal(+trader1Balance.toString(), 200, 'Buyer balance is wrong')
        assert.equal(+trader2Balance.toString(), 0, 'Seller balance is wrong')
    })
})
