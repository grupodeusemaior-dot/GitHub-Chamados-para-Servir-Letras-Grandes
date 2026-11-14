const CACHE="chamados-para-servir-v1";
const CORE=["./","./index.html","./style.css","./app.js","./manifest.webmanifest","./logo-chamados-para-servir.png","./icon-192.png","./icon-512.png","./dados/O-profissional-que-Deus-Aprova.json","./dados/como_deus_ensinou.json","./dados/liderar_sem_perder_a_alma.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return response;}).catch(()=>caches.match("./index.html"))));});
