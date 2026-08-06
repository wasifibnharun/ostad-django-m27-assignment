import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { characterUrl, BASE_URL } from '../api/endpoints';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';

export default function ComparePage() {
  // [REQ-12] Passing parameters via navigation: Two ids travel in the query string
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const idA = searchParams.get('a') || '1';
  const idB = searchParams.get('b') || '2';

  // Fetch character A
  const { data: charA, isPending: pendingA } = useQuery({
    queryKey: ['character', idA],
    queryFn: () => fetch(characterUrl(idA)).then(res => res.json()),
    staleTime: 5 * 60 * 1000
  });

  // Fetch character B
  const { data: charB, isPending: pendingB } = useQuery({
    queryKey: ['character', idB],
    queryFn: () => fetch(characterUrl(idB)).then(res => res.json()),
    staleTime: 5 * 60 * 1000
  });

  // Fetch a list of characters just to populate the select dropdowns
  const { data: listData } = useQuery({
    queryKey: ['character', 'list', 'page-1'],
    queryFn: () => fetch(`${BASE_URL}/character?page=1`).then(res => res.json()),
    staleTime: 60 * 60 * 1000
  });
  const options = listData?.results || [];

  // Selecting a character updates the URL with useNavigate
  const handleSelectA = (e) => {
    navigate(`/compare?a=${e.target.value}&b=${idB}`);
  };

  const handleSelectB = (e) => {
    navigate(`/compare?a=${idA}&b=${e.target.value}`);
  };

  const renderColumn = (char, pending, value, onChange) => {
    if (pending || !char) {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Skeleton height="38px" />
          <Skeleton height="200px" />
          <Skeleton height="300px" />
        </div>
      );
    }

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <select 
          value={value} 
          onChange={onChange}
          style={{ height: '38px', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '0 12px', fontSize: '14px', backgroundcolor: '#FFFFFF', width: '100%' }}
        >
          {options.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
          {/* Ensure the currently selected ID is in the list even if it's not on page 1 */}
          {!options.find(o => o.id.toString() === value) && (
            <option value={value}>{char.name}</option>
          )}
        </select>

        <div style={{ backgroundcolor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ height: '200px', backgroundColor: '#EEF2FF' }}>
            <img src={char.image} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: 'var(--text-primary)' }}>{char.name}</h2>
              <Badge status={char.status} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Species</div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{char.species}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Gender</div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{char.gender}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Origin</div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{char.origin.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Episodes</div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{char.episode.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Compare Characters</h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
          State is passed purely via the URL so this comparison is shareable.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {renderColumn(charA, pendingA, idA, handleSelectA)}
        {renderColumn(charB, pendingB, idB, handleSelectB)}
      </div>
    </div>
  );
}