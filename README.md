# Afon1 Monorepo

A comprehensive multi-app workspace hosting a Node.js backend, React web client, and Expo React Native mobile client for investment fund management and analysis.

## 🏗️ Project Structure

```
afon1-monorepo/
├── packages/
│   ├── backend/          # Node.js API with Fastify
│   ├── web/              # React web client with Vite
│   └── mobile/           # Expo React Native app
├── .vscode/              # VS Code settings and extensions
├── .husky/               # Git hooks
├── package.json          # Root workspace configuration
├── pnpm-workspace.yaml   # pnpm workspace definition
├── tsconfig.json         # Shared TypeScript configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm 8+
- Expo CLI for mobile development
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd afon1-monorepo

# Install all dependencies
pnpm install
```

### Development

Start all applications in parallel:

```bash
pnpm dev
```

Or start individual applications:

```bash
# Backend API server
pnpm dev:backend

# React web client
pnpm dev:web

# Expo mobile client
pnpm dev:mobile
```

## 📱 Applications

### Backend API (packages/backend)

- **Framework**: Fastify with TypeScript
- **Port**: 3001 (configurable via environment)
- **Features**: 
  - CORS support
  - Helmet security headers
  - Environment-based configuration
  - TEFAS API integration endpoints
  - Health check endpoint

### Web Client (packages/web)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Port**: 3000
- **Features**:
  - React Router for navigation
  - Responsive design
  - Real-time fund data
  - Modern UI with Lucide icons

### Mobile Client (packages/mobile)

- **Framework**: Expo SDK 51 with React Native
- **Navigation**: Expo Router
- **Features**:
  - Cross-platform mobile app
  - Pull-to-refresh functionality
  - Native UI components
  - Deep linking support

## ⚙️ Configuration

### Environment Variables

Each application includes an `.env.example` file with required environment variables:

#### Backend (.env.example)
```env
TEFAS_API_BASE_URL=https://api.tefas.gov.tr
TEFAS_API_KEY=your_tefas_api_key_here
TEFAS_API_SECRET=your_tefas_api_secret_here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

#### Web Client (.env.example)
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_TEFAS_API_BASE_URL=https://api.tefas.gov.tr
VITE_APP_NAME=Afon1 Web Client
VITE_APP_VERSION=1.0.0
```

#### Mobile Client (.env.example)
```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
EXPO_PUBLIC_TEFAS_API_BASE_URL=https://api.tefas.gov.tr
EXPO_PUBLIC_APP_NAME=Afon1 Mobile
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## 🛠️ Development Scripts

### Root Level Scripts

```bash
pnpm dev              # Start all apps in parallel
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm lint:fix         # Fix linting issues
pnpm format           # Format all files with Prettier
pnpm type-check       # Type check all TypeScript files
pnpm clean            # Clean build artifacts and node_modules
```

### Package-Specific Scripts

```bash
# Backend
pnpm --filter backend dev
pnpm --filter backend build
pnpm --filter backend start

# Web
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web preview

# Mobile
pnpm --filter mobile start
pnpm --filter mobile android
pnpm --filter mobile ios
pnpm --filter mobile web
```

## 🧪 Code Quality

The project includes comprehensive tooling for code quality:

- **ESLint**: Linting with TypeScript and React rules
- **Prettier**: Code formatting with consistent style
- **TypeScript**: Static type checking
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

### Pre-commit Hooks

- ESLint with auto-fix
- Prettier formatting
- TypeScript type checking

## 📚 TEFAS Integration

The project is designed to integrate with the Turkish Capital Markets Board's (TEFAS) API for fund data. The backend includes placeholder endpoints that should be implemented with actual TEFAS API authentication and data fetching.

## 🖥️ VS Code Setup

The project includes optimized VS Code settings:

- Auto-format on save
- ESLint integration
- TypeScript IntelliSense
- Recommended extensions
- Excluded build artifacts from search

### Recommended Extensions

- Prettier - Code formatter
- ESLint
- TypeScript Importer
- Expo Tools
- Tailwind CSS IntelliSense

## 🚀 Deployment

### Backend

```bash
cd packages/backend
pnpm build
pnpm start
```

### Web

```bash
cd packages/web
pnpm build
# Deploy dist/ folder to your hosting provider
```

### Mobile

```bash
cd packages/mobile
expo build:android
expo build:ios
# Or use Expo Application Services (EAS)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the documentation
- Review environment configuration
- Ensure all dependencies are installed with `pnpm install`
- Verify mobile development environment setup