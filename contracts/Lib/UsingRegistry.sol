pragma solidity 0.5.16;

import "../Registry.sol";

import "../Errors/UsingRegistryErrors.sol";

/// @title Opium.Lib.UsingRegistry contract should be inherited by contracts, that are going to use Opium.Registry
contract UsingRegistry is UsingRegistryErrors {
    // Emitted when registry instance is set
    event RegistrySet(address registry);

    // Instance of Opium.Registry contract
    Registry internal registry;

    /// @notice This modifier restricts access to functions, which could be called only by Opium.Core
    modifier onlyCore() {
        require(msg.sender == registry.getCore(), ERROR_USING_REGISTRY_ONLY_CORE_ALLOWED);
        _;
    }

    /// @notice Defines registry instance and emits appropriate event
    constructor(address _registry) public {
        registry = Registry(_registry);
        emit RegistrySet(_registry);
    }

    /// @notice Getter for registry variable
    /// @return address Address of registry set in current contract
    function getRegistry() external view returns (address) {
        return address(registry);
    }
}
