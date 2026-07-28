// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @title EcoThreadDppAnchor
 * @notice Minimal non-upgradeable smart contract for anchoring EcoThread Digital Product Passport (DPP)
 *         canonical metadata hashes to Polygon Amoy Testnet.
 * @dev Stores only (dppKey, version) => Anchor(metadataHash, anchoredAt, issuer).
 *      No PII, no token minting, no customer wallet dependency. PostgreSQL remains the system of record.
 */
contract EcoThreadDppAnchor is Ownable2Step {
    struct Anchor {
        bytes32 metadataHash;
        uint64 anchoredAt;
        address issuer;
    }

    // Mapping: dppKey (keccak256 of productCode) => versionNum => Anchor
    mapping(bytes32 => mapping(uint32 => Anchor)) private _anchors;

    // Custom errors
    error InvalidDppKey();
    error InvalidVersion();
    error InvalidMetadataHash();
    error AnchorAlreadyExists(bytes32 dppKey, uint32 version);

    // Event emitted when a DPP version is anchored
    event DppAnchored(
        bytes32 indexed dppKey,
        uint32 indexed version,
        bytes32 metadataHash,
        address indexed issuer,
        uint256 timestamp
    );

    /**
     * @dev Initializes the contract with the initial owner (EcoThread server-side issuer address).
     * @param initialOwner Address of the server-side issuer wallet.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Anchor a DPP metadata hash for a specific product key and version.
     * @param dppKey keccak256 hash of the normalized product code (e.g. keccak256("PRD-2026-0001")).
     * @param version Version number of the published DPP (e.g. 1, 2).
     * @param metadataHash Keccak-256 hash of the canonical DPP snapshot JSON.
     */
    function anchorDpp(
        bytes32 dppKey,
        uint32 version,
        bytes32 metadataHash
    ) external onlyOwner {
        if (dppKey == bytes32(0)) revert InvalidDppKey();
        if (version == 0) revert InvalidVersion();
        if (metadataHash == bytes32(0)) revert InvalidMetadataHash();

        if (_anchors[dppKey][version].metadataHash != bytes32(0)) {
            revert AnchorAlreadyExists(dppKey, version);
        }

        uint64 currentTime = uint64(block.timestamp);
        _anchors[dppKey][version] = Anchor({
            metadataHash: metadataHash,
            anchoredAt: currentTime,
            issuer: msg.sender
        });

        emit DppAnchored(dppKey, version, metadataHash, msg.sender, currentTime);
    }

    /**
     * @notice Retrieve the anchored metadata record for a DPP key and version.
     * @param dppKey keccak256 hash of the product code.
     * @param version Version number of the DPP.
     * @return metadataHash Keccak-256 hash of the canonical metadata snapshot.
     * @return anchoredAt Block timestamp when anchored.
     * @return issuer Address of the issuer who anchored the record.
     */
    function getAnchor(
        bytes32 dppKey,
        uint32 version
    ) external view returns (bytes32 metadataHash, uint64 anchoredAt, address issuer) {
        Anchor memory anchor = _anchors[dppKey][version];
        return (anchor.metadataHash, anchor.anchoredAt, anchor.issuer);
    }
}
