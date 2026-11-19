/* ------------------------------------------------------------------------
   BUCLE DE DIBUJO DE MAPAS (cámara y movimiento suave)
   ------------------------------------------------------------------------ */
let LOOP=null,MV=null,CAM={x:0,y:0};
function startLoop(fn){LOOP=fn;const tick=t=>{if(LOOP!==fn)return;fn(t);requestAnimationFrame(tick)};requestAnimationFrame(tick)}
function camTo(px,py,ww,wh){CAM.x=clamp(px-W/2,0,Math.max(0,ww-W));CAM.y=clamp(py-H/2+20,-60,Math.max(0,wh-H))}
// mover: path de casillas, cada paso dura dur ms; onStep(x,y) devuelve true para parar
function moveAlong(path,from,dur,onStep,onEnd){
  if(window.SIM){let cur=from;for(const p of path){if(onStep(p[0],p[1],cur))return;cur=p}onEnd&&onEnd();return}
  MV={path:[...path],from:[...from],to:path[0],t0:performance.now(),dur,onStep,onEnd};
}
function mvPos(now,base){
  if(!MV)return base;
  let p=(now-MV.t0)/MV.dur;
  while(MV&&p>=1){const [x,y]=MV.to,prev=MV.from;const stop=MV.onStep(x,y,prev);if(!MV)return base;
    if(stop||MV.path.length<=1){const e=MV.onEnd;MV=null;if(!stop&&e)e();return null}
    MV.path.shift();MV.from=[x,y];MV.to=MV.path[0];MV.t0+=MV.dur;p=(now-MV.t0)/MV.dur}
  if(!MV)return base;
  return{x:MV.from[0]+(MV.to[0]-MV.from[0])*p,y:MV.from[1]+(MV.to[1]-MV.from[1])*p,moving:true};
}
function bfs(w,h,walk,sx,sy,tx,ty){
  const key=(x,y)=>y*w+x,prev=new Map([[key(sx,sy),null]]),q=[[sx,sy]];
  while(q.length){const [x,y]=q.shift();if(x===tx&&y===ty){const p=[];let k=key(x,y);while(k!==key(sx,sy)){p.unshift([k%w,Math.floor(k/w)]);k=prev.get(k)}return p}
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const k=key(nx,ny);if(prev.has(k))continue;if(!walk(nx,ny)&&!(nx===tx&&ny===ty))continue;prev.set(k,key(x,y));q.push([nx,ny])}}
  return null;
}
function tapTile(e,cv){const r=cv.getBoundingClientRect(),sx=(e.clientX-r.left)/r.width*W,sy=(e.clientY-r.top)/r.height*H;return[Math.floor((sx+CAM.x)/TS),Math.floor((sy+CAM.y)/TS)]}
function drawLabel(x,t,px,py,col='#f3e6c4'){x.font='bold 17px "Baloo 2",serif';x.textAlign='center';x.lineWidth=4;x.strokeStyle='#1b120b';x.strokeText(t,px,py);x.fillStyle=col;x.fillText(t,px,py)}
function drawShadow(x,px,py,w){x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(px,py,w,w*.35,0,0,7);x.fill()}
