import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { 
  Server, 
  ShieldCheck, 
  User, 
  Sliders, 
  Bell, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ExternalLink, 
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user: currentUser } = useAuth();
  const { isDemoMode } = useDemo();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('delivery'); // 'profile' | 'delivery' | 'limits' | 'notifications' | 'security' | 'billing'

  // Interactive In-Memory SMTP Demo State
  const [smtpConfig, setSmtpConfig] = useState({
    provider: 'custom', // 'custom' | 'ses' | 'brevo' | 'sendgrid'
    host: 'smtp.example.org',
    port: 587,
    encryption: 'tls', // 'tls' | 'ssl' | 'none'
    username: 'mailer@example.org',
    password: '••••••••••••••••',
    senderName: 'Ashmyra Dispatch Team',
    senderEmail: 'dispatch@example.org'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(null);

  // In-Memory Sending Limits
  const [limits, setLimits] = useState({
    batchSize: 50,
    intervalMs: 1000,
    dailyCap: 5000,
    enforceWarmup: true
  });

  // In-Memory Notifications
  const [notifications, setNotifications] = useState({
    emailOnComplete: true,
    emailOnBounceSpike: true,
    dailySummary: false,
    alertEmail: 'alerts@example.org'
  });

  const handleProviderSelect = (providerKey) => {
    let preset = { ...smtpConfig, provider: providerKey };
    if (providerKey === 'ses') {
      preset.host = 'email-smtp.us-east-1.amazonaws.com';
      preset.port = 587;
      preset.encryption = 'tls';
      preset.username = 'AKIAIOSFODNN7EXAMPLE';
    } else if (providerKey === 'brevo') {
      preset.host = 'smtp-relay.brevo.com';
      preset.port = 587;
      preset.encryption = 'tls';
      preset.username = 'relay-account@brevo.com';
    } else if (providerKey === 'sendgrid') {
      preset.host = 'smtp.sendgrid.net';
      preset.port = 587;
      preset.encryption = 'tls';
      preset.username = 'apikey';
    } else {
      preset.host = 'smtp.example.org';
      preset.port = 587;
      preset.encryption = 'tls';
      preset.username = 'mailer@example.org';
    }
    setSmtpConfig(preset);
  };

  const handleSaveDemoSettings = (e) => {
    e.preventDefault();
    if (isDemoMode) {
      setSaveFeedback('In-memory demo preferences updated. Real credentials are never persisted in demo mode.');
      setTimeout(() => setSaveFeedback(null), 4000);
      return;
    }
  };

  const tabs = [
    { id: 'delivery', label: 'Email Delivery (SMTP)', icon: <Server size={17} /> },
    { id: 'profile', label: 'Workspace Profile', icon: <User size={17} /> },
    { id: 'limits', label: 'Sending Safeguards', icon: <Sliders size={17} /> },
    { id: 'notifications', label: 'Alerts & Digest', icon: <Bell size={17} /> },
    { id: 'security', label: 'Security & Access', icon: <Lock size={17} /> },
    { id: 'billing', label: 'Plan & Billing', icon: <CreditCard size={17} /> }
  ];

  return (
    <div className="page-container" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f8fafc' }}>
            Workspace Settings
          </h1>
          {isDemoMode && (
            <span className="badge badge-launch">
              <Zap size={12} /> Interactive Demo Mode
            </span>
          )}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Configure customer-owned SMTP delivery providers, throttle limits, alerts, and platform credentials.
        </p>
      </header>

      {/* Main Settings Layout: Tab Nav on Left, Panel on Right */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '260px 1fr', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Vertical Tab Navigation */}
        <nav className="surface-card" style={{ padding: '0.75rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#f8fafc' : 'var(--text-muted)',
                      background: isActive ? 'rgba(6, 182, 212, 0.14)' : 'transparent',
                      border: isActive ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ color: isActive ? 'var(--primary)' : 'inherit', display: 'flex' }}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Active Content Panel */}
        <main className="surface-card" style={{ padding: '2rem 2.25rem' }}>
          {saveFeedback && (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.15)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              color: '#34d399', 
              padding: '10px 14px', 
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>{saveFeedback}</span>
            </div>
          )}

          {/* TAB 1: EMAIL DELIVERY / SMTP CONFIGURATION DEMO */}
          {activeTab === 'delivery' && (
            <div>
              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                  Customer-Owned Outbound Delivery
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Ashmyra MailFlow sends emails directly via your own SMTP server or API relay for maximal reputation control. Selecting a provider populates standard host presets.
                </p>
              </div>

              {/* Provider Quick Selector */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                  Select Outbound SMTP Provider
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  {[
                    { id: 'custom', label: 'Custom SMTP', desc: 'Private server / Postfix' },
                    { id: 'ses', label: 'Amazon SES', desc: 'AWS relay host' },
                    { id: 'brevo', label: 'Brevo (Sendinblue)', desc: 'Transactional SMTP' },
                    { id: 'sendgrid', label: 'SendGrid', desc: 'Twilio SMTP relay' }
                  ].map((p) => {
                    const isSelected = smtpConfig.provider === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProviderSelect(p.id)}
                        style={{
                          background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-surface-elevated)',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 14px',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.86rem', color: isSelected ? '#ffffff' : '#e2e8f0', marginBottom: '3px' }}>
                          {p.label}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          {p.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SMTP Configuration Form */}
              <form onSubmit={handleSaveDemoSettings}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      SMTP Hostname
                    </label>
                    <input
                      type="text"
                      className="premium-input font-mono"
                      value={smtpConfig.host}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                      placeholder="e.g. smtp.yourdomain.com"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Port
                    </label>
                    <input
                      type="number"
                      className="premium-input font-mono"
                      value={smtpConfig.port}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Encryption Protocol
                    </label>
                    <select
                      value={smtpConfig.encryption}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, encryption: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="tls">STARTTLS (Port 587 - Recommended)</option>
                      <option value="ssl">SSL / TLS Direct (Port 465)</option>
                      <option value="none">Unencrypted Plain (Port 25 - Not Recommended)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      className="premium-input font-mono"
                      value={smtpConfig.username}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                      placeholder="e.g. apiKey or mailer@example.org"
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    SMTP Password / App Secret
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="premium-input font-mono"
                      style={{ paddingRight: '40px' }}
                      value={smtpConfig.password}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                    In production mode, secrets are AES-256 encrypted server-side and never returned in plaintext.
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Sender Display Name
                    </label>
                    <input
                      type="text"
                      className="premium-input"
                      value={smtpConfig.senderName}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, senderName: e.target.value })}
                      placeholder="e.g. Ashmyra Dispatch"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Sender "From" Email
                    </label>
                    <input
                      type="email"
                      className="premium-input"
                      value={smtpConfig.senderEmail}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, senderEmail: e.target.value })}
                      placeholder="e.g. dispatch@yourdomain.com"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowTestModal(true)}
                    className="btn-secondary"
                  >
                    <RefreshCw size={15} /> Test Connection & Verify
                  </button>

                  <button
                    type="submit"
                    className="premium-btn"
                  >
                    Save SMTP Configuration
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                  Workspace Profile
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Organization identity, workspace name, and administrator credentials.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '520px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Organization Name
                  </label>
                  <input type="text" readOnly value="Ashmyra Technologies Demo Workspace" className="premium-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Administrator Email
                  </label>
                  <input type="email" readOnly value={currentUser?.email || 'demo@ashmyra.com'} className="premium-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Assigned Role
                  </label>
                  <input type="text" readOnly value="Superadmin (Demo Operator)" className="premium-input" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SENDING SAFEGUARDS */}
          {activeTab === 'limits' && (
            <div>
              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                  Queue Safeguards & Pacing
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Protect your sender reputation with automated concurrency limits and sleep intervals.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '540px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Batch Concurrency Size (Messages per batch)
                  </label>
                  <input
                    type="number"
                    value={limits.batchSize}
                    onChange={(e) => setLimits({ ...limits, batchSize: Number(e.target.value) })}
                    className="premium-input"
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                    Recommended: 25–50 for custom relays; 100 for Amazon SES.
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Pacing Interval Between Batches (Milliseconds)
                  </label>
                  <input
                    type="number"
                    value={limits.intervalMs}
                    onChange={(e) => setLimits({ ...limits, intervalMs: Number(e.target.value) })}
                    className="premium-input"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <input
                    type="checkbox"
                    id="enforceWarmup"
                    checked={limits.enforceWarmup}
                    onChange={(e) => setLimits({ ...limits, enforceWarmup: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label htmlFor="enforceWarmup" style={{ fontSize: '0.84rem', color: '#cbd5e1', cursor: 'pointer' }}>
                    Enforce automatic IP warm-up curve on new sender domains
                  </label>
                </div>

                <button onClick={handleSaveDemoSettings} className="premium-btn" style={{ alignSelf: 'flex-start' }}>
                  Save Safeguard Limits
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div>
              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                  Operational Alerts & Reports
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Receive immediate alerts when dispatch concludes or high bounce thresholds are reached.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '520px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="emailOnComplete"
                    checked={notifications.emailOnComplete}
                    onChange={(e) => setNotifications({ ...notifications, emailOnComplete: e.target.checked })}
                  />
                  <label htmlFor="emailOnComplete" style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                    Send email summary when campaign dispatch completes
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="emailOnBounceSpike"
                    checked={notifications.emailOnBounceSpike}
                    onChange={(e) => setNotifications({ ...notifications, emailOnBounceSpike: e.target.checked })}
                  />
                  <label htmlFor="emailOnBounceSpike" style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                    Trigger alert if bounce rate exceeds 3.0% on any audience batch
                  </label>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Alert Recipient Address
                  </label>
                  <input
                    type="email"
                    value={notifications.alertEmail}
                    onChange={(e) => setNotifications({ ...notifications, alertEmail: e.target.value })}
                    className="premium-input"
                  />
                </div>

                <button onClick={handleSaveDemoSettings} className="premium-btn" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                  Update Notification Rules
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'security' && (
            <div>
              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                  Security & Access Control
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Platform session policies, encryption requirements, and role-based access.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '520px' }}>
                <div className="surface-elevated" style={{ padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f1f5f9', marginBottom: '4px' }}>
                    TLS Cryptographic Enforcement
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    Mandatory TLS 1.3 protocol enforcement active. Connections to legacy SSLv3 or unencrypted relays are automatically rejected by the worker.
                  </div>
                </div>

                <div className="surface-elevated" style={{ padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f1f5f9', marginBottom: '4px' }}>
                    Session Token Lifetime
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    JWT authentications expire after 24 hours of inactivity.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BILLING & PLAN */}
          {activeTab === 'billing' && (
            <div>
              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                  Plan & Subscription Overview
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Current workspace tier, monthly recipient attempt allowances, and upgrade options.
                </p>
              </div>

              <div className="surface-elevated" style={{ padding: '1.5rem', maxWidth: '560px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-launch" style={{ marginBottom: '6px' }}>Interactive Demo Tier</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                      Commercial Demo Sandbox
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>₹0</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Sandbox access</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  You are evaluating Ashmyra MailFlow in full-featured demonstration mode. Live sending and subscription activation are inactive.
                </p>

                <button
                  onClick={() => navigate('/pricing')}
                  className="premium-btn"
                  style={{ width: '100%' }}
                >
                  View Commercial Subscription Plans <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Test Connection Demo Modal & Illustrative Verification Checklist */}
      {showTestModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="surface-card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                <ShieldCheck size={24} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                  SMTP Verification Architecture
                </h3>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="btn-ghost"
                style={{ padding: '4px', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="surface-elevated" style={{ padding: '12px 14px', marginBottom: '1.5rem', borderLeft: '4px solid #f59e0b', fontSize: '0.82rem', color: '#fbbf24', lineHeight: 1.5 }}>
              <strong>Notice: Real SMTP authentication is disabled in this demo.</strong><br/>
              Actual network socket handshakes and DNS queries are suppressed to prevent unauthorized external transmissions.
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              In production mode, clicking <em>Test Connection</em> performs an automated 6-step deliverability diagnostic:
            </p>

            {/* Illustrative Verification Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
              {[
                { title: '1. Outbound SMTP Socket Handshake', desc: 'Validates TCP connection to host on port 587/465 with TLS.' },
                { title: '2. SMTP AUTH Credentials Validation', desc: 'Authenticates username and app-specific password via SASL PLAIN/LOGIN.' },
                { title: '3. Sender Domain SPF Record Inspection', desc: 'Checks TXT record to ensure provider IP range is authorized to send.' },
                { title: '4. DKIM 2048-Bit Key Verification', desc: 'Verifies public key DNS publication matching private signing key.' },
                { title: '5. DMARC Policy & Alignment Check', desc: 'Confirms p=quarantine or p=reject policy is present on the domain.' },
                { title: '6. Provider Hourly Quota Probing', desc: 'Checks SES or Brevo API for active sending limits and bounce rates.' }
              ].map((item, idx) => (
                <div key={idx} className="surface-elevated" style={{ padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>{item.title}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textAlign: 'center', marginBottom: '1.5rem' }}>
              * Above checklist illustrates production verification logic for customer-owned domains.
            </div>

            <button
              onClick={() => setShowTestModal(false)}
              className="premium-btn"
              style={{ width: '100%' }}
            >
              Close Diagnostic Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
