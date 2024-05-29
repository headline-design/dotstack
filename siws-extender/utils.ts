import { randomStringForEntropy } from '@stablelib/random';

/**
 * This method leverages a native CSPRNG with support for both browser and Node.js
 * environments in order generate a cryptographically secure nonce for use in the
 * SiwaMessage in order to prevent replay attacks.
 *
 * 96 bits has been chosen as a number to sufficiently balance size and security considerations
 * relative to the lifespan of it's usage.
 *
 * @returns cryptographically generated random nonce with 96 bits of entropy encoded with
 * an alphanumeric character set.
 */
export const generateNonce = (): string => {
    const nonce = randomStringForEntropy(96);
    if (!nonce || nonce.length < 8) {
      throw new Error('Error during nonce creation.');
    }
    return nonce;
  };
