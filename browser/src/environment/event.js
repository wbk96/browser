// src/environment/event.js
function Event(type) {
    console.log('[Event] Creating event:', type);
    this.type = type;
    this.bubbles = false;
    this.cancelable = false;
    this.target = null;
    this.currentTarget = null;
    this.defaultPrevented = false;
    this.timeStamp = Date.now();
  }
  
  // 初始化事件
  Event.prototype.initEvent = function (type, bubbles, cancelable) {
    console.log(`[Event] initEvent: ${type}, bubbles=${bubbles}, cancelable=${cancelable}`);
    this.type = type;
    this.bubbles = !!bubbles;
    this.cancelable = !!cancelable;
  };
  
  // 阻止默认行为
  Event.prototype.preventDefault = function () {
    console.log('[Event] preventDefault called');
    if (this.cancelable) {
      this.defaultPrevented = true;
    }
  };
  
  // 防检测
  Object.defineProperty(Event.prototype.initEvent, 'toString', {
    value: () => 'function initEvent() { [native code] }',
    writable: true,
    configurable: true
  });


  Object.defineProperties(Event.prototype, {
    constructor: {
      value: Event,
      writable: true,
      configurable: true,
      enumerable: false
    },
    toString: {
      value: () => '[object Event]',
      writable: true,
      configurable: true,
      enumerable: false
    },
    [Symbol.toStringTag]: {
      value: 'Event',
      writable: true,
      configurable: true,
      enumerable: false
    }
  });
  
  // 验证 initEvent
  console.log(`[Event] initEvent defined: ${typeof Event.prototype.initEvent === 'function'}`);
  
  module.exports = Event;