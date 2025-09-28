const fs = require('fs');
const { execSync, exec } = require('child_process');
const path = require('path');
const { URL } = require('url');
const readline = require('readline');

/**
 * 🌐 Sistema Simplificado de Conexão
 * @class Gerenciador de conexão direta com verificações automáticas
 */
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
            console.log('❌ Sem conexão de internet. Verifique sua rede.');
            process.exit(1);
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

/**
 * 🔧 Classe de gerenciamento de instalação automática
 * @class Configura ambiente automaticamente
 */
class AutoInstaller {
    static async setupEnvironment() {
        console.log('🔧 Iniciando configuração automática...\n');

        if (!this.checkNodeJS()) {
            console.error('❌ Node.js não encontrado!');
            console.log('📥 Baixe em: https://nodejs.org');
            process.exit(1);
        }

        await this.installDependencies();
        await this.installPlaywright();
        console.log('✅ Configuração automática concluída!\n');
    }

    static checkNodeJS() {
        try {
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            console.log(`✅ Node.js: ${nodeVersion}`);
            return true;
        } catch {
            return false;
        }
    }

    static async installDependencies() {
        if (!fs.existsSync('node_modules')) {
            console.log('📦 Instalando dependências...');
            try {
                execSync('npm install', { stdio: 'inherit' });
            } catch (error) {
                console.error('❌ Erro na instalação:', error.message);
                process.exit(1);
            }
        }
    }

    static async installPlaywright() {
        try {
            console.log('🖥️ Configurando Playwright...');
            execSync('npx playwright install chromium', { stdio: 'inherit' });
        } catch (error) {
            console.error('❌ Erro no Playwright:', error.message);
            process.exit(1);
        }
    }
}

/**
 * 🚀 Classe principal de arquivamento OTIMIZADA - MODO DIRETO
 * @class Sistema inteligente de arquivamento no Wayback Machine
 */
class SmartArchiveChecker {
    constructor() {
        this.dataDir = 'DADOS';
        this.connectionManager = new ConnectionManager();
        this.results = {
            metadata: {
                timestamp: new Date().toISOString(),
                summary: { total: 0, archived: 0, failed: 0, pending: 0 },
                status: "in_progress",
                connection: { type: 'Direct', vpnWarning: true }
            },
            results: { archived: [], failed: [] }
        };
        
        this.config = {
            browser: {
                headless: true,
                viewport: { width: 1280, height: 720 },
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-features=VizDisplayCompositor',
                    '--disable-background-timer-throttling',
                    '--disable-renderer-backgrounding'
                ]
            },
            wayback: {
                baseDelay: 10000,
                timeout: 60000,
                maxRetries: 2,
                maxAttemptsPerUrl: 4
            }
        };

        this.browser = null;
        this.currentId = 1;
        this.consecutiveFailures = 0;
        this.urlAttempts = new Map();
        this.detailedLogs = [];
        this.progressLog = {
            metadata: {
                timestamp: new Date().toISOString(),
                totalUrls: 0,
                processedUrls: 0
            },
            archives: {}
        };
        
        this.ensureDataDirectory();
    }

    ensureDataDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
            this.printMessage('📁', `Pasta ${this.dataDir} criada`);
        }
    }

    async initializeConnection() {
        console.log('🔗 CONFIGURANDO CONEXÃO...');
        await this.connectionManager.initializeConnection();
        this.results.metadata.connection.type = 'Direct';
        console.log('⚡ Conexão configurada - Delays otimizados');
    }

    async initBrowser() {
        try {
            const { chromium } = require('playwright');
            this.browser = await chromium.launch(this.config.browser);
            this.printSuccess('Navegador configurado com sucesso');
        } catch (error) {
            this.printError('Erro ao iniciar navegador:', error.message);
            throw error;
        }
    }

    async loadLinks(filename) {
        try {
            const data = await fs.promises.readFile(filename, 'utf8');
            const links = data.split('\n')
                .map(link => link.trim())
                .filter(link => link && this.validateUrl(link));

            this.results.metadata.summary.total = links.length;
            this.results.metadata.summary.pending = links.length;
            this.progressLog.metadata.totalUrls = links.length;

            links.forEach(url => {
                this.urlAttempts.set(url, {
                    wayback: 0,
                    lastAttempt: null,
                    success: false
                });
            });

            this.printSuccess(`${links.length} links válidos carregados`);
            return links;
        } catch (error) {
            throw new Error(`Erro ao carregar links: ${error.message}`);
        }
    }

    validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            this.printWarning(`URL inválida ignorada: ${url}`);
            return false;
        }
    }

    async getDynamicDelay() {
        return this.connectionManager.getDynamicDelay(this.config.wayback.baseDelay);
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async humanDelay(min = 3000, max = 8000) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        this.printMessage('⏳', `Aguardando ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Navegação segura para uma URL com tratamento de erros
     * @param {object} page - Instância da página Playwright
     * @param {string} url - URL para navegar
     * @param {object} options - Opções de navegação
     * @returns {object} Resultado da navegação
     */
    async safeGoto(page, url, options = {}) {
        try {
            const defaultOptions = {
                waitUntil: 'domcontentloaded',
                timeout: this.config.wayback.timeout,
                referer: 'https://www.google.com/'
            };

            const finalOptions = { ...defaultOptions, ...options };
            
            this.printMessage('🌐', `Navegando: ${url.substring(0, 80)}...`);
            const response = await page.goto(url, finalOptions);
            
            return { success: true, response };
        } catch (error) {
            if (error.message.includes('Timeout')) {
                this.printWarning('Timeout na navegação, continuando...');
                return { success: false, error: 'TIMEOUT' };
            }
            throw error;
        }
    }

    /**
     * Verifica se o limite do Wayback Machine foi atingido
     * @param {object} page - Instância da página Playwright
     * @param {string} url - URL sendo processada
     * @returns {boolean} True se o limite foi atingido
     */
    async checkWaybackLimit(page, url) {
        const attempts = this.urlAttempts.get(url);
        if (attempts.wayback >= this.config.wayback.maxAttemptsPerUrl) {
            this.printWarning(`Limite de ${this.config.wayback.maxAttemptsPerUrl} tentativas atingido`);
            return true;
        }

        try {
            const pageText = await page.textContent('body', { timeout: 5000 });
            const limitMessages = [
                'already captured',
                'daily limit',
                'limit we have set',
                'try again tomorrow',
                'exceeded',
                'captured 4 times today'
            ];

            for (const message of limitMessages) {
                if (pageText.toLowerCase().includes(message.toLowerCase())) {
                    this.printWarning('Limite detectado no Wayback Machine');
                    return true;
                }
            }

            return false;
        } catch (error) {
            this.printWarning('Erro ao verificar limite, continuando...');
            return false;
        }
    }

    /**
     * Extrai informações do snapshot do Wayback Machine
     * @param {object} page - Instância da página Playwright
     * @returns {string|null} URL do snapshot ou null
     */
    async extractWaybackSnapshotInfo(page) {
        try {
            await page.waitForTimeout(3000);

            const currentUrl = page.url();
            if (this.isValidSnapshotUrl(currentUrl)) {
                this.printSuccess(`URL atual é snapshot válido`);
                return currentUrl;
            }

            const successMessage = await page.evaluate(() => {
                const preElements = document.querySelectorAll('pre');
                for (let pre of preElements) {
                    if (pre.textContent.includes('Saving page') && 
                        pre.textContent.includes('Done!') && 
                        pre.textContent.includes('Visit page:')) {
                        return pre.textContent;
                    }
                }
                
                const divs = document.querySelectorAll('div');
                for (let div of divs) {
                    const text = div.textContent;
                    if (text.includes('Saving page') && text.includes('Done!')) {
                        return text;
                    }
                }
                return null;
            });

            if (successMessage) {
                const snapshotMatch = successMessage.match(/Visit page:\s*(\S+)/);
                if (snapshotMatch) {
                    let snapshotPath = snapshotMatch[1];
                    if (!snapshotPath.startsWith('http')) {
                        snapshotPath = `https://web.archive.org${snapshotPath}`;
                    }
                    this.printSuccess('Snapshot extraído da mensagem de sucesso');
                    return snapshotPath;
                }
            }

            const snapshotLink = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a[href*="/web/"]'));
                for (let link of links) {
                    const href = link.getAttribute('href');
                    if (href && href.includes('/web/') && href.match(/\/web\/\d{14}\//)) {
                        return href.startsWith('http') ? href : `https://web.archive.org${href}`;
                    }
                }
                return null;
            });

            if (snapshotLink) {
                this.printSuccess('Link de snapshot encontrado');
                return snapshotLink;
            }

            return null;
        } catch (error) {
            this.printWarning('Erro ao extrair informações do snapshot');
            return null;
        }
    }

    async checkIfArchived(url) {
        let retries = 0;
        
        while (retries < this.config.wayback.maxRetries) {
            const page = await this.browser.newPage();
            
            try {
                console.log(`🔍 [${retries + 1}/${this.config.wayback.maxRetries}] Verificando: ${this.truncateUrl(url)}`);
                
                const checkUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
                
                await page.goto(checkUrl, { 
                    waitUntil: 'domcontentloaded',
                    timeout: this.config.wayback.timeout 
                });

                const dynamicDelay = await this.getDynamicDelay();
                await this.delay(dynamicDelay);

                const content = await page.content();
                
                if (content.includes('archived_snapshots') && content.includes('available')) {
                    const snapshotMatch = content.match(/"url":"(https?:\/\/web\.archive\.org\/web\/\d+\/[^"]*)"/);
                    
                    if (snapshotMatch && snapshotMatch[1]) {
                        await page.close();
                        console.log(`✅ Já arquivada: ${this.truncateUrl(snapshotMatch[1])}`);
                        this.consecutiveFailures = 0;
                        return { archived: true, snapshotUrl: snapshotMatch[1] };
                    }
                }

                await page.close();
                
                if (retries === 0) {
                    const altResult = await this.alternativeCheck(url);
                    if (altResult.archived) return altResult;
                }

                return { archived: false };

            } catch (error) {
                await page.close().catch(() => {});
                
                if (retries < this.config.wayback.maxRetries - 1) {
                    retries++;
                    console.log(`🔄 Tentativa ${retries} falhou, retry em 5s...`);
                    await this.delay(5000);
                } else {
                    console.log(`❌ Falha na verificação após ${this.config.wayback.maxRetries} tentativas`);
                    return { 
                        archived: false, 
                        error: {
                            type: "check_error",
                            message: error.message,
                            code: "CHECK_ERROR"
                        }
                    };
                }
            }
        }
    }

    async alternativeCheck(url) {
        const page = await this.browser.newPage();
        
        try {
            const directUrl = `https://web.archive.org/web/${new Date().getFullYear()}0000000000*/${url}`;
            
            await page.goto(directUrl, { 
                waitUntil: 'domcontentloaded',
                timeout: 30000 
            });

            const dynamicDelay = await this.getDynamicDelay();
            await this.delay(dynamicDelay);

            const currentUrl = page.url();
            
            if (currentUrl.includes('/web/') && currentUrl.match(/\/web\/\d{14}\//)) {
                await page.close();
                return { archived: true, snapshotUrl: currentUrl };
            }

            await page.close();
            return { archived: false };
        } catch (error) {
            await page.close().catch(() => {});
            return { archived: false };
        }
    }

    /**
     * Arquiva uma URL usando Wayback Machine (método melhorado do script antigo)
     * @param {string} url - URL a ser arquivada
     * @param {number} retryCount - Contador de tentativas
     * @returns {object} Resultado do arquivamento
     */
    async tryArchiveUrl(url, retryCount = 0) {
        const attempts = this.urlAttempts.get(url);
        
        if (attempts.wayback >= this.config.wayback.maxAttemptsPerUrl) {
            return { 
                success: false, 
                error: {
                    type: "attempt_limit",
                    message: `Limite de ${this.config.wayback.maxAttemptsPerUrl} tentativas atingido`,
                    code: "ATTEMPT_LIMIT"
                }
            };
        }

        attempts.wayback++;
        attempts.lastAttempt = new Date();
        
        const page = await this.browser.newPage();
        const logEntry = {
            timestamp: new Date().toISOString(),
            service: 'wayback',
            url: url,
            attempt: attempts.wayback,
            details: {}
        };

        try {
            this.printSection('WAYBACK MACHINE', url);
            this.printMessage('📊', `Tentativa ${attempts.wayback}/${this.config.wayback.maxAttemptsPerUrl}`);

            await page.setViewportSize(this.config.browser.viewport);
            page.setDefaultTimeout(45000);
            page.setDefaultNavigationTimeout(45000);

            const saveUrl = `https://web.archive.org/save/${url}`;
            logEntry.details.initialUrl = saveUrl;

            const navigationResult = await this.safeGoto(page, saveUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 45000
            });

            if (!navigationResult.success && navigationResult.error === 'TIMEOUT') {
                this.printWarning('Continuando apesar do timeout...');
            }

            await this.humanDelay(4000, 7000);

            const currentUrl = page.url();
            logEntry.details.currentUrl = currentUrl;

            const isLimited = await this.checkWaybackLimit(page, url);
            if (isLimited) {
                logEntry.details.limitDetected = true;
                throw new Error('LIMITE_ATINGIDO');
            }

            let pageContent = '';
            try {
                pageContent = await page.textContent('body', { timeout: 10000 });
                logEntry.details.pageContentPreview = pageContent.substring(0, 500);
            } catch (error) {
                this.printWarning('Não foi possível obter conteúdo da página');
            }

            const snapshotUrl = await this.extractWaybackSnapshotInfo(page);
            
            if (snapshotUrl && this.isValidSnapshotUrl(snapshotUrl)) {
                this.printSuccess(`Arquivado: ${snapshotUrl}`);
                logEntry.details.archivedUrl = snapshotUrl;
                logEntry.success = true;
                attempts.success = true;
                
                this.updateProgressLog(url, snapshotUrl);
                await page.close();
                return { success: true, snapshotUrl: snapshotUrl };
            }

            if (this.isValidSnapshotUrl(currentUrl)) {
                this.printSuccess(`Redirecionado para snapshot: ${currentUrl}`);
                logEntry.details.archivedUrl = currentUrl;
                logEntry.success = true;
                attempts.success = true;
                
                this.updateProgressLog(url, currentUrl);
                await page.close();
                return { success: true, snapshotUrl: currentUrl };
            }

            const submitButton = await page.$('input[type="submit"], button[type="submit"]');
            if (submitButton) {
                this.printMessage('🔄', 'Tentando submeter formulário manualmente...');
                await submitButton.click();
                await this.humanDelay(5000, 8000);
                
                const newUrl = page.url();
                if (this.isValidSnapshotUrl(newUrl)) {
                    this.printSuccess(`Sucesso após submit manual: ${newUrl}`);
                    logEntry.details.archivedUrl = newUrl;
                    logEntry.success = true;
                    attempts.success = true;
                    
                    this.updateProgressLog(url, newUrl);
                    await page.close();
                    return { success: true, snapshotUrl: newUrl };
                }
            }

            throw new Error('Não foi possível confirmar o arquivamento');

        } catch (error) {
            await page.close();
            logEntry.success = false;
            logEntry.error = error.message;

            this.printError(`Erro: ${error.message}`);
            
            if (error.message === 'LIMITE_ATINGIDO') {
                return { 
                    success: false, 
                    error: {
                        type: "daily_limit",
                        message: "Limite de tentativas atingido",
                        code: "LIMIT_EXCEEDED"
                    },
                    limitReached: true 
                };
            }

            if (retryCount < this.config.wayback.maxRetries) {
                const retryDelay = 8000 + (retryCount * 2000);
                this.printMessage('🔄', `Retentativa ${retryCount + 1} em ${retryDelay/1000}s...`);
                await this.humanDelay(retryDelay, retryDelay + 2000);
                return this.tryArchiveUrl(url, retryCount + 1);
            }

            return { 
                success: false, 
                error: {
                    type: "archive_error",
                    message: error.message,
                    code: "ARCHIVE_ERROR"
                }
            };
        } finally {
            this.detailedLogs.push(logEntry);
            this.saveIncrementalReport();
        }
    }

    isLimitReached(pageText) {
        const limitMessages = [
            'already captured 4 times today',
            'daily limit we have set',
            'try again tomorrow',
            'limit exceeded',
            'capture limit'
        ];

        const text = pageText.toLowerCase();
        return limitMessages.some(message => text.includes(message));
    }

    isValidSnapshotUrl(url) {
        return url && 
               url.includes('web.archive.org/web/') && 
               url.match(/\/web\/\d{14}\//) &&
               !url.includes('/save/');
    }

    /**
     * Atualiza o log de progresso com nova URL arquivada
     * @param {string} originalUrl - URL original
     * @param {string} archivedUrl - URL arquivada
     */
    updateProgressLog(originalUrl, archivedUrl) {
        this.progressLog.archives[originalUrl] = {
            timestamp: new Date().toISOString(),
            archives: archivedUrl
        };
        this.progressLog.metadata.processedUrls = Object.keys(this.progressLog.archives).length;
        this.progressLog.metadata.timestamp = new Date().toISOString();
    }

    /**
     * Salva relatório incremental durante a execução
     */
    saveIncrementalReport() {
        const reportPath = path.join(this.dataDir, 'progress_log.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.progressLog, null, 2));
    }

    updateResults(url, result) {
        const resultEntry = {
            id: this.currentId.toString(),
            originalUrl: url,
            timestamp: new Date().toISOString(),
            title: this.extractTitleFromUrl(url),
            status: result.archived || result.success ? "success" : "failed",
            connection: {
                type: 'Direct',
                vpnWarning: true
            }
        };

        if (result.archived || result.success) {
            resultEntry.archiveUrl = result.snapshotUrl;
            this.results.results.archived.push(resultEntry);
            this.results.metadata.summary.archived++;
        } else {
            resultEntry.error = result.error || { 
                type: "unknown", 
                message: "Erro desconhecido",
                code: "UNKNOWN_ERROR" 
            };
            this.results.results.failed.push(resultEntry);
            this.results.metadata.summary.failed++;
        }

        this.results.metadata.summary.pending--;
        this.results.metadata.timestamp = new Date().toISOString();
        this.currentId++;

        this.saveResults();
    }

    extractTitleFromUrl(url) {
        try {
            const parsed = new URL(url);
            return parsed.hostname + parsed.pathname.substring(0, 30);
        } catch {
            return "Unknown";
        }
    }

    saveResults() {
        const resultsPath = path.join(this.dataDir, 'archive_results.json');
        fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    }

    async processUrls(links) {
        this.printHeader('INICIANDO ARQUIVAMENTO');
        
        await this.initializeConnection();
        await this.initBrowser();
        
        let limitReached = false;
        const startTime = Date.now();

        try {
            for (let i = 0; i < links.length; i++) {
                if (limitReached) break;

                const url = links[i];
                const attempts = this.urlAttempts.get(url);

                this.printProgress(i + 1, links.length, url, attempts.wayback);

                try {
                    const checkResult = await this.checkIfArchived(url);
                    
                    if (checkResult.archived) {
                        this.updateResults(url, checkResult);
                        this.updateProgressLog(url, checkResult.snapshotUrl);
                        this.printSuccess('URL já arquivada!');
                    } else {
                        const archiveResult = await this.tryArchiveUrl(url);
                        
                        if (archiveResult.success) {
                            this.updateResults(url, archiveResult);
                            this.printSuccess('Arquivado com sucesso!');
                        } else if (archiveResult.limitReached) {
                            this.updateResults(url, archiveResult);
                            this.printError('Limite diário atingido!');
                            limitReached = true;
                        } else {
                            this.updateResults(url, archiveResult);
                            this.printError(`Falha: ${archiveResult.error?.message}`);
                        }
                    }
                } catch (error) {
                    this.printError(`Erro ao processar URL: ${error.message}`);
                    this.updateResults(url, { 
                        success: false, 
                        error: {
                            type: "processing_error",
                            message: error.message,
                            code: "PROCESSING_ERROR"
                        }
                    });
                }

                this.showCurrentProgress(i + 1, links.length, this.results.metadata.summary.archived, startTime);

                if (!limitReached && i < links.length - 1) {
                    await this.humanDelay(7000, 10000);
                }
            }

            this.results.metadata.status = limitReached ? "limit_reached" : "completed";
            this.generateFinalReport();

        } catch (error) {
            this.results.metadata.status = "error";
            this.printError('Erro crítico:', error.message);
        } finally {
            if (this.browser) {
                await this.browser.close();
                this.printMessage('🖥️', 'Navegador fechado');
            }
            this.saveResults();
        }
    }

    generateFinalReport() {
        this.printHeader('RELATÓRIO FINAL');

        const totalUrls = this.results.metadata.summary.total;
        const archived = this.results.metadata.summary.archived;
        const successRate = (archived / totalUrls * 100).toFixed(1);

        console.log(`\n📊 ESTATÍSTICAS:`);
        console.log(`├── URLs processadas: ${totalUrls}`);
        console.log(`├── Sucessos Wayback: ${archived}`);
        console.log(`├── Falhas: ${this.results.metadata.summary.failed}`);
        console.log(`└── Taxa de sucesso: ${successRate}%`);

        this.saveFinalReport();
    }

    /**
     * Salva relatório final em arquivo
     */
    saveFinalReport() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(this.dataDir, `final_report_${timestamp}.json`);

        const report = {
            metadata: {
                generatedAt: new Date().toISOString(),
                totalUrls: this.results.metadata.summary.total,
                waybackSuccess: this.results.metadata.summary.archived,
                totalFailed: this.results.metadata.summary.failed,
                successRate: ((this.results.metadata.summary.archived / this.results.metadata.summary.total) * 100).toFixed(1) + '%'
            },
            archives: this.progressLog.archives
        };

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        this.printSuccess(`Relatório salvo: final_report_${timestamp}.json`);
        this.showSummary();
    }

    /**
     * Mostra resumo executivo final
     */
    showSummary() {
        const successfulUrls = Array.from(this.urlAttempts.entries())
            .filter(([_, attempts]) => attempts.success)
            .map(([url, _]) => url);

        console.log(`\n🎯 RESUMO EXECUTIVO:`);
        console.log(`├── URLs arquivadas: ${successfulUrls.length}`);
        console.log(`└── Taxa de sucesso: ${((successfulUrls.length / this.results.metadata.summary.total) * 100).toFixed(1)}%`);

        if (successfulUrls.length > 0) {
            console.log(`\n📋 Primeiras URLs arquivadas:`);
            successfulUrls.slice(0, 3).forEach(url => {
                const waybackUrl = this.progressLog.archives[url]?.archives;
                console.log(`   ▪ ${url}`);
                if (waybackUrl) console.log(`     🔵 ${waybackUrl}`);
            });
        }
    }

    truncateUrl(url, length = 50) {
        return url.length > length ? url.substring(0, length) + '...' : url;
    }

    // ===== MÉTODOS DE UI/UX MELHORADOS DO SCRIPT ANTIGO =====

    /**
     * Imprime mensagem formatada
     * @param {string} icon - Ícone/emoji
     * @param {string} message - Mensagem
     */
    printMessage(icon, message) {
        console.log(`${icon}  ${message}`);
    }

    /**
     * Imprime mensagem de sucesso
     * @param {string} message - Mensagem
     */
    printSuccess(message) {
        console.log(`✅  ${message}`);
    }

    /**
     * Imprime mensagem de erro
     * @param {string} message - Mensagem
     */
    printError(message) {
        console.log(`❌  ${message}`);
    }

    /**
     * Imprime mensagem de aviso
     * @param {string} message - Mensagem
     */
    printWarning(message) {
        console.log(`⚠️  ${message}`);
    }

    /**
     * Imprime cabeçalho formatado
     * @param {string} title - Título do cabeçalho
     */
    printHeader(title) {
        console.log('\n' + '='.repeat(60));
        console.log(`🎯 ${title}`);
        console.log('='.repeat(60));
    }

    /**
     * Imprime seção de processo
     * @param {string} service - Nome do serviço
     * @param {string} url - URL sendo processada
     */
    printSection(service, url) {
        console.log('\n' + '-'.repeat(50));
        console.log(`🔵 ${service}:`);
        console.log(`📝 ${url.substring(0, 80)}...`);
        console.log('-'.repeat(50));
    }

    /**
     * Imprime progresso atual
     * @param {number} current - Item atual
     * @param {number} total - Total de itens
     * @param {string} url - URL sendo processada
     * @param {number} attempts - Número de tentativas
     */
    printProgress(current, total, url, attempts) {
        console.log(`\n📊 [${current}/${total}] ${url}`);
        console.log(`🔄 Tentativas: ${attempts}/${this.config.wayback.maxAttemptsPerUrl}`);
    }

    /**
     * Mostra progresso atual da execução
     * @param {number} current - Item atual
     * @param {number} total - Total de itens
     * @param {number} successCount - Contador de sucessos
     * @param {number} startTime - Timestamp de início
     */
    showCurrentProgress(current, total, successCount, startTime) {
        const progress = ((current) / total * 100).toFixed(1);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const estimated = Math.floor((elapsed / current) * (total - current));

        console.log(`📈 Progresso: ${current}/${total} | ✅ ${successCount} | ❌ ${current - successCount} | ${progress}%`);
        console.log(`⏱️  Tempo: ${elapsed}s decorridos | ~${estimated}s restantes`);
    }
}

// VERIFICAÇÃO INICIAL
if (!fs.existsSync('links.txt')) {
    console.error('❌ Arquivo links.txt não encontrado!');
    console.log('\n📝 Crie o arquivo links.txt com uma URL por linha:');
    console.log('   https://exemplo.com');
    console.log('   https://site.com/pagina');
    console.log('\n💡 Dica: Salve o arquivo na mesma pasta do script.');
    process.exit(1);
}

/**
 * 🎨 Sistema de cores para console
 */
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

/**
 * 🚀 Função principal do sistema
 */
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
        console.log(ConsoleColors.apply(ConsoleColors.blue, '   ═══════════════════════════════════════════════\n'));

        console.log(ConsoleColors.apply(ConsoleColors.yellow, '💡 INFORMAÇÃO: O script continuará mesmo com erros individuais'));
        console.log(ConsoleColors.apply(ConsoleColors.yellow, '    e processará todas as URLs disponíveis.\n'));

        // Execução automática sem confirmação adicional
        console.log(ConsoleColors.apply(ConsoleColors.green, '🚀 INICIANDO ARQUIVAMENTO AUTOMATICAMENTE...\n'));
        
        await checker.processUrls(links);
        
    } catch (error) {
        console.error(ConsoleColors.apply(ConsoleColors.red, '❌ Erro fatal:'), error.message);
        process.exit(1);
    }
}

// EXECUÇÃO PRINCIPAL
if (require.main === module) {
    main().catch(error => {
        console.error(ConsoleColors.apply(ConsoleColors.red, '💥 Erro não tratado:'), error);
        process.exit(1);
    });
}

module.exports = { SmartArchiveChecker, AutoInstaller, ConnectionManager };