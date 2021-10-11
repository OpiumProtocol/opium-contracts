/*
/////////////////////////////////////////////////
////                                         ////
//// MIGRATIONS FOR PRODUCTION: CORE UPGRADE ////
////                                         ////
/////////////////////////////////////////////////
*/

const LibPosition = artifacts.require('LibPosition')

const Registry = artifacts.require('Registry')
const Core = artifacts.require('Core')
const TokenMinter = artifacts.require('TokenMinter')

const Match = artifacts.require('Match')
const SwaprateMatch = artifacts.require('SwaprateMatch')

const baseTokenURI = 'https://explorer.opium.network/erc721o/'
let governor = '0x964C04B87D14dF4aa74169874C4B15A87EED360d'

const libPositionAddress = '0xd85De2Eb815eF57c84531Bc2397407B18E62C9d7'
const oracleAggregatorAddress = '0x56c54b408c44B12f6c9219C9c73Fcda4E783FC20'
const syntheticAggregatorAddress = '0xC955F3c0d5a87710996D13B1f9AA3A77552D7a7E'
const tokenSpenderAddress = '0xC7b068B897507312c2DACEd5E537eB658c49608D'

// DEPLOYED
const registryAddress = '0x1213b2951B48a39981801e059223827ce4182354'
const coreAddress = '0xB3F6281655276150E97e5029B607a6D4d2E21972'
const tokenMinterAddress = '0x880e37B98f7c058b3563970F256614FF4a580637'
const matchingAddress = 'NOT USED ATM on POLYGON'
const swaprateMatchingAddress = 'NOT USED ATM on POLYGON'

// Deployment functions
const deployAndLinkLibPosition = async ({ deployer }) => {
    /**
     * To add existing library:
     * 1) Compile it
     * 2) Add this to compiledJson.network
      
      "1": {
        "events": {},
        "links": {},
        "address": "0x56c54b408c44B12f6c9219C9c73Fcda4E783FC20",
        "transactionHash": "0x68fb7031a2f0dd7c070121b5148c965d101481a3ee8f94a9756658acaf598ae1"
      }
     */

    const libPositionInstance = await LibPosition.at(libPositionAddress)

    console.log('LibPosition was deployed at', libPositionInstance.address)

    await deployer.link(LibPosition, [
        Core,
        TokenMinter,

        Match,
        SwaprateMatch
    ])

    console.log('LibPosition was linked to Core, TokenMinter, Match, MatchPool and SwaprateMatch')

    return libPositionInstance
}

const deployRegistry = async ({ deployer, opiumDeployerAddress }) => {
    const registryInstance = await deployer.deploy(Registry, { from: opiumDeployerAddress, chainId: 137 })
    console.log('Registry was deployed at', registryInstance.address)

    return registryInstance
}

const deployCore = async ({ deployer, opiumDeployerAddress, registryInstance }) => {
    const coreInstance = await deployer.deploy(Core, registryInstance.address, { from: opiumDeployerAddress, chainId: 137 })
    console.log('- Core was deployed at', coreInstance.address)

    return coreInstance
}

// const deployMatch = async ({ deployer, opiumDeployerAddress, registryInstance }) => {
//     const matchInstance = await deployer.deploy(Match, registryInstance.address, { from: opiumDeployerAddress })
//     console.log('- Match was deployed at', matchInstance.address)

//     return matchInstance
// }

// const deploySwaprateMatch = async ({ deployer, opiumDeployerAddress, registryInstance }) => {
//     const swaprateMatchInstance = await deployer.deploy(SwaprateMatch, registryInstance.address, { from: opiumDeployerAddress })
//     console.log('- SwaprateMatch was deployed at', swaprateMatchInstance.address)

//     return swaprateMatchInstance
// }

const deployTokenMinter = async ({ deployer, opiumDeployerAddress, registryInstance }) => {
    const tokenMinterInstance = await deployer.deploy(TokenMinter, baseTokenURI, registryInstance.address, { from: opiumDeployerAddress, chainId: 137 })
    console.log('- TokenMinter was deployed at', tokenMinterInstance.address)

    return tokenMinterInstance
}

const initializeRegistry = async ({ opiumDeployerAddress, tokenMinterInstance, coreInstance, registryInstance }) => {
    // const registryInstance = await Registry.at(registryAddress)
    await registryInstance.init(
        tokenMinterInstance.address,
        coreInstance.address,
        oracleAggregatorAddress,
        syntheticAggregatorAddress,
        tokenSpenderAddress,
        governor,
        { from: opiumDeployerAddress, chainId: 137 }
    )
    console.log('Registry was initialized')
    console.log('Opium Commission Address = ', governor)
}

module.exports = async function(deployer, network, accounts) {
    if (network.indexOf('rinkeby') === 0) {
        governor = '0x2083fC00Ad9a17B9073b10B520Dcf936a14eaA05'
    }

    const opiumDeployerAddress = '0xe068647CDDBd46BD762aA8083D6e607C53675BD4'
    console.log('Opium deployer address: ', opiumDeployerAddress)

    deployer.then(async () => {
        console.log('=====================================')
        console.log('=====================================')
        console.log('====== !!!CHANGE ADDRESSES!!! =======')
        console.log('=====================================')
        console.log('=====================================')

        await deployAndLinkLibPosition({ deployer })

        const registryInstance = await deployRegistry({ deployer, opiumDeployerAddress })

        const coreInstance = await deployCore({ deployer, opiumDeployerAddress, registryInstance })
        // const coreInstance = await deployCore({ deployer, opiumDeployerAddress, registryInstance: { address: registryAddress } })
        // await deployMatch({ deployer, opiumDeployerAddress, registryInstance })
        // await deployMatch({ deployer, opiumDeployerAddress, registryInstance: { address: registryAddress } })
        // await deploySwaprateMatch({ deployer, opiumDeployerAddress, registryInstance })
        // await deploySwaprateMatch({ deployer, opiumDeployerAddress, registryInstance: { address: registryAddress } })

        const tokenMinterInstance = await deployTokenMinter({ deployer, opiumDeployerAddress, registryInstance })
        // const tokenMinterInstance = await deployTokenMinter({ deployer, opiumDeployerAddress, registryInstance: { address: registryAddress } })

        await initializeRegistry({ opiumDeployerAddress, tokenMinterInstance, coreInstance, registryInstance })
        // await initializeRegistry({ opiumDeployerAddress, tokenMinterInstance: { address: tokenMinterAddress }, coreInstance: { address: coreAddress } })


        console.log('=====================================')
        console.log('=====================================')
        console.log('== !!!SET WHITELIST BY GOVERNOR!!! ==')
        console.log('=====================================')
        console.log('=====================================')
    })
}
