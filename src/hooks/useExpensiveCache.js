import { useRef } from 'react';

// [REQ-3] useRef used to cache an expensive computation (keyed by its input)
export function useExpensiveCache(inputData, computeFunction) {
  const cacheRef = useRef(new Map());
  const statsRef = useRef({ hits: 0, misses: 0 });

  // Create a string key to check against our cache Map
  const cacheKey = JSON.stringify(inputData);

  // eslint-disable-next-line react-hooks/refs
  if (cacheRef.current.has(cacheKey)) {
    // eslint-disable-next-line react-hooks/refs
    statsRef.current.hits += 1;
    return { 
      // eslint-disable-next-line react-hooks/refs
      result: cacheRef.current.get(cacheKey), 
      // eslint-disable-next-line react-hooks/refs
      stats: statsRef.current 
    };
  }

  // eslint-disable-next-line react-hooks/refs
  statsRef.current.misses += 1;
  
  // Perform the "expensive" computation
  const result = computeFunction(inputData);
  // eslint-disable-next-line react-hooks/refs
  cacheRef.current.set(cacheKey, result);
  
  return { 
    result, 
    // eslint-disable-next-line react-hooks/refs
    stats: statsRef.current 
  };
}