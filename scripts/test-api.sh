#!/bin/bash

echo "🧪 TEFAS Tracker API Test"
echo "========================"
echo ""

API_URL="http://localhost:3000"

# Check if server is running
echo "📡 Checking if server is running..."
if ! curl -s "${API_URL}/health" > /dev/null; then
    echo "❌ Server is not running on ${API_URL}"
    echo "   Start it with: cd backend && npm run dev"
    exit 1
fi
echo "✅ Server is running"
echo ""

# Test health endpoint
echo "🏥 Testing /health endpoint..."
HEALTH=$(curl -s "${API_URL}/health")
echo "Response: $HEALTH"
echo ""

# Test funds endpoint
echo "📊 Testing /api/funds endpoint..."
FUNDS=$(curl -s "${API_URL}/api/funds?limit=5")
FUND_COUNT=$(echo $FUNDS | grep -o '"data":\[' | wc -l)
if [ $FUND_COUNT -gt 0 ]; then
    echo "✅ Funds endpoint working"
else
    echo "⚠️  No funds data (might need to seed database)"
fi
echo ""

# Test categories endpoint
echo "📁 Testing /api/funds/categories/list endpoint..."
CATEGORIES=$(curl -s "${API_URL}/api/funds/categories/list")
echo "Response: $CATEGORIES"
echo ""

# Test favorites endpoint
echo "⭐ Testing /api/favorites endpoint..."
FAVORITES=$(curl -s "${API_URL}/api/favorites")
echo "Response: $FAVORITES"
echo ""

# Test portfolio endpoint
echo "💼 Testing /api/portfolio endpoint..."
PORTFOLIO=$(curl -s "${API_URL}/api/portfolio")
echo "Response: $PORTFOLIO"
echo ""

# Test live endpoint
echo "📈 Testing /api/live endpoint..."
LIVE=$(curl -s "${API_URL}/api/live")
echo "Response: $LIVE"
echo ""

echo "✅ All endpoint tests completed!"
echo ""
echo "💡 To seed sample data: cd backend && npm run seed"
