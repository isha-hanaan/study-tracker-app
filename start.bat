@echo off
REM Study Tracker Application - Windows Startup Script

echo.
echo ====================================
echo   Study Tracker Application
echo ====================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Starting Study Tracker Application...
echo.

REM Build and start containers
docker-compose up -d

REM Check if containers started successfully
docker-compose ps

echo.
echo ====================================
echo   Application Started Successfully!
echo ====================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo MongoDB:   localhost:27017
echo Redis:     localhost:6379
echo.
echo Default Credentials:
echo   Email: test@example.com
echo   Password: password123 (register first)
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo.
pause
