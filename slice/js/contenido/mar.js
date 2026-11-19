/* =========================================================================
   EL MAR (East Blue)
   Tamaño del mundo, rocas, tormenta, corrientes y aguas profundas.
   Las islas con nombre se definen cada una en contenido/islas/.
   ========================================================================= */
const SW=60,SH=40;   // casillas de 48 px
const ROCKS=[[17,15],[38,11],[53,25],[26,32],[6,24],[40,37],[35,21],[22,9]];
const STORM={cx:30,cy:19,rx:7,ry:4.2};
/* Corrientes: t '>' empuja a la derecha, 'v' hacia abajo. */
const CORRIENTES=[{t:'>',y:14,x0:12,x1:22},{t:'v',x:27,y0:25,y1:32}];
/* Aguas profundas: solo aquí nada el Rey Marino. */
const isDeep=(x,y)=>y>=26&&x<30;

defIslet({cx:29,cy:6,r:2.2,seed:5});
defIslet({cx:33,cy:35,r:2.6,seed:6});
defIslet({cx:21,cy:23,r:1.8,seed:7});
defIslet({cx:56,cy:19,r:2,seed:8});
defIslet({cx:3.5,cy:19,r:1.6,seed:9});
