from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from .predict import predict_image

app = FastAPI(title="Brain Tumor Classification API")

# Configure CORS for development
origins = [
    "http://localhost:8080",  # Vite dev server
    "http://127.0.0.1:8080",  # Alternative localhost
    "http://localhost:8081",  # Vite dev server (alternative port)
    "http://127.0.0.1:8081",  # Alternative localhost
    "http://localhost:8082",  # Vite dev server (alternative port)
    "http://127.0.0.1:8082",  # Alternative localhost
    "http://localhost:8083",  # Vite dev server (alternative port)
    "http://127.0.0.1:8083",  # Alternative localhost
    "http://localhost:8084",  # Vite dev server (alternative port)
    "http://127.0.0.1:8084",  # Alternative localhost
    "http://localhost:8085",  # Vite dev server (alternative port)
    "http://127.0.0.1:8085",  # Alternative localhost
    "http://localhost:5173",  # Default Vite port
    "http://127.0.0.1:5173",  # Alternative default Vite port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes (defined before static files to avoid conflicts)
@app.get("/")
def root():
    return {"message": "Brain Tumor Classification API is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    result = predict_image(file)
    return result

# Serve frontend static files in production (mount after API routes)
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)