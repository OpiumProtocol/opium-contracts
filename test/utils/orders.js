const { zeroAddress } = require('./addresses')
const signature = require('./signature')

const formOrderMessage = ({ order, match }) => {
    return {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'verifyingContract', type: 'address' },
            ],
            Order: [
                { name: 'makerMarginAddress', type: 'address' },
                { name: 'takerMarginAddress', type: 'address' },
          
                { name: 'makerAddress', type: 'address' },
                { name: 'takerAddress', type: 'address' },
          
                { name: 'senderAddress', type: 'address' },
          
                { name: 'relayerAddress', type: 'address' },
                { name: 'affiliateAddress', type: 'address' },
          
                { name: 'makerTokenId', type: 'uint256' },
                { name: 'makerTokenAmount', type: 'uint256' },
                { name: 'makerMarginAmount', type: 'uint256' },
                { name: 'takerTokenId', type: 'uint256' },
                { name: 'takerTokenAmount', type: 'uint256' },
                { name: 'takerMarginAmount', type: 'uint256' },
            
                { name: 'relayerFee', type: 'uint256' },
                { name: 'affiliateFee', type: 'uint256' },
            
                { name: 'nonce', type: 'uint256' },
                { name: 'expiresAt', type: 'uint256' },
            ],
        },
        domain: {
            name: 'Opium Network',
            version: '1',
            verifyingContract: match.address,
        },
        primaryType: 'Order',
        message: order,
    }
}

const orderFactory = async ({
    order,
    testToken,
    relayer,
    match,
    relayerFee = 0,
    affiliateFee = 0,
}) => {
    const def = {
        makerTokenId: 0,
        makerTokenAmount: 0,
        makerMarginAddress: testToken.address,
        makerMarginAmount: 0,
        takerTokenId: 0,
        takerTokenAmount: 0,
        takerMarginAddress: zeroAddress,
        takerMarginAmount: 0,
      
        nonce: 0,
        expiresAt: 0,

        makerAddress: zeroAddress,
        takerAddress: zeroAddress,

        relayerAddress: relayer,
        affiliateAddress: relayer,
        senderAddress: relayer,

        relayerFee,
        affiliateFee
    }

    const resultOrder = {
        ...def,
        ...order
    }

    resultOrder.signature = await signature.sign(resultOrder.makerAddress, formOrderMessage({ order: resultOrder, match }), resultOrder.makerAddress)

    return resultOrder
}

module.exports.orderFactory = orderFactory
