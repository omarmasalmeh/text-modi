const { contextBridge, ipcRenderer} = require('electron')

//darkmode
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

//openfile
contextBridge.exposeInMainWorld('electronAPI',{
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (content, filepath, button) => ipcRenderer.send('save-file', content, filepath, button),
})


