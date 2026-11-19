/* ------------------------------------------------------------------------
   LEYENDA DE LOS MAPAS DE ISLA (20 de ancho)
   . arena  , hierba  F flores  # camino  = muelle  T árbol  Y palmera
   H casa   B muralla  R acantilado  ~ agua
   minúsculas = lugares (poi de la isla). 'm' es siempre el muelle y marca
   dónde aparece Luffy al desembarcar.
   ------------------------------------------------------------------------ */
function tileAt(I,x,y){return(I.map[y]||'')[x]||'~'}
function npcAt(I,x,y){return(I.npc||[]).find(n=>n.x===x&&n.y===y)}
const islWalk=(I,x,y)=>{const c=tileAt(I,x,y);return(c==='.'||c===','||c==='#'||c==='='||c==='F'||/[a-z]/.test(c))&&!npcAt(I,x,y)};
/* ------------------------------------------------------------------------
   ISLAS (paseo con cámara)
   ------------------------------------------------------------------------ */
function renderIsland(){
  const I=ISLANDS[G.isl.id];G.mode='island';G.lastIsl=G.isl.id;MV=null;
  stage.innerHTML=`<canvas id="cv" width="${W}" height="${H}"></canvas>${hud()}<div class="quest perg">🧭 ${G.quest}</div><div class="abs perg" style="right:10px;bottom:10px;padding:4px 12px;font-size:16px;z-index:9" class="muted">${I.n} · toca para caminar</div>`;
  const cv=document.getElementById('cv');cv.onclick=e=>{const [x,y]=tapTile(e,cv);walkTo(x,y)};
  save();playMusic('island');startLoop(drawIsland);if(window.SIM)drawIsland(0);
}
function drawIsland(now){
  const cv=document.getElementById('cv');if(!cv)return;const x=cv.getContext('2d'),I=ISLANDS[G.isl.id];x.imageSmoothingEnabled=false;
  const pos=mvPos(now,{x:G.isl.x,y:G.isl.y})||{x:G.isl.x,y:G.isl.y};
  const ww=IW*TS,wh=I.map.length*TS;camTo(pos.x*TS+TS/2,pos.y*TS+TS/2,ww,wh);
  x.fillStyle='#1d4f86';x.fillRect(0,0,W,H);
  x.save();x.translate(-Math.round(CAM.x),-Math.round(CAM.y));
  const wf=Math.floor(now/400)%4;
  const y0=Math.max(-2,Math.floor(CAM.y/TS)-1),y1=Math.min(I.map.length+2,Math.ceil((CAM.y+H)/TS)+1),x0=Math.max(-2,Math.floor(CAM.x/TS)-1),x1=Math.min(IW+2,Math.ceil((CAM.x+W)/TS)+1);
  const land=c=>c!=='~';
  for(let j=y0;j<y1;j++)for(let i=x0;i<x1;i++){
    const c=tileAt(I,i,j),X=i*TS,Y=j*TS,d=t=>x.drawImage(TX[t],X,Y,TS,TS);
    if(c==='~'){const nl=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>land(tileAt(I,i+a,j+b)));d((nl?'shal':'water')+wf);
      x.fillStyle='rgba(255,255,255,.75)';if(land(tileAt(I,i,j-1)))x.fillRect(X,Y,TS,4+((wf%2)?2:0));if(land(tileAt(I,i,j+1)))x.fillRect(X,Y+TS-4,TS,4);if(land(tileAt(I,i-1,j)))x.fillRect(X,Y,4,TS);if(land(tileAt(I,i+1,j)))x.fillRect(X+TS-4,Y,4,TS);continue}
    if(c==='.')d('sand');else if(c===','||c==='T')d(c==='T'?'tree':'grass');else if(c==='F')d('flower');else if(c==='#')d('path');else if(c==='=')d('dock');else if(c==='Y')d('palm');
    else if(c==='R')d('cliff');
    else if(c==='H'){const below=tileAt(I,i,j+1);d(below==='H'||/[a-z]/.test(below)&&tileAt(I,i,j+2)!=='~'&&false?'roof':below==='H'?'roof':'wall')}
    else if(c==='B'){const below=tileAt(I,i,j+1);d(below==='B'?'stone':'stoneF')}
    else if(/[a-z]/.test(c)){const above=tileAt(I,i,j-1);
      const tl=(I.poi[c]||{}).tile;
      if(tl==='dock'){d('dock')}else if(tl==='cave'){d('cave')}else if(tl==='botella'){d('sand');x.fillStyle='#4a7c59';x.fillRect(X+18,Y+16,10,18);x.fillStyle='#f3e6c4';x.fillRect(X+20,Y+20,6,6)}
      else if(above==='B'){d('doorS')}else d('door')}
    else d('sand');
  }
  // tejados por encima (filas superiores de casas)
  for(let j=y0;j<y1;j++)for(let i=x0;i<x1;i++){const c=tileAt(I,i,j);if(c==='H'&&tileAt(I,i,j+1)==='H')x.drawImage(TX.roof,i*TS,j*TS,TS,TS)}
  for(let j=0;j<I.map.length;j++)for(let i=0;i<IW;i++){const c=tileAt(I,i,j);if(/[a-z]/.test(c)){const px=i*TS+TS/2,py=j*TS-6+Math.sin(now/350+i)*3;
    x.fillStyle='#f3e6c4';x.strokeStyle='#3b2a14';x.lineWidth=2;x.beginPath();x.arc(px,py-10,15,0,7);x.fill();x.stroke();x.font='18px serif';x.textAlign='center';const P=I.poi[c]||{n:'',ico:'❗'};x.fillText(P.ico||'❗',px,py-3);drawLabel(x,P.n,px,j*TS+TS+16)}}
  // personajes y lugares ordenados por y
  const ents=[];
  (I.npc||[]).forEach(n=>ents.push({y:n.y,draw:()=>{const px=n.x*TS+TS/2,py=n.y*TS+TS;drawShadow(x,px,py-4,16);const b=Math.sin(now/300+n.x)*1.5;
    if(ASSETS[n.k]){const im=imgObj(ASSETS[n.k].idle[Math.floor(now/520+n.x)%2]);if(im.complete&&im.naturalWidth){x.save();x.translate(px,0);x.scale(-1,1);x.drawImage(im,-44,py-90,88,88);x.restore()}}
    else x.drawImage(sprCanvas(n.k),px-28,py-58+b,56,56)}}));
  // Luffy: andando usa la tira de caminar; parado, su animación de reposo (de lado) o respiración (de frente/espaldas)
  const dir=G.isl.dir||'down',side=dir==='left'||dir==='right';let im,br=0;
  if(pos.moving){const fr=WALK[side?'right':dir];im=imgObj(walkSrc(fr[Math.floor(now/120)%fr.length]))}
  else{im=imgObj(ASSETS.luffy.idle[Math.floor(now/480)%2])} // parado: siempre de perfil
  ents.push({y:pos.y,draw:()=>{const px=pos.x*TS+TS/2,py=pos.y*TS+TS;drawShadow(x,px,py-4,18+br);
    const S=pos.moving?84:92,h=S*(1+.035*br),w=S*(1-.02*br);
    if(im.complete&&im.naturalWidth){x.save();if(pos.moving?dir==='left':(G.isl.face||1)<0){x.translate(px,0);x.scale(-1,1);x.drawImage(im,-w/2,py-2-h,w,h)}else x.drawImage(im,px-w/2,py-2-h,w,h);x.restore()}}});
  ents.sort((a,b)=>a.y-b.y).forEach(e=>e.draw());
  x.restore();
}
function walkTo(tx,ty){
  if(MV||!G||G.mode!=='island')return;const I=ISLANDS[G.isl.id];
  const npc=npcAt(I,tx,ty);let target=[tx,ty];
  if(npc){let best=null;for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]){const nx=tx+dx,ny=ty+dy;if(islWalk(I,nx,ny)&&!/[a-z]/.test(tileAt(I,nx,ny))){const p=nx===G.isl.x&&ny===G.isl.y?[]:bfs(IW,I.map.length,(a,b)=>islWalk(I,a,b)&&!/[a-z]/.test(tileAt(I,a,b)),G.isl.x,G.isl.y,nx,ny);if(p&&(!best||p.length<best.length))best=p}}
    if(!best)return;if(!best.length)return talkNpc(npc);
    return moveAlong(best,[G.isl.x,G.isl.y],150,(x,y,prev)=>{G.isl.dir=x<prev[0]?'left':x>prev[0]?'right':y<prev[1]?'up':'down';if(x!==prev[0])G.isl.face=x<prev[0]?-1:1;G.isl.x=x;G.isl.y=y;return false},()=>{save();talkNpc(npc)})}
  if(!islWalk(I,tx,ty))return;
  const path=bfs(IW,I.map.length,(x,y)=>islWalk(I,x,y)&&!/[a-z]/.test(tileAt(I,x,y)),G.isl.x,G.isl.y,tx,ty);if(!path||!path.length)return;
  moveAlong(path,[G.isl.x,G.isl.y],150,(x,y,prev)=>{sfx('step');G.isl.dir=x<prev[0]?'left':x>prev[0]?'right':y<prev[1]?'up':'down';if(x!==prev[0])G.isl.face=x<prev[0]?-1:1;const c=tileAt(I,x,y);
      if(/[a-z]/.test(c)){MV=null;save();later(()=>poi(G.isl.id,c),60);return true}
      G.isl.x=x;G.isl.y=y;return false},()=>save());
}
function talkNpc(n){scene({bg:ISLANDS[G.isl.id].bg||'pueblo',place:ISLANDS[G.isl.id].n,right:[n.k],lines:n.l()})}
