const OracleAggregator = artifacts.require('OracleAggregator')
const Registry = artifacts.require('Registry')

const OracleIdMock = artifacts.require('OracleIdMock')

contract('OracleAggregator', accounts => {

    const owner = accounts[0]
    const core = accounts[1]
    const author = accounts[2]
    const oracle = accounts[3]

    let registry, oracleAggregator, oracleIdMock
    let timestamp, timestampPlusOne, timestampMinusOne, timestampPlusTwo, timestampPlusThree
    let fetchPrice, lessMoney, moreButNotEnoughMoney, moreMoney
    let data, period, times, returnDataOne, returnDataTwo, returnDataThree

    before(async () => {
        registry = await Registry.new({ from: owner })
        oracleAggregator = await OracleAggregator.new(registry.address, { from: owner })

        await registry.setOracleAggregator(oracleAggregator.address, { from: owner })
        await registry.setCore(core, { from: owner })

        // Money related
        fetchPrice = web3.utils.toWei('0.1', 'ether')
        lessMoney = web3.utils.toWei('0.01', 'ether')
        moreButNotEnoughMoney = web3.utils.toWei('0.11', 'ether')
        moreMoney = web3.utils.toWei('0.3', 'ether')

        oracleIdMock = await OracleIdMock.new(fetchPrice, registry.address, { from: owner })

        timestamp = Math.floor(Date.now() / 1000)
        timestampMinusOne = timestamp - 60 // - 1 minute
        timestampPlusOne = timestamp + 60 // + 1 minute
        timestampPlusTwo = timestamp + 120 // + 2 minute
        timestampPlusThree = timestamp + 180 // + 3 minute

        data = 123456789
        returnDataOne = 987654321
        returnDataTwo = 329876321
        returnDataThree = 11976541

        period = 60 // 2 minutes
        times = 3
    })

    it('should accept data from oracle', async () => {
        const gas = await oracleAggregator.__callback.estimateGas(timestamp, data, { from: oracle })
        console.log('Gas used during __callback =', gas)
        await oracleAggregator.__callback(timestamp, data, { from: oracle })
        const result = await oracleAggregator.getData(oracle, timestamp)
        assert.equal(result, data, 'Oracle didn\'t provided correct information')
    })

    it('should reject attempt to push data twice', async () => {
        try {
            await oracleAggregator.__callback(timestamp, data, { from: oracle })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/ORACLE_AGGREGATOR:DATA_ALREADY_EXIST/), 'ORACLE_AGGREGATOR:DATA_ALREADY_EXIST')
        }
    })

    it('should correctly return fetchPrice from oracle', async () => {
        const result = await oracleAggregator.calculateFetchPrice.call(oracleIdMock.address)
        assert.equal(result, fetchPrice, 'Fetch price is not correct')
    })

    it('should revert fetchData with ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER with 0 ether', async () => {
        try {
            await oracleAggregator.fetchData(oracleIdMock.address, timestamp, { from: author })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER/), 'ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER')
        }
    })

    it('should revert fetchData with ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER with less ether', async () => {
        try {
            await oracleAggregator.fetchData(oracleIdMock.address, timestamp, { from: author, value: lessMoney })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER/), 'ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER')
        }
    })

    it('should revert recursivelyFetchData with ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER with 0 ether', async () => {
        try {
            await oracleAggregator.recursivelyFetchData(oracleIdMock.address, timestamp, period, times, { from: author })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER/), 'ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER')
        }
    })

    it('should revert recursivelyFetchData with ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER with less ether', async () => {
        try {
            await oracleAggregator.recursivelyFetchData(oracleIdMock.address, timestamp, period, times, { from: author, value: moreButNotEnoughMoney })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER/), 'ORACLE_AGGREGATOR:NOT_ENOUGH_ETHER')
        }
    })

    it('should query and receive data using fetchData', async () => {
        const gas = await oracleAggregator.fetchData.estimateGas(oracleIdMock.address, timestamp, { from: author, value: fetchPrice })
        console.log('Gas used during fetching =', gas)
        await oracleAggregator.fetchData(oracleIdMock.address, timestamp, { from: author, value: fetchPrice })

        await oracleIdMock.triggerCallback(timestamp, returnDataThree, { from: owner })

        const result = await oracleAggregator.getData(oracleIdMock.address, timestamp)
        assert.equal(result, returnDataThree, 'Oracle didn\'t provided correct information')
    })

    it('should revert fetchData with ORACLE_AGGREGATOR:QUERY_WAS_ALREADY_MADE for already existing data', async () => {
        try {
            await oracleAggregator.fetchData(oracleIdMock.address, timestamp, { from: author, value: fetchPrice })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/ORACLE_AGGREGATOR:QUERY_WAS_ALREADY_MADE/), 'ORACLE_AGGREGATOR:QUERY_WAS_ALREADY_MADE')
        }
    })

    it('should revert recursivelyFetchData with ORACLE_AGGREGATOR:QUERY_WAS_ALREADY_MADE for already existing data', async () => {
        try {
            await oracleAggregator.recursivelyFetchData(oracleIdMock.address, timestampMinusOne, period, times, { from: author, value: moreMoney })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/ORACLE_AGGREGATOR:QUERY_WAS_ALREADY_MADE/), 'ORACLE_AGGREGATOR:QUERY_WAS_ALREADY_MADE')
        }
    })

    it('should query and receive data using recursivelyFetchData', async () => {
        const gas = await oracleAggregator.recursivelyFetchData.estimateGas(oracleIdMock.address, timestampPlusOne, period, times, { from: author, value: moreMoney })
        console.log('Gas used during fetching recursively =', gas)
        await oracleAggregator.recursivelyFetchData(oracleIdMock.address, timestampPlusOne, period, times, { from: author, value: moreMoney })

        await oracleIdMock.triggerCallback(timestampPlusOne, returnDataOne, { from: owner })
        await oracleIdMock.triggerCallback(timestampPlusTwo, returnDataTwo, { from: owner })
        await oracleIdMock.triggerCallback(timestampPlusThree, returnDataThree, { from: owner })

        const resultOne = await oracleAggregator.getData(oracleIdMock.address, timestampPlusOne)
        const resultTwo = await oracleAggregator.getData(oracleIdMock.address, timestampPlusTwo)
        const resultThree = await oracleAggregator.getData(oracleIdMock.address, timestampPlusThree)

        assert.equal(resultOne, returnDataOne, 'Oracle didn\'t provided correct information for first query')
        assert.equal(resultTwo, returnDataTwo, 'Oracle didn\'t provided correct information for second query')
        assert.equal(resultThree, returnDataThree, 'Oracle didn\'t provided correct information for third query')
    })
})
