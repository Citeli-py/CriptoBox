const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getKeys: (secretKey) => ipcRenderer.invoke('get-keys', secretKey)
});
