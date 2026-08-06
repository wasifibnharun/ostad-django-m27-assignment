// [REQ-22] The FallbackUI must show a friendly title, a short message, the technical error inside a collapsed <details>, and a "Try again" button
export function FallbackUI({ error, resetBoundary }) {
  return (
    <div style={{ padding: '24px', backgroundColor: '#FEE2E2', borderRadius: '14px', border: '1px solid #DC2626' }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#B91C1C', fontSize: '18px', fontWeight: '700' }}>
        Oops! Something crashed.
      </h3>
      <p style={{ margin: '0 0 16px 0', color: '#0F172A', fontSize: '14px' }}>
        We caught an error while rendering this panel. The rest of the dashboard should still work.
      </p>
      <details style={{ marginBottom: '16px', fontSize: '13px', color: '#64748B' }}>
        <summary style={{ cursor: 'pointer', outline: 'none' }}>Technical details</summary>
        <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {error?.message || 'Unknown Error'}
        </pre>
      </details>
      <button 
        onClick={resetBoundary}
        style={{
          backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none',
          padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px'
        }}
      >
        Try again
      </button>
    </div>
  );
}