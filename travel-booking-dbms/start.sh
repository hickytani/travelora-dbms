#!/bin/bash
# Quick Start Script for TRAVELORA DA-2 Project

echo "🚀 Starting TRAVELORA Travel Booking System..."
echo ""

# Check prerequisites
command -v docker &> /dev/null
if [ $? -eq 0 ]; then
  echo "✓ Docker found"
else
  echo "✗ Docker not found. Please install Docker."
  exit 1
fi

command -v node &> /dev/null
if [ $? -eq 0 ]; then
  echo "✓ Node.js found"
else
  echo "✗ Node.js not found. Please install Node.js 18+"
  exit 1
fi

echo ""
echo "📦 Starting PostgreSQL Database..."
docker-compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 5

echo ""
echo "🔌 Installing Backend Dependencies..."
cd backend
npm install

echo ""
echo "⚙️ Starting Backend Server..."
npm run dev &
BACKEND_PID=$!

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install

echo ""
echo "🎨 Starting Frontend Development Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TRAVELORA is starting up!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend:  http://localhost:5173"
echo "🔌 Backend:   http://localhost:5000"
echo "🗄️  Database:  localhost:5432"
echo ""
echo "📝 Demo Credentials:"
echo "   Customer: prasun@example.com / password123"
echo "   Admin:    admin@travelora.com / password123"
echo ""
echo "Press Ctrl+C to stop all services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
