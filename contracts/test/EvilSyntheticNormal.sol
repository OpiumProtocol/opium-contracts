pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

import "../Interface/IDerivativeLogic.sol";

import "../Helpers/ExecutableByThirdParty.sol";

contract EvilSyntheticNormal is IDerivativeLogic, ExecutableByThirdParty {
    uint margin = 0;

    uint256 buyerPayout;
    uint256 sellerPayout = 0;

    function validateInput(Derivative memory) public view returns (bool) {
        return true;
    }
    
    function isPool() public view returns (bool) {
        return false;
    }
    
    function getMargin(Derivative memory) public view returns (uint, uint) {
        return (margin, margin);
    }
    
    function getExecutionPayout(Derivative memory, uint) public view returns (uint, uint) {
        return (buyerPayout, sellerPayout);
    }
    
    function getAuthorAddress() public view returns (address) {
        return address(this);
    }
    
    function getAuthorCommission() public view returns (uint) {
        return 0;
    }
    
    
    function setMargin(uint margin_) public {
        margin = margin_;
        buyerPayout = margin * 2;
    }


    function overrideBuyerExecutionPayout() external {
        buyerPayout = 0;
        sellerPayout = margin * 2;
    }
}
