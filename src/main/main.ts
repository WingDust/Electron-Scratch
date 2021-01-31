/*
 * @Author: your name
 * @Date: 2021-01-31 11:45:09
 * @LastEditTime: 2021-01-31 13:53:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vite-Vue3-Vuex4-electron-TypeScript-tailwindcss\src\main\main.ts
 */
import { app,BrowserWindow,protocol,ipcMain } from 'electron';
import { createWindow } from './helper';

// app.commandLine.appendSwitch('--no-sandbox');

// contextMenu({
//   showSearchWithGoogle: false,
//   showCopyImage: false,
//   showInspectElement: enableDevTools,
// });

let mainWindow:BrowserWindow |null ;

function createMainWindow() {
  mainWindow = createWindow();
  mainWindow.once('close', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow!.show();
    mainWindow!.focus();
  });

  if (!app.isPackaged) {
    const port = process.env.PORT || 3000;
    mainWindow.loadURL(`http://localhost:${port}`);
    // do it again as the vite build can take a bit longer the first time
    setTimeout(() => mainWindow!.loadURL(`http://localhost:${port}`), 1500);
  } else {
    mainWindow.loadFile('dist/index.html');
  }
      /** 默认打开 devtool */
    mainWindow.webContents.openDevTools();
}

app.once('ready', async () => {
    // [Electron doesn't allow windows with webSecurity: true to load files](https://stackoverflow.com/questions/61623156/electron-throws-not-allowed-to-load-local-resource-when-using-showopendialog/61623585#61623585)
    const protocalName = 'safe-file-protocol';
    protocol.registerFileProtocol(protocalName, (request, callback) => {
        const url = request.url.replace(`${protocalName}:://`, '');
        try {
            return callback(decodeURIComponent(url));
        }
        catch (error) {
            console.error(error);
        }
    });
});
app.whenReady().then(createMainWindow)

// app.on('activate', () => {
//   if (!mainWindow) {
//     createMainWindow();
//   }
// });
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

ipcMain.on('min',e => mainWindow!.minimize())
ipcMain.on('max',e => {
    if ( mainWindow!.isMaximized()) {
        mainWindow?.unmaximize();
    }
    else {
        mainWindow!.maximize();
    }
})
ipcMain.on('close',e => mainWindow!.close())