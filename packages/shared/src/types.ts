/**
 * Shared TypeScript interfaces for the fund management application
 */

// Fund-related types
export interface Fund {
  id: string;
  name: string;
  ticker: string;
  category: string;
  expenseRatio: number;
  aum: number; // Assets Under Management in millions
  ytdReturn: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
  inceptionDate: string;
  minimumInvestment: number;
}

export interface FundSummary {
  id: string;
  name: string;
  ticker: string;
  category: string;
  ytdReturn: number;
  expenseRatio: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface FundComparison {
  funds: Fund[];
  metrics: string[];
}

// Portfolio-related types
export interface PortfolioHolding {
  fundId: string;
  fund: FundSummary;
  shares: number;
  averageCost: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
}

export interface Portfolio {
  id: string;
  name: string;
  userId: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSummary {
  id: string;
  name: string;
  totalValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
  holdingsCount: number;
}

export interface CreatePortfolioInput {
  name: string;
}

export interface AddHoldingInput {
  portfolioId: string;
  fundId: string;
  shares: number;
  purchasePrice: number;
}

// Favorite-related types
export interface Favorite {
  id: string;
  userId: string;
  fundId: string;
  fund: FundSummary;
  createdAt: string;
}

export interface CreateFavoriteInput {
  fundId: string;
}

// User-related types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Filter and search types
export interface FundFilters {
  category?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  minReturn?: number;
  maxExpenseRatio?: number;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// Notification types (for mobile)
export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

// App configuration
export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
}
