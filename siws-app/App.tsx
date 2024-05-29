import "@/dashboard/styles/globals.css"
import { Toaster } from "@/dashboard/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { AzeroIDResolverProvider } from "@/dashboard/context/AzeroIDResolver"
import Home from "./views/Home"

export default function App() {
  return (
    <>
      <AzeroIDResolverProvider>
        <Analytics />
       <Home />
        <Toaster />
      </AzeroIDResolverProvider>
    </>
  )
}
