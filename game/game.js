"use strict"
			
const im = document.createElement("script");
im.type = "importmap";
im.textContent = `{
  "imports": {
    "noname": "/noname.js",
    "vue": "/node_modules/.pnpm/vue@3.5.24_typescript@5.9.3/node_modules/vue/dist/vue.esm-browser.js",
    "pinyin-pro": "/node_modules/.pnpm/pinyin-pro@3.27.0/node_modules/pinyin-pro/dist/index.js",
    "dedent": "/node_modules/.pnpm/dedent@1.7.0/node_modules/dedent/dist/dedent.js"
  }
}`;
document.currentScript.after(im);

const script = document.createElement("script");
script.type = "module";
script.src = "/noname/entry.js";
document.head.appendChild(script);
