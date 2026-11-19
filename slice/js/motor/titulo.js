/* ------------------------------------------------------------------------
   TÍTULO E INTRO
   ------------------------------------------------------------------------ */
function renderTitle(){
  stopMaps();closeMenu();const sv=loadSave();playMusic('sea');
  stage.innerHTML=`<div class="vnbg" style="${bgStyle('mar')}"></div>
   <div class="abs" style="left:60px;bottom:60px">${img('luffy',300)}</div>
   <div class="abs perg" style="right:50px;top:50px;width:440px;padding:18px 22px"><h1>Mar de Leyendas</h1><p class="muted">Arco 1: Shells Town · prototipo v0.6</p>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
     ${sv?`<button class="primary" onclick="G=loadSave();back()">Continuar<small>${sv.quest}</small></button>`:''}
     <button class="${sv?'':'primary'}" onclick="startNew()">Nueva partida${sv?'<small>Borra la partida guardada</small>':''}</button></div>
    <p class="muted" style="font-size:15px;margin-top:12px">La partida se guarda sola en este navegador.</p></div>`;
}
