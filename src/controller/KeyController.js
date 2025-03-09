const fs = require('fs');
const EncryptedFileHandler = require('../utils/EncryptedFileHandler.js');
const CipherUtils = require('../utils/CipherUtils.js');

class KeyController {
    static keysPath = "./.criptoBox/keys.cript";

    /**
     * Adiciona uma chave AES para um arquivo
     * @param {Uint8Array} secretKey - Chave secreta AES
     * @param {string} nameToken - Token do arquivo
     * @param {string} name - Nome do arquivo 
     * @returns {Buffer} - Chave AES gerada
     */
    static add(secretKey, nameToken, name) {
        const aesKey = CipherUtils.generateKey(CipherUtils.gerarTokenAleatorio());
        const data = {
            aes_key: aesKey.toString('hex'), // Convertendo para HEX
            token: nameToken
        };

        const keysJson = KeyController.read(secretKey);
        keysJson[name] = data;
        EncryptedFileHandler.write(KeyController.keysPath, Buffer.from(JSON.stringify(keysJson)), secretKey);

        return aesKey;
    }

    /**
     * Lê o arquivo de chaves
     * @param {Uint8Array} secretKey - Chave secreta AES
     * @returns {Object} - Objeto JSON com as chaves
     */
    static read(secretKey) {
        // 🔹 Verifica se existe a pasta data
        if (!fs.existsSync("./data")) {
            fs.mkdirSync("./data");
        }

        // 🔹 Se o arquivo não existir, cria um arquivo vazio criptografado
        if (!fs.existsSync(KeyController.keysPath)) {
            console.warn("🔸 Arquivo keys.cript não encontrado. Criando um novo...");
            EncryptedFileHandler.write(KeyController.keysPath, Buffer.from(JSON.stringify({})), secretKey);
        }

        try {
            return JSON.parse(EncryptedFileHandler.read(KeyController.keysPath, secretKey).toString());
        } catch (error) {
            console.error("Erro ao ler o arquivo de chaves:", error.message);
            return {};
        }
    }

    /**
     * Remove um arquivo do arquivo de chaves
     * @param {Uint8Array} secretKey - Chave secreta AES
     * @param {string} name - Nome do arquivo
     * @returns {Object} - Objeto com as informações do arquivo
     */
    static remove(secretKey, name) {
        const keysJson = KeyController.read(secretKey);
        delete keysJson[name];
        EncryptedFileHandler.write(KeyController.keysPath, Buffer.from(JSON.stringify(keysJson)), secretKey);
    }
}

module.exports = KeyController;
