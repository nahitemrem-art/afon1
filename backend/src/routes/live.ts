import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { fundCodes } = req.query;
    const db = getDatabase();

    let query = `
      SELECT le.*, f.name as fund_name, f.price as current_price
      FROM live_estimates le
      JOIN funds f ON le.fund_code = f.code
    `;

    let estimates;
    if (fundCodes) {
      const codes = (fundCodes as string).split(',');
      const placeholders = codes.map(() => '?').join(',');
      query += ` WHERE le.fund_code IN (${placeholders})`;
      estimates = db.prepare(query).all(...codes);
    } else {
      query += ' ORDER BY le.last_updated DESC LIMIT 50';
      estimates = db.prepare(query).all();
    }

    res.json({
      success: true,
      data: estimates.map((e: any) => ({
        fundCode: e.fund_code,
        fundName: e.fund_name,
        currentPrice: e.current_price,
        estimatedPrice: e.estimated_price,
        estimatedReturn: e.estimated_return,
        estimatedReturnPercent: e.estimated_return_percent,
        confidence: e.confidence,
        lastUpdated: e.last_updated
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:fundCode', async (req: Request, res: Response) => {
  try {
    const { fundCode } = req.params;
    const db = getDatabase();

    const estimate = db.prepare(`
      SELECT le.*, f.name as fund_name, f.price as current_price
      FROM live_estimates le
      JOIN funds f ON le.fund_code = f.code
      WHERE le.fund_code = ?
    `).get(fundCode);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Live estimate not found'
      });
    }

    const e: any = estimate;
    res.json({
      success: true,
      data: {
        fundCode: e.fund_code,
        fundName: e.fund_name,
        currentPrice: e.current_price,
        estimatedPrice: e.estimated_price,
        estimatedReturn: e.estimated_return,
        estimatedReturnPercent: e.estimated_return_percent,
        confidence: e.confidence,
        lastUpdated: e.last_updated
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
