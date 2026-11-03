import React from 'react';
import { Bell, BookOpen, FileText, Home, Shield, User } from 'lucide-react';
import { NavigationTab, useApp } from '../../context/AppContext';

export const BottomTabBar: React.FC = () => {
  const { currentTab, setCurrentTab, safetyAlerts, isSosEmergencyActive } = useApp();

  const activeAlertsCount = safetyAlerts.filter((a) => a.status === 'active').length;

  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-5 h-5" />,
      badge: activeAlertsCount,
    },
    {
      id: 'report',
      label: 'Report',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'safety',
      label: 'Safety',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center relative transition-colors ${
                isActive
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 ${
                  isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-slate-900 dark:bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
