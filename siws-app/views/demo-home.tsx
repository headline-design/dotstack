import { Demo } from "@/dashboard/components/demo";
import { Button } from "@/siws-app/components/ui/button";
import { W3FLogo } from "@/dashboard/components/assets/W3FLogo";
import { MadeByTalisman } from "@/dashboard/components/assets/MadeByTalisman";
import { TalismanLogo } from "@/dashboard/components/assets/TalismanLogo";
import { signOut, useSession } from "next-auth/react";
import SIWSDetails from "./siws-details";
import { IconShieldGlobal } from "../icons";

export default function DemoHome() {
  const { data: session } = useSession();
  return (
    <div>
      <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
        <>
          {session ? (
            <div className="w-full p-4 flex flex-col items-center lg:items-end gap-2 text-center lg:text-left h-full lg:min-h-[384px]">
              <SIWSDetails user={session?.user} signOut={signOut} />
            </div>
          ) : (
            <div className="w-full p-4 flex flex-col items-center lg:items-start gap-2 text-center lg:text-left h-full lg:min-h-[384px]">
              <h1 className="text-foreground  text-5xl font-medium font-unbounded">
                SIWS
              </h1>
              <p className="text-muted-foreground  text-lg max-w-md">
                Sign-in with Substrate, an authentication standard for
                signing-in with a Substrate account.
              </p>
              <p className="text-stone-500">By the Signet team at Talisman</p>
              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://docs.siws.xyz/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" size="lg">
                    Docs
                  </Button>
                </a>
                <a
                  href="https://github.com/TalismanSociety/siws"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" size="lg">
                    Github
                  </Button>
                </a>
                <a
                  href="https://matrix.to/#/#siws-general:matrix.org"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" size="lg">
                    Contact
                  </Button>
                </a>
              </div>
              <div className="text-muted-foreground  mt-8 grid grid-cols-2 items-center gap-8 max-w-[320px] px-4">
                <W3FLogo />
                <TalismanLogo />
              </div>
            </div>
          )}
        </>
        <div className="w-full p-4 flex flex-col items-center lg:items-start gap-2 text-center lg:text-left h-full lg:min-h-[384px]">
          <div className="flex flex-col w-full sm:w-[350px] justify-center">
            <Demo />
            <div className="mt-12 px-4 flex justify-center lg:justify-end w-full max-w-4xl">
              <MadeByTalisman />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
