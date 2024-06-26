import { useEffect, useState } from "react";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Button } from "@/dotstack-app/components/ui/button";
import { useAzeroID } from "@/dotstack-app/context/AzeroIDResolver";
import { useToast } from "../ui/use-toast";
import { Account } from "./Account";
import { useSIWS } from "@/dotstack-app/siws-extender";
import { useWeb3 } from "@/dotstack-app/context/web3Context";

type Props = {
  accounts: InjectedAccountWithMeta[];
  onCancel: () => void;
  onSignedIn: (account: InjectedAccountWithMeta, jwtToken: string) => void;
};

export const SignIn: React.FC<Props> = ({  onCancel, onSignedIn }) => {
  const { dismiss, toast } = useToast();
  const { signIn: signInWithSIWS } = useSIWS();
  const { accounts } = useWeb3();
  const { resolve } = useAzeroID();

  // auto select if only 1 account is connected
  const [selectedAccount, setSelectedAccount] = useState<
    InjectedAccountWithMeta | undefined
  >(accounts?.length === 1 ? accounts[0] : undefined);
  const [signingIn, setSigningIn] = useState(false);

  return (
    <div className="h-full flex flex-1 flex-col">
      <p className="text-foreground text-lg">Sign In</p>
      <p className="text-muted-foreground">Select an account to sign in with.</p>
      <div className="my-4 flex flex-col h-full overflow-y-auto gap-3 p-2 rounded-lg border  bg-transparent">
        {accounts?.length ?? 0 > 0 ? (
          accounts?.map((account) => (
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
          <p className="text-muted-foreground text-center mt-4">
            No account connected.
            <br />
            Connect at least 1 account to sign in with.
          </p>
        )}
      </div>
      <div className="grid gap-3">
        <Button
          disabled={!selectedAccount || signingIn}
          onClick={() => signInWithSIWS()}
        >
          {signingIn ? "Signing In..." : "Sign In"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
