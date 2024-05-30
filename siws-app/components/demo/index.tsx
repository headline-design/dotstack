import { ConnectWallet } from "./ConnectWallet";
import { SignIn } from "./SignIn";
import { Profile } from "./Profile";
import { useWeb3 } from "@/siws-app/context/web3Context";

export const Demo = () => {
  const {
    signedInWith,
    jwtToken,
    accounts,
    setAccounts,
    handleSignOut,
    handleSignedIn,
  } = useWeb3();

  return (
    <div className="w-full">
      <div className="border-stone-800 border p-4 rounded-xl w-full min-h-[384px] sm:h-96 flex flex-col flex-1">
        {signedInWith && !!jwtToken ? (
          <Profile
            account={signedInWith}
            jwtToken={jwtToken}
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
