import fs from 'fs';
import CipherUtils from './CipherUtils.js';

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

export default EncryptedFileHandler;
