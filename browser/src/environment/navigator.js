// src/environment/navigator.js
function Navigator() {
    console.log('[Navigator] Initializing navigator');
  }
  
  // 模拟 Plugin 类
  function Plugin(name, description, filename, mimeTypes) {
    this.name = name;
    this.description = description;
    this.filename = filename;
    this.version = '1.0';
    this.length = mimeTypes.length;
    mimeTypes.forEach((mime, index) => {
      this[index] = mime;
    });
  }
  Plugin.prototype.item = function (index) {
    return this[index] || null;
  };
  Plugin.prototype.namedItem = function (name) {
    return this[name] || null;
  };
  
  // 模拟 MimeType 类
  function MimeType(type, description, suffixes, plugin) {
    this.type = type;
    this.description = description;
    this.suffixes = suffixes;
    this.enabledPlugin = plugin;
  }
  
  // 模拟 PluginArray 类
  function PluginArray() {
    this.length = 0;
    this.item = function (index) {
      return this[index] || null;
    };
    this.namedItem = function (name) {
      return this[name] || null;
    };
    this.refresh = function () {
      console.log('[PluginArray] refresh called');
    };
  }
  
  // 模拟 MimeTypeArray 类
  function MimeTypeArray() {
    this.length = 0;
    this.item = function (index) {
      return this[index] || null;
    };
    this.namedItem = function (name) {
      return this[name] || null;
    };
  }
  
  // 初始化插件和 MIME 类型
  const pluginsData = [
    {
      name: 'Chrome PDF Plugin',
      description: 'Portable Document Format',
      filename: 'internal-pdf-viewer',
      mimeTypes: [
        { type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf' },
        { type: 'text/pdf', description: 'Portable Document Format', suffixes: 'pdf' }
      ]
    },
    {
      name: 'Chrome PDF Viewer',
      description: 'Portable Document Format',
      filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
      mimeTypes: [
        { type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf' }
      ]
    },
    {
      name: 'Native Client',
      description: 'Native Client Executable',
      filename: 'internal-nacl-plugin',
      mimeTypes: [
        { type: 'application/x-nacl', description: 'Native Client Executable', suffixes: '' },
        { type: 'application/x-pnacl', description: 'Portable Native Client Executable', suffixes: '' }
      ]
    }
  ];
  
  const pluginArray = new PluginArray();
  const mimeTypeArray = new MimeTypeArray();
  
  pluginsData.forEach((pluginData, index) => {
    const mimeTypes = pluginData.mimeTypes.map(
      mime => new MimeType(mime.type, mime.description, mime.suffixes, null)
    );
    const plugin = new Plugin(pluginData.name, pluginData.description, pluginData.filename, mimeTypes);
    mimeTypes.forEach(mime => (mime.enabledPlugin = plugin));
    
    pluginArray[index] = plugin;
    pluginArray[pluginData.name] = plugin;
    pluginArray.length++;
    
    mimeTypes.forEach(mime => {
      mimeTypeArray[mime.type] = mime;
      mimeTypeArray[mimeTypeArray.length] = mime;
      mimeTypeArray.length++;
    });
  });
  
  // 定义 Navigator 属性
  Object.defineProperties(Navigator.prototype, {
    userAgent: {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      writable: false
    },
    platform: { value: 'Win32', writable: false },
    language: { value: 'en-US', writable: false },
    languages: { value: ['en-US', 'en'], writable: false },
    vendor: { value: 'Google Inc.', writable: false },
    plugins: { value: pluginArray, writable: false },
    mimeTypes: { value: mimeTypeArray, writable: false },
    webkitPersistentStorage: { value: {}, writable: false },
    hardwareConcurrency: { value: 8, writable: false },
    deviceMemory: { value: 8, writable: false },
    maxTouchPoints: { value: 0, writable: false },
    toString: { value: () => '[object Navigator]', writable: true },
    [Symbol.toStringTag]: { value: 'Navigator', configurable: true }
  });
  
  // 验证插件
  console.log(`[Navigator] Plugins length: ${pluginArray.length}`);
  console.log(`[Navigator] MimeTypes length: ${mimeTypeArray.length}`);
  
  module.exports = Navigator;