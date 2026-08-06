import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

// [REQ-9] a catch-all 404 route
export default function NotFoundPage() {
  return (
    <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🧭</div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 12px 0' }}>
        404 - Route not found
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px' }}>
        That page doesn't exist in this universe. You might have clicked a broken link or entered an invalid URL.
      </p>
      <Link to="/characters" style={{ textDecoration: 'none' }}>
        <Button>Return to characters</Button>
      </Link>
    </div>
  );
}