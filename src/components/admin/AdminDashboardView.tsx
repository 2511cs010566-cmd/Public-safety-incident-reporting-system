import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  Plus,
  Radio,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AlertSeverity } from '../../types';

export const AdminDashboardView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    incidentReports,
    adminVerifyReport,
    safetyAlerts,
    adminAddAlert,
    adminResolveAlert,
    auditLogs,
    showToast,
    playChime,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'queue' | 'alerts' | 'audit'>('queue');
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);

  // New alert form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Severe Weather Warning');
  const [newArea, setNewArea] = useState('Metro District & Surrounding 5 mi');
  const [newSeverity, setNewSeverity] = useState<AlertSeverity>('warning');
  const [newDescription, setNewDescription] = useState('');
  const [newActionsText, setNewActionsText] = useState('Stay indoors; Avoid flooded corridors; Monitor Public Safety System');

  const pendingReports = incidentReports.filter((r) => r.status === 'pending');
  const verifiedReports = incidentReports.filter((r) => r.status === 'verified');

  const handlePublishAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;

    adminAddAlert({
      title: newTitle,
      type: newType,
      area: newArea,
      coordinates: { lat: 37.7749, lng: -122.4194 },
      severity: newSeverity,
      source: 'Municipal Public Safety Operations',
      isOfficial: true,
      description: newDescription,
      recommendedActions: newActionsText.split(';').map((s) => s.trim()).filter(Boolean),
    });

    setShowNewAlertModal(false);
    playChime('alarm');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                Public Safety Incident Dispatch & Moderation Console
              </h2>
              <p className="text-[11px] text-slate-400">
                Official review queue, verification authority, and broadcast alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="px-5 pt-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveAdminTab('queue')}
              className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeAdminTab === 'queue'
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Citizen Reports Queue</span>
              {pendingReports.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {pendingReports.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('alerts')}
              className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeAdminTab === 'alerts'
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Official Broadcasts</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('audit')}
              className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeAdminTab === 'audit'
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>System Activity Audit</span>
            </button>
          </div>

          {activeAdminTab === 'alerts' && (
            <button
              onClick={() => setShowNewAlertModal(true)}
              className="py-1 px-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Broadcast Official Alert</span>
            </button>
          )}
        </div>

        {/* Tab 1: Moderation Queue */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeAdminTab === 'queue' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
                <strong>Verification Mandate:</strong> In accordance with public safety protocols, user-submitted reports are strictly treated as unverified community observations until physical inspection, camera validation, or multi-source confirmation.
              </div>

              <div className="space-y-3">
                {incidentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase text-slate-700 dark:text-slate-300">
                          {report.category.replace('_', ' ')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            report.status === 'verified'
                              ? 'text-emerald-600 font-bold'
                              : report.status === 'rejected'
                              ? 'text-rose-600 font-bold'
                              : 'text-amber-600 font-bold'
                          }
                        >
                          {report.status.toUpperCase()}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">{report.timestamp}</span>
                      </div>

                      <span className="text-slate-400">Reporter: {report.userName}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {report.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        {report.description}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Location: {report.locationAddress}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-500 font-mono text-[11px]">
                        Community Confirmations: {report.confirmations} · Flags: {report.flags}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => adminVerifyReport(report.id, false)}
                          className="py-1 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-colors"
                        >
                          Reject / Dismiss
                        </button>
                        <button
                          onClick={() => adminVerifyReport(report.id, true)}
                          className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                        >
                          Verify & Broadcast
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Official Alerts */}
          {activeAdminTab === 'alerts' && (
            <div className="space-y-3">
              {safetyAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-rose-600 uppercase">{alert.severity}</span>
                    <span className="text-slate-400">{alert.timestamp}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-slate-400">Area: {alert.area}</span>
                    {alert.status === 'active' ? (
                      <button
                        onClick={() => adminResolveAlert(alert.id)}
                        className="py-1 px-2.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-medium"
                      >
                        Mark as Resolved
                      </button>
                    ) : (
                      <span className="text-slate-400 font-medium">Resolved</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: System Audit Log */}
          {activeAdminTab === 'audit' && (
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-sans">{log.details}</p>
                  <p className="text-[10px] text-slate-400">Actor: {log.actor}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publish Alert Modal */}
        {showNewAlertModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-rose-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Publish Official Public Safety Broadcast
                </h3>
                <button
                  onClick={() => setShowNewAlertModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePublishAlert} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Alert Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chemical Vapor Leak Exclusion Zone"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Severity
                    </label>
                    <select
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value as AlertSeverity)}
                      className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="advisory">Advisory</option>
                      <option value="warning">Warning</option>
                      <option value="critical">Critical Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Affected Area
                    </label>
                    <input
                      type="text"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Alert Description
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mandatory Actions (Semicolon separated)
                  </label>
                  <input
                    type="text"
                    value={newActionsText}
                    onChange={(e) => setNewActionsText(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAlertModal(false)}
                    className="flex-1 py-2 text-xs text-slate-600 dark:text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                  >
                    Transmit Broadcast
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
