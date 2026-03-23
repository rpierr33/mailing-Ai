import { CONTACTS, CAMPAIGNS, AUTOMATIONS, TEMPLATES, SEGMENTS, CHART_DATA } from '../data/mockData';

export const initialState = {
  currentView: 'dashboard',
  currentModal: null,
  currentSlideOver: null,
  wizardStep: 1,
  contacts: CONTACTS,
  campaigns: CAMPAIGNS,
  automations: AUTOMATIONS,
  templates: TEMPLATES,
  segments: SEGMENTS,
  chartData: CHART_DATA,
  selectedIds: [],
  filters: { status: 'all', type: 'all', search: '' },
  notifications: [],
  aiLoading: false,
  aiResults: [],
  apiKey: '',
  // Campaign wizard state
  wizardData: {
    type: '',
    audience: '',
    fromName: '',
    fromEmail: '',
    subject: '',
    previewText: '',
    templateId: null,
    scheduleType: 'now',
    scheduleDate: '',
    scheduleTime: '',
  },
  // Template builder
  templateBuilder: {
    name: 'Untitled Template',
    blocks: [],
    selectedBlockId: null,
    previewMode: 'desktop',
  },
  // Audience tab
  audienceTab: 'contacts',
  // Settings tab
  settingsTab: 'account',
  // Reports date range
  reportRange: '30',
  // Segment builder
  segmentBuilder: {
    name: '',
    conditions: [{ field: 'Email', operator: 'contains', value: '' }],
  },
  // Automation editor
  editingAutomation: null,
  // Confirm dialog
  confirmDialog: null,
};

export const ACTION = {
  SET_VIEW: 'SET_VIEW',
  SET_MODAL: 'SET_MODAL',
  SET_SLIDE_OVER: 'SET_SLIDE_OVER',
  SET_WIZARD_STEP: 'SET_WIZARD_STEP',
  UPDATE_WIZARD_DATA: 'UPDATE_WIZARD_DATA',
  RESET_WIZARD: 'RESET_WIZARD',
  ADD_CONTACT: 'ADD_CONTACT',
  DELETE_CONTACT: 'DELETE_CONTACT',
  UPDATE_CONTACT: 'UPDATE_CONTACT',
  ADD_CAMPAIGN: 'ADD_CAMPAIGN',
  DELETE_CAMPAIGN: 'DELETE_CAMPAIGN',
  DUPLICATE_CAMPAIGN: 'DUPLICATE_CAMPAIGN',
  UPDATE_CAMPAIGN_STATUS: 'UPDATE_CAMPAIGN_STATUS',
  SET_SELECTED_IDS: 'SET_SELECTED_IDS',
  SET_FILTERS: 'SET_FILTERS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_AI_LOADING: 'SET_AI_LOADING',
  SET_AI_RESULTS: 'SET_AI_RESULTS',
  SET_API_KEY: 'SET_API_KEY',
  SET_AUDIENCE_TAB: 'SET_AUDIENCE_TAB',
  SET_SETTINGS_TAB: 'SET_SETTINGS_TAB',
  SET_REPORT_RANGE: 'SET_REPORT_RANGE',
  // Template builder
  SET_TEMPLATE_NAME: 'SET_TEMPLATE_NAME',
  ADD_BLOCK: 'ADD_BLOCK',
  SELECT_BLOCK: 'SELECT_BLOCK',
  UPDATE_BLOCK: 'UPDATE_BLOCK',
  DELETE_BLOCK: 'DELETE_BLOCK',
  MOVE_BLOCK: 'MOVE_BLOCK',
  SET_PREVIEW_MODE: 'SET_PREVIEW_MODE',
  // Segments
  ADD_SEGMENT: 'ADD_SEGMENT',
  DELETE_SEGMENT: 'DELETE_SEGMENT',
  UPDATE_SEGMENT_BUILDER: 'UPDATE_SEGMENT_BUILDER',
  RESET_SEGMENT_BUILDER: 'RESET_SEGMENT_BUILDER',
  // Tags
  ADD_TAG: 'ADD_TAG',
  REMOVE_TAG: 'REMOVE_TAG',
  // Automations
  SET_EDITING_AUTOMATION: 'SET_EDITING_AUTOMATION',
  TOGGLE_AUTOMATION_STATUS: 'TOGGLE_AUTOMATION_STATUS',
  ADD_AUTOMATION_NODE: 'ADD_AUTOMATION_NODE',
  // Confirm
  SET_CONFIRM: 'SET_CONFIRM',
  BULK_DELETE: 'BULK_DELETE',
};

let nextId = 100;
let notifId = 1;

export function reducer(state, action) {
  switch (action.type) {
    case ACTION.SET_VIEW:
      return { ...state, currentView: action.payload, currentModal: null, currentSlideOver: null, selectedIds: [], editingAutomation: null };
    case ACTION.SET_MODAL:
      return { ...state, currentModal: action.payload, wizardStep: 1, wizardData: initialState.wizardData, aiResults: [] };
    case ACTION.SET_SLIDE_OVER:
      return { ...state, currentSlideOver: action.payload };
    case ACTION.SET_WIZARD_STEP:
      return { ...state, wizardStep: action.payload };
    case ACTION.UPDATE_WIZARD_DATA:
      return { ...state, wizardData: { ...state.wizardData, ...action.payload } };
    case ACTION.RESET_WIZARD:
      return { ...state, wizardStep: 1, wizardData: initialState.wizardData, currentModal: null };
    case ACTION.ADD_CONTACT:
      return { ...state, contacts: [...state.contacts, { ...action.payload, id: ++nextId }] };
    case ACTION.DELETE_CONTACT:
      return { ...state, contacts: state.contacts.filter(c => c.id !== action.payload) };
    case ACTION.UPDATE_CONTACT:
      return { ...state, contacts: state.contacts.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case ACTION.ADD_CAMPAIGN: {
      const newCampaign = {
        id: ++nextId,
        name: action.payload.subject?.slice(0, 30) || 'New Campaign',
        subject: action.payload.subject || '',
        type: action.payload.type || 'Regular',
        status: action.payload.scheduleType === 'schedule' ? 'Scheduled' : 'Sent',
        recipients: Math.floor(Math.random() * 2000) + 500,
        openRate: 0,
        clickRate: 0,
        date: new Date().toISOString().split('T')[0],
        audience: action.payload.audience || 'All Subscribers',
      };
      return { ...state, campaigns: [newCampaign, ...state.campaigns], currentModal: null, wizardStep: 1, wizardData: initialState.wizardData };
    }
    case ACTION.DELETE_CAMPAIGN:
      return { ...state, campaigns: state.campaigns.filter(c => c.id !== action.payload), confirmDialog: null };
    case ACTION.DUPLICATE_CAMPAIGN: {
      const orig = state.campaigns.find(c => c.id === action.payload);
      if (!orig) return state;
      return { ...state, campaigns: [{ ...orig, id: ++nextId, name: `${orig.name} (Copy)`, status: 'Draft', openRate: 0, clickRate: 0 }, ...state.campaigns] };
    }
    case ACTION.UPDATE_CAMPAIGN_STATUS:
      return { ...state, campaigns: state.campaigns.map(c => c.id === action.payload.id ? { ...c, status: action.payload.status } : c) };
    case ACTION.SET_SELECTED_IDS:
      return { ...state, selectedIds: action.payload };
    case ACTION.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ACTION.ADD_NOTIFICATION:
      return { ...state, notifications: [...state.notifications, { id: notifId++, ...action.payload }] };
    case ACTION.REMOVE_NOTIFICATION:
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case ACTION.SET_AI_LOADING:
      return { ...state, aiLoading: action.payload };
    case ACTION.SET_AI_RESULTS:
      return { ...state, aiResults: action.payload };
    case ACTION.SET_API_KEY:
      return { ...state, apiKey: action.payload };
    case ACTION.SET_AUDIENCE_TAB:
      return { ...state, audienceTab: action.payload };
    case ACTION.SET_SETTINGS_TAB:
      return { ...state, settingsTab: action.payload };
    case ACTION.SET_REPORT_RANGE:
      return { ...state, reportRange: action.payload };
    case ACTION.SET_TEMPLATE_NAME:
      return { ...state, templateBuilder: { ...state.templateBuilder, name: action.payload } };
    case ACTION.ADD_BLOCK:
      return { ...state, templateBuilder: { ...state.templateBuilder, blocks: [...state.templateBuilder.blocks, { id: ++nextId, ...action.payload }], selectedBlockId: nextId } };
    case ACTION.SELECT_BLOCK:
      return { ...state, templateBuilder: { ...state.templateBuilder, selectedBlockId: action.payload } };
    case ACTION.UPDATE_BLOCK:
      return { ...state, templateBuilder: { ...state.templateBuilder, blocks: state.templateBuilder.blocks.map(b => b.id === action.payload.id ? { ...b, ...action.payload } : b) } };
    case ACTION.DELETE_BLOCK:
      return { ...state, templateBuilder: { ...state.templateBuilder, blocks: state.templateBuilder.blocks.filter(b => b.id !== action.payload), selectedBlockId: null } };
    case ACTION.MOVE_BLOCK: {
      const { index, direction } = action.payload;
      const blocks = [...state.templateBuilder.blocks];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= blocks.length) return state;
      [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
      return { ...state, templateBuilder: { ...state.templateBuilder, blocks } };
    }
    case ACTION.SET_PREVIEW_MODE:
      return { ...state, templateBuilder: { ...state.templateBuilder, previewMode: action.payload } };
    case ACTION.ADD_SEGMENT:
      return { ...state, segments: [...state.segments, { id: ++nextId, ...action.payload }] };
    case ACTION.DELETE_SEGMENT:
      return { ...state, segments: state.segments.filter(s => s.id !== action.payload), confirmDialog: null };
    case ACTION.UPDATE_SEGMENT_BUILDER:
      return { ...state, segmentBuilder: { ...state.segmentBuilder, ...action.payload } };
    case ACTION.RESET_SEGMENT_BUILDER:
      return { ...state, segmentBuilder: initialState.segmentBuilder };
    case ACTION.ADD_TAG: {
      const { contactId, tag } = action.payload;
      return { ...state, contacts: state.contacts.map(c => c.id === contactId && !c.tags.includes(tag) ? { ...c, tags: [...c.tags, tag] } : c) };
    }
    case ACTION.REMOVE_TAG: {
      const { contactId: cId, tag: t } = action.payload;
      return { ...state, contacts: state.contacts.map(c => c.id === cId ? { ...c, tags: c.tags.filter(tg => tg !== t) } : c) };
    }
    case ACTION.SET_EDITING_AUTOMATION:
      return { ...state, editingAutomation: action.payload };
    case ACTION.TOGGLE_AUTOMATION_STATUS:
      return { ...state, automations: state.automations.map(a => a.id === action.payload ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a) };
    case ACTION.ADD_AUTOMATION_NODE: {
      const { automationId, node, afterIndex } = action.payload;
      return {
        ...state,
        automations: state.automations.map(a => {
          if (a.id !== automationId) return a;
          const nodes = [...a.nodes];
          nodes.splice(afterIndex + 1, 0, { ...node, id: `n${++nextId}`, x: 250, y: (afterIndex + 1) * 100 + 40 });
          return { ...a, nodes: nodes.map((n, i) => ({ ...n, y: i * 100 + 40 })) };
        })
      };
    }
    case ACTION.SET_CONFIRM:
      return { ...state, confirmDialog: action.payload };
    case ACTION.BULK_DELETE: {
      const ids = state.selectedIds;
      return {
        ...state,
        campaigns: state.campaigns.filter(c => !ids.includes(c.id)),
        contacts: state.contacts.filter(c => !ids.includes(c.id)),
        selectedIds: [],
      };
    }
    default:
      return state;
  }
}
