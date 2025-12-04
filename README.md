# 📊 TEFAS Funds Tracker

<div align="center">

A comprehensive TEFAS (Turkish mutual funds) tracking application for both web and Android platforms.

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [✨ Features](#-features) • [🛠️ Tech Stack](#️-tech-stack)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React Native](https://img.shields.io/badge/React_Native-0.73-blue.svg)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org)

</div>

---

## ✨ Features

<table>
  <tr>
    <td width="50%">

### 📊 Fund Information
- View all TEFAS funds
- Daily, weekly, monthly returns
- 3-month, 6-month, yearly performance
- Search and filter functionality
- Category-based sorting
- Price history

### 💼 Portfolio Management
- Create multiple portfolios
- Track investments
- Automatic profit/loss calculation
- Real-time portfolio valuation
- Transaction history
- Performance analytics

</td>
    <td width="50%">

### ⭐ Favorites
- Save frequently watched funds
- Quick access to favorites
- One-tap add/remove
- Synchronized across devices

### 📈 Live Intraday Returns
- Real-time price estimates
- Market-based calculations
- Confidence indicators
- Auto-refresh every minute
- Visual trend indicators

### 📱 Cross-Platform
- **Web**: Full browser support
- **Android**: Native app experience
- Responsive design
- Offline capabilities

</td>
  </tr>
</table>

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI (optional)
- Android Studio (for Android development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tefas-tracker

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or install manually
cd backend && npm install
cd ../mobile && npm install
```

### Running the Application

**Option 1: Using Make (Recommended)**
```bash
make install    # Install dependencies
make dev        # Start both servers
make seed       # Seed sample data
```

**Option 2: Manual**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Mobile):
```bash
cd mobile
npm start
# Then press 'w' for web or 'a' for Android
```

### Quick Test
```bash
# Test the API
./scripts/test-api.sh

# Or manually
curl http://localhost:3000/health
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (better-sqlite3)
- **API Client**: Axios
- **Scheduling**: node-cron
- **Security**: Helmet, CORS
- **Logging**: Morgan

### Frontend
- **Framework**: React Native
- **Platform**: Expo SDK 50
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State**: React Query (TanStack)
- **HTTP**: Axios
- **Icons**: Expo Vector Icons

### DevOps
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Process Manager**: PM2

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [📚 Quick Start](QUICKSTART.md) | Get started in 5 minutes |
| [🔧 Setup Guide](docs/SETUP.md) | Detailed setup instructions |
| [📖 API Documentation](docs/API.md) | Complete API reference |
| [✨ Features](docs/FEATURES.md) | Feature documentation |
| [🚀 Deployment](docs/DEPLOYMENT.md) | Production deployment guide |
| [🇹🇷 Turkish README](README.tr.md) | Türkçe dokümantasyon |

## 📁 Project Structure

```
tefas-tracker/
├── 📱 mobile/              # React Native Expo app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── components/    # Reusable components
│   │   ├── api/          # API client
│   │   ├── utils/        # Utilities
│   │   └── constants/    # Constants
│   ├── App.tsx
│   └── package.json
│
├── 🔧 backend/            # Node.js API server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── scripts/      # Utility scripts
│   │   ├── database.ts   # Database setup
│   │   └── index.ts      # Main server
│   └── package.json
│
├── 🔄 shared/            # Shared TypeScript types
│   └── types.ts
│
├── 📚 docs/              # Documentation
│   ├── API.md
│   ├── SETUP.md
│   ├── FEATURES.md
│   └── DEPLOYMENT.md
│
├── 🔨 scripts/           # Helper scripts
│   ├── setup.sh
│   └── test-api.sh
│
└── 📋 Makefile           # Development commands
```

## 🎯 Use Cases

- **Individual Investors**: Track personal fund investments
- **Financial Advisors**: Monitor client portfolios
- **Researchers**: Analyze fund performance
- **Students**: Learn about Turkish mutual funds
- **Developers**: API integration for financial apps

## 🔒 Data & Privacy

- ✅ All data stored locally on your device
- ✅ No user accounts required
- ✅ No personal data collected
- ✅ No third-party tracking
- ✅ Open source - verify yourself

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TEFAS](https://www.tefas.gov.tr) for providing the data API
- React Native and Expo teams for the amazing framework
- Open source community for the tools and libraries

## 📧 Support

- 🐛 [Report a bug](https://github.com/yourusername/tefas-tracker/issues)
- 💡 [Request a feature](https://github.com/yourusername/tefas-tracker/issues)
- 📖 [Read the docs](docs/)
- 💬 [Discussions](https://github.com/yourusername/tefas-tracker/discussions)

## 🗺️ Roadmap

- [ ] iOS support
- [ ] Dark mode
- [ ] Push notifications
- [ ] Advanced charting
- [ ] Fund comparison
- [ ] Export to Excel/PDF
- [ ] News integration
- [ ] Multi-language support

---

<div align="center">

**Made with ❤️ for Turkish investors**

[⬆ Back to Top](#-tefas-funds-tracker)

</div>
