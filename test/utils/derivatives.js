const { zeroAddress } = require('./addresses')

module.exports.derivativeFactory = (derivative) => {
    const def = {
        margin: 0,
        endTime: 0,
        params: [],
        oracleId: zeroAddress,
        token: zeroAddress,
        syntheticId: zeroAddress
    }

    return {
        ...def,
        ...derivative
    }
}

module.exports.getDerivativeHash = (derivative) => {
    return web3.utils.soliditySha3(
        derivative.margin,
        derivative.endTime,
        {
            type: 'uint256[]',
            value: derivative.params
        },
        derivative.oracleId,
        derivative.token,
        derivative.syntheticId,
    )
}
