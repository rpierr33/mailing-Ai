export interface Campaign {
  id: string;
  name: string;
  subject: string;
  previewText: string | null;
  body: string | null;
  type: string;
  status: string;
  audience: string | null;
  recipients: number;
  openRate: number;
  clickRate: number;
  fromName: string | null;
  fromEmail: string | null;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  tags: string[];
  rating: number;
  source: string;
  location: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  blocks: TemplateBlock[];
  category: string | null;
  isPrebuilt: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
}

export interface TemplateBlock {
  id: string;
  type: "header" | "text" | "button" | "image" | "divider" | "columns" | "footer";
  content?: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  align?: string;
  label?: string;
  url?: string;
  borderRadius?: number;
  alt?: string;
  width?: number;
  color?: string;
  left?: string;
  right?: string;
  address?: string;
  unsubscribe?: string;
}

export interface ChartDataPoint {
  month?: string;
  day?: string;
  subscribers?: number;
  unsubscribes?: number;
  opens?: number;
  clicks?: number;
}

export interface Segment {
  id: string;
  name: string;
  conditions: string;
  count: number;
  updated: string;
}

export interface AIEmailResult {
  subject: string;
  previewText: string;
  body: string;
}

export interface WizardData {
  type: string;
  audience: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  previewText: string;
  templateId: string | null;
  scheduleType: "now" | "schedule";
  scheduleDate: string;
  scheduleTime: string;
  body: string;
}
