import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";

export default function RecentlyViewedPanel({ layout = 'grid' }) {
  const { recent } = useRecentlyViewed();

  if (recent.length === 0) {
    if (layout === 'grid') return null;
    return (
      <div style={{ backgroundcolor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
          Recently Viewed
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>No characters viewed yet.</p>
      </div>
    );
  }

  return (
    <div style={layout === 'panel' ? { backgroundcolor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' } : {}}>
      <h3 style={{ 
        margin: layout === 'panel' ? '0 0 16px 0' : '0 0 16px 0', 
        fontSize: layout === 'panel' ? '16px' : '20px', 
        fontWeight: '700', color: 'var(--text-primary)' 
      }}>
        Recently Viewed
      </h3>
      
      <div style={{ 
        display: layout === 'grid' ? 'grid' : 'flex', 
        flexDirection: layout === 'panel' ? 'column' : 'row',
        gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'none', 
        gap: '16px' 
      }}>
        {recent.map(char => (
          <Link 
            to={`/characters/${char.id}`} 
            key={char.id}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
              backgroundcolor: '#FFFFFF', borderRadius: '12px', 
              border: '1px solid #E2E8F0', textDecoration: 'none', 
              transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(15,23,42,0.06)'
            }}
          >
            <img 
              src={char.image} 
              alt={char.name} 
              style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} 
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {char.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {char.species}
              </div>
            </div>
            {layout === 'panel' && <span style={{ color: '#4F46E5', fontSize: '14px' }}>→</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
