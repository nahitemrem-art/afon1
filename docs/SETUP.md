# Setup Guide

## Prerequisites

Make sure you have the following installed:
- Node.js 18 or higher
- npm or yarn
- Git

For mobile development:
- Expo CLI (`npm install -g expo-cli`)
- For Android: Android Studio with Android SDK
- For iOS (macOS only): Xcode

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tefas-tracker
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/tefas.db
CORS_ORIGIN=*
```

### 3. Install Mobile App Dependencies

```bash
cd ../mobile
npm install
```

Create a `.env` file:
```bash
cp .env.example .env
```

Edit the `.env` file:
```
API_BASE_URL=http://localhost:3000
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on http://localhost:3000

### Start the Mobile App

```bash
cd mobile
npm start
```

This will start the Expo development server. You can then:
- Press `w` to open in web browser
- Press `a` to open in Android emulator
- Scan the QR code with Expo Go app on your phone

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Mobile

For Android APK:
```bash
cd mobile
expo build:android
```

For web deployment:
```bash
cd mobile
expo build:web
```

## Troubleshooting

### Backend Issues

1. **Database connection errors**: Make sure the `data` directory exists and has write permissions
2. **Port already in use**: Change the PORT in `.env` file
3. **TEFAS API errors**: Check your internet connection and TEFAS website availability

### Mobile Issues

1. **Metro bundler errors**: Clear cache with `expo start -c`
2. **Module not found**: Delete `node_modules` and reinstall with `npm install`
3. **Android emulator not detected**: Make sure Android Studio is installed and AVD is created
4. **API connection errors**: 
   - On web: Use `http://localhost:3000`
   - On Android emulator: Use `http://10.0.2.2:3000`
   - On physical device: Use your computer's local IP address

## Development Tips

- Use `npm run dev` in backend for hot reload
- Backend logs are displayed in the terminal
- Use React DevTools for debugging the mobile app
- Check Expo documentation for platform-specific issues

## Environment Variables

### Backend
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `DATABASE_PATH`: SQLite database file path
- `CORS_ORIGIN`: CORS allowed origins

### Mobile
- `API_BASE_URL`: Backend API URL

## Database

The application uses SQLite for data storage. The database file is created automatically on first run at the path specified in `DATABASE_PATH`.

To reset the database, simply delete the database file and restart the server.

## Data Sync

- Fund data is automatically synced from TEFAS API
- Initial sync runs on server start
- Scheduled sync runs every weekday at 6:00 PM (after market close)
- Live estimates update every 5 minutes during trading hours
