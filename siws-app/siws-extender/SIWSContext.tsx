import { createContext } from 'react';
import { useQuery } from '@tanstack/react-query';

export enum StatusState {
  READY = 'ready',
  LOADING = 'loading',
  SUCCESS = 'success',
  REJECTED = 'rejected',
  ERROR = 'error',
}

export type SIWSSession = {
  address: string;
};

export type SIWSConfig = {
  // Required
  getNonce: () => Promise<string>;
  createMessage: (args: {
    nonce: string;
    address: string;
  }) => string;
  verifyMessage: (args: {
    message: string | Uint8Array;
    signature: string;
    address: string;
  }) => Promise<boolean>;
  getSession: () => Promise<SIWSSession | null>;
  signOut: () => Promise<boolean>;

  // Optional, we have default values but they can be overridden
  enabled?: boolean;
  nonceRefetchInterval?: number;
  sessionRefetchInterval?: number;
  signOutOnDisconnect?: boolean;
  signOutOnAccountChange?: boolean;
  signOutOnNetworkChange?: boolean;
};

export type SIWSContextValue = Required<SIWSConfig> & {
  nonce: ReturnType<typeof useQuery<string | null>>;
  session: ReturnType<typeof useQuery<SIWSSession | null>>;
  status: StatusState;
  signIn: () => Promise<SIWSSession | false>;
  resetStatus: () => void;
  signOut: () => Promise<boolean>;
  onError: (error: any) => void;
accounts: string[];
};

export const SIWSContext = createContext<SIWSContextValue | null>(null);
