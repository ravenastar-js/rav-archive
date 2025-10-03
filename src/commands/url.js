const { showBanner, showResults, colors } = require('../utils/logger');

/**
 * 🔗 Comando para arquivamento de uma única URL
 * @param {Object} archive - Instância do arquivador
 * @param {string} url - URL a ser arquivada
 * @returns {Promise<Object>} Resultado do arquivamento
 * @throws {Error} Se URL não for fornecida
 */
module.exports = async function urlCommand(archive, url) {
    // 🔴 Validação de URL obrigatória
    if (!url) {
        throw new Error('Forneça uma URL: rav-archive url https://exemplo.com');
    }

    // 🎪 Execução do arquivamento individual
    showBanner();
    console.log(colors.apply(colors.cyan, `🔗 Arquivando URL: ${url}`));
    const result = await archive.archiveUrl(url);
    showResults(result);
    
    return result;
};