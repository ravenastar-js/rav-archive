const { showBanner, showResults, colors } = require('../utils/logger');

module.exports = async function batchCommand(archive, urlsString) {
    if (!urlsString) {
        throw new Error('Forneça URLs separadas por vírgula: rav-archive batch url1,url2,url3');
    }

    const urls = urlsString.split(',').map(url => url.trim()).filter(url => url);
    
    if (urls.length === 0) {
        throw new Error('Nenhuma URL válida fornecida');
    }

    showBanner();
    console.log(colors.apply(colors.cyan, `📦 Arquivando ${urls.length} URLs em lote`));
    const result = await archive.archiveUrls(urls);
    showResults(result);
    
    return result;
};