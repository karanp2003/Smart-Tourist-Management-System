import api from './api';
import type { LocationRecord, LocationUpdatePayload } from '../types';

export const locationService = {
  async update(payload: LocationUpdatePayload): Promise<LocationRecord> {
    const { data } = await api.post<LocationRecord>('/locations/update', payload);
    return data;
  },

  async getMine(): Promise<LocationRecord[]> {
    const { data } = await api.get<LocationRecord[] | { locations: LocationRecord[] }>('/locations/me');
    return Array.isArray(data) ? data : data.locations ?? [];
  },

  async setSharing(enabled: boolean): Promise<{ locationSharingEnabled: boolean }> {
    const { data } = await api.patch<{ locationSharingEnabled: boolean }>('/locations/sharing', {
      enabled,
    });
    return data;
  },
};

export default locationService;
