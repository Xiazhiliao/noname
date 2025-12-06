import { getDefaultExportFromCjs } from "./_commonjsHelpers.js";
import { __require as requireTypescript } from "../node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/typescript.js";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var typescriptExports = requireTypescript();
const ts = /* @__PURE__ */ getDefaultExportFromCjs(typescriptExports);
const typescript = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: ts
}, [typescriptExports]);
export {
  ts as default,
  typescript as t
};
