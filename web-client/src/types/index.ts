export interface Fund {
  id: string;
  name: string;
  ticker: string;
  category: string;
  expenseRatio: number;
  aum: number;
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

export interface Favorite {
  id: string;
  userId: string;
  fundId: string;
  fund: FundSummary;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
