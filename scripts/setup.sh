#!/bin/bash
# ============================================
# CodeBattle - Idempotent Setup Script
# ============================================
# This script can be run multiple times safely.
# It will only perform actions that haven't been done yet.

set -e

echo "🚀 CodeBattle Setup Script"
echo "========================="

# Create necessary directories (idempotent with -p)
echo "📁 Creating project directories..."
mkdir -p src/engine
mkdir -p src/pages
mkdir -p src/styles
mkdir -p tests/integration
mkdir -p tests/e2e
mkdir -p scripts
mkdir -p public
mkdir -p .github/workflows

# Check if node_modules exists, install only if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
else
  echo "✅ Dependencies already installed"
fi

# Check if playwright browsers are installed
if ! npx playwright --version > /dev/null 2>&1; then
  echo "🎭 Installing Playwright browsers..."
  npx playwright install --with-deps chromium
else
  echo "✅ Playwright already installed"
fi

# Verify the build works
echo "🔨 Verifying build..."
npm run build 2>/dev/null && echo "✅ Build successful" || echo "⚠️ Build had issues"

# Run linter (non-blocking)
echo "🔍 Running linter..."
npm run lint 2>/dev/null && echo "✅ Lint passed" || echo "⚠️ Lint issues found"

echo ""
echo "✅ Setup complete! Run 'npm run dev' to start the development server."
