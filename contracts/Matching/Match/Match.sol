pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "./MatchCreate.sol";
import "./MatchSwap.sol";

contract Match is MatchCreate, MatchSwap {
    constructor (address _registry) public usingRegistry(_registry) {}
}
