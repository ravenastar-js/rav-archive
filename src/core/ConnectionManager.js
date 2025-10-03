const { execSync } = require('child_process');
const readline = require('readline');

class ConnectionManager {
    constructor() {
        this.connectionType = 'Direct';
        this.currentIP = null;
    }

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

    getDynamicDelay(baseDelay) {
        return baseDelay + Math.random() * 1000;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = ConnectionManager;