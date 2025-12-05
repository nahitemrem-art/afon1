# TEFAS Tracker Backend

Node.js + Express API server for TEFAS fund data.

## Setup

```bash
npm install
cp .env.example .env
```

Configure `.env`:
```
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/tefas.db
CORS_ORIGIN=*
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Funds
- `GET /api/funds` - Get all funds (with pagination)
- `GET /api/funds/:code` - Get fund by code
- `GET /api/funds/:code/history` - Get price history
- `GET /api/funds/categories/list` - Get categories

### Portfolio
- `GET /api/portfolio` - Get all portfolios
- `POST /api/portfolio` - Create portfolio
- `GET /api/portfolio/:id` - Get portfolio by ID
- `POST /api/portfolio/:id/funds` - Add fund to portfolio
- `DELETE /api/portfolio/:id/funds/:fundCode` - Remove fund
- `DELETE /api/portfolio/:id` - Delete portfolio

### Favorites
- `GET /api/favorites` - Get all favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites/:fundCode` - Remove favorite
- `GET /api/favorites/check/:fundCode` - Check if favorite

### Live Returns
- `GET /api/live` - Get live estimates
- `GET /api/live/:fundCode` - Get estimate by code

## Data Sync

- Initial sync runs on server start
- Scheduled sync: Every weekday at 18:00 (after market close)
- Live estimates: Updated every 5 minutes

## Database

SQLite database with tables:
- `funds` - Fund information
- `price_history` - Historical prices
- `portfolios` - User portfolios
- `portfolio_funds` - Funds in portfolios
- `transactions` - Buy/sell transactions
- `favorites` - Favorite funds
- `live_estimates` - Intraday estimates

## Health Check

```bash
curl http://localhost:3000/health
```

## Structure

```
backend/
├── src/
│   ├── routes/      # API routes
│   ├── services/    # Business logic
│   ├── database.ts  # Database setup
│   └── index.ts     # Main server
├── data/           # SQLite database (auto-created)
└── package.json
```
