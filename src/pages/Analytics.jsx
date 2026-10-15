import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Smartphone, 
  Monitor, 
  MailOpen, 
  MousePointerClick,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Calendar,
  Filter,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useDemo } from '../context/DemoContext';

const Analytics = () => {
  const { isDemoMode, demoStats, campaigns } = useDemo();
  const [dateRange, setDateRange] = useState('30d'); // '7d' | '14d' | '30d' | 'all'
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Consistent sample metrics
  const stats = {
    sent: demoStats?.sent || 18450,
    delivered: demoStats?.delivered || 18081,
    bounced: demoStats?.bounced || 369,
    opened: demoStats?.unique_opened || 7232,
    unique_opened: demoStats?.unique_opened || 7232,
    clicked: demoStats?.unique_clicked || 1446,
    unique_clicked: demoStats?.unique_clicked || 1446,
    open_rate: demoStats?.open_rate || 40.0,
    click_rate: demoStats?.click_rate || 8.0,
    bounce_rate: '2.0',
    delivery_rate: '98.0',
    daily_stats: demoStats?.daily_stats || [
      { day: 'Mon', count: 1850 },
      { day: 'Tue', count: 3200 },
      { day: 'Wed', count: 4100 },
      { day: 'Thu', count: 3600 },
      { day: 'Fri', count: 2900 },
      { day: 'Sat', count: 1400 },
      { day: 'Sun', count: 1400 }
    ],
    device_distribution: { desktop: 65, mobile: 35 }
  };

  const metrics = [
    { 
      label: 'Unique Open Rate', 
      value: `${stats.open_rate}%`, 
      icon: <MailOpen size={19} />, 
      color: 'var(--primary)',
      subtext: `${stats.unique_opened.toLocaleString()} distinct opens (~40.0% of delivered)`
    },
    { 
      label: 'Click-Through Rate', 
      value: `${stats.click_rate}%`, 
      icon: <MousePointerClick size={19} />, 
      color: 'var(--secondary)',
      subtext: `${stats.unique_clicked.toLocaleString()} link clicks (~8.0% of delivered)`
    },
    { 
      label: 'Total Dispatched', 
      value: stats.sent.toLocaleString(), 
      icon: <Users size={19} />, 
      color: '#38bdf8',
      subtext: 'Illustrative reporting period dispatches'
    },
    { 
      label: 'Confirmed Delivered', 
      value: stats.delivered.toLocaleString(), 
      icon: <CheckCircle2 size={19} />, 
      color: '#10b981',
      subtext: `${stats.delivery_rate}% inbox acceptance rate`
    },
    { 
      label: 'Total Bounced', 
      value: stats.bounced.toLocaleString(), 
      icon: <AlertTriangle size={19} />, 
      color: '#f43f5e',
      subtext: `${stats.bounce_rate}% bounce rate (auto-suppressed)`
    },
    { 
      label: 'Sender Reputation', 
      value: '99.4/100', 
      icon: <ShieldCheck size={19} />, 
      color: '#a855f7',
      subtext: 'Zero spam traps or ISP blacklistings'
    }
  ];

  const handleExportCsv = () => {
    // Generate real browser CSV file from fixture data
    const headers = ['Campaign Name', 'Status', 'Provider', 'Sent', 'Delivered', 'Bounced', 'Unique Opens', 'Open Rate', 'Unique Clicks', 'Click Rate', 'Scheduled / Created'];
    const rows = (campaigns || []).map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      c.status,
      `"${c.provider || 'Custom SMTP'}"`,
      c.sent || c.audience_size || 0,
      c.delivered || 0,
      c.bounced || 0,
      c.unique_opened || 0,
      `${c.open_rate || '0.0'}%`,
      c.unique_clicked || 0,
      `${c.click_rate || '0.0'}%`,
      c.created_at || c.scheduled_at || '2026-10-15'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ashmyra_mailflow_demo_analytics_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f8fafc' }}>
              Performance & <span className="gradient-text">Analytics</span>
            </h1>
            <span className="badge badge-launch">DEMO DATA</span>
            <span className="badge badge-launch" style={{ fontSize: '0.72rem' }}>Illustrative Aggregates</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Believable reporting period telemetry: 18,450 dispatched, 18,081 delivered, 7,232 opens (40.0%), 1,446 clicks (8.0%).
          </p>
        </div>

        {/* Toolbar: Date range filter & Export */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="surface-elevated" style={{ display: 'flex', padding: '3px', gap: '3px' }}>
            <button
              onClick={() => setDateRange('7d')}
              className={dateRange === '7d' ? 'premium-btn' : 'btn-ghost'}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateRange('14d')}
              className={dateRange === '14d' ? 'premium-btn' : 'btn-ghost'}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              14 Days
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={dateRange === '30d' ? 'premium-btn' : 'btn-ghost'}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={dateRange === 'all' ? 'premium-btn' : 'btn-ghost'}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              All Time
            </button>
          </div>

          <button 
            onClick={handleExportCsv}
            className="premium-btn" 
            style={{ fontSize: '0.84rem' }}
          >
            <Download size={15} /> Export Demo Report (CSV)
          </button>
        </div>
      </header>

      {/* Download confirmation toast */}
      {downloadSuccess && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399'
        }}>
          <CheckCircle2 size={18} />
          <span>Demo report downloaded (`ashmyra_mailflow_demo_analytics_report.csv`). All metrics are illustrative sample figures.</span>
        </div>
      )}

      {/* 6 Balanced KPI Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.25rem', 
        marginBottom: '2rem' 
      }}>
        {metrics.map((m, i) => (
          <div key={i} className="surface-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {m.label}
              </span>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                background: 'rgba(255,255,255,0.03)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: m.color, 
                border: '1px solid var(--border-light)' 
              }}>
                {m.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '3px' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {m.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* Two-Column Section: Dispatch Velocity + Device Breakdown */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: '1.75rem',
        marginBottom: '2rem'
      }}>
        {/* Dispatch Velocity Timeline */}
        <div className="surface-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  Dispatch & Engagement Velocity
                </h3>
                <span className="badge badge-launch" style={{ fontSize: '0.7rem' }}>DEMO DATA</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Deterministic distribution across 7-day representative dispatch cycle
              </p>
            </div>
            <div style={{ display: 'flex', gap: '14px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                <span>Dispatches</span>
              </div>
            </div>
          </div>
          
          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '12px', position: 'relative' }}>
            {stats.daily_stats.map((s, i) => {
              const max = Math.max(...stats.daily_stats.map(d => d.count || 0), 1);
              const height = ((s.count || 0) / max) * 100;
              return (
                <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {s.count.toLocaleString()}
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: `${Math.max(height, 8)}%`, 
                    background: 'linear-gradient(180deg, var(--primary) 0%, rgba(6, 182, 212, 0.25) 100%)',
                    borderRadius: '6px 6px 0 0'
                  }} />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 600 }}>{s.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Distribution & Privacy Notice */}
        <div className="surface-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '3px' }}>
                Recipient Environment Distribution
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Estimated open environment telemetry across delivered sample campaigns
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '1.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9' }}>
                    <Monitor size={17} style={{ color: 'var(--primary)' }} />
                    <span>Desktop Clients & Enterprise Webmail</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>{stats.device_distribution.desktop}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${stats.device_distribution.desktop}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9' }}>
                    <Smartphone size={17} style={{ color: 'var(--secondary)' }} />
                    <span>Mobile Clients (iOS / Android)</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>{stats.device_distribution.mobile}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${stats.device_distribution.mobile}%`, height: '100%', background: 'var(--secondary)', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="surface-elevated" style={{ padding: '1rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              <strong>Illustrative Demo Analytics:</strong> Figures reflect deterministic sample records. In live production, unique opens and clicks are collected via custom tracking domains with HTTPS certificate support.
            </p>
          </div>
        </div>
      </div>

      {/* Campaign-Level Detailed Performance Table */}
      <div className="surface-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
                Campaign Performance Breakdown
              </h3>
              <span className="badge badge-launch" style={{ fontSize: '0.72rem' }}>DEMO DATA</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Individual campaign telemetry across delivered demo campaigns
            </p>
          </div>

          <button 
            onClick={handleExportCsv}
            className="btn-secondary" 
            style={{ fontSize: '0.82rem' }}
          >
            <FileSpreadsheet size={15} /> Download CSV Preview
          </button>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Status</th>
                <th>Provider</th>
                <th>Dispatched</th>
                <th>Delivered</th>
                <th>Bounced</th>
                <th>Unique Opens</th>
                <th>Open %</th>
                <th>Unique Clicks</th>
                <th>CTR %</th>
              </tr>
            </thead>
            <tbody>
              {(campaigns || []).map(c => {
                const openRate = parseFloat(c.open_rate || '0');
                const clickRate = parseFloat(c.click_rate || '0');
                return (
                  <tr key={c.id || c._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{c.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{c.subject || '—'}</div>
                    </td>
                    <td>
                      {c.status === 'completed' ? (
                        <span className="badge badge-success">Completed</span>
                      ) : c.status === 'scheduled' ? (
                        <span className="badge badge-violet">Scheduled</span>
                      ) : c.status === 'failed' ? (
                        <span className="badge badge-danger">Failed</span>
                      ) : (
                        <span className="badge badge-warning">{c.status}</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {c.provider || 'Custom SMTP'}
                    </td>
                    <td style={{ fontWeight: 600, color: '#f1f5f9' }}>
                      {(c.sent || c.audience_size || 0).toLocaleString()}
                    </td>
                    <td style={{ color: '#10b981', fontWeight: 600 }}>
                      {(c.delivered || 0).toLocaleString()}
                    </td>
                    <td style={{ color: c.bounced > 0 ? '#f43f5e' : 'var(--text-dim)' }}>
                      {(c.bounced || 0).toLocaleString()}
                    </td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>
                      {(c.unique_opened || 0).toLocaleString()}
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 700, 
                        color: openRate > 35 ? '#10b981' : openRate > 20 ? 'var(--primary)' : 'var(--text-dim)' 
                      }}>
                        {c.open_rate}%
                      </span>
                    </td>
                    <td style={{ color: 'var(--secondary)', fontWeight: 600 }}>
                      {(c.unique_clicked || 0).toLocaleString()}
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 700, 
                        color: clickRate > 5 ? '#34d399' : clickRate > 0 ? 'var(--secondary)' : 'var(--text-dim)' 
                      }}>
                        {c.click_rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
