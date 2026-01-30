import { contextBridge, ipcRenderer } from 'electron'

/**
 * El preload script expone APIs seguras al renderer process
 * Nunca expongas todo el módulo ipcRenderer directamente
 */

// Exponer API segura a través de contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  // Información de la plataforma
  platform: process.platform,
  
  // Ejemplo: enviar mensaje al proceso principal
  sendMessage: (channel, data) => {
    // Lista blanca de canales permitidos
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  
  // Ejemplo: recibir mensajes del proceso principal
  onMessage: (channel, callback) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      // Remover listener anterior si existe
      ipcRenderer.removeAllListeners(channel)
      // Agregar nuevo listener
      ipcRenderer.on(channel, (event, ...args) => callback(...args))
    }
  },

  // API para abrir enlaces externos en el navegador
  openExternal: (url) => {
    ipcRenderer.send('open-external', url)
  },
})

console.log('Preload script ejecutado correctamente')