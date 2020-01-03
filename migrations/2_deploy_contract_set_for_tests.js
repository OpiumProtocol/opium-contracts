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
const SwaprateMatch = artifacts.require('SwaprateMatch')

// Test helpers
const OptionCallSyntheticIdMock = artifacts.require('OptionCallSyntheticIdMock')
const DummySyntheticIdMock = artifacts.require('DummySyntheticIdMock')
const TestToken = artifacts.require('TestToken')
const WETH = artifacts.require('WETH')

const baseTokenURI = 'https://explorer.opium.network/erc721o/'

module.exports = async function(deployer, network, accounts) {
    const owner = accounts[0]

    let libPosition

    let registry, core, tokenMinter, oracleAggregator, syntheticAggregator, tokenSpender

    let match, swaprateMatch
    
    let optionCallSyntheticIdMock, dummySyntheticIdMock
    let dai
    let weth

    deployer.deploy(LibPosition, { from: owner })
        .then(instance => {
            libPosition = instance
            console.log('LibPosition was deployed at', libPosition.address)
            return deployer.link(LibPosition, [
                Core,
                TokenMinter,

                Match,
                SwaprateMatch
            ])
        })
        .then(() => {
            return deployer
                .deploy(Registry, { from: owner })
                .then(instance => {
                    registry = instance
                    console.log('Registry was deployed at', registry.address)
                })
        })
        .then(() => {
            return deployer
                .deploy(Core, registry.address, { from: owner })
                .then(instance => {
                    core = instance
                    console.log('- Core was deployed at', core.address)
                    return registry.setCore(core.address, { from: owner })
                })
        })
        .then(() => {
            return deployer
                .deploy(Match, registry.address, { from: owner })
                .then(instance => {
                    match = instance
                    console.log('- Match was deployed at', match.address)
                })
        })
        .then(() => {
            return deployer
                .deploy(SwaprateMatch, registry.address, { from: owner })
                .then(instance => {
                    swaprateMatch = instance
                    console.log('- SwaprateMatch was deployed at', swaprateMatch.address)
                })
        })
        .then(() => {
            return deployer
                .deploy(TokenSpender, owner, { from: owner })
                .then(instance => {
                    tokenSpender = instance
                    console.log('- TokenSpender was deployed at', tokenSpender.address)
                    return tokenSpender.proposeWhitelist([ core.address, match.address, swaprateMatch.address ], { from: owner })
                })
        })
        .then(() => {
            return registry.setTokenSpender(tokenSpender.address, { from: owner })
        })
        .then(() => {
            return deployer
                .deploy(TokenMinter, baseTokenURI, registry.address, { from: owner })
                .then(instance => {
                    tokenMinter = instance
                    console.log('- TokenMinter was deployed at', tokenMinter.address)
                    return registry.setMinter(tokenMinter.address, { from: owner })
                })
        })
        .then(() => {
            return deployer
                .deploy(OracleAggregator, { from: owner })
                .then(instance => {
                    oracleAggregator = instance
                    console.log('- OracleAggregator was deployed at', oracleAggregator.address)
                    return registry.setOracleAggregator(oracleAggregator.address, { from: owner })
                })
        })
        .then(() => {
            return deployer
                .deploy(SyntheticAggregator, { from: owner })
                .then(instance => {
                    syntheticAggregator = instance
                    console.log('- SyntheticAggregator was deployed at', syntheticAggregator.address)
                    return registry.setSyntheticAggregator(syntheticAggregator.address, { from: owner })
                })
        })
        .then(() => {
            return deployer
                .deploy(OptionCallSyntheticIdMock, { from: owner })
                .then(instance => {
                    optionCallSyntheticIdMock = instance
                    console.log('OptionCallSyntheticIdMock was deployed at', optionCallSyntheticIdMock.address)
                })
        })
        .then(() => {
            return deployer
                .deploy(DummySyntheticIdMock, { from: owner })
                .then(instance => {
                    dummySyntheticIdMock = instance
                    console.log('DummySyntheticIdMock was deployed at', dummySyntheticIdMock.address)
                })
        })
        .then(() => {
            return deployer
                .deploy(TestToken, 'Opium DAI Token', 'DAI', 18, { from: owner })
                .then(instance => {
                    dai = instance
                    console.log('DAI was deployed at', dai.address)
                })
        })
        .then(() => {
            return deployer
                .deploy(WETH, { from: owner })
                .then(instance => {
                    weth = instance
                    console.log('WETH was deployed at', weth.address)
                })
        })
        .then(() => {
            return registry.setOpiumAddress(owner, { from: owner })
        })
}
