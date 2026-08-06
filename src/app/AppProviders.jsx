import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './queryClient';
import { ThemeProvider } from '../contexts/theme/ThemeProvider';
import { WatchlistProvider } from '../contexts/watchlist/WatchlistProvider';
import { router } from './router';

// [REQ-18] React Query setup: QueryClientProvider and the Devtools
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