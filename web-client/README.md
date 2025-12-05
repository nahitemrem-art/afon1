# Fund Manager - Web Client

React web application for fund management, built with Vite, TypeScript, and Chakra UI.

## Features

- 📊 Browse and search funds
- 🔄 Compare multiple funds side-by-side
- 💼 Create and manage investment portfolios
- ⭐ Favorite funds for quick access
- 🎨 Modern UI with Chakra UI
- 📱 Responsive design
- 🔌 Mock data fallbacks for development

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Chakra UI** - Component library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Configuration

Create a `.env` file in the web-client directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:4000/api

# Environment
VITE_ENVIRONMENT=development

# Use Mock Data (true/false)
VITE_USE_MOCK_DATA=true
```

### Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_ENVIRONMENT` - Environment name (development/staging/production)
- `VITE_USE_MOCK_DATA` - Whether to use mock data fallbacks

## Project Structure

```
src/
├── api/              # API client and endpoint functions
│   ├── client.ts     # Axios instance configuration
│   ├── funds.ts      # Funds API endpoints
│   ├── portfolios.ts # Portfolios API endpoints
│   └── favorites.ts  # Favorites API endpoints
├── components/       # Reusable React components
│   ├── Layout.tsx    # Main layout with navigation
│   └── FundCard.tsx  # Fund card component
├── hooks/            # Custom React hooks
│   ├── useFunds.ts
│   ├── usePortfolios.ts
│   └── useFavorites.ts
├── pages/            # Page components
│   ├── FundsPage.tsx
│   ├── ComparePage.tsx
│   ├── PortfoliosPage.tsx
│   └── FavoritesPage.tsx
├── theme/            # Chakra UI theme configuration
│   └── index.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   ├── config.ts     # App configuration
│   └── mockData.ts   # Mock data for development
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The app expects the following API endpoints:

### Funds
- `GET /api/funds` - Get all funds
- `GET /api/funds/:id` - Get fund details
- `POST /api/funds/compare` - Compare funds

### Portfolios
- `GET /api/portfolios` - Get all portfolios
- `GET /api/portfolios/:id` - Get portfolio details
- `POST /api/portfolios` - Create portfolio
- `POST /api/portfolios/:id/holdings` - Add holding

### Favorites
- `GET /api/favorites` - Get all favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites/:id` - Remove favorite

## Mock Data

When `VITE_USE_MOCK_DATA=true`, the app uses mock data from `src/utils/mockData.ts`. This allows development without a backend.

## Customization

### Theme

Edit `src/theme/index.ts` to customize colors, fonts, and component styles:

```typescript
export const theme = extendTheme({
  colors: {
    brand: {
      500: '#2196f3', // Change primary color
      // ... other shades
    },
  },
});
```

### Mock Data

Edit `src/utils/mockData.ts` to customize the mock funds, portfolios, and favorites.

## Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
