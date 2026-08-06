import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { characterListUrl } from '../api/endpoints';

export function useCharacters(searchParams) {
  // Convert URLSearchParams to a string to use safely in the query key
  const queryString = searchParams.toString();

  return useQuery({
    queryKey: ['characters', queryString],
    queryFn: async () => {
      const res = await fetch(characterListUrl(searchParams));
      
      // A search that matches nothing returns HTTP 404. We translate this into a friendly state instead of an app crash.
      if (res.status === 404) {
        return { error: "There is nothing here" };
      }
      
      if (!res.ok) throw new Error('Failed to fetch characters');
      return res.json();
    },
    // [REQ-20] keepPreviousData so the grid does not flash / collapse to a spinner when fetching the next page
    placeholderData: keepPreviousData,
  });
}