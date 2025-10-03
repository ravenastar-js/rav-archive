const fs = require('fs');
const path = require('path');

/**
 * 📁 Gerenciador de operações de arquivo do sistema
 * @class FileManager
 */
class FileManager {
    /**
     * 📂 Garante que diretório existe
     * @static
     * @param {string} dirPath - Caminho do diretório
     * @returns {boolean} True se diretório foi criado
     */
    static ensureDirectory(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            return true;
        }
        return false;
    }

    /**
     * 📄 Lê URLs de arquivo de texto
     * @static
     * @param {string} filePath - Caminho do arquivo
     * @returns {string[]} Array de URLs válidas
     * @throws {Error} Se arquivo não existir ou for inválido
     */
    static readUrlsFromFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return data.split('\n')
                .map(url => url.trim())
                .filter(url => url && url.length > 0);
        } catch (error) {
            throw new Error(`Erro ao ler arquivo: ${error.message}`);
        }
    }

    /**
     * 💾 Escreve dados em arquivo JSON
     * @static
     * @param {string} filePath - Caminho do arquivo
     * @param {Object} data - Dados a serem escritos
     * @returns {boolean} True se escrita bem-sucedida
     * @throws {Error} Se falhar na escrita
     */
    static writeJsonFile(filePath, data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            throw new Error(`Erro ao escrever arquivo: ${error.message}`);
        }
    }

    /**
     * 📖 Lê dados de arquivo JSON
     * @static
     * @param {string} filePath - Caminho do arquivo
     * @returns {Object} Dados parseados do JSON
     * @throws {Error} Se arquivo não existir ou JSON inválido
     */
    static readJsonFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Erro ao ler arquivo JSON: ${error.message}`);
        }
    }

    /**
     * 🧹 Limpa arquivos por padrão regex
     * @static
     * @param {string} directory - Diretório a limpar
     * @param {RegExp} pattern - Padrão para seleção de arquivos
     * @returns {number} Quantidade de arquivos removidos
     */
    static cleanupFiles(directory, pattern) {
        try {
            if (!fs.existsSync(directory)) return 0;
            
            const files = fs.readdirSync(directory);
            const filesToDelete = files.filter(file => pattern.test(file));
            
            filesToDelete.forEach(file => {
                const filePath = path.join(directory, file);
                fs.unlinkSync(filePath);
            });
            
            return filesToDelete.length;
        } catch (error) {
            console.warn(`Aviso ao limpar arquivos: ${error.message}`);
            return 0;
        }
    }
}

module.exports = FileManager;