// Centralized Deterministic Demo Fixtures for Ashmyra MailFlow
// All figures and contact identities are strictly fictional for demonstration purposes.

export const DEMO_STATS = {
  sent: 18450,
  delivered: 18081,
  bounced: 369,
  failed: 369,
  opened: 9840,
  unique_opened: 7232,       // exactly ~40.0% of delivered (7232 / 18081 = 39.998%)
  clicked: 2160,
  unique_clicked: 1446,      // exactly ~8.0% of delivered (1446 / 18081 = 7.997%)
  open_rate: '40.0',
  click_rate: '8.0',
  daily_stats_7d: [
    { day: 'Mon', date: '2026-10-10', count: 2150, delivered: 2110, opens: 845, clicks: 172 },
    { day: 'Tue', date: '2026-10-11', count: 3200, delivered: 3145, opens: 1320, clicks: 290 },
    { day: 'Wed', date: '2026-10-12', count: 1850, delivered: 1810, opens: 720, clicks: 145 },
    { day: 'Thu', date: '2026-10-13', count: 4500, delivered: 4420, opens: 1820, clicks: 412 },
    { day: 'Fri', date: '2026-10-14', count: 2800, delivered: 2750, opens: 1120, clicks: 245 },
    { day: 'Sat', date: '2026-10-15', count: 1650, delivered: 1590, opens: 580, clicks: 95 },
    { day: 'Sun', date: '2026-10-16', count: 2300, delivered: 2256, opens: 827, clicks: 87 }
  ],
  daily_stats_14d: [
    { day: '03 Oct', count: 1200 },
    { day: '04 Oct', count: 1450 },
    { day: '05 Oct', count: 1800 },
    { day: '06 Oct', count: 2100 },
    { day: '07 Oct', count: 950 },
    { day: '08 Oct', count: 1100 },
    { day: '09 Oct', count: 1350 },
    { day: '10 Oct', count: 2150 },
    { day: '11 Oct', count: 3200 },
    { day: '12 Oct', count: 1850 },
    { day: '13 Oct', count: 4500 },
    { day: '14 Oct', count: 2800 },
    { day: '15 Oct', count: 1650 },
    { day: '16 Oct', count: 2300 }
  ],
  daily_stats_30d: [
    { day: '17 Sep', count: 1100 },
    { day: '20 Sep', count: 2300 },
    { day: '24 Sep', count: 3400 },
    { day: '28 Sep', count: 1950 },
    { day: '02 Oct', count: 2800 },
    { day: '06 Oct', count: 4200 },
    { day: '10 Oct', count: 3100 },
    { day: '13 Oct', count: 4500 },
    { day: '16 Oct', count: 2300 }
  ],
  device_distribution: {
    desktop: 58,
    mobile: 42
  }
};

export const DEMO_CAMPAIGNS = [
  {
    _id: 'demo-cmp-01',
    name: 'Q4 Product Launch Announcement',
    subject: 'Introducing Ashmyra MailFlow 2.0: Higher Deliverability & Precision Analytics',
    preheader: 'Explore the new batching engine, suppressions, and delivery heatmaps.',
    audience_size: 4500,
    sent: 4500,
    delivered: 4420,
    bounced: 80,
    unique_opened: 1820,
    unique_clicked: 412,
    open_rate: '41.2',
    click_rate: '9.3',
    status: 'completed',
    provider: 'Custom SMTP (TLS)',
    created_at: '2026-10-13T09:30:00Z',
    scheduled_at: null,
    completed_at: '2026-10-13T10:15:00Z',
    list_name: 'Enterprise Tech Leads',
    summary: 'Strong engagement across CTOs and Product heads. Top click destination was the Interactive Sandbox.'
  },
  {
    _id: 'demo-cmp-02',
    name: 'November Engineering Digest',
    subject: 'Zero-Downtime SMTP Clustering & DKIM 2048-Bit Best Practices',
    preheader: 'Technical architecture deep-dive from the Ashmyra Infrastructure team.',
    audience_size: 3200,
    sent: 3200,
    delivered: 3145,
    bounced: 55,
    unique_opened: 1320,
    unique_clicked: 290,
    open_rate: '42.0',
    click_rate: '9.2',
    status: 'completed',
    provider: 'Amazon SES',
    created_at: '2026-10-11T14:00:00Z',
    scheduled_at: null,
    completed_at: '2026-10-11T14:40:00Z',
    list_name: 'Developer Newsletter',
    summary: 'High reading depth on Gmail and Outlook clients. Code snippet copy events exceeded expectations.'
  },
  {
    _id: 'demo-cmp-03',
    name: 'Black Friday VIP Early Access',
    subject: 'Exclusive Early Access: Reserve Your Annual MailFlow Allocation',
    preheader: 'Locked-in pricing and dedicated IP pools for high-volume senders.',
    audience_size: 5000,
    sent: 0,
    delivered: 0,
    bounced: 0,
    unique_opened: 0,
    unique_clicked: 0,
    open_rate: '0.0',
    click_rate: '0.0',
    status: 'scheduled',
    provider: 'Brevo SMTP',
    created_at: '2026-10-15T11:20:00Z',
    scheduled_at: '2026-10-18T10:00:00+05:30',
    completed_at: null,
    list_name: 'VIP Customers & Founders',
    summary: 'Queued for automatic dispatch in 2 days. 5,000 recipient addresses verified against suppression lists.'
  },
  {
    _id: 'demo-cmp-04',
    name: 'New Feature: Audience Segmentation',
    subject: 'Filter Contacts Dynamically by Activity & Engagement History',
    preheader: 'Smart audience segments without manual CSV re-exports.',
    audience_size: 2800,
    sent: 2800,
    delivered: 2750,
    bounced: 50,
    unique_opened: 1120,
    unique_clicked: 245,
    open_rate: '40.7',
    click_rate: '8.9',
    status: 'completed',
    provider: 'SendGrid Web API',
    created_at: '2026-10-14T08:15:00Z',
    scheduled_at: null,
    completed_at: '2026-10-14T08:55:00Z',
    list_name: 'Growth Marketers Cohort',
    summary: 'Highest click-to-open ratio this month (21.8%). Over 180 users tested segmentation within 2 hours.'
  },
  {
    _id: 'demo-cmp-05',
    name: 'Customer Re-engagement Series #1',
    subject: 'Rediscover Ashmyra MailFlow: What We Added Over the Last 90 Days',
    preheader: 'Custom SMTP connectors, faster CSV parsing, and updated reports.',
    audience_size: 1650,
    sent: 1650,
    delivered: 1590,
    bounced: 60,
    unique_opened: 580,
    unique_clicked: 95,
    open_rate: '36.5',
    click_rate: '6.0',
    status: 'completed',
    provider: 'Custom SMTP (TLS)',
    created_at: '2026-10-15T16:00:00Z',
    scheduled_at: null,
    completed_at: '2026-10-15T16:45:00Z',
    list_name: 'Inactive Accounts (60d+)',
    summary: 'Reactivated 74 inactive accounts. Bounced addresses were automatically appended to Global Suppression.'
  },
  {
    _id: 'demo-cmp-06',
    name: 'Cyber Monday Platform Sneak Peek',
    subject: 'Get Ready for Cyber Week: High-Throughput Sending Guidelines',
    preheader: 'Warming recommendations, ISP throttle limits, and queue safeguards.',
    audience_size: 3500,
    sent: 0,
    delivered: 0,
    bounced: 0,
    unique_opened: 0,
    unique_clicked: 0,
    open_rate: '0.0',
    click_rate: '0.0',
    status: 'draft',
    provider: 'Custom SMTP (TLS)',
    created_at: '2026-10-15T18:30:00Z',
    scheduled_at: null,
    completed_at: null,
    list_name: 'All Active Subscribers',
    summary: 'Draft in review. Email copy finalized; awaiting visual poster graphic attachment.'
  },
  {
    _id: 'demo-cmp-07',
    name: 'Quarterly Platform Security Audit',
    subject: 'Security & Compliance Notice: TLS 1.3 Enforcement Update',
    preheader: 'Mandatory cryptographic standard updates for customer-owned SMTP relays.',
    audience_size: 800,
    sent: 800,
    delivered: 796,
    bounced: 4,
    unique_opened: 392,
    unique_clicked: 84,
    open_rate: '49.2',
    click_rate: '10.5',
    status: 'completed',
    provider: 'Amazon SES',
    created_at: '2026-10-12T11:00:00Z',
    scheduled_at: null,
    completed_at: '2026-10-12T11:20:00Z',
    list_name: 'Security & Workspace Admins',
    summary: 'Exceptional open rate (49.2%). Zero delivery failures reported across enterprise corporate firewalls.'
  },
  {
    _id: 'demo-cmp-08',
    name: 'Customer Welcome Sequence #2',
    subject: 'Day 2 with MailFlow: Setting Up Your First SPF and DMARC Records',
    preheader: 'A quick 3-step guide to achieving 99%+ inbox placement.',
    audience_size: 2100,
    sent: 0,
    delivered: 0,
    bounced: 0,
    unique_opened: 0,
    unique_clicked: 0,
    open_rate: '0.0',
    click_rate: '0.0',
    status: 'scheduled',
    provider: 'Brevo SMTP',
    created_at: '2026-10-16T02:00:00Z',
    scheduled_at: '2026-10-17T09:00:00+05:30',
    completed_at: null,
    list_name: 'New Workspace Signups',
    summary: 'Automated drip sequence scheduled for execution tomorrow morning.'
  },
  {
    _id: 'demo-cmp-09',
    name: 'Regional Meetup Bangalore Invitation',
    subject: 'You are Invited: Ashmyra Product Meetup & Live Demo in Indiranagar',
    preheader: 'Connect with SaaS builders, enjoy craft coffee, and discuss email deliverability.',
    audience_size: 1200,
    sent: 1200,
    delivered: 1180,
    bounced: 20,
    unique_opened: 600,
    unique_clicked: 180,
    open_rate: '50.8',
    click_rate: '15.3',
    status: 'completed',
    provider: 'Custom SMTP (TLS)',
    created_at: '2026-10-10T15:00:00Z',
    scheduled_at: null,
    completed_at: '2026-10-10T15:30:00Z',
    list_name: 'Bangalore Community',
    summary: '180 RSVPs collected within 24 hours. Highest engagement rate in Q3.'
  },
  {
    _id: 'demo-cmp-10',
    name: 'Legacy Sync Migration Alert',
    subject: 'Action Required: Update Legacy API Webhook Endpoints',
    preheader: 'Deprecation timeline for legacy v0.9 webhook listeners.',
    audience_size: 400,
    sent: 400,
    delivered: 300,
    bounced: 100,
    unique_opened: 98,
    unique_clicked: 20,
    open_rate: '32.7',
    click_rate: '6.7',
    status: 'failed',
    provider: 'Custom SMTP (TLS)',
    created_at: '2026-10-09T12:00:00Z',
    scheduled_at: null,
    completed_at: '2026-10-09T12:15:00Z',
    list_name: 'Legacy Integration Users',
    summary: 'Demo simulation of partial failure: 100 obsolete recipient addresses rejected with 550 Mailbox Unavailable.'
  }
];

export const DEMO_CONTACTS = [
  { _id: 'c-01', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', company: 'Acme Logistics India', list: 'VIP Customers & Founders', status: 'Subscribed', opens: 14, clicks: 6, added_at: '2026-09-12' },
  { _id: 'c-02', name: 'Priya Nair', email: 'priya.nair@example.org', company: 'Vertex Cloud Solutions', list: 'Enterprise Tech Leads', status: 'Subscribed', opens: 22, clicks: 9, added_at: '2026-09-14' },
  { _id: 'c-03', name: 'Rohan Mehta', email: 'rohan.mehta@example.com', company: 'Apex Retailers Pvt Ltd', list: 'Growth Marketers Cohort', status: 'Subscribed', opens: 8, clicks: 2, added_at: '2026-09-18' },
  { _id: 'c-04', name: 'Ananya Iyer', email: 'ananya.iyer@example.org', company: 'Horizon Healthcare Media', list: 'Developer Newsletter', status: 'Subscribed', opens: 31, clicks: 12, added_at: '2026-09-20' },
  { _id: 'c-05', name: 'Vikram Patel', email: 'vikram.patel@example.com', company: 'Nova Analytics Corp', list: 'VIP Customers & Founders', status: 'Subscribed', opens: 19, clicks: 5, added_at: '2026-09-22' },
  { _id: 'c-06', name: 'Sneha Rao', email: 'sneha.rao@example.org', company: 'Starlight Media House', list: 'Bangalore Community', status: 'Subscribed', opens: 11, clicks: 4, added_at: '2026-09-25' },
  { _id: 'c-07', name: 'Aditya Verma', email: 'aditya.verma@example.com', company: 'BluePeak Tech Labs', list: 'Enterprise Tech Leads', status: 'Subscribed', opens: 27, clicks: 10, added_at: '2026-09-28' },
  { _id: 'c-08', name: 'Kavita Reddy', email: 'kavita.reddy@example.org', company: 'Zenith FinTech Systems', list: 'Security & Workspace Admins', status: 'Subscribed', opens: 16, clicks: 7, added_at: '2026-10-01' },
  { _id: 'c-09', name: 'Siddharth Joshi', email: 'siddharth.joshi@example.com', company: 'Quantum Robotics', list: 'Developer Newsletter', status: 'Subscribed', opens: 29, clicks: 11, added_at: '2026-10-02' },
  { _id: 'c-10', name: 'Neha Kapoor', email: 'neha.kapoor@example.org', company: 'Silverline Global Logistics', list: 'Growth Marketers Cohort', status: 'Subscribed', opens: 13, clicks: 3, added_at: '2026-10-04' },
  { _id: 'c-11', name: 'Rahul Deshmukh', email: 'rahul.deshmukh@example.com', company: 'Nexus Payments Ltd', list: 'VIP Customers & Founders', status: 'Subscribed', opens: 18, clicks: 8, added_at: '2026-10-05' },
  { _id: 'c-12', name: 'Pooja Bose', email: 'pooja.bose@example.org', company: 'Beacon Digital Studio', list: 'Bangalore Community', status: 'Subscribed', opens: 9, clicks: 2, added_at: '2026-10-06' },
  { _id: 'c-13', name: 'Manish Gupta', email: 'manish.gupta@example.com', company: 'CloudSpire Networks', list: 'Enterprise Tech Leads', status: 'Subscribed', opens: 24, clicks: 6, added_at: '2026-10-07' },
  { _id: 'c-14', name: 'Divya Menon', email: 'divya.menon@example.org', company: 'UrbanKart E-Commerce', list: 'Growth Marketers Cohort', status: 'Subscribed', opens: 15, clicks: 4, added_at: '2026-10-08' },
  { _id: 'c-15', name: 'Karan Malhotra', email: 'karan.malhotra@example.com', company: 'Optima Health Tech', list: 'Security & Workspace Admins', status: 'Subscribed', opens: 20, clicks: 8, added_at: '2026-10-09' },
  { _id: 'c-16', name: 'Ritu Saxena', email: 'ritu.saxena@example.org', company: 'Matrix Consulting India', list: 'Developer Newsletter', status: 'Subscribed', opens: 17, clicks: 5, added_at: '2026-10-10' },
  { _id: 'c-17', name: 'Arjun Pillai', email: 'arjun.pillai@example.com', company: 'Astra Mobility Solutions', list: 'VIP Customers & Founders', status: 'Subscribed', opens: 25, clicks: 9, added_at: '2026-10-11' },
  { _id: 'c-18', name: 'Tanvi Bhatia', email: 'tanvi.bhatia@example.org', company: 'Elevate Workspace Software', list: 'New Workspace Signups', status: 'Subscribed', opens: 5, clicks: 1, added_at: '2026-10-12' },
  { _id: 'c-19', name: 'Sameer Chawla', email: 'sameer.chawla@example.com', company: 'Vanguard Retail Systems', list: 'Inactive Accounts (60d+)', status: 'Unsubscribed', opens: 2, clicks: 0, added_at: '2026-08-15' },
  { _id: 'c-20', name: 'Meera Kulkarni', email: 'meera.kulkarni@example.org', company: 'InnoWave Media Network', list: 'Legacy Integration Users', status: 'Bounced (Suppressed)', opens: 0, clicks: 0, added_at: '2026-08-20' }
];

export const DEMO_TEMPLATES = [
  {
    _id: 'tmpl-01',
    name: 'Product Launch & Feature Showcase',
    category: 'Product Announcements',
    subject: 'Introducing [Product Name] 2.0: Engineered for Performance',
    preheader: 'Discover the features built to accelerate your workflow.',
    thumbnail_color: '#06b6d4',
    html: `<div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #0e1526; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
      <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 36px 30px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0 0 10px 0;">Introducing MailFlow 2.0</h1>
        <p style="color: rgba(255,255,255,0.9); font-size: 15px; margin: 0;">Precision email delivery and real-time audience analytics.</p>
      </div>
      <div style="padding: 32px 30px;">
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">Hello {{name}},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">We are proud to release our newest platform update featuring dedicated queue pacing, instant bounce mitigation, and customizable template modules.</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="#" style="background: #06b6d4; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">Explore the New Release</a>
        </div>
        <p style="font-size: 13px; color: #64748b; line-height: 1.5; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; margin-top: 30px;">© 2026 Ashmyra Technologies. All rights reserved.</p>
      </div>
    </div>`
  },
  {
    _id: 'tmpl-02',
    name: 'Executive Tech Newsletter',
    category: 'Newsletters',
    subject: 'The Ashmyra Dispatch: High-Throughput Delivery Systems',
    preheader: 'Architecture notes, security best practices, and deliverability research.',
    thumbnail_color: '#8b5cf6',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0e1526; color: #f8fafc; border-radius: 12px; padding: 30px; border: 1px solid rgba(255,255,255,0.08);">
      <div style="border-bottom: 2px solid #8b5cf6; padding-bottom: 15px; margin-bottom: 25px;">
        <span style="font-size: 12px; font-weight: 700; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.05em;">Issue #14 • Technical Engineering</span>
        <h2 style="font-size: 24px; margin: 8px 0 0 0; color: #ffffff;">The Ashmyra Dispatch</h2>
      </div>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Welcome to this month's engineering brief. In this edition, we explore how 2048-bit DKIM key rotation and IP warming schedules safeguard inbox reputation.</p>
      <div style="background: #131d34; padding: 18px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
        <h4 style="margin: 0 0 6px 0; color: #f8fafc;">Key Takeaway</h4>
        <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">Limiting outbound SMTP concurrency to 25 simultaneous sockets per MX domain reduced soft throttles by 84% across major ISPs.</p>
      </div>
      <a href="#" style="color: #06b6d4; font-weight: 600; text-decoration: none; font-size: 14px;">Read Full Whitepaper →</a>
    </div>`
  },
  {
    _id: 'tmpl-03',
    name: 'Customer Welcome & Onboarding',
    category: 'Welcome Emails',
    subject: 'Welcome to Ashmyra MailFlow: Getting Started in 3 Steps',
    preheader: 'Configure your first SMTP provider, import contacts, and verify deliverability.',
    thumbnail_color: '#10b981',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0e1526; color: #f8fafc; border-radius: 12px; padding: 35px 30px; border: 1px solid rgba(255,255,255,0.08);">
      <h1 style="color: #10b981; font-size: 24px; margin: 0 0 12px 0;">Welcome to MailFlow, {{name}}!</h1>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">You're ready to start building and dispatching high-performance email campaigns. Here are the 3 essential steps to maximize deliverability:</p>
      <ol style="color: #cbd5e1; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 20px 0;">
        <li><strong>Connect your SMTP Provider:</strong> Amazon SES, Brevo, or Custom Host in Settings.</li>
        <li><strong>Import your Recipient CSV:</strong> Clean, valid address lists with custom attributes.</li>
        <li><strong>Preview & Dispatch:</strong> Test rendering across mobile and desktop clients before launching.</li>
      </ol>
      <a href="#" style="background: #10b981; color: #090d16; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">Open Getting Started Guide</a>
    </div>`
  },
  {
    _id: 'tmpl-04',
    name: 'Exclusive Event & Webinar Invitation',
    category: 'Event Invitations',
    subject: 'VIP Invitation: Ashmyra SaaS Builders Summit 2026',
    preheader: 'Join industry experts in Bangalore or tune in live online.',
    thumbnail_color: '#f59e0b',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0e1526; color: #f8fafc; border-radius: 12px; padding: 30px; border: 1px solid rgba(255,255,255,0.08);">
      <span style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700;">Live Workshop</span>
      <h2 style="font-size: 22px; margin: 15px 0 10px 0; color: #ffffff;">Ashmyra SaaS Summit 2026</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Discover how modern engineering teams architect scalable email dispatch systems, manage deliverability, and maintain clean subscriber lists.</p>
      <div style="background: #131d34; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #cbd5e1;">
        🗓️ <strong>Date:</strong> November 28, 2026<br/>
        ⏰ <strong>Time:</strong> 4:00 PM – 6:30 PM IST<br/>
        📍 <strong>Location:</strong> Indiranagar, Bangalore & Virtual Stream
      </div>
      <a href="#" style="background: #f59e0b; color: #090d16; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">Reserve Your Spot</a>
    </div>`
  },
  {
    _id: 'tmpl-05',
    name: 'Special Growth Promotional Offer',
    category: 'Promotional Offers',
    subject: 'Limited-Time: Unlock 30% Off MailFlow Annual Growth Plans',
    preheader: 'Scale your sending volume with customer-owned SMTP integration.',
    thumbnail_color: '#38bdf8',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0e1526; color: #f8fafc; border-radius: 12px; padding: 35px 30px; text-align: center; border: 1px solid rgba(255,255,255,0.08);">
      <h3 style="color: #38bdf8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0;">Special Offer for Growing Teams</h3>
      <h1 style="color: #ffffff; font-size: 26px; margin: 0 0 15px 0;">Save 30% on Annual Growth</h1>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; max-width: 480px; margin: 0 auto 25px auto;">Upgrade today to unlock 25,000 monthly recipient attempts, detailed delivery heatmaps, and priority customer-owned SMTP support.</p>
      <a href="#" style="background: #38bdf8; color: #090d16; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 15px; display: inline-block;">Claim Annual Discount</a>
    </div>`
  },
  {
    _id: 'tmpl-06',
    name: 'Monthly Outreach Performance Summary',
    category: 'Monthly Updates',
    subject: 'Your October Outreach Report: 18,081 Successful Deliveries',
    preheader: 'Open rates increased by 4.2% over last reporting period.',
    thumbnail_color: '#22d3ee',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0e1526; color: #f8fafc; border-radius: 12px; padding: 30px; border: 1px solid rgba(255,255,255,0.08);">
      <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #ffffff;">Monthly Outreach Summary</h2>
      <p style="color: #94a3b8; font-size: 14px; margin: 0 0 20px 0;">Reporting Period: 01 Oct 2026 – 16 Oct 2026</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 25px;">
        <div style="background: #131d34; padding: 15px; border-radius: 8px;">
          <div style="font-size: 12px; color: #94a3b8;">Delivered</div>
          <div style="font-size: 22px; font-weight: 800; color: #10b981;">18,081</div>
        </div>
        <div style="background: #131d34; padding: 15px; border-radius: 8px;">
          <div style="font-size: 12px; color: #94a3b8;">Unique Open Rate</div>
          <div style="font-size: 22px; font-weight: 800; color: #06b6d4;">40.0%</div>
        </div>
      </div>
      <a href="#" style="color: #06b6d4; font-weight: 600; text-decoration: none; font-size: 14px;">View Interactive Dashboard →</a>
    </div>`
  },
  {
    _id: 'tmpl-07',
    name: 'Customer Re-engagement & Winback',
    category: 'Re-engagement',
    subject: 'We miss you! See what is new in Ashmyra MailFlow',
    preheader: 'Faster batch processing, smart suppressions, and customized reports.',
    thumbnail_color: '#f43f5e',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0e1526; color: #f8fafc; border-radius: 12px; padding: 35px 30px; text-align: center; border: 1px solid rgba(255,255,255,0.08);">
      <h2 style="color: #f8fafc; font-size: 22px; margin: 0 0 10px 0;">Still Looking for Reliable Email Marketing?</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">We have rolled out comprehensive upgrades to our campaign scheduler and contact manager. Test out the new platform with zero setup fees.</p>
      <a href="#" style="background: #f43f5e; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">Reactivate Your Workspace</a>
    </div>`
  },
  {
    _id: 'tmpl-08',
    name: 'Security & TLS Compliance Advisory',
    category: 'Security',
    subject: 'Important: Security Upgrade & Relay Configuration Check',
    preheader: 'Confirm that your SMTP relay supports TLS 1.3 encryption.',
    thumbnail_color: '#14b8a6',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0e1526; color: #f8fafc; border-radius: 12px; padding: 30px; border: 1px solid rgba(255,255,255,0.08);">
      <h3 style="color: #14b8a6; margin: 0 0 8px 0;">Platform Security Advisory</h3>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">As part of our commitment to high deliverability standards, all outbound SMTP connections now require valid SSL/TLS handshakes.</p>
      <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">Please review your outbound provider settings in the Settings → Email Delivery panel.</p>
    </div>`
  }
];

export const DEMO_ACTIVITIES = [
  { time: '10:15 AM', event: 'Campaign "Q4 Product Launch Announcement" completed (4,420 delivered)', type: 'completed' },
  { time: '09:30 AM', event: 'Batch dispatch started: 4,500 recipients via Custom SMTP', type: 'sent' },
  { time: 'Yesterday', event: 'Contact import completed: 1,200 leads added to "Enterprise Tech Leads"', type: 'import' },
  { time: 'Yesterday', event: 'Campaign "Black Friday VIP Early Access" scheduled for Oct 18', type: 'scheduled' },
  { time: '2 days ago', event: 'Template "Product Launch & Feature Showcase" edited and saved', type: 'template' },
  { time: '3 days ago', event: 'Campaign "November Engineering Digest" completed (1,320 opens logged)', type: 'opened' }
];

export const DEMO_PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Essential email marketing tools for startups and independent builders.',
    badge: null,
    pricing: {
      monthly: 499,
      quarterly: 1347,   // ₹449/mo (Save 10%)
      annual: 4790       // ₹399/mo (Save 20%)
    },
    monthlyAllowance: '5,000 recipient-send attempts',
    highlights: [
      '5,000 recipient-send attempts per billing month',
      'Customer-owned SMTP integration (SES, Brevo, Custom)',
      'Automated campaign queue & scheduling',
      'CSV contact imports with field mapping',
      'Responsive email template gallery',
      'Basic delivery, open, and click analytics',
      'Global suppression & bounce list protection',
      'Standard community & ticket support'
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Higher capacity, enhanced analytics, and advanced segmentation for growing businesses.',
    badge: 'Most Popular',
    popular: true,
    pricing: {
      monthly: 1499,
      quarterly: 4047,   // ₹1,349/mo (Save 10%)
      annual: 14390      // ₹1,199/mo (Save 20%)
    },
    monthlyAllowance: '25,000 recipient-send attempts',
    highlights: [
      '25,000 recipient-send attempts per billing month',
      'All features included in Starter',
      'Multi-provider SMTP switching (SES, Brevo, SendGrid)',
      'Advanced campaign engagement & device heatmaps',
      'CSV audience segmentation & tag filters',
      'Priority background job processing',
      'Custom unsubscribe link routing',
      'Priority email & ticket support within 12 hours'
    ]
  },
  {
    id: 'agency',
    name: 'Agency',
    tagline: 'High-throughput infrastructure, client workspace isolation, and custom configurations.',
    badge: 'High Volume',
    pricing: {
      monthly: 3999,
      quarterly: 10797,  // ₹3,599/mo (Save 10%)
      annual: 38390      // ₹3,199/mo (Save 20%)
    },
    monthlyAllowance: '100,000 recipient-send attempts',
    highlights: [
      '100,000 recipient-send attempts per billing month',
      'All features included in Growth',
      'Multi-tenant workspace isolation for client accounts',
      'Custom IP pool rotation guidance',
      'Enhanced account role administration',
      'Custom domain & tracking redirect setup assistance',
      'Dedicated Slack/Teams support channel',
      '99.9% uptime SLA on queue infrastructure'
    ]
  }
];

export const DEMO_SYSTEM_STATUS = {
  overall: {
    status: 'Healthy',
    label: 'Illustrative Demo Ready',
    diagnostic: 'Simulated demo environment active. Production SMTP dispatch and persistent database mutation are disabled.'
  },
  database: {
    status: 'In-Memory (Demo Fixtures)',
    name: 'MailFlow_Demo_Sandbox'
  },
  smtp: {
    status: 'Simulated (Safe Demo)',
    host: 'smtp.example.org',
    port: 587
  },
  worker: {
    status: 'Idle (Demo Queue)',
    runningCampaigns: 0,
    scheduledCampaigns: 2,
    completedCampaigns: 7
  },
  suppressionCount: 20
};
