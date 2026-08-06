export default function StatCard({ title, value, subtext, icon, iconBg, iconColor }) {
  return (
    <div style={{
      backgroundcolor: '#FFFFFF', borderRadius: '14px', padding: '20px',
      border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px',
      boxShadow: '0 1px 2px rgba(15,23,42,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          backgroundColor: iconBg, color: iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </span>
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.2' }}>
          {value}
        </div>
        {subtext && (
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}