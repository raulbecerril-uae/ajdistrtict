(()=>{const g=document.getElementById('evg');if(!g)return;const w=g.parentElement,prev=w.querySelector('.prev'),next=w.querySelector('.next'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
let pos=0,paused=false,drag=null,moved=0,rt=0,busy=false,vis=true,last=0;
const max=()=>g.scrollWidth-g.clientWidth,step=()=>{const c=g.querySelector('.evc');return c?c.getBoundingClientRect().width+18:300};
function ui(){const m=max();prev.classList.toggle('dis',g.scrollLeft<=2);next.classList.toggle('dis',g.scrollLeft>=m-2)}
function hold(ms){paused=true;clearTimeout(rt);rt=setTimeout(()=>{paused=false;pos=g.scrollLeft},ms)}
prev.onclick=()=>{hold(4000);g.scrollBy({left:-step(),behavior:'smooth'})};next.onclick=()=>{hold(4000);g.scrollBy({left:step(),behavior:'smooth'})};
g.addEventListener('scroll',ui,{passive:true});
w.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){paused=true;clearTimeout(rt)}});
w.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!drag)hold(700)});
g.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button)return;drag={x:e.clientX,s:g.scrollLeft};moved=0});
addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;moved=Math.max(moved,Math.abs(dx));if(moved>4)g.classList.add('drag');g.scrollLeft=drag.s-dx});
addEventListener('pointerup',()=>{if(!drag)return;drag=null;g.classList.remove('drag');pos=g.scrollLeft;hold(2500)});
g.addEventListener('click',e=>{if(moved>5){e.preventDefault();e.stopPropagation()}moved=0},true);
g.addEventListener('touchstart',()=>hold(3500),{passive:true});g.addEventListener('wheel',()=>hold(2500),{passive:true});
w.addEventListener('focusin',()=>{paused=true;clearTimeout(rt)});w.addEventListener('focusout',()=>hold(1500));
new IntersectionObserver(es=>vis=es[0].isIntersecting).observe(w);
new MutationObserver(()=>{pos=0;g.scrollLeft=0;ui()}).observe(g,{childList:true});
function loop(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;
 if(!paused&&!drag&&!busy&&vis&&!reduce.matches&&!document.hidden){const m=max();if(m>4){pos=Math.min(m,pos+34*dt);g.scrollLeft=pos;
  if(pos>=m-1){busy=true;setTimeout(()=>{g.scrollTo({left:0,behavior:'smooth'});setTimeout(()=>{pos=0;busy=false},1100)},1400)}}}
 requestAnimationFrame(loop)}
requestAnimationFrame(loop);setTimeout(ui,300);addEventListener('resize',ui)})();
