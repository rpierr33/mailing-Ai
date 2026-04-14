import type { Campaign, Contact, Template, Segment } from "@/types";

// ─────────────────────────────────────────────────
// In-memory mock store for development without PostgreSQL
// Same pattern as quickbooks-ai: works without DATABASE_URL
// ─────────────────────────────────────────────────

interface MockStore {
  campaigns: Campaign[];
  contacts: Contact[];
  templates: Template[];
  segments: Segment[];
}

let mockStore: MockStore | null = null;

function getMockStore(): MockStore {
  if (!mockStore) {
    mockStore = seedMockStore();
  }
  return mockStore;
}

function seedMockStore(): MockStore {
  const now = new Date().toISOString();
  const userId = "demo-user-001";

  const contacts: Contact[] = [
    { id: "c1", firstName: "Sarah", lastName: "Chen", email: "sarah.chen@gmail.com", tags: ["vip", "newsletter"], rating: 5, source: "Form", location: "New York", phone: "+1 555-0101", notes: null, createdAt: "2024-08-12T00:00:00Z", updatedAt: now, userId },
    { id: "c2", firstName: "Marcus", lastName: "Johnson", email: "marcus.j@outlook.com", tags: ["newsletter", "webinar-2024"], rating: 4, source: "Import", location: "Chicago", phone: "+1 555-0102", notes: null, createdAt: "2024-09-03T00:00:00Z", updatedAt: now, userId },
    { id: "c3", firstName: "Elena", lastName: "Rodriguez", email: "elena.r@company.co", tags: ["vip", "customer"], rating: 5, source: "API", location: "Miami", phone: "+1 555-0103", notes: null, createdAt: "2024-07-21T00:00:00Z", updatedAt: now, userId },
    { id: "c4", firstName: "James", lastName: "Wright", email: "jwright@gmail.com", tags: ["newsletter"], rating: 3, source: "Form", location: "Austin", phone: "", notes: null, createdAt: "2024-10-15T00:00:00Z", updatedAt: now, userId },
    { id: "c5", firstName: "Aisha", lastName: "Patel", email: "aisha.p@techcorp.io", tags: ["customer", "webinar-2024"], rating: 4, source: "Manual", location: "San Francisco", phone: "+1 555-0105", notes: null, createdAt: "2024-06-08T00:00:00Z", updatedAt: now, userId },
    { id: "c6", firstName: "David", lastName: "Kim", email: "david.kim@gmail.com", tags: ["newsletter", "vip"], rating: 5, source: "Form", location: "Seattle", phone: "+1 555-0106", notes: null, createdAt: "2024-11-02T00:00:00Z", updatedAt: now, userId },
    { id: "c7", firstName: "Maria", lastName: "Santos", email: "maria.s@startup.dev", tags: ["webinar-2024"], rating: 2, source: "Import", location: "Portland", phone: "", notes: null, createdAt: "2024-09-28T00:00:00Z", updatedAt: now, userId },
    { id: "c8", firstName: "Tom", lastName: "Baker", email: "tbaker@outlook.com", tags: ["customer"], rating: 3, source: "API", location: "Denver", phone: "+1 555-0108", notes: null, createdAt: "2024-08-30T00:00:00Z", updatedAt: now, userId },
    { id: "c9", firstName: "Lisa", lastName: "Nguyen", email: "lisa.n@gmail.com", tags: ["newsletter", "customer"], rating: 4, source: "Form", location: "Boston", phone: "+1 555-0109", notes: null, createdAt: "2024-12-01T00:00:00Z", updatedAt: now, userId },
    { id: "c10", firstName: "Ryan", lastName: "O'Brien", email: "robrien@company.co", tags: ["vip"], rating: 5, source: "Manual", location: "Los Angeles", phone: "+1 555-0110", notes: null, createdAt: "2024-07-14T00:00:00Z", updatedAt: now, userId },
    { id: "c11", firstName: "Zara", lastName: "Hassan", email: "zara.h@agency.com", tags: ["newsletter", "webinar-2024"], rating: 3, source: "Import", location: "Atlanta", phone: "", notes: null, createdAt: "2024-10-22T00:00:00Z", updatedAt: now, userId },
    { id: "c12", firstName: "Chris", lastName: "Taylor", email: "chris.t@freelance.io", tags: ["customer", "vip"], rating: 4, source: "Form", location: "Nashville", phone: "+1 555-0112", notes: null, createdAt: "2024-11-18T00:00:00Z", updatedAt: now, userId },
  ];

  const campaigns: Campaign[] = [
    { id: "camp1", name: "November Recap", subject: "Your November recap is here", previewText: "See what happened this month", body: null, type: "Regular", status: "Sent", recipients: 2847, openRate: 28.4, clickRate: 5.2, audience: "All Subscribers", fromName: "MailFlow", fromEmail: "hello@mailflow.ai", scheduledAt: null, sentAt: "2024-11-30T10:00:00Z", createdAt: "2024-11-28T00:00:00Z", updatedAt: now, userId },
    { id: "camp2", name: "Black Friday Sale", subject: "Last chance: 40% off everything", previewText: "Don't miss out on our biggest sale", body: null, type: "Regular", status: "Sent", recipients: 3201, openRate: 31.2, clickRate: 7.2, audience: "All Subscribers", fromName: "MailFlow", fromEmail: "hello@mailflow.ai", scheduledAt: null, sentAt: "2024-11-24T09:00:00Z", createdAt: "2024-11-22T00:00:00Z", updatedAt: now, userId },
    { id: "camp3", name: "Product Launch", subject: "Introducing our newest feature", previewText: "You asked, we delivered", body: null, type: "A/B Test", status: "Sent", recipients: 1856, openRate: 24.7, clickRate: 4.8, audience: "Customers", fromName: "MailFlow", fromEmail: "hello@mailflow.ai", scheduledAt: null, sentAt: "2024-12-05T14:00:00Z", createdAt: "2024-12-03T00:00:00Z", updatedAt: now, userId },
    { id: "camp4", name: "Holiday Gift Guide", subject: "The perfect gifts for everyone", previewText: "Curated picks just for you", body: null, type: "Regular", status: "Scheduled", recipients: 2950, openRate: 0, clickRate: 0, audience: "Newsletter", fromName: "MailFlow", fromEmail: "hello@mailflow.ai", scheduledAt: "2024-12-20T10:00:00Z", sentAt: null, createdAt: "2024-12-15T00:00:00Z", updatedAt: now, userId },
    { id: "camp5", name: "Year in Review", subject: "2024: What a year!", previewText: "Your personalized year in review", body: null, type: "Regular", status: "Draft", recipients: 0, openRate: 0, clickRate: 0, audience: "All Subscribers", fromName: "MailFlow", fromEmail: "hello@mailflow.ai", scheduledAt: null, sentAt: null, createdAt: "2024-12-18T00:00:00Z", updatedAt: now, userId },
    { id: "camp6", name: "Re-engagement Flow", subject: "We miss you! Come back for 20% off", previewText: "A special offer waiting for you", body: null, type: "Automated", status: "Active", recipients: 432, openRate: 19.3, clickRate: 3.1, audience: "Inactive 90d", fromName: "MailFlow", fromEmail: "hello@mailflow.ai", scheduledAt: null, sentAt: "2024-10-01T00:00:00Z", createdAt: "2024-09-28T00:00:00Z", updatedAt: now, userId },
    { id: "camp7", name: "Welcome Series", subject: "Welcome aboard!", previewText: "We're thrilled to have you", body: null, type: "Automated", status: "Active", recipients: 1204, openRate: 45.6, clickRate: 12.3, audience: "New Subscribers", fromName: "MailFlow", fromEmail: "hello@mailflow.ai", scheduledAt: null, sentAt: "2024-08-15T00:00:00Z", createdAt: "2024-08-10T00:00:00Z", updatedAt: now, userId },
    { id: "camp8", name: "Flash Sale Test", subject: "24 hours only: mystery deal inside", previewText: "Open to find out...", body: null, type: "A/B Test", status: "Paused", recipients: 980, openRate: 16.8, clickRate: 1.8, audience: "VIP", fromName: "MailFlow", fromEmail: "hello@mailflow.ai", scheduledAt: null, sentAt: "2024-11-10T00:00:00Z", createdAt: "2024-11-08T00:00:00Z", updatedAt: now, userId },
  ];

  const templates: Template[] = [
    { id: "tpl1", name: "Welcome", description: "Clean welcome email for new subscribers", blocks: [], category: "onboarding", isPrebuilt: true, createdAt: now, updatedAt: now, userId: null },
    { id: "tpl2", name: "Newsletter", description: "Weekly newsletter layout", blocks: [], category: "newsletter", isPrebuilt: true, createdAt: now, updatedAt: now, userId: null },
    { id: "tpl3", name: "Promo", description: "Sale / discount template", blocks: [], category: "promotion", isPrebuilt: true, createdAt: now, updatedAt: now, userId: null },
    { id: "tpl4", name: "Announcement", description: "Product launch announcement", blocks: [], category: "announcement", isPrebuilt: true, createdAt: now, updatedAt: now, userId: null },
    { id: "tpl5", name: "Minimal", description: "Text-focused simple email", blocks: [], category: "minimal", isPrebuilt: true, createdAt: now, updatedAt: now, userId: null },
    { id: "tpl6", name: "Holiday", description: "Seasonal greetings template", blocks: [], category: "seasonal", isPrebuilt: true, createdAt: now, updatedAt: now, userId: null },
  ];

  const segments: Segment[] = [
    { id: "seg1", name: "VIP Customers", conditions: "Rating is 5 AND Tag contains 'vip'", count: 4, updated: "2024-12-01" },
    { id: "seg2", name: "Recent Signups", conditions: "Subscribed after Nov 1, 2024", count: 3, updated: "2024-12-05" },
    { id: "seg3", name: "Webinar Attendees", conditions: "Tag contains 'webinar-2024'", count: 4, updated: "2024-11-15" },
  ];

  return { campaigns, contacts, templates, segments };
}

// Chart data generators (deterministic)
export function getAudienceGrowthData(): { month: string; subscribers: number; unsubscribes: number }[] {
  return [
    { month: "Jul", subscribers: 1820, unsubscribes: 45 },
    { month: "Aug", subscribers: 2140, unsubscribes: 52 },
    { month: "Sep", subscribers: 2380, unsubscribes: 38 },
    { month: "Oct", subscribers: 2710, unsubscribes: 61 },
    { month: "Nov", subscribers: 3050, unsubscribes: 73 },
    { month: "Dec", subscribers: 3420, unsubscribes: 48 },
  ];
}

export function getOpensClicksData(): { day: string; opens: number; clicks: number }[] {
  // Deterministic seed-based data
  const data: { day: string; opens: number; clicks: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const seed = (i * 7 + 13) % 100;
    const boost = i > 20 ? 60 : 0;
    data.push({
      day: `Dec ${i + 1}`,
      opens: 180 + (seed % 120) + boost,
      clicks: 30 + (seed % 40) + (i > 20 ? 15 : 0),
    });
  }
  return data;
}

export function getHeatmapData(): number[][] {
  const data: number[][] = [];
  for (let day = 0; day < 7; day++) {
    const row: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const base = hour >= 9 && hour <= 17 ? 0.5 : 0.15;
      const dayBoost = day >= 1 && day <= 4 ? 0.2 : 0;
      const seed = ((day * 24 + hour) * 17 + 31) % 100;
      row.push(Math.min(1, base + dayBoost + (seed / 100) * 0.3));
    }
    data.push(row);
  }
  return data;
}

// ─────────────────────────────────────────────────
// CRUD operations on in-memory store
// ─────────────────────────────────────────────────

export function getCampaigns(): Campaign[] {
  return getMockStore().campaigns;
}

export function getCampaign(id: string): Campaign | undefined {
  return getMockStore().campaigns.find((c) => c.id === id);
}

export function addCampaign(data: Omit<Campaign, "id" | "createdAt" | "updatedAt">): Campaign {
  const store = getMockStore();
  const campaign: Campaign = {
    ...data,
    id: `camp-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.campaigns.unshift(campaign);
  return campaign;
}

export function updateCampaign(id: string, data: Partial<Campaign>): Campaign | undefined {
  const store = getMockStore();
  const idx = store.campaigns.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  store.campaigns[idx] = { ...store.campaigns[idx], ...data, updatedAt: new Date().toISOString() };
  return store.campaigns[idx];
}

export function deleteCampaign(id: string): boolean {
  const store = getMockStore();
  const before = store.campaigns.length;
  store.campaigns = store.campaigns.filter((c) => c.id !== id);
  return store.campaigns.length < before;
}

export function getContacts(): Contact[] {
  return getMockStore().contacts;
}

export function getContact(id: string): Contact | undefined {
  return getMockStore().contacts.find((c) => c.id === id);
}

export function addContact(data: Omit<Contact, "id" | "createdAt" | "updatedAt">): Contact {
  const store = getMockStore();
  const contact: Contact = {
    ...data,
    id: `c-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.contacts.push(contact);
  return contact;
}

export function updateContact(id: string, data: Partial<Contact>): Contact | undefined {
  const store = getMockStore();
  const idx = store.contacts.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  store.contacts[idx] = { ...store.contacts[idx], ...data, updatedAt: new Date().toISOString() };
  return store.contacts[idx];
}

export function deleteContact(id: string): boolean {
  const store = getMockStore();
  const before = store.contacts.length;
  store.contacts = store.contacts.filter((c) => c.id !== id);
  return store.contacts.length < before;
}

export function getTemplates(): Template[] {
  return getMockStore().templates;
}

export function getTemplate(id: string): Template | undefined {
  return getMockStore().templates.find((t) => t.id === id);
}

export function getSegments(): Segment[] {
  return getMockStore().segments;
}

export function addSegment(data: Omit<Segment, "id">): Segment {
  const store = getMockStore();
  const segment: Segment = { ...data, id: `seg-${Date.now()}` };
  store.segments.push(segment);
  return segment;
}

export function deleteSegment(id: string): boolean {
  const store = getMockStore();
  const before = store.segments.length;
  store.segments = store.segments.filter((s) => s.id !== id);
  return store.segments.length < before;
}
