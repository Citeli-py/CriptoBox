import fs from 'fs';
import path from 'path';
import KeyController from '../controller/KeyController.js';
import CipherUtils from '../utils/CipherUtils.js';
import EncryptedFileHandler from '../utils/EncryptedFileHandler.js';

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

export default FileController;
