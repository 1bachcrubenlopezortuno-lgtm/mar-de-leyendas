/* =========================================================================
   ARCO 1 · SHELLS TOWN — reglas y misiones
   ========================================================================= */
defArc({id:'shells',n:'Arco 1 · Shells Town',pasos:[
  [()=>G.f.provisiones,'Pasa por la taberna de Villa Molino'],
  [()=>G.f.coby,'Rescata a Coby en alta mar'],
  [()=>G.f.shellsArr,'Llega a Shells Town'],
  [()=>G.f.rumor,'Pregunta en el restaurante'],
  [()=>G.f.stage>=2,'Conoce al cazador de piratas en el patio'],
  [()=>has('zoro'),'Recupera las espadas de Zoro'],
  [()=>G.f.arc,'Derrota al capitán Morgan']]});

/* Hasta rescatar a Coby no salen enemigos en el mar. */
REGLAS.encuentrosMar=()=>!!G.f.coby;

/* Al alejarse 6 casillas de Villa Molino por primera vez, aparece el barco de Coby. */
onSeaStep(()=>{
  if(G.f.coby)return null;
  const d0=dockOf('villa');
  return Math.hypot(G.sea.x-d0[0],G.sea.y-d0[1])>=6?cobyScene:null;
});
