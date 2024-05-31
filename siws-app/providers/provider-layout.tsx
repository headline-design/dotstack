import React, { memo, useCallback, Suspense, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useLocation } from "react-router-dom";
import { Header } from "../layout/header";

const ProviderLayout = ({
  queryClient,
  children,
}: {
  queryClient: any;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const [loadingState, setLoadingState] = useState(true);

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
