export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
  expiresIn: string;
}

export interface Session {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
}

export interface Fund {
  id: string;
  code: string;
  name: string;
  price: number;
  date: string;
  dailyReturn?: number;
  weeklyReturn?: number;
  monthlyReturn?: number;
  threeMonthReturn?: number;
  sixMonthReturn?: number;
  yearlyReturn?: number;
  category?: string;
  totalValue?: number;
}

export interface FundWithPerformance extends Fund {
  oneWeekReturn?: number;
  oneMonthReturn?: number;
  threeMonthsReturn?: number;
  sixMonthsReturn?: number;
  oneYearReturn?: number;
  ytdReturn?: number;
  estimatedYield?: number;
}

export interface PriceHistory {
  date: string;
  price: number;
  change?: number;
  changePercent?: number;
}

export interface LiveQuote {
  fundCode: string;
  price: number;
  change?: number;
  changePercent?: number;
  estimatedYield?: number;
  lastUpdated: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioRequest {
  name: string;
}

export interface PortfolioHolding {
  id: string;
  portfolioId: string;
  fundCode: string;
  quantity: number;
  averagePrice: number;
  totalCost: number;
  currentPrice?: number;
  currentValue?: number;
  gainLoss?: number;
  gainLossPercent?: number;
  estimatedYield?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioWithHoldings extends Portfolio {
  holdings: (PortfolioHolding & { fund: Fund })[];
}

export interface AddHoldingRequest {
  fundCode: string;
  quantity: number;
  price: number;
}

export interface UpdateHoldingRequest {
  quantity?: number;
  averagePrice?: number;
}

export interface Transaction {
  id: string;
  portfolioId: string;
  fundCode: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalAmount: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface CreateTransactionRequest {
  fundCode: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date?: string;
  notes?: string;
}

export interface Favorite {
  id: string;
  userId: string;
  fundCode: string;
  createdAt: string;
}

export interface PerformanceWindow {
  fundCode: string;
  oneWeek: number;
  oneMonth: number;
  threeMonths: number;
  sixMonths: number;
  oneYear: number;
  ytd: number;
}

export interface FundSearchRequest {
  search?: string;
  category?: string;
  minReturn?: number;
  maxReturn?: number;
  sortBy?: 'name' | 'code' | 'price' | 'dailyReturn' | 'monthlyReturn' | 'yearlyReturn' | 'estimatedYield';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export enum FundCategory {
  EQUITY = 'Hisse Senedi',
  BOND = 'Tahvil',
  BALANCED = 'Dengeli',
  LIQUID = 'Likit',
  GOLD = 'Altın',
  PRECIOUS_METALS = 'Kıymetli Madenler',
  VARIABLE = 'Değişken',
  PROTECTED = 'Başarıya Endeksli',
  INTERNATIONAL = 'Uluslararası',
  INDEX = 'Endeks',
  SECTOR = 'Sektör',
  OTHER = 'Diğer'
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ServiceError extends Error {
  statusCode?: number;
  code?: string;
}