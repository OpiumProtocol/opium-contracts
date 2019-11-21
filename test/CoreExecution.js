const Core = artifacts.require('Core')
const TestToken = artifacts.require('TestToken')
const OptionCallSyntheticIdMock = artifacts.require('OptionCallSyntheticIdMock')
const OracleAggregator = artifacts.require('OracleAggregator')
const TokenSpender = artifacts.require('TokenSpender')

const { timeTravel } = require('./utils/timeTravel')
const { derivativeFactory } = require('./utils/derivatives')
const { calculateLongTokenId, calculateShortTokenId } = require('./utils/positions')

contract('Core', accounts => {

    const owner = accounts[0]
    const buyer = accounts[1]
    const seller = accounts[2]
    const thirdParty = accounts[3]
    const oracle = accounts[4]
    const author = accounts[5]

    let testToken, core, optionCallLogic, oracleAggregator, tokenSpender

    const SECONDS_10_MINS = 60 * 10
    const SECONDS_20_MINS = 60 * 20
    const SECONDS_30_MINS = 60 * 30
    const SECONDS_40_MINS = 60 * 40
    const SECONDS_50_MINS = 60 * 50
    const SECONDS_3_WEEKS = 60 * 60 * 24 * 7 * 3

    const AUTHOR_COMMISSION = 0.0025 // 0.25%
    const OPIUM_COMMISSION = 0.1 // 10% of author commission

    const calculateFees = payout => {
        const opiumOverallFee = Math.floor(payout * AUTHOR_COMMISSION)

        const opiumFee = Math.floor(opiumOverallFee * OPIUM_COMMISSION)
        const authorFee = opiumOverallFee - opiumFee

        return {
            opiumOverallFee,
            authorFee,
            opiumFee
        }
    }

    const calculatePayoutFee = (payout) => {
        const {
            opiumOverallFee
        } = calculateFees(payout)

        return opiumOverallFee
    }

    let fullMarginOption, overMarginOption, underMarginOption, nonProfitOption, noDataOption

    let executeOne = 'execute(uint256,uint256,(uint256,uint256,uint256[],address,address,address))',
        executeOneWithAddress = 'execute(address,uint256,uint256,(uint256,uint256,uint256[],address,address,address))',
        executeMany = 'execute(uint256[],uint256[],(uint256,uint256,uint256[],address,address,address)[])',
        executeManyWithAddress = 'execute(address,uint256[],uint256[],(uint256,uint256,uint256[],address,address,address)[])'

    let cancelOne = 'cancel(uint256,uint256,(uint256,uint256,uint256[],address,address,address))',
        cancelMany = 'cancel(uint256[],uint256[],(uint256,uint256,uint256[],address,address,address)[])'

    before(async () => {
        testToken = await TestToken.deployed()
        optionCallLogic = await OptionCallSyntheticIdMock.new({ from: author })
        tokenSpender = await TokenSpender.deployed()
        core = await Core.deployed()
        oracleAggregator = await OracleAggregator.deployed()
    })

    context('Option Call', () => {
        before(async () => {
            // Option with no data provided to test cancellation
            noDataOption = {
                derivative: derivativeFactory({
                    margin: 30,
                    endTime: ~~(Date.now() / 1000) + SECONDS_50_MINS, // Now + 40 mins
                    params: [
                        200, // Strike Price 200.00$
                    ],
                    oracleId: oracle,
                    token: testToken.address,
                    syntheticId: optionCallLogic.address
                }),
                quantity: 3,
                price: 230 // full margin profit
            }

            noDataOption.hash = await core.getDerivativeHash(noDataOption.derivative, { from: owner })
            noDataOption.longTokenId = calculateLongTokenId(noDataOption.hash)
            noDataOption.shortTokenId = calculateShortTokenId(noDataOption.hash)

            // Full margin option
            fullMarginOption = {
                derivative: derivativeFactory({
                    margin: 30,
                    endTime: ~~(Date.now() / 1000) + SECONDS_40_MINS, // Now + 40 mins
                    params: [
                        200, // Strike Price 200.00$
                    ],
                    oracleId: oracle,
                    token: testToken.address,
                    syntheticId: optionCallLogic.address
                }),
                quantity: 3,
                price: 230 // full margin profit
            }

            fullMarginOption.hash = await core.getDerivativeHash(fullMarginOption.derivative, { from: owner })
            fullMarginOption.longTokenId = calculateLongTokenId(fullMarginOption.hash)
            fullMarginOption.shortTokenId = calculateShortTokenId(fullMarginOption.hash)
                
            await oracleAggregator.__callback(fullMarginOption.derivative.endTime, fullMarginOption.price, { from: oracle }) // Current price

            // Over margin option
            overMarginOption = {
                derivative: derivativeFactory({
                    margin: 30,
                    endTime: ~~(Date.now() / 1000) + SECONDS_20_MINS, // Now + 20 mins
                    params: [
                        200, // Strike Price 200.00$
                    ],
                    oracleId: oracle,
                    token: testToken.address,
                    syntheticId: optionCallLogic.address
                }),
                quantity: 3,
                price: 300 // over margin profit 
            }

            overMarginOption.hash = await core.getDerivativeHash(overMarginOption.derivative, { from: owner })
            overMarginOption.longTokenId = calculateLongTokenId(overMarginOption.hash)
            overMarginOption.shortTokenId = calculateShortTokenId(overMarginOption.hash)
                
            await oracleAggregator.__callback(overMarginOption.derivative.endTime, overMarginOption.price, { from: oracle }) // Current price

            // Under margin option
            underMarginOption = {
                derivative: derivativeFactory({
                    margin: 30,
                    endTime: ~~(Date.now() / 1000) + SECONDS_30_MINS, // Now + 30 mins
                    params: [
                        200, // Strike Price 200.00$
                    ],
                    oracleId: oracle,
                    token: testToken.address,
                    syntheticId: optionCallLogic.address
                }),
                quantity: 3,
                price: 220 // under margin profit 
            }

            underMarginOption.hash = await core.getDerivativeHash(underMarginOption.derivative, { from: owner })
            underMarginOption.longTokenId = calculateLongTokenId(underMarginOption.hash)
            underMarginOption.shortTokenId = calculateShortTokenId(underMarginOption.hash)
                
            await oracleAggregator.__callback(underMarginOption.derivative.endTime, underMarginOption.price, { from: oracle }) // Current price

            // Under margin option
            nonProfitOption = {
                derivative: derivativeFactory({
                    margin: 30,
                    endTime: ~~(Date.now() / 1000) + SECONDS_10_MINS, // Now + 10 mins
                    params: [
                        200, // Strike Price 200.00$
                    ],
                    oracleId: oracle,
                    token: testToken.address,
                    syntheticId: optionCallLogic.address
                }),
                quantity: 3,
                price: 190 // non profit 
            }

            nonProfitOption.hash = await core.getDerivativeHash(nonProfitOption.derivative, { from: owner })
            nonProfitOption.longTokenId = calculateLongTokenId(nonProfitOption.hash)
            nonProfitOption.shortTokenId = calculateShortTokenId(nonProfitOption.hash)
                
            await oracleAggregator.__callback(nonProfitOption.derivative.endTime, nonProfitOption.price, { from: oracle }) // Current price

            // Create options
            await testToken.approve(tokenSpender.address, noDataOption.derivative.margin * noDataOption.quantity, { from: owner })
            await core.create(
                noDataOption.derivative,
                noDataOption.quantity,
                [
                    buyer,
                    seller,
                ],
                { from: owner }
            )

            await testToken.approve(tokenSpender.address, fullMarginOption.derivative.margin * fullMarginOption.quantity, { from: owner })
            await core.create(
                fullMarginOption.derivative,
                fullMarginOption.quantity,
                [
                    buyer,
                    seller,
                ],
                { from: owner }
            )

            await testToken.approve(tokenSpender.address, overMarginOption.derivative.margin * overMarginOption.quantity, { from: owner })
            await core.create(
                overMarginOption.derivative,
                overMarginOption.quantity,
                [
                    buyer,
                    seller,
                ],
                { from: owner }
            )

            await testToken.approve(tokenSpender.address, underMarginOption.derivative.margin * underMarginOption.quantity, { from: owner })
            await core.create(
                underMarginOption.derivative,
                underMarginOption.quantity,
                [
                    buyer,
                    seller,
                ],
                { from: owner }
            )

            await testToken.approve(tokenSpender.address, nonProfitOption.derivative.margin * nonProfitOption.quantity, { from: owner })
            await core.create(
                nonProfitOption.derivative,
                nonProfitOption.quantity,
                [
                    buyer,
                    seller,
                ],
                { from: owner }
            )
        })

        it('should revert execution with CORE:TOKEN_IDS_AND_QUANTITIES_LENGTH_DOES_NOT_MATCH', async () => {
            try {
                await core.methods[executeManyWithAddress](seller, [ fullMarginOption.longTokenId, fullMarginOption.shortTokenId ], [ 1 ], [ fullMarginOption.derivative, fullMarginOption.derivative ], { from: seller })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:TOKEN_IDS_AND_QUANTITIES_LENGTH_DOES_NOT_MATCH/), 'CORE:TOKEN_IDS_AND_QUANTITIES_LENGTH_DOES_NOT_MATCH')
            }
        })

        it('should revert execution with CORE:TOKEN_IDS_AND_DERIVATIVES_LENGTH_DOES_NOT_MATCH', async () => {
            try {
                await core.methods[executeManyWithAddress](seller, [ fullMarginOption.longTokenId, fullMarginOption.shortTokenId ], [ 1, 1 ], [ fullMarginOption.derivative ], { from: seller })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:TOKEN_IDS_AND_DERIVATIVES_LENGTH_DOES_NOT_MATCH/), 'CORE:TOKEN_IDS_AND_DERIVATIVES_LENGTH_DOES_NOT_MATCH')
            }
        })

        it('should revert execution before endTime with CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED', async () => {
            // Buyer
            try {
                await core.methods[executeOne](fullMarginOption.longTokenId, 1, fullMarginOption.derivative, { from: buyer })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED/), 'longTokenId by buyer CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED')
            }

            try {
                await core.methods[executeOneWithAddress](buyer, fullMarginOption.longTokenId, 1, fullMarginOption.derivative, { from: buyer })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED/), 'longTokenId by buyer for buyer CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED')
            }

            try {
                await core.methods[executeMany]([ fullMarginOption.longTokenId ], [ 1 ], [ fullMarginOption.derivative ], { from: buyer })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED/), 'longTokenId array by buyer CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED')
            }

            try {
                await core.methods[executeManyWithAddress](buyer, [ fullMarginOption.longTokenId ], [ 1 ], [ fullMarginOption.derivative ], { from: buyer })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED/), 'longTokenId array by buyer for buyer CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED')
            }

            // Seller
            try {
                await core.methods[executeOne](fullMarginOption.shortTokenId, 1, fullMarginOption.derivative, { from: seller })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED/), 'shortTokenId by seller CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED')
            }

            try {
                await core.methods[executeOneWithAddress](seller, fullMarginOption.shortTokenId, 1, fullMarginOption.derivative, { from: seller })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED/), 'shortTokenId by seller for seller CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED')
            }

            try {
                await core.methods[executeMany]([ fullMarginOption.shortTokenId ], [ 1 ], [ fullMarginOption.derivative ], { from: seller })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED/), 'shortTokenId array by seller CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED')
            }

            try {
                await core.methods[executeManyWithAddress](seller, [ fullMarginOption.shortTokenId ], [ 1 ], [ fullMarginOption.derivative ], { from: seller })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED/), 'shortTokenId array by seller for seller CORE:EXECUTION_BEFORE_MATURITY_NOT_ALLOWED')
            }
        })

        it('should execute full margin option', async () => {
            await timeTravel(SECONDS_40_MINS)

            const buyerBalanceBefore = await testToken.balanceOf(buyer)
            const sellerBalanceBefore = await testToken.balanceOf(seller)
            const opiumFeesBefore = await core.feesVaults(owner, testToken.address)
            const authorFeesBefore = await core.feesVaults(author, testToken.address)

            let quantity = fullMarginOption.quantity - 1

            const gasLong = await core.methods[executeOne].estimateGas(fullMarginOption.longTokenId, quantity, fullMarginOption.derivative, { from: buyer })
            console.log('Gas used during longToken execution =', gasLong)
            await core.methods[executeOne](fullMarginOption.longTokenId, quantity, fullMarginOption.derivative, { from: buyer })
            
            const gasShort = await core.methods[executeOne].estimateGas(fullMarginOption.shortTokenId, quantity, fullMarginOption.derivative, { from: seller })
            console.log('Gas used during shortToken execution =', gasShort)
            await core.methods[executeOne](fullMarginOption.shortTokenId, quantity, fullMarginOption.derivative, { from: seller })
            
            const buyerBalanceAfter = await testToken.balanceOf(buyer)
            const buyerPayout = (fullMarginOption.derivative.margin - calculatePayoutFee(fullMarginOption.derivative.margin)) * quantity
            assert.equal(buyerBalanceAfter, buyerBalanceBefore.toNumber() + buyerPayout, 'Buyer\'s balance is incorrect')
            
            const sellerBalanceAfter = await testToken.balanceOf(seller)
            assert.equal(sellerBalanceAfter, sellerBalanceBefore.toNumber(), 'Seller\'s balance is incorrect')

            const { opiumFee, authorFee } = calculateFees(fullMarginOption.derivative.margin)

            const opiumFeesAfter = await core.feesVaults(owner, testToken.address)
            assert.equal(opiumFeesAfter, opiumFeesBefore.toNumber() + opiumFee * quantity, 'Opium collected fee is wrong')

            const authorFeesAfter = await core.feesVaults(author, testToken.address)
            assert.equal(authorFeesAfter, authorFeesBefore.toNumber() + authorFee * quantity, 'Author collected fee is wrong')
        })

        it('should revert execution before endTime with CORE:SYNTHETIC_EXECUTION_WAS_NOT_ALLOWED', async () => {
            try {
                await core.methods[executeOneWithAddress](buyer, fullMarginOption.longTokenId, 1, fullMarginOption.derivative, { from: thirdParty })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:SYNTHETIC_EXECUTION_WAS_NOT_ALLOWED/), 'longTokenId by buyer CORE:SYNTHETIC_EXECUTION_WAS_NOT_ALLOWED')
            }

            try {
                await core.methods[executeOneWithAddress](seller, fullMarginOption.shortTokenId, 1, fullMarginOption.derivative, { from: thirdParty })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:SYNTHETIC_EXECUTION_WAS_NOT_ALLOWED/), 'shortTokenId by seller CORE:SYNTHETIC_EXECUTION_WAS_NOT_ALLOWED')
            }
        })

        it('should allow execution for third parties', async () => {
            // Allow 3rd part execution
            await optionCallLogic.allowThirdpartyExecution(true, { from: buyer })

            const buyerBalanceBefore = await testToken.balanceOf(buyer)
            const opiumFeesBefore = await core.feesVaults(owner, testToken.address)
            const authorFeesBefore = await core.feesVaults(author, testToken.address)

            // Execute
            const gas = await core.methods[executeOneWithAddress].estimateGas(buyer, fullMarginOption.longTokenId, 1, fullMarginOption.derivative, { from: thirdParty })
            console.log('Gas used during third party execution =', gas)
            await core.methods[executeOneWithAddress](buyer, fullMarginOption.longTokenId, 1, fullMarginOption.derivative, { from: thirdParty })
            
            // Check if balance is correct
            const buyerBalanceAfter = await testToken.balanceOf(buyer)
            const buyerPayout = (fullMarginOption.derivative.margin - calculatePayoutFee(fullMarginOption.derivative.margin, true))
            assert.equal(buyerBalanceAfter, buyerBalanceBefore.toNumber() + buyerPayout, 'Buyer\'s balance is incorrect')

            // Check fees
            const { opiumFee, authorFee } = calculateFees(fullMarginOption.derivative.margin)

            const opiumFeesAfter = await core.feesVaults(owner, testToken.address)
            assert.equal(opiumFeesAfter, opiumFeesBefore.toNumber() + opiumFee, 'Opium collected fee is wrong')

            const authorFeesAfter = await core.feesVaults(author, testToken.address)
            assert.equal(authorFeesAfter, authorFeesBefore.toNumber() + authorFee, 'Author collected fee is wrong')
        })

        it('should revert execution of invalid tokenId with CORE:UNKNOWN_POSITION_TYPE', async () => {
            try {
                await core.methods[executeOne](12345678, 1, fullMarginOption.derivative, { from: buyer })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:UNKNOWN_POSITION_TYPE/), 'Did not reverted properly with CORE:UNKNOWN_POSITION_TYPE')
            }
        })

        it('should execute over margin option', async () => {
            const buyerBalanceBefore = await testToken.balanceOf(buyer)
            const sellerBalanceBefore = await testToken.balanceOf(seller)
            const opiumFeesBefore = await core.feesVaults(owner, testToken.address)

            const gasLong = await core.methods[executeOne].estimateGas(overMarginOption.longTokenId, overMarginOption.quantity, overMarginOption.derivative, { from: buyer })
            console.log('Gas used during longToken execution =', gasLong)
            await core.methods[executeOne](overMarginOption.longTokenId, overMarginOption.quantity, overMarginOption.derivative, { from: buyer })

            const gasShort = await core.methods[executeOne].estimateGas(overMarginOption.shortTokenId, overMarginOption.quantity, overMarginOption.derivative, { from: seller })
            console.log('Gas used during shortToken execution =', gasShort)
            await core.methods[executeOne](overMarginOption.shortTokenId, overMarginOption.quantity, overMarginOption.derivative, { from: seller })
            
            const buyerBalanceAfter = await testToken.balanceOf(buyer)
            const buyerPayout = (overMarginOption.derivative.margin - calculatePayoutFee(overMarginOption.derivative.margin)) * overMarginOption.quantity
            assert.equal(buyerBalanceAfter, buyerBalanceBefore.toNumber() + buyerPayout, 'Buyer\'s balance is incorrect')
            
            const sellerBalanceAfter = await testToken.balanceOf(seller)
            assert.equal(sellerBalanceAfter, sellerBalanceBefore.toNumber(), 'Seller\'s balance is incorrect')

            const opiumFeesAfter = await core.feesVaults(owner, testToken.address)
            
            const { opiumFee } = calculateFees(overMarginOption.derivative.margin)
            assert.equal(opiumFeesAfter, opiumFeesBefore.toNumber() + opiumFee * overMarginOption.quantity, 'Opium collected fee is wrong')
        })

        it('should execute under margin option', async () => {
            const buyerBalanceBefore = await testToken.balanceOf(buyer)
            const sellerBalanceBefore = await testToken.balanceOf(seller)
            const opiumFeesBefore = await core.feesVaults(owner, testToken.address)

            const gasLong = await core.methods[executeOne].estimateGas(underMarginOption.longTokenId, underMarginOption.quantity, underMarginOption.derivative, { from: buyer })
            console.log('Gas used during longToken execution =', gasLong)
            await core.methods[executeOne](underMarginOption.longTokenId, underMarginOption.quantity, underMarginOption.derivative, { from: buyer })

            const gasShort = await core.methods[executeOne].estimateGas(underMarginOption.shortTokenId, underMarginOption.quantity, underMarginOption.derivative, { from: seller })
            console.log('Gas used during shortToken execution =', gasShort)
            await core.methods[executeOne](underMarginOption.shortTokenId, underMarginOption.quantity, underMarginOption.derivative, { from: seller })
            
            const profit = underMarginOption.price - underMarginOption.derivative.params[0]

            const buyerBalanceAfter = await testToken.balanceOf(buyer)
            const buyerPayout = (profit - calculatePayoutFee(profit)) * underMarginOption.quantity
            assert.equal(buyerBalanceAfter, buyerBalanceBefore.toNumber() + buyerPayout, 'Buyer\'s balance is incorrect')
            
            const sellerBalanceAfter = await testToken.balanceOf(seller)
            assert.equal(sellerBalanceAfter, sellerBalanceBefore.toNumber() + (underMarginOption.derivative.margin - profit) * underMarginOption.quantity, 'Seller\'s balance is incorrect')

            const opiumFeesAfter = await core.feesVaults(owner, testToken.address)
            const { opiumFee } = calculateFees(profit)
            assert.equal(opiumFeesAfter, opiumFeesBefore.toNumber() + opiumFee * underMarginOption.quantity, 'Opium collected fee is wrong')
        })

        it('should execute non profit option', async () => {
            const buyerBalanceBefore = await testToken.balanceOf(buyer)
            const sellerBalanceBefore = await testToken.balanceOf(seller)
            const opiumFeesBefore = await core.feesVaults(owner, testToken.address)

            const gasLong = await core.methods[executeOne].estimateGas(nonProfitOption.longTokenId, nonProfitOption.quantity, nonProfitOption.derivative, { from: buyer })
            console.log('Gas used during longToken execution =', gasLong)
            await core.methods[executeOne](nonProfitOption.longTokenId, nonProfitOption.quantity, nonProfitOption.derivative, { from: buyer })

            const gasShort = await core.methods[executeOne].estimateGas(nonProfitOption.shortTokenId, nonProfitOption.quantity, nonProfitOption.derivative, { from: seller })
            console.log('Gas used during shortToken execution =', gasShort)
            await core.methods[executeOne](nonProfitOption.shortTokenId, nonProfitOption.quantity, nonProfitOption.derivative, { from: seller })

            const buyerBalanceAfter = await testToken.balanceOf(buyer)
            assert.equal(buyerBalanceAfter, buyerBalanceBefore.toNumber(), 'Buyer\'s balance is incorrect')
            
            const sellerBalanceAfter = await testToken.balanceOf(seller)
            assert.equal(sellerBalanceAfter, sellerBalanceBefore.toNumber() + nonProfitOption.derivative.margin * nonProfitOption.quantity, 'Seller\'s balance is incorrect')
            
            const opiumFeesAfter = await core.feesVaults(owner, testToken.address)
            assert.equal(opiumFeesAfter, opiumFeesBefore.toNumber(), 'Opium collected fee is wrong')
        })

        it('should revert cancellation with CORE:CANCELLATION_IS_NOT_ALLOWED', async () => {
            try {
                await core.methods[cancelOne](noDataOption.longTokenId, noDataOption.quantity, noDataOption.derivative, { from: buyer })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:CANCELLATION_IS_NOT_ALLOWED/), 'Did not reverted properly with CORE:CANCELLATION_IS_NOT_ALLOWED')
            }
        })

        it('should revert execution with ORACLE_AGGREGATOR:DATA_DOESNT_EXIST', async () => {
            await timeTravel(SECONDS_3_WEEKS)
            try {
                await core.methods[executeOne](noDataOption.longTokenId, noDataOption.quantity, noDataOption.derivative, { from: buyer })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/ORACLE_AGGREGATOR:DATA_DOESNT_EXIST/), 'Did not reverted properly with ORACLE_AGGREGATOR:DATA_DOESNT_EXIST')
            }
        })

        it('should successfully cancel position after 2 weeks with no data', async () => {
            const buyerBalanceBefore = await testToken.balanceOf(buyer)
            const sellerBalanceBefore = await testToken.balanceOf(seller)

            let quantity = noDataOption.quantity - 1

            const gasLong = await core.methods[cancelOne].estimateGas(noDataOption.longTokenId, quantity, noDataOption.derivative, { from: buyer })
            console.log('Gas used during cancellation =', gasLong)
            await core.methods[cancelOne](noDataOption.longTokenId, quantity, noDataOption.derivative, { from: buyer })

            const gasShort = await core.methods[cancelOne].estimateGas(noDataOption.shortTokenId, quantity, noDataOption.derivative, { from: seller })
            console.log('Gas used during cancellation =', gasShort)
            await core.methods[cancelOne](noDataOption.shortTokenId, quantity, noDataOption.derivative, { from: seller })

            const buyerBalanceAfter = await testToken.balanceOf(buyer)
            assert.equal(buyerBalanceAfter, buyerBalanceBefore.toNumber(), 'Buyer\'s balance is incorrect')
            
            const sellerBalanceAfter = await testToken.balanceOf(seller)
            assert.equal(sellerBalanceAfter, sellerBalanceBefore.toNumber() + noDataOption.derivative.margin * quantity, 'Seller\'s balance is incorrect')
        })

        it('should revert execution with CORE:TICKER_WAS_CANCELLED', async () => {
            // Data occasionally appeared
            await oracleAggregator.__callback(noDataOption.derivative.endTime, noDataOption.price, { from: oracle })

            try {
                await core.methods[executeOne](noDataOption.longTokenId, 1, noDataOption.derivative, { from: buyer })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/CORE:TICKER_WAS_CANCELLED/), 'CORE:TICKER_WAS_CANCELLED')
            }
        })

        it('should successfully withdraw commission', async () => {
            const ownerBalanceBefore = await testToken.balanceOf(owner)
            const authorBalanceBefore = await testToken.balanceOf(author)

            const opiumFees = await core.feesVaults(owner, testToken.address)
            const authorFees = await core.feesVaults(author, testToken.address)
            
            const gas = await core.withdrawFee.estimateGas(testToken.address, { from: owner })
            console.log('Gas used during withdrawal =', gas)
            await core.withdrawFee(testToken.address, { from: owner })

            const gasAuthor = await core.withdrawFee.estimateGas(testToken.address, { from: author })
            console.log('Gas used during withdrawal =', gasAuthor)
            await core.withdrawFee(testToken.address, { from: author })
            
            const ownerBalanceAfter = await testToken.balanceOf(owner)
            const authorBalanceAfter = await testToken.balanceOf(author)

            assert.equal(ownerBalanceAfter.toString(), ownerBalanceBefore.add(opiumFees).toString(), 'Owner\'s balance is incorrect')
            assert.equal(authorBalanceAfter.toString(), authorBalanceBefore.add(authorFees).toString(), 'Author\'s balance is incorrect')
        })
    })
})
