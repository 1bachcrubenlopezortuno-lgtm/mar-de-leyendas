# Ejecutable de PC: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Empaquetar `slice/` como un instalador de Windows que se actualiza solo desde GitHub Releases.

**Architecture:** Electron carga `slice/index.html` tal cual. Un preload expone `window.escritorio` para que el juego muestre el aviso de actualización. electron-builder genera un instalador NSIS y electron-updater descarga las versiones nuevas por diferencias.

**Tech Stack:** Electron, electron-builder (NSIS) y electron-updater. Node 22 ya está instalado.

**Spec:** `docs/superpowers/specs/2026-11-19-ejecutable-pc-design.md`

## Global Constraints
- La única copia del juego es `slice/`. Abrir `slice/index.html` con doble clic sigue funcionando.
- La clave de guardado es `mdl_save` y `G.v` no cambia.
- Todos los textos visibles van en español.
- Sin internet, el juego arranca normal y sin errores.
- El token de GitHub nunca se escribe en un archivo del proyecto. Solo vive en la variable de entorno `GH_TOKEN`.
- El instalador NSIS es de un clic y se instala por usuario, sin permisos de administrador.

## Review Focus
- **Sin internet:** la comprobación de actualizaciones falla en silencio. Lo cubre el paso 3 de la tarea 2.
- **Repositorio sin publicar todavía:** el 404 de GitHub no rompe el arranque. Lo cubre el paso 3 de la tarea 2.
- **Partida guardada:** debe seguir ahí al cerrar y volver a abrir la app. Lo cubre el paso 4 de la tarea 2.
- **Navegador:** sin `window.escritorio`, el aviso no hace nada. Lo cubre el paso 5 de la tarea 2.
- **Fuentes sin internet:** el título usa Pirata One y no la letra por defecto. Lo cubre el paso 3 de la tarea 1.

---

### Task 1: Fuentes locales

**Files:**
- Create: `slice/fuentes/*.woff2`.
- Modify: `slice/css/estilos.css`. Añadir `@font-face` al principio.
- Modify: `slice/index.html`. Quitar los dos `<link>` a Google Fonts.

- [ ] **Paso 1:** Descargar los woff2 de subconjunto latino que sirve Google Fonts para el CSS actual:
  - Pirata One 400.
  - Lilita One 400.
  - Baloo 2 en los pesos 500, 600 y 700. Puede ser un único archivo variable si Google lo da así.
- [ ] **Paso 2:** Declarar cada familia con `@font-face{font-family:'…';src:url(../fuentes/…woff2) format('woff2');font-weight:…;font-display:block}`.
- [ ] **Paso 3:** Comprobarlo en el navegador integrado. `document.fonts.check('20px "Pirata One"')` y el equivalente para las otras dos deben devolver `true`, y en la red no debe aparecer ninguna petición a `fonts.g*`.
- [ ] **Paso 4:** Commit: «Fuentes del juego dentro del proyecto».

### Task 2: Carcasa de Electron con actualizaciones

**Files:**
- Create: `package.json`.
- Create: `escritorio/main.js`.
- Create: `escritorio/preload.js`.
- Create: `escritorio/icono.png`, copia de `slice/sprites/barco_0.png` escalada a 256×256 o más.
- Create: `.gitignore`.
- Create: `slice/js/motor/escritorio.js`, que se carga en `index.html` justo antes de `main.js`.

**Interfaces:**
- El preload expone `window.escritorio = {version:string, onAviso(cb:(texto:string)=>void)}`.
- `motor/escritorio.js`:
  - Si existe `window.escritorio`, se suscribe con `onAviso`.
  - Con cada aviso, muestra en `#stage` durante 8 s una nota en pergamino abajo a la derecha (clase `.aviso-act` en `estilos.css`).
  - Si no existe `window.escritorio`, no hace nada.

- [ ] **Paso 1:** Crear `package.json`:
  - `name: "mar-de-leyendas"`, `productName: "Mar de Leyendas"`, `version: "0.9.0"`, `main: "escritorio/main.js"`.
  - Scripts:
    - `start`: `electron .`.
    - `construir`: `electron-builder --win`.
    - `publicar`: `electron-builder --win --publish always`.
  - Bloque `build`:
    - `appId: "es.ruben.mardeleyendas"`.
    - `files: ["slice/**","escritorio/**","package.json"]`.
    - `win.target: nsis`.
    - `nsis: {oneClick:true, perMachine:false}`.
    - `icon: "escritorio/icono.png"`.
    - `publish: {provider:"github", owner:"<USUARIO>", repo:"mar-de-leyendas"}`. Rubén rellenará el `owner` cuando tenga su cuenta.
  - Ejecutar `npm i -D electron electron-builder` y `npm i electron-updater`.
- [ ] **Paso 2:** Escribir `main.js`:
  - `BrowserWindow` de 1280×720 con `useContentSize`, `autoHideMenuBar`, título «Mar de Leyendas», `contextIsolation:true` y `preload`.
  - Cargar `slice/index.html`.
  - F11 activa y desactiva la pantalla completa.
  - Si `app.isPackaged`:
    - Llamar a `autoUpdater.checkForUpdates()` dentro de `try/catch`, con `.catch(()=>{})`.
    - Al recibir `update-downloaded`, enviar el aviso «Nueva versión descargada: se instalará al cerrar el juego.» y dejar `autoInstallOnAppQuit` a true.
- [ ] **Paso 3:** Comprobar el arranque.
  - Ejecutar `npm start`: el juego abre y llega al título sin errores en la consola.
  - Ejecutar `npm run construir`, instalar `dist/*Setup*.exe` y abrirlo sin repositorio publicado. Debe arrancar sin diálogos de error.
- [ ] **Paso 4:** Con la app instalada, empezar una partida, guardar, cerrar y abrir. La partida tiene que seguir.
- [ ] **Paso 5:** Comprobar el aviso.
  - En `npm start`, enviar un aviso de prueba con `win.webContents.send` y verificar que la nota sale y desaparece.
  - En el navegador, `slice/index.html` no da errores.
- [ ] **Paso 6:** Commit: «Ejecutable de Windows con Electron y actualizaciones automáticas».

### Task 3: Documentación

**Files:**
- Modify: `CLAUDE.md`. Añadir una sección «Ejecutable y versiones» con:
  - `npm start` y `npm run construir`.
  - Cómo publicar: subir `version`, hacer commit y `$env:GH_TOKEN='…'; npm run publicar`.
  - El aviso de SmartScreen.
  - Que `Sprites/`, `tools/` y `docs/` no entran en el instalador.

- [ ] **Paso 1:** Escribir la sección.
- [ ] **Paso 2:** Commit: «CLAUDE.md: cómo construir y publicar».
