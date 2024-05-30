import "@/dashboard/styles/globals.css";
import { Toaster } from "@/dashboard/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { AzeroIDResolverProvider } from "@/dashboard/context/AzeroIDResolver";
import Home from "./views/Home";
import Web3Provider from "./context/web3Context";

export default function App() {
  return (
    <>
      <AzeroIDResolverProvider>
        <Web3Provider>
          <Analytics />
          <Home />
          <Toaster />
        </Web3Provider>
      </AzeroIDResolverProvider>
    </>
  );
}
