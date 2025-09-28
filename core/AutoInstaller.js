const fs = require('fs');
const { execSync } = require('child_process');

class AutoInstaller {
    static async setupEnvironment() {
        console.log('🔧 Iniciando configuração automática...\n');

        if (!this.checkNodeJS()) {
            console.error('❌ Node.js não encontrado!');
            console.log('📥 Baixe em: https://nodejs.org');
            process.exit(1);
        }

        await this.installDependencies();
        await this.installPlaywright();
        console.log('✅ Configuração automática concluída!\n');
    }

    static checkNodeJS() {
        try {
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            console.log(`✅ Node.js: ${nodeVersion}`);
            return true;
        } catch {
            return false;
        }
    }

    static async installDependencies() {
        if (!fs.existsSync('node_modules')) {
            console.log('📦 Instalando dependências...');
            try {
                execSync('npm install', { stdio: 'inherit' });
            } catch (error) {
                console.error('❌ Erro na instalação:', error.message);
                process.exit(1);
            }
        }
    }

    static async installPlaywright() {
        try {
            console.log('🖥️ Configurando Playwright...');
            execSync('npx playwright install chromium', { stdio: 'inherit' });
        } catch (error) {
            console.error('❌ Erro no Playwright:', error.message);
            process.exit(1);
        }
    }
}

module.exports = AutoInstaller;