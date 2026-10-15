import React from 'react';
import { useDemo } from '../context/DemoContext';
import { ShieldAlert, RefreshCw, Eye, Sparkles } from 'lucide-react';

const DemoBanner = () => {
  const { isDemoMode, toggleDemoMode, resetDemoData } = useDemo();

  if (!isDemoMode) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span>Production Mode Active — Real database & operational tenant live</span>
        </div>
        <button
          onClick={toggleDemoMode}
          className="btn-ghost"
          style={{ padding: '3px 10px', fontSize: '0.75rem', color: 'var(--primary)', border: '1px solid rgba(6, 182, 212, 0.3)' }}
        >
          Switch to Interactive Demo
        </button>
      </div>
    );
  }

  return (
    <aside 
      aria-label="Demo mode indicator"
      style={{
        background: 'linear-gradient(90deg, #091326 0%, #0c1a36 50%, #091326 100%)',
        borderBottom: '1px solid rgba(6, 182, 212, 0.35)',
        boxShadow: '0 2px 12px rgba(6, 182, 212, 0.15)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        zIndex: 90,
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
        <span 
          className="badge" 
          style={{ 
            background: 'rgba(6, 182, 212, 0.2)', 
            color: '#38bdf8', 
            border: '1px solid rgba(6, 182, 212, 0.45)',
            fontWeight: 800,
            fontSize: '0.72rem',
            letterSpacing: '0.04em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            flexShrink: 0
          }}
        >
          <Sparkles size={12} />
          INTERACTIVE DEMO — SAMPLE DATA ONLY
        </span>
        <p style={{ 
          fontSize: '0.8rem', 
          color: '#cbd5e1', 
          margin: 0,
          lineHeight: 1.4
        }}>
          Explore MailFlow using sample data. Sending emails, saving SMTP credentials, changing account settings, and processing payments are disabled in this demo.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={resetDemoData}
          className="btn-ghost"
          style={{ 
            padding: '4px 9px', 
            fontSize: '0.74rem', 
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            border: '1px solid var(--border-light)'
          }}
          title="Reset fixtures back to initial state"
        >
          <RefreshCw size={12} /> Reset Sample Data
        </button>

        <button
          onClick={toggleDemoMode}
          className="btn-ghost"
          style={{ 
            padding: '4px 10px', 
            fontSize: '0.74rem', 
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}
          title="Switch to live production environment"
        >
          Exit Demo Mode
        </button>
      </div>
    </aside>
  );
};

export default DemoBanner;
