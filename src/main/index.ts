/**
 * electron 主文件
 */
import { join } from 'path'
import { app, BrowserWindow,protocol,ipcMain,contentTracing } from 'electron'
import dotenv from 'dotenv'
import { createMainWin,createServerProcess,sendWindowMessage } from "./lib/ElectronAPI";
// const {BaseWindow} = require('sugar-electron')

import { Event,Emitter } from "../common/utils/base/event";
import { VSBuffer } from 'src/common/utils/base/buffer';
import { serialize } from 'src/common/utils/base/buffer-utils';

function doesNotReturn() {
  console.log('does');
}
// 箭头函数代码中只有一行，可去掉大括号，写成 void [code]
let fn1 = () => void doesNotReturn();
// [箭头函数可以与变量解构](https://es6.ruanyifeng.com/?search=...&x=0&y=0#docs/function)

const fn = (e:any,m:any)=>({e,m})
interface re{
  e:Electron.IpcMainEvent,
  m:any
}
const onHello = Event.fromNodeEventEmitter<re>(ipcMain,'ipc:hello',(e,m)=>({e,m}))
Event.filter(onHello,(e:re)=>{
  return e.e.frameId === 1
})
// onHello 则是包装
onHello((e)=>{ // 参数是事件的处理函数
  console.trace(e.m);
})
// ipcRenderer.send('ipc:hello','hello') 这个事件的触发

//@ts-ignore
doesNotReturn('asdas')







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