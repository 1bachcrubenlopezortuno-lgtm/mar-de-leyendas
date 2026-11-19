/* ------------------------------------------------------------------------
   ENCUENTROS EN EL MAR (con el barco que te ha alcanzado)
   ------------------------------------------------------------------------ */
function fleeChance(){return Math.min(.92,(G.upg.includes('velas')?.8:.6)+(G.upg.includes('mascaron')?.1:0))}
function entDone(e,how){if(how==='flee'){e.cd=8;return}e.gone=true;e.back=40+ri(0,20)}
function encounter(e){
  if(e.k==='barril')return barrilScene(e);
  if(e.k==='rey')return reyScene(e);
  const marina=e.k==='marina';
  const foes=marina?(chance(.5)?['marine','fusilero']:['marine','marine','fusilero']):(chance(.5)?['bucanero','bucanero']:['bucanero','bucanero','bucanero']);
  const can=G.upg.includes('canones'),win={bg:'cubierta',onWin:null};
  const fight=(o={})=>{entDone(e,'fight');return{fight:foes,opt:{bg:'cubierta',...o}}};
  scene({bg:'mar',place:'En alta mar',right:foes.slice(0,3),lines:marina?[['narr','El barco de la Marina os ha alcanzado.'],['marine','¡Alto, piratas! ¡Quedáis detenidos!']]:[['narr','El barco pirata se os pone al costado con malas intenciones.'],['bucanero','¡Entregad el dinero y la carne, pringados!'],['luffy','¿La carne? Ni de broma.']],choices:[
    {n:'¡Al abordaje!',s:'Combate',f:()=>fight()},
    {n:'¡Cañonazo y al abordaje!',need:()=>can,s:'Empiezan el combate con 12 de daño',f:()=>{say('¡BOOOM! La andanada les pilla desprevenidos.');return fight({cannons:true})}},
    {n:'Huir a toda vela',s:`${Math.round(fleeChance()*100)}% de éxito`,f:()=>{if(chance(fleeChance())){entDone(e,'flee');say('¡Os escapáis por los pelos! Se quedan atrás un buen rato.');return{}}say('¡Os alcanzan!');return fight()}},
    ...(marina?[{n:'Sobornar (30 💰)',cost:30,s:'Sin pelea',f:()=>{G.berries-=30;entDone(e,'bribe');say('El oficial cuenta las monedas y mira hacia otro lado.');fama(-1)}}]:[])]});
}
function reyScene(e){
  scene({bg:'mar',place:'Aguas profundas',right:['reymarino'],lines:[['narr','El mar se abre. Un Rey Marino del tamaño de una isla os mira con hambre.'],['luffy','¡Uooooh! ¡Seguro que sabe riquísimo!'],...(has('zoro')?[['zoro','Para eso hay que ganarle primero.']]:[])],choices:[
    {n:'¡A por él!',s:'Combate de élite',f:()=>{entDone(e,'fight');return{fight:['reymarino'],opt:{bg:'mar'}}}},
    {n:'Tirarle una carne y huir',off:!(G.items.carne>0),s:'Gasta 1 carne con hueso, huida segura',f:()=>{G.items.carne--;entDone(e,'flee');say('Se lanza a por la carne. Os largáis.')}},
    {n:'Huir',s:`${Math.round((fleeChance()-.15)*100)}% de éxito`,f:()=>{if(chance(fleeChance()-.15)){entDone(e,'flee');say('¡Remad, REMAD! ...Os habéis librado.');return{}}entDone(e,'fight');return{fight:['reymarino'],opt:{bg:'mar'}}}}]});
}
function barrilScene(e){
  scene({bg:'mar',place:'En alta mar',lines:[['narr','Un barril flota a la deriva junto al barco.'],['luffy','¡Un barril! ¡A lo mejor tiene carne!']],choices:[
    {n:'Subirlo a bordo',f:()=>{entDone(e,'take');const r=rand();if(r<.45){const k=pick(['carne','carne','medicina','bomba','sake']);gainItem(k);sfx('coin');say(`Dentro hay: ${ITEMS[k].n}.`)}else if(r<.8){const b=ri(20,45);G.berries+=b;sfx('coin');say(`¡Un saquito con ${b} berries!`)}else if(r<.9){G.ship.casco=Math.min(G.ship.cascoMax,G.ship.casco+10);say('Tablas y clavos. Remendáis el casco: +10.')}else{say('¡Era una trampa! Salen dos piratas del barril.');return{fight:['bucanero','bucanero'],opt:{bg:'cubierta'}}}}},
    {n:'Dejarlo',f:()=>{e.cd=99;say('El barril se aleja con su misterio.')}}]});
}
