pragma solidity 0.5.7;

import "./WhitelistedWithGovernance.sol";

/// @notice Opium.Lib.WhitelistedWithGovernanceAndChangableTimelock contract implements Opium.Lib.WhitelistedWithGovernance and adds possibility for governor to change timelock interval within timelock interval
contract WhitelistedWithGovernanceAndChangableTimelock is WhitelistedWithGovernance {
    // Emitted when new timelock is proposed
    event Proposed(uint256 timelock);
    // Emitted when new timelock is committed (set)
    event Committed(uint256 timelock);

    // Timestamp of last timelock proposal
    uint256 public timeLockProposalTime;
    // Proposed timelock
    uint256 public proposedTimeLock;

    /// @notice Calling this function governor could propose new timelock
    /// @param _timelock uint256 New timelock value
    function proposeTimelock(uint256 _timelock) public onlyGovernor {
        timeLockProposalTime = now;
        proposedTimeLock = _timelock;
        emit Proposed(_timelock);
    }

    /// @notice Calling this function governor could commit previously proposed new timelock if timelock interval of proposal was passed
    function commitTimelock() public onlyGovernor {
        // Check if proposal was made
        require(timeLockProposalTime != 0, "Didn't proposed yet");
        // Check if timelock interval was passed
        require((timeLockProposalTime + timeLockInterval) < now, "Can't commit yet");
        
        // Set new timelock and emit event
        timeLockInterval = proposedTimeLock;
        emit Committed(proposedTimeLock);

        // Reset timelock time lock
        timeLockProposalTime = 0;
    }
}
