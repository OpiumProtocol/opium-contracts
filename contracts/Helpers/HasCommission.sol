pragma solidity ^0.5.4;

contract HasCommission {
    address public author;
    // 0.25%
    uint256 public commission = 25;

    constructor() public {
        author = msg.sender;
    }

    function getAuthorAddress() public view returns (address) {
        return author;
    }

    function getAuthorCommission() public view returns (uint256) {
        return commission;
    }
}
