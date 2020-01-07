/*
////////////////////////////////////
////                            ////
//// MIGRATIONS FOR PRODUCTION  ////
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

const baseTokenURI = 'https://explorer.opium.network/erc721o/'
const governor = 'SET_GOVERNOR_ADDRESS_HERE'

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

const deployTokenSpender = async ({ deployer, opiumDeployerAddress }) => {
    const tokenSpenderInstance = await deployer.deploy(TokenSpender, governor, { from: opiumDeployerAddress })
    console.log('- TokenSpender was deployed at', tokenSpenderInstance.address)

    console.log('=====================================')
    console.log('=====================================')
    console.log('== !!!SET WHITELIST BY GOVERNOR!!! ==')
    console.log('=====================================')
    console.log('=====================================')

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

module.exports = async function(deployer, network, accounts) {
    const opiumDeployerAddress = accounts[0]

    deployer.then(async () => {
        await deployAndLinkLibPosition({ deployer, opiumDeployerAddress })

        const registryInstance = await deployRegistry({ deployer, opiumDeployerAddress })

        const coreInstance = await deployCore({ deployer, opiumDeployerAddress, registryInstance })
        await deployMatch({ deployer, opiumDeployerAddress, registryInstance })
        await deployMatchPool({ deployer, opiumDeployerAddress, registryInstance })
        await deploySwaprateMatch({ deployer, opiumDeployerAddress, registryInstance })

        const tokenSpenderInstance = await deployTokenSpender({ deployer, opiumDeployerAddress })

        const tokenMinterInstance = await deployTokenMinter({ deployer, opiumDeployerAddress, registryInstance })
        const oracleAggregatorInstance = await deployOracleAggregator({ deployer, opiumDeployerAddress })
        const syntheticAggregatorInstance = await deploySyntheticAggregator({ deployer, opiumDeployerAddress })

        await initializeRegistry({ opiumDeployerAddress, registryInstance, tokenMinterInstance, coreInstance, oracleAggregatorInstance, syntheticAggregatorInstance, tokenSpenderInstance })
    })
}
