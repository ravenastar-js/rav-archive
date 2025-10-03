const { showBanner, colors } = require('../utils/logger');

/**
 * 🔍 Comando para verificar status de arquivamento de uma URL
 * @param {Object} archive - Instância do arquivador
 * @param {string} url - URL a ser verificada
 * @returns {Promise<Object>} Resultado da verificação
 * @throws {Error} Se URL não for fornecida ou ocorrer erro na verificação
 */
module.exports = async function checkCommand(archive, url) {
    // 🔴 Validação de URL obrigatória
    if (!url) {
        throw new Error('Forneça uma URL: rav-archive check https://exemplo.com');
    }

    // 🔎 Início da verificação
    showBanner();
    console.log(colors.apply(colors.cyan, `🔍 Verificando URL: ${url}`));
    
    try {
        // 📊 Consulta status de arquivamento
        const result = await archive.checkArchived(url);
        
        // ✅ URL já arquivada
        if (result.archived) {
            console.log(colors.apply(colors.green, `✅ URL já arquivada: ${result.snapshotUrl}`));
        } else {
            // ❌ URL não encontrada no arquivo
            console.log(colors.apply(colors.yellow, `❌ URL não encontrada no arquivo`));
        }
        
        return result;
    } catch (error) {
        // 🚨 Tratamento de erros na verificação
        console.log(colors.apply(colors.red, `❌ Erro ao verificar URL: ${error.message}`));
        throw error;
    }
};