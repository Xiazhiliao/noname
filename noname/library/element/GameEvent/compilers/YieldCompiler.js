import "../../../../../noname.js";
import { GameEvent } from "../../gameEvent.js";
import { GeneratorFunction } from "../../../../util/index.js";
import compiler from "./ContentCompiler.js";
import ContentCompilerBase from "./ContentCompilerBase.js";
import { ai } from "../../../../ai/index.js";
import { get } from "../../../../get/index.js";
import { ui } from "../../../../ui/index.js";
import { game } from "../../../../game/index.js";
import { lib } from "../../../index.js";
import { _status } from "../../../../status/index.js";
class YieldCompiler extends ContentCompilerBase {
  type = "yield";
  static #mapArgs(event) {
    const { step, source, target, targets, card, cards, skill, forced, num, _result, _trigger, player } = event;
    return {
      event,
      step,
      source,
      player,
      target,
      targets,
      card,
      cards,
      skill,
      forced,
      num,
      trigger: _trigger,
      result: _result,
      _status,
      lib,
      game,
      ui,
      get,
      ai
    };
  }
  filter(content) {
    return typeof content === "function" && content instanceof GeneratorFunction;
  }
  compile(content) {
    const compiler$1 = this;
    const middleware = async function(event) {
      const args = YieldCompiler.#mapArgs(event);
      const generator = (
        // @ts-expect-error ignore
        Reflect.apply(content, this, [event, args])
      );
      let result = null;
      let done = false;
      while (!done) {
        let value = null;
        if (!compiler$1.isPrevented(event)) {
          ({ value, done = true } = generator.next(result));
          if (done) {
            break;
          }
          result = await (value instanceof GameEvent ? value.forResult() : value);
        }
        const nextResult = await event.waitNext();
        event._result = result ?? nextResult ?? event._result;
      }
      generator.return();
    };
    return compiler.compile([middleware]);
  }
}
export {
  YieldCompiler as default
};
