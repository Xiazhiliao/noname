import { userAgentLowerCase } from "../util/index.js";
class GetCompatible {
  /**
   *
   * @param {[majorVersion: number, minorVersion: number, patchVersion: number]} require 需求的版本号
   * @param {[majorVersion: number, minorVersion: number, patchVersion: number]} current 浏览器环境本身的版本号
   * @returns
   */
  checkVersion(require2, current) {
    if (current.length > require2.length) {
      current.length = require2.length;
    }
    let flag = false;
    for (let i = 0; i < current.length; ++i) {
      if (isNaN(current[i])) {
        flag = true;
        continue;
      }
      if (flag) {
        return false;
      }
      if (require2[i] > current[i]) {
        return false;
      }
      if (current[i] > require2[i]) {
        return true;
      }
    }
    return true;
  }
  /**
   * 获取当前内核版本信息
   *
   * 目前仅考虑`chrome`, `firefox`和`safari`三种浏览器的信息，其余均归于其他范畴
   *
   * > 其他后续或许会增加，但`IE`永无可能
   *
   * @returns {["firefox" | "chrome" | "safari" | "other", number, number, number]}
   */
  coreInfo() {
    if (typeof window.process != "undefined" && typeof window.process.versions == "object") {
      if (window.process.versions.chrome) {
        return parseVersion("chrome", window.process.versions.chrome);
      }
    }
    if (typeof navigator.userAgentData != "undefined") {
      const userAgentData = navigator.userAgentData;
      if (userAgentData.brands && userAgentData.brands.length) {
        const brand = userAgentData.brands.find(({ brand: brand2 }) => {
          let str = brand2.toLowerCase();
          return str.includes("chrome") || str.includes("chromium");
        });
        if (brand) {
          return ["chrome", parseInt(brand.version), 0, 0];
        }
      }
    }
    const regex = /(firefox|chrome|safari)\/(\d+(?:\.\d+)+)/;
    let result = userAgentLowerCase.match(regex);
    if (result == null) {
      return ["other", NaN, NaN, NaN];
    }
    if (result[1] !== "safari") {
      return parseVersion(result[1], result[2]);
    }
    if (/macintosh/.test(userAgentLowerCase)) {
      result = userAgentLowerCase.match(/version\/(\d+(?:\.\d+)+).*safari/);
      if (result == null) {
        return ["other", NaN, NaN, NaN];
      }
    } else {
      let safariRegex = /(?:iphone|ipad); cpu (?:iphone )?os (\d+(?:_\d+)+)/;
      result = userAgentLowerCase.match(safariRegex);
      if (result == null) {
        return ["other", NaN, NaN, NaN];
      }
    }
    return parseVersion("safari", result[1]);
    function parseVersion(coreName, versions) {
      const [major, minor, patch] = versions.split(".");
      const majorVersion = parseInt(major);
      if (Number.isNaN(majorVersion)) {
        return [coreName, NaN, NaN, NaN];
      }
      return [coreName, majorVersion, parseInt(minor) || 0, parseInt(patch) || 0];
    }
  }
}
let get = new GetCompatible();
export {
  GetCompatible,
  get
};
