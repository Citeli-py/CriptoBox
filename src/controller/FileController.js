const fs = require('fs');
const path = require('path');
const KeyController = require('../controller/KeyController.js');
const CipherUtils = require('../utils/CipherUtils.js');
const EncryptedFileHandler = require('../utils/EncryptedFileHandler.js');

class FileController {
    static filesPath = "./data/files/";

    static create(name, secretKey) {
        const nameToken = CipherUtils.gerarTokenAleatorio();
        const shaKey = KeyController.add(secretKey, nameToken, name);

        // Criar diretório se não existir
        if (!fs.existsSync(FileController.filesPath)) {
            fs.mkdirSync(FileController.filesPath, { recursive: true });
        }

        fs.writeFileSync(
            path.join(FileController.filesPath, nameToken),
            CipherUtils.encrypt(Buffer.from(""), shaKey)
        );

        return nameToken;
    }

    static write(name, data, secretKey) {
        const fileInfo = KeyController.read(secretKey)[name];
        const aesKey = Buffer.from(fileInfo['aes_key'], 'hex');
        
        EncryptedFileHandler.write(
            path.join(FileController.filesPath, fileInfo['token']),
            Buffer.from(data),
            aesKey
        );
    }

    static read(name, secretKey) {
        const fileInfo = KeyController.read(secretKey)[name];
        if(!fileInfo) {
            throw new Error(`O arquivo ${name} não existe.`);
        }

        const aesKey = Buffer.from(fileInfo['aes_key'], 'hex');
        
        return EncryptedFileHandler.read(
            path.join(FileController.filesPath, fileInfo['token']),
            aesKey
        ).toString();
    }
}

module.exports = FileController;
