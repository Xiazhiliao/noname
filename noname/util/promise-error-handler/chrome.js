class ChromePromiseErrorHandler {
  /**
   * ~~用于临时记录报错信息的列表，通过`Error.prepareStackTrace`更新该列表~~
   *
   * 现在用于存储报错过的错误信息
   *
   * @type {Error[]}
   */
  #errorList;
  /**
   * 判断是否是v8错误栈堆用到的正则
   */
  #STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
  /**
   * ~~初始化`Error.prepareStackTrace`，将该值赋值成我们需要的函数~~
   *
   * ~~未防止本来Error.prepareStackTrace便存在赋值的行为，我们将原始值存储，并在需要的函数中调用~~
   *
   * 初始化存储报错信息的列表
   */
  onLoad() {
    this.#errorList = [];
  }
  /**
   * ~~将原来可能的`Error.prepareStackTrace`赋值回去~~
   *
   * @deprecated
   */
  onUnload() {
  }
  /**
   * 在获取报错的时候，我们通过发生报错的`Promise`来进行捕获错误的操作
   *
   * 如果捕获出来的错误存放我们存报错栈堆的列表中，则证明该错误能获取到栈堆，由此来获取报错的地址和行列号
   *
   * @param {PromiseRejectionEvent} event
   */
  onHandle(event) {
    event.promise.catch((error) => {
      if (error instanceof Error) {
        if (/Failed to fetch/.test(error.message) || /Failed to load because no supported source was found/.test(error.message)) {
          return;
        }
        if (this.#errorList.includes(error)) {
          return;
        }
        this.#errorList.push(error);
        if (typeof error.stack === "string" && this.#STACK_REGEXP.test(error.stack)) {
          let lines = error.stack.split("\n").filter((line2) => this.#STACK_REGEXP.test(line2));
          let fileName = void 0;
          let line = void 0;
          let column = void 0;
          for (let currentLine = 0; currentLine < lines.length; ++currentLine) {
            if (/\(eval /.test(lines[currentLine])) {
              continue;
            }
            let formatedLine = lines[currentLine].replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, "");
            const location = formatedLine.match(/ (\(.+\)$)/);
            if (location) {
              formatedLine = formatedLine.replace(location[0], "");
            }
            const locationParts = extractLocation(location ? location[1] : formatedLine);
            fileName = ["eval", "<anonymous>"].includes(locationParts[0]) ? void 0 : locationParts[0];
            line = Number(locationParts[1]);
            column = Number(locationParts[2]);
            break;
          }
          window.onerror(error.message, fileName, line, column, error);
        } else {
          try {
            let [_, src = void 0, line = void 0, column = void 0] = /at\s+.*\s+\((.*):(\d*):(\d*)\)/i.exec(error.stack.split("\n")[1]);
            if (typeof line == "string") {
              line = Number(line);
            }
            if (typeof column == "string") {
              column = Number(column);
            }
            window.onerror(error.message, src, line, column, error);
          } catch (e) {
            window.onerror(error.message, "", 0, 0, error);
          }
        }
      }
    });
  }
}
function extractLocation(urlLike) {
  if (!/:/.test(urlLike)) {
    return [urlLike];
  }
  const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
  const parts = regExp.exec(urlLike.replace(/[()]/g, ""));
  return [parts[1], parts[2] || void 0, parts[3] || void 0];
}
export {
  ChromePromiseErrorHandler,
  extractLocation
};
