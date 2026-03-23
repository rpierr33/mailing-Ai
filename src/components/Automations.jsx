import { Plus, Play, Pause, Zap, Mail, Clock, GitBranch, Tag as TagIcon } from 'lucide-react';
import { ACTION } from '../utils/reducer';
import { formatDate, getStatusColor } from '../utils/helpers';

const NODE_COLORS = {
  trigger: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-500', iconBg: 'bg-orange-100' },
  email: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', iconBg: 'bg-blue-100' },
  wait: { bg: 'bg-gray-50', border: 'border-gray-200', icon: 'text-gray-500', iconBg: 'bg-gray-100' },
  branch: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-500', iconBg: 'bg-purple-100' },
  action: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', iconBg: 'bg-emerald-100' },
};

const NODE_ICONS = {
  trigger: Zap,
  email: Mail,
  wait: Clock,
  branch: GitBranch,
  action: TagIcon,
};

export default function Automations({ state, dispatch }) {
  const { automations, editingAutomation } = state;

  if (editingAutomation) {
    const automation = automations.find(a => a.id === editingAutomation);
    if (automation) return <AutomationEditor automation={automation} dispatch={dispatch} />;
  }

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{automations.length} automations</p>
        <button
          onClick={() => {
            const newId = Date.now();
            dispatch({ type: ACTION.SET_EDITING_AUTOMATION, payload: newId });
            dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'info', message: 'Start building your automation' } });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Automation
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Name</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Trigger</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Status</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Enrolled</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Completed</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Last Triggered</th>
              <th className="w-32 px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {automations.map(a => (
              <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{a.name}</td>
                <td className="px-5 py-3 text-gray-500">{a.trigger}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(a.status)}`}>{a.status}</span>
                </td>
                <td className="px-5 py-3 text-gray-500">{a.enrolled.toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-500">{a.completed.toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-400">{formatDate(a.lastTriggered)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => dispatch({ type: ACTION.TOGGLE_AUTOMATION_STATUS, payload: a.id })}
                      className={`p-1.5 rounded-lg cursor-pointer ${a.status === 'Active' ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                      title={a.status === 'Active' ? 'Pause' : 'Activate'}
                    >
                      {a.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => dispatch({ type: ACTION.SET_EDITING_AUTOMATION, payload: a.id })}
                      className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      Edit
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

function AutomationEditor({ automation, dispatch }) {
  const nodes = automation.nodes || [];

  const addNode = (afterIndex) => {
    dispatch({
      type: ACTION.ADD_AUTOMATION_NODE,
      payload: {
        automationId: automation.id,
        afterIndex,
        node: { type: 'email', label: 'New Email', subject: 'Email subject', delay: '0' },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch({ type: ACTION.SET_EDITING_AUTOMATION, payload: null })}
            className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{automation.name}</h2>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(automation.status)}`}>{automation.status}</span>
        </div>
        <button
          onClick={() => {
            dispatch({ type: ACTION.TOGGLE_AUTOMATION_STATUS, payload: automation.id });
            dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: `Automation ${automation.status === 'Active' ? 'paused' : 'activated'}` } });
          }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${
            automation.status === 'Active'
              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          {automation.status === 'Active' ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Activate</>}
        </button>
      </div>

      {/* Flow canvas */}
      <div className="bg-white rounded-xl border border-gray-100 p-8 min-h-96">
        <div className="flex flex-col items-center gap-0">
          {nodes.map((node, i) => {
            const colors = NODE_COLORS[node.type] || NODE_COLORS.action;
            const Icon = NODE_ICONS[node.type] || Zap;

            return (
              <div key={node.id} className="flex flex-col items-center">
                {/* Connector line */}
                {i > 0 && <div className="w-px h-6 bg-gray-200" />}

                {/* Node */}
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors.bg} ${colors.border} min-w-56`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.iconBg}`}>
                    <Icon className={`w-4 h-4 ${colors.icon}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{node.label}</p>
                    {node.subject && <p className="text-xs text-gray-500">{node.subject}</p>}
                    {node.duration && <p className="text-xs text-gray-500">{node.duration}</p>}
                    {node.condition && <p className="text-xs text-gray-500">{node.condition}</p>}
                    {node.action && <p className="text-xs text-gray-500">{node.action}</p>}
                  </div>
                </div>

                {/* Add button */}
                {i < nodes.length - 1 && (
                  <>
                    <div className="w-px h-3 bg-gray-200" />
                    <button
                      onClick={() => addNode(i)}
                      className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <div className="w-px h-3 bg-gray-200" />
                  </>
                )}
              </div>
            );
          })}

          {/* Final add button */}
          <div className="w-px h-6 bg-gray-200" />
          <button
            onClick={() => addNode(nodes.length - 1)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>
      </div>
    </div>
  );
}
