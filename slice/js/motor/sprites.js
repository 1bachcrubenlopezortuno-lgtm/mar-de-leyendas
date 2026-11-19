/* ------------------------------------------------------------------------
   SPRITES PROVISIONALES (genéricos). Con nombre propio = silueta.
   ------------------------------------------------------------------------ */
function makeSprite(o){
  const c=document.createElement('canvas');c.width=32;c.height=32;const x=c.getContext('2d');
  const px=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};
  const disc=(cx,cy,r,col)=>{x.fillStyle=col;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r+r*.6)x.fillRect(cx+i,cy+j,1,1)};
  if(o.kind==='serpent'){px(0,27,32,5,'#1d4e89');disc(7,26,4,'#2d6a4f');disc(11,21,4,'#2d6a4f');disc(15,16,4,'#2d6a4f');disc(19,11,4,'#2d6a4f');disc(23,7,5,'#2d6a4f');px(14,14,2,6,'#a7c4a0');disc(27,9,3,'#2d6a4f');px(23,4,3,3,'#c9a227');px(26,11,4,1,'#14110f');px(27,12,1,2,'#fff')}
  else if(o.kind==='crab'){for(let k=0;k<3;k++){px(6+k*3,24+k,2,5,'#9e2a2b');px(22-k*3,24+k,2,5,'#9e2a2b')}disc(16,21,8,'#c0392b');disc(5,12,4,'#c0392b');disc(27,12,4,'#c0392b');px(12,10,2,6,'#c0392b');px(18,10,2,6,'#c0392b');px(11,8,4,3,'#fff');px(17,8,4,3,'#fff');px(13,9,2,2,'#14110f');px(19,9,2,2,'#14110f')}
  else if(o.sil){const s='#4a3a2a';px(12,24,3,5,s);px(17,24,3,5,s);px(11,29,4,2,s);px(17,29,5,2,s);px(11,16,10,8,s);px(9,17,2,7,s);px(21,17,2,7,s);px(10,4,12,12,s);px(9,5,14,10,s);px(11,5,4,3,'#6b5640');x.fillStyle='#f3e6c4';x.font='bold 9px monospace';x.fillText('?',13,13)}
  else{
    if(o.coat){px(8,16,16,11,o.coat)}
    px(12,24,3,5,o.pants||'#40516b');px(17,24,3,5,o.pants||'#40516b');px(11,29,4,2,'#3b2a1a');px(17,29,5,2,'#3b2a1a');
    if(o.dress){px(9,20,14,9,o.dress)}
    px(11,16,10,8,o.top);if(o.top2)for(let y=17;y<23;y+=2)px(11,y,10,1,o.top2);
    if(o.apron)px(12,18,8,9,'#f3e6c4');
    px(9,17,2,5,o.coat||o.top);px(9,22,2,2,o.skin);
    px(10,4,12,12,o.skin);px(9,5,14,10,o.skin);px(22,9,1,2,o.skin);
    px(9,3,14,3,o.hair);px(9,3,3,9,o.hair);px(10,2,11,1,o.hair);if(o.longhair)px(8,5,3,12,o.hair);
    if(o.bald){px(9,3,14,3,o.skin);px(10,2,11,1,o.skin)}
    px(16,8,2,3,'#14110f');px(20,8,2,3,'#14110f');px(16,8,1,1,'#fff');px(20,8,1,1,'#fff');
    if(o.beard){px(13,12,10,4,o.hair)}else px(18,13,3,1,'#7a2e1f');
    const hc=o.hatC||'#9b2226';
    if(o.hat==='bandana'){px(9,2,14,4,hc);px(6,4,4,2,hc)}
    if(o.hat==='pañuelo'){px(9,2,14,3,hc);px(8,3,2,6,hc)}
    if(o.hat==='marine'){px(9,0,14,5,'#f3e6c4');px(9,5,14,1,'#1d4e89');px(21,5,5,1,'#1d3557');px(15,1,2,3,'#1d4e89')}
    px(21,17,2,4,o.coat||o.top);px(21,21,2,2,o.skin);
    const w=o.weapon;
    if(w==='sword'){px(23,7,1,14,'#dfe7ea');px(21,20,5,1,'#c9a227')}
    if(w==='gun'){px(22,19,8,2,'#37474f');px(22,21,3,3,'#6d4c41')}
    if(w==='mug'){px(22,18,5,5,'#c9a227');px(23,17,3,1,'#fff')}
    if(w==='bag'){px(23,19,6,6,'#8d5524');px(25,21,2,2,'#c9a227')}
    if(w==='hammer'){px(24,10,1,14,'#5a3214');px(22,8,6,4,'#6e6656')}
    if(w==='rod'){px(24,4,1,20,'#8d5524');px(25,4,1,10,'#dfe7ea')}
    if(w==='basket'){px(22,20,7,5,'#c8a27a');px(23,19,5,1,'#f3e6c4')}
    if(w==='club'){px(23,9,3,13,'#6b3f1a')}
  }
  const im=x.getImageData(0,0,32,32),d=im.data,src=new Uint8ClampedArray(d),al=(i,j)=>i>=0&&j>=0&&i<32&&j<32&&src[(j*32+i)*4+3]>0;
  for(let j=0;j<32;j++)for(let i=0;i<32;i++){const k=(j*32+i)*4;if(src[k+3]===0&&(al(i-1,j)||al(i+1,j)||al(i,j-1)||al(i,j+1))){d[k]=43;d[k+1]=29;d[k+2]=18;d[k+3]=255}}
  x.putImageData(im,0,0);return c;
}
const sprCv={},sprUrl={};
function sprCanvas(key){return sprCv[key]||(sprCv[key]=makeSprite(SPR[key]||{sil:true}))}
function sprSrc(key,pose='idle',f=0){const a=ASSETS[key];if(a){if(pose==='idle')return a.idle[f%a.idle.length];return a[pose]||a.idle[0]}return sprUrl[key]||(sprUrl[key]=sprCanvas(key).toDataURL())}
function img(key,size=64){return `<img class="spr" data-k="${key}" src="${sprSrc(key)}" width="${size}" height="${size}" alt="">`}
let animTick=0;
setInterval(()=>{animTick++;stage.querySelectorAll('img.spr[data-k]').forEach(el=>{if(el.dataset.pose)return;const a=ASSETS[el.dataset.k];if(a&&a.idle.length>1)el.src=a.idle[animTick%a.idle.length]})},480);
function pose(el,p,ms=420){if(!el)return;const k=el.dataset.k;if(!ASSETS[k]||!ASSETS[k][p])return;el.dataset.pose=p;el.src=sprSrc(k,p);setTimeout(()=>{delete el.dataset.pose;el.src=sprSrc(k)},ms)}
const IMGS={};function imgObj(src){if(!IMGS[src]){const i=new Image();i.src=src;IMGS[src]=i}return IMGS[src]}
Object.values(ASSETS).forEach(a=>[...a.idle,a.atk,a.hit,...(a.tec||[]),a.ko].forEach(s=>s&&imgObj(s)));for(let i=0;i<12;i++)imgObj(walkSrc(i));for(let i=0;i<4;i++)imgObj(`sprites/barco_${i}.png`);
