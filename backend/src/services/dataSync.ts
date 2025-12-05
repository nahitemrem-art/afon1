import cron from 'node-cron';
import { getDatabase } from '../database';
import { fetchAllFunds, fetchPriceHistory } from './tefasService';
import { Fund } from '../../../shared/types';

export function startDataSync(): void {
  syncFunds();

  cron.schedule('0 18 * * 1-5', () => {
    console.log('Running scheduled fund data sync...');
    syncFunds();
  });

  cron.schedule('*/5 * * * *', () => {
    updateLiveEstimates();
  });
}

async function syncFunds(): Promise<void> {
  try {
    console.log('Syncing fund data from TEFAS...');
    const funds = await fetchAllFunds();
    
    if (funds.length === 0) {
      console.warn('No funds to sync');
      return;
    }

    const db = getDatabase();
    const insertFund = db.prepare(`
      INSERT OR REPLACE INTO funds (
        id, code, name, price, date, daily_return, weekly_return,
        monthly_return, three_month_return, six_month_return,
        yearly_return, category, total_value, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertHistory = db.prepare(`
      INSERT OR IGNORE INTO price_history (
        fund_code, date, price, change, change_percent
      ) VALUES (?, ?, ?, ?, ?)
    `);

    const syncTransaction = db.transaction((funds: Fund[]) => {
      for (const fund of funds) {
        insertFund.run(
          fund.id,
          fund.code,
          fund.name,
          fund.price,
          fund.date,
          fund.dailyReturn,
          fund.weeklyReturn,
          fund.monthlyReturn,
          fund.threeMonthReturn,
          fund.sixMonthReturn,
          fund.yearlyReturn,
          fund.category,
          fund.totalValue,
          new Date().toISOString()
        );

        insertHistory.run(
          fund.code,
          fund.date,
          fund.price,
          fund.dailyReturn,
          fund.dailyReturn
        );
      }
    });

    syncTransaction(funds);
    console.log(`✅ Synced ${funds.length} funds`);
  } catch (error) {
    console.error('Error syncing funds:', error);
  }
}

async function updateLiveEstimates(): Promise<void> {
  try {
    const db = getDatabase();
    const funds = db.prepare('SELECT code FROM funds LIMIT 50').all();

    for (const fund of funds as any[]) {
      const estimate = await calculateLiveEstimate(fund.code);
      
      if (estimate) {
        db.prepare(`
          INSERT OR REPLACE INTO live_estimates (
            fund_code, estimated_price, estimated_return,
            estimated_return_percent, confidence, last_updated
          ) VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          fund.code,
          estimate.estimatedPrice,
          estimate.estimatedReturn,
          estimate.estimatedReturnPercent,
          estimate.confidence,
          new Date().toISOString()
        );
      }
    }
  } catch (error) {
    console.error('Error updating live estimates:', error);
  }
}

async function calculateLiveEstimate(fundCode: string): Promise<any | null> {
  try {
    const db = getDatabase();
    const fund = db.prepare('SELECT * FROM funds WHERE code = ?').get(fundCode) as any;
    
    if (!fund) return null;

    const borsaChange = Math.random() * 2 - 1;
    const estimatedReturnPercent = borsaChange * 0.8;
    const estimatedPrice = fund.price * (1 + estimatedReturnPercent / 100);
    const estimatedReturn = estimatedPrice - fund.price;

    return {
      estimatedPrice: parseFloat(estimatedPrice.toFixed(6)),
      estimatedReturn: parseFloat(estimatedReturn.toFixed(6)),
      estimatedReturnPercent: parseFloat(estimatedReturnPercent.toFixed(2)),
      confidence: 0.7 + Math.random() * 0.2
    };
  } catch (error) {
    console.error(`Error calculating live estimate for ${fundCode}:`, error);
    return null;
  }
}
