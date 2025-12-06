class Channel {
  /**
   * @template U
   * @typedef {(value?: U | PromiseLike<U>) => void} PromiseResolve
   */
  constructor() {
    this.status = "active";
    this._buffer = null;
  }
  /**
   * 向该频道发送消息，在消息未被接受前将等待
   *
   * @param {T} value - 要发送的消息
   * @returns {Promise<void>}
   */
  send(value) {
    return new Promise((resolve, reject) => {
      switch (this.status) {
        case "sending":
          reject(new Error());
          break;
        case "receiving": {
          const buffer = this._buffer;
          this._buffer = null;
          buffer(value);
          this.status = "active";
          resolve();
          break;
        }
        case "active":
          this.status = "sending";
          this._buffer = [value, resolve];
          break;
      }
    });
  }
  /**
   * 接收频道所发送的消息，若无消息发送则等待
   *
   * @returns {Promise<T>} 接收到的消息
   */
  receive() {
    return new Promise((resolve, reject) => {
      switch (this.status) {
        case "receiving":
          reject(new Error());
          break;
        case "sending": {
          const buffer = this._buffer;
          this._buffer = null;
          resolve(buffer[0]);
          this.status = "active";
          buffer[1]();
          break;
        }
        case "active":
          this.status = "receiving";
          this._buffer = resolve;
          break;
      }
    });
  }
}
export {
  Channel
};
