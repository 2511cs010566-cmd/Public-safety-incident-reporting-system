import {
  EmergencyEvent,
  EmergencyService,
  SafetyAlert,
  SafetyIncidentReport,
  SafetyLesson,
  SystemAuditLog,
  TrustedContact,
  UserProfile,
} from '../types';

export const HERO_IMAGE_URL = '/src/assets/images/safesphere_hero_1791097571617.jpg';
export const FIRST_AID_IMAGE_URL = '/src/assets/images/emergency_firstaid_1791097586779.jpg';

export const initialUser: UserProfile = {
  id: 'usr_safe_01',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@university.edu',
  phone: '+1 (555) 234-8901',
  isGuest: false,
  locationSharingActive: true,
  currentLocation: {
    lat: 37.7749,
    lng: -122.4194,
    address: '450 University Ave, Campus District',
  },
  emergencyInfo: {
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts (Mild)'],
    medications: ['Albuterol Inhaler (as needed)'],
    medicalConditions: ['Mild Asthma'],
    organDonor: true,
    preferredHospital: 'St. Jude Metropolitan Medical Center',
    emergencyInstructions: 'Inhaler is stored in the front outer zipper pocket of my backpack.',
  },
};

export const initialContacts: TrustedContact[] = [
  {
    id: 'ct_01',
    name: 'Elena Vance (Mom)',
    relationship: 'Mother',
    phone: '+1 (555) 349-1122',
    email: 'elena.vance@mail.com',
    priority: 'primary',
    locationSharingEnabled: true,
    status: 'connected',
    lastPingTime: '12m ago',
  },
  {
    id: 'ct_02',
    name: 'Marcus Reed',
    relationship: 'Partner',
    phone: '+1 (555) 892-4411',
    email: 'marcus.reed@mail.com',
    priority: 'primary',
    locationSharingEnabled: true,
    status: 'connected',
    lastPingTime: '25m ago',
  },
  {
    id: 'ct_03',
    name: 'Maya Lin',
    relationship: 'Roommate',
    phone: '+1 (555) 773-0099',
    email: 'maya.lin@university.edu',
    priority: 'secondary',
    locationSharingEnabled: false,
    status: 'connected',
    lastPingTime: '2h ago',
  },
  {
    id: 'ct_04',
    name: 'Campus Safety Escort',
    relationship: 'Public Safety Official',
    phone: '+1 (555) 911-0044',
    email: 'safety-dispatch@university.edu',
    priority: 'notify_only',
    locationSharingEnabled: true,
    status: 'connected',
    lastPingTime: '1h ago',
  },
];

export const initialAlerts: SafetyAlert[] = [
  {
    id: 'alt_01',
    title: 'Flash Flood Watch & Heavy Rain',
    type: 'Weather Advisory',
    area: 'Downtown & Valley Corridors (within 2.5 mi)',
    coordinates: { lat: 37.778, lng: -122.415 },
    timestamp: '18 minutes ago',
    severity: 'warning',
    source: 'National Weather Service',
    isOfficial: true,
    status: 'active',
    description:
      'Rapid runoff and ponding expected on low-lying roads. Creek levels rising near Central Parkway.',
    recommendedActions: [
      'Avoid driving through standing water on 4th & Mission intersection.',
      'Seek higher ground if in subterranean parking structures.',
      'Keep mobile devices charged and monitor system alert stream.',
    ],
  },
  {
    id: 'alt_02',
    title: 'Downed High-Voltage Power Line',
    type: 'Hazard Alert',
    area: 'Maple St & 7th Ave (0.8 mi away)',
    coordinates: { lat: 37.771, lng: -122.423 },
    timestamp: '42 minutes ago',
    severity: 'critical',
    source: 'Municipal Fire & Electric Works',
    isOfficial: true,
    status: 'active',
    description:
      'Live wire on sidewalk following vehicle collision with utility pole. Perimeter cordoned off.',
    recommendedActions: [
      'Maintain at least 35 feet distance from all downed wires.',
      'Do not touch nearby chain-link fences or metallic fixtures.',
      'Follow detour signage routed via 8th Avenue.',
    ],
  },
  {
    id: 'alt_03',
    title: 'Campus Late-Night Escort Shuttles Active',
    type: 'Safety Service',
    area: 'University Quad & Residence Halls',
    coordinates: { lat: 37.776, lng: -122.419 },
    timestamp: '2 hours ago',
    severity: 'advisory',
    source: 'University Safety Administration',
    isOfficial: true,
    status: 'monitoring',
    description:
      'Continuous student walking escorts and on-demand golf cart shuttles available throughout tonight.',
    recommendedActions: [
      'Dial campus dispatch or request an escort in the Services tab.',
      'Always walk in illuminated main pathways after 10:00 PM.',
    ],
  },
];

export const initialIncidentReports: SafetyIncidentReport[] = [
  {
    id: 'inc_01',
    userId: 'usr_289',
    userName: 'David K.',
    category: 'road_hazard',
    title: 'Traffic Signal Blackout at 5th & Pine',
    description:
      'Intersection traffic lights are flashing completely black. Vehicles are failing to yield properly. Four-way stop rules apply.',
    locationAddress: '5th Ave & Pine Street',
    coordinates: { lat: 37.773, lng: -122.417 },
    severity: 'high',
    timestamp: '24 minutes ago',
    status: 'verified',
    confirmations: 14,
    outdatedReports: 0,
    flags: 0,
  },
  {
    id: 'inc_02',
    userId: 'usr_104',
    userName: 'Alicia M.',
    category: 'unsafe_area',
    title: 'Broken Streetlights in North Alleyway',
    description:
      'Entire block from 8th to 9th street has non-functioning overhead lights. Walking alone here is not recommended after dusk.',
    locationAddress: 'North Alleyway between 8th and 9th',
    coordinates: { lat: 37.779, lng: -122.422 },
    severity: 'medium',
    timestamp: '1 hour ago',
    status: 'pending',
    confirmations: 6,
    outdatedReports: 1,
    flags: 0,
  },
  {
    id: 'inc_03',
    userId: 'usr_512',
    userName: 'Carlos R.',
    category: 'accident',
    title: 'Minor Multi-Vehicle Fender Bender',
    description:
      'Right northbound lane blocked on Central Expressway. Emergency tow truck on scene, traffic moving sluggishly.',
    locationAddress: 'Central Expressway at Mile 14',
    coordinates: { lat: 37.769, lng: -122.428 },
    severity: 'low',
    timestamp: '2 hours ago',
    status: 'verified',
    confirmations: 8,
    outdatedReports: 2,
    flags: 0,
  },
];

export const initialEmergencyServices: EmergencyService[] = [
  {
    id: 'srv_01',
    name: 'St. Jude Metropolitan Medical Center',
    category: 'hospital',
    distanceMiles: 0.6,
    address: '890 Healthcare Blvd, Metro Central',
    phone: '+1 (555) 800-4400',
    isOpen24Hours: true,
    operatingHours: '24/7 Level 1 Trauma & Emergency',
    coordinates: { lat: 37.778, lng: -122.412 },
  },
  {
    id: 'srv_02',
    name: 'District 3 Police Precinct',
    category: 'police',
    distanceMiles: 0.9,
    address: '320 Civic Center Plaza',
    phone: '+1 (555) 922-1000',
    isOpen24Hours: true,
    operatingHours: '24/7 Desk Patrol & Public Assistance',
    coordinates: { lat: 37.772, lng: -122.426 },
  },
  {
    id: 'srv_03',
    name: 'Station 14 Fire & Rescue',
    category: 'fire_station',
    distanceMiles: 1.2,
    address: '512 Oakwood Ave',
    phone: '+1 (555) 744-9911',
    isOpen24Hours: true,
    operatingHours: '24/7 Fire, HazMat & Paramedics',
    coordinates: { lat: 37.781, lng: -122.421 },
  },
  {
    id: 'srv_04',
    name: 'University Student Health & Urgent Care',
    category: 'urgent_care',
    distanceMiles: 0.3,
    address: '100 Campus Walk, Student Center East',
    phone: '+1 (555) 321-4567',
    isOpen24Hours: false,
    operatingHours: 'Daily 7:00 AM – 11:00 PM',
    coordinates: { lat: 37.775, lng: -122.418 },
  },
  {
    id: 'srv_05',
    name: 'Campus Safety & Emergency Operations',
    category: 'campus_security',
    distanceMiles: 0.2,
    address: 'Tower Building Suite 101',
    phone: '+1 (555) 911-2233',
    isOpen24Hours: true,
    operatingHours: '24/7 Dispatch, Safe Escorts & Blue Light Network',
    coordinates: { lat: 37.776, lng: -122.42 },
  },
];

export const initialLessons: SafetyLesson[] = [
  {
    id: 'les_01',
    title: 'First Aid Basics: Severe Bleeding & CPR',
    category: 'First Aid Basics',
    readTime: '4 min read',
    summary:
      'Learn the crucial steps of chest compressions, applying direct pressure, and stabilizing an injured individual until medical teams arrive.',
    coverImage: FIRST_AID_IMAGE_URL,
    whatToDo: [
      'Call emergency dispatch immediately before starting first aid if alone.',
      'Apply direct, sustained pressure with sterile gauze or clean cloth over bleeding wounds.',
      'Place hands in the center of the chest and deliver 100-120 compressions per minute for adult CPR.',
      'Keep the patient warm and check responsiveness continuously.',
    ],
    whatToAvoid: [
      'Do not remove impaled objects from wounds; stabilize them in place.',
      'Do not apply direct tourniquets unless trained or bleeding is catastrophic arterial blood.',
      'Do not give food, water, or medication to an unconscious patient.',
    ],
    checklist: [
      { id: 'chk_1', text: 'Locate nearest first aid kit and AED unit', completed: true },
      { id: 'chk_2', text: 'Know emergency contact numbers and local hospital', completed: true },
      { id: 'chk_3', text: 'Practice hands-only CPR cadence to the beat of "Stayin Alive"', completed: false },
    ],
    isCompleted: false,
  },
  {
    id: 'les_02',
    title: 'Disaster Preparedness: Earthquake & Storm Protocol',
    category: 'Disaster Preparedness',
    readTime: '5 min read',
    summary:
      'Protocols for sudden earthquakes, flash floods, and severe weather emergencies when infrastructure may be compromised.',
    coverImage: HERO_IMAGE_URL,
    whatToDo: [
      'Drop, Cover, and Hold On beneath a sturdy desk or table away from exterior glass.',
      'Shut off gas valves if you smell sulfur or hear hissing after seismic movement.',
      'Keep a pre-packed 72-hour emergency go-bag ready near your primary exit.',
      'Designate an out-of-state emergency family contact person.',
    ],
    whatToAvoid: [
      'Never use elevators during or immediately after a seismic or fire event.',
      'Do not stand in doorways; modern doorways are no stronger than standard framing.',
      'Never drive through flooded roadways or touch water near electrical conduits.',
    ],
    checklist: [
      { id: 'chk_4', text: 'Store 1 gallon of potable water per person per day (3-day supply)', completed: false },
      { id: 'chk_5', text: 'Battery or solar-powered emergency radio & extra power bank', completed: false },
      { id: 'chk_6', text: 'Inspect and secure heavy bookshelves to wall studs', completed: true },
    ],
    isCompleted: false,
  },
  {
    id: 'les_03',
    title: 'Personal Safety: Night Travel & Campus Mobility',
    category: 'Personal Safety',
    readTime: '3 min read',
    summary:
      'Practical spatial awareness strategies, using safety check-ins, and requesting verified escorts during nighttime travel.',
    coverImage: HERO_IMAGE_URL,
    whatToDo: [
      'Share your live location with a trusted contact before starting a solo walk.',
      'Set an automated check-in timer for your anticipated arrival time.',
      'Stay on illuminated main avenues and keep one ear free from headphones.',
      'Use campus blue light towers or dispatch escorts when available.',
    ],
    whatToAvoid: [
      'Do not look down at phone screens continuously while walking in unlit corridors.',
      'Never accept rides from unverified vehicles or unofficial rideshare drivers.',
      'Do not hesitate to change direction into an open public business if feeling followed.',
    ],
    checklist: [
      { id: 'chk_7', text: 'Add at least 2 primary trusted contacts to your safety circle', completed: true },
      { id: 'chk_8', text: 'Test an automated 15-minute check-in timer', completed: true },
      { id: 'chk_9', text: 'Save campus escort dispatch in emergency quick-dial', completed: true },
    ],
    isCompleted: true,
  },
  {
    id: 'les_04',
    title: 'Fire Safety & Smoke Inhalation Avoidance',
    category: 'Fire Safety',
    readTime: '4 min read',
    summary:
      'Understanding fire dynamics, PASS extinguisher methodology, and navigating smoke-filled residential corridors.',
    whatToDo: [
      'Feel closed doors with the back of your hand before turning the handle; if warm, do not open.',
      'Crawl low under smoke where cool, breathable air remains near the floor.',
      'Use the PASS method: Pull pin, Aim nozzle, Squeeze lever, Sweep side-to-side.',
      'Close doors behind you as you evacuate to slow fire propagation.',
    ],
    whatToAvoid: [
      'Never re-enter a burning structure to retrieve personal belongings or pets.',
      'Never throw water on kitchen grease or oil fires; use baking soda or metal lid.',
      'Do not ignore persistent chirps from smoke or carbon monoxide detectors.',
    ],
    checklist: [
      { id: 'chk_10', text: 'Map two unobstructed escape routes from your bedroom', completed: false },
      { id: 'chk_11', text: 'Verify fire extinguisher expiration date and pressure gauge', completed: true },
      { id: 'chk_12', text: 'Test smoke alarms monthly and replace batteries annually', completed: false },
    ],
    isCompleted: false,
  },
];

export const initialEmergencyEvents: EmergencyEvent[] = [
  {
    id: 'evt_demo_01',
    startedAt: '3 days ago, 11:42 PM',
    endedAt: '3 days ago, 11:46 PM',
    status: 'resolved',
    locationAddress: '450 University Ave, Campus District',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    dispatchedToContacts: ['Elena Vance (Mom)', 'Marcus Reed'],
    cancellationReason: 'Accidental activation during demo test; user confirmed safety with PIN.',
  },
];

export const initialAuditLogs: SystemAuditLog[] = [
  {
    id: 'log_01',
    timestamp: '2026-10-03 23:45',
    actor: 'System / NWS Feed',
    action: 'Alert Ingestion',
    details: 'Received flash flood watch warning. Dispatched geo-fence push notifications.',
  },
  {
    id: 'log_02',
    timestamp: '2026-10-04 00:10',
    actor: 'Admin Moderator',
    action: 'Incident Verification',
    details: 'Verified report "Traffic Signal Blackout at 5th & Pine" after 14 community confirmations.',
  },
  {
    id: 'log_03',
    timestamp: '2026-10-04 00:15',
    actor: 'Sarah Jenkins',
    action: 'Live Location Start',
    details: 'Started 1-hour live location sharing session with 2 primary trusted contacts.',
  },
];
