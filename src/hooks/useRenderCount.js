import { useRef } from 'react';

// [REQ-2] useRef as a persisted mutable value that must survive re-renders without causing one
export function useRenderCount() {
  const count = useRef(1);
  // eslint-disable-next-line react-hooks/refs
  const currentCount = count.current;
  // eslint-disable-next-line react-hooks/refs
  count.current += 1;
  return currentCount;
}