/* Puente entre la ventana de Electron y el juego. Lo único que ve el juego es window.escritorio. */
const {contextBridge, ipcRenderer} = require('electron');
const arg = process.argv.find(a => a.startsWith('--mdl-version='));
contextBridge.exposeInMainWorld('escritorio', {
  version: arg ? arg.split('=')[1] : '',
  onAviso: cb => ipcRenderer.on('aviso', (_e, texto) => cb(texto))
});
