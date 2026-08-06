import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../contexts/theme/useTheme';
import { useWatchlistActions } from '../contexts/watchlist/useWatchlist';
import Button from '../components/ui/Button';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { clearWatchlist } = useWatchlistActions();
  const queryClient = useQueryClient();

  // Read current default options from the QueryClient
  const defaultOptions = queryClient.getDefaultOptions();
  
  const [staleTime, setStaleTime] = useState(defaultOptions.queries?.staleTime || 300000);
  const [gcTime, setGcTime] = useState(defaultOptions.queries?.gcTime || 1800000);
  const [refetchOnFocus, setRefetchOnFocus] = useState(
    defaultOptions.queries?.refetchOnWindowFocus !== false
  );

  // [REQ-20] Auto caching controls: User can change staleTime and refetchOnWindowFocus at runtime
  const applyCacheSettings = () => {
    queryClient.setDefaultOptions({
      queries: {
        staleTime: Number(staleTime),
        gcTime: Number(gcTime),
        refetchOnWindowFocus: refetchOnFocus,
        retry: 1
      }
    });
    alert('Cache settings updated successfully! Navigate to characters list to see behavior changes.');
  };

  const handleClearCache = () => {
    // [REQ-20] one invalidateQueries or clear call
    queryClient.clear();
    alert('React Query cache cleared!');
  };

  const handleClearWatchlist = () => {
    clearWatchlist();
    alert('Watchlist cleared!');
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px 0' }}>Settings</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
          Configure app behavior and manage client state.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Appearance */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', margin: '0 0 16px 0' }}>Appearance</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>Theme Mode</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>Switch between Light and Dark interface.</div>
            </div>
            <Button onClick={toggleTheme}>
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </Button>
          </div>
        </div>

        {/* Cache Settings */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', margin: '0 0 16px 0' }}>React Query Cache</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0F172A', marginBottom: '4px' }}>staleTime (ms)</label>
              <input 
                type="number" 
                value={staleTime} 
                onChange={(e) => setStaleTime(e.target.value)}
                style={{ width: '100%', height: '38px', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '0 12px' }}
              />
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Time before query data is considered stale.</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0F172A', marginBottom: '4px' }}>gcTime (ms)</label>
              <input 
                type="number" 
                value={gcTime} 
                onChange={(e) => setGcTime(e.target.value)}
                style={{ width: '100%', height: '38px', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '0 12px' }}
              />
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Time before unused cache data is garbage collected.</div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={refetchOnFocus} 
                onChange={(e) => setRefetchOnFocus(e.target.checked)} 
              />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>refetchOnWindowFocus</span>
            </label>
          </div>

          <Button onClick={applyCacheSettings}>Apply Cache Settings</Button>
        </div>

        {/* Danger Zone */}
        <div style={{ backgroundColor: '#FEE2E2', padding: '24px', borderRadius: '14px', border: '1px solid #DC2626' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#B91C1C', margin: '0 0 16px 0' }}>Danger Zone</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="danger" onClick={handleClearCache}>Clear Query Cache</Button>
            <Button variant="danger" onClick={handleClearWatchlist}>Clear Watchlist</Button>
          </div>
        </div>

      </div>
    </div>
  );
}