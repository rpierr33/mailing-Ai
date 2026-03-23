import { useState } from 'react';
import { Key, Copy, Trash2, Check, ExternalLink, Sparkles } from 'lucide-react';
import { ACTION } from '../utils/reducer';

const TABS = ['account', 'billing', 'integrations', 'api'];

export default function Settings({ state, dispatch }) {
  const { settingsTab } = state;

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => dispatch({ type: ACTION.SET_SETTINGS_TAB, payload: tab })}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer capitalize ${
              settingsTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'api' ? 'AI & API' : tab}
          </button>
        ))}
      </div>

      {settingsTab === 'account' && <AccountTab dispatch={dispatch} />}
      {settingsTab === 'billing' && <BillingTab />}
      {settingsTab === 'integrations' && <IntegrationsTab />}
      {settingsTab === 'api' && <APITab state={state} dispatch={dispatch} />}
    </div>
  );
}

function AccountTab({ dispatch }) {
  const [form, setForm] = useState({
    orgName: 'MailFlow',
    industry: 'Technology',
    timezone: 'America/New_York',
    website: '',
    fromName: 'Ralph',
    fromEmail: 'hello@company.com',
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Account Settings</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Organization Name</label>
          <input value={form.orgName} onChange={e => setForm(f => ({ ...f, orgName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Industry</label>
          <select value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer">
            {['Technology', 'E-commerce', 'SaaS', 'Agency', 'Education', 'Non-profit', 'Other'].map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Default From Name</label>
          <input value={form.fromName} onChange={e => setForm(f => ({ ...f, fromName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Default From Email</label>
          <input value={form.fromEmail} onChange={e => setForm(f => ({ ...f, fromEmail: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
          <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Timezone</label>
          <select value={form.timezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer">
            {['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'UTC'].map(tz => <option key={tz}>{tz}</option>)}
          </select>
        </div>
      </div>
      <button onClick={() => dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: 'Settings saved' } })}
        className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 cursor-pointer">
        Save Changes
      </button>
    </div>
  );
}

function BillingTab() {
  const invoices = [
    { date: 'Dec 1, 2024', amount: '$0.00', status: 'Paid' },
    { date: 'Nov 1, 2024', amount: '$0.00', status: 'Paid' },
    { date: 'Oct 1, 2024', amount: '$0.00', status: 'Paid' },
  ];

  return (
    <div className="space-y-4">
      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Free Plan</h3>
            <p className="text-2xl font-semibold text-gray-900 mt-1">$0<span className="text-sm text-gray-400 font-normal">/month</span></p>
            <ul className="mt-3 space-y-1 text-sm text-gray-500">
              <li>500 contacts</li>
              <li>1,000 emails/month</li>
              <li>Basic templates</li>
              <li>Email support</li>
            </ul>
          </div>
          <button className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 cursor-pointer">
            Upgrade
          </button>
        </div>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Usage</h3>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Contacts</span>
            <span className="text-gray-700 font-medium">12 / 500</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full" style={{ width: '2.4%' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Monthly sends</span>
            <span className="text-gray-700 font-medium">156 / 1,000</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full" style={{ width: '15.6%' }} />
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-medium text-gray-900">Invoice History</h3>
        </div>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-50">
            {invoices.map((inv, i) => (
              <tr key={i}>
                <td className="px-5 py-3 text-gray-900">{inv.date}</td>
                <td className="px-5 py-3 text-gray-500">{inv.amount}</td>
                <td className="px-5 py-3"><span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{inv.status}</span></td>
                <td className="px-5 py-3 text-right"><button className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [connected, setConnected] = useState({ 'Google Analytics': true, 'Zapier': true });
  const integrations = [
    { name: 'Shopify', desc: 'Sync customers and orders', emoji: '🛍️' },
    { name: 'WooCommerce', desc: 'WordPress e-commerce sync', emoji: '🛒' },
    { name: 'Salesforce', desc: 'CRM contact sync', emoji: '☁️' },
    { name: 'Zapier', desc: 'Connect 5000+ apps', emoji: '⚡' },
    { name: 'WordPress', desc: 'Blog subscriber forms', emoji: '📝' },
    { name: 'Google Analytics', desc: 'Track email campaign traffic', emoji: '📊' },
    { name: 'Stripe', desc: 'Payment and revenue tracking', emoji: '💳' },
    { name: 'Facebook Ads', desc: 'Audience sync for ads', emoji: '📱' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {integrations.map(int => (
        <div key={int.name} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <span className="text-2xl">{int.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{int.name}</p>
            <p className="text-xs text-gray-400">{int.desc}</p>
          </div>
          {connected[int.name] ? (
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
              <Check className="w-3 h-3" /> Connected
            </span>
          ) : (
            <button
              onClick={() => setConnected(c => ({ ...c, [int.name]: true }))}
              className="px-3 py-1.5 border border-gray-200 text-xs font-medium text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Connect
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function APITab({ state, dispatch }) {
  const [keys] = useState([
    { name: 'Production', prefix: 'sk-prod-8f', created: 'Dec 1, 2024', lastUsed: 'Dec 10, 2024' },
    { name: 'Development', prefix: 'sk-dev-3a', created: 'Nov 15, 2024', lastUsed: 'Dec 8, 2024' },
  ]);
  const [copied, setCopied] = useState(null);

  return (
    <div className="space-y-4">
      {/* AI Config */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-medium text-gray-900">AI Configuration</h3>
        </div>
        <p className="text-xs text-gray-500">Add your Anthropic API key to enable AI-powered features like subject line generation and smart copywriting. Without a key, AI features use demo mode.</p>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Anthropic API Key</label>
          <input
            type="password"
            value={state.apiKey}
            onChange={e => dispatch({ type: ACTION.SET_API_KEY, payload: e.target.value })}
            placeholder="sk-ant-..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent font-mono"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${state.apiKey ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          <span className="text-xs text-gray-500">{state.apiKey ? 'API key configured — AI features active' : 'Demo mode — AI features use simulated responses'}</span>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">API Keys</h3>
          <button onClick={() => dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: 'New API key created' } })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-gray-900 text-xs font-medium rounded-lg hover:bg-yellow-500 cursor-pointer">
            <Key className="w-3.5 h-3.5" /> Create Key
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Name</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Key</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Created</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Last Used</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {keys.map((k, i) => (
              <tr key={i}>
                <td className="px-5 py-3 font-medium text-gray-900">{k.name}</td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{k.prefix}••••••••</td>
                <td className="px-5 py-3 text-gray-400">{k.created}</td>
                <td className="px-5 py-3 text-gray-400">{k.lastUsed}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setCopied(i); setTimeout(() => setCopied(null), 2000); }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      {copied === i ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
