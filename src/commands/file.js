const fs = require('fs');
const { showBanner, showResults, colors } = require('../utils/logger');

module.exports = async function fileCommand(archive, filePath) {
    if (!filePath) {
        throw new Error('Forneça o caminho do arquivo: rav-archive file links.txt');
    }

    if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
    }

    showBanner();
    console.log(colors.apply(colors.cyan, `📁 Processando arquivo: ${filePath}`));
    const result = await archive.archiveFromFile(filePath);
    showResults(result);
    
    return result;
};