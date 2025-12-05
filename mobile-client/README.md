# Fund Manager - Mobile Client

React Native mobile application for fund management, built with Expo and TypeScript.

## Features

- 📱 Native iOS and Android apps
- 📊 Browse and search funds
- 🔄 Compare multiple funds
- 💼 Portfolio management
- ⭐ Favorites management
- 🔔 Push notifications support
- 💾 Offline caching with AsyncStorage
- 🎨 NativeWind styling (Tailwind for React Native)

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation (Stack + Tabs)
- **React Query** - Data fetching and caching
- **AsyncStorage** - Local data persistence
- **Expo Notifications** - Push notifications
- **NativeWind** - Tailwind CSS for React Native

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your mobile device (for testing)
- For simulators:
  - Android Studio (for Android emulator)
  - Xcode (for iOS simulator, macOS only)

### Install Dependencies
```bash
npm install
```

### Run the App
```bash
npm start
```

Then:
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator (macOS only)
- Press `w` to open in web browser
- Scan QR code with Expo Go app

### Platform-Specific Commands
```bash
npm run android    # Run on Android
npm run ios        # Run on iOS (macOS only)
npm run web        # Run as web app
```

## Configuration

Edit `app.json` to configure the app:

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

### API URL Configuration

- **iOS Simulator**: `http://localhost:4000/api`
- **Android Emulator**: `http://10.0.2.2:4000/api`
- **Physical Device**: Use your machine's IP (e.g., `http://192.168.1.100:4000/api`)

To find your IP:
- macOS/Linux: `ifconfig | grep inet`
- Windows: `ipconfig`

## Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── client.ts
│   ├── funds.ts
│   ├── portfolios.ts
│   └── favorites.ts
├── components/       # Reusable components
│   └── FundCard.tsx
├── hooks/            # Custom hooks
│   ├── useFunds.ts
│   ├── usePortfolios.ts
│   ├── useFavorites.ts
│   ├── useNotifications.ts
│   └── useOfflineCache.ts
├── navigation/       # Navigation configuration
│   └── MainNavigator.tsx
├── screens/          # Screen components
│   ├── FundsScreen.tsx
│   ├── CompareScreen.tsx
│   ├── PortfoliosScreen.tsx
│   └── FavoritesScreen.tsx
├── services/         # Services
│   ├── storage.ts    # AsyncStorage wrapper
│   └── notifications.ts  # Push notifications
├── types/            # TypeScript types
│   └── index.ts
└── utils/            # Utilities
    ├── config.ts
    └── mockData.ts
```

## Features

### Offline Caching

The app uses AsyncStorage to cache data locally:

```typescript
import { useOfflineCache } from './hooks/useOfflineCache';

const { data, isLoading } = useOfflineCache('funds', fetchFunds);
```

### Push Notifications

The app supports push notifications:

```typescript
import { useNotifications } from './hooks/useNotifications';

const { pushToken, scheduleNotification } = useNotifications();
```

To send a test notification:
```typescript
await scheduleNotification('Test', 'This is a test notification');
```

### Navigation

The app uses React Navigation with:
- **Bottom Tabs** for main screens
- **Stack Navigator** for nested navigation

## Development

### Clear Metro Cache
```bash
npm start -- --clear
```

### Run with Specific Device
```bash
expo start --android
expo start --ios
```

### Enable Developer Menu

- **iOS Simulator**: Cmd+D
- **Android Emulator**: Cmd+M (Mac) or Ctrl+M (Windows/Linux)
- **Physical Device**: Shake the device

## Building for Production

### Using EAS Build (Recommended)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Configure EAS:
   ```bash
   eas build:configure
   ```

3. Build:
   ```bash
   eas build --platform all
   ```

### Classic Build

1. iOS:
   ```bash
   expo build:ios
   ```

2. Android:
   ```bash
   expo build:android
   ```

## Push Notifications Setup

### For Production

1. Get push notification credentials:
   ```bash
   eas credentials
   ```

2. Update `app.json` with your project ID:
   ```json
   {
     "expo": {
       "extra": {
         "eas": {
           "projectId": "your-project-id"
         }
       }
     }
   }
   ```

3. Use the token from `useNotifications` hook to register with your backend

## Troubleshooting

### Metro bundler issues
```bash
npm start -- --clear
rm -rf node_modules
npm install
```

### Cannot connect to API
- Check if backend is running
- Verify API URL in app.json
- For physical device, use your machine's IP address
- Check firewall settings

### Android emulator not connecting
- Use `http://10.0.2.2:4000/api` instead of localhost
- Make sure emulator is running
- Check Android Studio settings

### iOS simulator issues
- Make sure Xcode is installed
- Run: `sudo xcode-select --switch /Applications/Xcode.app`
- Try resetting simulator

### Module resolution errors
```bash
rm -rf node_modules package-lock.json
npm install
```

## Testing on Physical Device

1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Make sure your device and computer are on the same network
3. Start the dev server: `npm start`
4. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

## API Integration

Same endpoints as web client. See main README for details.

When `useMockData: true`, the app uses mock data from `src/utils/mockData.ts`.

## Styling

The app uses custom StyleSheet components. To use NativeWind (Tailwind):

1. Styles are defined using StyleSheet.create()
2. Colors and spacing follow a consistent design system
3. Components are responsive to different screen sizes

## Performance Tips

- Use `React.memo` for expensive components
- Implement FlatList pagination for long lists
- Optimize images with proper sizing
- Use Hermes JavaScript engine (enabled by default)

## App Store Deployment

### iOS (Apple App Store)

1. Build with EAS: `eas build --platform ios`
2. Download the .ipa file
3. Upload to App Store Connect
4. Submit for review

### Android (Google Play)

1. Build with EAS: `eas build --platform android`
2. Download the .aab file
3. Upload to Google Play Console
4. Submit for review

## License

ISC
