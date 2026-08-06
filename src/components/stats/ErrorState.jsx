import Button from '../ui/Button';

export default function ErrorState({ error, onRetry }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: '#FEE2E2', borderRadius: '14px', border: '1px solid #DC2626' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#B91C1C', marginBottom: '8px' }}>Request failed</h3>
      <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px' }}>
        We couldn't reach the character service. Please check your connection and try again.
      </p>
      <details style={{ marginBottom: '24px', fontSize: '13px', color: '#B91C1C' }}>
        <summary style={{ cursor: 'pointer' }}>Technical details</summary>
        <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{error?.message || 'Unknown network error'}</pre>
      </details>
      <Button variant="danger" onClick={onRetry}>↻ Retry</Button>
    </div>
  );
}