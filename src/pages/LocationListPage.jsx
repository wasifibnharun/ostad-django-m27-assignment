import { useState, useEffect } from 'react';
import { BASE_URL } from '../api/endpoints';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/stats/EmptyState';
import ErrorState from '../components/stats/ErrorState';
import Pagination from '../components/stats/Pagination';

export default function LocationListPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // [REQ-8] Calling the API with async / await + try/catch / finally + AbortController
    const controller = new AbortController();
    
    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`${BASE_URL}/location?page=${page}`, { 
          signal: controller.signal 
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            setData({ error: "Nothing found" });
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const fetchedData = await res.json();
        setData(fetchedData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();

    return () => {
      controller.abort();
    };
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const locations = data?.results || [];
  const totalPages = data?.info?.pages || 1;
  const hasEmptyState = data?.error;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px 0' }}>Locations</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
          Manual fetch using Async/Await (no React Query).
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height="120px" />)}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={() => setPage(page)} />
      ) : hasEmptyState ? (
        <EmptyState />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {locations.map(loc => (
              <div key={loc.id} style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>{loc.name}</h3>
                <span style={{ fontSize: '13px', color: '#4F46E5', fontWeight: '600' }}>{loc.type}</span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Dimension: {loc.dimension}</span>
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: 'auto' }}>{loc.residents.length} residents</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={handlePageChange}
              onPrefetchNext={() => {}} 
              onPrefetchPrev={() => {}} 
            />
          </div>
        </>
      )}
    </div>
  );
}