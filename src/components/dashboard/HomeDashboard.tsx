import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle,
  Clock,
  Compass,
  FileText,
  Flame,
  Hospital,
  MapPin,
  Phone,
  PhoneCall,
  Radio,
  Share2,
  Shield,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HomeDashboard: React.FC<{
  onOpenContacts: () => void;
  onOpenLocation: () => void;
  onOpenCheckIn: () => void;
  onOpenServices: () => void;
}> = ({ onOpenContacts, onOpenLocation, onOpenCheckIn, onOpenServices }) => {
  const {
    currentUser,
    setCurrentTab,
    triggerSosButton,
    isSosEmergencyActive,
    isSharingLocation,
    contacts,
    safetyAlerts,
    incidentReports,
    emergencyServices,
    activeCheckIn,
    confirmCheckInSafe,
    playChime,
  } = useApp();

  const connectedContactsCount = contacts.filter((c) => c.status === 'connected').length;
  const recentAlert = safetyAlerts[0];
  const recentIncident = incidentReports[0];
  const nearestHospital = emergencyServices.find((s) => s.category === 'hospital');
  const nearestPolice = emergencyServices.find((s) => s.category === 'police');

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-14">
      {/* 1. Top Section / Greeting */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {greeting},
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {currentUser?.name || 'Community Member'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('alerts')}
            aria-label="View safety alerts"
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 shadow-xs transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {safetyAlerts.filter((a) => a.status === 'active').length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Safety Status Card: "Your Safety Status - You're currently connected" */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              isSosEmergencyActive
                ? 'bg-rose-600 animate-ping'
                : 'bg-emerald-500 animate-safe-pulse'
            }`} />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Your Safety Status
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isSosEmergencyActive
                  ? 'Distress mode active'
                  : "You're currently connected"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playChime('success');
              confirmCheckInSafe();
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Check In Safe
          </button>
        </div>

        {/* 3 Metrics in quiet unboxed format */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Trusted Contacts</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
              {connectedContactsCount} Active
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Location Sharing</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
              {isSharingLocation ? 'Active (GPS)' : 'Off'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Last Safety Check</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
              Just now
            </span>
          </div>
        </div>
      </div>

      {/* 3. Large Central Emergency SOS Button */}
      <div className="flex flex-col items-center justify-center py-4 sm:py-6 relative">
        {/* Radar pulses around the button */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-rose-500/20 bg-rose-500/5 animate-ping" />
          <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-rose-500/30 bg-rose-500/10" />

          {/* Core Interactive SOS Button */}
          <button
            onClick={() => {
              playChime('alarm');
              triggerSosButton();
            }}
            aria-label="Activate Emergency SOS"
            className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black shadow-xl shadow-rose-600/30 active:scale-95 transition-all flex flex-col items-center justify-center border-4 border-white dark:border-slate-900"
          >
            <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 mb-0.5 animate-pulse" />
            <span className="text-xl sm:text-2xl font-black tracking-wider">SOS</span>
          </button>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Get Emergency Help
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Press and hold for 3-second verified dispatch to your safety circle
          </p>
        </div>
      </div>

      {/* 4. Quick Actions Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-1">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={onOpenLocation}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Share Location
            </span>
            <span className="text-[10px] text-slate-500">Live GPS tracking</span>
          </button>

          <button
            onClick={() => setCurrentTab('report')}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Report Incident
            </span>
            <span className="text-[10px] text-slate-500">Alert neighbors</span>
          </button>

          <button
            onClick={() => setCurrentTab('alerts')}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Safety Alerts
            </span>
            <span className="text-[10px] text-slate-500">Verified stream</span>
          </button>

          <button
            onClick={onOpenContacts}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Emergency Contacts
            </span>
            <span className="text-[10px] text-slate-500">{contacts.length} configured</span>
          </button>
        </div>
      </div>

      {/* 5. Nearby Safety Updates */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Nearby Safety Updates
          </h2>
          <button
            onClick={() => setCurrentTab('alerts')}
            className="text-xs font-semibold text-slate-900 dark:text-white hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentAlert && (
            <div
              onClick={() => setCurrentTab('alerts')}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider text-[10px]">
                  {recentAlert.severity} · VERIFIED OFFICIAL
                </span>
                <span>{recentAlert.timestamp}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {recentAlert.title}
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                {recentAlert.description}
              </p>
            </div>
          )}

          {recentIncident && (
            <div
              onClick={() => setCurrentTab('alerts')}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="text-amber-600 font-semibold uppercase text-[10px]">
                  {recentIncident.category.replace('_', ' ')} · COMMUNITY REPORT
                </span>
                <span>{recentIncident.timestamp}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {recentIncident.title}
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                {recentIncident.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 6. Safety Check-In Widget */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Scheduled Safety Check-In
            </h3>
          </div>
          <p className="text-[11px] text-slate-500">
            {activeCheckIn ? 'Timer currently running' : 'Set an automatic timer before a solo commute'}
          </p>
        </div>

        <button
          onClick={onOpenCheckIn}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          {activeCheckIn ? 'View Timer' : 'Set Check-In'}
        </button>
      </div>

      {/* 7. Nearby Emergency Services Quick Dial */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Emergency Services Quick Dial
          </h3>
          <button
            onClick={onOpenServices}
            className="text-xs font-semibold text-slate-900 dark:text-white hover:underline"
          >
            All Services
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {nearestHospital && (
            <a
              href={`tel:${nearestHospital.phone}`}
              onClick={() => playChime('click')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-left hover:border-slate-300 transition-colors"
            >
              <div className="truncate">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white block truncate">
                  {nearestHospital.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {nearestHospital.distanceMiles} mi · 24/7 ER
                </span>
              </div>
              <PhoneCall className="w-3.5 h-3.5 text-rose-500 shrink-0 ml-2" />
            </a>
          )}

          {nearestPolice && (
            <a
              href={`tel:${nearestPolice.phone}`}
              onClick={() => playChime('click')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-left hover:border-slate-300 transition-colors"
            >
              <div className="truncate">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white block truncate">
                  {nearestPolice.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {nearestPolice.distanceMiles} mi · Police
                </span>
              </div>
              <PhoneCall className="w-3.5 h-3.5 text-sky-500 shrink-0 ml-2" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
