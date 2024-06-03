"use client";

import React, { useState, useEffect } from "react";

const ClientBoundary = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect will only run once, after the initial render, and only on the client
    setIsClient(true);
  }, []);

  if (typeof window === undefined || !isClient) {
    // During server-side rendering or the initial render before useEffect runs, don't render children
    return null;
  }

  // Once it's established that we're on the client, render the children
  return <>{children}</>;
};

export default ClientBoundary;
