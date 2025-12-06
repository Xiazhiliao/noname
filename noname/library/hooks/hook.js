import * as buildin from "./buildin.js";
class NonameHook extends Array {
  /**
   * @type {Name}
   */
  #name;
  /**
   *
   * @param {Name} name
   */
  constructor(name) {
    super();
    this.#name = name;
    if (name in buildin) {
      for (const item of buildin[name]) {
        this.push(item);
      }
    }
  }
  static get [Symbol.species]() {
    return Array;
  }
  get name() {
    return this.#name;
  }
}
export {
  NonameHook
};
