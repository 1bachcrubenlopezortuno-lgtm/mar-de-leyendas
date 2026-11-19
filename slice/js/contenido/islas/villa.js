/* =========================================================================
   VILLA MOLINO
   Pueblo de inicio (noroeste).
   ========================================================================= */
defIsland('villa',{n:'Villa Molino',bg:'pueblo',
 sea:{cx:9,cy:8,r:5.2,seed:1,
  art:(x,cx,cy,house)=>{[[-22,-8],[-6,-14],[10,-6],[-14,8],[4,10],[20,6]].forEach(([a,b],k)=>house(cx+a,cy+b,k%2?'#b23a2e':'#c2493a'));
      x.fillStyle='#d9c7a3';x.fillRect(cx+30,cy-20,8,16);x.strokeStyle='#5a3214';x.lineWidth=2;const t=1;for(let k=0;k<4;k++){const a=k*Math.PI/2+.4;x.beginPath();x.moveTo(cx+34,cy-20);x.lineTo(cx+34+Math.cos(a)*12,cy-20+Math.sin(a)*12);x.stroke()}}},
 map:[
  "~~~~~~~~~~~~~~~~~~~~",
  "~~~~....,,,,,...~~~~",
  "~~~..,,T,,,,,T,,.~~~",
  "~~..,,,,,HHH,,,,,.~~",
  "~~.,T,,,,HHH,,T,,.~~",
  "~~.,,,,,,HtH,,,,,.~~",
  "~~.,,HH,,,#,,,,,,.~~",
  "~~.,,HH,,,#,,FF,,.~~",
  "~~.,,Hs####,,FF,T.~~",
  "~~..,,,,,,#,,,,,..~~",
  "~~~..,T,,,#,,,T..~~~",
  "~~~~...,,,#,,,...~~~",
  "~~~~~~~...#...~~~~~~",
  "~~~~~~~~==m==~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~"],
 poi:{t:{n:'Taberna',ico:'🍺',go:()=>tabernaVilla()},
      s:{n:'Tienda',ico:'💰',go:()=>shop('Tienda de Villa Molino',['carne','medicina','bomba','sake'],['guantes','chaleco'])},
      m:POI_MUELLE},
  npc:[{k:'aldeano',x:14,y:9,l:()=>[['aldeano','¡Luffy! ¿De verdad te vas al mar? ¡Si no sabes nadar!'],['luffy','¡Por eso voy en barco! ¡Shishishi!']]},
       {k:'abuela',x:4,y:9,l:()=>[['abuela','Cuando era joven vi un Rey Marino tan grande como el pueblo. Ten cuidado en las aguas del sur.']]}]});

function tabernaVilla(){
  if(!G.f.provisiones){G.f.provisiones=1;gainItem('carne',2);G.f.knowShells=1;quest('Navega hacia el sureste, a Shells Town. Allí hay un cazador de piratas.');
    return scene({bg:'taberna',place:'Taberna de Villa Molino',right:['tabernera'],lines:[
     ['tabernera','¡Aquí estás! Toma, un par de carnes para el viaje. Y no te las comas todas el primer día.'],['luffy','¡Prometido! ...Bueno, casi prometido.'],
     ['tabernera','Por cierto, dicen que en Shells Town, al sureste, la Marina tiene atado a un cazador de piratas. Un tal Roronoa Zoro. Dicen que es un demonio.'],
     ['luffy','¿Un cazador de piratas? ¡Seguro que es fortísimo! ¡Lo quiero en mi tripulación!'],['narr','🍖 +2 Carne con hueso. Shells Town aparece marcada en tu carta.']],next:renderIsland})}
  scene({bg:'taberna',place:'Taberna de Villa Molino',right:['tabernera'],lines:[['tabernera','¿Otra vez por aquí? ¿Qué te pongo?']],choices:[
    {n:'Descansar',s:'Cura a toda la tripulación (gratis)',f:()=>{healParty(1);say('Una siesta y como nuevos.')}},
    {n:'Carne para el viaje (15 💰)',cost:15,s:'+1 Carne con hueso',f:()=>{G.berries-=15;gainItem('carne');sfx('coin');say('Recién hecha. Que no se te enfríe.','tabernera')}},
    {n:'Preguntar por rumores',f:()=>{say(pick(['Dicen que en el islote del suroeste hay una cueva con un cangrejo enorme... y algo que brilla.','En Puerto Gaviota, al noreste, tienen el mejor astillero del East Blue. Bueno, el único.','Cuidado con las aguas del suroeste: por ahí rondan los Reyes Marinos. Si ves una aleta, ¡vira!']),'tabernera')}},
    {n:'Irse',f:()=>{}}]});
}
