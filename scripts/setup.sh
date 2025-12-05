#!/bin/bash

echo "🚀 TEFAS Tracker Setup Script"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is too old. Please upgrade to Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -f ".env" ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
fi
npm install
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Install mobile dependencies
echo "📦 Installing mobile dependencies..."
cd mobile
if [ ! -f ".env" ]; then
    echo "📝 Creating mobile .env file..."
    cp .env.example .env
fi
npm install
cd ..
echo "✅ Mobile dependencies installed"
echo ""

# Setup database
echo "🗄️  Setting up database..."
cd backend
mkdir -p data
cd ..
echo "✅ Database directory created"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start backend:  cd backend && npm run dev"
echo "2. Start mobile:   cd mobile && npm start"
echo "3. Or use:         make dev"
echo ""
echo "📚 Read QUICKSTART.md for more details"
