# auto-start.ps1
$ErrorActionPreference = "Stop"

Write-Host "Initializing Student Tracker..." -ForegroundColor Cyan

# --- 1. CHECK DEPENDENCIES ---
if (-not (Test-Path -Path 'node_modules')) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Error "npm install failed."; exit 1 }
}

# --- 2. START BACKEND (Port 5000) ---
$BackendActive = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if (-not $BackendActive) {
    Write-Host "Starting Backend Server (Minimized)..." -ForegroundColor Yellow
    Start-Process powershell -WindowStyle Minimized -ArgumentList "-NoExit", "-Command", "node server.js"
    Start-Sleep -Seconds 2
} else {
    Write-Host "Backend is already running." -ForegroundColor Green
}

# --- 3. START FRONTEND (Port 3000) ---
$FrontendActive = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if (-not $FrontendActive) {
    Write-Host "Starting React App (Minimized)..." -ForegroundColor Yellow
    # BROWSER=none ensures React doesn't pop up a window on its own
    Start-Process powershell -WindowStyle Minimized -ArgumentList "-NoExit", "-Command", "$env:BROWSER='none'; npm start"
} else {
    Write-Host "React App is already running." -ForegroundColor Green
}

Write-Host "Servers are running! You can now open http://localhost:3000 in your browser." -ForegroundColor Magenta
exit 0  