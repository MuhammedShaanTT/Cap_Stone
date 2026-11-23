$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Starting the Copilot backend on port 8082..." -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker is not installed or Docker is not available in PATH."
}

docker info *> $null
if ($LASTEXITCODE -ne 0) {
    throw "Docker Desktop is not running. Start Docker Desktop, wait until it reports Running, and retry."
}

$containerName = "maqp-copilot-mongodb"
$containerExists = docker ps -a --filter "name=$containerName" --format "{{.Names}}"

if ($containerExists -notcontains $containerName) {
    Write-Host "Creating Copilot MongoDB container on port 27018..."
    docker run -d --name $containerName -p 27018:27017 -e MONGO_INITDB_DATABASE=maqp_copilot mongo:7.0
} else {
    $containerRunning = docker ps --filter "name=$containerName" --format "{{.Names}}"
    if ($containerRunning -notcontains $containerName) {
        Write-Host "Starting existing Copilot MongoDB container..."
        docker start $containerName
    }
}

Write-Host "Waiting for MongoDB..."
$mongoReady = $false
for ($attempt = 1; $attempt -le 20; $attempt++) {
    $tcp = Test-NetConnection -ComputerName 127.0.0.1 -Port 27018 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($tcp) {
        $mongoReady = $true
        break
    }
    Start-Sleep -Seconds 1
}

if (-not $mongoReady) {
    throw "MongoDB did not become reachable at localhost:27018."
}

$maven = Get-Command mvn -ErrorAction SilentlyContinue
if (-not $maven) {
    throw "Maven is not installed or mvn is not available in PATH."
}

$backend = Join-Path $PSScriptRoot "backend"
Set-Location $backend
$env:SPRING_PROFILES_ACTIVE = "copilot"

Write-Host "Starting Spring Boot profile 'copilot'..." -ForegroundColor Green
Write-Host "Backend:  http://localhost:8082"
Write-Host "Health:   http://localhost:8082/actuator/health"
Write-Host "Database: mongodb://localhost:27018/maqp_copilot"
Write-Host ""

& $maven.Source spring-boot:run
