import { z } from "zod";

export const campaignCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  subject: z.string().min(1, "Subject is required").max(200),
  previewText: z.string().max(200).optional(),
  body: z.string().optional(),
  type: z.enum(["Regular", "A/B Test", "Automated", "SMS"]).default("Regular"),
  audience: z.string().optional(),
  fromName: z.string().optional(),
  fromEmail: z.string().email().optional().or(z.literal("")),
  scheduleType: z.enum(["now", "schedule"]).default("now"),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  templateId: z.string().optional(),
});

export const campaignUpdateSchema = campaignCreateSchema.partial().extend({
  status: z.enum(["Draft", "Scheduled", "Sent", "Active", "Paused", "Cancelled"]).optional(),
});

export const contactCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().max(100).optional().default(""),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(20).optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  rating: z.number().min(1).max(5).optional().default(3),
  source: z.string().optional().default("Manual"),
  location: z.string().max(100).optional().default(""),
  notes: z.string().max(1000).optional(),
});

export const contactUpdateSchema = contactCreateSchema.partial();

export const aiGenerateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(500),
  tone: z.enum(["professional", "casual", "playful", "urgent"]).default("professional"),
});

export const aiSubjectSchema = z.object({
  topic: z.string().min(1, "Topic is required").max(500),
});

export const sendCampaignSchema = z.object({
  campaignId: z.string().min(1),
  testEmail: z.string().email().optional(),
});

export type CampaignCreate = z.infer<typeof campaignCreateSchema>;
export type CampaignUpdate = z.infer<typeof campaignUpdateSchema>;
export type ContactCreate = z.infer<typeof contactCreateSchema>;
export type ContactUpdate = z.infer<typeof contactUpdateSchema>;
