import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';
import { fetchPriceHistory } from '../services/tefasService';
import { Fund, ApiResponse, PaginatedResponse, FilterOptions } from '../../../shared/types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const {
      page = 1,
      limit = 50,
      category,
      sortBy = 'name',
      sortOrder = 'asc',
      search
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    let query = 'SELECT * FROM funds WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR code LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const validSortColumns = ['name', 'code', 'price', 'daily_return', 'monthly_return', 'yearly_return'];
    const sortColumn = validSortColumns.includes(sortBy as string) ? sortBy : 'name';
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortColumn} ${order}`;
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const funds = db.prepare(query).all(...params);

    const countQuery = 'SELECT COUNT(*) as total FROM funds WHERE 1=1' +
      (category ? ' AND category = ?' : '') +
      (search ? ' AND (name LIKE ? OR code LIKE ?)' : '');
    
    const countParams: any[] = [];
    if (category) countParams.push(category);
    if (search) countParams.push(`%${search}%`, `%${search}%`);
    
    const { total } = db.prepare(countQuery).get(...countParams) as any;

    const response: PaginatedResponse<Fund> = {
      data: funds.map(mapDbFundToFund),
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const db = getDatabase();

    const fund = db.prepare('SELECT * FROM funds WHERE code = ?').get(code);

    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found'
      });
    }

    const response: ApiResponse<Fund> = {
      success: true,
      data: mapDbFundToFund(fund)
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:code/history', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const { days = 30 } = req.query;
    const db = getDatabase();

    const history = db.prepare(`
      SELECT * FROM price_history
      WHERE fund_code = ?
      ORDER BY date DESC
      LIMIT ?
    `).all(code, Number(days));

    res.json({
      success: true,
      data: history.map((h: any) => ({
        date: h.date,
        price: h.price,
        change: h.change,
        changePercent: h.change_percent
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/categories/list', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const categories = db.prepare(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM funds
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY category
    `).all();

    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

function mapDbFundToFund(dbFund: any): Fund {
  return {
    id: dbFund.id,
    code: dbFund.code,
    name: dbFund.name,
    price: dbFund.price,
    date: dbFund.date,
    dailyReturn: dbFund.daily_return,
    weeklyReturn: dbFund.weekly_return,
    monthlyReturn: dbFund.monthly_return,
    threeMonthReturn: dbFund.three_month_return,
    sixMonthReturn: dbFund.six_month_return,
    yearlyReturn: dbFund.yearly_return,
    category: dbFund.category,
    totalValue: dbFund.total_value
  };
}

export default router;
