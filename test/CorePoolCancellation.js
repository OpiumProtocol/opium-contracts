const Core = artifacts.require('Core')
const TestToken = artifacts.require('TestToken')
const EvilSynthetic = artifacts.require('EvilSynthetic')
const TokenSpender = artifacts.require('TokenSpender')

const SyntheticAggregator = artifacts.require('SyntheticAggregator')

const { takeSnapshot, restoreSnapshot } = require('./utils/timeTravel')
const { derivativeFactory, getDerivativeHash } = require('./utils/derivatives')
const { calculateLongTokenId, calculateShortTokenId } = require('./utils/positions')
const { zeroAddress, oneAddress } = require('./utils/addresses')

contract('Core', accounts => {
    let executeOne = 'execute(uint256,uint256,(uint256,uint256,uint256[],address,address,address))'

    const [owner, trader1, trader2] = accounts

    let testToken, evilSynthetic, core, syntheticAggregator, tokenSpender

    let derivative, derivativeHash, longTokenId, shortTokenId

    before(async () => {
        // Take a snapshot before running tests
        await takeSnapshot()
        tokenSpender = await TokenSpender.deployed()
        testToken = await TestToken.deployed()
        evilSynthetic = await EvilSynthetic.new()
        core = await Core.deployed()
        syntheticAggregator = await SyntheticAggregator.deployed()

        // Define malicious derivative
        derivative = derivativeFactory({
            oracleId: zeroAddress,
            token: testToken.address,
            syntheticId: evilSynthetic.address
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
        // Prepare evil synthetic
        await evilSynthetic.setMargin(100)
        // Set cache
        await syntheticAggregator.isPool(derivativeHash, derivative)
        const result = await syntheticAggregator.isPool.call(derivativeHash, derivative)
        console.log('result: ', result)
        const bigAmount = 1000e6

        // Send some tokens to fill Core's vault
        await testToken.transfer(core.address, bigAmount)
        await testToken.approve(tokenSpender.address, bigAmount, {from: owner})
        await core.create(derivative, 1, [ trader1, trader2 ])
        console.log(derivative)
        await core.methods[executeOne](longTokenId, 1, derivative, { from: trader1})
        await evilSynthetic.overrideBuyerExecutionPayout()
        await core.methods[executeOne](shortTokenId, 1, derivative, { from: trader2})
        const after = await evilSynthetic.getExecutionPayout(derivative, 1)
        console.log('after ', after )
        const trader1Balance = await testToken.balanceOf(trader1)
        const trader2Balance = await testToken.balanceOf(trader2)

        console.log('trader1Balance ', trader1Balance.toString())
        console.log('trader2Balance ', trader2Balance.toString())
    })
})
