import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { notifications, removeNotification } = useApp();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto bg-stone-900/95 backdrop-blur border border-stone-800 text-stone-100 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform translate-y-0 animate-fadeIn"
        >
          <div className="p-3.5 flex items-start gap-3">
            {notif.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : notif.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                <span className="text-[10px] text-stone-400 font-mono shrink-0">2s</span>
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed line-clamp-2">
                {notif.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(notif.id)}
              className="p-1 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition shrink-0"
              title="Dismiss now"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2-Second Animated Progress Bar */}
          <div className="w-full h-1 bg-stone-800/80">
            <div
              className={`h-full animate-toast-progress ${
                notif.type === 'success'
                  ? 'bg-emerald-500'
                  : notif.type === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
