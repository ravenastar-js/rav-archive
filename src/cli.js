#!/usr/bin/env node

const { showBanner, showHelp } = require('./utils/logger');

function main() {
    const args = process.argv.slice(2);
    
    // Mostrar ajuda se não há argumentos ou se pede ajuda
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        showBanner();
        showHelp();
        process.exit(0);
    }

    // Mostrar versão
    if (args[0] === '--version' || args[0] === '-v') {
        console.log('rav-archive v1.0.0');
        process.exit(0);
    }

    // Para outros comandos, carregar assincronamente
    loadCommands(args);
}

async function loadCommands(args) {
    // Só carrega o RavArchive se for um comando que precisa dele
    const { RavArchive } = require('./index');
    const fileCommand = require('./commands/file');
    const urlCommand = require('./commands/url');
    const batchCommand = require('./commands/batch');
    const checkCommand = require('./commands/check');
    const statsCommand = require('./commands/stats');

    const archive = new RavArchive();

    try {
        switch (args[0]) {
            case 'file':
                await fileCommand(archive, args[1]);
                break;

            case 'url':
                await urlCommand(archive, args[1]);
                break;

            case 'batch':
                await batchCommand(archive, args[1]);
                break;

            case 'check':
                await checkCommand(archive, args[1]);
                break;

            case 'stats':
                await statsCommand(archive);
                break;

            default:
                showBanner();
                console.log(`❌ Comando desconhecido: ${args[0]}\n`);
                showHelp();
                process.exit(1);
        }
    } catch (error) {
        console.error('💥 Erro:', error.message);
        process.exit(1);
    }
}

// Executar apenas se for o módulo principal
if (require.main === module) {
    main();
}

module.exports = { main };