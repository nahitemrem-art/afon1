# Fund Management Application

A modern full-stack fund management application with both web and mobile clients, featuring portfolio building, fund comparison, and favorites management.

## Project Structure

```
.
├── packages/
│   └── shared/              # Shared TypeScript interfaces and types
├── web-client/              # React web application
├── mobile-client/           # Expo mobile application
└── README.md
```

## Tech Stack

### Web Client
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Chakra UI
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Styling**: Emotion (via Chakra UI)

### Mobile Client
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Styling**: NativeWind (Tailwind for React Native)
- **Offline Storage**: AsyncStorage
- **Push Notifications**: Expo Notifications

### Shared Package
- **TypeScript interfaces** for API responses
- **Common types** shared between web and mobile

## Features

Both clients support:
- ✅ Browse all available funds
- ✅ Compare multiple funds side-by-side (up to 5)
- ✅ Create and manage investment portfolios
- ✅ Add/remove funds to favorites
- ✅ Mock data fallbacks for offline development
- ✅ TypeScript for type safety

Mobile-specific features:
- 📱 Push notifications support
- 💾 Offline caching with AsyncStorage
- 🔄 Native navigation with tabs

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- For mobile development:
  - Expo CLI (will be installed automatically)
  - Expo Go app on your mobile device (for testing)
  - Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install shared package dependencies**
   ```bash
   cd packages/shared
   npm install
   npm run build
   cd ../..
   ```

3. **Install web client dependencies**
   ```bash
   cd web-client
   npm install
   cd ..
   ```

4. **Install mobile client dependencies**
   ```bash
   cd mobile-client
   npm install
   cd ..
   ```

## Running the Applications

### Web Client

```bash
cd web-client
npm run dev
```

The web app will be available at `http://localhost:3000`

#### Build for production
```bash
npm run build
npm run preview
```

### Mobile Client

```bash
cd mobile-client
npm start
```

This will start the Expo development server. You can then:
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator (macOS only)
- Scan the QR code with Expo Go app on your physical device

#### Platform-specific commands
```bash
npm run android    # Run on Android
npm run ios        # Run on iOS (macOS only)
npm run web        # Run as web app
```

## Configuration

### Web Client

Create a `.env` file in the `web-client` directory:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_ENVIRONMENT=development
VITE_USE_MOCK_DATA=true
```

**Environment Variables:**
- `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:4000/api`)
- `VITE_ENVIRONMENT` - Environment name (development/staging/production)
- `VITE_USE_MOCK_DATA` - Use mock data fallbacks (true/false)

### Mobile Client

Configure the app by editing `mobile-client/app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://localhost:4000/api",
      "environment": "development",
      "useMockData": true
    }
  }
}
```

**Configuration Options:**
- `apiBaseUrl` - Backend API URL
  - For iOS simulator: `http://localhost:4000/api`
  - For Android emulator: `http://10.0.2.2:4000/api`
  - For physical device: Use your machine's IP address (e.g., `http://192.168.1.100:4000/api`)
- `environment` - Environment name
- `useMockData` - Use mock data fallbacks (true/false)

## API Integration

Both clients are configured to work with a backend API. The expected API endpoints are:

### Funds
- `GET /api/funds` - Get all funds
- `GET /api/funds/:id` - Get fund by ID
- `POST /api/funds/compare` - Compare multiple funds
  - Body: `{ fundIds: string[] }`

### Portfolios
- `GET /api/portfolios` - Get all portfolios
- `GET /api/portfolios/:id` - Get portfolio by ID
- `POST /api/portfolios` - Create portfolio
  - Body: `{ name: string }`
- `POST /api/portfolios/:id/holdings` - Add holding to portfolio
  - Body: `{ fundId: string, shares: number, purchasePrice: number }`

### Favorites
- `GET /api/favorites` - Get all favorites
- `POST /api/favorites` - Add favorite
  - Body: `{ fundId: string }`
- `DELETE /api/favorites/:id` - Remove favorite

## Mock Data

Both clients include comprehensive mock data that allows them to run without a backend. This is controlled by the configuration:
- Web: `VITE_USE_MOCK_DATA=true`
- Mobile: `useMockData: true` in app.json

Mock data includes:
- 5 sample funds (VTSAX, FXAIX, AGG, ARKK, VTIAX)
- 2 sample portfolios with holdings
- 3 sample favorites

## Development

### Project Structure

**Web Client:**
```
web-client/
├── src/
│   ├── api/           # API client and endpoints
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── theme/         # Chakra UI theme configuration
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions and mock data
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**Mobile Client:**
```
mobile-client/
├── src/
│   ├── api/           # API client and endpoints
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── navigation/    # Navigation configuration
│   ├── screens/       # Screen components
│   ├── services/      # Services (storage, notifications)
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions and mock data
├── App.tsx            # Main app component
├── app.json           # Expo configuration
├── package.json
└── tsconfig.json
```

### Code Style

- TypeScript strict mode enabled
- ESLint configured for React best practices
- Functional components with hooks
- Async/await for asynchronous operations

## Troubleshooting

### Web Client

**Port already in use:**
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3001
```

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Mobile Client

**Metro bundler issues:**
```bash
npm start -- --clear
```

**Cannot connect to API from physical device:**
- Make sure your device is on the same network as your development machine
- Use your machine's local IP address instead of localhost
- Check firewall settings

**iOS simulator not opening:**
- Make sure Xcode is installed
- Run: `sudo xcode-select --switch /Applications/Xcode.app`

**Android emulator issues:**
- Make sure Android Studio is installed
- Create an AVD (Android Virtual Device) in Android Studio
- Set ANDROID_HOME environment variable

## Production Deployment

### Web Client

1. Update `.env` with production API URL
2. Build the application:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

### Mobile Client

1. Update `app.json` with production configuration
2. Build for iOS:
   ```bash
   expo build:ios
   ```
3. Build for Android:
   ```bash
   expo build:android
   ```

Or use EAS Build for managed workflow:
```bash
npm install -g eas-cli
eas build --platform all
```

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
