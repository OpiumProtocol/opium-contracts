pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "../Interface/IDerivativeLogic.sol";

import "../Helpers/ExecutableByThirdParty.sol";
import "../Helpers/HasCommission.sol";

contract DummySyntheticIdMock is IDerivativeLogic, ExecutableByThirdParty, HasCommission {
    using SafeMath for uint256;
    
    constructor() public {
        /*
        {
            "author": "opium.team",
            "type": "synthetic",
            "subtype": "none",
            "description": "Dummy synthetic for testing purposes"
        }
        */
        emit MetadataSet("{\"author\":\"opium.team\",\"type\":\"synthetic\",\"subtype\":\"none\",\"description\":\"Dummy synthetic for testing purposes\"}");
    }

    function validateInput(Derivative memory _derivative) public view returns (bool) {
        _derivative;
        return true;
    }

    function getMargin(Derivative memory _derivative) public view returns (uint256 buyerMargin, uint256 sellerMargin) {
        buyerMargin = _derivative.margin;
        sellerMargin = _derivative.margin;
    }

    function getExecutionPayout(Derivative memory _derivative, uint256 _result)	public view returns (uint256 buyerPayout, uint256 sellerPayout) {
        buyerPayout = _derivative.margin;
        sellerPayout = _derivative.margin;
        _result;
    }

    function isPool() public view returns (bool) {
        return false;
    }
}