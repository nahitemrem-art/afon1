import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';
import { fetchFundDetail } from '../services/tefasService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Arama terimi en az 2 karakter olmalıdır'
      });
    }

    const searchTerm = q.trim().toUpperCase();
    const db = getDatabase();

    console.log(`Searching for: ${searchTerm}`);

    let funds = db.prepare(`
      SELECT * FROM funds 
      WHERE UPPER(code) LIKE ? OR UPPER(name) LIKE ?
      ORDER BY 
        CASE 
          WHEN UPPER(code) = ? THEN 1
          WHEN UPPER(code) LIKE ? THEN 2
          WHEN UPPER(name) LIKE ? THEN 3
          ELSE 4
        END,
        name
      LIMIT 20
    `).all(
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      searchTerm,
      `${searchTerm}%`,
      `${searchTerm}%`
    ) as any[];

    if (funds.length === 0) {
      console.log(`No results in DB, trying TEFAS API for: ${searchTerm}`);
      
      const fundFromTefas = await fetchFundDetail(searchTerm);
      
      if (fundFromTefas) {
        const now = new Date().toISOString();
        db.prepare(`
          INSERT OR REPLACE INTO funds (
            id, code, name, price, date, daily_return, weekly_return,
            monthly_return, three_month_return, six_month_return,
            yearly_return, category, total_value, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          fundFromTefas.id,
          fundFromTefas.code,
          fundFromTefas.name,
          fundFromTefas.price,
          fundFromTefas.date,
          fundFromTefas.dailyReturn,
          fundFromTefas.weeklyReturn,
          fundFromTefas.monthlyReturn,
          fundFromTefas.threeMonthReturn,
          fundFromTefas.sixMonthReturn,
          fundFromTefas.yearlyReturn,
          fundFromTefas.category,
          fundFromTefas.totalValue,
          now
        );

        funds = [fundFromTefas];
      }
    }

    const mappedFunds = funds.map((f: any) => ({
      id: f.id || f.code,
      code: f.code,
      name: f.name,
      price: f.price,
      date: f.date,
      dailyReturn: f.daily_return || f.dailyReturn || 0,
      weeklyReturn: f.weekly_return || f.weeklyReturn || 0,
      monthlyReturn: f.monthly_return || f.monthlyReturn || 0,
      threeMonthReturn: f.three_month_return || f.threeMonthReturn || 0,
      sixMonthReturn: f.six_month_return || f.sixMonthReturn || 0,
      yearlyReturn: f.yearly_return || f.yearlyReturn || 0,
      category: f.category || 'Diğer',
      totalValue: f.total_value || f.totalValue || 0
    }));

    res.json({
      success: true,
      data: mappedFunds,
      count: mappedFunds.length
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
