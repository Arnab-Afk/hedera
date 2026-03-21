// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WispToken is ERC20, Ownable {

    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e8;
    uint256 public constant REWARDS_ALLOCATION   = (MAX_SUPPLY * 70) / 100;
    uint256 public constant TEAM_ALLOCATION      = (MAX_SUPPLY * 15) / 100;
    uint256 public constant MERCHANT_ALLOCATION  = (MAX_SUPPLY * 10) / 100;
    uint256 public constant COMMUNITY_ALLOCATION = (MAX_SUPPLY * 5)  / 100;

    uint256 public rewardsMinted;
    address public wispCore;

    event RewardMinted(address indexed to, uint256 amount);

    constructor(address teamWallet, address merchantWallet, address communityWallet) ERC20("Wisp Token", "WISP") {
        _mint(teamWallet, TEAM_ALLOCATION);
        _mint(merchantWallet, MERCHANT_ALLOCATION);
        _mint(communityWallet, COMMUNITY_ALLOCATION);
    }

    function mintReward(address to, uint256 amount) external {
        require(msg.sender == wispCore, "WispToken: caller is not WispCore");
        require(rewardsMinted + amount <= REWARDS_ALLOCATION, "WispToken: rewards exhausted");
        rewardsMinted += amount;
        _mint(to, amount);
        emit RewardMinted(to, amount);
    }

    function decimals() public pure override returns (uint8) { return 8; }

    function setWispCore(address addr) external onlyOwner { wispCore = addr; }

    function remainingRewards() external view returns (uint256) {
        return REWARDS_ALLOCATION - rewardsMinted;
    }
}
