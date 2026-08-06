import { useState, useCallback } from 'react';

// [REQ-17] Client state: "recently viewed" list (max 5, newest first)
export function useRecentlyViewed() {
  const [recent, setRecent] = useState(() => {
    const saved = localStorage.getItem('nexus_recent');
    return saved ? JSON.parse(saved) : [];
  });

  const addRecent = useCallback((character) => {
    setRecent(prev => {
      // Remove it if it's already in the list to avoid duplicates
      const filtered = prev.filter(c => c.id !== character.id);
      // [REQ-4] Immutable array update using spread, keeping max 5 items
      const updated = [character, ...filtered].slice(0, 5);
      localStorage.setItem('nexus_recent', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { recent, addRecent };
}