import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  EmergencyEvent,
  EmergencyService,
  SafetyAlert,
  SafetyCheckInSession,
  SafetyIncidentReport,
  SafetyLesson,
  SystemAuditLog,
  TrustedContact,
  UserProfile,
} from '../types';
import {
  initialAlerts,
  initialAuditLogs,
  initialContacts,
  initialEmergencyEvents,
  initialEmergencyServices,
  initialIncidentReports,
  initialLessons,
  initialUser,
} from '../data/mockData';

export type NavigationTab = 'home' | 'alerts' | 'report' | 'safety' | 'profile';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'emergency';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Onboarding & Auth
  hasSeenOnboarding: boolean;
  completeOnboarding: (asGuest?: boolean) => void;
  resetOnboarding: () => void;
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  login: (email: string, name?: string) => void;
  loginAsGuest: () => void;
  logout: () => void;

  // SOS System
  isSosCountingDown: boolean;
  sosCountdownSeconds: number;
  isSosEmergencyActive: boolean;
  activeSosEvent: EmergencyEvent | null;
  triggerSosButton: () => void;
  cancelSosCountdown: () => void;
  resolveEmergency: (reason: string) => void;

  // Live Location Sharing
  isSharingLocation: boolean;
  sharingExpiresAt: number | null;
  sharingDurationMinutes: number;
  sharedContactIds: string[];
  startLocationSharing: (durationMinutes: number, contactIds?: string[]) => void;
  stopLocationSharing: () => void;

  // Safety Check-In
  activeCheckIn: SafetyCheckInSession | null;
  isMissedCheckInModalOpen: boolean;
  startCheckIn: (durationMinutes: number, note?: string) => void;
  confirmCheckInSafe: () => void;
  cancelCheckIn: () => void;
  dismissMissedCheckIn: () => void;

  // Data Collections
  contacts: TrustedContact[];
  addContact: (contact: Omit<TrustedContact, 'id' | 'status'>) => void;
  updateContact: (id: string, updates: Partial<TrustedContact>) => void;
  deleteContact: (id: string) => void;
  sendContactPing: (id: string) => void;

  incidentReports: SafetyIncidentReport[];
  submitIncidentReport: (
    report: Omit<SafetyIncidentReport, 'id' | 'timestamp' | 'confirmations' | 'outdatedReports' | 'flags' | 'status' | 'userId' | 'userName'>
  ) => void;
  confirmIncidentReport: (id: string) => void;
  markIncidentOutdated: (id: string) => void;
  flagIncidentReport: (id: string) => void;
  adminVerifyReport: (id: string, approve: boolean) => void;

  safetyAlerts: SafetyAlert[];
  adminAddAlert: (alert: Omit<SafetyAlert, 'id' | 'timestamp' | 'status'>) => void;
  adminResolveAlert: (id: string) => void;

  emergencyServices: EmergencyService[];
  lessons: SafetyLesson[];
  toggleLessonChecklist: (lessonId: string, checklistId: string) => void;
  toggleLessonCompleted: (lessonId: string) => void;

  emergencyEvents: EmergencyEvent[];
  auditLogs: SystemAuditLog[];

  // App & Device Settings
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  resetDemoData: () => void;
  simulateDeviceFrame: boolean;
  toggleDeviceFrame: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // Feedback & Toasts
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Audio cue
  playChime: (type: 'beep' | 'alarm' | 'success' | 'click') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Settings
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('safesphere_theme') === 'dark';
  });
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [simulateDeviceFrame, setSimulateDeviceFrame] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Auth & Onboarding
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('safesphere_onboarded') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUser);

  // SOS
  const [isSosCountingDown, setIsSosCountingDown] = useState<boolean>(false);
  const [sosCountdownSeconds, setSosCountdownSeconds] = useState<number>(3);
  const [isSosEmergencyActive, setIsSosEmergencyActive] = useState<boolean>(false);
  const [activeSosEvent, setActiveSosEvent] = useState<EmergencyEvent | null>(null);

  // Location Sharing
  const [isSharingLocation, setIsSharingLocation] = useState<boolean>(true);
  const [sharingDurationMinutes, setSharingDurationMinutes] = useState<number>(60);
  const [sharingExpiresAt, setSharingExpiresAt] = useState<number | null>(() => Date.now() + 60 * 60 * 1000);
  const [sharedContactIds, setSharedContactIds] = useState<string[]>(['ct_01', 'ct_02', 'ct_04']);

  // Check In
  const [activeCheckIn, setActiveCheckIn] = useState<SafetyCheckInSession | null>(null);
  const [isMissedCheckInModalOpen, setIsMissedCheckInModalOpen] = useState<boolean>(false);

  // Data
  const [contacts, setContacts] = useState<TrustedContact[]>(initialContacts);
  const [incidentReports, setIncidentReports] = useState<SafetyIncidentReport[]>(initialIncidentReports);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>(initialAlerts);
  const [emergencyServices] = useState<EmergencyService[]>(initialEmergencyServices);
  const [lessons, setLessons] = useState<SafetyLesson[]>(initialLessons);
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>(initialEmergencyEvents);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(initialAuditLogs);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark mode effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('safesphere_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('safesphere_theme', 'light');
    }
  }, [isDarkMode]);

  // Audio helper using Web Audio API
  const playChime = (type: 'beep' | 'alarm' | 'success' | 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'beep') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'alarm') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // SOS Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSosCountingDown) {
      playChime('beep');
      interval = setInterval(() => {
        setSosCountdownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setIsSosCountingDown(false);
            activateSosEmergency();
            return 0;
          }
          playChime('beep');
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSosCountingDown]);

  // Check-In timer countdown
  useEffect(() => {
    if (!activeCheckIn || activeCheckIn.status !== 'active') return;

    const interval = setInterval(() => {
      if (Date.now() >= activeCheckIn.expiresAt) {
        clearInterval(interval);
        setActiveCheckIn((prev) => (prev ? { ...prev, status: 'missed' } : null));
        setIsMissedCheckInModalOpen(true);
        playChime('alarm');
        showToast({
          type: 'warning',
          title: 'Scheduled Check-In Expired',
          message: 'Please confirm your safety or your emergency contacts will be notified.',
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCheckIn]);

  // Trigger SOS button
  const triggerSosButton = () => {
    setSosCountdownSeconds(3);
    setIsSosCountingDown(true);
    setActiveModal('sos_flow');
  };

  const cancelSosCountdown = () => {
    setIsSosCountingDown(false);
    setSosCountdownSeconds(3);
    playChime('click');
    showToast({
      type: 'info',
      title: 'SOS Cancelled',
      message: 'Emergency countdown was halted safely.',
    });
  };

  const activateSosEmergency = () => {
    setIsSosEmergencyActive(true);
    playChime('alarm');
    const newEvent: EmergencyEvent = {
      id: `evt_${Date.now()}`,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      locationAddress: currentUser?.currentLocation?.address || '450 University Ave, Campus District',
      coordinates: currentUser?.currentLocation
        ? { lat: currentUser.currentLocation.lat, lng: currentUser.currentLocation.lng }
        : { lat: 37.7749, lng: -122.4194 },
      dispatchedToContacts: contacts
        .filter((c) => c.priority === 'primary' || c.locationSharingEnabled)
        .map((c) => `${c.name} (${c.relationship})`),
    };
    setActiveSosEvent(newEvent);
    setEmergencyEvents((prev) => [newEvent, ...prev]);

    // Add audit log
    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actor: currentUser?.name || 'User',
        action: 'EMERGENCY SOS ACTIVATED',
        details: `Alert dispatched to ${newEvent.dispatchedToContacts.length} trusted contacts with live GPS coordinates.`,
      },
      ...prev,
    ]);

    showToast({
      type: 'emergency',
      title: 'Emergency SOS Activated',
      message: `Location and emergency distress alert sent to ${newEvent.dispatchedToContacts.length} trusted contacts.`,
    });
  };

  const resolveEmergency = (reason: string) => {
    setIsSosEmergencyActive(false);
    if (activeSosEvent) {
      const resolved = {
        ...activeSosEvent,
        status: 'resolved' as const,
        endedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cancellationReason: reason,
      };
      setActiveSosEvent(null);
      setEmergencyEvents((prev) => prev.map((e) => (e.id === resolved.id ? resolved : e)));
    }
    setActiveModal(null);
    playChime('success');
    showToast({
      type: 'success',
      title: 'Emergency Resolved',
      message: 'Safety status confirmed. Your trusted contacts have been notified you are safe.',
    });
  };

  // Location Sharing actions
  const startLocationSharing = (durationMinutes: number, contactIds?: string[]) => {
    setIsSharingLocation(true);
    setSharingDurationMinutes(durationMinutes);
    const expires = durationMinutes > 0 ? Date.now() + durationMinutes * 60 * 1000 : null;
    setSharingExpiresAt(expires);
    if (contactIds) {
      setSharedContactIds(contactIds);
    }
    playChime('success');
    showToast({
      type: 'success',
      title: 'Live Location Sharing Active',
      message: `Your real-time coordinates are being shared for ${durationMinutes === 0 ? 'until stopped' : `${durationMinutes} minutes`}.`,
    });
  };

  const stopLocationSharing = () => {
    setIsSharingLocation(false);
    setSharingExpiresAt(null);
    playChime('click');
    showToast({
      type: 'info',
      title: 'Location Sharing Stopped',
      message: 'Private location access has been terminated.',
    });
  };

  // Safety Check-In
  const startCheckIn = (durationMinutes: number, note?: string) => {
    const session: SafetyCheckInSession = {
      id: `chk_${Date.now()}`,
      startedAt: Date.now(),
      durationMinutes,
      expiresAt: Date.now() + durationMinutes * 60 * 1000,
      status: 'active',
      notifyContactsOnMissed: true,
      note,
    };
    setActiveCheckIn(session);
    playChime('success');
    showToast({
      type: 'success',
      title: 'Safety Check-In Scheduled',
      message: `Timer set for ${durationMinutes} minutes. You will receive a prompt to verify your status.`,
    });
  };

  const confirmCheckInSafe = () => {
    setActiveCheckIn(null);
    setIsMissedCheckInModalOpen(false);
    playChime('success');
    showToast({
      type: 'success',
      title: 'Status Confirmed Safe',
      message: 'Your safety status has been verified and recorded.',
    });
  };

  const cancelCheckIn = () => {
    setActiveCheckIn(null);
    setIsMissedCheckInModalOpen(false);
    playChime('click');
    showToast({
      type: 'info',
      title: 'Check-In Timer Cancelled',
      message: 'Scheduled check-in ended by user.',
    });
  };

  const dismissMissedCheckIn = () => {
    setIsMissedCheckInModalOpen(false);
    confirmCheckInSafe();
  };

  // Contacts
  const addContact = (contactData: Omit<TrustedContact, 'id' | 'status'>) => {
    const newContact: TrustedContact = {
      ...contactData,
      id: `ct_${Date.now()}`,
      status: 'connected',
      lastPingTime: 'Just now',
    };
    setContacts((prev) => [newContact, ...prev]);
    playChime('success');
    showToast({
      type: 'success',
      title: 'Contact Added',
      message: `${newContact.name} is now connected to your safety circle.`,
    });
  };

  const updateContact = (id: string, updates: Partial<TrustedContact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast({
      type: 'info',
      title: 'Contact Updated',
      message: 'Safety preferences saved.',
    });
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    showToast({
      type: 'info',
      title: 'Contact Removed',
      message: 'Contact was removed from your safety circle.',
    });
  };

  const sendContactPing = (id: string) => {
    const target = contacts.find((c) => c.id === id);
    if (!target) return;
    playChime('beep');
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, lastPingTime: 'Just now' } : c))
    );
    showToast({
      type: 'success',
      title: 'Safety Ping Dispatched',
      message: `Test connection and location status sent to ${target.name} (${target.phone}).`,
    });
  };

  // Incident Reports
  const submitIncidentReport = (
    reportData: Omit<SafetyIncidentReport, 'id' | 'timestamp' | 'confirmations' | 'outdatedReports' | 'flags' | 'status' | 'userId' | 'userName'>
  ) => {
    const newReport: SafetyIncidentReport = {
      ...reportData,
      id: `inc_${Date.now()}`,
      userId: currentUser?.id || 'usr_guest',
      userName: currentUser?.name || 'Community Member',
      timestamp: 'Just now',
      status: 'pending', // Pending review by moderator
      confirmations: 1,
      outdatedReports: 0,
      flags: 0,
    };
    setIncidentReports((prev) => [newReport, ...prev]);
    playChime('success');
    showToast({
      type: 'success',
      title: 'Report Submitted',
      message: 'Thank you. Your report is now posted for community verification and official review.',
    });
  };

  const confirmIncidentReport = (id: string) => {
    setIncidentReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, confirmations: r.confirmations + 1 } : r))
    );
    playChime('click');
    showToast({
      type: 'info',
      title: 'Report Confirmed',
      message: 'Your confirmation helps other citizens stay informed.',
    });
  };

  const markIncidentOutdated = (id: string) => {
    setIncidentReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, outdatedReports: r.outdatedReports + 1 } : r))
    );
    showToast({
      type: 'info',
      title: 'Feedback Recorded',
      message: 'Marked as potentially resolved or outdated.',
    });
  };

  const flagIncidentReport = (id: string) => {
    setIncidentReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, flags: r.flags + 1 } : r))
    );
    showToast({
      type: 'warning',
      title: 'Report Flagged',
      message: 'Our moderation team will review this report for guideline compliance.',
    });
  };

  const adminVerifyReport = (id: string, approve: boolean) => {
    setIncidentReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: approve ? 'verified' : 'rejected' } : r
      )
    );
    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actor: 'Admin Moderator',
        action: approve ? 'Report Verified' : 'Report Rejected',
        details: `Incident ID ${id} was marked as ${approve ? 'VERIFIED' : 'REJECTED'}.`,
      },
      ...prev,
    ]);
    showToast({
      type: approve ? 'success' : 'info',
      title: approve ? 'Report Verified' : 'Report Rejected',
      message: `Status updated for community feed.`,
    });
  };

  // Alerts
  const adminAddAlert = (alertData: Omit<SafetyAlert, 'id' | 'timestamp' | 'status'>) => {
    const newAlert: SafetyAlert = {
      ...alertData,
      id: `alt_${Date.now()}`,
      timestamp: 'Just now',
      status: 'active',
    };
    setSafetyAlerts((prev) => [newAlert, ...prev]);
    showToast({
      type: 'warning',
      title: 'Official Alert Published',
      message: `${newAlert.title} has been broadcast to all users in the area.`,
    });
  };

  const adminResolveAlert = (id: string) => {
    setSafetyAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
    showToast({
      type: 'info',
      title: 'Alert Resolved',
      message: 'Alert marked as resolved.',
    });
  };

  // Safety Lessons
  const toggleLessonChecklist = (lessonId: string, checklistId: string) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id !== lessonId) return l;
        const updatedChecklist = l.checklist.map((item) =>
          item.id === checklistId ? { ...item, completed: !item.completed } : item
        );
        const allCompleted = updatedChecklist.every((c) => c.completed);
        return {
          ...l,
          checklist: updatedChecklist,
          isCompleted: allCompleted,
        };
      })
    );
  };

  const toggleLessonCompleted = (lessonId: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, isCompleted: !l.isCompleted } : l))
    );
    playChime('success');
  };

  // Onboarding & Auth
  const completeOnboarding = (asGuest = false) => {
    setHasSeenOnboarding(true);
    localStorage.setItem('safesphere_onboarded', 'true');
    if (asGuest) {
      loginAsGuest();
    }
    showToast({
      type: 'success',
      title: 'Welcome to Public Safety System',
      message: 'Your personal safety network is ready.',
    });
  };

  const resetOnboarding = () => {
    setHasSeenOnboarding(false);
    localStorage.removeItem('safesphere_onboarded');
  };

  const login = (email: string, name?: string) => {
    setCurrentUser({
      ...initialUser,
      email,
      name: name || email.split('@')[0],
      isGuest: false,
    });
    setActiveModal(null);
    showToast({
      type: 'success',
      title: 'Signed In',
      message: `Welcome back, ${name || email.split('@')[0]}!`,
    });
  };

  const loginAsGuest = () => {
    setCurrentUser({
      ...initialUser,
      id: 'usr_guest',
      name: 'Guest Traveler',
      email: 'guest@safesphere.local',
      isGuest: true,
    });
    setActiveModal(null);
    showToast({
      type: 'info',
      title: 'Guest Mode Active',
      message: 'Emergency features and local alerts are fully accessible.',
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveModal('auth');
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out of Public Safety System.',
    });
  };

  // App Toggles
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      showToast({
        type: 'info',
        title: next ? 'Demo Mode Enabled' : 'Demo Mode Disabled',
        message: next
          ? 'Sample alerts and verified community reports are visible.'
          : 'Live production mode simulation active.',
      });
      return next;
    });
  };

  const resetDemoData = () => {
    setContacts(initialContacts);
    setIncidentReports(initialIncidentReports);
    setSafetyAlerts(initialAlerts);
    setLessons(initialLessons);
    setEmergencyEvents(initialEmergencyEvents);
    setAuditLogs(initialAuditLogs);
    showToast({
      type: 'success',
      title: 'Demo Data Reset',
      message: 'All contacts, alerts, reports, and logs restored to initial state.',
    });
  };

  const toggleDeviceFrame = () => setSimulateDeviceFrame((prev) => !prev);
  const toggleSound = () => setSoundEnabled((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        activeModal,
        setActiveModal,
        hasSeenOnboarding,
        completeOnboarding,
        resetOnboarding,
        currentUser,
        setCurrentUser,
        login,
        loginAsGuest,
        logout,

        isSosCountingDown,
        sosCountdownSeconds,
        isSosEmergencyActive,
        activeSosEvent,
        triggerSosButton,
        cancelSosCountdown,
        resolveEmergency,

        isSharingLocation,
        sharingExpiresAt,
        sharingDurationMinutes,
        sharedContactIds,
        startLocationSharing,
        stopLocationSharing,

        activeCheckIn,
        isMissedCheckInModalOpen,
        startCheckIn,
        confirmCheckInSafe,
        cancelCheckIn,
        dismissMissedCheckIn,

        contacts,
        addContact,
        updateContact,
        deleteContact,
        sendContactPing,

        incidentReports,
        submitIncidentReport,
        confirmIncidentReport,
        markIncidentOutdated,
        flagIncidentReport,
        adminVerifyReport,

        safetyAlerts,
        adminAddAlert,
        adminResolveAlert,

        emergencyServices,
        lessons,
        toggleLessonChecklist,
        toggleLessonCompleted,

        emergencyEvents,
        auditLogs,

        isDarkMode,
        toggleDarkMode,
        isDemoMode,
        toggleDemoMode,
        resetDemoData,
        simulateDeviceFrame,
        toggleDeviceFrame,
        soundEnabled,
        toggleSound,

        toasts,
        showToast,
        removeToast,
        playChime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
