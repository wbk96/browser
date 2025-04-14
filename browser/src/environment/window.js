// src/environment/window.js
const { Document } = require('./document');
const Location = require('./location');
const Navigator = require('./navigator');
const History = require('./history');
const Storage = require('./storage');

// 动态加载 node-fetch
let fetch;
(async () => {
  const fetchModule = await import('node-fetch');
  fetch = fetchModule.default;
})();

function Window() {
  console.log('[Window] Initializing window');
  this._eventListeners = {};
  
  this.location = new Location('https://crbt.cdyrjygs.com/music_bag/', this);
  console.log(`[Window] Location initialized: ${this.location.href}`);
  
  this.Document = Document;
  this.document = new Document(this);
  
  this.navigator = new Navigator();
  this.history = new History(this);
  this.console = Object.create(console, {
    log: { value: (...args) => console.log('[Console]', ...args) },
    warn: { value: (...args) => console.warn('[Console]', ...args) },
    error: { value: (...args) => console.error('[Console]', ...args) }
  });
  this.window = this;
  this.self = this;
  this.globalThis = this;

   // 添加 sessionStorage 和 localStorage
   this.sessionStorage = new Storage();
   this.sessionStorage._ownerWindow = this; // 绑定 window 用于事件
   this.localStorage = new Storage();
   this.localStorage._ownerWindow = this;


  // 添加 parent 属性，默认指向自身（模拟顶级窗口）
  this.parent = this;

  // 添加 postMessage 方法
  this.postMessage = (message, targetOrigin, transfer = []) => {
    console.log(`[Window] postMessage called: message=${JSON.stringify(message)}, targetOrigin=${targetOrigin}`);
    // 模拟消息发送行为，可以根据需要扩展
    if (this._eventListeners['message']) {
      const event = new this.document.createEvent('MessageEvent');
      event.initEvent('message', false, false);
      event.data = message;
      event.origin = this.location.origin || 'https://crbt.cdyrjygs.com/music_bag/';
      this._eventListeners['message'].forEach(listener => listener(event));
    }
  };


  // 定义 setTimeout 和 setInterval
  Object.defineProperty(this, 'setTimeout', {
    value: function (fn, delay, ...args) {
      console.log(`[Window] setTimeout called with delay: ${delay}`);
      return setTimeout(() => fn.apply(this, args), delay);
    },
    writable: false,
    configurable: false
  });

  Object.defineProperty(this, 'setInterval', {
    value: function (fn, interval, ...args) {
      console.log(`[Window] setInterval called with interval: ${interval}`);
      return setInterval(() => fn.apply(this, args), interval);
    },
    writable: false,
    configurable: false
  });

  // 模拟浏览器原生函数
  Object.defineProperty(this.setInterval, 'toString', {
    value: () => 'function setInterval() { [native code] }',
    writable: false,
    configurable: false
  });

  this.clearTimeout = clearTimeout;
  this.clearInterval = clearInterval;

  // 添加所有标准内置对象和函数
  const builtins = [
    'Array', 'ArrayBuffer', 'BigInt', 'Boolean', 'Date', 'Error', 'Function',
    'Map', 'Number', 'Object', 'Promise', 'RegExp', 'Set', 'String', 'Symbol',
    'WeakMap', 'WeakSet',
    'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent',
    'parseInt', 'parseFloat', 'Math', 'JSON', 'Proxy', 'Reflect'
  ];
  for (const name of builtins) {
    this[name] = globalThis[name];
  }

  // 确保 String 行为一致
  Object.defineProperty(this.String, 'fromCharCode', {
    value: globalThis.String.fromCharCode,
    writable: false,
    configurable: false
  });
  Object.defineProperty(this.String.prototype, 'toString', {
    value: function () { return String(this); },
    writable: true,
    configurable: true
  });



  this.addEventListener = function (event, listener) {
    console.log(`[Window] Adding event listener: ${event}`);
    if (!this._eventListeners[event]) this._eventListeners[event] = [];
    this._eventListeners[event].push(listener);
  };
  this.removeEventListener = function (event, listener) {
    console.log(`[Window] Removing event listener: ${event}`);
    if (this._eventListeners[event]) {
      this._eventListeners[event] = this._eventListeners[event].filter(l => l !== listener);
    }
  };
  this.dispatchEvent = function (event) {
    console.log(`[Window] Dispatching event: ${event.type}`);
    if (this._eventListeners[event.type]) {
      this._eventListeners[event.type].forEach(listener => listener(event));
    }
  };

  // 添加 fetch
  this.fetch = async (url, options) => {
    console.log(`[Window] fetch: ${url}`);
    if (!fetch) {
      const fetchModule = await import('node-fetch');
      fetch = fetchModule.default;
    }
    return fetch(url, options);
  };

  // 添加 chrome
  this.chrome = {
    runtime: { id: '' },
    webstore: {},
    app: {}
  };

  // 添加 screen
  this.screen = {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040,
    colorDepth: 24,
    pixelDepth: 24,
    orientation: { type: 'landscape-primary', angle: 0 }
  };

  // 添加 requestAnimationFrame
  this.requestAnimationFrame = (callback) => {
    console.log('[Window] requestAnimationFrame called');
    return this.setTimeout(() => callback(performance.now()), 16);
  };
  this.cancelAnimationFrame = (id) => {
    console.log('[Window] cancelAnimationFrame called');
    this.clearTimeout(id);
  };

  // 添加 performance
  this.performance = {
    now: () => {
      console.log('[Window] performance.now called');
      return Date.now();
    },
    timing: {
      navigationStart: Date.now(),
      loadEventEnd: 0
    }
  };
}

Window.prototype.PerformanceObserver = class {
  constructor(callback) {
    console.log('[Window] Creating PerformanceObserver');
    this.callback = callback;
  }
  observe(options) {
    console.log(`[Window] PerformanceObserver.observe: ${JSON.stringify(options)}`);
    this.callback({ getEntries: () => [], getEntriesByType: () => [], getEntriesByName: () => [] });
  }
  disconnect() {
    console.log('[Window] PerformanceObserver.disconnect');
  }
};




// 防检测
Object.defineProperties(Window.prototype, {
  sessionStorage: {
    get() {
      console.log('[Window] Accessing sessionStorage');
      return this._sessionStorage || (this._sessionStorage = new Storage());
    },
    configurable: true
  },
  localStorage: {
    get() {
      console.log('[Window] Accessing localStorage');
      return this._localStorage || (this._localStorage = new Storage());
    },
    configurable: true
  }
});



Object.defineProperties(Window.prototype, {
  constructor: { 
    value: Window, 
    writable: true, 
    configurable: true, 
    enumerable: false 
  },
  toString: { 
    value: () => '[object Window]', 
    writable: true, 
    configurable: true, 
    enumerable: false 
  },
  [Symbol.toStringTag]: { 
    value: 'Window', 
    writable: true, 
    configurable: true, 
    enumerable: false 
  }
});

module.exports = Window;