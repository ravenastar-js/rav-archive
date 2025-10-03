/**
 * 📊 Definições de tipos para o sistema Rav Archive
 * @module TypeDefinitions
 */

/**
 * 🎯 Resultado individual do arquivamento
 * @typedef {Object} ArchiveResult
 * @property {string} id - Identificador único
 * @property {string} originalUrl - URL original processada
 * @property {string} timestamp - Data/hora do processamento
 * @property {string} title - Título extraído da URL
 * @property {string} status - Status do processamento
 * @property {string} [archiveUrl] - URL do snapshot (apenas sucesso)
 * @property {Object} [error] - Detalhes do erro (apenas falha)
 */

/**
 * 📈 Estatísticas sumarizadas do arquivamento
 * @typedef {Object} ArchiveSummary
 * @property {number} total - Total de URLs processadas
 * @property {number} archived - URLs arquivadas com sucesso
 * @property {number} failed - URLs com falha no arquivamento
 * @property {number} pending - URLs pendentes de processamento
 */

/**
 * 📋 Metadados do processo de arquivamento
 * @typedef {Object} ArchiveMetadata
 * @property {string} timestamp - Data/hora do relatório
 * @property {ArchiveSummary} summary - Estatísticas consolidadas
 * @property {string} status - Status geral do processo
 */

/**
 * 📁 Estrutura completa de resultados
 * @typedef {Object} ArchiveResults
 * @property {ArchiveMetadata} metadata - Metadados do processamento
 * @property {Object} results - Resultados detalhados
 * @property {ArchiveResult[]} results.archived - URLs arquivadas com sucesso
 * @property {ArchiveResult[]} results.failed - URLs com falha no processamento
 */

/**
 * 🌐 Configurações do navegador Playwright
 * @typedef {Object} BrowserConfig
 * @property {boolean} headless - Modo headless
 * @property {Object} viewport - Dimensões da viewport
 * @property {string} userAgent - User Agent do navegador
 * @property {string[]} args - Argumentos de linha de comando
 */

/**
 * ⏰ Configurações do Wayback Machine
 * @typedef {Object} WaybackConfig
 * @property {number} baseDelay - Delay base entre requisições
 * @property {number} timeout - Timeout das requisições
 * @property {number} maxRetries - Máximo de tentativas por URL
 * @property {number} maxAttemptsPerUrl - Máximo de tentativas totais
 */

/**
 * 📁 Configurações de diretórios
 * @typedef {Object} DirectoriesConfig
 * @property {string} data - Diretório de dados
 * @property {string} docs - Diretório de documentos
 */

/**
 * ⚙️ Configuração completa do Rav Archive
 * @typedef {Object} RavArchiveConfig
 * @property {BrowserConfig} browser - Configurações do navegador
 * @property {WaybackConfig} wayback - Configurações do Wayback
 * @property {DirectoriesConfig} directories - Configurações de diretórios
 */

module.exports = {};