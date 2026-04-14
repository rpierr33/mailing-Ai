"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle,
  Eye,
  MousePointer,
  AlertTriangle,
  UserMinus,
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

export default function AnalyticsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reportRange, setReportRange] = useState("30");
  const [opensClicksData, setOpensClicksData] = useState<{ day: string; opens: number; clicks: number }[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/campaigns").then((r) => r.json()),
      fetch("/api/analytics?type=opensClicks").then((r) => r.json()),
      fetch("/api/analytics?type=heatmap").then((r) => r.json()),
    ]).then(([campData, opensData, heatData]) => {
      setCampaigns(campData.campaigns ?? []);
      setOpensClicksData(opensData.data ?? []);
      setHeatmapData(heatData.data ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const sentCampaigns = campaigns.filter((c) => c.status === "Sent");
  const daysData = opensClicksData.slice(-parseInt(reportRange));
  const totalSent = sentCampaigns.reduce((a, c) => a + c.recipients, 0);
  const avgOpen = sentCampaigns.length
    ? (sentCampaigns.reduce((a, c) => a + c.openRate, 0) / sentCampaigns.length).toFixed(1)
    : "0";
  const avgClick = sentCampaigns.length
    ? (sentCampaigns.reduce((a, c) => a + c.clickRate, 0) / sentCampaigns.length).toFixed(1)
    : "0";

  const stats = [
    { label: "Emails Sent", value: totalSent.toLocaleString(), icon: Send },
    { label: "Delivered", value: "98.2%", icon: CheckCircle },
    { label: "Open Rate", value: `${avgOpen}%`, icon: Eye },
    { label: "Click Rate", value: `${avgClick}%`, icon: MousePointer },
    { label: "Bounce Rate", value: "1.8%", icon: AlertTriangle },
    { label: "Unsubscribe", value: "0.3%", icon: UserMinus },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const topLinks = [
    { url: "example.com/products/new-arrivals", clicks: 342, unique: 298, rate: 7.2 },
    { url: "example.com/sale/black-friday", clicks: 287, unique: 241, rate: 5.8 },
    { url: "example.com/blog/year-review", clicks: 156, unique: 134, rate: 3.1 },
    { url: "example.com/pricing", clicks: 98, unique: 87, rate: 2.1 },
  ];

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl animate-pulse">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-4 h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl h-64" />
          <div className="glass-card rounded-2xl h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Date range */}
      <div className="flex items-center gap-2">
        {[
          { v: "7", l: "7 days" },
          { v: "14", l: "14 days" },
          { v: "30", l: "30 days" },
        ].map((r) => (
          <button
            key={r.v}
            onClick={() => setReportRange(r.v)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              reportRange === r.v
                ? "gradient-bg text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.l}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card rounded-2xl p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <s.icon className="w-4 h-4 text-brand-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          className="glass-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-foreground mb-4">
            Opens & Clicks
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={daysData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                interval={Math.floor(daysData.length / 6)}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="opens" stroke="#6366f1" strokeWidth={2} dot={false} name="Opens" />
              <Line type="monotone" dataKey="clicks" stroke="#06b6d4" strokeWidth={2} dot={false} name="Clicks" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Heatmap */}
        <motion.div
          className="glass-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-foreground mb-4">
            Activity Heatmap
          </h3>
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-1 pt-5">
              {days.map((d) => (
                <div key={d} className="h-4 text-xs text-muted-foreground flex items-center">
                  {d}
                </div>
              ))}
            </div>
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-0.5 mb-1">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="w-4 text-center text-[10px] text-muted-foreground shrink-0">
                    {h % 6 === 0 ? `${h}h` : ""}
                  </div>
                ))}
              </div>
              {heatmapData.map((row, dayIdx) => (
                <div key={dayIdx} className="flex gap-0.5 mb-0.5">
                  {row.map((val, hourIdx) => (
                    <div
                      key={hourIdx}
                      className="w-4 h-4 rounded-sm shrink-0"
                      style={{ backgroundColor: `rgba(99, 102, 241, ${val})` }}
                      title={`${days[dayIdx]} ${hourIdx}:00 — ${Math.round(val * 100)}% activity`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Campaigns */}
      <motion.div
        className="glass-card rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">
            Top Performing Campaigns
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Campaign</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Sent</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Open %</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Click %</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground w-40">Score</th>
              </tr>
            </thead>
            <tbody>
              {[...sentCampaigns]
                .sort((a, b) => b.openRate - a.openRate)
                .slice(0, 5)
                .map((c) => {
                  const score = Math.min(100, Math.round(c.openRate * 2 + c.clickRate * 5));
                  return (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                      <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                        {c.recipients.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{c.openRate}%</td>
                      <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{c.clickRate}%</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full gradient-bg rounded-full" style={{ width: `${score}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">{score}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Top Links */}
      <motion.div
        className="glass-card rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">Top Clicked Links</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">URL</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Clicks</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Unique</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground w-40">Rate</th>
              </tr>
            </thead>
            <tbody>
              {topLinks.map((l, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="px-5 py-3 text-brand-400 font-mono text-xs">{l.url}</td>
                  <td className="px-5 py-3 text-muted-foreground">{l.clicks}</td>
                  <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{l.unique}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${l.rate * 10}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-10">{l.rate}%</span>
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
