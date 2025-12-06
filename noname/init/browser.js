import { game } from "../game/index.js";
async function browserReady() {
  try {
    await fetch(`/checkFile?fileName=noname.js`).then((response) => response.json()).then((result) => {
      if (!result?.success) throw new Error(result.errorMsg);
    });
  } catch (e) {
    console.error("文件读写函数初始化失败:", e);
    return;
  }
  game.checkFile = function checkFile(fileName, callback, onerror) {
    fetch(`/checkFile?fileName=${fileName}`).then((response) => response.json()).then((result) => {
      if (result) {
        if (result.success) {
          callback?.(1);
          return;
        }
        if (result.code === 404) {
          if (result.errorMsg === "不是一个文件") {
            callback?.(0);
            return;
          } else if (result.errorMsg === "文件不存在或无法访问") {
            callback?.(-1);
            return;
          }
        }
      }
      onerror?.(result?.errorMsg);
    }).catch(onerror);
  };
  game.checkDir = function checkDir(dir, callback, onerror) {
    fetch(`/checkDir?dir=${dir}`).then((response) => response.json()).then((result) => {
      if (result) {
        if (result.success) {
          callback?.(1);
          return;
        }
        if (result.code === 404) {
          if (result.errorMsg === "不是一个文件夹") {
            return void callback?.(0);
          } else if (result.errorMsg === "文件夹不存在或无法访问") {
            return void callback?.(-1);
          }
        }
      }
      onerror?.(result?.errorMsg);
    }).catch(onerror);
  };
  game.readFile = function readFile(fileName, callback = () => {
  }, error2 = () => {
  }) {
    fetch(`/readFile?fileName=${fileName}`).then((response) => response.json()).then((result) => {
      if (result?.success) {
        const data = result.data;
        let buffer;
        if (typeof data == "string") {
          buffer = Uint8Array.fromBase64(data);
        } else if (Array.isArray(data)) {
          buffer = new Uint8Array(data);
        }
        callback(buffer.buffer);
      } else {
        error2(result?.errorMsg);
      }
    }).catch(error2);
  };
  game.readFileAsText = function readFileAsText(fileName, callback = () => {
  }, error2 = () => {
  }) {
    fetch(`/readFileAsText?fileName=${fileName}`).then((response) => response.json()).then((result) => {
      if (result?.success) {
        callback(result.data);
      } else {
        error2(result?.errorMsg);
      }
    }).catch(error2);
  };
  game.writeFile = function writeFile(data, path, name, callback = () => {
  }) {
    game.ensureDirectory(path, () => {
      if (Object.prototype.toString.call(data) == "[object File]") {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          game.writeFile(event.target.result, path, name, callback);
        };
        fileReader.readAsArrayBuffer(data, "UTF-8");
      } else {
        let filePath = path;
        if (path.endsWith("/")) {
          filePath += name;
        } else if (path == "") {
          filePath += name;
        } else {
          filePath += "/" + name;
        }
        fetch(`/writeFile`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: typeof data == "string" ? data : Array.prototype.slice.call(new Uint8Array(data)),
            path: filePath
          })
        }).then((response) => response.json()).then((result) => {
          if (result?.success) {
            callback();
          } else {
            callback(result?.errorMsg);
          }
        });
      }
    });
  };
  game.removeFile = function removeFile(fileName, callback = () => {
  }) {
    fetch(`/removeFile?fileName=${fileName}`).then((response) => response.json()).then((result) => {
      callback(result.errorMsg);
    }).catch(error);
  };
  game.getFileList = function getFileList(dir, callback = () => {
  }, onerror) {
    fetch(`/getFileList?dir=${dir}`).then((response) => response.json()).then((result) => {
      if (!result) {
        throw new Error("Cannot get available resource.");
      }
      if (result.success) {
        callback(result.data.folders, result.data.files);
      } else if (onerror) {
        onerror(new Error(result.errorMsg));
      }
    });
  };
  game.ensureDirectory = function ensureDirectory(list, callback = () => {
  }, file = false) {
    let pathArray = typeof list == "string" ? list.split("/") : list;
    if (file) {
      pathArray = pathArray.slice(0, -1);
    }
    game.createDir(pathArray.join("/"), callback, console.error);
  };
  game.createDir = function createDir(directory, successCallback = () => {
  }, errorCallback = () => {
  }) {
    fetch(`/createDir?dir=${directory}`).then((response) => response.json()).then((result) => {
      if (result?.success) {
        successCallback();
      } else {
        errorCallback(new Error("创建文件夹失败"));
      }
    }).catch(errorCallback);
  };
  game.removeDir = function removeDir(directory, successCallback = () => {
  }, errorCallback = () => {
  }) {
    fetch(`/removeDir?dir=${directory}`).then((response) => response.json()).then((result) => {
      if (result?.success) {
        successCallback();
      } else {
        errorCallback(new Error("创建文件夹失败"));
      }
    }).catch(errorCallback);
  };
}
export {
  browserReady
};
