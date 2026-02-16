#!/usr/bin/env bash

# 🚀 Sharoobi Console - Quick Start Script

echo "🎯 Sharoobi Console - Enterprise Dashboard"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --prefer-offline --no-audit
echo "✅ Dependencies installed"
echo ""

# Build
echo "🔨 Building project..."
npm run build
echo "✅ Build completed"
echo ""

# Ready to start
echo "🎉 Project is ready!"
echo ""
echo "📋 To start development server:"
echo "   npm run dev"
echo ""
echo "📖 Documentation:"
echo "   - QUICKSTART.md - Quick start guide"
echo "   - COMPREHENSIVE_ANALYSIS_AND_FIXES.md - Full analysis"
echo "   - FIXES_APPLIED.md - Details of fixes"
echo "   - TESTING_QUICK_START.md - Testing guide"
echo ""
echo "🔐 Default Credentials:"
echo "   Email: admin@sharoobi.local"
echo "   Password: Admin@sharoobi"
echo ""
echo "✨ Happy coding! ✨"
