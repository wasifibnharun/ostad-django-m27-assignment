export default function Chip({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 14px',
        borderRadius: '999px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        border: active ? '1px solid #4F46E5' : '1px solid #E2E8F0',
        backgroundColor: active ? '#4F46E5' : 'var(--bg-card)',
        color: active ? 'var(--bg-card)' : 'var(--text-secondary)',
        transition: 'all 0.2s'
      }}
    >
      {label}
      {count !== undefined && (
        <span style={{
          backgroundColor: active ? 'var(--bg-card)' : '#F1F5F9',
          color: active ? '#4F46E5' : 'var(--text-secondary)',
          padding: '2px 6px',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: '700'
        }}>
          {count}
        </span>
      )}
    </button>
  );
}