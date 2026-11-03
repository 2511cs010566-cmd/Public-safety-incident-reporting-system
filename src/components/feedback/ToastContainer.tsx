import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-16 right-3 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isEmergency = toast.type === 'emergency';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-top-2 duration-200 flex items-start gap-3 ${
              isEmergency
                ? 'bg-rose-600 text-white border-rose-500'
                : isSuccess
                ? 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border-emerald-500/40'
                : isWarning
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-medium'
                : 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isEmergency ? (
                <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
              ) : isSuccess ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : isWarning ? (
                <AlertTriangle className="w-5 h-5 text-slate-950" />
              ) : (
                <Info className="w-5 h-5 text-sky-500" />
              )}
            </div>

            <div className="flex-1 text-xs">
              <h4 className="font-bold">{toast.title}</h4>
              <p
                className={`mt-0.5 leading-relaxed text-[11px] ${
                  isEmergency ? 'text-rose-100' : isWarning ? 'text-slate-900' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
