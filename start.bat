@echo off
REM =============================================================================
REM  Mobile AI Quality Platform - Startup Script
REM =============================================================================

echo.
echo =================================================================
echo   STARTING MOBILE AI QUALITY PLATFORM
echo =================================================================
echo.

cd /d "%~dp0"

REM Step 1: Check MongoDB Connectivity
echo [1/2] Checking MongoDB connection on localhost:27017...
powershell -NoProfile -Command "try { $client = New-Object System.Net.Sockets.TcpClient('127.0.0.1', 27017); $client.Close(); Write-Host '  -> External MongoDB is running!' -ForegroundColor Green } catch { Write-Host '  -> No external MongoDB on port 27017.' -ForegroundColor Yellow; Write-Host '  -> Pure Java in-memory MongoDB will auto-initialize inside the JVM (Zero-Dependency mode)!' -ForegroundColor Green }"

echo.
echo [2/2] Starting Spring Boot Backend (Java 17)...
echo   URL       : http://localhost:8080 (Serves Modular Sauce Labs Frontend)
echo   Swagger UI: http://localhost:8080/swagger-ui.html
echo   Actuator  : http://localhost:8080/actuator/health
echo   Dev Server: cd frontend && npm.cmd run dev (Optional Vite Hot-Reload on port 3000)
echo.

if exist "backend\target\platform-0.1.0-SNAPSHOT.jar" (
    java -jar backend\target\platform-0.1.0-SNAPSHOT.jar
) else (
    cd backend
    mvn spring-boot:run
)

pause
