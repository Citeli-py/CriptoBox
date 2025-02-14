import FileController from './controller/FileController.js';
import CipherUtils from './utils/CipherUtils.js';
import KeyController from './controller/KeyController.js';
import EncryptedFileHandler from './utils/EncryptedFileHandler.js';

// Gerando a chave de criptografia a partir da senha
const key = CipherUtils.generateKey("senha_fort");
// FileController.create("arquivo_1", key);

// Lendo a chave armazenada
console.log(KeyController.read(key));

// Criando um arquivo criptografado
// FileController.create("arquivo_1", key);

// Adicionando um novo token à KeyController
// KeyController.add(key, "Alou isso é um teste", key);

// Escrevendo no arquivo criptografado
// FileController.write('arquivo_1', "Olá, sou um arquivo importante,\nEstou testando para ver se funciona o meu arquivo criptografado\nSenha: 12345", key);

// Lendo o conteúdo criptografado do arquivo
console.log(FileController.read("arquivo_1", key));
