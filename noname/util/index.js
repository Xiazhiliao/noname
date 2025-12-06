const nonameInitialized = localStorage.getItem("noname_inited");
const assetURL = "";
const GeneratorFunction = (function* () {
}).constructor;
const AsyncFunction = (async function() {
}).constructor;
const AsyncGeneratorFunction = (async function* () {
}).constructor;
const userAgent = navigator.userAgent;
const userAgentLowerCase = userAgent.toLowerCase();
const characterDefaultPicturePath = "image/character/default_silhouette_";
const device = nonameInitialized !== "nodejs" ? userAgentLowerCase.includes("android") ? "android" : userAgentLowerCase.includes("iphone") || userAgentLowerCase.includes("ipad") || userAgentLowerCase.includes("macintosh") ? "ios" : void 0 : void 0;
const androidNewStandardApp = device === "android" && typeof window.NonameAndroidBridge != "undefined";
class Uninstantable {
  constructor() {
    throw new TypeError(`${new.target.name} is not a constructor`);
  }
}
function delay(ms) {
  return new Promise((resolve) => {
    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve();
    }, ms);
  });
}
function freezeButExtensible(record) {
  const descriptors = Object.getOwnPropertyDescriptors(record);
  if (descriptors) {
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if ("value" in descriptor) {
        descriptor.writable = false;
      }
      descriptor.configurable = false;
      Reflect.defineProperty(record, key, descriptor);
    }
  }
  return record;
}
let compatibleEnvironment = true;
function leaveCompatibleEnvironment() {
  compatibleEnvironment = false;
}
function jumpToCatchBlock() {
  throw new Error("");
}
function isClass(func) {
  if (typeof func !== "function") {
    return false;
  }
  const fnStr = Function.prototype.toString.call(func);
  return /^class\s/.test(fnStr);
}
function cast(obj) {
  return (
    /** @type {unknown} */
    obj
  );
}
export {
  AsyncFunction,
  AsyncGeneratorFunction,
  GeneratorFunction,
  Uninstantable,
  androidNewStandardApp,
  assetURL,
  cast,
  characterDefaultPicturePath,
  compatibleEnvironment,
  delay,
  device,
  freezeButExtensible,
  isClass,
  jumpToCatchBlock,
  leaveCompatibleEnvironment,
  nonameInitialized,
  userAgent,
  userAgentLowerCase
};
