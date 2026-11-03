import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle,
  ChevronLeft,
  Flame,
  Info,
  MapPin,
  Send,
  Shield,
  Upload,
  UserX,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IncidentCategory, IncidentSeverity } from '../../types';

export const IncidentReportingView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { submitIncidentReport, currentUser, setCurrentTab, showToast, playChime } = useApp();

  const [category, setCategory] = useState<IncidentCategory>('road_hazard');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationAddress, setLocationAddress] = useState(
    currentUser?.currentLocation?.address || 'Near 450 University Ave, Campus District'
  );
  const [severity, setSeverity] = useState<IncidentSeverity>('medium');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: { id: IncidentCategory; label: string; icon: string }[] = [
    { id: 'road_hazard', label: 'Road Hazard', icon: '⚠️' },
    { id: 'accident', label: 'Accident', icon: '🚗' },
    { id: 'fire', label: 'Fire Hazard', icon: '🔥' },
    { id: 'suspicious', label: 'Suspicious Activity', icon: '👁️' },
    { id: 'unsafe_area', label: 'Unsafe Area', icon: '💡' },
    { id: 'missing_person', label: 'Missing Person', icon: '🔍' },
    { id: 'medical', label: 'Medical Issue', icon: '🚑' },
    { id: 'other', label: 'Other Hazard', icon: '📍' },
  ];

  const handleUseCurrentGps = () => {
    playChime('click');
    setLocationAddress(currentUser?.currentLocation?.address || 'Current Device Coordinates (37.7749° N, -122.4194° W)');
    showToast({
      type: 'info',
      title: 'Current Location Inserted',
      message: 'Coordinates attached from device sensor.',
    });
  };

  const handleSimulatePhotoUpload = () => {
    playChime('click');
    // Simulated safety incident photo
    setPhotoPreview('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80');
    showToast({
      type: 'info',
      title: 'Photo Attached',
      message: 'Photo attachment simulated for this report.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !locationAddress) {
      showToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please complete all required fields before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitIncidentReport({
        category,
        title,
        description,
        locationAddress,
        coordinates: currentUser?.currentLocation
          ? { lat: currentUser.currentLocation.lat, lng: currentUser.currentLocation.lng }
          : { lat: 37.7749, lng: -122.4194 },
        severity,
        photoUrl: photoPreview || undefined,
      });
      setIsSubmitting(false);
      setCurrentTab('alerts');
    }, 400);
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
              Report Safety Incident
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submit community awareness reports to alert neighbors and public safety
            </p>
          </div>
        </div>
      </div>

      {/* Critical Verification Policy Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="leading-relaxed text-[11px] space-y-1">
          <p>
            <strong>Community Awareness Only:</strong> Reports submitted here appear initially as{' '}
            <span className="font-semibold underline">Community Reports (Unverified)</span> until vetted by administrators.
          </p>
          <p className="text-amber-800/90 dark:text-amber-300/90">
            Never attempt vigilante actions or confront individuals. For crimes in progress or life-threatening events, immediately call <strong>911</strong>.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        {/* Category Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
            1. Select Incident Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  playChime('click');
                  setCategory(cat.id);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  category === cat.id
                    ? 'border-slate-900 dark:border-white bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span className="text-xs font-semibold truncate">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
            2. Severity Assessment *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'low', label: 'Low', desc: 'Minor inconvenience' },
              { id: 'medium', label: 'Medium', desc: 'Caution advised' },
              { id: 'high', label: 'High', desc: 'Dangerous hazard' },
              { id: 'critical', label: 'Critical', desc: 'Immediate threat' },
            ].map((sev) => (
              <button
                key={sev.id}
                type="button"
                onClick={() => {
                  playChime('click');
                  setSeverity(sev.id as IncidentSeverity);
                }}
                className={`p-2 rounded-xl border text-center transition-all ${
                  severity === sev.id
                    ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white ring-1 ring-slate-900 dark:ring-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <span className="block text-xs uppercase tracking-wide">{sev.label}</span>
                <span className="text-[10px] text-slate-500 hidden sm:block truncate mt-0.5">
                  {sev.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
            3. Brief Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Fallen tree branch blocking pedestrian walkway"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
          />
        </div>

        {/* Location with auto-fill */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-900 dark:text-white">
              4. Incident Location *
            </label>
            <button
              type="button"
              onClick={handleUseCurrentGps}
              className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-medium"
            >
              <MapPin className="w-3 h-3 text-rose-500" />
              <span>Use Current GPS</span>
            </button>
          </div>
          <input
            type="text"
            required
            placeholder="Street address, cross-streets, or landmark"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
            5. Detailed Description *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe what you observed, affected lanes, estimated size, or recommended detours..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white resize-none"
          />
        </div>

        {/* Photo attachment simulation */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
            6. Evidence Photo (Optional)
          </label>
          {photoPreview ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 w-full h-32 bg-slate-100 dark:bg-slate-800">
              <img
                src={photoPreview}
                alt="Uploaded incident"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSimulatePhotoUpload}
              className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <Camera className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-medium">Attach Photo of Hazard</span>
              <span className="text-[10px] text-slate-400">JPG, PNG up to 10MB</span>
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentTab('home')}
            className="flex-1 py-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-2 py-3 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Posting Report...' : 'Submit Incident Report'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
