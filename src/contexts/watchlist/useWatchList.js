import { useContext } from 'react';
import { WatchlistStateContext, WatchlistActionsContext } from './WatchlistContext';

// [REQ-15] Modular context structure: custom hooks that throw an error if used outside their Provider
export function useWatchlistState() {
  const context = useContext(WatchlistStateContext);
  if (context === undefined) {
    throw new Error('useWatchlistState must be used within a WatchlistProvider');
  }
  return context;
}

export function useWatchlistActions() {
  const context = useContext(WatchlistActionsContext);
  if (context === undefined) {
    throw new Error('useWatchlistActions must be used within a WatchlistProvider');
  }
  return context;
}

// Convenience hook to grab everything if needed, but separates concerns strictly
export function useWatchlist() {
  return {
    ...useWatchlistState(),
    ...useWatchlistActions()
  };
}