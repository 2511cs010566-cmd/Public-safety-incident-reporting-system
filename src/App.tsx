import React, { useState } from 'react';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AuthModal } from './components/auth/AuthModal';
import { SafetyCheckInView } from './components/checkin/SafetyCheckInView';
import { TrustedContactsView } from './components/contacts/TrustedContactsView';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { SafetyCenterView } from './components/education/SafetyCenterView';
import { ToastContainer } from './components/feedback/ToastContainer';
import { LiveLocationSharingView } from './components/location/LiveLocationSharingView';
import { BottomTabBar } from './components/navigation/BottomTabBar';
import { TopBar } from './components/navigation/TopBar';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ProfileView } from './components/profile/ProfileView';
import { IncidentReportingView } from './components/reports/IncidentReportingView';
import { SafetyAlertsView } from './components/alerts/SafetyAlertsView';
import { EmergencyServicesView } from './components/services/EmergencyServicesView';
import { EmergencySOSModal } from './components/sos/EmergencySOSModal';
import { AppProvider, useApp } from './context/AppContext';

type SubViewType = 'none' | 'contacts' | 'location' | 'checkin' | 'services';

const MainContent: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    activeModal,
    setActiveModal,
    hasSeenOnboarding,
    simulateDeviceFrame,
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<SubViewType>('none');

  // Close subview when tab switches
  const handleTabChange = (tab: typeof currentTab) => {
    setActiveSubView('none');
    setCurrentTab(tab);
  };

  const renderActiveContent = () => {
    // Sub-view overrides
    if (activeSubView === 'contacts') {
      return <TrustedContactsView onBack={() => setActiveSubView('none')} />;
    }
    if (activeSubView === 'location') {
      return <LiveLocationSharingView onBack={() => setActiveSubView('none')} />;
    }
    if (activeSubView === 'checkin') {
      return <SafetyCheckInView onBack={() => setActiveSubView('none')} />;
    }
    if (activeSubView === 'services') {
      return <EmergencyServicesView onBack={() => setActiveSubView('none')} />;
    }

    // Main Tab Views
    switch (currentTab) {
      case 'home':
        return (
          <HomeDashboard
            onOpenContacts={() => setActiveSubView('contacts')}
            onOpenLocation={() => setActiveSubView('location')}
            onOpenCheckIn={() => setActiveSubView('checkin')}
            onOpenServices={() => setActiveSubView('services')}
          />
        );
      case 'alerts':
        return <SafetyAlertsView />;
      case 'report':
        return <IncidentReportingView onBack={() => setCurrentTab('home')} />;
      case 'safety':
        return <SafetyCenterView />;
      case 'profile':
        return <ProfileView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-rose-500 selection:text-white">
      {/* Top Bar navigation */}
      <TopBar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-4 sm:pt-6 pb-20 md:pb-8">
        {simulateDeviceFrame ? (
          // Simulated Smartphone Chassis for presentation & touch testing
          <div className="flex justify-center py-2">
            <div className="w-full max-w-[420px] rounded-[44px] p-3 bg-slate-900 dark:bg-slate-800 shadow-2xl border-4 border-slate-700/60 dark:border-slate-700">
              {/* Speaker Notch */}
              <div className="w-28 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-10 h-1 bg-slate-800 rounded-full" />
              </div>
              {/* Phone Screen Viewport */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-[32px] p-4 min-h-[680px] max-h-[760px] overflow-y-auto no-scrollbar border border-slate-200 dark:border-slate-800">
                {renderActiveContent()}
              </div>
            </div>
          </div>
        ) : (
          renderActiveContent()
        )}
      </main>

      {/* Mobile Fixed Bottom Tab Bar */}
      <BottomTabBar />

      {/* Real-time Toast Notifications */}
      <ToastContainer />

      {/* Modals */}
      {!hasSeenOnboarding && <OnboardingModal />}
      {activeModal === 'auth' && <AuthModal />}
      <EmergencySOSModal />
      {activeModal === 'admin' && (
        <AdminDashboardView onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'analytics' && (
        <AnalyticsView onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
