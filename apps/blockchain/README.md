# @ecothread/blockchain — Smart Contracts & Tooling

EcoThread Digital Product Passport (DPP) Integrity Anchor workspace.

## Contract Architecture

- **Contract**: `EcoThreadDppAnchor.sol` (Solidity 0.8.24, OpenZeppelin `Ownable2Step`)
- **Target Network**: Polygon Amoy Testnet (Chain ID `80002`)
- **Function**: Minimal tamper-evident commitment storage. Stores `(dppKey, version) => Anchor(metadataHash, anchoredAt, issuer)`.
- **System of Record**: PostgreSQL. On-chain storage is lightweight and contains zero PII.

## Development Commands

```powershell
# Install dependencies
pnpm install

# Compile contracts
pnpm --filter @ecothread/blockchain compile

# Run Hardhat unit tests
pnpm --filter @ecothread/blockchain test

# Deploy to Polygon Amoy Testnet
$env:POLYGON_AMOY_RPC_URL="https://rpc-amoy.polygon.technology"
$env:POLYGON_AMOY_PRIVATE_KEY="0x..."
pnpm --filter @ecothread/blockchain deploy:amoy

# Run smoke test on Polygon Amoy
$env:POLYGON_AMOY_CONTRACT_ADDRESS="0x..."
pnpm --filter @ecothread/blockchain smoke:amoy
```

## Security Guarantees

1. `onlyOwner` access control — only the EcoThread server-side issuer wallet can call `anchorDpp`.
2. Immutability — once `(dppKey, version)` is anchored, calling `anchorDpp` again reverts with `AnchorAlreadyExists`.
3. Zero PII — only 32-byte hashes (`dppKey`, `metadataHash`) and version numbers are stored.
4. Two-step ownership — Uses OpenZeppelin `Ownable2Step` for safe wallet rotation.
