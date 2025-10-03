/**
 * 🎨 Classe para gerenciamento de cores no console
 * @class ConsoleColors
 */
class ConsoleColors {
    // 🎪 Códigos ANSI para cores do terminal
    static reset = '\x1b[0m';
    static bright = '\x1b[1m';
    static red = '\x1b[31m';
    static green = '\x1b[32m';
    static yellow = '\x1b[33m';
    static blue = '\x1b[34m';
    static magenta = '\x1b[35m';
    static cyan = '\x1b[36m';
    static white = '\x1b[37m';

    /**
     * 🖌️ Aplica cor ao texto e reseta ao final
     * @static
     * @param {string} color - Código ANSI da cor
     * @param {string} text - Texto a ser colorizado
     * @returns {string} Texto com cores aplicadas
     */
    static apply(color, text) {
        return `${color}${text}${this.reset}`;
    }
}

module.exports = ConsoleColors;