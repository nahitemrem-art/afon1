import { portfolioService } from '@/services/portfolioService';
import { setupDatabase } from '@/config/database';
import { createTestUser, createTestFund, createTestPortfolio, clearDatabase } from './testUtils';

describe('PortfolioService', () => {
  beforeAll(async () => {
    await setupDatabase();
  });
  
  beforeEach(async () => {
    await clearDatabase();
  });
  
  afterAll(async () => {
    // Clean up database connection if needed
  });
  
  describe('createPortfolio', () => {
    it('should create a new portfolio for user', async () => {
      const user = await createTestUser();
      const portfolioData = {
        name: 'My Test Portfolio'
      };
      
      const portfolio = await portfolioService.createPortfolio(user.id, portfolioData);
      
      expect(portfolio).toBeDefined();
      expect(portfolio.userId).toBe(user.id);
      expect(portfolio.name).toBe(portfolioData.name);
      expect(portfolio.totalValue).toBe(0);
      expect(portfolio.totalCost).toBe(0);
      expect(portfolio.totalReturn).toBe(0);
      expect(portfolio.totalReturnPercent).toBe(0);
      expect(portfolio.id).toBeDefined();
      expect(portfolio.createdAt).toBeDefined();
      expect(portfolio.updatedAt).toBeDefined();
    });
  });
  
  describe('getUserPortfolios', () => {
    it('should return empty array for user with no portfolios', async () => {
      const user = await createTestUser();
      
      const portfolios = await portfolioService.getUserPortfolios(user.id);
      
      expect(portfolios).toEqual([]);
    });
    
    it('should return user portfolios', async () => {
      const user = await createTestUser();
      const portfolio1 = await createTestPortfolio(user.id, 'Portfolio 1');
      const portfolio2 = await createTestPortfolio(user.id, 'Portfolio 2');
      
      const portfolios = await portfolioService.getUserPortfolios(user.id);
      
      expect(portfolios).toHaveLength(2);
      expect(portfolios.map(p => p.id)).toContain(portfolio1.id);
      expect(portfolios.map(p => p.id)).toContain(portfolio2.id);
    });
    
    it('should not return portfolios from other users', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const portfolio1 = await createTestPortfolio(user1.id, 'Portfolio 1');
      const portfolio2 = await createTestPortfolio(user2.id, 'Portfolio 2');
      
      const portfolios1 = await portfolioService.getUserPortfolios(user1.id);
      const portfolios2 = await portfolioService.getUserPortfolios(user2.id);
      
      expect(portfolios1).toHaveLength(1);
      expect(portfolios1[0].id).toBe(portfolio1.id);
      expect(portfolios2).toHaveLength(1);
      expect(portfolios2[0].id).toBe(portfolio2.id);
    });
  });
  
  describe('addHolding', () => {
    it('should add a new holding to portfolio', async () => {
      const user = await createTestUser();
      const portfolio = await createTestPortfolio(user.id, 'Test Portfolio');
      const fund = await createTestFund('TEST', 'Test Fund', 100);
      
      const holdingData = {
        fundCode: fund.code,
        quantity: 10,
        price: 95
      };
      
      const holding = await portfolioService.addHolding(portfolio.id, user.id, holdingData);
      
      expect(holding).toBeDefined();
      expect(holding.portfolioId).toBe(portfolio.id);
      expect(holding.fundCode).toBe(fund.code);
      expect(holding.quantity).toBe(10);
      expect(holding.averagePrice).toBe(95);
      expect(holding.totalCost).toBe(950);
    });
    
    it('should update existing holding with average price calculation', async () => {
      const user = await createTestUser();
      const portfolio = await createTestPortfolio(user.id, 'Test Portfolio');
      const fund = await createTestFund('TEST', 'Test Fund', 100);
      
      // Add initial holding
      await portfolioService.addHolding(portfolio.id, user.id, {
        fundCode: fund.code,
        quantity: 10,
        price: 95
      });
      
      // Add more of same fund at different price
      const holding = await portfolioService.addHolding(portfolio.id, user.id, {
        fundCode: fund.code,
        quantity: 5,
        price: 105
      });
      
      expect(holding.quantity).toBe(15);
      expect(holding.averagePrice).toBe((950 + 525) / 15); // (10*95 + 5*105) / 15
      expect(holding.totalCost).toBe(1475); // 950 + 525
    });
    
    it('should throw error for non-existent portfolio', async () => {
      const user = await createTestUser();
      const fund = await createTestFund('TEST', 'Test Fund', 100);
      
      await expect(
        portfolioService.addHolding('non-existent', user.id, {
          fundCode: fund.code,
          quantity: 10,
          price: 95
        })
      ).rejects.toThrow('Portfolio not found');
    });
    
    it('should throw error for non-existent fund', async () => {
      const user = await createTestUser();
      const portfolio = await createTestPortfolio(user.id, 'Test Portfolio');
      
      await expect(
        portfolioService.addHolding(portfolio.id, user.id, {
          fundCode: 'NONEXISTENT',
          quantity: 10,
          price: 95
        })
      ).rejects.toThrow('Fund not found');
    });
  });
  
  describe('calculatePortfolioMetrics', () => {
    it('should calculate correct metrics for empty portfolio', async () => {
      const user = await createTestUser();
      const portfolio = await createTestPortfolio(user.id, 'Test Portfolio');
      
      const metrics = await portfolioService.calculatePortfolioMetrics(portfolio.id);
      
      expect(metrics.totalValue).toBe(0);
      expect(metrics.totalCost).toBe(0);
      expect(metrics.totalReturn).toBe(0);
      expect(metrics.totalReturnPercent).toBe(0);
      expect(metrics.estimatedYield).toBe(0);
    });
    
    it('should calculate correct metrics for portfolio with holdings', async () => {
      const user = await createTestUser();
      const portfolio = await createTestPortfolio(user.id, 'Test Portfolio');
      const fund1 = await createTestFund('FUND1', 'Fund 1', 100);
      const fund2 = await createTestFund('FUND2', 'Fund 2', 50);
      
      // Add holdings
      await portfolioService.addHolding(portfolio.id, user.id, {
        fundCode: fund1.code,
        quantity: 10,
        price: 90
      });
      
      await portfolioService.addHolding(portfolio.id, user.id, {
        fundCode: fund2.code,
        quantity: 20,
        price: 45
      });
      
      const metrics = await portfolioService.calculatePortfolioMetrics(portfolio.id);
      
      expect(metrics.totalValue).toBe(10 * 100 + 20 * 50); // 1000 + 1000 = 2000
      expect(metrics.totalCost).toBe(10 * 90 + 20 * 45); // 900 + 900 = 1800
      expect(metrics.totalReturn).toBe(200); // 2000 - 1800
      expect(metrics.totalReturnPercent).toBeCloseTo(11.11, 1); // (200 / 1800) * 100
    });
  });
  
  describe('updateHolding', () => {
    it('should update holding quantity', async () => {
      const user = await createTestUser();
      const portfolio = await createTestPortfolio(user.id, 'Test Portfolio');
      const fund = await createTestFund('TEST', 'Test Fund', 100);
      
      await portfolioService.addHolding(portfolio.id, user.id, {
        fundCode: fund.code,
        quantity: 10,
        price: 95
      });
      
      const updatedHolding = await portfolioService.updateHolding(
        portfolio.id,
        user.id,
        fund.code,
        { quantity: 15 }
      );
      
      expect(updatedHolding.quantity).toBe(15);
      expect(updatedHolding.averagePrice).toBe(95); // Should remain unchanged
    });
    
    it('should update holding average price', async () => {
      const user = await createTestUser();
      const portfolio = await createTestPortfolio(user.id, 'Test Portfolio');
      const fund = await createTestFund('TEST', 'Test Fund', 100);
      
      await portfolioService.addHolding(portfolio.id, user.id, {
        fundCode: fund.code,
        quantity: 10,
        price: 95
      });
      
      const updatedHolding = await portfolioService.updateHolding(
        portfolio.id,
        user.id,
        fund.code,
        { averagePrice: 98 }
      );
      
      expect(updatedHolding.averagePrice).toBe(98);
      expect(updatedHolding.totalCost).toBe(10 * 98); // Should be recalculated
    });
  });
  
  describe('removeHolding', () => {
    it('should remove holding from portfolio', async () => {
      const user = await createTestUser();
      const portfolio = await createTestPortfolio(user.id, 'Test Portfolio');
      const fund = await createTestFund('TEST', 'Test Fund', 100);
      
      await portfolioService.addHolding(portfolio.id, user.id, {
        fundCode: fund.code,
        quantity: 10,
        price: 95
      });
      
      await portfolioService.removeHolding(portfolio.id, user.id, fund.code);
      
      const holdings = await portfolioService.getPortfolioHoldings(portfolio.id);
      expect(holdings).toHaveLength(0);
    });
  });
  
  describe('createTransaction', () => {
    it('should create a buy transaction', async () => {
      const user = await createTestUser();
      const portfolio = await createTestPortfolio(user.id, 'Test Portfolio');
      const fund = await createTestFund('TEST', 'Test Fund', 100);
      
      const transactionData = {
        fundCode: fund.code,
        type: 'buy' as const,
        quantity: 10,
        price: 95,
        notes: 'Test transaction'
      };
      
      const transaction = await portfolioService.createTransaction(portfolio.id, transactionData);
      
      expect(transaction).toBeDefined();
      expect(transaction.portfolioId).toBe(portfolio.id);
      expect(transaction.fundCode).toBe(fund.code);
      expect(transaction.type).toBe('buy');
      expect(transaction.quantity).toBe(10);
      expect(transaction.price).toBe(95);
      expect(transaction.totalAmount).toBe(950);
      expect(transaction.notes).toBe('Test transaction');
    });
  });
});