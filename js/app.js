const IMG={"hero":"assets/hero.jpg","gate":"assets/gate.jpg","booth":"assets/booth.jpg","row":"assets/row.jpg","aisle":"assets/aisle.jpg","coffee":"assets/coffee.jpg","logo":"assets/logo.png"};
document.querySelectorAll('[data-i]').forEach(i=>i.src=IMG[i.dataset.i]);
const $=s=>document.querySelector(s),aed=n=>'AED '+n.toLocaleString('en-US'),clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const liveCopy=(key,fallback='')=>window.AJ_LIVE_COPY?.[key]||window.AJ_CONFIG?.copy?.[key]||fallback;
const setActionLabel=(element,label)=>{if(!element||!label)return;const node=[...element.childNodes].find(item=>item.nodeType===Node.TEXT_NODE);if(node)node.nodeValue=label};
const whatsappNumber=()=>String(window.AJ_LIVE_SITE?.contact?.whatsapp||window.AJ_CONFIG?.site?.contact?.whatsapp||'971554662997').replace(/\D/g,'');
{const sponsorImages=['DSC04438.jpg','DSC04507.jpg','DSC04531.jpg','DSC04605.jpg','DSC04629.jpg','DSC04673.jpg','DSC04726.jpg','DSC04747.jpg','DSC04769.jpg','DSC04812.jpg'];let last='';try{last=sessionStorage.getItem('aj-sponsor-background')||''}catch(e){}let choices=sponsorImages.filter(name=>name!==last);const image=choices[Math.floor(Math.random()*choices.length)]||sponsorImages[0];document.querySelector('#sponsors')?.style.setProperty('--bg',`url("/photos/${image}")`);try{sessionStorage.setItem('aj-sponsor-background',image)}catch(e){}}
// themes
const TH=[['gulf','Gulf','#0E2B2C','#F0B35C'],['skyline','Skyline','#101D3A','#6CC6FF'],['dune','Dune','#EDE0C8','#A5481F'],['oasis','Oasis','#14301F','#B9D96A'],['falcon','Falcon','#23201D','#E2B04F'],['majlis','Majlis','#4B1E2B','#F2B94B'],['souq','Souq','#B5532E','#F6C879'],['pearl','Pearl','#E9EFEC','#0E6B6B'],['custom','Custom','#0E2B2C','#F0B35C']];
function theme(t){const root=document.documentElement;['--panel','--panel2','--deep','--on','--acc','--acc-on','--sand','--paper'].forEach(k=>root.style.removeProperty(k));root.dataset.theme=t;requestAnimationFrame(()=>{const m=document.querySelector('meta[name=theme-color]');if(m)m.content=getComputedStyle(root).getPropertyValue('--panel').trim()});document.querySelectorAll('[data-themes] button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===t));try{localStorage.setItem('ajt',t)}catch(e){}}
document.querySelectorAll('[data-themes]').forEach(box=>TH.forEach(([t,n,a,b])=>{const e=document.createElement('button');e.dataset.t=t;e.title=n+' theme';e.setAttribute('aria-label',n+' theme');e.style.cssText=`--a:${a};--b:${b}`;e.onclick=()=>theme(t);box.append(e)}));
{const defaultTheme=window.AJ_CONFIG?.appearance?.theme||'gulf';theme(TH.some(x=>x[0]===defaultTheme)?defaultTheme:'gulf')}
// countdown + header
let T=new Date(`${window.AJ_CONFIG?.event?.start||'2026-11-27T16:00'}:00+04:00`);
function tick(){let t=Math.max(0,T-Date.now())/1000;const live=T-Date.now()<=0;const l=$('#cdl span');if(l)l.textContent=live?liveCopy('booking_countdown_now','Happening now'):liveCopy('booking_countdown_label','Doors open in');
 [['d',86400],['h',3600],['m',60],['s',1]].forEach(([k,v])=>{const e=$('#'+k),n=String(Math.floor(t/v)).padStart(2,'0');if(e.textContent!==n){e.textContent=n;e.classList.remove('flip');void e.offsetWidth;e.classList.add('flip')}t%=v})}
tick();setInterval(tick,1000);
addEventListener('scroll',()=>$('#hd').classList.toggle('solid',scrollY>40||document.body.classList.contains('rp')),{passive:true});
// data
// layout from the booth grid: 20 columns x 15 rows, 92 booths
const W=1104,H=780,SZ=34,CX=W/2,CY=H/2,GATE=[577,H-30],PX=50,PY=44,MX=60,MY=60;
const CELLS=[];
const blk=c=>(c>=1&&c<=8)||(c>=12&&c<=19);
[0,2,7,9,14].forEach(r=>{for(let c=0;c<20;c++)if(blk(c))CELLS.push([r,c])});
[1,8].forEach(r=>{CELLS.push([r,9],[r,11])});
for(let r=4;r<=11;r++)CELLS.push([r,0]);
[7,9].forEach(r=>CELLS.push([r,0]));
// de-duplicate (rows 7 and 9 already hold a west-end booth from the column)
const seen=new Set(),CL=CELLS.filter(([r,c])=>{const k=r+','+c;if(seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
const RL={0:'A',1:'B',2:'C',7:'D',8:'E',9:'F',14:'G'};
const BEHIND={A:'Open lawn',B:'Central aisle',C:'Picnic area',D:'Picnic area',E:'Central aisle',F:'Picnic area',G:'Picnic area',W:'Open lawn'};
const hold=[17,40,63,88],free=Array.from({length:CL.length},(_,i)=>i+1).filter(n=>n%5===2&&!hold.includes(n));
const S=CL.map(([r,c],i)=>{const n=i+1,x=MX+c*PX,y=MY+r*PY,row=c===0?'W':RL[r];
 return{n,r,c,row,type:'booth',x,y,behind:BEHIND[row],price:Number(window.AJ_CONFIG?.event?.booth_price)||2000,dist:Math.round(Math.hypot(x+SZ/2-GATE[0],y+SZ/2-GATE[1])*.1),st:hold.includes(n)?'hold':free.includes(n)?'free':'booked'}});
const ORD={};S.forEach(s=>{s.idx=ORD[s.row]=(ORD[s.row]??-1)+1});
const TABLES=[190,330,760,900].flatMap(x=>[[x,275],[x,583]]);
const MAX_SELECT=Math.max(1,Math.min(10,Number(window.AJ_CONFIG?.event?.max_per_order)||3));
let sel=[],cur=null,tf='all';
// 3D scene (kept light: five faces per booth)
const box=(x,y,w,d,h,c,o={})=>`<div class="bx ${o.cls||''}" ${o.id?`id="${o.id}"`:''} style="left:${x}px;top:${y}px;width:${w}px;height:${d}px;--c:${c};--h:${h}px;transform:translateZ(${o.z||0}px)"><i class="tp"></i><i class="fr"></i><i class="bk"></i><i class="lf"></i><i class="rt"></i></div>`;
let h='<div class="ground"></div>';
const gx=GATE[0];
h+=box(-70,H+8,W+140,62,1,'#2a2e32');
for(let x=-40;x<W+60;x+=70)h+=box(x,H+36,34,4,1.5,'#d8cdbb',{z:1});
h+=box(gx-45,H-100,90,108,1,'#b9a98a');
h+=box(gx-50,H-52,14,14,72,'#EFE3CF')+box(gx+36,H-52,14,14,72,'#EFE3CF')+box(gx-56,H-56,126,22,14,'#E8772E',{z:72});
h+=`<div class="lbl" style="left:${gx-85}px;top:${H+14}px">ENTRANCE</div>`;
TABLES.forEach(([x,y])=>{h+=box(x-18,y-12,36,24,9,'#a8743f')});
const seenR={};S.forEach(q=>{if(!seenR[q.row]){seenR[q.row]=1;h+=`<div class="rl" style="left:${q.row==='W'?q.x+SZ/2-7:q.x-22}px;top:${q.row==='W'?q.y-26:q.y+SZ/2-10}px">${q.row}</div>`}});
S.forEach(s=>{h+=box(s.x,s.y,SZ,SZ,28,'#fff',{cls:'bth',id:'r'+s.n});
 h+=`<button class="pin" id="p${s.n}" data-n="${s.n}" style="left:${s.x+SZ/2}px;top:${s.y+SZ/2}px;--hh:46px">${s.n}</button>`});
$('#scene').innerHTML=h;
const stage=$('#stage'),cam={rx:58,rz:-28,z:.5,px:0,py:0};
const wide=()=>stage.clientWidth>.95*stage.clientHeight;
// zoom that fits the whole venue inside the stage for a given camera angle
const fitZ=(rx,rz,m)=>{const c=Math.cos(rz*Math.PI/180),sn=Math.sin(rz*Math.PI/180),k=Math.cos(rx*Math.PI/180),X=[],Y=[];
 [[-50,-50],[W+50,-50],[-50,H+80],[W+50,H+80]].forEach(([x,y])=>{x-=CX;y-=CY;X.push(x*c-y*sn);Y.push((x*sn+y*c)*k)});
 return Math.min((stage.clientWidth-2*m)/(Math.max(...X)-Math.min(...X)),(stage.clientHeight-2*m)/(Math.max(...Y)-Math.min(...Y)+30))};
const home=()=>{const w=wide(),rx=w?52:48,rz=w?-6:-88;return{rx,rz,px:0,py:0,z:clamp(fitZ(rx,rz,w?12:8),.3,1.3)}};
function setCam(c){Object.assign(cam,c);cam.rx=clamp(cam.rx,0,80);cam.z=clamp(cam.z,.3,2.4);cam.px=clamp(cam.px,-900,900);cam.py=clamp(cam.py,-900,900);
 const st=stage.style;st.setProperty('--rx',cam.rx+'deg');st.setProperty('--rz',cam.rz+'deg');st.setProperty('--z',cam.z);st.setProperty('--px',cam.px+'px');st.setProperty('--py',cam.py+'px')}
let dr=null,pinch=null;const ptrs=new Map();
stage.onpointerdown=e=>{if(e.target.closest('.pin,.info,.ctl'))return;
 ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});try{stage.setPointerCapture(e.pointerId)}catch(_){}stage.classList.add('drag');
 if(ptrs.size===1)dr={x:e.clientX,y:e.clientY,pan:e.shiftKey||e.button===1||e.button===2};
 else{const[a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,mx:(a.x+b.x)/2,my:(a.y+b.y)/2};dr=null}};
stage.onpointermove=e=>{const p=ptrs.get(e.pointerId);if(!p)return;
 if(ptrs.size>=2&&pinch){p.x=e.clientX;p.y=e.clientY;const[a,b]=[...ptrs.values()],d=Math.hypot(a.x-b.x,a.y-b.y)||1,mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
  setCam({z:cam.z*d/pinch.d,px:cam.px+mx-pinch.mx,py:cam.py+my-pinch.my});pinch={d,mx,my};return}
 if(!dr)return;const dx=e.clientX-dr.x,dy=e.clientY-dr.y;
 dr.pan?setCam({px:cam.px+dx,py:cam.py+dy}):setCam({rz:cam.rz+dx*.35,rx:cam.rx-dy*.25});
 dr.x=p.x=e.clientX;dr.y=p.y=e.clientY};
stage.onpointerup=stage.onpointercancel=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;
 if(!ptrs.size){dr=null;stage.classList.remove('drag')}else if(ptrs.size===1){const q=[...ptrs.values()][0];dr={x:q.x,y:q.y}}};
stage.addEventListener('contextmenu',e=>e.preventDefault());
stage.addEventListener('pointerdown',()=>$('.hint').classList.add('gone'),{once:true});setTimeout(()=>$('.hint').classList.add('gone'),9000);
stage.addEventListener('wheel',e=>{if(!(e.ctrlKey||e.metaKey))return;e.preventDefault();setCam({z:cam.z*(e.deltaY<0?1.1:.91)})},{passive:false});
$('#zi').onclick=()=>setCam({z:cam.z*1.2});$('#zo').onclick=()=>setCam({z:cam.z/1.2});$('#rl').onclick=()=>setCam({rz:cam.rz-35});$('#rr').onclick=()=>setCam({rz:cam.rz+35});$('#rs').onclick=()=>setCam(home());
// views
function view(v){V=v;document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v));stage.hidden=v!=='3d';$('#plan').hidden=v!=='2d';$('#list').hidden=v!=='grid';$('#rows').hidden=v!=='list';hideTip();if(v==='3d')setCam(home())}
document.querySelectorAll('#views button').forEach(b=>b.onclick=()=>view(b.dataset.v));
// paint
const COL={free:null,hold:'#E3B23C',booked:'#8d8579'};
function paint(){S.forEach(s=>{const on=sel.includes(s.n),p=$('#p'+s.n),r=$('#r'+s.n);
 p.className='pin'+(on?' chosen':s.st==='hold'?' hold':s.st==='booked'?' booked':'')+(cur===s.n?' sel':'')+(tf!=='all'&&s.type!==tf&&!on?' dim':s.st==='free'&&!on&&cur!==s.n?' pulse':'');
 r.style.setProperty('--c',on?'var(--acc)':COL[s.st]||(s.type==='booth'?'#fff':'#f4ead9'));
  p.setAttribute('aria-label',`Space ${s.n}, ${aed(s.price)}, ${on?'your choice':s.st}`);p.setAttribute('aria-pressed',on?'true':'false')});
 document.querySelectorAll('#left,#left2').forEach(e=>e.textContent=S.filter(s=>s.st==='free').length);
 const tot=sel.reduce((a,n)=>a+S[n-1].price,0);sel.sort((a,b)=>a-b);
 $('#bt').textContent=sel.length+(sel.length===1?' space':' spaces');$('#bn').textContent=sel.length?'Space '+sel.join(', '):'';$('#tot').textContent=aed(tot);$('#bar').classList.toggle('show',sel.length>0);document.body.classList.toggle('hasbar',sel.length>0);
 grid();rows();draw2d();
 kinds();mysel();$('#mysel').hidden=!sel.length;$('#side').classList.toggle('has',sel.length>0);if(cur)info(cur);else idle()}
function toggle(n){const i=sel.indexOf(n);if(i>-1)sel.splice(i,1);else if(sel.length>=MAX_SELECT)return toast(`You can choose up to ${MAX_SELECT} spaces`);else sel.push(n);paint()}
function pick(n){cur=n;paint()}
 function activateSpace(n){const s=S[n-1];if(!s)return;cur=n;if(s.st==='free'||sel.includes(n)){if(!sel.includes(n)&&sel.length>=MAX_SELECT){paint();return toast(`You can choose up to ${MAX_SELECT} spaces`)}toggle(n)}else paint()}
function info(n){$('#side').classList.add('active');const s=S[n-1],on=sel.includes(n),free=s.st==='free',B=s.type==='booth',
 nb=S.filter(q=>q.row===s.row&&(s.row==='W'?Math.abs(q.r-s.r)===1:q.r===s.r&&Math.abs(q.c-s.c)===1)).map(q=>`${q.n} ${q.st==='free'?'free':q.st==='hold'?'held':'booked'}`).join(' · ')||'Open lawn';
 const lab=on?'In your booking':free?'Available':s.st==='hold'?'On hold':'Booked',I=$('#info');
 I.className='info show';
 I.innerHTML=`<div class="ih"><div class="num">${n}</div><div><h3>${B?'White booth':'Empty space'}</h3><span class="st ${on?'ch':s.st}"><i></i>${lab}</span></div><button class="x" aria-label="Close"><i class="ph-light ph-x"></i></button></div>
 <dl class="kv"><div><dt>Position</dt><dd>Row ${s.row}, no. ${s.idx+1}</dd></div><div><dt>From the gate</dt><dd>About ${s.dist} m</dd></div><div><dt>Behind</dt><dd>${s.behind}</dd></div><div><dt>Next to</dt><dd>${nb}</dd></div></dl>
 <div class="pr"><b>${aed(s.price)}</b><span>for all three days</span></div>
 <div class="acts"><button class="btn ${on?'sd':'acc'}" ${free?'':'disabled'} id="ia">${on?'<i class="ph-light ph-minus-circle"></i> Remove':free?'<i class="ph-light ph-plus-circle"></i> Add to my booking':'Not available'}</button><button class="btn ghost ic" id="is" aria-label="Share this space"><i class="ph-light ph-share-network"></i></button></div>`;
 I.querySelector('.x').onclick=()=>{cur=null;paint()};$('#ia').onclick=()=>toggle(n);
 $('#is').onclick=async()=>{const t=`${B?'White booth':'Empty space'} ${n} at Demo Event, Ajman · ${aed(s.price)}`;try{if(navigator.share)await navigator.share({text:t});else{await navigator.clipboard.writeText(t);toast('Copied. Paste it anywhere')}}catch(e){}}}
 $('#scene').addEventListener('click',e=>{const p=e.target.closest('.pin');if(p)activateSpace(+p.dataset.n)});
$('#list').addEventListener('click',e=>{const b=e.target.closest('button');if(b)toggle(+b.dataset.n)});
const KINDS=()=>[['all','All spaces',''],['booth','White booths',aed(2000)],['empty','Empty spaces',aed(1100)]].filter(([k])=>k==='all'?new Set(S.map(q=>q.type)).size>1:S.some(q=>q.type===k));
function kinds(){const f=t=>S.filter(s=>s.st==='free'&&(t==='all'||s.type===t)).length;
 $('#kinds').innerHTML=KINDS().map(([k,n,p])=>`<button data-k="${k}" aria-pressed="${tf===k||KINDS().length===1}"><b>${n}</b><small>${p?p+' · ':''}${f(k)} free</small></button>`).join('')}
function idle(){const i=$('#info');i.className='info idle';i.innerHTML='<i class="ph-light ph-hand-pointing"></i><b>Choose a space</b><p>Tap a number on the map or a row in the list to see its price, position and neighbours.</p>';$('#side').classList.remove('active')}
function mysel(){const t=sel.reduce((a,n)=>a+S[n-1].price,0);
 $('#mysel').innerHTML=`<h4><span>Your selection</span><span>${sel.length} of ${MAX_SELECT}<button type="button" class="lnk" id="clr2">Clear all</button></span></h4>`+(sel.length?`<div class="sels">${sel.map(n=>`<span class="sc"><button data-p="${n}">${S[n-1].type==='booth'?'Booth':'Space'} ${n}<small>${aed(S[n-1].price)}</small></button><button data-r="${n}" aria-label="Remove space ${n}"><i class="ph-light ph-x"></i></button></span>`).join('')}</div><div class="tt"><span>Total</span><b>${aed(t)}</b></div><button class="btn acc" id="go2">Continue <i class="ph-light ph-arrow-right"></i></button>`:`<p class="mut">Nothing chosen yet. You can reserve up to ${MAX_SELECT} spaces in one order.</p>`)}
$('#kinds').onclick=e=>{const b=e.target.closest('[data-k]');if(b){tf=b.dataset.k;paint()}};
$('#mysel').onclick=e=>{const r=e.target.closest('[data-r]'),p=e.target.closest('[data-p]');if(r)toggle(+r.dataset.r);else if(p){pick(+p.dataset.p)}else if(e.target.closest('#go2'))$('#go').click()};
// Bar shows only when user has selected spaces (sel.length>0)
function fly(s){if(!s)return;if(V!=='3d'){pick(s.n);return}stage.scrollIntoView({behavior:'smooth',block:'center'});
 const h=home(),rz=wide()?-6:-88,z=clamp(h.z*1.9,.8,1.6),a=rz*Math.PI/180,x=s.x+SZ/2-CX,y=s.y+SZ/2-CY;
 setCam({rx:h.rx,rz,z,px:-(x*Math.cos(a)-y*Math.sin(a))*z,py:-(x*Math.sin(a)+y*Math.cos(a))*Math.cos(h.rx*Math.PI/180)*z});pick(s.n)}
$('#qNear').onclick=()=>fly(S.filter(s=>s.st==='free'&&(tf==='all'||s.type===tf)).sort((a,b)=>a.dist-b.dist)[0]);
if(new Set(S.map(q=>q.price)).size<2)$('#qCheap').hidden=true;
$('#qCheap').onclick=()=>fly(S.filter(s=>s.st==='free').sort((a,b)=>a.price-b.price||a.dist-b.dist)[0]);
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2600)}
// checkout
const dlg=$('#dlg');
const PMS={card:['Card','credit-card'],apple:['Apple Pay','apple-logo'],google:['Google Pay','google-logo']};
const luhn=n=>{let t=0,d=false;for(let i=n.length-1;i>=0;i--){let x=+n[i];if(d){x*=2;if(x>9)x-=9}t+=x;d=!d}return n.length>=13&&t%10===0};
const brand=n=>/^4/.test(n)?'Visa':/^(5[1-5]|2[2-7])/.test(n)?'Mastercard':/^3[47]/.test(n)?'Amex':'';
const wait=ms=>new Promise(r=>setTimeout(r,ms));let PM='card';
function dstep(icon,title,msg){dlg.innerHTML=`<div class="dlg done"><div class="spin"><i class="ph-light ph-${icon}"></i></div><h2 style="font-size:1.6rem">${title}</h2><p class="sub" style="margin:6px auto 0">${msg}</p></div>`}
async function settle(tot,name,email,method){dstep('circle-notch','Authorising payment','Contacting your bank…');await wait(1400);pay(tot,name,email,method)}
function otp(tot,name,email,l4){dlg.innerHTML=`<form class="dlg done" id="otpf"><div class="tick"><i class="ph-light ph-shield-check" style="font-size:2.4rem;color:var(--on)"></i></div><h2 style="font-size:1.6rem">Verify with your bank</h2><p class="sub" style="margin:6px auto 0">Enter the 6-digit code sent to the phone linked to the card ending ${l4}.</p><input id="otpi" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="••••••" style="text-align:center;font-size:1.6rem;letter-spacing:.4em;margin-top:18px"><p class="err" id="oe" role="alert"></p><p class="fine">Demo code: 123456</p><button class="btn dk">Confirm payment</button><button type="button" class="lnk" id="oc" style="margin:10px 0 0">Back</button></form>`;
 $('#otpi').focus();$('#oc').onclick=()=>$('#go').click();$('#otpf').onsubmit=e=>{e.preventDefault();if($('#otpi').value!=='123456'){$('#oe').textContent='That code isn’t right. Use 123456 in this demo.';return}settle(tot,name,email,'Card')}}
function wallet(k,tot,name,email){const A=k==='apple';
 dlg.innerHTML=`<div class="dlg done wal ${k}"><div class="wh"><i class="ph-light ph-${PMS[k][1]}"></i> ${A?'Pay':'Google Pay'}</div><div class="wr"><span>AJ District<small>Demo Event 2026 · ${esc(name)}</small></span><b>${aed(tot)}</b></div><div class="wr"><span>Payment card<small>Visa ···· 4242</small></span><i class="ph-light ph-credit-card"></i></div><button class="btn wb ${k}" id="wgo"><i class="ph-light ph-${A?'scan':'fingerprint'}"></i> ${A?'Confirm with Face ID':'Confirm with fingerprint'}</button><button type="button" class="lnk" id="wc" style="margin:12px 0 0">Cancel</button></div>`;
 $('#wc').onclick=()=>$('#go').click();$('#wgo').onclick=async()=>{$('#wgo').disabled=true;$('#wgo').innerHTML='<i class="ph-light ph-circle-notch spinr"></i> Confirming…';await wait(1000);settle(tot,name,email,PMS[k][0])}}
$('#go').onclick=()=>{dlg.style.width='';const tot=sel.reduce((a,n)=>a+S[n-1].price,0);
 dlg.innerHTML=`<form class="dlg" id="f" novalidate><div class="dh"><button type="button" class="close" aria-label="Close" onclick="dlg.close()"><i class="ph-light ph-x"></i></button><span class="dk">Demo Event 2026 · Ajman</span><h2>Complete your booking</h2></div><div class="db">
 <ul class="ds">${sel.map(n=>`<li><i class="ph-light ph-${S[n-1].type==='booth'?'storefront':'tent'}"></i><span>${kind(n)} ${n}<small>Row ${S[n-1].row} · 27–29 Nov, 4 to 11 pm</small></span><b>${aed(S[n-1].price)}</b></li>`).join('')}</ul>
 <div class="dt"><span>Total</span><b>${aed(tot)}</b></div>
  <label for="n">Project or brand name</label><div class="fi"><i class="ph-light ph-buildings"></i><input id="n" required autocomplete="organization" aria-describedby="name-error"></div><p class="field-error" id="name-error" aria-live="polite"></p>
  <label for="e">Email</label><div class="fi"><i class="ph-light ph-envelope-simple"></i><input id="e" type="email" required autocomplete="email" aria-describedby="email-error"></div><p class="field-error" id="email-error" aria-live="polite"></p>
 <label>Payment method</label><div class="pm" role="group" aria-label="Payment method">${Object.entries(PMS).map(([k,[n,i]])=>`<button type="button" data-pm="${k}" aria-pressed="false"><i class="ph-light ph-${i}"></i>${n}</button>`).join('')}</div>
 <div id="pcard"><div class="cc"><div class="cct"><i class="ph-light ph-contactless-payment"></i><b id="ccb">CARD</b></div><div class="ccn" id="ccn">•••• •••• •••• ••••</div><div class="ccf"><span id="ccm">YOUR NAME</span><span id="cce">MM/YY</span></div></div>
 <label for="cn">Card number</label><div class="fi"><i class="ph-light ph-credit-card"></i><input id="cn" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456"></div>
 <label for="cm">Name on card</label><div class="fi"><i class="ph-light ph-user"></i><input id="cm" autocomplete="cc-name"></div>
 <div class="two"><div><label for="cx">Expiry</label><input id="cx" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5"></div><div><label for="cv">Security code</label><input id="cv" inputmode="numeric" autocomplete="cc-csc" placeholder="CVC" type="password" maxlength="4"></div></div>
 <p class="err" id="cerr" role="alert"></p><button type="button" class="lnk" id="democ" style="margin:0">Fill demo card 4242 4242 4242 4242</button></div>
 <button class="btn dk" id="payb"></button><p class="fine" id="pnote"></p></div></form>`;
 const f=$('#f'),cn=$('#cn'),cx=$('#cx'),cv=$('#cv'),cm=$('#cm'),pb=$('#payb');
 const prev=()=>{$('#ccn').textContent=cn.value||'•••• •••• •••• ••••';$('#ccm').textContent=cm.value.toUpperCase()||'YOUR NAME';$('#cce').textContent=cx.value||'MM/YY';$('#ccb').textContent=brand(cn.value.replace(/\D/g,''))||'CARD'};
 const setPM=m=>{PM=m;f.querySelectorAll('[data-pm]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.pm===m));$('#pcard').hidden=m!=='card';pb.className='btn '+(m==='card'?'dk':'wb '+m);
  pb.innerHTML=m==='card'?`<i class="ph-light ph-lock-simple"></i> Pay ${aed(tot)}`:`<i class="ph-light ph-${PMS[m][1]}"></i> Pay with ${PMS[m][0]}`;
  $('#pnote').textContent=m==='card'?'Demo only. Nothing is charged and card details are never stored.':'You’ll confirm on the next step, like on your phone. Demo only.'};
 f.querySelector('.pm').onclick=e=>{const b=e.target.closest('[data-pm]');if(b)setPM(b.dataset.pm)};
 cn.oninput=()=>{const d=cn.value.replace(/\D/g,'').slice(0,19);cn.value=/^3[47]/.test(d)?[d.slice(0,4),d.slice(4,10),d.slice(10,15)].filter(Boolean).join(' '):d.replace(/(\d{4})(?=\d)/g,'$1 ');prev()};
 cx.oninput=()=>{let d=cx.value.replace(/\D/g,'').slice(0,4);if(d.length>=3)d=d.slice(0,2)+'/'+d.slice(2);cx.value=d;prev()};
 cv.oninput=()=>{cv.value=cv.value.replace(/\D/g,'').slice(0,4)};cm.oninput=prev;
 $('#democ').onclick=()=>{cn.value='4242 4242 4242 4242';cx.value='12/29';cv.value='123';cm.value=($('#n').value||'Demo User');prev()};
  const nameInput=$('#n'),emailInput=$('#e'),nameError=$('#name-error'),emailError=$('#email-error');
  nameInput.addEventListener('input',()=>{nameError.textContent='';nameInput.removeAttribute('aria-invalid')});
  emailInput.addEventListener('input',()=>{emailError.textContent='';emailInput.removeAttribute('aria-invalid')});
  f.onsubmit=e=>{e.preventDefault();const name=nameInput.value.trim(),email=emailInput.value.trim();
   if(!name){nameError.textContent='Enter your project or brand name.';nameInput.setAttribute('aria-invalid','true');nameInput.focus();return}
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){emailError.textContent='Enter a valid email address, such as name@example.com.';emailInput.setAttribute('aria-invalid','true');emailInput.focus();return}
   if(PM!=='card')return wallet(PM,tot,name,email);
  const d=cn.value.replace(/\D/g,''),[mm,yy]=cx.value.split('/'),er=[];
  if(!luhn(d))er.push('Check the card number.');
  if(!(+mm>=1&&+mm<=12&&yy&&yy.length===2&&new Date(2000+ +yy,+mm,1)>new Date()))er.push('Expiry date is invalid or past.');
  if(cv.value.length<(brand(d)==='Amex'?4:3))er.push('Enter the security code.');
  if(!cm.value.trim())er.push('Enter the name on the card.');
  $('#cerr').textContent=er.join(' ');if(!er.length)otp(tot,name,email,d.slice(-4))};
 setPM(PM);dlg.showModal()};
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const bars=no=>{let h=0;for(const c of no)h=(h*31+c.charCodeAt(0))>>>0;const o=[];let x=0;for(let i=0;i<46;i++){h=(h*1103515245+12345)>>>0;const w=1+(h>>>16)%3;o.push([x,w]);x+=w+1+(h>>>20)%2}return{o,W:x}};
const barSVG=no=>{const b=bars(no);return `<svg viewBox="0 0 ${b.W} 40" preserveAspectRatio="none" width="100%" height="40" aria-hidden="true">${b.o.map(([x,w])=>`<rect x="${x}" width="${w}" height="40"/>`).join('')}</svg>`};
const fmt=n=>(+n||0).toLocaleString('en-US',{maximumFractionDigits:2}),kind=n=>S[n-1].type==='booth'?'White booth':'Empty space';
const iso=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16),fdate=d=>d?new Date(d).toLocaleString('en-GB',{dateStyle:'long',timeStyle:'short'}):'';
const newNo=()=>'AJ-YI26-'+Math.floor(1000+Math.random()*9000);
const dflt=()=>({logo:'',issuer:'AJ District',issuerLine:'Ajman, UAE',tax:'',no:newNo(),date:iso(),event:'Demo Event 2026',venue:'Al Safia Park, Ajman',method:'Card',status:'Paid',cName:'Sample Brand',cContact:'Your name',cEmail:'hello@example.com',cPhone:'',cId:'',items:[{d:'Space 13 · White booth',q:1,p:2000},{d:'Space 14 · White booth',q:1,p:2000}],cur:'AED',disc:0,vat:0,notes:''});
let RC=dflt(),LASTBOOK=null,pt;
const calc=R=>{const sub=R.items.reduce((a,i)=>a+i.q*i.p,0),disc=Math.min(+R.disc||0,sub),vatAmt=(sub-disc)*(+R.vat||0)/100;return{sub,disc,vatAmt,total:sub-disc+vatAmt}};
function ticketHTML(R){const c=calc(R),m=v=>esc(R.cur)+' '+fmt(v),L=(k,v)=>v?`<div class="rw"><span>${k}</span><b dir="auto">${esc(v)}</b></div>`:'';
 return `<div class="th${R.logo?' light':''}"><img class="logo" src="${R.logo||IMG.logo}" alt=""><span>Receipt</span></div><div class="tb"><span class="paid" data-s="${esc(R.status)}">${esc(R.status)}</span><div class="no" dir="auto">${esc(R.no)}</div>
<div class="blk">${L('Event',R.event)}${L('Venue',R.venue)}${L('Date',fdate(R.date))}${L('Payment',R.method)}</div>
<div class="blk">${L('Client',R.cName)}${L('Contact',R.cContact)}${L('Email',R.cEmail)}${L('Phone',R.cPhone)}${L('License or ID',R.cId)}</div>
<div class="blk">${R.items.map(i=>`<div class="it"><div><span dir="auto">${esc(i.d)||'Item'}</span><small>${fmt(i.q)} × ${m(i.p)}</small></div><b>${m(i.q*i.p)}</b></div>`).join('')}</div>
<div class="blk sm"><div class="rw"><span>Subtotal</span><b>${m(c.sub)}</b></div>${c.disc?`<div class="rw"><span>Discount</span><b>-${m(c.disc)}</b></div>`:''}${+R.vat?`<div class="rw"><span>VAT ${fmt(R.vat)}%</span><b>${m(c.vatAmt)}</b></div>`:''}</div>
<div class="tt"><span>Total</span><b>${m(c.total)}</b></div>${R.notes?`<p class="nt" dir="auto">${esc(R.notes)}</p>`:''}<div class="bc">${barSVG(R.no)}</div><p class="ty">${esc(R.issuer)}${R.issuerLine?' · '+esc(R.issuerLine):''}${R.tax?'<br>Tax no. '+esc(R.tax):''}</p></div>`}
const sync=()=>{$('#ticket').innerHTML=ticketHTML(RC);const c=calc(RC);$('#rtot').textContent=RC.cur+' '+fmt(c.total);$('#tots').innerHTML=`<span>Subtotal ${esc(RC.cur)} ${fmt(c.sub)}${c.vatAmt?` · VAT ${fmt(c.vatAmt)}`:''}</span><b>${esc(RC.cur)} ${fmt(c.total)}</b>`};
function printTicket(){const t=$('#ticket'),p=$('#printer'),ps=$('#prs');sync();t.className='ticket';void t.offsetWidth;t.className='ticket print';p.classList.add('busy');if(ps)ps.textContent='Printing';clearTimeout(pt);pt=setTimeout(()=>{p.classList.remove('busy');if(ps)ps.textContent='Ready'},3900)}
{const pl=document.querySelector('#printer .pr-brand img');if(pl)pl.src=IMG.logo;const pb=document.getElementById('prb');if(pb)pb.onclick=()=>printTicket()}
// form
const FIELDS=[['Receipt','receipt',[['no','Receipt number','hash'],['date','Date and time','calendar-blank','datetime-local'],['event','Event','ticket','text','w'],['venue','Venue','map-pin','text','w'],['method','Payment method','credit-card','sel:Card,Apple Pay,Google Pay,Bank transfer,Cash,Other'],['status','Status','seal-check','sel:Paid,Pending,Deposit,Refunded']]],
['Client','user-circle',[['cName','Client or brand','buildings','text','w'],['cContact','Contact person','user'],['cPhone','Phone','phone','tel'],['cEmail','Email','envelope-simple','email'],['cId','Trade license or ID','identification-card']]],
['Issuer','storefront',[['issuer','Business name','storefront'],['issuerLine','Address or line','map-pin-line'],['tax','Tax registration number','seal']]]];
const fld=([k,l,ic,t='text',w])=>`<div class="${w?'w':''}"><label for="f_${k}"><i class="ph-light ph-${ic}"></i>${l}</label>${t.startsWith('sel:')?`<select id="f_${k}" data-k="${k}">${t.slice(4).split(',').map(o=>`<option>${o}</option>`).join('')}</select>`:`<input id="f_${k}" data-k="${k}" type="${t}" autocomplete="off" enterkeyhint="next">`}</div>`;
const STEPS=[['Receipt','receipt'],['Client','user-circle'],['Items','list-checks'],['Totals','sliders-horizontal'],['Issuer','storefront']];
const fcard=(i,ic,t,body)=>`<div class="fc" data-step="${i}"><h3><i class="ph-light ph-${ic}"></i>${t}</h3>${body}</div>`;
$('#rform').innerHTML=`<div class="stp" id="stp">${STEPS.map(([t],i)=>`<button type="button" class="sb" data-go="${i}"><span class="n">${i+1}</span><span class="l">${t}</span></button>`).join('')}</div>`+
 fcard(0,'receipt','Receipt',`<div class="fg">${FIELDS[0][2].map(fld).join('')}</div>`)+
 fcard(1,'user-circle','Client',`<div class="fg">${FIELDS[1][2].map(fld).join('')}</div>`)+
 fcard(2,'list-checks','Items',`<div id="items"></div><div class="row" style="gap:8px;margin-top:14px"><button type="button" class="btn dk sm" data-add="2000|White booth"><i class="ph-light ph-plus"></i> White booth</button><button type="button" class="btn dk sm" data-add="1100|Empty space"><i class="ph-light ph-plus"></i> Empty space</button><button type="button" class="btn sd sm" data-add="0|"><i class="ph-light ph-plus"></i> Custom item</button></div><div class="tots" id="tots"></div>`)+
 fcard(3,'sliders-horizontal','Totals',`<div class="fg">${[['cur','Currency','coins'],['vat','VAT percent','percent','number'],['disc','Discount amount','tag','number']].map(fld).join('')}<div class="w"><label for="f_notes"><i class="ph-light ph-note-pencil"></i>Note on the receipt</label><textarea id="f_notes" data-k="notes"></textarea></div></div>`)+
 fcard(4,'storefront','Issuer',`<div class="fg">${FIELDS[2][2].map(fld).join('')}<div class="w"><label><i class="ph-light ph-image-square"></i>Your logo</label><div class="lg"><button type="button" class="btn dk sm" id="lgb"><i class="ph-light ph-upload-simple"></i> Upload logo</button><button type="button" class="btn sd sm" id="lgx" style="background:#f3ece0"><i class="ph-light ph-x"></i> Use AJ District logo</button></div><input type="file" id="lgf" accept="image/*" hidden></div></div>`)+
 `<div class="snav"><button type="button" class="btn sd sm" id="sprev"><i class="ph-light ph-arrow-left"></i> Back</button><span class="sct" id="sct"></span><button type="button" class="btn sm pri" id="snext"></button></div>
<div class="row rx"><button type="button" class="btn sd sm" id="rnew"><i class="ph-light ph-arrow-counter-clockwise"></i> Reset to sample</button><button type="button" class="btn sd sm" id="rlast" hidden><i class="ph-light ph-receipt"></i> Use my last booking</button></div>`;
let ST=0;
function setStep(n,foc){const N=STEPS.length;ST=Math.max(0,Math.min(N-1,n));
 document.querySelectorAll('#rform .fc[data-step]').forEach(c=>c.classList.toggle('on',+c.dataset.step===ST));
 document.querySelectorAll('#stp .sb').forEach((b,i)=>{b.classList.toggle('done',i<ST);b.setAttribute('aria-current',i===ST?'step':'false')});
 $('#stp').style.setProperty('--p',ST/(N-1));$('#sprev').disabled=ST===0;$('#sct').textContent=(ST+1)+' / '+N;
 $('#snext').innerHTML=ST===N-1?'<i class="ph-light ph-printer"></i> Print receipt':'Next <i class="ph-light ph-arrow-right"></i>';
 const top=$('#stp').getBoundingClientRect().top;if(top<70)scrollTo({top:scrollY+top-90,behavior:'smooth'});
 if(foc&&!matchMedia('(pointer:coarse)').matches){const f=document.querySelector('#rform .fc.on input:not([type=file]),#rform .fc.on select,#rform .fc.on textarea');if(f)f.focus({preventScroll:true})}}
function finishReceipt(){if(matchMedia('(max-width:900px)').matches)rtab('view');else{printTicket();$('#printer').scrollIntoView({behavior:'smooth',block:'center'})}}
function nextStep(){ST<STEPS.length-1?setStep(ST+1,true):finishReceipt()}
$('#rform').addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){setStep(+g.dataset.go,true);return}
 if(e.target.closest('#sprev'))setStep(ST-1,true);else if(e.target.closest('#snext'))nextStep()});
$('#rform').addEventListener('keydown',e=>{if(e.key!=='Enter'||e.isComposing)return;const t=e.target;
 if(t.tagName==='BUTTON'||t.type==='file')return;if(t.tagName==='TEXTAREA'&&!(e.ctrlKey||e.metaKey))return;
 e.preventDefault();const els=[...t.closest('.fc').querySelectorAll('input:not([type=file]),select,textarea')].filter(x=>!x.disabled&&x.offsetParent!==null),i=els.indexOf(t);
 if(i>-1&&i<els.length-1)els[i+1].focus();else nextStep()});
setStep(0);
const NUM=['vat','disc'];
function items(){$('#items').innerHTML=RC.items.map((it,i)=>`<div class="ir"><label class="d"><span>Description</span><input data-i="${i}" data-f="d" enterkeyhint="next" placeholder="e.g. Space 13 · White booth"></label><label><span>Qty</span><input data-i="${i}" data-f="q" type="number" inputmode="decimal" min="0" step="any"></label><label><span>Unit price</span><input data-i="${i}" data-f="p" type="number" inputmode="decimal" min="0" step="any"></label><button class="ib" data-rm="${i}" aria-label="Remove item"><i class="ph-light ph-trash"></i></button></div>`).join('');
 document.querySelectorAll('#items input').forEach(e=>e.value=RC.items[e.dataset.i][e.dataset.f])}
function fill(){document.querySelectorAll('#rform [data-k]').forEach(e=>e.value=RC[e.dataset.k]);items();$('#rlast').hidden=!LASTBOOK;sync()}
$('#rform').addEventListener('input',e=>{const t=e.target;if(t.dataset.k){RC[t.dataset.k]=NUM.includes(t.dataset.k)?+t.value||0:t.value}else if(t.dataset.i){RC.items[t.dataset.i][t.dataset.f]=t.dataset.f==='d'?t.value:+t.value||0}sync()});
$('#rform').addEventListener('change',e=>{if(e.target.tagName==='SELECT'){RC[e.target.dataset.k]=e.target.value;sync()}});
$('#rform').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.add){const[p,d]=b.dataset.add.split('|');RC.items.push({d,q:1,p:+p});items();sync()}
 else if(b.dataset.rm!==undefined){RC.items.splice(+b.dataset.rm,1);items();sync()}
 else if(b.id==='lgb')$('#lgf').click();else if(b.id==='lgx'){RC.logo='';sync()}
 else if(b.id==='rnew'){RC=dflt();fill();printTicket()}else if(b.id==='rlast'){RC=structuredClone(LASTBOOK);fill();printTicket()}});
$('#lgf').onchange=e=>{const f=e.target.files[0];if(!f)return;const fr=new FileReader();fr.onload=()=>{RC.logo=fr.result;sync()};fr.readAsDataURL(f)};
// receipt image and PDF (canvas keeps every script, Arabic included)
const loadImg=u=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=u});
const getThemeColors=()=>{const style=getComputedStyle(document.documentElement);return{panel:style.getPropertyValue('--panel').trim(),on:style.getPropertyValue('--on').trim(),acc:style.getPropertyValue('--acc').trim(),sand:style.getPropertyValue('--sand').trim()}};
function paint2(R,x,W,img){const c=calc(R),m=v=>R.cur+' '+fmt(v),M=56,SA='Figtree,system-ui,sans-serif',SF='Fraunces,Georgia,serif';let y=0;
 const theme=getThemeColors(),lt=!R.logo&&['pearl','dune'].includes(document.documentElement.dataset.theme);if(lt){theme.panel='#1B2526';theme.on='#EFDFCB'}
 const T=(t,px,py,f,col,al='left')=>{x.font=f;x.fillStyle=col;x.textAlign=al;x.direction='ltr';x.fillText(t,px,py)};
 const wrap=(t,mw,f)=>{x.font=f;const o=[];String(t).split('\n').forEach(p=>{let l='';p.split(' ').forEach(w=>{const n=l?l+' '+w:w;if(l&&x.measureText(n).width>mw){o.push(l);l=w}else l=n});o.push(l)});return o};
 const hr=()=>{x.strokeStyle='#d8cdbb';x.lineWidth=2;x.setLineDash([8,6]);x.beginPath();x.moveTo(M,y);x.lineTo(W-M,y);x.stroke();x.setLineDash([]);y+=36};
 const row=(k,v,big)=>{if(!v)return;const f=`600 ${big?30:26}px ${SA}`,L=wrap(v,440,f);T(k,M,y,`24px ${SA}`,'#7a7468');L.forEach((l,i)=>{T(l,W-M,y+i*36,f,'#1B2526','right')});y+=L.length*36+8};
 x.fillStyle=R.logo?'#fff':theme.panel;x.fillRect(0,0,W,190);if(R.logo){x.fillStyle='#eee';x.fillRect(0,188,W,3)}
 if(img){const k=Math.min(320/img.width,84/img.height),w=img.width*k,h=img.height*k;x.drawImage(img,M,(190-h)/2,w,h)}
 T('Receipt',W-M,108,`500 40px ${SF}`,R.logo?'#1B2526':theme.on,'right');y=270;
 x.font=`700 22px ${SA}`;const bw=x.measureText(R.status.toUpperCase()).width+40;const sc=({Pending:['#E3B23C','#2b2208'],Refunded:['#8d8579','#fff']})[R.status]||[theme.panel,theme.on];x.fillStyle=sc[0];x.beginPath();(x.roundRect||x.rect).call(x,M,y-30,bw,44,22);x.fill();T(R.status.toUpperCase(),M+20,y,`700 22px ${SA}`,sc[1]);y+=74;
 wrap(R.no,W-2*M,`500 48px ${SF}`).forEach(l=>{T(l,M,y,`500 48px ${SF}`,'#1B2526');y+=56});y+=6;hr();
 [['Event',R.event],['Venue',R.venue],['Date',fdate(R.date)],['Payment',R.method]].forEach(([k,v])=>row(k,v));y+=4;hr();
 [['Client',R.cName],['Contact',R.cContact],['Email',R.cEmail],['Phone',R.cPhone],['License or ID',R.cId]].forEach(([k,v])=>row(k,v));y+=4;hr();
 R.items.forEach(i=>{const L=wrap(i.d||'Item',470,`600 27px ${SA}`);L.forEach((l,k)=>T(l,M,y+k*35,`600 27px ${SA}`,'#1B2526'));T(m(i.q*i.p),W-M,y,`600 27px ${SA}`,'#1B2526','right');y+=L.length*35;T(`${fmt(i.q)} × ${m(i.p)}`,M,y,`22px ${SA}`,'#7a7468');y+=46});hr();
 const sr=(k,v)=>{T(k,M,y,`24px ${SA}`,'#7a7468');T(v,W-M,y,`600 26px ${SA}`,'#1B2526','right');y+=38};
 sr('Subtotal',m(c.sub));if(c.disc)sr('Discount','-'+m(c.disc));if(+R.vat)sr('VAT '+fmt(R.vat)+'%',m(c.vatAmt));y+=8;
 x.fillStyle=theme.sand;x.fillRect(M,y,W-2*M,112);T('Total',M+30,y+68,`26px ${SA}`,'#1B2526');T(m(c.total),W-M-30,y+74,`500 46px ${SF}`,'#1B2526','right');y+=112+46;
 if(R.notes){wrap(R.notes,W-2*M,`23px ${SA}`).forEach(l=>{T(l,M,y,`23px ${SA}`,'#5b5346');y+=32});y+=20}
 const b=bars(R.no),k=(W-2*M)/b.W;x.fillStyle='#1B2526';b.o.forEach(([bx,w])=>x.fillRect(M+bx*k,y,Math.max(2,w*k),64));y+=64+42;
 [R.issuer+(R.issuerLine?' · '+R.issuerLine:''),R.tax?'Tax no. '+R.tax:''].filter(Boolean).forEach(l=>{T(l,W/2,y,`21px ${SA}`,'#7a7468','center');y+=30});return y+40}
async function canvas2(R){try{await document.fonts.ready}catch(e){}const img=await loadImg(R.logo||IMG.logo),H=paint2(R,document.createElement('canvas').getContext('2d'),800,img),c=document.createElement('canvas');c.width=800;c.height=H;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,800,H);paint2(R,x,800,img);return c}
async function pdf(R){const cv=await canvas2(R),jpg=new Uint8Array(await new Promise(r=>cv.toBlob(r,'image/jpeg',.93)).then(b=>b.arrayBuffer())),enc=new TextEncoder(),parts=[],offs=[];let off=0;
 const put=b=>{const u=typeof b==='string'?enc.encode(b):b;parts.push(u);off+=u.length},W=400,H=Math.round(cv.height/2);
 put('%PDF-1.4\n');const ob=(n,body)=>{offs[n]=off;put(`${n} 0 obj\n${body}\nendobj\n`)};
 ob(1,'<</Type/Catalog/Pages 2 0 R>>');ob(2,'<</Type/Pages/Kids[3 0 R]/Count 1>>');ob(3,`<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${W} ${H}]/Resources<</XObject<</Im 4 0 R>>>>/Contents 5 0 R>>`);
 offs[4]=off;put(`4 0 obj\n<</Type/XObject/Subtype/Image/Width ${cv.width}/Height ${cv.height}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${jpg.length}>>\nstream\n`);put(jpg);put('\nendstream\nendobj\n');
 const cs=`q ${W} 0 0 ${H} 0 0 cm /Im Do Q`;ob(5,`<</Length ${cs.length}>>\nstream\n${cs}\nendstream`);
 const xr=off;put('xref\n0 6\n0000000000 65535 f \n'+[1,2,3,4,5].map(n=>String(offs[n]).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n${xr}\n%%EOF`);
 return new Blob(parts,{type:'application/pdf'})}
function save(b,n){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
async function viewPDF(R){const u=URL.createObjectURL(await pdf(R));dlg.style.width='min(780px,calc(100% - 24px))';
 dlg.innerHTML=`<div class="dlg" style="padding:16px"><button type="button" class="close" aria-label="Close" onclick="dlg.close()"><i class="ph-light ph-x"></i></button><h2 style="font-size:1.4rem;margin:4px 0 12px">Receipt ${esc(R.no)}</h2><iframe src="${u}" title="Receipt PDF" style="width:100%;height:68vh;border:0;border-radius:14px;background:#eee"></iframe><p class="fine"><a href="${u}" target="_blank" rel="noopener">Open in a new tab</a></p></div>`;dlg.showModal()}
const fname=R=>(R.no||'receipt').replace(/[^\w-]+/g,'_')+'.pdf';
$('#rv').onclick=()=>viewPDF(RC);$('#rd').onclick=async()=>{save(await pdf(RC),fname(RC));toast('Receipt PDF downloaded')};$('#rp').onclick=()=>{sync();$('#ticket').classList.add('print');setTimeout(()=>window.print(),80)};$('#rpr').onclick=printTicket;$('#rs2').onclick=()=>share(RC);
dlg.addEventListener('close',()=>{dlg.style.width=''});
function pay(tot,name,email,method){const spaces=[...sel],R={...dflt(),no:newNo(),cName:name,cContact:'',cEmail:email,method:method||'Card',items:spaces.map(n=>({d:`Space ${n} · ${kind(n)}`,q:1,p:S[n-1].price}))};RC=R;LASTBOOK=structuredClone(R);
 spaces.forEach(n=>S[n-1].st='booked');sel=[];cur=null;$('#info').classList.remove('show');paint();dlg.close();rtab('view');location.hash='receipt'}
const shareText=R=>{const c=calc(R);return `Receipt ${R.no}\n${R.event}${R.venue?' · '+R.venue:''}\nClient: ${R.cName||'-'}\n${R.items.map(i=>`${i.d||'Item'} × ${fmt(i.q)}`).join('\n')}\nTotal: ${R.cur} ${fmt(c.total)} (${R.status})\n${R.issuer}${R.issuerLine?' · '+R.issuerLine:''}`};
async function share(R){const t=shareText(R),en=encodeURIComponent,ph=(R.cPhone||'').replace(/\D/g,'');
 let cf=false;try{cf=!!(navigator.canShare&&navigator.canShare({files:[new File(['x'],'a.pdf',{type:'application/pdf'})]}))}catch(e){}
 const O=[['whatsapp-logo','WhatsApp','https://wa.me/'+ph+'?text='+en(t)],['envelope-simple','Email',`mailto:${R.cEmail||''}?subject=${en('Receipt '+R.no)}&body=${en(t)}`],['chat-text','SMS',`sms:${ph?'+'+ph:''}?body=${en(t)}`],['telegram-logo','Telegram','https://t.me/share/url?url='+en(location.href.split('#')[0])+'&text='+en(t)],['copy','Copy text','copy'],['file-pdf','Save PDF','pdf'],['image','Save image','png'],['printer','Print','print']];
 if(navigator.share)O.push(['export',cf?'Share PDF file':'More apps','native']);
 dlg.style.width='';dlg.innerHTML=`<div class="dlg"><div class="dh"><button type="button" class="close" aria-label="Close" onclick="dlg.close()"><i class="ph-light ph-x"></i></button><span class="dk">${esc(R.no)}</span><h2>Share receipt</h2></div><div class="db"><div class="shg">${O.map(([i,n,a])=>/^(https|mailto|sms)/.test(a)?`<a class="sho" href="${a}" target="_blank" rel="noopener"><i class="ph-light ph-${i}"></i>${n}</a>`:`<button type="button" class="sho" data-a="${a}"><i class="ph-light ph-${i}"></i>${n}</button>`).join('')}</div><pre class="shp">${esc(t)}</pre></div></div>`;
 if(!dlg.open)dlg.showModal();
 dlg.querySelector('.shg').onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
  try{if(a==='copy'){await navigator.clipboard.writeText(t);toast('Receipt text copied')}
  else if(a==='pdf'){save(await pdf(R),fname(R));toast('PDF saved')}
  else if(a==='png'){(await canvas2(R)).toBlob(x=>{save(x,fname(R).replace('.pdf','.png'));toast('Image saved')})}
  else if(a==='print'){dlg.close();sync();$('#ticket').classList.add('print');setTimeout(()=>window.print(),80)}
  else{const f=new File([await pdf(R)],fname(R),{type:'application/pdf'});cf?await navigator.share({files:[f],text:t}):await navigator.share({text:t})}}catch(x){if(x.name!=='AbortError')toast('That didn’t work here')}}}
// routing: home, receipts and terms pages share this document
function route(){const h=window.AJ_ROUTE||location.hash.slice(1),rp=h==='receipt',tp=h==='terms',sub=rp||tp;document.documentElement.dataset.pageRoute=rp?'receipt':tp?'terms':'home';$('#pg-home').hidden=sub;$('#pg-receipt').hidden=!rp;$('#pg-terms').hidden=!tp;document.body.classList.toggle('rp',sub);$('#hd').classList.toggle('solid',sub||scrollY>40);
 if(rp){scrollTo(0,0);fill();printTicket()}else if(tp){scrollTo(0,0)}else{requestAnimationFrame(()=>{view(document.querySelector('#views [aria-pressed=true]').dataset.v);const t=h&&document.getElementById(h);t?t.scrollIntoView():scrollTo(0,0)})}}
addEventListener('hashchange',route);
// ---- v7: views, tooltips ----
let V='3d';
const vis=()=>S.filter(s=>tf==='all'||s.type===tf),lbl=s=>sel.includes(s.n)?'Yours':{free:'Available',hold:'On hold',booked:'Booked'}[s.st];
(function(){let g='';
 const pool=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="170" fill="url(#${c})"/>`;
 S.forEach(s=>{g+=`<g class="sp2" id="g${s.n}" data-n="${s.n}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})"><rect width="${SZ}" height="${SZ}" rx="6"/><text x="${SZ/2}" y="${SZ/2+1}">${s.n}</text></g>`});
 const tb=TABLES.map(([x,y])=>`<rect x="${x-18}" y="${y-12}" width="36" height="24" rx="4" fill="#a8743f" pointer-events="none"/>`).join('');
 const sr={},rl=S.map(q=>{if(sr[q.row])return'';sr[q.row]=1;return `<text class="pt" x="${q.row==='W'?q.x+SZ/2:q.x-14}" y="${q.row==='W'?q.y-12:q.y+SZ/2}" style="text-anchor:middle;dominant-baseline:central">${q.row}</text>`}).join('');
 const gx=GATE[0];
 $('#plan').innerHTML=`<svg viewBox="-10 -10 ${W+20} ${H+70}" role="group" aria-label="Floor plan of Demo Event"><defs><radialGradient id="lp"><stop offset="0" stop-color="#b04ad8" stop-opacity=".45"/><stop offset="1" stop-color="#b04ad8" stop-opacity="0"/></radialGradient><radialGradient id="lt"><stop offset="0" stop-color="#2fe0cf" stop-opacity=".38"/><stop offset="1" stop-color="#2fe0cf" stop-opacity="0"/></radialGradient><radialGradient id="la"><stop offset="0" stop-color="#f0b35c" stop-opacity=".32"/><stop offset="1" stop-color="#f0b35c" stop-opacity="0"/></radialGradient><clipPath id="lc"><rect width="${W}" height="${H}" rx="22"/></clipPath></defs>
 <rect class="pg" width="${W}" height="${H}" rx="22"/><g clip-path="url(#lc)">${pool(200,150,'lp')}${pool(560,300,'lt')}${pool(250,560,'lp')}${pool(850,200,'la')}${pool(900,600,'lt')}${pool(1000,120,'lp')}</g>
 <rect class="road" x="0" y="${H+8}" width="${W}" height="42" rx="10"/><rect class="pa" x="${gx-45}" y="${H-100}" width="90" height="108" rx="6"/>
 ${tb}<rect class="pe" x="${gx-56}" y="${H-56}" width="126" height="14" rx="5"/><text class="pt" x="${gx}" y="${H+29}" style="text-anchor:middle;dominant-baseline:central;fill:#e8dcc3">ENTRANCE</text>${rl}${g}</svg>`})();
function draw2d(){S.forEach(s=>{const on=sel.includes(s.n),g=$('#g'+s.n);g.setAttribute('class','sp2'+(s.type==='empty'?' e':'')+' '+(on?'chosen':s.st)+(cur===s.n?' sel':'')+(tf!=='all'&&s.type!==tf&&!on?' dim':''));g.setAttribute('aria-label',`Space ${s.n}, ${aed(s.price)}, ${lbl(s)}`)})}
function grid(){$('#list').innerHTML=vis().map(s=>{const on=sel.includes(s.n);return `<button data-n="${s.n}" class="gc ${on?'chosen':s.st}" ${s.st==='free'?'':'disabled'} aria-pressed="${on}"><span class="gn">${s.n}</span><small>${kind(s.n)}</small><em>${aed(s.price)}</em><span class="st ${on?'ch':s.st}"><i></i>${lbl(s)}</span></button>`}).join('')}
function rows(){$('#rows').innerHTML='<div class="rh"><span>No.</span><span>Space</span><span>From gate</span><span>Status</span><span>Price</span><span></span></div>'+vis().map(s=>{const on=sel.includes(s.n);return `<div class="rw2${cur===s.n?' cur':''}" data-n="${s.n}" tabindex="0"><b>${s.n}</b><span>${kind(s.n)}<small>Row ${s.row}, no. ${s.idx+1}</small></span><span>${s.dist} m</span><span class="st ${on?'ch':s.st}"><i></i>${lbl(s)}</span><b class="pp">${aed(s.price)}</b>${s.st==='free'?`<button class="btn ${on?'sd':'acc'} sm" data-a="${s.n}">${on?'Remove':'Add'}</button>`:'<span></span>'}</div>`}).join('')}
 $('#plan').addEventListener('click',e=>{const g=e.target.closest('.sp2');if(g)activateSpace(+g.dataset.n)});
 $('#plan').addEventListener('keydown',e=>{const g=e.target.closest('.sp2');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();activateSpace(+g.dataset.n)}});
$('#rows').addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(a)return toggle(+a.dataset.a);const r=e.target.closest('.rw2');if(r)pick(+r.dataset.n)});
$('#rows').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('rw2'))pick(+e.target.dataset.n)});
// tooltips on every hotspot (3D dots, 2D spaces) and the map controls
const tip=document.createElement('div');tip.id='tip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.append(tip);
document.querySelectorAll('.ctl button').forEach(b=>b.dataset.tip=b.getAttribute('aria-label'));
function showTip(el){let h;if(el.dataset.n){const s=S[el.dataset.n-1],on=sel.includes(s.n);
 h=`<div class="ti1"><b>${kind(s.n)} ${s.n}</b><span class="st ${on?'ch':s.st}"><i></i>${lbl(s)}</span></div><div class="ti2">${aed(s.price)} · Row ${s.row} · about ${s.dist} m from the gate</div><div class="ti3">${s.st==='free'||on?(on?'Click to remove from booking':'Click to add to booking'):'Not available'}</div>`}else h=esc(el.dataset.tip);
 tip.innerHTML=h;tip.hidden=false;const r=el.getBoundingClientRect(),w=tip.offsetWidth,hh=tip.offsetHeight,x=clamp(r.left+r.width/2-w/2,8,innerWidth-w-8);let y=r.top-hh-12;const below=y<8;if(below)y=r.bottom+12;
 tip.style.left=x+'px';tip.style.top=y+'px';tip.style.setProperty('--ax',clamp(r.left+r.width/2-x,16,w-16)+'px');tip.classList.toggle('below',below)}
const hideTip=()=>{tip.hidden=true};
document.addEventListener('pointerover',e=>{if(e.pointerType==='touch'||dr)return;const t=e.target.closest('.pin,.sp2,[data-tip]');t?showTip(t):hideTip()});
document.addEventListener('focusin',e=>{const t=e.target.closest('.pin,.sp2');t?showTip(t):hideTip()});
document.addEventListener('focusout',hideTip);document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.target.closest('#stage'))hideTip()});
addEventListener('scroll',hideTip,{passive:true});document.documentElement.addEventListener('pointerleave',hideTip);
paint();route();let lw=0,lwide=null;addEventListener('resize',()=>{if(stage.hidden||dr)return;const w=stage.clientWidth,wd=wide();if(Math.abs(w-lw)>8||wd!==lwide){lw=w;lwide=wd;setCam(home())}});

// event locations: add one object per event and the map section updates itself
const EVENTS=[{id:'yi',name:'Demo Event',place:'Al Safia Park',city:'Ajman',addr:'Al Safia Park, Ajman, UAE',coords:'25.4183631,55.481683',date:'27–29 November 2026',time:'4 to 11 pm',note:'Parking is available at the park. Look for the lit entrance gate.'}];
let evSel=EVENTS[0].id;
function locView(){const e=EVENTS.find(x=>x.id===evSel),q=encodeURIComponent(e.addr);
 $('#evtabs').innerHTML=EVENTS.map(x=>`<button data-e="${x.id}" aria-pressed="${x.id===evSel}"><i class="ph-light ph-map-pin"></i>${esc(x.name)}</button>`).join('')+`<button disabled><i class="ph-light ph-clock"></i>${esc(liveCopy('location_next_label','Next event · location soon'))}</button>`;
 const f=$('#mapf'),u=`https://maps.google.com/maps?q=${encodeURIComponent(e.coords)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;if(f.getAttribute('src')!==u)f.src=u;
 $('#locinfo').innerHTML=`<button class="x" onclick="$('#locinfo').classList.remove('active')"><i class="ph-light ph-x"></i></button><span class="tag">Booking open</span><h3>${esc(e.name)}</h3><dl><div><i class="ph-light ph-map-pin"></i><span><dt>Venue</dt><dd>${esc(e.place)}<br>Ajman, UAE</dd></span></div><div><i class="ph-light ph-calendar-blank"></i><span><dt>Dates</dt><dd>${esc(e.date)}</dd></span></div><div><i class="ph-light ph-clock"></i><span><dt>Opening hours</dt><dd>${esc(e.time)}</dd></span></div><div><i class="ph-light ph-car"></i><span><dt>Getting there</dt><dd style="font-weight:500">${esc(e.note)}</dd></span></div></dl>
 <div class="lacts"><a class="btn dk" href="https://www.google.com/maps/dir/?api=1&destination=${q}" target="_blank" rel="noopener"><i class="ph-light ph-navigation-arrow"></i> Get directions</a><a class="btn sd" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener"><i class="ph-light ph-arrow-up-right"></i> Open in Google Maps</a><button class="btn sd" id="lcp"><i class="ph-light ph-copy"></i> Copy address</button></div>`;
 const info=$('#locinfo'),dt=info.querySelectorAll('dt');info.querySelector('.tag').textContent=liveCopy('location_status','Booking open');[liveCopy('location_venue_label','Venue'),liveCopy('location_date_label','Dates'),liveCopy('location_hours_label','Opening hours'),liveCopy('location_getting_there_label','Getting there')].forEach((label,index)=>{if(dt[index])dt[index].textContent=label});const venueDetail=info.querySelector('.kv dd');if(venueDetail)venueDetail.replaceChildren(document.createTextNode(e.place),document.createElement('br'),document.createTextNode(`${e.city||'Ajman'}, UAE`));const acts=info.querySelectorAll('.lacts>*');setActionLabel(acts[0],liveCopy('location_directions_label','Get directions'));setActionLabel(acts[1],liveCopy('location_open_map_label','Open in Google Maps'));setActionLabel(acts[2],liveCopy('location_copy_address_label','Copy address'));
 $('#lcp').onclick=async()=>{try{await navigator.clipboard.writeText(e.addr);toast('Address copied')}catch(x){toast(e.addr)}}}
$('#evtabs').addEventListener('click',e=>{const b=e.target.closest('[data-e]');if(b){evSel=b.dataset.e;locView();$('#locinfo').classList.add('active')}});
locView();
setTimeout(()=>$('#locinfo').classList.add('active'),600);
// sponsor enquiry -> WhatsApp with the details filled in
$('#spf').onsubmit=e=>{e.preventDefault();const m=`Hi AJ District, I'd like to become a sponsor.\nCompany: ${$('#spn').value}\n${$('#spc').value?'Contact: '+$('#spc').value+'\n':''}Interested in: ${$('#spt').value}`;
 window.open('https://wa.me/'+whatsappNumber()+'?text='+encodeURIComponent(m),'_blank','noopener');toast('Opening WhatsApp')};

// scroll reveal: direction aware, replays when you scroll back
// ---- photos: edit these lists to swap pictures (files live in photos/) ----
const PH={all:['DSC04438','DSC04481','DSC04486','DSC04490','DSC04507','DSC04516','DSC04531','DSC04553','DSC04578','DSC04581','DSC04605','DSC04611','DSC04620','DSC04629','DSC04639','DSC04646','DSC04670','DSC04673','DSC04683','DSC04685','DSC04695','DSC04709','DSC04724','DSC04726','DSC04731','DSC04732','DSC04747','DSC04755','DSC04762','DSC04766','DSC04769','DSC04773','DSC04776','DSC04785','DSC04790','DSC04801','DSC04809','DSC04812','DSC04815','DSC04825'],
 strip:['DSC04578','DSC04581','DSC04611','DSC04629','DSC04673','DSC04683','DSC04695','DSC04709','DSC04724','DSC04731','DSC04747','DSC04755']};
const UP=[
 {c:'market',tag:'Booking opens 1 Dec',t:'Winter Makers Market',d:['18–20','Dec'],p:'Ajman Corniche',x:'Demo event: Gift-ready products from local makers, with warm lights and food stalls by the water.',img:'DSC04685'},
 {c:'expo',tag:'Waitlist open',t:'Next Gen Expo',d:['22–24','Jan'],p:'Al Safia Park, Ajman',x:'Demo event: Startups and student brands show their first products to real customers.',img:'DSC04726'},
 {c:'seasonal',tag:'Announcing soon',t:'Ramadan Night Souq',d:['12–20','Feb'],p:'Sharjah',x:'Demo event: An evening souq for iftar-time shopping: crafts, sweets, fragrance and fashion.',img:'DSC04766'},
 {c:'seasonal',tag:'Announcing soon',t:'Eid Family Fair',d:['10–12','Mar'],p:'Ajman',x:'Demo event: Three festive days of family activities, gifts and pop-up booths.',img:'DSC04790'},
 {c:'market',tag:'Announcing soon',t:'Spring Pop-up Market',d:['9–10','Apr'],p:'Ajman',x:'Demo event: A small, fast weekend market for brands that want to meet customers in person.',img:'DSC04809'},
 {c:'expo',tag:'Announcing soon',t:'Creators Expo',d:['4–6','Jun'],p:'Ajman',x:'Demo event: Designers, illustrators and content creators showcase and sell their work.',img:'DSC04762'}];
let evf='all';
const EVF=[['all','All'],['market','Markets'],['expo','Expos'],['seasonal','Seasonal']];
function evInd(){const f=$('#evfil'),b=f.querySelector('[aria-pressed=true]'),i=f.querySelector('.ind');if(b&&i){i.style.width=b.offsetWidth+'px';i.style.transform='translateX('+b.offsetLeft+'px)'}}
function evCards(fx){$('#evg').innerHTML=UP.filter(e=>evf==='all'||e.c===evf).map((e,i)=>{const photo=String(e.img||'DSC04685'),src=photo==='__none__'?'':photo.startsWith('/media/')?photo:`photos/${photo.replace(/\.jpg$/i,'')}.jpg`;return `<article class="evc${fx?' fx':''}" style="--i:${i}"><div class="evci">${src?`<img loading="lazy" decoding="async" src="${esc(src)}" alt="${esc(e.t)}">`:''}<span class="evd"><b>${e.d[0]}</b>${e.d[1]}</span><span class="evt">${esc(e.tag)}</span></div><div class="evcb"><h3>${esc(e.t)}</h3><p class="evp"><i class="ph-light ph-map-pin"></i>${esc(e.p)}</p><p>${esc(e.x)}</p><a class="btn sd" href="https://wa.me/${whatsappNumber()}?text=${encodeURIComponent('Hi AJ District, keep me posted about '+e.t)}" target="_blank" rel="noopener"><i class="ph-light ph-bell-simple"></i> Notify me</a></div></article>`}).join('')}
function evs(){$('#evfil').innerHTML='<span class="ind"></span>'+EVF.map(([k,n])=>`<button type="button" data-f="${k}" aria-pressed="${evf===k}">${n}</button>`).join('');evCards(false);evInd()}
$('#evfil').onclick=e=>{const b=e.target.closest('[data-f]');if(!b||b.dataset.f===evf)return;evf=b.dataset.f;document.querySelectorAll('#evfil [data-f]').forEach(x=>x.setAttribute('aria-pressed',x===b));evInd();navigator.vibrate&&navigator.vibrate(8);
 const g=$('#evg');g.classList.add('out');setTimeout(()=>{evCards(true);g.classList.remove('out')},170)};
addEventListener('resize',evInd);document.fonts&&document.fonts.ready.then(evInd);
evs();
// lightbox
(()=>{const lb=$('#lb'),im=$('#lbi'),cp=$('#lbc');let list=[],k=0,back=null;
 const show=()=>{const f=list[k],i=f.querySelector('img');im.src=i.src;im.alt=i.alt;cp.textContent=(f.querySelector('figcaption')||{}).textContent||'';cp.hidden=!cp.textContent;$('#lbp').hidden=$('#lbf').hidden=list.length<2};
 const open=f=>{list=[...document.querySelectorAll(`[data-lb][data-g="${f.dataset.g}"]`)].filter(x=>x.offsetParent);k=list.indexOf(f);back=document.activeElement;show();lb.hidden=false;document.body.style.overflow='hidden';$('#lbx').focus()};
 const close=()=>{lb.hidden=true;im.removeAttribute('src');document.body.style.overflow='';if(back&&back.focus)back.focus()};
 const go=d=>{k=(k+d+list.length)%list.length;show()};
 document.addEventListener('click',e=>{const f=e.target.closest('[data-lb]');if(f&&lb.hidden)open(f)});
 $('#lbx').onclick=close;$('#lbp').onclick=()=>go(-1);$('#lbf').onclick=()=>go(1);
 lb.addEventListener('click',e=>{if(e.target===lb||e.target.tagName==='FIGURE')close()});
 document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')go(-1);else if(e.key==='ArrowRight')go(1)});
 let sx=null;lb.addEventListener('pointerdown',e=>{sx=e.clientX});lb.addEventListener('pointerup',e=>{if(sx!==null&&Math.abs(e.clientX-sx)>60)go(e.clientX<sx?1:-1);sx=null});
 document.querySelectorAll('[data-lb]').forEach(f=>{f.tabIndex=0;f.setAttribute('role','button');f.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(f)}}});
})();
(()=>{const q='.hero .wrap>div,section:not(#book) .wrap>h2,section:not(#book) .wrap>.sub,.evf,.evh,.evc,.gal figure,.galm,.venue figure,.how>div,details,.bhd,.ctrls,.mapcol,.side,#book .note,.evtabs,.locg,.tier,.spstrip,.spform,.fhead,.fl,footer .fcta,.fgrid>*,.fbot';
const els=[...document.querySelectorAll(q)];if(!('IntersectionObserver' in window))return;
els.forEach(e=>e.classList.add('rv'));
els.forEach(e=>{const i=[...e.parentNode.children].filter(c=>c.classList.contains('rv')).indexOf(e);e.style.setProperty('--d',Math.min(i,5)*90+'ms')});
const io=new IntersectionObserver(es=>es.forEach(n=>{const e=n.target;if(n.isIntersecting)e.classList.add('in');else{e.classList.remove('in');e.classList.toggle('up',n.boundingClientRect.top<0)}}),{threshold:.12});
els.forEach(e=>io.observe(e))})();

// ---- v8: responsive menu, active link, booking flag, receipt tabs ----
function rtab(t){const pg=$('#pg-receipt');pg.dataset.rt=t;document.querySelectorAll('.rtabs [data-rt]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.rt===t));if(t==='view'){sync();printTicket()}}
$('.rtabs').addEventListener('click',e=>{const b=e.target.closest('[data-rt]');if(b){rtab(b.dataset.rt);scrollTo({top:0,behavior:'instant'})}});
(()=>{const B=document.body,burger=$('#burger'),mnav=$('#mnav');
 const lock=o=>document.querySelectorAll('#pg-home,#pg-receipt,#pg-terms,footer').forEach(e=>e.inert=o);
 function menu(o){B.classList.toggle('menu',o);document.documentElement.classList.toggle('menu',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu');lock(o)}
 burger.onclick=()=>menu(!B.classList.contains('menu'));
 mnav.addEventListener('click',e=>{if(e.target.closest('a'))menu(false)});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&B.classList.contains('menu')){menu(false);burger.focus()}});
 matchMedia('(max-width:980px)').addEventListener('change',e=>{if(!e.matches)menu(false)});
 addEventListener('hashchange',()=>menu(false));
 const setCur=id=>document.querySelectorAll('[data-nav]').forEach(a=>a.dataset.nav===id?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current'));
 const io=new IntersectionObserver(es=>es.forEach(n=>{if(n.isIntersecting&&!B.classList.contains('rp'))setCur(n.target.id)}),{rootMargin:'-40% 0px -55% 0px'});
 ['events','location','book','sponsors','faq'].forEach(id=>io.observe(document.getElementById(id)));
 const sync2=()=>{if(B.classList.contains('rp'))setCur((window.AJ_ROUTE||location.hash.slice(1))==='terms'?'terms':(window.AJ_ROUTE||location.hash.slice(1))==='dashboard'?'dashboard':'receipt');else if(scrollY<300)setCur('')};
 addEventListener('hashchange',sync2);addEventListener('scroll',()=>{if(scrollY<300&&!B.classList.contains('rp'))setCur('')},{passive:true});sync2();
 new IntersectionObserver(([n])=>B.classList.toggle('inbook',n.isIntersecting)).observe($('#book'))})();

// ---- v18: 3D styles, camera presets ----
(()=>{const st=stage,vt=$('#vt');let auto=0,raf;
 const press=(box,key,val)=>box.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',key?b.dataset[key]===val:false));
 const stopAuto=()=>{auto=0;cancelAnimationFrame(raf);st.classList.remove('auto');$('#vauto').setAttribute('aria-pressed',false)};
 st.dataset.st='solid';
 $('#vstyle').onclick=e=>{const b=e.target.closest('[data-s]');if(b){st.dataset.st=b.dataset.s;press($('#vstyle'),'s',b.dataset.s)}};
 $('#vcam').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;stopAuto();const h=home(),m=wide()?12:8,c=b.dataset.c;
  setCam(c==='top'?{rx:0,rz:h.rz,px:0,py:0,z:clamp(fitZ(0,h.rz,m),.3,1.6)}:c==='front'?{rx:76,rz:h.rz,px:0,py:0,z:clamp(fitZ(76,h.rz,m),.3,1.6)}:h);press($('#vcam'),'c',c)};
 $('#vauto').onclick=()=>{if(auto)return stopAuto();auto=1;st.classList.add('auto');$('#vauto').setAttribute('aria-pressed',true);press($('#vcam'));
  const loop=()=>{if(!auto)return;if(!st.hidden)setCam({rz:cam.rz+.18});raf=requestAnimationFrame(loop)};loop()};
 st.addEventListener('pointerdown',()=>{press($('#vcam'));if(auto)stopAuto()});
 $('#vnum').onclick=()=>$('#vnum').setAttribute('aria-pressed',!st.classList.toggle('nonum'));
 const fs=$('#vfs');if(!st.requestFullscreen)fs.hidden=true;
 fs.onclick=()=>document.fullscreenElement?document.exitFullscreen():st.requestFullscreen().catch(()=>{});
 document.addEventListener('fullscreenchange',()=>setTimeout(()=>setCam(home()),120));
 const _v=view;view=function(v){_v(v);vt.hidden=v!=='3d';if(v!=='3d')stopAuto()};vt.hidden=V!=='3d'})();
// ---- v16: hero parallax ----
(()=>{const h=document.querySelector('.hero'),sh=document.querySelector('.shot');if(!h||!sh||!matchMedia('(hover:hover)').matches)return;
 h.addEventListener('pointermove',e=>{if(sh.classList.contains('dragging'))return;const r=h.getBoundingClientRect();sh.style.setProperty('--mx',((e.clientX-r.left)/r.width*2-1).toFixed(2));sh.style.setProperty('--my',((e.clientY-r.top)/r.height*2-1).toFixed(2))});
 h.addEventListener('pointerleave',()=>{sh.style.setProperty('--mx',0);sh.style.setProperty('--my',0)})})();
// ---- v14: roll text on header links ----
document.querySelectorAll('.dnav a:not(.btn)').forEach(a=>{const t=a.textContent;a.innerHTML=`<span class="roll"><span>${t}</span><span aria-hidden="true">${t}</span></span>`;a.setAttribute('aria-label',t)});
// ---- v13: basket clear + animations ----
(()=>{const _p=paint;let prev=[];
 const bump=e=>{if(e){e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')}};
 function fly(n){const p=$('#p'+n),a=$('#ia'),r=(p&&p.offsetWidth&&p.getBoundingClientRect())||(a&&a.getBoundingClientRect());if(!r||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const d=document.createElement('div');d.className='flyd';d.textContent=n;document.body.append(d);const sx=r.left+r.width/2-16,sy=r.top+r.height/2-16,tx=innerWidth/2-130,ty=innerHeight-60;
  d.animate([{transform:`translate(${sx}px,${sy}px) scale(1)`},{transform:`translate(${tx}px,${ty}px) scale(.45)`,opacity:.85}],{duration:650,easing:'cubic-bezier(.5,0,.2,1)'}).onfinish=()=>d.remove()}
 paint=function(){_p();const now=[...sel],add=now.filter(n=>!prev.includes(n));
  if(add.length||now.length!==prev.length){bump($('#tot'));bump($('#bt'))}
  document.querySelectorAll('#mysel [data-p]').forEach(b=>{if(add.includes(+b.dataset.p))b.parentElement.classList.add('new')});
  add.forEach(fly);prev=now};
 window.clearAll=()=>{if(!sel.length)return;const c=sel.length;sel=[];cur=null;$('#info').classList.remove('show');paint();toast(c+(c>1?' spaces':' space')+' removed from your basket');navigator.vibrate&&navigator.vibrate(12)};
 document.addEventListener('click',e=>{if(e.target.closest('#clr,#clr2'))clearAll()})})();
// ---- v12: installable app behaviour ----
(()=>{
 const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 // offline / online
 const off=document.createElement('div');off.className='offline';off.setAttribute('role','status');off.textContent='You’re offline. Showing saved pages.';document.body.append(off);
 const net=()=>off.classList.toggle('show',!navigator.onLine);addEventListener('online',()=>{net();toast('Back online')});addEventListener('offline',net);net();
 // install: Android/desktop prompt, iOS hint
 let dp=null;const ib=$('#inst'),ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;ib.hidden=false});
 addEventListener('appinstalled',()=>{dp=null;ib.hidden=true;toast('AJ District installed')});
 if(ios&&!standalone)ib.hidden=false;
 ib.onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;ib.hidden=true}else toast('Tap Share, then Add to Home Screen')};
 // light haptics on taps
 document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&e.target.closest('.btn,.chip,.pin,.seg button,.kinds button'))navigator.vibrate&&navigator.vibrate(6)},{passive:true});
 // keep the scroll spot when the app returns from the background
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
 // service worker (needs https or localhost)
 if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>{r.addEventListener('updatefound',()=>{const w=r.installing;w&&w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)toast('Update ready. Reopen the app to apply it')})})}).catch(()=>{}));
})();

// ---- v12: installable app behaviour ----
(()=>{
 const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 // offline / online
 const off=document.createElement('div');off.className='offline';off.setAttribute('role','status');off.textContent='You’re offline. Showing saved pages.';document.body.append(off);
 const net=()=>off.classList.toggle('show',!navigator.onLine);addEventListener('online',()=>{net();toast('Back online')});addEventListener('offline',net);net();
 // install: Android/desktop prompt, iOS hint
 let dp=null;const ib=$('#inst'),ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;ib.hidden=false});
 addEventListener('appinstalled',()=>{dp=null;ib.hidden=true;toast('AJ District installed')});
 if(ios&&!standalone)ib.hidden=false;
 ib.onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;ib.hidden=true}else toast('Tap Share, then Add to Home Screen')};
 // light haptics on taps
 document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&e.target.closest('.btn,.chip,.pin,.seg button,.kinds button'))navigator.vibrate&&navigator.vibrate(6)},{passive:true});
 // keep the scroll spot when the app returns from the background
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
 // service worker (needs https or localhost)
 if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>{r.addEventListener('updatefound',()=>{const w=r.installing;w&&w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)toast('Update ready. Reopen the app to apply it')})})}).catch(()=>{}));
})();
