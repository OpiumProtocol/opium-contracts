const jsonrpc = '2.0'

const send = (method, params = [], from = undefined) => {
    return new Promise((resolve, reject) => web3.currentProvider.send({
        jsonrpc,
        method,
        params,
        from,
        id: new Date().getTime()
    }, (err, result) => {
        if (err) {
            return reject(err)
        }
        return resolve(result)
    }))
}

const sign = async (signer, data, from) => {
    const { result } = await send('eth_signTypedData', [signer, data], from)
    return result
}

module.exports.sign = sign
