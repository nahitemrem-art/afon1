import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const favorites = db.prepare(`
      SELECT f.*, fav.added_at
      FROM favorites fav
      JOIN funds f ON fav.fund_code = f.code
      ORDER BY fav.added_at DESC
    `).all();

    res.json({
      success: true,
      data: favorites.map((fav: any) => ({
        id: fav.id,
        code: fav.code,
        name: fav.name,
        price: fav.price,
        date: fav.date,
        dailyReturn: fav.daily_return,
        weeklyReturn: fav.weekly_return,
        monthlyReturn: fav.monthly_return,
        threeMonthReturn: fav.three_month_return,
        sixMonthReturn: fav.six_month_return,
        yearlyReturn: fav.yearly_return,
        category: fav.category,
        totalValue: fav.total_value,
        addedAt: fav.added_at
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { fundCode } = req.body;

    if (!fundCode) {
      return res.status(400).json({
        success: false,
        error: 'fundCode is required'
      });
    }

    const db = getDatabase();

    const fund = db.prepare('SELECT * FROM funds WHERE code = ?').get(fundCode);
    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found'
      });
    }

    const existing = db.prepare('SELECT * FROM favorites WHERE fund_code = ?').get(fundCode);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Fund already in favorites'
      });
    }

    db.prepare('INSERT INTO favorites (fund_code, added_at) VALUES (?, ?)')
      .run(fundCode, new Date().toISOString());

    res.status(201).json({
      success: true,
      message: 'Fund added to favorites'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.delete('/:fundCode', async (req: Request, res: Response) => {
  try {
    const { fundCode } = req.params;
    const db = getDatabase();

    db.prepare('DELETE FROM favorites WHERE fund_code = ?').run(fundCode);

    res.json({
      success: true,
      message: 'Fund removed from favorites'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/check/:fundCode', async (req: Request, res: Response) => {
  try {
    const { fundCode } = req.params;
    const db = getDatabase();

    const favorite = db.prepare('SELECT * FROM favorites WHERE fund_code = ?').get(fundCode);

    res.json({
      success: true,
      data: {
        isFavorite: !!favorite
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
