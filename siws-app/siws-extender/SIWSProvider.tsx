import { ReactNode, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SIWSContext, SIWSConfig, StatusState, SIWSSession } from "./SIWSContext";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useAzeroID } from "@/dashboard/context/AzeroIDResolver";
import { Address, SiwsMessage, verifySIWS } from "@talismn/siws";
import { useToast } from "../components/ui/use-toast";
import { SIWS_HOSTNAME, SIWS_URI } from "../lib/constants";
import { ToastAction } from "../components/ui/toast";

type Props = SIWSConfig & {
  children: ReactNode;
  onSignIn?: (data?: SIWSSession) => void;
  onSignOut?: () => void;
  accounts: InjectedAccountWithMeta[];
  onCancel: () => void;
  onSignedIn: (account: InjectedAccountWithMeta, jwtToken: string) => void;
};

export const SIWSProvider = ({
  children,
  enabled = true,
  nonceRefetchInterval = 1000 * 60 * 5,
  sessionRefetchInterval = 1000 * 60 * 5,
  signOutOnDisconnect = true,
  signOutOnAccountChange = true,
  signOutOnNetworkChange = true,
  onSignIn,
  onSignOut,
  onCancel,
  onSignedIn,
  accounts ,
  ...siwsConfig
}: Props) => {
  const [status, setStatus] = useState<StatusState>(StatusState.READY);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | undefined>(accounts?.length === 1 ? accounts[0] : undefined);
  const [signingIn, setSigningIn] = useState(false);
  const resetStatus = () => setStatus(StatusState.READY);

  const nonce = useQuery({
    queryKey: ["ckSiwsNonce"],
    queryFn: () => siwsConfig.getNonce(),
    refetchInterval: nonceRefetchInterval,
  });

  const session = useQuery({
    queryKey: ["ckSiwsSession"],
    queryFn: () => siwsConfig.getSession(),
    refetchInterval: sessionRefetchInterval,
  });

  const sessionData = session.data;

  const signOutAndRefetch = async () => {
    if (!sessionData) return false; // No session to sign out of
    setStatus(StatusState.LOADING);
    if (!(await siwsConfig.signOut())) {
      throw new Error("Failed to sign out.");
    }
    await Promise.all([session.refetch(), nonce.refetch()]);
    setStatus(StatusState.READY);
    onSignOut?.();
    return true;
  };

  const onError = (error: any) => {
    console.error("signIn error", error.code, error.message);
    switch (error.code) {
      case -32000: // WalletConnect: user rejected
      case 4001: // MetaMask: user rejected
      case "ACTION_REJECTED": // MetaMask: user rejected
        setStatus(StatusState.REJECTED);
        break;
      default:
        setStatus(StatusState.ERROR);
    }
  };

  const { dismiss, toast } = useToast();
  const { resolve } = useAzeroID();

  useEffect(() => {
    if (accounts?.length === 1) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts]);

  const signIn = async () => {

    try {
      dismiss();
      if (!selectedAccount) throw new Error("No account selected!");

      if (!nonce.data) {
        throw new Error("Could not fetch nonce");
      }

      setStatus(StatusState.LOADING);

      const baseAddress = Address.fromSs58(selectedAccount.address ?? "");
      if (!baseAddress)
        return toast({
          title: "Invalid address",
          description: "Your address is not a valid Substrate address.",
        });

      setSigningIn(true);

      const siwsMessage = new SiwsMessage({
        domain: SIWS_HOSTNAME,
        uri: SIWS_URI,
        // use prefix of chain your dapp is on:
        address: baseAddress.toSs58(0),
        nonce: nonce?.data,
        statement: "Welcome to SIWS! Sign in to see how it works.",
        chainName: "Polkadot",
        // expires in 2 mins
        expirationTime: new Date().getTime() + 2 * 60 * 1000,
        azeroId: resolve(baseAddress.toSs58())?.a0id,
      });

      const { web3FromSource } = await import("@polkadot/extension-dapp");
      const injectedExtension = await web3FromSource(selectedAccount.meta.source);
      const signed = await siwsMessage.sign(injectedExtension);

      // Verify SIWS signature
      const message = signed.message;
      const signature = signed.signature;
      const address = baseAddress.toSs58(0);

      if (!(await siwsConfig.verifyMessage({message, signature, address}))) {
        throw new Error("Error verifying SIWS signature");
      }

      const data = await session.refetch().then((res) => {
        onSignIn?.(res?.data ?? undefined);
        return res?.data;
      });

      setStatus(StatusState.READY);
      onSignedIn(selectedAccount, "");
      return data as SIWSSession;

      // Hooray we're signed in!

    } catch (e: any) {
      toast({
        title: "Uh oh! Couldn't sign in.",
        description: e?.message ?? "An error occurred",
        variant: "destructive",
        action: (
          <ToastAction altText="Try Again" onClick={() => signIn()}>
            Try Again
          </ToastAction>
        ),
      });
    } finally {
      setSigningIn(false);
    }
  };

  useEffect(() => () => dismiss(), [dismiss]);

  return (
    <SIWSContext.Provider
      value={{
        enabled,
        nonceRefetchInterval,
        sessionRefetchInterval,
        signOutOnDisconnect,
        signOutOnAccountChange,
        signOutOnNetworkChange,
        ...siwsConfig,
        nonce,
        session,
        signIn,
        signOut: signOutAndRefetch,
        status,
        resetStatus,
        accounts,
        setSelectedAccount,
        selectedAccount,
        signingIn,
        onCancel,
      }}
    >
      {children}
    </SIWSContext.Provider>
  );
};

