/* ------------------------------------------------------------------------
   COMBATE POR TURNOS (orden por velocidad) · HUD a color
   ------------------------------------------------------------------------ */
let B=null,PEND=null;
const SLOTS={p:[[385,300],[240,312],[95,300]],e:[[575,300],[720,312],[865,300]]};
function startBattle(keys,opt={}){
  stopMaps();const snap=JSON.stringify(G);playMusic(opt.boss||keys.some(k=>FOES[k].elite)?'boss':'battle');
  const P=G.crew.slice(0,3).map((m,i)=>({uid:'p'+i,key:m.key,side:'p',n:CHARS[m.key].n,hp:Math.max(1,m.hp),max:stat(m,'hp'),pe:m.pe,peMax:stat(m,'pe'),atk:stat(m,'atk'),def:stat(m,'def'),spd:stat(m,'spd'),ref:m,alive:true,buff:null,bleed:0}));
  const E=keys.map((k,i)=>{const f=FOES[k];return{uid:'e'+i,key:k,side:'e',n:f.n,hp:f.hp,max:f.hp,atk:f.atk,def:f.def,spd:f.spd,alive:true,buff:null,bleed:0,defBonus:0}});
  B={P,E,all:[...P,...E],opt,snap,keys,queue:[],cur:null,mode:'wait',log:[],round:0,rage:false};
  drawBattle();
  if(opt.cannons)later(()=>{E.forEach(e=>hit(null,e,0,{fixed:12}));logB('¡La andanada de cañones les pilla de lleno!','x');refreshUnits()},500);
  if(opt.tutorial)logB('Consejo: elige una acción y luego toca al objetivo.','x');
  later(newRound,opt.cannons?1100:700);
}
function logB(t,c='x'){if(!B)return;B.log.unshift([t,c]);B.log.length=Math.min(B.log.length,4);const l=document.getElementById('blog');if(l)l.innerHTML=B.log.map(([x,cc],i)=>`<div class="l${cc} ${i?'':'l0'}">${x}</div>`).join('')}
function aliveS(s){return B.all.filter(u=>u.side===s&&u.alive)}
function newRound(){if(!B)return;B.round++;B.queue=B.all.filter(u=>u.alive).sort((a,b)=>(b.spd+rand()*.9)-(a.spd+rand()*.9));nextTurn()}
function nextTurn(){
  if(checkEnd())return;
  if(!B.queue.length)return newRound();
  const u=B.queue.shift();if(!u.alive)return nextTurn();
  B.cur=u;u.defend=false;u.globo=false;
  if(u.buff){u.buff.t--;if(u.buff.t<=0){u.buff=null;fx(u,'Ataque normal','info')}}
  if(u.bleed>0){hit(null,u,0,{fixed:u.bleed,quiet:true});logB(`${u.n} sangra (${u.bleed}).`,u.side);u.bleed=Math.max(0,u.bleed-1);if(!u.alive){refreshUnits();return later(nextTurn,500)}}
  if(u.side==='p'){u.pe=Math.min(u.peMax,u.pe+1);B.mode='menu'}else B.mode='wait';
  refreshUnits();drawQueue();drawMenu();
  if(u.side==='e')later(()=>enemyAct(u),750);
}
function atkOf(u){return u.atk*(u.buff?u.buff.m:1)}
function hit(src,tgt,pow,o={}){
  if(!tgt.alive)return 0;
  if(src&&CHARS[tgt.key]?.rubber&&o.ranged){const d=Math.max(1,Math.round(atkOf(src)*pow));sfx('boing');fx(tgt,'¡Boing!','info');logB('¡Las balas rebotan en el cuerpo de goma de Luffy!','p');return hit(null,src,0,{fixed:d})}
  if(src&&tgt.globo&&!o.ranged){const d=Math.max(1,Math.round(atkOf(src)*pow));fx(tgt,'¡Globo!','info');return hit(null,src,0,{fixed:d})}
  let d,crit=false;
  if(o.fixed)d=o.fixed;else{d=atkOf(src)*pow*(.9+rand()*.2)-(tgt.def+(tgt.defBonus||0))*.6;crit=rand()<.08;if(crit)d*=1.5;d=Math.max(1,Math.round(d))}
  if(tgt.defend&&!o.fixed)d=Math.max(1,Math.round(d*.5));
  tgt.hp-=d;fx(tgt,(crit?'¡CRÍTICO! ':'')+'-'+d,crit?'crit':'');sfx(crit?'crit':o.ranged?'shot':src&&(CHARS[src.key]||FOES[src.key])?.slash?'slash':'hit');
  const el=uEl(tgt);if(el){el.classList.remove('hitf');void el.offsetWidth;el.classList.add('hitf');pose(el.querySelector('img'),'hit',380)}
  if(tgt.hp<=0){tgt.hp=0;tgt.alive=false;if(!o.quiet)logB(`${tgt.n} cae.`,tgt.side==='e'?'p':'e')}
  return d;
}
function heal(u,v){const h=Math.min(v,u.max-u.hp);u.hp+=h;fx(u,'+'+h,'heal');sfx('heal');const el=uEl(u);if(el){const b=document.createElement('div');b.className='burst heal';el.querySelector('.spw').appendChild(b);setTimeout(()=>b.remove(),650)}}
function uEl(u){return document.getElementById('u_'+u.uid)}
function fx(u,t,c){const el=uEl(u);if(!el)return;const f=document.createElement('div');f.className='float '+(c||'');f.textContent=t;f.style.left=(50+(rand()-.5)*30)+'%';el.appendChild(f);setTimeout(()=>f.remove(),950)}
function tecPose(u){const el=uEl(u),a=ASSETS[u.key];if(!el||!a||!a.tec)return false;sfx('stretch');const spw=el.querySelector('.spw'),base=spw.querySelector('img');if(!base)return false;
  const ov=document.createElement('img');ov.className='spr tecov';ov.style.height=base.height+'px';ov.src=a.tec[0];base.style.visibility='hidden';spw.appendChild(ov);
  setTimeout(()=>{ov.src=a.tec[1]},200);setTimeout(()=>{ov.remove();base.style.visibility=''},750);return true}
function lunge(u){const el=uEl(u);if(!el)return;const c=u.side==='p'?'lunge-r':'lunge-l';el.classList.remove(c);void el.offsetWidth;el.classList.add(c);pose(el.querySelector('img'),'atk',420)}
function banner(t,cls){const b=document.createElement('div');b.className='banner '+(cls||'');b.textContent=t;stage.appendChild(b);setTimeout(()=>b.remove(),1200)}
function enemyAct(u){
  if(!B)return;if(!u.alive)return nextTurn();
  const f=FOES[u.key];
  if(f.boss&&!B.rage&&u.hp<u.max*.5){B.rage=true;u.buff={m:1.3,t:99};stFx(u,'💢 ¡FURIA!','up');banner('¡Furia del capitán!','foe');logB(`${u.n}: «¡¿Cómo os atrevéis?!»`,'e')}
  const mv=(()=>{let t=f.moves.reduce((s,m)=>s+m.w,0),r=rand()*t;for(const m of f.moves){if((r-=m.w)<=0)return m}return f.moves[0]})();
  const foes=aliveS('p');if(!foes.length)return nextTurn();
  lunge(u);
  if(mv.def){u.defBonus=(u.defBonus||0)+mv.def;stFx(u,'🛡️ ¡Defensa ▲!','def');logB(`${u.n} usa ${mv.n}.`,'e')}
  else if(mv.self){u.buff={m:mv.self,t:3};stFx(u,'⚔️ ¡Ataque ▲!','up');banner(mv.n,'foe');logB(`${u.n}: «${mv.n}»`,'e')}
  else if(mv.buffAll){aliveS('e').forEach(a=>{a.buff={m:mv.buffAll,t:2};stFx(a,'⚔️ ¡Ataque ▲!','up')});logB(`${u.n}: «${mv.n}»`,'e')}
  else if(mv.all){banner(mv.n,'foe');foes.forEach(t=>hit(u,t,mv.pow,{ranged:mv.ranged}));logB(`${u.n} usa ${mv.n}.`,'e')}
  else{const t=chance(.5)?foes.reduce((a,b)=>a.hp<b.hp?a:b):pick(foes);hit(u,t,mv.pow,{ranged:mv.ranged});logB(`${u.n} usa ${mv.n} contra ${t.n}.`,'e')}
  refreshUnits();later(nextTurn,700);
}
function act(kind,arg){
  if(!B)return;const u=B.cur;sfx('click');
  if(!u||u.side!=='p'||!['menu','target','tech','items'].includes(B.mode))return;
  if(kind==='back'){PEND=null;B.mode='menu';refreshUnits();return drawMenu()}
  if(kind==='attack'){PEND={run:t=>{lunge(u);banner('¡Ataque!','atk');hit(u,t,1);logB(`${u.n} ataca a ${t.n}.`,'p')}};return askTarget('e')}
  if(kind==='defend'){u.defend=true;u.pe=Math.min(u.peMax,u.pe+2);stFx(u,'🛡️ ¡En guardia! +2 PE','guard');logB(`${u.n} se defiende (+2 PE).`,'p');return endAction()}
  if(kind==='flee'){if(B.opt.story||B.opt.boss){logB('¡No se puede huir de esta pelea!','x');return}
    if(chance(fleeChance())){logB('¡Huida con éxito!','p');B.mode='done';return later(()=>{writeBack();B=null;save();back()},600)}logB('¡No hay forma de escapar!','e');return endAction()}
  if(kind==='techmenu'){B.mode='tech';return drawMenu()}
  if(kind==='itemmenu'){B.mode='items';return drawMenu()}
  if(kind==='tech'){const s=CHARS[u.key].skills.find(x=>x.id===arg);if(!s||u.pe<s.pe)return;
    const run=t=>{u.pe-=s.pe;if(s.t==='self'||!tecPose(u))lunge(u);banner(s.n,'tec');fx(u,'-'+s.pe+' PE','pe');
      if(s.t==='all'){aliveS('e').forEach(e=>hit(u,e,s.pow))}
      else if(s.t==='one'){hit(u,t,s.pow);if(s.bleed&&t.alive){t.bleed=Math.max(t.bleed,s.bleed);stFx(t,'🩸 ¡Sangrado!','bleed')}}
      else if(s.t==='self'){if(s.id==='globo'){u.globo=true;stFx(u,'🎈 ¡Globo!','globo')}if(s.buff){u.buff={m:s.buff,t:3};stFx(u,'⚔️ ¡Ataque ▲!','up')}}
      else if(s.t==='ally'){if(s.heal)heal(t,s.heal);if(s.buff){t.buff={m:s.buff,t:3};stFx(t,'⚔️ ¡Ataque ▲!','up')}}
      logB(`${u.n} usa ${s.n}.`,'p')};
    if(s.t==='one'){PEND={run};return askTarget('e')}if(s.t==='ally'){PEND={run};return askTarget('p')}run();return endAction()}
  if(kind==='combo'){const z=B.P.find(p=>p.key==='zoro'&&p.alive);if(!z||u.pe<4||z.pe<4)return;PEND={run:t=>{u.pe-=4;z.pe-=4;if(!tecPose(u))lunge(u);lunge(z);banner('¡Gomu Gomu... Oni Giri!','combo');hit(u,t,COMBO.pow);logB('¡Ataque combinado de Luffy y Zoro!','p')}};return askTarget('e')}
  if(kind==='item'){const it=ITEMS[arg];if(!G.items[arg])return;
    const run=t=>{G.items[arg]--;if(it.t==='ally'){if(it.heal)heal(t,it.heal);if(it.pe){t.pe=Math.min(t.peMax,t.pe+it.pe);fx(t,'+'+it.pe+' PE','pe')}}
      if(it.t==='party')aliveS('p').forEach(p=>heal(p,it.heal));if(it.t==='foes'){banner('¡Bomba!','atk');aliveS('e').forEach(e=>hit(null,e,0,{fixed:it.dmg}))}logB(`${u.n} usa ${it.n}.`,'p')};
    if(it.t==='ally'){PEND={run};return askTarget('p')}run();return endAction()}
}
function askTarget(side){B.mode='target';B.tside=side;refreshUnits();drawMenu();logB(side==='e'?'Elige un enemigo.':'Elige a un aliado.','x')}
function pickTarget(uid){if(!B||B.mode!=='target')return;const t=B.all.find(x=>x.uid===uid);if(!t||!t.alive||t.side!==B.tside)return;B.mode='busy';const r=PEND.run;PEND=null;r(t);endAction()}
function endAction(){B.mode='busy';refreshUnits();drawMenu();later(nextTurn,700)}
function checkEnd(){
  if(!B)return true;
  if(!aliveS('e').length){B.mode='done';banner('¡Victoria!','win');later(winBattle,900);return true}
  if(!aliveS('p').length){B.mode='done';banner('Derrota','lose');later(loseBattle,900);return true}
  return false;
}
function writeBack(){B.P.forEach(u=>{u.ref.hp=Math.max(1,Math.round(u.hp));u.ref.pe=u.pe})}
function winBattle(){
  if(!B)return;writeBack();const o=B.opt;let xp=0,gold=0;const drops=[];OUT=[];
  B.E.forEach(e=>{const f=FOES[e.key];xp+=f.xp;gold+=ri(f.gold[0],f.gold[1]);(f.drop||[]).forEach(([d,p])=>{if(chance(p))drops.push(d)})});
  G.rares.forEach(k=>{if(RARES[k]&&RARES[k].oro)gold=Math.round(gold*RARES[k].oro)});
  G.berries+=gold;G.bounty+=Math.round(xp/4);
  const lines=[`<span class="num">+${gold} 💰 · +${xp} XP</span>`];
  drops.forEach(d=>{if(d.startsWith('eq:')){const k=d.slice(3);if(G.bag.includes(k)||G.crew.some(m=>Object.values(m.eq).includes(k)))return;gainEq(k);lines.push(`🎁 ${EQUIP[k].n} (equípalo en la bitácora)`)}else if(d.startsWith('rare:')){gainRare(d.slice(5));lines.push(...OUT.map(x=>x[1]));OUT=[]}else{gainItem(d);lines.push(`🎁 ${ITEMS[d].n}`)}});
  B.P.forEach(u=>{const m=u.ref;m.xp+=xp;while(m.xp>=xpNext(m.lv)&&m.lv<10){m.xp-=xpNext(m.lv);m.lv++;m.sp++;m.hp=stat(m,'hp');m.pe=stat(m,'pe');lines.push(`⭐ ¡${CHARS[m.key].n} sube a nivel ${m.lv}! (+1 punto de técnica)`)}});
  if(B.P.some(p=>p.key==='zoro')&&B.P.some(p=>p.key==='luffy')){const before=Math.floor(G.bond);G.bond=Math.min(5,G.bond+.34);if(Math.floor(G.bond)>before)lines.push(`🤝 Vínculo Luffy–Zoro: ${'★'.repeat(Math.floor(G.bond))}${Math.floor(G.bond)===3?' ¡Ataque combinado desbloqueado!':''}`)}
  const bg=o.bg;B=null;save();stopMusic();sfx('victory');later(()=>sfx('coin'),900);if(lines.some(l=>l.includes('sube a nivel')))later(()=>sfx('levelup'),1400);
  window.afterWin=()=>{o.onWin?o.onWin():back()};
  const luffyOk=G.crew.find(m=>m.key==='luffy');
  stage.innerHTML=`<div class="vnbg" style="${bgStyle(bg||'cubierta')}"></div>${hud()}${luffyOk?`<div class="abs" style="left:8px;bottom:30px;z-index:21">${img("luffywin",190)}</div>`:''}<div class="panel perg"><h1>¡Victoria!</h1>${lines.map(l=>`<p style="margin-top:4px">${l}</p>`).join('')}<button class="primary" style="margin-top:14px" onclick="afterWin()">Continuar</button></div>`;
}
function loseBattle(){
  if(!B)return;const o=B.opt,snap=B.snap,keys=B.keys;B=null;stopMusic();sfx('defeat');
  if(o.story){window.retry=()=>{G=JSON.parse(snap);G.crew.forEach(m=>{m.hp=stat(m,'hp');m.pe=stat(m,'pe')});startBattle(keys,o)};
    stage.innerHTML=`<div class="vnbg" style="${bgStyle(o.bg||'cubierta')}"></div><div class="panel perg"><h1>Derrota</h1><p>Esta pelea es importante. ¿Lo intentas otra vez? La tripulación vuelve con la vida y la energía al máximo.</p><button class="primary" style="margin-top:12px" onclick="retry()">Reintentar</button></div>`;return}
  G=JSON.parse(snap);G.berries=Math.floor(G.berries/2);G.crew.forEach(m=>{m.hp=Math.ceil(stat(m,'hp')*.5)});
  const id=G.lastIsl||'villa',p=islStart(id);G.isl={id,x:p[0],y:p[1],face:1};shipToDock(id);G.mode='island';save();
  stage.innerHTML=`<div class="vnbg" style="${bgStyle('playa')}"></div><div class="panel perg"><h1>Derrota</h1><p>Os despertáis en ${ISLANDS[id].n}, con medio botín menos y muchos chichones.</p><button class="primary" style="margin-top:12px" onclick="renderIsland()">Continuar</button></div>`;
}
function unitHTML(u,i){
  const tg=B.mode==='target'&&u.side===B.tside&&u.alive,big=FOES[u.key]?.boss||FOES[u.key]?.elite,sz=FOES[u.key]?.size||(big?128:104);
  const [x,y]=SLOTS[u.side][i];
  const aura=(u.buff&&u.buff.m>=1?' buffed':'')+(u.defend||u.defBonus?' guarding':'')+(u.bleed?' bleeding':'')+(u.globo?' ballooned':'');
  return `<div class="unit ${u.side}${aura}${!u.alive&&ASSETS[u.key]?.ko?' hasko':''} ${u===B.cur&&B.mode!=='done'?'turn':''} ${tg?'tgt':''} ${tg&&u.side==='p'?'ally':''} ${u.alive?'':'dead'}" id="u_${u.uid}" style="left:${x-75}px;top:${y-(sz+86)}px" ${tg?`onclick="pickTarget('${u.uid}')"`:''}>
   <div class="spw">${!u.alive&&ASSETS[u.key]?.ko?`<img class="spr" src="${ASSETS[u.key].ko}" style="width:${sz*1.45}px;height:auto;margin-left:-${sz*.2}px">`:img(u.key,sz)}</div><div class="plate"><div class="nm">${u.n}</div><div class="bar hp ${u.side}"><i style="width:${100*u.hp/u.max}%"></i></div><div class="nums">❤️ ${u.hp}/${u.max}${u.side==='p'?` · 🔷 ${u.pe}/${u.peMax}`:''}</div>
   ${u.side==='p'?`<div class="bar pe"><i style="width:${100*u.pe/u.peMax}%"></i></div>`:''}</div>${chipsHTML(u,big)}</div>`;
}
function chipsHTML(u,big){const c=[];
  if(u.buff)c.push(`<span class="chip ${u.buff.m>=1?'up':'down'}">⚔️ ATQ ${u.buff.m>=1?'▲':'▼'}${u.buff.t>50?'':' '+u.buff.t+'t'}</span>`);
  if(u.defBonus)c.push(`<span class="chip def">🛡️ DEF ▲ +${u.defBonus}</span>`);
  if(u.defend)c.push(`<span class="chip guard">🛡️ GUARDIA</span>`);
  if(u.globo)c.push(`<span class="chip globo">🎈 GLOBO</span>`);
  if(u.bleed)c.push(`<span class="chip bleed">🩸 ${u.bleed}</span>`);
  return `<div class="chips" style="top:${big?-8:6}px">${c.join('')}</div>`}
function stFx(u,t,cls){sfx(cls==='bleed'?'debuff':'buff');const el=uEl(u);if(!el)return;const f=document.createElement('div');f.className='float st '+cls;f.textContent=t;f.style.top='30px';el.appendChild(f);setTimeout(()=>f.remove(),1300);
  const b=document.createElement('div');b.className='burst '+cls;el.querySelector('.spw').appendChild(b);setTimeout(()=>b.remove(),650)}
function drawBattle(){
  if(!B)return;
  stage.innerHTML=`<div class="bfield" style="${bgStyle(B.opt.bg||'cubierta')}"></div>${hud()}<div class="queue perg" id="queue"></div>
   <div id="units">${B.P.map(unitHTML).join('')}${B.E.map(unitHTML).join('')}</div>
   <div class="blog perg" id="blog"></div><div class="cmd" id="menu"></div>`;
  logB(B.log.length?B.log.shift()[0]:'¡Comienza el combate!','x');drawQueue();drawMenu();
}
function drawQueue(){const q=document.getElementById('queue');if(!q||!B)return;q.innerHTML=`<span class="lab">Turnos</span>`+[B.cur,...B.queue].filter(u=>u&&u.alive).slice(0,8).map((u,i)=>`<div class="q ${u.side} ${i===0?'now':''}">${img(u.key,36)}</div>`).join('')}
function refreshUnits(){if(!B)return;const w=document.getElementById('units');if(!w)return;
  [...B.P.map((u,i)=>[u,i]),...B.E.map((u,i)=>[u,i])].forEach(([u,i])=>{const el=uEl(u);if(!el)return;const t=document.createElement('div');t.innerHTML=unitHTML(u,i);const nw=t.firstElementChild;
    el.className=nw.className+[...el.classList].filter(c=>c==='lunge-r'||c==='lunge-l'||c==='hitf').map(c=>' '+c).join('');el.querySelector('.plate').innerHTML=nw.querySelector('.plate').innerHTML;if(!u.alive&&ASSETS[u.key]?.ko&&!el.dataset.ko){el.dataset.ko=1;el.querySelector('.spw').innerHTML=nw.querySelector('.spw').innerHTML}el.querySelector('.chips').outerHTML=nw.querySelector('.chips').outerHTML;
    if(nw.getAttribute('onclick'))el.setAttribute('onclick',nw.getAttribute('onclick'));else el.removeAttribute('onclick')});refreshHud()}
function drawMenu(){
  const m=document.getElementById('menu');if(!m||!B)return;const u=B.cur;
  if(!u||B.mode==='done'){m.innerHTML='';return}
  if(u.side==='e'){m.innerHTML=`<div class="cmdhead perg foe">⚔️ Turno de ${u.n}...</div>`;return}
  const head=`<div class="cmdhead perg"><b>Turno de ${u.n}</b><span class="num">❤️ ${u.hp}/${u.max} · 🔷 ${u.pe} PE</span></div>`;
  if(B.mode==='busy'){m.innerHTML=head;return}
  if(B.mode==='target'){m.innerHTML=head+`<button class="cbtn back" onclick="act('back')">← Cancelar · ${B.tside==='e'?'toca un enemigo':'toca un aliado'}</button>`;return}
  if(B.mode==='tech'){const sk=CHARS[u.key].skills.filter(s=>u.ref.skills.includes(s.id));const z=B.P.find(p=>p.key==='zoro'&&p.alive);const combo=u.key==='luffy'&&G.bond>=3&&z;
    m.innerHTML=head+`<div class="cmdlist">${sk.map(s=>`<button class="cbtn t-${s.t}" ${u.pe<s.pe?'disabled':''} onclick="act('tech','${s.id}')"><span class="pe-tag">${s.pe} PE</span>${s.n}<small>${s.d}</small></button>`).join('')}
     ${combo?`<button class="cbtn t-combo" ${u.pe<4||z.pe<4?'disabled':''} onclick="act('combo')"><span class="pe-tag">4+4</span>🤝 ${COMBO.n}<small>${COMBO.d}</small></button>`:''}
     <button class="cbtn back" onclick="act('back')">← Volver</button></div>`;return}
  if(B.mode==='items'){const it=Object.keys(G.items).filter(k=>G.items[k]>0);
    m.innerHTML=head+`<div class="cmdlist">${it.map(k=>`<button class="cbtn t-item" onclick="act('item','${k}')"><span class="pe-tag">×${G.items[k]}</span>${ITEMS[k].n}<small>${ITEMS[k].d}</small></button>`).join('')||'<div class="perg" style="padding:8px">No te queda nada.</div>'}<button class="cbtn back" onclick="act('back')">← Volver</button></div>`;return}
  m.innerHTML=head+`<div class="cmdgrid">
   <button class="cbtn atk" onclick="act('attack')">⚔️ Atacar<small>Golpe normal</small></button>
   <button class="cbtn tec" onclick="act('techmenu')">✨ Técnica<small>Gasta PE</small></button>
   <button class="cbtn obj" onclick="act('itemmenu')">🎒 Objeto<small>Consumibles</small></button>
   <button class="cbtn def" onclick="act('defend')">🛡️ Defender<small>−50% daño · +2 PE</small></button>
   <button class="cbtn run" onclick="act('flee')" ${B.opt.story?'disabled':''}>💨 Huir<small>${B.opt.story?'No se puede':Math.round(fleeChance()*100)+'%'}</small></button></div>`;
}
