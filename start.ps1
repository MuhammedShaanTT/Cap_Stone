# =============================================================================
#  Mobile AI Quality Platform - PowerShell Startup Script
# =============================================================================

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   STARTING MOBILE AI QUALITY PLATFORM                          " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan

# Step 1: Check MongoDB
Write-Host "`n[1/2] Verifying MongoDB..." -ForegroundColor Cyan
$mongoAvailable = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $async = $tcp.BeginConnect('127.0.0.1', 27017, $null, $null)
    $wait = $async.AsyncWaitHandle.WaitOne(1000, $false)
    if ($wait -and $tcp.Connected) {
        $tcp.EndConnect($async)
        $tcp.Close()
        $mongoAvailable = $true
        Write-Host "  -> MongoDB is running on localhost:27017" -ForegroundColor Green
    }
} catch {
    $mongoAvailable = $false
}

if (-not $mongoAvailable) {
    Write-Host "  -> External MongoDB is not detected on localhost:27017." -ForegroundColor Yellow
    Write-Host "  -> Automatic Fallback: Pure Java embedded in-memory MongoDB will initialize automatically inside the JVM on port 27017 (zero external dependencies required)!" -ForegroundColor Green
}

# Step 2: Launch Platform
Write-Host "`n[2/2] Launching Spring Boot Platform..." -ForegroundColor Cyan
Write-Host "  URL       : http://localhost:8080 (Serves Modular Sauce Labs Frontend)" -ForegroundColor Green
Write-Host "  Swagger UI: http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "  Health    : http://localhost:8080/actuator/health" -ForegroundColor White
Write-Host "  Dev Server: cd frontend; npm.cmd run dev (Vite Hot-Reload on http://localhost:3000)`n" -ForegroundColor Cyan

$jarPath = Join-Path $PSScriptRoot "backend\target\platform-0.1.0-SNAPSHOT.jar"
if (Test-Path $jarPath) {
    java -jar $jarPath
} else {
    Set-Location (Join-Path $PSScriptRoot "backend")
    mvn spring-boot:run
}
