import clsx from "clsx"
import truncateMiddle from "truncate-middle"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import Identicon from "@polkadot/react-identicon"
import { useAzeroID } from "@/dotstack-app/context/AzeroIDResolver"
import { useMemo } from "react"

type Props = {
  onSelect: () => void
  account: InjectedAccountWithMeta
  selected: boolean
}

export const Account: React.FC<Props> = ({ account, selected, onSelect }) => {
  const { resolve } = useAzeroID()
  const addressString = account.address
  const a0id = useMemo(() => resolve(addressString)?.a0id, [addressString, resolve])

  return (
    <div
      onClick={onSelect}
      className={clsx(
        "border cursor-pointer px-2 py-1 rounded-lg flex items-center justify-between pr-4",
        selected ? "border-foreground/20 bg-accent/50" : "border-foreground/50 hover:bg-accent/40"
      )}
    >
      <div className="flex items-center gap-4">
        <Identicon value={account.address} size={32} theme="polkadot" />
        <div className="flex flex-col">
          <div className="text-foreground text-base">{account.meta.name}</div>
          <div className="text-muted-foreground text-xs">
            {a0id ?? truncateMiddle(account.address, 5, 5, "...")}
          </div>
        </div>
      </div>
      <div className={clsx("h-2 w-2 rounded-full", selected ? "bg-foreground" : "bg-foreground-muted")} />
    </div>
  )
}
