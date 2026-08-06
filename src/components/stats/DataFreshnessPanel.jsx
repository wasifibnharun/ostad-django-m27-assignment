import { useQueryClient, useIsFetching, useIsRestoring } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Badge from '../ui/Badge';

export default function DataFreshnessPanel() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  const [queryState, setQueryState] = useState({ fresh: 0, stale: 0, fetching: 0 });

  // Update states periodically to show live cache status
  useEffect(() => {
    const interval = setInterval(() => {
      const queries = queryClient.getQueryCache().getAll();
      let fresh = 0, stale = 0, fetching = 0;
      
      queries.forEach(q => {
        if (q.state.fetchStatus === 'fetching') fetching++;
        else if (q.isStale()) stale++;
        else fresh++;
      });
      
      setQueryState({ fresh, stale, fetching });
    }, 1000);
    return () => clearInterval(interval);
  }, [queryClient]);

  const defaultOptions = queryClient.getDefaultOptions();
  const staleTime = defaultOptions.queries?.staleTime || 0;
  const gcTime = defaultOptions.queries?.gcTime || 0;

  return (
    <div style={{ backgroundcolor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
        Data Freshness
      </h3>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Live metrics from the React Query cache.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>staleTime</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{staleTime / 1000}s</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>gcTime</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{gcTime / 1000}s</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Badge status="alive" text="fresh" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{queryState.fresh}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Badge status="unknown" text="stale" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{queryState.stale}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Badge status="refetching" text="fetching" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{queryState.fetching}</span>
        </div>
      </div>
    </div>
  );
}
