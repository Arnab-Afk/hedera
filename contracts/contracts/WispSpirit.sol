// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WispSpirit
 * @dev  Dynamic NFT representing the user's eco-companion.
 *       Visual metadata URI updates are triggered by WispCore when
 *       streak milestones are reached. Each stage maps to a different
 *       IPFS-hosted image/animation set.
 *
 *       One NFT is minted per user wallet — soulbound after minting
 *       (non-transferable to preserve the personal streak identity).
 */
contract WispSpirit is ERC721, Ownable {

    // ── Events ────────────────────────────────────────────────────────────────
    event SpiritMinted(address indexed user, uint256 tokenId);
    event SpiritEvolved(uint256 indexed tokenId, uint8 stage, string newUri);

    // ── State ─────────────────────────────────────────────────────────────────
    uint256 private _nextTokenId = 1;

    // tokenId => current evolution stage (0 = seedling, 6 = legendary)
    mapping(uint256 => uint8) public evolutionStage;

    // tokenId => metadata URI (points to IPFS JSON for each stage)
    mapping(uint256 => string) private _tokenURIs;

    // wallet => tokenId (one spirit per wallet)
    mapping(address => uint256) public spiritOf;

    // stage index => base IPFS URI for that stage's metadata
    string[7] public stageBaseURIs;

    // Address of WispCore contract — only it may call evolve()
    address public wispCore;

    // ── Constructor ───────────────────────────────────────────────────────────

    constructor(string[7] memory _stageBaseURIs) ERC721("Wisp Spirit", "WSPRT") Ownable(msg.sender) {
        stageBaseURIs = _stageBaseURIs;
    }

    // ── Minting ───────────────────────────────────────────────────────────────

    /**
     * @notice Mint a Wisp Spirit NFT for a new user.
     *         Only callable by the contract owner (backend/admin on initial registration).
     * @param  to  Recipient wallet address
     */
    function mint(address to) external onlyOwner returns (uint256) {
        require(spiritOf[to] == 0, "WispSpirit: already has a spirit");

        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        spiritOf[to] = tokenId;

        _tokenURIs[tokenId] = stageBaseURIs[0]; // Start at seedling stage
        evolutionStage[tokenId] = 0;

        emit SpiritMinted(to, tokenId);
        return tokenId;
    }

    // ── Evolution ─────────────────────────────────────────────────────────────

    /**
     * @notice Evolve a user's spirit to the next stage.
     *         Called by WispCore at streak milestones.
     * @param  user   Wallet address whose spirit evolves
     * @param  stage  Target evolution stage (0-6)
     */
    function evolve(address user, uint8 stage) external {
        require(msg.sender == wispCore, "WispSpirit: caller is not WispCore");
        require(stage < 7, "WispSpirit: invalid stage");

        uint256 tokenId = spiritOf[user];
        require(tokenId != 0, "WispSpirit: no spirit found for user");

        evolutionStage[tokenId] = stage;
        string memory newUri = stageBaseURIs[stage];
        _tokenURIs[tokenId] = newUri;

        emit SpiritEvolved(tokenId, stage, newUri);
    }

    // ── Soulbound (non-transferable) ──────────────────────────────────────────

    function transferFrom(address, address, uint256) public pure override {
        revert("WispSpirit: Soulbound - non-transferable");
    }

    // ── Metadata ──────────────────────────────────────────────────────────────

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    function setWispCore(address addr) external onlyOwner { wispCore = addr; }

    function setStageBaseURI(uint8 stage, string calldata uri) external onlyOwner {
        require(stage < 7, "WispSpirit: invalid stage");
        stageBaseURIs[stage] = uri;
    }
}
