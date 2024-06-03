"use client";

import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SIWSConfig, SIWSProvider } from "@/dotstack-app/siws-extender";
import { SiwsMessage } from "@talismn/siws";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { SIWS_HOSTNAME, SIWS_URI } from "../lib/constants";
import { useAzeroID } from "@/dotstack-app/context/AzeroIDResolver";

export interface SIWSCreateMessageArgs {
  nonce: string;
  address: string;
}

export function parseCookie(cookie: string, key: string) {
  const keyValue = cookie.split("; ").find((x) => x.startsWith(`${key}=`));
  if (!keyValue) return undefined;
  return keyValue.substring(key.length + 1);
}

export const cookieStorage = {
  getItem(key) {
    if (typeof window === "undefined") return null;
    const value = parseCookie(document.cookie, key);
    return value ?? null;
  },
  setItem(key, value) {
    if (typeof window === "undefined") return;
    document.cookie = `${key}=${value}`;
  },
  removeItem(key) {
    if (typeof window === "undefined") return;
    document.cookie = `${key}=;max-age=-1`;
  },
};

declare let window: {
  location: Location;
  localStorage: Storage;
};

export type Web3ContextT = {
  contract: any | null;
  accounts: InjectedAccountWithMeta[] | undefined;
  signedInWith: InjectedAccountWithMeta | undefined;
  jwtToken: string | undefined;
  setJwtToken: (token: string | undefined) => void;
  setAccounts: (accounts: InjectedAccountWithMeta[] | undefined) => void;
  handleSignOut: () => void;
  handleSignedIn: (
    selectedAccount: InjectedAccountWithMeta,
    jwtToken: string
  ) => void;
};

export const Web3Context = createContext<Web3ContextT>({} as Web3ContextT);

export const useWeb3 = () => useContext(Web3Context);

export const getDefaultConfig = (config: any) => {
  return {
    setState: () => {},
    connect: () => {},
    appName: "SIWS Connect",
    appIcon: "/favicon.ico",
    appDescription: "SIWS Connect is a demo application for SIWS.",
    appUrl: window.location.origin,
    walletConnectProjectId: "",
    chains: [],
    client: null,
    ...config,
  };
};

export const Web3Contextual = (props: any) => {
  const { children } = props;
  const contract = null;

  return (
    <Web3Context.Provider
      value={{
        contract,
        accounts: undefined,
        signedInWith: undefined,
        jwtToken: undefined,
        setJwtToken: () => {},
        setAccounts: () => {},
        handleSignOut: () => {},
        handleSignedIn: () => {},
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const Web3Provider = ({ children }: { children: any }) => {
  return <Web3ChildProvider>{children}</Web3ChildProvider>;
};

const Web3ChildProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const [signedInWith, setSignedInWith] = useState<InjectedAccountWithMeta | undefined>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | undefined>();
  const [jwtToken, setJwtToken] = useState<string | undefined>();
  const [subscribed, setSubscribed] = useState(false);

  const { resolve } = useAzeroID();

  const handleSignedIn = (
    selectedAccount: InjectedAccountWithMeta,
    jwtToken: string
  ) => {
    setJwtToken(jwtToken);
    setSignedInWith(selectedAccount);
  };

  const handleSignOut = useCallback(() => {
    setSignedInWith(undefined);
    setJwtToken(undefined);
  }, []);

  const subscribeToExtensions = useCallback(async () => {
    if (accounts === undefined || subscribed) return;
    const { web3AccountsSubscribe } = await import("@polkadot/extension-dapp");

    setSubscribed(true);
    web3AccountsSubscribe((newAccounts) => {
      const newAddresses = newAccounts
        .map((account) => account.address)
        .join("");
      const oldAddresses = accounts.map((account) => account.address).join("");
      if (newAddresses === oldAddresses) return;

      setAccounts(newAccounts);
    });
  }, [accounts, subscribed]);

  useEffect(() => {
    subscribeToExtensions();
  }, [subscribeToExtensions]);

  useEffect(() => {
    if (
      signedInWith?.address &&
      accounts &&
      !accounts.find((account) => account.address === signedInWith?.address)
    ) {
      handleSignOut();
    }
  }, [accounts, handleSignOut, signedInWith?.address]);

  const siwsConfig: SIWSConfig = {
    getNonce: async () => {
      const res = await fetch(`/api/siws`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to fetch SIWS nonce");

      return res.text();
    },

    createMessage: ({ nonce, address  }: SIWSCreateMessageArgs) =>
      new SiwsMessage({
        domain: SIWS_HOSTNAME,
        uri: SIWS_URI,
        // use prefix of chain your dapp is on:
        address: (address as any).toSs58(0),
        nonce: (nonce as any)?.data,
        statement: "Welcome to SIWS! Sign in to see how it works.",
        chainName: "Polkadot",
        // expires in 2 mins
        expirationTime: new Date().getTime() + 2 * 60 * 1000,
        azeroId: resolve((address as any).toSs58())?.a0id,
      }).prepareMessage(),

    verifyMessage: async ({
      message,
      signature,
      address,
    }: {
      message: string | Uint8Array;
      signature: string;
      address: string;
    }) => {

      return signIn("credentials", {
        message,
        address,
        redirect: false,
        signature,
        callbackUrl: "/",
      }).then((res) => res?.ok as boolean);
    },

    getSession: async () => {
      const res = await fetch(`/api/siws`);

      if (!res.ok) throw new Error("Failed to fetch SIWS session");
      const data = await res.json();
      const activeWallet = data?.user?.wallets[0];

      const address = activeWallet?.address;

      return address;
    },
    signOut: () => fetch(`/api/siws`, { method: "DELETE" }).then((res) => res.ok),
  };

  return (
    <SIWSProvider
      accounts={accounts || []}
      onSignIn={() => router.refresh()}
      onSignOut={() => router.refresh()}
      onSignedIn={handleSignedIn}
      onCancel={() => setAccounts(undefined)}
      {...siwsConfig}
    >
      <Web3Context.Provider
        value={{
          contract: null,
          accounts,
          signedInWith,
          jwtToken,
          setJwtToken,
          setAccounts,
          handleSignOut,
          handleSignedIn,
        }}
      >
        {children}
      </Web3Context.Provider>
    </SIWSProvider>
  );
};

export default Web3Provider;
