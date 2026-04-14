"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Copy,
  Trash2,
  Send,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Mail,
  Zap,
  MessageSquare,
  Check,
  Calendar,
  X,
  Loader2,
  FlaskConical,
} from "lucide-react";
import type { Campaign } from "@/types";
import { formatDate, getStatusColor, getTypeBadge } from "@/lib/utils";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showWizard, setShowWizard] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    const res = await fetch("/api/campaigns");
    const data = await res.json();
    setCampaigns(data.campaigns ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const filtered = campaigns.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleDuplicate = async (id: string) => {
    const orig = campaigns.find((c) => c.id === id);
    if (!orig) return;
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${orig.name} (Copy)`,
        subject: orig.subject,
        type: orig.type,
        audience: orig.audience,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.campaign) setCampaigns((prev) => [data.campaign, ...prev]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-6xl animate-pulse">
        <div className="h-10 bg-muted rounded-xl w-full max-w-md" />
        <div className="glass-card rounded-2xl h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 bg-secondary border border-border rounded-xl text-sm w-56 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground cursor-pointer focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Status</option>
            <option value="Sent">Sent</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Draft">Draft</option>
            <option value="Paused">Paused</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground cursor-pointer focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Types</option>
            <option value="Regular">Regular</option>
            <option value="A/B Test">A/B Test</option>
            <option value="Automated">Automated</option>
          </select>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 px-4 py-2 gradient-bg text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                  Recipients
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                  Opens
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">
                  Clicks
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">
                  Date
                </th>
                <th className="w-20 px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-foreground">
                    {c.name}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getTypeBadge(
                        c.type
                      )}`}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                    {c.recipients.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                    {c.openRate}%
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell">
                    {c.clickRate}%
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicate(c.id)}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-red-500/10 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Send className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No campaigns found
              </p>
              <button
                onClick={() => setShowWizard(true)}
                className="mt-3 text-sm text-brand-400 hover:text-brand-300 font-medium cursor-pointer"
              >
                Create your first campaign
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <CampaignWizard
            onClose={() => setShowWizard(false)}
            onCreated={(campaign) => {
              setCampaigns((prev) => [campaign, ...prev]);
              setShowWizard(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CampaignWizard({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (c: Campaign) => void;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    type: "",
    audience: "",
    fromName: "",
    fromEmail: "",
    subject: "",
    previewText: "",
    body: "",
    templateId: "",
    scheduleType: "now" as "now" | "schedule",
    scheduleDate: "",
    scheduleTime: "",
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSubjects, setAiSubjects] = useState<string[]>([]);
  const [aiEmail, setAiEmail] = useState<{subject: string; previewText: string; body: string} | null>(null);
  const [aiTone, setAiTone] = useState("professional");
  const [aiPrompt, setAiPrompt] = useState("");
  const [sending, setSending] = useState(false);

  const steps = ["Type", "Audience", "AI Content", "Review"];

  const canNext = () => {
    switch (step) {
      case 1: return !!data.type;
      case 2: return !!data.audience;
      case 3: return !!data.subject;
      case 4: return true;
      default: return false;
    }
  };

  const [aiError, setAiError] = useState("");

  const generateEmail = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/ai/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, tone: aiTone }),
      });
      const result = await res.json();
      if (!res.ok) {
        setAiError(result.error || "Failed to generate email");
      } else if (result.email) {
        setAiEmail(result.email);
        setData((d) => ({
          ...d,
          subject: result.email.subject,
          previewText: result.email.previewText,
          body: result.email.body,
        }));
      }
    } catch {
      setAiError("Network error. Please try again.");
    }
    setAiLoading(false);
  };

  const generateSubjects = async () => {
    if (!data.subject && !aiPrompt) return;
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/ai/generate-subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: data.subject || aiPrompt }),
      });
      const result = await res.json();
      if (!res.ok) {
        setAiError(result.error || "Failed to generate suggestions");
      } else if (result.subjects) {
        setAiSubjects(result.subjects);
      }
    } catch {
      setAiError("Network error. Please try again.");
    }
    setAiLoading(false);
  };

  const [sendError, setSendError] = useState("");

  const handleSend = async () => {
    setSending(true);
    setSendError("");
    try {
      // Step 1: Create the campaign
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.subject.slice(0, 50) || "New Campaign",
          subject: data.subject,
          previewText: data.previewText,
          body: data.body,
          type: data.type,
          audience: data.audience,
          fromName: data.fromName,
          fromEmail: data.fromEmail,
          scheduleType: data.scheduleType,
          scheduleDate: data.scheduleDate,
          scheduleTime: data.scheduleTime,
        }),
      });
      const result = await res.json();
      if (!result.campaign) {
        setSendError(result.error || "Failed to create campaign");
        setSending(false);
        return;
      }

      // Step 2: If "Send Now", actually dispatch emails via /api/send
      if (data.scheduleType === "now") {
        const sendRes = await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campaignId: result.campaign.id }),
        });
        const sendResult = await sendRes.json();
        if (!sendRes.ok) {
          setSendError(sendResult.error || "Campaign created but sending failed");
        }
      }

      onCreated(result.campaign);
    } catch {
      setSendError("Something went wrong. Please try again.");
    }
    setSending(false);
  };

  const campaignTypes = [
    { id: "Regular", label: "Regular", desc: "Standard email campaign", icon: Mail },
    { id: "A/B Test", label: "A/B Test", desc: "Test different variations", icon: FlaskConical },
    { id: "Automated", label: "Automated", desc: "Trigger-based emails", icon: Zap },
    { id: "SMS", label: "SMS", desc: "Text message campaign", icon: MessageSquare },
  ];

  const [contactCount, setContactCount] = useState(0);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.ok ? r.json() : { contacts: [] })
      .then((data) => setContactCount((data.contacts ?? []).length))
      .catch(() => {});
  }, []);

  const audiences = [
    { name: "All Subscribers", count: contactCount },
    { name: "Newsletter", count: Math.ceil(contactCount * 0.5) },
    { name: "Customers", count: Math.ceil(contactCount * 0.42) },
    { name: "VIP", count: Math.ceil(contactCount * 0.33) },
    { name: "New Subscribers", count: Math.ceil(contactCount * 0.25) },
    { name: "Inactive 90d", count: Math.ceil(contactCount * 0.08) },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-2xl max-h-[85vh] flex flex-col"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">New Campaign</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    i + 1 < step
                      ? "gradient-bg text-white"
                      : i + 1 === step
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1 < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-xs hidden sm:block ${
                    i + 1 === step ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px ${
                      i + 1 < step ? "bg-brand-500" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {campaignTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setData((d) => ({ ...d, type: t.id }))}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    data.type === t.id
                      ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <t.icon
                    className={`w-5 h-5 mb-2 ${
                      data.type === t.id ? "text-brand-400" : "text-muted-foreground"
                    }`}
                  />
                  <p className="text-sm font-medium text-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">Select your target audience</p>
              {audiences.map((a) => (
                <button
                  key={a.name}
                  onClick={() => setData((d) => ({ ...d, audience: a.name }))}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    data.audience === a.name
                      ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">{a.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {a.count} contacts
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              {/* AI Generator */}
              <div className="glass-card rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-brand-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Email Generator</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Describe your email in one line and let AI generate the complete campaign.
                </p>
                <input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Announce our summer sale, 20% off everything"
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground cursor-pointer"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="playful">Playful</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <button
                    onClick={generateEmail}
                    disabled={aiLoading || !aiPrompt}
                    className="flex items-center gap-1.5 px-4 py-2 gradient-bg text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
                  >
                    {aiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate
                  </button>
                </div>

                {/* AI Error */}
                {aiError && (
                  <p className="text-sm text-red-400 mt-2">{aiError}</p>
                )}

                {/* AI Generated result */}
                {aiEmail && (
                  <div className="border-l-2 border-brand-500 pl-3 space-y-2 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Subject</p>
                      <p className="text-sm text-foreground font-medium">{aiEmail.subject}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Preview</p>
                      <p className="text-sm text-muted-foreground">{aiEmail.previewText}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      From Name
                    </label>
                    <input
                      value={data.fromName}
                      onChange={(e) => setData((d) => ({ ...d, fromName: e.target.value }))}
                      placeholder="Your Name"
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      From Email
                    </label>
                    <input
                      type="email"
                      value={data.fromEmail}
                      onChange={(e) => setData((d) => ({ ...d, fromEmail: e.target.value }))}
                      placeholder="you@company.com"
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Subject Line
                    </label>
                    <button
                      onClick={generateSubjects}
                      disabled={aiLoading}
                      className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      {aiLoading ? "Generating..." : "AI Suggest"}
                    </button>
                  </div>
                  <input
                    value={data.subject}
                    onChange={(e) => setData((d) => ({ ...d, subject: e.target.value }))}
                    placeholder="Enter your subject line"
                    maxLength={100}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  {aiSubjects.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {aiSubjects.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setData((d) => ({ ...d, subject: s }));
                            setAiSubjects([]);
                          }}
                          className="w-full text-left px-3 py-2 text-sm bg-secondary rounded-xl hover:bg-brand-500/10 transition-colors cursor-pointer border border-border hover:border-brand-500/30"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Preview Text
                  </label>
                  <input
                    value={data.previewText}
                    onChange={(e) => setData((d) => ({ ...d, previewText: e.target.value }))}
                    placeholder="Brief preview text..."
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Email Body (HTML)
                  </label>
                  <textarea
                    value={data.body}
                    onChange={(e) => setData((d) => ({ ...d, body: e.target.value }))}
                    placeholder="Write your email body here or use AI to generate it..."
                    rows={6}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                {[
                  { label: "Type", value: data.type },
                  { label: "Audience", value: data.audience },
                  { label: "Subject", value: data.subject },
                  { label: "Preview", value: data.previewText || "—" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>

              {sendError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3">
                  {sendError}
                </div>
              )}

              {data.body && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Email Preview</p>
                  <div className="bg-white text-gray-900 rounded-xl p-4 text-sm max-h-48 overflow-y-auto">
                    <iframe
                      srcDoc={data.body}
                      sandbox=""
                      className="w-full h-40 border-0"
                      title="Email preview"
                    />
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">When to send</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setData((d) => ({ ...d, scheduleType: "now" }))}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer text-center ${
                      data.scheduleType === "now"
                        ? "border-brand-500 bg-brand-500/10 text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <Send className="w-4 h-4 mx-auto mb-1" /> Send Now
                  </button>
                  <button
                    onClick={() => setData((d) => ({ ...d, scheduleType: "schedule" }))}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer text-center ${
                      data.scheduleType === "schedule"
                        ? "border-brand-500 bg-brand-500/10 text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <Calendar className="w-4 h-4 mx-auto mb-1" /> Schedule
                  </button>
                </div>
                {data.scheduleType === "schedule" && (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="date"
                      value={data.scheduleDate}
                      onChange={(e) => setData((d) => ({ ...d, scheduleDate: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground"
                    />
                    <input
                      type="time"
                      value={data.scheduleTime}
                      onChange={(e) => setData((d) => ({ ...d, scheduleTime: e.target.value }))}
                      className="px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> {step > 1 ? "Back" : "Cancel"}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="flex items-center gap-1 px-5 py-2 gradient-bg text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex items-center gap-1 px-5 py-2 gradient-bg text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {data.scheduleType === "schedule" ? "Schedule" : "Send Now"}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
