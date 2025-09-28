const fs = require('fs');
const AutoInstaller = require('./core/AutoInstaller');
const SmartArchiveChecker = require('./core/SmartArchiveChecker');

if (!fs.existsSync('links.txt')) {
    console.error('❌ Arquivo links.txt não encontrado!');
    console.log('\n📝 Crie o arquivo links.txt com uma URL por linha:');
    console.log('   https://exemplo.com');
    console.log('   https://site.com/pagina');
    console.log('\n💡 Dica: Salve o arquivo na mesma pasta do script.');
    process.exit(1);
}

class ConsoleColors {
    static reset = '\x1b[0m';
    static bright = '\x1b[1m';
    static red = '\x1b[31m';
    static green = '\x1b[32m';
    static yellow = '\x1b[33m';
    static blue = '\x1b[34m';
    static magenta = '\x1b[35m';
    static cyan = '\x1b[36m';
    static white = '\x1b[37m';

    static apply(color, text) {
        return `${color}${text}${this.reset}`;
    }
}

async function main() {
    console.log(ConsoleColors.apply(ConsoleColors.magenta, '╔══════════════════════════════════════════════════════════════╗'));
    console.log(ConsoleColors.apply(ConsoleColors.magenta, '║                                                              ║'));
    console.log(ConsoleColors.apply(ConsoleColors.magenta, '║    🚀 RAV ARCHIVE ✨ V1                                     ║'));
    console.log(ConsoleColors.apply(ConsoleColors.magenta, '║                                                              ║'));
    console.log(ConsoleColors.apply(ConsoleColors.magenta, '║    🌐 Arquivo Inteligente no Wayback Machine                ║'));
    console.log(ConsoleColors.apply(ConsoleColors.magenta, '║    ⚡ Otimizado para Windows + Execução Contínua            ║'));
    console.log(ConsoleColors.apply(ConsoleColors.magenta, '║                                                              ║'));
    console.log(ConsoleColors.apply(ConsoleColors.magenta, '╚══════════════════════════════════════════════════════════════╝'));
    console.log('');

    await AutoInstaller.setupEnvironment();

    const checker = new SmartArchiveChecker();

    try {
        const links = await checker.loadLinks('links.txt');

        console.log(ConsoleColors.apply(ConsoleColors.cyan, '\n🎯 CONFIGURAÇÃO DO SISTEMA:'));
        console.log(ConsoleColors.apply(ConsoleColors.blue, '   ═══════════════════════════════════════════════'));
        console.log(ConsoleColors.apply(ConsoleColors.green, '   • 📊 URLs carregadas:'), ConsoleColors.apply(ConsoleColors.yellow, links.length));
        console.log(ConsoleColors.apply(ConsoleColors.green, '   • ⚡ Delays otimizados:'), ConsoleColors.apply(ConsoleColors.yellow, '7-10 segundos'));
        console.log(ConsoleColors.apply(ConsoleColors.green, '   • 🔗 Modo de conexão:'), ConsoleColors.apply(ConsoleColors.yellow, 'AUTOMÁTICO (VPN ou Direto)'));
        console.log(ConsoleColors.apply(ConsoleColors.green, '   • ⏱️  Timeout:'), ConsoleColors.apply(ConsoleColors.yellow, '60 segundos'));
        console.log(ConsoleColors.apply(ConsoleColors.green, '   • 🔄 Tentativas máximas:'), ConsoleColors.apply(ConsoleColors.yellow, '4 por URL'));
        console.log(ConsoleColors.apply(ConsoleColors.green, '   • 🛡️  Navegador:'), ConsoleColors.apply(ConsoleColors.yellow, 'Chromium Headless'));
        console.log(ConsoleColors.apply(ConsoleColors.green, '   • 🧹 Limpeza automática:'), ConsoleColors.apply(ConsoleColors.yellow, 'ATIVADA (apenas archive_results.json)'));
        console.log(ConsoleColors.apply(ConsoleColors.blue, '   ═══════════════════════════════════════════════\n'));

        console.log(ConsoleColors.apply(ConsoleColors.yellow, '💡 INFORMAÇÃO: O script continuará mesmo com erros individuais'));
        console.log(ConsoleColors.apply(ConsoleColors.yellow, '    e processará todas as URLs disponíveis.\n'));

        console.log(ConsoleColors.apply(ConsoleColors.green, '🚀 INICIANDO ARQUIVAMENTO AUTOMATICAMENTE...\n'));

        await checker.processUrls(links);

    } catch (error) {
        console.error(ConsoleColors.apply(ConsoleColors.red, '❌ Erro fatal:'), error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error(ConsoleColors.apply(ConsoleColors.red, '💥 Erro não tratado:'), error);
        process.exit(1);
    });
}

module.exports = { SmartArchiveChecker, AutoInstaller };