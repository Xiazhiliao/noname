import * as buildin from "./buildin.js";
class NonameAssembly extends Array {
  /**
   * @type {Name}
   */
  #name;
  /**
   * @type {Map<keyof AssemblyType[Name], number>}
   */
  #record;
  /**
   *
   * @param {Name} name
   */
  constructor(name) {
    super();
    this.#name = name;
    this.#record = /* @__PURE__ */ new Map();
    if (name in buildin) {
      for (const [key, item] of Object.entries(buildin[name])) {
        this.add(key, item);
      }
    }
  }
  static get [Symbol.species]() {
    return Array;
  }
  get name() {
    return this.#name;
  }
  /**
   *
   * @param {keyof AssemblyType[Name]} name
   * @param {AssemblyType[Name][keyof AssemblyType[Name]]} content
   * @override
   */
  // @ts-expect-error ignore
  add(name, content) {
    if (!content) {
      content = name;
      name = content.name;
    }
    if (typeof content !== "function") {
      throw new Error("you can't add a non-function to assembly.");
    }
    if (typeof name !== "string" || name.length === 0) {
      if (!this.includes(content)) {
        Array.prototype.push.call(this, content);
      }
    } else if (!this.has(name)) {
      this.#record.set(name, this.length);
      Array.prototype.push.call(this, content);
    }
    return this;
  }
  /**
   *
   * @param {keyof AssemblyType[Name]} name
   * @param {AssemblyType[Name][keyof AssemblyType[Name]]} content
   * @override
   */
  // @ts-expect-error ignore
  push(name, content) {
    return this.add(name, content).length;
  }
  /**
   *
   * @param {keyof AssemblyType[Name]} name
   */
  has(name) {
    return this.#record.has(name);
  }
  /**
   *
   * @param {keyof AssemblyType[Name]} name
   * @returns {AssemblyType[Name][keyof AssemblyType[Name]] | undefined}
   */
  get(name) {
    if (!this.has(name)) {
      return void 0;
    }
    return this[this.#record.get(name)];
  }
  /**
   *
   * @param {keyof AssemblyType[Name]} name
   * @param {AssemblyType[Name][keyof AssemblyType[Name]]} content
   */
  update(name, content) {
    if (!this.has(name)) {
      return false;
    }
    try {
      this[this.#record.get(name)] = content;
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }
}
const defaultHookcompatition = {
  checkBegin: new NonameAssembly("checkBegin"),
  checkCard: new NonameAssembly("checkCard"),
  checkTarget: new NonameAssembly("checkTarget"),
  checkButton: new NonameAssembly("checkButton"),
  checkEnd: new NonameAssembly("checkEnd"),
  uncheckBegin: new NonameAssembly("uncheckBegin"),
  uncheckCard: new NonameAssembly("uncheckCard"),
  uncheckTarget: new NonameAssembly("uncheckTarget"),
  uncheckButton: new NonameAssembly("uncheckButton"),
  uncheckEnd: new NonameAssembly("uncheckEnd"),
  checkOverflow: new NonameAssembly("checkOverflow"),
  checkTipBottom: new NonameAssembly("checkTipBottom"),
  checkDamage1: new NonameAssembly("checkDamage1"),
  checkDamage2: new NonameAssembly("checkDamage2"),
  checkDamage3: new NonameAssembly("checkDamage3"),
  checkDamage4: new NonameAssembly("checkDamage4"),
  checkDie: new NonameAssembly("checkDie"),
  checkUpdate: new NonameAssembly("checkUpdate"),
  checkSkillAnimate: new NonameAssembly("checkSkillAnimate"),
  addSkillCheck: new NonameAssembly("addSkillCheck"),
  removeSkillCheck: new NonameAssembly("removeSkillCheck"),
  refreshSkin: new NonameAssembly("refreshSkin")
};
const defaultAssemblys = {
  ...defaultHookcompatition
};
export {
  NonameAssembly,
  defaultAssemblys,
  defaultHookcompatition
};
