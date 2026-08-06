import { useRef, useEffect } from 'react';

// [REQ-2] useRef as a persisted mutable value (previous value ref)
export function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}