import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitials(firstName: string, lastName?: string | null): string {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Sent: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Scheduled: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    Draft: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
    Paused: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    Cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
  };
  return colors[status] ?? "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
}

export function getTypeBadge(type: string): string {
  const colors: Record<string, string> = {
    Regular: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
    "A/B Test": "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    Automated: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    SMS: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  };
  return colors[type] ?? "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
