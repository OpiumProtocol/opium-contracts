pragma solidity 0.5.16;

import "../../Interface/IOracleId.sol";

interface IOracleAggregator {
  function __callback(uint256 timestamp, uint256 data) external;
  function hasData(address oracleId, uint256 timestamp) external view returns(bool result);
}

interface IOracleSubId {
  function getResult() external view returns (uint256);
}

contract OnchainSubIdsOracleId is IOracleId {
  event Provided(uint256 indexed timestamp, uint256 result);

  // Resolvers
  // Mapping timestamp => oracleSubId
  mapping (uint256 => address) public resolvers;

  // Opium
  IOracleAggregator public oracleAggregator;

  // Governance
  address private _owner;
  uint256 public EMERGENCY_PERIOD;

  modifier onlyOwner() {
    require(_owner == msg.sender, "N.O"); // N.O = not an owner
    _;
  }

  constructor(IOracleAggregator _oracleAggregator, uint256 _emergencyPeriod) public {
    // Opium
    oracleAggregator = _oracleAggregator;

    // Governance
    _owner = msg.sender;
    EMERGENCY_PERIOD = _emergencyPeriod;
    /*
    {
      "author": "Opium.Team",
      "description": "On-chain Universal Oracle",
      "asset": "Universal",
      "type": "onchain",
      "source": "subIds",
      "logic": "none",
      "path": "getResult()"
    }
    */
    emit MetadataSet("{\"author\":\"Opium.Team\",\"description\":\"On-chain Universal Oracle\",\"asset\":\"Universal\",\"type\":\"onchain\",\"source\":\"subIds\",\"logic\":\"none\",\"path\":\"getResult()\"}");
  }

  /** OPIUM INTERFACE */
  function fetchData(uint256 _timestamp) external payable {
    _timestamp;
    revert("N.S"); // N.S = not supported
  }

  function recursivelyFetchData(uint256 _timestamp, uint256 _period, uint256 _times) external payable {
    _timestamp;
    _period;
    _times;
    revert("N.S"); // N.S = not supported
  }

  function calculateFetchPrice() external returns (uint256) {
    return 0;
  }
  
  /** RESOLVER */
  function _callback(uint256 _timestamp) public {
    require(
      !oracleAggregator.hasData(address(this), _timestamp) &&
      _timestamp < now,
      "N.A" // N.A = Only when no data and after timestamp allowed
    );

    uint256 result = IOracleSubId(resolvers[_timestamp]).getResult();
    oracleAggregator.__callback(_timestamp, result);

    emit Provided(_timestamp, result);
  }

  function registerResolver(uint256 _timestamp, address _resolver) public {
    require(resolvers[_timestamp] == address(0), "O.R"); // O.R = already registered
    resolvers[_timestamp] = _resolver;
  }

  /** GOVERNANCE */
  /** 
    Emergency callback allows to push data manually in case EMERGENCY_PERIOD elapsed and no data were provided
   */
  function emergencyCallback(uint256 _timestamp, uint256 _result) public onlyOwner {
    require(
      !oracleAggregator.hasData(address(this), _timestamp) &&
      _timestamp + EMERGENCY_PERIOD  < now,
      "N.E" // N.E = Only when no data and after emergency period allowed
    );

    oracleAggregator.__callback(_timestamp, _result);

    emit Provided(_timestamp, _result);
  }
}
