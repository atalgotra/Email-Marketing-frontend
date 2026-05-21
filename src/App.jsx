import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import { Fireflies, LeopardEyes } from './components/ThemeElements';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
        <LeopardEyes top="30%" right="15%" />
        <LeopardEyes top="65%" left="10%" scale={0.6} delayOffset={1.5} />
        <LeopardEyes top="15%" left="35%" scale={0.4} delayOffset={3.2} />
        <LeopardEyes bottom="20%" right="25%" scale={0.5} delayOffset={2.1} />
        <Fireflies />
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        {user && <Sidebar />}
        <main style={{ 
          flex: 1, 
          padding: user ? '2rem' : '0', 
          marginLeft: user ? '260px' : '0',
          background: 'transparent' 
        }}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/campaigns" element={<PrivateRoute><Campaigns /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
