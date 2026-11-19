# Mar de Leyendas: juego de One Piece (v0.9)

Juego de rol por turnos ambientado en One Piece. Es un proyecto personal para jugar con amigos. Se reparte como programa de Windows (Electron) que se actualiza solo; más adelante será app de móvil con la misma carpeta `slice/`. El arco jugable es Shells Town (Luffy, Coby, Zoro, Helmeppo, Morgan).

## Estructura
- `slice/index.html`: solo carga el CSS y los scripts en orden. No hace falta compilar nada: se abre con doble clic. Para probar con servidor, `.claude/launch.json` («juego») sirve `slice/` en el puerto 8765.
- `slice/css/estilos.css`: todos los estilos.
- `slice/js/`: scripts clásicos (`<script src>`, no módulos, para que funcione abriendo el archivo directamente). Todos comparten el ámbito global. **El orden de carga en `index.html` importa:**
  1. `nucleo/`:
     - `util.js`: escenario, `later`, azar y `hash`.
     - `registro.js`: tablas de contenido y funciones `defIsland`, `defIslet`, `defArc`, `defSideQuest`, `onSeaStep` y `REGLAS`.
  2. `datos/`: tablas sin lógica.
     - `personajes.js` (`CHARS`, `COMBO`, `NAMES`).
     - `enemigos.js` (`FOES`).
     - `objetos.js` (`ITEMS`, `EQUIP`, `RARES`, `UPG`).
     - `musica.js` (`SONGS`).
     - `sprites.js` (`ASSETS`).
     - `aspecto.js` (`SPR` provisionales y fondos `BGS`).
  3. `contenido/`: el mundo y la historia; cada archivo se apunta en el registro.
     - `mar.js`: tamaño, rocas, tormenta, corrientes, aguas profundas e islotes.
     - `islas/<id>.js`: una isla por archivo, con su mapa, lugares, vecinos, dibujo en el mar, escena de llegada y misiones secundarias.
     - `arco1_shells/`:
       - `arco.js`: pasos de la misión, reglas y eventos en el mar.
       - `historia.js`: escenas y combates de historia, y el inicio de partida (`startNew`).
  4. `motor/`: sistemas genéricos que solo leen el registro.
     - `sprites`, `texturas`, `audio`, `estado`, `mar_mundo`, `mapas`, `islas`, `mar`, `encuentros`, `lugares` (muelle y tienda), `escenas`, `menu`, `combate` y `titulo`.
  5. `main.js`: arranque.
- `slice/sprites/`: sprites PNG de los personajes, hechos por Rubén con ChatGPT. Cada personaje tiene `_reposo_1`, `_reposo_2`, `_ataque` y `_golpe`. También están el paseo de Luffy, su técnica, KO y victoria, y `barco_0..3`.
- `slice/fuentes/`: Baloo 2, Lilita One y Pirata One en woff2 (licencia OFL), para que funcione sin internet.
- `slice/js/motor/escritorio.js`: si existe `window.escritorio` (ejecutable), muestra sus avisos. En el navegador no hace nada.
- `escritorio/`: carcasa de Electron. `main.js` abre `slice/index.html` y busca actualizaciones; `preload.js` expone `window.escritorio = {version, onAviso}`; `icono.png`.
- `package.json`: versión del juego y comandos de npm. `dist/` (instaladores) y `node_modules/` no van a git.
- `tools/cut.py`: recorta y limpia hojas de sprites (quita el fondo blanco y separa los fotogramas).
- `tools/patch*.py`: parches históricos del HTML antiguo de un solo archivo. Solo sirven de referencia y ya no se pueden aplicar.

## Cómo añadir contenido
- **Isla nueva:**
  1. Copia `contenido/islas/puerto.js` y cambia los datos de `defIsland(id,{...})`:
     - `n`: nombre.
     - `bg`: fondo al hablar con los vecinos.
     - `sea`: `{cx,cy,r,seed,rocky?,art?}` con la posición, el tamaño y el dibujo en el mar.
     - `map`: filas de 20 caracteres; la leyenda está en `motor/islas.js` y la `m` es el muelle.
     - `poi`: `{letra:{n,ico,go,tile?}}`.
     - `npc`.
     - `arrive()` (opcional).
     - `pista()` (opcional): la marca con ✕ en la carta.
  2. Añade su `<script>` en `index.html`, dentro del bloque 3.
- **Arco nuevo:** crea la carpeta `contenido/arcoN_<nombre>/` con:
  - `arco.js`: `defArc` con los pasos y, si hace falta, `onSeaStep` y `REGLAS`.
  - `historia.js`: las escenas.

  Las escenas usan `scene({bg,place,left,right,lines,choices,next})`. Las opciones devuelven `{fight:[...],opt:{onWin,story,boss,bg}}`, `{then}` o `{choices}`.
- **Enemigo, objeto o tesoro:** se añade solo en `datos/`. Los rasgos especiales van como campos:
  - `rubber`: las balas rebotan.
  - `slash`: suena a corte.
  - `size`: tamaño del sprite.
  - `elite` o `boss`.
  - En `RARES`, `stat` y `oro`.
- **Marcas de historia:** van en `G.f.<nombre>`, que se guarda solo. No hace falta subir la versión de guardado por añadir marcas nuevas.

## Cómo funciona
- **Escenario:** 960x540 fijo, escalado a la pantalla con `fit()`. Solo horizontal.
- **Fuentes:**
  - Baloo 2 para el texto.
  - Lilita One para números y botones.
  - Pirata One solo para el título.
  - Estética de pergamino.
- **Mar (`SEA_ISL`, `buildWorld`, `drawSea`):**
  - 60x40 casillas de 48 px.
  - Islas orgánicas pintadas una sola vez en un lienzo y niebla suave.
  - Entidades visibles en `G.sea.ents`: barcos pirata y de la Marina que persiguen, un Rey Marino en aguas profundas y barriles. El encuentro salta al estar adyacente (`entStep` y `encounter`). Solo hay encuentros si `REGLAS.encuentrosMar()` lo permite.
- **Islas (`ISLANDS`):** mapas de casillas por los que se camina, con puntos de interés que abren escenas de novela visual (`scene()`).
- **Combate por turnos según la velocidad (objeto `B`, `act()`, `enemyAct`):** incluye estados, técnicas y el combo Luffy+Zoro. El combo y el vínculo siguen escritos para Luffy y Zoro dentro de `combate.js`.
- **Sonido (`AU`, `sfx()`, `playMusic()`):** todo sintetizado con Web Audio, sin archivos de audio.
- **Menú de pausa (`openMenu`, `MENU_ITEMS`):**
  - Se abre con Esc o M.
  - Misiones lee `ARCS` y `SIDE_QUESTS`.
- **Guardado:** en `localStorage` con la clave `mdl_save` y la versión `G.v=7`. Si cambia la estructura de la partida, hay que subir la versión y migrar en `loadSave()`. Las islas y los datos no se guardan; solo `G`.
- **Pruebas automáticas:** con `window.SIM=true`, `later()` pasa a ser síncrono y el audio se desactiva. Así se puede jugar el arco entero llamando a `startNew`, `poi`, `choose` y `act` desde la consola o con Playwright.

## Ejecutable y versiones
- `npm start`: abre el juego en una ventana de Electron para probar. Con `$env:MDL_AVISO_PRUEBA='1'` antes, enseña un aviso de actualización de prueba.
- `npm run construir`: genera `dist/Mar de Leyendas Setup X.Y.Z.exe` sin publicarlo. El instalador solo lleva `slice/`, `escritorio/` y `package.json`; `Sprites/`, `tools/` y `docs/` se quedan fuera.
- **Publicar una versión para los amigos:**
  1. Subir `version` en `package.json` (por ejemplo, de 0.9.0 a 0.9.1). Sin subirla, nadie recibe la actualización.
  2. Hacer commit.
  3. En PowerShell: `$env:GH_TOKEN='<token>'; npm run publicar`. Sube el instalador a GitHub Releases. El token no se guarda nunca en un archivo del proyecto.
- Al abrir el juego instalado, busca versiones nuevas en GitHub, las descarga por diferencias y las instala al cerrar. Sin internet no pasa nada.
- En `package.json`, `build.publish.owner` tiene que ser el usuario de GitHub de Rubén y `repo` el repositorio público.
- El ejecutable no está firmado: la primera vez Windows dice «Windows protegió su PC». Hay que pulsar «Más información» y luego «Ejecutar de todas formas».
- La partida del ejecutable va aparte de la del navegador (otro `localStorage`).

## Reglas del proyecto
- Los personajes oficiales solo se ven con los sprites de Rubén. Si falta uno, se pone una silueta provisional y no se dibuja el personaje a mano.
- **Combate:**
  - Luffy siempre en perfil cuando está quieto en las islas, con su animación de reposo.
  - Los bufos y debufos tienen que verse muy claros.
- Tono: mezcla de comedia y épica, como One Piece. Textos en español.
- Antes de rediseños grandes, preguntar a Rubén.
- El proyecto usa git. Hay que hacer commit antes de cada cambio grande.
