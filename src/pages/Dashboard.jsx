import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { 
  Send, 
  MousePointer2, 
  Eye, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Plus, 
  CheckCircle2, 
  Zap, 
  Info, 
  Activity, 
  Server, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    isDemoMode, 
    demoStats, 
    campaigns: demoCampaigns, 
    activities: demoActivities, 
    systemStatus: demoSystemStatus 
  } = useDemo();

  const [stats, setStats] = useState(demoStats);
  const [systemStatus, setSystemStatus] = useState(demoSystemStatus);
  const [activities, setActivities] = useState(demoActivities);
  const [recentCampaigns, setRecentCampaigns] = useState(demoCampaigns.slice(0, 4));
  const [timeRange, setTimeRange] = useState(7);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchData = useCallback(async (showRefreshing = false) => {
    if (isDemoMode) {
      if (showRefreshing) setIsRefreshing(true);
      // Use deterministic demo fixtures
      let daily = demoStats.daily_stats_7d;
      if (timeRange === 14) daily = demoStats.daily_stats_14d;
      if (timeRange === 30) daily = demoStats.daily_stats_30d;

      setStats({
        ...demoStats,
        daily_stats: daily
      });
      setSystemStatus(demoSystemStatus);
      setActivities(demoActivities);
      setRecentCampaigns(demoCampaigns.slice(0, 4));
      setLastRefreshed(new Date());
      setLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      if (showRefreshing) setIsRefreshing(true);
      else setLoading(true);

      const [statsRes, logsRes, statusRes, campaignsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/stats?days=${timeRange}`),
        axios.get(`${API_BASE_URL}/stats/logs`),
        axios.get(`${API_BASE_URL}/campaigns/system/status`),
        axios.get(`${API_BASE_URL}/campaigns`)
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data || {});
      }

      if (statusRes.status === 'fulfilled' && statusRes.value.data?.success) {
        setSystemStatus(statusRes.value.data);
      } else {
        setSystemStatus(null);
      }

      if (campaignsRes.status === 'fulfilled' && Array.isArray(campaignsRes.value.data)) {
        setRecentCampaigns(campaignsRes.value.data.slice(0, 4));
      }

      const eventList = [];
      if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value.data)) {
        logsRes.value.data.forEach(log => {
          let eventText = `Dispatched to ${log.email}`;
          let statusType = log.status;
          if (log.status === 'opened') eventText = `Opened by ${log.email}`;
          else if (log.status === 'clicked') eventText = `Link clicked by ${log.email}`;
          else if (log.status === 'failed' || log.status === 'bounced') eventText = `Delivery bounced: ${log.email}`;

          const logTime = new Date(log.timestamp);
          eventList.push({
            time: !isNaN(logTime.getTime()) ? logTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
            event: eventText,
            type: statusType,
            timestamp: !isNaN(logTime.getTime()) ? logTime.getTime() : 0
          });
        });
      }
      eventList.sort((a, b) => b.timestamp - a.timestamp);
      setActivities(eventList.slice(0, 6));

      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [timeRange, isDemoMode, demoStats, demoSystemStatus, demoActivities, demoCampaigns]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Six Balanced Metric Cards (Mathematical Consistency: 7,232/18,081 ≈ 40.0%, 1,446/18,081 ≈ 8.0%)
  const cards = [
    { 
      label: 'Total Dispatched', 
      value: (stats.sent || 0).toLocaleString(), 
      icon: <Send size={18} />, 
      color: 'var(--primary)',
      subtext: isDemoMode ? '18,450 sample recipient dispatches' : 'Initiated via SMTP queue' 
    },
    { 
      label: 'Delivered', 
      value: (stats.delivered !== undefined ? stats.delivered : stats.sent || 0).toLocaleString(), 
      icon: <CheckCircle2 size={18} />, 
      color: '#10b981',
      subtext: isDemoMode ? '18,081 delivered (369 bounces deducted)' : (stats.sent || 0) === 0 ? 'No dispatch recorded' : 'Dispatched without recorded bounce' 
    },
    { 
      label: 'Unique Opens', 
      value: (stats.unique_opened || 0).toLocaleString(), 
      icon: <Eye size={18} />, 
      color: '#38bdf8',
      subtext: isDemoMode ? '7,232 opens (~40.0% of delivered)' : `${stats.open_rate || '0.0'}% of dispatched audience` 
    },
    { 
      label: 'Unique Clicks', 
      value: (stats.unique_clicked || 0).toLocaleString(), 
      icon: <MousePointer2 size={18} />, 
      color: '#8b5cf6',
      subtext: isDemoMode ? '1,446 clicks (~8.0% of delivered)' : `${stats.click_rate || '0.0'}% link engagement` 
    },
    { 
      label: 'Open Rate', 
      value: `${stats.open_rate || '0.0'}%`, 
      icon: <TrendingUp size={18} />, 
      color: '#22d3ee',
      subtext: 'Delivered-to-open ratio' 
    },
    { 
      label: 'Click-Through Rate', 
      value: `${stats.click_rate || '0.0'}%`, 
      icon: <BarChart3 size={18} />, 
      color: '#a78bfa',
      subtext: 'Delivered-to-click conversion' 
    }
  ];

  const getServiceStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('connected') || s.includes('operational') || s.includes('configured') || s.includes('ready')) {
      return { class: 'badge-success', dotColor: '#10b981' };
    }
    if (s.includes('idle') || s.includes('demo') || s.includes('memory')) {
      return { class: 'badge-neutral', dotColor: '#38bdf8' };
    }
    if (s.includes('setup') || s.includes('attention') || s.includes('degraded')) {
      return { class: 'badge-warning', dotColor: '#f59e0b' };
    }
    return { class: 'badge-danger', dotColor: '#f43f5e' };
  };

  const overall = isDemoMode 
    ? {
        status: 'Healthy',
        label: 'Illustrative Demo Status',
        diagnostic: 'Simulated demo environment active. Outbound SMTP and persistent mutations are safely disabled.'
      }
    : (systemStatus?.overall || {
        status: 'Unknown',
        label: 'Status Unavailable',
        diagnostic: 'Telemetry endpoint unreachable. Verify backend server is active.'
      });

  return (
    <div className="page-container">
      {/* Header Bar */}
      <header style={{ 
        marginBottom: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.95rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f8fafc' }}>
              Campaign Command Center
            </h1>
            {isDemoMode ? (
              <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', border: '1px solid rgba(6, 182, 212, 0.35)' }}>
                <Sparkles size={12} /> Interactive Demo Preview
              </span>
            ) : (
              <span className="badge badge-launch">
                <Zap size={12} /> Free During Launch
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isDemoMode ? (
              <>Evaluating Ashmyra MailFlow with <strong style={{ color: '#f1f5f9' }}>deterministic sample data</strong>. Explore workflows safely.</>
            ) : (
              <>Welcome back, <strong style={{ color: '#f1f5f9' }}>{user?.name || user?.email}</strong>. Operational telemetry and campaign dispatch.</>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/campaigns', { state: { createNew: true } })}
            className="premium-btn"
          >
            <Plus size={16} /> Create Campaign
          </button>
          <button 
            onClick={() => navigate('/contacts')}
            className="btn-secondary"
          >
            <Users size={16} /> Import Contacts
          </button>
          <button 
            onClick={() => navigate('/pricing')}
            className="btn-secondary"
            style={{ color: 'var(--primary)' }}
          >
            View Pricing
          </button>
        </div>
      </header>

      {/* Balanced 6 KPI Grid */}
      <section aria-label="Key Performance Indicators" style={{ marginBottom: '2rem' }}>
        <div className="kpi-grid">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="surface-card" 
              style={{ 
                padding: '1.35rem 1.4rem',
                minHeight: '130px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '0.74rem', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.04em' 
                  }}>
                    {card.label}
                  </span>
                  {isDemoMode && (
                    <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.12)', color: '#38bdf8', fontWeight: 700 }}>
                      DEMO DATA
                    </span>
                  )}
                </div>

                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border-light)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: card.color 
                }}>
                  {card.icon}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '3px', lineHeight: 1.15 }}>
                  {loading ? '—' : card.value}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                  {card.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid: Performance Chart on Left, Activity & System Status on Right */}
      <div className="dashboard-main-grid">
        {/* Left Column: Outreach Performance Chart + Recent Campaigns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Performance Chart Panel */}
          <div className="surface-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: '#f8fafc', marginBottom: '3px' }}>
                    Outreach Performance
                  </h2>
                  {isDemoMode && (
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
                      DEMO
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {isDemoMode ? 'Illustrative daily dispatch volume across sample campaigns' : 'Real-time dispatch volume across recipient audiences'}
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(parseInt(e.target.value))}
                  aria-label="Select Date Range"
                  style={{ 
                    width: 'auto',
                    background: 'var(--bg-surface-elevated)', 
                    border: '1px solid var(--border-light)', 
                    color: 'var(--text-secondary)', 
                    padding: '5px 10px', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: '0.8rem' 
                  }}
                >
                  <option value={7}>Last 7 Days</option>
                  <option value={14}>Last 14 Days</option>
                  <option value={30}>Last 30 Days</option>
                </select>
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{ minHeight: '220px', flex: 1, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
              {(!stats.daily_stats || stats.daily_stats.length === 0) ? (
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  textAlign: 'center',
                  padding: '2rem'
                }}>
                  <BarChart3 size={38} style={{ color: 'var(--text-dim)', marginBottom: '0.75rem', opacity: 0.4 }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    No Outreach Logged For This Window
                  </h3>
                  <button 
                    onClick={() => navigate('/campaigns', { state: { createNew: true } })}
                    className="btn-secondary"
                    style={{ fontSize: '0.84rem', padding: '7px 16px' }}
                  >
                    Create First Campaign
                  </button>
                </div>
              ) : (
                <div style={{ width: '100%', height: '210px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  {stats.daily_stats.map((s, i) => {
                    const maxCount = Math.max(...stats.daily_stats.map(d => d.count || 0), 1);
                    const height = ((s.count || 0) / maxCount) * 100;
                    return (
                      <div 
                        key={i} 
                        style={{ 
                          flex: 1, 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'flex-end', 
                          alignItems: 'center', 
                          gap: '6px' 
                        }}
                      >
                        <div 
                          style={{ 
                            width: '100%', 
                            height: `${Math.max(height, 6)}%`, 
                            background: (s.count || 0) > 0 
                              ? 'linear-gradient(180deg, var(--primary) 0%, rgba(6, 182, 212, 0.2) 100%)' 
                              : 'rgba(255,255,255,0.04)', 
                            borderRadius: '4px 4px 0 0',
                            position: 'relative'
                          }}
                        >
                          {(s.count || 0) > 0 && (
                            <span style={{ 
                              position: 'absolute', 
                              top: '-20px', 
                              left: '50%', 
                              transform: 'translateX(-50%)', 
                              fontSize: '0.68rem', 
                              fontWeight: 700, 
                              color: 'var(--primary)' 
                            }}>
                              {s.count.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                          {s.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Privacy note */}
            <div style={{ 
              marginTop: '1.25rem', 
              paddingTop: '0.75rem', 
              borderTop: '1px solid var(--border-subtle)', 
              fontSize: '0.72rem', 
              color: 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Info size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>{isDemoMode ? 'Illustrative metrics based on deterministic 18,450 message test cohort.' : 'Open tracking relies on image pixel downloads; client proxies and image blocking may affect open metrics.'}</span>
            </div>
          </div>

          {/* Recent Campaigns Table Snippet */}
          <div className="surface-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '2px' }}>
                  Recent Campaigns
                </h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                  {isDemoMode ? 'Sample broadcast queues and statuses' : 'Latest operational dispatches'}
                </span>
              </div>
              <button 
                onClick={() => navigate('/campaigns')}
                className="btn-ghost" 
                style={{ fontSize: '0.8rem', color: 'var(--primary)' }}
              >
                View All ({demoCampaigns.length}) →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentCampaigns.map((c) => (
                <div 
                  key={c._id}
                  className="surface-elevated"
                  style={{
                    padding: '11px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/campaigns')}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Audience: {c.audience_size.toLocaleString()} recipients • {c.provider}
                    </div>
                  </div>

                  <span className={`badge ${
                    c.status === 'completed' ? 'badge-success' : c.status === 'scheduled' ? 'badge-launch' : c.status === 'failed' ? 'badge-danger' : 'badge-neutral'
                  }`}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed & Infrastructure Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Activity Feed */}
          <div className="surface-card" style={{ padding: '1.75rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: '#f8fafc', marginBottom: '2px' }}>
                  Campaign Activity Feed
                </h2>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                  Refreshed {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button 
                onClick={() => fetchData(true)}
                className="btn-ghost" 
                style={{ padding: '6px' }}
                title="Refresh recent activity"
                disabled={isRefreshing}
              >
                <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {activities.map((ev, i) => (
                <div 
                  key={i} 
                  className="surface-elevated"
                  style={{ 
                    padding: '10px 12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{ 
                      width: '7px', 
                      height: '7px', 
                      borderRadius: '50%', 
                      background: ev.type === 'opened' ? '#38bdf8' : ev.type === 'clicked' ? '#10b981' : ev.type === 'failed' ? '#f43f5e' : 'var(--primary)',
                      flexShrink: 0
                    }} />
                    <span style={{ 
                      fontSize: '0.82rem', 
                      color: '#f1f5f9',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {ev.event}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', flexShrink: 0 }}>
                    {ev.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Health Card (Strictly labeled as Illustrative Demo Status in Demo Mode) */}
          <div className="surface-card" style={{ padding: '1.5rem', border: isDemoMode ? '1px dashed rgba(6, 182, 212, 0.4)' : '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <Server size={17} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                    {isDemoMode ? 'Illustrative Demo Status' : 'Infrastructure Health'}
                  </h3>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {isDemoMode ? 'Visually simulated demo status' : `Checked: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </div>
              </div>

              {/* Dynamic Overall Badge */}
              <span className={`badge ${
                overall.status === 'Healthy' 
                  ? 'badge-success' 
                  : overall.status === 'Attention' 
                    ? 'badge-warning' 
                    : 'badge-neutral'
              }`}>
                {overall.status === 'Healthy' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                <span>{overall.label}</span>
              </span>
            </div>

            {/* Diagnostic Message */}
            <div 
              className="surface-elevated"
              style={{ 
                padding: '9px 12px', 
                marginBottom: '1rem',
                fontSize: '0.76rem',
                color: '#cbd5e1',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                lineHeight: 1.45
              }}
            >
              <Info size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <span>{overall.diagnostic}</span>
            </div>

            {/* 4 Service Nodes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Database */}
              <div className="surface-elevated" style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '3px' }}>MongoDB Database</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600 }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: getServiceStatusBadge(systemStatus?.database?.status).dotColor }} />
                  <span style={{ color: '#f1f5f9' }}>{systemStatus?.database?.status || 'Connected'}</span>
                </div>
              </div>

              {/* SMTP Dispatch */}
              <div className="surface-elevated" style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '3px' }}>SMTP Dispatch</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600 }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: getServiceStatusBadge(systemStatus?.smtp?.status).dotColor }} />
                  <span style={{ color: '#f1f5f9' }}>{systemStatus?.smtp?.status || 'Simulated'}</span>
                </div>
              </div>

              {/* Campaign Worker */}
              <div className="surface-elevated" style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '3px' }}>Campaign Worker</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600 }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: getServiceStatusBadge(systemStatus?.worker?.status).dotColor }} />
                  <span style={{ color: '#f1f5f9' }}>{systemStatus?.worker?.status || 'Idle (Ready)'}</span>
                </div>
              </div>

              {/* Suppression List */}
              <div className="surface-elevated" style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '3px' }}>Global Suppression</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600 }}>
                  <ShieldCheck size={14} style={{ color: '#10b981' }} />
                  <span style={{ color: '#f1f5f9' }}>{systemStatus?.suppressionCount || 20} Blocked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
