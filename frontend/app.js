```js
// utilitaires front communs
function $(sel){ return document.querySelector(sel); }
function $all(sel){ return document.querySelectorAll(sel); }


function getToken(){ return localStorage.getItem('rf_token'); }
function setToken(t){ localStorage.setItem('rf_token', t); }
function authHeaders(){ const t=getToken(); return t? { 'Authorization': 'Bearer '+t } : {}; }


async function postJSON(url, data){
const r = await fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(data) });
return await r.json();
}
async function getJSON(url){ const r = await fetch(url, { headers: authHeaders() }); return await r.json(); }


function requireAuth(){ if (!getToken()) location.href='login.html'; }
```
js
// utilitaires front communs
function $(sel){ return document.querySelector(sel); }
function $all(sel){ return document.querySelectorAll(sel); }


async function postJSON(url, data){
const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
return await r.json();
}
```
