@echo off
echo ========================================
echo GENWEAR - Complete Project Startup
echo ========================================

echo.
echo [1/6] Killing existing Node processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/6] Starting MongoDB...
net start MongoDB 2>nul
if %errorlevel% neq 0 (
    echo MongoDB service not found, trying manual start...
    start "" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
    timeout /t 5 /nobreak >nul
)

echo.
echo [3/6] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo [4/6] Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo [5/6] Seeding database...
cd ..\server
call npm run seed
if %errorlevel% neq 0 (
    echo Warning: Database seeding failed, continuing...
)

echo.
echo [6/6] Starting servers...
echo.
echo Starting backend server on port 5001...
start "GENWEAR Backend" cmd /k "cd /d %cd% && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting frontend server on port 5173...
cd ..\client
start "GENWEAR Frontend" cmd /k "cd /d %cd% && npm run dev"

echo.
echo ========================================
echo GENWEAR servers are starting...
echo.
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:5173
echo Admin:    http://localhost:5173/admin
echo.
echo Login credentials:
echo Admin: admin@genwear.com / Admin@123
echo ========================================

timeout /t 5 /nobreak >nul
start http://localhost:5173

pause