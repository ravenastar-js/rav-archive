@echo off
chcp 65001 >nul

:: Define o diretório do script
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: Verifica Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js nao encontrado!
    echo Baixe em: https://www.nodejs.tech/pt-br/download
    pause
    exit /b 1
)
echo Node.js detectado

:: Instala dependências
echo Instalando dependencias...
call npm install
if errorlevel 1 (
    echo Falha na instalacao das dependencias
    pause
    exit /b 1
)

:: Instala Playwright Chromium
echo Instalando Playwright Chromium...
call npx playwright install chromium
if errorlevel 1 (
    echo Falha na instalacao do Chromium
    pause
    exit /b 1
)

:: Verifica se existe arquivo de links
if not exist "links.txt" (
    echo.
    echo AVISO: Arquivo links.txt nao encontrado!
    echo Criando arquivo exemplo...
    echo https://google.com > links.txt
    echo https://github.com >> links.txt
    echo https://example.com >> links.txt
    echo.
    echo Arquivo links.txt criado com URLs de exemplo!
    echo.
)

:: Executa o script
echo.
echo 🚀 RAV ARCHIVE - Iniciando...
echo.
node src/cli.js file links.txt
pause