// src/environment/location.js
function Location(url, window) {
    console.log(`[Location] Initializing with URL: ${url}`);
    this.ownerWindow = window;
    this.href = url;
    this.update(url);
  }
  
  Location.prototype.update = function (url) {
    console.log(`[Location] Updating URL: ${url}`);
    try {
      const parsed = new URL(url, 'http://localhost');
      this.href = parsed.href;
      this.protocol = parsed.protocol;
      this.host = parsed.host;
      this.hostname = parsed.hostname;
      this.port = parsed.port;
      this.pathname = parsed.pathname;
      this.search = parsed.search;
      this.hash = parsed.hash;
      this.origin = parsed.origin;
    } catch (e) {
      console.error(`[Location] Invalid URL: ${url}`);
    }
  };
  
  // 原型链和防检测
  Object.defineProperties(Location.prototype, {
    constructor: { 
      value: Location, 
      writable: true, 
      configurable: true, 
      enumerable: false 
    },
    toString: { 
      value: () => '[object Location]', 
      writable: true, 
      configurable: true, 
      enumerable: false 
    },
    [Symbol.toStringTag]: { 
      value: 'Location', 
      writable: true, 
      configurable: true, 
      enumerable: false 
    }
  });
  
  // 验证 update 方法
  console.log(`[Location] update defined: ${typeof Location.prototype.update === 'function'}`);
  
  module.exports = Location;