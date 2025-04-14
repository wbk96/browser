let accessCount = {};

function createLoggedProxy(target, name, parentPath = '') {
  return new Proxy(target, {
    get(target, prop, receiver) {
      const fullPath = parentPath ? `${parentPath}.${prop}` : `${name}.${prop}`;
      accessCount[fullPath] = (accessCount[fullPath] || 0) + 1;
      // 降低循环阈值，快速检测
      if (accessCount[fullPath] > 30) {
        throw new Error(`Infinite loop detected at ${fullPath}: ${accessCount[fullPath]} accesses`);
      }
      console.log(`[Script] Accessing ${fullPath} (prop: ${String(prop)})`);
      
      try {
        const value = Reflect.get(target, prop, target);
        if (fullPath === 'window.setInterval' || fullPath === 'globalThis.setInterval') {
          console.log(`[Script] setInterval value: ${typeof value}`);
        }
        if (value === undefined) {
          console.warn(`[Script] Warning: ${fullPath} is undefined`);
        }
        // 仅代理复杂对象，排除内置构造函数
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof String)) {
          return createLoggedProxy(value, prop.toString(), fullPath);
        }
        return value;
      } catch (e) {
        console.error(`[Script] Error accessing ${fullPath}: ${e.message}`);
        throw e;
      }
    },
    apply(target, thisArg, args) {
      const fullPath = parentPath || name;
      console.log(`[Script] Calling ${fullPath} with args: ${JSON.stringify(args).slice(0, 100)}`);
      try {
        const result = Reflect.apply(target, thisArg, args);
        console.log(`[Script] ${fullPath} returned: ${typeof result}`);
        return result;
      } catch (e) {
        console.error(`[Script] Error calling ${fullPath}: ${e.message}`);
        throw e;
      }
    }
  });
}

module.exports = { createLoggedProxy };