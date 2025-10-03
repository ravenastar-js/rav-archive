const { execSync } = require('child_process');
const readline = require('readline');

/**
 * 🔗 Gerenciador de conexão e configurações de rede
 * @class ConnectionManager
 */
class ConnectionManager {
    constructor() {
        this.connectionType = 'Direct';
        this.currentIP = null;
    }

    /**
     * 🌐 Verifica se há conexão com a internet
     * @async
     * @returns {Promise<boolean>} True se conectado
     */
    async checkConnection() {
        console.log('🌐 Verificando conexão de internet...');

        try {
            execSync('ping -n 1 8.8.8.8', { stdio: 'ignore' });
            console.log('✅ Conexão de internet detectada');
            return true;
        } catch (error) {
            console.log('❌ Sem conexão de internet');
            return false;
        }
    }

    /**
     * ⚠️ Exibe aviso sobre uso de VPN
     * @async
     * @returns {Promise<void>}
     */
    async showVPNWarning() {
        console.log('\n⚠️  AVISO IMPORTANTE:');
        console.log('═'.repeat(70));
        console.log('📋 RECOMENDAÇÃO DE USO:');
        console.log('');
        console.log('💡 Para proteger seu IP principal e evitar limites do Wayback Machine:');
        console.log('   • Use uma VPN como ProtonVPN antes de executar este script');
        console.log('   • Isso ajuda a evitar limites/bloqueios do Wayback Machine em seu IP principal');
        console.log('   • Faça o dowload em: https://protonvpn.com/download');
        console.log('');
        console.log('═'.repeat(70));

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question('Pressione Enter para continuar...', () => {
                rl.close();
                resolve();
            });
        });
    }

    /**
     * 🚀 Inicializa e valida a conexão
     * @async
     * @returns {Promise<boolean>} True se conexão foi estabelecida
     * @throws {Error} Se não houver conexão com internet
     */
    async initializeConnection() {
        console.log('🔗 INICIANDO SISTEMA DE CONEXÃO...');

        await this.showVPNWarning();

        const isConnected = await this.checkConnection();
        if (!isConnected) {
            throw new Error('❌ Sem conexão de internet. Verifique sua rede.');
        }

        console.log('⚡ Conexão estabelecida');
        return true;
    }

    /**
     * ⏰ Gera delay dinâmico para evitar detecção
     * @param {number} baseDelay - Delay base em milissegundos
     * @returns {number} Delay ajustado com randomização
     */
    getDynamicDelay(baseDelay) {
        return baseDelay + Math.random() * 1000;
    }

    /**
     * ⏳ Cria uma pausa assíncrona
     * @param {number} ms - Tempo em milissegundos
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = ConnectionManager;