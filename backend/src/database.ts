import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/tefas.db';

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    const dir = path.dirname(DATABASE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    db = new Database(DATABASE_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export async function setupDatabase(): Promise<void> {
  const database = getDatabase();

  database.exec(`
    CREATE TABLE IF NOT EXISTS funds (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      date TEXT NOT NULL,
      daily_return REAL,
      weekly_return REAL,
      monthly_return REAL,
      three_month_return REAL,
      six_month_return REAL,
      yearly_return REAL,
      category TEXT,
      total_value REAL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fund_code TEXT NOT NULL,
      date TEXT NOT NULL,
      price REAL NOT NULL,
      change REAL,
      change_percent REAL,
      FOREIGN KEY (fund_code) REFERENCES funds (code),
      UNIQUE(fund_code, date)
    );

    CREATE TABLE IF NOT EXISTS portfolios (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      total_value REAL DEFAULT 0,
      total_return REAL DEFAULT 0,
      total_return_percent REAL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS portfolio_funds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id TEXT NOT NULL,
      fund_code TEXT NOT NULL,
      fund_name TEXT NOT NULL,
      quantity REAL NOT NULL,
      average_price REAL NOT NULL,
      current_price REAL NOT NULL,
      total_value REAL NOT NULL,
      total_cost REAL NOT NULL,
      profit REAL NOT NULL,
      profit_percent REAL NOT NULL,
      added_at TEXT NOT NULL,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE,
      FOREIGN KEY (fund_code) REFERENCES funds (code)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      portfolio_id TEXT NOT NULL,
      fund_code TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('buy', 'sell')),
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      total_amount REAL NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favorites (
      fund_code TEXT PRIMARY KEY,
      added_at TEXT NOT NULL,
      FOREIGN KEY (fund_code) REFERENCES funds (code)
    );

    CREATE TABLE IF NOT EXISTS live_estimates (
      fund_code TEXT PRIMARY KEY,
      estimated_price REAL NOT NULL,
      estimated_return REAL NOT NULL,
      estimated_return_percent REAL NOT NULL,
      confidence REAL NOT NULL,
      last_updated TEXT NOT NULL,
      FOREIGN KEY (fund_code) REFERENCES funds (code)
    );

    CREATE INDEX IF NOT EXISTS idx_funds_code ON funds(code);
    CREATE INDEX IF NOT EXISTS idx_funds_category ON funds(category);
    CREATE INDEX IF NOT EXISTS idx_price_history_fund_date ON price_history(fund_code, date);
    CREATE INDEX IF NOT EXISTS idx_portfolio_funds_portfolio ON portfolio_funds(portfolio_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_portfolio ON transactions(portfolio_id);
  `);

  console.log('Database tables created/verified');
}

export function closeDatabase(): void {
  if (db) {
    db.close();
  }
}
