import React, { useState } from 'react';
import { 
  Check, 
  Zap, 
  HelpCircle, 
  ShieldCheck, 
  Server, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Send, 
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';

const Pricing = () => {
  const { pricingPlans, isDemoMode } = useDemo();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'quarterly' | 'annual'
  const [showDemoSubscribeModal, setShowDemoSubscribeModal] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);

  // Custom Branded Deployment Lead Form State
  const [customForm, setCustomForm] = useState({
    businessName: '',
    workEmail: '',
    monthlyVolume: '50k - 200k',
    deploymentModel: 'custom-branded', // 'custom-branded' | 'dedicated-cloud' | 'on-premises'
    brandingRequirements: '',
    additionalRequirements: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubscribeClick = (plan) => {
    setSelectedPlanForModal(plan);
    setShowDemoSubscribeModal(true);
  };

  const handleCustomFormSubmit = (e) => {
    e.preventDefault();
    if (!customForm.businessName.trim() || !customForm.workEmail.trim()) {
      alert('Please provide your business name and work email.');
      return;
    }
    setFormSubmitted(true);
  };

  const calculateDiscountBadge = () => {
    if (billingCycle === 'quarterly') return 'Save 10%';
    if (billingCycle === 'annual') return 'Save 20%';
    return null;
  };

  return (
    <div className="page-container" style={{ paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <header style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
        <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          <span className="badge badge-launch" style={{ fontSize: '0.82rem', padding: '5px 12px' }}>
            <Zap size={13} /> Transparent Pricing • Customer-Owned SMTP
          </span>
        </div>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 3.5vw, 2.85rem)', 
          fontWeight: 800, 
          letterSpacing: '-0.03em', 
          lineHeight: 1.18, 
          marginBottom: '1rem',
          color: '#f8fafc' 
        }}>
          Simple, Predictable Plans for <span className="gradient-text">High-Deliverability</span> Sending
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.6 }}>
          Choose a plan that fits your dispatch volume. Connect your preferred Amazon SES, Brevo, or custom SMTP server with zero vendor lock-in.
        </p>

        {/* Billing Cycle Switcher */}
        <div style={{
          marginTop: '2rem',
          display: 'inline-flex',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-light)',
          padding: '5px',
          borderRadius: 'var(--radius-lg)',
          position: 'relative'
        }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`btn-ghost ${billingCycle === 'monthly' ? 'active' : ''}`}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem',
              color: billingCycle === 'monthly' ? '#ffffff' : 'var(--text-muted)',
              background: billingCycle === 'monthly' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              border: billingCycle === 'monthly' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              cursor: 'pointer'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('quarterly')}
            className={`btn-ghost ${billingCycle === 'quarterly' ? 'active' : ''}`}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem',
              color: billingCycle === 'quarterly' ? '#ffffff' : 'var(--text-muted)',
              background: billingCycle === 'quarterly' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              border: billingCycle === 'quarterly' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Quarterly</span>
            <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '4px', fontWeight: 700 }}>
              -10%
            </span>
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`btn-ghost ${billingCycle === 'annual' ? 'active' : ''}`}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem',
              color: billingCycle === 'annual' ? '#ffffff' : 'var(--text-muted)',
              background: billingCycle === 'annual' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              border: billingCycle === 'annual' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Annual</span>
            <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '4px', fontWeight: 700 }}>
              -20%
            </span>
          </button>
        </div>
      </header>

      {/* 3 Main Pricing Cards Grid */}
      <section aria-label="Subscription Plans" style={{ marginBottom: '4rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', 
          gap: '1.75rem',
          alignItems: 'stretch'
        }}>
          {pricingPlans.map((plan) => {
            const price = plan.pricing[billingCycle];
            const periodLabel = billingCycle === 'monthly' ? '/month' : billingCycle === 'quarterly' ? '/quarter' : '/year';
            const effectiveMonthly = billingCycle === 'monthly' 
              ? price 
              : billingCycle === 'quarterly' 
                ? Math.round(price / 3) 
                : Math.round(price / 12);

            return (
              <div
                key={plan.id}
                className="surface-card"
                style={{
                  padding: '2.25rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  border: plan.popular ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                  boxShadow: plan.popular ? '0 10px 30px -4px rgba(6, 182, 212, 0.25)' : 'var(--shadow-md)',
                  background: plan.popular ? 'linear-gradient(180deg, #101a33 0%, #0e1526 100%)' : 'var(--bg-surface)'
                }}
              >
                {plan.badge && (
                  <div style={{ position: 'absolute', top: '-13px', right: '24px' }}>
                    <span className="badge badge-launch" style={{ background: 'var(--primary)', color: '#090d16', fontWeight: 800 }}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
                    {plan.name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.45, minHeight: '40px', marginBottom: '1.5rem' }}>
                    {plan.tagline}
                  </p>

                  {/* Price Header */}
                  <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-secondary)' }}>₹</span>
                      <span style={{ fontSize: '2.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
                        {price.toLocaleString('en-IN')}
                      </span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{periodLabel}</span>
                    </div>

                    {billingCycle !== 'monthly' && (
                      <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '4px' }}>
                        Equates to ₹{effectiveMonthly.toLocaleString('en-IN')}/month
                      </div>
                    )}

                    <div style={{ 
                      marginTop: '10px', 
                      display: 'inline-flex', 
                      background: 'rgba(255,255,255,0.04)', 
                      padding: '4px 10px', 
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)'
                    }}>
                      ⚡ Monthly Allowance: <strong style={{ color: '#f1f5f9', marginLeft: '4px' }}>{plan.monthlyAllowance}</strong>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '11px' }}>
                    {plan.highlights.map((feat, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                        <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribeClick(plan)}
                  className={plan.popular ? 'premium-btn' : 'btn-secondary'}
                  style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
                >
                  Select {plan.name} Plan
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Customer-Owned SMTP Transparency Notice */}
      <section className="surface-elevated" style={{ padding: '1.75rem', marginBottom: '4rem', display: 'flex', gap: '16px', alignItems: 'flex-start', borderLeft: '4px solid var(--primary)' }}>
        <Info size={24} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
            Understanding Customer-Owned SMTP & Sending Allowances
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            Ashmyra MailFlow is a campaign management and analytics platform. Outbound emails are dispatched through your own configured SMTP or Web API provider (such as Amazon SES, Brevo, SendGrid, or custom mail servers). Any third-party provider fees are separate from your MailFlow subscription. Monthly plan allowances define recipient-send attempts initiated from your MailFlow workspace, resetting on each billing cycle without rollover.
          </p>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.5rem', textAlign: 'center' }}>
          Compare Plan Capabilities
        </h2>
        <div className="surface-card" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)' }}>Core Feature</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', color: '#f8fafc' }}>Starter</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', color: 'var(--primary)' }}>Growth</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', color: '#c084fc' }}>Agency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>Monthly Recipient Attempts</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>5,000</td>
                <td style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>25,000</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>100,000</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>SMTP Providers Supported</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>1 Host</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>Multi-Provider</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>Unlimited / Custom Pool</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>Contact & Audience Management</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}><Check size={16} style={{ color: '#10b981' }} /></td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}><Check size={16} style={{ color: '#10b981' }} /></td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}><Check size={16} style={{ color: '#10b981' }} /></td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>Automated Campaign Scheduler</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}><Check size={16} style={{ color: '#10b981' }} /></td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}><Check size={16} style={{ color: '#10b981' }} /></td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}><Check size={16} style={{ color: '#10b981' }} /></td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>Device Engagement Analytics</td>
                <td style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text-dim)' }}>Basic</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>Advanced Heatmaps</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>Real-time Deep Export</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>Client Workspace Isolation</td>
                <td style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text-dim)' }}>—</td>
                <td style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text-dim)' }}>—</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}><Check size={16} style={{ color: '#10b981' }} /></td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>Support SLA</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>Standard Ticket</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>Priority (12h)</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>Dedicated Slack/Teams</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Phase 7: Custom-Branded Deployment Offering */}
      <section 
        id="custom-branded"
        className="surface-card" 
        style={{ 
          padding: '3rem 2.5rem', 
          marginBottom: '4rem',
          background: 'linear-gradient(145deg, #0d1629 0%, #090e1a 100%)',
          border: '1px solid rgba(6, 182, 212, 0.35)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          <div>
            <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              <span className="badge badge-launch">
                <Building2 size={13} /> Ashmyra Enterprise Services
              </span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Custom-Branded Workspaces & Dedicated Deployments
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Need a white-labeled email marketing platform under your own corporate identity, custom domain, and dedicated infrastructure? Ashmyra Technologies delivers turnkey enterprise deployments.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f1f5f9', fontSize: '0.88rem' }}>Hosted MailFlow vs Dedicated Deployment:</strong>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '2px' }}>
                    Hosted subscriptions share multi-tenant queues. Dedicated deployments provide private MongoDB databases and isolated worker clusters.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f1f5f9', fontSize: '0.88rem' }}>Custom Branding & Subdomains:</strong>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '2px' }}>
                    Deploy on <code>mail.yourcompany.com</code> with tailored color themes, custom logo assets, and custom sender identities.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f1f5f9', fontSize: '0.88rem' }}>Indicative Pricing:</strong>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '2px' }}>
                    Custom deployments start at ₹45,000 setup + hosting maintenance. Custom scope defined during technical discovery.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Capture Form */}
          <div className="surface-elevated" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Request a Custom Solution Brief
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
              Submit your project scope for a custom deployment review by our engineering leads.
            </p>

            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={44} style={{ color: '#10b981', margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                  Demo Request Captured
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  In live production, this dispatches a project discovery brief to <code>support@ashmyra.com</code>. In this interactive demo, your submission has been safely recorded in-memory.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Submit Another Scope
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomFormSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Cloud Corp"
                    value={customForm.businessName}
                    onChange={(e) => setCustomForm({ ...customForm, businessName: e.target.value })}
                    className="premium-input"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={customForm.workEmail}
                    onChange={(e) => setCustomForm({ ...customForm, workEmail: e.target.value })}
                    className="premium-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Monthly Volume
                    </label>
                    <select
                      value={customForm.monthlyVolume}
                      onChange={(e) => setCustomForm({ ...customForm, monthlyVolume: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="50k - 200k">50,000 – 200,000</option>
                      <option value="200k - 1M">200,000 – 1,000,000</option>
                      <option value="1M+">1,000,000+</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Deployment
                    </label>
                    <select
                      value={customForm.deploymentModel}
                      onChange={(e) => setCustomForm({ ...customForm, deploymentModel: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="custom-branded">Custom Branded</option>
                      <option value="dedicated-cloud">Dedicated AWS/GCP</option>
                      <option value="on-premises">On-Premises Docker</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Custom Branding & Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe custom domain, IP warming needs, or integration requirements..."
                    value={customForm.brandingRequirements}
                    onChange={(e) => setCustomForm({ ...customForm, brandingRequirements: e.target.value })}
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="premium-btn"
                  style={{ width: '100%', padding: '11px' }}
                >
                  <Send size={15} /> Submit Solution Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '2rem', textAlign: 'center' }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="surface-card" style={{ padding: '1.25rem 1.5rem' }}>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
              What is a "recipient-send attempt"?
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Each single email addressed to an individual recipient is counted as one attempt. Internal system retries or job resumptions do not double-count against your allowance.
            </p>
          </div>

          <div className="surface-card" style={{ padding: '1.25rem 1.5rem' }}>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
              Why do I need my own SMTP provider?
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Customer-owned SMTP gives you complete ownership over your sender reputation, domain authentication (SPF/DKIM/DMARC), and sending costs. Amazon SES, for example, charges approximately ₹8.50 per 10,000 emails, allowing massive cost savings compared to all-in-one email marketing platforms.
            </p>
          </div>

          <div className="surface-card" style={{ padding: '1.25rem 1.5rem' }}>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
              Do unused recipient attempts roll over to the next month?
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              No. Monthly sending allowances reset at the start of each billing cycle to maintain consistent queue throughput across our infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Safe Subscribe Modal */}
      {showDemoSubscribeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="surface-card" style={{ maxWidth: '480px', width: '100%', padding: '2.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                <Sparkles size={24} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  {selectedPlanForModal?.name} Plan Selected
                </h3>
              </div>
              <button
                onClick={() => setShowDemoSubscribeModal(false)}
                className="btn-ghost"
                style={{ padding: '4px', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="surface-elevated" style={{ padding: '14px', marginBottom: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
              <p style={{ fontSize: '0.88rem', color: '#f1f5f9', fontWeight: 600, marginBottom: '6px' }}>
                You're exploring the MailFlow demo. Subscription activation is disabled in this preview.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                Payment processing, automated recurring billing, and real credit card transactions are intentionally inactive in this demonstration environment.
              </p>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Interested in setting up an active production workspace or custom deployment for your company?
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setShowDemoSubscribeModal(false);
                  const el = document.getElementById('custom-branded');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="premium-btn"
                style={{ flex: 1 }}
              >
                Request Custom Solution
              </button>
              <button
                onClick={() => setShowDemoSubscribeModal(false)}
                className="btn-secondary"
              >
                Back to Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
