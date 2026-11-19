# Mar de Leyendas en PC: ejecutable con actualizaciones automáticas

## Para qué
Rubén quiere pasar el juego a sus amigos como un programa de Windows, no como una web. El contenido se irá añadiendo poco a poco, así que cada versión nueva tiene que llegarles sola, sin volver a mandar el juego entero. Más adelante habrá app de móvil desde la misma base.

## Objetivos
- Un instalador para Windows (`Mar de Leyendas Setup x.y.z.exe`). Se instala con dos clics y crea un acceso directo.
- Al abrir el juego, comprueba si hay versión nueva, la descarga en segundo plano (solo lo que cambió) y la instala al cerrar.
- Publicar una versión nueva se hace con un solo comando (`npm run publicar`).
- La partida guardada sobrevive a las actualizaciones.
- El juego funciona sin internet, incluidas las fuentes.

## Fuera de alcance
- La app de móvil (vendrá después, con Capacitor, leyendo la misma carpeta `slice/`).
- Mac y Linux.
- Firmar el ejecutable. Windows mostrará «Windows protegió su PC» la primera vez: hay que pulsar «Más información» y luego «Ejecutar de todas formas».

## No puede pasar
- Que haya dos copias del juego que mantener. `slice/` sigue siendo la única copia.
- Que deje de funcionar abrir `slice/index.html` con doble clic para probar.
- Que una actualización borre la partida.

## Enfoques considerados
- **Electron con electron-updater (elegido).** Funciona con lo que ya hay instalado (Node). El instalador pesa unos 100 MB, pero las actualizaciones solo bajan los bloques que cambian, normalmente pocos MB.
- **Tauri.** Instalador de unos 5 MB, pero obliga a instalar Rust y las herramientas de Visual Studio (unos 5 GB) y es más fácil que algo falle. Como las actualizaciones automáticas ya hacen pequeñas las versiones nuevas, su ventaja de tamaño solo se nota en la primera descarga.
- **`.exe` portátil sin actualizaciones.** Es lo más simple, pero obliga a mandar 100 MB por cada isla nueva, y algún amigo acabaría jugando una versión vieja.

## Diseño
- **Estructura:**
  - `package.json` en la raíz: versión del juego, dependencias (`electron`, `electron-builder`, `electron-updater`) y scripts:
    - `npm start`: abre el juego en una ventana para probar.
    - `npm run construir`: genera el instalador en `dist/` sin publicarlo.
    - `npm run publicar`: genera y sube la versión a GitHub Releases.
  - `escritorio/main.js`: ventana de Electron que carga `slice/index.html`.
    - 16:9 y redimensionable, con `fit()` escalando como ahora.
    - Sin barra de menú.
    - F11 para pantalla completa.
    - Comprobación de actualizaciones al arrancar.
  - `escritorio/icono.png`: icono del programa, sacado de los sprites de Rubén (`barco_0.png`, provisional).
  - `.gitignore`: `node_modules/` y `dist/`.
- **Instalador:**
  - NSIS de electron-builder, en un clic, sin pedir permisos de administrador (se instala en la carpeta del usuario).
  - Incluye `slice/` y `escritorio/`.
  - Deja fuera `Sprites/`, `tools/` y `docs/`.
- **Fuentes locales:**
  - Los archivos `.woff2` de Baloo 2, Lilita One y Pirata One (licencia libre OFL) se guardan en `slice/fuentes/`.
  - Se declaran con `@font-face` en `estilos.css`.
  - Se quitan los enlaces a Google Fonts de `index.html`.
- **Actualizaciones:**
  - El repositorio público de GitHub de Rubén aloja las versiones (Releases).
  - Cuando hay versión nueva, el juego muestra un aviso discreto en pergamino: «Nueva versión descargada: se instalará al cerrar el juego».
  - Sin internet, el juego arranca igual y no dice nada.
- **Guardado:**
  - `localStorage` dentro de Electron se guarda en la carpeta de datos del programa, que no se toca al actualizar.
  - La clave `mdl_save` y `G.v` no cambian.
  - Una partida empezada en el navegador no pasa sola al ejecutable, porque es otro almacén.
- **Cómo publicar** (se apunta en `CLAUDE.md`):
  1. Subir la versión en `package.json`.
  2. Hacer commit.
  3. Ejecutar `npm run publicar` con el token de GitHub en la variable `GH_TOKEN`.

## Lo que necesita Rubén
- Crear una cuenta de GitHub y un repositorio público, por ejemplo `mar-de-leyendas`. Esto tiene que hacerlo él.
- Generar un token de acceso para publicar. Se le guiará paso a paso, y el token no se escribe en ningún archivo del proyecto.

## Decisiones del constructor
- Detalles de la ventana: tamaño inicial y título.
- Texto exacto del aviso de actualización.
