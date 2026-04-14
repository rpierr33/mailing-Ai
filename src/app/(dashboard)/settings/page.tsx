"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Key,
  Copy,
  Trash2,
  Check,
  Sparkles,
  User,
  CreditCard,
  Plug,
  Code,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const TABS = [
  { id: "account", label: "Account", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "api", label: "AI & API", icon: Code },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("account");

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl w-fit flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              tab === t.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "account" && <AccountTab />}
      {tab === "billing" && <BillingTab />}
      {tab === "integrations" && <IntegrationsTab />}
      {tab === "api" && <APITab />}
    </div>
  );
}

function AccountTab() {
  const [form, setForm] = useState({
    orgName: "MailFlow",
    industry: "Technology",
    timezone: "America/New_York",
    website: "",
    fromName: "Demo User",
    fromEmail: "hello@company.com",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Account Settings</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Organization Name", key: "orgName" as const, type: "text" },
          { label: "Default From Name", key: "fromName" as const, type: "text" },
          { label: "Default From Email", key: "fromEmail" as const, type: "text" },
          { label: "Website", key: "website" as const, type: "text", placeholder: "https://" },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {field.label}
            </label>
            <input
              value={form[field.key]}
              onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Industry
          </label>
          <select
            value={form.industry}
            onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground cursor-pointer"
          >
            {["Technology", "E-commerce", "SaaS", "Agency", "Education", "Non-profit", "Other"].map(
              (i) => (
                <option key={i}>{i}</option>
              )
            )}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Timezone
          </label>
          <select
            value={form.timezone}
            onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground cursor-pointer"
          >
            {["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "UTC"].map(
              (tz) => (
                <option key={tz}>{tz}</option>
              )
            )}
          </select>
        </div>
      </div>
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2 gradient-bg text-white text-sm font-medium rounded-xl hover:opacity-90 cursor-pointer"
      >
        {saved ? <><Check className="w-4 h-4" /> Saved</> : "Save Changes"}
      </button>
    </motion.div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-4">
      <motion.div
        className="glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Free Plan</h3>
            <p className="text-3xl font-bold text-foreground mt-1">
              $0<span className="text-sm text-muted-foreground font-normal">/month</span>
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 500 contacts</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 1,000 emails/month</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Basic templates</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Email support</li>
            </ul>
          </div>
          <button className="px-4 py-2 gradient-bg text-white text-sm font-medium rounded-xl hover:opacity-90 cursor-pointer">
            Upgrade to Pro
          </button>
        </div>
      </motion.div>

      <motion.div
        className="glass-card rounded-2xl p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-sm font-medium text-foreground">Usage</h3>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Contacts</span>
            <span className="text-foreground font-medium">12 / 500</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full gradient-bg rounded-full" style={{ width: "2.4%" }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Monthly sends</span>
            <span className="text-foreground font-medium">156 / 1,000</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full gradient-bg rounded-full" style={{ width: "15.6%" }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function IntegrationsTab() {
  const [connected, setConnected] = useState<Record<string, boolean>>({
    "Google Analytics": true,
    Zapier: true,
  });

  const integrations = [
    { name: "Shopify", desc: "Sync customers and orders", icon: "🛍️" },
    { name: "WooCommerce", desc: "WordPress e-commerce sync", icon: "🛒" },
    { name: "Salesforce", desc: "CRM contact sync", icon: "☁️" },
    { name: "Zapier", desc: "Connect 5000+ apps", icon: "⚡" },
    { name: "WordPress", desc: "Blog subscriber forms", icon: "📝" },
    { name: "Google Analytics", desc: "Track email campaign traffic", icon: "📊" },
    { name: "Stripe", desc: "Payment and revenue tracking", icon: "💳" },
    { name: "Facebook Ads", desc: "Audience sync for ads", icon: "📱" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {integrations.map((int, i) => (
        <motion.div
          key={int.name}
          className="glass-card rounded-2xl p-4 flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <span className="text-2xl">{int.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{int.name}</p>
            <p className="text-xs text-muted-foreground">{int.desc}</p>
          </div>
          {connected[int.name] ? (
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full font-medium whitespace-nowrap">
              <Check className="w-3 h-3" /> Connected
            </span>
          ) : (
            <button
              onClick={() => setConnected((c) => ({ ...c, [int.name]: true }))}
              className="px-3 py-1.5 border border-border text-xs font-medium text-muted-foreground rounded-lg hover:bg-secondary cursor-pointer whitespace-nowrap"
            >
              Connect
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function APITab() {
  const [apiKey, setApiKey] = useState("");
  const [keys] = useState([
    { name: "Production", prefix: "sk-prod-8f", created: "Dec 1, 2024", lastUsed: "Dec 10, 2024" },
    { name: "Development", prefix: "sk-dev-3a", created: "Nov 15, 2024", lastUsed: "Dec 8, 2024" },
  ]);
  const [copied, setCopied] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <motion.div
        className="glass-card rounded-2xl p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-medium text-foreground">AI Configuration</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          AI features are configured server-side via the ANTHROPIC_API_KEY environment variable.
          Without it, AI features use demo mode with simulated responses.
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs text-muted-foreground">
            Demo mode — AI features use simulated responses
          </span>
        </div>
      </motion.div>

      <motion.div
        className="glass-card rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">API Keys</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 gradient-bg text-white text-xs font-medium rounded-lg hover:opacity-90 cursor-pointer">
            <Key className="w-3.5 h-3.5" /> Create Key
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Key</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Created</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Last Used</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {keys.map((k, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-5 py-3 font-medium text-foreground">{k.name}</td>
                  <td className="px-5 py-3 text-muted-foreground font-mono text-xs">
                    {k.prefix}••••••••
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{k.created}</td>
                  <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{k.lastUsed}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setCopied(i);
                          setTimeout(() => setCopied(null), 2000);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary cursor-pointer"
                      >
                        {copied === i ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-red-500/10 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
