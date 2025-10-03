const SmartArchiveChecker = require('./core/SmartArchiveChecker');
const AutoInstaller = require('./core/AutoInstaller');
const ConnectionManager = require('./core/ConnectionManager');
const config = require('./config/default');

/**
 * 🎯 Classe principal do Rav Archive - Interface pública
 * @class RavArchive
 */
class RavArchive {
    /**
     * 🏗️ Construtor do Rav Archive
     * @param {Object} userConfig - Configurações personalizadas do usuário
     */
    constructor(userConfig = {}) {
        this.config = { ...config, ...userConfig };
        this.checker = new SmartArchiveChecker(this.config);
    }

    /**
     * 🔗 Arquivar uma única URL
     * @async
     * @param {string} url - URL para arquivar
     * @param {Object} options - Opções de arquivamento
     * @returns {Promise<Object>} Resultado do arquivamento
     * @throws {Error} Se falhar no arquivamento
     */
    async archiveUrl(url, options = {}) {
        try {
            await AutoInstaller.setupEnvironment();
            const result = await this.checker.processUrls([url], options);
            return result;
        } catch (error) {
            throw new Error(`Falha ao arquivar URL: ${error.message}`);
        }
    }

    /**
     * 📦 Arquivar múltiplas URLs
     * @async
     * @param {string[]} urls - Array de URLs para arquivar
     * @param {Object} options - Opções de arquivamento
     * @returns {Promise<Object>} Resultados do arquivamento
     * @throws {Error} Se falhar no arquivamento
     */
    async archiveUrls(urls, options = {}) {
        try {
            await AutoInstaller.setupEnvironment();
            const result = await this.checker.processUrls(urls, options);
            return result;
        } catch (error) {
            throw new Error(`Falha ao arquivar URLs: ${error.message}`);
        }
    }

    /**
    * 📄 Arquivar URLs de um arquivo
    * @async
    * @param {string} filePath - Caminho do arquivo com URLs
    * @param {Object} options - Opções de arquivamento
    * @returns {Promise<Object>} Resultados do arquivamento
    * @throws {Error} Se arquivo não existir ou for inválido
    */
    async archiveFromFile(filePath, options = {}) {
        try {
            await AutoInstaller.setupEnvironment();
            const fs = require('fs');
            const data = fs.readFileSync(filePath, 'utf8');
            const urls = data.split('\n')
                .map(url => url.trim())
                .filter(url => url && this.isValidUrl(url));

            const result = await this.checker.processUrls(urls, options);
            return result;
        } catch (error) {
            throw new Error(`Falha ao arquivar do arquivo: ${error.message}`);
        }
    }

    /**
     * 🔍 Verificar se uma URL já está arquivada
     * @async
     * @param {string} url - URL para verificar
     * @returns {Promise<Object>} Informações do arquivamento
     * @throws {Error} Se falhar na verificação
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
     * 📊 Obter estatísticas dos últimos arquivamentos
     * @returns {Object} Estatísticas consolidadas
     */
    getStats() {
        return this.checker.getStatistics();
    }

    /**
     * ✅ Obter URLs arquivadas com sucesso
     * @returns {Array} URLs arquivadas com metadados
     */
    getArchivedUrls() {
        return this.checker.getArchivedUrls();
    }

    /**
     * ❌ Obter URLs que falharam no arquivamento
     * @returns {Array} URLs com falhas e detalhes de erro
     */
    getFailedUrls() {
        return this.checker.getFailedUrls();
    }

    /**
     * ✅ Validar formato de URL
     * @param {string} url - URL para validar
     * @returns {boolean} True se URL for válida
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