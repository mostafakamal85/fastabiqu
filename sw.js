// فاستبقوا — offline app shell. Bump V on every release so phones get the update banner.
var V='fs-2026-11-09g';
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
// push notifications (sent by the server through Firebase as data messages)
self.addEventListener('push',function(e){var d={};
  try{var j=e.data?e.data.json():{};d=j.data||j.notification||j}catch(x){d={body:e.data?e.data.text():''}}
  e.waitUntil(self.registration.showNotification(d.title||'فاستبقوا ⭐',{body:d.body||'',icon:'icon-192.png',dir:'rtl',lang:'ar',
    tag:d.tag||undefined,renotify:!!d.tag,data:{url:d.url||'./'}}).then(function(){
    return self.clients.matchAll({type:'window'}).then(function(cs){cs.forEach(function(c){c.postMessage('push')})})}))});
self.addEventListener('notificationclick',function(e){e.notification.close();
  var u=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(cs){
    for(var i=0;i<cs.length;i++)if('focus' in cs[i])return cs[i].focus();return self.clients.openWindow(u)}))});
