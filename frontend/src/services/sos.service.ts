import api from './api';
import type { CreateSosPayload, SosAlert } from '../types';

export const sosService = {
  async create(payload: CreateSosPayload): Promise<SosAlert> {
    const { data } = await api.post<SosAlert>('/sos', payload);
    return data;
  },

  async getMyAlerts(): Promise<SosAlert[]> {
    const { data } = await api.get<SosAlert[] | { alerts: SosAlert[] }>('/sos/my-alerts');
    return Array.isArray(data) ? data : data.alerts ?? [];
  },
};

export default sosService;
