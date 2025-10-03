const { showBanner, colors } = require('../utils/logger');

module.exports = async function checkCommand(archive, url) {
    if (!url) {
        throw new Error('Forneça uma URL: rav-archive check https://exemplo.com');
    }

    showBanner();
    console.log(colors.apply(colors.cyan, `🔍 Verificando URL: ${url}`));
    
    try {
        const result = await archive.checkArchived(url);
        
        if (result.archived) {
            console.log(colors.apply(colors.green, `✅ URL já arquivada: ${result.snapshotUrl}`));
        } else {
            console.log(colors.apply(colors.yellow, `❌ URL não encontrada no arquivo`));
        }
        
        return result;
    } catch (error) {
        console.log(colors.apply(colors.red, `❌ Erro ao verificar URL: ${error.message}`));
        throw error;
    }
};