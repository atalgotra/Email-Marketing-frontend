import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { 
  Users, 
  Upload, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Search,
  Info,
  Loader2,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useDemo } from '../context/DemoContext';

const Contacts = () => {
  const { isDemoMode, contacts, addDemoContacts } = useDemo();
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'import' | 'suppression'
  
  // Directory state
  const [searchQuery, setSearchQuery] = useState('');
  const [listFilter, setListFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Suppression state
  const [suppressionList, setSuppressionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newReason, setNewReason] = useState('Unsubscribed via preference link');
  const [feedback, setFeedback] = useState(null);

  // CSV Import Walkthrough state
  const [csvText, setCsvText] = useState('');
  const [parsedContacts, setParsedContacts] = useState([]);
  const [parseStats, setParseStats] = useState(null);

  // Load suppression list or demo fallback
  useEffect(() => {
    fetchSuppressionList();
  }, [isDemoMode]);

  const fetchSuppressionList = async () => {
    if (isDemoMode) {
      setSuppressionList([
        { _id: 'demo-sup-1', email: 'optout.user@example.com', reason: 'Unsubscribed via preference link', added_at: '2026-10-12' },
        { _id: 'demo-sup-2', email: 'bounced.mailbox@example.org', reason: 'Hard Bounce (Permanent Failure)', added_at: '2026-10-14' },
        { _id: 'demo-sup-3', email: 'corporate.legal@example.com', reason: 'Spam Complaint / Unsubscribe Request', added_at: '2026-10-15' }
      ]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/campaigns/contacts/suppression`);
      if (res.data?.success) {
        setSuppressionList(res.data.list || []);
      }
    } catch (err) {
      console.error('Failed to fetch suppression list', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuppression = async (e) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      setFeedback({ type: 'error', message: 'Please provide a valid email address.' });
      return;
    }

    if (isDemoMode) {
      setSuppressionList(prev => [
        { _id: `demo-sup-${Date.now()}`, email: newEmail.toLowerCase(), reason: newReason, added_at: new Date().toISOString().split('T')[0] },
        ...prev
      ]);
      setFeedback({ type: 'success', message: `Demo Mode: Added ${newEmail} to temporary in-memory suppression directory.` });
      setNewEmail('');
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/campaigns/contacts/suppression`, {
        email: newEmail,
        reason: newReason
      });
      if (res.data?.success) {
        setFeedback({ type: 'success', message: `${newEmail} has been added to the suppression list.` });
        setNewEmail('');
        fetchSuppressionList();
      }
    } catch (err) {
      setFeedback({ 
        type: 'error', 
        message: err.response?.data?.error || 'Failed to add address to suppression list.' 
      });
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleRemoveSuppression = async (id, email) => {
    if (!window.confirm(`Are you sure you want to remove ${email} from suppression?`)) return;
    if (isDemoMode) {
      setSuppressionList(prev => prev.filter(item => item._id !== id));
      setFeedback({ type: 'success', message: `Demo Mode: Removed ${email} from temporary suppression view.` });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/campaigns/contacts/suppression/${id}`);
      setFeedback({ type: 'success', message: `${email} removed from suppression.` });
      fetchSuppressionList();
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to remove from suppression list.' });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCsvParse = (text) => {
    setCsvText(text);
    if (!text.trim()) {
      setParsedContacts([]);
      setParseStats(null);
      return;
    }

    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const valid = [];
    const invalid = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    lines.forEach((line, idx) => {
      const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
      const emailCandidate = parts.find(p => emailRegex.test(p));
      const nameCandidate = parts.find(p => p !== emailCandidate && p.length > 0) || '';
      const companyCandidate = parts[2] || '';

      if (emailCandidate) {
        valid.push({ 
          email: emailCandidate.toLowerCase(), 
          name: nameCandidate, 
          company: companyCandidate 
        });
      } else if (idx > 0 || !line.toLowerCase().includes('email')) {
        invalid.push(line);
      }
    });

    const uniqueMap = new Map();
    valid.forEach(v => {
      if (!uniqueMap.has(v.email)) uniqueMap.set(v.email, v);
    });
    const unique = Array.from(uniqueMap.values());

    setParsedContacts(unique);
    setParseStats({
      totalLines: lines.length,
      validCount: unique.length,
      duplicates: valid.length - unique.length,
      invalidCount: invalid.length
    });
  };

  const handleLoadSampleCsv = () => {
    const sample = `Email, Full Name, Company
rohit.verma@example.com, Rohit Verma, NexaLogistics India
tanya.choudhary@example.org, Tanya Choudhary, BlueWave Cloud
kartik.nair@example.com, Kartik Nair, HyperScale AI
priya.patel@example.com, Priya Patel, Vertex Retail Tech
deepak.joshi@example.org, Deepak Joshi, PrimeFin Advisors
anita.deshmukh@example.com, Anita Deshmukh, Zenith Systems
rahul.mehta@example.org, Rahul Mehta, CloudSpire Infotech
simran.kaur@example.com, Simran Kaur, Elevate HR Solutions
vikram.aditya@example.com, Vikram Aditya, Horizon Mobility
meera.iyer@example.org, Meera Iyer, QuantumBio Analytics`;
    handleCsvParse(sample);
  };

  const handleCommitImport = () => {
    if (parsedContacts.length === 0) return;
    if (isDemoMode) {
      addDemoContacts(parsedContacts, 'Walkthrough Cohort');
      setFeedback({ 
        type: 'success', 
        message: `Demo Mode: Added ${parsedContacts.length} verified contacts into in-memory demo workspace. No production database write occurred.` 
      });
      setCsvText('');
      setParsedContacts([]);
      setParseStats(null);
      setActiveTab('directory');
      setTimeout(() => setFeedback(null), 5000);
    } else {
      setFeedback({ type: 'error', message: 'Production contact import requires active database connection.' });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Directory filter logic
  const filteredContacts = (contacts || []).filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      c.name?.toLowerCase().includes(q) || 
      c.email?.toLowerCase().includes(q) || 
      c.company?.toLowerCase().includes(q);
    
    const matchesList = listFilter === 'all' || c.list === listFilter;
    const matchesStatus = statusFilter === 'all' || c.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesList && matchesStatus;
  });

  const uniqueLists = Array.from(new Set((contacts || []).map(c => c.list).filter(Boolean)));

  // Directory stats
  const totalSubscribed = (contacts || []).filter(c => c.status === 'Subscribed').length;
  const totalPending = (contacts || []).filter(c => c.status === 'Pending').length;
  const totalSuppressed = (contacts || []).filter(c => c.status === 'Unsubscribed' || c.status === 'Bounced').length;

  return (
    <div className="page-container">
      {/* Page Header */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              Audience & <span className="gradient-text">Contacts</span>
            </h1>
            <span className="badge badge-launch">
              {isDemoMode ? 'Demo Contacts' : 'Consent Protected'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {isDemoMode 
              ? 'Inspect realistic sample recipients under reserved example domains. Import testing is strictly in-memory.' 
              : 'Import recipient audiences, validate email syntax, and manage global suppression records.'}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="surface-elevated" style={{ display: 'flex', padding: '4px', gap: '4px' }}>
          <button 
            className={activeTab === 'directory' ? 'premium-btn' : 'btn-ghost'}
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
            onClick={() => setActiveTab('directory')}
          >
            <Users size={16} /> Contact Directory ({contacts?.length || 0})
          </button>
          <button 
            className={activeTab === 'import' ? 'premium-btn' : 'btn-ghost'}
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
            onClick={() => setActiveTab('import')}
          >
            <Upload size={16} /> CSV Import Walkthrough
          </button>
          <button 
            className={activeTab === 'suppression' ? 'premium-btn' : 'btn-ghost'}
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
            onClick={() => setActiveTab('suppression')}
          >
            <ShieldAlert size={16} /> Suppression List ({suppressionList.length})
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

      {/* TAB 1: CONTACT DIRECTORY */}
      {activeTab === 'directory' && (
        <div>
          {/* Audience Summary Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="surface-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Demo Audience</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {contacts?.length || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Fictional contact fixtures</div>
            </div>
            <div className="surface-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>Subscribed / Consented</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {totalSubscribed}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Eligible for dispatches</div>
            </div>
            <div className="surface-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Pending Confirmation</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                {totalPending}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Double opt-in awaiting</div>
            </div>
            <div className="surface-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase' }}>Suppressed / Inactive</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f43f5e', marginTop: '4px' }}>
                {totalSuppressed}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Excluded from sending</div>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="surface-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input 
                  type="text"
                  placeholder="Search by contact name, email, or company..."
                  className="premium-input"
                  style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select 
                className="premium-input"
                style={{ width: '180px', fontSize: '0.85rem' }}
                value={listFilter}
                onChange={(e) => setListFilter(e.target.value)}
              >
                <option value="all">All Lists ({contacts?.length || 0})</option>
                {uniqueLists.map(list => (
                  <option key={list} value={list}>{list}</option>
                ))}
              </select>

              <select 
                className="premium-input"
                style={{ width: '170px', fontSize: '0.85rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="subscribed">Subscribed</option>
                <option value="pending">Pending</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>

            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.84rem' }}
              onClick={() => setActiveTab('import')}
            >
              <Upload size={15} /> Import More (Walkthrough)
            </button>
          </div>

          {/* Contacts Table */}
          <div className="surface-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Showing {filteredContacts.length} of {contacts?.length || 0} sample recipients
              </div>
              <span className="badge badge-launch" style={{ fontSize: '0.72rem' }}>
                DEMO DATA — Example Domains Only
              </span>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Email Address</th>
                    <th>Organization</th>
                    <th>List Segment</th>
                    <th>Consent Status</th>
                    <th>Engagement</th>
                    <th>Added On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No demo contacts match the selected search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map(c => {
                      const isSubscribed = c.status === 'Subscribed';
                      const isPending = c.status === 'Pending';
                      return (
                        <tr key={c.id || c._id}>
                          <td>
                            <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{c.name}</div>
                          </td>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.84rem', color: 'var(--primary)' }}>
                              {c.email}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                            {c.company || '—'}
                          </td>
                          <td>
                            <span className="badge badge-launch" style={{ fontSize: '0.74rem' }}>
                              {c.list || 'Default'}
                            </span>
                          </td>
                          <td>
                            {isSubscribed ? (
                              <span className="badge badge-success">Subscribed</span>
                            ) : isPending ? (
                              <span className="badge badge-warning">Pending</span>
                            ) : (
                              <span className="badge badge-danger">{c.status}</span>
                            )}
                          </td>
                          <td>
                            <span style={{
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              color: c.engagement === 'High' ? 'var(--primary)' : c.engagement === 'Medium' ? '#38bdf8' : 'var(--text-dim)'
                            }}>
                              {c.engagement || 'Medium'}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {c.addedDate || c.added_at || '2026-10-15'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIENCE IMPORT WALKTHROUGH */}
      {activeTab === 'import' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '1.75rem' }}>
          {/* Left Column: Input / CSV walkthrough */}
          <div className="surface-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                CSV Import Walkthrough
              </h3>
              <span className="badge badge-launch" style={{ fontSize: '0.7rem' }}>Demo Simulation</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Test recipient parsing, column mapping, and syntax validation. In demo mode, imported contacts are added to your temporary in-memory session.
            </p>

            {/* Quick Sample Action */}
            <div style={{ marginBottom: '1.25rem', padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: '#67e8f9' }}>
                <strong>Quick Demo:</strong> Load 10 pre-formatted fictional contacts
              </div>
              <button 
                onClick={handleLoadSampleCsv}
                className="premium-btn" 
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <Sparkles size={14} /> Load Sample CSV
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                CSV or Comma-Delimited Input
              </label>
              <textarea
                rows={9}
                className="premium-input font-mono"
                style={{ fontSize: '0.84rem', lineHeight: 1.5 }}
                placeholder={`Email, Name, Company\nalex.morgan@example.com, Alex Morgan, AlphaTech\nsarah.jenkins@example.org, Sarah Jenkins, CloudWave`}
                value={csvText}
                onChange={(e) => handleCsvParse(e.target.value)}
              />
            </div>

            {/* Compliance guidance */}
            <div className="surface-elevated" style={{ padding: '1rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Info size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong>Demo Safety Policy:</strong> Demo imports are processed purely in-browser memory. Real customer contacts must never be imported into this interactive preview.
              </p>
            </div>
          </div>

          {/* Right Column: Validation Preview & Commit Walkthrough */}
          <div className="surface-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                Validation & Column Preview
              </h3>
              {parsedContacts.length > 0 && (
                <button 
                  onClick={handleCommitImport}
                  className="premium-btn"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  <Database size={15} /> Add to In-Memory Audience
                </button>
              )}
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Real-time syntax verification, field detection, and deduplication results.
            </p>

            {parseStats ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="surface-elevated" style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {parseStats.validCount}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Valid Contacts
                    </div>
                  </div>
                  <div className="surface-elevated" style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>
                      {parseStats.duplicates}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Duplicates
                    </div>
                  </div>
                  <div className="surface-elevated" style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f43f5e' }}>
                      {parseStats.invalidCount}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Invalid Format
                    </div>
                  </div>
                </div>

                <div className="table-responsive" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Email Address</th>
                        <th>Name</th>
                        <th>Organization</th>
                        <th>Syntax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedContacts.map((c, i) => (
                        <tr key={i}>
                          <td style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>{i + 1}</td>
                          <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{c.email}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{c.name || '—'}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.company || '—'}</td>
                          <td>
                            <span className="badge badge-success">Valid</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '1.25rem', padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Ready to simulate import into the demo workspace.
                  </span>
                  <button 
                    onClick={handleCommitImport}
                    className="premium-btn"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    Simulate Demo Import
                  </button>
                </div>
              </>
            ) : (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '3rem 1.5rem', 
                textAlign: 'center' 
              }}>
                <FileText size={42} style={{ color: 'var(--text-dim)', marginBottom: '1rem', opacity: 0.4 }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  No Audience Uploaded Yet
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '320px', marginBottom: '1.25rem' }}>
                  Paste contacts on the left or click below to populate the form with realistic test data.
                </p>
                <button 
                  onClick={handleLoadSampleCsv}
                  className="btn-secondary" 
                  style={{ fontSize: '0.82rem' }}
                >
                  <Sparkles size={14} /> Populate Sample CSV Data
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SUPPRESSION LIST */}
      {activeTab === 'suppression' && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.75rem' }}>
          {/* Add Manual Suppression */}
          <div className="surface-card" style={{ padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
              Add to Suppression
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Suppressed emails are automatically excluded by the sending worker from all future campaigns.
            </p>

            <form onSubmit={handleAddSuppression}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <input 
                  type="email"
                  required
                  placeholder="contact@example.com"
                  className="premium-input"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Suppression Reason
                </label>
                <select 
                  className="premium-input"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                >
                  <option value="Unsubscribed via preference link">Unsubscribed via preference link</option>
                  <option value="Hard Bounce (Permanent Delivery Failure)">Hard Bounce (Permanent Failure)</option>
                  <option value="Spam Complaint / Unsubscribe Request">Spam Complaint / Direct Request</option>
                  <option value="Manual Operator Exclusion">Manual Operator Exclusion</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="premium-btn" 
                style={{ width: '100%' }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                <span>Add Suppression Rule</span>
              </button>
            </form>
          </div>

          {/* Suppression Records Table */}
          <div className="surface-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  Global Suppression Directory
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Total {suppressionList.length} addresses currently blocked from outreach.
                </p>
              </div>

              <span className="badge badge-launch" style={{ fontSize: '0.72rem' }}>
                {isDemoMode ? 'Illustrative Demo Status' : 'Enforced Active'}
              </span>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Reason</th>
                    <th>Added On</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {suppressionList.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{item.email}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        <span className="badge badge-warning">{item.reason || 'Suppressed'}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {item.added_at ? new Date(item.added_at).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleRemoveSuppression(item._id, item.email)}
                          className="btn-ghost"
                          style={{ color: '#f43f5e' }}
                          title="Remove from suppression"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
