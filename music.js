let aCtx=null,mOn=false,mNodes=[],crashTimer=null,noteTimer=null;
function buildMusic(){
  if(!aCtx)aCtx=new(window.AudioContext||window.webkitAudioContext)();
  if(aCtx.state==='suspended')aCtx.resume();
  mNodes.forEach(n=>{try{n.stop();}catch(e){}});mNodes=[];
  if(crashTimer){clearTimeout(crashTimer);crashTimer=null;}
  if(noteTimer){clearTimeout(noteTimer);noteTimer=null;}
  const master=aCtx.createGain();
  master.gain.setValueAtTime(0,aCtx.currentTime);
  master.gain.linearRampToValueAtTime(0.38,aCtx.currentTime+7);
  master.connect(aCtx.destination);mNodes.push(master);
  const limiter=aCtx.createDynamicsCompressor();
  limiter.threshold.value=-14;limiter.knee.value=10;limiter.ratio.value=4;
  limiter.connect(master);
  const revLen=Math.floor(aCtx.sampleRate*2.8);
  const revBuf=aCtx.createBuffer(2,revLen,aCtx.sampleRate);
  for(let ch=0;ch<2;ch++){const d=revBuf.getChannelData(ch);for(let i=0;i<revLen;i++){const t=i/revLen;d[i]=(Math.random()*2-1)*Math.pow(1-t,1.8);}}
  const reverb=aCtx.createConvolver();reverb.buffer=revBuf;
  const wetG=aCtx.createGain();wetG.gain.value=0.68;reverb.connect(wetG);wetG.connect(limiter);
  const dryG=aCtx.createGain();dryG.gain.value=0.16;dryG.connect(limiter);
  const plp=aCtx.createBiquadFilter();plp.type='lowpass';plp.frequency.value=3000;plp.Q.value=0.5;
  const php=aCtx.createBiquadFilter();php.type='highpass';php.frequency.value=110;
  plp.connect(php);php.connect(dryG);php.connect(reverb);
  function playNote(freq,vel,dur){
    if(!mOn)return;const now=aCtx.currentTime;
    const o1=aCtx.createOscillator(),g1=aCtx.createGain();
    o1.type='sine';o1.frequency.value=freq;
    g1.gain.setValueAtTime(0,now);g1.gain.linearRampToValueAtTime(vel,now+0.04);
    g1.gain.exponentialRampToValueAtTime(vel*0.5,now+0.4);g1.gain.exponentialRampToValueAtTime(0.0001,now+dur);
    o1.connect(g1);g1.connect(plp);o1.start(now);o1.stop(now+dur+0.1);
    const o2=aCtx.createOscillator(),g2=aCtx.createGain();
    o2.type='triangle';o2.frequency.value=freq*2;
    g2.gain.setValueAtTime(0,now);g2.gain.linearRampToValueAtTime(vel*0.18,now+0.05);g2.gain.exponentialRampToValueAtTime(0.0001,now+dur*0.65);
    o2.connect(g2);g2.connect(plp);o2.start(now);o2.stop(now+dur+0.1);
    mNodes.push(o1,o2);
  }
  const seq=[
    {f:587.33,v:0.10,d:5.5},null,null,
    {f:440.00,v:0.09,d:6.0},null,
    {f:349.23,v:0.09,d:7.0},null,null,null,
    {f:293.66,v:0.11,d:6.5},null,
    {f:261.63,v:0.08,d:5.0},{f:349.23,v:0.10,d:8.0},null,null,
    {f:[293.66,440.00],v:0.08,d:7.5},null,null,null,
    {f:523.25,v:0.09,d:5.0},null,{f:440.00,v:0.08,d:5.5},null,
    {f:349.23,v:0.09,d:6.0},null,{f:220.00,v:0.11,d:9.0},null,null,null,null,
    {f:698.46,v:0.06,d:4.5},null,null,
    {f:293.66,v:0.10,d:6.0},null,{f:[220.00,349.23],v:0.07,d:8.0},null,null,null,null,null,
  ];
  let si=0;
  function next(){
    if(!mOn)return;const item=seq[si++%seq.length];let gap;
    if(!item){gap=4000+Math.random()*5000;}
    else if(Array.isArray(item.f)){item.f.forEach(f=>playNote(f,item.v,item.d));gap=item.d*1000*0.65+Math.random()*2000;}
    else{playNote(item.f,item.v,item.d);gap=item.d*1000*0.60+Math.random()*1800;}
    noteTimer=setTimeout(next,gap);
  }
  noteTimer=setTimeout(next,5000);
  const bufLen=aCtx.sampleRate*4;const nBuf=aCtx.createBuffer(2,bufLen,aCtx.sampleRate);
  for(let ch=0;ch<2;ch++){const d=nBuf.getChannelData(ch);let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0;
    for(let i=0;i<bufLen;i++){const w=Math.random()*2-1;b0=0.99886*b0+w*0.0555179;b1=0.99332*b1+w*0.0750759;b2=0.96900*b2+w*0.1538520;b3=0.86650*b3+w*0.3104856;b4=0.55000*b4+w*0.5329522;b5=-0.7616*b5-w*0.0168980;d[i]=(b0+b1+b2+b3+b4+b5+w*0.5362)*0.09;}}
  const ocean=aCtx.createBufferSource();ocean.buffer=nBuf;ocean.loop=true;
  const oHp=aCtx.createBiquadFilter();oHp.type='highpass';oHp.frequency.value=80;
  const oLp=aCtx.createBiquadFilter();oLp.type='lowpass';oLp.frequency.value=750;
  const lfo=aCtx.createOscillator(),lfoG=aCtx.createGain();
  lfo.type='sine';lfo.frequency.value=0.09;lfoG.gain.value=0.10;lfo.connect(lfoG);
  const oVol=aCtx.createGain();oVol.gain.value=0.12;lfoG.connect(oVol.gain);
  ocean.connect(oHp);oHp.connect(oLp);oLp.connect(oVol);oVol.connect(limiter);
  ocean.start();lfo.start();mNodes.push(ocean,lfo);
  function crash(){
    if(!mOn)return;const now=aCtx.currentTime;const cLen=aCtx.sampleRate*3;
    const cBuf=aCtx.createBuffer(1,cLen,aCtx.sampleRate);const cd=cBuf.getChannelData(0);
    for(let i=0;i<cLen;i++)cd[i]=(Math.random()*2-1)*Math.pow(1-i/cLen,1.6)*0.85;
    const cr=aCtx.createBufferSource();cr.buffer=cBuf;
    const clp=aCtx.createBiquadFilter();clp.type='lowpass';clp.frequency.value=400;
    const cg=aCtx.createGain();cg.gain.setValueAtTime(0,now);cg.gain.linearRampToValueAtTime(0.12,now+0.8);cg.gain.linearRampToValueAtTime(0,now+3.0);
    cr.connect(clp);clp.connect(cg);cg.connect(limiter);cr.start(now);mNodes.push(cr);
    crashTimer=setTimeout(crash,25000+Math.random()*20000);
  }
  crashTimer=setTimeout(crash,14000+Math.random()*8000);
}
function toggleMusic(){
  const b=document.getElementById('musicBtn');
  if(!mOn){mOn=true;buildMusic();b.textContent='♬ on';b.style.color='#d0c060';b.style.borderColor='rgba(220,200,90,0.32)';}
  else{
    mOn=false;if(crashTimer){clearTimeout(crashTimer);crashTimer=null;}if(noteTimer){clearTimeout(noteTimer);noteTimer=null;}
    if(aCtx){const now=aCtx.currentTime;mNodes.forEach(n=>{try{if(n.gain){n.gain.cancelScheduledValues(now);n.gain.setValueAtTime(n.gain.value,now);n.gain.linearRampToValueAtTime(0,now+2);}}catch(e){}});setTimeout(()=>{mNodes.forEach(n=>{try{n.stop();}catch(e){}});mNodes=[];},2200);}
    b.textContent='♩ off';b.style.color='';b.style.borderColor='';
  }
}
