import api from './api';
import type {
  AdminAnalytics,
  AdminDashboardStats,
  CreateZonePayload,
  DigitalId,
  Incident,
  IncidentStatus,
  LocationRecord,
  SafetyZone,
  SosAlert,
  SosStatus,
  TouristProfile,
  VerificationStatus,
} from '../types';

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const { data } = await api.get<AdminDashboardStats>('/admin/dashboard/stats');
    return data;
  },

  async getAnalytics(): Promise<AdminAnalytics> {
    const { data } = await api.get<AdminAnalytics>('/admin/dashboard/analytics');
    return data;
  },

  async getLocations(): Promise<LocationRecord[]> {
    const { data } = await api.get<LocationRecord[] | { locations: LocationRecord[] }>(
      '/admin/locations',
    );
    return Array.isArray(data) ? data : data.locations ?? [];
  },

  async getIncidents(): Promise<Incident[]> {
    const { data } = await api.get<Incident[] | { incidents: Incident[] }>('/admin/incidents');
    return Array.isArray(data) ? data : data.incidents ?? [];
  },

  async updateIncidentStatus(
    id: string,
    status: IncidentStatus,
    adminNotes?: string,
  ): Promise<Incident> {
    const { data } = await api.patch<Incident>(`/admin/incidents/${id}/status`, {
      status,
      adminNotes,
    });
    return data;
  },

  async getSosAlerts(): Promise<SosAlert[]> {
    const { data } = await api.get<SosAlert[] | { alerts: SosAlert[] }>('/admin/sos');
    return Array.isArray(data) ? data : data.alerts ?? [];
  },

  async updateSosStatus(id: string, status: SosStatus): Promise<SosAlert> {
    const { data } = await api.patch<SosAlert>(`/admin/sos/${id}/status`, { status });
    return data;
  },

  async getZones(): Promise<SafetyZone[]> {
    const { data } = await api.get<SafetyZone[] | { zones: SafetyZone[] }>('/admin/zones');
    return Array.isArray(data) ? data : data.zones ?? [];
  },

  async createZone(payload: CreateZonePayload): Promise<SafetyZone> {
    const { data } = await api.post<SafetyZone>('/admin/zones', payload);
    return data;
  },

  async updateZone(id: string, payload: Partial<CreateZonePayload>): Promise<SafetyZone> {
    const { data } = await api.put<SafetyZone>(`/admin/zones/${id}`, payload);
    return data;
  },

  async deleteZone(id: string): Promise<void> {
    await api.delete(`/admin/zones/${id}`);
  },

  async getTourists(): Promise<TouristProfile[]> {
    const { data } = await api.get<TouristProfile[] | { tourists: TouristProfile[] }>(
      '/admin/tourists',
    );
    return Array.isArray(data) ? data : data.tourists ?? [];
  },

  async getDigitalIds(): Promise<DigitalId[]> {
    const { data } = await api.get<DigitalId[] | { digitalIds: DigitalId[] }>('/admin/digital-ids');
    return Array.isArray(data) ? data : data.digitalIds ?? [];
  },

  async verifyDigitalId(
    id: string,
    verificationStatus: VerificationStatus,
  ): Promise<DigitalId> {
    const { data } = await api.patch<DigitalId>(`/admin/digital-ids/${id}/verify`, {
      verificationStatus,
    });
    return data;
  },
};

export default adminService;
