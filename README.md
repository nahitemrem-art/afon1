# TEFAS Funds Tracker

A comprehensive TEFAS (Turkish mutual funds) tracking application for both web and Android platforms.

## Features

- 📊 Fund information with daily, monthly, 3-monthly, and yearly returns
- 💼 Portfolio management - track your investments
- ⭐ Favorites section for quick access
- 📈 Live intraday estimated returns
- 📱 Cross-platform - works on web and Android

## Tech Stack

- **Frontend**: React Native with Expo (Web + Android)
- **Backend**: Node.js + Express
- **Database**: SQLite for local storage, MongoDB for backend
- **Language**: TypeScript

## Project Structure

```
├── mobile/          # React Native Expo app (web + Android)
├── backend/         # Node.js API server
├── shared/          # Shared types and utilities
└── docs/            # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- Android Studio (for Android development)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Mobile App Setup

```bash
cd mobile
npm install
npm start
```

Then:
- Press `w` for web
- Press `a` for Android (requires Android emulator or device)

## Environment Variables

Create `.env` files in both `backend` and `mobile` directories:

**backend/.env**
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tefas
NODE_ENV=development
```

**mobile/.env**
```
API_BASE_URL=http://localhost:3000
```

## License

MIT
