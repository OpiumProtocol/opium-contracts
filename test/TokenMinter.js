const TokenMinter = artifacts.require('TokenMinter')
const Registry = artifacts.require('Registry')

const { calculatePortfolioId, calculateLongTokenId, calculateShortTokenId } = require('./utils/positions')

contract('TokenMinter', accounts => {

    const owner = accounts[0]
    const core = accounts[1]
    const buyer = accounts[2]
    const seller = accounts[3]

    let registry, tokenMinter
    let hashOne, hashTwo, hashThree
    let longTokenIdOne, shortTokenIdOne, longTokenIdTwo, shortTokenIdTwo, longTokenIdThree, shortTokenIdThree
    let portfolioHashBuyerOne, portfolioHashBuyerTwo, portfolioHashBuyerThree
    let portfolioHashSellerOne, portfolioHashSellerTwo, portfolioHashSellerThree

    before(async () => {
        registry = await Registry.new()
        tokenMinter = await TokenMinter.new('https://explorer.opium.network/erc721o/', registry.address)

        // Change core to simulate it's actions
        registry.setCore(core, { from: owner })
        registry.setMinter(tokenMinter.address, { from: owner })

        hashOne = web3.utils.soliditySha3(10, 20, 30, 40, core, buyer, seller) // Random derivativeHash one
        hashTwo = web3.utils.soliditySha3(50, 60, 70, 80, seller, core, buyer) // Random derivativeHash two
        hashThree = web3.utils.soliditySha3(90, 60, 90, 11, buyer, seller, core) // Random derivativeHash three

        longTokenIdOne = calculateLongTokenId(hashOne, 'LONG')
        shortTokenIdOne = calculateShortTokenId(hashOne, 'SHORT')
        longTokenIdTwo = calculateLongTokenId(hashTwo, 'LONG')
        shortTokenIdTwo = calculateShortTokenId(hashTwo, 'SHORT')
        longTokenIdThree = calculateLongTokenId(hashThree, 'LONG')
        shortTokenIdThree = calculateShortTokenId(hashThree, 'SHORT')
    })

    context('Minting / Burning', () => {

        it('should revert minting with USING_REGISTRY:ONLY_CORE_ALLOWED', async () => {
            try {
                await tokenMinter.mint(owner, owner, '0x00', 1, { from: owner })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/USING_REGISTRY:ONLY_CORE_ALLOWED/), 'USING_REGISTRY:ONLY_CORE_ALLOWED')
            }
        })

        it('should revert burning with USING_REGISTRY:ONLY_CORE_ALLOWED', async () => {
            try {
                await tokenMinter.burn(owner, 123, 1, { from: owner })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/USING_REGISTRY:ONLY_CORE_ALLOWED/), 'USING_REGISTRY:ONLY_CORE_ALLOWED')
            }
        })

        // FIXME: This could work only in solidity 0.6.0 because we can't call Libraries externally
        // it('should correctly calculate longTokenId', async () => {
        //     const resultLongTokenIdOne = await tokenMinter.getLongTokenId(hashOne)
        //     const resultLongTokenIdTwo = await tokenMinter.getLongTokenId(hashTwo)

        //     const resultShortTokenIdOne = await tokenMinter.getShortTokenId(hashOne)
        //     const resultShortTokenIdTwo = await tokenMinter.getShortTokenId(hashTwo)

        //     assert.isOk(resultLongTokenIdOne.eq(longTokenIdOne), 'Long token One is not correct')
        //     assert.isOk(resultLongTokenIdTwo.eq(longTokenIdTwo), 'Long token Two is not correct')

        //     assert.isOk(resultShortTokenIdOne.eq(shortTokenIdOne), 'Short token One is not correct')
        //     assert.isOk(resultShortTokenIdTwo.eq(shortTokenIdTwo), 'Short token Two is not correct')
        // })

        it('should correctly mint token positions for hashOne', async () => {
            const quantity = 100

            const initialBuyerBalanceNFT = await tokenMinter.balanceOf(buyer)
            const initialBuyerBalanceFT = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            const initialSellerBalanceNFT = await tokenMinter.balanceOf(seller)
            const initialSellerBalanceFT = await tokenMinter.balanceOf(seller, shortTokenIdOne)
            
            const gas = await tokenMinter.mint.estimateGas(buyer, seller, hashOne, quantity, { from: core })
            console.log('Gas used during minting =', gas)
            await tokenMinter.mint(buyer, seller, hashOne, quantity, { from: core })

            const resultBuyerBalanceNFT = await tokenMinter.balanceOf(buyer)
            const resultBuyerBalanceFT = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            const resultSellerBalanceNFT = await tokenMinter.balanceOf(seller)
            const resultSellerBalanceFT = await tokenMinter.balanceOf(seller, shortTokenIdOne)

            // New token was added, balance incremented
            assert.equal(resultBuyerBalanceNFT, initialBuyerBalanceNFT.toNumber() + 1, 'Incorrect buyer\'s NFT balance')
            assert.equal(resultBuyerBalanceFT, initialBuyerBalanceFT.toNumber() + quantity, 'Incorrect buyer\'s FT balance')
            assert.equal(resultSellerBalanceNFT, initialSellerBalanceNFT.toNumber() + 1, 'Incorrect seller\'s NFT balance')
            assert.equal(resultSellerBalanceFT, initialSellerBalanceFT.toNumber() + quantity, 'Incorrect seller\'s FT balance')        
        })

        it('should correctly mint token positions for hashTwo', async () => {
            const quantity = 100

            const initialBuyerBalanceNFT = await tokenMinter.balanceOf(buyer)
            const initialBuyerBalanceFT = await tokenMinter.balanceOf(buyer, longTokenIdTwo)
            const initialSellerBalanceNFT = await tokenMinter.balanceOf(seller)
            const initialSellerBalanceFT = await tokenMinter.balanceOf(seller, shortTokenIdTwo)
            
            const gas = await tokenMinter.mint.estimateGas(buyer, seller, hashTwo, quantity, { from: core })
            console.log('Gas used during minting =', gas)
            await tokenMinter.mint(buyer, seller, hashTwo, quantity, { from: core })
            
            const resultBuyerBalanceNFT = await tokenMinter.balanceOf(buyer)
            const resultBuyerBalanceFT = await tokenMinter.balanceOf(buyer, longTokenIdTwo)
            const resultSellerBalanceNFT = await tokenMinter.balanceOf(seller)
            const resultSellerBalanceFT = await tokenMinter.balanceOf(seller, shortTokenIdTwo)

            // New token was added, balance incremented
            assert.equal(resultBuyerBalanceNFT, initialBuyerBalanceNFT.toNumber() + 1, 'Incorrect buyer\'s NFT balance')
            assert.equal(resultBuyerBalanceFT, initialBuyerBalanceFT.toNumber() + quantity, 'Incorrect buyer\'s FT balance')
            assert.equal(resultSellerBalanceNFT, initialSellerBalanceNFT.toNumber() + 1, 'Incorrect seller\'s NFT balance')
            assert.equal(resultSellerBalanceFT, initialSellerBalanceFT.toNumber() + quantity, 'Incorrect seller\'s FT balance')        
        })

        it('should correctly mint more token positions for hashOne', async () => {
            const quantity = 300

            const initialBuyerBalanceNFT = await tokenMinter.balanceOf(buyer)
            const initialBuyerBalanceFT = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            const initialSellerBalanceNFT = await tokenMinter.balanceOf(seller)
            const initialSellerBalanceFT = await tokenMinter.balanceOf(seller, shortTokenIdOne)
            
            const gas = await tokenMinter.mint.estimateGas(buyer, seller, hashOne, quantity, { from: core })
            console.log('Gas used during more minting =', gas)
            await tokenMinter.mint(buyer, seller, hashOne, quantity, { from: core })
            
            const resultBuyerBalanceNFT = await tokenMinter.balanceOf(buyer)
            const resultBuyerBalanceFT = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            const resultSellerBalanceNFT = await tokenMinter.balanceOf(seller)
            const resultSellerBalanceFT = await tokenMinter.balanceOf(seller, shortTokenIdOne)

            // New token was added, balance incremented
            assert.equal(resultBuyerBalanceNFT, initialBuyerBalanceNFT.toNumber(), 'Incorrect buyer\'s NFT balance')
            assert.equal(resultBuyerBalanceFT, initialBuyerBalanceFT.toNumber() + quantity, 'Incorrect buyer\'s FT balance')
            assert.equal(resultSellerBalanceNFT, initialSellerBalanceNFT.toNumber(), 'Incorrect seller\'s NFT balance')
            assert.equal(resultSellerBalanceFT, initialSellerBalanceFT.toNumber() + quantity, 'Incorrect seller\'s FT balance')        
        })

        it('should correctly burn token positions for hashOne', async () => {
            const quantity = 400

            const initialBuyerBalanceNFT = await tokenMinter.balanceOf(buyer)
            const initialBuyerBalanceFT = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            const initialSellerBalanceNFT = await tokenMinter.balanceOf(seller)
            const initialSellerBalanceFT = await tokenMinter.balanceOf(seller, shortTokenIdOne)
            
            const gasOne = await tokenMinter.burn.estimateGas(buyer, longTokenIdOne, quantity, { from: core })
            console.log('Gas used during burning longs =', gasOne)
            await tokenMinter.burn(buyer, longTokenIdOne, quantity, { from: core })

            const gasTwo = await tokenMinter.burn.estimateGas(seller, shortTokenIdOne, quantity, { from: core })
            console.log('Gas used during burning shorts =', gasTwo)
            await tokenMinter.burn(seller, shortTokenIdOne, quantity, { from: core })
            
            const resultBuyerBalanceNFT = await tokenMinter.balanceOf(buyer)
            const resultBuyerBalanceFT = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            const resultSellerBalanceNFT = await tokenMinter.balanceOf(seller)
            const resultSellerBalanceFT = await tokenMinter.balanceOf(seller, shortTokenIdOne)

            // New token was added, balance incremented
            assert.equal(resultBuyerBalanceNFT, initialBuyerBalanceNFT.toNumber() - 1, 'Incorrect buyer\'s NFT balance')
            assert.equal(resultBuyerBalanceFT, initialBuyerBalanceFT.toNumber() - quantity, 'Incorrect buyer\'s FT balance')
            assert.equal(resultSellerBalanceNFT, initialSellerBalanceNFT.toNumber() - 1, 'Incorrect seller\'s NFT balance')
            assert.equal(resultSellerBalanceFT, initialSellerBalanceFT.toNumber() - quantity, 'Incorrect seller\'s FT balance')        
        })

        it('should correctly burn token positions for hashTwo', async () => {
            const quantity = 100

            const initialBuyerBalanceNFT = await tokenMinter.balanceOf(buyer)
            const initialBuyerBalanceFT = await tokenMinter.balanceOf(buyer, longTokenIdTwo)
            const initialSellerBalanceNFT = await tokenMinter.balanceOf(seller)
            const initialSellerBalanceFT = await tokenMinter.balanceOf(seller, shortTokenIdTwo)
            
            const gasOne = await tokenMinter.burn.estimateGas(buyer, longTokenIdTwo, quantity, { from: core })
            console.log('Gas used during burning longs =', gasOne)
            await tokenMinter.burn(buyer, longTokenIdTwo, quantity, { from: core })
            
            const gasTwo = await tokenMinter.burn.estimateGas(seller, shortTokenIdTwo, quantity, { from: core })
            console.log('Gas used during burning shorts =', gasTwo)
            await tokenMinter.burn(seller, shortTokenIdTwo, quantity, { from: core })
            
            const resultBuyerBalanceNFT = await tokenMinter.balanceOf(buyer)
            const resultBuyerBalanceFT = await tokenMinter.balanceOf(buyer, longTokenIdTwo)
            const resultSellerBalanceNFT = await tokenMinter.balanceOf(seller)
            const resultSellerBalanceFT = await tokenMinter.balanceOf(seller, shortTokenIdTwo)

            // New token was added, balance incremented
            assert.equal(resultBuyerBalanceNFT, initialBuyerBalanceNFT.toNumber() - 1, 'Incorrect buyer\'s NFT balance')
            assert.equal(resultBuyerBalanceFT, initialBuyerBalanceFT.toNumber() - quantity, 'Incorrect buyer\'s FT balance')
            assert.equal(resultSellerBalanceNFT, initialSellerBalanceNFT.toNumber() - 1, 'Incorrect seller\'s NFT balance')
            assert.equal(resultSellerBalanceFT, initialSellerBalanceFT.toNumber() - quantity, 'Incorrect seller\'s FT balance')        
        })

        it('should revert burning token positions with TOKEN_MINTER:NOT_ENOUGH_POSITIONS', async () => {
            try {
                await tokenMinter.burn(buyer, longTokenIdOne, 1, { from: core })
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:NOT_ENOUGH_POSITIONS/), 'TOKEN_MINTER:NOT_ENOUGH_POSITIONS')
            }
            try {
                await tokenMinter.burn(seller, shortTokenIdOne, 1, { from: core })      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:NOT_ENOUGH_POSITIONS/), 'TOKEN_MINTER:NOT_ENOUGH_POSITIONS')
            }
        })
    })

    context('Composition', () => {
        it('should revert composing with TOKEN_MINTER:TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH', async () => {
            try {
                await tokenMinter.compose(
                    [
                        longTokenIdOne
                    ],
                    [],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH/), 'TOKEN_MINTER:TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH')
            }
        })

        it('should revert composing with TOKEN_MINTER:WRONG_QUANTITY', async () => {
            try {
                await tokenMinter.compose(
                    [
                        longTokenIdOne
                    ],
                    [
                        1
                    ],
                    0,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:WRONG_QUANTITY/), 'TOKEN_MINTER:WRONG_QUANTITY')
            }
        })

        it('should revert composing with TOKEN_MINTER:WRONG_QUANTITY', async () => {
            try {
                await tokenMinter.compose(
                    [
                    ],
                    [
                    ],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:WRONG_QUANTITY/), 'TOKEN_MINTER:WRONG_QUANTITY')
            }
        })

        it('should revert composing with TOKEN_MINTER:NOT_ENOUGH_POSITIONS', async () => {
            try {
                await tokenMinter.compose(
                    [
                        longTokenIdOne
                    ],
                    [
                        1
                    ],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:NOT_ENOUGH_POSITIONS/), 'TOKEN_MINTER:NOT_ENOUGH_POSITIONS')
            }
        })

        it('should successfully compose one token to position', async () => {
            await tokenMinter.mint(buyer, seller, hashOne, 1, { from: core })

            portfolioHashBuyerOne = calculatePortfolioId([ longTokenIdOne ], [ 1 ])
            
            const gasOne = await tokenMinter.compose.estimateGas(
                [ longTokenIdOne ],
                [ 1 ],
                1,
                { from: buyer }
            )
            console.log('Gas used during composing =', gasOne)
            await tokenMinter.compose(
                [ longTokenIdOne ],
                [ 1 ],
                1,
                { from: buyer }
            )
                
            const buyerBalancePortfolio = await tokenMinter.balanceOf(buyer, portfolioHashBuyerOne)
            const buyerBalancePosition = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            assert.equal(buyerBalancePortfolio, 1, 'Buyer portfolio balance is wrong')
            assert.equal(buyerBalancePosition, 0, 'Buyer position balance is wrong')
            
            portfolioHashSellerOne = calculatePortfolioId([ shortTokenIdOne ], [ 1 ])

            const gasTwo = await tokenMinter.compose.estimateGas(
                [ shortTokenIdOne ],
                [ 1 ],
                1,
                { from: seller }
            )
            console.log('Gas used during composing =', gasTwo)
            await tokenMinter.compose(
                [ shortTokenIdOne ],
                [ 1 ],
                1,
                { from: seller }
            )

            const sellerBalancePortfolio = await tokenMinter.balanceOf(seller, portfolioHashSellerOne)
            const sellerBalancePosition = await tokenMinter.balanceOf(seller, shortTokenIdOne)
            assert.equal(sellerBalancePortfolio, 1, 'Seller portfolio balance is wrong')
            assert.equal(sellerBalancePosition, 0, 'Seller position balance is wrong')
        })

        it('should successfully compose two tokens to position', async () => {
            await tokenMinter.mint(buyer, seller, hashOne, 1, { from: core })
            await tokenMinter.mint(buyer, seller, hashTwo, 1, { from: core })
            
            portfolioHashBuyerTwo = calculatePortfolioId([ longTokenIdOne, longTokenIdTwo ], [ 1, 1 ])
            
            const gasOne = await tokenMinter.compose.estimateGas(
                [ longTokenIdOne, longTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: buyer }
            )
            console.log('Gas used during composing =', gasOne)
            await tokenMinter.compose(
                [ longTokenIdOne, longTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: buyer }
            )
                
            const buyerBalancePortfolio = await tokenMinter.balanceOf(buyer, portfolioHashBuyerTwo)
            const buyerBalancePositionOne = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            const buyerBalancePositionTwo = await tokenMinter.balanceOf(buyer, longTokenIdTwo)
            assert.equal(buyerBalancePortfolio, 1, 'Buyer portfolio balance is wrong')
            assert.equal(buyerBalancePositionOne, 0, 'Buyer position one balance is wrong')
            assert.equal(buyerBalancePositionTwo, 0, 'Buyer position two balance is wrong')
            
            portfolioHashSellerTwo = calculatePortfolioId([ shortTokenIdOne, shortTokenIdTwo ], [ 1, 1 ])

            const gasTwo = await tokenMinter.compose.estimateGas(
                [ shortTokenIdOne, shortTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: seller }
            )
            console.log('Gas used during composing =', gasTwo)
            await tokenMinter.compose(
                [ shortTokenIdOne, shortTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: seller }
            )

            const sellerBalancePortfolio = await tokenMinter.balanceOf(seller, portfolioHashSellerTwo)
            const sellerBalancePositionOne = await tokenMinter.balanceOf(seller, shortTokenIdOne)
            const sellerBalancePositionTwo = await tokenMinter.balanceOf(seller, shortTokenIdTwo)
            assert.equal(sellerBalancePortfolio, 1, 'Seller portfolio balance is wrong')
            assert.equal(sellerBalancePositionOne, 0, 'Seller position one balance is wrong')
            assert.equal(sellerBalancePositionTwo, 0, 'Seller position two balance is wrong')
        })
    })

    context('Decomposition', () => {

        it('should revert decomposing with TOKEN_MINTER:TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH', async () => {
            try {
                await tokenMinter.decompose(
                    123,
                    [
                        longTokenIdOne
                    ],
                    [],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH/), 'TOKEN_MINTER:TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH')
            }
        })

        it('should revert decomposing with TOKEN_MINTER:WRONG_QUANTITY', async () => {
            try {
                await tokenMinter.decompose(
                    123,
                    [
                        longTokenIdOne
                    ],
                    [
                        1
                    ],
                    0,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:WRONG_QUANTITY/), 'TOKEN_MINTER:WRONG_QUANTITY')
            }
        })

        it('should revert decomposing with TOKEN_MINTER:WRONG_QUANTITY', async () => {
            try {
                await tokenMinter.decompose(
                    123,
                    [
                    ],
                    [
                    ],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:WRONG_QUANTITY/), 'TOKEN_MINTER:WRONG_QUANTITY')
            }
        })

        it('should revert decomposing with TOKEN_MINTER:WRONG_PORTFOLIO_ID', async () => {
            try {
                await tokenMinter.decompose(
                    portfolioHashBuyerTwo,
                    [
                        longTokenIdOne
                    ],
                    [
                        1
                    ],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:WRONG_PORTFOLIO_ID/), 'TOKEN_MINTER:WRONG_PORTFOLIO_ID')
            }
        })

        it('should revert decomposing with TOKEN_MINTER:NOT_ENOUGH_POSITIONS', async () => {
            try {
                await tokenMinter.decompose(
                    portfolioHashBuyerOne,
                    [
                        longTokenIdOne
                    ],
                    [
                        1
                    ],
                    2,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:NOT_ENOUGH_POSITIONS/), 'TOKEN_MINTER:NOT_ENOUGH_POSITIONS')
            }
        })

        it('should successfully decompose position to one token', async () => {
            portfolioHashBuyerOne = calculatePortfolioId([ longTokenIdOne ], [ 1 ])
            
            const gasOne = await tokenMinter.decompose.estimateGas(
                portfolioHashBuyerOne,
                [ longTokenIdOne ],
                [ 1 ],
                1,
                { from: buyer }
            )
            console.log('Gas used during decomposing =', gasOne)
            await tokenMinter.decompose(
                portfolioHashBuyerOne,
                [ longTokenIdOne ],
                [ 1 ],
                1,
                { from: buyer }
            )
                
            const buyerBalancePortfolio = await tokenMinter.balanceOf(buyer, portfolioHashBuyerOne)
            const buyerBalancePosition = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            assert.equal(buyerBalancePortfolio, 0, 'Buyer portfolio balance is wrong')
            assert.equal(buyerBalancePosition, 1, 'Buyer position balance is wrong')
            
            portfolioHashSellerOne = calculatePortfolioId([ shortTokenIdOne ], [ 1 ])

            const gasTwo = await tokenMinter.decompose.estimateGas(
                portfolioHashSellerOne,
                [ shortTokenIdOne ],
                [ 1 ],
                1,
                { from: seller }
            )
            console.log('Gas used during decomposing =', gasTwo)
            await tokenMinter.decompose(
                portfolioHashSellerOne,
                [ shortTokenIdOne ],
                [ 1 ],
                1,
                { from: seller }
            )

            const sellerBalancePortfolio = await tokenMinter.balanceOf(seller, portfolioHashSellerOne)
            const sellerBalancePosition = await tokenMinter.balanceOf(seller, shortTokenIdOne)
            assert.equal(sellerBalancePortfolio, 0, 'Seller portfolio balance is wrong')
            assert.equal(sellerBalancePosition, 1, 'Seller position balance is wrong')
        })

        it('should successfully decompose two tokens to position', async () => {
            portfolioHashBuyerTwo = calculatePortfolioId([ longTokenIdOne, longTokenIdTwo ], [ 1, 1 ])
            
            const gasOne = await tokenMinter.decompose.estimateGas(
                portfolioHashBuyerTwo,
                [ longTokenIdOne, longTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: buyer }
            )
            console.log('Gas used during decomposing =', gasOne)
            await tokenMinter.decompose(
                portfolioHashBuyerTwo,
                [ longTokenIdOne, longTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: buyer }
            )
                
            const buyerBalancePortfolio = await tokenMinter.balanceOf(buyer, portfolioHashBuyerTwo)
            const buyerBalancePositionOne = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            const buyerBalancePositionTwo = await tokenMinter.balanceOf(buyer, longTokenIdTwo)
            assert.equal(buyerBalancePortfolio, 0, 'Buyer portfolio balance is wrong')
            assert.equal(buyerBalancePositionOne, 2, 'Buyer position one balance is wrong')
            assert.equal(buyerBalancePositionTwo, 1, 'Buyer position two balance is wrong')
            
            portfolioHashSellerTwo = calculatePortfolioId([ shortTokenIdOne, shortTokenIdTwo ], [ 1, 1 ])

            const gasTwo = await tokenMinter.decompose.estimateGas(
                portfolioHashSellerTwo,
                [ shortTokenIdOne, shortTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: seller }
            )
            console.log('Gas used during decomposing =', gasTwo)
            await tokenMinter.decompose(
                portfolioHashSellerTwo,
                [ shortTokenIdOne, shortTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: seller }
            )

            const sellerBalancePortfolio = await tokenMinter.balanceOf(seller, portfolioHashSellerTwo)
            const sellerBalancePositionOne = await tokenMinter.balanceOf(seller, shortTokenIdOne)
            const sellerBalancePositionTwo = await tokenMinter.balanceOf(seller, shortTokenIdTwo)
            assert.equal(sellerBalancePortfolio, 0, 'Seller portfolio balance is wrong')
            assert.equal(sellerBalancePositionOne, 2, 'Seller position one balance is wrong')
            assert.equal(sellerBalancePositionTwo, 1, 'Seller position two balance is wrong')
        })
    })

    context('Recomposition', () => {
        before(async () => {
            await tokenMinter.compose(
                [ longTokenIdOne ],
                [ 1 ],
                1,
                { from: buyer }
            )

            await tokenMinter.compose(
                [ shortTokenIdOne ],
                [ 1 ],
                1,
                { from: seller }
            )
        })

        it('should revert recomposing with TOKEN_MINTER:INITIAL_TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH', async () => {
            try {
                await tokenMinter.recompose(
                    123,
                    [
                        longTokenIdOne
                    ],
                    [],
                    [ longTokenIdOne ],
                    [ 1 ],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:INITIAL_TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH/), 'TOKEN_MINTER:INITIAL_TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH')
            }
        })

        it('should revert recomposing with TOKEN_MINTER:FINAL_TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH', async () => {
            try {
                await tokenMinter.recompose(
                    123,
                    [
                        longTokenIdOne
                    ],
                    [ 1 ],
                    [ longTokenIdOne ],
                    [ ],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:FINAL_TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH/), 'TOKEN_MINTER:FINAL_TOKEN_IDS_AND_RATIO_LENGTH_DOES_NOT_MATCH')
            }
        })

        it('should revert recomposing with TOKEN_MINTER:WRONG_QUANTITY', async () => {
            try {
                await tokenMinter.recompose(
                    123,
                    [
                        longTokenIdOne
                    ],
                    [
                        1
                    ],
                    [ longTokenIdOne ],
                    [ 1 ],
                    0,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:WRONG_QUANTITY/), 'TOKEN_MINTER:WRONG_QUANTITY')
            }
        })

        it('should revert recomposing with TOKEN_MINTER:WRONG_QUANTITY', async () => {
            try {
                await tokenMinter.recompose(
                    123,
                    [],
                    [],
                    [ longTokenIdOne ],
                    [ 1 ],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:WRONG_QUANTITY/), 'TOKEN_MINTER:WRONG_QUANTITY')
            }
        })

        it('should revert recomposing with TOKEN_MINTER:WRONG_QUANTITY', async () => {
            try {
                await tokenMinter.recompose(
                    123,
                    [ longTokenIdOne ],
                    [ 1 ],
                    [],
                    [],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:WRONG_QUANTITY/), 'TOKEN_MINTER:WRONG_QUANTITY')
            }
        })

        it('should revert recomposing with TOKEN_MINTER:WRONG_PORTFOLIO_ID', async () => {
            try {
                await tokenMinter.recompose(
                    portfolioHashBuyerTwo,
                    [
                        longTokenIdOne
                    ],
                    [
                        1
                    ],
                    [ longTokenIdOne, longTokenIdTwo ],
                    [ 1, 1 ],
                    1,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:WRONG_PORTFOLIO_ID/), 'TOKEN_MINTER:WRONG_PORTFOLIO_ID')
            }
        })

        it('should revert recomposing with TOKEN_MINTER:NOT_ENOUGH_POSITIONS', async () => {
            try {
                await tokenMinter.recompose(
                    portfolioHashBuyerOne,
                    [
                        longTokenIdOne
                    ],
                    [
                        1
                    ],
                    [ longTokenIdOne, longTokenIdTwo ],
                    [ 1, 1 ],
                    2,
                    { from: buyer }
                )      
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:NOT_ENOUGH_POSITIONS/), 'TOKEN_MINTER:NOT_ENOUGH_POSITIONS')
            }
        })

        it('should successfully recompose from position with one token to two tokens', async () => {
            const gasOne = await tokenMinter.recompose.estimateGas(
                portfolioHashBuyerOne,
                [ longTokenIdOne ],
                [ 1 ],
                [ longTokenIdOne, longTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: buyer }
            )
            console.log('Gas used during recomposing =', gasOne)
            await tokenMinter.recompose(
                portfolioHashBuyerOne,
                [ longTokenIdOne ],
                [ 1 ],
                [ longTokenIdOne, longTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: buyer }
            )
                
            const buyerBalancePortfolioOne = await tokenMinter.balanceOf(buyer, portfolioHashBuyerOne)
            const buyerBalancePortfolioTwo = await tokenMinter.balanceOf(buyer, portfolioHashBuyerTwo)
            const buyerBalancePositionOne = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            const buyerBalancePositionTwo = await tokenMinter.balanceOf(buyer, longTokenIdTwo)
            assert.equal(buyerBalancePortfolioOne, 0, 'Buyer portfolio one balance is wrong')
            assert.equal(buyerBalancePortfolioTwo, 1, 'Buyer portfolio two balance is wrong')
            assert.equal(buyerBalancePositionOne, 1, 'Buyer position one balance is wrong')
            assert.equal(buyerBalancePositionTwo, 0, 'Buyer position two balance is wrong')

            const gasTwo = await tokenMinter.recompose.estimateGas(
                portfolioHashSellerOne,
                [ shortTokenIdOne ],
                [ 1 ],
                [ shortTokenIdOne, shortTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: seller }
            )
            console.log('Gas used during recomposing =', gasTwo)
            await tokenMinter.recompose(
                portfolioHashSellerOne,
                [ shortTokenIdOne ],
                [ 1 ],
                [ shortTokenIdOne, shortTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: seller }
            )

            const sellerBalancePortfolioOne = await tokenMinter.balanceOf(seller, portfolioHashSellerOne)
            const sellerBalancePortfolioTwo = await tokenMinter.balanceOf(seller, portfolioHashSellerTwo)
            const sellerBalancePositionOne = await tokenMinter.balanceOf(seller, shortTokenIdOne)
            const sellerBalancePositionTwo = await tokenMinter.balanceOf(seller, shortTokenIdTwo)
            assert.equal(sellerBalancePortfolioOne, 0, 'Seller portfolio one balance is wrong')
            assert.equal(sellerBalancePortfolioTwo, 1, 'Seller portfolio two balance is wrong')
            assert.equal(sellerBalancePositionOne, 1, 'Seller position one balance is wrong')
            assert.equal(sellerBalancePositionTwo, 0, 'Seller position two balance is wrong')
        })

        it('should successfully recompose from position with two tokens to three tokens and different ratio', async () => {
            await tokenMinter.mint(buyer, seller, hashThree, 1, { from: core })
            
            const gasOne = await tokenMinter.recompose.estimateGas(
                portfolioHashBuyerTwo,
                [ longTokenIdOne, longTokenIdTwo ],
                [ 1, 1 ],
                [ longTokenIdOne, longTokenIdTwo, longTokenIdThree ],
                [ 2, 1, 1 ],
                1,
                { from: buyer }
            )
            console.log('Gas used during recomposing =', gasOne)
            await tokenMinter.recompose(
                portfolioHashBuyerTwo,
                [ longTokenIdOne, longTokenIdTwo ],
                [ 1, 1 ],
                [ longTokenIdOne, longTokenIdTwo, longTokenIdThree ],
                [ 2, 1, 1 ],
                1,
                { from: buyer }
            )

            portfolioHashBuyerThree = calculatePortfolioId([ longTokenIdOne, longTokenIdTwo, longTokenIdThree ], [ 2, 1, 1 ])
                
            const buyerBalancePortfolioOne = await tokenMinter.balanceOf(buyer, portfolioHashBuyerOne)
            const buyerBalancePortfolioTwo = await tokenMinter.balanceOf(buyer, portfolioHashBuyerTwo)
            const buyerBalancePortfolioThree = await tokenMinter.balanceOf(buyer, portfolioHashBuyerThree)

            const buyerBalancePositionOne = await tokenMinter.balanceOf(buyer, longTokenIdOne)
            const buyerBalancePositionTwo = await tokenMinter.balanceOf(buyer, longTokenIdTwo)
            const buyerBalancePositionThree = await tokenMinter.balanceOf(buyer, longTokenIdTwo)

            assert.equal(buyerBalancePortfolioOne, 0, 'Buyer portfolio one balance is wrong')
            assert.equal(buyerBalancePortfolioTwo, 0, 'Buyer portfolio two balance is wrong')
            assert.equal(buyerBalancePortfolioThree, 1, 'Buyer portfolio three balance is wrong')

            assert.equal(buyerBalancePositionOne, 0, 'Buyer position one balance is wrong')
            assert.equal(buyerBalancePositionTwo, 0, 'Buyer position two balance is wrong')
            assert.equal(buyerBalancePositionThree, 0, 'Buyer position three balance is wrong')


            const gasTwo = await tokenMinter.recompose.estimateGas(
                portfolioHashSellerTwo,
                [ shortTokenIdOne, shortTokenIdTwo ],
                [ 1, 1 ],
                [ shortTokenIdOne, shortTokenIdTwo, shortTokenIdThree ],
                [ 2, 1, 1 ],
                1,
                { from: seller }
            )
            console.log('Gas used during recomposing =', gasTwo)
            await tokenMinter.recompose(
                portfolioHashSellerTwo,
                [ shortTokenIdOne, shortTokenIdTwo ],
                [ 1, 1 ],
                [ shortTokenIdOne, shortTokenIdTwo, shortTokenIdThree ],
                [ 2, 1, 1 ],
                1,
                { from: seller }
            )

            portfolioHashSellerThree = calculatePortfolioId([ shortTokenIdOne, shortTokenIdTwo, shortTokenIdThree ], [ 2, 1, 1 ])

            const sellerBalancePortfolioOne = await tokenMinter.balanceOf(seller, portfolioHashSellerOne)
            const sellerBalancePortfolioTwo = await tokenMinter.balanceOf(seller, portfolioHashSellerTwo)
            const sellerBalancePortfolioThree = await tokenMinter.balanceOf(seller, portfolioHashSellerThree)

            const sellerBalancePositionOne = await tokenMinter.balanceOf(seller, shortTokenIdOne)
            const sellerBalancePositionTwo = await tokenMinter.balanceOf(seller, shortTokenIdTwo)
            const sellerBalancePositionThree = await tokenMinter.balanceOf(seller, shortTokenIdThree)

            assert.equal(sellerBalancePortfolioOne, 0, 'Seller portfolio one balance is wrong')
            assert.equal(sellerBalancePortfolioTwo, 0, 'Seller portfolio two balance is wrong')
            assert.equal(sellerBalancePortfolioThree, 1, 'Seller portfolio three balance is wrong')

            assert.equal(sellerBalancePositionOne, 0, 'Seller position one balance is wrong')
            assert.equal(sellerBalancePositionTwo, 0, 'Seller position two balance is wrong')
            assert.equal(sellerBalancePositionThree, 0, 'Seller position three balance is wrong')
        })
    })

    context('Founded bugs', () => {
        it('should restrict composition with not unique tokenIds', async () => {
            await tokenMinter.mint(buyer, seller, hashOne, 1, { from: core })
            await tokenMinter.mint(buyer, seller, hashTwo, 1, { from: core })

            const oneTwoPortfolioId = calculatePortfolioId([
                longTokenIdOne, longTokenIdTwo
            ], [
                1, 1
            ])

            await tokenMinter.compose(
                [ longTokenIdOne, longTokenIdTwo ],
                [ 1, 1 ],
                1,
                { from: buyer }
            )

            try {
                await tokenMinter.recompose(
                    oneTwoPortfolioId,
                    [ longTokenIdOne, longTokenIdTwo ],
                    [ 1, 1 ],
                    [ longTokenIdOne, longTokenIdOne, longTokenIdTwo, longTokenIdTwo ],
                    [ 1, 1, 1, 1 ],
                    1,
                    { from: buyer }
                )
                throw null
            } catch (e) {
                assert.ok(e.message.match(/TOKEN_MINTER:TOKEN_IDS_NOT_UNIQUE/), 'TOKEN_MINTER:TOKEN_IDS_NOT_UNIQUE')
            }
        })
    })
})
