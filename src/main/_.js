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

// function createMainWin(win:BrowserWindow|null,serverwin2:BrowserWindow|null) {
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

// 是否追踪 disposables
const NoneDispose = Object.freeze({ dispose() { } });
// 标记该对象为可追踪 disposable 对象
function markTracked(x) {
    {
        return;
    }
}
function trackDisposable(x) {
    {
        return x;
    }
}

class DisposableStore {
    constructor() {
        // 存储需要 dispose 的对象
        this._toDispose = new Set();
        // 是否已经全部 disaposed （释放） 完成
        this._isDisposed = false;
    }
    // 释放所有 并标记为可追踪
    dispose() {
        if (this._isDisposed) {
            return;
        }
        this._isDisposed = true;
        this.clear();
    }
    // 释放所有 disposes 但并不标记为可追踪
    clear() {
        this._toDispose.forEach(item => item.dispose());
        this._toDispose.clear();
    }
    add(t) {
        if (!t) {
            return t;
        }
        if (t === this) {
            throw new Error('Cannot register a disposable on itself!');
        }
        if (this._isDisposed) {
            console.warn(new Error('Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!').stack);
        }
        else {
            this._toDispose.add(t);
        }
        return t;
    }
}

function combinedDisposable(...disposables) {
    disposables.forEach(markTracked);
    return trackDisposable({ dispose: () => dispose(disposables) });
}
// dispose 抽象类
class Disposable {
    constructor() {
        this._store = new DisposableStore(); // 存储可释放对象
    }
    dispose() {
        this._store.dispose();
    }
    _register(t) {
        if (t === this) {
            throw new Error('Cannot register a disposable on itself!');
        }
        return this._store.add(t);
    }
}
Disposable.None = NoneDispose; // 判断是否为空的 dispose 对象
function dispose(disposables) {
    if (Array.isArray(disposables)) {
        disposables.forEach(d => {
            if (d) {
                d.dispose();
            }
        });
        return [];
    }
    else if (disposables) {
        disposables.dispose();
        return disposables;
    }
    else {
        return undefined;
    }
}

// Avoid circular dependency on EventEmitter by implementing a subset of the interface.
class ErrorHandler {
    constructor() {
        this.listeners = [];
        this.unexpectedErrorHandler = function (e) {
            setTimeout(() => {
                if (e.stack) {
                    throw new Error(`${e.message}\n\n${e.stack}`);
                }
                throw e;
            }, 0);
        };
    }
    addListener(listener) {
        this.listeners.push(listener);
        return () => {
            this._removeListener(listener);
        };
    }
    setUnexpectedErrorHandler(newUnexpectedErrorHandler) {
        this.unexpectedErrorHandler = newUnexpectedErrorHandler;
    }
    getUnexpectedErrorHandler() {
        return this.unexpectedErrorHandler;
    }
    onUnexpectedError(e) {
        this.unexpectedErrorHandler(e);
        this.emit(e);
    }
    // For external errors, we don't want the listeners to be called
    onUnexpectedExternalError(e) {
        this.unexpectedErrorHandler(e);
    }
    emit(e) {
        this.listeners.forEach(listener => {
            listener(e);
        });
    }
    _removeListener(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
}
const errorHandler = new ErrorHandler();
function onUnexpectedError(e) {
    // ignore errors from cancelled promises
    if (!isPromiseCanceledError(e)) {
        errorHandler.onUnexpectedError(e);
    }
    return undefined;
}
const canceledName = 'Canceled';
/**
 * Checks if the given error is a promise in canceled state
 */
function isPromiseCanceledError(error) {
    return (error instanceof Error &&
        error.name === canceledName &&
        error.message === canceledName);
}

const FIN = { done: true, value: undefined };
var Iterator;
(function (Iterator) {
    const _empty = {
        next() {
            return FIN;
        },
    };
    function empty() {
        return _empty;
    }
    Iterator.empty = empty;
    function single(value) {
        let done = false;
        return {
            next() {
                if (done) {
                    return FIN;
                }
                done = true;
                return { done: false, value };
            },
        };
    }
    Iterator.single = single;
    function fromArray(array, index = 0, length = array.length) {
        return {
            next() {
                if (index >= length) {
                    return FIN;
                }
                return { done: false, value: array[index++] };
            },
        };
    }
    Iterator.fromArray = fromArray;
    function from(elements) {
        if (!elements) {
            return empty();
        }
        else if (Array.isArray(elements)) {
            return fromArray(elements);
        }
        else {
            return elements;
        }
    }
    Iterator.from = from;
    function map(iterator, fn) {
        return {
            next() {
                const element = iterator.next();
                if (element.done) {
                    return FIN;
                }
                else {
                    return { done: false, value: fn(element.value) };
                }
            },
        };
    }
    Iterator.map = map;
    function filter(iterator, fn) {
        return {
            next() {
                while (true) {
                    const element = iterator.next();
                    if (element.done) {
                        return FIN;
                    }
                    if (fn(element.value)) {
                        return { done: false, value: element.value };
                    }
                }
            },
        };
    }
    Iterator.filter = filter;
    function forEach(iterator, fn) {
        for (let next = iterator.next(); !next.done; next = iterator.next()) {
            fn(next.value);
        }
    }
    Iterator.forEach = forEach;
    function collect(iterator, atMost = Number.POSITIVE_INFINITY) {
        const result = [];
        if (atMost === 0) {
            return result;
        }
        let i = 0;
        for (let next = iterator.next(); !next.done; next = iterator.next()) {
            result.push(next.value);
            if (++i >= atMost) {
                break;
            }
        }
        return result;
    }
    Iterator.collect = collect;
    function concat(...iterators) {
        let i = 0;
        return {
            next() {
                if (i >= iterators.length) {
                    return FIN;
                }
                const iterator = iterators[i];
                const result = iterator.next();
                if (result.done) {
                    i++;
                    return this.next();
                }
                return result;
            },
        };
    }
    Iterator.concat = concat;
})(Iterator || (Iterator = {}));

class Node {
    constructor(element) {
        this.element = element;
        this.next = Node.Undefined;
        this.prev = Node.Undefined;
    }
}
Node.Undefined = new Node(undefined);
class LinkedList {
    constructor() {
        this._first = Node.Undefined;
        this._last = Node.Undefined;
        this._size = 0;
    }
    get size() {
        return this._size;
    }
    isEmpty() {
        return this._first === Node.Undefined;
    }
    clear() {
        this._first = Node.Undefined;
        this._last = Node.Undefined;
        this._size = 0;
    }
    unshift(element) {
        return this._insert(element, false);
    }
    push(element) {
        return this._insert(element, true);
    }
    shift() {
        if (this._first === Node.Undefined) {
            return undefined;
        }
        else {
            const res = this._first.element;
            this._remove(this._first);
            return res;
        }
    }
    pop() {
        if (this._last === Node.Undefined) {
            return undefined;
        }
        else {
            const res = this._last.element;
            this._remove(this._last);
            return res;
        }
    }
    iterator() {
        let element;
        let node = this._first;
        return {
            next() {
                if (node === Node.Undefined) {
                    return FIN;
                }
                if (!element) {
                    element = { done: false, value: node.element };
                }
                else {
                    element.value = node.element;
                }
                node = node.next;
                return element;
            },
        };
    }
    toArray() {
        const result = [];
        for (let node = this._first; node !== Node.Undefined; node = node.next) {
            result.push(node.element);
        }
        return result;
    }
    _insert(element, atTheEnd) {
        const newNode = new Node(element);
        if (this._first === Node.Undefined) {
            this._first = newNode;
            this._last = newNode;
        }
        else if (atTheEnd) {
            // push
            const oldLast = this._last;
            this._last = newNode;
            newNode.prev = oldLast;
            oldLast.next = newNode;
        }
        else {
            // unshift
            const oldFirst = this._first;
            this._first = newNode;
            newNode.next = oldFirst;
            oldFirst.prev = newNode;
        }
        this._size += 1;
        let didRemove = false;
        return () => {
            if (!didRemove) {
                didRemove = true;
                this._remove(newNode);
            }
        };
    }
    _remove(node) {
        if (node.prev !== Node.Undefined && node.next !== Node.Undefined) {
            // middle
            const anchor = node.prev;
            anchor.next = node.next;
            node.next.prev = anchor;
        }
        else if (node.prev === Node.Undefined && node.next === Node.Undefined) {
            // only node
            this._first = Node.Undefined;
            this._last = Node.Undefined;
        }
        else if (node.next === Node.Undefined) {
            // last
            this._last = this._last.prev;
            this._last.next = Node.Undefined;
        }
        else if (node.prev === Node.Undefined) {
            // first
            this._first = this._first.next;
            this._first.prev = Node.Undefined;
        }
        // done
        this._size -= 1;
    }
}

var Event;
(function (Event) {
    Event.None = () => Disposable.None;
    /**
     * Given an event, returns another event which only fires once.
     */
    function once(event) {
        return (listener, thisArgs = null, disposables) => {
            // we need this, in case the event fires during the listener call
            let didFire = false;
            let result;
            result = event(e => {
                if (didFire) {
                    return;
                }
                else if (result) {
                    result.dispose();
                }
                else {
                    didFire = true;
                }
                // 函数、方法才能call 指定 this 值，e 为传入函数中参数
                return listener.call(thisArgs, e);
            }, null, disposables);
            if (didFire) {
                result.dispose();
            }
            return result;
        };
    }
    Event.once = once;
    /**
     * Given an event and a `map` function, returns another event which maps each element
     * through the mapping function.
     */
    function map(event, map) {
        return snapshot((listener, thisArgs = null, disposables) => event(i => listener.call(thisArgs, map(i)), null, disposables));
    }
    Event.map = map;
    /**
     * Given an event and an `each` function, returns another identical event and calls
     * the `each` function per each element.
     */
    function forEach(event, each) {
        return snapshot((listener, thisArgs = null, disposables) => event(i => { each(i); listener.call(thisArgs, i); }, null, disposables));
    }
    Event.forEach = forEach;
    function filter(event, filter) {
        return snapshot((listener, thisArgs = null, disposables) => event(e => filter(e) && listener.call(thisArgs, e), null, disposables));
    }
    Event.filter = filter;
    /**
     * Given an event, returns the same event but typed as `Event<void>`.
     */
    function signal(event) {
        return event;
    }
    Event.signal = signal;
    function any(...events) {
        return (listener, thisArgs = null, disposables) => combinedDisposable(...events.map(event => event(e => listener.call(thisArgs, e), null, disposables)));
    }
    Event.any = any;
    /**
     * Given an event and a `merge` function, returns another event which maps each element
     * and the cumulative result through the `merge` function. Similar to `map`, but with memory.
     */
    function reduce(event, merge, initial) {
        let output = initial;
        return map(event, e => {
            output = merge(output, e);
            return output;
        });
    }
    Event.reduce = reduce;
    /**
     * Given a chain of event processing functions (filter, map, etc), each
     * function will be invoked per event & per listener. Snapshotting an event
     * chain allows each function to be invoked just once per event.
     */
    function snapshot(event) {
        let listener;
        const emitter = new Emitter({
            onFirstListenerAdd() {
                listener = event(emitter.fire, emitter);
            },
            onLastListenerRemove() {
                listener.dispose();
            }
        });
        return emitter.event;
    }
    Event.snapshot = snapshot;
    function debounce(event, merge, delay = 100, leading = false, leakWarningThreshold) {
        let subscription;
        let output = undefined;
        let handle = undefined;
        let numDebouncedCalls = 0;
        const emitter = new Emitter({
            leakWarningThreshold,
            onFirstListenerAdd() {
                subscription = event(cur => {
                    numDebouncedCalls++;
                    output = merge(output, cur);
                    if (leading && !handle) {
                        emitter.fire(output);
                        output = undefined;
                    }
                    clearTimeout(handle);
                    handle = setTimeout(() => {
                        const _output = output;
                        output = undefined;
                        handle = undefined;
                        if (!leading || numDebouncedCalls > 1) {
                            emitter.fire(_output);
                        }
                        numDebouncedCalls = 0;
                    }, delay);
                });
            },
            onLastListenerRemove() {
                subscription.dispose();
            }
        });
        return emitter.event;
    }
    Event.debounce = debounce;
    /**
     * Given an event, it returns another event which fires only once and as soon as
     * the input event emits. The event data is the number of millis it took for the
     * event to fire.
     */
    function stopwatch(event) {
        const start = new Date().getTime();
        return map(once(event), _ => new Date().getTime() - start);
    }
    Event.stopwatch = stopwatch;
    /**
     * Given an event, it returns another event which fires only when the event
     * element changes.
     */
    function latch(event) {
        let firstCall = true;
        let cache;
        return filter(event, value => {
            const shouldEmit = firstCall || value !== cache;
            firstCall = false;
            cache = value;
            return shouldEmit;
        });
    }
    Event.latch = latch;
    /**
     * Buffers the provided event until a first listener comes
     * along, at which point fire all the events at once and
     * pipe the event from then on.
     *
     * ```typescript
     * const emitter = new Emitter<number>();
     * const event = emitter.event;
     * const bufferedEvent = buffer(event);
     *
     * emitter.fire(1);
     * emitter.fire(2);
     * emitter.fire(3);
     * // nothing...
     *
     * const listener = bufferedEvent(num => console.log(num));
     * // 1, 2, 3
     *
     * emitter.fire(4);
     * // 4
     * ```
     */
    function buffer(event, nextTick = false, _buffer = []) {
        let buffer = _buffer.slice();
        let listener = event(e => {
            if (buffer) {
                buffer.push(e);
            }
            else {
                emitter.fire(e);
            }
        });
        const flush = () => {
            if (buffer) {
                buffer.forEach(e => emitter.fire(e));
            }
            buffer = null;
        };
        const emitter = new Emitter({
            onFirstListenerAdd() {
                if (!listener) {
                    listener = event(e => emitter.fire(e));
                }
            },
            onFirstListenerDidAdd() {
                if (buffer) {
                    if (nextTick) {
                        setTimeout(flush);
                    }
                    else {
                        flush();
                    }
                }
            },
            onLastListenerRemove() {
                if (listener) {
                    listener.dispose();
                }
                listener = null;
            }
        });
        return emitter.event;
    }
    Event.buffer = buffer;
    class ChainableEvent {
        constructor(event) {
            this.event = event;
        }
        map(fn) {
            return new ChainableEvent(map(this.event, fn));
        }
        forEach(fn) {
            return new ChainableEvent(forEach(this.event, fn));
        }
        filter(fn) {
            return new ChainableEvent(filter(this.event, fn));
        }
        reduce(merge, initial) {
            return new ChainableEvent(reduce(this.event, merge, initial));
        }
        latch() {
            return new ChainableEvent(latch(this.event));
        }
        debounce(merge, delay = 100, leading = false, leakWarningThreshold) {
            return new ChainableEvent(debounce(this.event, merge, delay, leading, leakWarningThreshold));
        }
        on(listener, thisArgs, disposables) {
            return this.event(listener, thisArgs, disposables);
        }
        once(listener, thisArgs, disposables) {
            return once(this.event)(listener, thisArgs, disposables);
        }
    }
    function chain(event) {
        return new ChainableEvent(event);
    }
    Event.chain = chain;
    // 将原生 electron 的 已带有监听、通信性质的ipMain ipRenderer...
    //（所以它已经是一个原始的发射器了）转成自己定义的发射器Emitter
    // 并以自己发射器回调实例化时添加事件的监听、监听取消
    /** 返回一个待传入处理回调函数的事件函数
     * @export
     * @template T
     * @param {NodeEventEmitter} emitter
     * @param {string} eventName
     * @param {(...args: any[]) => T} [map=id => id]
     * @return {*}  {Event<T>}
     */
    function fromNodeEventEmitter(emitter, eventName, map = id => id) {
        // map 本身为fromNodeEventEmitter 函数的参数，而这个参数被定义为一个接收任意数量参数，返回泛型约束的类型
        // 而这个 fn 为一个新定义的函数，在事件触发时 map将用来接收并执行 fn 传入来的任意数量参数
        // 所以说是 fn 包装了 map 与 发射器触发函数
        const fn = (...args) => result.fire(map(...args)); // 这个函数
        const onFirstListenerAdd = () => emitter.on(eventName, fn);
        const onLastListenerRemove = () => emitter.removeListener(eventName, fn);
        const result = new Emitter({ onFirstListenerAdd, onLastListenerRemove });
        return result.event;
    }
    Event.fromNodeEventEmitter = fromNodeEventEmitter;
    function fromDOMEventEmitter(emitter, eventName, map = id => id) {
        const fn = (...args) => result.fire(map(...args));
        const onFirstListenerAdd = () => emitter.addEventListener(eventName, fn);
        const onLastListenerRemove = () => emitter.removeEventListener(eventName, fn);
        const result = new Emitter({ onFirstListenerAdd, onLastListenerRemove });
        return result.event;
    }
    Event.fromDOMEventEmitter = fromDOMEventEmitter;
    function fromPromise(promise) {
        const emitter = new Emitter();
        let shouldEmit = false;
        promise
            .then(undefined, () => null)
            .then(() => {
            if (!shouldEmit) {
                setTimeout(() => emitter.fire(undefined), 0);
            }
            else {
                emitter.fire(undefined);
            }
        });
        shouldEmit = true;
        return emitter.event;
    }
    Event.fromPromise = fromPromise;
    function toPromise(event) {
        return new Promise(c => once(event)(c));
    }
    Event.toPromise = toPromise;
})(Event || (Event = {}));
/** 事件发射器的定义，对事件进行触发、监听（监听释放）、
 * @export
 * @class Emitter
 * @template T
 */
class Emitter {
    constructor(options) {
        this._disposed = false; // 是否已经释放
        this._options = options;
        // 如果设置了消息监控，则进行监控提示，否则不提示
        this._leakageMon =
            undefined;
    }
    // 初始化事件函数
    // 1. 注册各种事件监听生命周期回调：第一个监听添加、最后一个监听移除等。
    // 2. 返回事件取消监听函数，本质是从 linkedlist 中 移除对应监听。
    // get 返回值作为
    get event() {
        if (!this._event) { // 如果事件存在
            this._event = (listener, thisArgs, // 指定事件执行对象
            disposables) => {
                if (!this._listeners) { // 由于是类的可选属性所以要判断是否为存在
                    this._listeners = new LinkedList();
                }
                // 判断监听器是否为空
                const firstListener = this._listeners.isEmpty();
                // 第一次监听，提供监听函数回调
                if ( // 当监听器不为空时，且传入了第一次监听器要执行的函数
                firstListener &&
                    this._options &&
                    this._options.onFirstListenerAdd) {
                    this._options.onFirstListenerAdd(this);
                }
                const remove = this._listeners.push(!thisArgs ? listener : [listener, thisArgs]);
                // 第一个事件添加完成后回调
                if (firstListener &&
                    this._options &&
                    this._options.onFirstListenerDidAdd) {
                    this._options.onFirstListenerDidAdd(this);
                }
                // 事件添加完成回调
                if (this._options && this._options.onListenerDidAdd) {
                    this._options.onListenerDidAdd(this, listener, thisArgs);
                }
                let removeMonitor;
                if (this._leakageMon) {
                    removeMonitor = this._leakageMon.check(this._listeners.size);
                }
                // 事件监听后返回结果
                const result = {
                    dispose: () => {
                        if (removeMonitor) {
                            removeMonitor();
                        }
                        result.dispose = Emitter._noop;
                        if (!this._disposed) {
                            remove(); // 移除当前监听事件节点
                            if (this._options && this._options.onLastListenerRemove) {
                                const hasListeners = this._listeners && !this._listeners.isEmpty();
                                if (!hasListeners) {
                                    this._options.onLastListenerRemove(this);
                                }
                            }
                        }
                    }
                };
                if (disposables instanceof DisposableStore) {
                    disposables.add(result);
                }
                else if (Array.isArray(disposables)) {
                    disposables.push(result);
                }
                return result;
            };
        }
        return this._event;
    }
    // 触发事件
    fire(event) {
        if (this._listeners) {
            if (!this._deliveryQueue) {
                this._deliveryQueue = new LinkedList();
            }
            for (let iter = this._listeners.iterator(), e = iter.next(); !e.done; e = iter.next()) {
                // 遍历 _listeners, 将所有的监听和事件对应的参数放一起
                this._deliveryQueue.push([e.value, event]);
            }
            while (this._deliveryQueue.size > 0) {
                const [listener, event] = this._deliveryQueue.shift();
                try {
                    if (typeof listener === 'function') {
                        listener.call(undefined, event);
                    }
                    else {
                        listener[0].call(listener[1], event);
                    }
                }
                catch (e) {
                    onUnexpectedError(e);
                }
            }
        }
    }
    // 解除所有事件监听
    dispose() {
        if (this._listeners) {
            this._listeners.clear();
        }
        if (this._deliveryQueue) {
            this._deliveryQueue.clear();
        }
        if (this._leakageMon) {
            this._leakageMon.dispose();
        }
        this._disposed = true;
    }
}
Emitter._noop = function () { }; // 空操作

/**
 * electron 主文件
 */
const onHello = Event.fromNodeEventEmitter(electron.ipcMain, 'ipc:hello', (e, m) => ({ e, m }));
Event.filter(onHello, (e) => {
    return e.e.frameId === 1;
});
onHello((e) => {
    console.trace(e);
    // console.log(args);
});
electron.ipcMain.on('ipc:hello', (e, args) => {
});
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
