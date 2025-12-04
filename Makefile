.PHONY: help install dev start stop clean seed

help:
	@echo "TEFAS Tracker - Available Commands"
	@echo "=================================="
	@echo "make install    - Install all dependencies"
	@echo "make dev        - Start development servers"
	@echo "make start      - Start production servers"
	@echo "make stop       - Stop all servers"
	@echo "make clean      - Clean all build artifacts and dependencies"
	@echo "make seed       - Seed database with sample data"
	@echo "make docker     - Start with Docker"
	@echo "make logs       - Show backend logs"

install:
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install
	@echo "📦 Installing mobile dependencies..."
	cd mobile && npm install
	@echo "✅ All dependencies installed!"

dev:
	@echo "🚀 Starting development servers..."
	@echo "Backend will run on http://localhost:3000"
	@echo "Mobile will start Expo dev server"
	@echo ""
	@echo "Press Ctrl+C to stop"
	@trap 'kill 0' EXIT; \
	(cd backend && npm run dev) & \
	(cd mobile && npm start)

start:
	@echo "🚀 Starting production servers..."
	cd backend && npm run build && npm start

stop:
	@echo "⏹️  Stopping all servers..."
	@pkill -f "ts-node-dev" || true
	@pkill -f "expo" || true
	@echo "✅ Servers stopped"

clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf backend/node_modules backend/dist
	rm -rf mobile/node_modules mobile/.expo
	rm -rf node_modules
	@echo "✅ Clean complete!"

seed:
	@echo "🌱 Seeding database with sample data..."
	cd backend && npm run seed
	@echo "✅ Database seeded!"

docker:
	@echo "🐳 Starting with Docker..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "Backend: http://localhost:3000"

logs:
	@echo "📋 Showing backend logs..."
	docker-compose logs -f backend

docker-stop:
	@echo "🐳 Stopping Docker services..."
	docker-compose down
	@echo "✅ Services stopped!"
