import { useRef } from 'react';

// [REQ-3] useRef used to cache an expensive computation (keyed by its input)
export function useExpensiveCache(inputData, computeFunction) {
  const cacheRef = useRef(new Map());
  const statsRef = useRef({ hits: 0, misses: 0 });

  // Create a string key to check against our cache Map
  const cacheKey = JSON.stringify(inputData);

  if (cacheRef.current.has(cacheKey)) {
    statsRef.current.hits += 1;
    return { 
      result: cacheRef.current.get(cacheKey), 
      stats: statsRef.current 
    };
  }

  statsRef.current.misses += 1;
  
  // Perform the "expensive" computation
  const result = computeFunction(inputData);
  cacheRef.current.set(cacheKey, result);
  
  return { 
    result, 
    stats: statsRef.current 
  };
}