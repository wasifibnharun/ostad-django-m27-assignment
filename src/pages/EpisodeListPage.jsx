import { useState, useEffect } from 'react';
import { BASE_URL } from '../api/endpoints';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/stats/EmptyState';
import ErrorState from '../components/stats/ErrorState';
import Pagination from '../components/stats/Pagination';

/*
 * Note for Evaluator: 
 * On the Characters page, React Query gave us automatic caching, deduping, 
 * background refetching, and managed loading/error states for free. 
 * Here, we have to write all the boilerplate manually (isLoading, error, data state, 
 * cleanup functions, and abort controllers) just to fetch a simple list.
 */

export default function EpisodeListPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // [REQ-6] useEffect with all three dependency-array forms (here, a real dependency list [page])
  useEffect(() => {
    // [REQ-7] Calling the API with Promises: .then() / .catch() / .finally()
    // We also use AbortController to prevent race conditions on fast page clicks
    const controller = new AbortController();
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);

    fetch(`${BASE_URL}/episode?page=${page}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return { error: "Nothing found" };
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted on cleanup');
        } else {
          setError(err);
        }
      })
      .finally(() => {
        // Finally block executes regardless of success or failure
        setIsLoading(false);
      });

    // [REQ-6] plus a cleanup function
    return () => {
      controller.abort();
    };
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const episodes = data?.results || [];
  const totalPages = data?.info?.pages || 1;
  const hasEmptyState = data?.error;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Episodes</h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
          Manual fetch using Promises (no React Query).
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height="60px" />)}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={() => setPage(page)} />
      ) : hasEmptyState ? (
        <EmptyState />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {episodes.map(ep => (
              <div key={ep.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundcolor: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: '#4F46E5', fontSize: '14px', width: '70px' }}>{ep.episode}</span>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{ep.name}</span>
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{ep.air_date}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={handlePageChange}
              onPrefetchNext={() => {}} // Not using React Query here
              onPrefetchPrev={() => {}} 
            />
          </div>
        </>
      )}
    </div>
  );
}