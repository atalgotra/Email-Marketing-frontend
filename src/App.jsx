import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DemoBanner from './components/DemoBanner';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Contacts from './pages/Contacts';
import Templates from './pages/Templates';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import { DemoProvider, useDemo } from './context/DemoContext';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const { isDemoMode } = useDemo();

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--bg-deep)',
        color: 'var(--text-muted)' 
      }}>
        Initializing Ashmyra MailFlow...
      </div>
    );
  }

  const hasAccess = Boolean(user || isDemoMode);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-deep)' }}>
      {/* Persistent Demo Banner across the entire application */}
      <DemoBanner />

      <div className="app-container" style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 42px)', background: 'var(--bg-deep)' }}>
        {hasAccess && <Sidebar />}
        <main 
          className="app-main"
          style={{ 
            flex: 1, 
            minWidth: 0,
            width: '100%',
            padding: hasAccess ? '2rem 2.5rem 3.5rem 2.5rem' : '0', 
            marginLeft: hasAccess ? '260px' : '0',
            boxSizing: 'border-box',
            background: 'var(--bg-deep)',
            overflowX: 'hidden'
          }}
        >
          <Routes>
            <Route path="/login" element={!user && !isDemoMode ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/" element={hasAccess ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/campaigns" element={hasAccess ? <Campaigns /> : <Navigate to="/login" replace />} />
            <Route path="/contacts" element={hasAccess ? <Contacts /> : <Navigate to="/login" replace />} />
            <Route path="/templates" element={hasAccess ? <Templates /> : <Navigate to="/login" replace />} />
            <Route path="/schedule" element={hasAccess ? <Schedule /> : <Navigate to="/login" replace />} />
            <Route path="/analytics" element={hasAccess ? <Analytics /> : <Navigate to="/login" replace />} />
            <Route path="/settings" element={hasAccess ? <Settings /> : <Navigate to="/login" replace />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mobile-header {
            display: flex !important;
          }
          .app-sidebar {
            transform: translateX(-100%);
          }
          .app-sidebar.open {
            transform: translateX(0);
          }
          .app-main {
            margin-left: 0 !important;
            padding: 5rem 1.25rem 3rem 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <Router>
      <DemoProvider>
        <AppRoutes />
      </DemoProvider>
    </Router>
  );
}

export default App;
