import { useEffect, useState } from 'react';
import { SPECIES_OPTIONS, GENDER_OPTIONS } from '../../api/endpoints';
import Chip from '../ui/Chip';

export default function CharacterFilters({ currentParams, onFilterChange }) {
  // [REQ-5] Controlled inputs, and one form managed "like a pro" with a single state object + one generic change handler
  const [filters, setFilters] = useState({
    status: currentParams.get('status') || '',
    species: currentParams.get('species') || '',
    gender: currentParams.get('gender') || ''
  });

  // Keep local state in sync if URL params change externally (e.g., back button)
  useEffect(() => {
    setFilters({
      status: currentParams.get('status') || '',
      species: currentParams.get('species') || '',
      gender: currentParams.get('gender') || ''
    });
  }, [currentParams]);

  // The single generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    // [REQ-4] Immutable state updates on an object using the spread operator
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(name, value);
  };

  const handleStatusClick = (statusValue) => {
    const newValue = filters.status === statusValue ? '' : statusValue;
    const newFilters = { ...filters, status: newValue };
    setFilters(newFilters);
    onFilterChange('status', newValue);
  };

  const statuses = ['alive', 'dead', 'unknown'];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', padding: '16px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>Status</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Chip 
            label="All" 
            active={!filters.status} 
            onClick={() => handleStatusClick('')} 
          />
          {statuses.map(s => (
            <Chip 
              key={s} 
              label={s.charAt(0).toUpperCase() + s.slice(1)} 
              active={filters.status === s}
              onClick={() => handleStatusClick(s)}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>Species</span>
        <select 
          name="species" 
          value={filters.species} 
          onChange={handleChange}
          style={{ height: '38px', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '0 12px', fontSize: '14px', backgroundColor: '#FFFFFF' }}
        >
          <option value="">Any</option>
          {SPECIES_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>Gender</span>
        <select 
          name="gender" 
          value={filters.gender} 
          onChange={handleChange}
          style={{ height: '38px', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '0 12px', fontSize: '14px', backgroundColor: '#FFFFFF' }}
        >
          <option value="">Any</option>
          {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
        </select>
      </div>
    </div>
  );
}