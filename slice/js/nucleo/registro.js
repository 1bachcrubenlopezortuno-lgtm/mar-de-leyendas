/* =========================================================================
   REGISTRO DE CONTENIDO
   Los archivos de js/contenido/ se apuntan aquí. El motor solo lee estas
   tablas: para añadir una isla, un arco o una misión no hace falta tocarlo.
   ========================================================================= */
const IW=20;            // ancho de los mapas de isla (casillas)
const ISLANDS={};       // islas caminables, por id
const SEA_ISL=[];       // islas tal y como se ven en el mar (con nombre y sin nombre)
const ARCS=[];          // arcos de historia, en orden (para la pantalla de Misiones)
const SIDE_QUESTS=[];   // misiones secundarias
const HOOKS={seaStep:[]};
const REGLAS={
  encuentrosMar:()=>true   // ¿pueden salir barcos, Reyes Marinos y barriles al navegar?
};

/* Isla caminable.
   d.n        nombre
   d.bg       fondo de escena al hablar con sus vecinos
   d.map      filas de 20 caracteres (leyenda en js/motor/islas.js). La 'm' es el muelle.
   d.poi      {letra:{n:nombre, ico:emoji, go:función, tile?:'dock'|'cave'|'botella'}}
   d.npc      [{k:sprite, x, y, l:()=>líneas de diálogo}]
   d.sea      {cx, cy, r, seed, rocky?, art?(x,cx,cy,house)} posición y dibujo en el mar
   d.pista    ()=>bool: se marca con ✕ en la carta antes de descubrirla
   d.arrive   ()=>bool: escena al desembarcar; devuelve true si ha abierto una escena */
function defIsland(id,d){
  d.id=id;d.npc=d.npc||[];d.poi=d.poi||{};
  d.map=d.map.map(r=>(r+'~'.repeat(IW)).slice(0,IW));
  ISLANDS[id]=d;
  if(d.sea)SEA_ISL.push({id,n:d.n,town:id,...d.sea});
}
/* Islote decorativo en el mar (no se puede desembarcar). */
function defIslet(s){SEA_ISL.push({id:null,...s})}
/* Arco: {id, n, pasos:[[()=>hecho, 'texto'], ...]} */
function defArc(a){ARCS.push(a)}
/* Misión secundaria: {n, donde, conocida:()=>bool, hecha:()=>bool} */
function defSideQuest(q){SIDE_QUESTS.push(q)}
/* Se llama en cada casilla navegada. Devuelve una función (escena) para cortar la navegación, o null. */
function onSeaStep(fn){HOOKS.seaStep.push(fn)}

/* Lugar de muelle estándar (zarpar). Úsalo en el poi 'm' de cada isla. */
const POI_MUELLE={n:'Muelle',ico:'⚓',tile:'dock',go:()=>muelle()};
