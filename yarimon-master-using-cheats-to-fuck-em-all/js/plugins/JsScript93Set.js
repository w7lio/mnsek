let yaseiPro = 0; 
class YaseiMonster {
    constructor() {
        this.id;
        this.lv;
    }
}
let yaseiData = null;
let YaseiReasonGet = function (_id, _rznNo) {
    for (let i = 0; i <= $N_Yarimon_DB.yaseiMapSettings.length - 1; i++) {
        if (_id == $N_Yarimon_DB.yaseiMapSettings[i].mapId) {
            return $N_Yarimon_DB.yaseiMapSettings[i].reasonDatas[_rznNo - 1];
        }
    }
}
let GetZukanCheck = function (monId) {
    return $gameSystem.yZukan[monId].getFlg;
}
let SetYaseiMonster = new YaseiMonster();
const CN_野生回避終了 = 748;
const SW_野生出現OFF = 483;
const PN_YaseiWin = 481;
const PN_YaseiMon = PN_YaseiWin + 1;
let Yasei_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    Yasei_performTransfer.call(this); 
    yaseiPro = 0;
}
let CheckSyojiYarimon = function (ckMonId) {
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        if ($gameSystem.Player.syojiTikemon[i].id == ckMonId) {
            return true; 
        }
    }
    for (let i = 0; i <= $gameSystem.MonBox.length - 1; i++) {
        for (let j = 0; j < $gameSystem.MonBox[i].length; j++) {
            if ($gameSystem.MonBox[i][j] == null) continue;
            if ($gameSystem.MonBox[i][j].id == ckMonId)
                return true;
        }
    }
    return false;
}
var CkMonId = {
    _ディミアロン:227 , 
    _シーハイロン:228 , 
    _クーロウロン:229 , 
}
let 特殊野生戦闘Flg = false;
Game_Interpreter.prototype.野生戦闘前演出設定 = function () {
    特殊野生戦闘Flg = false;
    switch (SetYaseiMonster.id) {
        case CkMonId._ディミアロン:    
        case CkMonId._シーハイロン:    
        case CkMonId._クーロウロン:    
            $gameSystem.btlBGM = "BattleDlc2Yarimon";
            特殊野生戦闘Flg = true;
            break;
    }
}
let ヤリモン取得チェック = function (id) {
    return CheckSyojiYarimon(id);
}
var yPictures = [];
var yViewFlgs = [];
Game_Interpreter.prototype.KusamuraCheck = function () {
    if ($gameSwitches.value(SW_野生出現OFF)) return ;
    let mapId = $gameMap.mapId();
    let rsionNo = $gameMap.regionId(this.character(0).x, this.character(0).y);
    if ($gameSystem._野生回避Cnt > 0) $gameSystem._野生回避Cnt--;
    yPictures = [];
    yViewFlgs = [];
    yaseiData = YaseiReasonGet(mapId, rsionNo);
    for (let i = 0; i < yaseiData.yarimonDatas.length; i++) {
        let ckMonId = yaseiData.yarimonDatas[i].id;
        let zukanNo = GetYarimonZukanNo(ckMonId);
        switch (ckMonId) {
            case 85:    
            case 86:    
            case 87:    
            case CkMonId._ディミアロン:    
            case CkMonId._シーハイロン:    
            case CkMonId._クーロウロン:    
                if (CheckSyojiYarimon(ckMonId)) { 
                    yaseiData.yarimonDatas.splice(i , 1);
                    i--;
                }
                break;
        }
    }
    yaseiData.yarimonDatas.forEach(yData => {
        var yData = GetYarimonData_ID(yData.id);
        var zukanNo = GetYarimonZukanNo(yData.id);
        yPictures.push(yData.picPath);
        yViewFlgs.push($gameSystem.yZukan[zukanNo].getFlg);
    });
    if (yaseiPro == 0) {
        yaseiPro += 1.4;
    } else {
        yaseiPro *= 1.4;
    }
    if (yaseiPro > 80) yaseiPro = 80;
    if (yaseiPro <= 2) return false;
    if (yaseiPro <= 18) return false;
    if ($gameSystem._野生回避Cnt > 0) {
        yaseiPro = 0;
        $gameSystem._野生回避Cnt--;
        if ($gameSystem._野生回避Cnt == 0) {
            this.SetCmnEvent(CN_野生回避終了);
        }
        return false;
    }
    let RndData = Math.random();
    if (RndData >= (yaseiPro / 100)) return false;
    let sumRate = 0;
    if (yaseiData == undefined) {
        yaseiPro = 0;
        return false;
    }
    yaseiData.yarimonDatas.forEach(_data => {
        sumRate += _data.encounterRate;
    });
    let ckRate = 0;
    let RndRate = Math.floor(Math.random() * sumRate) + 1;
    let SelectYaseiData = null;
    for (let i = 0; i <= yaseiData.yarimonDatas.length - 1; i++) {
        ckRate += yaseiData.yarimonDatas[i].encounterRate;
        if (RndRate <= ckRate) {
            SelectYaseiData = yaseiData.yarimonDatas[i];
            break;
        }
    }
    if (SelectYaseiData == null) return false; 
    this.character(-1).forceMoveRoute({
        "list": [{"code": 15, "parameters": [1]},
            {"code": 0}],
        "repeat": false,
        "skippable": true
    })
    this._character = this.character(-1)
    this.setWaitMode('route')
    let UpLvCng = SelectYaseiData.maxLv - SelectYaseiData.minLv;
    let SetLv = SelectYaseiData.minLv + Math.floor(Math.random() * UpLvCng);
    if (yaseiData.trLvCompFlg) {
        SetLv = $gameSystem.TrainerLv + SelectYaseiData.minLv + Math.floor(Math.random() * UpLvCng);
    }
    yaseiPro = 0;
    SetYaseiMonster.id = SelectYaseiData.id;
    SetYaseiMonster.lv = SetLv;
    btlStartEffect = true;
    return true;
}
let btlStartEffect = false;
var OKKeyOff_IsTrigger = Input.isTriggered;
Input.isTriggered = function(keyName) {
    if (btlStartEffect && keyName === 'ok') {
        return false;
    } else {
        return OKKeyOff_IsTrigger.apply(this, arguments);
    }
};
let Player_StopFlg = false;
const _Game_Player_executeMove = Game_Player.prototype.executeMove;
Game_Player.prototype.executeMove = function (direction) {
    if (!Player_StopFlg) {
        _Game_Player_executeMove.call(this, direction);
    }
};
