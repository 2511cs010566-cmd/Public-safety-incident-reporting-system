import React, { useState } from 'react';
import {
  Bell,
  Check,
  ChevronRight,
  Info,
  MapPin,
  Radio,
  Shield,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE_URL } from '../../data/mockData';

export const OnboardingModal: React.FC = () => {
  const { completeOnboarding, setActiveModal, playChime } = useApp();
  const [step, setStep] = useState<number>(1);

  // Simulated permission states
  const [permissions, setPermissions] = useState({
    location: true,
    notifications: true,
    contacts: false,
  });

  const nextStep = () => {
    playChime('click');
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    playChime('click');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const togglePermission = (key: 'location' | 'notifications' | 'contacts') => {
    playChime('click');
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateAccount = () => {
    completeOnboarding(false);
    setActiveModal('auth');
  };

  const handleContinueGuest = () => {
    completeOnboarding(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Progress indicator */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-6 bg-slate-900 dark:bg-white'
                    : i < step
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 font-mono">Step {step} of 5</span>
        </div>

        {/* Dynamic Screen Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-center">
          {step === 1 && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Public Safety Reporting System
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  Stay Alert. Stay Connected. Stay Safe.
                </p>
              </div>

              <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative aspect-video bg-slate-100 dark:bg-slate-800">
                <img
                  src={HERO_IMAGE_URL}
                  alt="Public Safety emblem"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-3">
                  <p className="text-xs text-white/90 text-left font-medium">
                    Community-verified safety intelligence & emergency response
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Emergency Assistance
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Get help quickly when you need it.
              </p>
              <div className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>3-second confirmed SOS countdown to prevent false alarms</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Instant SMS and GPS coordinates dispatched to your trusted contacts</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Direct 1-tap dial for local emergency services (911 / Campus Police)</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Trusted Contacts Circle
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Keep the people you trust connected.
              </p>
              <div className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Define Primary and Secondary emergency contacts</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Grant temporary live location tracking only when you choose</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Send silent safety pings to let loved ones know you arrived safely</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Radio className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Verified Safety Alerts
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Know about important safety situations around you.
              </p>
              <div className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Official bulletins from emergency services & meteorologists</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Community crowd-sourced hazard alerts (downed wires, signal outages)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Clear distinction between unverified reports and official alerts</span>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Permissions Setup
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Public Safety Reporting System requests only what is needed to protect you in an emergency.
                </p>
              </div>

              {/* Permissions list with explanations */}
              <div className="space-y-3">
                {/* Location */}
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        Precise Location
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                        Required to dispatch coordinates during SOS, show nearby emergency facilities, and send localized danger alerts.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePermission('location')}
                    aria-label="Toggle location permission"
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      permissions.location ? 'bg-slate-900 dark:bg-white' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white dark:bg-slate-900 absolute top-1 transition-transform ${
                        permissions.location ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Notifications */}
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Bell className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        Push Notifications
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                        Delivers urgent evacuation notices, severe weather alarms, and safety check-in reminders.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePermission('notifications')}
                    aria-label="Toggle notifications permission"
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      permissions.notifications ? 'bg-slate-900 dark:bg-white' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white dark:bg-slate-900 absolute top-1 transition-transform ${
                        permissions.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Contacts (Optional) */}
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Users className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          Contacts Access
                        </p>
                        <span className="text-[10px] text-slate-500">Optional</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                        Quickly select emergency contacts from your phonebook without typing numbers manually.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePermission('contacts')}
                    aria-label="Toggle contacts permission"
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      permissions.contacts ? 'bg-slate-900 dark:bg-white' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white dark:bg-slate-900 absolute top-1 transition-transform ${
                        permissions.contacts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2 text-[11px] text-slate-500">
                <Info className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                <span>You can adjust or revoke any permission anytime in your Profile Settings.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {step < 5 ? (
            <div className="flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={() => setStep(5)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Skip
                </button>
              )}
              <button
                onClick={nextStep}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5 ml-auto"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleCreateAccount}
                className="w-full py-3 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Create Account
              </button>
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={handleContinueGuest}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-center"
                >
                  Continue as Guest
                </button>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <button
                  onClick={() => {
                    completeOnboarding(false);
                    setActiveModal('auth');
                  }}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-center"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
