import { useState } from 'react';
import { Type, Square, Image, Minus, Columns, ArrowLeft, Monitor, Smartphone, Save, Send, Trash2, ChevronUp, ChevronDown, Sparkles, Heading, BoxSelect } from 'lucide-react';
import { ACTION } from '../utils/reducer';
import { callClaude, parseAIResponse } from '../utils/helpers';

const BLOCK_TYPES = [
  { type: 'header', label: 'Header', icon: Heading },
  { type: 'text', label: 'Text', icon: Type },
  { type: 'button', label: 'Button', icon: Square },
  { type: 'image', label: 'Image', icon: Image },
  { type: 'divider', label: 'Divider', icon: Minus },
  { type: 'columns', label: '2 Column', icon: Columns },
  { type: 'footer', label: 'Footer', icon: BoxSelect },
];

const DEFAULT_BLOCK = {
  header: { content: 'Your Brand', bgColor: '#1f2937', textColor: '#ffffff', fontSize: 20 },
  text: { content: 'Add your text content here. Click to edit.', fontSize: 14, textColor: '#374151', align: 'left' },
  button: { label: 'Click Here', url: '#', bgColor: '#facc15', textColor: '#111827', borderRadius: 8 },
  image: { url: '', alt: 'Image', width: 100 },
  divider: { color: '#e5e7eb' },
  columns: { left: 'Left column content', right: 'Right column content' },
  footer: { address: '123 Main St, City, State 12345', unsubscribe: 'Unsubscribe from these emails' },
};

export default function TemplateBuilder({ state, dispatch }) {
  const { templateBuilder, aiLoading } = state;
  const { blocks, selectedBlockId, previewMode, name } = templateBuilder;
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  const addBlock = (type) => {
    dispatch({ type: ACTION.ADD_BLOCK, payload: { type, ...DEFAULT_BLOCK[type] } });
  };

  return (
    <div className="flex h-full -m-6">
      {/* Left Panel - Block Types */}
      <div className="w-48 bg-white border-r border-gray-100 p-3 overflow-y-auto shrink-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Blocks</p>
        <div className="space-y-1">
          {BLOCK_TYPES.map(bt => (
            <button
              key={bt.type}
              onClick={() => addBlock(bt.type)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <bt.icon className="w-4 h-4 text-gray-400" />
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 bg-gray-50 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-12 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => dispatch({ type: ACTION.SET_VIEW, payload: 'campaigns' })}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={name}
              onChange={e => dispatch({ type: ACTION.SET_TEMPLATE_NAME, payload: e.target.value })}
              className="text-sm font-medium text-gray-900 border-none bg-transparent focus:ring-0 p-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
              <button onClick={() => dispatch({ type: ACTION.SET_PREVIEW_MODE, payload: 'desktop' })}
                className={`p-1.5 rounded-md cursor-pointer ${previewMode === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => dispatch({ type: ACTION.SET_PREVIEW_MODE, payload: 'mobile' })}
                className={`p-1.5 rounded-md cursor-pointer ${previewMode === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
            <button onClick={() => dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'success', message: 'Template saved!' } })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-gray-900 text-xs font-medium rounded-lg hover:bg-yellow-500 cursor-pointer">
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center">
          <div className={`bg-white shadow-sm rounded-xl transition-all ${previewMode === 'mobile' ? 'w-96' : 'w-full max-w-xl'}`}>
            {blocks.length === 0 ? (
              <div className="py-24 text-center">
                <Type className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Click a block type to start building</p>
              </div>
            ) : (
              blocks.map((block, index) => (
                <div
                  key={block.id}
                  onClick={() => dispatch({ type: ACTION.SELECT_BLOCK, payload: block.id })}
                  className={`relative group cursor-pointer transition-all ${
                    selectedBlockId === block.id ? 'ring-2 ring-blue-400 ring-inset' : 'hover:ring-1 hover:ring-blue-200 hover:ring-inset'
                  }`}
                >
                  {/* Block controls */}
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5 z-10">
                    <button onClick={e => { e.stopPropagation(); dispatch({ type: ACTION.MOVE_BLOCK, payload: { index, direction: -1 } }); }}
                      className="p-0.5 bg-white shadow rounded text-gray-400 hover:text-gray-600 cursor-pointer">
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); dispatch({ type: ACTION.MOVE_BLOCK, payload: { index, direction: 1 } }); }}
                      className="p-0.5 bg-white shadow rounded text-gray-400 hover:text-gray-600 cursor-pointer">
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); dispatch({ type: ACTION.DELETE_BLOCK, payload: block.id }); }}
                      className="p-0.5 bg-white shadow rounded text-gray-400 hover:text-red-500 cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Block render */}
                  <BlockPreview block={block} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Properties */}
      <div className="w-64 bg-white border-l border-gray-100 p-4 overflow-y-auto shrink-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Properties</p>
        {selectedBlock ? (
          <BlockProperties block={selectedBlock} dispatch={dispatch} state={state} />
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">Select a block to edit</p>
        )}
      </div>
    </div>
  );
}

function BlockPreview({ block }) {
  switch (block.type) {
    case 'header':
      return <div className="px-6 py-4 rounded-t-xl" style={{ backgroundColor: block.bgColor }}><p className="font-bold" style={{ color: block.textColor, fontSize: block.fontSize }}>{block.content}</p></div>;
    case 'text':
      return <div className="px-6 py-4" style={{ textAlign: block.align }}><p style={{ color: block.textColor, fontSize: block.fontSize }}>{block.content}</p></div>;
    case 'button':
      return <div className="px-6 py-4 text-center"><span className="inline-block px-6 py-2.5 font-medium text-sm" style={{ backgroundColor: block.bgColor, color: block.textColor, borderRadius: block.borderRadius }}>{block.label}</span></div>;
    case 'image':
      return <div className="px-6 py-4"><div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ width: `${block.width}%`, height: 120 }}><Image className="w-8 h-8 text-gray-300" /></div></div>;
    case 'divider':
      return <div className="px-6 py-2"><hr style={{ borderColor: block.color }} /></div>;
    case 'columns':
      return <div className="px-6 py-4 grid grid-cols-2 gap-4"><div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">{block.left}</div><div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">{block.right}</div></div>;
    case 'footer':
      return <div className="px-6 py-4 bg-gray-50 rounded-b-xl text-center"><p className="text-xs text-gray-400">{block.address}</p><p className="text-xs text-blue-500 mt-1 underline">{block.unsubscribe}</p></div>;
    default:
      return null;
  }
}

function BlockProperties({ block, dispatch, state }) {
  const update = (props) => dispatch({ type: ACTION.UPDATE_BLOCK, payload: { id: block.id, ...props } });
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('Professional');
  const [showAI, setShowAI] = useState(false);

  const generateCopy = async () => {
    dispatch({ type: ACTION.SET_AI_LOADING, payload: true });
    try {
      const result = await callClaude(
        `Write 3 variations of email body copy about "${aiPrompt}" in a ${aiTone} tone. Keep each under 80 words. Format as JSON array, nothing else.`,
        state.apiKey
      );
      dispatch({ type: ACTION.SET_AI_RESULTS, payload: parseAIResponse(result) });
    } catch {
      dispatch({ type: ACTION.ADD_NOTIFICATION, payload: { type: 'error', message: 'AI unavailable, try again' } });
    }
    dispatch({ type: ACTION.SET_AI_LOADING, payload: false });
  };

  const inputClass = "w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <div className="space-y-3">
      {block.type === 'text' && (
        <>
          <div>
            <label className={labelClass}>Content</label>
            <textarea value={block.content} onChange={e => update({ content: e.target.value })} rows={4} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Font Size</label>
            <input type="range" min={10} max={24} value={block.fontSize} onChange={e => update({ fontSize: +e.target.value })} className="w-full" />
            <span className="text-xs text-gray-400">{block.fontSize}px</span>
          </div>
          <div>
            <label className={labelClass}>Alignment</label>
            <div className="flex gap-1">
              {['left', 'center', 'right'].map(a => (
                <button key={a} onClick={() => update({ align: a })}
                  className={`flex-1 py-1 text-xs rounded-lg capitalize cursor-pointer ${block.align === a ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>{a}</button>
              ))}
            </div>
          </div>
          <button onClick={() => setShowAI(!showAI)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" /> Write with AI
          </button>
          {showAI && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-xl">
              <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="What to write about..."
                className={inputClass} />
              <select value={aiTone} onChange={e => setAiTone(e.target.value)} className={`${inputClass} cursor-pointer`}>
                {['Professional', 'Friendly', 'Urgent', 'Playful'].map(t => <option key={t}>{t}</option>)}
              </select>
              <button onClick={generateCopy} disabled={state.aiLoading || !aiPrompt}
                className="w-full px-3 py-1.5 bg-yellow-400 text-gray-900 text-xs font-medium rounded-lg hover:bg-yellow-500 disabled:opacity-50 cursor-pointer">
                {state.aiLoading ? 'Generating...' : 'Generate'}
              </button>
              {state.aiResults.length > 0 && state.aiResults.map((r, i) => (
                <button key={i} onClick={() => { update({ content: r }); dispatch({ type: ACTION.SET_AI_RESULTS, payload: [] }); setShowAI(false); }}
                  className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded-lg hover:border-yellow-300 cursor-pointer">{r}</button>
              ))}
            </div>
          )}
        </>
      )}

      {block.type === 'header' && (
        <>
          <div>
            <label className={labelClass}>Text</label>
            <input value={block.content} onChange={e => update({ content: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Background</label>
            <input type="color" value={block.bgColor} onChange={e => update({ bgColor: e.target.value })} className="w-full h-8 rounded cursor-pointer" />
          </div>
          <div>
            <label className={labelClass}>Text Color</label>
            <input type="color" value={block.textColor} onChange={e => update({ textColor: e.target.value })} className="w-full h-8 rounded cursor-pointer" />
          </div>
        </>
      )}

      {block.type === 'button' && (
        <>
          <div>
            <label className={labelClass}>Label</label>
            <input value={block.label} onChange={e => update({ label: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>URL</label>
            <input value={block.url} onChange={e => update({ url: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Background</label>
            <input type="color" value={block.bgColor} onChange={e => update({ bgColor: e.target.value })} className="w-full h-8 rounded cursor-pointer" />
          </div>
          <div>
            <label className={labelClass}>Corner Radius</label>
            <input type="range" min={0} max={24} value={block.borderRadius} onChange={e => update({ borderRadius: +e.target.value })} className="w-full" />
          </div>
        </>
      )}

      {block.type === 'image' && (
        <>
          <div>
            <label className={labelClass}>Image URL</label>
            <input value={block.url} onChange={e => update({ url: e.target.value })} placeholder="https://..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Alt Text</label>
            <input value={block.alt} onChange={e => update({ alt: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Width</label>
            <input type="range" min={20} max={100} value={block.width} onChange={e => update({ width: +e.target.value })} className="w-full" />
            <span className="text-xs text-gray-400">{block.width}%</span>
          </div>
        </>
      )}

      {block.type === 'footer' && (
        <>
          <div>
            <label className={labelClass}>Address</label>
            <textarea value={block.address} onChange={e => update({ address: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Unsubscribe Text</label>
            <input value={block.unsubscribe} onChange={e => update({ unsubscribe: e.target.value })} className={inputClass} />
          </div>
        </>
      )}

      {block.type === 'columns' && (
        <>
          <div>
            <label className={labelClass}>Left Column</label>
            <textarea value={block.left} onChange={e => update({ left: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Right Column</label>
            <textarea value={block.right} onChange={e => update({ right: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
          </div>
        </>
      )}
    </div>
  );
}
