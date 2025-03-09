const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getSecretKey: (password)                    => ipcRenderer.invoke('get-secretKey', password),
    getKeys: (secretKey)                        => ipcRenderer.invoke('get-keys', secretKey),
    getFile: (secretKey, file)                  => ipcRenderer.invoke('get-file', secretKey, file),
    saveFile: (secretKey, file, text)           => ipcRenderer.invoke('save-file', secretKey, file, text),
    renameFile: (secretKey, file, new_name)     => ipcRenderer.invoke('rename-file', secretKey, file, new_name),
    deleteFile: (secretKey, file)               => ipcRenderer.invoke('delete-file', secretKey, file)
});
