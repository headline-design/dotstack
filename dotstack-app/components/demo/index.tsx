import { ConnectWallet } from "./ConnectWallet";
import { SignIn } from "./SignIn";
import { Profile } from "./Profile";
import { useWeb3 } from "@/dotstack-app/context/web3Context";
import { useSession } from "next-auth/react";

export const Demo = () => {
  const { signedInWith, accounts, setAccounts, handleSignOut, handleSignedIn } =
    useWeb3();

  const { data: session } = useSession() as any;

  return (
    <div className="w-full">
      <div className="border p-4 rounded-xl w-full min-h-[384px] sm:h-96 flex flex-col flex-1">
        {signedInWith && !!session ? (
          <Profile
            account={signedInWith}
            token={(session?.user?.id as string) || null}
            onSignOut={handleSignOut}
          />
        ) : accounts ? (
          <SignIn
            accounts={accounts}
            onCancel={() => setAccounts(undefined)}
            onSignedIn={handleSignedIn}
          />
        ) : (
          <ConnectWallet onAccounts={setAccounts} />
        )}
      </div>
    </div>
  );
};
