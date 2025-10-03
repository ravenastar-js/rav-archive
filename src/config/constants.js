module.exports = {
    WAYBACK_BASE_URL: 'https://web.archive.org',
    WAYBACK_SAVE_URL: 'https://web.archive.org/save/',
    WAYBACK_AVAILABLE_URL: 'https://archive.org/wayback/available',
    
    ERROR_TYPES: {
        CHECK_ERROR: 'check_error',
        ARCHIVE_ERROR: 'archive_error',
        LIMIT_EXCEEDED: 'limit_exceeded',
        ATTEMPT_LIMIT: 'attempt_limit',
        PROCESSING_ERROR: 'processing_error',
        UNKNOWN_ERROR: 'unknown_error'
    },
    
    STATUS: {
        NO_DATA: 'no_data',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed',
        LIMIT_REACHED: 'limit_reached',
        ERROR: 'error'
    },
    
    MESSAGES: {
        NO_DATA: 'Nenhum dado de arquivamento encontrado.',
        EXECUTE_FIRST: 'Execute primeiro: rav-archive file links.txt',
        URL_INVALID: 'URL inválida ignorada:',
        LIMIT_DETECTED: 'Limite detectado no Wayback Machine'
    }
};