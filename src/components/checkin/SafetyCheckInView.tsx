import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle,
  ChevronLeft,
  Clock,
  Radio,
  Send,
  Shield,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SafetyCheckInView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const {
    activeCheckIn,
    startCheckIn,
    confirmCheckInSafe,
    cancelCheckIn,
    isMissedCheckInModalOpen,
    dismissMissedCheckIn,
    contacts,
    playChime,
    showToast,
  } = useApp();

  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [customMinutes, setCustomMinutes] = useState<number>(45);
  const [checkInNote, setCheckInNote] = useState<string>('Walking from library to residence hall');
  const [remainingTimeStr, setRemainingTimeStr] = useState<string>('');

  useEffect(() => {
    if (!activeCheckIn || activeCheckIn.status !== 'active') {
      setRemainingTimeStr('');
      return;
    }

    const updateTimer = () => {
      const diff = activeCheckIn.expiresAt - Date.now();
      if (diff <= 0) {
        setRemainingTimeStr('Expired');
      } else {
        const mins = Math.floor(diff / (60 * 1000));
        const secs = Math.floor((diff % (60 * 1000)) / 1000);
        setRemainingTimeStr(`${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeCheckIn]);

  const handleStart = () => {
    const dur = selectedDuration === -1 ? customMinutes : selectedDuration;
    startCheckIn(dur, checkInNote);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Safety Check-In
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Schedule safety timers during commutes, jogs, or solo activities
            </p>
          </div>
        </div>
      </div>

      {/* Immediate Check-In Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Immediate Safety Verification
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Send an instant "I am Safe" confirmation ping to your primary circle.
          </p>
        </div>

        <button
          onClick={() => {
            playChime('success');
            confirmCheckInSafe();
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95"
        >
          <Check className="w-4 h-4" />
          <span>I Am Safe (Notify Circle)</span>
        </button>
      </div>

      {/* Active Check-In Session or Schedule New */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {activeCheckIn && activeCheckIn.status === 'active' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 font-mono">
                  ACTIVE SCHEDULED TIMER
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Scheduled Check-In Running
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono block">Time Remaining</span>
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {remainingTimeStr}
                </span>
              </div>
            </div>

            {/* Note */}
            {activeCheckIn.note && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white mr-1.5">Activity:</span>
                {activeCheckIn.note}
              </div>
            )}

            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>
                If you do not check in by the timer expiry, an alert will be sent to your trusted contacts.
              </span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={confirmCheckInSafe}
                className="flex-1 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
              >
                Confirm "I Am Safe" Now
              </button>
              <button
                onClick={cancelCheckIn}
                className="py-3 px-4 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel Timer
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                1. Select Expected Arrival / Check-In Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 15, label: '15m' },
                  { value: 30, label: '30m' },
                  { value: 60, label: '1h' },
                  { value: 120, label: '2h' },
                ].map((dur) => (
                  <button
                    key={dur.value}
                    type="button"
                    onClick={() => {
                      playChime('click');
                      setSelectedDuration(dur.value);
                    }}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border transition-colors ${
                      selectedDuration === dur.value
                        ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                2. Activity Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Walking home from library via campus trail"
                value={checkInNote}
                onChange={(e) => setCheckInNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Automated Safety Escalation:
              </p>
              <p>
                When the timer expires, the reporting system will sound a local reminder. If not answered within 60 seconds, an automated SMS with your last known GPS coordinates will be sent to your primary contacts ({contacts.filter((c) => c.priority === 'primary').length} contacts).
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Start Scheduled Safety Check-In ({selectedDuration}m)</span>
            </button>
          </div>
        )}
      </div>

      {/* Missed Check-In Alert Modal */}
      {isMissedCheckInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 text-center shadow-2xl border-2 border-rose-500 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 animate-bounce">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Check-In Timer Expired!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 mb-5">
              Are you safe? If you don't respond, your emergency contacts will be dispatched your coordinates.
            </p>

            <div className="w-full space-y-2.5">
              <button
                onClick={confirmCheckInSafe}
                className="w-full py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
              >
                I Am Safe · Dismiss Alert
              </button>

              <button
                onClick={() => {
                  dismissMissedCheckIn();
                  showToast({
                    type: 'emergency',
                    title: 'Circle Notified',
                    message: 'Distress message and location sent to emergency contacts.',
                  });
                }}
                className="w-full py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
              >
                I Need Help · Notify My Circle Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
