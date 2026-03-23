import { Users, Send, Eye, MousePointer, TrendingUp, TrendingDown, Plus, Upload, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ACTION } from '../utils/reducer';
import { formatDate, getStatusColor } from '../utils/helpers';

export default function Dashboard({ state, dispatch }) {
  const { campaigns, contacts, chartData } = state;
  const sentCampaigns = campaigns.filter(c => c.status === 'Sent');
  const avgOpen = sentCampaigns.length ? (sentCampaigns.reduce((a, c) => a + c.openRate, 0) / sentCampaigns.length).toFixed(1) : 0;
  const avgClick = sentCampaigns.length ? (sentCampaigns.reduce((a, c) => a + c.clickRate, 0) / sentCampaigns.length).toFixed(1) : 0;

  const stats = [
    { label: 'Total Contacts', value: contacts.length.toLocaleString(), change: '+12.3%', up: true, icon: Users },
    { label: 'Campaigns Sent', value: sentCampaigns.length, change: '+4.1%', up: true, icon: Send },
    { label: 'Avg Open Rate', value: `${avgOpen}%`, change: '+2.8%', up: true, icon: Eye },
    { label: 'Avg Click Rate', value: `${avgClick}%`, change: '-0.4%', up: false, icon: MousePointer },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{s.label}</span>
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                <s.icon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {s.change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Audience Growth Chart */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Audience Growth</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData.audienceGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
            <Line type="monotone" dataKey="subscribers" stroke="#facc15" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="unsubscribes" stroke="#f87171" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-medium text-gray-900">Recent Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Name</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Opens</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Clicks</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.slice(0, 5).map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{c.openRate}%</td>
                  <td className="px-5 py-3 text-gray-500">{c.clickRate}%</td>
                  <td className="px-5 py-3 text-gray-400">{formatDate(c.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            dispatch({ type: ACTION.SET_VIEW, payload: 'campaigns' });
            setTimeout(() => dispatch({ type: ACTION.SET_MODAL, payload: 'createCampaign' }), 100);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
        <button
          onClick={() => dispatch({ type: ACTION.SET_VIEW, payload: 'audience' })}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Import Contacts
        </button>
        <button
          onClick={() => dispatch({ type: ACTION.SET_VIEW, payload: 'reports' })}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <BarChart3 className="w-4 h-4" /> View Reports
        </button>
      </div>
    </div>
  );
}
