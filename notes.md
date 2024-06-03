# Notes

## Notes for Talisman on SIWS - Sign In With Substrate

## Key Points

- [Most important] - SiwsMessage.verify is not implemented in the spec. This is a critical feature and should closely adhere to the SIWE implementation. This is important for the security of the SIWS flow and crucial for standardization.
  - In particular, the absence of abnf and the Grammar API is noticably missing from the spec.

- Some common utils are missing from SIWS that should be provided (or at least recommended) by the spec:
  - "generateNonce" (this should be standardized with a function like "randomStringForEntropy" - lib '@stablelib/random') - this is important for security and should be used in the nonce generation for the SIWS flow.

## Notes for `@polkadot/types`

- The `@polkadot/types` has transpiling bugs for older browsers. For this reason, the package must be reanspiled in nextconfig.
