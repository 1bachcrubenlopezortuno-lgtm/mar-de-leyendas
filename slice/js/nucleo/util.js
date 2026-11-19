/* =========================================================================
   UTILIDADES
   Escenario 960x540, escalado, azar y hash determinista.
   ========================================================================= */
const W=960,H=540;
const stage=document.getElementById('stage');
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);stage.style.transform=`scale(${s})`;stage.style.left=(innerWidth-W*s)/2+'px';stage.style.top=(innerHeight-H*s)/2+'px'}
addEventListener('resize',fit);fit();
const later=(fn,ms)=>window.SIM?fn():setTimeout(fn,ms);
const rand=Math.random,ri=(a,b)=>a+Math.floor(rand()*(b-a+1)),pick=a=>a[Math.floor(rand()*a.length)],chance=p=>rand()<p,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function hash(x,y,s=0){let h=(x*374761393+y*668265263+s*982451653)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}
