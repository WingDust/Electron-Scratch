/*
 * @Author: your name
 * @Date: 2021-01-31 12:42:30
 * @LastEditTime: 2021-01-31 13:06:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vite-Vue3-Vuex4-electron-TypeScript-tailwindcss\src\main\helper.ts
 */
import { BrowserWindow } from 'electron';


/***
 * Create new BrowserWindow object
 *
 * @param {Electron.BrowserWindowConstructorOptions} options browser window options
 * @param {string[]?} channelsNames list of allowed IPC event names allowed to be sent from IPC Renderer
 */
function createWindow(/*options = {}, channelsNames = []*/):BrowserWindow {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
    //   contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: false,
    //   preload: path.join(appDir, 'preload.js'),
    //   additionalArguments: [
    //     JSON.stringify({ supportedChannels: channelsNames }),
    //   ],
    //   ...(options.webPreferences || {}),
    },
    // ...options,
  });

  return win;
}
export { createWindow}

// module.exports = {
//   createWindow,
// };
