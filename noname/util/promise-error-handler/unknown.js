class UnknownPromiseErrorHandler {
  /**
   * 在获取报错的时候，我们通过发生报错的`Promise`来进行捕获错误的操作
   *
   * 如果捕获到的错误是`Error`，则...我们只能暴力的将`Error`再次`throw`出去
   *
   * @param {PromiseRejectionEvent} event
   */
  onHandle(event) {
    event.promise.catch((error) => {
      if (typeof error === "object" && error instanceof Error) {
        if (/Failed to fetch/.test(error.message)) {
          return;
        }
        throw error;
      }
    });
  }
}
export {
  UnknownPromiseErrorHandler
};
