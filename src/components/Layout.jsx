import { LayoutDashboard, Send, Zap, Users, Palette, BarChart3, Settings, Bell, LogOut, Sparkles, Search } from 'lucide-react';
import { ACTION } from '../utils/reducer';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Campaigns', icon: Send },
  { id: 'automations', label: 'Automations', icon: Zap },
  { id: 'audience', label: 'Audience', icon: Users },
  { id: 'templates', label: 'Templates', icon: Palette },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Layout({ state, dispatch, children }) {
  const unreadCount = state.notifications.length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="px-5 py-5 flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Send className="w-4 h-4 text-gray-900" />
          </div>
          <span className="text-lg font-semibold tracking-tight">MailFlow</span>
          <span className="ml-auto text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full font-medium">AI</span>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const active = state.currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => dispatch({ type: ACTION.SET_VIEW, payload: item.id })}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                  active
                    ? 'bg-gray-800 text-white border-l-2 border-yellow-400 -ml-px'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-4 space-y-2">
          <div className="px-3 py-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold">RP</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Ralph P.</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
              <LogOut className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 capitalize">{state.currentView}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch({ type: ACTION.SET_VIEW, payload: 'settings' })}
              className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
            <button
              onClick={() => {
                dispatch({ type: ACTION.SET_VIEW, payload: 'settings' });
                dispatch({ type: ACTION.SET_SETTINGS_TAB, payload: 'api' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
