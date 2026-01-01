#!/usr/bin/env python3
"""
Development startup script for brain tumor classification app.
Runs both frontend and backend servers simultaneously.
"""

import subprocess
import sys
import os

def main():
    print("🚀 Starting Brain Tumor Classification App in Development Mode...")
    print("=" * 60)
    
    # Start backend server
    print("🔧 Starting backend server...")
    backend = subprocess.Popen([
        sys.executable, "-m", "uvicorn", 
        "app.main:app", 
        "--host", "0.0.0.0", 
        "--port", "8000",
        "--reload"
    ], cwd=os.getcwd())
    
    # Start frontend server
    print("🎨 Starting frontend server...")
    # Use shell=True for Windows compatibility
    frontend = subprocess.Popen(
        "npm run dev",
        cwd=os.path.join(os.getcwd(), "frontend"),
        shell=True
    )
    
    print("\n✅ Both servers started successfully!")
    print("🌐 Frontend available at: http://localhost:8080")
    print("🔌 Backend API available at: http://localhost:8000")
    print("💡 Press Ctrl+C to stop both servers\n")
    
    try:
        # Wait for both processes
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        backend.terminate()
        frontend.terminate()
        print("✅ Servers stopped successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()