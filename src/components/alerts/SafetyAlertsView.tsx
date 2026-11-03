import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Filter,
  Flag,
  Info,
  MapPin,
  Radio,
  RefreshCw,
  Shield,
  ThumbsUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafetyAlert, SafetyIncidentReport } from '../../types';

export const SafetyAlertsView: React.FC = () => {
  const {
    safetyAlerts,
    incidentReports,
    confirmIncidentReport,
    markIncidentOutdated,
    flagIncidentReport,
    setCurrentTab,
    playChime,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'official' | 'community' | 'critical'>('all');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  // Filter logic
  const filteredAlerts = safetyAlerts.filter((alert) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'official') return alert.isOfficial;
    if (activeTab === 'community') return !alert.isOfficial;
    if (activeTab === 'critical') return alert.severity === 'critical';
    return true;
  });

  const filteredIncidents = incidentReports.filter((inc) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'official') return false; // community reports only
    if (activeTab === 'community') return true;
    if (activeTab === 'critical') return inc.severity === 'critical' || inc.severity === 'high';
    return true;
  });

  const toggleExpand = (id: string) => {
    playChime('click');
    setExpandedAlertId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Safety Alert Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time verified bulletins and crowd-sourced community hazard notifications
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('report')}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
        >
          + Report Issue
        </button>
      </div>

      {/* Filter Tabs (Functional segmented buttons per design constitution) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Updates' },
          { id: 'official', label: 'Official Verified' },
          { id: 'community', label: 'Community Feed' },
          { id: 'critical', label: 'Critical Only' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              playChime('click');
              setActiveTab(tab.id as typeof activeTab);
            }}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Official Verified Alerts Section */}
      {filteredAlerts.length > 0 && activeTab !== 'community' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              Official Public Safety Bulletins
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              {filteredAlerts.length} Active
            </span>
          </div>

          {filteredAlerts.map((alert) => {
            const isExpanded = expandedAlertId === alert.id;
            return (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-3"
              >
                {/* Unboxed clean metadata header */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono">
                    <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-[10px]">
                      {alert.severity}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      VERIFIED OFFICIAL
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{alert.timestamp}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    {alert.source}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                {/* Location unboxed line */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{alert.area}</span>
                </div>

                {/* Expandable Recommended Actions */}
                {isExpanded && alert.recommendedActions && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Recommended Actions & Safety Instructions:
                    </h4>
                    <ul className="space-y-1.5">
                      {alert.recommendedActions.map((action, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2"
                        >
                          <span className="text-rose-500 font-bold shrink-0">›</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Card footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Source: {alert.source}
                  </span>
                  <button
                    onClick={() => toggleExpand(alert.id)}
                    className="text-xs font-semibold text-slate-900 dark:text-white hover:underline flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Actions' : 'View Safety Guidance'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Community Reports Feed Section */}
      {activeTab !== 'official' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-sky-500" />
              Community Citizen Reports
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              {filteredIncidents.length} Reports
            </span>
          </div>

          {filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              {/* Unboxed Metadata header */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono">
                  <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">
                    {incident.category.replace('_', ' ')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      incident.status === 'verified'
                        ? 'text-emerald-600 font-bold'
                        : 'text-amber-600 font-semibold'
                    }
                  >
                    {incident.status === 'verified' ? 'COMMUNITY VERIFIED' : 'UNVERIFIED REPORT'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{incident.timestamp}</span>
                </div>

                <span className="text-[11px] text-slate-400">By {incident.userName}</span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {incident.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {incident.description}
                </p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{incident.locationAddress}</span>
              </div>

              {/* Community Actions: Confirm, Mark Outdated, Flag */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => confirmIncidentReport(incident.id)}
                    className="py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <ThumbsUp className="w-3 h-3 text-emerald-600" />
                    <span>Confirm ({incident.confirmations})</span>
                  </button>

                  <button
                    onClick={() => markIncidentOutdated(incident.id)}
                    className="py-1 px-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Outdated ({incident.outdatedReports})</span>
                  </button>
                </div>

                <button
                  onClick={() => flagIncidentReport(incident.id)}
                  title="Flag as inappropriate or false"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredIncidents.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-xs text-slate-500">No incident reports found matching this filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
