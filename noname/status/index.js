import "../../noname.js";
import PauseManager from "../game/PauseManager.js";
import "../library/element/gameEvent.js";
import GameEventManager from "../library/element/GameEvent/GameEventManager.js";
import { lib } from "../library/index.js";
class status {
  imchoosing = false;
  clicked = false;
  auto = false;
  eventManager = new GameEventManager();
  /**
   * @type { GameEvent }
   */
  get event() {
    return this.eventManager.getStatusEvent();
  }
  set event(event) {
    this.eventManager.setStatusEvent(event);
  }
  ai = {};
  lastdragchange = [];
  /**
   * @type { string[] }
   */
  skillaudio = [];
  dieClose = [];
  dragline = [];
  dying = [];
  /**
   * @type { GameHistory[] }
   */
  globalHistory = [
    {
      cardMove: [],
      custom: [],
      useCard: [],
      changeHp: [],
      everything: []
    }
  ];
  cardtag = {
    yingbian_zhuzhan: [],
    yingbian_kongchao: [],
    yingbian_fujia: [],
    yingbian_canqu: [],
    yingbian_force: []
  };
  renku = [];
  prehidden_skills = [];
  postReconnect = {};
  /**
   * @type { string | undefined }
   */
  extension = void 0;
  /**
   * @type { boolean | undefined }
   */
  dragged = void 0;
  /**
   * @type { boolean | undefined }
   */
  touchconfirmed = void 0;
  connectMode = false;
  /**
   * @type { boolean | undefined }
   */
  video = void 0;
  /**
   * @type { boolean | undefined }
   */
  importingExtension = void 0;
  /**
   * @type { string[] | undefined }
   */
  extensionLoaded = void 0;
  /**
   * @type { Promise<any>[] | undefined }
   */
  extensionLoading = void 0;
  javaScriptExtensions = [];
  /**
   * @type { { [key: string]: Promise<any>[] } | undefined }
   */
  importing = void 0;
  /**
   * @type { Function | boolean | undefined }
   */
  new_tutorial = void 0;
  /**
   * @type { Player | undefined }
   */
  roundStart = void 0;
  /**
   * @type { boolean }
   */
  roundSkipped;
  /**
   * @type { boolean }
   */
  withError = false;
  /**
   * @type { string | undefined }
   */
  mode = void 0;
  /**
   * @type { { [key: string]: any } | undefined }
   */
  brawl = void 0;
  /**
   * @type { string | undefined }
   */
  playback = void 0;
  /**
   * @type { number | undefined }
   */
  coinCoeff = void 0;
  pauseManager = new PauseManager();
  get paused() {
    return this.pauseManager.pause.isStarted;
  }
  set paused(bool) {
    if (bool) {
      this.pauseManager.pause.start();
    } else {
      this.pauseManager.pause.resolve();
    }
  }
  get paused2() {
    return this.pauseManager.pause2.isStarted;
  }
  set paused2(bool) {
    if (bool) {
      this.pauseManager.pause2.start();
    } else {
      this.pauseManager.pause2.resolve();
    }
  }
  get paused3() {
    return this.pauseManager.pause3.isStarted;
  }
  set paused3(bool) {
    if (bool) {
      this.pauseManager.pause3.start();
    } else {
      this.pauseManager.pause3.resolve();
    }
  }
  get over() {
    return this.pauseManager.over.isStarted;
  }
  set over(bool) {
    if (bool) {
      this.pauseManager.over.start();
    } else {
      this.pauseManager.over.resolve();
    }
  }
}
let _status = new status();
let setStatus = (instance) => {
  _status = instance || new status();
  if (lib.config.dev) {
    window._status = _status;
  }
};
export {
  _status,
  setStatus,
  status
};
