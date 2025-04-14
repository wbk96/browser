// src/environment/document.js
const HTMLElement = require('./htmlelement');
const Event = require('./event');
const { HTMLCanvasElement } = require('./webgl');

console.log('[Document] Loading module');

function Document(window) {
  console.log('[Document] Initializing document');
  this.nodeType = 9;
  this.ownerWindow = window;
  this.documentElement = new HTMLElement('HTML', window);
  this.head = new HTMLElement('HEAD', window);
  this.body = new HTMLElement('BODY', window);
  
  console.log(`[Document] documentElement has appendChild: ${typeof this.documentElement.appendChild === 'function'}`);
  this.documentElement.appendChild(this.head);
  this.documentElement.appendChild(this.body);
  
  this._title = '';
  this._eventListeners = {};

  Object.defineProperty(this, 'location', {
    get() { 
      console.log('[Document] Accessing location');
      return window.location; 
    },
    set(value) { 
      console.log(`[Document] Setting location: ${value}`);
      window.location = value; 
    }
  });

  Object.defineProperty(this, 'title', {
    get() {
      console.log('[Document] Getting title');
      const titleElement = this.head.children.find(n => n.tagName === 'TITLE');
      return titleElement ? titleElement.innerHTML : this._title;
    },
    set(value) {
      console.log(`[Document] Setting title: ${value}`);
      this._title = value;
      let titleElement = this.head.children.find(n => n.tagName === 'TITLE');
      if (!titleElement) {
        titleElement = new HTMLElement('TITLE', window);
        this.head.appendChild(titleElement);
      }
      titleElement.innerHTML = value;
    }
  });

  this.URL = window.location && window.location.href ? window.location.href : 'http://localhost';
  this.referrer = '';
}

// DOM 方法
Document.prototype.createElement = function (tagName) {
    console.log(`[Document] createElement: ${tagName}`);
    if (tagName.toLowerCase() === 'canvas') {
      return new HTMLCanvasElement();
    }
    return new HTMLElement(tagName, this.ownerWindow);
  };

Document.prototype.createEvent = function (eventType) {
  console.log(`[Document] createEvent: ${eventType}`);
  return new Event(eventType);
};

Document.prototype.getElementById = function (id) {
  console.log(`[Document] getElementById: ${id}`);
  const search = (node) => {
    if (node.id === id) return node;
    for (const child of node.children || []) {
      const found = search(child);
      if (found) return found;
    }
    return null;
  };
  return search(this.documentElement);
};

Document.prototype.querySelector = function (selector) {
  console.log(`[Document] querySelector: ${selector}`);
  const search = (node) => {
    if (matchesSelector(node, selector)) return node;
    for (const child of node.children || []) {
      const found = search(child);
      if (found) return found;
    }
    return null;
  };
  return search(this.documentElement);
};

Document.prototype.querySelectorAll = function (selector) {
  console.log(`[Document] querySelectorAll: ${selector}`);
  const result = [];
  const search = (node) => {
    if (matchesSelector(node, selector)) result.push(node);
    for (const child of node.children || []) search(child);
  };
  search(this.documentElement);
  return result;
};

Document.prototype.addEventListener = function (event, listener) {
  console.log(`[Document] Adding event listener: ${event}`);
  if (!this._eventListeners[event]) this._eventListeners[event] = [];
  this._eventListeners[event].push(listener);
};

Document.prototype.removeEventListener = function (event, listener) {
  console.log(`[Document] Removing event listener: ${event}`);
  if (this._eventListeners[event]) {
    this._eventListeners[event] = this._eventListeners[event].filter(l => l !== listener);
  }
};

Document.prototype.dispatchEvent = function (event) {
  console.log(`[Document] Dispatching event: ${event.type}`);
  if (this._eventListeners[event.type]) {
    this._eventListeners[event.type].forEach(listener => listener(event));
  }
};

// 简单选择器匹配
function matchesSelector(node, selector) {
  if (selector.startsWith('#')) return node.id === selector.slice(1);
  if (selector.startsWith('.')) return node.classList.contains(selector.slice(1));
  return node.tagName.toLowerCase() === selector.toLowerCase();
};

// 防检测

Object.defineProperty(Document.prototype.getElementById, 'toString', {
    value: () => 'function getElementById() { [native code] }',
    writable: true,
    configurable: true
  });



Object.defineProperties(Document.prototype, {
  constructor: { 
    value: Document, 
    writable: true, 
    configurable: true, 
    enumerable: false 
  },
  toString: { 
    value: () => '[object HTMLDocument]', 
    writable: true, 
    configurable: true, 
    enumerable: false 
  },
  [Symbol.toStringTag]: { 
    value: 'HTMLDocument', 
    writable: true, 
    configurable: true, 
    enumerable: false 
  }
});

// 验证
console.log(`[Document] getElementById defined: ${typeof Document.prototype.getElementById === 'function'}`);
console.log(`[Document] Document is function: ${typeof Document === 'function'}`);

// 命名导出
module.exports = { Document };