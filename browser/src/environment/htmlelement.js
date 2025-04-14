// src/environment/htmlelement.js
const Element = require('./element');

function HTMLElement(tagName, window) {
  console.log(`[HTMLElement] Creating ${tagName} element`);
  Element.call(this); // 确保调用 Element 构造函数
  this.tagName = tagName.toUpperCase();
  this.nodeName = this.tagName;
  this.innerHTML = '';
  this.id = '';
  this.className = '';
  this.style = {};
  this.attributes = {};

  this.classList = {
    _classes: [],
    add: (...classes) => {
      console.log(`[HTMLElement] classList.add: ${classes}`);
      classes.forEach(cls => {
        if (!this.classList._classes.includes(cls)) this.classList._classes.push(cls);
      });
      this.className = this.classList._classes.join(' ');
    },
    remove: (...classes) => {
      console.log(`[HTMLElement] classList.remove: ${classes}`);
      this.classList._classes = this.classList._classes.filter(cls => !classes.includes(cls));
      this.className = this.classList._classes.join(' ');
    },
    contains: (cls) => this.classList._classes.includes(cls),
    toggle: (cls) => {
      if (this.classList.contains(cls)) {
        this.classList.remove(cls);
      } else {
        this.classList.add(cls);
      }
    }
  };

  this.querySelector = function (selector) {
    console.log(`[HTMLElement] querySelector: ${selector}`);
    const search = (node) => {
      if (matchesSelector(node, selector)) return node;
      for (const child of node.children || []) {
        const found = search(child);
        if (found) return found;
      }
      return null;
    };
    return search(this);
  };

  this.querySelectorAll = function (selector) {
    console.log(`[HTMLElement] querySelectorAll: ${selector}`);
    const result = [];
    const search = (node) => {
      if (matchesSelector(node, selector)) result.push(node);
      for (const child of node.children || []) search(child);
    };
    search(this);
    return result;
  };
}

function matchesSelector(node, selector) {
  if (selector.startsWith('#')) return node.id === selector.slice(1);
  if (selector.startsWith('.')) return node.classList.contains(selector.slice(1));
  return node.tagName.toLowerCase() === selector.toLowerCase();
}

// 原型链和防检测
HTMLElement.prototype = Object.create(Element.prototype);
HTMLElement.prototype.constructor = HTMLElement;

// 仅定义防检测属性
Object.defineProperties(HTMLElement.prototype, {
  toString: {
    value: () => '[object HTMLElement]',
    writable: true,
    configurable: true,
    enumerable: false
  },
  [Symbol.toStringTag]: {
    value: 'HTMLElement',
    writable: true,
    configurable: true,
    enumerable: false
  }
});

// 验证 appendChild
console.log(`[HTMLElement] appendChild available: ${typeof HTMLElement.prototype.appendChild === 'function'}`);

module.exports = HTMLElement;