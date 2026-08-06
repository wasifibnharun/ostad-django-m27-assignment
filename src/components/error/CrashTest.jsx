import { useState } from 'react';

// [REQ-22] A Crash Test button in the topbar that throws on click
export function CrashTest() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error('This is an intentional crash to test the ErrorBoundary!');
  }

  return (
    <button 
      onClick={() => setShouldCrash(true)}
      style={{
        backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none',
        padding: '6px 12px', borderRadius: '10px', fontSize: '12px',
        fontWeight: '600', cursor: 'pointer', marginLeft: '8px'
      }}
    >
      Crash Test
    </button>
  );
}