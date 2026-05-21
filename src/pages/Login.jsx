import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Send, 
  BarChart3, 
  Users, 
  Zap, 
  Bell, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, settings } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Send size={16} />, label: 'Bulk Email Campaigns' },
    { icon: <Zap size={16} />, label: 'Automated Communication' },
    { icon: <Bell size={16} />, label: 'Shipment & Doc Alerts' },
    { icon: <Users size={16} />, label: 'Global Contact Management' },
    { icon: <BarChart3 size={16} />, label: 'Analytics & Tracking' },
    { icon: <ShieldCheck size={16} />, label: 'Enterprise Security' }
  ];

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      overflow: 'hidden', 
      background: '#020617'
    }}>
      {/* Background Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* Left Panel: Branding & Marketing Visuals */}
      <div style={{ 
        flex: 1.2, 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '3rem 4rem', 
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.5) 100%)',
        borderRight: '1px solid var(--border-light)',
        justifyContent: 'center'
      }}>
        {/* Abstract Background Pattern */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.4)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
          </svg>
        </div>

        {/* Content Container */}
        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          maxWidth: '600px', 
          width: '100%'
        }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img src="/logo.png" alt={settings.app_name} style={{ height: '52px', marginBottom: '2.5rem' }} />
            
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 800, 
              lineHeight: 1.1, 
              marginBottom: '1rem', 
              letterSpacing: '-0.02em' 
            }}>
              Enterprise <br />
              <span className="gradient-text">Email Marketing</span> <br />
              Platform
            </h1>
            <p style={{ 
              fontSize: '1rem', 
              color: 'var(--text-muted)', 
              maxWidth: '480px', 
              lineHeight: 1.5, 
              marginBottom: '2.5rem' 
            }}>
              Manage bulk campaigns, customer outreach, shipment communication, and automated logistics engagement from one intelligent platform.
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '0.75rem', 
              width: '100%'
            }}>
              {features.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    color: 'var(--text-muted)', 
                    fontSize: '0.8rem',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ color: 'var(--primary)' }}>{item.icon}</span>
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* Right Panel: Login Form */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{ 
            width: '100%', 
            maxWidth: '440px', 
            padding: '3rem', 
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Internal Access</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secure login for {settings.app_name} administrators</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
                <input 
                  type="email" 
                  className="premium-input"
                  style={{ paddingLeft: '48px' }}
                  placeholder="marketing@zipaworld.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Key</label>
                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Forgot?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="premium-input"
                  style={{ paddingLeft: '48px', paddingRight: '48px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="premium-btn" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '1rem' }}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Authorize & Launch'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> Protected with enterprise-grade encryption
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
