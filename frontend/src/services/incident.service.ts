import api from './api';
import type { CreateIncidentPayload, Incident } from '../types';

export const incidentService = {
  async create(payload: CreateIncidentPayload): Promise<Incident> {
    const { data } = await api.post<Incident>('/incidents', payload);
    return data;
  },

  async getMyReports(): Promise<Incident[]> {
    const { data } = await api.get<Incident[] | { incidents: Incident[] }>('/incidents/my-reports');
    return Array.isArray(data) ? data : data.incidents ?? [];
  },
};

export default incidentService;
