@echo off
chcp 65001 >nul

:: Define o diretório do script
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo.
echo ========================================
echo    RAV ARCHIVE - INSTALADOR
echo ========================================
echo.

:: Verifica Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js nao encontrado!
    echo Baixe em: https://nodejs.org
    pause
    exit /b 1
)
echo Node.js detectado

:: Instala Playwright
call npm install playwright
if errorlevel 1 (
    call npm install playwright --force
)
if errorlevel 1 (
    echo Falha na instalacao do Playwright
    pause
    exit /b 1
)

:: Instala Chromium
call npx playwright install chromium
if errorlevel 1 (
    echo Falha na instalacao do Chromium
    pause
    exit /b 1
)

:: Verifica arquivo archive.js
if not exist "%SCRIPT_DIR%archive.js" (
    echo Arquivo archive.js nao encontrado!
    pause
    exit /b 1
)

:: Cria pastas DADOS e DOCS
if not exist "%SCRIPT_DIR%DADOS" (
    mkdir "%SCRIPT_DIR%DADOS"
)
if not exist "%SCRIPT_DIR%DOCS" (
    mkdir "%SCRIPT_DIR%DOCS"
)

:: Executa o script
node "%SCRIPT_DIR%archive.js"
pause
