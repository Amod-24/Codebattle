#!/bin/bash
# ============================================
# CodeBattle - Idempotent Deployment Script
# ============================================
# Safe to run multiple times. Designed for EC2 deployment.

set -e

DEPLOY_DIR="/var/www/codebattle"
BACKUP_DIR="/var/www/codebattle-backup"

echo "🚀 CodeBattle Deployment Script"
echo "================================"

# Create deployment directory (idempotent)
echo "📁 Ensuring deployment directory exists..."
sudo mkdir -p "$DEPLOY_DIR"

# Backup existing deployment if it exists
if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR 2>/dev/null)" ]; then
  echo "💾 Backing up current deployment..."
  sudo mkdir -p "$BACKUP_DIR"
  sudo cp -r "$DEPLOY_DIR/." "$BACKUP_DIR/" 2>/dev/null || true
fi

# Build the project
echo "🔨 Building project..."
npm ci
npm run build

# Deploy new files
echo "📤 Deploying to $DEPLOY_DIR..."
sudo cp -r dist/. "$DEPLOY_DIR/"

# Set correct permissions (idempotent)
echo "🔒 Setting permissions..."
sudo chown -R www-data:www-data "$DEPLOY_DIR" 2>/dev/null || true
sudo chmod -R 755 "$DEPLOY_DIR"

# Restart nginx if installed (idempotent)
if command -v nginx &> /dev/null; then
  echo "🔄 Restarting Nginx..."
  sudo systemctl restart nginx 2>/dev/null || sudo service nginx restart 2>/dev/null || true
  echo "✅ Nginx restarted"
else
  echo "ℹ️  Nginx not found, skipping restart"
fi

echo ""
echo "✅ Deployment complete!"
echo "📍 Files deployed to: $DEPLOY_DIR"
