const jsonrpc = '2.0'

const send = (method, params = []) => {
    return new Promise((resolve, reject) => web3.currentProvider.send({
        jsonrpc,
        method,
        params,
        id: new Date().getTime()
    }, (err, result) => {
        if (err) {
            return reject(err)
        }
        return resolve(result)
    }))
}

const timeTravel = async seconds => {
    await send('evm_increaseTime', [seconds])
    await send('evm_mine')
}

const blockTravel = async blocks => {
    for (let i = 0; i < blocks; i++) {
        await send('evm_mine')
    }
}

module.exports.timeTravel = timeTravel
module.exports.blockTravel = blockTravel
