"use client";

import { Toaster } from "@/dashboard/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { AzeroIDResolverProvider } from "@/dashboard/context/AzeroIDResolver";
import React, { lazy, useMemo, useState } from "react";
import Web3Provider from "@/dashboard/context/web3Context";
import ScrollToTop from "@/siws-app/components/scroll-to-top";
import ErrorBoundary from "@/siws-app/lib/error-boundary";
import ProviderLayout from "@/siws-app/providers/provider-layout";
import AboutView from "@/siws-app/views/about-view";
import ContactView from "@/siws-app/views/contact-view";
import { ErrorView } from "@/siws-app/views/error-view";
import FeaturesView from "@/siws-app/views/features-view";
import GettingStartedView from "@/siws-app/views/getting-started-view";
import MainView from "@/siws-app/views/main-view";
import PricingView from "@/siws-app/views/pricing-view";
import PrivacyView from "@/siws-app/views/privacy-view";
import TermsView from "@/siws-app/views/terms-view";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";

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
    [queryClient]
  );

  const memoizedRouter = useMemo(
    () => createBrowserRouter(createRoutesFromElements(routes)),
    [routes]
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
