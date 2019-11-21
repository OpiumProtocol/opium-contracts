module.exports.calculatePortfolioId = (tokenIds, tokenRatio) => {
    return web3.utils.soliditySha3(
        {
            type: 'uint256[]',
            value: tokenIds
        },
        {
            type: 'uint256[]',
            value: tokenRatio
        }
    )
}

module.exports.calculateLongTokenId = (derivativeHash) => {
    return web3.utils.toBN(web3.utils.soliditySha3(derivativeHash, 'LONG'))
}

module.exports.calculateShortTokenId = (derivativeHash) => {
    return web3.utils.toBN(web3.utils.soliditySha3(derivativeHash, 'SHORT'))
}
