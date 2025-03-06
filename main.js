const { app, BrowserWindow, ipcMain } = require('electron');
const KeyController = require('./src/controller/KeyController.js');
const CipherUtils = require('./src/utils/CipherUtils.js');
const FileController = require('./src/controller/FileController.js');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Melhor prática de segurança
            contextIsolation: true, // Melhor segurança
            preload: __dirname + '/preload.js' // Preload para comunicação segura
        }
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');
});

ipcMain.handle('get-secretKey', async (event, password) => {
    return CipherUtils.generateKey(password);
})

// IPC listener para obter as chaves
ipcMain.handle('get-keys', async (event, secretKey) => {
    return KeyController.read(secretKey);
});

// IPC listener para abrir um arquivo
ipcMain.handle('get-file', async (event, secretKey, file) => {
    return FileController.read(file, secretKey);
});

// IPC listener para salvar um arquivo
ipcMain.handle('save-file', async (event, secretKey, file, text) => {
    FileController.write(file, text, secretKey);
    console.log("Salvou")
});
