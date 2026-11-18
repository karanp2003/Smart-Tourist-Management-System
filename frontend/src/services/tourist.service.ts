import api from './api';
import type { TouristDashboard, TouristProfile, UpdateProfilePayload, User } from '../types';

export const touristService = {
  async getProfile(): Promise<TouristProfile & { user?: User }> {
    const { data } = await api.get<TouristProfile & { user?: User }>('/tourists/profile');
    return data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<TouristProfile & { user?: User }> {
    const { data } = await api.put<TouristProfile & { user?: User }>('/tourists/profile', payload);
    return data;
  },

  async getDashboard(): Promise<TouristDashboard> {
    const { data } = await api.get<TouristDashboard>('/tourists/dashboard');
    return data;
  },
};

export default touristService;
