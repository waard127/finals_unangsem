# auto-start.ps1
$ErrorActionPreference = "Stop"

# --- HELPER: FUNCTION TO FOCUS WINDOW ---
Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  public class WindowUtils {
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
  }
"@

# --- HELPER: SYSTEM INSTALL CHECK ---
# FIXED: Renamed 'Check-And-Install' to 'Install-SystemRequirement' to satisfy PSScriptAnalyzer
function Install-SystemRequirement ($ProgramName, $CommandName, $PackageId) {
    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        Write-Host "$ProgramName command not found in PATH. Checking deeper..." -ForegroundColor DarkGray
        return $false 
    }
    return $true
}

Write-Host "--- 1. SYSTEM HEALTH CHECK ---" -ForegroundColor Cyan

# --- CHECK NODE.JS ---
if (-not (Install-SystemRequirement "Node.js" "node" "OpenJS.NodeJS")) {
    Write-Host "Node.js is missing. Installing..." -ForegroundColor Red
    winget install --id "OpenJS.NodeJS" -e --accept-source-agreements --accept-package-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

# --- CHECK MONGODB ---
$MongoInPath = Get-Command "mongod" -ErrorAction SilentlyContinue
$MongoService = Get-Service "MongoDB" -ErrorAction SilentlyContinue
$MongoFolder = Test-Path "C:\Program Files\MongoDB\Server\*\bin\mongod.exe"

if ($MongoInPath -or $MongoService -or $MongoFolder) {
    Write-Host "MongoDB is installed. Skipping check." -ForegroundColor Green
} else {
    Write-Host "MongoDB not detected. Attempting to install..." -ForegroundColor Yellow
    winget install --id "MongoDB.Server" -e --accept-source-agreements --accept-package-agreements
}

# --- CHECK DEPENDENCIES ---
if (-not (Test-Path -Path 'node_modules')) {
    Write-Host "Dependencies missing. Running 'npm install'..." -ForegroundColor Yellow
    npm install
}

Write-Host "--- 2. SERVER STARTUP ---" -ForegroundColor Cyan

# --- START BACKEND (Port 5000) ---
$BackendActive = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if (-not $BackendActive) {
    Write-Host "Starting Backend Server..." -ForegroundColor Yellow
    Start-Process powershell -WindowStyle Minimized -ArgumentList "-NoExit", "-Command", "node server.js"
    Start-Sleep -Seconds 2
} else {
    Write-Host "Backend is already running (Port 5000)." -ForegroundColor Gray
}

# --- START FRONTEND (Port 3000) ---
$FrontendActive = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if (-not $FrontendActive) {
    Write-Host "Starting React App..." -ForegroundColor Yellow
    # BROWSER=none stops React from opening a window automatically so we can handle it 'smartly'
    Start-Process powershell -WindowStyle Minimized -ArgumentList "-NoExit", "-Command", '$env:BROWSER="none"; npm start'
    
    Write-Host "Waiting for React to initialize..."
    $Retries = 0
    do {
        Start-Sleep -Seconds 2
        $FrontendActive = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
        $Retries++
    } until ($FrontendActive -or $Retries -gt 15)
} else {
    Write-Host "React is already running (Port 3000)." -ForegroundColor Gray
}

Write-Host "--- 3. SMART BROWSER LAUNCH ---" -ForegroundColor Cyan

# --- FIXED SMART LOGIC (From previous step) ---
# This ensures we only detect CHROME connected to the React app, preventing false positives from Node/VS Code.
$ChromeIsConnected = Get-NetTCPConnection -RemotePort 3000 -State Established -ErrorAction SilentlyContinue | Where-Object { 
    $Proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
    # Only return true if the process connected to 3000 is actually Chrome
    return ($Proc.ProcessName -eq "chrome")
}

if ($ChromeIsConnected) {
    Write-Host "Chrome tab detected as OPEN. Switching focus..." -ForegroundColor Green
    # Find the main Chrome window and bring it to the front
    $ChromeProc = Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
    if ($ChromeProc) {
        [WindowUtils]::SetForegroundWindow($ChromeProc.MainWindowHandle) | Out-Null
    }
} else {
    Write-Host "App is running but no Chrome tab found. Launching new window..." -ForegroundColor Green
    Start-Process "http://localhost:3000"
}

exit 0