const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const ConnectionManager = require('./ConnectionManager');

class SmartArchiveChecker {
    constructor(config = {}) {
        const defaultConfig = {
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
            },
            directories: {
                data: 'DADOS',
                docs: 'DOCS'
            }
        };

        this.config = this.deepMerge(defaultConfig, config);
        
        this.dataDir = this.config.directories.data;
        this.docsDir = this.config.directories.docs;
        this.connectionManager = new ConnectionManager();
        
        this.results = {
            metadata: {
                timestamp: new Date().toISOString(),
                summary: { total: 0, archived: 0, failed: 0, pending: 0 },
                status: "no_data"
            },
            results: { archived: [], failed: [] }
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
    }

    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                result[key] = this.deepMerge(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    }

    ensureDataDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
            this.printMessage('📁', `Pasta ${this.dataDir} criada`);
        }
        if (!fs.existsSync(this.docsDir)) {
            fs.mkdirSync(this.docsDir, { recursive: true });
            this.printMessage('📁', `Pasta ${this.docsDir} criada`);
        }
    }

    cleanupRedundantFiles() {
        try {
            if (fs.existsSync(this.dataDir)) {
                const files = fs.readdirSync(this.dataDir);
                const jsonFiles = files.filter(file =>
                    file.endsWith('.json') &&
                    file !== 'archive_results.json' &&
                    (file.startsWith('final_report_') || file.startsWith('progress_log'))
                );

                jsonFiles.forEach(file => {
                    const filePath = path.join(this.dataDir, file);
                    fs.unlinkSync(filePath);
                    this.printMessage('🧹', `Arquivo redundante removido: ${file}`);
                });

                if (jsonFiles.length > 0) {
                    this.printSuccess(`${jsonFiles.length} arquivos redundantes removidos`);
                }
            }
        } catch (error) {
            this.printWarning(`Erro ao limpar arquivos redundantes: ${error.message}`);
        }
    }

    async initializeConnection() {
        console.log('🔗 CONFIGURANDO CONEXÃO...');
        await this.connectionManager.initializeConnection();
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
                await page.close().catch(() => { });

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
            await page.close().catch(() => { });
            return { archived: false };
        }
    }

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
                this.printMessage('🔄', `Retentativa ${retryCount + 1} em ${retryDelay / 1000}s...`);
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

    updateProgressLog(originalUrl, archivedUrl) {
        this.progressLog.archives[originalUrl] = {
            timestamp: new Date().toISOString(),
            archives: archivedUrl
        };
        this.progressLog.metadata.processedUrls = Object.keys(this.progressLog.archives).length;
        this.progressLog.metadata.timestamp = new Date().toISOString();
    }

    saveIncrementalReport() {
        this.saveResults();
    }

    updateResults(url, result) {
        const resultEntry = {
            id: this.currentId.toString(),
            originalUrl: url,
            timestamp: new Date().toISOString(),
            title: this.extractTitleFromUrl(url),
            status: result.archived || result.success ? "success" : "failed"
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
        // Criar pastas apenas quando for processar
        this.ensureDataDirectory();
        this.cleanupRedundantFiles();

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
            this.cleanupRedundantFiles();
        }

        return this.results;
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

        this.createTextReport();
        this.showSummary();
        this.openDocsFolder();
    }

    openDocsFolder() {
        try {
            const { execSync } = require('child_process');
            const docsPath = path.resolve(this.docsDir);
            if (fs.existsSync(docsPath)) {
                console.log(`\n📂 Abrindo pasta DOCS...`);
                execSync(`start "" "${docsPath}"`, { stdio: 'ignore' });
                this.printSuccess('Pasta DOCS aberta com sucesso!');
            } else {
                this.printWarning('Pasta DOCS não encontrada');
            }
        } catch (error) {
            this.printWarning(`Não foi possível abrir a pasta DOCS: ${error.message}`);
        }
    }

    createTextReport() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(this.docsDir, `relatorio_${timestamp}.txt`);

        if (!fs.existsSync(this.docsDir)) {
            fs.mkdirSync(this.docsDir, { recursive: true });
        }

        let reportContent = 'RELATÓRIO DE ARQUIVAMENTO - RAV ARCHIVE SAVE\n';
        reportContent += '='.repeat(60) + '\n';
        reportContent += `Data de geração: ${new Date().toLocaleString('pt-BR')}\n`;
        reportContent += `Total de URLs processadas: ${this.results.metadata.summary.total}\n`;
        reportContent += `URLs arquivadas com sucesso: ${this.results.metadata.summary.archived}\n`;
        reportContent += `Falhas: ${this.results.metadata.summary.failed}\n`;
        reportContent += `Taxa de sucesso: ${((this.results.metadata.summary.archived / this.results.metadata.summary.total) * 100).toFixed(1)}%\n\n`;
        reportContent += '-'.repeat(60) + '\n';
        reportContent += 'URLS ARQUIVADAS COM SUCESSO:\n';
        reportContent += '-'.repeat(60) + '\n\n';

        const successfulUrls = Array.from(this.urlAttempts.entries())
            .filter(([_, attempts]) => attempts.success)
            .map(([url, _]) => url);

        successfulUrls.forEach((url, index) => {
            const waybackUrl = this.progressLog.archives[url]?.archives;
            reportContent += `${index + 1}. ${url}\n`;
            reportContent += `🔗 ${waybackUrl || 'Link não disponível'}\n\n`;
        });

        if (this.results.metadata.summary.failed > 0) {
            reportContent += '-'.repeat(60) + '\n';
            reportContent += 'URLS COM FALHA NO ARQUIVAMENTO:\n';
            reportContent += '-'.repeat(60) + '\n\n';

            const failedUrls = Array.from(this.urlAttempts.entries())
                .filter(([_, attempts]) => !attempts.success)
                .map(([url, _]) => url);

            failedUrls.forEach((url, index) => {
                reportContent += `${index + 1}. ${url}\n`;
                reportContent += `❌ Falha no arquivamento\n\n`;
            });
        }

        reportContent += '-'.repeat(60) + '\n';
        reportContent += 'FIM DO RELATÓRIO\n';
        reportContent += '='.repeat(60);

        fs.writeFileSync(reportPath, reportContent, 'utf8');
        this.printSuccess(`Relatório em texto salvo: relatorio_${timestamp}.txt`);
    }

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

    /**
     * Método para obter estatísticas do processamento
     * @returns {Object} Estatísticas do arquivamento
     */
    getStatistics() {
        // Se não há resultados, retornar estatísticas vazias
        if (!this.results || !this.results.metadata || this.results.metadata.summary.total === 0) {
            return {
                summary: { total: 0, archived: 0, failed: 0, pending: 0 },
                status: "no_data",
                timestamp: new Date().toISOString(),
                successfulUrls: []
            };
        }

        return {
            summary: this.results.metadata.summary,
            status: this.results.metadata.status,
            timestamp: this.results.metadata.timestamp,
            successfulUrls: Array.from(this.urlAttempts.entries())
                .filter(([_, attempts]) => attempts.success)
                .map(([url, _]) => url)
        };
    }

    /**
     * Método para obter URLs arquivadas com sucesso
     * @returns {Array} Array de objetos com URLs originais e arquivadas
     */
    getArchivedUrls() {
        return this.results.results.archived.map(entry => ({
            originalUrl: entry.originalUrl,
            archiveUrl: entry.archiveUrl,
            timestamp: entry.timestamp
        }));
    }

    /**
     * Método para obter URLs que falharam
     * @returns {Array} Array de objetos com URLs e erros
     */
    getFailedUrls() {
        return this.results.results.failed.map(entry => ({
            originalUrl: entry.originalUrl,
            error: entry.error,
            timestamp: entry.timestamp
        }));
    }

    truncateUrl(url, length = 50) {
        return url.length > length ? url.substring(0, length) + '...' : url;
    }

    printMessage(icon, message) {
        console.log(`${icon}  ${message}`);
    }

    printSuccess(message) {
        console.log(`✅  ${message}`);
    }

    printError(message) {
        console.log(`❌  ${message}`);
    }

    printWarning(message) {
        console.log(`⚠️  ${message}`);
    }

    printHeader(title) {
        console.log('\n' + '='.repeat(60));
        console.log(`🎯 ${title}`);
        console.log('='.repeat(60));
    }

    printSection(service, url) {
        console.log('\n' + '-'.repeat(50));
        console.log(`🔵 ${service}:`);
        console.log(`📝 ${url.substring(0, 80)}...`);
        console.log('-'.repeat(50));
    }

    printProgress(current, total, url, attempts) {
        console.log(`\n📊 [${current}/${total}] ${url}`);
        console.log(`🔄 Tentativas: ${attempts}/${this.config.wayback.maxAttemptsPerUrl}`);
    }

    showCurrentProgress(current, total, successCount, startTime) {
        const progress = ((current) / total * 100).toFixed(1);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const estimated = Math.floor((elapsed / current) * (total - current));

        console.log(`📈 Progresso: ${current}/${total} | ✅ ${successCount} | ❌ ${current - successCount} | ${progress}%`);
        console.log(`⏱️  Tempo: ${elapsed}s decorridos | ~${estimated}s restantes`);
    }
}

module.exports = SmartArchiveChecker;