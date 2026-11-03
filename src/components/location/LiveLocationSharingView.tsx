import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Clock,
  Compass,
  Lock,
  MapPin,
  Navigation,
  Radio,
  Share2,
  Shield,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LiveLocationSharingView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const {
    isSharingLocation,
    sharingExpiresAt,
    sharingDurationMinutes,
    sharedContactIds,
    startLocationSharing,
    stopLocationSharing,
    contacts,
    currentUser,
    setCurrentUser,
    playChime,
    showToast,
  } = useApp();

  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedContacts, setSelectedContacts] = useState<string[]>(sharedContactIds);
  const [remainingTimeStr, setRemainingTimeStr] = useState<string>('');
  const [isRefreshingGps, setIsRefreshingGps] = useState<boolean>(false);

  // Remaining time counter
  useEffect(() => {
    if (!isSharingLocation || !sharingExpiresAt) {
      setRemainingTimeStr('');
      return;
    }

    const updateTimer = () => {
      const diff = sharingExpiresAt - Date.now();
      if (diff <= 0) {
        setRemainingTimeStr('Expired');
        stopLocationSharing();
      } else {
        const mins = Math.floor(diff / (60 * 1000));
        const secs = Math.floor((diff % (60 * 1000)) / 1000);
        setRemainingTimeStr(`${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isSharingLocation, sharingExpiresAt]);

  const toggleContactSelection = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const handleStartSharing = () => {
    if (selectedContacts.length === 0) {
      showToast({
        type: 'warning',
        title: 'Select Recipients',
        message: 'Please choose at least one contact to share your live location with.',
      });
      return;
    }
    startLocationSharing(selectedDuration, selectedContacts);
  };

  const refreshLocation = () => {
    setIsRefreshingGps(true);
    playChime('click');
    setTimeout(() => {
      setIsRefreshingGps(false);
      showToast({
        type: 'info',
        title: 'GPS Calibrated',
        message: 'High accuracy position locked: 450 University Ave (±3m).',
      });
    }, 700);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-10">
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
              Live Location Sharing
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Private, time-limited real-time location access for your trusted network
            </p>
          </div>
        </div>

        <button
          onClick={refreshLocation}
          disabled={isRefreshingGps}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1.5"
        >
          <Navigation className={`w-3.5 h-3.5 ${isRefreshingGps ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh GPS</span>
        </button>
      </div>

      {/* Interactive Map Visual */}
      <div className="relative w-full h-72 sm:h-80 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-inner flex flex-col justify-between p-4">
        {/* SVG Map Grid Background */}
        <div className="absolute inset-0 opacity-80 dark:opacity-60 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-800" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Simulated Road network */}
            <path d="M -20 120 Q 150 140 450 110 T 800 130" fill="none" stroke="currentColor" strokeWidth="14" className="text-slate-200/90 dark:text-slate-800/80" />
            <path d="M 180 -20 L 220 400" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200/80 dark:text-slate-800/70" />
            <path d="M 320 -20 Q 340 200 370 400" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200/80 dark:text-slate-800/70" />
            <path d="M -10 240 L 600 220" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200/80 dark:text-slate-800/70" />

            {/* University Green Zone */}
            <rect x="80" y="50" width="130" height="90" rx="16" fill="currentColor" className="text-emerald-500/10 dark:text-emerald-400/5" />
            <text x="95" y="100" className="text-[11px] font-semibold fill-emerald-800 dark:fill-emerald-400 opacity-60">Campus Quad</text>
          </svg>
        </div>

        {/* Top Floating Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${isSharingLocation ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="font-semibold text-slate-900 dark:text-white">
              {isSharingLocation ? 'Live Broadcast Active' : 'Location Not Shared'}
            </span>
            {isSharingLocation && remainingTimeStr && (
              <span className="text-slate-500 font-mono text-[11px] border-l border-slate-200 dark:border-slate-800 pl-2">
                {remainingTimeStr}
              </span>
            )}
          </div>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500">
            GPS: ±3.8m
          </div>
        </div>

        {/* Center Live Location Radar Marker */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto pointer-events-none">
          <div className="relative flex items-center justify-center">
            {/* Animated accuracy pulse ring */}
            <div className={`w-24 h-24 rounded-full border border-sky-500/40 bg-sky-500/10 ${isSharingLocation ? 'animate-ping' : ''}`} />
            <div className="absolute w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 rounded-full bg-sky-400" />
              </div>
            </div>
          </div>

          {/* User pin caption */}
          <div className="mt-2 bg-slate-900/90 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-sky-400 dark:text-sky-600" />
            <span>You (Sarah Jenkins)</span>
          </div>
        </div>

        {/* Bottom Location Address Bar */}
        <div className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser?.currentLocation?.address || '450 University Ave, Campus District'}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                San Francisco, CA · Latitude 37.7749° · Longitude -122.4194°
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sharing Controls & Duration */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        {isSharingLocation ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Sharing Is Active
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Your coordinates are streaming securely to {sharedContactIds.length} designated contacts.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Time Left</span>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                  {remainingTimeStr || 'Continuous'}
                </span>
              </div>
            </div>

            <button
              onClick={stopLocationSharing}
              className="w-full py-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm active:scale-[0.98]"
            >
              Stop Sharing Immediately
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                1. Select Sharing Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 15, label: '15 Minutes' },
                  { value: 60, label: '1 Hour' },
                  { value: 0, label: 'Until Stopped' },
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
                        ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                2. Select Trusted Recipients
              </label>
              <div className="space-y-2">
                {contacts.map((contact) => {
                  const isChecked = selectedContacts.includes(contact.id);
                  return (
                    <div
                      key={contact.id}
                      onClick={() => toggleContactSelection(contact.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                        isChecked
                          ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-slate-900 dark:bg-white border-transparent text-white dark:text-slate-900'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {contact.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {contact.relationship} · {contact.phone}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 capitalize">
                        {contact.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Privacy authorization statement */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
              <Lock className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
              <span>
                <strong>Privacy Protected:</strong> Your live coordinates are encrypted end-to-end and only accessible to the contacts chosen above during the active window. You can stop sharing at any second.
              </span>
            </div>

            <button
              onClick={handleStartSharing}
              className="w-full py-3 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Authorize & Start Sharing Location</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
