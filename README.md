# Portfolio API

A comprehensive REST API for portfolio management with authentication, fund tracking, and performance analytics.

## Features

- **🔐 Authentication**: JWT-based authentication with secure session management
- **📊 Fund Management**: Search, list, and analyze funds with performance windows
- **💼 Portfolio CRUD**: Create, read, update, and delete user portfolios
- **📈 Holdings Management**: Add, update, and track portfolio holdings with gain/loss calculations
- **⭐ Favorites**: Toggle and manage favorite funds
- **📉 Real-time Analytics**: Gain/loss calculations and projected yield using live quote snapshots
- **🔍 Advanced Search**: Filter funds by category, performance metrics, and custom criteria
- **📚 API Documentation**: Full OpenAPI/Swagger documentation
- **✅ Input Validation**: Comprehensive validation using Zod schemas
- **🧪 Unit Tests**: Full test coverage for core services

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest with supertest

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd portfolio-api

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Database Setup

```bash
# Run database migration
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### Running the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:3000` by default.

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow

1. **Register** a new user account
2. **Login** to receive a JWT token
3. **Include** the token in subsequent requests

## API Endpoints

### Authentication

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "strongpassword123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "strongpassword123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

#### Logout All Sessions
```http
POST /api/v1/auth/logout-all
Authorization: Bearer <token>
```

### Funds

#### Search Funds
```http
GET /api/v1/funds?search=TEFAS&category=Hisse%20Senedi&sortBy=yearlyReturn&sortOrder=desc&page=1&limit=50
```

#### Get Fund by Code
```http
GET /api/v1/funds/TEFAS
```

#### Get Fund Price History
```http
GET /api/v1/funds/TEFAS/history?limit=30
```

#### Get Live Quotes
```http
GET /api/v1/funds/live/quotes?fundCodes=TEFAS,TEFB,TEFBAL
```

#### Calculate Performance Windows
```http
POST /api/v1/funds/TEFAS/performance
```

#### Get Categories
```http
GET /api/v1/funds/categories/list
```

### Portfolios

#### Create Portfolio
```http
POST /api/v1/portfolios
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Investment Portfolio"
}
```

#### Get User Portfolios
```http
GET /api/v1/portfolios
Authorization: Bearer <token>
```

#### Get Portfolio by ID
```http
GET /api/v1/portfolios/{portfolioId}
Authorization: Bearer <token>
```

#### Update Portfolio
```http
PUT /api/v1/portfolios/{portfolioId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Portfolio Name"
}
```

#### Delete Portfolio
```http
DELETE /api/v1/portfolios/{portfolioId}
Authorization: Bearer <token>
```

#### Add Holding to Portfolio
```http
POST /api/v1/portfolios/{portfolioId}/holdings
Authorization: Bearer <token>
Content-Type: application/json

{
  "fundCode": "TEFAS",
  "quantity": 10,
  "price": 125.50
}
```

#### Update Holding
```http
PUT /api/v1/portfolios/{portfolioId}/holdings/{fundCode}
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 15,
  "averagePrice": 127.00
}
```

#### Remove Holding
```http
DELETE /api/v1/portfolios/{portfolioId}/holdings/{fundCode}
Authorization: Bearer <token>
```

#### Get Portfolio Transactions
```http
GET /api/v1/portfolios/{portfolioId}/transactions
Authorization: Bearer <token>
```

#### Get Portfolio Metrics
```http
GET /api/v1/portfolios/{portfolioId}/metrics
Authorization: Bearer <token>
```

### Favorites

#### Toggle Favorite
```http
POST /api/v1/favorites/toggle
Authorization: Bearer <token>
Content-Type: application/json

{
  "fundCode": "TEFAS"
}
```

#### Add to Favorites
```http
POST /api/v1/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "fundCode": "TEFAS"
}
```

#### Remove from Favorites
```http
DELETE /api/v1/favorites/{fundCode}
Authorization: Bearer <token>
```

#### Get User Favorites
```http
GET /api/v1/favorites
Authorization: Bearer <token>
```

#### Check if Fund is Favorited
```http
GET /api/v1/favorites/{fundCode}/check
Authorization: Bearer <token>
```

## Sample API Usage

### Complete Portfolio Management Flow

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "investor@example.com",
    "password": "securepass123",
    "name": "John Investor"
  }'

# 2. Login to get token
TOKEN=$(curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "investor@example.com",
    "password": "securepass123"
  }' | jq -r '.data.token')

# 3. Create a portfolio
PORTFOLIO_ID=$(curl -X POST http://localhost:3000/api/v1/portfolios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Growth Portfolio"}' | jq -r '.data.id')

# 4. Add holdings to portfolio
curl -X POST http://localhost:3000/api/v1/portfolios/$PORTFOLIO_ID/holdings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fundCode": "TEFAS",
    "quantity": 10,
    "price": 125.50
  }'

# 5. Get portfolio with metrics
curl -X GET http://localhost:3000/api/v1/portfolios/$PORTFOLIO_ID \
  -H "Authorization: Bearer $TOKEN"

# 6. Add fund to favorites
curl -X POST http://localhost:3000/api/v1/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fundCode": "TEFAS"}'

# 7. Search funds with performance data
curl -X GET "http://localhost:3000/api/v1/funds?sortBy=yearlyReturn&sortOrder=desc&limit=10"
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "data": [
      // Array of items
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

## Performance Windows

The API provides aggregated performance windows for funds:

- **1 Week**: 7-day return
- **1 Month**: 30-day return  
- **3 Months**: 90-day return
- **6 Months**: 180-day return
- **1 Year**: 365-day return
- **YTD**: Year-to-date return

## Real-time Yield Calculations

The system calculates projected real-time yield using:

1. **Live Quote Snapshots**: Current market prices
2. **Historical Performance**: Past returns as indicators
3. **Portfolio Holdings**: Current positions and costs
4. **Gain/Loss Metrics**: Real-time P&L calculations

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- Unit tests for services in `src/tests/`
- Integration tests for API endpoints
- Test utilities in `src/tests/testUtils.ts`
- Database setup for tests in `src/tests/setup.ts`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | CORS allowed origin | `*` |
| `DATABASE_PATH` | SQLite database file | `./data/portfolio.db` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `API_PREFIX` | API route prefix | `/api/v1` |
| `LOG_LEVEL` | Logging level | `info` |

## Database Schema

The API uses SQLite with the following main tables:

- `users` - User accounts
- `sessions` - JWT session management
- `funds` - Fund information
- `price_history` - Historical price data
- `live_quotes` - Real-time quote snapshots
- `portfolios` - User portfolios
- `portfolio_holdings` - Portfolio holdings
- `transactions` - Buy/sell transactions
- `favorites` - User favorites
- `performance_cache` - Cached performance windows

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Token revocation and expiration
- **Input Validation**: Comprehensive Zod validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Configurable origin policies
- **Helmet**: Security headers middleware

## Development

### Code Style
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

### Database Management
```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.