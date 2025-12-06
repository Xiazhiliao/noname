import { ChromePromiseErrorHandler } from "./chrome.js";
import { FirefoxPromiseErrorHandler } from "./firefox.js";
import { UnknownPromiseErrorHandler } from "./unknown.js";
const promiseErrorHandlerMap = {
  chrome: ChromePromiseErrorHandler,
  firefox: FirefoxPromiseErrorHandler,
  safari: UnknownPromiseErrorHandler,
  other: UnknownPromiseErrorHandler
};
export {
  promiseErrorHandlerMap
};
