@echo off
echo Starting MongoDB Service...
net start MongoDB
if %errorlevel% == 0 (
    echo MongoDB started successfully!
    echo.
    echo Now seeding database...
    cd server
    call npm run seed
    echo.
    echo Done! Refresh http://localhost:5173 to see products!
    pause
) else (
    echo Failed to start MongoDB. Please run this file as Administrator.
    echo Right-click this file and select "Run as administrator"
    pause
)
