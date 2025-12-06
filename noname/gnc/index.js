import { Is } from "./is.js";
class GNC {
  /**
   * @template {GeneratorFunction} T
   * @param {T} fn
   * @returns { (...args: Parameters<T>) => Promise<ReturnType<T>> }
   */
  of(fn) {
    function genCoroutine(...args) {
      let gen = fn.apply(this, args);
      gen.status = "next";
      gen.state = void 0;
      const callback = (resolve, reject) => {
        let result, nexts = resolve, throws = reject;
        try {
          result = gen[gen.status](gen.state);
        } catch (error) {
          reject(error);
          return;
        }
        if (!result.done) {
          nexts = (item) => {
            gen.state = item;
            gen.status = "next";
            callback(resolve, reject);
          };
          throws = (err) => {
            gen.state = err;
            gen.status = "throw";
            callback(resolve, reject);
          };
        }
        result = result.value;
        Promise.resolve(result).then(nexts, throws);
      };
      return new Promise(callback);
    }
    if (!this.is.generatorFunc(fn)) {
      throw new TypeError("gnc.of needs a GeneratorFunction.");
    }
    return genCoroutine;
  }
  is = new Is();
}
let gnc = new GNC();
let setGNC = (instance) => {
  gnc = instance || new GNC();
};
export {
  GNC,
  gnc,
  setGNC
};
