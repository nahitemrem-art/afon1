import { getDatabase } from '@/config/database';
import { Fund, FundWithPerformance, FundSearchRequest, PaginatedResponse, LiveQuote, PerformanceWindow, ServiceError } from '@/types';

export class FundService {
  async searchFunds(searchParams: FundSearchRequest): Promise<PaginatedResponse<FundWithPerformance>> {
    const db = getDatabase();
    const {
      search,
      category,
      minReturn,
      maxReturn,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 50
    } = searchParams;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        f.*,
        lq.price as live_price,
        lq.change as live_change,
        lq.change_percent as live_change_percent,
        lq.estimated_yield,
        pc.one_week_return,
        pc.one_month_return,
        pc.three_months_return,
        pc.six_months_return,
        pc.one_year_return,
        pc.ytd_return
      FROM funds f
      LEFT JOIN live_quotes lq ON f.code = lq.fund_code
      LEFT JOIN performance_cache pc ON f.code = pc.fund_code
      WHERE 1=1
    `;
    
    const params: any[] = [];

    if (search) {
      query += ' AND (f.name LIKE ? OR f.code LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND f.category = ?';
      params.push(category);
    }

    if (minReturn !== undefined) {
      query += ' AND (f.yearly_return >= ? OR pc.one_year_return >= ?)';
      params.push(minReturn, minReturn);
    }

    if (maxReturn !== undefined) {
      query += ' AND (f.yearly_return <= ? OR pc.one_year_return <= ?)';
      params.push(maxReturn, maxReturn);
    }

    // Add sorting
    const validSortColumns = {
      name: 'f.name',
      code: 'f.code',
      price: 'f.price',
      dailyReturn: 'f.daily_return',
      monthlyReturn: 'f.monthly_return',
      yearlyReturn: 'f.yearly_return',
      estimatedYield: 'lq.estimated_yield'
    };

    const sortColumn = validSortColumns[sortBy] || 'f.name';
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortColumn} ${order}`;

    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const funds = db.prepare(query).all(...params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total FROM funds f
      LEFT JOIN performance_cache pc ON f.code = pc.fund_code
      WHERE 1=1
    `;
    const countParams: any[] = [];

    if (search) {
      countQuery += ' AND (f.name LIKE ? OR f.code LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      countQuery += ' AND f.category = ?';
      countParams.push(category);
    }

    if (minReturn !== undefined) {
      countQuery += ' AND (f.yearly_return >= ? OR pc.one_year_return >= ?)';
      countParams.push(minReturn, minReturn);
    }

    if (maxReturn !== undefined) {
      countQuery += ' AND (f.yearly_return <= ? OR pc.one_year_return <= ?)';
      countParams.push(maxReturn, maxReturn);
    }

    const { total } = db.prepare(countQuery).get(...countParams) as any;

    return {
      data: funds.map(mapDbFundToFundWithPerformance),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getFundByCode(code: string): Promise<FundWithPerformance | null> {
    const db = getDatabase();
    
    const fund = db.prepare(`
      SELECT 
        f.*,
        lq.price as live_price,
        lq.change as live_change,
        lq.change_percent as live_change_percent,
        lq.estimated_yield,
        pc.one_week_return,
        pc.one_month_return,
        pc.three_months_return,
        pc.six_months_return,
        pc.one_year_return,
        pc.ytd_return
      FROM funds f
      LEFT JOIN live_quotes lq ON f.code = lq.fund_code
      LEFT JOIN performance_cache pc ON f.code = pc.fund_code
      WHERE f.code = ?
    `).get(code);

    return fund ? mapDbFundToFundWithPerformance(fund) : null;
  }

  async getFundPriceHistory(code: string, days: number = 30): Promise<any[]> {
    const db = getDatabase();
    
    const history = db.prepare(`
      SELECT * FROM price_history
      WHERE fund_code = ?
      ORDER BY date DESC
      LIMIT ?
    `).all(code, days);

    return history.map((h: any) => ({
      date: h.date,
      price: h.price,
      change: h.change,
      changePercent: h.change_percent
    }));
  }

  async getLiveQuotes(fundCodes?: string[]): Promise<LiveQuote[]> {
    const db = getDatabase();
    
    let query = `
      SELECT lq.*, f.name, f.category
      FROM live_quotes lq
      JOIN funds f ON lq.fund_code = f.code
    `;
    const params: any[] = [];

    if (fundCodes && fundCodes.length > 0) {
      const placeholders = fundCodes.map(() => '?').join(',');
      query += ` WHERE lq.fund_code IN (${placeholders})`;
      params.push(...fundCodes);
    }

    query += ' ORDER BY lq.last_updated DESC';

    const quotes = db.prepare(query).all(...params);
    
    return quotes.map((quote: any) => ({
      fundCode: quote.fund_code,
      price: quote.price,
      change: quote.change,
      changePercent: quote.change_percent,
      estimatedYield: quote.estimated_yield,
      lastUpdated: quote.last_updated
    }));
  }

  async updateLiveQuote(fundCode: string, quoteData: Partial<LiveQuote>): Promise<void> {
    const db = getDatabase();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT OR REPLACE INTO live_quotes (
        fund_code, price, change, change_percent, estimated_yield, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      fundCode,
      quoteData.price,
      quoteData.change,
      quoteData.changePercent,
      quoteData.estimatedYield,
      now
    );
  }

  async calculatePerformanceWindows(fundCode: string): Promise<PerformanceWindow> {
    const db = getDatabase();
    
    // Get price history for calculations
    const history = db.prepare(`
      SELECT * FROM price_history
      WHERE fund_code = ?
      ORDER BY date ASC
    `).all(fundCode) as any[];

    if (history.length < 2) {
      throw new ServiceError('Insufficient price history for performance calculation');
    }

    const now = new Date();
    const calculateReturn = (daysAgo: number): number => {
      const targetDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const startPrice = history.find(h => new Date(h.date) >= targetDate);
      const endPrice = history[history.length - 1];
      
      if (!startPrice || !endPrice) return 0;
      
      return ((endPrice.price - startPrice.price) / startPrice.price) * 100;
    };

    // YTD calculation
    const ytdStart = new Date(now.getFullYear(), 0, 1);
    const ytdStartPrice = history.find(h => new Date(h.date) >= ytdStart);
    const currentPrice = history[history.length - 1];
    const ytdReturn = ytdStartPrice ? ((currentPrice.price - ytdStartPrice.price) / ytdStartPrice.price) * 100 : 0;

    const performance: PerformanceWindow = {
      fundCode,
      oneWeek: calculateReturn(7),
      oneMonth: calculateReturn(30),
      threeMonths: calculateReturn(90),
      sixMonths: calculateReturn(180),
      oneYear: calculateReturn(365),
      ytd: ytdReturn
    };

    // Cache the performance data
    db.prepare(`
      INSERT OR REPLACE INTO performance_cache (
        fund_code, one_week_return, one_month_return, three_months_return,
        six_months_return, one_year_return, ytd_return, last_calculated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      fundCode,
      performance.oneWeek,
      performance.oneMonth,
      performance.threeMonths,
      performance.sixMonths,
      performance.oneYear,
      performance.ytd,
      now
    );

    return performance;
  }

  async getCategories(): Promise<{ category: string; count: number }[]> {
    const db = getDatabase();
    
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count
      FROM funds
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY category
    `).all();

    return categories;
  }
}

function mapDbFundToFundWithPerformance(dbFund: any): FundWithPerformance {
  return {
    id: dbFund.id,
    code: dbFund.code,
    name: dbFund.name,
    price: dbFund.live_price || dbFund.price,
    date: dbFund.date,
    dailyReturn: dbFund.daily_return,
    weeklyReturn: dbFund.weekly_return,
    monthlyReturn: dbFund.monthly_return,
    threeMonthReturn: dbFund.three_month_return,
    sixMonthReturn: dbFund.six_month_return,
    yearlyReturn: dbFund.yearly_return,
    category: dbFund.category,
    totalValue: dbFund.total_value,
    oneWeekReturn: dbFund.one_week_return,
    oneMonthReturn: dbFund.one_month_return,
    threeMonthsReturn: dbFund.three_months_return,
    sixMonthsReturn: dbFund.six_months_return,
    oneYearReturn: dbFund.one_year_return,
    ytdReturn: dbFund.ytd_return,
    estimatedYield: dbFund.estimated_yield
  };
}

export const fundService = new FundService();