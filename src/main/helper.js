"use strict";
exports.__esModule = true;
exports.createWindow = void 0;
/*
 * @Author: your name
 * @Date: 2021-01-31 12:42:30
 * @LastEditTime: 2021-01-31 13:06:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vite-Vue3-Vuex4-electron-TypeScript-tailwindcss\src\main\helper.ts
 */
var electron_1 = require("electron");
/***
 * Create new BrowserWindow object
 *
 * @param {Electron.BrowserWindowConstructorOptions} options browser window options
 * @param {string[]?} channelsNames list of allowed IPC event names allowed to be sent from IPC Renderer
 */
function createWindow( /*options = {}, channelsNames = []*/) {
    var win = new electron_1.BrowserWindow({
        width: 1920,
        height: 1080,
        autoHideMenuBar: true,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            //   contextIsolation: true,
            nodeIntegration: true,
            enableRemoteModule: false
        }
    });
    return win;
}
exports.createWindow = createWindow;
// module.exports = {
//   createWindow,
// };
