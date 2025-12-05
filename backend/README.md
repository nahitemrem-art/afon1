# TEFAS Backend Service

Backend integration service for fetching, normalizing, and persisting Turkish fund (TEFAS) data.

## Features

- **Dual Data Sources**: Fetch fund data via public TEFAS API with scraping fallback
- **Configurable HTTP Client**: Built-in retry logic with exponential backoff
- **Response Normalization**: Converts API and scraped data to unified schema
- **Schema Validation**: Zod-based validation for data integrity
- **Automated Scheduling**: Node-cron jobs for morning/midday/evening sync
- **REST API**: Manual trigger endpoints and query interface
- **In-Memory Repository**: Stub adapter for fund quotes (DB integration pending)
- **Unit Tests**: Parser and normalizer test coverage

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts               # Environment configuration
│   │   └── tefas.config.ts      # TEFAS-specific config
│   ├── repository/
│   │   ├── FundQuoteRepository.ts           # Repository interface
│   │   └── InMemoryFundQuoteRepository.ts   # Stub implementation
│   ├── routes/
│   │   └── tefasRoutes.ts       # REST endpoints
│   ├── scheduler/
│   │   └── TefasScheduler.ts    # Cron job scheduler
│   ├── tefas/
│   │   ├── __tests__/
│   │   │   ├── normalizer.test.ts
│   │   │   └── validator.test.ts
│   │   ├── api.ts               # TEFAS API client
│   │   ├── http-client.ts       # Configurable HTTP client with retries
│   │   ├── normalizer.ts        # Response normalizer
│   │   ├── schema.ts            # Zod schemas
│   │   ├── scraper.ts           # HTML scraping fallback
│   │   ├── service.ts           # Core business logic
│   │   ├── types.ts             # TypeScript types
│   │   └── validator.ts         # Schema validator
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Entry point
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Installation

```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env` file:

```env
# HTTP Server
PORT=4000
HOST=0.0.0.0

# TEFAS API
TEFAS_API_BASE_URL=https://www.tefas.gov.tr
TEFAS_METADATA_ENDPOINT=/api/DB/PortfoyDagitim
TEFAS_PERFORMANCE_ENDPOINT=/api/DB/FonBilgileri
TEFAS_PREFER_SCRAPER=false
TEFAS_ENABLE_FALLBACK=true

# HTTP Client
HTTP_TIMEOUT=30000
HTTP_MAX_RETRIES=3
HTTP_RETRY_DELAY=1000

# Cron Schedule (cron format)
MORNING_CRON=0 9 * * 1-5
MIDDAY_CRON=0 13 * * 1-5
EVENING_CRON=0 18 * * 1-5
CRON_TZ=Europe/Istanbul
```

### TEFAS URLs

The service uses the following TEFAS endpoints:

#### Public API Endpoints
- **Base URL**: `https://www.tefas.gov.tr`
- **Fund List**: `/api/DB/PortfoyDagitim`
- **Fund Info**: `/api/DB/FonBilgileri`
- **Fund Values**: `/api/DB/PortfoyDagitim`

#### Scraping Endpoints (Fallback)
- **Base URL**: `https://www.tefas.gov.tr`
- **Fund Details**: `/FonBilgileri.aspx?FonKod={code}`
- **Historical Data**: `/TarihselVeriler.aspx`

### Cron Schedule

The default cron schedule runs on Turkish business days (Monday-Friday):

- **Morning Sync**: `0 9 * * 1-5` (9:00 AM)
- **Midday Sync**: `0 13 * * 1-5` (1:00 PM)
- **Evening Sync**: `0 18 * * 1-5` (6:00 PM)

#### Cron Format
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (0: Sunday)
│ │ │ │ │
* * * * *
```

#### Custom Schedules

```env
# Every hour on weekdays
MORNING_CRON=0 * * * 1-5

# Every 30 minutes during trading hours (9:30 AM - 5:30 PM)
MIDDAY_CRON=*/30 9-17 * * 1-5

# Once per day at midnight
EVENING_CRON=0 0 * * *
```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## API Endpoints

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2023-12-05T10:30:00.000Z"
}
```

### List Persisted Funds

```
GET /tefas/funds
```

**Response:**
```json
{
  "funds": [
    {
      "metadata": {
        "code": "ABC",
        "title": "ABC Fund",
        "type": "Hisse",
        "category": "Equity"
      },
      "performance": {
        "code": "ABC",
        "date": "2023-12-05",
        "price": 1.2345,
        "dailyReturn": 0.12,
        "monthlyReturn": 1.5,
        "threeMonthReturn": 4.2,
        "annualReturn": 15.8
      }
    }
  ]
}
```

### Manual Sync

Trigger a manual sync of fund data.

```
POST /tefas/sync
Content-Type: application/json
```

**Body:**
```json
{
  "window": "daily"
}
```

**Parameters:**
- `window` (optional): `"daily" | "monthly" | "threeMonth" | "annual" | "all"`
  - Filters funds based on available return data
  - Default: `"all"`

**Response:**
```json
{
  "message": "Manual sync completed",
  "window": "all",
  "source": "api",
  "fundsSynced": 250
}
```

### Run Scheduler Job

Execute a scheduled sync manually.

```
POST /tefas/scheduler/run
Content-Type: application/json
```

**Body:**
```json
{
  "window": "all"
}
```

**Response:**
```json
{
  "message": "Scheduled sync executed manually",
  "window": "all"
}
```

### Clear Cache

Clear the in-memory fund cache.

```
DELETE /tefas/cache
```

**Response:**
```json
{
  "message": "In-memory cache cleared"
}
```

## Data Models

### Fund Metadata

```typescript
{
  code: string;
  title: string;
  type?: string;
  category?: string;
  foundationDate?: string;
  totalValue?: number;
  totalShare?: number;
  investorCount?: number;
}
```

### Fund Performance

```typescript
{
  code: string;
  date: string;
  price: number;
  dailyReturn?: number;
  monthlyReturn?: number;
  threeMonthReturn?: number;
  annualReturn?: number;
  totalReturn?: number;
}
```

## Architecture

### HTTP Client

The `HttpClient` class provides:
- Configurable base URL, timeout, and headers
- Automatic retry with exponential backoff
- Retry on network errors and 5xx responses
- Respects 429 (rate limit) errors

### Data Flow

1. **Scheduler** triggers sync at configured times
2. **Service** fetches data from API (falls back to scraper on failure)
3. **Normalizer** converts raw data to unified schema
4. **Validator** validates against Zod schemas
5. **Repository** persists validated data (in-memory for now)

### Error Handling

- Network errors: Automatic retry with backoff
- API errors: Fallback to scraper
- Validation errors: Logged, invalid records skipped
- Scheduler errors: Logged, next run continues as scheduled

## Testing

Unit tests cover:
- Normalizer: API and scraped data transformation
- Validator: Schema validation and error handling

Run tests:
```bash
npm test
```

## Future Enhancements

- Replace in-memory repository with PostgreSQL/MongoDB adapter
- Add database migration scripts
- Implement BullMQ for distributed job processing
- Add WebSocket support for real-time updates
- Implement caching layer (Redis)
- Add authentication/authorization
- Create admin dashboard for sync management

## License

ISC
