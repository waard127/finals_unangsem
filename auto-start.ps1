# auto-start.ps1

# --- 1. CONDITIONAL npm install (Checks if node_modules is present) ---
Write-Host "Checking for project dependencies..."
if (-not (Test-Path -Path 'node_modules')) {
    Write-Host "node_modules not found. Running npm install..."
    # Running npm install synchronously so we wait for completion
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm install failed. Please check the logs."
        exit 1
    }
    Write-Host "npm install completed successfully."
} else {
    Write-Host "Dependencies found. Skipping npm install."
}

# --- 2. CONDITIONAL npm start (Checks if port 8080 is listening) ---
Write-Host "Checking if React server is already running on port 8080..."

# Use netstat to check for a process LISTENING on port 8080
$PortCheck = netstat -ano | Select-String ":8080" | Select-String "LISTENING"

if ($PortCheck) {
    Write-Host "Server is already running on port 8080. Launching browser only."
    exit 0
} else {
    Write-Host "Server not found. Starting React app in NEW WINDOW..."
    
    # ------------------ FIX: New Terminal Window ------------------
    # Command to execute 'npm start' in a brand new PowerShell window.
    # The '/c' flag tells cmd to execute the command and then terminate, 
    # but the 'start' command keeps the new PowerShell window open.
    cmd.exe /c start powershell -NoExit -Command "npm start"
    
    # Wait a few seconds for the server to spin up before the browser launches
    Start-Sleep -Seconds 5 
    # -------------------------------------------------------------
    
    exit 0
}