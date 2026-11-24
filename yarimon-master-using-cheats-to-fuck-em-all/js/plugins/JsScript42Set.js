/*:
 * @plugindesc 
 * @author ぬぷ竜
 */
let SCol = {
    Def: "\\C[0]" , Def0: "\\ow[0]\\C[0]" , 
    Blk: "\\C[15]" , Blk0: "\\ow[0]\\C[15]" , 
    Red: "\\C[10]" , Red0: "\\ow[0]\\C[10]" , 
    Grn: "\\C[29]" , Grn0: "\\ow[0]\\C[29]" , 
    Blu: "\\C[23]" , Blu0: "\\ow[0]\\C[23]" , 
    Yel: "\\C[17]" , Yel0: "\\ow[0]\\C[17]" , 
    Ppr: "\\C[27]" , Ppr0: "\\ow[0]\\C[27]"
};
let SWCol = {
    Wht: "\\oc[rgb(255,255,255)]",
    Blk: "\\oc[rgb(0,0,0)]",
    Red: "\\oc[rgb(255,0,0)]",
    Grn: "\\oc[rgb(0,255,0)]",
    Blu: "\\oc[rgb(0,0,255)]",
    Yel: "\\oc[rgb(255,255,0)]"
}
let SColSet = {
    BlkW : SCol.Blk + SWCol.Wht
}
Game_Interpreter.prototype.GameFileSave = function (_SaveNo) {
    let args = new Array("save", String(_SaveNo));
    this.pluginCommand("SaveCommand", args);
};
Game_Interpreter.prototype.GameFileLoad = function (_SaveNo) {
    let args = new Array("load", String(_SaveNo));
    this.pluginCommand("SaveCommand", args);
};
Game_Interpreter.prototype.UTA_Save = function () {
    let args = new Array("save");
    this.pluginCommand("CommonSave", args);
};
Game_Interpreter.prototype.UTA_Load = function () {
    let args = new Array("load");
    this.pluginCommand("CommonSave", args);
};
let ErrLogPic = PVS_MaxPicNo - 10; 
let N_ErrMsg = []; 
let N_ErrViewFlg = false; 
let NErrPos = new Pos2D(0, 0);
let Nupu_ErrMapMoveCnt = 0;
let Nupu_ErrLogUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    Nupu_ErrLogUpdate.call(this);
    if (N_ErrMsg.length != 0 && !N_ErrViewFlg) {
        N_ErrViewFlg = true;
        Nupu_ErrMapMoveCnt = 2;
        this.SetPict(ErrLogPic, "system/ErrBack", NErrPos._x, NErrPos._y);
        D_Text_Cng_font = ""; 
        let fseSet = "\\ow[0]"
        for (let ei = 0; ei <= N_ErrMsg.length - 1; ei++) {
            this.SetPicStr(ErrLogPic + 1 + ei, fseSet + N_ErrMsg[ei], 16, NErrPos._x + 34, NErrPos._y + 52 + (22 * ei));
            if (ei == 8) {
                break;
            }
        }
        D_Text_Cng_font = ""; 
    }
    if (Input.isTriggered('tab')) { 
        N_ErrViewFlg = false; 
        N_ErrMsg = [];
        for (let ei = ErrLogPic; ei <= ErrLogPic + 10; ei++) {
            this.DelPict(ei); 
        }
    }
}
let Nupu_Yanfly_Err = Yanfly.Util.displayError;
Yanfly.Util.displayError = function (e, code, message) {
    try {
        Nupu_Yanfly_Err.call(this, e, code, message);
        if (!N_ErrViewFlg) {
            N_ErrMsg = e.stack.split('\n');
            N_ErrMsg.unshift(e.message); 
            for (let ei = 2; ei <= N_ErrMsg.length - 1; ei++) {
                N_ErrMsg[ei] = N_ErrMsg[ei].slice(-50);
            }
        }
    } catch(ex) {
    }
}
let Nupu_Err_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    Nupu_Err_performTransfer.call(this); 
    Nupu_ErrMapMoveCnt--;
    if (Nupu_ErrMapMoveCnt <= 0) {
        DelPictSpan(ErrLogPic , ErrLogPic + 1 + 8);
    }
}
let WebPageOpen = function (_URL) {
    let url = _URL;
    if (Utils.isNwjs()) {
        let exec = require('child_process').exec;
        switch (process.platform) {
            case 'win32':
                exec('rundll32.exe url.dll,FileProtocolHandler  "' + url + '"');
                break;
            default:
                exec('open "' + url + '"');
                break;
        }
    } else {
        window.open(url);
    }
}
let Nupu_onKeyDown = Input._onKeyDown;
Input._onKeyDown = function (event) {
    //console.log(event.keyCode); //ここをコメントに戻すと表示されるようになる。
    Nupu_onKeyDown.call(this, event);
};
function ErrConsole(_ErrArr) {
    let outStr = "Err:";
    for (let i = 0; i <= _ErrArr.length - 1; i++) {
        outStr += _ErrArr[i] + ":";
    }
    console.log(outStr);
}
let Nupu_ImgConsole = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    Nupu_ImgConsole.call(this); 
    if (i_ConStr != ""){
        this.SetPicStr(ErrLogPic, i_ConStr, 16, 10, 10);
        i_ConStr = "";
    }
}
let i_ConStr = "";
function i_console(_str){
    if (!DbgFlg) return;
    i_ConStr = _str;
}
let isFastOff = false; 
Scene_Map.prototype.isFastForward = function () {
    if(isFastOff) return false; 
    return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() &&
        (Input.isLongPressed('ok') || TouchInput.isLongPressed() || Input.isPressed('control')));
};
let isFastForward = function () {
    return (Input.isLongPressed('ok') || TouchInput.isLongPressed() || Input.isPressed('control'));
}
let MapDataView = function () {
    let _mapId = $gameMap.mapId();
    for (var i = 1; i < $dataMapInfos.length; i++) {
        var mapInfo = $dataMapInfos[i];
        if (mapInfo.id == _mapId) {
            console.log("Map"+ mapInfo.id + "：" + mapInfo.name);
            console.log(mapInfo);
            break;
        }
    }
}
//使用方法：let sRand = SeedRand(Seed値); //乱数の作成を行う
//sRand.get(); //乱数の取得
class SeedRand {
    constructor(seed = 88675123) {
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        this.w = seed;
    }
    next() {
        let t;
        t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    }
    random() {
        let min = 0;
        let max = 10000000;
        const r = Math.abs(this.next());
        return (min + (r % (max + 1 - min))) / max;
    }
}
let SaveFolCngName = ""; 
StorageManager.localFileDirectoryPath = function(_cngFlg) {
    _cngFlg = typeof _cngFlg !== 'undefined' ? _cngFlg : false;
    let path = require('path');
    let base = path.dirname(process.mainModule.filename);
    if(SaveFolCngName != "" && _cngFlg){
        var loadFolName = SaveFolCngName;
        return path.join(base, loadFolName + '/');
    }
    return path.join(base, 'save/');
};
let LocalLoadFileNo = -1;
let BaseGrobalFolName = "";
StorageManager.localFilePath = function(savefileId) {
    var name;
    let _cngFlg = false;
    if (savefileId < 0) {
        name = 'config.rpgsave';
    } else if (savefileId === 0) {
        name = 'global.rpgsave';
        _cngFlg = true;
        if (LocalLoadFileNo != -1 && BaseGrobalFolName != "") {
            let befSaveFolCngName = SaveFolCngName;
            SaveFolCngName = BaseGrobalFolName;
            let rtnPath = this.localFileDirectoryPath(_cngFlg) + name;
            SaveFolCngName = befSaveFolCngName;
            return rtnPath;
        }
    } else {
        name = 'file%1.rpgsave'.format(savefileId);
        _cngFlg = true;
    }
    return this.localFileDirectoryPath(_cngFlg) + name;
};
let NRandGet = function(_MaxNo){
    return Math.floor(Math.random() * (_MaxNo + 1));
}
let Debug_MakeTxt = function (_path , _str) {
    //使用例：Debug_MakeTxt("Debug.txt" , "Textファイル中に記述する内容");
    let fs = require("fs");
    fs.writeFileSync(_path, _str, (err) => {
        if (err) throw err;
    });
}
let ErrLog = []; 
let Exit_FuncSetting = function (){
    let fs = require("fs");
    process.on("exit", function() {
        if (ErrLog.length == 0) return;
        let _ExitStr = "";
        for (let i = 0; i <= ErrLog.length - 1; i++) {
            _ExitStr += ErrLog[i] + "\n";
        }
        let dt = new Date();
        let _FileName = "ErrLog_" + dt.getMonth() + dt.getDay() + dt.getHours() + dt.getMinutes();
        Debug_MakeTxt(_FileName + ".txt" , _ExitStr);
    })
    process.on("SIGINT", function () {
        process.exit(0);
    });
    setInterval(function(){}, 10000);
}
function replaceArrayElements(array, targetId, sourceId) {
    return array.reduce((resultArray, element, id, originalArray) => [
        ...resultArray,
        id === targetId ? originalArray[sourceId] :
            id === sourceId ? originalArray[targetId] :
                element
    ], []);
}
