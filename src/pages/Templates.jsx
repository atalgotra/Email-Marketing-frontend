import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LayoutTemplate, Plus, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/templates`);
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/templates/${id}`);
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert('Failed to delete template');
    }
  };

  const useTemplate = (template) => {
    navigate('/campaigns', { state: { loadTemplate: template } });
  };

  return (
    <div className="page-transition">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Template Library</h1>
          <p style={{ color: 'var(--text-muted)' }}>Save, preview, and reuse your best email designs.</p>
        </div>
        <button className="premium-btn" onClick={() => navigate('/campaigns', { state: { createNew: true } })}>
          <Plus size={18} /> New Campaign
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <LayoutTemplate size={48} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '1rem', margin: '0 auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No templates yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create a campaign and click "Save as Template" to build your library.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {templates.map(template => (
            <motion.div 
              key={template._id}
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{template.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                  <strong>Subject:</strong> {template.subject}<br/>
                  <strong>Preheader:</strong> {template.preheader || 'N/A'}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                  Saved on {new Date(template.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.2)' }}>
                <button 
                  onClick={() => setSelectedTemplate(template)}
                  style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRight: '1px solid var(--border-light)' }}
                >
                  <Eye size={16} /> Preview
                </button>
                <button 
                  onClick={() => useTemplate(template)}
                  style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRight: '1px solid var(--border-light)' }}
                >
                  <LayoutTemplate size={16} /> Use
                </button>
                <button 
                  onClick={() => deleteTemplate(template._id)}
                  style={{ padding: '12px 20px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedTemplate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setSelectedTemplate(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}
            >
              ✕
            </button>
            <h2 style={{ marginBottom: '0.5rem' }}>{selectedTemplate.name}</h2>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Subject:</strong> {selectedTemplate.subject}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Preheader:</strong> {selectedTemplate.preheader}</div>
            </div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Email Body</h4>
            <div 
              style={{ padding: '2rem', background: 'white', color: 'black', borderRadius: '8px', minHeight: '300px' }}
              dangerouslySetInnerHTML={{ __html: selectedTemplate.body }}
            />
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="premium-btn" onClick={() => useTemplate(selectedTemplate)}>
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
