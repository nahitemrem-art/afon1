import { getDatabase } from '@/config/database';
import { 
  Portfolio, 
  PortfolioWithHoldings, 
  PortfolioHolding, 
  CreatePortfolioRequest, 
  AddHoldingRequest, 
  UpdateHoldingRequest,
  Transaction,
  CreateTransactionRequest,
  ServiceError 
} from '@/types';
import { fundService } from './fundService';
import { v4 as uuidv4 } from 'uuid';

export class PortfolioService {
  async createPortfolio(userId: string, portfolioData: CreatePortfolioRequest): Promise<Portfolio> {
    const db = getDatabase();
    const portfolioId = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO portfolios (id, user_id, name, total_value, total_cost, total_return, total_return_percent, created_at, updated_at)
      VALUES (?, ?, ?, 0, 0, 0, 0, ?, ?)
    `).run(portfolioId, userId, portfolioData.name, now, now);

    const portfolio = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(portfolioId);
    return mapDbPortfolioToPortfolio(portfolio);
  }

  async getUserPortfolios(userId: string): Promise<PortfolioWithHoldings[]> {
    const db = getDatabase();
    
    const portfolios = db.prepare('SELECT * FROM portfolios WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId);

    const result = [];
    for (const portfolio of portfolios) {
      const holdings = await this.getPortfolioHoldings(portfolio.id);
      const holdingsWithFunds = [];
      for (const holding of holdings) {
        const fund = await fundService.getFundByCode(holding.fundCode);
        holdingsWithFunds.push({
          ...holding,
          fund
        });
      }
      result.push({
        ...mapDbPortfolioToPortfolio(portfolio),
        holdings: holdingsWithFunds
      });
    }
    return result;
  }

  async getPortfolioById(portfolioId: string, userId?: string): Promise<PortfolioWithHoldings | null> {
    const db = getDatabase();
    
    let query = 'SELECT * FROM portfolios WHERE id = ?';
    const params = [portfolioId];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    const portfolio = db.prepare(query).get(...params);
    
    if (!portfolio) return null;

    const holdings = await this.getPortfolioHoldings(portfolioId);
    
    return {
      ...mapDbPortfolioToPortfolio(portfolio),
      holdings: holdings.map(holding => ({
        ...holding,
        fund: await fundService.getFundByCode(holding.fundCode)
      }))
    };
  }

  async updatePortfolio(portfolioId: string, userId: string, updateData: Partial<CreatePortfolioRequest>): Promise<Portfolio> {
    const db = getDatabase();
    
    // Verify portfolio belongs to user
    const existingPortfolio = db.prepare('SELECT id FROM portfolios WHERE id = ? AND user_id = ?')
      .get(portfolioId, userId);
    
    if (!existingPortfolio) {
      const error: ServiceError = new Error('Portfolio not found');
      error.statusCode = 404;
      throw error;
    }

    const now = new Date().toISOString();
    
    db.prepare(`
      UPDATE portfolios 
      SET name = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(updateData.name, now, portfolioId, userId);

    const portfolio = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(portfolioId);
    return mapDbPortfolioToPortfolio(portfolio);
  }

  async deletePortfolio(portfolioId: string, userId: string): Promise<void> {
    const db = getDatabase();
    
    // Verify portfolio belongs to user
    const existingPortfolio = db.prepare('SELECT id FROM portfolios WHERE id = ? AND user_id = ?')
      .get(portfolioId, userId);
    
    if (!existingPortfolio) {
      const error: ServiceError = new Error('Portfolio not found');
      error.statusCode = 404;
      throw error;
    }

    db.prepare('DELETE FROM portfolios WHERE id = ? AND user_id = ?').run(portfolioId, userId);
  }

  async addHolding(portfolioId: string, userId: string, holdingData: AddHoldingRequest): Promise<PortfolioHolding> {
    const db = getDatabase();
    
    // Verify portfolio belongs to user
    const portfolio = db.prepare('SELECT id FROM portfolios WHERE id = ? AND user_id = ?')
      .get(portfolioId, userId);
    
    if (!portfolio) {
      const error: ServiceError = new Error('Portfolio not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify fund exists
    const fund = await fundService.getFundByCode(holdingData.fundCode);
    if (!fund) {
      const error: ServiceError = new Error('Fund not found');
      error.statusCode = 404;
      throw error;
    }

    const now = new Date().toISOString();
    const holdingId = uuidv4();

    // Check if holding already exists
    const existingHolding = db.prepare(
      'SELECT * FROM portfolio_holdings WHERE portfolio_id = ? AND fund_code = ?'
    ).get(portfolioId, holdingData.fundCode) as any;

    if (existingHolding) {
      // Update existing holding (average price calculation)
      const newQuantity = existingHolding.quantity + holdingData.quantity;
      const newTotalCost = existingHolding.total_cost + (holdingData.quantity * holdingData.price);
      const newAveragePrice = newTotalCost / newQuantity;

      db.prepare(`
        UPDATE portfolio_holdings 
        SET quantity = ?, average_price = ?, total_cost = ?, updated_at = ?
        WHERE portfolio_id = ? AND fund_code = ?
      `).run(newQuantity, newAveragePrice, newTotalCost, now, portfolioId, holdingData.fundCode);

      // Record transaction
      await this.createTransaction(portfolioId, {
        fundCode: holdingData.fundCode,
        type: 'buy',
        quantity: holdingData.quantity,
        price: holdingData.price,
        date: now
      });

      return this.getHolding(portfolioId, holdingData.fundCode);
    } else {
      // Create new holding
      const totalCost = holdingData.quantity * holdingData.price;

      db.prepare(`
        INSERT INTO portfolio_holdings (id, portfolio_id, fund_code, quantity, average_price, total_cost, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(holdingId, portfolioId, holdingData.fundCode, holdingData.quantity, holdingData.price, totalCost, now, now);

      // Record transaction
      await this.createTransaction(portfolioId, {
        fundCode: holdingData.fundCode,
        type: 'buy',
        quantity: holdingData.quantity,
        price: holdingData.price,
        date: now
      });

      return this.getHolding(portfolioId, holdingData.fundCode);
    }
  }

  async updateHolding(portfolioId: string, userId: string, fundCode: string, updateData: UpdateHoldingRequest): Promise<PortfolioHolding> {
    const db = getDatabase();
    
    // Verify portfolio belongs to user
    const portfolio = db.prepare('SELECT id FROM portfolios WHERE id = ? AND user_id = ?')
      .get(portfolioId, userId);
    
    if (!portfolio) {
      const error: ServiceError = new Error('Portfolio not found');
      error.statusCode = 404;
      throw error;
    }

    const now = new Date().toISOString();
    
    // Update holding
    const updateFields = [];
    const updateValues = [];

    if (updateData.quantity !== undefined) {
      updateFields.push('quantity = ?');
      updateValues.push(updateData.quantity);
    }

    if (updateData.averagePrice !== undefined) {
      updateFields.push('average_price = ?');
      updateValues.push(updateData.averagePrice);
      updateFields.push('total_cost = ?');
      updateValues.push(updateData.quantity * updateData.averagePrice);
    }

    if (updateFields.length === 0) {
      const error: ServiceError = new Error('No valid fields to update');
      error.statusCode = 400;
      throw error;
    }

    updateFields.push('updated_at = ?');
    updateValues.push(now);
    updateValues.push(portfolioId, fundCode);

    db.prepare(`
      UPDATE portfolio_holdings 
      SET ${updateFields.join(', ')}
      WHERE portfolio_id = ? AND fund_code = ?
    `).run(...updateValues);

    return this.getHolding(portfolioId, fundCode);
  }

  async removeHolding(portfolioId: string, userId: string, fundCode: string): Promise<void> {
    const db = getDatabase();
    
    // Verify portfolio belongs to user
    const portfolio = db.prepare('SELECT id FROM portfolios WHERE id = ? AND user_id = ?')
      .get(portfolioId, userId);
    
    if (!portfolio) {
      const error: ServiceError = new Error('Portfolio not found');
      error.statusCode = 404;
      throw error;
    }

    db.prepare('DELETE FROM portfolio_holdings WHERE portfolio_id = ? AND fund_code = ?')
      .run(portfolioId, fundCode);
  }

  async getPortfolioHoldings(portfolioId: string): Promise<PortfolioHolding[]> {
    const db = getDatabase();
    
    const holdings = db.prepare('SELECT * FROM portfolio_holdings WHERE portfolio_id = ?')
      .all(portfolioId);

    return holdings.map(mapDbHoldingToHolding);
  }

  async getHolding(portfolioId: string, fundCode: string): Promise<PortfolioHolding> {
    const db = getDatabase();
    
    const holding = db.prepare('SELECT * FROM portfolio_holdings WHERE portfolio_id = ? AND fund_code = ?')
      .get(portfolioId, fundCode);
    
    if (!holding) {
      const error: ServiceError = new Error('Holding not found');
      error.statusCode = 404;
      throw error;
    }

    return mapDbHoldingToHolding(holding);
  }

  async createTransaction(portfolioId: string, transactionData: CreateTransactionRequest): Promise<Transaction> {
    const db = getDatabase();
    const transactionId = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO transactions (id, portfolio_id, fund_code, type, quantity, price, total_amount, date, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      transactionId,
      portfolioId,
      transactionData.fundCode,
      transactionData.type,
      transactionData.quantity,
      transactionData.price,
      transactionData.quantity * transactionData.price,
      transactionData.date || now,
      transactionData.notes,
      now
    );

    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(transactionId);
    return mapDbTransactionToTransaction(transaction);
  }

  async getPortfolioTransactions(portfolioId: string, userId?: string): Promise<Transaction[]> {
    const db = getDatabase();
    
    let query = 'SELECT * FROM transactions WHERE portfolio_id = ? ORDER BY date DESC';
    const params = [portfolioId];
    
    if (userId) {
      // Join with portfolios to verify ownership
      query = `
        SELECT t.* FROM transactions t
        JOIN portfolios p ON t.portfolio_id = p.id
        WHERE t.portfolio_id = ? AND p.user_id = ?
        ORDER BY t.date DESC
      `;
      params.push(userId);
    }
    
    const transactions = db.prepare(query).all(...params);
    return transactions.map(mapDbTransactionToTransaction);
  }

  async calculatePortfolioMetrics(portfolioId: string): Promise<{
    totalValue: number;
    totalCost: number;
    totalReturn: number;
    totalReturnPercent: number;
    estimatedYield: number;
  }> {
    const db = getDatabase();
    
    const holdings = await this.getPortfolioHoldings(portfolioId);
    
    let totalValue = 0;
    let totalCost = 0;
    let totalEstimatedYield = 0;

    for (const holding of holdings) {
      const fund = await fundService.getFundByCode(holding.fundCode);
      if (fund) {
        const currentValue = holding.quantity * fund.price;
        totalValue += currentValue;
        totalCost += holding.totalCost;
        
        if (fund.estimatedYield) {
          totalEstimatedYield += currentValue * (fund.estimatedYield / 100);
        }
      }
    }

    const totalReturn = totalValue - totalCost;
    const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    // Update portfolio totals
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE portfolios 
      SET total_value = ?, total_cost = ?, total_return = ?, total_return_percent = ?, updated_at = ?
      WHERE id = ?
    `).run(totalValue, totalCost, totalReturn, totalReturnPercent, now, portfolioId);

    return {
      totalValue,
      totalCost,
      totalReturn,
      totalReturnPercent,
      estimatedYield: totalEstimatedYield
    };
  }
}

function mapDbPortfolioToPortfolio(dbPortfolio: any): Portfolio {
  return {
    id: dbPortfolio.id,
    userId: dbPortfolio.user_id,
    name: dbPortfolio.name,
    totalValue: dbPortfolio.total_value,
    totalCost: dbPortfolio.total_cost,
    totalReturn: dbPortfolio.total_return,
    totalReturnPercent: dbPortfolio.total_return_percent,
    createdAt: dbPortfolio.created_at,
    updatedAt: dbPortfolio.updated_at
  };
}

function mapDbHoldingToHolding(dbHolding: any): PortfolioHolding {
  return {
    id: dbHolding.id,
    portfolioId: dbHolding.portfolio_id,
    fundCode: dbHolding.fund_code,
    quantity: dbHolding.quantity,
    averagePrice: dbHolding.average_price,
    totalCost: dbHolding.total_cost,
    createdAt: dbHolding.created_at,
    updatedAt: dbHolding.updated_at
  };
}

function mapDbTransactionToTransaction(dbTransaction: any): Transaction {
  return {
    id: dbTransaction.id,
    portfolioId: dbTransaction.portfolio_id,
    fundCode: dbTransaction.fund_code,
    type: dbTransaction.type,
    quantity: dbTransaction.quantity,
    price: dbTransaction.price,
    totalAmount: dbTransaction.total_amount,
    date: dbTransaction.date,
    notes: dbTransaction.notes,
    createdAt: dbTransaction.created_at
  };
}

export const portfolioService = new PortfolioService();