import { apiClient } from './client';
import { Fund, PaginatedResponse, PriceHistory } from '../../../shared/types';

export const fundsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
  }) => {
    const response = await apiClient.get<PaginatedResponse<Fund>>('/funds', { params });
    return response.data;
  },

  getById: async (code: string) => {
    const response = await apiClient.get<{ success: boolean; data: Fund }>(`/funds/${code}`);
    return response.data.data;
  },

  getHistory: async (code: string, days: number = 30) => {
    const response = await apiClient.get<{ success: boolean; data: PriceHistory[] }>(
      `/funds/${code}/history`,
      { params: { days } }
    );
    return response.data.data;
  },

  getCategories: async () => {
    const response = await apiClient.get<{ success: boolean; data: any[] }>('/funds/categories/list');
    return response.data.data;
  },
};
