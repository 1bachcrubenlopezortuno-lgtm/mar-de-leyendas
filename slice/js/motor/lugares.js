/* ------------------------------------------------------------------------
   LUGARES COMUNES DE LAS ISLAS (muelle y tiendas)
   ------------------------------------------------------------------------ */
function poi(isl,c){const P=ISLANDS[isl].poi[c];(P&&P.go||back)()}
function muelle(){const s=G.ship;
  scene({bg:'muelle',place:ISLANDS[G.isl.id].n,lines:[['narr',`Vuestro barco os espera. Casco: 🛶 ${s.casco}/${s.cascoMax}.`]],choices:[
    {n:'Zarpar',s:'Volver al mar',f:()=>({then:()=>{shipToDock(G.isl.id);G.mode='sea';renderSea()}})},
    {n:'Quedarse en la isla',f:()=>{}}]})}
function shop(title,items,eqs){
  const draw=(first)=>scene({bg:'tienda',place:title,right:['mercader'],lines:first?[['mercader','¡Pasen y vean! Todo legal... casi todo.']]:[],choices:[
    ...items.map(k=>({n:`${ITEMS[k].n} — ${ITEMS[k].p} 💰`,s:`${ITEMS[k].d} · tienes ${G.items[k]||0}`,cost:ITEMS[k].p,f:()=>{G.berries-=ITEMS[k].p;gainItem(k);return{then:()=>draw(false)}}})),
    ...eqs.filter(k=>!G.f['eq_'+k]).map(k=>({n:`${EQUIP[k].n} — ${EQUIP[k].p} 💰`,s:`${SLOT_TXT[EQUIP[k].s]}: ${eqTxt(EQUIP[k])}`,cost:EQUIP[k].p,f:()=>{G.berries-=EQUIP[k].p;G.f['eq_'+k]=1;gainEq(k);say(`${EQUIP[k].n} guardado. Equípalo en 📜 → Tripulación.`);return{then:()=>draw(false)}}})),
    {n:'Salir',f:()=>{}}]});
  draw(true);
}
