# TEFAS Data Service

Integration service for fetching, normalizing, and managing Turkish fund (TEFAS) data.

## Overview

This project provides a backend service that:
- Fetches fund metadata and performance data from the TEFAS public API
- Falls back to web scraping when the API is unavailable
- Normalizes and validates data using Zod schemas
- Schedules automated sync jobs (morning, midday, evening)
- Exposes REST endpoints for manual synchronization
- Provides an in-memory repository (DB adapter pending)

## Project Structure

```
.
├── backend/              # Backend service
│   ├── src/             # Source code
│   ├── tests/           # Unit tests
│   ├── package.json     # Dependencies
│   └── README.md        # Detailed documentation
└── README.md            # This file
```

## Quick Start

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:4000`.

## API Endpoints

- `GET /health` - Health check
- `GET /tefas/funds` - List persisted funds
- `POST /tefas/sync` - Manual sync trigger
- `POST /tefas/scheduler/run` - Run scheduled job manually
- `DELETE /tefas/cache` - Clear cache

## Documentation

For detailed documentation, including:
- Configuration options
- TEFAS URLs and endpoints
- Cron schedule format
- API documentation
- Architecture details

See the [backend README](./backend/README.md).

## Testing

```bash
cd backend
npm test
```

## License

ISC
