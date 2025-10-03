const { showBanner, showResults, colors } = require('../utils/logger');

module.exports = async function urlCommand(archive, url) {
    if (!url) {
        throw new Error('Forneça uma URL: rav-archive url https://exemplo.com');
    }

    showBanner();
    console.log(colors.apply(colors.cyan, `🔗 Arquivando URL: ${url}`));
    const result = await archive.archiveUrl(url);
    showResults(result);
    
    return result;
};