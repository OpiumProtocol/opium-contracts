const TokenSpender = artifacts.require('TokenSpender')
const DAI = artifacts.require('TestToken')

const { timeTravel } = require('./utils/timeTravel')

contract('TokenSpender', accounts => {
    const owner = accounts[0]
    const core = accounts[1]
    const match = accounts[2]
    const notAllowed = accounts[3]
    const hacker = accounts[4]
    const goodGuy = accounts[5]
    const newCore = accounts[6]
    const newMatch = accounts[7]

    let tokenSpender, dai

    const oneEther = web3.utils.toWei('1', 'ether')

    before(async () => {
        tokenSpender = await TokenSpender.new(owner)
        dai = await DAI.deployed()
    })

    it('should revert proposing by non governor address', async () => {
        try {
            await tokenSpender.proposeWhitelist([ core, match ], { from: notAllowed })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/Only governor allowed/), 'Only governor allowed')
        }
    })

    it('should be successfully propose initial whitelist by governor address', async () => {
        await tokenSpender.proposeWhitelist([ core, match ], { from: owner })
        const whitelist = await tokenSpender.getWhitelist.call()
        assert.equal(whitelist[0], core, 'Core address does not match')
        assert.equal(whitelist[1], match, 'Match address does not match')
    })

    it('should revert spending by non whitelisted address', async () => {
        try {
            await tokenSpender.claimTokens(dai.address, owner, hacker, oneEther, { from: notAllowed })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/Only whitelisted allowed/), 'Only whitelisted allowed')
        }
    })

    it('should successfully spend by core', async () => {
        // Preps
        await dai.approve(tokenSpender.address, oneEther, { from: owner })

        await tokenSpender.claimTokens(dai.address, owner, goodGuy, oneEther, { from: core })

        const balanceOfGoodGuy = await dai.balanceOf(goodGuy)
        assert.equal(balanceOfGoodGuy, oneEther, 'Good guys balance is wrong')
    })

    it('should revert commitment before proposal', async () => {
        try {
            await tokenSpender.commitWhitelist({ from: owner })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/Didn't proposed yet/), 'Didn\'t proposed yet')
        }
    })

    it('should revert proposal for empty list', async () => {
        try {
            await tokenSpender.proposeWhitelist([], { from: owner })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/Can't be empty/), 'Can\'t be empty')
        }
    })

    it('should be successfully propose new addresses by governor address, but keep old till time lock', async () => {
        await tokenSpender.proposeWhitelist([ newCore, newMatch ], { from: owner })

        const whitelist = await tokenSpender.getWhitelist.call()
        assert.equal(whitelist[0], core, 'Core address does not match')
        assert.equal(whitelist[1], match, 'Match address does not match')
    })

    it('should revert commitment by non governor address', async () => {
        try {
            await tokenSpender.commitWhitelist({ from: notAllowed })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/Only governor allowed/), 'Only governor allowed')
        }
    })

    it('should revert commitment before time lock', async () => {
        try {
            await tokenSpender.commitWhitelist({ from: owner })
            throw null
        } catch (e) {
            assert.ok(e.message.match(/Can't commit yet/), 'Can\'t commit yet')
        }
    })

    it('should successfully commit new whitelist after time lock', async () => {
        await timeTravel(15 * 24 * 60 * 60) // Travel 15 days forward
        await tokenSpender.commitWhitelist({ from: owner })

        const whitelist = await tokenSpender.getWhitelist.call()
        assert.equal(whitelist[0], newCore, 'Core address does not match')
        assert.equal(whitelist[1], newMatch, 'Match address does not match')
    })
})
