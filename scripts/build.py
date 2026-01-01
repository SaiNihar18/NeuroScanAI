#!/usr/bin/env python3
"""
Production build script for brain tumor classification app.
Builds the frontend and configures the backend to serve it.
"""

import subprocess
import sys
import os

def main():
    print("🏗️ Building Brain Tumor Classification App for Production...")
    print("=" * 60)
    
    # Step 1: Build the frontend
    print("🎨 Building frontend...")
    try:
        # Use shell=True for Windows compatibility
        result = subprocess.run(
            "npm run build",
            cwd=os.path.join(os.getcwd(), "frontend"),
            shell=True,
            check=True
        )
        print("✅ Frontend built successfully!")
    except subprocess.CalledProcessError as e:
        print("❌ Failed to build frontend")
        sys.exit(1)
    
    # Step 2: Move built files to backend static directory
    frontend_dist = os.path.join(os.getcwd(), "frontend", "dist")
    backend_static = os.path.join(os.getcwd(), "app", "static")
    
    # Create static directory if it doesn't exist
    if os.path.exists(backend_static):
        import shutil
        shutil.rmtree(backend_static)
    os.makedirs(backend_static)
    
    # Copy built files
    print("📦 Moving built files to backend...")
    import shutil
    shutil.copytree(frontend_dist, backend_static, dirs_exist_ok=True)
    print("✅ Files moved successfully!")
    
    # Step 3: Update backend to serve static files
    print("🔧 Updating backend to serve frontend...")
    update_backend_for_static_files()
    
    print("\n🎉 Production build completed!")
    print("📁 Frontend built to: app/static/")
    print("🚀 Run 'python -m uvicorn app.main:app --host 0.0.0.0 --port 8000' to start the production server")

def update_backend_for_static_files():
    """Update the backend to serve static files"""
    main_py_path = os.path.join(os.getcwd(), "app", "main.py")
    
    # Read the current content
    with open(main_py_path, "r") as f:
        content = f.read()
    
    # Add static files serving imports if not present
    if "from fastapi.staticfiles import StaticFiles" not in content:
        content = content.replace(
            "from fastapi import FastAPI, File, UploadFile\nfrom fastapi.middleware.cors import CORSMiddleware",
            "from fastapi import FastAPI, File, UploadFile\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom fastapi.staticfiles import StaticFiles\nimport os"
        )
    
    # Add static files mounting if not present
    if "app.mount" not in content and "StaticFiles" in content:
        # Find the right place to insert the static files mounting
        insert_point = content.find("app.add_middleware(")
        if insert_point != -1:
            # Insert after CORS middleware setup
            insert_point = content.find(")", insert_point) + 1
            static_mount_code = "\n\n# Serve frontend static files\nstatic_dir = os.path.join(os.path.dirname(__file__), \"static\")\nif os.path.exists(static_dir):\n    app.mount(\"/\", StaticFiles(directory=static_dir, html=True), name=\"static\")\n\n"
            content = content[:insert_point] + static_mount_code + content[insert_point:]
            
            # Write back to file
            with open(main_py_path, "w") as f:
                f.write(content)
    
    print("✅ Backend updated to serve static files")

if __name__ == "__main__":
    main()