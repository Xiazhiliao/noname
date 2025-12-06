import "../../../noname.js";
import { lib } from "../index.js";
import { get } from "../../get/index.js";
import { ui } from "../../ui/index.js";
import { _status } from "../../status/index.js";
const checkBegin = {};
const checkCard = {
  updateTempname(card, event) {
    if (lib.config.cardtempname === "off") {
      return;
    }
    if (get.name(card) === card.name && get.is.sameNature(get.nature(card), card.nature, true)) {
      return;
    }
    const node = ui.create.cardTempName(card);
    if (lib.config.cardtempname !== "default") {
      node.classList.remove("vertical");
    }
  }
};
const checkTarget = {
  updateInstance(target, event) {
    if (!target.instance) {
      return;
    }
    ["selected", "selectable"].forEach((className) => {
      if (target.classList.contains(className)) {
        target.instance.classList.add(className);
      } else {
        target.instance.classList.remove(className);
      }
    });
  },
  addTargetPrompt(target, event) {
    if (!event.targetprompt2?.length) {
      return;
    }
    const str = event.targetprompt2.map((func) => func(target) || "").flat().filter((prompt) => prompt.length).toUniqued().join("<br>");
    let node;
    if (target.node.prompt2) {
      node = target.node.prompt2;
      node.innerHTML = "";
      node.className = "damage normal-font damageadded";
    } else {
      node = ui.create.div(".damage.normal-font", target);
      target.node.prompt2 = node;
      ui.refresh(node);
      node.classList.add("damageadded");
    }
    node.innerHTML = str;
    node.dataset.nature = "soil";
  }
};
const checkButton = {};
const checkEnd = {
  autoConfirm(event, { ok, auto, autoConfirm }) {
    if (!event.isMine()) {
      return;
    }
    const skillinfo = get.info(event.skill) || {};
    if (ok && auto && (autoConfirm || skillinfo.direct) && !_status.touchnocheck && !_status.mousedown && (!_status.mousedragging || !_status.mouseleft)) {
      if (ui.confirm) {
        ui.confirm.close();
      }
      if (event.skillDialog === true) {
        event.skillDialog = false;
      }
      ui.click.ok();
      _status.mousedragging = null;
      if (skillinfo.preservecancel) {
        ui.create.confirm("c");
      }
    }
  },
  createChooseAll(event, _) {
    if (!lib.config.choose_all_button) {
      return;
    }
    if (event.name === "chooseToUse" && event.isMine() && !(event.cardChooseAll instanceof lib.element.Control)) {
      const skill = event.skill;
      if (!skill || !get.info(skill)) {
        return;
      }
      const info = get.info(skill);
      if (!info.filterCard || !info.selectCard) {
        return;
      }
      if (info.complexSelect || info.complexCard || !info.allowChooseAll) {
        return;
      }
      ui.create.cardChooseAll();
    }
  }
};
const uncheckBegin = {
  destroyChooseAll(event, _) {
    if (!lib.config.choose_all_button) {
      return;
    }
    if (event.name !== "chooseToUse") {
      return;
    }
    if (event.cardChooseAll instanceof lib.element.Control) {
      event.cardChooseAll.close();
      delete event.cardChooseAll;
    }
  }
};
const uncheckCard = {
  removeTempname(card, event) {
    if (!card._tempName) {
      return;
    }
    card._tempName.delete();
    delete card._tempName;
  }
};
const uncheckTarget = {
  removeInstance(target, event) {
    if (!target.instance) {
      return;
    }
    target.instance.classList.remove("selected");
    target.instance.classList.remove("selectable");
  },
  removeTargetPrompt(target, event) {
    if (target.node.prompt2) {
      target.node.prompt2.remove();
      delete target.node.prompt2;
    }
  }
};
const uncheckButton = {};
const uncheckEnd = {};
const checkOverflow = {
  updateDialog(itemOption, itemContainer, addedItems, game) {
    const gap = 3;
    function isEqual(a, b) {
      return Math.abs(a - b) < 3;
    }
    let equal = isEqual(itemContainer.originWidth, itemContainer.getBoundingClientRect().width);
    const L = (itemContainer.originWidth - 2 * gap) * (equal ? 0.8 : 1);
    const W = 90;
    let n = addedItems.length;
    const r = 16;
    if (n * W + (n + 1) * gap < L) {
      itemContainer.style.setProperty("--ml", gap + "px");
      itemContainer.classList.remove("zoom");
    } else {
      const ml = Math.min((n * W - L + gap) / (n - 1), W - r);
      itemContainer.style.setProperty("--ml", "-" + ml + "px");
      itemContainer.classList.add("zoom");
    }
  }
};
const checkTipBottom = {
  undateTipBottom(player) {
    if (!player.node.tipContainer) {
      return;
    }
    if ((lib.config.layout == "mobile" || lib.config.layout == "long") && player.dataset.position == "0") {
      player.style.removeProperty("--bottom");
    } else {
      if (Array.from(player.node.equips.children).every((e) => e.classList.contains("emptyequip"))) {
        player.style.removeProperty("--bottom");
      } else {
        let eqipContainerTop = player.node.equips.offsetTop;
        let equipTop = 0;
        for (let equip of Array.from(player.node.equips.children)) {
          if (!equip.classList.contains("emptyequip")) {
            equipTop = equip.offsetTop;
            break;
          }
        }
        let top = equipTop + eqipContainerTop;
        const bottom = player.getBoundingClientRect().height - top;
        player.style.setProperty("--bottom", bottom + "px");
      }
    }
  }
};
const checkDamage1 = {
  kuanggu(event, player) {
    if (get.distance(event.source, player) <= 1) {
      event.checkKuanggu = true;
    }
  },
  jyliezhou(event, player) {
    if (event.player.isLinked()) {
      event.checkJyliezhou = true;
    }
  }
};
const checkDamage2 = {};
const checkDamage3 = {
  jiushi(event, player) {
    if (player.isTurnedOver()) {
      event.checkJiushi = true;
    }
  }
};
const checkDamage4 = {};
const checkDie = {};
const checkUpdate = {};
const checkSkillAnimate = {};
const addSkillCheck = {};
const removeSkillCheck = {
  checkCharge(skill, player) {
    if (player.countCharge(true) < 0) {
      player.removeCharge(-player.countCharge(true));
    }
  }
};
const refreshSkin = {};
export {
  addSkillCheck,
  checkBegin,
  checkButton,
  checkCard,
  checkDamage1,
  checkDamage2,
  checkDamage3,
  checkDamage4,
  checkDie,
  checkEnd,
  checkOverflow,
  checkSkillAnimate,
  checkTarget,
  checkTipBottom,
  checkUpdate,
  refreshSkin,
  removeSkillCheck,
  uncheckBegin,
  uncheckButton,
  uncheckCard,
  uncheckEnd,
  uncheckTarget
};
