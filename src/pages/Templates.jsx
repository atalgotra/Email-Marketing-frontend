import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutTemplate, 
  Plus, 
  Trash2, 
  Eye, 
  Search, 
  Monitor, 
  Smartphone, 
  Check, 
  Sparkles,
  ArrowRight,
  Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';

const Templates = () => {
  const { isDemoMode, templates, setTemplates } = useDemo();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Product', 'Newsletter', 'Onboarding', 'Events', 'Sales', 'Retention'];

  const filteredTemplates = (templates || []).filter(t => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      t.name?.toLowerCase().includes(q) || 
      t.subject?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'All' || t.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const useTemplate = (template) => {
    navigate('/campaigns', { state: { loadTemplate: template, createNew: true } });
  };

  const deleteTemplate = (id) => {
    if (!window.confirm('Remove this template from the demo library?')) return;
    setTemplates(prev => prev.filter(t => (t.id || t._id) !== id));
    if (selectedTemplate && (selectedTemplate.id === id || selectedTemplate._id === id)) {
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              Template <span className="gradient-text">Library</span>
            </h1>
            <span className="badge badge-launch">
              {isDemoMode ? '8 Curated Demo Layouts' : 'Production Templates'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Responsive, email-client compliant templates engineered for high deliverability and readability.
          </p>
        </div>

        <button 
          className="premium-btn" 
          onClick={() => navigate('/campaigns', { state: { createNew: true } })}
        >
          <Plus size={18} /> Create Campaign with Template
        </button>
      </header>

      {/* Filter and Search Bar */}
      <div className="surface-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'premium-btn' : 'btn-ghost'}
                style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: 'var(--radius-md)' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text"
              placeholder="Search templates..."
              className="premium-input"
              style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="surface-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <LayoutTemplate size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem', opacity: 0.4, margin: '0 auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
            No Templates Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No templates match the selected category or search query.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredTemplates.map(template => (
            <motion.div 
              key={template.id || template._id}
              className="surface-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
            >
              {/* Card Header with Category */}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span className="badge badge-launch" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    {template.category || 'General'}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                    DEMO TEMPLATE
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.6rem' }}>
                  {template.name}
                </h3>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.6rem', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Subject:</strong> {template.subject}
                </div>

                {template.preheader && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '1rem', fontStyle: 'italic' }}>
                    "{template.preheader}"
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <span>Audience Ready</span>
                  <span>HTML5 Standard</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', borderTop: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.015)' }}>
                <button 
                  onClick={() => setSelectedTemplate(template)}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--primary)', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '6px', 
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    borderRight: '1px solid var(--border-light)' 
                  }}
                >
                  <Eye size={15} /> Preview
                </button>
                <button 
                  onClick={() => useTemplate(template)}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#34d399', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '6px', 
                    fontSize: '0.84rem',
                    fontWeight: 600 
                  }}
                >
                  <ArrowRight size={15} /> Use in Campaign
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Interactive Responsive Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
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
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="surface-card" 
              style={{ 
                width: '100%', 
                maxWidth: '920px', 
                maxHeight: '92vh', 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
                      {selectedTemplate.name}
                    </h2>
                    <span className="badge badge-launch" style={{ fontSize: '0.72rem' }}>
                      {selectedTemplate.category || 'Template'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Subject: <span style={{ color: '#f1f5f9' }}>{selectedTemplate.subject}</span>
                  </div>
                </div>

                {/* Viewport device switcher & close */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="surface-elevated" style={{ display: 'flex', padding: '3px', gap: '3px' }}>
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={previewDevice === 'desktop' ? 'premium-btn' : 'btn-ghost'}
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      title="Desktop View (680px standard)"
                    >
                      <Monitor size={14} /> Desktop
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={previewDevice === 'mobile' ? 'premium-btn' : 'btn-ghost'}
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      title="Mobile View (375px)"
                    >
                      <Smartphone size={14} /> Mobile
                    </button>
                  </div>

                  <button 
                    onClick={() => setSelectedTemplate(null)}
                    className="btn-ghost"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Viewport Frame */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                background: '#090d16', 
                padding: '2rem 1rem', 
                display: 'flex', 
                justifyContent: 'center' 
              }}>
                <div style={{ 
                  width: previewDevice === 'desktop' ? '680px' : '375px', 
                  maxWidth: '100%',
                  background: '#ffffff', 
                  color: '#1e293b', 
                  borderRadius: previewDevice === 'mobile' ? '24px' : '10px', 
                  padding: previewDevice === 'mobile' ? '1.5rem 1rem' : '2.5rem 2rem',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease',
                  border: previewDevice === 'mobile' ? '10px solid #1e293b' : 'none',
                  minHeight: '400px'
                }}>
                  <div dangerouslySetInnerHTML={{ __html: selectedTemplate.body }} />
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Interactive preview • Changes made in demo mode are not permanently persisted
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => setSelectedTemplate(null)}
                    style={{ fontSize: '0.84rem' }}
                  >
                    Close Preview
                  </button>
                  <button 
                    className="premium-btn" 
                    onClick={() => useTemplate(selectedTemplate)}
                    style={{ fontSize: '0.84rem' }}
                  >
                    <ArrowRight size={15} /> Use in Demo Campaign
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Templates;
