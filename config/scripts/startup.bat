@echo off
title Ultimate Metron Startup Script

REM Navigate to project root (2 levels up from config/scripts/)
cd /d %~dp0..\..\

REM Load .env variables
if exist .env (
    for /f "tokens=1,2 delims== eol=#" %%a in (.env) do set "%%a=%%b"
) else (
    echo [WARNING] .env file not found!
)

REM Check prerequisites
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker not found! Please install Docker Desktop.
    pause
    exit /b 1
)

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] pnpm not found! Please install Node.js and pnpm.
    pause
    exit /b 1
)

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs

echo [INFO] Starting Infrastructure (Docker)...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose failed to start!
    pause
    exit /b 1
)

REM Start IBC-managed IB Gateway (use StartGateway.bat from IBC)
set IBC_INSTALL_DIR=C:\IBC
set IBC_CONFIG_DIR=%USERPROFILE%\Documents\IBC
if exist "%IBC_INSTALL_DIR%\StartGateway.bat" (
    echo [INFO] Starting IB Gateway via IBC...
    start "IB Gateway" "%IBC_INSTALL_DIR%\StartGateway.bat" /INLINE "%IBC_CONFIG_DIR%\config.ini" TWOFA_TIMEOUT_ACTION=restart
) else (
    echo [WARNING] IBC not found at %IBC_INSTALL_DIR%. Skipping Gateway start.
)

REM Wait 4 minutes (240 seconds) for initialization (Gateway load, 2FA, DBs)
echo [INFO] Waiting 4 minutes (240s) for IB Gateway & Database Initialization...
timeout /t 240 /nobreak

echo [INFO] Installing/Verifying Dependencies...
call pnpm install
REM Python dependencies check (using pip as fallback if poetry not visible)
if exist requirements.txt pip install -r requirements.txt

echo [INFO] Starting Services...

REM Start Backend (API) via Turbo
start "Metron API" cmd /k "pnpm turbo dev --filter=api"

REM Start Frontend (Web) via Turbo
start "Metron Web" cmd /k "pnpm turbo dev --filter=web"

REM Check trading day before starting bot
echo [INFO] Checking Market Status...
python -c "import sys; from src.python.utils.market_calendar import is_trading_day; sys.exit(0 if is_trading_day() else 1)"
if %errorlevel% neq 0 (
    echo [WARNING] Non-trading day (Market Closed). Skipping Bot Start.
    REM We might still want to keep API/Web running for manual access, so we don't exit startup entirely, just skip bot.
) else (
    echo [INFO] Market is OPEN. Starting Trading Bot...
    REM Start Main Python Trading Bot (Placeholder)
    if exist src\python\main_bot.py (
        start "Metron Bot Logic" cmd /k "python src\python\main_bot.py"
    )
)

REM Start Rust core if needed
if exist src\rust\Cargo.toml (
    REM start "Metron Rust Core" cmd /k "cargo run --release --manifest-path src\rust\Cargo.toml"
)

echo [SUCCESS] Startup sequence complete at %date% %time% >> logs/startup.log
echo [SUCCESS] System is live. Check console windows for details.
pause
