"use client";

import { Toaster } from "@/dotstack-app/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { AzeroIDResolverProvider } from "@/dotstack-app/context/AzeroIDResolver";
import React, { useMemo } from "react";
import Web3Provider from "@/dotstack-app/context/web3Context";
import ScrollToTop from "@/dotstack-app/components/scroll-to-top";
import ErrorBoundary from "@/dotstack-app/lib/error-boundary";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import {
  AboutView,
  ContactView,
  ErrorView,
  FeaturesView,
  GettingStartedView,
  MainView,
  PricingView,
  PrivacyView,
  TermsView,
} from "./views";
import ClientLayout from "./client-layout";

function ClientApp() {
  const routes = useMemo(
    () => [
      <Route
        key="main"
        path=""
        element={
          <ClientLayout>
            <ErrorBoundary fallbackRender={({ error }) => <ErrorView />}>
              <ScrollToTop />
              <Outlet />
            </ErrorBoundary>
          </ClientLayout>
        }
      >
        <Route index element={<MainView />} />
        <Route path="/pricing/*" element={<PricingView />} />
        <Route path="/contact/*" element={<ContactView />} />
        <Route path="/features/*" element={<FeaturesView />} />
        <Route path="/about/*" index element={<AboutView />} />
        <Route path="/getting-started/*" element={<GettingStartedView />} />
        <Route path="/terms/*" element={<TermsView />} />
        <Route path="/privacy/*" element={<PrivacyView />} />
      </Route>,
      <Route key="error" path="*" element={<ErrorView />} />,
    ],
    []
  );

  const memoizedRouter = useMemo(
    () => createBrowserRouter(createRoutesFromElements(routes)),
    [routes]
  );

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Adjust based on your needs
        refetchOnWindowFocus: false, // Adjust based on your needs
      },
    },
  });

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AzeroIDResolverProvider>
          <Web3Provider>
            <Analytics />
            <RouterProvider router={memoizedRouter} />
            <Toaster />
          </Web3Provider>
        </AzeroIDResolverProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default ClientApp;
