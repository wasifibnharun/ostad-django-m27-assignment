import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../api/endpoints';

export default function Sidebar({ isOpen, setIsOpen }) {
  // Fetch meta counts to populate the sidebar pills. We use a lightweight query just for page 1.
  const { data: charMeta } = useQuery({
    queryKey: ['character', 'meta'],
    queryFn: () => fetch(`${BASE_URL}/character?page=1`).then(res => res.json()),
    staleTime: 60 * 60 * 1000 // Keep it fresh for a long time
  });

  const { data: epMeta } = useQuery({
    queryKey: ['episode', 'meta'],
    queryFn: () => fetch(`${BASE_URL}/episode?page=1`).then(res => res.json()),
    staleTime: 60 * 60 * 1000
  });

  const { data: locMeta } = useQuery({
    queryKey: ['location', 'meta'],
    queryFn: () => fetch(`${BASE_URL}/location?page=1`).then(res => res.json()),
    staleTime: 60 * 60 * 1000
  });

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/characters', label: 'Characters', count: charMeta?.info?.count },
    { to: '/episodes', label: 'Episodes', count: epMeta?.info?.count },
    { to: '/locations', label: 'Locations', count: locMeta?.info?.count },
    { to: '/watchlist', label: 'Watchlist' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}
      <aside 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{ width: '248px', backgroundColor: '#081220', color: '#FFFFFF', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ marginBottom: '32px', paddingLeft: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Nexus Explorer</h1>
        <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>Character Intelligence</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => (
          // [REQ-10] Link and NavLink, with the active style produced by NavLink's isActive
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '500',
              color: isActive ? '#FFFFFF' : '#94A3B8',
              backgroundColor: isActive ? '#4F46E5' : 'transparent',
              transition: 'all 0.2s'
            })}
          >
            <span>{item.label}</span>
            {item.count && (
              <span style={{
                backgroundColor: '#151F35',
                color: '#FFFFFF',
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '999px'
              }}>
                {item.count}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
    </>
  );
}