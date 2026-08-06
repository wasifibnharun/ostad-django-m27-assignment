import { useState, useEffect, useCallback, useMemo } from 'react';
import { WatchlistStateContext, WatchlistActionsContext } from './WatchListContext';

export function WatchlistProvider({ children }) {
  const [watchlistIds, setWatchlistIds] = useState(() => {
    const saved = localStorage.getItem('nexus_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nexus_watchlist', JSON.stringify(watchlistIds));
  }, [watchlistIds]);

  /* 
   * [REQ-16] A context performance pitfall, demonstrated and then fixed
   * 
   * STEP 1 (Naive approach - commented out):
   * If we passed an inline object like this: value={{ watchlistIds, toggleWatchlist }}
   * every single consumer of this context would re-render whenever the provider re-renders,
   * because a new object identity is created on every render.
   * 
   * STEP 3 (The Fix):
   * We split the context into State and Actions. 
   * We wrap actions in useCallback and memoize the values using useMemo.
   */

  const addToWatchlist = useCallback((id) => {
    setWatchlistIds((prev) => {
      // [REQ-4] Immutable state updates on an array using the spread operator
      if (!prev.includes(id)) return [...prev, id];
      return prev;
    });
  }, []);

  const removeFromWatchlist = useCallback((id) => {
    setWatchlistIds((prev) => prev.filter((itemId) => itemId !== id));
  }, []);

  const toggleWatchlist = useCallback((id) => {
    setWatchlistIds((prev) => 
      prev.includes(id) 
        ? prev.filter((itemId) => itemId !== id) 
        : [...prev, id]
    );
  }, []);

  const clearWatchlist = useCallback(() => {
    setWatchlistIds([]);
  }, []);

  // Memoize the state value
  const stateValue = useMemo(() => ({ watchlistIds }), [watchlistIds]);

  // Memoize the actions (dependencies are empty because of useCallback)
  const actionsValue = useMemo(() => ({
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist
  }), [addToWatchlist, removeFromWatchlist, toggleWatchlist, clearWatchlist]);

  return (
    <WatchlistStateContext.Provider value={stateValue}>
      <WatchlistActionsContext.Provider value={actionsValue}>
        {children}
      </WatchlistActionsContext.Provider>
    </WatchlistStateContext.Provider>
  );
}