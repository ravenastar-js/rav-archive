/**
 * @typedef {Object} ArchiveResult
 * @property {string} id
 * @property {string} originalUrl
 * @property {string} timestamp
 * @property {string} title
 * @property {string} status
 * @property {string} [archiveUrl]
 * @property {Object} [error]
 */

/**
 * @typedef {Object} ArchiveSummary
 * @property {number} total
 * @property {number} archived
 * @property {number} failed
 * @property {number} pending
 */

/**
 * @typedef {Object} ArchiveMetadata
 * @property {string} timestamp
 * @property {ArchiveSummary} summary
 * @property {string} status
 */

/**
 * @typedef {Object} ArchiveResults
 * @property {ArchiveMetadata} metadata
 * @property {Object} results
 * @property {ArchiveResult[]} results.archived
 * @property {ArchiveResult[]} results.failed
 */

/**
 * @typedef {Object} BrowserConfig
 * @property {boolean} headless
 * @property {Object} viewport
 * @property {string} userAgent
 * @property {string[]} args
 */

/**
 * @typedef {Object} WaybackConfig
 * @property {number} baseDelay
 * @property {number} timeout
 * @property {number} maxRetries
 * @property {number} maxAttemptsPerUrl
 */

/**
 * @typedef {Object} DirectoriesConfig
 * @property {string} data
 * @property {string} docs
 */

/**
 * @typedef {Object} RavArchiveConfig
 * @property {BrowserConfig} browser
 * @property {WaybackConfig} wayback
 * @property {DirectoriesConfig} directories
 */

module.exports = {};