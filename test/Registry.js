const Registry = artifacts.require('Registry')
const Core = artifacts.require('Core')
const TokenMinter = artifacts.require('TokenMinter')
const OracleAggregator = artifacts.require('OracleAggregator')
const SyntheticAggregator = artifacts.require('SyntheticAggregator')

contract('Registry', accounts => {

    const owner = accounts[0]
    const opiumAddress = accounts[1]
    const thirdPartyAddress = accounts[2]

    let registry, core, tokenMinter, oracleAggregator, syntheticAggregator

    before(async () => {
        registry = await Registry.new()
        core = await Core.deployed()
        tokenMinter = await TokenMinter.deployed()
        oracleAggregator = await OracleAggregator.deployed()
        syntheticAggregator = await SyntheticAggregator.deployed()
    })

    it('should revert for non initializer address', async () => {
        try {
            await registry.setCore(core.address, { from: thirdPartyAddress })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/REGISTRY:ONLY_INITIALIZER/), 'REGISTRY:ONLY_INITIALIZER')
        }
    })

    it('should correctly set core address', async () => {
        await registry.setCore(core.address, { from: owner })
        const result = await registry.getCore()
        assert.equal(core.address, result, 'Core address does not match')
    })

    it('should revert secondary call try', async () => {
        try {
            await registry.setCore(core.address, { from: owner })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/REGISTRY:ALREADY_SET/), 'REGISTRY:ALREADY_SET')
        }
    })

    it('should correctly set token minter address', async () => {
        await registry.setMinter(tokenMinter.address, { from: owner })
        const result = await registry.getMinter()
        assert.equal(tokenMinter.address, result, 'Minter address does not match')
    })

    it('should correctly set oracle aggregator address', async () => {
        await registry.setOracleAggregator(oracleAggregator.address, { from: owner })
        const result = await registry.getOracleAggregator()
        assert.equal(oracleAggregator.address, result, 'OracleAggregator address does not match')
    })

    it('should correctly set synthetic aggregator address', async () => {
        await registry.setSyntheticAggregator(syntheticAggregator.address, { from: owner })
        const result = await registry.getSyntheticAggregator()
        assert.equal(syntheticAggregator.address, result, 'SyntheticAggregator address does not match')
    })

    it('should correctly set opium address', async () => {
        await registry.setOpiumAddress(opiumAddress, { from: owner })
        const result = await registry.getOpiumAddress()
        assert.equal(result, opiumAddress, 'Opium address does not match')
    })
})
