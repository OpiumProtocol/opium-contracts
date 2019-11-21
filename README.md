# Opium contracts

**!!! Contracts implementation might suffer some (small) changes till 25 NOVEMBER !!!**

This repository consist of Opium Main Smart Contracts set, which alongside with https://github.com/OpiumProtocol/erc721o composes Opium Protocol

Code is documented in NatSpec format

`solidity-docgen` generated documentation could be found [here](./docs/index.md)

GitBook documentation could be found here [https://docs.opium.network/general/opium-layers-new](https://docs.opium.network/general/opium-layers-new)

## Tests

Tests are running against `ganache-cli`

```
    npm run test
```

Because `timeTravel` is used in tests, each run should be running on new `ganache-cli` instance

## High-level flow description of user behavior

1. Users `approve` their ERC20 tokens to `TokenSpender`
2. Users choose orders on relayer frontend, sign them and pass it to relayer
3. Relayer settles matched orders by sending them to `Match` or `SwaprateMatch` contracts depending on `Order` type
4. Matching contracts validate whether all conditions for orders are met, collect margin from buyer and seller, send it to `Core` with position creations command
5. `Core` validates derivative according to `syntheticId` logic, collects margin from Matching contracts and mints position tokens with `TokenMinter`
6. At execution time (maturity) users call core to burn their position tokens and receive payout from derivative

- All smart contracts get each others addresses using `Registry` contract
- Contracts in `contracts/test` folder are mocks and helpers for testing
- `TokenMinter` implements [ERC721O](https://github.com/OpiumProtocol/erc721o)

![opiumFlow](./docs/images/opiumFlow.jpg)

## Documentation and tests status of Opium contracts (would be updated with additional documentation and tests)
![docsAndTestsStatus](./docs/images/docsAndTestsStatus.jpg)
