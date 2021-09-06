pragma solidity 0.5.16;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

interface IShortAggregatorInterface {
  function latestAnswer() external view returns (int256);
}

contract EthDaiChainlinkOracleSubId {
  using SafeMath for uint256;

  function getResult() public view returns (uint256) {
    uint256 daiEth = uint256(IShortAggregatorInterface(0x773616E4d11A78F511299002da57A0a94577F1f4).latestAnswer());

    return uint256(1e18).mul(1e18).div(daiEth); 
  }
}
