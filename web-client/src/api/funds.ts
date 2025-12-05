import { apiClient } from './client';
import { Fund, ApiResponse } from '../types';
import { mockFunds } from '../utils/mockData';
import { config } from '../utils/config';

export const fundsApi = {
  getAll: async (): Promise<Fund[]> => {
    if (config.useMockData) {
      return Promise.resolve(mockFunds);
    }
    const response = await apiClient.get<ApiResponse<Fund[]>>('/funds');
    return response.data.data;
  },

  getById: async (id: string): Promise<Fund> => {
    if (config.useMockData) {
      const fund = mockFunds.find((f) => f.id === id);
      if (!fund) throw new Error('Fund not found');
      return Promise.resolve(fund);
    }
    const response = await apiClient.get<ApiResponse<Fund>>(`/funds/${id}`);
    return response.data.data;
  },

  compare: async (fundIds: string[]): Promise<Fund[]> => {
    if (config.useMockData) {
      return Promise.resolve(mockFunds.filter((f) => fundIds.includes(f.id)));
    }
    const response = await apiClient.post<ApiResponse<Fund[]>>('/funds/compare', {
      fundIds,
    });
    return response.data.data;
  },
};
