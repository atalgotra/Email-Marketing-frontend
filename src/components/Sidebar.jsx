import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Send, BarChart3, Settings, LogOut, LayoutTemplate } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, settings } = useAuth();
  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/campaigns', icon: <Send size={20} />, label: 'Campaigns' },
    { path: '/templates', icon: <LayoutTemplate size={20} />, label: 'Templates' },
    { path: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="glass-card" style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRadius: 0,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem'
    }}>
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/logo.png" alt="Logo" style={{ height: '32px', width: 'auto', display: 'block' }} />
        <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{settings.app_name}</h2>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {menuItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '8px' }}>
              <NavLink 
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
                })}
              >
                {item.icon}
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button 
          onClick={logout}
          className="btn-secondary" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 500 }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
