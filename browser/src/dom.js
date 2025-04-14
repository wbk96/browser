// HTML 解析和 DOM 树构建

// src/dom.js
const { parse } = require('node-html-parser');
const HTMLElement = require('./environment/htmlelement');

class DOM {
  constructor(html, window) {
    this.window = window;
    this.root = parse(html);
  }

  syncDOM() {
    console.log('[DOM] Syncing DOM');
    const buildNode = (el) => {
      const tagName = el.tagName || 'TEXT';
      if (tagName === 'TEXT') {
        return { nodeType: 3, textContent: el.text };
      }
      const node = new HTMLElement(tagName, this.window);
      node.innerHTML = el.innerHTML;
      node.id = el.getAttribute('id') || '';
      node.className = el.getAttribute('class') || '';
      node.attributes = {};
      for (const [key, value] of Object.entries(el.attributes)) {
        node.attributes[key] = value;
      }
      el.childNodes.forEach(child => {
        const childNode = buildNode(child);
        if (childNode.nodeType !== 3 || childNode.textContent.trim()) {
          node.appendChild(childNode);
        }
      });
      return node;
    };

    const htmlNode = this.root.querySelector('html');
    if (htmlNode) {
      this.window.document.documentElement = buildNode(htmlNode);
      this.window.document.head = this.window.document.documentElement.children.find(n => n.tagName === 'HEAD') || new HTMLElement('HEAD', this.window);
      this.window.document.body = this.window.document.documentElement.children.find(n => n.tagName === 'BODY') || new HTMLElement('BODY', this.window);
      console.log(`[DOM] Synced with ${this.window.document.documentElement.children.length} children`);
    }
  }

  getElementById(id) {
    return this.window.document.getElementById(id);
  }

  querySelector(selector) {
    return this.window.document.querySelector(selector);
  }
}

module.exports = DOM;