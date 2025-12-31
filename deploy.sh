#!/bin/bash
# deploy.sh - Deployment script for brain tumor classification app

# Exit on any error
set -e

echo "🚀 Deploying Brain Tumor Classification App..."

# Check if we're on Windows or Unix-like system
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows with Git Bash or similar
    echo "🖥️  Detected Windows environment"
    PYTHON_CMD="python"
    PIP_CMD="pip"
else
    # Unix-like system
    echo "🐧 Detected Unix-like environment"
    PYTHON_CMD="python3"
    PIP_CMD="pip3"
fi

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
$PIP_CMD install -r requirements.txt

# Install Node.js dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Build the application
echo "🏗️  Building application..."
$PYTHON_CMD build.py

# Start the server
echo "✅ Deployment complete!"
echo "🌐 Run '$PYTHON_CMD -m uvicorn app.main:app --host 0.0.0.0 --port 8000' to start the server"