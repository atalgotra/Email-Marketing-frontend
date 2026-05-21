import React, { useState, useEffect } from 'react';
import { Send, FileText, Mail, Plus, Trash2, Info, Loader2, BarChart3, Eye, ArrowLeft, Copy } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import API_BASE_URL from '../apiConfig';
import { useAuth } from '../context/AuthContext';

const Campaigns = () => {
  const { settings } = useAuth();
  const [view, setView] = useState('list'); // 'list', 'create', or 'details'
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignLogs, setCampaignLogs] = useState([]);
  const [previewCampaign, setPreviewCampaign] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState({
    campaign_name: '',
    subjects: '',
    body: '',
    emails: '',
    is_scheduled: false,
    scheduled_at: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === campaigns.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(campaigns.map(c => c._id));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} campaigns?`)) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/campaigns/bulk`, { data: { ids: selectedIds } });
      showNotification(`${selectedIds.length} campaigns deleted`);
      setSelectedIds([]);
      await fetchCampaigns();
    } catch (err) {
      showNotification('Failed to delete campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleClone = (c) => {
    setFormData({
      campaign_name: `${c.name} (Copy)`,
      subjects: c.subject.join('\n'),
      body: c.body,
      emails: '',
      is_scheduled: false,
      scheduled_at: ''
    });
    setView('create');
    showNotification('Template cloned successfully!');
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image', 'color', 'background'
  ];

  useEffect(() => {
    if (view === 'list') {
      fetchCampaigns();
    }
  }, [view]);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/campaigns`);
      setCampaigns(res.data);
    } catch (err) {
      console.error('Failed to fetch campaigns');
    }
  };

  const fetchCampaignLogs = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/campaigns/${id}/logs`);
      setCampaignLogs(res.data);
      setView('details');
    } catch (err) {
      console.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (id) => {
    const targetId = id || deleteConfirmId;
    if (!targetId) return;

    try {
      setLoading(true);
      const res = await axios.delete(`${API_BASE_URL}/campaigns/${targetId}`);
      console.log("Delete response:", res.data);
      setDeleteConfirmId(null);
      await fetchCampaigns();
    } catch (err) {
      console.error("Delete error:", err);
      showNotification('Failed to delete campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (file) data.append('file', file);
    
    try {
      const [smtpRes, configRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/config/smtp`),
        axios.get(`${API_BASE_URL}/config/general`)
      ]);

      const generalConfig = configRes.data || { delay_min: 30, delay_max: 120 };
      
      // Use the configured Public URL if available, otherwise fallback to local server calculation
      generalConfig.server_url = generalConfig.public_url || API_BASE_URL.replace('/api', '');

      data.append('config', JSON.stringify(generalConfig));
      data.append('smtp_config', JSON.stringify(smtpRes.data || { provider: 'smtp' }));

      const res = await axios.post(`${API_BASE_URL}/campaigns/send`, data);
      showNotification(res.data.message);
      
      // Clear form
      setFormData({ 
        campaign_name: '', 
        subjects: '', 
        body: '', 
        emails: '', 
        is_scheduled: false, 
        scheduled_at: '' 
      });
      setFile(null);
      
      // Switch view and refresh
      setView('list');
      await fetchCampaigns();
    } catch (err) {
      console.error(err);
      alert('Failed to start campaign. Please check your SMTP settings in the Settings tab.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="campaigns"
      >
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {view === 'list' ? 'Campaign' : view === 'create' ? 'Create' : 'Campaign'} <span className="gradient-text">{view === 'list' ? 'Monitor' : view === 'create' ? 'Campaign' : 'Audit Trail'}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {view === 'list' ? 'Track your active and past outreach initiatives.' : view === 'create' ? 'Configure and launch your enterprise-grade email outreach.' : 'Granular recipient interaction history for this campaign.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {view === 'list' && selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              style={{ background: 'rgba(244, 63, 94, 0.1)', border: 'none', color: '#f43f5e', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <Trash2 size={18} /> Delete Selected ({selectedIds.length})
            </button>
          )}
          {view === 'list' ? (
            <button 
              onClick={() => setView('create')}
              className="premium-btn" 
              style={{ padding: '10px 20px', fontSize: '0.85rem' }}
            >
              <Plus size={18} style={{ marginRight: '8px' }} /> New Campaign
            </button>
          ) : (
            <button 
              onClick={() => setView('list')}
              className="glass-panel" 
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}
            >
              <ArrowLeft size={18} /> Back to Monitor
            </button>
          )}
        </div>
      </header>

      {view === 'list' ? (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px', width: '40px' }}>
                    <input 
                      type="checkbox" 
                      checked={campaigns.length > 0 && selectedIds.length === campaigns.length} 
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '12px' }}>Campaign Details</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Progress</th>
                  <th style={{ padding: '12px' }}>Engagement</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No campaigns found. Start by creating your first outreach!
                    </td>
                  </tr>
                ) : campaigns.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: selectedIds.includes(c._id) ? 'rgba(124, 58, 237, 0.05)' : 'transparent' }}>
                    <td style={{ padding: '16px 12px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(c._id)} 
                        onChange={() => toggleSelect(c._id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(c.created_at).toLocaleDateString()}</div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '4px 10px', 
                        borderRadius: '8px', 
                        background: c.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                        color: c.status === 'completed' ? '#10b981' : 'var(--primary)',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px', width: '200px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '6px', fontWeight: 600 }}>
                        <span>{c.total_recipients > 0 ? Math.round((c.current_index / c.total_recipients) * 100) : 0}%</span>
                        <span style={{ color: 'var(--text-muted)' }}>{c.current_index} / {c.total_recipients}</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${c.total_recipients > 0 ? (c.current_index / c.total_recipients) * 100 : 0}%`, height: '100%', background: 'var(--primary)' }} />
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{c.sent_count}</p>
                          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sent</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>{c.open_count || 0}</p>
                          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Opens</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1' }}>{c.click_count || 0}</p>
                          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clicks</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e' }}>{c.failed_count || 0}</p>
                          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Failed</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => setPreviewCampaign(c)}
                          style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          <Eye size={14} /> Preview
                        </button>
                        <button 
                          onClick={() => handleClone(c)}
                          style={{ background: 'rgba(124, 58, 237, 0.1)', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          <Copy size={14} /> Clone
                        </button>
                        <button 
                          onClick={() => fetchCampaignLogs(c._id)}
                          style={{ background: 'rgba(99, 102, 241, 0.1)', border: 'none', color: '#6366f1', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          <BarChart3 size={14} /> Audit
                        </button>
                        <button 
                          style={{ 
                            background: 'rgba(244, 63, 94, 0.1)', 
                            border: 'none', 
                            color: '#f43f5e', 
                            cursor: 'pointer', 
                            padding: '8px', 
                            borderRadius: '8px',
                            position: 'relative',
                            zIndex: 10
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(c._id);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : view === 'details' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px' }}>Recipient Address</th>
                  <th style={{ padding: '12px' }}>Event Type</th>
                  <th style={{ padding: '12px' }}>Engagement Timestamp</th>
                  <th style={{ padding: '12px' }}>Metadata</th>
                </tr>
              </thead>
              <tbody>
                {campaignLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No engagement logs recorded yet for this campaign.
                    </td>
                  </tr>
                ) : campaignLogs.map((log, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 600, fontSize: '0.85rem' }}>{log.email}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        background: log.status === 'opened' ? 'rgba(16, 185, 129, 0.1)' : log.status === 'clicked' ? 'rgba(99, 102, 241, 0.1)' : log.status === 'failed' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: log.status === 'opened' ? '#10b981' : log.status === 'clicked' ? '#6366f1' : log.status === 'failed' ? '#f43f5e' : 'white',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {log.metadata?.device && <span>Device: {log.metadata.device}</span>}
                        {log.status === 'clicked' && (
                          <span>Link: {log.metadata?.url ? log.metadata.url.substring(0, 30) + '...' : 'Unknown'}</span>
                        )}
                        {log.status === 'failed' && (
                          <span style={{ color: '#f43f5e' }}>Error: {log.error}</span>
                        )}
                        {!log.metadata?.device && !log.metadata?.url && log.status !== 'failed' && 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
            {/* Form Content (Previous Implementation) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campaign Identity</label>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.campaign_name}
                    onChange={(e) => setFormData({...formData, campaign_name: e.target.value})}
                    placeholder="e.g. Q4 Logistics Update - Global"
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subject Rotation</label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Info size={14} /> One per line
                    </span>
                  </div>
                  <textarea 
                    rows="3"
                    className="premium-input"
                    value={formData.subjects}
                    onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                    placeholder="Important Shipment Update&#10;Action Required: Your Delivery Status&#10;Logistics Notification"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Body (Visual Editor)</label>
                  <div className="quill-wrapper">
                    <ReactQuill 
                      theme="snow"
                      value={formData.body}
                      onChange={(value) => setFormData({...formData, body: value})}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Compose your high-engagement email here..."
                      style={{ height: '350px', marginBottom: '45px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delivery Schedule</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: formData.is_scheduled ? '1.5rem' : '0' }}>
                  <input 
                    type="checkbox" 
                    id="schedule-toggle"
                    checked={formData.is_scheduled}
                    onChange={(e) => setFormData({...formData, is_scheduled: e.target.checked})}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="schedule-toggle" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Schedule for later</label>
                </div>

                {formData.is_scheduled && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <input 
                      type="datetime-local" 
                      className="premium-input"
                      value={formData.scheduled_at}
                      onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
                      required={formData.is_scheduled}
                      style={{ colorScheme: 'dark' }}
                    />
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>Campaign will automatically start at this time.</p>
                  </motion.div>
                )}
              </div>

              <div className="glass-panel" style={{ padding: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recipients</label>
                
                <div 
                  style={{ 
                    border: '2px dashed var(--border-light)', 
                    borderRadius: '16px', 
                    padding: '2.5rem 1.5rem', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'all 0.3s ease',
                    marginBottom: '1.5rem'
                  }} 
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                    <FileText size={24} />
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{file ? file.name : 'Upload CSV / Excel'}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Drag and drop or click to browse</p>
                  <input id="file-upload" type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
                </div>

                <div style={{ position: 'relative', textAlign: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ position: 'relative', zIndex: 1, padding: '0 10px', background: 'var(--bg-deep)', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR MANUALLY ADD</span>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-light)' }} />
                </div>

                <textarea rows="8" className="premium-input" value={formData.emails} onChange={(e) => setFormData({...formData, emails: e.target.value})} placeholder="email1@example.com&#10;email2@example.com" />
              </div>

              <button type="submit" disabled={loading} className="premium-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px' }}>
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><Send size={20} /> <span style={{ fontSize: '1rem', fontWeight: 700 }}>Launch Campaign</span></>}
              </button>
              
              <div style={{ padding: '1.2rem', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', display: 'flex', gap: '12px' }}>
                <Info size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, marginBottom: '4px' }}>Safety & Pacing Active</p>
                  <p style={{ fontSize: '0.75rem', color: '#f59e0b', opacity: 0.8, lineHeight: 1.4 }}>
                    Campaign will use a <b>{settings.delay_min || 30}-{settings.delay_max || 120}s</b> randomized delay. Daily limit is <b>{settings.daily_limit || 100}</b>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </motion.div>
    
    {/* Delete Confirmation Modal */}
    {deleteConfirmId && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel" 
          style={{ width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center' }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Trash2 size={30} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.8rem' }}>Confirm Deletion</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            Are you sure you want to delete this campaign? All engagement data and tracking logs will be permanently removed.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setDeleteConfirmId(null)}
              className="glass-panel"
              style={{ flex: 1, padding: '12px', fontWeight: 600, color: 'white', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={() => deleteCampaign()}
              style={{ flex: 1, padding: '12px', background: '#f43f5e', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700, cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    )}

    {/* Content Preview Modal */}
    {previewCampaign && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel" 
          style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700 }}>Campaign Content: {previewCampaign.name}</h3>
            <button 
              onClick={() => setPreviewCampaign(null)}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
            >
              Close Preview
            </button>
          </div>
          
          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Subject Rotation</label>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                {previewCampaign.subject.map((s, i) => (
                  <div key={i} style={{ 
                    fontSize: '0.85rem', 
                    marginBottom: i === previewCampaign.subject.length - 1 ? 0 : '10px',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontWeight: 600
                  }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Message Body</label>
              <div 
                className="email-preview-content"
                style={{ 
                  padding: '3rem', 
                  background: 'white', 
                  color: '#222', 
                  borderRadius: '12px',
                  minHeight: '300px',
                  lineHeight: '1.6',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontSize: '15px'
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: previewCampaign.body }} />
                {settings.signature && (
                  <div 
                    style={{ marginTop: '5px', color: '#444' }} 
                    dangerouslySetInnerHTML={{ 
                      __html: settings.signature.replace(/<img /g, '<img width="450" height="169" style="width: 450px; height: 169px; display: block; margin: 0;" ') 
                    }} 
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}
      {/* Notification Toast */}
    {notification && (
      <motion.div 
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 20 }}
        style={{ 
          position: 'fixed', 
          top: '30px', 
          right: '30px', 
          zIndex: 2000, 
          padding: '16px 24px', 
          background: 'rgba(15, 23, 42, 0.9)', 
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid var(--primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px var(--glow)'
        }}
      >
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={14} />
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{notification}</span>
      </motion.div>
    )}
  </>
  );
};

export default Campaigns;
