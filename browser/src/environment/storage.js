// src/environment/storage.js
class Storage {
  constructor() {
    console.log('[Storage] Initializing storage');
    this._data = new Map();
  }

  // 获取存储的键值对数量
  get length() {
    console.log(`[Storage] Getting length: ${this._data.size}`);
    return this._data.size;
  }

  // 设置键值对
  setItem(key, value) {
    console.log(`[Storage] setItem: ${key}=${value}`);
    this._data.set(String(key), String(value));
    this._dispatchStorageEvent('setItem', key, value);
  }

  // 获取键值对
  getItem(key) {
    console.log(`[Storage] getItem: ${key}`);
    const value = this._data.get(String(key)) || null;
    console.log(`[Storage] getItem result: ${value}`);
    return value;
  }

  // 删除键值对
  removeItem(key) {
    console.log(`[Storage] removeItem: ${key}`);
    const value = this._data.get(String(key));
    this._data.delete(String(key));
    this._dispatchStorageEvent('removeItem', key, value);
  }

  // 清空存储
  clear() {
    console.log('[Storage] clear');
    this._data.clear();
    this._dispatchStorageEvent('clear');
  }

  // 获取指定索引的键名
  key(index) {
    console.log(`[Storage] key: ${index}`);
    const keys = Array.from(this._data.keys());
    const key = keys[index] || null;
    console.log(`[Storage] key result: ${key}`);
    return key;
  }

  // 触发 storage 事件（可选，视需求）
  _dispatchStorageEvent(operation, key, value) {
    if (!this._ownerWindow) return;
    console.log(`[Storage] Dispatching storage event: ${operation}, key=${key}`);
    const event = new (require('./event'))('storage');
    event.key = key;
    event.oldValue = operation === 'setItem' ? this._data.get(String(key)) : value;
    event.newValue = operation === 'setItem' ? value : null;
    event.url = this._ownerWindow.location.href;
    event.storageArea = this;
    this._ownerWindow.dispatchEvent(event);
  }
}

// 防检测
['setItem', 'getItem', 'removeItem', 'clear', 'key'].forEach(method => {
  Object.defineProperty(Storage.prototype[method], 'toString', {
    value: () => `function ${method}() { [native code] }`,
    writable: true,
    configurable: true
  });
});



Object.defineProperties(Storage.prototype, {
  constructor: {
    value: Storage,
    writable: true,
    configurable: true,
    enumerable: false
  },
  toString: {
    value: () => '[object Storage]',
    writable: true,
    configurable: true,
    enumerable: false
  },
  [Symbol.toStringTag]: {
    value: 'Storage',
    writable: true,
    configurable: true,
    enumerable: false
  }
});

// 验证
console.log(`[Storage] setItem defined: ${typeof Storage.prototype.setItem === 'function'}`);
console.log(`[Storage] getItem defined: ${typeof Storage.prototype.getItem === 'function'}`);

module.exports = Storage;