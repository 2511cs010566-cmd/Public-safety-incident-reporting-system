import React from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  HelpCircle,
  Moon,
  Radio,
  Shield,
  Smartphone,
  Sun,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopBar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    setActiveModal,
    currentUser,
    isDarkMode,
    toggleDarkMode,
    isDemoMode,
    toggleDemoMode,
    simulateDeviceFrame,
    toggleDeviceFrame,
    soundEnabled,
    toggleSound,
    isSosEmergencyActive,
    isSharingLocation,
    safetyAlerts,
  } = useApp();

  const activeAlertsCount = safetyAlerts.filter((a) => a.status === 'active').length;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top zone 1-row contract */}
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isSosEmergencyActive
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
            }`}>
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              Public Safety Reporting System
            </span>
          </button>

          {/* Quick status text */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs">
            {isSosEmergencyActive ? (
              <span className="flex items-center gap-1 text-rose-600 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                Emergency Active
              </span>
            ) : isSharingLocation ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Radio className="w-3 h-3 animate-spin" />
                Live Tracking Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                System Ready
              </span>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop view) */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setCurrentTab('home')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
              currentTab === 'home' ? 'text-slate-900 dark:text-white font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentTab('alerts')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 ${
              currentTab === 'alerts' ? 'text-slate-900 dark:text-white font-semibold' : ''
            }`}
          >
            Alerts
            {activeAlertsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeAlertsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('report')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
              currentTab === 'report' ? 'text-slate-900 dark:text-white font-semibold' : ''
            }`}
          >
            Report Incident
          </button>
          <button
            onClick={() => setCurrentTab('safety')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
              currentTab === 'safety' ? 'text-slate-900 dark:text-white font-semibold' : ''
            }`}
          >
            Safety Center
          </button>
          <button
            onClick={() => setActiveModal('admin')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors text-amber-600 dark:text-amber-400 font-semibold"
          >
            Admin
          </button>
          <button
            onClick={() => setActiveModal('analytics')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Analytics
          </button>
        </nav>

        {/* Zone 3: Actions & Quick Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Demo toggle */}
          <button
            onClick={toggleDemoMode}
            title={isDemoMode ? 'Demo Mode Active' : 'Switch to Demo Mode'}
            className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-colors whitespace-nowrap ${
              isDemoMode
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900'
            }`}
          >
            {isDemoMode ? 'DEMO' : 'LIVE'}
          </button>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute emergency sounds' : 'Enable emergency sounds'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mobile frame toggle (for testing/grading) */}
          <button
            onClick={toggleDeviceFrame}
            title="Toggle Phone Frame View"
            className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User profile / Auth button */}
          {currentUser ? (
            <button
              onClick={() => setCurrentTab('profile')}
              aria-label="View user profile"
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-semibold hover:ring-2 hover:ring-slate-400 transition-all ml-1"
            >
              {currentUser.isGuest ? 'G' : currentUser.name.charAt(0)}
            </button>
          ) : (
            <button
              onClick={() => setActiveModal('auth')}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Demo Mode Notice Ribbon (quiet, unboxed) */}
      {isDemoMode && (
        <div className="bg-amber-500/10 dark:bg-amber-400/10 border-t border-amber-500/20 py-1 px-4 text-center">
          <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
            <span className="font-semibold uppercase tracking-wider text-[10px] mr-1.5 bg-amber-200 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">Demo Data</span>
            Simulated emergency safety network for prototype demonstration · Public Safety Reporting System is not a substitute for 911 / official emergency services.
          </p>
        </div>
      )}
    </header>
  );
};
