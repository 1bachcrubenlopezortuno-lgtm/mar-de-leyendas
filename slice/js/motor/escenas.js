/* ------------------------------------------------------------------------
   MOTOR DE ESCENAS (novela visual, horizontal)
   ------------------------------------------------------------------------ */
let SC=null,TYPE=null;
function partyKeys(){return G.crew.map(m=>m.key)}
function stopMaps(){LOOP=null}
function scene(o){
  stopMaps();
  SC={bg:o.bg||'mar',place:o.place||'',L:[...(o.left||partyKeys())],Rt:[...(o.right||[])],lines:o.lines||[],choices:o.choices||null,next:o.next||back,i:0,btn:o.btn};
  stage.innerHTML=`<div class="vnbg" style="${bgStyle(SC.bg)}"></div>${hud()}${SC.place?`<div class="place perg">${SC.place}</div>`:''}<div class="cast l" id="castL"></div><div class="cast r" id="castR"></div>
    <div class="choices" id="choices"></div><div class="dlg perg" id="dlg" onclick="advance()"><div class="who" id="who" style="display:none"></div><div class="txt" id="txt"></div><div class="tri" id="tri">▼</div></div>`;
  drawCast(null,true);playLine();
}
function drawCast(spk,first){
  const tot=Math.min(3,SC.L.length)+Math.min(3,SC.Rt.length),sz=tot<=2?240:tot<=4?200:170;
  const mk=(arr,id)=>{document.getElementById(id).innerHTML=arr.slice(0,3).map(k=>`<div class="ch ${k===spk||(!spk&&first)?'on':''} ${first?'enter':''}">${img(k,sz)}</div>`).join('')};
  mk(SC.L,'castL');mk(SC.Rt,'castR');
}
function playLine(){
  const ch=document.getElementById('choices');ch.innerHTML='';
  if(SC.i>=SC.lines.length)return showChoices();
  const [w,t]=SC.lines[SC.i];
  if(w!=='narr'&&!SC.L.includes(w)&&!SC.Rt.includes(w)){(has(w)?SC.L:SC.Rt).push(w);drawCast(w,false)}else drawCast(w==='narr'?'__':w,false);
  const who=document.getElementById('who'),tx=document.getElementById('txt');
  who.style.display=w==='narr'?'none':'block';who.textContent=NAMES[w]||w;
  tx.className='txt'+(w==='narr'?' narr':'');document.getElementById('tri').style.display='block';
  clearInterval(TYPE);TYPE=null;SC.full=t;
  if(window.SIM){tx.innerHTML=t;return}
  let n=0;tx.innerHTML='';TYPE=setInterval(()=>{n+=TXTSPD;tx.innerHTML=t.slice(0,n);if(n%6<TXTSPD)sfx('blip');if(n>=t.length){clearInterval(TYPE);TYPE=null}},16);
}
function advance(){if(!SC)return;if(TYPE){clearInterval(TYPE);TYPE=null;document.getElementById('txt').innerHTML=SC.full;return}if(SC.i<SC.lines.length){SC.i++;playLine()}}
function showChoices(){document.getElementById('tri').style.display='none';const ch=document.getElementById('choices');
  if(SC.choices&&SC.choices.length){ch.className='choices';ch.innerHTML=optButtons(SC.choices)}
  else{ch.className='choices';ch.innerHTML=`<button class="primary" onclick="sceneNext()">${SC.btn||'Continuar'}</button>`}}
function sceneNext(){const n=SC.next;SC=null;save();n()}
function optOK(o){return!o.cost||G.berries>=o.cost}
function visible(o){return(!o.req||has(o.req))&&(!o.need||o.need())}
function optButtons(ops){return ops.map((o,i)=>visible(o)?`<button style="animation-delay:${i*.05}s" ${optOK(o)&&!o.off?'':'disabled'} onclick="choose(${i})">${o.req?`<b style="color:var(--lacre)">[${CHARS[o.req]?.n||o.req}]</b> `:''}${o.n}${o.s?`<small>${o.s}</small>`:''}</button>`:'').join('')}
function choose(i){
  const c=SC.choices[i];if(!c||!optOK(c)||c.off)return;sfx('click');
  OUT=[];const r=c.f()||{};const lines=OUT;OUT=[];
  const then=r.fight?()=>startBattle(r.fight,r.opt||{}):(r.then||SC.next);
  if(!lines.length&&!r.choices){SC=null;save();return then()}
  SC.lines=lines;SC.i=0;SC.choices=r.choices||null;SC.next=then;SC.btn=r.fight?'¡A pelear!':r.btn||'Continuar';
  refreshHud();playLine();
}
function back(){save();G.mode==='island'?renderIsland():renderSea()}
