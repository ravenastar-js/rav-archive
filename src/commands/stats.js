const { showBanner, colors } = require('../utils/logger');

module.exports = async function statsCommand(archive) {
    showBanner();
    
    try {
        const stats = archive.getStats();
        
        // Verificar se existem dados antes de mostrar
        if (stats.summary.total === 0) {
            console.log(colors.apply(colors.yellow, '📊 Nenhum dado de arquivamento encontrado.'));
            console.log(colors.apply(colors.cyan, '💡 Execute primeiro: rav-archive file links.txt'));
            return;
        }

        console.log(colors.apply(colors.cyan, '\n📊 ESTATÍSTICAS RAV-ARCHIVE:'));
        console.log(colors.apply(colors.blue, '├── Status:'), stats.status);
        console.log(colors.apply(colors.green, '├── URLs processadas:'), stats.summary.total);
        console.log(colors.apply(colors.green, '├── Sucessos:'), stats.summary.archived);
        console.log(colors.apply(colors.red, '├── Falhas:'), stats.summary.failed);
        console.log(colors.apply(colors.cyan, '└── Taxa de sucesso:'), 
            ((stats.summary.archived / stats.summary.total) * 100).toFixed(1) + '%');
            
        // Mostrar algumas URLs de sucesso se houver
        if (stats.successfulUrls && stats.successfulUrls.length > 0) {
            console.log(colors.apply(colors.green, `\n📋 URLs arquivadas com sucesso: ${stats.successfulUrls.length}`));
            stats.successfulUrls.slice(0, 3).forEach((url, index) => {
                console.log(colors.apply(colors.white, `  ${index + 1}. ${url}`));
            });
            if (stats.successfulUrls.length > 3) {
                console.log(colors.apply(colors.cyan, `  ... e mais ${stats.successfulUrls.length - 3} URLs`));
            }
        }
    } catch (error) {
        console.log(colors.apply(colors.yellow, '📊 Nenhum dado de arquivamento encontrado.'));
        console.log(colors.apply(colors.cyan, '💡 Execute primeiro: rav-archive file links.txt'));
    }
};