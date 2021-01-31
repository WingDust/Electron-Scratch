"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/*
 * @Author: your name
 * @Date: 2021-01-31 11:45:09
 * @LastEditTime: 2021-01-31 13:53:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vite-Vue3-Vuex4-electron-TypeScript-tailwindcss\src\main\main.ts
 */
var electron_1 = require("electron");
var helper_1 = require("./helper");
// app.commandLine.appendSwitch('--no-sandbox');
// contextMenu({
//   showSearchWithGoogle: false,
//   showCopyImage: false,
//   showInspectElement: enableDevTools,
// });
var mainWindow;
function createMainWindow() {
    mainWindow = helper_1.createWindow();
    mainWindow.once('close', function () {
        mainWindow = null;
    });
    mainWindow.once('ready-to-show', function () {
        mainWindow.show();
        mainWindow.focus();
    });
    if (!electron_1.app.isPackaged) {
        var port_1 = process.env.PORT || 3000;
        mainWindow.loadURL("http://localhost:" + port_1);
        // do it again as the vite build can take a bit longer the first time
        setTimeout(function () { return mainWindow.loadURL("http://localhost:" + port_1); }, 1500);
    }
    else {
        mainWindow.loadFile('dist/index.html');
    }
    /** 默认打开 devtool */
    mainWindow.webContents.openDevTools();
}
electron_1.app.once('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var protocalName;
    return __generator(this, function (_a) {
        protocalName = 'safe-file-protocol';
        electron_1.protocol.registerFileProtocol(protocalName, function (request, callback) {
            var url = request.url.replace(protocalName + ":://", '');
            try {
                return callback(decodeURIComponent(url));
            }
            catch (error) {
                console.error(error);
            }
        });
        return [2 /*return*/];
    });
}); });
electron_1.app.whenReady().then(createMainWindow);
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
electron_1.ipcMain.on('min', function (e) { return mainWindow.minimize(); });
electron_1.ipcMain.on('max', function (e) {
    if (mainWindow.isMaximized()) {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.unmaximize();
    }
    else {
        mainWindow.maximize();
    }
});
electron_1.ipcMain.on('close', function (e) { return mainWindow.close(); });
