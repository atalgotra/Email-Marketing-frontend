import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { Send, MousePointer2, Eye, TrendingUp, Zap, Users, BarChart3, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    sent: 0,
    opened: 0,
    clicked: 0,
    open_rate: 0,
    click_rate: 0
  });

  const { user, settings } = useAuth();

  const [activities, setActivities] = useState([]);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/stats?days=${timeRange}`),
          axios.get(`${API_BASE_URL}/stats/logs`)
        ]);
        setStats(statsRes.data);
        
        // Transform logs into activities
        // Transform logs into activities
        const latestLogs = logsRes.data.slice(0, 5).map(log => {
          let eventText = `Sent to ${log.email}`;
          if (log.status === 'opened') eventText = `Opened email: ${log.email}`;
          if (log.status === 'clicked') eventText = `Clicked link: ${log.email}`;
          if (log.status === 'failed') eventText = `Delivery Failed: ${log.email}`;
          
          return {
            time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            event: eventText,
            type: log.status
          };
        });
        
        if (latestLogs.length === 0) {
          latestLogs.push({ time: 'Now', event: `${settings.app_name} Node Operational`, type: 'system' });
        }
        setActivities(latestLogs);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchData();
  }, [settings.app_name, timeRange]);

  const cards = [
    { label: 'Total Outreach', value: stats.sent, icon: <Send size={20} />, color: '#7C3AED', description: 'Emails successfully dispatched' },
    { label: 'Unique Opens', value: stats.unique_opened || 0, icon: <Eye size={20} />, color: '#6366F1', description: 'Distinct message opens' },
    { label: 'Unique Clicks', value: stats.unique_clicked || 0, icon: <MousePointer2 size={20} />, color: '#F43F5E', description: 'Distinct link interactions' },
    { label: 'Conversion Rate', value: `${stats.open_rate}%`, icon: <TrendingUp size={20} />, color: '#10B981', description: 'Lead-to-open efficiency' },
  ];

  const quickActions = [
    { label: 'New Campaign', icon: <Zap size={18} />, color: 'var(--primary)', path: '/campaigns' },
    { label: 'Import Contacts', icon: <Users size={18} />, color: 'var(--secondary)', path: '/campaigns' },
    { label: 'View Reports', icon: <BarChart3 size={18} />, color: '#10b981', path: '/analytics' },
    { label: 'Automation Rules', icon: <Bell size={18} />, color: '#f59e0b', path: '/settings' },
  ];

  return (
    <div className="dashboard">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Welcome back, <span className="gradient-text">{user?.name || (user?.email?.split('@')[0]?.charAt(0)?.toUpperCase() + user?.email?.split('@')[0]?.slice(1))}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Enterprise {settings.app_name} Marketing & Automation Dashboard
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {quickActions.map((action, i) => (
            <button 
              key={i} 
              onClick={() => navigate(action.path)}
              className="glass-panel" 
              style={{ 
                padding: '10px 16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '0.85rem', 
                fontWeight: 600, 
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ color: action.color }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '1.5rem',
        marginBottom: '2.5rem' 
      }}>
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel" 
            style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '-15px', 
              right: '-15px', 
              width: '80px', 
              height: '80px', 
              background: card.color, 
              opacity: 0.05, 
              borderRadius: '50%' 
            }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.2rem' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                background: `${card.color}15`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: card.color,
                border: `1px solid ${card.color}30`
              }}>
                {card.icon}
              </div>
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</h3>
            </div>
            
            <p style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.2rem' }}>{card.value}</p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{card.description}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.8fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Campaign Performance</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-light)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px', position: 'relative' }}>
            {(!stats.daily_stats || stats.daily_stats.length === 0) ? (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No outreach activity recorded for this period
              </div>
            ) : (
              stats.daily_stats.map((s, i) => {
                const maxCount = Math.max(...(stats.daily_stats || []).map(d => d.count), 1);
                const height = (s.count / maxCount) * 100;
                return (
                  <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 5)}%` }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                      style={{ 
                        width: '100%',
                        background: 'linear-gradient(180deg, var(--primary) 0%, rgba(124, 58, 237, 0.1) 100%)', 
                        borderRadius: '4px 4px 0 0',
                        position: 'relative'
                      }}
                    >
                      {s.count > 0 && (
                        <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {s.count}
                        </span>
                      )}
                    </motion.div>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.day}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {activities.map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }} />
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'white' }}>{ev.event}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.2rem', flex: 1 }}>
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 700 }}>Node Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'SMTP', status: 'Online', color: '#10b981' },
                { label: 'API', status: 'Online', color: '#10b981' },
                { label: 'Worker', status: 'Busy', color: '#6366f1' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: s.color }}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
