/* =========================================================================
   ENEMIGOS
   moves: w = peso al elegir; pow, ranged, all, def, self, buffAll. drop: [objeto, probabilidad].
   elite/boss: música de jefe y sprite más grande · size: tamaño del sprite en combate · slash: suena a corte.
   ========================================================================= */
const FOES={
 bucanero:{n:'Bucanero',hp:28,atk:7,def:2,spd:5,xp:9,gold:[6,12],moves:[{n:'Garrotazo',pow:1,w:3},{n:'Golpe sucio',pow:1.4,w:1}],drop:[['carne',.3],['eq:guantes',.07]]},
 marine:{n:'Marine',slash:true,hp:32,atk:8,def:3,spd:6,xp:11,gold:[8,14],moves:[{n:'Sablazo',pow:1,w:3},{n:'Formación',def:3,w:1}],drop:[['medicina',.25],['eq:chaqueta',.07]]},
 fusilero:{n:'Fusilero',hp:24,atk:9,def:2,spd:7,xp:11,gold:[8,14],moves:[{n:'Disparo',pow:1.1,ranged:true,w:3},{n:'Ráfaga',pow:.7,ranged:true,all:true,w:1}],drop:[['bomba',.3]]},
 helmeppo:{n:'Helmeppo',slash:true,hp:42,atk:7,def:2,spd:6,xp:16,gold:[20,20],moves:[{n:'Pistolita',pow:1,ranged:true,w:2},{n:'¡Se lo diré a mi padre!',buffAll:1.2,w:1}],drop:[['eq:bandana',1]]},
 cangrejo:{n:'Cangrejo gigante',size:150,hp:75,atk:11,def:7,spd:3,xp:35,gold:[25,35],elite:true,moves:[{n:'Pinzazo',pow:1.3,w:3},{n:'Caparazón',def:6,w:1}],drop:[['eq:collar',1]]},
 reymarino:{n:'Rey Marino',size:150,hp:130,atk:12,def:5,spd:6,xp:70,gold:[40,60],elite:true,moves:[{n:'Mordisco',pow:1.35,w:3},{n:'Oleaje',pow:.8,all:true,w:2}],drop:[['rare:diente',1]]},
 morgan:{n:'Capitán Morgan',slash:true,hp:190,atk:13,def:6,spd:5,xp:110,gold:[80,80],boss:true,moves:[{n:'Hachazo',pow:1.3,w:3},{n:'Barrido de hacha',pow:.9,all:true,w:2},{n:'¡Aquí mando yo!',self:1.25,w:1}],drop:[['eq:katana',1]]}
};
