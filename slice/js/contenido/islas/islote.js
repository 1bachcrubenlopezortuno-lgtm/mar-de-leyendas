/* =========================================================================
   ISLOTE CALAVERA
   Islote rocoso y deshabitado (suroeste). Cangrejo gigante y tesoro maldito.
   ========================================================================= */
defIsland('islote',{n:'Islote Calavera',bg:'playa',
 sea:{cx:11,cy:31,r:3.8,seed:4,rocky:true,
  art:(x,cx,cy,house)=>{x.fillStyle='#7d766c';x.beginPath();x.ellipse(cx,cy-6,22,18,0,0,7);x.fill();x.fillStyle='#958e83';x.beginPath();x.ellipse(cx-5,cy-12,12,8,0,0,7);x.fill();x.fillStyle='#2b241e';x.beginPath();x.ellipse(cx-8,cy-6,5,6,0,0,7);x.ellipse(cx+8,cy-6,5,6,0,0,7);x.fill();x.fillRect(cx-6,cy+6,3,5);x.fillRect(cx,cy+6,3,5);x.fillRect(cx+6,cy+6,3,5)}},
 arrive(){if(G.f.isloteArr)return false;G.f.isloteArr=1;scene({bg:'playa',place:'Islote Calavera',lines:[['narr','Un islote con un acantilado en forma de calavera. Nadie vive aquí. Huele a misterio... y a cangrejo.']],next:renderIsland});return true},
 map:[
  "~~~~~~~~~~~~~~~~~~~~",
  "~~~~~~RRRRRRR~~~~~~~",
  "~~~~~RRRRqRRRR~~~~~~",
  "~~~~~R..,#,..R~~~~~~",
  "~~~~..Y,,#,,Y..~~~~~",
  "~~~...,,,#,,,,..~~~~",
  "~~~..e,,,#,,,Y..~~~~",
  "~~~~...,,#,,....~~~~",
  "~~~~~~...#...~~~~~~~",
  "~~~~~~~==m==~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~"],
 poi:{q:{n:'Cueva',ico:'🕳️',tile:'cave',go:()=>cueva()},
      e:{n:'Botella',ico:'🍾',tile:'botella',go:()=>botella()},
      m:POI_MUELLE},
 npc:[]});

function cueva(){
  if(G.f.cueva)return scene({bg:'cueva',place:'Cueva',lines:[['narr','La cueva está vacía. Solo queda el eco de los pinzazos.']]});
  scene({bg:'cueva',place:'Cueva del Islote',right:['cangrejo'],lines:[['narr','Al fondo de la cueva brilla algo... encima del caparazón de un cangrejo GIGANTE.'],['luffy','¡¿Eso se come?!'],...(has('zoro')?[['zoro','Eso tiene más armadura que un marine.']]:[])],choices:[
    {n:'¡A por el cangrejo!',s:'Combate de élite',f:()=>({fight:['cangrejo'],opt:{bg:'cueva',onWin:()=>{G.f.cueva=1;OUT=[];gainRare('perla');const ex=OUT;OUT=[];scene({bg:'cueva',lines:[['narr','En el caparazón del cangrejo había una perla enorme.'],...ex,['luffy','¡Y además hay cangrejo para cenar!']]})}}})},
    {n:'Mejor otro día',f:()=>{}}]});
}
function botella(){
  if(G.f.botella)return scene({bg:'playa',lines:[['narr','Solo queda el agujero donde estaba el tesoro.']]});
  scene({bg:'playa',place:'Islote Calavera',lines:[['narr','Medio enterrada en la arena, una botella con un mensaje: «Mi tesoro maldito, bajo la palmera torcida. No lo toquéis».'],['luffy','¡Vamos a tocarlo!']],choices:[
    {n:'Cavar bajo la palmera',s:'Un tesoro... maldito',f:()=>{G.f.botella=1;gainRare('doblon');say('Un doblón de oro que brilla de forma inquietante. Desde ahora, los enemigos sueltan más dinero.');fama(-1)}},
    {n:'Dejarlo en paz',f:()=>{G.f.botella=1;say('Hay maldiciones con las que es mejor no jugar.');fama(1)}}]});
}

defSideQuest({n:'El brillo de la cueva',donde:'Islote Calavera',conocida:()=>G.f.isloteArr,hecha:()=>G.f.cueva});
defSideQuest({n:'La botella misteriosa',donde:'Islote Calavera',conocida:()=>G.f.isloteArr,hecha:()=>G.f.botella});
