import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../contexts/theme/useTheme';
import { CrashTest } from '../error/CrashTest';
import Breadcrumbs from './Breadcrumbs';

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  
  // DOM Refs
  const searchInputRef = useRef(null);
  const syncTextRef = useRef(null);
  const syncIconRef = useRef(null);
  
  // Track sync time locally (using a ref so it survives without re-renders)
  const lastSyncTimeRef = useRef(Date.now());

  // [REQ-6] useEffect with real dependency list & cleanup function (Ctrl+K listener)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // [REQ-1] useRef to touch the DOM: focus an input
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // [REQ-6] useEffect with cleanup (interval timer)
  useEffect(() => {
    const interval = setInterval(() => {
      const secondsAgo = Math.floor((Date.now() - lastSyncTimeRef.current) / 1000);
      if (syncTextRef.current) {
        // [REQ-1] useRef to touch the DOM: write innerText
        syncTextRef.current.innerText = `Synced ${secondsAgo}s ago`;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    if (syncIconRef.current) {
      // [REQ-1] useRef to touch the DOM: toggle a CSS class
      // Note: Assuming a .spin CSS class is defined in your index.css
      syncIconRef.current.classList.add('spin');
    }
    
    await queryClient.invalidateQueries();
    lastSyncTimeRef.current = Date.now();
    
    if (syncTextRef.current) {
       syncTextRef.current.innerText = `Synced 0s ago`;
    }

    if (syncIconRef.current) {
      setTimeout(() => {
        syncIconRef.current.classList.remove('spin');
      }, 500); // Remove class after minimum animation time
    }
  };

  return (
    <header style={{ 
      height: '64px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Search characters... (Ctrl K)"
          style={{
            padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0',
            fontSize: '14px', width: '250px'
          }}
        />
        <Breadcrumbs />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#047857' }}></span>
          <span ref={syncTextRef}>Synced 0s ago</span>
          <button 
            ref={syncIconRef}
            onClick={handleManualRefresh}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' 
            }}
            title="Manual refresh"
          >
            ↻
          </button>
        </div>
        
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>

        <CrashTest />
      </div>
    </header>
  );
}