import api from './api';
import type { DigitalId } from '../types';

export const digitalIdService = {
  async getMine(): Promise<DigitalId> {
    const { data } = await api.get<DigitalId>('/digital-id/me');
    return data;
  },

  async verify(payload?: { identityDocument?: string }): Promise<DigitalId> {
    const { data } = await api.post<DigitalId>('/digital-id/verify', payload ?? {});
    return data;
  },
};

export default digitalIdService;
