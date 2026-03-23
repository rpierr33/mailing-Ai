import { useState } from 'react';
import { Plus, Search, Copy, Trash2, Eye, MoreHorizontal, Sparkles, ChevronRight, ChevronLeft, Mail, Beaker, Zap, MessageSquare, Check, Calendar, Clock, Send } from 'lucide-react';
import { ACTION } from '../utils/reducer';
import { formatDate, getStatusColor, getTypeBadge, callClaude, parseAIResponse } from '../utils/helpers';

export default function Campaigns({ state, dispatch }) {
  const { campaigns, filters, selectedIds, currentModal } = state;

  const filtered = campaigns.filter(c => {
    if (filters.status !== 'all' && c.status !== filters.status) return false;
    if (filters.type !== 'all' && c.type !== filters.type) return false;
    if (filters.search && !c.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id) => {
    dispatch({ type: ACTION.SET_SELECTED_IDS, payload: selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id] });
  };

  const toggleAll = () => {
    dispatch({ type: ACTION.SET_SELECTED_IDS, payload: selectedIds.length === filtered.length ? [] : filtered.map(c => c.id) });
  };

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={filters.search}
              onChange={e => dispatch({ type: ACTION.SET_FILTERS, payload: { search: e.target.value } })}
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          <select
            value={filters.status}
            onChange={e => dispatch({ type: ACTION.SET_FILTERS, payload: { status: e.target.value } })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Sent">Sent</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Draft">Draft</option>
            <option value="Paused">Paused</option>
          </select>
          <select
            value={filters.type}
            onChange={e => dispatch({ type: ACTION.SET_FILTERS, payload: { type: e.target.value } })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="Regular">Regular</option>
            <option value="A/B Test">A/B Test</option>
            <option value="Automated">Automated</option>
          </select>
        </div>
        <button
          onClick={() => dispatch({ type: ACTION.SET_MODAL, payload: 'createCampaign' })}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm animate-slide-up">
          <span className="font-medium">{selectedIds.length} selected</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => { dispatch({ type: ACTION.BULK_DELETE }); dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: `${selectedIds.length} campaigns deleted` } }); }}
              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 cursor-pointer text-xs font-medium">Delete</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="w-10 px-4 py-2.5"><input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded cursor-pointer" /></th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Recipients</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Opens</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Clicks</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Date</th>
              <th className="w-20 px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded cursor-pointer" /></td>
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(c.type)}`}>{c.type}</span></td>
                <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>{c.status}</span></td>
                <td className="px-4 py-3 text-gray-500">{c.recipients.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{c.openRate}%</td>
                <td className="px-4 py-3 text-gray-500">{c.clickRate}%</td>
                <td className="px-4 py-3 text-gray-400">{formatDate(c.date)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => dispatch({ type: ACTION.DUPLICATE_CAMPAIGN, payload: c.id })} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer" title="Duplicate">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => {
                      dispatch({ type: ACTION.SET_CONFIRM, payload: {
                        title: 'Delete Campaign',
                        message: `Are you sure you want to delete "${c.name}"?`,
                        confirmText: 'Delete',
                        onConfirm: () => {
                          dispatch({ type: ACTION.DELETE_CAMPAIGN, payload: c.id });
                          dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: 'Campaign deleted' } });
                        }
                      }});
                    }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer" title="Delete">
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
            <Send className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400">No campaigns found</p>
            <button onClick={() => dispatch({ type: ACTION.SET_MODAL, payload: 'createCampaign' })} className="mt-3 text-sm text-yellow-600 hover:text-yellow-700 font-medium cursor-pointer">
              Create your first campaign →
            </button>
          </div>
        )}
      </div>

      {/* Create Campaign Wizard Modal */}
      {currentModal === 'createCampaign' && <CampaignWizard state={state} dispatch={dispatch} />}
    </div>
  );
}

function CampaignWizard({ state, dispatch }) {
  const { wizardStep, wizardData, aiLoading, aiResults } = state;
  const steps = ['Type', 'Audience', 'Content', 'Template', 'Review'];

  const canNext = () => {
    switch (wizardStep) {
      case 1: return !!wizardData.type;
      case 2: return !!wizardData.audience;
      case 3: return !!wizardData.subject;
      case 4: return !!wizardData.templateId;
      case 5: return true;
      default: return false;
    }
  };

  const handleSend = () => {
    dispatch({ type: ACTION.ADD_CAMPAIGN, payload: wizardData });
    dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: wizardData.scheduleType === 'schedule' ? 'Campaign scheduled!' : 'Campaign sent!' } });
  };

  const generateSubjects = async () => {
    dispatch({ type: ACTION.SET_AI_LOADING, payload: true });
    try {
      const result = await callClaude(
        `Generate 5 email subject lines for a campaign about "${wizardData.subject || 'our product'}". Format as a JSON array of strings, nothing else.`,
        state.apiKey
      );
      dispatch({ type: ACTION.SET_AI_RESULTS, payload: parseAIResponse(result) });
    } catch {
      dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'error', message: 'AI unavailable, try again' } });
    }
    dispatch({ type: ACTION.SET_AI_LOADING, payload: false });
  };

  const campaignTypes = [
    { id: 'Regular', label: 'Regular', desc: 'Standard email campaign', icon: Mail },
    { id: 'A/B Test', label: 'A/B Test', desc: 'Test different variations', icon: Beaker },
    { id: 'Automated', label: 'Automated', desc: 'Trigger-based emails', icon: Zap },
    { id: 'SMS', label: 'SMS', desc: 'Text message campaign', icon: MessageSquare },
  ];

  const audiences = ['All Subscribers', 'Newsletter', 'Customers', 'VIP', 'New Subscribers', 'Inactive 90d'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => dispatch({ type: ACTION.SET_MODAL, payload: null })}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Steps indicator */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">New Campaign</h2>
            <button onClick={() => dispatch({ type: ACTION.SET_MODAL, payload: null })} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">×</button>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i + 1 < wizardStep ? 'bg-yellow-400 text-gray-900' :
                  i + 1 === wizardStep ? 'bg-gray-900 text-white' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i + 1 < wizardStep ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i + 1 === wizardStep ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{s}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-px ${i + 1 < wizardStep ? 'bg-yellow-400' : 'bg-gray-100'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {wizardStep === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {campaignTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { type: t.id } })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    wizardData.type === t.id ? 'border-yellow-400 bg-yellow-50 ring-1 ring-yellow-400' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <t.icon className={`w-5 h-5 mb-2 ${wizardData.type === t.id ? 'text-yellow-600' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium text-gray-900">{t.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">Select your target audience</p>
              {audiences.map(a => (
                <button
                  key={a}
                  onClick={() => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { audience: a } })}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    wizardData.audience === a ? 'border-yellow-400 bg-yellow-50 ring-1 ring-yellow-400' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900">{a}</span>
                  <span className="text-xs text-gray-400">{Math.floor(Math.random() * 2000 + 500)} contacts</span>
                </button>
              ))}
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">From Name</label>
                <input
                  type="text"
                  value={wizardData.fromName}
                  onChange={e => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { fromName: e.target.value } })}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">From Email</label>
                <input
                  type="email"
                  value={wizardData.fromEmail}
                  onChange={e => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { fromEmail: e.target.value } })}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-500">Subject Line</label>
                  <span className="text-xs text-gray-400">{wizardData.subject.length}/100</span>
                </div>
                <input
                  type="text"
                  value={wizardData.subject}
                  onChange={e => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { subject: e.target.value } })}
                  placeholder="Enter your subject line"
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                <button
                  onClick={generateSubjects}
                  disabled={aiLoading}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {aiLoading ? 'Generating...' : 'Generate with AI'}
                </button>
                {aiResults.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {aiResults.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { subject: r } });
                          dispatch({ type: ACTION.SET_AI_RESULTS, payload: [] });
                        }}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer border border-gray-100 hover:border-yellow-200"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Preview Text</label>
                <input
                  type="text"
                  value={wizardData.previewText}
                  onChange={e => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { previewText: e.target.value } })}
                  placeholder="Brief preview text..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="grid grid-cols-3 gap-3">
              {state.templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { templateId: t.id } })}
                  className={`rounded-xl border overflow-hidden transition-all cursor-pointer ${
                    wizardData.templateId === t.id ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`h-24 ${t.color} opacity-80`} />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {wizardStep === 5 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900">{wizardData.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Audience</span>
                  <span className="font-medium text-gray-900">{wizardData.audience}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subject</span>
                  <span className="font-medium text-gray-900">{wizardData.subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Template</span>
                  <span className="font-medium text-gray-900">{state.templates.find(t => t.id === wizardData.templateId)?.name || '—'}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">When to send</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { scheduleType: 'now' } })}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      wizardData.scheduleType === 'now' ? 'border-yellow-400 bg-yellow-50 text-gray-900' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    <Send className="w-4 h-4 mx-auto mb-1" /> Send Now
                  </button>
                  <button
                    onClick={() => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { scheduleType: 'schedule' } })}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      wizardData.scheduleType === 'schedule' ? 'border-yellow-400 bg-yellow-50 text-gray-900' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mx-auto mb-1" /> Schedule
                  </button>
                </div>
                {wizardData.scheduleType === 'schedule' && (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="date"
                      value={wizardData.scheduleDate}
                      onChange={e => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { scheduleDate: e.target.value } })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <input
                      type="time"
                      value={wizardData.scheduleTime}
                      onChange={e => dispatch({ type: ACTION.UPDATE_WIZARD_DATA, payload: { scheduleTime: e.target.value } })}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => wizardStep > 1 ? dispatch({ type: ACTION.SET_WIZARD_STEP, payload: wizardStep - 1 }) : dispatch({ type: ACTION.SET_MODAL, payload: null })}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> {wizardStep > 1 ? 'Back' : 'Cancel'}
          </button>
          {wizardStep < 5 ? (
            <button
              onClick={() => dispatch({ type: ACTION.SET_WIZARD_STEP, payload: wizardStep + 1 })}
              disabled={!canNext()}
              className="flex items-center gap-1 px-5 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="flex items-center gap-1 px-5 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" /> {wizardData.scheduleType === 'schedule' ? 'Schedule' : 'Send Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
