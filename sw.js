const V='aj-v3',SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-384.png','icons/maskable-192.png','icons/maskable-512.png','icons/apple-touch-icon.png','icons/favicon.ico'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||!/^https?:$/.test(u.protocol)||/google\.com\/maps|maps\.google|wa\.me|instagram/.test(r.url))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put('index.html',c));return x}).catch(()=>caches.match('index.html')));return}
 e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))caches.open(V).then(k=>k.put(r,x.clone()));return x}).catch(()=>h);return h||n}))});
