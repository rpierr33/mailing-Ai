import { prisma } from "@/lib/prisma";
import type { Campaign, Contact, Template, Segment } from "@/types";

// ─────────────────────────────────────────────────
// Real database operations via Prisma + Supabase PostgreSQL
// Replaces the in-memory mock store
// ─────────────────────────────────────────────────

// Chart data generators (deterministic — will be replaced by real analytics later)
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
// Campaign CRUD — real database
// ─────────────────────────────────────────────────

export async function getCampaigns(userId?: string): Promise<Campaign[]> {
  const where = userId ? { userId } : {};
  const rows = await prisma.campaign.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    ...r,
    previewText: r.previewText ?? null,
    body: r.body ?? null,
    audience: r.audience ?? null,
    fromName: r.fromName ?? null,
    fromEmail: r.fromEmail ?? null,
    scheduledAt: r.scheduledAt?.toISOString() ?? null,
    sentAt: r.sentAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getCampaign(id: string): Promise<Campaign | undefined> {
  const r = await prisma.campaign.findUnique({ where: { id } });
  if (!r) return undefined;
  return {
    ...r,
    previewText: r.previewText ?? null,
    body: r.body ?? null,
    audience: r.audience ?? null,
    fromName: r.fromName ?? null,
    fromEmail: r.fromEmail ?? null,
    scheduledAt: r.scheduledAt?.toISOString() ?? null,
    sentAt: r.sentAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function addCampaign(data: Omit<Campaign, "id" | "createdAt" | "updatedAt">): Promise<Campaign> {
  const r = await prisma.campaign.create({
    data: {
      name: data.name,
      subject: data.subject,
      previewText: data.previewText,
      body: data.body,
      type: data.type,
      status: data.status,
      audience: data.audience,
      recipients: data.recipients,
      openRate: data.openRate,
      clickRate: data.clickRate,
      fromName: data.fromName,
      fromEmail: data.fromEmail,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      sentAt: data.sentAt ? new Date(data.sentAt) : null,
      userId: data.userId,
    },
  });
  return {
    ...r,
    previewText: r.previewText ?? null,
    body: r.body ?? null,
    audience: r.audience ?? null,
    fromName: r.fromName ?? null,
    fromEmail: r.fromEmail ?? null,
    scheduledAt: r.scheduledAt?.toISOString() ?? null,
    sentAt: r.sentAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign | undefined> {
  try {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.subject !== undefined) updateData.subject = data.subject;
    if (data.previewText !== undefined) updateData.previewText = data.previewText;
    if (data.body !== undefined) updateData.body = data.body;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.audience !== undefined) updateData.audience = data.audience;
    if (data.recipients !== undefined) updateData.recipients = data.recipients;
    if (data.openRate !== undefined) updateData.openRate = data.openRate;
    if (data.clickRate !== undefined) updateData.clickRate = data.clickRate;
    if (data.fromName !== undefined) updateData.fromName = data.fromName;
    if (data.fromEmail !== undefined) updateData.fromEmail = data.fromEmail;
    if (data.scheduledAt !== undefined) updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
    if (data.sentAt !== undefined) updateData.sentAt = data.sentAt ? new Date(data.sentAt) : null;

    const r = await prisma.campaign.update({ where: { id }, data: updateData });
    return {
      ...r,
      previewText: r.previewText ?? null,
      body: r.body ?? null,
      audience: r.audience ?? null,
      fromName: r.fromName ?? null,
      fromEmail: r.fromEmail ?? null,
      scheduledAt: r.scheduledAt?.toISOString() ?? null,
      sentAt: r.sentAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch {
    return undefined;
  }
}

export async function deleteCampaign(id: string): Promise<boolean> {
  try {
    await prisma.campaign.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────
// Contact CRUD — real database
// ─────────────────────────────────────────────────

export async function getContacts(userId?: string): Promise<Contact[]> {
  const where = userId ? { userId } : {};
  const rows = await prisma.contact.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    ...r,
    lastName: r.lastName ?? null,
    phone: r.phone ?? null,
    location: r.location ?? null,
    notes: r.notes ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getContact(id: string): Promise<Contact | undefined> {
  const r = await prisma.contact.findUnique({ where: { id } });
  if (!r) return undefined;
  return {
    ...r,
    lastName: r.lastName ?? null,
    phone: r.phone ?? null,
    location: r.location ?? null,
    notes: r.notes ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function addContact(data: Omit<Contact, "id" | "createdAt" | "updatedAt">): Promise<Contact> {
  const r = await prisma.contact.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      tags: data.tags,
      rating: data.rating,
      source: data.source,
      location: data.location,
      notes: data.notes,
      userId: data.userId,
    },
  });
  return {
    ...r,
    lastName: r.lastName ?? null,
    phone: r.phone ?? null,
    location: r.location ?? null,
    notes: r.notes ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function updateContact(id: string, data: Partial<Contact>): Promise<Contact | undefined> {
  try {
    const updateData: Record<string, unknown> = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const r = await prisma.contact.update({ where: { id }, data: updateData });
    return {
      ...r,
      lastName: r.lastName ?? null,
      phone: r.phone ?? null,
      location: r.location ?? null,
      notes: r.notes ?? null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch {
    return undefined;
  }
}

export async function deleteContact(id: string): Promise<boolean> {
  try {
    await prisma.contact.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────
// Template CRUD — real database
// ─────────────────────────────────────────────────

export async function getTemplates(userId?: string): Promise<Template[]> {
  const rows = await prisma.template.findMany({
    where: userId ? { OR: [{ userId }, { isPrebuilt: true }] } : {},
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    ...r,
    description: r.description ?? null,
    blocks: (r.blocks as unknown as Template["blocks"]) ?? [],
    category: r.category ?? null,
    userId: r.userId ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getTemplate(id: string): Promise<Template | undefined> {
  const r = await prisma.template.findUnique({ where: { id } });
  if (!r) return undefined;
  return {
    ...r,
    description: r.description ?? null,
    blocks: (r.blocks as unknown as Template["blocks"]) ?? [],
    category: r.category ?? null,
    userId: r.userId ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

// ─────────────────────────────────────────────────
// Segments — still synthetic (no real segment engine yet)
// ─────────────────────────────────────────────────

export function getSegments(): Segment[] {
  return [
    { id: "seg1", name: "VIP Customers", conditions: "Rating is 5 AND Tag contains 'vip'", count: 4, updated: "2024-12-01" },
    { id: "seg2", name: "Recent Signups", conditions: "Subscribed after Nov 1, 2024", count: 3, updated: "2024-12-05" },
    { id: "seg3", name: "Webinar Attendees", conditions: "Tag contains 'webinar-2024'", count: 4, updated: "2024-11-15" },
  ];
}

export function addSegment(data: Omit<Segment, "id">): Segment {
  return { ...data, id: `seg-${Date.now()}` };
}

export function deleteSegment(_id: string): boolean {
  return true;
}
