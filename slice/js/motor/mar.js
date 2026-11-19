/* ------------------------------------------------------------------------
   MAR LIBRE: cámara, niebla suave, minimapa y barcos que se ven venir
   ------------------------------------------------------------------------ */
let SEEN=new Set(),FOG=null;
function reveal(cx,cy,r){if(!G.sea.seen)G.sea.seen=[];const s=new Set(G.sea.seen);for(let y=Math.floor(cy-r);y<=cy+r;y++)for(let x=Math.floor(cx-r);x<=cx+r;x++)if(x>=0&&y>=0&&x<SW&&y<SH&&(x-cx)**2+(y-cy)**2<=r*r+1)s.add(x+','+y);G.sea.seen=[...s];SEEN=s;FOG=null}
/* ¿Ya habéis visto esta isla? ¿Está marcada en la carta sin haberla visto? */
function islKnown(I){return SEEN.has(Math.round(I.cx)+','+Math.round(I.cy+I.r*.6))||SEEN.has(Math.round(I.cx)+','+Math.round(I.cy))}
function islHinted(I){const d=I.id&&ISLANDS[I.id];return!!(d&&d.pista&&d.pista()&&!islKnown(I))}
function adjIsland(){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const i=islandAt(G.sea.x+dx,G.sea.y+dy);if(i&&i.id)return i.id}return null}
function buildFog(){const f=document.createElement('canvas');f.width=SW*8;f.height=SH*8;const x=f.getContext('2d');x.fillStyle='#d8c290';x.fillRect(0,0,f.width,f.height);
  x.globalCompositeOperation='destination-out';SEEN.forEach(k=>{const [a,b]=k.split(',').map(Number),cx=a*8+4,cy=b*8+4,g=x.createRadialGradient(cx,cy,0,cx,cy,13);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.5,'rgba(0,0,0,.85)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(cx-13,cy-13,26,26)});
  x.globalCompositeOperation='source-over';FOG=f;return f}
function renderSea(){
  G.mode='sea';MV=null;SEEN=new Set(G.sea.seen||[]);FOG=null;initEnts();const near=adjIsland();
  stage.innerHTML=`<canvas id="cv" width="${W}" height="${H}"></canvas><canvas id="mini" width="180" height="120"></canvas>${hud()}
   <div class="quest perg">🧭 ${G.quest}</div>${near?`<button class="primary mapbtn" onclick="land('${near}')">⚓ Desembarcar en ${ISLANDS[near].n}</button>`:''}`;
  const cv=document.getElementById('cv');cv.onclick=e=>{const [x,y]=tapTile(e,cv);sailTo(x,y)};
  buildWorld();drawMini();save();playMusic('sea');startLoop(drawSea);if(window.SIM)drawSea(0);
}
function drawMini(){const m=document.getElementById('mini');if(!m)return;const x=m.getContext('2d');x.imageSmoothingEnabled=true;x.drawImage(buildWorld(),0,0,180,120);x.drawImage(FOG||buildFog(),0,0,180,120);
  const sx=180/SW,sy=120/SH;x.fillStyle='#9b2226';x.beginPath();x.arc((G.sea.x+.5)*sx,(G.sea.y+.5)*sy,3.5,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=1;x.stroke();
  SEA_ISL.forEach(I=>{if(islHinted(I)){x.fillStyle='#9b2226';x.font='bold 14px serif';x.textAlign='center';x.fillText('✕',I.cx*sx,(I.cy+1)*sy)}})}
function drawBoat(x,cx,cy,face,kind,now){
  x.save();x.translate(cx,cy+Math.sin(now/280+cx)*2);x.scale(face,1);
  x.fillStyle='rgba(255,255,255,.45)';x.beginPath();x.ellipse(0,16,30,6,0,0,7);x.fill();
  x.fillStyle=kind==='marina'?'#e9eef3':'#5a3a22';x.beginPath();x.moveTo(-28,4);x.lineTo(28,4);x.lineTo(20,16);x.lineTo(-20,16);x.closePath();x.fill();x.strokeStyle='#2b1d12';x.lineWidth=2;x.stroke();
  if(kind==='marina'){x.fillStyle='#3a6ea5';x.fillRect(-24,8,48,3)}
  x.fillStyle='#3b2a14';x.fillRect(-2,-36,4,40);
  x.fillStyle=kind==='marina'?'#f7f7f7':'#1f1a17';x.beginPath();x.moveTo(-20,-32);x.lineTo(18,-32);x.quadraticCurveTo(22,-14,18,0);x.lineTo(-20,0);x.quadraticCurveTo(-16,-16,-20,-32);x.fill();x.strokeStyle='#2b1d12';x.lineWidth=1.5;x.stroke();
  if(kind==='marina'){x.fillStyle='#3a6ea5';x.beginPath();x.moveTo(-8,-18);x.quadraticCurveTo(0,-26,8,-18);x.quadraticCurveTo(0,-22,-8,-18);x.fill()}
  else{x.fillStyle='#f3f3f3';x.beginPath();x.arc(0,-18,6,0,7);x.fill();x.fillStyle='#1f1a17';x.fillRect(-3,-19,2,2);x.fillRect(1,-19,2,2);x.strokeStyle='#f3f3f3';x.lineWidth=2;x.beginPath();x.moveTo(-9,-8);x.lineTo(9,-4);x.moveTo(9,-8);x.lineTo(-9,-4);x.stroke()}
  x.restore();
}
function drawFin(x,cx,cy,now){const o=Math.sin(now/400)*3;x.save();x.translate(cx+o,cy);x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;for(let k=0;k<3;k++){x.beginPath();x.ellipse(0,10,14+k*7,4+k*2,0,0,7);x.globalAlpha=.6-k*.18;x.stroke()}x.globalAlpha=1;
  x.fillStyle='#3c5a6e';x.beginPath();x.moveTo(-10,10);x.quadraticCurveTo(-2,-18,10,-14);x.quadraticCurveTo(4,0,10,10);x.closePath();x.fill();x.strokeStyle='#1b2a33';x.lineWidth=2;x.stroke();x.restore()}
function drawBarrel(x,cx,cy,now){const b=Math.sin(now/300+cx)*2;x.save();x.translate(cx,cy+b);x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.ellipse(0,8,14,4,0,0,7);x.fill();x.fillStyle='#8d5524';x.beginPath();x.ellipse(0,0,10,12,0,0,7);x.fill();x.strokeStyle='#3b2a14';x.lineWidth=2;x.stroke();x.beginPath();x.moveTo(-10,-4);x.lineTo(10,-4);x.moveTo(-10,4);x.lineTo(10,4);x.stroke();x.restore()}
function drawSea(now){
  const cv=document.getElementById('cv');if(!cv)return;const x=cv.getContext('2d');
  const pos=mvPos(now,{x:G.sea.x,y:G.sea.y})||{x:G.sea.x,y:G.sea.y};
  camTo(pos.x*TS+TS/2,pos.y*TS+TS/2,SW*TS,SH*TS);
  x.fillStyle='#16466f';x.fillRect(0,0,W,H);
  x.save();x.translate(-Math.round(CAM.x),-Math.round(CAM.y));
  x.imageSmoothingEnabled=true;x.drawImage(buildWorld(),0,0,SW*TS,SH*TS);
  const y0=Math.max(0,Math.floor(CAM.y/TS)),y1=Math.min(SH,Math.ceil((CAM.y+H)/TS)+1),x0=Math.max(0,Math.floor(CAM.x/TS)),x1=Math.min(SW,Math.ceil((CAM.x+W)/TS)+1);
  // brillos de olas
  x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=2;x.lineCap='round';
  for(let j=y0;j<y1;j++)for(let i=x0;i<x1;i++){const c=SEA[j][i];if(c.t==='L')continue;const ph=(now/1600+hash(i,j,21))%1;if(ph>.5)continue;
    const a=Math.sin(ph/.5*Math.PI),X=i*TS+hash(i,j,22)*30+6,Y=j*TS+hash(j,i,23)*30+10;x.globalAlpha=a*.7;x.beginPath();x.moveTo(X,Y);x.quadraticCurveTo(X+6,Y-4,X+12,Y);x.stroke()}
  x.globalAlpha=1;
  // corrientes
  for(let j=y0;j<y1;j++)for(let i=x0;i<x1;i++){const t=SEA[j][i].t;if(t!=='>'&&t!=='v')continue;const X=i*TS,Y=j*TS,o=(now/14+i*13+j*7)%TS;x.strokeStyle='rgba(215,240,255,.75)';x.lineWidth=3;x.beginPath();
    if(t==='>'){x.moveTo(X+o-16,Y+16);x.lineTo(X+o,Y+16);x.moveTo(X+(o+24)%TS-16,Y+32);x.lineTo(X+(o+24)%TS,Y+32)}else{x.moveTo(X+16,Y+o-16);x.lineTo(X+16,Y+o);x.moveTo(X+32,Y+(o+24)%TS-16);x.lineTo(X+32,Y+(o+24)%TS)}x.stroke()}
  // tormenta
  const scx=STORM.cx*TS,scy=STORM.cy*TS,g=x.createRadialGradient(scx,scy,40,scx,scy,STORM.rx*TS*1.1);g.addColorStop(0,'rgba(25,28,48,.55)');g.addColorStop(.75,'rgba(25,28,48,.4)');g.addColorStop(1,'rgba(25,28,48,0)');
  x.fillStyle=g;x.beginPath();x.ellipse(scx,scy,STORM.rx*TS*1.15,STORM.ry*TS*1.25,0,0,7);x.fill();
  x.strokeStyle='rgba(200,215,255,.45)';x.lineWidth=1.5;for(let k=0;k<70;k++){const rx=scx+(hash(k,1,31)-.5)*STORM.rx*2*TS,ry=scy+(((now/3+hash(k,2,31)*900)%(STORM.ry*2*TS))-STORM.ry*TS);x.beginPath();x.moveTo(rx,ry);x.lineTo(rx-4,ry+14);x.stroke()}
  if((now%4200)<120){x.fillStyle='rgba(255,255,235,.28)';x.beginPath();x.ellipse(scx,scy,STORM.rx*TS,STORM.ry*TS,0,0,7);x.fill()}
  // entidades del mar
  (G.sea.ents||[]).forEach(e=>{if(e.gone||!SEEN.has(e.x+','+e.y))return;const ex=e.x*TS+TS/2,ey=e.y*TS+TS/2;
    if(e.k==='barril')drawBarrel(x,ex,ey,now);else if(e.k==='rey')drawFin(x,ex,ey,now);else drawBoat(x,ex,ey,e.face||1,e.k,now);
    if(e.alert&&now-e.alert<1500&&e.alert<=now){x.font='bold 30px "Lilita One",sans-serif';x.textAlign='center';x.lineWidth=5;x.strokeStyle='#1b120b';x.strokeText('!',ex,ey-44);x.fillStyle='#ffd166';x.fillText('!',ex,ey-44)}});
  // barco
  drawShip(x,pos.x*TS+TS/2,pos.y*TS+TS/2+Math.sin(now/300)*2,G.sea.face||1,now,pos.moving);
  // niebla suave
  x.imageSmoothingEnabled=true;x.drawImage(FOG||buildFog(),0,0,SW*TS,SH*TS);
  // nombres
  SEA_ISL.forEach(I=>{if(!I.id)return;
    if(islKnown(I))drawLabel(x,I.n,I.cx*TS,(I.cy-I.r*1.05)*TS,'#ffe8a3');
    else if(islHinted(I)){x.font='bold 46px "Lilita One",serif';x.fillStyle='#9b2226';x.textAlign='center';x.fillText('✕',I.cx*TS,I.cy*TS);drawLabel(x,`¿${I.n}?`,I.cx*TS,I.cy*TS+30,'#ffe8a3')}});
  x.restore();
}
let SHIPHIT=0;
function drawShip(x,cx,cy,face,now,moving){
  // barca de Rubén: 0 quieta, 1-2 balanceo navegando, 3 golpe (tormenta)
  const fr=SHIPHIT>performance.now()?3:moving?1+Math.floor(now/260)%2:(Math.floor(now/800)%2?0:1),im=imgObj(`sprites/barco_${fr}.png`);
  if(im.complete&&im.naturalWidth){const S=100;x.save();x.translate(cx,0);x.scale(face,1);x.drawImage(im,-S/2,cy+24-S,S,S);x.restore();return}
  drawBoat(x,cx,cy,face,'pirata',now);
}
function sailTo(tx,ty){
  if(MV||G.mode!=='sea')return;
  const isl=islandAt(tx,ty);
  if(isl||!seaWalk(tx,ty)){if(isl&&isl.id&&adjIsland()===isl.id)return land(isl.id);
    let best=null;for(let y=ty-7;y<=ty+7;y++)for(let x=tx-7;x<=tx+7;x++)if(seaWalk(x,y)){const d=Math.hypot(x-tx,y-ty);if(!best||d<best[2])best=[x,y,d]}
    if(!best)return;tx=best[0];ty=best[1]}
  const path=(seaT(tx,ty)!=='s'&&bfs(SW,SH,(x,y)=>seaWalk(x,y)&&seaT(x,y)!=='s',G.sea.x,G.sea.y,tx,ty))||bfs(SW,SH,(x,y)=>seaWalk(x,y),G.sea.x,G.sea.y,tx,ty);if(!path||!path.length)return;
  moveAlong(path,[G.sea.x,G.sea.y],190,(x,y,prev)=>{G.sea.face=x<prev[0]?-1:x>prev[0]?1:G.sea.face;G.sea.x=x;G.sea.y=y;const ev=seaStep();drawMini();refreshHud();
      if(ev){MV=null;save();later(ev,120);return true}return false},
    ()=>{save();renderSea()});
}
/* --- barcos enemigos, Rey Marino y barriles: se ven en el mapa y se pueden esquivar --- */
function randWater(minDist,cond){for(let k=0;k<400;k++){const x=ri(1,SW-2),y=ri(1,SH-2);if(!seaWalk(x,y)||SEA[y][x].d<1.5)continue;if(Math.hypot(x-G.sea.x,y-G.sea.y)<minDist)continue;if(cond&&!cond(x,y))continue;return[x,y]}return[30,12]}
function spawnEnt(k){const [x,y]=randWater(12,k==='rey'?isDeep:null);return{k,x,y,hx:x,hy:y,cd:0,face:1,gone:false,back:0}}
function initEnts(){if(G.sea.ents)return;G.sea.ents=[spawnEnt('pirata'),spawnEnt('pirata'),spawnEnt('marina'),spawnEnt('marina'),spawnEnt('rey'),spawnEnt('barril'),spawnEnt('barril'),spawnEnt('barril')]}
function entStep(){
  const ents=G.sea.ents||[],px=G.sea.x,py=G.sea.y;
  for(const e of ents){
    if(e.gone){if(--e.back<=0){Object.assign(e,spawnEnt(e.k))}continue}
    if(e.k==='barril')continue;
    if(e.cd>0){e.cd--;continue}
    const dist=Math.hypot(e.x-px,e.y-py),chase=dist<=(e.k==='rey'?4:5)&&!adjIsland();
    if(chase&&!e.alert){e.alert=performance.now();sfx('alert')}
    if(!chase)e.alert=0;
    if(chase&&(G.sea.steps%3===2))continue; // van algo más lentos que tú: se les puede dar esquinazo
    let best=null;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=e.x+dx,ny=e.y+dy;if(!seaWalk(nx,ny))continue;if(e.k==='rey'&&!isDeep(nx,ny))continue;
      const sc=chase?Math.hypot(nx-px,ny-py):Math.hypot(nx-e.hx,ny-e.hy)>6?Math.hypot(nx-e.hx,ny-e.hy):rand()*6;if(!best||sc<best[2])best=[nx,ny,sc,dx]}
    if(best){e.x=best[0];e.y=best[1];if(best[3])e.face=best[3]}
  }
  if(!REGLAS.encuentrosMar())return null;
  for(const e of ents){if(e.gone||e.cd>0)continue;if(Math.max(Math.abs(e.x-px),Math.abs(e.y-py))<=1){return ()=>encounter(e)}}
  return null;
}
function seaStep(){
  const s=G.ship,sea=G.sea;sea.steps++;reveal(sea.x,sea.y,4);
  if(sea.steps%4===0)sfx('splash');
  const c=seaT(sea.x,sea.y);
  if(c==='s'){const d=G.upg.includes('velas')?1:3;s.casco-=d;SHIPHIT=performance.now()+600;sfx('thunder');toast(`⛈ ¡Tormenta! El casco pierde ${d}.`)}
  if(s.casco<=0)return naufragio;
  if(c==='>'||c==='v'){const [dx,dy]=c==='>'?[1,0]:[0,1];if(seaWalk(sea.x+dx,sea.y+dy)){sea.x+=dx;sea.y+=dy;reveal(sea.x,sea.y,4);toast('🌊 ¡Una corriente os arrastra!')}}
  for(const h of HOOKS.seaStep){const ev=h();if(ev)return ev} // eventos de historia (contenido/*/arco.js)
  return entStep();
}
function islStart(id){const I=ISLANDS[id];let p=[10,I.map.length-3];I.map.forEach((row,y)=>{const x=row.indexOf('m');if(x>=0)p=[x,y-1]});return p}
function land(id){
  MV=null;sfx('door');const p=islStart(id);G.isl={id,x:p[0],y:p[1],face:1};G.mode='island';
  const I=ISLANDS[id];if(I.arrive&&I.arrive())return; // escena de llegada propia de la isla
  renderIsland();
}
function shipToDock(id){const d=dockOf(id);G.sea.x=d[0];G.sea.y=d[1];reveal(d[0],d[1],4)}
function naufragio(){
  G.ship.casco=15;G.berries=Math.floor(G.berries/2);const id=G.lastIsl||'villa';const p=islStart(id);G.isl={id,x:p[0],y:p[1],face:1};shipToDock(id);G.mode='island';
  scene({bg:'tormenta',lines:[['narr','El casco cruje, el agua entra a chorros... ¡el barco se hunde!'],['narr',`Despertáis en la playa de ${ISLANDS[id].n}, con medio botín menos y el barco remendado de mala manera.`],['luffy','...¡Tengo hambre!']],next:renderIsland});
}
