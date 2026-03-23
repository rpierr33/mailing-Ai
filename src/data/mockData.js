export const CONTACTS = [
  { id: 1, firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@gmail.com', tags: ['vip', 'newsletter'], rating: 5, source: 'Form', subscribed: '2024-08-12', phone: '+1 555-0101', location: 'New York' },
  { id: 2, firstName: 'Marcus', lastName: 'Johnson', email: 'marcus.j@outlook.com', tags: ['newsletter', 'webinar-2024'], rating: 4, source: 'Import', subscribed: '2024-09-03', phone: '+1 555-0102', location: 'Chicago' },
  { id: 3, firstName: 'Elena', lastName: 'Rodriguez', email: 'elena.r@company.co', tags: ['vip', 'customer'], rating: 5, source: 'API', subscribed: '2024-07-21', phone: '+1 555-0103', location: 'Miami' },
  { id: 4, firstName: 'James', lastName: 'Wright', email: 'jwright@gmail.com', tags: ['newsletter'], rating: 3, source: 'Form', subscribed: '2024-10-15', phone: '', location: 'Austin' },
  { id: 5, firstName: 'Aisha', lastName: 'Patel', email: 'aisha.p@techcorp.io', tags: ['customer', 'webinar-2024'], rating: 4, source: 'Manual', subscribed: '2024-06-08', phone: '+1 555-0105', location: 'San Francisco' },
  { id: 6, firstName: 'David', lastName: 'Kim', email: 'david.kim@gmail.com', tags: ['newsletter', 'vip'], rating: 5, source: 'Form', subscribed: '2024-11-02', phone: '+1 555-0106', location: 'Seattle' },
  { id: 7, firstName: 'Maria', lastName: 'Santos', email: 'maria.s@startup.dev', tags: ['webinar-2024'], rating: 2, source: 'Import', subscribed: '2024-09-28', phone: '', location: 'Portland' },
  { id: 8, firstName: 'Tom', lastName: 'Baker', email: 'tbaker@outlook.com', tags: ['customer'], rating: 3, source: 'API', subscribed: '2024-08-30', phone: '+1 555-0108', location: 'Denver' },
  { id: 9, firstName: 'Lisa', lastName: 'Nguyen', email: 'lisa.n@gmail.com', tags: ['newsletter', 'customer'], rating: 4, source: 'Form', subscribed: '2024-12-01', phone: '+1 555-0109', location: 'Boston' },
  { id: 10, firstName: 'Ryan', lastName: 'O\'Brien', email: 'robrien@company.co', tags: ['vip'], rating: 5, source: 'Manual', subscribed: '2024-07-14', phone: '+1 555-0110', location: 'Los Angeles' },
  { id: 11, firstName: 'Zara', lastName: 'Hassan', email: 'zara.h@agency.com', tags: ['newsletter', 'webinar-2024'], rating: 3, source: 'Import', subscribed: '2024-10-22', phone: '', location: 'Atlanta' },
  { id: 12, firstName: 'Chris', lastName: 'Taylor', email: 'chris.t@freelance.io', tags: ['customer', 'vip'], rating: 4, source: 'Form', subscribed: '2024-11-18', phone: '+1 555-0112', location: 'Nashville' },
];

export const CAMPAIGNS = [
  { id: 1, name: 'November Recap', subject: 'Your November recap is here', type: 'Regular', status: 'Sent', recipients: 2847, openRate: 28.4, clickRate: 5.2, date: '2024-11-30', audience: 'All Subscribers' },
  { id: 2, name: 'Black Friday Sale', subject: 'Last chance: 40% off everything', type: 'Regular', status: 'Sent', recipients: 3201, openRate: 31.2, clickRate: 7.2, date: '2024-11-24', audience: 'All Subscribers' },
  { id: 3, name: 'Product Launch', subject: 'Introducing our newest feature', type: 'A/B Test', status: 'Sent', recipients: 1856, openRate: 24.7, clickRate: 4.8, date: '2024-12-05', audience: 'Customers' },
  { id: 4, name: 'Holiday Gift Guide', subject: 'The perfect gifts for everyone', type: 'Regular', status: 'Scheduled', recipients: 2950, openRate: 0, clickRate: 0, date: '2024-12-20', audience: 'Newsletter' },
  { id: 5, name: 'Year in Review', subject: '2024: What a year!', type: 'Regular', status: 'Draft', recipients: 0, openRate: 0, clickRate: 0, date: '2024-12-28', audience: 'All Subscribers' },
  { id: 6, name: 'Re-engagement Flow', subject: 'We miss you! Come back for 20% off', type: 'Automated', status: 'Active', recipients: 432, openRate: 19.3, clickRate: 3.1, date: '2024-10-01', audience: 'Inactive 90d' },
  { id: 7, name: 'Welcome Series', subject: 'Welcome aboard!', type: 'Automated', status: 'Active', recipients: 1204, openRate: 45.6, clickRate: 12.3, date: '2024-08-15', audience: 'New Subscribers' },
  { id: 8, name: 'Flash Sale Test', subject: '24 hours only: mystery deal inside', type: 'A/B Test', status: 'Paused', recipients: 980, openRate: 16.8, clickRate: 1.8, date: '2024-11-10', audience: 'VIP' },
];

export const AUTOMATIONS = [
  { id: 1, name: 'Welcome Series', trigger: 'New subscriber', status: 'Active', enrolled: 1204, completed: 987, lastTriggered: '2024-12-10', nodes: [
    { id: 'n1', type: 'trigger', label: 'New Subscriber', x: 250, y: 40 },
    { id: 'n2', type: 'email', label: 'Welcome Email', subject: 'Welcome aboard!', delay: '0', x: 250, y: 140 },
    { id: 'n3', type: 'wait', label: 'Wait 2 days', duration: '2 days', x: 250, y: 240 },
    { id: 'n4', type: 'email', label: 'Getting Started', subject: 'Here\'s how to get started', delay: '2d', x: 250, y: 340 },
    { id: 'n5', type: 'wait', label: 'Wait 3 days', duration: '3 days', x: 250, y: 440 },
    { id: 'n6', type: 'email', label: 'Feature Highlight', subject: 'Did you know about this?', delay: '3d', x: 250, y: 540 },
  ]},
  { id: 2, name: 'Re-engagement', trigger: 'Inactive 90 days', status: 'Paused', enrolled: 432, completed: 198, lastTriggered: '2024-12-08', nodes: [
    { id: 'n1', type: 'trigger', label: 'Inactive 90d', x: 250, y: 40 },
    { id: 'n2', type: 'email', label: 'We Miss You', subject: 'We miss you!', delay: '0', x: 250, y: 140 },
    { id: 'n3', type: 'wait', label: 'Wait 5 days', duration: '5 days', x: 250, y: 240 },
    { id: 'n4', type: 'branch', label: 'Opened email?', condition: 'Opened previous', x: 250, y: 340 },
    { id: 'n5', type: 'email', label: 'Special Offer', subject: '20% off just for you', delay: '0', x: 150, y: 440 },
    { id: 'n6', type: 'action', label: 'Tag: churned', action: 'Add tag', x: 350, y: 440 },
  ]},
  { id: 3, name: 'Birthday Campaign', trigger: 'Birthday date', status: 'Active', enrolled: 856, completed: 421, lastTriggered: '2024-12-09', nodes: [
    { id: 'n1', type: 'trigger', label: 'Birthday', x: 250, y: 40 },
    { id: 'n2', type: 'email', label: 'Happy Birthday!', subject: 'Happy birthday! A gift for you', delay: '0', x: 250, y: 140 },
  ]},
];

export const TEMPLATES = [
  { id: 1, name: 'Welcome', description: 'Clean welcome email', color: 'bg-blue-500' },
  { id: 2, name: 'Newsletter', description: 'Weekly newsletter layout', color: 'bg-green-500' },
  { id: 3, name: 'Promo', description: 'Sale / discount template', color: 'bg-yellow-500' },
  { id: 4, name: 'Announcement', description: 'Product launch', color: 'bg-purple-500' },
  { id: 5, name: 'Minimal', description: 'Text-focused simple email', color: 'bg-gray-500' },
  { id: 6, name: 'Holiday', description: 'Seasonal greetings', color: 'bg-red-500' },
];

export const CHART_DATA = {
  audienceGrowth: [
    { month: 'Jul', subscribers: 1820, unsubscribes: 45 },
    { month: 'Aug', subscribers: 2140, unsubscribes: 52 },
    { month: 'Sep', subscribers: 2380, unsubscribes: 38 },
    { month: 'Oct', subscribers: 2710, unsubscribes: 61 },
    { month: 'Nov', subscribers: 3050, unsubscribes: 73 },
    { month: 'Dec', subscribers: 3420, unsubscribes: 48 },
  ],
  opensClicks: Array.from({ length: 30 }, (_, i) => ({
    day: `Dec ${i + 1}`,
    opens: Math.floor(180 + Math.random() * 120 + (i > 20 ? 60 : 0)),
    clicks: Math.floor(30 + Math.random() * 40 + (i > 20 ? 15 : 0)),
  })),
  heatmap: Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => {
      const base = (hour >= 9 && hour <= 17) ? 0.5 : 0.15;
      const dayBoost = (day >= 1 && day <= 4) ? 0.2 : 0;
      return Math.min(1, base + dayBoost + Math.random() * 0.3);
    })
  ),
};

export const SEGMENTS = [
  { id: 1, name: 'VIP Customers', conditions: 'Rating is 5 AND Tag contains "vip"', count: 4, updated: '2024-12-01' },
  { id: 2, name: 'Recent Signups', conditions: 'Subscribed after Nov 1, 2024', count: 3, updated: '2024-12-05' },
  { id: 3, name: 'Webinar Attendees', conditions: 'Tag contains "webinar-2024"', count: 4, updated: '2024-11-15' },
];
