/* ---- smooth FAQ collapse: animate details open/close instead of the instant native toggle ---- */
(()=>{
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
document.querySelectorAll('details').forEach(d=>{
  const sum=d.querySelector('summary');if(!sum)return;
  const kids=[...d.children].filter(c=>c!==sum);if(!kids.length)return;
  const b=document.createElement('div');b.className='dbody';
  kids.forEach(c=>b.append(c));d.append(b);
  let busy=false;
  sum.addEventListener('click',e=>{
    e.preventDefault();if(busy)return;busy=true;
    if(!d.open){
      d.open=true;
      const sh=b.scrollHeight;
      b.style.height='0px';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{b.style.height=sh+'px'}));
      setTimeout(()=>{b.style.height='';busy=false},480);
    }else{
      const sh=b.scrollHeight;
      b.style.height=sh+'px';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{b.style.height='0px'}));
      setTimeout(()=>{d.open=false;b.style.height='';busy=false},480);
    }
  });
});
})();
