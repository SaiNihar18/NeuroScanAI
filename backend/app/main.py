import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .model_loader import model_status, warm_up
from .predict import predict_image


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Run one dummy inference so the first real request is fast.
    warm_up()
    yield


app = FastAPI(title="Brain Tumor Classification API", lifespan=lifespan)

# Allowed origins: any localhost port (dev) plus anything listed in CORS_ORIGINS
# (comma separated), e.g. CORS_ORIGINS=https://my-site.example
extra_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=extra_origins,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- API routes (registered before the static mount) ----
@app.get("/api/health")
def health():
    return {"message": "Brain Tumor Classification API is running!", **model_status()}


# Plain `def` so FastAPI runs the CPU-bound inference in a worker thread
# instead of blocking the event loop.
@app.post("/predict")
def predict(file: UploadFile = File(...)):
    return predict_image(file)


# ---- Frontend (production build) ----
static_dir = os.path.join(os.path.dirname(__file__), "static")
index_file = os.path.join(static_dir, "index.html")

if os.path.exists(index_file):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa(full_path: str):
        """Serve real files from the build, otherwise the SPA shell (client-side routing)."""
        if full_path.startswith(("api/", "predict")):
            raise HTTPException(status_code=404)
        candidate = os.path.realpath(os.path.join(static_dir, full_path))
        if full_path and candidate.startswith(os.path.realpath(static_dir)) and os.path.isfile(candidate):
            return FileResponse(candidate)
        return FileResponse(index_file)
else:
    @app.get("/")
    def root():
        return {"message": "Brain Tumor Classification API is running!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
