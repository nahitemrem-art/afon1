# Quick Start Guide

This guide will help you get both the web and mobile clients running quickly.

## Prerequisites

- Node.js 18+ installed
- npm installed

## Setup (One-Time)

### Option 1: Install Everything at Once
```bash
npm run install:all
npm run build:shared
```

### Option 2: Install Step by Step
```bash
# 1. Install shared package
cd packages/shared
npm install
npm run build
cd ../..

# 2. Install web client
cd web-client
npm install
cd ..

# 3. Install mobile client
cd mobile-client
npm install
cd ..
```

## Running the Applications

### Web Client

```bash
# From root directory
npm run dev:web

# OR from web-client directory
cd web-client
npm run dev
```

Visit: `http://localhost:3000`

### Mobile Client

```bash
# From root directory
npm run dev:mobile

# OR from mobile-client directory
cd mobile-client
npm start
```

Then:
- Press `w` to open in web browser
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator (macOS only)
- Scan QR code with Expo Go app on your phone

## Configuration

### Using Mock Data (Default)

Both clients are pre-configured to use mock data, so they work without a backend:
- Web: Already set to use mock data
- Mobile: Already configured in app.json

### Connecting to Real API

#### Web Client
1. Create `web-client/.env`:
   ```env
   VITE_API_BASE_URL=http://your-api-url/api
   VITE_USE_MOCK_DATA=false
   ```

#### Mobile Client
1. Edit `mobile-client/app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "apiBaseUrl": "http://your-api-url/api",
         "useMockData": false
       }
     }
   }
   ```

**Note for mobile on physical device:**
- Replace `localhost` with your machine's IP address
- For Android emulator, use `http://10.0.2.2:4000/api`
- For iOS simulator, use `http://localhost:4000/api`

## Features to Try

### Web Client
1. Browse funds at the home page
2. Compare up to 5 funds side-by-side
3. Create portfolios and view performance
4. Add funds to favorites

### Mobile Client
1. Navigate between tabs (Funds, Compare, Portfolios, Favorites)
2. Same features as web in a mobile-friendly interface
3. Data persists offline with AsyncStorage
4. Push notification support (when connected to real backend)

## Troubleshooting

### Web client won't start
```bash
cd web-client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Mobile client metro bundler error
```bash
cd mobile-client
npm start -- --clear
```

### TypeScript errors in shared package
```bash
cd packages/shared
npm run build
```

## Next Steps

- Check out the full [README.md](./README.md) for detailed documentation
- Review the API integration section to connect to your backend
- Customize the theme and styling
- Add more features!

## Support

For issues or questions:
1. Check the full README.md
2. Review the code comments
3. Check the console for error messages
