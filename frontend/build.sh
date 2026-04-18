#!/bin/bash
set -e

echo "🔍 Checking Node.js version..."
node --version
npm --version

echo "📦 Installing dependencies..."
npm ci

echo "🔧 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"