#!/bin/bash

# Sharoobi Console - Startup Script
# This script starts the application with proper configuration

set -e

echo "🚀 Sharoobi Console - Starting..."
echo "=================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "⚙️  Creating .env.local from template..."
  cp .env.example .env.local
  echo "✅ Created .env.local - Update with your credentials"
fi

# Build if needed
if [ ! -d ".next" ]; then
  echo "🔨 Building application..."
  pnpm run build
fi

# Start the application
echo ""
echo "✅ Starting server..."
echo ""
echo "🌍 Server will be available at: http://localhost:3000"
echo "📝 Login credentials: admin@sharoobi.local"
echo ""
echo "---"

# Start in development or production mode
if [ "$NODE_ENV" = "production" ]; then
  echo "⚡ Starting in PRODUCTION mode..."
  pnpm start
else
  echo "🔧 Starting in DEVELOPMENT mode..."
  pnpm run dev
fi
