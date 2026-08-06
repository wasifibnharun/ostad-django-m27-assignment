import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './queryClient';
import { ThemeProvider } from '../contexts/theme/ThemeProvider';

// FIX 1: Match the capital "L" in WatchListProvider.jsx
import { WatchlistProvider } from '../contexts/watchlist/WatchListProvider'; 

// FIX 2: Match the capital "R" in Router.jsx
import { router } from './Router'; 

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WatchlistProvider>
          <RouterProvider router={router} />
        </WatchlistProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}