@echo off
chcp 65001 >nul

:: Salva o diretório onde o script está
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo.
echo ========================================
echo    RAV ARCHIVE - INSTALADOR
echo ========================================
echo.

:: Verifica se o Node.js está instalado
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js nao encontrado!
    echo Baixe em: https://nodejs.org
    echo.
    pause
    exit /b 1
)
echo Node.js detectado

:: Instala o Playwright
echo Instalando Playwright...
call npm install playwright
if errorlevel 1 (
    echo Erro na instalacao do Playwright
    echo Tentando instalacao com --force...
    call npm install playwright --force
)

if errorlevel 1 (
    echo Falha critica na instalacao do Playwright
    echo Tente executar manualmente: npm install playwright
    echo.
    pause
    exit /b 1
)
echo Playwright instalado com sucesso

:: Instala o Chromium do Playwright
echo Instalando Chromium...
call npx playwright install chromium
if errorlevel 1 (
    echo Erro na instalacao do Chromium
    echo Tente executar manualmente: npx playwright install chromium
    echo.
    pause
    exit /b 1
)
echo Chromium instalado com sucesso

:: Verifica se o arquivo archive.js existe
echo Verificando arquivo archive.js...
if not exist "%SCRIPT_DIR%archive.js" (
    echo Arquivo archive.js nao encontrado!
    echo Certifique-se de que esta na mesma pasta do script.
    echo.
    pause
    exit /b 1
)
echo Arquivo archive.js encontrado

:: Cria as pastas DADOS e DOCS se nao existirem
echo Verificando pastas DADOS e DOCS...
if not exist "%SCRIPT_DIR%DADOS" (
    echo Criando pasta DADOS...
    mkdir "%SCRIPT_DIR%DADOS"
) else (
    echo Pasta DADOS ja existe
)

if not exist "%SCRIPT_DIR%DOCS" (
    echo Criando pasta DOCS...
    mkdir "%SCRIPT_DIR%DOCS"
) else (
    echo Pasta DOCS ja existe
)

:: Executa o script principal
echo.
echo ========================================
echo    INICIANDO RAV ARCHIVE
echo ========================================
echo.

node "%SCRIPT_DIR%archive.js"
pause
