import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../api/endpoints';
import StatCard from '../components/stats/StatCard';
import { useWatchlistState } from '../contexts/watchlist/useWatchlist';
import Skeleton from '../components/ui/Skeleton';

export default function DashboardPage() {
  const { watchlistIds } = useWatchlistState();

  // Fetch parallel derived stats
  const { data: allData, isLoading: loadingAll } = useQuery({
    queryKey: ['character', 'meta'],
    queryFn: () => fetch(`${BASE_URL}/character`).then(res => res.json())
  });

  const { data: aliveData, isLoading: loadingAlive } = useQuery({
    queryKey: ['character', 'meta', 'alive'],
    queryFn: () => fetch(`${BASE_URL}/character?status=alive`).then(res => res.json())
  });

  const { data: deadData, isLoading: loadingDead } = useQuery({
    queryKey: ['character', 'meta', 'dead'],
    queryFn: () => fetch(`${BASE_URL}/character?status=dead`).then(res => res.json())
  });

  const total = allData?.info?.count || 0;
  const aliveCount = aliveData?.info?.count || 0;
  const deadCount = deadData?.info?.count || 0;

  const alivePct = total ? ((aliveCount / total) * 100).toFixed(1) : 0;
  const deadPct = total ? ((deadCount / total) * 100).toFixed(1) : 0;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.3px' }}>
          {/* Greeting IIFE executed directly in JSX */}
          {(function() {
            const hr = new Date().getHours();
            if (hr < 12) return 'Good morning';
            if (hr < 18) return 'Good afternoon';
            return 'Good evening';
          })()}
          , welcome to Nexus Explorer
        </h2>
        <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>
          Live summary from the database.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {loadingAll ? <Skeleton height="140px" /> : (
          <StatCard 
            title="Total Characters" 
            value={total} 
            subtext={`from /character meta · ${allData?.info?.pages} pages`}
            icon="👥" iconBg="#EEF2FF" iconColor="#4F46E5"
          />
        )}
        {loadingAlive ? <Skeleton height="140px" /> : (
          <StatCard 
            title="Alive" 
            value={aliveCount} 
            subtext={<span><strong style={{color: '#047857'}}>{alivePct}%</strong> of all characters</span>}
            icon="💚" iconBg="#D1FAE5" iconColor="#047857"
          />
        )}
        {loadingDead ? <Skeleton height="140px" /> : (
          <StatCard 
            title="Dead" 
            value={deadCount} 
            subtext={<span><strong style={{color: '#B91C1C'}}>{deadPct}%</strong> of all characters</span>}
            icon="🕯️" iconBg="#FEE2E2" iconColor="#B91C1C"
          />
        )}
        <StatCard 
          title="In Watchlist" 
          value={watchlistIds.length.toString().padStart(2, '0')} 
          subtext="stored in Watchlist Context"
          icon="⭐" iconBg="#FEF3C7" iconColor="#B45309"
        />
      </div>
    </div>
  );
}