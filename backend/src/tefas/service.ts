import { FundData, FundDataSchema, FundPerformance } from './types';
import { TefasApiClient } from './api';
import { TefasScraper } from './scraper';
import { FundQuoteRepository } from '../repository/FundQuoteRepository';
import { normalizeApiFund, normalizeScrapedFund } from './normalizer';
import { z } from 'zod';

export type RefreshWindow = 'daily' | 'monthly' | 'threeMonth' | 'annual' | 'all';

export interface TefasServiceConfig {
  preferScraper?: boolean;
  enableFallback?: boolean;
  windows?: RefreshWindow[];
}

const windowFieldMap: Record<Exclude<RefreshWindow, 'all'>, keyof FundPerformance> = {
  daily: 'dailyReturn',
  monthly: 'monthlyReturn',
  threeMonth: 'threeMonthReturn',
  annual: 'annualReturn',
};

export class TefasService {
  constructor(
    private readonly repository: FundQuoteRepository,
    private readonly apiClient: TefasApiClient,
    private readonly scraper: TefasScraper,
    private readonly config: TefasServiceConfig = {}
  ) {}

  private filterByWindow(funds: FundData[], window: RefreshWindow): FundData[] {
    if (window === 'all') {
      return funds;
    }

    const field = windowFieldMap[window];
    return funds.filter(fund => {
      const value = fund.performance[field];
      return typeof value === 'number' && !isNaN(value);
    });
  }

  private async fetchFromApi(): Promise<FundData[]> {
    const rawFunds = await this.apiClient.fetchFunds();
    return rawFunds
      .map(normalizeApiFund)
      .map(fund => FundDataSchema.parse(fund));
  }

  private async fetchFromScraper(): Promise<FundData[]> {
    const scrapedFunds = await this.scraper.scrapeFundList();
    return scrapedFunds
      .map(normalizeScrapedFund)
      .map(fund => FundDataSchema.parse(fund));
  }

  async syncFunds(window: RefreshWindow = 'all'): Promise<{ fundsSynced: number; source: 'api' | 'scraper'; window: RefreshWindow; }>
 {
    let funds: FundData[] = [];
    let source: 'api' | 'scraper' = 'api';

    const shouldPreferScraper = this.config.preferScraper ?? false;

    if (!shouldPreferScraper) {
      try {
        funds = await this.fetchFromApi();
      } catch (error) {
        console.error('TEFAS API failed, falling back to scraper', error);
        if (this.config.enableFallback !== false) {
          funds = await this.fetchFromScraper();
          source = 'scraper';
        } else {
          throw error;
        }
      }
    }

    if (funds.length === 0) {
      console.warn('No funds fetched from API, attempting scraper');
      funds = await this.fetchFromScraper();
      source = 'scraper';
    }

    const filteredFunds = this.filterByWindow(funds, window);
    await this.repository.persistFunds(filteredFunds);

    return {
      fundsSynced: filteredFunds.length,
      source,
      window,
    };
  }

  async listPersistedFunds(): Promise<FundData[]> {
    return this.repository.listFunds();
  }

  async getFund(code: string): Promise<FundData | undefined> {
    return this.repository.findByCode(code);
  }

  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
