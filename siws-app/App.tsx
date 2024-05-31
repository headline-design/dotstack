"use client";

import "@/dashboard/styles/globals.css";
import { Toaster } from "@/dashboard/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { AzeroIDResolverProvider } from "@/dashboard/context/AzeroIDResolver";
import React, { lazy, useMemo, useState } from "react";
import Web3Provider from "@/dashboard/context/web3Context";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import GettingStartedView from "./views/getting-started-view";
import TermsView from "./views/terms-view";
import PrivacyView from "./views/privacy-view";
import { ErrorView } from "./views/error-view";
import ProviderLayout from "./providers/provider-layout";
import ScrollToTop from "./components/scroll-to-top";
import Home from "./views/Home";
import ErrorBoundary from "./lib/error-boundary";

function App(queryClient) {

  const routes = useMemo(
    () => [
      <Route
        key="main"
        path=""
        element={
          <ProviderLayout queryClient={queryClient}>
            <ErrorBoundary fallbackRender={({ error }) => <ErrorView />}>
              <ScrollToTop />
              <Outlet />
            </ErrorBoundary>
          </ProviderLayout>
        }
      >
        <Route index element={<Home />} />
        <Route path="/getting-started/*" element={<GettingStartedView />} />
        <Route path="/terms/*" element={<TermsView />} />
        <Route path="/privacy/*" element={<PrivacyView />} />
      </Route>,
      <Route key="error" path="*" element={<ErrorView />} />,
    ],
    [queryClient],
  );

  const memoizedRouter = useMemo(
    () => createBrowserRouter(createRoutesFromElements(routes)),
    [routes],
  );

  return (
    <AzeroIDResolverProvider>
    <Web3Provider>
      <Analytics />
              <RouterProvider router={memoizedRouter} />
              <Toaster />
        </Web3Provider>
      </AzeroIDResolverProvider>
  );
}

export default App;

