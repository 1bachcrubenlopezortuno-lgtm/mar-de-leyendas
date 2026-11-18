P='/home/claude/juego/slice/index.html'
s=open(P).read()
def rep(a,b):
    global s
    assert a in s,('NO ENCONTRADO: '+a[:90])
    s=s.replace(a,b,1)

# =========================================================================
# SONIDO: motor Web Audio con música y efectos compuestos para el juego
# =========================================================================
AUDIO=r"""
/* ------------------------------------------------------------------------
   SONIDO · todo sintetizado en el navegador (sin archivos). Música original.
   ------------------------------------------------------------------------ */
const AU={ctx:null,master:null,mus:null,fx:null,noise:null,track:null,want:null,step:0,next:0,timer:null,
  music:true,sfxOn:true};
try{AU.music=localStorage.getItem('mdl_music')!=='0';AU.sfxOn=localStorage.getItem('mdl_sfx')!=='0'}catch(e){}
function auInit(){
  if(AU.ctx||window.SIM)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  const c=new C();AU.ctx=c;AU.master=c.createGain();AU.master.gain.value=.9;AU.master.connect(c.destination);
  AU.mus=c.createGain();AU.mus.gain.value=AU.music?.28:0;AU.mus.connect(AU.master);
  AU.fx=c.createGain();AU.fx.gain.value=AU.sfxOn?.6:0;AU.fx.connect(AU.master);
  const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.noise=b;
  if(AU.want)playMusic(AU.want,true);
}
addEventListener('pointerdown',()=>{auInit();if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume()},{passive:true});
addEventListener('keydown',()=>{auInit();if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume()});
const NOTE={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
function nf(n){const m=n.match(/^([A-G][#b]?)(\d)$/);return 440*Math.pow(2,(NOTE[m[1]]+(+m[2]+1)*12-69)/12)}
function tone(f,dur,type='square',vol=.2,when=0,slide=null,dest){
  const c=AU.ctx;if(!c)return;const t=(when||c.currentTime),o=c.createOscillator(),g=c.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,slide),t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0008,t+dur);
  o.connect(g);g.connect(dest||AU.fx);o.start(t);o.stop(t+dur+.02);
}
function noise(dur,vol=.3,ftype='bandpass',freq=1000,when=0,dest,q=1){
  const c=AU.ctx;if(!c)return;const t=(when||c.currentTime),src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
  src.buffer=AU.noise;f.type=ftype;f.frequency.value=freq;f.Q.value=q;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);
  src.connect(f);f.connect(g);g.connect(dest||AU.fx);src.start(t,Math.random()*.5);src.stop(t+dur+.02);
}
const SFX={
  hit:t=>{noise(.09,.55,'bandpass',900,t);tone(190,.13,'square',.22,t,60)},
  crit:t=>{SFX.hit(t);tone(1320,.09,'square',.14,t+.05);tone(1760,.12,'square',.12,t+.11)},
  slash:t=>{noise(.16,.45,'highpass',2600,t);tone(950,.1,'sawtooth',.08,t,260)},
  shot:t=>{noise(.14,.6,'lowpass',1600,t);noise(.04,.5,'highpass',5000,t)},
  boing:t=>{tone(260,.12,'sine',.3,t,820);tone(820,.16,'sine',.25,t+.12,240)},
  stretch:t=>{tone(200,.25,'square',.12,t,700)},
  heal:t=>{['C5','E5','G5','C6'].forEach((n,i)=>tone(nf(n),.16,'triangle',.22,t+i*.06))},
  buff:t=>{tone(320,.28,'square',.12,t,980);tone(640,.2,'triangle',.1,t+.08,1300)},
  debuff:t=>{tone(700,.3,'sawtooth',.1,t,180)},
  coin:t=>{tone(nf('B5'),.08,'square',.14,t);tone(nf('E6'),.22,'square',.14,t+.08)},
  click:t=>{tone(1100,.035,'square',.07,t)},
  blip:t=>{tone(620+Math.random()*80,.025,'square',.035,t)},
  alert:t=>{tone(nf('A5'),.08,'square',.15,t);tone(nf('D6'),.16,'square',.15,t+.09)},
  levelup:t=>{['C5','E5','G5','C6','E6','G6'].forEach((n,i)=>tone(nf(n),.14,'square',.11,t+i*.07))},
  victory:t=>{[['G4',.12],['C5',.12],['E5',.12],['G5',.3],['E5',.12],['G5',.6]].reduce((acc,[n,d])=>{tone(nf(n),d+.05,'square',.13,t+acc);tone(nf(n)/2,d+.05,'triangle',.18,t+acc);return acc+d},0)},
  defeat:t=>{[['E4',.25],['D4',.25],['C4',.25],['B3',.8]].reduce((acc,[n,d])=>{tone(nf(n),d,'triangle',.22,t+acc);return acc+d},0)},
  thunder:t=>{noise(1.8,.8,'lowpass',260,t);noise(.25,.4,'bandpass',900,t)},
  splash:t=>{noise(.35,.08,'bandpass',700,t,null,.7)},
  step:t=>{noise(.04,.05,'lowpass',600,t)},
  door:t=>{tone(330,.08,'square',.08,t);tone(495,.12,'square',.08,t+.07)}
};
function sfx(name){if(window.SIM||!AU.ctx||!AU.sfxOn)return;try{SFX[name]&&SFX[name](AU.ctx.currentTime)}catch(e){}}
/* --- música: secuenciador sencillo. Notación "Nota/duración" en corcheas, "-" silencio --- */
function seq(str){const out=[];let st=0;str.split(/\s+/).filter(Boolean).forEach(tok=>{if(tok==='|')return;const [n,d]=tok.split('/');const len=+(d||1);if(n!=='-')out.push([st,n,len]);st+=len});return{notes:out,len:st}}
const SONGS={
 sea:{bpm:200,lead:'D4/2 A4 A4/2 G4 F4/2 E4 D4/3 | C4/2 E4 G4/2 A4 G4/2 F4 E4/3 | D4/2 A4 A4/2 G4 F4/2 G4 A4/3 | C5/2 A4 G4/2 E4 D4/6 | F4/2 G4 A4/2 C5 D5/3 C5/3 | A4/2 G4 F4/2 E4 F4/6 | G4/2 A4 Bb4/2 A4 G4/2 F4 E4/3 | F4/2 E4 D4/9',
   bass:'D3/6 A2/6 | C3/6 G2/6 | D3/6 A2/6 | A2/6 D3/6 | Bb2/6 F3/6 | C3/6 F2/6 | G2/6 C3/6 | D3/6 A2/6',drums:'k--h--s--h--',leadType:'triangle',leadVol:.16},
 island:{bpm:236,lead:'E5 G5 C6/2 G5 E5 D5/2 | C5 D5 E5 G5 A5/2 G5/2 | F5 A5 C6/2 A5 F5 E5/2 | D5 E5 F5 D5 G5/4 | E5 G5 C6/2 D6 C6 B5/2 | A5 B5 C6 A5 G5/4 | F5 E5 D5/2 G5 F5 E5/2 | D5 B4 D5 G5 C5/4',
   bass:'C3/2 G3/2 C3/2 G3/2 | A2/2 E3/2 A2/2 E3/2 | F2/2 C3/2 F2/2 C3/2 | G2/2 D3/2 G2/2 B2/2 | C3/2 G3/2 E3/2 G3/2 | F2/2 C3/2 F2/2 A2/2 | D3/2 A2/2 G2/2 D3/2 | G2/2 B2/2 C3/4',drums:'k-h-s-h-',leadType:'square',leadVol:.09},
 battle:{bpm:300,lead:'A4 A4 C5 A4 E5/2 D5 C5 | B4 B4 D5 B4 E5/2 G#4/2 | A4 A4 C5 A4 F5/2 E5 D5 | E5 D5 C5 B4 A4/4 | C5 E5 A5/2 G5 F5 E5/2 | D5 F5 A5/2 G5 E5 C5/2 | B4 D5 G5/2 F5 E5 D5/2 | E5/2 G#4/2 B4/2 E5/2',
   bass:'A2 A2 A3 A2 A2 A2 A3 A2 | E2 E2 E3 E2 E2 E2 E3 E2 | F2 F2 F3 F2 F2 F2 F3 F2 | E2 E2 E3 E2 E2 E2 G#2 E2 | A2 A2 A3 A2 A2 A2 A3 A2 | D2 D2 D3 D2 D2 D2 D3 D2 | G2 G2 G3 G2 G2 G2 G3 G2 | E2 E2 E3 E2 E2 E2 E3 E2',drums:'k-hsk-hs',leadType:'square',leadVol:.09},
 boss:{bpm:320,lead:'E4/2 F4 E4 G4/2 F4 E4 | E4/2 F4 E4 B4/2 A4 G4 | C5/2 B4 A4 G4/2 F4 E4 | F4 E4 D#4 E4 E5/4 | E5/2 D5 C5 B4/2 C5 D5 | E5/2 F5 E5 D5/4 | C5/2 B4 A4 B4/2 G4 F4 | E4 F4 G4 F4 E4/4',
   bass:'E2 E2 E2 E2 E2 E2 F2 E2 | E2 E2 E2 E2 E2 E2 F2 E2 | A1 A1 A1 A1 A1 A1 B1 A1 | C2 C2 C2 C2 B1 B1 B1 B1 | E2 E2 E2 E2 E2 E2 F2 E2 | D2 D2 D2 D2 D2 D2 E2 D2 | A1 A1 A1 A1 A1 A1 B1 A1 | B1 B1 B1 B1 B1 B1 D#2 B1',drums:'k-skk-s-',leadType:'sawtooth',leadVol:.07}
};
Object.values(SONGS).forEach(S=>{S.L=seq(S.lead);S.B=seq(S.bass);S.len=Math.max(S.L.len,S.B.len)});
function playMusic(name,force){
  AU.want=name;if(!AU.ctx||window.SIM)return;if(AU.track===name&&!force)return;
  AU.track=name;AU.step=0;AU.next=AU.ctx.currentTime+.08;
  if(!AU.timer)AU.timer=setInterval(schedMusic,30);
}
function stopMusic(){AU.track=null;AU.want=null}
function schedMusic(){
  const c=AU.ctx;if(!c||!AU.track)return;const S=SONGS[AU.track],dt=60/S.bpm;
  while(AU.next<c.currentTime+.15){
    const st=AU.step%S.len,t=AU.next;
    if(AU.music){
      S.L.notes.forEach(([s0,n,l])=>{if(s0===st){tone(nf(n),l*dt*.92,S.leadType,S.leadVol,t,null,AU.mus);tone(nf(n)*1.005,l*dt*.9,S.leadType,S.leadVol*.35,t+.01,null,AU.mus)}});
      S.B.notes.forEach(([s0,n,l])=>{if(s0===st)tone(nf(n),l*dt*.85,'triangle',.26,t,null,AU.mus)});
      const dch=S.drums[st%S.drums.length];
      if(dch==='k')tone(120,.12,'sine',.5,t,40,AU.mus);
      if(dch==='s')noise(.09,.25,'bandpass',1800,t,AU.mus);
      if(dch==='h')noise(.03,.08,'highpass',7000,t,AU.mus);
    }
    AU.next+=dt;AU.step++;
  }
}
function setMusic(on){AU.music=on;try{localStorage.setItem('mdl_music',on?'1':'0')}catch(e){};if(AU.mus)AU.mus.gain.value=on?.28:0}
function setSfx(on){AU.sfxOn=on;try{localStorage.setItem('mdl_sfx',on?'1':'0')}catch(e){};if(AU.fx)AU.fx.gain.value=on?.6:0}
let TXTSPD=2;try{TXTSPD=+(localStorage.getItem('mdl_txt')||2)}catch(e){}
"""
rep("/* ------------------------------------------------------------------------\n   ESTADO Y GUARDADO",AUDIO+"\n/* ------------------------------------------------------------------------\n   ESTADO Y GUARDADO")

# Enganches de sonido
rep("let n=0;tx.innerHTML='';TYPE=setInterval(()=>{n+=2;tx.innerHTML=t.slice(0,n);if(n>=t.length){clearInterval(TYPE);TYPE=null}},16);",
    "let n=0;tx.innerHTML='';TYPE=setInterval(()=>{n+=TXTSPD;tx.innerHTML=t.slice(0,n);if(n%6<TXTSPD)sfx('blip');if(n>=t.length){clearInterval(TYPE);TYPE=null}},16);")
rep("function choose(i){\n  const c=SC.choices[i];if(!c||!optOK(c)||c.off)return;","function choose(i){\n  const c=SC.choices[i];if(!c||!optOK(c)||c.off)return;sfx('click');")
rep("function act(kind,arg){\n  if(!B)return;const u=B.cur;","function act(kind,arg){\n  if(!B)return;const u=B.cur;sfx('click');")
rep("if(src&&tgt.key==='luffy'&&o.ranged){const d=Math.max(1,Math.round(atkOf(src)*pow));","if(src&&tgt.key==='luffy'&&o.ranged){const d=Math.max(1,Math.round(atkOf(src)*pow));sfx('boing');")
rep("  tgt.hp-=d;fx(tgt,(crit?'¡CRÍTICO! ':'')+'-'+d,crit?'crit':'');","  tgt.hp-=d;fx(tgt,(crit?'¡CRÍTICO! ':'')+'-'+d,crit?'crit':'');sfx(crit?'crit':o.ranged?'shot':src&&['zoro','marine','morgan','helmeppo'].includes(src.key)?'slash':'hit');")
rep("function heal(u,v){const h=Math.min(v,u.max-u.hp);u.hp+=h;fx(u,'+'+h,'heal');","function heal(u,v){const h=Math.min(v,u.max-u.hp);u.hp+=h;fx(u,'+'+h,'heal');sfx('heal');")
rep("function stFx(u,t,cls){const el=uEl(u);if(!el)return;","function stFx(u,t,cls){sfx(cls==='bleed'?'debuff':'buff');const el=uEl(u);if(!el)return;")
rep("function tecPose(u){const el=uEl(u),a=ASSETS[u.key];if(!el||!a||!a.tec)return false;","function tecPose(u){const el=uEl(u),a=ASSETS[u.key];if(!el||!a||!a.tec)return false;sfx('stretch');")
rep("  stopMaps();const snap=JSON.stringify(G);","  stopMaps();const snap=JSON.stringify(G);playMusic(opt.boss||keys.some(k=>FOES[k].elite)?'boss':'battle');")
rep("  const bg=o.bg;B=null;save();","  const bg=o.bg;B=null;save();stopMusic();sfx('victory');later(()=>sfx('coin'),900);if(lines.some(l=>l.includes('sube a nivel')))later(()=>sfx('levelup'),1400);")
rep("function loseBattle(){\n  if(!B)return;const o=B.opt,snap=B.snap,keys=B.keys;B=null;","function loseBattle(){\n  if(!B)return;const o=B.opt,snap=B.snap,keys=B.keys;B=null;stopMusic();sfx('defeat');")
rep("  save();startLoop(drawIsland);if(window.SIM)drawIsland(0);","  save();playMusic('island');startLoop(drawIsland);if(window.SIM)drawIsland(0);")
rep("function renderTitle(){\n  stopMaps();const sv=loadSave();","function renderTitle(){\n  stopMaps();closeMenu();const sv=loadSave();playMusic('sea');")
rep("moveAlong(path,[G.isl.x,G.isl.y],150,(x,y,prev)=>{G.isl.dir=","moveAlong(path,[G.isl.x,G.isl.y],150,(x,y,prev)=>{sfx('step');G.isl.dir=")

# =========================================================================
# MENÚ DE PAUSA (tipo Pokémon)
# =========================================================================
CSS=r"""
/* Menú de pausa */
.menubtn{font-family:'Lilita One';font-size:20px;padding:4px 14px}
.pov{position:absolute;inset:0;background:rgba(18,12,7,.5);z-index:40}
.pmenu{position:absolute;right:12px;top:66px;width:262px;padding:10px;z-index:42;display:flex;flex-direction:column;gap:5px;animation:slidein .18s}
@keyframes slidein{from{transform:translateX(40px);opacity:0}}
.pmenu button{font-family:'Lilita One';font-size:21px;padding:6px 10px 6px 52px;text-align:left}
.pmenu button::before{display:none}
.pmenu button .ic{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:24px;width:32px;text-align:center}
.pmenu button.sel{background:radial-gradient(ellipse,#fff3c4,#ffd166);box-shadow:inset 0 0 0 3px var(--lacre),2px 2px 0 #120c07}
.pmenu button.sel::after{content:'▶';position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--lacre);font-size:16px}
.pdetail{position:absolute;left:12px;top:66px;right:288px;bottom:12px;padding:12px 18px;z-index:42;overflow-y:auto;animation:slidein .18s}
.pdetail h2{margin-bottom:6px}
.qrow{display:flex;gap:10px;align-items:flex-start;padding:5px 0;border-bottom:1px dashed var(--tinta2);font-size:18px}
.qrow .ck{font-size:20px;width:26px;flex:none}
.qrow.done{color:var(--tinta2)}.qrow.done span.t{text-decoration:line-through}
.opt{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px dashed var(--tinta2);font-size:19px;gap:10px}
.sw{display:flex;gap:4px}.sw button{width:auto;padding:4px 12px;font-size:16px}.sw button::before{display:none}.sw button.on{background:var(--lacre);color:var(--perg3)}
textarea.code{width:100%;height:70px;font-family:monospace;font-size:12px;border:2px solid var(--tinta);background:var(--perg3);padding:6px}
"""
rep("</style>",CSS+"</style>")

MENU=r"""
/* ------------------------------------------------------------------------
   MENÚ DE PAUSA (☰ o tecla Esc / M). Flechas + Enter en ordenador.
   ------------------------------------------------------------------------ */
const MENU_ITEMS=[
 ['crew','👥','Tripulación'],['tec','✨','Técnicas'],['inv','🎒','Inventario'],['quests','📜','Misiones'],['map','🗺️','Mapa'],
 ['tes','💎','Tesoros'],['barco','⛵','Barco'],['save','💾','Guardar'],['opts','⚙️','Opciones'],['title','🏠','Salir al título'],['close','✖','Cerrar']];
let PM={open:false,sel:0,view:null};
function openMenu(){if(!G)return;sfx('click');PM.open=true;PM.view=null;drawMenuUI()}
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
  const f=G.f,step=(ok,t)=>`<div class="qrow ${ok?'done':''}"><span class="ck">${ok?'✅':'⬜'}</span><span class="t">${t}</span></div>`;
  const side=[[f.puertoArr,'Las redes del pescador','Puerto Gaviota',f.pesca],[f.isloteArr,'El brillo de la cueva','Islote Calavera',f.cueva],[f.isloteArr,'La botella misteriosa','Islote Calavera',f.botella],[f.puertoArr,'Mejora tu barca en el astillero','Puerto Gaviota',G.upg.length>0]];
  return `<h2>Misiones</h2><div class="qrow"><span class="ck">🧭</span><span><b>Ahora:</b> ${G.quest}</span></div>
   <h3 style="margin-top:10px">Arco 1 · Shells Town</h3>
   ${step(f.provisiones,'Pasa por la taberna de Villa Molino')}${step(f.coby,'Rescata a Coby en alta mar')}${step(f.shellsArr,'Llega a Shells Town')}
   ${step(f.rumor,'Pregunta en el restaurante')}${step(f.stage>=2,'Plántale cara a Helmeppo en el patio')}${step(has('zoro'),'Recupera las espadas de Zoro')}${step(f.arc,'Derrota al capitán Morgan')}
   <h3 style="margin-top:10px">Secundarias</h3>${side.map(([known,t,w,d])=>known?step(d,`${t} <span class="muted">· ${w}</span>`):`<div class="qrow"><span class="ck">❔</span><span class="muted">??? · explora el mar para descubrirla</span></div>`).join('')}`;
}
function drawBigMap(){const c=document.getElementById('bigmap');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=true;SEEN=new Set(G.sea.seen||[]);x.drawImage(buildWorld(),0,0,540,360);x.drawImage(buildFog(),0,0,540,360);
  const sx=540/SW,sy=360/SH;SEA_ISL.forEach(I=>{if(!I.id)return;const known=SEEN.has(Math.round(I.cx)+','+Math.round(I.cy))||SEEN.has(Math.round(I.cx)+','+Math.round(I.cy+I.r*.6));if(known){x.font='bold 15px "Baloo 2",sans-serif';x.textAlign='center';x.lineWidth=4;x.strokeStyle='#1b120b';x.strokeText(I.n,I.cx*sx,(I.cy-I.r)*sy);x.fillStyle='#ffe8a3';x.fillText(I.n,I.cx*sx,(I.cy-I.r)*sy)}
    else if(I.id==='shells'&&G.f.knowShells){x.fillStyle='#9b2226';x.font='bold 26px serif';x.textAlign='center';x.fillText('✕',I.cx*sx,I.cy*sy)}});
  x.fillStyle='#9b2226';x.beginPath();x.arc((G.sea.x+.5)*sx,(G.sea.y+.5)*sy,6,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke()}
function bitacora(tab){if(tab)BT.tab=tab;const i=MENU_ITEMS.findIndex(m=>m[0]===BT.tab);PM.open=true;PM.sel=i<0?0:i;PM.view=BT.tab;drawMenuUI()}
addEventListener('keydown',e=>{
  if(!G)return;const k=e.key;
  if(k==='Escape'||k==='m'||k==='M'){if(PM.open)closeMenu();else if(stage.querySelector('.hud'))openMenu();e.preventDefault();return}
  if(PM.open){if(k==='ArrowDown'){PM.sel=(PM.sel+1)%MENU_ITEMS.length;drawMenuUI();e.preventDefault()}else if(k==='ArrowUp'){PM.sel=(PM.sel+MENU_ITEMS.length-1)%MENU_ITEMS.length;drawMenuUI();e.preventDefault()}else if(k==='Enter'){menuPick(PM.sel);e.preventDefault()}return}
  if((k===' '||k==='Enter')&&SC&&document.getElementById('dlg')){if(SC.i<SC.lines.length||TYPE){advance();e.preventDefault()}}
});
"""
rep("/* ------------------------------------------------------------------------\n   MOTOR DE ESCENAS",MENU+"\n/* ------------------------------------------------------------------------\n   MOTOR DE ESCENAS")
# la bitácora antigua ahora vive dentro del menú: sus funciones internas vuelven a dibujar el menú
rep("function doEquip(sl,i){const m=G.crew[BT.sel]||G.crew[0];const old=m.eq[sl];if(i>=0){m.eq[sl]=G.bag.splice(i,1)[0]}else m.eq[sl]=null;if(old)G.bag.push(old);m.hp=Math.min(m.hp,stat(m,'hp'));save();bitacora();refreshHud()}",
    "function doEquip(sl,i){const m=G.crew[BT.sel]||G.crew[0];const old=m.eq[sl];if(i>=0){m.eq[sl]=G.bag.splice(i,1)[0]}else m.eq[sl]=null;if(old)G.bag.push(old);m.hp=Math.min(m.hp,stat(m,'hp'));save();sfx('coin');bitacora();refreshHud()}")
rep("function learn(id){const m=G.crew[BT.sel]||G.crew[0];if(m.sp<1)return;m.sp--;m.skills.push(id);save();bitacora()}",
    "function learn(id){const m=G.crew[BT.sel]||G.crew[0];if(m.sp<1)return;m.sp--;m.skills.push(id);save();sfx('levelup');bitacora()}")
open(P,'w').write(s)
print('patch audio+menu ok')
