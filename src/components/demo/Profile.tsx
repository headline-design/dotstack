import truncateMiddle from "truncate-middle"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import Identicon from "@polkadot/react-identicon"
import { CopyIcon, ExitIcon } from "@radix-ui/react-icons"
import { useProtectedService } from "../../hooks/useProtectedService"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { copyToClipboard } from "../../lib/utils"
import { useToast } from "../ui/use-toast"
import { useAzeroID } from "@/context/AzeroIDResolver"
import { useMemo } from "react"

type Props = {
  account: InjectedAccountWithMeta
  jwtToken: string
  onSignOut: () => void
}
export const Profile: React.FC<Props> = ({ account, jwtToken, onSignOut }) => {
  const { randomText, loading, generate } = useProtectedService()
  const { toast } = useToast()
  const { resolve } = useAzeroID()

  const handleCopy = () => {
    copyToClipboard(randomText ?? "")
    toast({
      title: "Copied!",
      description: `Copied ${randomText} to clipboard.`,
      action: <CopyIcon />,
    })
  }

  const a0id = useMemo(() => resolve(account.address)?.a0id, [account.address, resolve])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Identicon value={account.address} size={32} theme="polkadot" />
          <div className="flex flex-col">
            <div className="text-white text-base">{account.meta.name}</div>
            <div className="text-stone-500 text-xs">{a0id ?? truncateMiddle(account.address, 5, 5, "...")}</div>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={onSignOut}>
          <ExitIcon />
        </Button>
      </div>
      <p className="text-stone-200 mt-4 text-sm">
        You are securely signed in with your Polkadot account. Call a protected function that returns randomly generated
        text.
      </p>

      <div className="grid gap-3 mt-4">
        <Button onClick={() => generate(jwtToken)}>Generate Random Text</Button>
        <div className="h-8 w-full flex items-center justify-center">
          {!!loading ? (
            <Skeleton className="w-44 h-6" />
          ) : !!randomText ? (
            <div className="flex items-center justify-center w-full gap-3">
              <p className="text-zinc-400">{randomText}</p>
              <Button size="icon" variant="outline" onClick={handleCopy}>
                <CopyIcon height={12} width={12} />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <p className="text-stone-500 text-center text-sm mt-auto">
        Click{" "}
        <span className="text-white cursor-pointer hover:text-stone-400" onClick={() => generate()}>
          here
        </span>{" "}
        to generate as a logged out user to see how the API is protected by SIWS.
      </p>
    </div>
  )
}
