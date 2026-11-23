/* cms-public.js — CMS config hydration with EN/AR support via D.ar translations */
const applyCmsConfig=D=>{
if(!D)return;
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),
  text=(s,v)=>{const e=$(s);if(e)e.textContent=v??''},
  esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Language-aware data accessors ─────────────────────────────────────── */
// ar() returns the Arabic override when AR is active and a value exists,
// otherwise falls back to the English source. The i18n.js dictionary then
// catches any remaining untranslated UI strings as a final safety net.
const isAr=()=>document.documentElement.lang==='ar';
const ar=(en,arVal)=>isAr()&&arVal?arVal:en;

const AR=D.ar||{};
const event=D.event||{},copy=D.copy||{},site=D.site||{},images=D.appearance?.images||{};
const arEvent=AR.event||{},arCopy=AR.copy||{};
window.AJ_LIVE_COPY=copy;window.AJ_LIVE_SITE=site;window.AJ_AR=AR;

/* helper: returns EN or AR copy value */
const cp=(key)=>ar(copy[key],arCopy[key]);
/* helper: returns EN or AR event field */
const ev=(key)=>ar(event[key],arEvent[key]);

/* ── Metadata ────────────────────────────────────────────────────────────*/
const siteName=ar(site.name,AR.site?.name)||'AJ District';
const evName=ev('name')||siteName;
document.title=`${evName} · ${siteName}`;
const meta=$('meta[name="description"]');if(meta)meta.content=ar(site.meta_description,AR.site?.meta_description)||'';

/* ── Images ──────────────────────────────────────────────────────────────*/
const brandLogo=images.logo||'logos/AJ-white@4x.png';document.querySelectorAll('.logo').forEach(i=>{i.src=brandLogo;i.alt=site.logo_alt||site.name||'AJ District'});
const imageTargets={hero:'.hero .hbg img',feature:'.shot .slides img',booth:'.shot .mini img',aisle:'.shot .mini2 img',event:'.evf .evfi img'};
Object.entries(imageTargets).forEach(([key,selector])=>{const el=$(selector);if(!el)return;if(images[key]==='__none__'){el.hidden=true;el.removeAttribute('src')}else{el.hidden=false;el.src=images[key]||({logo:'logos/AJ-white@4x.png',hero:'photos/DSC04670.jpg',feature:'photos/DSC04639.jpg',booth:'photos/DSC04620.jpg',aisle:'photos/DSC04553.jpg',event:'photos/DSC04815.jpg'}[key])}});

/* ── Hero ────────────────────────────────────────────────────────────────*/
text('#hero-title',ar(D.home?.hero_title,AR.home?.hero_title));
text('#hero-description',ar(D.home?.hero_intro,AR.home?.hero_intro));
text('#hero-date',ev('short_date'));
text('#hero-hours',`${ev('name')||''}, ${ev('hours')||''}`);
text('#hero-city',ev('city'));text('#hero-venue',ev('venue'));
text('.plate b',`${ev('name')||''} ${(String(ev('date')||'').match(/20\d\d/)||[''])[0]}`.trim());
text('.plate span',`${ev('venue')||''}, ${ev('city')||''} · ${ev('date')||''}`);

/* ── Events section ──────────────────────────────────────────────────────*/
const evTitle=$('#events .evf h3'),evDesc=$('#events .evf p');
if(evTitle)evTitle.textContent=ev('name')||'';
if(evDesc)evDesc.textContent=ev('description')||'';
const setLi=(selector,value)=>{const li=$(selector);if(!li)return;const node=[...li.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(node)node.nodeValue=value;else li.append(document.createTextNode(value))};
setLi('#events .evm li:first-child',`${ev('venue')||''}, ${ev('city')||''}`);
setLi('#events .evm li:nth-child(2)',ev('hours')||'');
setLi('#events .evm li:last-child',`${isAr()?'أجنحة بيضاء ابتداءً من':'White booths from'} AED ${Number(event.booth_price||0).toLocaleString('en-US')}`);
const shortParts=String(ev('short_date')||'').split(/\s+/),dateBox=$('#events .evf .evd');
text('#events .evf .evd b',shortParts.shift()||'');
if(dateBox){const n=[...dateBox.childNodes].find(x=>x.nodeType===Node.TEXT_NODE);if(n)n.nodeValue=shortParts.join(' ')}
text('#events h2',ev('name'));
text('#events>.wrap>.sub',cp('events_intro'));
text('#location h2',cp('location_title'));
text('#location>.wrap>.sub',cp('location_intro'));
setLi('.hero .row a:first-child',cp('hero_reserve_label'));
setLi('.hero .row a:nth-child(2)',cp('hero_events_label'));
text('#hero-ring-label',cp('hero_ring_label'));
const heroMap=$('#hero-venue')?.parentElement;
if(heroMap){const node=[...heroMap.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(node)node.nodeValue=` · ${cp('hero_map_label')||'view map'}`}
const heroLeft=$('.facts>div:last-child .mut');
if(heroLeft)heroLeft.textContent=(cp('hero_spaces_left')||'of {total} spaces left').replace('{total}',String(S?.length||92));
text('#events .evf .tag',cp('events_status'));
setLi('#events .evf .cacts a:first-child',cp('events_reserve_label'));
setLi('#events .evf .cacts a:nth-child(2)',cp('events_map_label'));
text('#events .splogos>span',cp('events_sponsor_intro'));
text('.evh h3',cp('events_next_title'));
const avail=$('.avail span');
if(avail)avail.textContent=(cp('booking_spaces_free')||'of {total} spaces free').replace('{total}',String(S?.length||92));

/* ── Booking section ─────────────────────────────────────────────────────*/
const maxOrder=Number(event.max_per_order)||3;
const bookingTitle=(cp('booking_title')||'Pick your spot at {event}').replaceAll('{event}',ev('name')||'').replaceAll('Demo Event',ev('name')||'');
const bookingIntro=(cp('booking_intro')||'').replaceAll('{max}',String(maxOrder)).replace(/Up to three spaces per order\./i,`Up to ${maxOrder} spaces per order.`);
text('#book .bhd h2',bookingTitle);text('#book .sub',bookingIntro);text('#book .note',cp('booking_note'));
const countdownLabel=$('#cdl span');if(countdownLabel&&cp('booking_countdown_label'))countdownLabel.textContent=cp('booking_countdown_label');

/* ── How it works ────────────────────────────────────────────────────────*/
text('#how h2',cp('how_title'));
['choose','pay','visit'].forEach((k,i)=>{const card=$(`#how .how>div:nth-child(${i+1})`);if(card){const h=card.querySelector('h3'),p=card.querySelector('p');if(h)h.textContent=cp(`how_${k}_title`)||'';if(p)p.textContent=cp(`how_${k}_text`)||''}});
setLi('#how .how>div:nth-child(3) .btn',cp('how_visit_link')||'');

/* ── Sponsors ────────────────────────────────────────────────────────────*/
const arTiers=AR.sponsors?.tiers||[];
text('#sponsors h2',cp('sponsors_title'));text('#sponsors>.wrap>p',cp('sponsors_intro'));text('#spf h3',cp('sponsors_form_title'));
[['#spf label[for="spn"]',cp('sponsors_company_label')],['#spf label[for="spc"]',cp('sponsors_contact_label')],['#spf label[for="spt"]',cp('sponsors_interest_label')]].forEach(([selector,label])=>{const el=$(selector);if(el&&label)el.textContent=label});
const sponsorSelect=$('#spt');
if(sponsorSelect){const selected=sponsorSelect.value;const options=(D.sponsors?.tiers||[]).map((tier,i)=>{const title=ar(tier.title,arTiers[i]?.title)||tier.title||'';return new Option(title,tier.title||'')});options.push(new Option(cp('sponsors_unsure_label')||'Not sure yet',copy.sponsors_unsure_label||'Not sure yet'));sponsorSelect.replaceChildren(...options);if([...sponsorSelect.options].some(o=>o.value===selected))sponsorSelect.value=selected;else if(sponsorSelect.options.length>1)sponsorSelect.selectedIndex=1}
setLi('#spf button[type="submit"]',cp('sponsors_submit_label'));
const tiers=$('#sponsors .tiers');
if(tiers){tiers.replaceChildren();(D.sponsors?.tiers||[]).forEach((t,i)=>{const arT=arTiers[i]||{};const box=document.createElement('div');box.className='tier';const icon=document.createElement('i');icon.className=`ph-light ph-${t.icon||'seal-check'}`;const title=document.createElement('h3');title.textContent=ar(t.title,arT.title)||'';const list=document.createElement('ul');const benefits=t.benefits||[];const arBenefits=arT.benefits||[];benefits.forEach((b,j)=>{const li=document.createElement('li'),check=document.createElement('i');check.className='ph-light ph-check';li.append(check,document.createTextNode(ar(String(b),arBenefits[j])));list.append(li)});box.append(icon,title,list);tiers.append(box)})}
const logos=$('#sponsors .spstrip');if(logos){logos.replaceChildren();(D.sponsors?.showcase||[]).forEach(name=>{const span=document.createElement('div');span.textContent=name;logos.append(span)})}

/* ── FAQ ─────────────────────────────────────────────────────────────────*/
const arFaq=AR.faq||{};
text('#faq .fhead h2',cp('faq_title'));text('#faq .fhead>p',cp('faq_intro'));setLi('#faq .fhead .btn',cp('faq_ask_label'));
const faq=$('#faq .fl');
if(faq){faq.replaceChildren();(D.faq||[]).forEach((row,i)=>{const detail=document.createElement('details'),summary=document.createElement('summary'),icon=document.createElement('i'),answer=document.createElement('p');summary.append(document.createTextNode(ar(row.q,arFaq[i]?.q)||''));icon.className='ph-light ph-plus';summary.append(icon);answer.textContent=ar(row.a,arFaq[i]?.a)||'';detail.append(summary,answer);faq.append(detail)})}

/* ── Terms ───────────────────────────────────────────────────────────────*/
const terms=$('#pg-terms');
if(terms){text('#pg-terms h1',D.terms?.title||cp('terms_title'));text('#pg-terms>.rpage>.wrap>.sub',D.terms?.intro||cp('terms_intro'));text('#pg-terms .terms-intro div:first-child p',cp('terms_agreement_intro_en'));text('#pg-terms .terms-intro div:nth-child(2) p',cp('terms_agreement_intro_ar'));const list=$('#pg-terms .terms-list');if(list){list.replaceChildren();(D.terms?.clauses||[]).forEach((clause,index)=>{const article=document.createElement('article');article.className='term';[['en',clause.en],['ar',clause.ar]].forEach(([lang,title])=>{const col=document.createElement('div');if(lang==='ar'){col.lang='ar';col.dir='rtl'}const h=document.createElement('h2');h.textContent=`${index+1}. ${title||''}`;const ul=document.createElement('ul');String(clause[`${lang}_text`]||'').split('\n').filter(Boolean).forEach(line=>{const li=document.createElement('li');li.textContent=line;ul.append(li)});col.append(h,ul);article.append(col)});list.append(article)})}const ack=terms.querySelector('.terms-ack');if(ack){const ps=ack.querySelectorAll('p');if(ps[0])ps[0].textContent=D.terms?.acceptance_en||'';if(ps[1])ps[1].textContent=D.terms?.acceptance_ar||''}}

/* ── Receipt ─────────────────────────────────────────────────────────────*/
text('#pg-receipt h1',cp('receipt_title'));text('#pg-receipt>.rpage>.wrap>.sub',cp('receipt_intro'));
setLi('.terms-download',cp('terms_download_label'));

/* ── Footer ──────────────────────────────────────────────────────────────*/
text('footer .fcta h2',cp('footer_cta'));text('footer .fbrand p',cp('footer_about'));text('footer .fev',ev('name'));
const foot=$('footer .fev')?.nextElementSibling;
if(foot)foot.replaceChildren(document.createTextNode(ev('date')||''),document.createElement('br'),document.createTextNode(ev('hours')||''),document.createElement('br'),document.createTextNode(`${ev('venue')||''}, ${ev('city')||''}`));
const footHeads=$$('footer nav h4');if(footHeads[0])footHeads[0].textContent=cp('footer_explore')||'';if(footHeads[1])footHeads[1].textContent=cp('footer_contact')||'';
const nextHead=$$('footer .fev')[0]?.parentElement?.querySelector('h4');if(nextHead)nextHead.textContent=cp('footer_next')||'';
[['footer .fcta .row a:first-child',cp('footer_cta_reserve')],['footer .fcta .row a:nth-child(2)',cp('footer_cta_contact')],['footer nav[aria-label="Explore"] a:nth-of-type(1)',cp('footer_events_label')],['footer nav[aria-label="Explore"] a:nth-of-type(2)',cp('footer_location_label')],['footer nav[aria-label="Explore"] a:nth-of-type(3)',cp('footer_reserve_label')],['footer nav[aria-label="Explore"] a:nth-of-type(4)',cp('footer_dashboard_label')],['footer nav[aria-label="Contact"] a:nth-of-type(1)',cp('footer_whatsapp_label')],['footer nav[aria-label="Contact"] a:nth-of-type(2)',cp('footer_instagram_label')],['footer nav[aria-label="Contact"] a:nth-of-type(3)',cp('footer_tiktok_label')],['footer nav[aria-label="Contact"] a:nth-of-type(4)',cp('footer_snapchat_label')]].forEach(([selector,label])=>{if(label)setLi(selector,label)});
const mapLink=$('footer .fev')?.parentElement?.querySelector('a');if(mapLink&&cp('footer_map_label')){const node=[...mapLink.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(node)node.nodeValue=cp('footer_map_label')}
const legal=$('footer .fbot small');if(legal)legal.textContent=`© ${new Date().getFullYear()} ${cp('footer_legal')||'AJ District · Ajman, UAE'}`;
setLi('footer .totop',cp('footer_back_to_top')||'Back to top');

/* ── Contacts / social ───────────────────────────────────────────────────*/
const links=site.contact||{};document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>{const old=new URL(a.href);old.pathname='/'+String(links.whatsapp||'971554662997').replace(/\D/g,'');a.href=old.href});
const safeSocial=(value,host)=>{try{const u=new URL(value);return u.protocol==='https:'&&(u.hostname===host||u.hostname.endsWith(`.${host}`))?u.href:''}catch{return''}};
[['instagram','a[href*="instagram.com/"]','instagram.com'],['tiktok','a[href*="tiktok.com/"]','tiktok.com'],['snapchat','a[href*="snapchat.com/"]','snapchat.com']].forEach(([key,selector,host])=>{const url=safeSocial(links[key],host);if(url)document.querySelectorAll(selector).forEach(a=>a.href=url)});

/* ── PDF / extra link ────────────────────────────────────────────────────*/
const termsPdf=$('.terms-download'),pdfTarget=site.links?.terms_pdf||'AJ_District_Exhibition_Terms_and_Payment_Receipt_Bilingual-v3.pdf';
if(termsPdf){termsPdf.href=/^https:\/\//i.test(pdfTarget)?pdfTarget:`/${String(pdfTarget).replace(/^\/+/, '')}`;termsPdf.hidden=!pdfTarget}
const contactNav=$('footer nav[aria-label="Contact"]');contactNav?.querySelector('[data-cms-extra-link]')?.remove();
if(contactNav&&site.links?.external_label&&site.links?.external_url&&/^(https:\/\/|mailto:|tel:)/i.test(site.links.external_url)){const link=document.createElement('a');link.dataset.cmsExtraLink='true';link.href=site.links.external_url;link.textContent=site.links.external_label;if(/^https:\/\//i.test(link.href)){link.target='_blank';link.rel='noopener'}contactNav.append(link)}

/* ── Navigation labels ───────────────────────────────────────────────────*/
const navKeys={events:'events',booking:'book',sponsors:'sponsors',terms:'terms',receipts:'receipt'};
Object.entries(navKeys).forEach(([key,id])=>{const label=site.navigation?.[key];if(!label)return;document.querySelectorAll(`[data-nav="${id}"]`).forEach(a=>{const icon=a.querySelector('i');if(icon){const t=[...a.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(t)t.nodeValue=label}else a.textContent=label})});
if(site.navigation?.dashboard)document.querySelectorAll('[data-nav="dashboard"]').forEach(a=>{const t=[...a.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(t)t.nodeValue=site.navigation.dashboard});
if(site.navigation?.reserve){['.dnav>.btn.lt','.nacts .hcta','.mbot>.btn.acc'].forEach(selector=>setLi(selector,site.navigation.reserve))}

/* ── Upcoming event cards ────────────────────────────────────────────────*/
const arUpcoming=arEvent.upcoming||[];
const upcomingMerged=(event.upcoming||[]).map((card,i)=>{const ar=arUpcoming[i]||{};return {...card,t:isAr()&&ar.t?ar.t:card.t,tag:isAr()&&ar.tag?ar.tag:card.tag,x:isAr()&&ar.x?ar.x:card.x,p:isAr()&&ar.p?ar.p:card.p}});
if(Array.isArray(UP)&&Array.isArray(event.upcoming)){UP.splice(0,UP.length,...upcomingMerged);if(typeof evCards==='function')evCards(true)}

/* ── Location / spaces / countdown ──────────────────────────────────────*/
if(Array.isArray(EVENTS)&&EVENTS[0]){Object.assign(EVENTS[0],{name:ev('name'),place:ev('venue'),city:ev('city'),addr:ev('address'),coords:event.coordinates,date:ev('date'),time:ev('hours'),note:ev('note')});if(typeof locView==='function')locView()}
if(Array.isArray(S)){S.forEach(s=>s.price=Number(event.booth_price)||2000);if(typeof paint==='function')paint()}
if(typeof T!=='undefined'&&event.start){T=new Date(`${event.start}:00+04:00`);if(typeof tick==='function')tick()}

/* ── Section visibility & order ──────────────────────────────────────────*/
Object.entries(D.sections||{}).forEach(([id,on])=>{const el=document.getElementById(id==='booking'?'book':id);if(el)el.hidden=!on});
if(terms)terms.hidden=D.sections?.terms===false;const receipt=$('#pg-receipt');if(receipt)receipt.hidden=D.sections?.receipts===false;
const navTargets={events:'events',booking:'book',sponsors:'sponsors',terms:'terms',receipts:'receipt'};
Object.entries(navTargets).forEach(([key,id])=>{if(D.sections?.[key]===false)document.querySelectorAll(`[href="/${id}"]`).forEach(a=>a.hidden=true)});
const home=$('#pg-home');(D.section_order||[]).forEach(id=>{const section=home?.querySelector(`:scope > #${id}`);if(section)home.append(section)});

/* ── Theme ───────────────────────────────────────────────────────────────*/
const root=document.documentElement,theme=D.appearance?.theme||'gulf';root.dataset.theme=theme;
['--panel','--panel2','--deep','--on','--acc','--acc-on','--sand','--paper'].forEach(key=>root.style.removeProperty(key));
const colors=D.appearance?.colors;if(theme==='custom'&&colors){root.style.setProperty('--panel',colors.panel);root.style.setProperty('--panel2',`color-mix(in srgb,${colors.panel} 82%,#fff)`);root.style.setProperty('--deep',`color-mix(in srgb,${colors.panel} 82%,#000)`);root.style.setProperty('--acc',colors.accent);root.style.setProperty('--sand',colors.surface);root.style.setProperty('--paper',colors.background);root.style.setProperty('--on','#F8F4EC');root.style.setProperty('--acc-on','#142120')}
const themeMeta=$('meta[name="theme-color"]');if(themeMeta)themeMeta.content=getComputedStyle(root).getPropertyValue('--panel').trim();
};

/* ── Re-apply when language switches ────────────────────────────────────*/
// Hook into i18n.js's setLang to re-run CMS content in the new language.
// i18n.js calls setLang(); we wrap it after it's defined.
document.addEventListener('ajd:langchange',()=>applyCmsConfig(window.AJ_CONFIG));

applyCmsConfig(window.AJ_CONFIG);
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='AJD_ADMIN_PREVIEW'||!event.data.config)return;applyCmsConfig(event.data.config)});
