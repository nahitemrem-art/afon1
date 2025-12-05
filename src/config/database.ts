import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/portfolio.db';

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    const dir = path.dirname(DATABASE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    db = new Database(DATABASE_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export async function setupDatabase(): Promise<void> {
  const database = getDatabase();

  database.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Sessions table for JWT token management
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    -- Funds table
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

    -- Price history for performance calculations
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

    -- Live quote snapshots for real-time calculations
    CREATE TABLE IF NOT EXISTS live_quotes (
      fund_code TEXT PRIMARY KEY,
      price REAL NOT NULL,
      change REAL,
      change_percent REAL,
      estimated_yield REAL,
      last_updated TEXT NOT NULL,
      FOREIGN KEY (fund_code) REFERENCES funds (code)
    );

    -- User portfolios
    CREATE TABLE IF NOT EXISTS portfolios (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      total_value REAL DEFAULT 0,
      total_cost REAL DEFAULT 0,
      total_return REAL DEFAULT 0,
      total_return_percent REAL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    -- Portfolio holdings (funds in portfolios)
    CREATE TABLE IF NOT EXISTS portfolio_holdings (
      id TEXT PRIMARY KEY,
      portfolio_id TEXT NOT NULL,
      fund_code TEXT NOT NULL,
      quantity REAL NOT NULL,
      average_price REAL NOT NULL,
      total_cost REAL NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE,
      FOREIGN KEY (fund_code) REFERENCES funds (code),
      UNIQUE(portfolio_id, fund_code)
    );

    -- Transactions for tracking buys/sells
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
      created_at TEXT NOT NULL,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE,
      FOREIGN KEY (fund_code) REFERENCES funds (code)
    );

    -- User favorites
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      fund_code TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (fund_code) REFERENCES funds (code),
      UNIQUE(user_id, fund_code)
    );

    -- Performance windows cache for aggregated performance data
    CREATE TABLE IF NOT EXISTS performance_cache (
      fund_code TEXT PRIMARY KEY,
      one_week_return REAL,
      one_month_return REAL,
      three_months_return REAL,
      six_months_return REAL,
      one_year_return REAL,
      ytd_return REAL,
      last_calculated TEXT NOT NULL,
      FOREIGN KEY (fund_code) REFERENCES funds (code)
    );

    -- Indexes for better query performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_funds_code ON funds(code);
    CREATE INDEX IF NOT EXISTS idx_funds_category ON funds(category);
    CREATE INDEX IF NOT EXISTS idx_price_history_fund_date ON price_history(fund_code, date);
    CREATE INDEX IF NOT EXISTS idx_live_quotes_fund ON live_quotes(fund_code);
    CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
    CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_portfolio ON portfolio_holdings(portfolio_id);
    CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_fund ON portfolio_holdings(fund_code);
    CREATE INDEX IF NOT EXISTS idx_transactions_portfolio ON transactions(portfolio_id);
    CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
    CREATE INDEX IF NOT EXISTS idx_favorites_fund_code ON favorites(fund_code);
  `);

  console.log('Database tables created/verified');
}

export function closeDatabase(): void {
  if (db) {
    db.close();
  }
}