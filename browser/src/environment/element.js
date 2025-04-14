// src/environment/element.js
function Element() {
    console.log('[Element] Initializing element');
    this.children = [];
    this._eventListeners = {};
  }
  
  Element.prototype.appendChild = function (node) {
    console.log(`[Element] appendChild: ${node.tagName || node.nodeType}`);
    this.children.push(node);
    node.parentNode = this;
    return node;
  };
  
  Element.prototype.addEventListener = function (event, listener) {
    console.log(`[Element] Adding event listener: ${event}`);
    if (!this._eventListeners[event]) this._eventListeners[event] = [];
    this._eventListeners[event].push(listener);
  };
  
  Element.prototype.removeEventListener = function (event, listener) {
    console.log(`[Element] Removing event listener: ${event}`);
    if (this._eventListeners[event]) {
      this._eventListeners[event] = this._eventListeners[event].filter(l => l !== listener);
    }
  };
  
  Element.prototype.dispatchEvent = function (event) {
    console.log(`[Element] Dispatching event: ${event.type}`);
    if (this._eventListeners[event.type]) {
      this._eventListeners[event.type].forEach(listener => listener(event));
    }
  };
  
  // 原型链和防检测
  Element.prototype = Object.create(Object.prototype, {
    constructor: { 
      value: Element, 
      writable: true, 
      configurable: true, 
      enumerable: false 
    },
    toString: { 
      value: () => '[object Element]', 
      writable: true, 
      configurable: true, 
      enumerable: false 
    },
    [Symbol.toStringTag]: { 
      value: 'Element', 
      writable: true, 
      configurable: true, 
      enumerable: false 
    }
  });
  
  // 移动 appendChild 等方法到原型定义之后
  Element.prototype.appendChild = Element.prototype.appendChild || function (node) {
    console.log(`[Element] appendChild: ${node.tagName || node.nodeType}`);
    this.children.push(node);
    node.parentNode = this;
    return node;
  };
  
  Element.prototype.addEventListener = Element.prototype.addEventListener || function (event, listener) {
    console.log(`[Element] Adding event listener: ${event}`);
    if (!this._eventListeners[event]) this._eventListeners[event] = [];
    this._eventListeners[event].push(listener);
  };
  
  Element.prototype.removeEventListener = Element.prototype.removeEventListener || function (event, listener) {
    console.log(`[Element] Removing event listener: ${event}`);
    if (this._eventListeners[event]) {
      this._eventListeners[event] = this._eventListeners[event].filter(l => l !== listener);
    }
  };
  
  Element.prototype.dispatchEvent = Element.prototype.dispatchEvent || function (event) {
    console.log(`[Element] Dispatching event: ${event.type}`);
    if (this._eventListeners[event.type]) {
      this._eventListeners[event.type].forEach(listener => listener(event));
    }
  };
  
  // 验证 appendChild
  console.log(`[Element] appendChild defined: ${typeof Element.prototype.appendChild === 'function'}`);
  
  module.exports = Element;