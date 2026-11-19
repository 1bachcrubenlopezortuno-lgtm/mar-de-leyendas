/* ------------------------------------------------------------------------
   SONIDO · todo sintetizado en el navegador (sin archivos). Música original.
   ------------------------------------------------------------------------ */
const AU={ctx:null,master:null,mus:null,fx:null,noise:null,track:null,want:null,step:0,next:0,timer:null,
  music:true,sfxOn:true};
try{AU.music=localStorage.getItem('mdl_music')!=='0';AU.sfxOn=localStorage.getItem('mdl_sfx')!=='0'}catch(e){}
function auInit(){
  if(AU.ctx||window.SIM)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  const c=new C();AU.ctx=c;AU.master=c.createGain();AU.master.gain.value=.9;AU.master.connect(c.destination);
  AU.mus=c.createGain();AU.mus.gain.value=AU.music?.28:0;AU.mus.connect(AU.master);
  AU.fx=c.createGain();AU.fx.gain.value=AU.sfxOn?.6:0;AU.fx.connect(AU.master);
  const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.noise=b;
  if(AU.want)playMusic(AU.want,true);
}
addEventListener('pointerdown',()=>{auInit();if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume()},{passive:true});
addEventListener('keydown',()=>{auInit();if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume()});
const NOTE={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
function nf(n){const m=n.match(/^([A-G][#b]?)(\d)$/);return 440*Math.pow(2,(NOTE[m[1]]+(+m[2]+1)*12-69)/12)}
function tone(f,dur,type='square',vol=.2,when=0,slide=null,dest){
  const c=AU.ctx;if(!c)return;const t=(when||c.currentTime),o=c.createOscillator(),g=c.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,slide),t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0008,t+dur);
  o.connect(g);g.connect(dest||AU.fx);o.start(t);o.stop(t+dur+.02);
}
function noise(dur,vol=.3,ftype='bandpass',freq=1000,when=0,dest,q=1){
  const c=AU.ctx;if(!c)return;const t=(when||c.currentTime),src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
  src.buffer=AU.noise;f.type=ftype;f.frequency.value=freq;f.Q.value=q;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);
  src.connect(f);f.connect(g);g.connect(dest||AU.fx);src.start(t,Math.random()*.5);src.stop(t+dur+.02);
}
const SFX={
  hit:t=>{noise(.09,.55,'bandpass',900,t);tone(190,.13,'square',.22,t,60)},
  crit:t=>{SFX.hit(t);tone(1320,.09,'square',.14,t+.05);tone(1760,.12,'square',.12,t+.11)},
  slash:t=>{noise(.16,.45,'highpass',2600,t);tone(950,.1,'sawtooth',.08,t,260)},
  shot:t=>{noise(.14,.6,'lowpass',1600,t);noise(.04,.5,'highpass',5000,t)},
  boing:t=>{tone(260,.12,'sine',.3,t,820);tone(820,.16,'sine',.25,t+.12,240)},
  stretch:t=>{tone(200,.25,'square',.12,t,700)},
  heal:t=>{['C5','E5','G5','C6'].forEach((n,i)=>tone(nf(n),.16,'triangle',.22,t+i*.06))},
  buff:t=>{tone(320,.28,'square',.12,t,980);tone(640,.2,'triangle',.1,t+.08,1300)},
  debuff:t=>{tone(700,.3,'sawtooth',.1,t,180)},
  coin:t=>{tone(nf('B5'),.08,'square',.14,t);tone(nf('E6'),.22,'square',.14,t+.08)},
  click:t=>{tone(1100,.035,'square',.07,t)},
  blip:t=>{tone(620+Math.random()*80,.025,'square',.035,t)},
  alert:t=>{tone(nf('A5'),.08,'square',.15,t);tone(nf('D6'),.16,'square',.15,t+.09)},
  levelup:t=>{['C5','E5','G5','C6','E6','G6'].forEach((n,i)=>tone(nf(n),.14,'square',.11,t+i*.07))},
  victory:t=>{[['G4',.12],['C5',.12],['E5',.12],['G5',.3],['E5',.12],['G5',.6]].reduce((acc,[n,d])=>{tone(nf(n),d+.05,'square',.13,t+acc);tone(nf(n)/2,d+.05,'triangle',.18,t+acc);return acc+d},0)},
  defeat:t=>{[['E4',.25],['D4',.25],['C4',.25],['B3',.8]].reduce((acc,[n,d])=>{tone(nf(n),d,'triangle',.22,t+acc);return acc+d},0)},
  thunder:t=>{noise(1.8,.8,'lowpass',260,t);noise(.25,.4,'bandpass',900,t)},
  splash:t=>{noise(.35,.08,'bandpass',700,t,null,.7)},
  step:t=>{noise(.04,.05,'lowpass',600,t)},
  door:t=>{tone(330,.08,'square',.08,t);tone(495,.12,'square',.08,t+.07)}
};
function sfx(name){if(window.SIM||!AU.ctx||!AU.sfxOn)return;try{SFX[name]&&SFX[name](AU.ctx.currentTime)}catch(e){}}
/* --- música: secuenciador sencillo. Notación "Nota/duración" en corcheas, "-" silencio --- */
function seq(str){const out=[];let st=0;str.split(/\s+/).filter(Boolean).forEach(tok=>{if(tok==='|')return;const [n,d]=tok.split('/');const len=+(d||1);if(n!=='-')out.push([st,n,len]);st+=len});return{notes:out,len:st}}
Object.values(SONGS).forEach(S=>{S.L=seq(S.lead);S.B=seq(S.bass);S.len=Math.max(S.L.len,S.B.len)});
function playMusic(name,force){
  AU.want=name;if(!AU.ctx||window.SIM)return;if(AU.track===name&&!force)return;
  AU.track=name;AU.step=0;AU.next=AU.ctx.currentTime+.08;
  if(!AU.timer)AU.timer=setInterval(schedMusic,30);
}
function stopMusic(){AU.track=null;AU.want=null}
function schedMusic(){
  const c=AU.ctx;if(!c||!AU.track)return;const S=SONGS[AU.track],dt=60/S.bpm;
  while(AU.next<c.currentTime+.15){
    const st=AU.step%S.len,t=AU.next;
    if(AU.music){
      S.L.notes.forEach(([s0,n,l])=>{if(s0===st){tone(nf(n),l*dt*.92,S.leadType,S.leadVol,t,null,AU.mus);tone(nf(n)*1.005,l*dt*.9,S.leadType,S.leadVol*.35,t+.01,null,AU.mus)}});
      S.B.notes.forEach(([s0,n,l])=>{if(s0===st)tone(nf(n),l*dt*.85,'triangle',.26,t,null,AU.mus)});
      const dch=S.drums[st%S.drums.length];
      if(dch==='k')tone(120,.12,'sine',.5,t,40,AU.mus);
      if(dch==='s')noise(.09,.25,'bandpass',1800,t,AU.mus);
      if(dch==='h')noise(.03,.08,'highpass',7000,t,AU.mus);
    }
    AU.next+=dt;AU.step++;
  }
}
function setMusic(on){AU.music=on;try{localStorage.setItem('mdl_music',on?'1':'0')}catch(e){};if(AU.mus)AU.mus.gain.value=on?.28:0}
function setSfx(on){AU.sfxOn=on;try{localStorage.setItem('mdl_sfx',on?'1':'0')}catch(e){};if(AU.fx)AU.fx.gain.value=on?.6:0}
let TXTSPD=2;try{TXTSPD=+(localStorage.getItem('mdl_txt')||2)}catch(e){}
