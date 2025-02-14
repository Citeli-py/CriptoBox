import fs from 'fs';
import EncryptedFileHandler from '../utils/EncryptedFileHandler.js';
import CipherUtils from '../utils/CipherUtils.js';

class KeyController {
    static keysPath = "./data/keys.cript";

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
}

export default KeyController;
