export type SafetyStatus = 'safe' | 'monitoring' | 'emergency';

export type ContactPriority = 'primary' | 'secondary' | 'notify_only';

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  priority: ContactPriority;
  locationSharingEnabled: boolean;
  status: 'connected' | 'pending' | 'offline';
  lastPingTime?: string;
}

export interface EmergencyInfo {
  bloodType: string;
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  organDonor: boolean;
  preferredHospital: string;
  emergencyInstructions: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGuest: boolean;
  avatarUrl?: string;
  emergencyInfo: EmergencyInfo;
  locationSharingActive: boolean;
  locationSharingUntil?: number; // timestamp
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export type IncidentCategory =
  | 'road_hazard'
  | 'accident'
  | 'fire'
  | 'suspicious'
  | 'unsafe_area'
  | 'missing_person'
  | 'medical'
  | 'other';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SafetyIncidentReport {
  id: string;
  userId: string;
  userName: string;
  category: IncidentCategory;
  title: string;
  description: string;
  locationAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  severity: IncidentSeverity;
  photoUrl?: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
  confirmations: number;
  outdatedReports: number;
  flags: number;
}

export type AlertSeverity = 'advisory' | 'warning' | 'critical';

export interface SafetyAlert {
  id: string;
  title: string;
  type: string;
  area: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  severity: AlertSeverity;
  source: string;
  isOfficial: boolean;
  status: 'active' | 'resolved' | 'monitoring';
  description: string;
  recommendedActions: string[];
}

export type EmergencyServiceCategory =
  | 'hospital'
  | 'police'
  | 'fire_station'
  | 'urgent_care'
  | 'campus_security';

export interface EmergencyService {
  id: string;
  name: string;
  category: EmergencyServiceCategory;
  distanceMiles: number;
  address: string;
  phone: string;
  isOpen24Hours: boolean;
  operatingHours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface SafetyLesson {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  coverImage?: string;
  whatToDo: string[];
  whatToAvoid: string[];
  checklist: ChecklistItem[];
  isCompleted: boolean;
}

export interface SafetyCheckInSession {
  id: string;
  startedAt: number;
  durationMinutes: number;
  expiresAt: number;
  status: 'active' | 'completed' | 'missed' | 'cancelled';
  notifyContactsOnMissed: boolean;
  note?: string;
}

export interface EmergencyEvent {
  id: string;
  startedAt: string;
  endedAt?: string;
  status: 'active' | 'cancelled' | 'resolved';
  locationAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dispatchedToContacts: string[];
  cancellationReason?: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}
