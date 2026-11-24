/*:ja
 * @plugindesc 
 */
class Player { 
    constructor() {
        this.syojiTikemon = []; 
    }
}
class SaveZukan { 
    constructor(setId) {
        this.id = setId;
        this.lookFlg = false;
        this.getFlg = false;
        this.hTatieFlg = [];
        this.hSceneFlg = []; 
    }
}
let _newYarimanZukanFlg = false;
let _newYarimanZukanNames = [];
let MenuHSceneOpen = function (_charaId , _No) {
    let ckMZukan;
    for (let i = 0; i < $gameSystem.mZukan.length; i++) {
        if ($gameSystem.mZukan[i].id == _charaId) {
            ckMZukan = $gameSystem.mZukan[i];
            break;
        }
    }
    let ckYData;
    for (let i = 0; i < $N_Yariman_DB.length; i++) {
        if ($N_Yariman_DB[i].id == _charaId) {
            ckYData = $N_Yariman_DB[i]; break;
        }
    }
    if (ckMZukan == undefined) {
        console.log("MenuHSceneOpen : キャンセル"); return;
    }
    for (let i = ckMZukan.hSceneFlg.length; i < ckYData.hScene.length; i++)
        ckMZukan.hSceneFlg.push(false);
    ckMZukan.lookFlg = true;
    if (!ckMZukan.getFlg) {
        ckMZukan.getFlg = true;
        _newYarimanZukanFlg = true;
        _newYarimanZukanNames.push(ckYData.name);
    }
    if (ckMZukan.hSceneFlg.length > _No) ckMZukan.hSceneFlg[_No] = true;
    for (let i = ckMZukan.hTatieFlg.length; i < ckYData.tatiePic.tatieDatas.length; i++)
        ckMZukan.hTatieFlg[i] = false;
    ckMZukan.hTatieFlg[0] = true;
}
let MenuHTatieOpen = function (_charaId , _No) {
    for (let i = 0; i < $gameSystem.mZukan.length; i++) {
        if ($gameSystem.mZukan[i].id == _charaId) {
            ckMZukan = $gameSystem.mZukan[i]; break;
        }
    }
    ckMZukan.hTatieFlg[_No] = true;
}
let CheckHSceneOpen = function (_charaId , _No) {
    let ckMZukan;
    for (let i = 0; i < $gameSystem.mZukan.length; i++) {
        if ($gameSystem.mZukan[i].id == _charaId) {
            ckMZukan = $gameSystem.mZukan[i];
            break;
        }
    }
    if (ckMZukan.hSceneFlg.length > _No) return ckMZukan.hSceneFlg[_No];
    return false;
}
let GameMain_Initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    GameMain_Initialize.call(this);
    this.Player = new Player(); 
    this.TrainerLv = 5;     
    this.KeikenKakera = 0;  
    this.MonBox = []; 
    for (let i = 0; i <= 14 - 1; i++) {
        let _BoxArr = [];
        for (let j = 0; j <= 20 - 1; j++) {
            _BoxArr.push(null);
        }
        this.MonBox.push(_BoxArr);
    }
    this.yZukan = []; 
    this.mZukan = []; 
    this.TitleStartFlg = false; 
};
let SetZukanLook_Id = function (id) {
    let ck_i = 0;
    $N_Yarimon_DB.mZukanDatas.forEach( yarimonData => {
        if ($gameSystem.yZukan[ck_i] == undefined) $gameSystem.yZukan.push(new SaveZukan(yarimonData.id));
        if (yarimonData.id == id) $gameSystem.yZukan[ck_i].lookFlg = true;
        ck_i++;
    });
}
let SetZukanGet_Id = function (id) {
    let ck_i = 0;
    $N_Yarimon_DB.mZukanDatas.forEach( _mons => {
        if (_mons.id == id) $gameSystem.yZukan[ck_i].lookFlg = true;
        if (_mons.id == id) $gameSystem.yZukan[ck_i].getFlg = true;
        ck_i++;
    });
}
let SetYarimanZukanLook_Id = function (id) {
    let ck_i = 0;
    $N_Yariman_DB.forEach(zukanData => {
        if (zukanData.id == id) $gameSystem.mZukan[ck_i].lookFlg = true;
        ck_i++;
    });
}
let SetYarimanZukanGet_Id = function (id) {
    let ck_i = 0;
    $N_Yariman_DB.forEach(zukanData => {
        if (zukanData.id == id) $gameSystem.mZukan[ck_i].lookFlg = true;
        if (zukanData.id == id) $gameSystem.mZukan[ck_i].getFlg = true;
        ck_i++;
    });
}
const SW_ZukanGet = 22;
const SW_FastTrFlg = 24; 
const SW_MapGet = 25
let FirstPlayerSetting = function () {
    for (let i = 0; i <= $N_Yarimon_DB.mZukanDatas.length - 1; i++) {
        var monData = $N_Yarimon_DB.mZukanDatas[i];
        $gameSystem.yZukan.push(new SaveZukan(monData.id));
    }
    for (let i = 0; i <= $N_Yariman_DB.length - 1; i++) {
        $gameSystem.mZukan.push(new SaveZukan($N_Yariman_DB[i].id));
    }
    let _lv = 5;
    YarimonNoFlg = true;
    let setYarimon = new YarimonData(152 , _lv); 
    $gameSystem.Player.syojiTikemon = [setYarimon];
    $gameSystem.TitleStartFlg = true;
}
let DLCZukanReSetting = function () {
    for (let i = 0; i <= $N_Yariman_DB.length - 1; i++) {
        var breakFlg = false;
        for (let j = 0; j <= $gameSystem.mZukan.length - 1; j++) {
            if ($N_Yariman_DB[i].id == $gameSystem.mZukan[j].id) {
                while ($N_Yariman_DB[i].hScene.length > $gameSystem.mZukan[j].hSceneFlg.length) {
                    $gameSystem.mZukan[j].hSceneFlg.push(false);
                }
                breakFlg = true;
                break;
            }
            if (breakFlg) break;
        }
    }
}
let DebugPlayerSetting = function () {
    let setYarimon = new YarimonData(152 , 10); 
    $gameSystem.Player.syojiTikemon = [setYarimon];
    $gameSystem.TitleStartFlg = true;
}
let GetTypeNo = function (typeName) {
    if(typeName == "無") return 0;
    if(typeName == "火") return 1;
    if(typeName == "水") return 2;
    if(typeName == "風") return 3;
    if(typeName == "土") return 4;
    if(typeName == "光") return 5;
    if(typeName == "闇") return 6;
    return "";
}
let GetTypeColor = function (typeName) {
    if(typeName == "無") return [170 , 170 , 170];
    if(typeName == "火") return [255 , 100 , 100];
    if(typeName == "水") return [80 , 150 , 255];
    if(typeName == "風") return [95 , 225 , 125];
    if(typeName == "土") return [185 , 125 , 60];
    if(typeName == "光") return [255 , 240 , 0];
    if(typeName == "闇") return [100 , 30 , 100];
}
