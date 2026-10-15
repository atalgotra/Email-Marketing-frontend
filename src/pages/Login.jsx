import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Send, 
  BarChart3, 
  Users, 
  Zap, 
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AshmyraLogo, AshmyraFullLogo } from '../components/AshmyraLogo';
import { useDemo } from '../context/DemoContext';

const Login = () => {
  const { setIsDemoMode } = useDemo();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsType, setTermsType] = useState('terms'); // 'terms' | 'privacy'

  const { login, ssoLogin, settings } = useAuth();
  const navigate = useNavigate();

  // Support SSO query parameters if user accesses via internal SSO gateway
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demouser = params.get('demouser') || params.get('email');
    const sso_token = params.get('sso_token');
    
    if (demouser && sso_token) {
      const performSSO = async () => {
        setError('');
        setLoading(true);
        try {
          await ssoLogin(demouser, sso_token);
          navigate('/');
        } catch (err) {
          setError(err.response?.data?.error || 'Single Sign-On authentication could not be completed.');
        } finally {
          setLoading(false);
        }
      };
      performSSO();
    }
  }, [ssoLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both your account email and password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Authentication failed. Please verify your credentials and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const capabilities = [
    { icon: <Send size={15} />, title: 'High-Throughput Sending', desc: 'Managed batch dispatch with rate limits & SMTP pacing' },
    { icon: <Users size={15} />, title: 'Audience Management', desc: 'CSV recipient import with field mapping & validation' },
    { icon: <Clock size={15} />, title: 'Campaign Scheduler', desc: 'Automated queue execution with scheduled delivery' },
    { icon: <BarChart3 size={15} />, title: 'Engagement Analytics', desc: 'Real-time open & click event tracking with bounce audits' }
  ];

  return (
    <div className="login-page-root">
      {/* Left Column: Product Value & Identity */}
      <div className="login-hero-pane">
        {/* Top Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}>
          <AshmyraFullLogo maxHeight={56} />
          <AshmyraLogo size="large" showTagline={true} showAttribution={true} />
        </div>

        {/* Center Pitch */}
        <div style={{ maxWidth: '520px', margin: '2.5rem 0' }}>
          <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <span className="badge badge-launch">
              <Zap size={13} /> Free During Launch Period
            </span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)', 
            fontWeight: 800, 
            lineHeight: 1.18, 
            marginBottom: '1rem', 
            letterSpacing: '-0.025em',
            color: '#f8fafc'
          }}>
            Precision Email Marketing for <span className="gradient-text">Growing Teams</span>
          </h1>

          <p style={{ 
            fontSize: '0.94rem', 
            color: 'var(--text-muted)', 
            lineHeight: 1.6, 
            marginBottom: '2rem' 
          }}>
            Create targeted email broadcasts, upload bulk audiences, design responsive templates, and monitor engagement metrics from an intuitive command center.
          </p>

          {/* Grid of Genuine Platform Capabilities */}
          <div className="login-feature-grid">
            {capabilities.map((c, i) => (
              <div 
                key={i}
                className="surface-elevated"
                style={{ 
                  padding: '0.9rem 1rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '5px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                  <div style={{ 
                    width: '26px', 
                    height: '26px', 
                    borderRadius: '6px', 
                    background: 'rgba(6, 182, 212, 0.12)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {c.icon}
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {c.title}
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Attribution */}
        <div style={{ 
          fontSize: '0.78rem', 
          color: 'var(--text-dim)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span>© {new Date().getFullYear()} Ashmyra Technologies. All rights reserved.</span>
          <span>Ashmyra MailFlow v1.0</span>
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="login-form-pane">
        <div 
          className="surface-card"
          style={{ 
            width: '100%', 
            maxWidth: '430px', 
            padding: '2.5rem',
            background: 'var(--bg-surface)'
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.35rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.45 }}>
              Sign in to manage your email campaigns, audiences, templates, and performance reports.
            </p>
          </div>

          {/* Error Feedback */}
          {error && (
            <div 
              style={{ 
                background: 'rgba(244, 63, 94, 0.1)', 
                border: '1px solid rgba(244, 63, 94, 0.25)', 
                color: '#f87171', 
                padding: '11px 14px', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.84rem', 
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label 
                htmlFor="login-email"
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.78rem', 
                  fontWeight: 600, 
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.02em'
                }}
              >
                Work Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail 
                  size={18} 
                  style={{ 
                    position: 'absolute', 
                    left: '14px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'var(--text-dim)',
                    pointerEvents: 'none'
                  }} 
                />
                <input 
                  id="login-email"
                  type="email" 
                  className="premium-input"
                  style={{ paddingLeft: '44px' }}
                  placeholder="name@ashmyra.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label 
                  htmlFor="login-password"
                  style={{ 
                    fontSize: '0.78rem', 
                    fontWeight: 600, 
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.02em'
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{ 
                    fontSize: '0.78rem', 
                    color: 'var(--primary)', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock 
                  size={18} 
                  style={{ 
                    position: 'absolute', 
                    left: '14px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'var(--text-dim)',
                    pointerEvents: 'none'
                  }} 
                />
                <input 
                  id="login-password"
                  type={showPassword ? 'text' : 'password'} 
                  className="premium-input"
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="premium-btn" 
              style={{ 
                width: '100%', 
                padding: '12px',
                fontSize: '0.94rem'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Interactive Demo Mode Quick Access */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          <button
            type="button"
            onClick={() => {
              setIsDemoMode(true);
              navigate('/');
            }}
            className="btn-secondary"
            style={{
              width: '100%',
              padding: '11px',
              fontSize: '0.88rem',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              color: '#38bdf8',
              background: 'rgba(6, 182, 212, 0.08)',
              fontWeight: 600
            }}
          >
            <Sparkles size={16} /> Explore Interactive Demo (No Login Required)
          </button>

          {/* Account Request Path (Supported Workflow) */}
          <div style={{ 
            marginTop: '1.25rem', 
            textAlign: 'center', 
            fontSize: '0.82rem', 
            color: 'var(--text-muted)' 
          }}>
            Need a MailFlow account?{' '}
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0
              }}
            >
              Request Access
            </button>
          </div>

          {/* Footer links */}
          <div style={{ 
            marginTop: '1.75rem', 
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center', 
            fontSize: '0.76rem', 
            color: 'var(--text-dim)',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <button 
              onClick={() => { setTermsType('privacy'); setShowTermsModal(true); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 'inherit' }}
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => { setTermsType('terms'); setShowTermsModal(true); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 'inherit' }}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Account Request Modal */}
      {showRequestModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="surface-card" style={{ maxWidth: '460px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '1rem' }}>
              <Shield size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>Request Workspace Access</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Ashmyra MailFlow utilizes role-based enterprise access control. Accounts are provisioned and authorized by your organization's Super Administrator.
            </p>
            <div className="surface-elevated" style={{ padding: '1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              To get an account or invite link for your team, please contact your internal administrator or email:
              <div style={{ marginTop: '6px', fontWeight: 700, color: 'var(--primary)' }}>
                support@ashmyra.com
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href="mailto:support@ashmyra.com?subject=Ashmyra%20MailFlow%20Account%20Request"
                className="premium-btn"
                style={{ flex: 1, textDecoration: 'none' }}
              >
                Send Request Email
              </a>
              <button 
                className="btn-secondary" 
                onClick={() => setShowRequestModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="surface-card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '1rem' }}>
              <HelpCircle size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>Password Recovery</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              To ensure platform security, password resets are handled directly by your organization's Super Administrator.
            </p>
            <div className="surface-elevated" style={{ padding: '1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Contact your administrator directly or reach out to <strong style={{ color: 'var(--primary)' }}>support@ashmyra.com</strong> with your registered work email to request a reset link.
            </div>
            <button 
              className="premium-btn" 
              style={{ width: '100%' }}
              onClick={() => setShowForgotModal(false)}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Privacy / Terms Modal */}
      {showTermsModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="surface-card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
              {termsType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
              <p>
                <strong>Ashmyra MailFlow</strong> is a product developed and operated by <strong>Ashmyra Technologies</strong>.
              </p>
              <p>
                {termsType === 'privacy' ? (
                  <>
                    We collect and process email addresses, delivery metadata, and campaign engagement metrics exclusively for providing campaign dispatch and analytics services to authenticated customers. We do not sell or rent uploaded contact lists to any third parties.
                  </>
                ) : (
                  <>
                    Use of Ashmyra MailFlow requires compliance with applicable bulk email and anti-spam legislation (including CAN-SPAM, GDPR, and CASL). Customers are solely responsible for ensuring lawful consent for all recipient addresses uploaded to the platform.
                  </>
                )}
              </p>
            </div>
            <button 
              className="btn-secondary" 
              style={{ width: '100%' }}
              onClick={() => setShowTermsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

