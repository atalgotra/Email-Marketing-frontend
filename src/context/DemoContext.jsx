import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  DEMO_STATS,
  DEMO_CAMPAIGNS,
  DEMO_CONTACTS,
  DEMO_TEMPLATES,
  DEMO_ACTIVITIES,
  DEMO_PRICING_PLANS,
  DEMO_SYSTEM_STATUS
} from '../demo/demoData';

const DemoContext = createContext();

export const DemoProvider = ({ children }) => {
  // Demo mode defaults to true so prospect visitors immediately experience the rich demo workspace
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const stored = localStorage.getItem('mailflow_demo_mode');
    return stored === null ? true : stored === 'true';
  });

  // In-memory demo states (ensures visitors can interactively add/filter without persisting to production DB)
  const [campaigns, setCampaigns] = useState(DEMO_CAMPAIGNS);
  const [contacts, setContacts] = useState(DEMO_CONTACTS);
  const [templates, setTemplates] = useState(DEMO_TEMPLATES);
  const [activities, setActivities] = useState(DEMO_ACTIVITIES);
  const [systemStatus, setSystemStatus] = useState(DEMO_SYSTEM_STATUS);

  // Sync axios header whenever demo mode changes to enforce backend demoGuard protection
  useEffect(() => {
    localStorage.setItem('mailflow_demo_mode', isDemoMode ? 'true' : 'false');
    if (isDemoMode) {
      axios.defaults.headers.common['x-demo-mode'] = 'true';
    } else {
      delete axios.defaults.headers.common['x-demo-mode'];
    }
  }, [isDemoMode]);

  const toggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  const addDemoCampaign = (newCmp) => {
    const created = {
      _id: `demo-cmp-${Date.now()}`,
      name: newCmp.campaign_name || newCmp.name || 'Untitled Demo Campaign',
      subject: newCmp.subject || 'Demo Subject Line',
      preheader: newCmp.preheader || '',
      audience_size: newCmp.recipientsCount || (newCmp.emails ? newCmp.emails.split(',').length : 120),
      sent: 0,
      delivered: 0,
      bounced: 0,
      unique_opened: 0,
      unique_clicked: 0,
      open_rate: '0.0',
      click_rate: '0.0',
      status: newCmp.is_draft ? 'draft' : newCmp.scheduled_at ? 'scheduled' : 'completed',
      provider: newCmp.provider || 'Custom SMTP (Demo Simulation)',
      created_at: new Date().toISOString(),
      scheduled_at: newCmp.scheduled_at || null,
      completed_at: !newCmp.is_draft && !newCmp.scheduled_at ? new Date().toISOString() : null,
      list_name: newCmp.list_name || 'Demo Audience Cohort',
      summary: 'Simulated in-memory demo campaign. No emails were dispatched.'
    };

    setCampaigns(prev => [created, ...prev]);

    // Add corresponding event to demo activity feed
    setActivities(prev => [
      {
        time: 'Just now',
        event: created.status === 'scheduled'
          ? `Campaign "${created.name}" scheduled for demo dispatch`
          : `Campaign "${created.name}" created (${created.audience_size} recipients)`,
        type: created.status === 'scheduled' ? 'scheduled' : 'campaign_created'
      },
      ...prev
    ]);

    return created;
  };

  const addDemoContacts = (newContactsList, listName = 'Imported Cohort') => {
    const mapped = newContactsList.map((item, idx) => ({
      _id: `demo-c-${Date.now()}-${idx}`,
      name: item.name || 'Sample Recipient',
      email: item.email,
      company: item.company || 'Enterprise Partner',
      list: listName,
      status: 'Subscribed',
      opens: 0,
      clicks: 0,
      added_at: new Date().toISOString().split('T')[0]
    }));

    setContacts(prev => [...mapped, ...prev]);

    setActivities(prev => [
      {
        time: 'Just now',
        event: `Demo contact import: ${mapped.length} recipients verified in memory`,
        type: 'import'
      },
      ...prev
    ]);

    return mapped;
  };

  const resetDemoData = () => {
    setCampaigns(DEMO_CAMPAIGNS);
    setContacts(DEMO_CONTACTS);
    setTemplates(DEMO_TEMPLATES);
    setActivities(DEMO_ACTIVITIES);
    setSystemStatus(DEMO_SYSTEM_STATUS);
  };

  const value = useMemo(() => ({
    isDemoMode,
    setIsDemoMode,
    toggleDemoMode,
    demoStats: DEMO_STATS,
    campaigns,
    setCampaigns,
    contacts,
    setContacts,
    templates,
    setTemplates,
    activities,
    systemStatus,
    pricingPlans: DEMO_PRICING_PLANS,
    addDemoCampaign,
    addDemoContacts,
    resetDemoData
  }), [isDemoMode, campaigns, contacts, templates, activities, systemStatus]);

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => useContext(DemoContext);
