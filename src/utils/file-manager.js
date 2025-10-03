const fs = require('fs');
const path = require('path');

class FileManager {
    static ensureDirectory(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            return true;
        }
        return false;
    }

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

    static writeJsonFile(filePath, data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            throw new Error(`Erro ao escrever arquivo: ${error.message}`);
        }
    }

    static readJsonFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Erro ao ler arquivo JSON: ${error.message}`);
        }
    }

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