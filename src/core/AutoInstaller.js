const fs = require('fs');
const { execSync } = require('child_process');

class AutoInstaller {
    static async setupEnvironment() {
        console.log('🔧 Configurando ambiente Rav Archive...\n');

        if (!this.checkNodeJS()) {
            throw new Error('Node.js não encontrado! Baixe em: https://nodejs.org');
        }

        await this.installDependencies();
        await this.installPlaywright();
        console.log('✅ Ambiente configurado com sucesso!\n');
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
        try {
            // Verifica se playwright está instalado
            require.resolve('playwright');
            console.log('✅ Playwright já instalado');
        } catch {
            console.log('📦 Instalando Playwright...');
            try {
                execSync('npm install playwright', { stdio: 'inherit' });
            } catch (error) {
                throw new Error(`Falha na instalação do Playwright: ${error.message}`);
            }
        }
    }

    static async installPlaywright() {
        try {
            console.log('🖥️ Verificando Chromium...');
            execSync('npx playwright install chromium', { stdio: 'inherit' });
            console.log('✅ Chromium configurado');
        } catch (error) {
            throw new Error(`Falha na instalação do Chromium: ${error.message}`);
        }
    }
}

module.exports = AutoInstaller;