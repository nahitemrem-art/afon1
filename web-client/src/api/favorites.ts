import { apiClient } from './client';
import { Favorite, ApiResponse } from '../types';
import { mockFavorites } from '../utils/mockData';
import { config } from '../utils/config';

export const favoritesApi = {
  getAll: async (): Promise<Favorite[]> => {
    if (config.useMockData) {
      return Promise.resolve(mockFavorites);
    }
    const response = await apiClient.get<ApiResponse<Favorite[]>>('/favorites');
    return response.data.data;
  },

  add: async (fundId: string): Promise<Favorite> => {
    if (config.useMockData) {
      const newFavorite: Favorite = {
        id: `f${Date.now()}`,
        userId: 'user1',
        fundId,
        fund: {
          id: fundId,
          name: 'Mock Fund',
          ticker: 'MOCK',
          category: 'Mock',
          ytdReturn: 0,
          expenseRatio: 0,
          riskLevel: 'Medium',
        },
        createdAt: new Date().toISOString(),
      };
      return Promise.resolve(newFavorite);
    }
    const response = await apiClient.post<ApiResponse<Favorite>>('/favorites', { fundId });
    return response.data.data;
  },

  remove: async (id: string): Promise<void> => {
    if (config.useMockData) {
      return Promise.resolve();
    }
    await apiClient.delete(`/favorites/${id}`);
  },
};
