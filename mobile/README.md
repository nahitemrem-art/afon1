# TEFAS Tracker Mobile App

React Native Expo application for TEFAS fund tracking.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` to configure your API endpoint:
```
API_BASE_URL=http://localhost:3000
```

## Running

```bash
# Start Expo dev server
npm start

# Then:
# Press 'w' for web
# Press 'a' for Android
# Scan QR with Expo Go app
```

## Platform-Specific API URLs

### Web Development
```
API_BASE_URL=http://localhost:3000
```

### Android Emulator
```
API_BASE_URL=http://10.0.2.2:3000
```

### Physical Device
Use your computer's local IP:
```
API_BASE_URL=http://192.168.x.x:3000
```

## Assets

The `assets` folder should contain:
- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen (1242x2436)
- `adaptive-icon.png` - Android adaptive icon (1024x1024)
- `favicon.png` - Web favicon (48x48)

You can use placeholder images or generate them using Expo's built-in tools.

## Building

### Android APK
```bash
expo build:android
```

### Web
```bash
expo build:web
```

## Features

- 📊 Browse all TEFAS funds
- ⭐ Save favorites
- 💼 Manage portfolios
- 📈 Live intraday returns
- 🌐 Works on web and Android

## Structure

```
mobile/
├── src/
│   ├── api/         # API client
│   ├── components/  # Reusable components
│   └── screens/     # App screens
├── assets/          # Images and icons
├── App.tsx         # Main app component
└── package.json
```
