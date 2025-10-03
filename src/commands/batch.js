const { showBanner, showResults, colors } = require('../utils/logger');

/**
 * 🚀 Comando para arquivamento em lote de múltiplas URLs
 * @param {Object} archive - Instância do arquivador
 * @param {string} urlsString - String com URLs separadas por vírgula
 * @returns {Promise<Object>} Resultado do arquivamento
 * @throws {Error} Se nenhuma URL for fornecida ou inválida
 */
module.exports = async function batchCommand(archive, urlsString) {
    // 🔴 Validação de entrada obrigatória
    if (!urlsString) {
        throw new Error('Forneça URLs separadas por vírgula: rav-archive batch url1,url2,url3');
    }

    // 🎯 Processamento e limpeza das URLs
    const urls = urlsString.split(',').map(url => url.trim()).filter(url => url);
    
    // ⚠️ Verificação de URLs válidas
    if (urls.length === 0) {
        throw new Error('Nenhuma URL válida fornecida');
    }

    // 🎪 Execução do arquivamento
    showBanner();
    console.log(colors.apply(colors.cyan, `📦 Arquivando ${urls.length} URLs em lote`));
    const result = await archive.archiveUrls(urls);
    showResults(result);
    
    return result;
};