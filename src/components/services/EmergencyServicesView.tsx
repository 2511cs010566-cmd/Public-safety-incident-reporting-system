import React, { useState } from 'react';
import {
  Building2,
  ChevronLeft,
  Flame,
  Hospital,
  List,
  Map,
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
  Search,
  Shield,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmergencyService, EmergencyServiceCategory } from '../../types';

export const EmergencyServicesView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { emergencyServices, showToast, playChime } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = emergencyServices.filter((service) => {
    if (activeCategory !== 'all' && service.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        service.name.toLowerCase().includes(q) ||
        service.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryIcon = (category: EmergencyServiceCategory) => {
    switch (category) {
      case 'hospital':
        return <Hospital className="w-5 h-5 text-rose-500" />;
      case 'police':
        return <Shield className="w-5 h-5 text-sky-500" />;
      case 'fire_station':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'urgent_care':
        return <Stethoscope className="w-5 h-5 text-emerald-500" />;
      case 'campus_security':
        return <Building2 className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleDirections = (service: EmergencyService) => {
    playChime('click');
    showToast({
      type: 'info',
      title: 'Navigation Route Loaded',
      message: `Directing to ${service.name} (${service.distanceMiles} mi). Follow safe main thoroughfares.`,
    });
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
              Nearby Emergency Services
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct hotlines and routing for police, trauma hospitals, and fire rescue
            </p>
          </div>
        </div>

        {/* List / Map view toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'map'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Map view"
          >
            <Map className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by facility name, trauma level, or street..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
        />
      </div>

      {/* Category Filter Pills (Functional Buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Services' },
          { id: 'hospital', label: 'Hospitals' },
          { id: 'police', label: 'Police' },
          { id: 'fire_station', label: 'Fire & Rescue' },
          { id: 'urgent_care', label: 'Urgent Care' },
          { id: 'campus_security', label: 'Campus Safety' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              playChime('click');
              setActiveCategory(cat.id);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors whitespace-nowrap ${
              activeCategory === cat.id
                ? 'border-slate-900 dark:border-white bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Map View Mode */}
      {viewMode === 'map' && (
        <div className="relative w-full h-80 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-4 flex flex-col justify-between">
          {/* SVG Map Canvas */}
          <div className="absolute inset-0 opacity-80 dark:opacity-60 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="srvGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-800" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#srvGrid)" />
              {/* Roads */}
              <path d="M -10 140 L 700 150" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-200/90 dark:text-slate-800/80" />
              <path d="M 240 -10 L 250 500" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200/90 dark:text-slate-800/80" />
            </svg>
          </div>

          <div className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm w-fit text-xs font-semibold">
            Showing {filteredServices.length} Emergency Hotspots
          </div>

          {/* Interactive Pins on Map */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2 my-auto">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white truncate">
                  {getCategoryIcon(service.category)}
                  <span className="truncate">{service.name}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{service.distanceMiles} mi away</span>
                  <a
                    href={`tel:${service.phone}`}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 text-[11px] text-slate-500 bg-white/90 dark:bg-slate-900/90 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            Current Position: 450 University Ave · Tap any facility to navigate.
          </div>
        </div>
      )}

      {/* List View Mode */}
      <div className="space-y-3">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700/60">
                  {getCategoryIcon(service.category)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {service.distanceMiles} miles
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={service.isOpen24Hours ? 'text-emerald-600 font-medium' : 'text-slate-600'}>
                      {service.isOpen24Hours ? 'Open 24/7' : 'Standard Hours'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick direct call */}
              <a
                href={`tel:${service.phone}`}
                onClick={() => playChime('click')}
                className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors shrink-0"
                aria-label={`Call ${service.name}`}
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>

            {/* Address & Hours */}
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{service.address}</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5">
                {service.operatingHours}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-500">
                {service.phone}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDirections(service)}
                  className="py-1.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-500">No emergency facilities found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
