const { URL } = require('url');

class Validator {
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static validateUrls(urls) {
        const validUrls = [];
        const invalidUrls = [];

        urls.forEach(url => {
            if (this.isValidUrl(url)) {
                validUrls.push(url);
            } else {
                invalidUrls.push(url);
            }
        });

        return { validUrls, invalidUrls };
    }

    static validateFileExtension(filename, allowedExtensions = ['.txt']) {
        return allowedExtensions.some(ext => filename.endsWith(ext));
    }

    static sanitizeUrl(url) {
        return url.trim().replace(/\/+$/, '');
    }
}

module.exports = Validator;