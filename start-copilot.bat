@echo off
setlocal

cd /d "%~dp0"

echo Starting Copilot branch backend on port 8082 with MongoDB database maqp_copilot...
echo MongoDB must listen on localhost:27018.

docker ps --filter "name=maqp-copilot-mongodb" --format "{{.Names}}" | findstr /R "." >nul
if errorlevel 1 (
  docker run -d --name maqp-copilot-mongodb -p 27018:27017 -e MONGO_INITDB_DATABASE=maqp_copilot mongo:7.0
)

cd backend
set SPRING_PROFILES_ACTIVE=copilot
mvn spring-boot:run
