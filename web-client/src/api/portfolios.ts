import { apiClient } from './client';
import { Portfolio, ApiResponse } from '../types';
import { mockPortfolios } from '../utils/mockData';
import { config } from '../utils/config';

export const portfoliosApi = {
  getAll: async (): Promise<Portfolio[]> => {
    if (config.useMockData) {
      return Promise.resolve(mockPortfolios);
    }
    const response = await apiClient.get<ApiResponse<Portfolio[]>>('/portfolios');
    return response.data.data;
  },

  getById: async (id: string): Promise<Portfolio> => {
    if (config.useMockData) {
      const portfolio = mockPortfolios.find((p) => p.id === id);
      if (!portfolio) throw new Error('Portfolio not found');
      return Promise.resolve(portfolio);
    }
    const response = await apiClient.get<ApiResponse<Portfolio>>(`/portfolios/${id}`);
    return response.data.data;
  },

  create: async (name: string): Promise<Portfolio> => {
    if (config.useMockData) {
      const newPortfolio: Portfolio = {
        id: `p${Date.now()}`,
        name,
        userId: 'user1',
        holdings: [],
        totalValue: 0,
        totalCost: 0,
        totalReturn: 0,
        totalReturnPercentage: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return Promise.resolve(newPortfolio);
    }
    const response = await apiClient.post<ApiResponse<Portfolio>>('/portfolios', { name });
    return response.data.data;
  },

  addHolding: async (
    portfolioId: string,
    fundId: string,
    shares: number,
    purchasePrice: number
  ): Promise<Portfolio> => {
    if (config.useMockData) {
      const portfolio = mockPortfolios.find((p) => p.id === portfolioId);
      if (!portfolio) throw new Error('Portfolio not found');
      return Promise.resolve(portfolio);
    }
    const response = await apiClient.post<ApiResponse<Portfolio>>(
      `/portfolios/${portfolioId}/holdings`,
      { fundId, shares, purchasePrice }
    );
    return response.data.data;
  },
};
