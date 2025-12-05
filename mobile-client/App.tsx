import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainNavigator } from './src/navigation';
import { useNotifications } from './src/hooks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  useNotifications();

  return <MainNavigator />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
