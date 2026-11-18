(function(){var el=document.getElementById('pl'),h=document.documentElement;if(!el)return;var svg=document.getElementById('plsvg'),img=svg.querySelector('image'),rm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches,t0=Date.now(),min=rm?400:2800,done=false;
function end(){el.remove();h.classList.remove('pl-fly')}
function fin(){if(done)return;done=true;var tg=document.querySelector('header .brand img'),r2=tg&&tg.getBoundingClientRect(),fly=false;
if(!rm&&r2&&r2.width>20){var r1=img.getBoundingClientRect(),c=svg.getBoundingClientRect(),s=r2.width/r1.width,cx=c.left+c.width/2,cy=c.top+c.height/2,x1=r1.left+r1.width/2,y1=r1.top+r1.height/2,x2=r2.left+r2.width/2,y2=r2.top+r2.height/2;svg.style.transform='translate('+(x2-cx-s*(x1-cx))+'px,'+(y2-cy-s*(y1-cy))+'px) scale('+s+')';fly=true}
h.classList.add('pl-intro');if(fly)h.classList.add('pl-fly');h.classList.remove('pl');el.classList.add('out');
setTimeout(function(){h.classList.remove('pl-intro')},2800);
setTimeout(function(){if(fly){h.classList.remove('pl-fly');el.classList.add('gone');setTimeout(end,400)}else end()},fly?1000:900)}
function go(){setTimeout(fin,Math.max(0,min-(Date.now()-t0)))}
if(document.readyState==='complete')go();else addEventListener('load',go);setTimeout(fin,6000)})();
