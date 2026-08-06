export default function Badge({ status, text }) {
  const getStyles = () => {
    const base = {
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'capitalize',
      display: 'inline-block'
    };

    const s = status?.toLowerCase() || '';
    if (s === 'alive') return { ...base, backgroundColor: '#D1FAE5', color: '#047857' };
    if (s === 'dead') return { ...base, backgroundColor: '#FEE2E2', color: '#B91C1C' };
    if (s === 'unknown') return { ...base, backgroundColor: 'var(--border-color)', color: '#475569' };
    if (s === 'refetching') return { ...base, backgroundColor: '#FEF3C7', color: '#B45309' };
    
    return { ...base, backgroundColor: '#F1F5F9', color: 'var(--text-secondary)' };
  };

  return (
    <span style={getStyles()}>
      {text || status}
    </span>
  );
}