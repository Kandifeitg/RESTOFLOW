```js
});
return await res.json();
}


async function checkPaymentStatus({ apiKey, site_id, transaction_id }){
const res = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ apikey: apiKey, site_id, transaction_id })
});
return await res.json();
}


module.exports = { initPayment, checkPaymentStatus };
```


---


## 5-bis) Backend – `backend/auth.js`
```js
const jwt = require('jsonwebtoken');
const SECRET = 'restoflow-secret-offline'; // à déplacer en env si besoin


function signToken(payload){
return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}


function authMiddleware(req, res, next){
const h = req.headers.authorization || '';
const token = h.startsWith('Bearer ')? h.slice(7) : null;
if (!token) return res.status(401).json({ error: 'Non authentifié' });
try { req.user = jwt.verify(token, SECRET); next(); }
catch(e){ return res.status(401).json({ error: 'Token invalide' }); }
}


function requireRole(roles){
return (req,res,next)=>{
if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Accès refusé' });
next();
};
}


module.exports = { authMiddleware, requireRole, signToken };
```
