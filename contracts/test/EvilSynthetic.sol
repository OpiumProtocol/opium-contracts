pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

import "../Interface/IDerivativeLogic.sol";

import "../Helpers/ExecutableByThirdParty.sol";

contract EvilSynthetic is IDerivativeLogic, ExecutableByThirdParty {
    function validateInput(Derivative memory) public view returns (bool) {
        return true;
    }
    
    function isPool() public view returns (bool) {
        return true;
    }
    
    function getMargin(Derivative memory) public view returns (uint, uint) {
        return (margin, margin);
    }
    
    function getExecutionPayout(Derivative memory, uint) public view returns (uint, uint) {
        return (0, 1);
    }
    
    function getAuthorAddress() public view returns (address) {
        return address(this);
    }
    
    function getAuthorCommission() public view returns (uint) {
        return 0;
    }
    
    uint margin = 0;
    
    function setMargin(uint margin_) public {
        margin = margin_;
    }
}
