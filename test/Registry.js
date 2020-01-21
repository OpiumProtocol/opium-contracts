const Registry = artifacts.require('Registry')
const TokenMinter = artifacts.require('TokenMinter')
const Core = artifacts.require('Core')
const OracleAggregator = artifacts.require('OracleAggregator')
const SyntheticAggregator = artifacts.require('SyntheticAggregator')
const TokenSpender = artifacts.require('TokenSpender')

contract('Registry', accounts => {

    const owner = accounts[0]
    const opiumAddress = accounts[1]
    const thirdPartyAddress = accounts[2]

    let registry, core, tokenMinter, oracleAggregator, syntheticAggregator, tokenSpender

    before(async () => {
        registry = await Registry.new({ from: owner })
        tokenMinter = await TokenMinter.deployed()
        core = await Core.deployed()
        oracleAggregator = await OracleAggregator.deployed()
        syntheticAggregator = await SyntheticAggregator.deployed()
        syntheticAggregator = await SyntheticAggregator.deployed()
        tokenSpender = await TokenSpender.deployed()
    })

    it('should revert for non initializer address', async () => {
        try {
            await registry.init(
                tokenMinter.address,
                core.address,
                oracleAggregator.address,
                syntheticAggregator.address,
                tokenSpender.address,
                opiumAddress,
                { from: thirdPartyAddress }
            )
            throw null
        } catch (e) {
            assert.ok(e.message.match(/REGISTRY:ONLY_INITIALIZER/), 'REGISTRY:ONLY_INITIALIZER')
        }
    })

    // Validation

    it('should successfully initialize', async () => {
        await registry.init(
            tokenMinter.address,
            core.address,
            oracleAggregator.address,
            syntheticAggregator.address,
            tokenSpender.address,
            opiumAddress,
            { from: owner }
        )
    })

    it('should revert secondary call try', async () => {
        try {
            await registry.init(
                tokenMinter.address,
                core.address,
                oracleAggregator.address,
                syntheticAggregator.address,
                tokenSpender.address,
                opiumAddress,
                { from: owner }
            )
            throw null
        } catch (e) {
            assert.ok(e.message.match(/REGISTRY:ALREADY_SET/), 'REGISTRY:ALREADY_SET')
        }
    })

    it('should correctly get core address', async () => {
        const result = await registry.getCore()
        assert.equal(core.address, result, 'Core address does not match')
    })

    it('should correctly get token minter address', async () => {
        const result = await registry.getMinter()
        assert.equal(tokenMinter.address, result, 'Minter address does not match')
    })

    it('should correctly get oracle aggregator address', async () => {
        const result = await registry.getOracleAggregator()
        assert.equal(oracleAggregator.address, result, 'OracleAggregator address does not match')
    })

    it('should correctly get synthetic aggregator address', async () => {
        const result = await registry.getSyntheticAggregator()
        assert.equal(syntheticAggregator.address, result, 'SyntheticAggregator address does not match')
    })

    it('should correctly get token spender address', async () => {
        const result = await registry.getTokenSpender()
        assert.equal(tokenSpender.address, result, 'TokenSpender address does not match')
    })

    it('should correctly return opium address', async () => {
        const result = await registry.getOpiumAddress()
        assert.equal(result, opiumAddress, 'Opium address does not match')
    })

    // change validation + change success
})
