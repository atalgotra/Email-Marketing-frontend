// Settings Page
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { 
  UserPlus, 
  Shield, 
  UserX, 
  Key, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Settings as SettingsIcon, 
  Globe,
  Lock,
  ShieldCheck,
  Loader2,
  Zap,
  Link,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const Settings = () => {
  const { user: currentUser, settings, refreshSettings } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' });
  const [generalConfig, setGeneralConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'superadmin') {
      fetchUsers();
      fetchGeneralConfig();
    }
  }, [currentUser]);

  const fetchGeneralConfig = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/config/general`);
      if (res.data) setGeneralConfig(res.data);
    } catch (err) {
      console.error('Failed to fetch general config');
    }
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/config/general`, { value: generalConfig });
      await refreshSettings();
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/users`, newUser);
      setNewUser({ email: '', password: '', role: 'user' });
      fetchUsers();
      alert('User created successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create user');
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/users/${id}`, { isActive: !currentStatus });
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const softDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const changePassword = async (id) => {
    const newPassword = window.prompt('Enter new password:');
    if (!newPassword) return;
    try {
      await axios.patch(`${API_BASE_URL}/users/${id}`, { password: newPassword });
      alert('Password changed successfully');
    } catch (err) {
      alert('Failed to change password');
    }
  };

  if (currentUser?.role !== 'superadmin' && currentUser?.role !== 'admin') {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '4rem auto' }}>
        <Shield size={48} style={{ color: '#f43f5e', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Only authorized Administrators or Superadmins can access the core system settings and user management panels.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="settings"
      >
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          System <span className="gradient-text">Settings</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage enterprise infrastructure, user permissions, and global configurations.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Create User Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 700 }}>
            <UserPlus size={20} className="text-primary" /> Create New User
          </h3>
          {currentUser.role === 'superadmin' ? (
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</label>
                <input 
                  type="email" 
                  required
                  className="premium-input"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="user@zipaworld.com"
                />
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Temporary Password</label>
                <input 
                  type="password" 
                  required
                  className="premium-input"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Access Level</label>
                <select 
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-deep)', color: 'white', outline: 'none' }}
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <button type="submit" className="premium-btn" style={{ width: '100%' }}>Create Account</button>
            </form>
          ) : (
            <div style={{ padding: '2rem', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '16px', border: '1px solid rgba(244, 63, 94, 0.1)', textAlign: 'center' }}>
              <Shield size={32} style={{ color: '#f43f5e', marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.85rem', color: '#f43f5e', fontWeight: 600 }}>User Management Locked</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Only Superadmins can provision new accounts.</p>
            </div>
          )}
        </div>

        {/* User List */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 700 }}>Active User Directory</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px' }}>User Identification</th>
                  <th style={{ padding: '12px' }}>Access Node</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Operations</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '4px 10px', 
                        borderRadius: '8px', 
                        background: u.role === 'superadmin' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: u.role === 'superadmin' ? 'var(--primary)' : 'white',
                        fontWeight: 700,
                        border: u.role === 'superadmin' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      {u.isActive ? 
                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}><CheckCircle size={14}/> Active</span> : 
                        <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}><XCircle size={14}/> Suspended</span>
                      }
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button onClick={() => changePassword(u._id)} title="Reset Security Key" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}><Key size={14}/></button>
                        <button onClick={() => toggleUserStatus(u._id, u.isActive)} title={u.isActive ? 'Suspend Access' : 'Restore Access'} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: u.isActive ? 'var(--text-muted)' : '#10b981', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}><UserX size={14}/></button>
                        <button onClick={() => softDeleteUser(u._id)} title="Permanent Deletion" style={{ background: 'rgba(244, 63, 94, 0.1)', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* General Settings */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 700 }}>
            <SettingsIcon size={20} className="text-primary" /> Application Branding
          </h3>
          <form onSubmit={handleSaveGeneral}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Public Application Name</label>
              <div style={{ position: 'relative' }}>
                <Globe size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
                <input 
                  type="text" 
                  className="premium-input"
                  style={{ paddingLeft: '48px', opacity: currentUser.role !== 'superadmin' ? 0.6 : 1 }}
                  value={generalConfig.app_name || ''}
                  disabled={currentUser.role !== 'superadmin'}
                  onChange={(e) => setGeneralConfig({...generalConfig, app_name: e.target.value})}
                />
              </div>
              {currentUser.role !== 'superadmin' && (
                <p style={{ fontSize: '0.7rem', color: '#f43f5e', marginTop: '6px', fontWeight: 600 }}>Only Superadmins can modify branding.</p>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Public System URL</label>
              <div style={{ position: 'relative' }}>
                <Link size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
                <input 
                  type="text" 
                  className="premium-input"
                  style={{ paddingLeft: '48px', opacity: currentUser.role !== 'superadmin' ? 0.6 : 1 }}
                  value={generalConfig.public_url || ''}
                  placeholder="e.g. https://outreach.zipaworld.com"
                  disabled={currentUser.role !== 'superadmin'}
                  onChange={(e) => setGeneralConfig({...generalConfig, public_url: e.target.value})}
                />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                <Info size={12} /> Used for tracking pixels and link redirections.
              </p>
            </div>

            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2.5rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
              <Zap size={20} className="text-primary" /> Deliverability & Pacing
            </h3>
            
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Outreach Cap</label>
              <input 
                type="number" 
                className="premium-input"
                disabled={currentUser.role !== 'superadmin'}
                value={generalConfig.daily_limit || 100}
                onChange={(e) => setGeneralConfig({...generalConfig, daily_limit: parseInt(e.target.value)})}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Min Delay (sec)</label>
                <input 
                  type="number" 
                  className="premium-input"
                  disabled={currentUser.role !== 'superadmin'}
                  value={generalConfig.delay_min || 30}
                  onChange={(e) => setGeneralConfig({...generalConfig, delay_min: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Delay (sec)</label>
                <input 
                  type="number" 
                  className="premium-input"
                  disabled={currentUser.role !== 'superadmin'}
                  value={generalConfig.delay_max || 120}
                  onChange={(e) => setGeneralConfig({...generalConfig, delay_max: parseInt(e.target.value) || 120})}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Global Email Signature</label>
              <div className="quill-wrapper" style={{ marginBottom: '0' }}>
                <ReactQuill 
                  theme="snow"
                  value={generalConfig.signature || ''}
                  onChange={(val) => setGeneralConfig({...generalConfig, signature: val})}
                  placeholder="This signature will be appended to every email automatically..."
                  style={{ height: '150px', marginBottom: '45px' }}
                />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                <Info size={12} /> Leave blank if you prefer manual signatures.
              </p>
            </div>

            {currentUser.role === 'superadmin' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="submit" className="premium-btn" style={{ padding: '12px 24px' }}>Save All Settings</button>
              </div>
            )}
          </form>
        </div>

      </div>
    </motion.div>

    {/* Success Toast Notification */}
    {showSaved && (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        style={{ 
          position: 'fixed', 
          bottom: '2rem', 
          right: '2rem', 
          background: 'rgba(16, 185, 129, 0.95)', 
          backdropFilter: 'blur(10px)',
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
          zIndex: 2000,
          fontWeight: 700
        }}
      >
        <CheckCircle size={20} />
        Settings Saved Successfully
      </motion.div>
    )}
    </>
  );
};

export default Settings;
