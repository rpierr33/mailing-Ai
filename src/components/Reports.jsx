import { Send, CheckCircle, Eye, MousePointer, AlertTriangle, UserMinus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ACTION } from '../utils/reducer';

export default function Reports({ state, dispatch }) {
  const { chartData, reportRange, campaigns } = state;
  const sentCampaigns = campaigns.filter(c => c.status === 'Sent');

  const daysData = chartData.opensClicks.slice(-parseInt(reportRange));

  const totalSent = sentCampaigns.reduce((a, c) => a + c.recipients, 0);
  const avgOpen = sentCampaigns.length ? (sentCampaigns.reduce((a, c) => a + c.openRate, 0) / sentCampaigns.length).toFixed(1) : 0;
  const avgClick = sentCampaigns.length ? (sentCampaigns.reduce((a, c) => a + c.clickRate, 0) / sentCampaigns.length).toFixed(1) : 0;

  const stats = [
    { label: 'Emails Sent', value: totalSent.toLocaleString(), icon: Send },
    { label: 'Delivered', value: '98.2%', icon: CheckCircle },
    { label: 'Open Rate', value: `${avgOpen}%`, icon: Eye },
    { label: 'Click Rate', value: `${avgClick}%`, icon: MousePointer },
    { label: 'Bounce Rate', value: '1.8%', icon: AlertTriangle },
    { label: 'Unsubscribe', value: '0.3%', icon: UserMinus },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const topLinks = [
    { url: 'example.com/products/new-arrivals', clicks: 342, unique: 298, rate: 7.2 },
    { url: 'example.com/sale/black-friday', clicks: 287, unique: 241, rate: 5.8 },
    { url: 'example.com/blog/year-review', clicks: 156, unique: 134, rate: 3.1 },
    { url: 'example.com/pricing', clicks: 98, unique: 87, rate: 2.1 },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Date range */}
      <div className="flex items-center gap-2">
        {[{ v: '7', l: '7 days' }, { v: '14', l: '14 days' }, { v: '30', l: '30 days' }].map(r => (
          <button
            key={r.v}
            onClick={() => dispatch({ type: ACTION.SET_REPORT_RANGE, payload: r.v })}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              reportRange === r.v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {r.l}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <s.icon className="w-4 h-4 text-gray-400 mx-auto mb-2" />
            <p className="text-lg font-semibold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Opens & Clicks over time */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Opens & Clicks</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={daysData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} interval={Math.floor(daysData.length / 6)} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Line type="monotone" dataKey="opens" stroke="#facc15" strokeWidth={2} dot={false} name="Opens" />
              <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} dot={false} name="Clicks" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Heatmap */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Activity Heatmap</h3>
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-1 pt-5">
              {days.map(d => (
                <div key={d} className="h-4 text-xs text-gray-400 flex items-center">{d}</div>
              ))}
            </div>
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-0.5 mb-1">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="w-4 text-center text-xs text-gray-400 shrink-0">{h % 6 === 0 ? `${h}h` : ''}</div>
                ))}
              </div>
              {chartData.heatmap.map((row, dayIdx) => (
                <div key={dayIdx} className="flex gap-0.5 mb-0.5">
                  {row.map((val, hourIdx) => (
                    <div
                      key={hourIdx}
                      className="w-4 h-4 rounded-sm shrink-0"
                      style={{ backgroundColor: `rgba(250, 204, 21, ${val})` }}
                      title={`${days[dayIdx]} ${hourIdx}:00 — ${Math.round(val * 100)}% activity`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Campaigns */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-medium text-gray-900">Top Performing Campaigns</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Campaign</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Sent</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Open %</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Click %</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500 w-40">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sentCampaigns.sort((a, b) => b.openRate - a.openRate).slice(0, 5).map(c => {
              const score = Math.min(100, Math.round(c.openRate * 2 + c.clickRate * 5));
              return (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-5 py-3 text-gray-500">{c.recipients.toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-500">{c.openRate}%</td>
                  <td className="px-5 py-3 text-gray-500">{c.clickRate}%</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{score}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Top Links */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-medium text-gray-900">Top Clicked Links</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">URL</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Clicks</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Unique</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500 w-40">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topLinks.map((l, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="px-5 py-3 text-blue-600 font-mono text-xs">{l.url}</td>
                <td className="px-5 py-3 text-gray-500">{l.clicks}</td>
                <td className="px-5 py-3 text-gray-500">{l.unique}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${l.rate * 10}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-10">{l.rate}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
