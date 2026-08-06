import { QueryClient } from '@tanstack/react-query';

// [REQ-18] React Query setup: QueryClientProvider, sensible default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes by default
      gcTime: 30 * 60 * 1000, // 30 minutes by default
      refetchOnWindowFocus: true,
      retry: 1, // Don't retry endlessly on 404s
    },
  },
});