pragma solidity ^0.5.4;

contract ExecutableByThirdParty {
    mapping (address => bool) thirdpartyExecutionAllowance;

    function thirdpartyExecutionAllowed(address derivativeOwner) public view returns (bool) {
        return thirdpartyExecutionAllowance[derivativeOwner];
    }

    function allowThirdpartyExecution(bool allow) public {
        thirdpartyExecutionAllowance[msg.sender] = allow;
    }
}
