import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCharacters } from '../hooks/useCharacters';
import CharacterCard from '../components/characters/CharacterCard';
import CharacterFilters from '../components/characters/CharacterFilters';
import Pagination from '../components/stats/Pagination';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/stats/EmptyState';
import ErrorState from '../components/stats/ErrorState';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function CharacterListPage() {
  const queryClient = useQueryClient();
  
  // [REQ-12] useSearchParams (query params): Filters & page live in the URL so the view is shareable
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current URL params, default page to 1
  const page = parseInt(searchParams.get('page') || '1', 10);
  const nameQuery = searchParams.get('name') || '';

  // [REQ-19] React Query loading/error/empty handling
  const { data, isPending, isError, error, isFetching } = useCharacters(searchParams);

  // Generic updater to sync changes to URL and reset to page 1
  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Changing a filter resets page back to 1
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    updateParams('page', newPage.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Extract variables safely
  const hasEmptyState = data?.error;
  const characters = data?.results || [];
  const totalPages = data?.info?.pages || 1;
  const totalCount = data?.info?.count || 0;

  // Render Skeleton Grid
  const renderSkeletons = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} height="280px" />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px 0', letterSpacing: '-0.3px' }}>
              Characters
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
              Browse 826 characters · filtered results update the URL so the view is shareable.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={clearFilters}>✕ Clear filters</Button>
          </div>
        </div>

        {/* Filters Panel */}
        <div style={{ margin: '0 -24px 24px -24px' }}>
          <CharacterFilters currentParams={searchParams} onFilterChange={updateParams} />
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>Results</h2>
            {isFetching && !isPending && <Badge status="refetching" text="background refetching..." />}
          </div>
          {!hasEmptyState && !isError && (
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              Showing {characters.length} of {totalCount}
            </span>
          )}
        </div>

        {/* Dynamic States */}
        {isPending ? (
          renderSkeletons()
        ) : isError ? (
          <ErrorState error={error} onRetry={() => queryClient.invalidateQueries()} />
        ) : hasEmptyState ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {characters.map(char => (
                <CharacterCard key={char.id} character={char} />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0', borderTop: '1px solid #E2E8F0' }}>
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange}
                onPrefetchNext={() => {
                  if (page < totalPages) {
                    const nextParams = new URLSearchParams(searchParams);
                    nextParams.set('page', (page + 1).toString());
                    queryClient.prefetchQuery({
                      queryKey: ['characters', nextParams.toString()],
                      queryFn: () => fetch(`https://rickandmortyapi.com/api/character?${nextParams.toString()}`).then(res => res.json()),
                      staleTime: 5 * 60 * 1000
                    });
                  }
                }}
                onPrefetchPrev={() => {
                  if (page > 1) {
                    const prevParams = new URLSearchParams(searchParams);
                    prevParams.set('page', (page - 1).toString());
                    queryClient.prefetchQuery({
                      queryKey: ['characters', prevParams.toString()],
                      queryFn: () => fetch(`https://rickandmortyapi.com/api/character?${prevParams.toString()}`).then(res => res.json()),
                      staleTime: 5 * 60 * 1000
                    });
                  }
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Right Rail placeholder (Watchlist & Data Freshness) */}
      <aside style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* WatchlistPanel component will go here */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
           <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Right Rail Reserved</h3>
           <p style={{ fontSize: '13px', color: '#64748B'}}>Watchlist and Data Freshness panels will render here in desktop view.</p>
        </div>
      </aside>
    </div>
  );
}