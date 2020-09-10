/*
////////////////////////////////////
////                            ////
////    MIGRATIONS FOR TESTS    ////
////                            ////
////////////////////////////////////
*/

const LibPosition = artifacts.require('LibPosition')

const Registry = artifacts.require('Registry')
const Core = artifacts.require('Core')
const SyntheticAggregator = artifacts.require('SyntheticAggregator')
const OracleAggregator = artifacts.require('OracleAggregator')
const TokenMinter = artifacts.require('TokenMinter')
const TokenSpender = artifacts.require('TokenSpender')

const Match = artifacts.require('Match')
const MatchPool = artifacts.require('MatchPool')
const SwaprateMatch = artifacts.require('SwaprateMatch')

// Test helpers
const BalanceHelper = artifacts.require('BalanceHelper')
const PayoutHelper = artifacts.require('PayoutHelper')

// Test mocks
const OptionCallSyntheticIdMock = artifacts.require('OptionCallSyntheticIdMock')
const DummySyntheticIdMock = artifacts.require('DummySyntheticIdMock')
const TestToken = artifacts.require('TestToken')
const WETH = artifacts.require('WETH')

const baseTokenURI = 'https://explorer.opium.network/erc721o/'

// Deployment functions
const deployAndLinkLibPosition = async ({ deployer, opiumDeployerAddress }) => {
    const libPositionInstance = await deployer.deploy(LibPosition, { from: opiumDeployerAddress })

    console.log('LibPosition was deployed at', libPositionInstance.address)

    await deployer.link(LibPosition, [
        Core,
        TokenMinter,

        Match,
        MatchPool,
        SwaprateMatch
    ])

    console.log('LibPosition was linked to Core, TokenMinter, Match, MatchPool and SwaprateMatch')

    return libPositionInstance
}

const deployRegistry = async ({ deployer, opiumDeployerAddress }) => {
    const registryInstance = await deployer.deploy(Registry, { from: opiumDeployerAddress })
    console.log('Registry was deployed at', registryInstance.address)

    return registryInstance
}

const deployCore = async ({ deployer, opiumDeployerAddress, registryInstance }) => {
    const coreInstance = await deployer.deploy(Core, registryInstance.address, { from: opiumDeployerAddress })
    console.log('- Core was deployed at', coreInstance.address)

    return coreInstance
}

const deployMatch = async ({ deployer, opiumDeployerAddress, registryInstance }) => {
    const matchInstance = await deployer.deploy(Match, registryInstance.address, { from: opiumDeployerAddress })
    console.log('- Match was deployed at', matchInstance.address)

    return matchInstance
}

const deployMatchPool = async ({ deployer, opiumDeployerAddress, registryInstance }) => {
    const matchPoolInstance = await deployer.deploy(MatchPool, registryInstance.address, { from: opiumDeployerAddress })
    console.log('- MatchPool was deployed at', matchPoolInstance.address)

    return matchPoolInstance
}

const deploySwaprateMatch = async ({ deployer, opiumDeployerAddress, registryInstance }) => {
    const swaprateMatchInstance = await deployer.deploy(SwaprateMatch, registryInstance.address, { from: opiumDeployerAddress })
    console.log('- SwaprateMatch was deployed at', swaprateMatchInstance.address)

    return swaprateMatchInstance
}

const deployTokenSpender = async ({ deployer, opiumDeployerAddress, governor, whitelist }) => {
    const tokenSpenderInstance = await deployer.deploy(TokenSpender, governor, { from: opiumDeployerAddress })
    console.log('- TokenSpender was deployed at', tokenSpenderInstance.address)

    await tokenSpenderInstance.proposeWhitelist(whitelist, { from: governor })
    console.log('TokenSpender whitelist was set')

    return tokenSpenderInstance
}

const deployTokenMinter = async ({ deployer, opiumDeployerAddress, registryInstance }) => {
    const tokenMinterInstance = await deployer.deploy(TokenMinter, baseTokenURI, registryInstance.address, { from: opiumDeployerAddress })
    console.log('- TokenMinter was deployed at', tokenMinterInstance.address)

    return tokenMinterInstance
}

const deployOracleAggregator = async ({ deployer, opiumDeployerAddress }) => {
    const oracleAggregatorInstance = await deployer.deploy(OracleAggregator, { from: opiumDeployerAddress })
    console.log('- OracleAggregator was deployed at', oracleAggregatorInstance.address)

    return oracleAggregatorInstance
}

const deploySyntheticAggregator = async ({ deployer, opiumDeployerAddress }) => {
    const syntheticAggregatorInstance = await deployer.deploy(SyntheticAggregator, { from: opiumDeployerAddress })
    console.log('- SyntheticAggregator was deployed at', syntheticAggregatorInstance.address)

    return syntheticAggregatorInstance
}

const initializeRegistry = async ({ opiumDeployerAddress, registryInstance, tokenMinterInstance, coreInstance, oracleAggregatorInstance, syntheticAggregatorInstance, tokenSpenderInstance }) => {
    await registryInstance.init(
        tokenMinterInstance.address,
        coreInstance.address,
        oracleAggregatorInstance.address,
        syntheticAggregatorInstance.address,
        tokenSpenderInstance.address,
        opiumDeployerAddress,
        { from: opiumDeployerAddress }
    )
    console.log('Registry was initialized')
}

const deployMocks = async ({ deployer, opiumDeployerAddress }) => {
    const optionCallSyntheticIdMockInstance = await deployer.deploy(OptionCallSyntheticIdMock, { from: opiumDeployerAddress })
    console.log('**** OptionCallSyntheticIdMock was deployed at', optionCallSyntheticIdMockInstance.address)

    const dummySyntheticIdMockInstance = await deployer.deploy(DummySyntheticIdMock, { from: opiumDeployerAddress })
    console.log('**** DummySyntheticIdMock was deployed at', dummySyntheticIdMockInstance.address)

    const daiInstance = await deployer.deploy(TestToken, 'Opium DAI Token', 'DAI', 18, { from: opiumDeployerAddress })
    console.log('**** DAI was deployed at', daiInstance.address)

    const wethInstance = await deployer.deploy(WETH, { from: opiumDeployerAddress })
    console.log('**** WETH was deployed at', wethInstance.address)
}

const deployHelpers = async ({ deployer, opiumDeployerAddress }) => {
    const balanceHelperInstance = await deployer.deploy(BalanceHelper, { from: opiumDeployerAddress })
    console.log('**** BalanceHelper was deployed at', balanceHelperInstance.address)

    const payoutHelperInstance = await deployer.deploy(PayoutHelper, { from: opiumDeployerAddress })
    console.log('**** PayoutHelper was deployed at', payoutHelperInstance.address)
}

module.exports = async function(deployer, network, accounts) {
    const opiumDeployerAddress = accounts[0]

    deployer.then(async () => {
        await deployAndLinkLibPosition({ deployer, opiumDeployerAddress })

        const registryInstance = await deployRegistry({ deployer, opiumDeployerAddress })

        const coreInstance = await deployCore({ deployer, opiumDeployerAddress, registryInstance })
        const matchInstance = await deployMatch({ deployer, opiumDeployerAddress, registryInstance })
        const matchPoolInstance = await deployMatchPool({ deployer, opiumDeployerAddress, registryInstance })
        const swaprateMatchInstance = await deploySwaprateMatch({ deployer, opiumDeployerAddress, registryInstance })

        const governor = opiumDeployerAddress
        const whitelist = [ coreInstance.address, matchInstance.address, matchPoolInstance.address, swaprateMatchInstance.address ]
        const tokenSpenderInstance = await deployTokenSpender({ deployer, opiumDeployerAddress, governor, whitelist })

        const tokenMinterInstance = await deployTokenMinter({ deployer, opiumDeployerAddress, registryInstance })
        const oracleAggregatorInstance = await deployOracleAggregator({ deployer, opiumDeployerAddress })
        const syntheticAggregatorInstance = await deploySyntheticAggregator({ deployer, opiumDeployerAddress })

        await initializeRegistry({ opiumDeployerAddress, registryInstance, tokenMinterInstance, coreInstance, oracleAggregatorInstance, syntheticAggregatorInstance, tokenSpenderInstance })

        // Contracts for testing purpose
        await deployMocks({ deployer, opiumDeployerAddress })

        await deployHelpers({ deployer, opiumDeployerAddress })
    })
}
