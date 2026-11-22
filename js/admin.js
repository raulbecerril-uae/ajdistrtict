(()=>{
const preview=document.querySelector('#admin-preview'),previewFrame=preview?.querySelector('iframe'),previewToggle=document.querySelector('.preview-toggle');
const primaryForm=document.querySelector('.admin-content form.edit-form input[name="action"][value^="save_"]')?.form||null;
const adminPalettes={gulf:['#0E2B2C','#F0B35C'],skyline:['#101D3A','#6CC6FF'],dune:['#EDE0C8','#A5481F'],oasis:['#14301F','#B9D96A'],falcon:['#23201D','#E2B04F'],majlis:['#4B1E2B','#F2B94B'],souq:['#B5532E','#F6C879'],pearl:['#E9EFEC','#0E6B6B']};
const contrastColor=hex=>{const h=String(hex||'').replace('#','');if(!/^[0-9a-f]{6}$/i.test(h))return '#fff';const c=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]>.43?'#182624':'#fff'};
const setAdminTheme=(theme,colors={})=>{const [presetPanel,presetAccent]=adminPalettes[theme]||adminPalettes.gulf,panel=colors.panel||presetPanel,accent=colors.accent||presetAccent,surface=colors.surface||'#EFDFCB',background=colors.background||'#FFFDFA',root=document.documentElement;root.dataset.adminTheme=theme||'gulf';root.style.setProperty('--green',panel);root.style.setProperty('--green2',`color-mix(in srgb,${panel} 78%,#fff)`);root.style.setProperty('--gold',accent);root.style.setProperty('--paper',background);root.style.setProperty('--admin-surface',surface);root.style.setProperty('--admin-on-panel',contrastColor(panel));root.style.setProperty('--admin-accent-on',contrastColor(accent));};
const storedAppearance=window.AJ_ADMIN_CONFIG?.appearance||{};setAdminTheme(storedAppearance.theme,storedAppearance.theme==='custom'?storedAppearance.colors:{});
const updateAdminThemeFromForm=()=>{const form=primaryForm;if(form?.querySelector('[name="action"][value="save_appearance"]')){const get=name=>form.elements.namedItem(name)?.value;setAdminTheme(get('appearance[theme]')||storedAppearance.theme,{panel:get('appearance[colors][panel]'),accent:get('appearance[colors][accent]'),surface:get('appearance[colors][surface]'),background:get('appearance[colors][background]')})}};
primaryForm?.addEventListener('input',updateAdminThemeFromForm);primaryForm?.addEventListener('change',updateAdminThemeFromForm);
primaryForm?.querySelector('[name="appearance[theme]"]')?.addEventListener('change',event=>{const theme=event.currentTarget.value,palette=adminPalettes[theme];if(!palette)return;const values={panel:palette[0],accent:palette[1],surface:'#EFDFCB',background:'#FFFDFA'};Object.entries(values).forEach(([key,value])=>{const field=primaryForm.elements.namedItem(`appearance[colors][${key}]`);if(field)field.value=value});updateAdminThemeFromForm()});
let previewTimer=0;
const previewConfig=form=>{
 const config=JSON.parse(JSON.stringify(window.AJ_ADMIN_CONFIG||{}));if(!form)return config;
 const action=form.querySelector('[name="action"]')?.value||'';
 const setPath=(parts,value)=>{let target=config;parts.forEach((part,index)=>{if(index===parts.length-1){target[part]=value;return}if(!target[part]||typeof target[part]!=='object')target[part]={};target=target[part]})};
 [...form.elements].forEach(field=>{
  if(!field.name||field.type==='file'||field.type==='submit'||field.type==='button'||field.type==='reset'||(field.type==='radio'&&!field.checked))return;
  const parts=field.name.match(/[^[\]]+/g);if(parts?.length)setPath(parts,field.type==='checkbox'?field.checked:field.value);
 });
 if(action==='save_copy'){config.home=config.home||{};config.home.hero_title=config.copy?.hero_title??config.home.hero_title;config.home.hero_intro=config.copy?.hero_intro??config.home.hero_intro}
 if(action==='save_event'){
  config.event.upcoming=Object.values(config.event?.upcoming||{});
  config.appearance=config.appearance||{};config.appearance.images=config.appearance.images||{};config.appearance.images.event=config.event.image||'';
 }
 if(action==='save_faq')config.faq=Object.values(config.faq||{});
 if(action==='save_sponsors'){
  config.sponsors=config.sponsors||{};config.sponsors.tiers=Object.values(config.tiers||{}).map(tier=>({...tier,benefits:String(tier.benefits_text||'').split(/\r?\n/).filter(Boolean)}));delete config.tiers;
  config.sponsors.showcase=Object.values(config.showcase||{});delete config.showcase;
 }
 if(action==='save_terms')config.terms.clauses=Object.values(config.terms?.clauses||{});
 if(action==='save_sections'){
  const positions={};form.querySelectorAll('[name^="section_order["]').forEach(field=>{const key=field.name.match(/section_order\[([^\]]+)\]/)?.[1];if(key)positions[key]=Number(field.value)||99});
  config.section_positions=positions;config.section_order=Object.entries(positions).sort((a,b)=>a[1]-b[1]).map(([key])=>key);
 }
 return config;
};
const sendPreview=()=>{
 if(!previewFrame?.contentWindow||previewFrame.dataset.ready!=='true')return;
 previewFrame.contentWindow.postMessage({type:'AJD_ADMIN_PREVIEW',config:previewConfig(primaryForm)},location.origin);
};
const queuePreview=()=>{clearTimeout(previewTimer);previewTimer=setTimeout(sendPreview,120)};
if(preview&&previewFrame&&previewToggle){
 const openPreview=()=>{preview.hidden=false;previewToggle.setAttribute('aria-expanded','true');if(previewFrame.dataset.started!=='true'){previewFrame.dataset.started='true';previewFrame.src=previewFrame.dataset.previewSrc}else queuePreview()};
 const closePreview=()=>{preview.hidden=true;previewToggle.setAttribute('aria-expanded','false');previewToggle.focus()};
 previewToggle.addEventListener('click',()=>preview.hidden?openPreview():closePreview());preview.querySelector('.preview-close')?.addEventListener('click',closePreview);
 previewFrame.addEventListener('load',()=>{previewFrame.dataset.ready='true';sendPreview()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!preview.hidden)closePreview()});
 if(primaryForm){primaryForm.addEventListener('input',queuePreview);primaryForm.addEventListener('change',queuePreview);primaryForm.addEventListener('click',event=>{if(event.target.closest('[data-add-row],.remove-row'))requestAnimationFrame(queuePreview)})}
}

document.querySelectorAll('.admin-tabs').forEach(tabs=>{
 const buttons=[...tabs.querySelectorAll('[data-admin-tab]')];
 const activate=(button,focus=false)=>{
  const form=tabs.closest('form');if(!form)return;
  buttons.forEach(item=>{const active=item===button;item.setAttribute('aria-selected',active?'true':'false');item.tabIndex=active?0:-1;const panel=form.querySelector(`[data-admin-panel="${CSS.escape(item.dataset.adminTab)}"]`);if(panel)panel.hidden=!active});
  if(focus)button.focus();
 };
 buttons.forEach((button,index)=>{
  button.tabIndex=button.getAttribute('aria-selected')==='true'?0:-1;
  button.addEventListener('click',()=>activate(button));
  button.addEventListener('keydown',event=>{
   if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
   event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;activate(buttons[next],true);
  });
 });
});

document.querySelectorAll('.admin-content form.edit-form input[name="action"][value^="save_"]').forEach(formAction=>{
 const form=formAction.form;if(!form)return;
 const dock=document.createElement('div');dock.className='admin-save-dock';dock.setAttribute('role','region');dock.setAttribute('aria-label','Save website changes');
 dock.innerHTML='<span class="save-status" aria-live="polite">No unpublished edits.</span><button class="button primary" type="button"><i class="ph-light ph-floppy-disk" aria-hidden="true"></i> Save changes</button>';
 dock.querySelector('button').addEventListener('click',()=>form.requestSubmit());document.body.append(dock);
 const status=dock.querySelector('.save-status');let dirty=false;
 const markDirty=()=>{dirty=true;status.textContent='You have unsaved changes.';dock.classList.add('is-dirty')};
 const beforeUnload=event=>{if(dirty){event.preventDefault();event.returnValue=''}};window.addEventListener('beforeunload',beforeUnload);
 form.addEventListener('input',markDirty);form.addEventListener('change',markDirty);form.addEventListener('click',event=>{if(event.target.closest('[data-add-row]'))markDirty()});
 form.addEventListener('submit',event=>{if(event.defaultPrevented)return;if(!window.confirm('Save and publish these website changes?')){event.preventDefault();status.textContent='Save cancelled. Your edits are still here.';dock.classList.add('is-dirty');return}dirty=false;status.textContent='Saving your changes…';dock.classList.remove('is-dirty')});
});

document.querySelectorAll('[data-add-row]').forEach(button=>button.addEventListener('click',()=>{
 const key=button.dataset.addRow,list=document.querySelector(`[data-repeat-list="${key}"]`),template=document.querySelector(`[data-repeat-template="${key}"]`);if(!list||!template)return;
 const index=Date.now().toString()+Math.floor(Math.random()*1000);const fragment=template.content.cloneNode(true);fragment.querySelectorAll('[name]').forEach(input=>input.name=input.name.replaceAll('__INDEX__',index));fragment.querySelectorAll('[id],[for]').forEach(el=>{if(el.id)el.id=el.id.replaceAll('__INDEX__',index);if(el.htmlFor)el.htmlFor=el.htmlFor.replaceAll('__INDEX__',index)});list.append(fragment);
}));
document.addEventListener('click',event=>{const remove=event.target.closest('.remove-row');if(!remove)return;const card=remove.closest('.repeat-card'),label=card?.querySelector('legend')?.textContent?.trim()||'item';if(!window.confirm(`Delete this ${label.toLowerCase()}? This cannot be undone.`)){event.preventDefault();return}card?.remove();const form=remove.closest('form');if(form)form.dispatchEvent(new Event('change',{bubbles:true}))});
document.querySelectorAll('.import-button input').forEach(input=>input.addEventListener('change',()=>{const button=input.closest('.import-button');if(input.files?.[0])button.firstChild.textContent=`Selected: ${input.files[0].name}`}));
document.querySelectorAll('form').forEach(form=>{if(form.querySelector('[name="action"][value="import_site"]'))form.addEventListener('submit',event=>{if(!window.confirm('Restore this backup and replace the current website content?'))event.preventDefault()})});
document.querySelectorAll('.upload-drop input').forEach(input=>input.addEventListener('change',()=>{const label=input.closest('.upload-drop'),files=[...(input.files||[])];const name=files.length?files.map(f=>f.name).join(', '):'Select images to upload';label.querySelector('b').textContent=name;label.querySelector('span').textContent=files.length?`${files.length} image${files.length===1?'':'s'} selected`:'Maximum 8 MB per image';const grid=input.closest('form')?.querySelector('.upload-preview-grid');if(!grid)return;grid.replaceChildren();grid.hidden=!files.length;files.forEach(file=>{const card=document.createElement('div'),image=document.createElement('img'),caption=document.createElement('span');card.className='upload-preview-card';image.src=URL.createObjectURL(file);image.alt=file.name;image.onload=()=>URL.revokeObjectURL(image.src);caption.textContent=file.name;card.append(image,caption);grid.append(card)})}));

document.querySelectorAll('[data-image-preview-select]').forEach(select=>{
 const box=select.closest('.image-picker-field')?.querySelector('.image-picker-preview'),image=box?.querySelector('img'),empty=box?.querySelector('.image-preview-empty');if(!image||!empty)return;
 const unavailable=()=>{image.hidden=true;empty.hidden=false};
 image.addEventListener('error',unavailable);
 const update=()=>{if(select.value==='__none__'){image.hidden=true;empty.textContent='Image removed from this section';empty.hidden=false;return}image.hidden=false;empty.hidden=true;image.src=select.value||select.dataset.defaultSrc||'';if(!image.src)unavailable()};
 select.addEventListener('change',update);if(image.complete&&image.naturalWidth===0)unavailable();
});

document.addEventListener('change',event=>{
 const field=event.target;if(!(field instanceof HTMLSelectElement)||!field.matches('[data-event-image-select]'))return;
 const card=field.closest('.event-repeat-card'),image=card?.querySelector('.event-image-preview img'),empty=card?.querySelector('.image-preview-empty');if(!image||!empty)return;
 const value=field.value.trim();if(value==='__none__'){image.hidden=true;empty.textContent='No image assigned';empty.hidden=false;return}if(!value){image.hidden=false;empty.hidden=true;image.src='/photos/DSC04685.jpg';return}
 const src=value.startsWith('/media/')?value:`/photos/${value.replace(/\.jpg$/i,'')}.jpg`;
 image.onerror=()=>{image.hidden=true;empty.hidden=false};image.hidden=false;empty.hidden=true;image.src=src;
});
document.querySelectorAll('.event-image-preview img').forEach(image=>image.addEventListener('error',()=>{image.hidden=true;const empty=image.closest('.event-image-preview')?.querySelector('.image-preview-empty');if(empty)empty.hidden=false}));
})();
