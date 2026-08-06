import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Badge from '../ui/Badge';
import { useWatchlistActions, useWatchlistState } from '../../contexts/watchlist/useWatchlist';
import { characterUrl } from '../../api/endpoints';
import { useRenderCount } from '../../hooks/useRenderCount';

// [REQ-16] memoise the card with React.memo so toggling one card only re-renders this specific component
const CharacterCard = React.memo(({ character }) => {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  
  // [REQ-14] We only consume the actions here so state changes elsewhere don't force a re-render
  const { toggleWatchlist } = useWatchlistActions();
  // We do need the state to check if THIS item is in the watchlist, but memoization prevents sibling re-renders
  const { watchlistIds } = useWatchlistState();
  const isInWatchlist = watchlistIds.includes(character.id);

  // [REQ-2] render counter printed in a small corner badge
  const renderCount = useRenderCount();

  const handleMouseEnter = () => {
    setIsHovered(true);
    // [REQ-21] Prefetching: queryClient.prefetchQuery on card hover
    queryClient.prefetchQuery({
      queryKey: ['character', character.id.toString()],
      queryFn: () => fetch(characterUrl(character.id)).then(res => res.json()),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: isHovered ? '1px solid #4F46E5' : '1px solid #E2E8F0',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        boxShadow: isHovered ? '0 6px 16px rgba(15,23,42,0.10)' : '0 1px 2px rgba(15,23,42,0.06)',
        transition: 'all 0.2s',
      }}
    >
      {/* Render Counter Badge [REQ-16] */}
      <div style={{
        position: 'absolute', top: '22px', left: '22px', 
        backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', 
        fontSize: '10px', padding: '2px 6px', borderRadius: '4px', zIndex: 10
      }}>
        Renders: {renderCount}
      </div>

      <button 
        onClick={() => toggleWatchlist(character.id)}
        style={{
          position: 'absolute', top: '22px', right: '22px',
          backgroundColor: '#FFFFFF', border: 'none', borderRadius: '50%',
          width: '28px', height: '28px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10
        }}
        title="Toggle Watchlist"
      >
        <span style={{ color: isInWatchlist ? '#4F46E5' : '#94A3B8', fontSize: '14px' }}>
          {isInWatchlist ? '★' : '☆'}
        </span>
      </button>

      <div style={{
        height: '132px', borderRadius: '10px', overflow: 'hidden',
        background: 'linear-gradient(to right, #E0E7FF, #CFFAFE)', // Media gradient token
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <img 
          src={character.image} 
          alt={character.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
      </div>

      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {character.name}
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
          {character.species} • {character.gender}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <Badge status={character.status} />
        {/* [REQ-10] Link with standard href for navigation */}
        <Link 
          to={`/characters/${character.id}`}
          style={{ fontSize: '13px', color: '#4F46E5', textDecoration: 'none', fontWeight: '500' }}
        >
          Details →
        </Link>
      </div>
    </div>
  );
});

export default CharacterCard;