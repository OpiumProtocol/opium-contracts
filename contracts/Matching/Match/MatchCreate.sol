pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "../../Lib/LibDerivative.sol";

import "../../Core.sol";
import "../../SyntheticAggregator.sol";

import "./MatchLogic.sol";

contract MatchCreate is MatchLogic, LibDerivative {
    event Create(bytes32 derivativeHash, address buyerPremiumAddress, uint256 buyerPremiumAmount, address sellerPremiumAddress, uint256 sellerPremiumAmount, uint256 filled);

    function create(Order memory _buyOrder, Order memory _sellOrder, Derivative memory _derivative, bool _buyerIsMaker) public nonReentrant {
        // PROBABLY TODO: Implement subtraction "Relayer" order and subtract before all

        // New deals must not offer tokenIds
        require(
            _buyOrder.makerTokenId == _sellOrder.makerTokenId &&
            _sellOrder.makerTokenId == 0,
            "MATCH:NOT_CREATION"
        );

        // Check if it's not pool
        require(!IDerivativeLogic(_derivative.syntheticId).isPool(), "MATCH:CANT_BE_POOL");

        // Validate taker if set
        validateTakerAddress(_buyOrder, _sellOrder);
        validateTakerAddress(_sellOrder, _buyOrder);

        // Validate sender if set
        validateSenderAddress(_buyOrder);
        validateSenderAddress(_sellOrder);

        // Validate expiration if set
        validateExpiration(_buyOrder);
        validateExpiration(_sellOrder);


        // Validate if was canceled
        // orderHashes[0] - buyOrderHash
        // orderHashes[1] - sellOrderHash
        bytes32[2] memory orderHashes;
        orderHashes[0] = hashOrder(_buyOrder);
        validateCanceled(orderHashes[0]);
        validateSignature(orderHashes[0], _buyOrder);

        orderHashes[1] = hashOrder(_sellOrder);
        validateCanceled(orderHashes[1]);
        validateSignature(orderHashes[1], _sellOrder);

        // Validates counterparty tokens
        // Calculates available premiums
        // margins[0] - buyerMargin
        // margins[1] - sellerMargin
        (uint256[2] memory margins, bytes32 derivativeHash) = _calculateDerivative(_buyOrder, _sellOrder, _derivative);

        // Premiums
        // premiums[0] - buyerReceivePremium
        // premiums[1] - sellerReceivePremium
        uint256[2] memory premiums;

        // If buyer requires premium on creation, should match with seller's margin address
        // If buyer requires premium on creation, seller should provide at least the same premium or more
        // Returns buyer's premium for each contract
        premiums[0] = _validatePremium(_buyOrder, _sellOrder, margins[1], _buyerIsMaker);

        // If seller requires premium on creation, should match with buyer's margin address
        // If seller requires premium on creation, buyer should provide at least the same premium or more
        // Returns seller's premium for each contract
        premiums[1] = _validatePremium(_sellOrder, _buyOrder, margins[0], !_buyerIsMaker);

        // Fill orders as much as possible
        // Returns available amount of positions to be filled
        uint256 fillPositions = _fillCreate(_buyOrder, orderHashes[0], _sellOrder, orderHashes[1]);

        // Take fees
        takeFees(orderHashes[0], _buyOrder);
        takeFees(orderHashes[1], _sellOrder);

        // Distribute margin and premium
        _distributeFunds(_buyOrder, _sellOrder, _derivative, margins, premiums, fillPositions);
        
        // Settle contracts
        Core(registry.getCore()).create(_derivative, fillPositions, [_buyOrder.makerAddress, _sellOrder.makerAddress]);
        
        emit Create(derivativeHash, _buyOrder.takerMarginAddress, premiums[0], _sellOrder.takerMarginAddress, premiums[1], fillPositions);
    }

    // PRIVATE FUNCTIONS

    function _fillCreate(Order memory _leftOrder, bytes32 _leftOrderHash, Order memory _rightOrder, bytes32 _rightOrderHash) private returns (uint256 fillPositions) {
        // Keep initial order values
        uint256 leftInitial = _leftOrder.takerTokenAmount;
        uint256 rightInitial = _rightOrder.takerTokenAmount;

        // Subtract already filled part
        uint256 leftAlreadyFilled = getInitialPercentageValue(filled[_leftOrderHash], _leftOrder.takerTokenAmount);
        uint256 rightAlreadyFilled = getInitialPercentageValue(filled[_rightOrderHash], _rightOrder.takerTokenAmount);

        (uint256 leftAvailable, uint256 rightAvailable) = (
            _leftOrder.takerTokenAmount.sub(leftAlreadyFilled), 
            _rightOrder.takerTokenAmount.sub(rightAlreadyFilled)
        );

        // We could only fill minimum available of both counterparties
        fillPositions = min(leftAvailable, rightAvailable);
        require(fillPositions > 0, "MATCH:NO_FILLABLE_POSITIONS");

        // Update filled
        filled[_leftOrderHash] = leftInitial == 0 ? PERCENTAGE_BASE : getDivisionPercentage(leftAlreadyFilled.add(fillPositions), leftInitial).add(1);
        filled[_rightOrderHash] = rightInitial == 0 ? PERCENTAGE_BASE : getDivisionPercentage(rightAlreadyFilled.add(fillPositions), rightInitial).add(1);
    }

    function _calculateDerivative(Order memory _buyOrder, Order memory _sellOrder, Derivative memory _derivative) private returns (uint256[2] memory margins, bytes32 derivativeHash) {
        // Calculate derivative related data for validation
        derivativeHash = getDerivativeHash(_derivative);
        uint256 longTokenId = derivativeHash.getLongTokenId();
        uint256 shortTokenId = derivativeHash.getShortTokenId();

        // New deals must request opposite position tokens
        require(
            _buyOrder.takerTokenId != _sellOrder.takerTokenId &&
            _buyOrder.takerTokenId == longTokenId &&
            _sellOrder.takerTokenId == shortTokenId,
            "MATCH:DERIVATIVE_NOT_MATCH"
        );

        // Get cached total margin required according to logic
        // margins[0] - buyerMargin
        // margins[1] - sellerMargin
        (margins[0], margins[1]) = SyntheticAggregator(registry.getSyntheticAggregator()).getMargin(derivativeHash, _derivative);
        
        // Validate that provided margin has the same currency that derivative
        require(
            margins[0] == 0 || _buyOrder.makerMarginAddress == _derivative.token
            , "MATCH:PROVIDED_MARGIN_CURRENCY_WRONG"
        );
        require(
            margins[1] == 0 || _sellOrder.makerMarginAddress == _derivative.token
            , "MATCH:PROVIDED_MARGIN_CURRENCY_WRONG"
        );

        // Validate that provided margin is enough for creating
        require(
            _buyOrder.makerMarginAmount >= _buyOrder.takerTokenAmount.mul(margins[0]) &&
            _sellOrder.makerMarginAmount >= _sellOrder.takerTokenAmount.mul(margins[1]),
            "MATCH:PROVIDED_MARGIN_NOT_ENOUGH"
        );
    }

    function _validatePremium(Order memory _leftOrder, Order memory _rightOrder, uint256 _rightOrderMargin, bool _leftIsMaker) private pure returns(uint256) {
        if (_leftOrder.takerMarginAmount == 0) {
            return 0; // leftReceivePremium is 0
        }

        require(
            _leftOrder.takerMarginAddress == _rightOrder.makerMarginAddress,
            "MATCH:MARGIN_ADDRESS_NOT_MATCH"
        );

        uint256 leftWantsPremium = _leftOrder.takerMarginAmount.div(_leftOrder.takerTokenAmount);
        uint256 rightOffersPremium = _rightOrder.makerMarginAmount.div(_rightOrder.takerTokenAmount).sub(_rightOrderMargin);
        require(
            leftWantsPremium <= rightOffersPremium,
            "MATCH:PREMIUM_IS_NOT_ENOUGH"
        );

        return _leftIsMaker ? leftWantsPremium : rightOffersPremium;
    }

    function _distributeFunds(Order memory _buyOrder, Order memory _sellOrder, Derivative memory _derivative, uint256[2] memory margins, uint256[2] memory premiums, uint256 fillPositions) private {
        IERC20 marginToken = IERC20(_derivative.token);

        // Transfer margin + premium from buyer to Match and distribute
        if (margins[0].add(premiums[1]) != 0) {
            // Check allowance for premiums + margins
            require(marginToken.allowance(_buyOrder.makerAddress, registry.getTokenSpender()) >= margins[0].add(premiums[1]).mul(fillPositions), "MATCH:NOT_ENOUGH_ALLOWED_MARGIN");

            if (premiums[1] != 0) {
                // Transfer premium to seller
                TokenSpender(registry.getTokenSpender()).claimTokens(marginToken, _buyOrder.makerAddress, _sellOrder.makerAddress, premiums[1].mul(fillPositions));
            }

            if (margins[0] != 0) {
                // Transfer margins from buyer to Match
                TokenSpender(registry.getTokenSpender()).claimTokens(marginToken, _buyOrder.makerAddress, address(this), margins[0].mul(fillPositions));
            }
        }
        
        // Transfer margin + premium from seller to Match and distribute
        if (margins[1].add(premiums[0]) != 0) {
            // Check allowance for premiums + margin
            require(marginToken.allowance(_sellOrder.makerAddress, registry.getTokenSpender()) >= margins[1].add(premiums[0]).mul(fillPositions), "MATCH:NOT_ENOUGH_ALLOWED_MARGIN");

            if (premiums[0] != 0) {
                // Transfer premium to buyer
                TokenSpender(registry.getTokenSpender()).claimTokens(marginToken, _sellOrder.makerAddress, _buyOrder.makerAddress, premiums[0].mul(fillPositions));
            }

            if (margins[1] != 0) {
                // Transfer margins from seller to Match
                TokenSpender(registry.getTokenSpender()).claimTokens(marginToken, _sellOrder.makerAddress, address(this), margins[1].mul(fillPositions));
            }
        }

        if (margins[0].add(margins[1]) != 0) {
            // Approve margin to Core for derivative creation
            require(marginToken.approve(registry.getTokenSpender(), margins[0].add(margins[1]).mul(fillPositions)), "MATCH:COULDNT_APPROVE_MARGIN_FOR_CORE");
        }
    }
}
