#!/bin/bash

# Navigate to the notary-frontend directory and start the dev server
echo "NotaryPro Development Server Launcher"
echo "======================================"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/notary-frontend"

echo "Script location: $SCRIPT_DIR"
echo "Frontend directory: $FRONTEND_DIR"

# Check if notary-frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "ERROR: notary-frontend directory not found at $FRONTEND_DIR"
    exit 1
fi

# Change to the frontend directory
cd "$FRONTEND_DIR"

echo "Changed to directory: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found in $FRONTEND_DIR"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: npm install failed"
        exit 1
    fi
fi

# Start the development server
echo ""
echo "Starting Next.js development server..."
echo "URL: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
