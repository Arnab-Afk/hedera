// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IWispSpirit {
    function evolve(address user, uint8 stage) external;
}

interface IWispToken {
    function mintReward(address to, uint256 amount) external;
}

contract WispCore is Ownable, ReentrancyGuard {

    struct UserState {
        uint32 currentStreak;
        uint32 longestStreak;
        uint32 totalActions;
        uint64 lastActionDay;
        bool active;
    }

    event ActionVerified(address indexed user, bytes32 indexed proofHash, string category, uint32 streak, uint256 wispEarned);
    event StreakBroken(address indexed user, uint32 finalStreak);
    event MilestoneReached(address indexed user, uint32 milestone);

    mapping(address => UserState) public userStates;
    mapping(bytes32 => bool) public usedProofs;

    IWispSpirit public wispSpirit;
    IWispToken public wispToken;

    uint256 public constant BASE_REWARD = 1e8;
    uint32[] public milestones = [7, 14, 30, 60, 90, 180, 365];

    constructor(address spiritAddress, address tokenAddress) {
        wispSpirit = IWispSpirit(spiritAddress);
        wispToken = IWispToken(tokenAddress);
    }

    function processVerifiedAction(bytes32 proofHash, string calldata category, uint32 daySeq) external nonReentrant {
        require(!usedProofs[proofHash], "WispCore: proof already used");
        usedProofs[proofHash] = true;

        UserState storage state = userStates[msg.sender];
        uint64 todayDay = uint64(block.timestamp / 86400);

        if (!state.active) {
            state.active = true;
            state.currentStreak = 1;
        } else if (todayDay == state.lastActionDay) {
        } else if (todayDay == state.lastActionDay + 1) {
            state.currentStreak += 1;
        } else {
            emit StreakBroken(msg.sender, state.currentStreak);
            state.currentStreak = 1;
        }

        if (state.currentStreak > state.longestStreak) {
            state.longestStreak = state.currentStreak;
        }

        state.lastActionDay = todayDay;
        state.totalActions += 1;

        uint256 reward = _calculateReward(state.currentStreak);
        _checkMilestone(state.currentStreak);
        wispToken.mintReward(msg.sender, reward);

        emit ActionVerified(msg.sender, proofHash, category, state.currentStreak, reward);
    }

    function _calculateReward(uint32 streak) internal pure returns (uint256) {
        uint256 cappedStreak = streak > 30 ? 30 : streak;
        return (BASE_REWARD * (30 + (15 * cappedStreak / 10))) / 30;
    }

    function _checkMilestone(uint32 streak) internal {
        for (uint i = 0; i < milestones.length; i++) {
            if (streak == milestones[i]) {
                emit MilestoneReached(msg.sender, streak);
                wispSpirit.evolve(msg.sender, uint8(i));
                break;
            }
        }
    }

    function setWispSpirit(address addr) external onlyOwner { wispSpirit = IWispSpirit(addr); }
    function setWispToken(address addr) external onlyOwner { wispToken = IWispToken(addr); }
    function getUserState(address user) external view returns (UserState memory) { return userStates[user]; }
}
