pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "erc721o/contracts/Libs/LibPosition.sol";

import "../../Lib/usingRegistry.sol";
import "./LibOrder.sol";

import "../../Registry.sol";
import "../../Core.sol";
import "../../SyntheticAggregator.sol";

contract MatchLogic is LibOrder, usingRegistry, ReentrancyGuard {
    using SafeMath for uint256;
    using LibPosition for bytes32;

    event Canceled(bytes32 orderHash);

    // Base value for 100% value of token/margin amount
    uint256 public constant PERCENTAGE_BASE = 10**30;

    // If order was canceled
    mapping (bytes32 => bool) public canceled;

    // If order was verified
    mapping (bytes32 => bool) public verified;

    // Keeps orders filling percentage
    mapping (bytes32 => uint256) public filled;
    
    // Keeps balances of relayers and affiliates to withdraw
    mapping (address => uint256) public balances;

    // Keeps whether fee was already taken
    mapping (bytes32 => bool) public feeTaken;

    function cancel(Order memory _order) public {
        require(msg.sender == _order.makerAddress, "MATCH:CANCELLATION_NOT_ALLOWED");
        bytes32 orderHash = hashOrder(_order);
        require(!canceled[orderHash], "MATCH:ALREADY_CANCELED");
        canceled[orderHash] = true;

        emit Canceled(orderHash);
    }

    function withdraw() public nonReentrant {
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = 0;
        IERC20(registry.getWethAddress()).transfer(msg.sender, balance);
    }

    function validateCanceled(bytes32 _hash) internal view {
        require(!canceled[_hash], "MATCH:ORDER_WAS_CANCELED");
    }

    function validateTakerAddress(Order memory _leftOrder, Order memory _rightOrder) internal pure {
        require(
            _leftOrder.takerAddress == address(0) ||
            _leftOrder.takerAddress == _rightOrder.makerAddress,
            "MATCH:TAKER_ADDRESS_WRONG"
        );
    }

    function validateExpiration(Order memory _order) internal view {
        require(
            _order.expiresAt == 0 ||
            _order.expiresAt > now,
            "MATCH:ORDER_IS_EXPIRED"
        );
    }

    function validateSenderAddress(Order memory _order) internal view {
        // TODO: If we have Gateway, use tx.origin, see => https://ethereum.stackexchange.com/questions/43195/how-to-avoid-using-tx-origin-when-we-really-need-it
        require(
            _order.senderAddress == address(0) ||
            _order.senderAddress == msg.sender
        , "MATCH:SENDER_ADDRESS_WRONG");
    }

    function validateSignature(bytes32 orderHash, Order memory _order) internal {
        if (verified[orderHash]) {
            return;
        }

        bool result = verifySignature(orderHash, _order.signature, _order.makerAddress);

        require(result, "MATCH:SIGNATURE_NOT_VERIFIED");
        
        verified[orderHash] = true;
    }

    function takeFees(bytes32 _orderHash, Order memory _order) internal {
        if (feeTaken[_orderHash]) {
            return;
        }

        uint256 fees = _order.relayerFee.add(_order.affiliateFee);

        if (fees == 0) {
            return;
        }

        require(IERC20(registry.getWethAddress()).allowance(_order.makerAddress, registry.getTokenSpender()) >= fees, "MATCH:NOT_ENOUGH_ALLOWED_FEES");
        TokenSpender(registry.getTokenSpender()).claimTokens(IERC20(registry.getWethAddress()), _order.makerAddress, address(this), fees);

        if (_order.relayerAddress != address(0)) {
            balances[_order.relayerAddress] = balances[_order.relayerAddress].add(_order.relayerFee);
        } else {
            balances[registry.getOpiumAddress()] = balances[registry.getOpiumAddress()].add(_order.relayerFee);
        }

        if (_order.affiliateAddress != address(0)) {
            balances[_order.affiliateAddress] = balances[_order.affiliateAddress].add(_order.affiliateFee);
        } else {
            balances[registry.getOpiumAddress()] = balances[registry.getOpiumAddress()].add(_order.affiliateFee);
        }

        feeTaken[_orderHash] = true;
    }

    function min(uint256 _a, uint256 _b) internal pure returns (uint256) {
        return _a < _b ? _a : _b;
    }

    function getDivisionPercentage(uint256 _a, uint256 _b) internal pure returns (uint256) {
        return _a.mul(PERCENTAGE_BASE).div(_b);
    }

    function getInitialPercentageValue(uint256 _divisionPercentage, uint256 _b) internal pure returns (uint256) {
        return _divisionPercentage.mul(_b).div(PERCENTAGE_BASE);
    }
}
