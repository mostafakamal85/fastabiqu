// فاستبقوا — offline app shell. Bump V on every release so phones get the update banner.
var V='fs-2026-11-09d';
var SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
// fetch every file fresh (version in the URL beats GitHub's CDN cache; 'reload' skips the browser cache)
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(SHELL.map(function(u){
  return fetch(u+(u.indexOf('?')>-1?'&':'?')+'v='+V,{cache:'reload'}).then(function(res){if(!res.ok)throw new Error(u);return c.put(u,res)})}))}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('message',function(e){if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  var key=r.mode==='navigate'?'index.html':r;
  e.respondWith(caches.open(V).then(function(c){return c.match(key,{ignoreSearch:true}).then(function(hit){
    return hit||fetch(r).then(function(res){if(res.ok)c.put(r,res.clone());return res})})}));
});
