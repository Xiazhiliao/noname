import ts from "../_virtual/typescript.js";
import { version, registerTS, parse as parse$2, compileScript, rewriteDefault, compileTemplate, compileStyle } from "../node_modules/.pnpm/@vue_compiler-sfc@3.5.24/node_modules/@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js";
import dedent from "../node_modules/.pnpm/dedent@1.7.0/node_modules/dedent/dist/dedent.js";
import { compile } from "./ts-compiler.js";
console.log(`ts loaded`, ts.version);
console.log(`sfc loaded`, version);
registerTS(() => ts);
function getResponse(data, type = "text/javascript") {
  return new Response(new Blob([data], { type }), {
    status: 200,
    statusText: "OK",
    headers: new Headers({
      "Content-Type": type
    })
  });
}
class CompileStrategy {
  // 默认行为：请求源文件，再走 transform
  async process(ctx) {
    const response = await fetch(ctx.request.url.replace(/\?.*/, ""), {
      method: ctx.request.method,
      // mode: "no-cors",
      headers: new Headers({ "Content-Type": "text/plain" })
    });
    if (!response.ok) return response;
    const text = await response.text();
    try {
      console.log("正在编译", decodeURI(ctx.request.url));
      const result = this.transform(ctx, text);
      console.log(decodeURI(ctx.request.url), "编译成功");
      return result;
    } catch (e) {
      console.error(decodeURI(ctx.request.url), "编译失败: ", e);
      return Response.error();
    }
  }
}
class RawResourceStrategy extends CompileStrategy {
  match(ctx) {
    return ctx.url.searchParams.has("raw");
  }
  async transform(ctx, text) {
    return getResponse(`export default ${text}`);
  }
}
class WorkerResourceStrategy extends CompileStrategy {
  match(ctx) {
    return ctx.url.searchParams.has("worker") || ctx.url.searchParams.has("sharedworker");
  }
  async transform(ctx, text) {
    return getResponse(dedent`
			const url = new URL(import.meta.url);
			url.searchParams.delete("worker");
			url.searchParams.delete("SharedWorker");
			export default class extends ${ctx.url.searchParams.has("worker") ? "Worker" : "SharedWorker"} {
				constructor() {
					super(url.toString(), { type: url.searchParams.has("module") ? "module" : "classic" });
				}
			};
		`);
  }
}
class UrlResourceStrategy extends CompileStrategy {
  match(ctx) {
    return ctx.url.searchParams.has("url");
  }
  async transform(ctx, text) {
    return getResponse(`
			const url = new URL(import.meta.url);
			url.searchParams.delete("url");
			export default url.toString();
		`);
  }
}
class JSONStrategy extends CompileStrategy {
  match(ctx) {
    return ctx.url.pathname.endsWith(".json") && !!ctx.request.headers.get("origin");
  }
  async transform(ctx, text) {
    if (ctx.request.headers.get("accept")?.includes("application/json")) {
      return getResponse(text, "application/json");
    }
    return getResponse(`export default ${text}`);
  }
}
class TSStrategy extends CompileStrategy {
  allowJs = false;
  constructor({ allowJs = false }) {
    super();
    this.allowJs = allowJs;
  }
  match(ctx) {
    if (this.allowJs && ctx.url.pathname.endsWith(".js")) return true;
    if (!ctx.url.pathname.endsWith(".ts")) return false;
    if (ctx.url.pathname.endsWith(".d.ts")) return false;
    if (ctx.request.headers.get("accept")?.includes("video/mp2t")) return false;
    return true;
  }
  async transform(ctx, text) {
    return getResponse(await compile(text, ctx.request.url));
  }
}
class CSSStrategy extends CompileStrategy {
  match(ctx) {
    return ctx.url.pathname.endsWith(".css") && !!ctx.request.headers.get("origin");
  }
  async transform(ctx, text) {
    if (ctx.request.headers.get("accept")?.includes("text/css")) {
      return getResponse(text, "text/css");
    } else {
      const id = Date.now().toString();
      const scopeId = `data-v-${id}`;
      return getResponse(dedent`
				const style = document.createElement('style');
				style.setAttribute('type', 'text/css');
				style.setAttribute('data-vue-dev-id', \`${scopeId}\`);
				style.textContent = ${JSON.stringify(text)};
				document.head.appendChild(style);
			`);
    }
  }
}
class VueSFCStrategy extends CompileStrategy {
  cache = /* @__PURE__ */ new Map();
  match(ctx) {
    return ctx.url.pathname.endsWith(".vue");
  }
  async process(ctx) {
    if (this.cache.has(ctx.request.url)) {
      return getResponse(this.cache.get(ctx.request.url));
    }
    return super.process(ctx);
  }
  async transform(ctx, text) {
    const id = Date.now().toString();
    const { descriptor } = parse$2(text, { filename: ctx.request.url, sourceMap: true });
    const url = new URL(ctx.request.url);
    return getResponse(
      [
        ...await this.compileScript(url, descriptor, id),
        ...this.compileTemplate(url, descriptor, id),
        ...this.compileStyle(url, descriptor, id)
      ].join("\n")
    );
  }
  async compileScript(url, descriptor, id) {
    const scopeId = `data-v-${id}`;
    const hasScoped = descriptor.styles.some((s) => s.scoped);
    const script = compileScript(descriptor, {
      id: scopeId,
      inlineTemplate: true,
      templateOptions: {
        scoped: hasScoped,
        compilerOptions: {
          scopeId: hasScoped ? scopeId : void 0
        }
      }
    });
    const scriptSearchParams = new URLSearchParams(url.search.slice(1));
    scriptSearchParams.append("type", "script");
    this.cache.set(
      `${url.origin}${url.pathname}?${scriptSearchParams.toString()}`,
      // 重写 default
      rewriteDefault(
        script.attrs && await compile(script.content, `${url.origin}${url.pathname}?${scriptSearchParams.toString()}`),
        "__sfc_main__"
      ).replace(`const __sfc_main__`, `export const __sfc_main__`)
    );
    return [
      `import { __sfc_main__ } from '${url.origin + url.pathname + "?" + scriptSearchParams.toString()}'`,
      `__sfc_main__.__scopeId = '${scopeId}'`
    ];
  }
  compileTemplate(url, descriptor, id) {
    const scopeId = `data-v-${id}`;
    const hasScoped = descriptor.styles.some((s) => s.scoped);
    const templateSearchParams = new URLSearchParams(url.search.slice(1));
    templateSearchParams.append("type", "template");
    this.cache.set(
      `${url.origin}${url.pathname}?${templateSearchParams.toString()}`,
      // 编译模板，转换成 render 函数
      compileTemplate({
        source: descriptor.template ? descriptor.template.content : "",
        filename: url.href,
        // 用于错误提示
        id: scopeId,
        scoped: hasScoped,
        compilerOptions: {
          scopeId: hasScoped ? scopeId : void 0
        }
      }).code
      // .replace(`function render(_ctx, _cache) {`, str => str + 'console.log(_ctx);')
    );
    return [
      `import { render } from '${url.origin + url.pathname + "?" + templateSearchParams.toString()}'`,
      `__sfc_main__.render = render;`,
      `export default __sfc_main__;`
    ];
  }
  compileStyle(url, descriptor, id) {
    let styleIndex = 0;
    const result = [];
    for (const styleBlock of descriptor.styles) {
      const styleCode = compileStyle({
        source: styleBlock.content,
        id,
        filename: url.href,
        scoped: styleBlock.scoped
      });
      const varName = `el${styleIndex}`;
      const styleDOM = `let ${varName} = document.createElement('style');
${varName}.innerHTML =  \`${styleCode.code}\`;
document.body.append(${varName});`;
      result.push(styleDOM);
    }
    return result;
  }
}
export {
  CSSStrategy,
  JSONStrategy,
  RawResourceStrategy,
  TSStrategy,
  UrlResourceStrategy,
  VueSFCStrategy,
  WorkerResourceStrategy
};
