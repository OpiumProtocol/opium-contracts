const SyntheticAggregator = artifacts.require('SyntheticAggregator')
const OptionCallSyntheticIdMock = artifacts.require('OptionCallSyntheticIdMock')

const { derivativeFactory, getDerivativeHash } = require('./utils/derivatives')

contract('SyntheticAggregator', accounts => {
    const owner = accounts[0]

    let syntheticAggregator, optionCall

    let derivative, hash

    const oneEther = web3.utils.toWei('1', 'ether')

    before(async () => {
        syntheticAggregator = await SyntheticAggregator.deployed()
        optionCall = await OptionCallSyntheticIdMock.deployed()

        derivative = derivativeFactory({
            margin: oneEther,
            endTime: ~~(Date.now() / 1000) + 3600, // now + 1 hour
            params: [ '200' ],
            syntheticId: optionCall.address
        })

        hash = getDerivativeHash(derivative)
    })

    it('should successfully return isPool', async () => {
        const isPool = await syntheticAggregator.isPool.call(hash, derivative, { from: owner })
        assert.isNotOk(isPool, 'Option isPool data is wrong')
    })

    it('should successfully return getMargin', async () => {
        const margin = await syntheticAggregator.getMargin.call(hash, derivative, { from: owner })
        assert.equal(margin.buyerMargin, '0', 'Option buyer margin data is wrong')
        assert.equal(margin.sellerMargin, oneEther, 'Option seller margin data is wrong')
    })

    it('should successfully return authorAddress', async () => {
        const authorAddress = await syntheticAggregator.getAuthorAddress.call(hash, derivative, { from: owner })
        assert.equal(authorAddress, owner, 'Option author address data is wrong')
    })

    it('should successfully return authorCommission', async () => {
        const commission = await syntheticAggregator.getAuthorCommission.call(hash, derivative, { from: owner })
        assert.equal(commission, '25', 'Option commission data is wrong')
    })
})
