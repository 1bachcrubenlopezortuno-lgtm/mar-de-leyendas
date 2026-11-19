/* ------------------------------------------------------------------------
   MAR: mundo de 60x40 casillas. Las islas son formas orgánicas grandes y el
   dibujo del mar se genera una vez (suave, sin pixelar) y se anima encima.
   ------------------------------------------------------------------------ */

function islR(I,a){return I.r*(1+.16*Math.sin(3*a+I.seed*1.7)+.09*Math.sin(5*a+I.seed*3.1)+.05*Math.sin(9*a+I.seed))}
function islD(I,x,y){const dx=x-I.cx,dy=(y-I.cy)*1.2;return Math.hypot(dx,dy)/islR(I,Math.atan2(dy,dx))}
function landD(x,y){let best=9,bi=null;for(const I of SEA_ISL){if(Math.abs(x-I.cx)>I.r*1.9||Math.abs(y-I.cy)>I.r*1.7)continue;const d=islD(I,x,y);if(d<best){best=d;bi=I}}return[best,bi]}
let SEA=null;
function genSea(){
  SEA=[];for(let y=0;y<SH;y++){const row=[];for(let x=0;x<SW;x++){
    const [d,I]=landD(x+.5,y+.5);let t='~',isl=null;
    if(d<1){t='L';isl=I}
    else if(ROCKS.some(([a,b])=>a===x&&b===y))t='X';
    else if(((x+.5-STORM.cx)/STORM.rx)**2+((y+.5-STORM.cy)/STORM.ry)**2<=1)t='s';
    else{const cr=CORRIENTES.find(c=>c.t==='>'?y===c.y&&x>=c.x0&&x<=c.x1:x===c.x&&y>=c.y0&&y<=c.y1);if(cr)t=cr.t}
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
      else if(I&&I.rocky&&d<.82)col=mixC(ROCK,GR2,n*.6);
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
    if(d<.8&&r<.16&&!I.rocky){const s=5+hash(i,j,12)*3;x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(i+2,j+4,s,s*.6,0,0,7);x.fill();x.fillStyle='#2f6f30';x.beginPath();x.arc(i,j,s,0,7);x.fill();x.fillStyle='#4f9a45';x.beginPath();x.arc(i-1.5,j-1.5,s*.55,0,7);x.fill()}
    else if(d>.84&&d<.97&&r<.07){x.strokeStyle='#7a4f28';x.lineWidth=2;x.beginPath();x.moveTo(i,j+6);x.quadraticCurveTo(i+2,j+1,i+1,j-3);x.stroke();x.fillStyle='#3e8d3a';for(let k=0;k<5;k++){const a=k/5*Math.PI*2;x.beginPath();x.ellipse(i+1+Math.cos(a)*4,j-3+Math.sin(a)*2,4,1.6,a,0,7);x.fill()}}}
  // pueblos y detalles
  const house=(hx,hy,roof)=>{x.fillStyle='rgba(0,0,0,.2)';x.fillRect(hx-6,hy+2,15,7);x.fillStyle='#e8d6b0';x.fillRect(hx-7,hy-2,14,8);x.fillStyle=roof;x.beginPath();x.moveTo(hx-9,hy-1);x.lineTo(hx,hy-9);x.lineTo(hx+9,hy-1);x.fill();x.fillStyle='#5a3214';x.fillRect(hx-1,hy+2,3,4)};
  SEA_ISL.forEach(I=>{if(!I.town)return;const [cx,cy]=P(I.cx,I.cy);
    if(I.art)I.art(x,cx,cy,house); // dibujo propio de cada isla (contenido/islas/*.js)
    // muelle hacia su punto de atraque
    const dk=dockOf(I.id);if(dk){const [dx,dy]=P(dk[0]+.5,dk[1]+.5),ang=Math.atan2(dy-cy,dx-cx),L=Math.hypot(dx-cx,dy-cy);x.save();x.translate(cx,cy);x.rotate(ang);x.fillStyle='#8d5524';x.fillRect(L*.55,-3,L*.42,6);x.fillStyle='#6b3f1a';for(let k=L*.55;k<L*.97;k+=5)x.fillRect(k,-3,1,6);x.restore()}
  });
  WORLD=c;return c;
}
