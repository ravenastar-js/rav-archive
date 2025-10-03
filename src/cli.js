#!/usr/bin/env node

const { RavArchive } = require('./index');
const { showBanner, showHelp } = require('./utils/logger');
const fileCommand = require('./commands/file');
const urlCommand = require('./commands/url');
const batchCommand = require('./commands/batch');
const checkCommand = require('./commands/check');
const statsCommand = require('./commands/stats');

async function main() {
    const args = process.argv.slice(2);
    
    // Mostrar ajuda se não há argumentos ou se pede ajuda
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        showBanner();
        showHelp();
        return;
    }

    // Mostrar versão
    if (args[0] === '--version' || args[0] === '-v') {
        console.log('rav-archive v1.0.0');
        return;
    }

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
                showHelp();
        }
    } catch (error) {
        console.error('💥 Erro:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error('💥 Erro fatal:', error);
        process.exit(1);
    });
}

module.exports = { main };