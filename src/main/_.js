'use strict';

var path = require('path');
var electron = require('electron');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var electron__default = /*#__PURE__*/_interopDefaultLegacy(electron);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

/* @flow */

/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/




function log (message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`);
}

const NEWLINE = '\n';
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\n|\r|\r\n/;

// Parses src into an Object
function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug);
  const obj = {};

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL);
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1];
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '');
      const end = val.length - 1;
      const isDoubleQuoted = val[0] === '"' && val[end] === '"';
      const isSingleQuoted = val[0] === "'" && val[end] === "'";

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end);

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE);
        }
      } else {
        // remove surrounding whitespace
        val = val.trim();
      }

      obj[key] = val;
    } else if (debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
    }
  });

  return obj
}

// Populates process.env from .env file
function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
  let dotenvPath = path__default['default'].resolve(process.cwd(), '.env');
  let encoding /*: string */ = 'utf8';
  let debug = false;

  if (options) {
    if (options.path != null) {
      dotenvPath = options.path;
    }
    if (options.encoding != null) {
      encoding = options.encoding;
    }
    if (options.debug != null) {
      debug = true;
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs__default['default'].readFileSync(dotenvPath, { encoding }), { debug });

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key];
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`);
      }
    });

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

var config_1 = config;
var parse_1 = parse;

var main = {
	config: config_1,
	parse: parse_1
};

if (typeof electron__default['default'] === 'string') {
	throw new TypeError('Not running in an Electron environment!');
}

const app = electron__default['default'].app || electron__default['default'].remote.app;

const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

var electronIsDev = isEnvSet ? getFromEnv : !app.isPackaged;

/**
 * electron 主文件
 */
// const {BaseWindow} = require('sugar-electron')
console.log("Main 进程");
main.config({ path: path.join(__dirname, '../../.env') });
var win = null;
electron.app.on('ready', async () => {
    // [Electron doesn't allow windows with webSecurity: true to load files](https://stackoverflow.com/questions/61623156/electron-throws-not-allowed-to-load-local-resource-when-using-showopendialog/61623585#61623585)
    const protocalName = 'safe-file-protocol';
    electron.protocol.registerFileProtocol(protocalName, (request, callback) => {
        const url = request.url.replace(`${protocalName}:://`, '');
        try {
            return callback(decodeURIComponent(url));
        }
        catch (error) {
            console.error(error);
        }
    });
});
function createMainWin(win) {
    // 创建浏览器窗口
    win = new electron.BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 600,
        minHeight: 270,
        autoHideMenuBar: true,
        frame: false,
        backgroundColor: '#eee',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });
    const URL = electronIsDev
        ? `http://localhost:${process.env.PORT}` // vite 启动的服务器地址
        : `file://${path.join(__dirname, '../render/dist/index.html')}`; // vite 构建后的静态文件地址
    win.loadURL(URL);
    /** 默认打开 devtool */
    win.webContents.openDevTools();
}
// 
electron.app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
// app.disableHardwareAcceleration()
electron.app.on('ready', () => {
    createMainWin(win);
});
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
//# sourceMappingURL=_.js.map
