import { FundData } from '../tefas/types';

export interface FundQuoteRepository {
  persistFunds(funds: FundData[]): Promise<void>;
  listFunds(): Promise<FundData[]>;
  findByCode(code: string): Promise<FundData | undefined>;
  clear(): Promise<void>;
}
