import { useQuery } from '@tanstack/react-query';
import { characterUrl } from '../api/endpoints';

export function useCharacter(id) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: async () => {
      const res = await fetch(characterUrl(id));
      if (res.status === 404) {
        throw new Error('Character not found');
      }
      if (!res.ok) {
        throw new Error('Failed to fetch character detail');
      }
      return res.json();
    },
    // Only run the query if we actually have an ID
    enabled: !!id,
  });
}