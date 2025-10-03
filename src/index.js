const SmartArchiveChecker = require('./core/SmartArchiveChecker');
const AutoInstaller = require('./core/AutoInstaller');
const ConnectionManager = require('./core/ConnectionManager');
const config = require('./config/default');

class RavArchive {
    constructor(userConfig = {}) {
        this.config = { ...config, ...userConfig };
        this.checker = new SmartArchiveChecker(this.config);
    }

    /**
     * Arquivar uma única URL
     * @param {string} url - URL para arquivar
     * @returns {Promise<Object>} Resultado do arquivamento
     */
    async archiveUrl(url) {
        try {
            await AutoInstaller.setupEnvironment();
            const result = await this.checker.processUrls([url]);
            return result;
        } catch (error) {
            throw new Error(`Falha ao arquivar URL: ${error.message}`);
        }
    }

    /**
     * Arquivar múltiplas URLs
     * @param {string[]} urls - Array de URLs para arquivar
     * @returns {Promise<Object>} Resultados do arquivamento
     */
    async archiveUrls(urls) {
        try {
            await AutoInstaller.setupEnvironment();
            const result = await this.checker.processUrls(urls);
            return result;
        } catch (error) {
            throw new Error(`Falha ao arquivar URLs: ${error.message}`);
        }
    }

    /**
     * Arquivar URLs de um arquivo
     * @param {string} filePath - Caminho do arquivo com URLs
     * @returns {Promise<Object>} Resultados do arquivamento
     */
    async archiveFromFile(filePath) {
        try {
            await AutoInstaller.setupEnvironment();
            const fs = require('fs');
            const data = fs.readFileSync(filePath, 'utf8');
            const urls = data.split('\n')
                .map(url => url.trim())
                .filter(url => url && this.isValidUrl(url));
            
            const result = await this.checker.processUrls(urls);
            return result;
        } catch (error) {
            throw new Error(`Falha ao arquivar do arquivo: ${error.message}`);
        }
    }

    /**
     * Verificar se uma URL já está arquivada
     * @param {string} url - URL para verificar
     * @returns {Promise<Object>} Informações do arquivamento
     */
    async checkArchived(url) {
        try {
            await AutoInstaller.setupEnvironment();

            if (!this.checker.browser) {
                await this.checker.initBrowser();
            }
            const result = await this.checker.checkIfArchived(url);
            return result;
        } catch (error) {
            throw new Error(`Falha ao verificar URL: ${error.message}`);
        }
    }

    /**
     * Obter estatísticas dos últimos arquivamentos
     * @returns {Object} Estatísticas
     */
    getStats() {
        return this.checker.getStatistics();
    }

    /**
     * Obter URLs arquivadas com sucesso
     * @returns {Array} URLs arquivadas
     */
    getArchivedUrls() {
        return this.checker.getArchivedUrls();
    }

    /**
     * Obter URLs que falharam
     * @returns {Array} URLs com falhas
     */
    getFailedUrls() {
        return this.checker.getFailedUrls();
    }

    /**
     * Validar URL
     * @param {string} url - URL para validar
     * @returns {boolean} É válida
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = {
    RavArchive,
    SmartArchiveChecker,
    AutoInstaller,
    ConnectionManager
};