pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "../../Lib/LibEIP712.sol";

contract LibSwaprateOrder is LibEIP712 {
    struct SwaprateOrder {
        address syntheticId;
        address oracleId;
        address token;

        address makerAddress;
        address takerAddress;

        address senderAddress;

        address relayerAddress;
        address affiliateAddress;

        uint256 endTime;

        uint256 quantity;
        uint256 partialFill;

        uint256 param0;
        uint256 param1;
        uint256 param2;
        uint256 param3;
        uint256 param4;
        uint256 param5;
        uint256 param6;
        uint256 param7;
        uint256 param8;
        uint256 param9;

        uint256 relayerFee;
        uint256 affiliateFee;

        uint256 nonce;

        // Not used in hash
        bytes signature;
    }

    bytes32 constant internal EIP712_ORDER_TYPEHASH = keccak256(abi.encodePacked(
        "Order(",
        "address syntheticId,",
        "address oracleId,",
        "address token,",

        "address makerAddress,",
        "address takerAddress,",

        "address senderAddress,",

        "address relayerAddress,",
        "address affiliateAddress,",

        "uint256 endTime,",

        "uint256 quantity,",
        "uint256 partialFill,",

        "uint256 param0,",
        "uint256 param1,",
        "uint256 param2,",
        "uint256 param3,",
        "uint256 param4,",
        "uint256 param5,",
        "uint256 param6,",
        "uint256 param7,",
        "uint256 param8,",
        "uint256 param9,",

        "uint256 relayerFee,",
        "uint256 affiliateFee,",

        "uint256 nonce",
        ")"
    ));

    function hashOrder(SwaprateOrder memory _order) internal pure returns (bytes32 hash) {
        hash = keccak256(
            abi.encodePacked(
                abi.encodePacked(
                    EIP712_ORDER_TYPEHASH,
                    uint256(_order.syntheticId),
                    uint256(_order.oracleId),
                    uint256(_order.token),

                    uint256(_order.makerAddress),
                    uint256(_order.takerAddress),

                    uint256(_order.senderAddress),

                    uint256(_order.relayerAddress),
                    uint256(_order.affiliateAddress)
                ),
                abi.encodePacked(
                    _order.endTime,
                    _order.quantity,
                    _order.partialFill
                ),
                abi.encodePacked(
                    _order.param0,
                    _order.param1,
                    _order.param2,
                    _order.param3,
                    _order.param4
                ),
                abi.encodePacked(
                    _order.param5,
                    _order.param6,
                    _order.param7,
                    _order.param8,
                    _order.param9
                ),
                abi.encodePacked(
                    _order.relayerFee,
                    _order.affiliateFee,

                    _order.nonce
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