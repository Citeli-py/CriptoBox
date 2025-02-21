const crypto =  require('crypto');

class CipherUtils {
    static encrypt(data, key) {
        const iv = crypto.randomBytes(12); // IV de 12 bytes recomendado para GCM
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        const tag = cipher.getAuthTag();
        return Buffer.concat([iv, tag, encrypted]); // Retorna IV + Tag + Dados criptografados
    }

    static decrypt(encryptedData, key) {
        const iv = encryptedData.slice(0, 12);
        const tag = encryptedData.slice(12, 28);
        const ciphertext = encryptedData.slice(28);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    }

    static generateKey(password) {
        const salt = Buffer.from('salt'); // Pode ser alterado para um valor seguro
        return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256'); // Retorna uma chave AES de 32 bytes
    }

    static gerarTokenAleatorio(bytes = 16) {
        return crypto.randomBytes(bytes).toString('hex');
    }
}

module.exports = CipherUtils;
