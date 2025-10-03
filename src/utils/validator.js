const { URL } = require('url');

/**
 * 🔍 Validador de URLs e entradas do sistema
 * @class Validator
 */
class Validator {
    /**
     * ✅ Valida formato de URL
     * @static
     * @param {string} url - URL a ser validada
     * @returns {boolean} True se URL for válida
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 📋 Valida lista de URLs
     * @static
     * @param {string[]} urls - Array de URLs a validar
     * @returns {Object} Objeto com URLs válidas e inválidas
     */
    static validateUrls(urls) {
        const validUrls = [];
        const invalidUrls = [];

        urls.forEach(url => {
            if (this.isValidUrl(url)) {
                validUrls.push(url);
            } else {
                invalidUrls.push(url);
            }
        });

        return { validUrls, invalidUrls };
    }

    /**
     * 📄 Valida extensão de arquivo
     * @static
     * @param {string} filename - Nome do arquivo
     * @param {string[]} allowedExtensions - Extensões permitidas
     * @returns {boolean} True se extensão for válida
     */
    static validateFileExtension(filename, allowedExtensions = ['.txt']) {
        return allowedExtensions.some(ext => filename.endsWith(ext));
    }

    /**
     * 🧹 Sanitiza URL removendo espaços e barras finais
     * @static
     * @param {string} url - URL a ser sanitizada
     * @returns {string} URL sanitizada
     */
    static sanitizeUrl(url) {
        return url.trim().replace(/\/+$/, '');
    }
}

module.exports = Validator;