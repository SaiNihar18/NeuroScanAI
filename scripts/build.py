#!/usr/bin/env python3
"""
Production build: builds the frontend and copies it to backend/app/static,
which the FastAPI app serves (including SPA fallback for client-side routes).

Run from anywhere:  python scripts/build.py
"""

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "frontend"
DIST = FRONTEND / "dist"
STATIC = ROOT / "backend" / "app" / "static"


def main() -> None:
    print("Building frontend...")
    try:
        # shell=True so `npm` resolves on Windows (npm.cmd)
        subprocess.run("npm run build", cwd=FRONTEND, shell=True, check=True)
    except subprocess.CalledProcessError:
        print("Failed to build frontend")
        sys.exit(1)

    print("Copying build to backend/app/static ...")
    if STATIC.exists():
        shutil.rmtree(STATIC)
    shutil.copytree(DIST, STATIC)

    print("Done. Start the server with:")
    print("   cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000")


if __name__ == "__main__":
    main()
