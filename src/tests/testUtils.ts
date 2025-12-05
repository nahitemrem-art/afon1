import { getDatabase, setupDatabase } from '../config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function createTestUser(userData: Partial<{ email: string; password: string; name: string }> = {}) {
  const db = getDatabase();
  const userId = uuidv4();
  const now = new Date().toISOString();
  
  const defaultUserData = {
    email: `test-${userId}@example.com`,
    password: 'testpassword123',
    name: 'Test User'
  };
  
  const finalUserData = { ...defaultUserData, ...userData };
  const passwordHash = await bcrypt.hash(finalUserData.password, 12);
  
  db.prepare(`
    INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, finalUserData.email, passwordHash, finalUserData.name, now, now);
  
  return {
    id: userId,
    email: finalUserData.email,
    name: finalUserData.name,
    createdAt: now,
    updatedAt: now
  };
}

export async function createTestFund(code: string, name: string, price: number) {
  const db = getDatabase();
  const fundId = uuidv4();
  const now = new Date().toISOString();
  const date = now.split('T')[0];
  
  db.prepare(`
    INSERT INTO funds (id, code, name, price, date, category, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(fundId, code, name, price, date, 'Test', now);
  
  return {
    id: fundId,
    code,
    name,
    price,
    date,
    category: 'Test',
    updatedAt: now
  };
}

export async function createTestPortfolio(userId: string, name: string) {
  const db = getDatabase();
  const portfolioId = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO portfolios (id, user_id, name, total_value, total_cost, total_return, total_return_percent, created_at, updated_at)
    VALUES (?, ?, ?, 0, 0, 0, 0, ?, ?)
  `).run(portfolioId, userId, name, now, now);
  
  return {
    id: portfolioId,
    userId,
    name,
    totalValue: 0,
    totalCost: 0,
    totalReturn: 0,
    totalReturnPercent: 0,
    createdAt: now,
    updatedAt: now
  };
}

export async function clearDatabase() {
  const db = getDatabase();
  
  // Clear all tables in correct order (respecting foreign keys)
  db.prepare('DELETE FROM transactions').run();
  db.prepare('DELETE FROM portfolio_holdings').run();
  db.prepare('DELETE FROM portfolios').run();
  db.prepare('DELETE FROM favorites').run();
  db.prepare('DELETE FROM sessions').run();
  db.prepare('DELETE FROM users').run();
  db.prepare('DELETE FROM price_history').run();
  db.prepare('DELETE FROM live_quotes').run();
  db.prepare('DELETE FROM performance_cache').run();
  db.prepare('DELETE FROM funds').run();
}

export function getTestDatabase() {
  return getDatabase();
}