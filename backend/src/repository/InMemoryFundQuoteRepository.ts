import { FundData } from '../tefas/types';
import { FundQuoteRepository } from './FundQuoteRepository';

export class InMemoryFundQuoteRepository implements FundQuoteRepository {
  private store: Map<string, FundData> = new Map();

  async persistFunds(funds: FundData[]): Promise<void> {
    for (const fund of funds) {
      this.store.set(fund.metadata.code, fund);
    }
    console.log(`Persisted ${funds.length} fund records to in-memory store`);
  }

  async listFunds(): Promise<FundData[]> {
    return Array.from(this.store.values());
  }

  async findByCode(code: string): Promise<FundData | undefined> {
    return this.store.get(code);
  }

  async clear(): Promise<void> {
    this.store.clear();
    console.log('Cleared in-memory fund store');
  }
}
