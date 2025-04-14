// src/jsEngine.js
const vm = require('vm');
const PROXIES = require('./tools/Proxies');

class JSEngine {
  static execute(code, context) {
    console.log(`[JSEngine] Executing script, length: ${code.length}`);
    
    // 创建沙箱
    // const sandbox = {
    //   ...context,
    //   screen: context.window.screen, // 显式添加 screen
    //   globalThis: context.window,
    //   self: context.window
    // };
    const sandbox = Object.create(context.window, {
      ...Object.getOwnPropertyDescriptors(context),
      screen: { value: context.window.screen, writable: true },
      globalThis: { value: context.window, writable: true },
      self: { value: context.window, writable: true },
      window: { value: context.window, writable: true },
      document: { value: context.window.document, writable: true },
      console: { value:context.window.console, writable: true },
      location: { value: context.window.location, writable: true },
      navigator: { value: context.window.navigator, writable: true },
      history: { value: context.window.history, writable: true },
      sessionStorage: { value: context.window.sessionStorage, writable: true },
      localStorage: { value: context.window.localStorage, writable: true },
      Boolean: { value: globalThis.Boolean, writable: true },
      RegExp: { value: globalThis.RegExp, writable: true },
      parseInt: { value: globalThis.parseInt, writable: true },
      decodeURIComponent: { value: globalThis.decodeURIComponent, writable: true },
    });
    
    
    // 验证上下文
    console.log(`[JSEngine] Context document proto is Document.prototype: ${sandbox.document.__proto__ === sandbox.window.Document.prototype}`);
    console.log(`[JSEngine] Document getElementById in sandbox: ${typeof sandbox.document.getElementById === 'function'}`);
    console.log(`[JSEngine] Window addEventListener in sandbox: ${typeof sandbox.window.addEventListener === 'function'}`);
    console.log(`[JSEngine] History pushState in sandbox: ${typeof sandbox.history.pushState === 'function'}`);
    
    try {
      const script = new vm.Script(code, { timeout: 500 });
      vm.createContext(sandbox);
      console.log('[JSEngine] Running script...');
      script.runInContext(sandbox);
      console.log('[JSEngine] Script executed successfully');
    } catch (e) {
      console.error(`[JSEngine] Script error: ${e.message}`);
      throw e;
    }
  }
}

module.exports = JSEngine;