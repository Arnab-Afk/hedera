// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WispToken
 * @dev  $WISP ERC-20 utility token with a fixed maximum supply.
 *       Tokens are minted on demand by WispCore as streak rewards
 *       and are redeemable at partnered eco-merchants.
 *
 *       Fixed supply cap: 100,000,000 $WISP (8 decimals).
 *       Minting is restricted to the WispCore contract address.
 */
contract WispToken is ERC20, Ownable {

    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e8; // 100M with 8 decimals

    // Allocation constants
    uint256 public constant REWARDS_ALLOCATION   = (MAX_SUPPLY * 70) / 100; // 70%
    uint256 public constant TEAM_ALLOCATION      = (MAX_SUPPLY * 15) / 100; // 15%
    uint256 public constant MERCHANT_ALLOCATION  = (MAX_SUPPLY * 10) / 100; // 10%
    uint256 public constant COMMUNITY_ALLOCATION = (MAX_SUPPLY * 5)  / 100; // 5%

    uint256 public rewardsMinted;
    address public wispCore;

    event RewardMinted(address indexed to, uint256 amount);

    constructor(
        address teamWallet,
        address merchantWallet,
        address communityWallet
    ) ERC20("Wisp Token", "WISP") Ownable(msg.sender) {
        // Mint fixed allocations at deployment
        _mint(teamWallet,      TEAM_ALLOCATION);
        _mint(merchantWallet,  MERCHANT_ALLOCATION);
        _mint(communityWallet, COMMUNITY_ALLOCATION);
    }

    /**
     * @notice Mint $WISP reward tokens to a user.
     *         Only callable by the WispCore contract.
     * @param  to     Recipient wallet address
     * @param  amount Token amount (with 8 decimals)
     */
    function mintReward(address to, uint256 amount) external {
        require(msg.sender == wispCore, "WispToken: caller is not WispCore");
        require(rewardsMinted + amount <= REWARDS_ALLOCATION, "WispToken: rewards allocation exhausted");

        rewardsMinted += amount;
        _mint(to, amount);

        emit RewardMinted(to, amount);
    }

    /**
     * @dev Override decimals to use 8 (matching HTS convention).
     */
    function decimals() public pure override returns (uint8) {
        return 8;
    }

    function setWispCore(address addr) external onlyOwner { wispCore = addr; }

    function remainingRewards() external view returns (uint256) {
        return REWARDS_ALLOCATION - rewardsMinted;
    }
}
