#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NETLIFY_DIR="$SCRIPT_DIR/workflow-builder-netlify"

echo "📦 Starting Netlify deployment..."

if ! command -v netlify &>/dev/null; then
  echo "📥 Installing Netlify CLI..."
  npm install -g netlify-cli
fi

echo "🔨 Building app (includes library build)..."
cd "$NETLIFY_DIR"
npm run build

if [ ! -d ".next" ]; then
  echo "❌ Build failed: .next directory not found"
  exit 1
fi

echo "🚀 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment complete!"
