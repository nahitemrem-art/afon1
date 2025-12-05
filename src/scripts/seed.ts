import { setupDatabase, getDatabase } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');
    
    await setupDatabase();
    const db = getDatabase();
    
    // Seed sample funds
    console.log('📊 Seeding funds...');
    const funds = [
      {
        id: uuidv4(),
        code: 'TEFAS',
        name: 'TEFAS Hisse Senedi Fonu',
        price: 125.50,
        date: new Date().toISOString().split('T')[0],
        daily_return: 2.5,
        weekly_return: 5.2,
        monthly_return: 8.7,
        three_month_return: 12.3,
        six_month_return: 18.9,
        yearly_return: 25.4,
        category: 'Hisse Senedi',
        total_value: 1000000000,
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        code: 'TEFB',
        name: 'TEFAS Tahvil Fonu',
        price: 98.75,
        date: new Date().toISOString().split('T')[0],
        daily_return: 0.5,
        weekly_return: 1.2,
        monthly_return: 2.8,
        three_month_return: 4.1,
        six_month_return: 6.7,
        yearly_return: 8.9,
        category: 'Tahvil',
        total_value: 500000000,
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        code: 'TEFBAL',
        name: 'TEFAS Dengeli Fon',
        price: 112.30,
        date: new Date().toISOString().split('T')[0],
        daily_return: 1.2,
        weekly_return: 2.8,
        monthly_return: 5.1,
        three_month_return: 7.8,
        six_month_return: 11.2,
        yearly_return: 15.6,
        category: 'Dengeli',
        total_value: 750000000,
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        code: 'TEFLIQ',
        name: 'TEFAS Likit Fon',
        price: 100.15,
        date: new Date().toISOString().split('T')[0],
        daily_return: 0.1,
        weekly_return: 0.3,
        monthly_return: 0.8,
        three_month_return: 1.5,
        six_month_return: 2.9,
        yearly_return: 4.2,
        category: 'Likit',
        total_value: 200000000,
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        code: 'TEFGOLD',
        name: 'TEFAS Altın Fonu',
        price: 145.80,
        date: new Date().toISOString().split('T')[0],
        daily_return: 1.8,
        weekly_return: 3.5,
        monthly_return: 6.2,
        three_month_return: 9.7,
        six_month_return: 14.3,
        yearly_return: 22.1,
        category: 'Altın',
        total_value: 300000000,
        updated_at: new Date().toISOString()
      }
    ];
    
    const insertFund = db.prepare(`
      INSERT OR REPLACE INTO funds (
        id, code, name, price, date, daily_return, weekly_return, monthly_return,
        three_month_return, six_month_return, yearly_return, category, total_value, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    funds.forEach(fund => {
      insertFund.run(
        fund.id, fund.code, fund.name, fund.price, fund.date,
        fund.daily_return, fund.weekly_return, fund.monthly_return,
        fund.three_month_return, fund.six_month_return, fund.yearly_return,
        fund.category, fund.total_value, fund.updated_at
      );
    });
    
    // Seed sample price history
    console.log('📈 Seeding price history...');
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 90); // 90 days of history
    
    funds.forEach(fund => {
      for (let i = 0; i < 90; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Generate realistic price movements
        const randomChange = (Math.random() - 0.5) * 4; // -2% to +2%
        const basePrice = fund.price * (1 - (90 - i) * 0.001); // Slight upward trend
        const price = basePrice * (1 + randomChange / 100);
        const previousPrice = i > 0 ? basePrice * (1 + (Math.random() - 0.5) * 4 / 100) : price;
        const change = price - previousPrice;
        const changePercent = (change / previousPrice) * 100;
        
        db.prepare(`
          INSERT OR REPLACE INTO price_history (fund_code, date, price, change, change_percent)
          VALUES (?, ?, ?, ?, ?)
        `).run(fund.code, dateStr, price, change, changePercent);
      }
    });
    
    // Seed live quotes
    console.log('💰 Seeding live quotes...');
    funds.forEach(fund => {
      const currentPrice = fund.price * (1 + (Math.random() - 0.5) * 0.02); // Small intraday movement
      const change = currentPrice - fund.price;
      const changePercent = (change / fund.price) * 100;
      const estimatedYield = fund.yearly_return * (1 + (Math.random() - 0.5) * 0.1); // Slight variation
      
      db.prepare(`
        INSERT OR REPLACE INTO live_quotes (
          fund_code, price, change, change_percent, estimated_yield, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        fund.code,
        currentPrice,
        change,
        changePercent,
        estimatedYield,
        new Date().toISOString()
      );
    });
    
    // Seed performance cache
    console.log('📊 Seeding performance cache...');
    funds.forEach(fund => {
      db.prepare(`
        INSERT OR REPLACE INTO performance_cache (
          fund_code, one_week_return, one_month_return, three_months_return,
          six_months_return, one_year_return, ytd_return, last_calculated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        fund.code,
        fund.weekly_return,
        fund.monthly_return,
        fund.three_month_return,
        fund.six_month_return,
        fund.yearly_return,
        fund.yearly_return * 0.8, // YTD slightly less than yearly
        new Date().toISOString()
      );
    });
    
    // Seed sample user
    console.log('👤 Seeding sample user...');
    const userId = uuidv4();
    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash('password123', 12);
    
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, 'demo@example.com', passwordHash, 'Demo User', now, now);
    
    console.log('✅ Database seeding completed successfully');
    console.log(`📊 Seeded ${funds.length} funds with price history and live data`);
    console.log('👤 Created demo user: demo@example.com / password123');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };