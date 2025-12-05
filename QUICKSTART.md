# Quick Start Guide

Get TEFAS Tracker up and running in 5 minutes!

## 🚀 Fast Setup

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install mobile app dependencies
cd ../mobile
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```bash
cd backend
cp .env.example .env
```

**Mobile** (`mobile/.env`):
```bash
cd mobile
cp .env.example .env
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Mobile:**
```bash
cd mobile
npm start
```

### 4. Open the App

After running `npm start` in mobile:
- Press `w` for **Web** (opens in browser)
- Press `a` for **Android** (requires emulator or device)

## 🎯 First Steps

### View Funds
1. App opens on "Fonlar" (Funds) tab
2. Browse available funds
3. Use search to find specific funds
4. Sort by different criteria

### Add to Favorites
1. Tap the ⭐ star icon on any fund
2. Go to "Favoriler" (Favorites) tab to see saved funds

### Create a Portfolio
1. Go to "Portföy" (Portfolio) tab
2. Tap the + button
3. Enter portfolio name
4. Add funds with quantity and price

### Watch Live Returns
1. Go to "Canlı" (Live) tab
2. See estimated intraday returns
3. Auto-refreshes every minute

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is available
# Change PORT in backend/.env if needed
```

### Mobile app can't connect to API
```bash
# On Android emulator, use:
API_BASE_URL=http://10.0.2.2:3000

# On physical device, use your computer's IP:
API_BASE_URL=http://192.168.x.x:3000
```

### No funds showing
```bash
# Wait for initial data sync (takes ~1 minute)
# Check backend console for any errors
```

## 📱 Using on Physical Device

### Android
1. Install Expo Go from Play Store
2. Scan QR code shown in terminal
3. Make sure device and computer are on same network
4. Update `API_BASE_URL` in mobile/.env with your computer's IP

## 🔄 Development Workflow

### Hot Reload
- Backend: Automatically reloads on file changes
- Mobile: Shake device or press R to reload

### Clearing Cache
```bash
# Mobile app
cd mobile
expo start -c
```

### Reset Database
```bash
# Delete database file
rm backend/data/tefas.db
# Restart backend - will recreate database
```

## 📚 Next Steps

- Read [FEATURES.md](docs/FEATURES.md) for detailed feature documentation
- Check [API.md](docs/API.md) for API endpoints
- See [SETUP.md](docs/SETUP.md) for advanced configuration

## ✅ Success!

You should now have:
- ✅ Backend running on http://localhost:3000
- ✅ Mobile app running on web/Android
- ✅ Funds data syncing from TEFAS
- ✅ All features working

Happy tracking! 📈
