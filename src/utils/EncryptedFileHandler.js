const fs = require('fs');
const CipherUtils = require('./CipherUtils.js');

class EncryptedFileHandler {
    static write(filePath, data, key) {
        /** Escreve dados criptografados em um arquivo **/
        const encryptedData = CipherUtils.encrypt(data, key);
        fs.writeFileSync(filePath, encryptedData);
    }

    static read(filePath, key) {
        /** Lê e descriptografa dados de um arquivo **/
        if (!fs.existsSync(filePath)) {
            throw new Error(`O arquivo ${filePath} não existe.`);
        }

        const encryptedData = fs.readFileSync(filePath);
        return CipherUtils.decrypt(encryptedData, key);
    }
}

module.exports = EncryptedFileHandler;
