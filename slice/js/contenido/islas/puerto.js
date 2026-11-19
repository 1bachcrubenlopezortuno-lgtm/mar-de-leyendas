/* =========================================================================
   PUERTO GAVIOTA
   Puerto pesquero con astillero (noreste).
   ========================================================================= */
defIsland('puerto',{n:'Puerto Gaviota',bg:'muelle',
 sea:{cx:50,cy:7.5,r:4.8,seed:2,
  art:(x,cx,cy,house)=>{[[-18,-10],[0,-14],[16,-8],[-8,6],[12,8]].forEach(([a,b],k)=>house(cx+a,cy+b,k%2?'#3a6ea5':'#b23a2e'));
      x.fillStyle='#8d5524';x.fillRect(cx+26,cy+6,22,4);x.fillStyle='#6b3f1a';x.beginPath();x.moveTo(cx+28,cy+2);x.lineTo(cx+46,cy+2);x.lineTo(cx+42,cy+8);x.lineTo(cx+32,cy+8);x.fill()}},
 arrive(){if(G.f.puertoArr)return false;G.f.puertoArr=1;scene({bg:'muelle',place:'Puerto Gaviota',lines:[['narr','Un puerto pesquero lleno de redes, gaviotas y olor a sardina. Tienen astillero.'],['luffy','¡Uooh! ¡Aquí pueden mejorar el barco!']],next:renderIsland});return true},
 map:[
  "~~~~~~~~~~~~~~~~~~~~",
  "~~~~.........~~~~~~~",
  "~~~..,,HHHH,,..~~~~~",
  "~~..,,,HHaH,,,..~~~~",
  "~~..,T,,,#,,,T,..~~~",
  "~~..,,,,,#,,,,,,.~~~",
  "~~..HH,,,#,,,,Y,.~~~",
  "~~..Hc####,,,,,,.~~~",
  "~~...,,,,#,,,,..f==~",
  "~~~..,,,,#,,,,..~~~~",
  "~~~~.....#.....~~~~~",
  "~~~~~~~==m==~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~"],
 poi:{a:{n:'Astillero',ico:'🔨',go:()=>astillero()},
      c:{n:'Mercado',ico:'💰',go:()=>shop('Mercado de Puerto Gaviota',['carne','medicina','bomba','sake'],['chaleco','camisa','brujula'])},
      f:{n:'Pescador',ico:'🎣',tile:'dock',go:()=>pescador()},
      m:POI_MUELLE},
  npc:[{k:'marinerox',x:12,y:5,l:()=>[['marinerox','Las velas reforzadas te salvan la vida en las tormentas. Palabra de marinero.']]}]});

function astillero(){
  scene({bg:'astillero',place:'Astillero de Puerto Gaviota',right:['carpintero'],lines:[['carpintero','¡Menudo cascarón traéis! ¿Qué le hacemos?']],choices:[
    {n:`Reparar el casco (${G.ship.cascoMax-G.ship.casco} 💰)`,cost:G.ship.cascoMax-G.ship.casco,off:G.ship.casco>=G.ship.cascoMax,s:'1 berry por punto',f:()=>{G.berries-=G.ship.cascoMax-G.ship.casco;G.ship.casco=G.ship.cascoMax;say('Como nuevo. Bueno, como usado pero entero.','carpintero');return{then:astillero}}},
    ...Object.keys(UPG).filter(k=>!G.upg.includes(k)).map(k=>({n:`${UPG[k].n} — ${UPG[k].p} 💰`,s:UPG[k].d,cost:UPG[k].p,f:()=>{G.berries-=UPG[k].p;G.upg.push(k);if(k==='velas'){G.ship.cascoMax+=10;G.ship.casco+=10}say(`¡${UPG[k].n} instalado! Ya veréis la diferencia.`,'carpintero');return{then:astillero}}})),
    {n:'Salir',f:()=>{}}]});
}
function pescador(){
  if(G.f.pesca)return scene({bg:'muelle',right:['pescador'],lines:[['pescador','Hoy no pican. Vuelve otro día, chaval.']]});
  scene({bg:'muelle',place:'Muelle de pesca',right:['pescador'],lines:[['pescador','¡Eh, piratas! Unos bucaneros me han robado las redes. Si me las recuperáis, os doy pescado y unas monedas.']],choices:[
    {n:'Recuperar las redes',s:'Combate. Recompensa: 3 carnes con hueso, 30 berries y fama +1',f:()=>({fight:['bucanero','bucanero'],opt:{bg:'muelle',onWin:()=>{G.f.pesca=1;gainItem('carne',3);G.berries+=30;OUT=[];fama(1);const ex=OUT;OUT=[];scene({bg:'muelle',right:['pescador'],lines:[['pescador','¡Mis redes! Tomad, lo mejor de la pesca de hoy.'],['narr','🍖 +3 Carne con hueso · 💰 +30.'],...ex]})}}})},
    {n:'Ahora no',f:()=>{}}]});
}

defSideQuest({n:'Las redes del pescador',donde:'Puerto Gaviota',conocida:()=>G.f.puertoArr,hecha:()=>G.f.pesca});
defSideQuest({n:'Mejora tu barca en el astillero',donde:'Puerto Gaviota',conocida:()=>G.f.puertoArr,hecha:()=>G.upg.length>0});
