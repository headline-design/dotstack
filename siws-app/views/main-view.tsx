/* eslint-disable @next/next/no-img-element */
import { Link } from "react-router-dom";
import { Button } from "@/siws-app/components/ui/button";
import { Input } from "@/siws-app/components/ui/input";
import { ButtonLink } from "@/siws-app/components/ui/button-link";
import { IconGithub } from "../icons";
import { useContext, useState } from "react";
import { ModalContext } from "../providers/modal-provider";
import { useSession } from "next-auth/react";

export default function MainView2() {
  const { showLoginModal, setShowLoginModal } = useContext(ModalContext);
  const { data: session } = useSession();

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-12 pb-12 md:pt-24 lg:pt-32 border-b">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-lime px-3 py-1 text-sm text-lime-foreground">
                  Auth Framework
                </div>
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
                  Sign In With Algorand
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  An AVM auth standard that integrates with Algorand to provide
                  a seamless sign-in experience for your users.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <ButtonLink size="lg" to="/getting-started">
                    Get Started
                  </ButtonLink>
                  <ButtonLink
                    target="_blank"
                    size="lg"
                    variant="outline"
                    to="https://github.com/headline-design/react-fuse"
                  >
                    <IconGithub /> Github
                  </ButtonLink>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Sign In With Algorand"
                  className="aspect-video overflow-hidden object-cover object-center primary-hero-bg"
                  height="310"
                  src="/fuse.svg"
                  width="550"
                />
              </div>
            </div>
          </div>
        </section>
        <button onClick={() => setShowLoginModal(true)}>Login</button>
        {session && <div>{JSON.stringify(session?.user)}</div>}
        {/* Feature Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-lime text-lime-foreground px-3 py-1 text-sm">
                  New Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Secure and Seamless Authentication
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  Integrate with Algorand to provide secure and seamless
                  authentication for your users.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                alt="Secure Authentication"
                className="mx-auto aspect-video overflow-hidden object-cover object-center secondary-hero-bg"
                height="310"
                src="/lightning-stand.svg"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Step 1: Connect Wallet
                      </h3>
                      <p className="text-muted-foreground">
                        Connect your Algorand wallet to start the authentication
                        process.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Step 2: Sign Message
                      </h3>
                      <p className="text-muted-foreground">
                        Sign a message with your wallet to prove ownership.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Step 3: Verify Signature
                      </h3>
                      <p className="text-muted-foreground">
                        Our server verifies the signature to complete the login.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-b">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Experience a Seamless Workflow
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                Integrate with Algorand to provide a secure and seamless
                authentication experience for your users.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button type="submit">Sign Up</Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Sign up to get notified when we launch.
                <Link className="underline underline-offset-2" to="/terms">
                  Terms & Conditions
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Performance Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-lime text-lime-foreground px-3 py-1 text-sm">
                  Performance
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Robust and Scalable Infrastructure
                </h2>
                <ButtonLink size="lg" to="/getting-started">
                  Get Started
                </ButtonLink>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-lime text-lime-foreground px-3 py-1 text-sm">
                  Security
                </div>
                <p className="mx-auto max-w-[700px] md:text-xl text-muted-foreground">
                  Fully managed infrastructure designed to scale dynamically
                  with your traffic, a global edge to ensure your site is fast
                  for every customer, and the tools to monitor every aspect of
                  your app.
                </p>
                <ButtonLink size="lg" variant="outline" to="/contact">
                  Contact Sales
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 HEADLINE. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            to="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            to="/privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  );
}
