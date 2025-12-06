class FirefoxPromiseErrorHandler {
  /**
   * 在获取报错的时候，我们通过发生报错的`Promise`来进行捕获错误的操作
   *
   * 如果捕获到的错误是`Error`，则能直接通过`Firefox`的特性来获取地址和行列号
   *
   * @param {PromiseRejectionEvent} event
   */
  onHandle(event) {
    event.promise.catch((error) => {
      if (typeof error === "object" && error instanceof Error) {
        if (/Failed to fetch/.test(error.message) || /The media resource indicated by the src attribute or assigned media provider object was not suitable/.test(error.message)) {
          return;
        }
        window.onerror(
          error.message,
          // @ts-expect-error Firefox status
          error.fileName,
          // @ts-expect-error Firefox status
          error.lineNumber,
          // @ts-expect-error Firefox status
          error.columnNumber,
          error
        );
      }
    });
  }
}
export {
  FirefoxPromiseErrorHandler
};
