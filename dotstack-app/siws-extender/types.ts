import { SiwsMessage } from "@talismn/siws";


/**
 * Serializes a SiwsMessage object into a string suitable for signing and verifying.
 * @param message SiwsMessage object
 * @returns Serialized string representation of the message.
 */
export const serializeMessage = (message: SiwsMessage): string => {
  return `Message:
      Domain: ${message.domain}
      Address: ${message.address}
      URI: ${message.uri}
      Statement: ${message.statement}
      Nonce: ${message.nonce}`;
};

export interface VerifyParams {
  /** Signature of the message signed by the wallet */
  signature: string;

  /** Address of the wallet that signed the message */
  address?: string;

  /** RFC 4501 dns authority that is requesting the signing. */
  domain?: string;

  /** Randomized token used to prevent replay attacks, at least 8 alphanumeric characters. */
  nonce?: string;

  /**ISO 8601 datetime string of the current time. */
  time?: string;

  scheme?: string;
}

export const VerifyParamsKeys: Array<keyof VerifyParams> = [
  'signature',
  'address',
  'domain',
  'scheme',
  'nonce',
  'time',
];

export interface VerifyOpts {
  /** If the library should reject promises on errors, defaults to false */
  suppressExceptions?: boolean;

  /** Enables a custom verification function that will be ran alongside EIP-1271 check. */
  verificationFallback?: (
    params: VerifyParams,
    opts: VerifyOpts,
    message: SiwsMessage,
    EIP1271Promise: Promise<SiwsResponse>
  ) => Promise<SiwsResponse>;
}

export const VerifyOptsKeys: Array<keyof VerifyOpts> = [
  'suppressExceptions',
  'verificationFallback',
];

/**
 * Returned on verifications.
 */
export interface SiwsResponse {
  /** Boolean representing if the message was verified with success. */
  success: boolean;

  /** If present `success` MUST be false and will provide extra information on the failure reason. */
  error?: SiwsError;

  /** Original message that was verified. */
  data: SiwsMessage;
}

/**
 * Interface used to return errors in SiwsResponses.
 */
export class SiwsError {
  constructor(
    type: SiwsErrorType | string,
    expected?: string,
    received?: string
  ) {
    this.type = type;
    this.expected = expected;
    this.received = received;
  }

  /** Type of the error. */
  type: SiwsErrorType | string;

  /** Expected value or condition to pass. */
  expected?: string;

  /** Received value that caused the failure. */
  received?: string;
}

/**
 * Possible message error types.
 */
export enum SiwsErrorType {
  /** `expirationTime` is present and in the past. */
  EXPIRED_MESSAGE = 'Expired message.',

  /** `domain` is not a valid authority or is empty. */
  INVALID_DOMAIN = 'Invalid domain.',

  /** `domain` don't match the domain provided for verification. */
  DOMAIN_MISMATCH = 'Domain does not match provided domain for verification.',

  /** `nonce` don't match the nonce provided for verification. */
  NONCE_MISMATCH = 'Nonce does not match provided nonce for verification.',

  /** `address` does not conform to EIP-55 or is not a valid address. */
  INVALID_ADDRESS = 'Invalid address.',

  /** `uri` does not conform to RFC 3986. */
  INVALID_URI = 'URI does not conform to RFC 3986.',

  /** `nonce` is smaller then 8 characters or is not alphanumeric */
  INVALID_NONCE = 'Nonce size smaller then 8 characters or is not alphanumeric.',

  /** `notBefore` is present and in the future. */
  NOT_YET_VALID_MESSAGE = 'Message is not valid yet.',

  /** Signature doesn't match the address of the message. */
  INVALID_SIGNATURE = 'Signature does not match address of the message.',

  /** `expirationTime`, `notBefore` or `issuedAt` not complient to ISO-8601. */
  INVALID_TIME_FORMAT = 'Invalid time format.',

  /** `version` is not 1. */
  INVALID_MESSAGE_VERSION = 'Invalid message version.',

  /** Thrown when some required field is missing. */
  UNABLE_TO_PARSE = 'Unable to parse the message.',

  /** `scheme` is not present or is not a valid scheme. */
  SCHEME_MISMATCH = 'Scheme does not match the expected scheme.',
}
