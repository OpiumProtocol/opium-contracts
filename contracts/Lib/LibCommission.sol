pragma solidity 0.5.16;

/// @title Opium.Lib.LibCommission contract defines constants for Opium commissions
contract LibCommission {
    // Represents 100% base for commissions calculation
    uint256 constant public COMMISSION_BASE = 10000;

    // Represents 100% base for Opium commission
    uint256 constant public OPIUM_COMMISSION_BASE = 10;

    // Represents which part of `syntheticId` author commissions goes to opium
    uint256 constant public OPIUM_COMMISSION_PART = 0;
}
