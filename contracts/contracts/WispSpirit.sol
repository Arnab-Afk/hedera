// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WispSpirit is ERC721, Ownable {

    event SpiritMinted(address indexed user, uint256 tokenId);
    event SpiritEvolved(uint256 indexed tokenId, uint8 stage, string newUri);

    uint256 private _nextTokenId = 1;

    mapping(uint256 => uint8) public evolutionStage;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) public spiritOf;

    string[7] public stageBaseURIs;
    address public wispCore;

    constructor(string[7] memory _stageBaseURIs) ERC721("Wisp Spirit", "WSPRT") {
        stageBaseURIs = _stageBaseURIs;
    }

    function mint(address to) external onlyOwner returns (uint256) {
        require(spiritOf[to] == 0, "WispSpirit: already has a spirit");
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        spiritOf[to] = tokenId;
        _tokenURIs[tokenId] = stageBaseURIs[0];
        evolutionStage[tokenId] = 0;
        emit SpiritMinted(to, tokenId);
        return tokenId;
    }

    function evolve(address user, uint8 stage) external {
        require(msg.sender == wispCore, "WispSpirit: caller is not WispCore");
        require(stage < 7, "WispSpirit: invalid stage");
        uint256 tokenId = spiritOf[user];
        require(tokenId != 0, "WispSpirit: no spirit found");
        evolutionStage[tokenId] = stage;
        string memory newUri = stageBaseURIs[stage];
        _tokenURIs[tokenId] = newUri;
        emit SpiritEvolved(tokenId, stage, newUri);
    }

    function _transfer(address, address, uint256) internal pure override {
        revert("WispSpirit: Soulbound");
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "WispSpirit: nonexistent token");
        return _tokenURIs[tokenId];
    }

    function setWispCore(address addr) external onlyOwner { wispCore = addr; }

    function setStageBaseURI(uint8 stage, string calldata uri) external onlyOwner {
        require(stage < 7, "WispSpirit: invalid stage");
        stageBaseURIs[stage] = uri;
    }
}
