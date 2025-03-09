const fs = require('fs');
const path = require('path');
const KeyController = require('../controller/KeyController.js');
const CipherUtils = require('../utils/CipherUtils.js');
const EncryptedFileHandler = require('../utils/EncryptedFileHandler.js');

const File = require('../model/File.js');

class FileController {
    static filesPath = "./.criptoBox/files/";

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

    /**
     * Lê um arquivo criptografado
     * @param {string} name 
     * @param {Uint8Array} secretKey 
     * @returns {File} 
     */
    static read(name, secretKey) {
        const fileInfo = KeyController.read(secretKey)[name];
        if(!fileInfo) {
            throw new Error(`O arquivo ${name} não existe.`);
        }

        const aesKey = Buffer.from(fileInfo['aes_key'], 'hex');

        try {
            const text = EncryptedFileHandler.read(
                path.join(FileController.filesPath, fileInfo['token']),
                aesKey
            ).toString();

            return new File(name, text, fileInfo['token']);

        } catch (error) {
            KeyController.remove(secretKey, name);
            throw new Error("Não foi possivel ler o arquivo.");
        }
    }

    /**
     * Remove um arquivo
     * @param {Uint8Array} secretKey
     * @param {string} name
     */
    static remove(secretKey, name) {
        const fileInfo = KeyController.read(secretKey)[name];
        if(!fileInfo) {
            throw new Error(`O arquivo ${name} não existe.`);
        }

        fs.unlinkSync(path.join(FileController.filesPath, fileInfo['token']));
        KeyController.remove(secretKey, name);
    }
}

module.exports = FileController;
