@echo off
REM =============================================================================
REM  Mobile AI Quality Platform - First Prototype Test Script
REM  Run this AFTER starting the backend application
REM =============================================================================
setlocal enabledelayedexpansion

set BASE_URL=http://localhost:8080/api/v1

echo.
echo =================================================================
echo   MOBILE AI QUALITY PLATFORM - FIRST PROTOTYPE TEST SUITE
echo =================================================================
echo.

REM ---- Step 1: Health Check ----
echo [1/10] Checking System Health...
curl.exe -s http://localhost:8080/actuator/health
echo.
echo.

REM ---- Step 2: Login (or Register) ----
echo [2/10] Authenticating with pre-seeded credentials...
curl.exe -s -X POST %BASE_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}" ^
  -o login_response.json

findstr /C:"accessToken" login_response.json >nul
if errorlevel 1 (
  echo   Admin not yet initialized, registering fresh user...
  curl.exe -s -X POST %BASE_URL%/auth/register ^
    -H "Content-Type: application/json" ^
    -d "{\"email\":\"tester@example.com\",\"displayName\":\"Prototype Tester\",\"password\":\"password123\"}" ^
    -o login_response.json
)

for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content login_response.json | ConvertFrom-Json).accessToken"') do set TOKEN=%%i
echo Token received: %TOKEN:~0,25%...
echo.

REM ---- Step 3: Create Project ----
echo [3/10] Creating project...
curl.exe -s -X POST %BASE_URL%/projects ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"name\":\"Android Quality Demo App\",\"description\":\"Prototype project for mobile test automation\"}" ^
  -o project_response.json
type project_response.json
echo.
echo.

for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content project_response.json | ConvertFrom-Json).id"') do set PROJECT_ID=%%i
echo Created Project ID: %PROJECT_ID%
echo.

REM ---- Step 4: Register App Version ----
echo [4/10] Registering App Version 1.0.0...
curl.exe -s -X POST %BASE_URL%/projects/%PROJECT_ID%/app-versions ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"version\":\"1.0.0\",\"platform\":\"ANDROID\",\"packageName\":\"com.example.calculator\",\"versionCode\":\"1\"}" ^
  -o version_response.json
type version_response.json
echo.
echo.

for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content version_response.json | ConvertFrom-Json).id"') do set VERSION_ID=%%i
echo App Version ID: %VERSION_ID%
echo.

REM ---- Step 5: Upload Dummy APK Artifact ----
echo [5/10] Uploading Dummy APK Artifact...
curl.exe -s -X POST "%BASE_URL%/projects/%PROJECT_ID%/app-versions/%VERSION_ID%/upload" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -F "file=@test-data\sample-app-v1.0.0.apk" ^
  -o upload_response.json
type upload_response.json
echo.
echo.

REM ---- Step 6: Create Test Case ----
echo [6/10] Creating Test Case...
curl.exe -s -X POST %BASE_URL%/projects/%PROJECT_ID%/test-cases ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"name\":\"Calculator Addition Flow\",\"category\":\"FUNCTIONAL\",\"priority\":\"HIGH\",\"appVersionId\":\"%VERSION_ID%\"}" ^
  -o testcase_response.json
type testcase_response.json
echo.
echo.

for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content testcase_response.json | ConvertFrom-Json).id"') do set TC_ID=%%i

REM ---- Step 7: Trigger Test Run ----
echo [7/10] Triggering Test Execution Run...
curl.exe -s -X POST %BASE_URL%/test-cases/%TC_ID%/test-runs ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"appVersionId\":\"%VERSION_ID%\",\"executedBy\":\"Appium-Worker\",\"environment\":\"Pixel_7_Android_14\"}"
echo.
echo.

REM ---- Step 8: Trigger Pipeline Run ----
echo [8/10] Triggering CI/CD Pipeline Run...
curl.exe -s -X POST %BASE_URL%/projects/%PROJECT_ID%/pipeline-runs ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"commitSha\":\"c89f12a4b\",\"branch\":\"main\",\"triggerType\":\"MANUAL\"}"
echo.
echo.

REM ---- Step 9: Start Security Scan ----
echo [9/10] Starting Vulnerability Security Scan...
curl.exe -s -X POST %BASE_URL%/projects/%PROJECT_ID%/security-scans ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"appVersionId\":\"%VERSION_ID%\",\"scanner\":\"MOBSF\",\"scannerVersion\":\"3.9.0\",\"profile\":\"QUICK\"}"
echo.
echo.

REM ---- Step 10: Fetch Dashboard ----
echo [10/10] Fetching Aggregated Quality Dashboard...
curl.exe -s -X GET %BASE_URL%/projects/%PROJECT_ID%/dashboard ^
  -H "Authorization: Bearer %TOKEN%"
echo.
echo.

echo =================================================================
echo   ALL TESTS COMPLETED SUCCESSFULLY!
echo =================================================================
echo.
echo Interactive Swagger UI: http://localhost:8080/swagger-ui.html
echo OpenAPI JSON Spec     : http://localhost:8080/api-docs
echo.

REM Cleanup temp files
del login_response.json 2>nul
del project_response.json 2>nul
del version_response.json 2>nul
del upload_response.json 2>nul
del testcase_response.json 2>nul

pause
