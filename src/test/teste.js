const FileController = require('../controller/FileController.js');
const CipherUtils = require('../utils/CipherUtils.js');
const KeyController = require('../controller/KeyController.js');
const EncryptedFileHandler = require('../utils/EncryptedFileHandler.js');

// Gerando a chave de criptografia a partir da senha
const key = CipherUtils.generateKey("senha_forte");
// FileController.create("arquivo_1", key);

// Lendo a chave armazenada
console.log(KeyController.read(key));

// Criando um arquivo criptografado
FileController.create("arquivo_2", key);

// Adicionando um novo token à KeyController
// KeyController.add(key, "Alou isso é um teste", key);

// Escrevendo no arquivo criptografado
FileController.write('arquivo_2', "Olá, sou o segundo arquivo importante,\nEstou testando para ver se funciona o meu arquivo criptografado\nSenha: 12345", key);

// Lendo o conteúdo criptografado do arquivo
console.log(FileController.read("arquivo_2", key));
