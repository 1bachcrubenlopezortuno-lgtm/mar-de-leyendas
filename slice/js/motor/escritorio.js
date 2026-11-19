/* =========================================================================
   VERSIÓN DE ESCRITORIO
   Si el juego corre dentro del ejecutable (Electron), escucha sus avisos
   (por ejemplo, «nueva versión descargada») y los muestra en un pergamino.
   En el navegador window.escritorio no existe y esto no hace nada.
   ========================================================================= */
function avisoEscritorio(texto){
  const d=document.createElement('div');
  d.className='aviso-act perg';
  d.textContent=texto;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),8000);
}
if(window.escritorio)window.escritorio.onAviso(avisoEscritorio);
