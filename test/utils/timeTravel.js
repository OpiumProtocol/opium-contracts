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

/**
 *  Takes a snapshot and returns the ID of the snapshot for restoring later.
 * @returns {string} id
 */
const takeSnapshot = async () => {
    const { result } = await send('evm_snapshot', [])
    await blockTravel(1)

    return result
}

/**
 *  Restores a snapshot that was previously taken with takeSnapshot
 *  @param {string} id The ID that was returned when takeSnapshot was called.
 */
const restoreSnapshot = async (id) => {
    await send('evm_revert', [id])
    await blockTravel(1)
}

module.exports.timeTravel = timeTravel
module.exports.blockTravel = blockTravel
module.exports.takeSnapshot = takeSnapshot
module.exports.restoreSnapshot = restoreSnapshot
