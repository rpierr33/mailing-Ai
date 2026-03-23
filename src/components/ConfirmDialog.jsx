import { ACTION } from '../utils/reducer';

export default function ConfirmDialog({ dialog, dispatch }) {
  if (!dialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => dispatch({ type: ACTION.SET_CONFIRM, payload: null })}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900">{dialog.title}</h3>
        <p className="text-sm text-gray-500 mt-2">{dialog.message}</p>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => dispatch({ type: ACTION.SET_CONFIRM, payload: null })}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              dialog.onConfirm();
              dispatch({ type: ACTION.SET_CONFIRM, payload: null });
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 cursor-pointer"
          >
            {dialog.confirmText || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
