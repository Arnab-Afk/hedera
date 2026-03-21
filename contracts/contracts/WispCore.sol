// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IWispSpirit {
    function evolve(address user, uint8 stage) external;
}

interface IWispToken {
    function mintReward(address to, uint256 amount) external;
}

/**
 * @title WispCore
 * @dev  Main orchestration contract for the Wisp eco-companion.
 *       Processes anonymized green action proofs submitted from the
 *       off-chain privacy layer, updates streak state, triggers NFT
 *       evolution milestones, and distributes $WISP token rewards.
 *
 *       Privacy guarantee: this contract never stores PII. It only
 *       holds an action category enum, a proof hash, and a timestamp.
 */
contract WispCore is Ownable, ReentrancyGuard {

    // ── Structs ───────────────────────────────────────────────────────────────

    struct UserState {
        uint32  currentStreak;   // Active daily streak count
        uint32  longestStreak;   // Historical best streak
        uint32  totalActions;    // Cumulative verified actions
        uint64  lastActionDay;   // Unix day number of last action (block.timestamp / 86400)
        bool    active;
    }

    // ── Events ────────────────────────────────────────────────────────────────

    event ActionVerified(
        address indexed user,
        bytes32 indexed proofHash,
        string  category,
        uint32  streak,
        uint256 wispEarned
    );

    event StreakBroken(address indexed user, uint32 finalStreak);
    event MilestoneReached(address indexed user, uint32 milestone);

    // ── State ─────────────────────────────────────────────────────────────────

    mapping(address => UserState)    public userStates;
    mapping(bytes32 => bool)         public usedProofs;   // replay protection

    IWispSpirit public wispSpirit;
    IWispToken  public wispToken;

    uint256 public constant BASE_REWARD = 1e8; // 1 $WISP with 8 decimals

    // Streak milestones that trigger NFT evolution (days)
    uint32[] public milestones = [7, 14, 30, 60, 90, 180, 365];

    // ── Constructor ───────────────────────────────────────────────────────────

    constructor(address spiritAddress, address tokenAddress) Ownable(msg.sender) {
        wispSpirit = IWispSpirit(spiritAddress);
        wispToken  = IWispToken(tokenAddress);
    }

    // ── Core Logic ────────────────────────────────────────────────────────────

    /**
     * @notice Process a verified green action proof.
     * @param  proofHash  sha256 hash of the anonymized proof (for replay protection)
     * @param  category   Green action category string (e.g. "public_transit")
     * @param  daySeq     Streak day sequence number from the local agent
     */
    function processVerifiedAction(
        bytes32 proofHash,
        string calldata category,
        uint32 daySeq
    ) external nonReentrant {
        require(!usedProofs[proofHash], "WispCore: proof already used");
        usedProofs[proofHash] = true;

        UserState storage state = userStates[msg.sender];
        uint64 todayDay = uint64(block.timestamp / 86400);

        // ── Streak evaluation ─────────────────────────────────────────────────
        if (!state.active) {
            // First ever action
            state.active = true;
            state.currentStreak = 1;
        } else if (todayDay == state.lastActionDay) {
            // Already acted today — don't double-count streak, but reward
            // (prevents gaming by submitting multiple actions on the same day)
        } else if (todayDay == state.lastActionDay + 1) {
            // Consecutive day
            state.currentStreak += 1;
        } else {
            // Gap detected — streak is broken
            emit StreakBroken(msg.sender, state.currentStreak);
            state.currentStreak = 1;
        }

        if (state.currentStreak > state.longestStreak) {
            state.longestStreak = state.currentStreak;
        }

        state.lastActionDay = todayDay;
        state.totalActions += 1;

        // ── Reward calculation ────────────────────────────────────────────────
        uint256 reward = _calculateReward(state.currentStreak);

        // ── Milestone check ───────────────────────────────────────────────────
        _checkMilestone(state.currentStreak);

        // ── Distribute $WISP ──────────────────────────────────────────────────
        wispToken.mintReward(msg.sender, reward);

        emit ActionVerified(msg.sender, proofHash, category, state.currentStreak, reward);
    }

    // ── Internal Helpers ──────────────────────────────────────────────────────

    function _calculateReward(uint32 streak) internal pure returns (uint256) {
        // Streak multiplier: 1.0x at day 1, 2.5x at day 30+
        uint256 cappedStreak = streak > 30 ? 30 : streak;
        // Scale: BASE_REWARD * (1 + (1.5 * streak/30)) = BASE_REWARD * (30 + 1.5*streak) / 30
        return (BASE_REWARD * (30 + (15 * cappedStreak / 10))) / 30;
    }

    function _checkMilestone(uint32 streak) internal {
        for (uint i = 0; i < milestones.length; i++) {
            if (streak == milestones[i]) {
                emit MilestoneReached(msg.sender, streak);
                // Trigger NFT evolution (stage = milestone index)
                wispSpirit.evolve(msg.sender, uint8(i));
                break;
            }
        }
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    function setWispSpirit(address addr) external onlyOwner { wispSpirit = IWispSpirit(addr); }
    function setWispToken(address addr)  external onlyOwner { wispToken  = IWispToken(addr); }

    function getUserState(address user) external view returns (UserState memory) {
        return userStates[user];
    }
}
