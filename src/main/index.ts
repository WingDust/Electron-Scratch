/**
 * electron 主文件
 */
import { join } from 'path'
import { app, BrowserWindow,protocol,ipcMain,contentTracing } from 'electron'
import dotenv from 'dotenv'
import {  createServerProcess,sendWindowMessage } from "./lib/ElectronAPI";
import is_dev from 'electron-is-dev'
// const {BaseWindow} = require('sugar-electron')

console.log("Main 进程");

dotenv.config({ path: join(__dirname, '../../.env') })

var win: BrowserWindow | null = null
var serverwin1: BrowserWindow | null = null
var serverwin2: BrowserWindow | null = null

app.on('ready',async ()=>{
  // [Electron doesn't allow windows with webSecurity: true to load files](https://stackoverflow.com/questions/61623156/electron-throws-not-allowed-to-load-local-resource-when-using-showopendialog/61623585#61623585)
  const protocalName = 'safe-file-protocol'
  protocol.registerFileProtocol(protocalName,(request,callback)=>{
    const url = request.url.replace(`${protocalName}:://`,'')
    try {
      return callback(decodeURIComponent(url))
    } catch (error) {
      console.error(error);
    }
  })
})
function createMainWin(win:BrowserWindow|null) {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth:600,
    minHeight:270,
    autoHideMenuBar: true,
    frame:false,
    backgroundColor:'#eee',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule:true,
      // webSecurity:false,
      // allowRunningInsecureContent:true
      // experimentalFeatures:true
    }
  })

  const URL = is_dev
    ? `http://localhost:${process.env.PORT}` // vite 启动的服务器地址
    : `file://${join(__dirname, '../render/dist/index.html')}` // vite 构建后的静态文件地址

  win.loadURL(URL)
  /** 默认打开 devtool */
  win.webContents.openDevTools()
}

// 
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
// app.disableHardwareAcceleration()
app.on('ready',()=>{
  createMainWin(win)
})

// app.whenReady()
// .then(()=>{
//   createMainWin(win)

//   ipcMain.on('min',e=>win!.minimize());
//   ipcMain.on('max',e=>{
//     if (win!.isMaximized()) {
//       win?.unmaximize()
//     }else{
//     win!.maximize()
//     }
//   });
// })
// .then(()=>createMainWin(win,serverwin2))
// .then(()=>createServerProcess(serverwin1,"first"))



/**
 * 监听渲染进程发出的信号触发事件
 */
// ipcMain.on('message-from-renderer', (event, arg) => {
//   sendWindowMessage(serverwin!, 'message-from-main', "woooooooooh")
// })
// ipcMain.on('ready', (event, arg) => {
//   console.info('child process ready')
// })