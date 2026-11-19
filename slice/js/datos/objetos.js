/* =========================================================================
   OBJETOS, EQUIPO, TESOROS Y MEJORAS DEL BARCO
   
   ========================================================================= */
const ITEMS={
 carne:{n:'Carne con hueso',d:'Cura 40 a un aliado',t:'ally',heal:40,p:15},
 medicina:{n:'Medicina',d:'Cura 20 a todo el grupo',t:'party',heal:20,p:25},
 bomba:{n:'Bomba de mano',d:'15 de daño a todos los enemigos',t:'foes',dmg:15,p:30},
 sake:{n:'Sake',d:'Recupera 5 PE a un aliado',t:'ally',pe:5,p:20}
};
const EQUIP={
 guantes:{n:'Guantes de cuero',s:'arma',atk:2,p:60},garrote:{n:'Garrote de roble',s:'arma',atk:3,p:85,not:['zoro']},katana:{n:'Katana del capitán',s:'arma',atk:5,only:['zoro']},
 chaleco:{n:'Chaleco de cuero',s:'ropa',def:2,p:50},chaqueta:{n:'Chaqueta de marine',s:'ropa',def:3,spd:-1,p:70},camisa:{n:'Camisa ligera',s:'ropa',def:1,spd:1,p:70},
 bandana:{n:'Bandana de la suerte',s:'acc',atk:1,spd:1},collar:{n:'Collar de dientes',s:'acc',hp:10},brujula:{n:'Brújula de bolsillo',s:'acc',spd:2,p:90}
};
const SLOT_TXT={arma:'Arma',ropa:'Ropa',acc:'Accesorio'};
/* RARES: stat = bonus a toda la tripulación; oro = multiplicador de berries en combate */
const RARES={perla:{n:'Perla del islote',d:'+10 de vida máxima a toda la tripulación',stat:{hp:10}},doblon:{n:'Doblón maldito',d:'+30% de berries en los combates',oro:1.3},diente:{n:'Colmillo de Rey Marino',d:'+2 de ataque a toda la tripulación',stat:{atk:2}}};
const UPG={canones:{n:'Cañones',d:'En combates en el mar, andanada inicial (12 de daño a todos)',p:120},velas:{n:'Velas reforzadas',d:'Menos daño en tormentas, huir más fácil y +10 casco',p:90},mascaron:{n:'Mascarón de proa',d:'Los barcos enemigos tardan más en reaccionar y huir es más fácil',p:70}};
