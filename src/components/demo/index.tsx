import { useCallback, useEffect, useState } from "react"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import { ConnectWallet } from "./ConnectWallet"
import { SignIn } from "./SignIn"
import { Profile } from "./Profile"

export const Demo = () => {
  const [signedInWith, setSignedInWith] = useState<InjectedAccountWithMeta | undefined>()
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | undefined>()
  const [jwtToken, setJwtToken] = useState<string | undefined>()
  const [subscribed, setSubscribed] = useState(false)
  const handleSignedIn = (selectedAccount: InjectedAccountWithMeta, jwtToken: string) => {
    setJwtToken(jwtToken)
    setSignedInWith(selectedAccount)
  }

  const handleSignOut = useCallback(() => {
    setSignedInWith(undefined)
    setJwtToken(undefined)
  }, [])

  // subscribe to extension changes after first connect
  const subscribeToExtensions = useCallback(async () => {
    if (accounts === undefined || subscribed) return
    const { web3AccountsSubscribe } = await import("@polkadot/extension-dapp")

    setSubscribed(true)
    web3AccountsSubscribe((newAccounts) => {
      // dont update if newAccounts is same as accounts
      const newAddresses = newAccounts.map((account) => account.address).join("")
      const oldAddresses = accounts.map((account) => account.address).join("")
      if (newAddresses === oldAddresses) return

      // update accounts list
      setAccounts(newAccounts)
    })
  }, [accounts, subscribed])

  useEffect(() => {
    subscribeToExtensions()
  }, [subscribeToExtensions])

  // auto sign out disconnected extensions
  useEffect(() => {
    if (
      signedInWith?.address &&
      accounts &&
      !accounts.find((account) => account.address === signedInWith?.address)
    )
      handleSignOut()
  }, [accounts, handleSignOut, signedInWith?.address])

  return (
    <div className="w-full">
      <div className="border-stone-800 border p-4 rounded-xl w-full min-h-[384px] sm:h-96 flex flex-col flex-1">
        {signedInWith && !!jwtToken ? (
          <Profile account={signedInWith} jwtToken={jwtToken} onSignOut={handleSignOut} />
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
  )
}
