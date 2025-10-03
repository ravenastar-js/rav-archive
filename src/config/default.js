module.exports = {
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
    },
    limits: {
        maxUrlsPerBatch: 100,
        maxConcurrent: 1
    }
};