import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { ACTION } from '../utils/reducer';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const COLORS = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function Toast({ notifications, dispatch }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(n => (
        <ToastItem key={n.id} notification={n} dispatch={dispatch} />
      ))}
    </div>
  );
}

function ToastItem({ notification, dispatch }) {
  const Icon = ICONS[notification.type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: ACTION.REMOVE_NOTIFICATION, payload: notification.id });
    }, 3000);
    return () => clearTimeout(timer);
  }, [notification.id, dispatch]);

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg text-sm animate-slide-up ${COLORS[notification.type] || COLORS.info}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span>{notification.message}</span>
      <button
        onClick={() => dispatch({ type: ACTION.REMOVE_NOTIFICATION, payload: notification.id })}
        className="ml-2 opacity-50 hover:opacity-100 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
