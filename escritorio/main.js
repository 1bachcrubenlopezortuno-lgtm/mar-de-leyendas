/* =========================================================================
   MAR DE LEYENDAS · versión de escritorio (Electron)
   Abre slice/index.html en una ventana y busca actualizaciones en GitHub.
   El juego en sí no sabe nada de esto: solo ve window.escritorio (preload.js).
   ========================================================================= */
const {app, BrowserWindow} = require('electron');
const path = require('path');

let win = null;

function crearVentana(){
  win = new BrowserWindow({
    width: 1280, height: 720, useContentSize: true,
    minWidth: 640, minHeight: 360,
    title: 'Mar de Leyendas',
    backgroundColor: '#0d0906',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icono.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: ['--mdl-version=' + app.getVersion()],
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.setMenu(null);
  win.loadFile(path.join(__dirname, '..', 'slice', 'index.html'));
  // F11: pantalla completa
  win.webContents.on('before-input-event', (e, input) => {
    if(input.type === 'keyDown' && input.key === 'F11'){
      win.setFullScreen(!win.isFullScreen());
      e.preventDefault();
    }
  });
  win.on('closed', () => { win = null; });
}

function aviso(texto){
  if(win && !win.isDestroyed()) win.webContents.send('aviso', texto);
}

/* Actualizaciones: solo en la versión instalada. Sin internet o sin versiones
   publicadas, falla en silencio y el juego sigue normal. */
function buscarActualizaciones(){
  if(!app.isPackaged) return;
  try{
    const {autoUpdater} = require('electron-updater');
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.on('error', () => {});
    autoUpdater.on('update-downloaded', info => {
      aviso('¡Nueva versión ' + info.version + ' descargada! Se instalará al cerrar el juego.');
    });
    autoUpdater.checkForUpdates().catch(() => {});
  }catch(e){ /* sin actualizaciones, sin drama */ }
}

// Una sola ventana del juego a la vez
if(!app.requestSingleInstanceLock()){
  app.quit();
}else{
  app.on('second-instance', () => {
    if(win){ if(win.isMinimized()) win.restore(); win.focus(); }
  });
  app.whenReady().then(() => {
    crearVentana();
    win.webContents.once('did-finish-load', () => {
      buscarActualizaciones();
      // Para probar el aviso sin publicar nada:  $env:MDL_AVISO_PRUEBA='1'; npm start
      if(process.env.MDL_AVISO_PRUEBA) aviso('Aviso de prueba: así se verá una actualización.');
    });
  });
  app.on('window-all-closed', () => app.quit());
}
