```js
// API minimaliste exposée au renderer si besoin (IPC futur)
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('restoflow', { version: '1.0.0' });
```
