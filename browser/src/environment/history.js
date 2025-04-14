// src/environment/history.js
function History(window) {
    console.log('[History] Initializing history');
    this.ownerWindow = window;
    this._state = [];
    this._index = -1;
  }
  
  // 添加历史记录
  History.prototype.pushState = function (state, title, url) {
    debugger;
    console.log(`[History] pushState: ${JSON.stringify(state)}, ${title}, ${url}`);
    try {
      const parsedUrl = new URL(url, this.ownerWindow.location.href);
      this._state = this._state.slice(0, this._index + 1); // 截断前进历史
      this._state.push({ state, url: parsedUrl.href });
      this._index++;
      
      // 更新 location
      this.ownerWindow.location.update(parsedUrl.href);
      
      // 触发 popstate 事件
      const event = new (require('./event'))('popstate');
      event.state = state;
      this.ownerWindow.dispatchEvent(event);
    } catch (e) {
      console.error(`[History] Invalid URL: ${url}`);
    }
  };
  
  // 替换当前历史记录
  History.prototype.replaceState = function (state, title, url) {
    console.log(`[History] replaceState: ${JSON.stringify(state)}, ${title}, ${url}`);
    try {
      const parsedUrl = new URL(url, this.ownerWindow.location.href);
      this._state[this._index] = { state, url: parsedUrl.href };
      this.ownerWindow.location.update(parsedUrl.href);
    } catch (e) {
      console.error(`[History] Invalid URL: ${url}`);
    }
  };
  
  // 导航历史
  History.prototype.back = function () {
    console.log('[History] back');
    if (this._index > 0) {
      this._index--;
      this.ownerWindow.location.update(this._state[this._index].url);
      const event = new (require('./event'))('popstate');
      event.state = this._state[this._index].state;
      this.ownerWindow.dispatchEvent(event);
    }
  };
  
  History.prototype.forward = function () {
    console.log('[History] forward');
    if (this._index < this._state.length - 1) {
      this._index++;
      this.ownerWindow.location.update(this._state[this._index].url);
      const event = new (require('./event'))('popstate');
      event.state = this._state[this._index].state;
      this.ownerWindow.dispatchEvent(event);
    }
  };
  
  History.prototype.go = function (delta) {
    console.log(`[History] go: ${delta}`);
    const newIndex = this._index + (delta || 0);
    if (newIndex >= 0 && newIndex < this._state.length) {
      this._index = newIndex;
      this.ownerWindow.location.update(this._state[this._index].url);
      const event = new (require('./event'))('popstate');
      event.state = this._state[this._index].state;
      this.ownerWindow.dispatchEvent(event);
    }
  };
  
  // 属性
  Object.defineProperty(History.prototype, 'state', {
    get() {
      console.log('[History] Getting state');
      return this._index >= 0 ? this._state[this._index].state : null;
    }
  });
  
  Object.defineProperty(History.prototype, 'length', {
    get() {
      console.log('[History] Getting length');
      return this._state.length;
    }
  });
  
  // 防检测

  Object.defineProperty(History.prototype.pushState, 'toString', {
    value: () => 'function pushState() { [native code] }',
    writable: true,
    configurable: true
  });


  Object.defineProperties(History.prototype, {
    constructor: {
      value: History,
      writable: true,
      configurable: true,
      enumerable: false
    },
    toString: {
      value: () => '[object History]',
      writable: true,
      configurable: true,
      enumerable: false
    },
    [Symbol.toStringTag]: {
      value: 'History',
      writable: true,
      configurable: true,
      enumerable: false
    }
  });
  
  // 验证
  console.log(`[History] pushState defined: ${typeof History.prototype.pushState === 'function'}`);
  
  module.exports = History;