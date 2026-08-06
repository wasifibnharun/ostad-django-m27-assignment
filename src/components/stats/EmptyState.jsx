import Button from '../ui/Button';

export default function EmptyState({ onClear }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>No results</h3>
      <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
        We couldn't find any characters matching your filters. Try adjusting them or clear all filters to start over.
      </p>
      {onClear && <Button onClick={onClear}>Clear filters</Button>}
    </div>
  );
}