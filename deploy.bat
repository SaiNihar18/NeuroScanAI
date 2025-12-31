@echo off
REM deploy.bat - Deployment script for brain tumor classification app on Windows

echo 🚀 Deploying Brain Tumor Classification App...

REM Install Python dependencies
echo 🐍 Installing Python dependencies...
pip install -r requirements.txt

REM Install Node.js dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Build the application
echo 🏗️  Building application...
python build.py

REM Start the server
echo ✅ Deployment complete!
echo 🌐 Run 'python -m uvicorn app.main:app --host 0.0.0.0 --port 8000' to start the server