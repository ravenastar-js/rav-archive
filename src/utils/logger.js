const colors = require('../config/colors');

/**
 * 🎪 Exibe banner de abertura do sistema
 */
function showBanner() {
    console.log(colors.apply(colors.magenta, '╔══════════════════════════════════════════════════════════════╗'));
    console.log(colors.apply(colors.magenta, '║                                                              ║'));
    console.log(colors.apply(colors.cyan,    '║    🚀 RAV ARCHIVE ✨ V1                                    ║'));
    console.log(colors.apply(colors.magenta, '║                                                              ║'));
    console.log(colors.apply(colors.blue,    '║    🌐 Arquivamento Automático - Wayback Machine            ║'));
    console.log(colors.apply(colors.green,   '║    ⚡ Biblioteca NPM + CLI                                  ║'));
    console.log(colors.apply(colors.magenta, '║                                                              ║'));
    console.log(colors.apply(colors.magenta, '╚══════════════════════════════════════════════════════════════╝'));
    console.log('');
}

/**
 * 📊 Exibe resultados do processamento
 * @param {Object} result - Resultados do arquivamento
 */
function showResults(result) {
    console.log('\n' + colors.apply(colors.green, '📊 RESULTADOS:'));
    console.log(colors.apply(colors.blue, '├── URLs processadas:'), result.metadata.summary.total);
    console.log(colors.apply(colors.green, '├── Sucessos:'), result.metadata.summary.archived);
    console.log(colors.apply(colors.red, '├── Falhas:'), result.metadata.summary.failed);
    console.log(colors.apply(colors.cyan, '└── Taxa de sucesso:'), 
        ((result.metadata.summary.archived / result.metadata.summary.total) * 100).toFixed(1) + '%');
}

/**
 * 📈 Exibe estatísticas do sistema
 * @param {Object} stats - Estatísticas a serem exibidas
 */
function showStats(stats) {
    // 📭 Verificar se há dados para exibir
    if (stats.summary.total === 0) {
        console.log(colors.apply(colors.yellow, '📊 Nenhum dado de arquivamento encontrado.'));
        console.log(colors.apply(colors.cyan, '💡 Execute primeiro: rav-archive file links.txt'));
        return;
    }

    // 📋 Exibir estatísticas detalhadas
    console.log(colors.apply(colors.cyan, '\n📊 ESTATÍSTICAS RAV-ARCHIVE:'));
    console.log(colors.apply(colors.blue, '├── Status:'), stats.status);
    console.log(colors.apply(colors.green, '├── URLs processadas:'), stats.summary.total);
    console.log(colors.apply(colors.green, '├── Sucessos:'), stats.summary.archived);
    console.log(colors.apply(colors.red, '├── Falhas:'), stats.summary.failed);
    console.log(colors.apply(colors.cyan, '└── Taxa de sucesso:'), 
        ((stats.summary.archived / stats.summary.total) * 100).toFixed(1) + '%');
}

/**
 * ❓ Exibe ajuda do sistema com comandos disponíveis
 */
function showHelp() {
    console.log(colors.apply(colors.cyan, '📖 USO:'));
    console.log(colors.apply(colors.yellow, '  rav-archive [comando] [argumento]\n'));
    
    console.log(colors.apply(colors.green, '🛠️  COMANDOS DISPONÍVEIS:'));
    console.log(colors.apply(colors.blue, '  file [caminho]    ') + ' - Arquivar URLs de um arquivo');
    console.log(colors.apply(colors.blue, '  url [url]         ') + ' - Arquivar uma única URL');
    console.log(colors.apply(colors.blue, '  batch [urls]      ') + ' - Arquivar múltiplas URLs (separadas por vírgula)');
    console.log(colors.apply(colors.blue, '  check [url]       ') + ' - Verificar se URL está arquivada');
    console.log(colors.apply(colors.blue, '  stats             ') + ' - Mostrar estatísticas');
    console.log(colors.apply(colors.blue, '  --version, -v     ') + ' - Mostrar versão');
    console.log(colors.apply(colors.blue, '  --help, -h        ') + ' - Mostrar ajuda');
    
    console.log(colors.apply(colors.cyan, '\n📚 EXEMPLOS:'));
    console.log(colors.apply(colors.white, '  rav-archive file links.txt'));
    console.log(colors.apply(colors.white, '  rav-archive url https://exemplo.com'));
    console.log(colors.apply(colors.white, '  rav-archive batch https://site1.com,https://site2.com'));
    console.log(colors.apply(colors.white, '  rav-archive check https://exemplo.com'));
    console.log(colors.apply(colors.white, '  rav-archive stats'));
    console.log(colors.apply(colors.white, '  rav-archive --version'));
    console.log(colors.apply(colors.white, '  rav-archive --help'));
}

module.exports = {
    colors,
    showBanner,
    showResults,
    showStats,
    showHelp
};