/* ---- v19: Arabic / English, ticker ---- */
(()=>{
const AR={
'Events':'الفعاليات','Reserve a space':'احجز مساحة','Sponsors':'الرعاة','FAQ':'الأسئلة الشائعة','Receipts':'الإيصالات','Reserve now':'احجز الآن','Reserve':'احجز','Message us':'راسلنا','Install app':'تثبيت التطبيق','Theme':'المظهر','Theme:':'المظهر:','Open menu':'فتح القائمة','Close menu':'إغلاق القائمة','Colour theme':'مظهر الألوان','AJ District home':'الصفحة الرئيسية',
'Where ideas meet people.':'حيث تلتقي الأفكار بالناس.','AJ District brings makers, brands and curious crowds together at exhibitions and events across the UAE.':'تجمع AJ District المبدعين والعلامات التجارية والزوّار الفضوليين في معارض وفعاليات في أنحاء الإمارات.','See all events':'عرض كل الفعاليات',
'27–29 Nov':'27–29 نوفمبر','Demo Event, 4 - 11 pm':'الفعالية التجريبية، 4 - 11 مساءً','Ajman':'عجمان','Al Safia Park · view map':'حديقة الصفيا · عرض الخريطة','of 92 spaces left':'من 92 مساحة متبقية','of 92 spaces free':'من 92 مساحة متاحة',
'Doors open in':'تُفتح الأبواب بعد','Happening now':'تجري الآن','days':'أيام','hours':'ساعات','min':'دقيقة','sec':'ثانية','Countdown to Demo Event':'العد التنازلي للفعالية التجريبية',
'What’s on at AJ District':'ما الجديد في AJ District','Every event has its own space map and booking. New dates are added as soon as they’re confirmed.':'لكل فعالية خريطة مساحات وحجز خاص بها. تُضاف المواعيد الجديدة فور تأكيدها.',
'Booking open':'الحجز مفتوح','Demo Event':'الفعالية التجريبية','Demo Event 2026 · Ajman':'الفعالية التجريبية 2026 · عجمان',
'Demo event: a three-day showcase of young makers, products and projects. Walk a lit, palm-lined lawn of white booths with lounge seating along a wide central aisle.':'فعالية تجريبية: عرض لثلاثة أيام لمبدعين شباب ومنتجات ومشاريع. تجوّل في حديقة مضاءة تصطف فيها النخيل وأجنحة بيضاء مع مقاعد استراحة على امتداد ممر رئيسي واسع.',
'Al Safia Park, Ajman':'حديقة الصفيا، عجمان','4 to 11 pm':'من 4 إلى 11 مساءً','White booths from AED 2,000':'أجنحة بيضاء ابتداءً من 2,000 درهم','Proudly supported by:':'برعاية:','SPONSOR 1':'الراعي 1','SPONSOR 2':'الراعي 2','SPONSOR 3':'الراعي 3','Map':'الخريطة',
'Coming up next':'قريبًا','All':'الكل','Markets':'الأسواق','Expos':'المعارض','Seasonal':'موسمية','Filter events':'تصفية الفعاليات',
'Creators Expo':'معرض صنّاع المحتوى','Eid Family Fair':'معرض العيد العائلي','Next Gen Expo':'معرض الجيل القادم','Ramadan Night Souq':'سوق ليالي رمضان','Spring Pop-up Market':'سوق الربيع المؤقت','Winter Makers Market':'سوق المبدعين الشتوي',
'Demo event: A small, fast weekend market for brands that want to meet customers in person.':'فعالية تجريبية: سوق صغير وسريع في نهاية الأسبوع للعلامات التي ترغب في لقاء العملاء مباشرة.',
'Demo event: An evening souq for iftar-time shopping: crafts, sweets, fragrance and fashion.':'فعالية تجريبية: سوق مسائي للتسوق وقت الإفطار: حِرف وحلويات وعطور وأزياء.',
'Demo event: Designers, illustrators and content creators showcase and sell their work.':'فعالية تجريبية: يعرض المصممون والرسّامون وصنّاع المحتوى أعمالهم ويبيعونها.',
'Demo event: Gift-ready products from local makers, with warm lights and food stalls by the water.':'فعالية تجريبية: منتجات جاهزة للإهداء من مبدعين محليين، بإضاءة دافئة وأكشاك طعام على الواجهة المائية.',
'Demo event: Startups and student brands show their first products to real customers.':'فعالية تجريبية: تعرض الشركات الناشئة وعلامات الطلبة منتجاتها الأولى على عملاء حقيقيين.',
'Demo event: Three festive days of family activities, gifts and pop-up booths.':'فعالية تجريبية: ثلاثة أيام احتفالية من الأنشطة العائلية والهدايا والأجنحة المؤقتة.',
'Waitlist open':'قائمة الانتظار مفتوحة','Announcing soon':'يُعلن قريبًا','Booking opens 1 Dec':'يفتح الحجز في 1 ديسمبر',
'Find the event':'ابحث عن الفعالية','Every AJ District event has its own pin. Open it in Google Maps for turn-by-turn directions.':'لكل فعالية من AJ District موقعها على الخريطة. افتحها في خرائط Google للحصول على الاتجاهات خطوة بخطوة.','Choose an event':'اختر فعالية','Event location map':'خريطة موقع الفعالية',
'Next event · location soon':'الفعالية القادمة · الموقع قريبًا','Venue':'المكان','Dates':'التواريخ','Opening hours':'ساعات العمل','Getting there':'كيفية الوصول','Al Safia Park':'حديقة الصفيا','Ajman, UAE':'عجمان، الإمارات','27–29 November 2026':'27–29 نوفمبر 2026','Parking is available at the park. Look for the lit entrance gate.':'المواقف متاحة في الحديقة. ابحث عن بوابة الدخول المضاءة.','Get directions':'احصل على الاتجاهات','Open in Google Maps':'افتح في خرائط Google','Copy address':'نسخ العنوان','Address copied':'تم نسخ العنوان',
'Pick your spot at Demo Event':'اختر مساحتك في الفعالية التجريبية','Choose a type, tap a number on the map, then add it to your booking. Up to three spaces per order.':'اختر النوع، ثم اضغط على رقم في الخريطة وأضفه إلى حجزك. حتى ثلاث مساحات في الطلب الواحد.',
'All spaces':'كل المساحات','White booths':'أجنحة بيضاء','Empty spaces':'مساحات فارغة','White booth':'جناح أبيض','Empty space':'مساحة فارغة','Booth':'جناح','Space':'مساحة','Grid':'شبكة','List':'قائمة','View':'العرض',
'Solid':'مصمت','Glass':'زجاجي','Wireframe':'هيكلي','Blueprint':'مخطط','Angle':'زاوية','Top':'علوي','Side':'جانبي','Auto-rotate':'دوران تلقائي','Numbers':'الأرقام','Full screen':'ملء الشاشة','Model style':'نمط النموذج','Camera':'الكاميرا','3D view options':'خيارات العرض ثلاثي الأبعاد',
'Drag to rotate · shift-drag to pan · ctrl-scroll to zoom':'اسحب للتدوير · Shift مع السحب للتحريك · Ctrl مع التمرير للتكبير','Drag to rotate · pinch to zoom':'اسحب للتدوير · اقرص للتكبير','Zoom in':'تكبير','Zoom out':'تصغير','Rotate left':'تدوير لليسار','Rotate right':'تدوير لليمين','Reset view':'إعادة الضبط',
'Available':'متاح','On hold':'محجوز مؤقتًا','Booked':'محجوز','Yours':'اختيارك','Closest to the entrance':'الأقرب إلى المدخل','Best price':'أفضل سعر','Demo availability. Connect a booking backend to show live spaces and take real payments.':'التوافر تجريبي. اربط نظام حجز لعرض المساحات الفعلية وقبول المدفوعات الحقيقية.',
'Choose a space':'اختر مساحة','Your selection':'اختيارك','Clear all':'مسح الكل','Continue':'متابعة','In your booking':'ضمن حجزك','Not available':'غير متاح','Click for details':'انقر للتفاصيل','In your booking. Click to review':'ضمن حجزك. انقر للمراجعة','No.':'الرقم','From gate':'من البوابة','Status':'الحالة','Price':'السعر','ENTRANCE':'المدخل','Central aisle':'الممر الرئيسي','Picnic area':'منطقة الجلوس','Open lawn':'مساحة عشبية','Floor plan of Demo Event':'مخطط الفعالية التجريبية','Clear basket':'إفراغ السلة','You can choose up to three spaces':'يمكنك اختيار ثلاث مساحات كحد أقصى',
'Book in a minute, keep your receipt forever':'احجز في دقيقة واحدة واحتفظ بإيصالك دائمًا','Choose':'اختر','Pick spaces on the map. The running total follows you down the page.':'اختر المساحات من الخريطة. يرافقك الإجمالي أثناء تصفح الصفحة.','Pay':'ادفع','Card, Apple Pay or Google Pay. Your space locks the moment payment clears.':'بطاقة أو Apple Pay أو Google Pay. تُحجز مساحتك فور اكتمال الدفع.','Download and share':'حمّل وشارك','Get a receipt as a PDF in one tap, then share it by WhatsApp, email or link.':'احصل على الإيصال بصيغة PDF بنقرة واحدة، ثم شاركه عبر واتساب أو البريد أو رابط.','Open the receipts page':'افتح صفحة الإيصالات',
'Want to be a sponsor?':'هل ترغب في أن تكون راعيًا؟','Put your brand in front of makers, families and curious crowds. Pick a level below or tell us what you have in mind and we’ll build a package around it.':'اعرض علامتك أمام المبدعين والعائلات والزوّار الفضوليين. اختر مستوى من الأسفل أو أخبرنا بما يدور في ذهنك وسنصمم لك باقة مناسبة.',
'Title sponsor':'الراعي الرئيسي','Gold sponsor':'الراعي الذهبي','Supporting partner':'شريك داعم','Your name beside the event name':'اسمك بجانب اسم الفعالية','Logo on the entrance gate and stage':'شعارك على بوابة الدخول والمسرح','Premium space near the entrance':'مساحة مميزة قرب المدخل','Featured in all promotion':'حضور في جميع الحملات الترويجية','Logo on banners and the website':'شعارك على اللافتات والموقع','Free booth for the three days':'جناح مجاني لمدة ثلاثة أيام','Mentions on social media':'إشارات على وسائل التواصل','Logo on the sponsors wall':'شعارك على جدار الرعاة','Product or service in kind':'منتج أو خدمة عينية','Thank-you post after the event':'منشور شكر بعد الفعالية','Your logo here':'شعارك هنا','Sponsor logo slots':'خانات شعارات الرعاة',
'Tell us about your brand':'حدثنا عن علامتك التجارية','Company or brand':'الشركة أو العلامة التجارية','Contact name':'اسم المسؤول','Interested in':'مهتم بـ','Not sure yet':'لم أقرر بعد','Become a sponsor':'كن راعيًا',
'Good to know':'معلومات مفيدة','Quick answers for exhibitors and visitors. Anything missing? Ask us directly.':'إجابات سريعة للعارضين والزوّار. هل ينقصك شيء؟ اسألنا مباشرة.','Ask on WhatsApp':'اسأل عبر واتساب',
'What’s the difference between a booth and an empty space?':'ما الفرق بين الجناح والمساحة الفارغة؟','A white booth comes fitted out by us. An empty space is a 3×3 m floor area that you set up yourself, for example with your own booth or a food truck.':'يأتي الجناح الأبيض مجهزًا من طرفنا. أما المساحة الفارغة فهي أرضية بمقاس 3×3 م تجهّزها بنفسك، مثل جناحك الخاص أو عربة طعام.',
'How many spaces can I book?':'كم مساحة يمكنني حجزها؟','Up to three per order. Need more? Message us on WhatsApp and we’ll arrange it.':'حتى ثلاث مساحات في الطلب الواحد. تحتاج أكثر؟ راسلنا عبر واتساب وسنرتب ذلك.',
'What do I need to provide?':'ماذا يلزمني أن أقدّم؟','Your project name, contact details, a logo and at least one product photo.':'اسم مشروعك وبيانات التواصل وشعارك وصورة واحدة على الأقل لمنتجك.',
'Where is the event?':'أين تُقام الفعالية؟','Al Safia Park, Ajman, 27–29 November 2026, from 4 to 11 pm. Parking is available at the park. See the':'حديقة الصفيا، عجمان، 27–29 نوفمبر 2026، من 4 إلى 11 مساءً. المواقف متاحة في الحديقة. اطّلع على','map':'الخريطة','for directions.':'للاتجاهات.',
'How can my company become a sponsor?':'كيف يمكن لشركتي أن تصبح راعيًا؟','Fill in the short form in the':'املأ النموذج القصير في','sponsors section':'قسم الرعاة','and we’ll reply on WhatsApp with options and availability.':'وسنردّ عليك عبر واتساب بالخيارات والتوافر.',
'Ready to show your project?':'هل أنت مستعد لعرض مشروعك؟','Exhibitions and events across the UAE, bringing makers, brands and curious crowds together.':'معارض وفعاليات في أنحاء الإمارات تجمع المبدعين والعلامات التجارية والزوّار الفضوليين.','Explore':'استكشف','Location':'الموقع','Next event':'الفعالية القادمة','View map':'عرض الخريطة','Contact':'تواصل','WhatsApp':'واتساب','Instagram':'إنستغرام','© 2026 AJ District · Ajman, UAE':'© 2026 AJ District · عجمان، الإمارات','Back to top':'العودة إلى الأعلى',
'Back to events':'العودة إلى الفعاليات','Create, print and share a receipt for any exhibitor. Every field is yours to edit, and the ticket updates as you type.':'أنشئ إيصالًا لأي عارض واطبعه وشاركه. كل الحقول قابلة للتعديل، ويتحدّث الإيصال أثناء الكتابة.','Details':'التفاصيل','Preview':'معاينة','Receipt printer':'طابعة الإيصالات','Download PDF':'تنزيل PDF','Share':'مشاركة','View PDF':'عرض PDF','Print on paper':'طباعة','Reprint':'إعادة الطباعة','Reset to sample':'إعادة النموذج','Receipt view':'عرض الإيصال',
'Business name':'اسم النشاط','Client or brand':'العميل أو العلامة','Contact person':'الشخص المسؤول','Date and time':'التاريخ والوقت','Discount amount':'قيمة الخصم','License or ID':'الرخصة أو الهوية','Trade license or ID':'الرخصة التجارية أو الهوية','Payment method':'طريقة الدفع','Receipt number':'رقم الإيصال','Tax registration number':'رقم التسجيل الضريبي','VAT percent':'نسبة الضريبة','Address or line':'العنوان','Extras':'إضافات','Items':'البنود','Note on the receipt':'ملاحظة على الإيصال','Your logo':'شعارك','Upload logo':'رفع الشعار','Use AJ District logo':'استخدام شعار AJ District','Custom item':'بند مخصص','Description':'الوصف','Qty':'الكمية','Unit price':'سعر الوحدة','Email':'البريد الإلكتروني',
'Card':'بطاقة','Bank transfer':'تحويل بنكي','Cash':'نقدًا','Other':'أخرى','Apple Pay':'Apple Pay','Google Pay':'Google Pay',
'Complete your booking':'أكمل حجزك','Card number':'رقم البطاقة','Name on card':'الاسم على البطاقة','Expiry':'تاريخ الانتهاء','Security code':'رمز الأمان','Confirm payment':'تأكيد الدفع','Contacting your bank…':'جارٍ التواصل مع البنك…','Authorising payment':'جارٍ اعتماد الدفع','Demo code: 123456':'الرمز التجريبي: 123456','Your space at Demo Event is confirmed.':'تم تأكيد مساحتك في الفعالية التجريبية.','Demo only. Nothing is charged and card details are never stored.':'للتجربة فقط. لا يتم خصم أي مبلغ ولا تُحفظ بيانات البطاقة.','You’ll confirm on the next step, like on your phone. Demo only.':'ستؤكد في الخطوة التالية كما على هاتفك. للتجربة فقط.','Project or brand name':'اسم المشروع أو العلامة','Check the card number.':'تحقق من رقم البطاقة.','Enter the name on the card.':'أدخل الاسم على البطاقة.','Enter the security code.':'أدخل رمز الأمان.','Expiry date is invalid or past.':'تاريخ الانتهاء غير صالح أو منتهٍ.','Confirm with Face ID':'التأكيد عبر Face ID','Confirm with fingerprint':'التأكيد عبر البصمة',
'Share receipt':'مشاركة الإيصال','See receipt':'عرض الإيصال','Save PDF':'حفظ PDF','Save image':'حفظ الصورة','Copy text':'نسخ النص','More apps':'تطبيقات أخرى','Share PDF file':'مشاركة ملف PDF','PDF':'PDF','Remove':'إزالة',
'Receipt text copied':'تم نسخ نص الإيصال','Copied. Paste it anywhere':'تم النسخ. الصقه في أي مكان','Image saved':'تم حفظ الصورة','Back online':'عدت إلى الاتصال','You’re offline. Showing saved pages.':'أنت غير متصل. تُعرض الصفحات المحفوظة.','AJ District installed':'تم تثبيت AJ District','Update ready. Reopen the app to apply it':'التحديث جاهز. أعد فتح التطبيق لتطبيقه','Tap Share, then Add to Home Screen':'اضغط مشاركة، ثم أضف إلى الشاشة الرئيسية','That didn’t work here':'لم يعمل هذا هنا'
};
Object.assign(AR,{'Back':'السابق','Next':'التالي','Print receipt':'طباعة الإيصال','Ready':'جاهز','Printing':'جارٍ الطباعة','Totals':'الإجماليات'});
const MON={Jan:'يناير',Feb:'فبراير',Mar:'مارس',Apr:'أبريل',May:'مايو',Jun:'يونيو',Jul:'يوليو',Aug:'أغسطس',Sep:'سبتمبر',Oct:'أكتوبر',Nov:'نوفمبر',Dec:'ديسمبر'};
Object.assign(AR,{'Terms':'الشروط'});
const PAT=[
[/AED ([\d,]+)/g,'$1 درهم'],
[/^(\d+(?:–\d+)?) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/,(m,d,mo)=>d+' '+MON[mo]],
[/^Pay with (.+)$/,'الدفع عبر $1'],[/^Pay (.+)$/,'ادفع $1'],
[/^Space (\d+) · (.+)$/,'مساحة $1 · $2'],[/^Space (\d+)$/,'مساحة $1'],[/^Booth (\d+)$/,'جناح $1'],[/^White booth (\d+)$/,'جناح أبيض $1'],[/^Empty space (\d+)$/,'مساحة فارغة $1'],
[/\bRow ([A-Z]+), no\. (\d+)/g,'الصف $1، رقم $2'],[/\bRow ([A-Z]+)/g,'الصف $1'],
[/about (\d+) m from the gate/g,'على بعد نحو $1 م من البوابة'],[/^(\d+) m$/,'$1 م'],
[/(\d+) free\b/g,'$1 متاح'],[/(\d+) held\b/g,'$1 محجوز مؤقتًا'],[/(\d+) booked\b/g,'$1 محجوز'],
[/^(\d+) of 3\b/,'$1 من 3'],[/^1 space$/,'مساحة واحدة'],[/^(\d+) spaces$/,'$1 مساحات'],[/^(\d+) spaces left$/,'بقيت $1 مساحة'],
[/^(.+) removed from your basket$/,'أُزيل $1 من سلتك'],[/^Receipt (.+)$/,'إيصال $1'],
[/^Enter the 6-digit code sent to the phone linked to the card ending (\d+)\.$/,'أدخل الرمز المكوّن من 6 أرقام المرسل إلى الهاتف المرتبط بالبطاقة المنتهية بـ $1.'],
[/^Opening WhatsApp/,'جارٍ فتح واتساب']
];
const SKIP='script,style,#ticket,[data-notr],textarea,input,pre,iframe,.spinb';
const ATTR=['aria-label','title','placeholder','alt'];
let lang='en';const saved=[];const EN_TITLE=document.title;
function tr(s){const k=s.trim();if(!k)return s;let r=AR[k];if(r===undefined){r=k;for(const[a,b]of PAT)r=r.replace(a,b);if(r===k)return s}return s.replace(k,r)}
function fix(n){if(lang!=='ar'||!n.parentElement||n.parentElement.closest(SKIP))return;const t=tr(n.nodeValue);if(t!==n.nodeValue){saved.push([n,n.nodeValue]);n.nodeValue=t}}
function walk(root){if(lang!=='ar')return;if(root.nodeType===3)return fix(root);if(root.nodeType!==1||root.closest&&root.closest(SKIP))return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const a=[];while(w.nextNode())a.push(w.currentNode);a.forEach(fix);
 const els=[...root.querySelectorAll(ATTR.map(x=>'['+x+']').join(','))];if(root.matches&&root.matches(ATTR.map(x=>'['+x+']').join(',')))els.push(root);
 els.forEach(e=>{if(e.closest(SKIP))return;ATTR.forEach(at=>{const v=e.getAttribute(at);if(v&&!e.hasAttribute('data-ox-'+at)){const t=tr(v);if(t!==v){e.setAttribute('data-ox-'+at,v);e.setAttribute(at,t)}}})});
 if(saved.length>3000){const keep=saved.filter(x=>x[0].isConnected);saved.length=0;saved.push(...keep)}}
function restore(){saved.forEach(([n,o])=>{if(n.isConnected)n.nodeValue=o});saved.length=0;
 document.querySelectorAll('[data-ox-aria-label],[data-ox-title],[data-ox-placeholder],[data-ox-alt]').forEach(e=>ATTR.forEach(at=>{if(e.hasAttribute('data-ox-'+at)){e.setAttribute(at,e.getAttribute('data-ox-'+at));e.removeAttribute('data-ox-'+at)}}))}
new MutationObserver(ms=>{if(lang!=='ar')return;ms.forEach(m=>{if(m.type==='characterData')fix(m.target);else m.addedNodes.forEach(walk)})}).observe(document.body,{childList:true,subtree:true,characterData:true});
function setLang(l){lang=l;const h=document.documentElement;h.lang=l;h.dir=l==='ar'?'rtl':'ltr';try{localStorage.setItem('ajl',l)}catch(e){}
 if(l==='ar'){walk(document.body);document.title='AJ District · معارض وفعاليات في الإمارات'}else{restore();document.title=EN_TITLE}
 document.querySelectorAll('[data-lang-toggle]').forEach(b=>{b.textContent=l==='ar'?'English':'العربية';b.lang=l==='ar'?'en':'ar'});
 const sp=document.querySelector('.spinb textPath');if(sp)sp.textContent=l==='ar'?'✦ · ✦ · ✦ · ✦ · ✦ · ✦ · ✦ · ✦ · ✦ · ✦ ·':'Reserve your space · Reserve your space ·';
 const sb=document.querySelector('.spinb');if(sb)sb.setAttribute('aria-label',l==='ar'?'احجز مساحتك':'Reserve a space');
 tkBuild()}
function switchLang(l){const h=document.documentElement;if(h.dataset.ltb)return;
 if(matchMedia('(prefers-reduced-motion:reduce)').matches){setLang(l);return}
 if(document.startViewTransition){h.dataset.ltb='1';const vt=document.startViewTransition(()=>{setLang(l)});vt.finished.finally(()=>{delete h.dataset.ltb});return}
 h.dataset.ltb='1';h.classList.add('lt');setTimeout(()=>{setLang(l);requestAnimationFrame(()=>{h.classList.remove('lt');setTimeout(()=>{delete h.dataset.ltb},340)})},230)}
document.addEventListener('click',e=>{if(e.target.closest('[data-lang-toggle]'))switchLang(lang==='ar'?'en':'ar')});
/* ticker: always drifts, speeds up with scroll, reverses when you scroll back up */
const TR=document.getElementById('tkt'),TK=document.getElementById('tk'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
let dragging=false,els=[],gw=1,x=0,vel=0,dir=1,lastY=scrollY,paused=false,vis=true,lastT=0,run=false,lastTxt='';
function items(){const n=(document.getElementById('left')||{}).textContent||'11';return lang==='ar'?['الحجز مفتوح','بقيت '+n+' مساحة','27–29 نوفمبر','حديقة الصفيا، عجمان','من 4 إلى 11 مساءً']:['Booking open',n+' spaces left','27–29 Nov','Al Safia Park, Ajman','4 to 11 pm']}
let LAM=600,AMP=18,BH=50;
function tkBuild(){if(!TR)return;const it=items();lastTxt=it.join('|');document.getElementById('tksr').textContent=it.join(' · ');
 const units=t=>lang==='ar'?t.split(' ').reverse().map(w=>'<span class="tkw">'+w+'</span>').join('<span class="tkw tks"> </span>'):[...t].map(c=>c===' '?'<span class="tkw tks"> </span>':'<span class="tkw">'+c+'</span>').join('');
 const one=it.map(t=>'<span class="tki" data-notr>'+units(t)+'</span><i aria-hidden="true"></i>').join('');els=[];
 const sv=document.getElementById('tkb');
 if(reduce.matches){TR.innerHTML='<div class="tkg">'+one+'</div>';if(sv)sv.innerHTML='';return}
 const m=innerWidth<600;AMP=m?11:18;BH=m?40:52;LAM=Math.max(340,Math.round(innerWidth/2.3));const H=2*AMP+BH+10;
 TR.parentElement.style.height=H+'px';
 TR.innerHTML='<div class="tkg">'+one+'</div>';const gw0=TR.firstElementChild.getBoundingClientRect().width||600;
 const k=Math.max(1,Math.ceil(innerWidth*1.1/gw0)),g=one.repeat(k);TR.innerHTML='<div class="tkg">'+g+'</div><div class="tkg">'+g+'</div>';
 const w0=TR.firstElementChild.getBoundingClientRect().width,P=Math.ceil(w0/LAM)*LAM;TR.querySelectorAll('.tkg').forEach(q=>q.style.paddingRight=(P-w0)+'px');gw=P;x=0;
 let d='';for(let X=-20;X<=innerWidth+20;X+=8)d+=(d?'L':'M')+X+' '+(H/2+AMP*Math.sin(2*Math.PI*X/LAM)).toFixed(1);
 if(sv)sv.innerHTML='<path d="'+d+'" fill="none" stroke="var(--acc)" stroke-width="'+BH+'" stroke-linejoin="round"/>';
 els=[...TR.querySelectorAll('.tkw,i')].map(e=>[e,e.offsetLeft+e.offsetWidth/2]);start()}
function frame(t){if(!run)return;const dt=Math.min(.05,(t-lastT)/1000||0);lastT=t;
 const d=scrollY-lastY;lastY=scrollY;vel+=(d-vel)*.12;if(Math.abs(vel)>.4)dir+=((vel>0?1:-1)-dir)*.1;
 if(!paused||dragging){if(!dragging){const base=innerWidth<600?26:44;x-=dir*(base+Math.min(Math.abs(vel)*20,700))*dt}while(x<=-gw)x+=gw;while(x>0)x-=gw;TR.style.transform='translate3d('+x+'px,0,0)';
  const kk=2*Math.PI/LAM;for(const[e,o]of els){const px=o+x;if(px<-200||px>innerWidth+200)continue;const a=px*kk;e.style.transform='translateY('+(AMP*Math.sin(a)).toFixed(1)+'px) rotate('+(Math.atan(AMP*kk*Math.cos(a))*57.2958).toFixed(1)+'deg)'}}
 requestAnimationFrame(frame)}
function start(){if(run||reduce.matches||!vis||document.hidden)return;run=true;lastT=performance.now();requestAnimationFrame(frame)}
function stop(){run=false}
if(TK){new IntersectionObserver(es=>{vis=es[0].isIntersecting;vis?start():stop()}).observe(TK);document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 TK.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')paused=true});TK.addEventListener('pointerleave',()=>paused=false);
 TK.addEventListener('touchstart',()=>paused=true,{passive:true});['touchend','touchcancel'].forEach(ev=>TK.addEventListener(ev,()=>setTimeout(()=>paused=false,700),{passive:true}));
 TK.addEventListener('focusin',()=>paused=true);TK.addEventListener('focusout',()=>paused=false);
 {let lx=0,pid=null;
 TK.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button)return;pid=e.pointerId;lx=e.clientX;dragging=true;TK.classList.add('dragging');try{TK.setPointerCapture(pid)}catch(_){}start()});
 TK.addEventListener('pointermove',e=>{if(!dragging||e.pointerId!==pid)return;const dx=e.clientX-lx;lx=e.clientX;x+=dx;if(Math.abs(dx)>0.5)dir=dx<0?1:-1});
 const end=e=>{if(e.pointerId!==pid)return;dragging=false;pid=null;TK.classList.remove('dragging')};
 TK.addEventListener('pointerup',end);TK.addEventListener('pointercancel',end)}
 reduce.addEventListener&&reduce.addEventListener('change',tkBuild);let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(tkBuild,200)});
 const lf=document.getElementById('left');if(lf)new MutationObserver(()=>{if(items().join('|')!==lastTxt)tkBuild()}).observe(lf,{childList:true,characterData:true,subtree:true})}
let init='en';try{init=localStorage.getItem('ajl')||(/^ar/i.test(navigator.language||'')?'ar':'en')}catch(e){}
setLang(init)})();
