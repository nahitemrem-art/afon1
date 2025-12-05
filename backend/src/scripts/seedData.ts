import { getDatabase } from '../database';

export function seedSampleData(): void {
  const db = getDatabase();
  
  const sampleFunds = [
    {
      id: 'AAL',
      code: 'AAL',
      name: 'Aktif Yatırım A.Ş. Likit Fon',
      price: 0.025679,
      date: '2024-12-04',
      daily_return: 0.15,
      weekly_return: 0.45,
      monthly_return: 1.85,
      three_month_return: 5.43,
      six_month_return: 10.82,
      yearly_return: 21.35,
      category: 'Likit',
      total_value: 125000000,
      updated_at: new Date().toISOString()
    },
    {
      id: 'AEF',
      code: 'AEF',
      name: 'Aktif Yatırım A.Ş. Esnek Fon',
      price: 0.041234,
      date: '2024-12-04',
      daily_return: -0.23,
      weekly_return: 1.12,
      monthly_return: 3.45,
      three_month_return: 8.76,
      six_month_return: 15.23,
      yearly_return: 32.45,
      category: 'Esnek',
      total_value: 85000000,
      updated_at: new Date().toISOString()
    },
    {
      id: 'AHE',
      code: 'AHE',
      name: 'Aktif Yatırım A.Ş. Hisse Senedi Fon',
      price: 0.086543,
      date: '2024-12-04',
      daily_return: 1.45,
      weekly_return: 3.21,
      monthly_return: 5.67,
      three_month_return: 12.34,
      six_month_return: 18.76,
      yearly_return: 42.89,
      category: 'Hisse Senedi',
      total_value: 250000000,
      updated_at: new Date().toISOString()
    }
  ];

  const insertFund = db.prepare(`
    INSERT OR REPLACE INTO funds (
      id, code, name, price, date, daily_return, weekly_return,
      monthly_return, three_month_return, six_month_return,
      yearly_return, category, total_value, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const fund of sampleFunds) {
    insertFund.run(
      fund.id,
      fund.code,
      fund.name,
      fund.price,
      fund.date,
      fund.daily_return,
      fund.weekly_return,
      fund.monthly_return,
      fund.three_month_return,
      fund.six_month_return,
      fund.yearly_return,
      fund.category,
      fund.total_value,
      fund.updated_at
    );
  }

  const insertHistory = db.prepare(`
    INSERT OR IGNORE INTO price_history (
      fund_code, date, price, change, change_percent
    ) VALUES (?, ?, ?, ?, ?)
  `);

  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    for (const fund of sampleFunds) {
      const randomChange = (Math.random() - 0.5) * 2;
      const price = fund.price * (1 + (randomChange / 100) * i / 30);
      
      insertHistory.run(
        fund.code,
        dateStr,
        price,
        price - fund.price,
        randomChange
      );
    }
  }

  const sampleLiveEstimates = sampleFunds.map(fund => ({
    fund_code: fund.code,
    estimated_price: fund.price * (1 + (Math.random() * 0.02 - 0.01)),
    estimated_return: fund.price * (Math.random() * 0.02 - 0.01),
    estimated_return_percent: (Math.random() * 2 - 1),
    confidence: 0.7 + Math.random() * 0.2,
    last_updated: new Date().toISOString()
  }));

  const insertEstimate = db.prepare(`
    INSERT OR REPLACE INTO live_estimates (
      fund_code, estimated_price, estimated_return,
      estimated_return_percent, confidence, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const estimate of sampleLiveEstimates) {
    insertEstimate.run(
      estimate.fund_code,
      estimate.estimated_price,
      estimate.estimated_return,
      estimate.estimated_return_percent,
      estimate.confidence,
      estimate.last_updated
    );
  }

  console.log('✅ Sample data seeded successfully');
  console.log(`   - ${sampleFunds.length} funds`);
  console.log(`   - ${sampleFunds.length * 31} price history records`);
  console.log(`   - ${sampleLiveEstimates.length} live estimates`);
}

if (require.main === module) {
  const { setupDatabase } = require('../database');
  setupDatabase().then(() => {
    seedSampleData();
    process.exit(0);
  });
}
