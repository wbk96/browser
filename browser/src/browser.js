// 框架入口



// src/browser.js
const Window = require('./environment/window');
const DOM = require('./dom');
const JSEngine = require('./jsEngine');
const PROXIES = require('./tools/Proxies');

class Browser {
  constructor() {
    this.window = new Window();
  }

  async loadHTML(html) {
    console.log('[Browser] Loading HTML');
    this.dom = new DOM(html, this.window);
    this.dom.syncDOM();

    // 执行内联脚本
    const scripts = this.dom.root.querySelectorAll('script');
    for (const script of scripts) {
      const code = script.innerHTML;
      if (code) {
        console.log('[Browser] Executing inline script');
        JSEngine.execute(code, this.getContext());
      }
    }
  }

  executeJavaScript(code) {
    console.log('[Browser] Executing JavaScript');
    JSEngine.execute(code, this.getContext());
  }

  getContext() {
    return {
      window: PROXIES.createLoggedProxy(this.window,'globalThis'),
      document: PROXIES.createLoggedProxy(this.window.document, 'document'),
      console: PROXIES.createLoggedProxy(this.window.console, 'console'),
      location: PROXIES.createLoggedProxy(this.window.location, 'location'),
      navigator: PROXIES.createLoggedProxy(this.window.navigator, 'navigator'),
      history: PROXIES.createLoggedProxy(this.window.history, 'history'),
      self: PROXIES.createLoggedProxy(this.window, 'self'),
      sessionStorage: PROXIES.createLoggedProxy(this.window.sessionStorage, 'sessionStorage'),
      localStorage: PROXIES.createLoggedProxy(this.window.localStorage, 'localStorage'),
      globalThis: PROXIES.createLoggedProxy(this.window, 'globalThis'),
    };
  }

  getElementById(id) {
    return this.dom.getElementById(id);
  }

  querySelector(selector) {
    return this.dom.querySelector(selector);
  }
}

module.exports = Browser;