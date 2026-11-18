export type UserRole = 'TOURIST' | 'ADMIN';

export type ZoneType = 'SAFE' | 'CAUTION' | 'HIGH_RISK' | 'RESTRICTED';

export type IncidentStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED';

export type SosStatus =
  | 'NEW'
  | 'ACKNOWLEDGED'
  | 'ASSISTANCE_IN_PROGRESS'
  | 'RESOLVED';

export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'BLOCKCHAIN_PENDING';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  touristProfile?: TouristProfile;
}

export interface TouristProfile {
  id: string;
  userId: string;
  touristId: string;
  nationality?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  locationSharingEnabled: boolean;
  lastLatitude?: number;
  lastLongitude?: number;
  lastLocationAt?: string;
  currentZoneType?: ZoneType | string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  digitalId?: DigitalId;
}

export interface DigitalId {
  id: string;
  userId: string;
  touristProfileId: string;
  digitalIdNumber: string;
  identityHash: string;
  blockchainTransactionHash?: string;
  blockchainStatus: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  disclaimer: string;
  createdAt: string;
  updatedAt: string;
  touristProfile?: TouristProfile;
}

export interface LocationRecord {
  id: string;
  userId: string;
  touristProfileId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  zoneType?: ZoneType | string;
  anomalyScore?: number;
  isAnomaly: boolean;
  timestamp: string;
  touristProfile?: TouristProfile;
}

export interface SafetyZone {
  id: string;
  name: string;
  description?: string;
  zoneType: ZoneType;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  boundaryCoordinates?: string;
  severity: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  userId: string;
  touristProfileId: string;
  category: string;
  title: string;
  description: string;
  incidentAt: string;
  latitude?: number;
  longitude?: number;
  attachmentPath?: string;
  severity?: SeverityLevel | string;
  status: IncidentStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  touristProfile?: TouristProfile;
  analysis?: IncidentAnalysis;
}

export interface IncidentAnalysis {
  id: string;
  incidentId: string;
  predictedSeverity?: string;
  confidence?: number;
  summary?: string;
  recommendations?: string;
}

export interface SosAlert {
  id: string;
  userId: string;
  touristProfileId: string;
  message?: string;
  latitude?: number;
  longitude?: number;
  status: SosStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  statusHistory?: string;
  disclaimer: string;
  createdAt: string;
  updatedAt: string;
  touristProfile?: TouristProfile;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedType?: string;
  relatedId?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  expectedRole?: UserRole;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  nationality?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  nationality?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface LocationUpdatePayload {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
}

export interface CreateIncidentPayload {
  category: string;
  title: string;
  description: string;
  incidentAt?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateSosPayload {
  message?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateZonePayload {
  name: string;
  description?: string;
  zoneType: ZoneType;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  severity?: string;
  isActive?: boolean;
}

export interface TouristDashboard {
  touristId?: string;
  locationSharingEnabled?: boolean;
  currentZoneType?: string;
  lastLatitude?: number;
  lastLongitude?: number;
  lastLocationAt?: string;
  digitalIdStatus?: VerificationStatus | string;
  openIncidents?: number;
  activeSos?: number;
  unreadNotifications?: number;
  recentIncidents?: Incident[];
  recentSos?: SosAlert[];
  recentNotifications?: NotificationItem[];
  stats?: {
    openIncidents?: number;
    activeSos?: number;
    unreadNotifications?: number;
  };
}

export interface AdminDashboardStats {
  totalTourists?: number;
  activeTourists?: number;
  verifiedDigitalIds?: number;
  pendingDigitalIds?: number;
  openIncidents?: number;
  activeSos?: number;
  totalZones?: number;
  touristsSharingLocation?: number;
  incidentsByStatus?: Record<string, number>;
  sosByStatus?: Record<string, number>;
  zonesByType?: Record<string, number>;
}

export interface AdminAnalytics {
  incidentsOverTime?: Array<{ date: string; count: number }>;
  sosOverTime?: Array<{ date: string; count: number }>;
  incidentsByCategory?: Array<{ category: string; count: number }>;
  incidentsBySeverity?: Array<{ severity: string; count: number }>;
  zoneDistribution?: Array<{ zoneType: string; count: number }>;
  touristsByNationality?: Array<{ nationality: string; count: number }>;
}

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
  type?: 'tourist' | 'incident' | 'sos' | 'user';
  status?: string;
  zoneType?: string;
}

export const SOS_DISCLAIMER =
  'This SOS alert notifies platform administrators only. It does not automatically contact police, ambulance, or government emergency services.';

export const EMERGENCY_NUMBERS = [
  { code: '112', label: 'National Emergency' },
  { code: '100', label: 'Police' },
  { code: '108', label: 'Ambulance' },
] as const;
