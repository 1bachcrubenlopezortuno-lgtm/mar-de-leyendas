# Mar de Leyendas: juego de One Piece (v0.9)

Juego de rol por turnos ambientado en One Piece. Es un proyecto personal para jugar con amigos. Primero es web y más adelante será app de móvil. El arco jugable es Shells Town (Luffy, Coby, Zoro, Helmeppo, Morgan).

## Estructura
- `slice/index.html`: el juego entero en un solo archivo HTML+JS. No necesita compilar nada; basta con abrirlo en el navegador.
- `slice/sprites/`: sprites PNG de los personajes, hechos por Rubén con ChatGPT. Cada personaje tiene `_reposo_1`, `_reposo_2`, `_ataque` y `_golpe`. También están el paseo de Luffy, su técnica, KO y victoria, y `barco_0..3`.
- `tools/cut.py`: recorta y limpia hojas de sprites (quita el fondo blanco y separa los fotogramas).
- `tools/patch*.py`: parches históricos aplicados al HTML. Solo sirven de referencia.

## Cómo está montado `index.html`
- **Escenario:** 960x540 fijo, escalado a la pantalla con `fit()`. Solo horizontal.
- **Fuentes:**
  - Baloo 2 para el texto.
  - Lilita One para números y botones.
  - Pirata One solo para el título.
  - Estética de pergamino.
- **Mar (`SEA_ISL`, `buildWorld`, `drawSea`):**
  - Mapa de 60x40 casillas de 48 px.
  - Islas orgánicas pintadas una sola vez en un lienzo y niebla suave.
  - Entidades visibles en `G.sea.ents`: barcos pirata y de la Marina que persiguen, un Rey Marino en aguas profundas y barriles. El encuentro salta al estar adyacente (`entStep` y `encounter`).
- **Islas (`ISLANDS`):** mapas de casillas por los que se camina, con puntos de interés que abren escenas de novela visual (`scene()`).
- **Combate por turnos según la velocidad (objeto `B`, `act()`, `enemyAct`):** incluye estados, técnicas y el combo Luffy+Zoro.
- **Sonido (`AU`, `sfx()`, `playMusic()`):** todo sintetizado con Web Audio. Las canciones están en `SONGS` y no hay archivos de audio.
- **Menú de pausa (`openMenu`, `MENU_ITEMS`):**
  - Secciones: Tripulación, Técnicas, Inventario, Misiones, Mapa, Tesoros, Barco, Guardar, Opciones y Salir al título.
  - Se abre con Esc o M.
- **Guardado:** en `localStorage` con la clave `mdl_save` y la versión `G.v=7`. Si cambia la estructura de la partida, hay que subir la versión y migrar en `loadSave()`.
- **Pruebas automáticas:** con `window.SIM=true`, `later()` pasa a ser síncrono y el audio se desactiva, lo que sirve para jugar el arco entero con Playwright.

## Reglas del proyecto
- Los personajes oficiales solo se ven con los sprites de Rubén. Si falta uno, se pone una silueta provisional y no se dibuja el personaje a mano.
- **Combate:**
  - Luffy siempre en perfil cuando está quieto en las islas, con su animación de reposo.
  - Los bufos y debufos tienen que verse muy claros.
- Tono: mezcla de comedia y épica, como One Piece. Textos en español.
- Antes de rediseños grandes, preguntar a Rubén.
