import React, { useState } from 'react';
import {
  Check,
  ChevronLeft,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Radio,
  Send,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContactPriority, TrustedContact } from '../../types';

export const TrustedContactsView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    sendContactPing,
    isSharingLocation,
    playChime,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Family Member',
    phone: '',
    email: '',
    priority: 'primary' as ContactPriority,
    locationSharingEnabled: true,
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      relationship: 'Family Member',
      phone: '',
      email: '',
      priority: 'primary',
      locationSharingEnabled: true,
    });
    setEditingContact(null);
    setIsAddModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingContact) {
      updateContact(editingContact.id, formData);
    } else {
      addContact(formData);
    }
    setIsAddModalOpen(false);
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
              Trusted Contacts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The circle alerted when you trigger SOS or safety check-ins
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Info card */}
      <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 text-xs text-sky-900 dark:text-sky-200 flex items-start gap-3">
        <Shield className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
        <div className="leading-relaxed text-[11px]">
          <strong>Primary contacts</strong> receive high-priority SMS alerts and live GPS tracking immediately upon SOS activation.
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm shrink-0">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {contact.name}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      · {contact.relationship}
                    </span>
                  </div>

                  {/* Priority & status inline text */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                      {contact.priority === 'primary'
                        ? 'Primary Alert'
                        : contact.priority === 'secondary'
                        ? 'Secondary Alert'
                        : 'Notify Only'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {contact.status}
                    </span>
                    {contact.lastPingTime && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Active {contact.lastPingTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => sendContactPing(contact.id)}
                  title="Send Test Safety Ping"
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 font-medium"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send Ping</span>
                </button>
                <button
                  onClick={() => deleteContact(contact.id)}
                  title="Remove Contact"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom details & toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {contact.phone}
                </span>
                {contact.email && (
                  <span className="hidden sm:flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {contact.email}
                  </span>
                )}
              </div>

              {/* Location toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 dark:text-slate-300">
                <span>Location Tracking</span>
                <input
                  type="checkbox"
                  checked={contact.locationSharingEnabled}
                  onChange={(e) =>
                    updateContact(contact.id, { locationSharingEnabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-slate-900 dark:text-white focus:ring-0 focus:ring-offset-0"
                />
              </label>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              No Trusted Contacts Yet
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Add family, friends, or roommates to ensure someone receives emergency alerts.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl"
            >
              Add First Contact
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingContact ? 'Edit Trusted Contact' : 'Add Trusted Contact'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Chen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Relationship
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Partner">Partner</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Roommate">Roommate</option>
                    <option value="Friend">Close Friend</option>
                    <option value="Campus Official">Campus Official</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Alert Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as ContactPriority })
                    }
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="primary">Primary (Instant SMS)</option>
                    <option value="secondary">Secondary (Backup)</option>
                    <option value="notify_only">Notify Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="contact@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Allow Live Location Access
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Contact can view real-time location when sharing is toggled on.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.locationSharingEnabled}
                  onChange={(e) =>
                    setFormData({ ...formData, locationSharingEnabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
