/* =========================================================================
   PERSONAJES JUGABLES
   Estadísticas, crecimiento por nivel y técnicas. NAMES: nombre que sale en los diálogos.
   ========================================================================= */
/* hp/pe/atk/def/spd base · g: crecimiento por nivel · start: técnicas iniciales
   rubber: las balas le rebotan · slash: sus golpes suenan a corte · guest: invitado temporal */
const CHARS={
 luffy:{n:'Luffy',hp:62,pe:10,atk:9,def:4,spd:8,g:{hp:9,atk:2,def:1,spd:1},start:['pistol'],fruit:'Fruta Goma Goma: las balas le rebotan',rubber:true,
  skills:[
   {id:'pistol',n:'Gomu Gomu no Pistol',pe:3,t:'one',pow:1.7,d:'Puñetazo elástico a un enemigo'},
   {id:'latigo',n:'Gomu Gomu no Látigo',pe:5,t:'all',pow:1.0,d:'Barrido a todos los enemigos',req:'pistol'},
   {id:'bazooka',n:'Gomu Gomu no Bazooka',pe:7,t:'one',pow:2.7,d:'Empujón doble devastador',req:'pistol'},
   {id:'globo',n:'Gomu Gomu no Globo',pe:3,t:'self',d:'Se infla: devuelve los golpes cuerpo a cuerpo este turno',req:'latigo'},
   {id:'haki',n:'??? (Haki)',lock:true,d:'Un poder que aún no comprendes...'}]},
 zoro:{n:'Zoro',slash:true,hp:58,pe:10,atk:11,def:4,spd:7,g:{hp:8,atk:2.5,def:1,spd:.6},start:['onigiri'],
  skills:[
   {id:'onigiri',n:'Oni Giri',pe:4,t:'one',pow:2.0,d:'Corte triple a un enemigo'},
   {id:'toragari',n:'Tora Gari',pe:4,t:'one',pow:1.6,bleed:4,d:'Corte que hace sangrar (4 por turno)'},
   {id:'tatsumaki',n:'Tatsumaki',pe:7,t:'all',pow:1.4,d:'Torbellino que golpea a todos',req:'onigiri'},
   {id:'meditar',n:'Meditación',pe:2,t:'self',buff:1.35,d:'+35% de ataque durante 3 turnos',req:'toragari'},
   {id:'haki',n:'??? (Haki)',lock:true,d:'Algún día cortará el acero...'}]},
 coby:{n:'Coby',hp:36,pe:8,atk:5,def:3,spd:6,g:{hp:5,atk:1,def:1,spd:.5},start:['animo','vendas'],guest:true,
  skills:[
   {id:'animo',n:'¡Ánimo!',pe:3,t:'ally',buff:1.3,d:'+30% de ataque a un aliado (3 turnos)'},
   {id:'vendas',n:'Vendas',pe:3,t:'ally',heal:22,d:'Cura 22 a un aliado'}]}
};
const COMBO={n:'Gomu Gomu + Oni Giri',d:'Ataque combinado: 4 PE de cada uno',pow:3.8};
const NAMES={narr:'',tabernera:'Tabernera',mercader:'Mercader',duena:'Dueña del restaurante',nina:'Niña',carpintero:'Carpintero',pescador:'Pescador',bucanero:'Bucanero',marine:'Marine',fusilero:'Fusilero',helmeppo:'Helmeppo',morgan:'Capitán Morgan',zoro:'Zoro',coby:'Coby',luffy:'Luffy',reymarino:'Rey Marino',aldeano:'Aldeano',abuela:'Abuela',marinerox:'Marinero',cangrejo:'Cangrejo'};
