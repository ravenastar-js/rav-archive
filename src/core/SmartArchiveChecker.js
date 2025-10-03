const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const ConnectionManager = require('./ConnectionManager');
const { version } = require('../../package.json');

/**
 * 🧠 Núcleo inteligente de arquivamento com múltiplas estratégias
 * @class SmartArchiveChecker
 */
class SmartArchiveChecker {
    /**
     * 🏗️ Construtor do arquivador inteligente
     * @param {Object} config - Configurações personalizadas
     */
    constructor(config = {}) {
        // ⚙️ Configurações padrão do sistema
        const defaultConfig = {
            browser: {
                headless: true,
                viewport: { width: 1280, height: 720 },
                userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (RavArchive/${version})`,
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

        // 🔄 Mescla configurações
        this.config = this.deepMerge(defaultConfig, config);

        // 📁 Configuração de diretórios
        this.dataDir = this.config.directories.data;
        this.docsDir = this.config.directories.docs;
        this.connectionManager = new ConnectionManager();

        // 📊 Estrutura de resultados
        this.results = {
            metadata: {
                timestamp: new Date().toISOString(),
                summary: { total: 0, archived: 0, failed: 0, pending: 0 },
                status: "no_data"
            },
            results: { archived: [], failed: [] }
        };

        // 🖥️ Estado do navegador
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

    /**
     * 🔄 Mescla profunda de objetos
     * @param {Object} target - Objeto alvo
     * @param {Object} source - Objeto fonte
     * @returns {Object} Objeto mesclado
     */
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

    /**
     * 📁 Garante existência dos diretórios de dados
     */
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

    /**
     * 🧹 Remove arquivos redundantes
     */
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

    /**
     * 🌐 Inicializa e valida conexão
     * @async
     */
    async initializeConnection() {
        console.log('🔗 CONFIGURANDO CONEXÃO...');
        await this.connectionManager.initializeConnection();
        console.log('⚡ Conexão configurada - Delays otimizados');
    }

    /**
     * 🖥️ Inicializa navegador Playwright
     * @async
     * @throws {Error} Se falhar ao iniciar navegador
     */
    async initBrowser() {
        try {
            const { chromium } = require('playwright');

            let browserArgs = [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-renderer-backgrounding'
            ];

            if (this.config.browser.args && Array.isArray(this.config.browser.args)) {
                browserArgs = [...browserArgs, ...this.config.browser.args];
            }

            const browserConfig = {
                headless: this.config.browser.headless,
                viewport: this.config.browser.viewport,
                args: browserArgs
            };

            this.browser = await chromium.launch(browserConfig);
            this.printSuccess('Navegador configurado com sucesso');
        } catch (error) {
            this.printError('Erro ao iniciar navegador:', error.message);
            console.error('Detalhes do erro:', error);
            throw error;
        }
    }

    /**
     * 📄 Carrega links de arquivo
     * @param {string} filename - Caminho do arquivo
     * @returns {Promise<string[]>} Array de URLs válidas
     * @throws {Error} Se arquivo não existir ou for inválido
     */
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

    /**
     * 🔍 Valida formato de URL
     * @param {string} url - URL a ser validada
     * @returns {boolean} True se URL for válida
     */
    validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            this.printWarning(`URL inválida ignorada: ${url}`);
            return false;
        }
    }

    /**
     * ⏰ Obtém delay dinâmico
     * @returns {Promise<number>} Delay em milissegundos
     */
    async getDynamicDelay() {
        return this.connectionManager.getDynamicDelay(this.config.wayback.baseDelay);
    }

    /**
     * ⏳ Delay assíncrono
     * @param {number} ms - Milissegundos
     * @returns {Promise<void>}
     */
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * ⏰ Delay humanizado com randomização
     * @param {number} min - Mínimo em ms
     * @param {number} max - Máximo em ms
     * @returns {Promise<void>}
     */
    async humanDelay(min = 3000, max = 8000) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        this.printMessage('⏳', `Aguardando ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * 🌐 Navegação segura para URL
     * @param {Object} page - Página Playwright
     * @param {string} url - URL destino
     * @param {Object} options - Opções de navegação
     * @returns {Promise<Object>} Resultado da navegação
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
     * 🚫 Verifica limite do Wayback Machine
     * @param {Object} page - Página Playwright
     * @param {string} url - URL sendo processada
     * @returns {Promise<boolean>} True se limite atingido
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
     * 📸 Extrai informações do snapshot
     * @param {Object} page - Página Playwright
     * @returns {Promise<string|null>} URL do snapshot ou null
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

    /**
     * 🔍 Verifica se URL já está arquivada
     * @param {string} url - URL a verificar
     * @returns {Promise<Object>} Resultado da verificação
     */
    async checkIfArchived(url) {
        // 🖥️ Garantir que o navegador está inicializado
        if (!this.browser) {
            await this.initBrowser();
        }

        let retries = 0;

        while (retries < this.config.wayback.maxRetries) {
            const page = await this.browser.newPage();

            try {
                // 🌐 Configurar userAgent
                await page.setExtraHTTPHeaders({
                    'User-Agent': this.config.browser.userAgent
                });

                console.log(`🔍 [${retries + 1}/${this.config.wayback.maxRetries}] Verificando: ${this.truncateUrl(url)}`);

                // 📡 URL da API do Wayback Machine
                const checkUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;

                console.log(`📡 Consultando API: ${checkUrl}`);

                // 🔄 Fazer requisição para API
                const response = await page.goto(checkUrl, {
                    waitUntil: 'networkidle',
                    timeout: this.config.wayback.timeout
                });

                if (!response || !response.ok()) {
                    console.log(`❌ Resposta da API não OK: ${response?.status()}`);
                    throw new Error(`Falha na requisição: ${response?.status()}`);
                }

                // 📄 Obter conteúdo JSON da resposta
                const content = await page.textContent('pre, body');

                if (!content) {
                    throw new Error('Resposta vazia da API');
                }

                console.log(`📄 Resposta da API: ${content.substring(0, 200)}...`);

                // 🔍 Verificar se é JSON válido
                let jsonData;
                try {
                    jsonData = JSON.parse(content);
                } catch (parseError) {
                    console.log('❌ Não é JSON válido, tentando extrair texto...');
                    // 🔎 Tentar encontrar URLs de snapshot no HTML
                    const snapshotMatch = content.match(/https:\/\/web\.archive\.org\/web\/\d+\/[^"'\s]+/);
                    if (snapshotMatch) {
                        await page.close();
                        console.log(`✅ URL arquivada (encontrada via regex): ${snapshotMatch[0]}`);
                        return { archived: true, snapshotUrl: snapshotMatch[0] };
                    }
                    throw new Error('Resposta não é JSON válido');
                }

                // 📊 Verificar estrutura da API
                if (jsonData.archived_snapshots && jsonData.archived_snapshots.closest) {
                    const snapshot = jsonData.archived_snapshots.closest;
                    if (snapshot.available && snapshot.url) {
                        await page.close();
                        console.log(`✅ URL já arquivada: ${snapshot.url}`);
                        this.consecutiveFailures = 0;
                        return { archived: true, snapshotUrl: snapshot.url };
                    }
                }

                await page.close();

                // 🔄 Tentar método alternativo
                if (retries === 0) {
                    console.log('🔄 Tentando método alternativo...');
                    const altResult = await this.alternativeCheck(url);
                    if (altResult.archived) {
                        console.log('✅ URL arquivada (método alternativo)');
                        return altResult;
                    }
                }

                console.log('❌ URL não encontrada nos arquivos');
                return { archived: false };

            } catch (error) {
                await page.close().catch(() => { });

                console.log(`❌ Erro na verificação: ${error.message}`);

                if (retries < this.config.wayback.maxRetries - 1) {
                    retries++;
                    const retryDelay = 5000;
                    console.log(`🔄 Tentativa ${retries + 1} em ${retryDelay / 1000}s...`);
                    await this.delay(retryDelay);
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

        return { archived: false };
    }

    /**
     * 🔄 Método alternativo de verificação
     * @param {string} url - URL a verificar
     * @returns {Promise<Object>} Resultado da verificação
     */
    async alternativeCheck(url) {
        const page = await this.browser.newPage();

        try {
            await page.setExtraHTTPHeaders({
                'User-Agent': this.config.browser.userAgent
            });

            const directUrl = `https://web.archive.org/web/*/${url}`;
            console.log(`🔍 Método alternativo: ${directUrl}`);

            await page.goto(directUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            await this.delay(3000);

            const currentUrl = page.url();
            console.log(`📍 URL atual: ${currentUrl}`);

            if (currentUrl.includes('/web/') && currentUrl.match(/\/web\/\d{14}\//)) {
                await page.close();
                console.log(`✅ URL arquivada (redirecionamento): ${currentUrl}`);
                return { archived: true, snapshotUrl: currentUrl };
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
                await page.close();
                console.log(`✅ URL arquivada (link encontrado): ${snapshotLink}`);
                return { archived: true, snapshotUrl: snapshotLink };
            }

            await page.close();
            return { archived: false };

        } catch (error) {
            await page.close().catch(() => { });
            console.log(`❌ Erro no método alternativo: ${error.message}`);
            return { archived: false };
        }
    }

    /**
     * 💾 Tenta arquivar URL no Wayback Machine
     * @param {string} url - URL a arquivar
     * @param {number} retryCount - Contador de tentativas
     * @returns {Promise<Object>} Resultado do arquivamento
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

        try {
            await page.setExtraHTTPHeaders({
                'User-Agent': this.config.browser.userAgent
            });

            const logEntry = {
                timestamp: new Date().toISOString(),
                service: 'wayback',
                url: url,
                attempt: attempts.wayback,
                details: {}
            };

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

    /**
     * 🚫 Verifica se limite foi atingido
     * @param {string} pageText - Texto da página
     * @returns {boolean} True se limite atingido
     */
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

    /**
     * ✅ Valida URL de snapshot
     * @param {string} url - URL a validar
     * @returns {boolean} True se URL de snapshot válida
     */
    isValidSnapshotUrl(url) {
        return url &&
            url.includes('web.archive.org/web/') &&
            url.match(/\/web\/\d{14}\//) &&
            !url.includes('/save/');
    }

    /**
     * 📈 Atualiza log de progresso
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
     * 💾 Salva relatório incremental
     */
    saveIncrementalReport() {
        this.saveResults();
    }

    /**
     * 📊 Atualiza resultados do processamento
     * @param {string} url - URL processada
     * @param {Object} result - Resultado do processamento
     */
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

    /**
     * 🏷️ Extrai título da URL
     * @param {string} url - URL para extrair título
     * @returns {string} Título extraído
     */
    extractTitleFromUrl(url) {
        try {
            const parsed = new URL(url);
            return parsed.hostname + parsed.pathname.substring(0, 30);
        } catch {
            return "Unknown";
        }
    }

    /**
     * 💾 Salva resultados em arquivo
     */
    saveResults() {
        const resultsPath = path.join(this.dataDir, 'archive_results.json');
        fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    }

    /**
     * 🔄 Processa lista de URLs
     * @param {string[]} links - Array de URLs
     * @returns {Promise<Object>} Resultados do processamento
     */
    async processUrls(links) {
        // 📁 Criar pastas apenas quando for processar
        this.ensureDataDirectory();
        this.cleanupRedundantFiles();

        this.printHeader('INICIANDO ARQUIVAMENTO');

        await this.initializeConnection();
        await this.initBrowser();

        let limitReached = false;
        const startTime = Date.now();

        try {
            // 🔍 Verificar se há links para processar
            if (!links || links.length === 0) {
                this.printWarning('Nenhuma URL válida para processar');
                this.results.metadata.status = "completed";
                return this.results;
            }

            this.results.metadata.summary.total = links.length;
            this.results.metadata.summary.pending = links.length;
            this.progressLog.metadata.totalUrls = links.length;

            // 📝 Inicializar tentativas para cada URL
            links.forEach(url => {
                this.urlAttempts.set(url, {
                    wayback: 0,
                    lastAttempt: null,
                    success: false
                });
            });

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
            console.error('Detalhes do erro:', error);
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


    /**
     * 📋 Gera relatório final
     */
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

    /**
     * 📂 Abre pasta de documentos
     */
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

    /**
  * 📄 Cria relatório em texto
  */
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

        if (this.results.results.archived && this.results.results.archived.length > 0) {
            this.results.results.archived.forEach((entry, index) => {
                reportContent += `${index + 1}. ${entry.originalUrl}\n`;
                reportContent += `🔗 ${entry.archiveUrl || 'Link não disponível'}\n\n`;
            });
        } else {
            reportContent += 'Nenhuma URL arquivada com sucesso.\n\n';
        }

        if (this.results.metadata.summary.failed > 0) {
            reportContent += '-'.repeat(60) + '\n';
            reportContent += 'URLS COM FALHA NO ARQUIVAMENTO:\n';
            reportContent += '-'.repeat(60) + '\n\n';

            if (this.results.results.failed && this.results.results.failed.length > 0) {
                this.results.results.failed.forEach((entry, index) => {
                    reportContent += `${index + 1}. ${entry.originalUrl}\n`;
                    reportContent += `❌ ${entry.error?.message || 'Falha no arquivamento'}\n\n`;
                });
            }
        }

        reportContent += '-'.repeat(60) + '\n';
        reportContent += 'FIM DO RELATÓRIO\n';
        reportContent += '='.repeat(60);

        fs.writeFileSync(reportPath, reportContent, 'utf8');
        this.printSuccess(`Relatório em texto salvo: relatorio_${timestamp}.txt`);
    }

    /**
     * 🎯 Mostra resumo executivo
     */
    showSummary() {
        const successfulUrls = this.results.results.archived || [];

        console.log(`\n🎯 RESUMO EXECUTIVO:`);
        console.log(`├── URLs arquivadas: ${successfulUrls.length}`);
        console.log(`└── Taxa de sucesso: ${((successfulUrls.length / this.results.metadata.summary.total) * 100).toFixed(1)}%`);

        if (successfulUrls.length > 0) {
            console.log(`\n📋 Primeiras URLs arquivadas:`);
            successfulUrls.slice(0, 3).forEach(entry => {
                console.log(`   ▪ ${entry.originalUrl}`);
                if (entry.archiveUrl) console.log(`     🔵 ${entry.archiveUrl}`);
            });
        }
    }

    /**
     * 🎯 Mostra resumo executivo
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

    /**
  * 📊 Obtém estatísticas do processamento
  * @returns {Object} Estatísticas do arquivamento
  */
    getStatistics() {
        // 📭 Se não há resultados, retornar estatísticas vazias
        if (!this.results || !this.results.metadata || this.results.metadata.summary.total === 0) {
            return {
                summary: { total: 0, archived: 0, failed: 0, pending: 0 },
                status: "no_data",
                timestamp: new Date().toISOString(),
                successfulUrls: []
            };
        }

        const successfulUrls = (this.results.results.archived || []).map(entry => entry.originalUrl);

        return {
            summary: this.results.metadata.summary,
            status: this.results.metadata.status,
            timestamp: this.results.metadata.timestamp,
            successfulUrls: successfulUrls
        };
    }

    /**
     * 📋 Obtém URLs arquivadas com sucesso
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
     * ❌ Obtém URLs que falharam
     * @returns {Array} Array de objetos com URLs e erros
     */
    getFailedUrls() {
        return this.results.results.failed.map(entry => ({
            originalUrl: entry.originalUrl,
            error: entry.error,
            timestamp: entry.timestamp
        }));
    }

    /**
     * ✂️ Trunca URL para exibição
     * @param {string} url - URL original
     * @param {number} length - Comprimento máximo
     * @returns {string} URL truncada
     */
    truncateUrl(url, length = 50) {
        return url.length > length ? url.substring(0, length) + '...' : url;
    }

    /**
     * 💬 Imprime mensagem formatada
     * @param {string} icon - Ícone Unicode
     * @param {string} message - Mensagem
     */
    printMessage(icon, message) {
        console.log(`${icon}  ${message}`);
    }

    /**
     * ✅ Imprime mensagem de sucesso
     * @param {string} message - Mensagem
     */
    printSuccess(message) {
        console.log(`✅  ${message}`);
    }

    /**
     * ❌ Imprime mensagem de erro
     * @param {string} message - Mensagem
     */
    printError(message) {
        console.log(`❌  ${message}`);
    }

    /**
     * ⚠️ Imprime mensagem de aviso
     * @param {string} message - Mensagem
     */
    printWarning(message) {
        console.log(`⚠️  ${message}`);
    }

    /**
     * 🎪 Imprime cabeçalho
     * @param {string} title - Título do cabeçalho
     */
    printHeader(title) {
        console.log('\n' + '='.repeat(60));
        console.log(`🎯 ${title}`);
        console.log('='.repeat(60));
    }

    /**
     * 📑 Imprime seção
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
     * 📊 Imprime progresso atual
     * @param {number} current - Item atual
     * @param {number} total - Total de itens
     * @param {string} url - URL sendo processada
     * @param {number} attempts - Tentativas realizadas
     */
    printProgress(current, total, url, attempts) {
        console.log(`\n📊 [${current}/${total}] ${url}`);
        console.log(`🔄 Tentativas: ${attempts}/${this.config.wayback.maxAttemptsPerUrl}`);
    }

    /**
     * 📈 Mostra progresso atual com estatísticas
     * @param {number} current - Item atual
     * @param {number} total - Total de itens
     * @param {number} successCount - Sucessos até agora
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

module.exports = SmartArchiveChecker;