import { useContext } from 'react';
import { SIWSContext, StatusState, SIWSSession } from './SIWSContext';

type HookProps = {
  isSignedIn: boolean;
  data?: SIWSSession;
  status: StatusState;
  error?: Error | any;
  isRejected: boolean;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isReady: boolean;

  reset: () => void;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
};

type UseSIWSConfig = {
  onSignIn?: (data?: SIWSSession) => void;
  onSignOut?: () => void;
};

// Consumer-facing hook
export const useSIWS = ({ onSignIn, onSignOut }: UseSIWSConfig = {}):
  | HookProps
  | any => {
  const siwsContextValue = useContext(SIWSContext);
  if (!siwsContextValue) {
    // If we throw an error here then this will break non-SIWS apps, so best to just respond with not signed in.
    //throw new Error('useSIWS hook must be inside a SIWSProvider.');
    return {
      isSignedIn: false,
      data: undefined,
      status: StatusState.ERROR,
      error: new Error('useSIWS hook must be inside a SIWSProvider.'),
      isRejected: false,
      isError: true,
      isLoading: false,
      isSuccess: false,
      isReady: false,
      reset: () => {},
      signIn: () => Promise.reject(),
      signOut: () => Promise.reject(),
    };
  }

  const { session, nonce, status, signOut, signIn, resetStatus } =
    siwsContextValue;
  const { address } = session?.data || {};

  const currentStatus = address
    ? StatusState.SUCCESS
    : session?.isLoading || nonce?.isLoading
    ? StatusState.LOADING
    : status;

  const isLoading = currentStatus === StatusState.LOADING;
  const isSuccess = currentStatus === StatusState.SUCCESS;
  const isRejected = currentStatus === StatusState.REJECTED;
  const isError = currentStatus === StatusState.ERROR;
  const isReady = !address || nonce.isFetching || isLoading || isSuccess;

  const reset = () => resetStatus();

  const isSignedIn = !!address;

  return {
    isSignedIn,
    data: isSignedIn
      ? {
          address: address as string,
        }
      : undefined,
    status: currentStatus,
    error: session?.error || nonce?.error,
    isRejected,
    isError,
    isLoading,
    isSuccess,
    isReady,
    signIn: async () => {
      if (!isSignedIn) {
        const data = await signIn();
        if (data) onSignIn?.(data);
      }
    },
    signOut: async () => {
      if (isSignedIn) {
        await signOut();
        onSignOut?.();
      }
    },
    reset,
  };
};
