/* =========================================================================
   SPRITES DE RUBÉN
   Rutas de los PNG de slice/sprites. Cada personaje: _reposo_1, _reposo_2, _ataque, _golpe.
   ========================================================================= */
const ASSETS={
  ...Object.fromEntries(['luffy','zoro','coby','nami','sanji','chopper','helmeppo','morgan','bucanero','cangrejo','tabernera','marine','fusilero','mercader','reymarino'].map(k=>[k,{idle:[`sprites/${k}_reposo_1.png`,`sprites/${k}_reposo_2.png`],atk:`sprites/${k}_ataque.png`,hit:`sprites/${k}_golpe.png`}]))
};
ASSETS.luffy.tec=['sprites/luffy_tecnica_0.png','sprites/luffy_tecnica_1.png'];ASSETS.luffy.ko='sprites/luffy_ko.png';
ASSETS.luffywin={idle:['sprites/luffy_victoria_0.png','sprites/luffy_victoria_1.png']};
/* Luffy caminando por las islas: 0-2 abajo, 3-5 arriba, 6-11 derecha (izquierda = espejo) */
const WALK={down:[0,1,2],up:[3,4,5],right:[6,7,8,9,10,11]};
const walkSrc=i=>`sprites/luffy_walk_${String(i).padStart(2,'0')}.png`;
const ASSETS_BG={}; // p. ej. playa:'fondos/playa.png'
