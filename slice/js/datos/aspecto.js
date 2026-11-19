/* =========================================================================
   ASPECTO PROVISIONAL
   SPR: muñecos genéricos (solo para extras sin sprite). BGS: fondos de escena.
   ========================================================================= */
const SPR={
 bucanero:{skin:'#e0a37a',hair:'#5a2d0c',top:'#8d5524',pants:'#40516b',hat:'bandana',hatC:'#40516b',weapon:'club',beard:true},
 marine:{skin:'#f1c39b',hair:'#5a2d0c',top:'#f3e6c4',top2:'#1d4e89',pants:'#1d3557',hat:'marine',weapon:'sword'},
 fusilero:{skin:'#e0a37a',hair:'#14110f',top:'#f3e6c4',top2:'#1d4e89',pants:'#1d3557',hat:'marine',weapon:'gun'},
 cangrejo:{kind:'crab'},reymarino:{kind:'serpent'},
 tabernera:{skin:'#f1c39b',hair:'#2d6a4f',top:'#f3e6c4',dress:'#6b4f2a',apron:true,longhair:true,weapon:'mug'},
 mercader:{skin:'#e0a37a',hair:'#8a7a5c',top:'#6d597a',hat:'pañuelo',hatC:'#c9a227',beard:true,weapon:'bag'},
 duena:{skin:'#f1c39b',hair:'#5a2d0c',top:'#e5989b',dress:'#b5838d',apron:true,longhair:true},
 nina:{skin:'#f1c39b',hair:'#5a2d0c',top:'#f7c59f',dress:'#e5989b',longhair:true,weapon:'basket'},
 carpintero:{skin:'#c68642',hair:'#14110f',top:'#c8a27a',pants:'#5a3214',hat:'bandana',hatC:'#c9a227',beard:true,weapon:'hammer'},
 pescador:{skin:'#e0a37a',hair:'#f3e6c4',top:'#2a6f97',pants:'#40516b',hat:'pañuelo',hatC:'#9b2226',beard:true,weapon:'rod'},
 aldeano:{skin:'#e0a37a',hair:'#8d5524',top:'#a3b18a',pants:'#5a3214'},
 abuela:{skin:'#f1c39b',hair:'#dfe7ea',top:'#6d597a',dress:'#4a4e69',longhair:true},
 marinerox:{skin:'#c68642',hair:'#14110f',top:'#f3e6c4',top2:'#9b2226',pants:'#1d3557',hat:'pañuelo',hatC:'#1d4e89'}
};

/* Fondos provisionales de escena */
const BGS={
 cubierta:'linear-gradient(180deg,#a8d5e2 0 38%,#3d7ea6 38% 50%,#5a3214 50% 53%,transparent 53%),repeating-linear-gradient(90deg,#8d5524 0 54px,#6b3f1a 54px 57px)',
 pueblo:'radial-gradient(circle at 80% 20%,#ffd166 0 5%,transparent 6%),linear-gradient(180deg,#f7c59f 0 45%,#b5838d 45% 52%,#e5c3a6 52% 70%,#c8a27a 70%)',
 taberna:'radial-gradient(circle at 75% 22%,rgba(255,200,90,.55),transparent 28%),linear-gradient(180deg,#5a3a22 0 62%,#2b1d12 62% 64%,#7a4a26 64%)',
 muelle:'linear-gradient(180deg,#c9dbe6 0 40%,#5c7d99 40% 58%,#6e6656 58% 61%,#a39a83 61%)',
 patio:'linear-gradient(180deg,#9fb6c8 0 30%,#8d99ae 30% 60%,#6c757d 60% 62%,#b8a88a 62%)',
 torre:'linear-gradient(180deg,#495057 0 15%,#6c757d 15% 60%,#343a40 60% 62%,#5c5470 62%)',
 cueva:'radial-gradient(ellipse at 50% 35%,#4f6d7a 0 18%,#22333b 45%,#0b1316 75%)',
 mar:'linear-gradient(180deg,#bde0fe 0 46%,#2a6f97 46%)',
 tormenta:'linear-gradient(180deg,#3d405b 0 46%,#1b263b 46%)',
 playa:'radial-gradient(circle at 82% 18%,#fff3b0 0 6%,transparent 7%),linear-gradient(180deg,#a8d5e2 0 42%,#3d7ea6 42% 56%,#f6e7c1 56% 59%,#e9d8a6 59%)',
 tienda:'linear-gradient(180deg,#7f5539 0 18%,#9c6644 18% 21%,#7f5539 21% 44%,#9c6644 44% 47%,#7f5539 47% 66%,#b08968 66%)',
 astillero:'linear-gradient(180deg,#a8d5e2 0 38%,#3d7ea6 38% 50%,#8d5524 50% 53%,#c8a27a 53%)'
};
function bgStyle(k){return ASSETS_BG[k]?`background:url('${ASSETS_BG[k]}') center/cover`:`background:${BGS[k]||BGS.mar}`}
