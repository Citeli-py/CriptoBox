const { app, BrowserWindow, ipcMain } = require('electron');
const KeyController = require('./src/controller/KeyController.js');
const CipherUtils = require('./src/utils/CipherUtils.js');

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

// IPC listener para obter as chaves
ipcMain.handle('get-keys', async (event, secretKey) => {
    const key = CipherUtils.generateKey("senha_forte");
    return KeyController.read(key);
});
