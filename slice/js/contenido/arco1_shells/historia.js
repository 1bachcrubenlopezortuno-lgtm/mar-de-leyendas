/* =========================================================================
   ARCO 1 · SHELLS TOWN
   Luffy, Coby, Zoro, Helmeppo y Morgan. Inicio de partida, escenas y combates de historia.
   ========================================================================= */

function startNew(){
  newGame();save();
  scene({bg:'pueblo',place:'Villa Molino',left:['luffy'],right:['tabernera'],lines:[
   ['narr','Villa Molino, un pueblo tranquilo del East Blue. Hoy un chaval con sombrero de paja se marcha al mar.'],
   ['luffy','¡Me voy a hacer pirata! ¡Y voy a juntar a la mejor tripulación del mundo!'],
   ['tabernera','Ten cuidado ahí fuera. Y pasa por la taberna antes de irte, que te he guardado provisiones.'],
   ['luffy','¡Shishishi! ¡Gracias!'],
   ['narr','Tu barca es diminuta, tu tripulación eres tú solo y no tienes ni idea de navegar. Empezamos bien.']],
   btn:'Explorar el pueblo',next:()=>{G.mode='island';renderIsland()}});
}

function cobyScene(){
  G.f.coby=1;
  scene({bg:'mar',place:'En alta mar',right:['bucanero','coby'],lines:[
   ['narr','Un barco pirata con una calavera de mazo se cruza en tu camino. En cubierta, un chaval con gafas friega el suelo temblando.'],
   ['coby','¡N-no os acerquéis! ¡Estos piratas son terribles!'],['bucanero','¡Grumete, quita de en medio! ¡Tenemos visita!'],['luffy','¿Visita? ¡Jajaja! ¿Os doy una paliza?']],
   choices:[{n:'¡Pelea!',s:'Tu primer combate',f:()=>({fight:['bucanero','bucanero'],opt:{bg:'cubierta',tutorial:true,story:true,onWin:cobyJoin}})}]});
}
function cobyJoin(){
  G.crew.push(newMember('coby',2));G.f.knowShells=1;reveal(46,33,4);
  quest('Navega a Shells Town (sureste) y busca al cazador de piratas.');
  scene({bg:'cubierta',place:'En alta mar',right:['coby'],lines:[
   ['coby','¡Me has salvado! Me llamo Coby. Llevo dos años de grumete a la fuerza con esos piratas...'],
   ['coby','Mi sueño es entrar en la Marina. ¡Ser marine de los de verdad!'],['luffy','¡Pues vente conmigo hasta la próxima base!'],
   ['coby','La más cercana está en Shells Town. ¡Os guío! ...Pero ahí tienen preso a Roronoa Zoro, el cazador de piratas.'],
   ['narr','Coby se une como invitado. Shells Town aparece en tu carta.']],next:renderSea});
}
function restaurante(){
  if(!G.f.rumor){G.f.rumor=1;quest('Ve al patio de la base de la Marina.');
    return scene({bg:'taberna',place:'Restaurante',right:['duena','nina'],lines:[
     ['narr','Un restaurante pequeño. La dueña os sirve mientras su hija os mira con curiosidad.'],
     ['nina','¿Vais a ver al cazador de piratas? Lleva días atado en el patio... sin comer.'],
     ['duena','¡Calla, hija! Si el hijo del capitán Morgan te oye, nos la cargamos.'],
     ['luffy','¿Sin comer? ¡Eso es lo peor que le puede pasar a alguien!'],
     ['nina','Le he hecho unas bolas de arroz... pero me da miedo llevárselas.']],choices:[
     {n:'Acompañarla hasta el patio',s:'Que Zoro coma algo',f:()=>{G.f.onigiri=1;say('¡Gracias! ¡Vamos juntos!','nina');fama(1)}},
     {n:'Ya iremos nosotros',f:()=>{say('Vale... tened cuidado.','nina')}}]})}
  scene({bg:'taberna',place:'Restaurante',right:['duena'],lines:[['duena','¿Algo de comer, chicos?']],choices:[
    {n:'Comer y descansar (15 💰)',cost:15,s:'Cura a toda la tripulación',f:()=>{G.berries-=15;healParty(1);say('Os ponéis las botas.')}},
    {n:'Irse',f:()=>{}}]});
}
function patio(){
  if(G.f.arc)return scene({bg:'patio',place:'Patio de la base',lines:[['narr','El patio está tranquilo. Los marines os saludan con la mano. Raro, pero bonito.']]});
  if(!G.f.rumor)return scene({bg:'patio',place:'Base de la Marina',lines:[['narr','Una base enorme, llena de marines con cara de pocos amigos. Mejor preguntar antes en el pueblo.']]});
  if(G.f.stage>=2)return scene({bg:'patio',place:'Patio de la base',right:['zoro'],lines:[['zoro','¿Qué haces aquí todavía? Mis espadas están en la torre de Morgan.']]});
  const L=[['narr','En el patio, un espadachín atado a un poste. Tiene la mirada de una bestia.'],['zoro','¿Qué miráis? Largaos.'],
   ['luffy','¡Tú eres el cazador de piratas! ¡Únete a mi tripulación!'],['zoro','¿Pirata? Ni loco. Me prometieron que si aguanto aquí un mes, me sueltan.']];
  if(G.f.onigiri)L.push(['nina','T-te he traído bolas de arroz...'],['helmeppo','¡Eh, mocosa! ¿Comida para el prisionero? ¡Eso va contra MIS normas!'],['narr','Helmeppo tira las bolas de arroz al suelo y las pisotea. La niña se echa a llorar.']);
  else L.push(['helmeppo','¡Jajaja! ¿Visitas para el perro atado? ¡Aquí mando yo, que mi padre es el capitán!']);
  scene({bg:'patio',place:'Patio de la base',right:G.f.onigiri?['zoro','helmeppo','nina']:['zoro','helmeppo'],lines:L,choices:[
    {n:'Darle un puñetazo a Helmeppo',s:'Combate · fama +2',f:()=>({fight:['helmeppo','marine'],opt:{bg:'patio',story:true,onWin:afterHelmeppo}})},
    {n:'Aguantarse... por ahora',s:'Sin pelea',f:()=>{say('Helmeppo se va riéndose.');return{then:()=>stage2(false)}}}]});
}
function afterHelmeppo(){OUT=[];fama(2);const f=OUT;OUT=[];stage2(true,f)}
function stage2(punched,extra=[]){
  G.f.stage=2;quest('Recupera las espadas de Zoro en la torre de Morgan.');
  const L=[...extra];
  if(punched)L.push(['helmeppo','¡Me has pegado! ¡Se lo diré a mi padre!'],...(has('coby')?[['coby','Luffy... ¡le has pegado al hijo de Morgan!']]:[]),['luffy','Se lo merecía.']);
  if(G.f.onigiri){L.push(['narr','Zoro estira el cuello y se come las bolas de arroz del suelo, con barro y todo.'],['zoro','...Estaban buenísimas. Dile a la niña que gracias.']);G.bond+=1}
  L.push(['zoro','Eres un tipo raro. Mis espadas están en la torre de Morgan. Si me las traes... igual hablamos.']);
  scene({bg:'patio',place:'Patio de la base',right:['zoro'],lines:L,next:renderIsland});
}
function torre(){
  if(G.f.arc)return scene({bg:'torre',place:'Torre de Morgan',lines:[['narr','La torre está vacía. En lo alto ya no ondea la bandera de Morgan.']]});
  if((G.f.stage||0)<2)return scene({bg:'torre',place:'Torre de Morgan',lines:[['narr','Una torre vigilada por marines. No tienes nada que hacer ahí... todavía.']]});
  scene({bg:'torre',place:'Torre de Morgan',right:['marine','marine','fusilero'],lines:[['narr','Os coláis en la torre. En una sala, tres katanas apoyadas en la pared.'],['marine','¡Intrusos! ¡A por ellos!']],
   choices:[{n:'¡Pelea!',s:'Combate',f:()=>({fight:['marine','marine','fusilero'],opt:{bg:'torre',story:true,onWin:zoroJoins}})}]});
}
function zoroJoins(){
  if(!has('zoro')){const z=newMember('zoro',Math.max(2,G.crew[0].lv));G.crew.splice(1,0,z)}
  G.bond=Math.max(G.bond,1);
  scene({bg:'patio',place:'Patio de la base',right:['morgan','helmeppo'],left:partyKeys(),lines:[
   ['narr','Corres al patio con las espadas. Zoro te mira de arriba abajo.'],
   ['luffy','Aquí tienes. Si las coges, eres de mi tripulación.'],
   ['zoro','Eres un demonio... Vale. Pero mi sueño es ser el mejor espadachín del mundo. Si te pones en medio, te corto.'],
   ['luffy','¡Shishishi! ¡Así me gusta!'],['narr','⚔️ Zoro se une a la tripulación.'],
   ['morgan','¡¿QUIÉN se atreve a desafiar al capitán Morgan en MI base?!'],['helmeppo','¡Esos, papá! ¡Esos me han pegado!'],
   ['zoro','Primer trabajo como pirata. Qué casualidad.']],
   choices:[{n:'¡A por Morgan!',s:'Combate final del arco',f:()=>({fight:['morgan','helmeppo'],opt:{bg:'patio',story:true,boss:true,onWin:arcEnd}})}]});
}
function arcEnd(){
  G.f.arc=1;G.bounty+=50;OUT=[];fama(2);const ex=OUT;OUT=[];
  const cob=has('coby');if(cob)G.crew=G.crew.filter(m=>m.key!=='coby');
  quest('¡Arco completado! Explora: hay un astillero en Puerto Gaviota (noreste) y un islote misterioso al suroeste.');
  scene({bg:'pueblo',place:'Shells Town',right:cob?['coby']:[],lines:[
   ['narr','Morgan cae. Los marines tiran las armas... ¡y lo celebran! El pueblo entero sale a la calle.'],
   ['marine','¡Se acabó el tirano! ¡Gracias, piratas!'],
   ...(cob?[['coby','Luffy... yo me quedo aquí. Voy a entrar en la Marina. Algún día seré almirante.'],['luffy','¡Entonces la próxima vez que nos veamos seremos enemigos! ¡Shishishi!'],['narr','Coby se queda en Shells Town.']]:[]),
   ['zoro','¿Y ahora qué, capitán?'],['luffy','¡Ahora necesitamos un navegante! ¡Y un cocinero! ¡Y un músico!'],
   ['narr','☠️ Vuestra recompensa sube a '+G.bounty+'.'],...ex,
   ['narr','FIN DEL ARCO 1. Puedes seguir explorando el mar, mejorar el barco y buscar tesoros.']],next:renderIsland});
}
