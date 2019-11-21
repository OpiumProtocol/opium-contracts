pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "./LibEIP712.sol";

contract LibOrder is LibEIP712 {
    struct Order {
        address makerMarginAddress;
        address takerMarginAddress;

        address makerAddress;
        address takerAddress;

        address senderAddress;

        address relayerAddress;
        address affiliateAddress;

        uint256 makerTokenId;
        uint256 makerTokenAmount;
        uint256 makerMarginAmount;
        uint256 takerTokenId;
        uint256 takerTokenAmount;
        uint256 takerMarginAmount;

        uint256 relayerFee;
        uint256 affiliateFee;

        uint256 nonce;
        uint256 expiresAt;

        // Not used in hash
        bytes signature;
    }

    bytes32 constant internal EIP712_ORDER_TYPEHASH = keccak256(abi.encodePacked(
        "Order(",
        "address makerMarginAddress,",
        "address takerMarginAddress,",

        "address makerAddress,",
        "address takerAddress,",

        "address senderAddress,",

        "address relayerAddress,",
        "address affiliateAddress,",

        "uint256 makerTokenId,",
        "uint256 makerTokenAmount,",
        "uint256 makerMarginAmount,",
        "uint256 takerTokenId,",
        "uint256 takerTokenAmount,",
        "uint256 takerMarginAmount,",
        
        "uint256 relayerFee,",
        "uint256 affiliateFee,",

        "uint256 nonce,",
        "uint256 expiresAt",
        ")"
    ));

    function hashOrder(Order memory _order) internal pure returns (bytes32 hash) {
        hash = keccak256(
            abi.encodePacked(
                abi.encodePacked(
                    EIP712_ORDER_TYPEHASH,
                    uint256(_order.makerMarginAddress),
                    uint256(_order.takerMarginAddress),

                    uint256(_order.makerAddress),
                    uint256(_order.takerAddress),

                    uint256(_order.senderAddress),

                    uint256(_order.relayerAddress),
                    uint256(_order.affiliateAddress)
                ),
                abi.encodePacked(
                    _order.makerTokenId,
                    _order.makerTokenAmount,
                    _order.makerMarginAmount,
                    _order.takerTokenId,
                    _order.takerTokenAmount,
                    _order.takerMarginAmount
                ),
                abi.encodePacked(
                    _order.relayerFee,
                    _order.affiliateFee,

                    _order.nonce,
                    _order.expiresAt
                )
            )
        );
    }

    function verifySignature(bytes32 _hash, bytes memory _signature, address _address) internal view returns (bool) {
        require(_signature.length == 65, "ORDER:INVALID_SIGNATURE_LENGTH");

        bytes32 digest = hashEIP712Message(_hash);
        address recovered = retrieveAddress(digest, _signature);
        return _address == recovered;
    }

    function retrieveAddress(bytes32 _hash, bytes memory _signature) private pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Divide the signature in r, s and v variables
        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            // solium-disable-next-line arg-overflow
            return ecrecover(_hash, v, r, s);
        }
    }
}