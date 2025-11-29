# auto-start.ps1

# --- 1. DEPENDENCY CHECK ---
Write-Host "1. Checking project dependencies..." -ForegroundColor Cyan
if (-not (Test-Path -Path 'node_modules')) {
    Write-Host "   node_modules not found. Running npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "   npm install failed."
        exit 1
    }
    Write-Host "   npm install completed." -ForegroundColor Green
} else {
    Write-Host "   Dependencies found. Skipping install." -ForegroundColor Green
}

# --- 2. BACKEND START (Port 5000) ---
Write-Host "2. Checking Backend Server (Port 5000)..." -ForegroundColor Cyan
$BackendCheck = netstat -ano | Select-String ":5000" | Select-String "LISTENING"

if ($BackendCheck) {
    Write-Host "   Backend is already running." -ForegroundColor Green
} else {
    if (Test-Path -Path "server.js") {
        Write-Host "   Starting Backend (server.js) in NEW WINDOW..." -ForegroundColor Yellow
        # Opens a new PowerShell window and runs node server.js
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js"
    } else {
        Write-Error "   server.js not found! Skipping backend start."
    }
}

# --- 3. FRONTEND START (Port 3000) ---
# Note: React usually defaults to 3000. Changed from 8080 to 3000 based on standard React setup.
Write-Host "3. Checking React Frontend (Port 3000)..." -ForegroundColor Cyan
$FrontendCheck = netstat -ano | Select-String ":3000" | Select-String "LISTENING"

if ($FrontendCheck) {
    Write-Host "   Frontend is already running." -ForegroundColor Green
} else {
    Write-Host "   Starting React App (npm start) in NEW WINDOW..." -ForegroundColor Yellow
    # Opens a new PowerShell window and runs npm start
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
}

Write-Host "Startup sequence complete. Windows should appear shortly." -ForegroundColor Magenta
exit 0