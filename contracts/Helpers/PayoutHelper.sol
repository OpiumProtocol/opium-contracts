pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

import "../Interface/IDerivativeLogic.sol";
import "../Lib/LibDerivative.sol";

contract PayoutHelper is LibDerivative {
    struct ExecutionPayout {
       uint256 buyerPayout;
       uint256 sellerPayout;
    }

    function getExecutionPayouts(Derivative memory _derivative, uint256[] memory _results)	public view returns (ExecutionPayout[] memory executionPayouts) {
        IDerivativeLogic logic = IDerivativeLogic(_derivative.syntheticId);

        executionPayouts = new ExecutionPayout[](_results.length);

        for (uint256 i = 0; i < _results.length; i++) {
            (uint256 buyerPayout, uint256 sellerPayout) = logic.getExecutionPayout(_derivative, _results[i]);
            executionPayouts[i] = ExecutionPayout(
                buyerPayout,
                sellerPayout
            );
        }
    }
}