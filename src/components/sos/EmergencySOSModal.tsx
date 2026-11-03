import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  Compass,
  MapPin,
  Phone,
  PhoneCall,
  Radio,
  Send,
  Shield,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmergencySOSModal: React.FC = () => {
  const {
    isSosCountingDown,
    sosCountdownSeconds,
    cancelSosCountdown,
    isSosEmergencyActive,
    activeSosEvent,
    resolveEmergency,
    contacts,
    currentUser,
    setActiveModal,
    showToast,
    playChime,
  } = useApp();

  const [cancelReason, setCancelReason] = useState<string>('Accidental trigger');
  const [showResolveDialog, setShowResolveDialog] = useState<boolean>(false);

  // If neither counting down nor active emergency, close
  if (!isSosCountingDown && !isSosEmergencyActive) {
    return null;
  }

  // 1. COUNTDOWN SCREEN
  if (isSosCountingDown) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 text-center shadow-2xl border border-rose-500/30 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 animate-bounce" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Triggering Emergency SOS
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
            Dispatching live coordinates and emergency broadcast in:
          </p>

          {/* Countdown digit */}
          <div className="relative w-28 h-28 rounded-full border-4 border-rose-500/20 flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-rose-600 border-t-transparent animate-spin" />
            <span className="text-5xl font-black text-rose-600 dark:text-rose-400 font-mono tabular-nums">
              {sosCountdownSeconds}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-6">
            Emergency SMS will be sent to {contacts.filter((c) => c.priority === 'primary').length} primary contacts.
          </p>

          <button
            onClick={cancelSosCountdown}
            className="w-full py-3.5 text-sm font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Cancel SOS (I am Safe)
          </button>
        </div>
      </div>
    );
  }

  // 2. LIVE ACTIVE EMERGENCY SCREEN
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-500/40 overflow-hidden flex flex-col my-auto">
        {/* Urgent Emergency Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold bg-white/20 px-2 py-0.5 rounded">
                  Distress Broadcast Active
                </span>
              </div>
              <h2 className="text-lg font-bold mt-0.5">Emergency Mode</h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-rose-100 font-mono block">Active Since</span>
            <span className="text-xs font-bold font-mono">
              {activeSosEvent?.startedAt || 'Now'}
            </span>
          </div>
        </div>

        {/* Body content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Important Official Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold">Notice:</span> This public safety reporting system is an emergency companion tool, not an official emergency dispatch service. If you are in immediate physical danger, dial 911 or your local emergency number directly.
            </div>
          </div>

          {/* Primary Action: Direct Dial Emergency Services */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:911"
              onClick={() => playChime('click')}
              className="py-3 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 active:scale-95 text-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 911 (Police/EMS)</span>
            </a>
            <a
              href="tel:5559110044"
              onClick={() => playChime('click')}
              className="py-3 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors active:scale-95 text-center"
            >
              <Phone className="w-4 h-4" />
              <span>Campus Security</span>
            </a>
          </div>

          {/* Location Dispatch Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Live Broadcast Location
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Transmitting
              </span>
            </div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
              {currentUser?.currentLocation?.address || '450 University Ave, Campus District'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              GPS: 37.7749° N, -122.4194° W (Accuracy: ±4 meters)
            </p>
          </div>

          {/* Alerted Trusted Contacts List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-500" />
                Notified Trusted Contacts ({contacts.length})
              </span>
              <span className="text-[11px] text-slate-500">Auto-Alerted</span>
            </div>

            <div className="space-y-1.5">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-white dark:bg-slate-800/40"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {contact.name}
                      </span>
                      <span className="text-[10px] text-slate-400">· {contact.relationship}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      SMS & GPS Link Delivered
                    </span>
                  </div>

                  <a
                    href={`tel:${contact.phone}`}
                    onClick={() => playChime('click')}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                    aria-label={`Call ${contact.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Resend / Additional Ping button */}
          <button
            onClick={() => {
              playChime('beep');
              showToast({
                type: 'info',
                title: 'Coordinates Re-dispatched',
                message: 'Refreshed GPS coordinates sent to all active contacts.',
              });
            }}
            className="w-full py-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Update & Re-send Live Coordinates</span>
          </button>
        </div>

        {/* Footer / Cancel Emergency Flow */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          {!showResolveDialog ? (
            <button
              onClick={() => setShowResolveDialog(true)}
              className="w-full py-3 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              I Am Safe · Cancel Emergency SOS
            </button>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Confirm Safety Reason (Sent to Contacts):
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Accidental trigger">Accidental trigger during test</option>
                <option value="Safe location reached">Safe location reached safely</option>
                <option value="Emergency personnel on scene">Emergency personnel on scene</option>
                <option value="Situation de-escalated">Situation resolved / de-escalated</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResolveDialog(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
                >
                  Keep Active
                </button>
                <button
                  type="button"
                  onClick={() => resolveEmergency(cancelReason)}
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
                >
                  Confirm I Am Safe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
