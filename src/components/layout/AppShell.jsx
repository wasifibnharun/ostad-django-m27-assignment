import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// [REQ-9] A layout route renders the sidebar + topbar once and swaps only the page content through <Outlet />
export default function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-body)' }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main style={{ padding: '24px', flex: 1, overflowX: 'hidden' }}>
          {/* Outlet serves as the placeholder for child routes */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}