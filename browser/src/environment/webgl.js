// src/environment/webgl.js
function WebGLRenderingContext() {
    console.log('[WebGL] Initializing WebGLRenderingContext');
  }
  
  WebGLRenderingContext.prototype.getParameter = function (param) {
    console.log(`[WebGL] getParameter: ${param}`);
    const params = {
      7938: 'WebGL 2.0', // GL_VERSION
      35724: 'WebGL GLSL ES 3.00', // GL_SHADING_LANGUAGE_VERSION
      7936: 'Google Inc.', // GL_VENDOR
      7937: 'ANGLE (Intel, Intel(R) UHD Graphics 630, Direct3D11 vs_5_0 ps_5_0)', // GL_RENDERER
      37446: 'Google SwiftShader' // EXTENSIONS
    };
    return params[param] || null;
  };
  
  WebGLRenderingContext.prototype.getExtension = function (name) {
    console.log(`[WebGL] getExtension: ${name}`);
    const extensions = ['WEBGL_compressed_texture_s3tc', 'WEBGL_debug_renderer_info'];
    return extensions.includes(name) ? {} : null;
  };
  
  function HTMLCanvasElement() {
    console.log('[Canvas] Initializing HTMLCanvasElement');
    this.width = 300;
    this.height = 150;
  }
  
  HTMLCanvasElement.prototype.getContext = function (contextType) {
    console.log(`[Canvas] getContext: ${contextType}`);
    if (contextType === 'webgl' || contextType === 'webgl2') {
      return new WebGLRenderingContext();
    }
    return null;
  };
  
  module.exports = { WebGLRenderingContext, HTMLCanvasElement };