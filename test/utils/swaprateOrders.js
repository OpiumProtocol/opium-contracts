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
                { name: 'syntheticId', type: 'address' },
                { name: 'oracleId', type: 'address' },
                { name: 'token', type: 'address' },
          
                { name: 'makerAddress', type: 'address' },
                { name: 'takerAddress', type: 'address' },
          
                { name: 'senderAddress', type: 'address' },
          
                { name: 'relayerAddress', type: 'address' },
                { name: 'affiliateAddress', type: 'address' },

                { name: 'feeTokenAddress', type: 'address' },
          
                { name: 'endTime', type: 'uint256' },

                { name: 'quantity', type: 'uint256' },
                { name: 'partialFill', type: 'uint256' },

                { name: 'param0', type: 'uint256' },
                { name: 'param1', type: 'uint256' },
                { name: 'param2', type: 'uint256' },
                { name: 'param3', type: 'uint256' },
                { name: 'param4', type: 'uint256' },
                { name: 'param5', type: 'uint256' },
                { name: 'param6', type: 'uint256' },
                { name: 'param7', type: 'uint256' },
                { name: 'param8', type: 'uint256' },
                { name: 'param9', type: 'uint256' },
            
                { name: 'relayerFee', type: 'uint256' },
                { name: 'affiliateFee', type: 'uint256' },
            
                { name: 'nonce', type: 'uint256' },
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
    relayer,
    match
}) => {
    const def = {
        syntheticId: zeroAddress,
        oracleId: zeroAddress,
        token: zeroAddress,

        makerAddress: zeroAddress,
        takerAddress: zeroAddress,

        senderAddress: relayer,
        
        relayerAddress: relayer,
        affiliateAddress: relayer,
        
        feeTokenAddress: zeroAddress,

        endTime: 0,

        quantity: 0,
        partialFill: 0,

        param0: 0,
        param1: 0,
        param2: 0,
        param3: 0,
        param4: 0,
        param5: 0,
        param6: 0,
        param7: 0,
        param8: 0,
        param9: 0,
    
        relayerFee: 0,
        affiliateFee: 0,

        nonce: 0,
    }

    const resultOrder = {
        ...def,
        ...order
    }

    resultOrder.signature = await signature.sign(resultOrder.makerAddress, formOrderMessage({ order: resultOrder, match }), resultOrder.makerAddress)

    return resultOrder
}

module.exports.orderFactory = orderFactory
