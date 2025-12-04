import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';
import { UserPortfolio, Transaction, ApiResponse } from '../../../shared/types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const portfolios = db.prepare('SELECT * FROM portfolios ORDER BY created_at DESC').all();

    const result = portfolios.map((p: any) => mapDbPortfolio(p, db));

    res.json({
      success: true,
      data: result
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
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Portfolio name is required'
      });
    }

    const db = getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO portfolios (id, name, total_value, total_return, total_return_percent, created_at, updated_at)
      VALUES (?, ?, 0, 0, 0, ?, ?)
    `).run(id, name, now, now);

    const portfolio = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(id);

    res.status(201).json({
      success: true,
      data: mapDbPortfolio(portfolio, db)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const portfolio = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    res.json({
      success: true,
      data: mapDbPortfolio(portfolio, db)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/:id/funds', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fundCode, quantity, price } = req.body;

    if (!fundCode || !quantity || !price) {
      return res.status(400).json({
        success: false,
        error: 'fundCode, quantity, and price are required'
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

    const existingFund = db.prepare(
      'SELECT * FROM portfolio_funds WHERE portfolio_id = ? AND fund_code = ?'
    ).get(id, fundCode) as any;

    const transactionId = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO transactions (id, portfolio_id, fund_code, type, quantity, price, total_amount, date)
      VALUES (?, ?, ?, 'buy', ?, ?, ?, ?)
    `).run(transactionId, id, fundCode, quantity, price, quantity * price, now);

    if (existingFund) {
      const newQuantity = existingFund.quantity + quantity;
      const newTotalCost = existingFund.total_cost + (quantity * price);
      const newAveragePrice = newTotalCost / newQuantity;
      const currentPrice = (fund as any).price;
      const totalValue = newQuantity * currentPrice;
      const profit = totalValue - newTotalCost;
      const profitPercent = (profit / newTotalCost) * 100;

      db.prepare(`
        UPDATE portfolio_funds SET
          quantity = ?,
          average_price = ?,
          current_price = ?,
          total_value = ?,
          total_cost = ?,
          profit = ?,
          profit_percent = ?
        WHERE portfolio_id = ? AND fund_code = ?
      `).run(
        newQuantity,
        newAveragePrice,
        currentPrice,
        totalValue,
        newTotalCost,
        profit,
        profitPercent,
        id,
        fundCode
      );
    } else {
      const currentPrice = (fund as any).price;
      const totalCost = quantity * price;
      const totalValue = quantity * currentPrice;
      const profit = totalValue - totalCost;
      const profitPercent = (profit / totalCost) * 100;

      db.prepare(`
        INSERT INTO portfolio_funds (
          portfolio_id, fund_code, fund_name, quantity, average_price,
          current_price, total_value, total_cost, profit, profit_percent, added_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        fundCode,
        (fund as any).name,
        quantity,
        price,
        currentPrice,
        totalValue,
        totalCost,
        profit,
        profitPercent,
        now
      );
    }

    updatePortfolioTotals(db, id);

    const portfolio = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(id);

    res.json({
      success: true,
      data: mapDbPortfolio(portfolio, db)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.delete('/:id/funds/:fundCode', async (req: Request, res: Response) => {
  try {
    const { id, fundCode } = req.params;
    const db = getDatabase();

    db.prepare('DELETE FROM portfolio_funds WHERE portfolio_id = ? AND fund_code = ?')
      .run(id, fundCode);

    updatePortfolioTotals(db, id);

    res.json({
      success: true,
      message: 'Fund removed from portfolio'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    db.prepare('DELETE FROM portfolios WHERE id = ?').run(id);

    res.json({
      success: true,
      message: 'Portfolio deleted'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

function mapDbPortfolio(dbPortfolio: any, db: any): UserPortfolio {
  const funds = db.prepare('SELECT * FROM portfolio_funds WHERE portfolio_id = ?')
    .all(dbPortfolio.id);

  return {
    id: dbPortfolio.id,
    name: dbPortfolio.name,
    funds: funds.map((f: any) => ({
      fundCode: f.fund_code,
      fundName: f.fund_name,
      quantity: f.quantity,
      averagePrice: f.average_price,
      currentPrice: f.current_price,
      totalValue: f.total_value,
      totalCost: f.total_cost,
      profit: f.profit,
      profitPercent: f.profit_percent,
      addedAt: f.added_at
    })),
    totalValue: dbPortfolio.total_value,
    totalReturn: dbPortfolio.total_return,
    totalReturnPercent: dbPortfolio.total_return_percent,
    createdAt: dbPortfolio.created_at,
    updatedAt: dbPortfolio.updated_at
  };
}

function updatePortfolioTotals(db: any, portfolioId: string): void {
  const funds = db.prepare('SELECT * FROM portfolio_funds WHERE portfolio_id = ?')
    .all(portfolioId);

  let totalValue = 0;
  let totalCost = 0;

  for (const fund of funds) {
    totalValue += fund.total_value;
    totalCost += fund.total_cost;
  }

  const totalReturn = totalValue - totalCost;
  const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

  db.prepare(`
    UPDATE portfolios SET
      total_value = ?,
      total_return = ?,
      total_return_percent = ?,
      updated_at = ?
    WHERE id = ?
  `).run(totalValue, totalReturn, totalReturnPercent, new Date().toISOString(), portfolioId);
}

export default router;
