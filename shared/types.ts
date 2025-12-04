export interface Fund {
  id: string;
  code: string;
  name: string;
  price: number;
  date: string;
  dailyReturn: number;
  weeklyReturn: number;
  monthlyReturn: number;
  threeMonthReturn: number;
  sixMonthReturn: number;
  yearlyReturn: number;
  category: string;
  totalValue: number;
}

export interface FundDetail extends Fund {
  priceHistory: PriceHistory[];
  portfolio?: FundPortfolio;
  description?: string;
  manager?: string;
  inceptionDate?: string;
}

export interface PriceHistory {
  date: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface FundPortfolio {
  stocks: PortfolioItem[];
  bonds: PortfolioItem[];
  other: PortfolioItem[];
  cash: number;
  cashPercent: number;
}

export interface PortfolioItem {
  symbol: string;
  name: string;
  value: number;
  percentage: number;
  sector?: string;
}

export interface UserPortfolio {
  id: string;
  name: string;
  funds: UserPortfolioFund[];
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserPortfolioFund {
  fundCode: string;
  fundName: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  profit: number;
  profitPercent: number;
  addedAt: string;
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
}

export interface Favorite {
  fundCode: string;
  addedAt: string;
}

export interface LiveReturn {
  fundCode: string;
  estimatedPrice: number;
  estimatedReturn: number;
  estimatedReturnPercent: number;
  lastUpdated: string;
  confidence: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export interface FilterOptions {
  categories?: FundCategory[];
  minReturn?: number;
  maxReturn?: number;
  sortBy?: 'dailyReturn' | 'monthlyReturn' | 'yearlyReturn' | 'name' | 'totalValue';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
