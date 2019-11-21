pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "../../Lib/LibDerivative.sol";

import "../../Core.sol";
import "../../SyntheticAggregator.sol";

import "./SwaprateMatchBase.sol";

contract SwaprateMatch is SwaprateMatchBase, LibDerivative {

    // Keeps orders filling percentage
    mapping (bytes32 => uint256) filled;

    constructor (address _registry) public usingRegistry(_registry) {}
    
    function create(SwaprateOrder memory _leftOrder, SwaprateOrder memory _rightOrder, Derivative memory _derivative) public nonReentrant {
        // PROBABLY TODO: Implement subtraction "Relayer" order and subtract before all

        // New deals must not offer tokenIds
        require(
            _leftOrder.syntheticId == _rightOrder.syntheticId,
            "MATCH:NOT_CREATION"
        );

        // Check if it's not pool
        require(!IDerivativeLogic(_derivative.syntheticId).isPool(), "MATCH:CANT_BE_POOL");

        // Validate taker if set
        validateTakerAddress(_leftOrder, _rightOrder);
        validateTakerAddress(_rightOrder, _leftOrder);

        // Validate sender if set
        validateSenderAddress(_leftOrder);
        validateSenderAddress(_rightOrder);

        // Validate if was canceled
        // orderHashes[0] - leftOrderHash
        // orderHashes[1] - rightOrderHash
        bytes32[2] memory orderHashes;
        orderHashes[0] = hashOrder(_leftOrder);
        validateCanceled(orderHashes[0]);
        validateSignature(orderHashes[0], _leftOrder);

        orderHashes[1] = hashOrder(_rightOrder);
        validateCanceled(orderHashes[1]);
        validateSignature(orderHashes[1], _rightOrder);

        // Validates counterparty tokens
        // Calculates available premiums
        // margins[0] - leftMargin
        // margins[1] - rightMargin
        (uint256[2] memory margins, ) = _calculateDerivative(_derivative);

        // Check fillability
        uint256 fillable = _checkFillability(orderHashes[0], _leftOrder, orderHashes[1], _rightOrder);

        // Verify derivative params
        _verifyDerivative(_leftOrder, _rightOrder, _derivative);

        // Take fees
        takeFees(orderHashes[0], _leftOrder);
        takeFees(orderHashes[1], _rightOrder);

        // Send margin to Core
        _distributeFunds(_leftOrder, _rightOrder, _derivative, margins, fillable);
        
        // Settle contracts
        Core(registry.getCore()).create(_derivative, fillable, [_leftOrder.makerAddress, _rightOrder.makerAddress]);
    }

    // PRIVATE FUNCTIONS

    function _checkFillability(bytes32 _leftOrderHash, SwaprateOrder memory _leftOrder, bytes32 _rightOrderHash, SwaprateOrder memory _rightOrder) private returns (uint256 fillable) {
        uint256 leftAvailable = _leftOrder.quantity.sub(filled[_leftOrderHash]);
        uint256 rightAvailable = _rightOrder.quantity.sub(filled[_rightOrderHash]);

        require(leftAvailable != 0 && rightAvailable !=0, "MATCH:NO_AVAILABLE");

        fillable = min(leftAvailable, rightAvailable);

        if (_leftOrder.partialFill == 0 && _rightOrder.partialFill == 0) {
            require(_leftOrder.quantity == _rightOrder.quantity, "MATCH:FULL_FILL_NOT_POSSIBLE");
        } else if (_leftOrder.partialFill == 0 && _rightOrder.partialFill == 1) {
            require(_leftOrder.quantity <= rightAvailable, "MATCH:FULL_FILL_NOT_POSSIBLE");
        } else if (_leftOrder.partialFill == 1 && _rightOrder.partialFill == 0) {
            require(leftAvailable >= _rightOrder.quantity, "MATCH:FULL_FILL_NOT_POSSIBLE");
        }

        filled[_leftOrderHash] = filled[_leftOrderHash].add(fillable);
        filled[_rightOrderHash] = filled[_rightOrderHash].add(fillable);
    }

    function _verifyDerivative(SwaprateOrder memory _leftOrder, SwaprateOrder memory _rightOrder, Derivative memory _derivative) private pure {
        string memory orderError = "MATCH:DERIVATIVE_PARAM_IS_WRONG";

        // Validate derivative endTime
        require(
            _derivative.endTime == _leftOrder.endTime &&
            _derivative.endTime == _rightOrder.endTime,
            orderError
        );

        // Validate derivative syntheticId
        require(
            _derivative.syntheticId == _leftOrder.syntheticId &&
            _derivative.syntheticId == _rightOrder.syntheticId,
            orderError
        );

        // Validate derivative oracleId
        require(
            _derivative.oracleId == _leftOrder.oracleId &&
            _derivative.oracleId == _rightOrder.oracleId,
            orderError
        );

        // Validate derivative token
        require(
            _derivative.token == _leftOrder.token &&
            _derivative.token == _rightOrder.token,
            orderError
        );

        // Validate derivative params
        require(_derivative.params.length >= 20, "MATCH:DERIVATIVE_PARAMS_LENGTH_IS_WRONG");

        // Validate left order params
        require(_leftOrder.param0 == _derivative.params[0], orderError);
        require(_leftOrder.param1 == _derivative.params[1], orderError);
        require(_leftOrder.param2 == _derivative.params[2], orderError);
        require(_leftOrder.param3 == _derivative.params[3], orderError);
        require(_leftOrder.param4 == _derivative.params[4], orderError);
        require(_leftOrder.param5 == _derivative.params[5], orderError);
        require(_leftOrder.param6 == _derivative.params[6], orderError);
        require(_leftOrder.param7 == _derivative.params[7], orderError);
        require(_leftOrder.param8 == _derivative.params[8], orderError);
        require(_leftOrder.param9 == _derivative.params[9], orderError);

        // Validate right order params
        require(_rightOrder.param0 == _derivative.params[10], orderError);
        require(_rightOrder.param1 == _derivative.params[11], orderError);
        require(_rightOrder.param2 == _derivative.params[12], orderError);
        require(_rightOrder.param3 == _derivative.params[13], orderError);
        require(_rightOrder.param4 == _derivative.params[14], orderError);
        require(_rightOrder.param5 == _derivative.params[15], orderError);
        require(_rightOrder.param6 == _derivative.params[16], orderError);
        require(_rightOrder.param7 == _derivative.params[17], orderError);
        require(_rightOrder.param8 == _derivative.params[18], orderError);
        require(_rightOrder.param9 == _derivative.params[19], orderError);
    }

    function _calculateDerivative(Derivative memory _derivative) private returns (uint256[2] memory margins, bytes32 derivativeHash) {
        // Calculate derivative related data for validation
        derivativeHash = getDerivativeHash(_derivative);

        // Get cached total margin required according to logic
        // margins[0] - leftMargin
        // margins[1] - rightMargin
        (margins[0], margins[1]) = SyntheticAggregator(registry.getSyntheticAggregator()).getMargin(derivativeHash, _derivative);
    }

    function _distributeFunds(SwaprateOrder memory _leftOrder, SwaprateOrder memory _rightOrder, Derivative memory _derivative, uint256[2] memory margins, uint256 _fillable) private {
        IERC20 marginToken = IERC20(_derivative.token);

        // Transfer margin from left to Match and send to Core
        if (margins[0] != 0) {
            // Check allowance for margins
            require(marginToken.allowance(_leftOrder.makerAddress, registry.getTokenSpender()) >= margins[0].mul(_fillable), "MATCH:NOT_ENOUGH_ALLOWED_MARGIN");

            // Transfer margins from buyer to Match
            TokenSpender(registry.getTokenSpender()).claimTokens(marginToken, _leftOrder.makerAddress, address(this), margins[0].mul(_fillable));
        }
        
        // Transfer margin from right to Match and send to Core
        if (margins[1] != 0) {
            // Check allowance for premiums + margin
            require(marginToken.allowance(_rightOrder.makerAddress, registry.getTokenSpender()) >= margins[1].mul(_fillable), "MATCH:NOT_ENOUGH_ALLOWED_MARGIN");

            // Transfer margins from seller to Match
            TokenSpender(registry.getTokenSpender()).claimTokens(marginToken, _rightOrder.makerAddress, address(this), margins[1].mul(_fillable));
        }

        if (margins[0].add(margins[1]) != 0) {
            // Approve margin to Core for derivative creation
            require(marginToken.approve(registry.getTokenSpender(), margins[0].add(margins[1]).mul(_fillable)), "MATCH:COULDNT_APPROVE_MARGIN_FOR_CORE");
        }
    }
}
