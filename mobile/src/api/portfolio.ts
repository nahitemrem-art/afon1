import { apiClient } from './client';
import { UserPortfolio } from '../../../shared/types';

export const portfolioApi = {
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: UserPortfolio[] }>('/portfolio');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: UserPortfolio }>(`/portfolio/${id}`);
    return response.data.data;
  },

  create: async (name: string) => {
    const response = await apiClient.post<{ success: boolean; data: UserPortfolio }>('/portfolio', { name });
    return response.data.data;
  },

  addFund: async (portfolioId: string, fundCode: string, quantity: number, price: number) => {
    const response = await apiClient.post<{ success: boolean; data: UserPortfolio }>(
      `/portfolio/${portfolioId}/funds`,
      { fundCode, quantity, price }
    );
    return response.data.data;
  },

  removeFund: async (portfolioId: string, fundCode: string) => {
    const response = await apiClient.delete(`/portfolio/${portfolioId}/funds/${fundCode}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/portfolio/${id}`);
    return response.data;
  },
};
