"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Send,
  Eye,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Plus,
  Upload,
  BarChart3,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Campaign } from "@/types";
import { formatDate, getStatusColor } from "@/lib/utils";

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((data) => {
        setCampaigns(data.campaigns ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const [chartData, setChartData] = useState<{ month: string; subscribers: number; unsubscribes: number }[]>([]);

  useEffect(() => {
    fetch("/api/analytics?type=growth")
      .then((r) => r.json())
      .then((data) => setChartData(data.data ?? []))
      .catch(() => {});
  }, []);

  const sentCampaigns = campaigns.filter((c) => c.status === "Sent");
  const totalContacts = 12; // From mock data
  const avgOpen = sentCampaigns.length
    ? (sentCampaigns.reduce((a, c) => a + c.openRate, 0) / sentCampaigns.length).toFixed(1)
    : "0";
  const avgClick = sentCampaigns.length
    ? (sentCampaigns.reduce((a, c) => a + c.clickRate, 0) / sentCampaigns.length).toFixed(1)
    : "0";

  const stats = [
    { label: "Total Contacts", value: totalContacts.toLocaleString(), change: "+12.3%", up: true, icon: Users },
    { label: "Campaigns Sent", value: sentCampaigns.length.toString(), change: "+4.1%", up: true, icon: Send },
    { label: "Avg Open Rate", value: `${avgOpen}%`, change: "+2.8%", up: true, icon: Eye },
    { label: "Avg Click Rate", value: `${avgClick}%`, change: "-0.4%", up: false, icon: MousePointer },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className="w-9 h-9 bg-brand-500/10 rounded-xl flex items-center justify-center">
                <s.icon className="w-4 h-4 text-brand-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${
                s.up ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {s.change} vs last month
            </p>
          </motion.div>
        ))}
      </div>

      {/* Audience Growth Chart */}
      <motion.div
        className="glass-card rounded-2xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-medium text-foreground mb-4">
          Audience Growth
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
              }}
            />
            <Line
              type="monotone"
              dataKey="subscribers"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              name="Subscribers"
            />
            <Line
              type="monotone"
              dataKey="unsubscribes"
              stroke="#f87171"
              strokeWidth={2}
              dot={false}
              name="Unsubscribes"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Campaigns */}
      <motion.div
        className="glass-card rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">
            Recent Campaigns
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">
                  Opens
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">
                  Clicks
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground hidden md:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.slice(0, 5).map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-foreground">
                    {c.name}
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
                  <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                    {c.openRate}%
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                    {c.clickRate}%
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                    {formatDate(c.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {campaigns.length === 0 && (
            <div className="py-16 text-center">
              <Send className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No campaigns yet
              </p>
              <Link
                href="/campaigns"
                className="mt-3 inline-flex text-sm text-brand-400 hover:text-brand-300 font-medium"
              >
                Create your first campaign
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          href="/campaigns"
          className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </Link>
        <Link
          href="/contacts"
          className="flex items-center gap-2 px-4 py-2.5 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-secondary transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Import Contacts
        </Link>
        <Link
          href="/analytics"
          className="flex items-center gap-2 px-4 py-2.5 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-secondary transition-colors cursor-pointer"
        >
          <BarChart3 className="w-4 h-4" /> View Reports
        </Link>
      </motion.div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-5 h-28">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-7 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-5 h-72">
        <div className="h-4 w-32 bg-muted rounded mb-4" />
        <div className="h-48 bg-muted/50 rounded-xl" />
      </div>
      <div className="glass-card rounded-2xl h-64">
        <div className="h-4 w-32 bg-muted rounded m-5" />
      </div>
    </div>
  );
}
