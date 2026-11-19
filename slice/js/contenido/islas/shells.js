/* =========================================================================
   SHELLS TOWN
   Base de la Marina del capitán Morgan (sureste). Sus lugares de historia están en arco1_shells/historia.js.
   ========================================================================= */
defIsland('shells',{n:'Shells Town',bg:'pueblo',
 sea:{cx:46,cy:30,r:6.2,seed:3,
  art:(x,cx,cy,house)=>{x.fillStyle='rgba(0,0,0,.22)';x.fillRect(cx-26,cy-26,56,30);x.fillStyle='#9aa5b1';x.fillRect(cx-28,cy-30,56,30);x.fillStyle='#7b8794';for(let k=0;k<7;k++)x.fillRect(cx-28+k*8,cy-34,5,5);x.fillStyle='#3a6ea5';x.fillRect(cx-28,cy-4,56,3);
      x.fillStyle='#b8c2cc';x.fillRect(cx+12,cy-46,12,20);x.fillStyle='#3a6ea5';x.fillRect(cx+12,cy-50,12,5);x.strokeStyle='#3b2a14';x.lineWidth=1.5;x.beginPath();x.moveTo(cx+18,cy-50);x.lineTo(cx+18,cy-62);x.stroke();x.fillStyle='#f3f3f3';x.fillRect(cx+18,cy-62,10,6);x.fillStyle='#3a6ea5';x.fillRect(cx+18,cy-60,10,2);
      [[-30,14],[-12,18],[8,16],[26,14],[-22,30]].forEach(([a,b],k)=>house(cx+a,cy+b,k%2?'#b23a2e':'#c2493a'))}},
 pista:()=>G.f.knowShells, // se ve marcada en la carta antes de descubrirla
 arrive(){if(G.f.shellsArr)return false;G.f.shellsArr=1;quest('Pregunta en el pueblo por el cazador de piratas.');
    scene({bg:'pueblo',place:'Shells Town',lines:[['narr','Shells Town. Un pueblo apagado, a la sombra de una base enorme de la Marina.'],...(has('coby')?[['coby','Aquí manda el capitán Morgan... Dicen que es un tirano y que su hijo es todavía peor.']]:[]),['luffy','¡A ver dónde está ese cazador de piratas!']],next:renderIsland});return true},
 map:[
  "~~~~~~~~~~~~~~~~~~~~",
  "~..BBBBBBBBBBB....~~",
  "~..BBBBBBBBBBB.T..~~",
  "~..BBBBBBBBBBB....~~",
  "~..BBBBbBBBoBB..T.~~",
  "~......#...#......~~",
  "~.T....#####...HH.~~",
  "~..HHH...#.....HH.~~",
  "~..HHH...#..FF.Hs.~~",
  "~..HrH...#..FF....~~",
  "~........#.....T..~~",
  "~.,T.....#........~~",
  "~~.......#......~~~~",
  "~~~~~~~==m==~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~"],
 poi:{b:{n:'Patio de la base',ico:'⛓️',go:()=>patio()},
      o:{n:'Torre de Morgan',ico:'🗼',go:()=>torre()},
      r:{n:'Restaurante',ico:'🍙',go:()=>restaurante()},
      s:{n:'Mercado',ico:'💰',go:()=>shop('Mercado de Shells Town',['carne','medicina','bomba','sake'],['camisa','garrote','brujula'])},
      m:POI_MUELLE},
  npc:[{k:'marine',x:5,y:5,l:()=>G.f.arc?[['marine','¡Gracias por librarnos de Morgan! La base es otra desde que os fuisteis... digo, desde que vinisteis.']]:[['marine','Circulen. Aquí no hay nada que ver. Sobre todo en el patio.']]},
       {k:'aldeano',x:13,y:11,l:()=>[['aldeano','Si os ve el hijo de Morgan, agachad la cabeza. Aquí todo el mundo lo hace...']]}]});
