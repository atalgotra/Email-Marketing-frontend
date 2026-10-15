import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Send, 
  Plus, 
  Play, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';

const Schedule = () => {
  const { isDemoMode, campaigns, setCampaigns } = useDemo();
  const [inspectCampaign, setInspectCampaign] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [filterView, setFilterView] = useState('upcoming'); // 'upcoming' | 'all'
  const navigate = useNavigate();

  const scheduledCampaigns = (campaigns || []).filter(c => c.status === 'scheduled');
  const allScheduledAndCompleted = (campaigns || []).filter(c => c.status === 'scheduled' || c.status === 'completed');

  const displayList = filterView === 'upcoming' ? scheduledCampaigns : allScheduledAndCompleted;

  const handleSimulateRunNow = (campaign) => {
    if (!window.confirm(`Simulate immediate dispatch for "${campaign.name}"?`)) return;

    if (isDemoMode) {
      setCampaigns(prev => prev.map(c => {
        if ((c.id || c._id) === (campaign.id || campaign._id)) {
          const audience = c.audience_size || 500;
          const delivered = Math.floor(audience * 0.98);
          const bounced = audience - delivered;
          const opens = Math.floor(delivered * 0.38);
          const clicks = Math.floor(delivered * 0.08);

          return {
            ...c,
            status: 'completed',
            sent: audience,
            delivered,
            bounced,
            unique_opened: opens,
            unique_clicked: clicks,
            open_rate: '38.0',
            click_rate: '8.0',
            completed_at: new Date().toISOString()
          };
        }
        return c;
      }));

      setFeedback({ 
        type: 'success', 
        message: `Demo Mode: Simulated immediate dispatch for "${campaign.name}". Recipient performance metrics updated in memory.` 
      });
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleCancelSchedule = (campaign) => {
    if (!window.confirm(`Cancel scheduled dispatch for "${campaign.name}"? This will return it to Draft status.`)) return;

    if (isDemoMode) {
      setCampaigns(prev => prev.map(c => {
        if ((c.id || c._id) === (campaign.id || campaign._id)) {
          return {
            ...c,
            status: 'draft',
            scheduled_at: null
          };
        }
        return c;
      }));

      setFeedback({ 
        type: 'success', 
        message: `Demo Mode: Campaign "${campaign.name}" returned to Draft status. No worker tasks remain.` 
      });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const formatScheduledTime = (dateStr) => {
    if (!dateStr) return { formattedDate: 'Unspecified', countdown: 'Draft queue', isPast: false };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { formattedDate: 'Invalid date', countdown: 'Invalid', isPast: false };

    const timeDiff = d.getTime() - Date.now();
    let countdown = '';
    if (timeDiff > 0) {
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        countdown = `in ${days}d ${hours % 24}h`;
      } else if (hours > 0) {
        countdown = `in ${hours}h ${mins}m`;
      } else {
        countdown = `in ${Math.max(mins, 1)}m`;
      }
    } else {
      countdown = 'Scheduled for immediate queue window';
    }

    const formattedDate = d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return { formattedDate, countdown, isPast: timeDiff <= 0 };
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              Campaign <span className="gradient-text">Schedule</span>
            </h1>
            <span className="badge badge-launch">Asia/Kolkata (IST)</span>
            <span className="badge badge-launch" style={{ fontSize: '0.72rem' }}>Demo Worker Simulator</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Review, inspect, or simulate automated queue dispatches. Demo scheduler actions are strictly in-memory.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="surface-elevated" style={{ display: 'flex', padding: '3px', gap: '3px' }}>
            <button
              onClick={() => setFilterView('upcoming')}
              className={filterView === 'upcoming' ? 'premium-btn' : 'btn-ghost'}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              Upcoming ({scheduledCampaigns.length})
            </button>
            <button
              onClick={() => setFilterView('all')}
              className={filterView === 'all' ? 'premium-btn' : 'btn-ghost'}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              Queue History
            </button>
          </div>

          <button 
            className="premium-btn"
            onClick={() => navigate('/campaigns', { state: { createNew: true } })}
          >
            <Plus size={18} /> Schedule Demo Campaign
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {feedback && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          background: feedback.type === 'error' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${feedback.type === 'error' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
          color: feedback.type === 'error' ? '#fb7185' : '#34d399'
        }}>
          {feedback.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Safety Notice Banner */}
      <div className="surface-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
        <Info size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: '#f8fafc' }}>Demo Scheduling Isolation:</strong> All scheduled items shown below are deterministic fixtures or temporary in-memory records. The backend worker daemon is locked in demo mode and does not create real cron jobs or SMTP tasks.
        </div>
      </div>

      {displayList.length === 0 ? (
        <div className="surface-card" style={{ padding: '4.5rem 2rem', textAlign: 'center' }}>
          <CalendarIcon size={46} style={{ color: 'var(--text-dim)', marginBottom: '1.25rem', opacity: 0.5, margin: '0 auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            No Scheduled Campaigns in View
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.75rem auto', lineHeight: 1.5 }}>
            Automate future outreach by scheduling a demo campaign. You can preview date-picker workflows and delivery simulation safely.
          </p>
          <button 
            className="premium-btn"
            onClick={() => navigate('/campaigns', { state: { createNew: true } })}
          >
            Create & Schedule Campaign
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {displayList.map((c) => {
            const timeInfo = formatScheduledTime(c.scheduled_at);
            const recipientsCount = c.audience_size || c.recipients_list?.length || c.total_recipients || 0;
            const isCompleted = c.status === 'completed';

            return (
              <div 
                key={c.id || c._id}
                className="surface-card"
                style={{ 
                  padding: '1.5rem 2rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: '2rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Left: Info */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                      {c.name}
                    </h3>
                    
                    {isCompleted ? (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> Dispatched (Demo)
                      </span>
                    ) : (
                      <span className="badge badge-violet">
                        <Clock size={12} /> {timeInfo.countdown}
                      </span>
                    )}

                    <span className="badge badge-launch" style={{ fontSize: '0.72rem' }}>
                      {c.provider || 'Custom SMTP'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span>
                      <strong>Execution Window:</strong> {timeInfo.formattedDate} IST
                    </span>
                    <span>
                      <strong>Target Audience:</strong> {recipientsCount.toLocaleString()} recipients
                    </span>
                    <span>
                      <strong>Subject:</strong> {Array.isArray(c.subject) ? c.subject.join(' | ') : c.subject || '—'}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setInspectCampaign(c)}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                    title="Inspect dispatch parameters"
                  >
                    <Sliders size={15} />
                    <span>Inspect Parameters</span>
                  </button>

                  {!isCompleted && (
                    <>
                      <button
                        onClick={() => handleSimulateRunNow(c)}
                        className="premium-btn"
                        style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                        title="Simulate immediate launch in demo mode"
                      >
                        <Play size={15} />
                        <span>Simulate Launch</span>
                      </button>

                      <button
                        onClick={() => handleCancelSchedule(c)}
                        className="btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.84rem', color: '#fb7185' }}
                        title="Cancel scheduled dispatch"
                      >
                        <Trash2 size={15} />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Scheduling Workflow Modal */}
      <AnimatePresence>
        {inspectCampaign && (
          <div 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(10, 15, 29, 0.88)', 
              backdropFilter: 'blur(8px)', 
              zIndex: 1000, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '1.5rem' 
            }}
            onClick={() => setInspectCampaign(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="surface-card" 
              style={{ width: '100%', maxWidth: '640px', padding: '2rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                    Scheduling Workflow Parameters
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Campaign: <strong style={{ color: '#f1f5f9' }}>{inspectCampaign.name}</strong>
                  </div>
                </div>
                <button 
                  onClick={() => setInspectCampaign(null)} 
                  className="btn-ghost"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                <div className="surface-elevated" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Dispatch Rate Throttling
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginTop: '4px' }}>
                    100 messages / minute (Configured Provider Cap)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Prevents rate-limit rejections from Amazon SES or customer SMTP server.
                  </div>
                </div>

                <div className="surface-elevated" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Worker Heartbeat & Polling Interval
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginTop: '4px' }}>
                    Every 60 seconds (Node-cron queue runner)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Checks for campaigns due for immediate execution according to server time.
                  </div>
                </div>

                <div className="surface-elevated" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Pre-Dispatch Suppression Verification
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
                    Active • 100% Recipient Scrub Prior to Send
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Automatically removes hard-bounced and unsubscribed addresses before SMTP handover.
                  </div>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', gap: '10px' }}>
                  <ShieldCheck size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.8rem', color: '#fcd34d', lineHeight: 1.45 }}>
                    <strong>Interactive Demo Mode:</strong> In this preview, launching or cancelling campaigns updates your temporary session in memory. No real emails or persistent server jobs are created.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  className="premium-btn" 
                  onClick={() => setInspectCampaign(null)}
                >
                  Close Parameters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Schedule;
