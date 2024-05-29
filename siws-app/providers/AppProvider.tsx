import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import App from '@/dashboard/App';

export default function AppProvider() {

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
          <App />
      </QueryClientProvider>
    </SessionProvider>
  );
}
