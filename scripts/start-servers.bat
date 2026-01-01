@echo off
echo Starting Brain Tumor Classification App...
echo ========================================

echo Starting backend server on port 8000...
start "Backend" /D "E:\Projects\brain_tumor_classification" python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

timeout /t 5 /nobreak >nul

echo Starting frontend server...
start "Frontend" /D "E:\Projects\brain_tumor_classification\frontend" npm run dev

echo.
echo Servers started!
echo Frontend: http://localhost:8080 (or http://localhost:8081 if 8080 is in use)
echo Backend: http://localhost:8000
echo.
echo Press any key to exit...
pause >nul