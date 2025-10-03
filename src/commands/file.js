const fs = require('fs');
const { showBanner, showResults, colors } = require('../utils/logger');

/**
 * 📄 Comando para arquivamento de URLs a partir de um arquivo
 * @param {Object} archive - Instância do arquivador
 * @param {string} filePath - Caminho do arquivo contendo URLs
 * @returns {Promise<Object>} Resultado do arquivamento
 * @throws {Error} Se arquivo não for fornecido ou não existir
 */
module.exports = async function fileCommand(archive, filePath) {
    // 🔴 Validação de caminho do arquivo
    if (!filePath) {
        throw new Error('Forneça o caminho do arquivo: rav-archive file links.txt');
    }

    // 🔍 Verificação de existência do arquivo
    if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
    }

    // 📂 Processamento do arquivo
    showBanner();
    console.log(colors.apply(colors.cyan, `📁 Processando arquivo: ${filePath}`));
    const result = await archive.archiveFromFile(filePath);
    showResults(result);
    
    return result;
};