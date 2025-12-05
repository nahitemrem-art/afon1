import { apiClient } from './client';
import { Fund } from '../../../shared/types';

export const favoritesApi = {
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: Fund[] }>('/favorites');
    return response.data.data;
  },

  add: async (fundCode: string) => {
    const response = await apiClient.post('/favorites', { fundCode });
    return response.data;
  },

  remove: async (fundCode: string) => {
    const response = await apiClient.delete(`/favorites/${fundCode}`);
    return response.data;
  },

  check: async (fundCode: string) => {
    const response = await apiClient.get<{ success: boolean; data: { isFavorite: boolean } }>(
      `/favorites/check/${fundCode}`
    );
    return response.data.data.isFavorite;
  },
};
