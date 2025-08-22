```js
const { app, BrowserWindow } = require('electron');
const path = require('path');


// Démarre l'API locale (Express)
require(path.join(__dirname, 'backend', 'server'));


function createWindow() {
const win = new BrowserWindow({
width: 1280,
height: 800,
backgroundColor: '#FFFFFF',
icon: path.join(__dirname, 'assets', 'restoflow.png'),
webPreferences: {
preload: path.join(__dirname, 'preload.js'),
contextIsolation: true,
nodeIntegration: false
}
});


win.loadURL('http://localhost:4578/index.html');
// win.webContents.openDevTools(); // décommenter en dev
}


app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
```

