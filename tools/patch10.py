import re,sys
P='/home/claude/juego/slice/index.html'
s=open(P).read()
def rep(a,b,count=1):
    global s
    assert a in s,('NO ENCONTRADO: '+a[:90])
    s=s.replace(a,b) if count==0 else s.replace(a,b,count)
def between(start,end,new):
    global s
    i=s.index(start);j=s.index(end,i)
    s=s[:i]+new+s[j:]

# =========================================================================
# 1) MUNDO DEL MAR NUEVO (60x40, islas orgánicas grandes)
# =========================================================================
between("/* ------------------------------------------------------------------------\n   MAR (40 x 26)",
        "/* ------------------------------------------------------------------------\n   ISLAS (20 de ancho)",
r"""/* ------------------------------------------------------------------------
   MAR: mundo de 60x40 casillas. Las islas son formas orgánicas grandes y el
   dibujo del mar se genera una vez (suave, sin pixelar) y se anima encima.
   ------------------------------------------------------------------------ */
const SW=60,SH=40;
const SEA_ISL=[
 {id:'villa',n:'Villa Molino',cx:9,cy:8,r:5.2,seed:1,town:'villa'},
 {id:'puerto',n:'Puerto Gaviota',cx:50,cy:7.5,r:4.8,seed:2,town:'puerto'},
 {id:'shells',n:'Shells Town',cx:46,cy:30,r:6.2,seed:3,town:'shells'},
 {id:'islote',n:'Islote Calavera',cx:11,cy:31,r:3.8,seed:4,town:'islote'},
 {id:null,cx:29,cy:6,r:2.2,seed:5},{id:null,cx:33,cy:35,r:2.6,seed:6},{id:null,cx:21,cy:23,r:1.8,seed:7},{id:null,cx:56,cy:19,r:2,seed:8},{id:null,cx:3.5,cy:19,r:1.6,seed:9}
];
function islR(I,a){return I.r*(1+.16*Math.sin(3*a+I.seed*1.7)+.09*Math.sin(5*a+I.seed*3.1)+.05*Math.sin(9*a+I.seed))}
function islD(I,x,y){const dx=x-I.cx,dy=(y-I.cy)*1.2;return Math.hypot(dx,dy)/islR(I,Math.atan2(dy,dx))}
function landD(x,y){let best=9,bi=null;for(const I of SEA_ISL){if(Math.abs(x-I.cx)>I.r*1.9||Math.abs(y-I.cy)>I.r*1.7)continue;const d=islD(I,x,y);if(d<best){best=d;bi=I}}return[best,bi]}
const ROCKS=[[17,15],[38,11],[53,25],[26,32],[6,24],[40,37],[35,21],[22,9]];
const STORM={cx:30,cy:19,rx:7,ry:4.2};
const ISLANDS_N={villa:'Villa Molino',puerto:'Puerto Gaviota',shells:'Shells Town',islote:'Islote Calavera'};
const isDeep=(x,y)=>y>=26&&x<30;
let SEA=null;
function genSea(){
  SEA=[];for(let y=0;y<SH;y++){const row=[];for(let x=0;x<SW;x++){
    const [d,I]=landD(x+.5,y+.5);let t='~',isl=null;
    if(d<1){t='L';isl=I}
    else if(ROCKS.some(([a,b])=>a===x&&b===y))t='X';
    else if(((x+.5-STORM.cx)/STORM.rx)**2+((y+.5-STORM.cy)/STORM.ry)**2<=1)t='s';
    else if(y===14&&x>=12&&x<=22)t='>';
    else if(x===27&&y>=25&&y<=32)t='v';
    row.push({t,isl,d});}SEA.push(row)}
}
function seaT(x,y){return x<0||y<0||x>=SW||y>=SH?'X':SEA[y][x].t}
function seaWalk(x,y){const t=seaT(x,y);return t!=='L'&&t!=='X'}
function islandAt(x,y){return x<0||y<0||x>=SW||y>=SH?null:SEA[y][x].isl}
genSea();
function dockOf(id){const I=SEA_ISL.find(i=>i.id===id);let best=null;for(let y=0;y<SH;y++)for(let x=0;x<SW;x++){if(!seaWalk(x,y))continue;let adj=false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const i=islandAt(x+dx,y+dy);if(i&&i.id===id)adj=true}if(!adj)continue;const d=Math.hypot(x-I.cx,y-(I.cy+I.r*.8));if(!best||d<best[2])best=[x,y,d]}return best}
/* ruido suave para texturas */
function vnoise(x,y,s=0){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=hash(xi,yi,s),b=hash(xi+1,yi,s),c=hash(xi,yi+1,s),d=hash(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const mix=(a,b,t)=>a+(b-a)*t;
function mixC(c1,c2,t){return[mix(c1[0],c2[0],t),mix(c1[1],c2[1],t),mix(c1[2],c2[2],t)]}
let WORLD=null; // lienzo con el mar y las islas ya dibujados (a media resolución)
function buildWorld(){
  if(WORLD)return WORLD;
  const SC=2,w=SW*TS/SC,h=SH*TS/SC,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  const im=x.createImageData(w,h),D=im.data,pt=TS/SC;
  const DEEP=[22,74,128],MID=[35,105,165],SHAL=[70,165,210],FOAM=[236,247,252],WET=[214,190,128],SAND=[236,214,160],GR1=[106,170,78],GR2=[78,140,60],FOR=[52,112,52],ROCK=[136,128,116];
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const X=i/pt,Y=j/pt,[d,I]=landD(X,Y),n=vnoise(X*1.3,Y*1.3,3),n2=vnoise(X*4,Y*4,5);let col;
    if(d<1){
      if(d>.9)col=mixC(SAND,WET,clamp((d-.9)/.1,0,1)*.8);
      else if(I&&I.town==='islote'&&d<.82)col=mixC(ROCK,GR2,n*.6);
      else{col=d>.84?mixC(SAND,GR1,(.9-d)/.06):mixC(GR1,GR2,n);if(n2>.62&&d<.72)col=mixC(col,FOR,.7)}
      const sh=.92+n2*.12;col=[col[0]*sh,col[1]*sh,col[2]*sh];
    }else{
      const near=clamp((d-1)/.55,0,1);col=mixC(SHAL,MID,near);
      const far=clamp((d-1.5)/1.2,0,1);col=mixC(col,DEEP,far);
      if(isDeep(X,Y))col=mixC(col,[18,52,98],.45);
      col=mixC(col,[255,255,255],(n-.5)*.08);
      if(d<1.045)col=mixC(col,FOAM,1-(d-1)/.045);
    }
    const k=(j*w+i)*4;D[k]=col[0];D[k+1]=col[1];D[k+2]=col[2];D[k+3]=255;
  }
  x.putImageData(im,0,0);
  const P=(wx,wy)=>[wx*pt,wy*pt];
  // rocas en el mar
  ROCKS.forEach(([a,b])=>{const [px,py]=P(a+.5,b+.5);x.fillStyle='rgba(255,255,255,.6)';x.beginPath();x.ellipse(px,py+4,13,6,0,0,7);x.fill();x.fillStyle='#6f6a63';x.beginPath();x.ellipse(px,py,10,8,0,0,7);x.fill();x.fillStyle='#8f8a82';x.beginPath();x.ellipse(px-3,py-3,5,3,0,0,7);x.fill()});
  // árboles y palmeras (deterministas)
  for(let j=0;j<h;j+=5)for(let i=0;i<w;i+=5){const X=i/pt,Y=j/pt,[d,I]=landD(X,Y);if(!I||d>=1)continue;const r=hash(i,j,11);
    if(I.town&&Math.hypot(X-I.cx,Y-I.cy)<I.r*.42)continue;
    if(d<.8&&r<.16&&I.town!=='islote'){const s=5+hash(i,j,12)*3;x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(i+2,j+4,s,s*.6,0,0,7);x.fill();x.fillStyle='#2f6f30';x.beginPath();x.arc(i,j,s,0,7);x.fill();x.fillStyle='#4f9a45';x.beginPath();x.arc(i-1.5,j-1.5,s*.55,0,7);x.fill()}
    else if(d>.84&&d<.97&&r<.07){x.strokeStyle='#7a4f28';x.lineWidth=2;x.beginPath();x.moveTo(i,j+6);x.quadraticCurveTo(i+2,j+1,i+1,j-3);x.stroke();x.fillStyle='#3e8d3a';for(let k=0;k<5;k++){const a=k/5*Math.PI*2;x.beginPath();x.ellipse(i+1+Math.cos(a)*4,j-3+Math.sin(a)*2,4,1.6,a,0,7);x.fill()}}}
  // pueblos y detalles
  const house=(hx,hy,roof)=>{x.fillStyle='rgba(0,0,0,.2)';x.fillRect(hx-6,hy+2,15,7);x.fillStyle='#e8d6b0';x.fillRect(hx-7,hy-2,14,8);x.fillStyle=roof;x.beginPath();x.moveTo(hx-9,hy-1);x.lineTo(hx,hy-9);x.lineTo(hx+9,hy-1);x.fill();x.fillStyle='#5a3214';x.fillRect(hx-1,hy+2,3,4)};
  SEA_ISL.forEach(I=>{if(!I.town)return;const [cx,cy]=P(I.cx,I.cy);
    if(I.town==='villa'){[[-22,-8],[-6,-14],[10,-6],[-14,8],[4,10],[20,6]].forEach(([a,b],k)=>house(cx+a,cy+b,k%2?'#b23a2e':'#c2493a'));
      x.fillStyle='#d9c7a3';x.fillRect(cx+30,cy-20,8,16);x.strokeStyle='#5a3214';x.lineWidth=2;const t=1;for(let k=0;k<4;k++){const a=k*Math.PI/2+.4;x.beginPath();x.moveTo(cx+34,cy-20);x.lineTo(cx+34+Math.cos(a)*12,cy-20+Math.sin(a)*12);x.stroke()}}
    if(I.town==='puerto'){[[-18,-10],[0,-14],[16,-8],[-8,6],[12,8]].forEach(([a,b],k)=>house(cx+a,cy+b,k%2?'#3a6ea5':'#b23a2e'));
      x.fillStyle='#8d5524';x.fillRect(cx+26,cy+6,22,4);x.fillStyle='#6b3f1a';x.beginPath();x.moveTo(cx+28,cy+2);x.lineTo(cx+46,cy+2);x.lineTo(cx+42,cy+8);x.lineTo(cx+32,cy+8);x.fill()}
    if(I.town==='shells'){x.fillStyle='rgba(0,0,0,.22)';x.fillRect(cx-26,cy-26,56,30);x.fillStyle='#9aa5b1';x.fillRect(cx-28,cy-30,56,30);x.fillStyle='#7b8794';for(let k=0;k<7;k++)x.fillRect(cx-28+k*8,cy-34,5,5);x.fillStyle='#3a6ea5';x.fillRect(cx-28,cy-4,56,3);
      x.fillStyle='#b8c2cc';x.fillRect(cx+12,cy-46,12,20);x.fillStyle='#3a6ea5';x.fillRect(cx+12,cy-50,12,5);x.strokeStyle='#3b2a14';x.lineWidth=1.5;x.beginPath();x.moveTo(cx+18,cy-50);x.lineTo(cx+18,cy-62);x.stroke();x.fillStyle='#f3f3f3';x.fillRect(cx+18,cy-62,10,6);x.fillStyle='#3a6ea5';x.fillRect(cx+18,cy-60,10,2);
      [[-30,14],[-12,18],[8,16],[26,14],[-22,30]].forEach(([a,b],k)=>house(cx+a,cy+b,k%2?'#b23a2e':'#c2493a'))}
    if(I.town==='islote'){x.fillStyle='#7d766c';x.beginPath();x.ellipse(cx,cy-6,22,18,0,0,7);x.fill();x.fillStyle='#958e83';x.beginPath();x.ellipse(cx-5,cy-12,12,8,0,0,7);x.fill();x.fillStyle='#2b241e';x.beginPath();x.ellipse(cx-8,cy-6,5,6,0,0,7);x.ellipse(cx+8,cy-6,5,6,0,0,7);x.fill();x.fillRect(cx-6,cy+6,3,5);x.fillRect(cx,cy+6,3,5);x.fillRect(cx+6,cy+6,3,5)}
    // muelle hacia su punto de atraque
    const dk=dockOf(I.id);if(dk){const [dx,dy]=P(dk[0]+.5,dk[1]+.5),ang=Math.atan2(dy-cy,dx-cx),L=Math.hypot(dx-cx,dy-cy);x.save();x.translate(cx,cy);x.rotate(ang);x.fillStyle='#8d5524';x.fillRect(L*.55,-3,L*.42,6);x.fillStyle='#6b3f1a';for(let k=L*.55;k<L*.97;k+=5)x.fillRect(k,-3,1,6);x.restore()}
  });
  WORLD=c;return c;
}
""")

# =========================================================================
# 2) LÓGICA DEL MAR NUEVA + ENCUENTROS VISIBLES
# =========================================================================
between("/* ------------------------------------------------------------------------\n   MAR LIBRE (cámara, niebla, minimapa)",
        "/* ------------------------------------------------------------------------\n   LUGARES DE LAS ISLAS",
r"""/* ------------------------------------------------------------------------
   MAR LIBRE: cámara, niebla suave, minimapa y barcos que se ven venir
   ------------------------------------------------------------------------ */
let SEEN=new Set(),FOG=null;
function reveal(cx,cy,r){if(!G.sea.seen)G.sea.seen=[];const s=new Set(G.sea.seen);for(let y=Math.floor(cy-r);y<=cy+r;y++)for(let x=Math.floor(cx-r);x<=cx+r;x++)if(x>=0&&y>=0&&x<SW&&y<SH&&(x-cx)**2+(y-cy)**2<=r*r+1)s.add(x+','+y);G.sea.seen=[...s];SEEN=s;FOG=null}
function adjIsland(){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const i=islandAt(G.sea.x+dx,G.sea.y+dy);if(i&&i.id)return i.id}return null}
function buildFog(){const f=document.createElement('canvas');f.width=SW*4;f.height=SH*4;const x=f.getContext('2d');x.fillStyle='#d8c290';x.fillRect(0,0,f.width,f.height);
  x.globalCompositeOperation='destination-out';SEEN.forEach(k=>{const [a,b]=k.split(',').map(Number),cx=a*4+2,cy=b*4+2,g=x.createRadialGradient(cx,cy,0,cx,cy,6);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.55,'rgba(0,0,0,.9)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(cx-6,cy-6,12,12)});
  x.globalCompositeOperation='source-over';FOG=f;return f}
function renderSea(){
  G.mode='sea';MV=null;SEEN=new Set(G.sea.seen||[]);FOG=null;initEnts();const near=adjIsland();
  stage.innerHTML=`<canvas id="cv" width="${W}" height="${H}"></canvas><canvas id="mini" width="180" height="120"></canvas>${hud()}
   <div class="quest perg">🧭 ${G.quest}</div>${near?`<button class="primary mapbtn" onclick="land('${near}')">⚓ Desembarcar en ${ISLANDS_N[near]}</button>`:''}`;
  const cv=document.getElementById('cv');cv.onclick=e=>{const [x,y]=tapTile(e,cv);sailTo(x,y)};
  buildWorld();drawMini();save();playMusic('sea');startLoop(drawSea);if(window.SIM)drawSea(0);
}
function drawMini(){const m=document.getElementById('mini');if(!m)return;const x=m.getContext('2d');x.imageSmoothingEnabled=true;x.drawImage(buildWorld(),0,0,180,120);x.drawImage(FOG||buildFog(),0,0,180,120);
  const sx=180/SW,sy=120/SH;x.fillStyle='#9b2226';x.beginPath();x.arc((G.sea.x+.5)*sx,(G.sea.y+.5)*sy,3.5,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=1;x.stroke();
  if(G.f.knowShells&&!SEEN.has('46,30')){x.fillStyle='#9b2226';x.font='bold 14px serif';x.textAlign='center';x.fillText('✕',46*sx,31*sy)}}
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
  SEA_ISL.forEach(I=>{if(!I.id)return;const known=SEEN.has(Math.round(I.cx)+','+Math.round(I.cy+I.r*.6))||SEEN.has(Math.round(I.cx)+','+Math.round(I.cy));
    if(known)drawLabel(x,I.n,I.cx*TS,(I.cy-I.r*1.05)*TS,'#ffe8a3');
    else if(I.id==='shells'&&G.f.knowShells){x.font='bold 46px "Lilita One",serif';x.fillStyle='#9b2226';x.textAlign='center';x.fillText('✕',I.cx*TS,I.cy*TS);drawLabel(x,'¿Shells Town?',I.cx*TS,I.cy*TS+30,'#ffe8a3')}});
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
  const path=bfs(SW,SH,(x,y)=>seaWalk(x,y),G.sea.x,G.sea.y,tx,ty);if(!path||!path.length)return;
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
  if(!G.f.coby)return null;
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
  if(!G.f.coby){const d0=dockOf('villa');if(Math.hypot(sea.x-d0[0],sea.y-d0[1])>=6)return cobyScene}
  return entStep();
}
function islStart(id){const I=ISLANDS[id];let p=[10,I.map.length-3];I.map.forEach((row,y)=>{const x=row.indexOf('m');if(x>=0)p=[x,y-1]});return p}
function land(id){
  MV=null;sfx('door');const p=islStart(id);G.isl={id,x:p[0],y:p[1],face:1};G.mode='island';
  if(id==='shells'&&!G.f.shellsArr){G.f.shellsArr=1;quest('Pregunta en el pueblo por el cazador de piratas.');
    return scene({bg:'pueblo',place:'Shells Town',lines:[['narr','Shells Town. Un pueblo apagado, a la sombra de una base enorme de la Marina.'],...(has('coby')?[['coby','Aquí manda el capitán Morgan... Dicen que es un tirano y que su hijo es todavía peor.']]:[]),['luffy','¡A ver dónde está ese cazador de piratas!']],next:renderIsland})}
  if(id==='puerto'&&!G.f.puertoArr){G.f.puertoArr=1;return scene({bg:'muelle',place:'Puerto Gaviota',lines:[['narr','Un puerto pesquero lleno de redes, gaviotas y olor a sardina. Tienen astillero.'],['luffy','¡Uooh! ¡Aquí pueden mejorar el barco!']],next:renderIsland})}
  if(id==='islote'&&!G.f.isloteArr){G.f.isloteArr=1;return scene({bg:'playa',place:'Islote Calavera',lines:[['narr','Un islote con un acantilado en forma de calavera. Nadie vive aquí. Huele a misterio... y a cangrejo.']],next:renderIsland})}
  renderIsland();
}
function shipToDock(id){const d=dockOf(id);G.sea.x=d[0];G.sea.y=d[1];reveal(d[0],d[1],4)}
function naufragio(){
  G.ship.casco=15;G.berries=Math.floor(G.berries/2);const id=G.lastIsl||'villa';const p=islStart(id);G.isl={id,x:p[0],y:p[1],face:1};shipToDock(id);G.mode='island';
  scene({bg:'tormenta',lines:[['narr','El casco cruje, el agua entra a chorros... ¡el barco se hunde!'],['narr',`Despertáis en la playa de ${ISLANDS[id].n}, con medio botín menos y el barco remendado de mala manera.`],['luffy','...¡Tengo hambre!']],next:renderIsland});
}

/* ------------------------------------------------------------------------
   ENCUENTROS EN EL MAR (con el barco que te ha alcanzado)
   ------------------------------------------------------------------------ */
function fleeChance(){return G.upg.includes('velas')?.8:.6}
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

""")

# =========================================================================
# 3) ADIÓS COMIDA Y AGUA + guardado (migración)
# =========================================================================
rep("ship:{comida:10,agua:10,cap:20,casco:40,cascoMax:40},sea:{x:10,y:5,seen:[],steps:0,face:1}","ship:{casco:40,cascoMax:40},sea:{x:10,y:5,seen:[],steps:0,face:1}")
rep("G={v:6,","G={v:7,")
rep("const d=dockOf('villa');G.sea.x=d[0];G.sea.y=d[1];reveal(G.sea.x,G.sea.y,3);","const d=dockOf('villa');G.sea.x=d[0];G.sea.y=d[1];reveal(G.sea.x,G.sea.y,4);")
rep("function loadSave(){try{const s=JSON.parse(localStorage.getItem('mdl_save')||'null');return s&&s.v===6?s:null}catch(e){return null}}",
r"""function loadSave(){try{const s=JSON.parse(localStorage.getItem('mdl_save')||'null');if(!s)return null;
  if(s.v===6){ // partida de la versión anterior: nuevo mar, sin comida ni agua
    s.v=7;delete s.ship.comida;delete s.ship.agua;delete s.ship.cap;s.upg=(s.upg||[]).filter(u=>u!=='bodega');s.sea={x:0,y:0,seen:[],steps:0,face:1};
    const d=dockOf(s.lastIsl||'villa');s.sea.x=d[0];s.sea.y=d[1];const G0=G;G=s;reveal(d[0],d[1],4);if(s.f.knowShells&&s.f.coby)reveal(46,33,4);G=G0}
  return s.v===7?s:null}catch(e){return null}}""")
# HUD: solo casco en el mar + botón de menú
rep("""   <div class="hudmid">${G.mode==='sea'?`<span class="${lo(s.comida)}">🍖 ${s.comida}/${s.cap}</span><span class="${lo(s.agua)}">💧 ${s.agua}/${s.cap}</span><span class="${s.casco<=10?'low':''}">🛶 ${s.casco}/${s.cascoMax}</span>`:''}</div>""",
    """   <div class="hudmid">${G.mode==='sea'?`<span class="${s.casco<=10?'low':''}">🛶 Casco ${s.casco}/${s.cascoMax}</span>`:''}</div>""")
rep("""   <button class="ico" onclick="bitacora()">📜</button></div>`;""","""   <button class="ico menubtn" onclick="openMenu()">☰ Menú</button></div>`;""")
# Mejoras: bodega -> mascarón
rep("bodega:{n:'Bodega ampliada',d:'+10 de capacidad de comida y agua',p:70}","mascaron:{n:'Mascarón de proa',d:'Los barcos enemigos tardan más en reaccionar y huir es más fácil',p:70}")
rep("if(k==='bodega'){G.ship.cap+=10}","")
rep("function fleeChance(){return G.upg.includes('velas')?.8:.6}","function fleeChance(){return Math.min(.92,(G.upg.includes('velas')?.8:.6)+(G.upg.includes('mascaron')?.1:0))}")
# taberna: sin provisiones
rep("if(!G.f.provisiones){G.f.provisiones=1;G.ship.comida=G.ship.cap;G.ship.agua=G.ship.cap;G.f.knowShells=1;","if(!G.f.provisiones){G.f.provisiones=1;gainItem('carne',2);G.f.knowShells=1;")
rep("['tabernera','¡Aquí estás! Toma, comida y agua para el viaje. Y no te lo comas todo el primer día.']","['tabernera','¡Aquí estás! Toma, un par de carnes para el viaje. Y no te las comas todas el primer día.']")
rep("['narr','🍖 Comida y 💧 agua al máximo. Shells Town aparece marcada en tu carta.']","['narr','🍖 +2 Carne con hueso. Shells Town aparece marcada en tu carta.']")
rep("""    {n:'Provisiones (20 💰)',cost:20,s:'+10 comida y +10 agua',f:()=>{G.berries-=20;G.ship.comida=Math.min(G.ship.cap,G.ship.comida+10);G.ship.agua=Math.min(G.ship.cap,G.ship.agua+10);say('Te llena la bodega.','tabernera')}},""",
    """    {n:'Carne para el viaje (15 💰)',cost:15,s:'+1 Carne con hueso',f:()=>{G.berries-=15;gainItem('carne');sfx('coin');say('Recién hecha. Que no se te enfríe.','tabernera')}},""")
rep("'Cuidado con las aguas del suroeste: por ahí rondan los Reyes Marinos.'","'Cuidado con las aguas del suroeste: por ahí rondan los Reyes Marinos. Si ves una aleta, ¡vira!'")
# muelle
rep("lines:[['narr',`Vuestro barco os espera. Provisiones: 🍖 ${s.comida} · 💧 ${s.agua} · 🛶 ${s.casco}/${s.cascoMax}.`]]","lines:[['narr',`Vuestro barco os espera. Casco: 🛶 ${s.casco}/${s.cascoMax}.`]]")
# pescador
rep("s:'Combate. Recompensa: comida al máximo y fama +1'","s:'Combate. Recompensa: 3 carnes con hueso, 30 berries y fama +1'")
rep("G.f.pesca=1;G.ship.comida=G.ship.cap;OUT=[];fama(1);","G.f.pesca=1;gainItem('carne',3);G.berries+=30;OUT=[];fama(1);")
rep("['pescador','¡Eh, piratas! Unos bucaneros me han robado las redes. Si me las recuperáis, os lleno la bodega de pescado.']","['pescador','¡Eh, piratas! Unos bucaneros me han robado las redes. Si me las recuperáis, os doy pescado y unas monedas.']")
rep("['pescador','¡Mis redes! Tomad, todo el pescado que quepa.'],['narr','🍖 Comida al máximo.']","['pescador','¡Mis redes! Tomad, lo mejor de la pesca de hoy.'],['narr','🍖 +3 Carne con hueso · 💰 +30.']")
# coby: Shells ahora está en otro sitio
rep("G.crew.push(newMember('coby',2));G.f.knowShells=1;reveal(30,19,5);","G.crew.push(newMember('coby',2));G.f.knowShells=1;reveal(46,33,4);")
# bitácora: pestaña barco
rep("""if(BT.tab==='barco'){const s=G.ship;return `<p class="num">🍖 Comida ${s.comida}/${s.cap} · 💧 Agua ${s.agua}/${s.cap} · 🛶 Casco ${s.casco}/${s.cascoMax}</p><p class="muted">Cada 3 casillas navegadas se gasta comida y agua. Sin provisiones, la tripulación se debilita. Las tormentas dañan el casco.</p>""",
    """if(BT.tab==='barco'){const s=G.ship;return `<p class="num">🛶 Casco ${s.casco}/${s.cascoMax}</p><p class="muted">Las tormentas dañan el casco; si llega a 0, naufragáis. Se repara en el astillero de Puerto Gaviota. Los barcos enemigos y las aletas de Rey Marino se ven en el mapa: si os ven, os persiguen, pero son algo más lentos que vosotros.</p>""")
open(P,'w').write(s)
print('patch mar ok')
