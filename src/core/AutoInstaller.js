const fs = require('fs');
const { execSync } = require('child_process');

/**
 * ⚙️ Classe para configuração automática do ambiente Rav Archive
 * @class AutoInstaller
 */
class AutoInstaller {
    /**
     * 🛠️ Configuração completa do ambiente
     * @static
     * @returns {Promise<void>}
     * @throws {Error} Se houver falha na configuração
     */
    static async setupEnvironment() {
        console.log('🔧 Configurando ambiente Rav Archive...\n');

        // 🔍 Verificação do Node.js
        if (!this.checkNodeJS()) {
            throw new Error('Node.js não encontrado! Baixe em: https://nodejs.org');
        }

        // 📦 Instalação de dependências
        await this.installDependencies();
        await this.installPlaywright();
        console.log('✅ Ambiente configurado com sucesso!\n');
    }

    /**
     * 🔬 Verifica se Node.js está instalado
     * @static
     * @returns {boolean} True se Node.js estiver disponível
     */
    static checkNodeJS() {
        try {
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            console.log(`✅ Node.js: ${nodeVersion}`);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 📚 Instala dependências do projeto (Playwright)
     * @static
     * @returns {Promise<void>}
     * @throws {Error} Se falhar na instalação
     */
    static async installDependencies() {
        try {
            // 🔎 Verifica se playwright já está instalado
            require.resolve('playwright');
            console.log('✅ Playwright já instalado');
        } catch {
            // 📥 Instalação do Playwright
            console.log('📦 Instalando Playwright...');
            try {
                execSync('npm install playwright', { stdio: 'inherit' });
            } catch (error) {
                throw new Error(`Falha na instalação do Playwright: ${error.message}`);
            }
        }
    }

    /**
     * 🌐 Instala e configura o Chromium para Playwright
     * @static
     * @returns {Promise<void>}
     * @throws {Error} Se falhar na instalação do Chromium
     */
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