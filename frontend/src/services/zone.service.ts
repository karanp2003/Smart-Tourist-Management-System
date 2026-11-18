import api from './api';
import type { SafetyZone } from '../types';

export const zoneService = {
  async getAll(): Promise<SafetyZone[]> {
    const { data } = await api.get<SafetyZone[] | { zones: SafetyZone[] }>('/zones');
    return Array.isArray(data) ? data : data.zones ?? [];
  },
};

export default zoneService;
