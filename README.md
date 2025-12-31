# Brain Tumor Classification App

A full-stack web application for detecting brain tumors using machine learning.

## Project Structure

```
.
├── app/                 # Backend API (FastAPI)
├── frontend/            # Frontend (React + TypeScript + Vite)
├── model/               # ML Model files
├── tools/               # Utility scripts
├── start-dev.py         # Development startup script
├── build.py             # Production build script
└── requirements.txt     # Python dependencies
```

## Development Setup

### Prerequisites

- Python 3.13+
- Node.js and npm (for frontend)
- uv (Python package manager)

### Installation

1. Install Python dependencies:
```bash
uv sync
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running in Development Mode

```bash
python start-dev.py
```

This will start both:
- Backend API on http://localhost:8000
- Frontend on http://localhost:8080

## Production Deployment

### Building for Production

```bash
python build.py
```

This will:
1. Build the React frontend
2. Copy the built files to the backend static directory
3. Configure the backend to serve the frontend

### Running in Production

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The application will be available at http://your-server-ip:8000

## API Endpoints

- `GET /` - Health check endpoint
- `POST /predict` - Upload an image for tumor classification

## Deployment Options

### Option 1: Traditional Server Deployment

1. Clone the repository to your server
2. Install dependencies:
   ```bash
   uv sync
   cd frontend && npm install && cd ..
   ```
3. Build the application:
   ```bash
   python build.py
   ```
4. Run the server:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Option 2: Docker Deployment (Recommended)

Build and run:
```bash
docker build -t brain-tumor-app .
docker run -p 8000:8000 brain-tumor-app
```

### Option 3: Cloud Platforms

#### Heroku
1. Create a `Procfile`:
   ```
   web: python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

2. Create a `runtime.txt`:
   ```
   python-3.13
   ```

3. Deploy using Heroku CLI:
   ```bash
   heroku create
   git push heroku main
   ```

#### Render
1. Create a `render.yaml`:
   ```yaml
   services:
     - type: web
       name: brain-tumor-classification
       env: python
       buildCommand: "pip install -r requirements.txt && cd frontend && npm install && cd .. && python build.py"
       startCommand: "python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT"
   ```

#### Vercel (Frontend only)
For hosting just the frontend on Vercel:
1. Set up environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL` pointing to your backend URL

2. Configure build settings:
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`

Note: You'll need to deploy the backend separately on a platform that supports Python.

## Environment Variables

### Frontend
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8000)

### Backend
No special environment variables required for basic operation.