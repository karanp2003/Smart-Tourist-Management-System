import api from './api';
import type { NotificationItem } from '../types';

export const notificationService = {
  async getAll(): Promise<NotificationItem[]> {
    const { data } = await api.get<NotificationItem[] | { notifications: NotificationItem[] }>(
      '/notifications',
    );
    return Array.isArray(data) ? data : data.notifications ?? [];
  },

  async markRead(id: string): Promise<NotificationItem> {
    const { data } = await api.patch<NotificationItem>(`/notifications/${id}/read`);
    return data;
  },
};

export default notificationService;
