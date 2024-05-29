import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Toaster } from "@/components/ui/toaster"
import { inter, unbounded } from "@/components/fonts"
import { Analytics } from "@vercel/analytics/react"
import { AzeroIDResolverProvider } from "@/context/AzeroIDResolver"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${unbounded.variable} ${inter.className}`}>
      <AzeroIDResolverProvider>
        <Analytics />
        <Component {...pageProps} />
        <Toaster />
      </AzeroIDResolverProvider>
    </div>
  )
}
