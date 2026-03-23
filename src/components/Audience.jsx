import { useState } from 'react';
import { Plus, Search, Trash2, X, Tag, Star, Sparkles, Upload } from 'lucide-react';
import { ACTION } from '../utils/reducer';
import { getInitials, formatDate, callClaude, parseAIResponse } from '../utils/helpers';

export default function Audience({ state, dispatch }) {
  const { contacts, segments, audienceTab, currentSlideOver, filters } = state;
  const allTags = [...new Set(contacts.flatMap(c => c.tags))];

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {['contacts', 'segments', 'tags'].map(tab => (
          <button
            key={tab}
            onClick={() => dispatch({ type: ACTION.SET_AUDIENCE_TAB, payload: tab })}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer capitalize ${
              audienceTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {audienceTab === 'contacts' && <ContactsTab state={state} dispatch={dispatch} allTags={allTags} />}
      {audienceTab === 'segments' && <SegmentsTab state={state} dispatch={dispatch} />}
      {audienceTab === 'tags' && <TagsTab contacts={contacts} allTags={allTags} dispatch={dispatch} filters={filters} />}

      {/* Add Contact Slide-over */}
      {currentSlideOver === 'addContact' && <AddContactSlideOver dispatch={dispatch} allTags={allTags} />}
    </div>
  );
}

function ContactsTab({ state, dispatch, allTags }) {
  const { contacts, selectedIds, filters } = state;
  const [tagFilter, setTagFilter] = useState('');

  const filtered = contacts.filter(c => {
    if (filters.search && !`${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (tagFilter && !c.tags.includes(tagFilter)) return false;
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={filters.search}
              onChange={e => dispatch({ type: ACTION.SET_FILTERS, payload: { search: e.target.value } })}
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 cursor-pointer">
            <option value="">All Tags</option>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button
          onClick={() => dispatch({ type: ACTION.SET_SLIDE_OVER, payload: 'addContact' })}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm">
          <span className="font-medium">{selectedIds.length} selected</span>
          <button onClick={() => { dispatch({ type: ACTION.BULK_DELETE }); dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: 'Contacts deleted' } }); }}
            className="ml-auto px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 cursor-pointer text-xs font-medium">Delete</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="w-10 px-4 py-2.5">
                <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={() => dispatch({ type: ACTION.SET_SELECTED_IDS, payload: selectedIds.length === filtered.length ? [] : filtered.map(c => c.id) })}
                  className="rounded cursor-pointer" />
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Contact</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Tags</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Source</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Rating</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Subscribed</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selectedIds.includes(c.id)}
                    onChange={() => dispatch({ type: ACTION.SET_SELECTED_IDS, payload: selectedIds.includes(c.id) ? selectedIds.filter(i => i !== c.id) : [...selectedIds, c.id] })}
                    className="rounded cursor-pointer" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      {getInitials(c.firstName, c.lastName)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{c.source}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`w-3 h-3 ${n <= c.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(c.subscribed)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => {
                    dispatch({ type: ACTION.SET_CONFIRM, payload: {
                      title: 'Delete Contact',
                      message: `Remove ${c.firstName} ${c.lastName}?`,
                      onConfirm: () => {
                        dispatch({ type: ACTION.DELETE_CONTACT, payload: c.id });
                        dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: 'Contact deleted' } });
                      }
                    }});
                  }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SegmentsTab({ state, dispatch }) {
  const { segments, aiLoading } = state;

  const suggestSegments = async () => {
    dispatch({ type: ACTION.SET_AI_LOADING, payload: true });
    try {
      const result = await callClaude(
        'Suggest 3 useful email list segments for an e-commerce store. For each, give a name and the conditions in plain English. Format as JSON array with {name, description} objects, nothing else.',
        state.apiKey
      );
      dispatch({ type: ACTION.SET_AI_RESULTS, payload: parseAIResponse(result) });
    } catch {
      dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'error', message: 'AI unavailable, try again' } });
    }
    dispatch({ type: ACTION.SET_AI_LOADING, payload: false });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <button onClick={suggestSegments} disabled={aiLoading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer disabled:opacity-50">
          <Sparkles className="w-3.5 h-3.5" /> {aiLoading ? 'Thinking...' : 'Suggest with AI'}
        </button>
        <button onClick={() => dispatch({ type: ACTION.SET_SLIDE_OVER, payload: 'createSegment' })}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer">
          <Plus className="w-4 h-4" /> Create Segment
        </button>
      </div>

      {state.aiResults.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {state.aiResults.map((s, i) => (
            <button key={i} onClick={() => {
              dispatch({ type: ACTION.ADD_SEGMENT, payload: { name: s.name, conditions: s.description, count: Math.floor(Math.random() * 200 + 50), updated: new Date().toISOString().split('T')[0] } });
              dispatch({ type: ACTION.SET_AI_RESULTS, payload: [] });
              dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: `Segment "${s.name}" created` } });
            }} className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-left hover:bg-yellow-100 transition-all cursor-pointer">
              <Sparkles className="w-4 h-4 text-yellow-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">{s.name}</p>
              <p className="text-xs text-gray-500 mt-1">{s.description}</p>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {segments.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium text-gray-900">{s.name}</h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.count} contacts</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{s.conditions}</p>
            <p className="text-xs text-gray-400 mt-2">Updated {formatDate(s.updated)}</p>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => {
                dispatch({ type: ACTION.SET_CONFIRM, payload: {
                  title: 'Delete Segment',
                  message: `Delete "${s.name}"?`,
                  onConfirm: () => {
                    dispatch({ type: ACTION.DELETE_SEGMENT, payload: s.id });
                    dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: 'Segment deleted' } });
                  }
                }});
              }} className="text-xs text-red-500 hover:text-red-600 cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function TagsTab({ contacts, allTags, dispatch, filters }) {
  const [newTag, setNewTag] = useState('');
  const tagCounts = {};
  contacts.forEach(c => c.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="New tag name..."
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && newTag.trim()) {
              dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: `Tag "${newTag}" created` } });
              setNewTag('');
            }
          }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        />
        <button
          onClick={() => {
            if (newTag.trim()) {
              dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: `Tag "${newTag}" created` } });
              setNewTag('');
            }
          }}
          className="px-3 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map(t => (
          <button
            key={t}
            onClick={() => dispatch({ type: ACTION.SET_FILTERS, payload: { search: t } })}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:border-yellow-400 transition-colors cursor-pointer group"
          >
            <Tag className="w-3 h-3 text-gray-400" />
            <span className="text-gray-700">{t}</span>
            <span className="text-xs text-gray-400">{tagCounts[t]}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function AddContactSlideOver({ dispatch, allTags }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', tags: [], notes: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch({ type: ACTION.ADD_CONTACT, payload: { ...form, rating: 3, source: 'Manual', subscribed: new Date().toISOString().split('T')[0] } });
    dispatch({ type: ACTION.SET_SLIDE_OVER, payload: null });
    dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: 'Contact added' } });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={() => dispatch({ type: ACTION.SET_SLIDE_OVER, payload: null })}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col animate-slide-in" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add Contact</h2>
          <button onClick={() => dispatch({ type: ACTION.SET_SLIDE_OVER, payload: null })} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
              <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 ${errors.firstName ? 'border-red-300' : 'border-gray-200'}`} />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
              <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 ${errors.email ? 'border-red-300' : 'border-gray-200'}`} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter(x => x !== t) : [...f.tags, t] }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    form.tags.includes(t) ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
          <button onClick={() => dispatch({ type: ACTION.SET_SLIDE_OVER, payload: null })}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 cursor-pointer">Cancel</button>
          <button onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 cursor-pointer">Save Contact</button>
        </div>
      </div>
    </div>
  );
}
