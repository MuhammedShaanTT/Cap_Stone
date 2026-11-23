$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Starting Copilot branch backend on port 8082 with MongoDB database maqp_copilot..."

$container = docker ps -a --filter "name=maqp-copilot-mongodb" --format "{{.Names}}"
if ($container -ne "maqp-copilot-mongodb") {
    docker run -d --name maqp-copilot-mongodb -p 27018:27017 -e MONGO_INITDB_DATABASE=maqp_copilot mongo:7.0
} elseif (-not (docker ps --filter "name=maqp-copilot-mongodb" --format "{{.Names}}")) {
    docker start maqp-copilot-mongodb
}

Set-Location (Join-Path $PSScriptRoot "backend")
$env:SPRING_PROFILES_ACTIVE = "copilot"
mvn spring-boot:run
