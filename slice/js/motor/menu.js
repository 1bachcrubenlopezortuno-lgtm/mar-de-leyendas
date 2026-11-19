/* ------------------------------------------------------------------------
   HUD Y BITÁCORA
   ------------------------------------------------------------------------ */
function hud(){
  const s=G.ship,lo=v=>v<=3?'low':'';
  return `<div class="hud perg"><div class="crewbar">${G.crew.map(m=>`<div class="port"><div class="ring">${img(m.key,44)}</div><div class="mini"><i style="width:${100*m.hp/stat(m,'hp')}%"></i></div></div>`).join('')}</div>
   <div class="hudmid">${G.mode==='sea'?`<span class="${s.casco<=10?'low':''}">🛶 Casco ${s.casco}/${s.cascoMax}</span>`:''}</div>
   <span class="num">💰 ${G.berries}</span><span class="num">☠️ ${G.bounty}${G.fama<=-4?' 😈':G.fama>=4?' 😇':''}</span>
   <button class="ico menubtn" onclick="openMenu()">☰ Menú</button></div>`;
}
function refreshHud(){const h=stage.querySelector('.hud');if(h&&G)h.outerHTML=hud()}
let BT={tab:'crew',sel:0};
function bitTab(){
  const m=G.crew[BT.sel]||G.crew[0];
  const who=`<div class="tabs">${G.crew.map((c,i)=>`<button class="${c===m?'on':''}" onclick="BT.sel=${i};bitacora()">${CHARS[c.key].n}</button>`).join('')}</div>`;
  if(BT.tab==='crew'){const c=CHARS[m.key];
    return who+`<div class="cols"><div class="pick">${img(m.key,128)}<div><h3>${c.n} · Nv ${m.lv}${c.guest?' (invitado)':''}</h3><div class="muted">XP ${m.xp}/${xpNext(m.lv)}</div>
     <div class="num">❤️ ${m.hp}/${stat(m,'hp')} · 🔷 ${m.pe}/${stat(m,'pe')}<br>⚔️ ${stat(m,'atk')} · 🛡️ ${stat(m,'def')} · 💨 ${stat(m,'spd')}</div>${c.fruit?`<div class="muted">🍇 ${c.fruit}</div>`:''}</div></div>
     <div><h3>Equipo</h3>${['arma','ropa','acc'].map(sl=>`<div class="slot"><span>${SLOT_TXT[sl]}: <b>${m.eq[sl]?EQUIP[m.eq[sl]].n:'—'}</b></span><button class="ico" style="font-size:16px" onclick="equipMenu('${sl}')">Cambiar</button></div>`).join('')}
     ${m.key==='luffy'||m.key==='zoro'?`<p style="margin-top:8px">🤝 Vínculo Luffy–Zoro: ${'★'.repeat(Math.floor(G.bond))}${'☆'.repeat(Math.max(0,5-Math.floor(G.bond)))}<br><span class="muted">${G.bond>=3?'¡Ataque combinado disponible!':'Con 3★ se desbloquea un ataque combinado'}</span></p>`:''}</div></div>`}
  if(BT.tab==='tec'){const c=CHARS[m.key];
    return who+`<p>Puntos de técnica: <b>${m.sp}</b> <span class="muted">(1 por nivel)</span></p><div class="cols">`+c.skills.map(s=>{
      const known=m.skills.includes(s.id),can=!known&&!s.lock&&m.sp>0&&(!s.req||m.skills.includes(s.req));
      return `<div class="sk ${s.lock?'lock':''}"><b>${s.n}</b> ${s.pe?`<span class="num">${s.pe} PE</span>`:''}<br><span class="muted">${s.d}${s.req&&!known?` · requiere ${c.skills.find(x=>x.id===s.req).n}`:''}</span>
        ${known?'<div>✔ Aprendida</div>':s.lock?'<div>🔒 Bloqueada</div>':`<button class="plain" style="margin-top:4px" ${can?'':'disabled'} onclick="learn('${s.id}')">Aprender (1 punto)</button>`}</div>`}).join('')+'</div>'}
  if(BT.tab==='inv'){const it=Object.keys(G.items).filter(k=>G.items[k]>0);
    return `<div class="cols"><div><h3>Consumibles</h3>${it.map(k=>`<div class="slot"><span>${ITEMS[k].n} ×${G.items[k]}<br><span class="muted">${ITEMS[k].d}</span></span>${ITEMS[k].heal?`<button class="ico" style="font-size:16px" onclick="useOutside('${k}')">Usar</button>`:''}</div>`).join('')||'<p class="muted">Nada</p>'}</div>
     <div><h3>Equipo guardado</h3>${G.bag.map(k=>`<div class="slot"><span>${EQUIP[k].n}<br><span class="muted">${SLOT_TXT[EQUIP[k].s]}: ${eqTxt(EQUIP[k])}</span></span></div>`).join('')||'<p class="muted">Nada</p>'}</div></div>`}
  if(BT.tab==='barco'){const s=G.ship;return `<p class="num">🛶 Casco ${s.casco}/${s.cascoMax}</p><p class="muted">Las tormentas dañan el casco; si llega a 0, naufragáis. Se repara en el astillero de Puerto Gaviota. Los barcos enemigos y las aletas de Rey Marino se ven en el mapa: si os ven, os persiguen, pero son algo más lentos que vosotros.</p>
     <h3>Mejoras</h3>${Object.keys(UPG).map(k=>`<p>${G.upg.includes(k)?'✔':'✗'} <b>${UPG[k].n}</b>: <span class="muted">${UPG[k].d}</span></p>`).join('')}`}
  if(BT.tab==='tes')return Object.keys(RARES).map(k=>G.rares.includes(k)?`<p>💎 <b>${RARES[k].n}</b>: <span class="muted">${RARES[k].d}</span></p>`:`<p class="lock">💎 ??? <span class="muted">(sin descubrir)</span></p>`).join('')+`<p class="muted" style="margin-top:6px">Fama: ${G.fama>=4?'😇 Queridos':G.fama<=-4?'😈 Temidos':'😐 Desconocidos'} (${G.fama})</p>`;
  if(BT.tab==='diario')return `<h3>Objetivo</h3><p>${G.quest}</p><p class="muted" style="margin-top:8px">La partida se guarda sola en este navegador.</p><button class="plain" style="margin-top:8px;width:auto" onclick="if(window.confirmReset){localStorage.removeItem('mdl_save');location.reload()}else{window.confirmReset=1;this.textContent='Toca otra vez para BORRAR la partida'}">Borrar partida</button>`;
}
function eqTxt(e){return ['hp','atk','def','spd'].filter(s=>e[s]).map(s=>`${e[s]>0?'+':''}${e[s]} ${{hp:'vida',atk:'ataque',def:'defensa',spd:'velocidad'}[s]}`).join(', ')}
function equipMenu(sl){
  const m=G.crew[BT.sel]||G.crew[0],ok=k=>{const e=EQUIP[k];return e.s===sl&&(!e.only||e.only.includes(m.key))&&(!e.not||!e.not.includes(m.key))};
  const opts=G.bag.map((k,i)=>({k,i})).filter(o=>ok(o.k));
  document.getElementById('mbody').innerHTML=`<h3>${SLOT_TXT[sl]} de ${CHARS[m.key].n}</h3>${opts.map(o=>`<button style="margin-top:5px" onclick="doEquip('${sl}',${o.i})">${EQUIP[o.k].n}<small>${eqTxt(EQUIP[o.k])}</small></button>`).join('')||'<p class="muted">No tienes nada que encaje.</p>'}
   ${m.eq[sl]?`<button class="plain" style="margin-top:5px" onclick="doEquip('${sl}',-1)">Quitar ${EQUIP[m.eq[sl]].n}</button>`:''}<button class="plain" style="margin-top:5px" onclick="bitacora()">Volver</button>`;
}
function doEquip(sl,i){const m=G.crew[BT.sel]||G.crew[0];const old=m.eq[sl];if(i>=0){m.eq[sl]=G.bag.splice(i,1)[0]}else m.eq[sl]=null;if(old)G.bag.push(old);m.hp=Math.min(m.hp,stat(m,'hp'));save();sfx('coin');bitacora();refreshHud()}
function learn(id){const m=G.crew[BT.sel]||G.crew[0];if(m.sp<1)return;m.sp--;m.skills.push(id);save();sfx('levelup');bitacora()}
function useOutside(k){const it=ITEMS[k];if(!G.items[k])return;G.items[k]--;if(it.t==='party')G.crew.forEach(m=>m.hp=Math.min(stat(m,'hp'),m.hp+it.heal));else{const m=G.crew.reduce((a,b)=>a.hp/stat(a,'hp')<b.hp/stat(b,'hp')?a:b);m.hp=Math.min(stat(m,'hp'),m.hp+it.heal);toast(`${CHARS[m.key].n} se cura.`)}save();bitacora();refreshHud()}


/* ------------------------------------------------------------------------
   MENÚ DE PAUSA (☰ o tecla Esc / M). Flechas + Enter en ordenador.
   ------------------------------------------------------------------------ */
const MENU_ITEMS=[
 ['crew','👥','Tripulación'],['tec','✨','Técnicas'],['inv','🎒','Inventario'],['quests','📜','Misiones'],['map','🗺️','Mapa'],
 ['tes','💎','Tesoros'],['barco','⛵','Barco'],['save','💾','Guardar'],['opts','⚙️','Opciones'],['title','🏠','Salir al título']];
let PM={open:false,sel:0,view:null};
function openMenu(){if(!G)return;if(PM.open)return closeMenu();sfx('click');PM.open=true;PM.view=null;drawMenuUI()}
function closeMenu(){PM.open=false;PM.view=null;['pov','pmenu','pdetail','bitmodal'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove()})}
function drawMenuUI(){
  ['pov','pmenu','pdetail'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove()});if(!PM.open)return;
  const ov=document.createElement('div');ov.id='pov';ov.className='pov';ov.onclick=closeMenu;stage.appendChild(ov);
  const m=document.createElement('div');m.id='pmenu';m.className='pmenu perg';
  m.innerHTML=MENU_ITEMS.map(([k,ic,n],i)=>`<button class="${PM.sel===i?'sel':''}" onclick="menuPick(${i})" ${menuOff(k)?'disabled':''}><span class="ic">${ic}</span>${n}</button>`).join('');
  stage.appendChild(m);
  if(PM.view){const d=document.createElement('div');d.id='pdetail';d.className='pdetail perg';d.innerHTML=menuView(PM.view);stage.appendChild(d);if(PM.view==='map')drawBigMap()}
}
function menuOff(k){return(B&&(k==='save'||k==='title'))||(k==='map'&&!G.sea)}
function menuPick(i){const k=MENU_ITEMS[i][0];if(menuOff(k))return;PM.sel=i;sfx('click');
  if(k==='close')return closeMenu();
  if(k==='title'){if(PM.view==='title'){closeMenu();save();renderTitle();return}PM.view='title';return drawMenuUI()}
  if(k==='save'){save();PM.view='save';drawMenuUI();toast('💾 Partida guardada');return}
  PM.view=k;BT.tab=k;drawMenuUI()}
function menuView(k){
  if(['crew','tec','inv','barco','tes'].includes(k))return `<h2>${MENU_ITEMS.find(m=>m[0]===k)[2]}</h2><div id="mbody">${bitTab()}</div>`;
  if(k==='quests')return questsView();
  if(k==='map')return `<h2>Carta náutica</h2><canvas id="bigmap" width="540" height="360" style="width:100%;border:2px solid var(--tinta)"></canvas><p class="muted">⛵ Tu barca · ✕ destinos conocidos. Los barcos enemigos solo se ven de cerca.</p>`;
  if(k==='save'){let code='';try{code=btoa(unescape(encodeURIComponent(JSON.stringify(G))))}catch(e){}
    return `<h2>Guardar</h2><p>✔ Partida guardada en este navegador. El juego también guarda solo cada vez que cambias de zona.</p>
     <h3 style="margin-top:12px">Pasar la partida a otro dispositivo</h3><p class="muted">Copia este código y pégalo en el otro dispositivo, en «Importar».</p>
     <textarea class="code" id="expcode" readonly>${code}</textarea><button class="plain" style="margin-top:6px" onclick="copyCode()">📋 Copiar código</button>
     <h3 style="margin-top:12px">Importar partida</h3><textarea class="code" id="impcode" placeholder="Pega aquí el código"></textarea><button class="plain" style="margin-top:6px" onclick="importCode()">📥 Cargar este código</button>`}
  if(k==='opts')return `<h2>Opciones</h2>
     <div class="opt"><span>🎵 Música</span><div class="sw"><button class="${AU.music?'on':''}" onclick="setMusic(true);drawMenuUI()">Sí</button><button class="${AU.music?'':'on'}" onclick="setMusic(false);drawMenuUI()">No</button></div></div>
     <div class="opt"><span>🔊 Efectos de sonido</span><div class="sw"><button class="${AU.sfxOn?'on':''}" onclick="setSfx(true);sfx('coin');drawMenuUI()">Sí</button><button class="${AU.sfxOn?'':'on'}" onclick="setSfx(false);drawMenuUI()">No</button></div></div>
     <div class="opt"><span>💬 Velocidad del texto</span><div class="sw">${[[1,'Lenta'],[2,'Normal'],[5,'Rápida']].map(([v,n])=>`<button class="${TXTSPD===v?'on':''}" onclick="TXTSPD=${v};try{localStorage.setItem('mdl_txt',${v})}catch(e){};drawMenuUI()">${n}</button>`).join('')}</div></div>
     <div class="opt"><span>⌨️ En ordenador</span><span class="muted">Esc o M: menú · flechas + Enter: elegir · Espacio: pasar diálogo</span></div>
     <div class="opt"><span>🗑️ Borrar partida</span><button class="plain" style="width:auto" onclick="if(window.confirmReset){localStorage.removeItem('mdl_save');location.reload()}else{window.confirmReset=1;this.textContent='Toca otra vez para BORRAR'}">Borrar</button></div>`;
  if(k==='title')return `<h2>¿Salir al título?</h2><p>La partida se guarda antes de salir.</p><p class="muted">Vuelve a pulsar «Salir al título» para confirmar.</p>`;
  return '';
}
function copyCode(){const t=document.getElementById('expcode');try{navigator.clipboard.writeText(t.value).then(()=>toast('📋 Código copiado'),()=>{t.select();toast('Selecciona y copia el texto')})}catch(e){t.select()}}
function importCode(){const v=(document.getElementById('impcode').value||'').trim();try{const s=JSON.parse(decodeURIComponent(escape(atob(v))));if(!s||!s.crew)throw 0;localStorage.setItem('mdl_save',JSON.stringify(s));const L=loadSave();if(!L)throw 0;G=L;closeMenu();toast('📥 Partida cargada');back()}catch(e){toast('❌ Ese código no es válido')}}
function questsView(){
  const step=(ok,t)=>`<div class="qrow ${ok?'done':''}"><span class="ck">${ok?'✅':'⬜'}</span><span class="t">${t}</span></div>`;
  return `<h2>Misiones</h2><div class="qrow"><span class="ck">🧭</span><span><b>Ahora:</b> ${G.quest}</span></div>
   ${ARCS.map(a=>`<h3 style="margin-top:10px">${a.n}</h3>${a.pasos.map(([ok,t])=>step(ok(),t)).join('')}`).join('')}
   <h3 style="margin-top:10px">Secundarias</h3>${SIDE_QUESTS.map(q=>q.conocida()?step(q.hecha(),`${q.n} <span class="muted">· ${q.donde}</span>`):`<div class="qrow"><span class="ck">❔</span><span class="muted">??? · explora el mar para descubrirla</span></div>`).join('')}`;
}
function drawBigMap(){const c=document.getElementById('bigmap');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=true;SEEN=new Set(G.sea.seen||[]);x.drawImage(buildWorld(),0,0,540,360);x.drawImage(buildFog(),0,0,540,360);
  const sx=540/SW,sy=360/SH;SEA_ISL.forEach(I=>{if(!I.id)return;if(islKnown(I)){x.font='bold 15px "Baloo 2",sans-serif';x.textAlign='center';x.lineWidth=4;x.strokeStyle='#1b120b';x.strokeText(I.n,I.cx*sx,(I.cy-I.r)*sy);x.fillStyle='#ffe8a3';x.fillText(I.n,I.cx*sx,(I.cy-I.r)*sy)}
    else if(islHinted(I)){x.fillStyle='#9b2226';x.font='bold 26px serif';x.textAlign='center';x.fillText('✕',I.cx*sx,I.cy*sy)}});
  x.fillStyle='#9b2226';x.beginPath();x.arc((G.sea.x+.5)*sx,(G.sea.y+.5)*sy,6,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke()}
function bitacora(tab){if(tab)BT.tab=tab;const i=MENU_ITEMS.findIndex(m=>m[0]===BT.tab);PM.open=true;PM.sel=i<0?0:i;PM.view=BT.tab;drawMenuUI()}
addEventListener('keydown',e=>{
  if(!G)return;const k=e.key;
  if(k==='Escape'||k==='m'||k==='M'){if(PM.open)closeMenu();else if(stage.querySelector('.hud'))openMenu();e.preventDefault();return}
  if(PM.open){if(k==='ArrowDown'){PM.sel=(PM.sel+1)%MENU_ITEMS.length;drawMenuUI();e.preventDefault()}else if(k==='ArrowUp'){PM.sel=(PM.sel+MENU_ITEMS.length-1)%MENU_ITEMS.length;drawMenuUI();e.preventDefault()}else if(k==='Enter'){menuPick(PM.sel);e.preventDefault()}return}
  if((k===' '||k==='Enter')&&SC&&document.getElementById('dlg')){if(SC.i<SC.lines.length||TYPE){advance();e.preventDefault()}}
});
