import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  LayoutTemplate, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Zap,
  Shield,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { AshmyraLogo } from './AshmyraLogo';

const Sidebar = () => {
  const { user, logout, settings } = useAuth();
  const { isDemoMode, toggleDemoMode } = useDemo();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={19} />, label: 'Dashboard' },
    { path: '/campaigns', icon: <Send size={19} />, label: 'Campaigns' },
    { path: '/contacts', icon: <Users size={19} />, label: 'Contacts' },
    { path: '/templates', icon: <LayoutTemplate size={19} />, label: 'Templates' },
    { path: '/schedule', icon: <Calendar size={19} />, label: 'Schedule' },
    { path: '/analytics', icon: <BarChart3 size={19} />, label: 'Analytics' },
    { path: '/settings', icon: <Settings size={19} />, label: 'Settings' },
    { path: '/pricing', icon: <CreditCard size={19} />, label: 'Pricing & Plans' },
  ];

  const handleNavClick = () => {
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div 
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-light)',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          zIndex: 50
        }}
        className="mobile-header"
      >
        <AshmyraLogo size="small" showTagline={false} />
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-ghost"
          style={{ padding: '8px', color: '#f8fafc' }}
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 55
          }}
        />
      )}

      {/* Main Sidebar */}
      <aside 
        style={{
          width: '260px',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 1.2rem',
          zIndex: 60,
          transition: 'transform 0.25s ease-in-out',
          transform: mobileOpen ? 'translateX(0)' : undefined
        }}
        className={`app-sidebar ${mobileOpen ? 'open' : ''}`}
      >
        {/* Brand Header */}
        <div style={{ marginBottom: '2rem', paddingLeft: '4px' }}>
          <AshmyraLogo size="medium" showTagline={true} />
        </div>

        {/* Free Launch Banner */}
        <div 
          className="surface-elevated"
          style={{ 
            padding: '10px 12px', 
            marginBottom: '1.75rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px'
          }}
        >
          <Zap size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Free Launch Access</span>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>All core features unlocked</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  onClick={handleNavClick}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#f8fafc' : 'var(--text-muted)',
                    background: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(6, 182, 212, 0.28)' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <span style={{ color: isActive ? 'var(--primary)' : 'inherit', display: 'flex' }}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Card & Logout / Demo Exit */}
        <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, paddingRight: '8px' }}>
              <span style={{ 
                fontSize: '0.84rem', 
                fontWeight: 600, 
                color: '#f1f5f9',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.name || (isDemoMode ? 'Demo Operator' : 'Administrator')}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'capitalize' }}>
                {user?.role || (isDemoMode ? 'demo@ashmyra.com' : 'superadmin')}
              </span>
            </div>
            <span className="badge badge-launch" style={{ fontSize: '0.65rem' }}>
              {isDemoMode ? 'Sandbox' : user?.role === 'superadmin' ? 'Root' : 'Admin'}
            </span>
          </div>

          {user ? (
            <button 
              onClick={logout}
              className="btn-ghost" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                width: '100%',
                fontSize: '0.84rem',
                color: 'var(--text-muted)'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          ) : (
            <button 
              onClick={toggleDemoMode}
              className="btn-ghost" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                width: '100%',
                fontSize: '0.84rem',
                color: 'var(--primary)'
              }}
            >
              <LogOut size={16} />
              <span>Exit Demo Mode</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
