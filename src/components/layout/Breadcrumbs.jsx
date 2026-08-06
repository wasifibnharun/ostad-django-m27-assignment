import { useLocation, Link } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav style={{ fontSize: '12px', color: '#64748B', display: 'flex', gap: '6px' }}>
      <Link to="/" style={{ color: '#4F46E5', textDecoration: 'none' }}>Explore</Link>
      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <span key={to} style={{ display: 'flex', gap: '6px' }}>
            <span>›</span>
            {isLast ? (
              <span style={{ fontWeight: '600', color: '#0F172A' }}>{label}</span>
            ) : (
              <Link to={to} style={{ color: '#4F46E5', textDecoration: 'none' }}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}