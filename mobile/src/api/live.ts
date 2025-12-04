import { apiClient } from './client';
import { LiveReturn } from '../../../shared/types';

export const liveApi = {
  getAll: async (fundCodes?: string[]) => {
    const params = fundCodes ? { fundCodes: fundCodes.join(',') } : {};
    const response = await apiClient.get<{ success: boolean; data: LiveReturn[] }>('/live', { params });
    return response.data.data;
  },

  getByCode: async (fundCode: string) => {
    const response = await apiClient.get<{ success: boolean; data: LiveReturn }>(`/live/${fundCode}`);
    return response.data.data;
  },
};
