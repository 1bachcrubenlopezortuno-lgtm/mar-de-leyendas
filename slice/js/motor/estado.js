/* ------------------------------------------------------------------------
   ESTADO Y GUARDADO
   ------------------------------------------------------------------------ */
let G=null,OUT=[];
function newMember(key,lv=1){const m={key,lv,xp:0,sp:0,skills:[...CHARS[key].start],eq:{arma:null,ropa:null,acc:null}};m.hp=stat(m,'hp');m.pe=stat(m,'pe');return m}
function newGame(){
  G={v:7,crew:[newMember('luffy')],berries:50,bounty:0,fama:0,items:{carne:2,medicina:1},bag:[],rares:[],upg:[],
     ship:{casco:40,cascoMax:40},sea:{x:10,y:5,seen:[],steps:0,face:1},mode:'island',isl:{id:'villa',x:10,y:12,face:1},lastIsl:'villa',
     f:{},bond:0,quest:'Habla con la gente de Villa Molino y prepárate para zarpar.'};
  const d=dockOf('villa');G.sea.x=d[0];G.sea.y=d[1];reveal(G.sea.x,G.sea.y,4);
}
function save(){try{localStorage.setItem('mdl_save',JSON.stringify(G))}catch(e){}}
function loadSave(){try{const s=JSON.parse(localStorage.getItem('mdl_save')||'null');if(!s)return null;
  if(s.v===6){ // partida de la versión anterior: nuevo mar, sin comida ni agua
    s.v=7;delete s.ship.comida;delete s.ship.agua;delete s.ship.cap;s.upg=(s.upg||[]).filter(u=>u!=='bodega');s.sea={x:0,y:0,seen:[],steps:0,face:1};
    const d=dockOf(s.lastIsl||'villa');s.sea.x=d[0];s.sea.y=d[1];const G0=G;G=s;reveal(d[0],d[1],4);if(s.f.knowShells&&s.f.coby)reveal(46,33,4);G=G0}
  return s.v===7?s:null}catch(e){return null}}
function has(k){return G.crew.some(m=>m.key===k)}
function stat(m,s){
  const c=CHARS[m.key];let v=s==='pe'?c.pe+Math.floor((m.lv-1)/2):Math.round(c[s]+(c.g[s]||0)*(m.lv-1));
  for(const sl of ['arma','ropa','acc']){const e=EQUIP[m.eq?.[sl]];if(e&&e[s])v+=e[s]}
  if(G)for(const k of G.rares){const e=RARES[k]&&RARES[k].stat;if(e&&e[s])v+=e[s]} // tesoros raros con bonus (datos/objetos.js)
  return Math.max(1,v);
}
function xpNext(lv){return 15+lv*12}
function say(t,who='narr'){OUT.push([who,t])}
function fama(d){G.fama=clamp(G.fama+d,-10,10);if(d)say(d>0?`Fama +${d}: la gente empieza a hablar bien de vosotros. 😇`:`Fama ${d}: vuestro nombre empieza a dar miedo. 😈`)}
function gainItem(k,n=1){G.items[k]=(G.items[k]||0)+n}
function gainEq(k){G.bag.push(k)}
function gainRare(k){if(!G.rares.includes(k)){G.rares.push(k);say(`💎 Tesoro raro: ${RARES[k].n}. ${RARES[k].d}.`)}}
function healParty(p){G.crew.forEach(m=>{m.hp=Math.min(stat(m,'hp'),m.hp+Math.ceil(stat(m,'hp')*p));m.pe=stat(m,'pe')})}
function toast(t){const d=document.createElement('div');d.className='toast perg';d.innerHTML=t;stage.appendChild(d);setTimeout(()=>d.remove(),2300)}
function quest(t){G.quest=t}
