// 主程序


// index.js
const fs = require('fs').promises;
const Browser = require('./src/browser');

async function main() {
  const browser = new Browser();
//   const html = await fs.readFile('./tests/test.html', 'utf-8');
//   await browser.loadHTML(html);

//   // 测试 DOM 属性
//   console.log('Title:', browser.window.document.title);
//   const div = browser.getElementById('myDiv');
//   console.log('Div content:', div ? div.innerHTML : 'Not found');


try {
    // 读取 HTML 文件，设置 DOM 结构
    const html = await fs.readFile('./tests/test.html', 'utf-8');
    console.log('[Index] Setting DOM from HTML');
    browser.window.document.documentElement.innerHTML = html;

    // 读取并执行 JavaScript 文件
    const jsCode = await fs.readFile('./tests/test.js', 'utf-8');
    console.log('[Index] Executing JavaScript file');
    browser.executeJavaScript(jsCode); // 假设 browser.js 已添加 executeJavaScript 方法

    // 测试 DOM 属性
    console.log('Title:', browser.window.document.title);
    const div = browser.getElementById('myDiv');
    console.log('Div content:', div ? enriHTML : 'Not found');
  } catch (error) {
    console.error('[Index] Error:', error);
  }



}

main().catch(console.error);