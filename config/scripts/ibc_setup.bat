@echo off
title IBC Setup Script for Ultimate Metron

REM Navigate to project root (2 levels up)
cd /d %~dp0..\..\

REM Load .env variables dynamically (parse .env file)
if exist .env (
    for /f "tokens=1,2 delims== eol=#" %%a in (.env) do set "%%a=%%b"
) else (
    echo [WARNING] .env file not found!
)

REM Prerequisites check
if not exist "C:\Jts" (
    echo [ERROR] IB TWS/Gateway not installed in C:\Jts! Install offline version from IB website.
    pause
    exit /b 1
)

REM Define IBC paths dynamically
set IBC_VERSION=3.19.0
set IBC_ZIP=IBCWindows-%IBC_VERSION%.zip
set IBC_URL=https://github.com/IbcAlpha/IBC/releases/download/%IBC_VERSION%/%IBC_ZIP%
set IBC_INSTALL_DIR=C:\IBC
set IBC_CONFIG_DIR=%USERPROFILE%\Documents\IBC
set IBC_CONFIG_FILE=%IBC_CONFIG_DIR%\config.ini

REM Download IBC ZIP if not exists (to config\scripts path or temp)
if not exist "%IBC_ZIP%" (
    echo Downloading IBC from %IBC_URL%...
    powershell -Command "Invoke-WebRequest -Uri '%IBC_URL%' -OutFile '%IBC_ZIP%'"
)

REM Extract ZIP (unblock first)
echo Unblocking and extracting IBC...
powershell -Command "Unblock-File '%IBC_ZIP%'"
if not exist "%IBC_INSTALL_DIR%" mkdir "%IBC_INSTALL_DIR%"
powershell -Command "Expand-Archive -Path '%IBC_ZIP%' -DestinationPath '%IBC_INSTALL_DIR%' -Force"

REM Create secure config dir if not exists
if not exist "%IBC_CONFIG_DIR%" mkdir "%IBC_CONFIG_DIR%"

REM Create config.ini template with placeholders (dynamic from .env)
echo Creating config.ini...
echo [TWS] > "%IBC_CONFIG_FILE%"
echo IbLoginId=%IB_USERNAME% >> "%IBC_CONFIG_FILE%"
echo IbPassword=PLACEHOLDER_PASSWORD >> "%IBC_CONFIG_FILE%"
echo TradingMode=%TRADING_MODE% >> "%IBC_CONFIG_FILE%"
echo AcceptNonBrokerageAccountWarning=yes >> "%IBC_CONFIG_FILE%"
echo AcceptIncomingConnectionAction=reject >> "%IBC_CONFIG_FILE%"
echo ReloginAfterSecondFactorAuthenticationTimeout=yes >> "%IBC_CONFIG_FILE%"
echo SecondFactorAuthenticationExitInterval=300 >> "%IBC_CONFIG_FILE%"
echo ClosedownAt=Friday 18:00 >> "%IBC_CONFIG_FILE%"
echo AutoRestartTime=23:55 >> "%IBC_CONFIG_FILE%"

REM Encrypt config dir for security (Windows EFS)
echo Encrypting config directory...
powershell -Command "cipher /e /s:'%IBC_CONFIG_DIR%'"

echo [SUCCESS] IBC setup complete. 
echo Config located at: %IBC_CONFIG_FILE%
echo IMPORTANT: Edit config.ini to set your real IbPassword (it is set to PLACEHOLDER_PASSWORD).
pause
