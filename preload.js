const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getSecretKey: (password)                => ipcRenderer.invoke('get-secretKey', password),
    getKeys: (secretKey)                    => ipcRenderer.invoke('get-keys', secretKey),
    getFile: (secretKey, file)              => ipcRenderer.invoke('get-file', secretKey, file),
    saveFile: (secretKey, file, text)       => ipcRenderer.invoke('save-file', secretKey, file, text)
});


/**
Salvar
const info = JSON.stringify(quill.getContents().ops)
quill.setContents(info)
quill.setContents(JSON.parse(info))
 */