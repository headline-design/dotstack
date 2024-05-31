import React, { memo, Suspense, useState } from "react";
import { ThemeProvider } from "next-themes";
import { useLocation } from "react-router-dom";
import { Header } from "../layout/header";

const ProviderLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  return (
    <React.StrictMode>
      <ThemeProvider attribute="class">
        <Suspense>
            <div className="flex flex-col min-h-[100dvh] bg-background">
              <Header />
             {children}
            </div>
        </Suspense>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default memo(ProviderLayout);
