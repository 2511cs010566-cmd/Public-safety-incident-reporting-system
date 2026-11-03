import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  ChevronRight,
  Clock,
  Heart,
  HelpCircle,
  History,
  Lock,
  LogOut,
  MapPin,
  RefreshCw,
  RotateCcw,
  Save,
  Shield,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    logout,
    resetOnboarding,
    resetDemoData,
    emergencyEvents,
    incidentReports,
    lessons,
    showToast,
    playChime,
  } = useApp();

  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Form state for ICE
  const [bloodType, setBloodType] = useState(currentUser?.emergencyInfo.bloodType || 'O+');
  const [allergiesText, setAllergiesText] = useState(
    currentUser?.emergencyInfo.allergies.join(', ') || ''
  );
  const [medsText, setMedsText] = useState(
    currentUser?.emergencyInfo.medications.join(', ') || ''
  );
  const [instructions, setInstructions] = useState(
    currentUser?.emergencyInfo.emergencyInstructions || ''
  );
  const [preferredHospital, setPreferredHospital] = useState(
    currentUser?.emergencyInfo.preferredHospital || ''
  );

  const completedLessons = lessons.filter((l) => l.isCompleted).length;

  const handleSaveMedical = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      emergencyInfo: {
        ...currentUser.emergencyInfo,
        bloodType,
        allergies: allergiesText.split(',').map((s) => s.trim()).filter(Boolean),
        medications: medsText.split(',').map((s) => s.trim()).filter(Boolean),
        emergencyInstructions: instructions,
        preferredHospital,
      },
    });

    setIsEditingMedical(false);
    playChime('success');
    showToast({
      type: 'success',
      title: 'Medical Card Saved',
      message: 'Emergency responders will have access to your critical medical instructions.',
    });
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Safety Profile & ICE
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personal identification, emergency medical card, and privacy governance
        </p>
      </div>

      {/* User Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-base shrink-0 border border-slate-200 dark:border-slate-700">
            {currentUser?.isGuest ? 'G' : currentUser?.name.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentUser?.name || 'Guest User'}
              </h2>
              {currentUser?.isGuest && (
                <span className="text-[10px] text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                  Guest Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {currentUser?.email || 'guest@safesphere.local'} · {currentUser?.phone || 'No phone'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 text-xs text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1 font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      {/* IN CASE OF EMERGENCY (ICE) MEDICAL INFORMATION */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              In Case of Emergency (ICE) Medical Card
            </h3>
          </div>
          <button
            onClick={() => setIsEditingMedical(!isEditingMedical)}
            className="text-xs font-semibold text-slate-900 dark:text-white hover:underline"
          >
            {isEditingMedical ? 'Cancel' : 'Edit Medical Card'}
          </button>
        </div>

        {/* Privacy Note */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
          <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
          <span>
            Sensitive medical details are optional and stored strictly on your local device. In an SOS event, this card is visible to first responders on your emergency lock screen.
          </span>
        </div>

        {isEditingMedical ? (
          <form onSubmit={handleSaveMedical} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Blood Type
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Hospital
                </label>
                <input
                  type="text"
                  placeholder="e.g. St. Jude General"
                  value={preferredHospital}
                  onChange={(e) => setPreferredHospital(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Known Allergies (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Peanuts, Latex"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Active Medications (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Albuterol Inhaler, Insulin"
                value={medsText}
                onChange={(e) => setMedsText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Emergency Instructions for Paramedics
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Inhaler in outer backpack pocket; patient carries EpiPen."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Medical Information</span>
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Blood Type</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                {currentUser?.emergencyInfo.bloodType || 'Not specified'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Allergies</span>
              <span className="text-xs font-medium text-slate-900 dark:text-white mt-0.5 block truncate">
                {currentUser?.emergencyInfo.allergies.join(', ') || 'None reported'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Medications</span>
              <span className="text-xs font-medium text-slate-900 dark:text-white mt-0.5 block truncate">
                {currentUser?.emergencyInfo.medications.join(', ') || 'None'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Organ Donor</span>
              <span className="text-xs font-bold text-emerald-600 mt-0.5 block">
                {currentUser?.emergencyInfo.organDonor ? 'Yes (Registered)' : 'No'}
              </span>
            </div>

            {currentUser?.emergencyInfo.emergencyInstructions && (
              <div className="col-span-2 sm:col-span-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-0.5">
                  Responder Instructions
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {currentUser.emergencyInfo.emergencyInstructions}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats & History Summary */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
            {emergencyEvents.length}
          </span>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block mt-0.5">
            SOS Events
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
            {incidentReports.length}
          </span>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block mt-0.5">
            Reports Filed
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
            {completedLessons}/{lessons.length}
          </span>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block mt-0.5">
            Lessons Done
          </span>
        </div>
      </div>

      {/* Safety History Log */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
          <History className="w-4 h-4 text-slate-500" />
          Recent Emergency & SOS History
        </h3>

        <div className="space-y-2">
          {emergencyEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {evt.status === 'resolved' ? 'Resolved Event' : 'Active Event'}
                </span>
                <span>{evt.startedAt}</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {evt.locationAddress}
              </p>
              {evt.cancellationReason && (
                <p className="text-[11px] text-slate-500 italic">
                  Note: {evt.cancellationReason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings & Prototype Tools */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <button
          onClick={resetOnboarding}
          className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left flex items-center justify-between text-slate-700 dark:text-slate-300"
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-slate-400" />
            Replay First-Launch Onboarding
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={resetDemoData}
          className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left flex items-center justify-between text-slate-700 dark:text-slate-300"
        >
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-slate-400" />
            Reset Prototype Demo Data
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2 text-[11px] text-slate-500">
          <button
            onClick={() => setShowPrivacyPolicy(true)}
            className="hover:underline"
          >
            Privacy Policy
          </button>
          <span>·</span>
          <button
            onClick={() => setShowTerms(true)}
            className="hover:underline"
          >
            Terms of Service
          </button>
          <span>·</span>
          <span>Public Safety Reporting System v2.4 (Prototype)</span>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Public Safety Reporting System Privacy Policy
              </h3>
              <button
                onClick={() => setShowPrivacyPolicy(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>1. Data Minimization:</strong> This public safety reporting system collects only the coordinates and identifiers strictly necessary to provide emergency alerting and live dispatch.
              </p>
              <p>
                <strong>2. Location Privacy:</strong> Your live GPS location is never shared without your explicit action (SOS activation or scheduled Live Location Sharing). Sharing automatically expires after the selected duration.
              </p>
              <p>
                <strong>3. No Sale of Personal Data:</strong> We do not sell, rent, or commercialize user movement data, emergency contacts, or incident reporting records to third parties or data brokers.
              </p>
              <p>
                <strong>4. ICE Medical Information:</strong> Medical data is encrypted on device and only presented during high-priority emergency states for first responders.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyPolicy(false)}
              className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl"
            >
              Close Privacy Policy
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Terms of Emergency Service
              </h3>
              <button
                onClick={() => setShowTerms(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>Critical Emergency Notice:</strong> The Public Safety Reporting System is an emergency peer-support companion platform. It is <strong>NOT</strong> a certified 911 Public Safety Answering Point (PSAP) and cannot guarantee emergency service response times or dispatch availability.
              </p>
              <p>
                In any immediate life-threatening danger, criminal act in progress, medical crisis, or active fire, you must dial <strong>911</strong> or local emergency telephone authorities directly.
              </p>
              <p>
                <strong>Community Reporting Guidelines:</strong> Users agree not to post fabricated alerts, libelous statements, or attempt vigilante enforcement.
              </p>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
