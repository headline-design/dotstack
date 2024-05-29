import { useEffect, useState } from "react";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Button } from "@/dashboard/components/ui/button";
import { useAzeroID } from "@/dashboard/context/AzeroIDResolver";
import { Address, SiwsMessage } from "@talismn/siws";
import { useToast } from "../ui/use-toast";
import { Account } from "./Account";
import { ToastAction } from "../ui/toast";
import { SIWS_URI, SIWS_HOSTNAME } from "../../lib/constants";

type Props = {
  accounts: InjectedAccountWithMeta[];
  onCancel: () => void;
  onSignedIn: (account: InjectedAccountWithMeta, jwtToken: string) => void;
};

export const SignIn: React.FC<Props> = ({ accounts, onCancel, onSignedIn }) => {
  const { dismiss, toast } = useToast();
  const { resolve } = useAzeroID();

  // auto select if only 1 account is connected
  const [selectedAccount, setSelectedAccount] = useState<
    InjectedAccountWithMeta | undefined
  >(accounts.length === 1 ? accounts[0] : undefined);
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    console.log('SIWS_DOMAIN', SIWS_URI, window.location.origin)
    try {
      dismiss();
      if (!selectedAccount) throw new Error("No account selected!");

      const address = Address.fromSs58(selectedAccount.address ?? "");
      if (!address)
        return toast({
          title: "Invalid address",
          description: "Your address is not a valid Substrate address.",
        });

      setSigningIn(true);
      // request nonce from server
      const nonce = await fetch(`/api/nonce`, { method: "PUT" }
      ).then((res) => {
        console.log('res', res)
        return res.text();
      });

      const siwsMessage = new SiwsMessage({
        domain: SIWS_HOSTNAME,
        uri: SIWS_URI,
        // use prefix of chain your dapp is on:
        address: address.toSs58(0),
        nonce,
        statement: "Welcome to SIWS! Sign in to see how it works.",
        chainName: "Polkadot",
        // expires in 2 mins
        expirationTime: new Date().getTime() + 2 * 60 * 1000,
        azeroId: resolve(address.toSs58())?.a0id,
      });

      const { web3FromSource } = await import("@polkadot/extension-dapp");
      const injectedExtension = await web3FromSource(
        selectedAccount.meta.source
      );
      const signed = await siwsMessage.sign(injectedExtension);

      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({ ...signed, address: address.toSs58(0) }),
      });
      const verified = await verifyRes.json();
      if (verified.error) throw new Error(verified.error);

      // Hooray we're signed in!
      onSignedIn(selectedAccount, verified.jwtToken);
    } catch (e: any) {
      toast({
        title: "Uh oh! Couldn't sign in.",
        description: e?.message ?? "An error occurred",
        variant: "destructive",
        action: (
          <ToastAction altText="Try Again" onClick={handleSignIn}>
            Try Again
          </ToastAction>
        ),
      });
    } finally {
      setSigningIn(false);
    }
  };

  // dismiss toast when sign in flow is exited
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dismiss(), []);

  return (
    <div className="h-full flex flex-1 flex-col">
      <p className="text-white text-lg">Sign In</p>
      <p className="text-stone-500">Select an account to sign in with.</p>
      <div className="my-4 flex flex-col h-full overflow-y-auto gap-3 p-2 rounded-lg border border-stone-800">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <Account
              key={account.address}
              account={account}
              selected={selectedAccount?.address === account.address}
              onSelect={() => {
                dismiss();
                setSelectedAccount(account);
              }}
            />
          ))
        ) : (
          <p className="text-stone-500 text-center mt-4">
            No account connected.
            <br />
            Connect at least 1 account to sign in with.
          </p>
        )}
      </div>
      <div className="grid gap-3">
        <Button disabled={!selectedAccount || signingIn} onClick={handleSignIn}>
          {signingIn ? "Signing In..." : "Sign In"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
