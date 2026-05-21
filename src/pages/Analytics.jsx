import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Globe, 
  Smartphone, 
  Monitor, 
  MailOpen, 
  MousePointerClick,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [stats, setStats] = useState({
    sent: 0,
    opened: 0,
    clicked: 0,
    open_rate: 0,
    click_rate: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/stats`);
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  const metrics = [
    { label: 'Avg Open Rate', value: `${stats.open_rate}%`, icon: <MailOpen size={20} />, trend: 'Live', color: '#7C3AED' },
    { label: 'Avg Click Rate', value: `${stats.click_rate}%`, icon: <MousePointerClick size={20} />, trend: 'Live', color: '#6366F1' },
    { label: 'Total Sent', value: stats.sent, icon: <Users size={20} />, trend: 'Outreach', color: '#10B981' },
    { label: 'Total Opens', value: stats.opened, icon: <MailOpen size={20} />, trend: 'Engagement', color: '#F59E0B' },
  ];

  const deviceDistribution = stats.device_distribution || { desktop: 50, mobile: 50 };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="analytics"
    >
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Detailed <span className="gradient-text">Analytics</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time engagement metrics and audience behavior.</p>
        </div>
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
          <Clock size={16} className="text-primary" />
          <span style={{ fontWeight: 600 }}>System Live</span>
        </div>
      </header>

      {/* Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {metrics.map((m, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, border: `1px solid ${m.color}20` }}>
                {m.icon}
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', background: `${m.color}10`, padding: '2px 8px', borderRadius: '4px' }}>
                {m.trend}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{m.label}</p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{m.value}</h2>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Engagement Chart Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Engagement Velocity</h3>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} /> Opens</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }} /> Clicks</div>
              </div>
            </div>
            
            <div style={{ height: '340px', position: 'relative', width: '100%', paddingBottom: '40px' }}>
              <svg viewBox="0 0 1000 280" preserveAspectRatio="none" style={{ width: '100%', height: '280px', overflow: 'visible' }}>
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                  d="M0,240 Q150,40 300,160 T600,80 T1000,50"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  d="M0,270 Q200,180 400,220 T800,130 T1000,100"
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="10 10"
                />
              </svg>
              <div style={{ position: 'absolute', bottom: '0', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <span>6AM</span><span>9AM</span><span>12PM</span><span>3PM</span><span>6PM</span><span>9PM</span><span>12AM</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ marginBottom: '2.5rem', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>Device Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Monitor size={18} className="text-primary" />
                    <span style={{ fontWeight: 600 }}>Desktop</span>
                  </div>
                  <span style={{ fontWeight: 800 }}>{deviceDistribution.desktop}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${deviceDistribution.desktop}%` }} style={{ height: '100%', background: 'var(--primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Smartphone size={18} className="text-secondary" />
                    <span style={{ fontWeight: 600 }}>Mobile</span>
                  </div>
                  <span style={{ fontWeight: 800 }}>{deviceDistribution.mobile}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${deviceDistribution.mobile}%` }} style={{ height: '100%', background: 'var(--secondary)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
