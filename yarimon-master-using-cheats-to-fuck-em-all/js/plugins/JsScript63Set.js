Input.keyMapper[8] = 'BackSpace';
let tempSave, savedBgm, savedBgs;
let BgmLoadSkipFlg = false; 
Game_Interpreter.prototype.InstantLoad = function () {
    SceneManager.goto(Scene_InstantLoad);
    PicFrame_ReDrawFlg = true;
}
Game_Interpreter.prototype.InstantSave = function () {
    savedBgm = AudioManager.saveBgm();
    savedBgs = AudioManager.saveBgs();
    tempSave = JsonEx.stringify(DataManager.makeSaveContents());
}
let _InsLoadFlg = false;
function Scene_InstantLoad() {
    _InsLoadFlg = true;
    this.initialize.apply(this, arguments);
}
Scene_InstantLoad.prototype = Object.create(Scene_Base.prototype);
Scene_InstantLoad.prototype.constructor = Scene_InstantLoad;
Scene_InstantLoad.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    DataManager.createGameObjects();
    DataManager.extractSaveContents(JsonEx.parse(tempSave));
    if (savedBgm){
        if (!BgmLoadSkipFlg){
            AudioManager.replayBgm(savedBgm);
        }
    } 
    if (savedBgs) AudioManager.replayBgs(savedBgs);
    tempSave = savedBgm = savedBgs = null;
    DataManager.loadMapData($gameMap.mapId());
    SceneManager._stack = [Scene_Map];
    SceneManager.pop();
};
let Nupu_playBgm = AudioManager.playBgm;
AudioManager.playBgm = function (bgm, pos) {
    if (!_InsLoadFlg) {
        Nupu_playBgm.call(this, bgm, pos);
    } else {
        if (!BgmLoadSkipFlg) {
            Nupu_playBgm.call(this, bgm, pos);
        }
        _InsLoadFlg = false; 
        BgmLoadSkipFlg = false; 
    }
}
let Nupu_fadeOutBgm = AudioManager.fadeOutBgm;
AudioManager.fadeOutBgm = function (duration) {
    if (!_InsLoadFlg) {
        Nupu_fadeOutBgm.call(this, duration);
    } else {
        if (!BgmLoadSkipFlg) {
            Nupu_fadeOutBgm.call(this, duration);
        }
    }
};
