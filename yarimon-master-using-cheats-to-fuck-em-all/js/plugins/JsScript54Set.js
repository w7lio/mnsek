const CN_DbgEx = 502;
const DbgPath = "pictures/_Debug/";
const PN_DbgBase = 500;
const PN_DbgSelecter = PN_DbgBase + 1;
const PN_DbgTxt = PN_DbgSelecter + 1;
const PN_QSave = 580;
const PN_QLoad = PN_QSave + 1;
const PN_DbgMenuPBtn = PN_QLoad + 1;
const PN_DbgMenuF3Btn = PN_DbgMenuPBtn + 1;
let P_Dbg_Flg = false;
let Dbg_ViewArr = [
    "手持ち：自由変更" ,
    "全アイテム50ゲット" ,
    "手持ちｾｰﾌﾞ/ﾛｰﾄﾞ" ,
    "自由敵戦闘" ,
    "フレーム情報削除" ,
    "図鑑全て取得" ,
    "デバッグモード終了" ,
];
Game_Interpreter.prototype.DbgModeEnd = function () {
    DbgFlg = false;
    this.DbgUIDel();
}
Game_Interpreter.prototype.DbgUIDel = function () {
    if (GetSpriteData(PN_QSave) == null) return;
    this.DelSpriteSpan(PN_QSave, PN_DbgMenuF3Btn);
    DbgDrawFlg = false;
}
let DbgBBtlEmNo = -1;
let QLoadingFlg = false;
let CharaFlzFlame = 0;
let DbgPMenuEndFlg = false;
let DbgPMenuEndBtnFlame = 0;
let Nupuryu_VTestFlg = false;
let DbgDrawFlg = false;
let DgbQSaveNo = 24;
let NupuDebug_Update = Game_Interpreter.prototype.NUpdate;
let DoQSaveNo = -1;
Game_Interpreter.prototype.NUpdate = function () {
    if (CharaFlzFlame > 0) CharaFlzFlame--;
    NupuDebug_Update.call(this);
    if (DoQSaveNo != -1) {
        this.GameFileSave(DoQSaveNo);
        SoundManager.playLoad();
        DoQSaveNo = -1;
    }
    if (DbgFlg) {
        this.SpriteCngColorArr([PN_QSave, PN_QLoad]);
        if ($gameSwitches.value(SW_会話中)) {
            this.DbgUIDel();
            return;
        }
        if (!DbgDrawFlg) {
            this.SetSprite(PN_QSave, DbgPath + "PN_QSave", 685, 4);
            this.SetSprite(PN_QLoad, DbgPath + "PN_QLoad", 864, 4);
            this.SetSprite(PN_DbgMenuPBtn, DbgPath + "PN_DbgMenuPBtn", 1274, 4);
            this.SetSprite(PN_DbgMenuF3Btn, DbgPath + "PN_DbgMenuF3Btn", 4, 4);
        }
        if (QLoadingFlg) {
            try {
                if (GetSpriteData(PN_QLoad)._name != DbgPath + "PN_QLoad_G") {
                    this.SetSprite(PN_QLoad, DbgPath + "PN_QLoad_G", 864, 4);
                }
            } catch (e) {
                this.SetSprite(PN_QSave, DbgPath + "PN_QSave", 685, 4);
                this.SetSprite(PN_QLoad, DbgPath + "PN_QLoad", 864, 4);
                this.SetSprite(PN_DbgMenuPBtn, DbgPath + "PN_DbgMenuPBtn", 1274, 4);
                this.SetSprite(PN_DbgMenuF3Btn, DbgPath + "PN_DbgMenuF3Btn", 4, 4);
            }
        }
        if (overPointerSpCk(PN_QSave)) {
            this.SpriteCngColor(PN_QSave, [150, 150, 150, 0]);
            if (TouchInput.isTriggered()) {
                this.GameFileSave(DgbQSaveNo);
                SoundManager.playLoad();
                CharaFlzFlame = 3;
            }
        }
        if (overPointerSpCk(PN_QLoad) && !QLoadingFlg) {
            this.SpriteCngColor(PN_QLoad, [150, 150, 150, 0]);
            if (TouchInput.isTriggered()) {
                this.LoadStarting(DgbQSaveNo);
                SoundManager.playLoad();
                CharaFlzFlame = 3;
                QLoadingFlg = true;
                PicFrame_ReDrawFlg = true;
            }
        }
        let PN_DbgMenuPBtn_Flg = false;
        this.SpriteCngColor(PN_DbgMenuPBtn, [0, 0, 0, 0]);
        if (overPointerSpCk(PN_DbgMenuPBtn)) {
            this.SpriteCngColor(PN_DbgMenuPBtn, [150, 150, 150, 0]);
            if (TouchInput.isTriggered()) PN_DbgMenuPBtn_Flg = true;
        }
        if (DbgPMenuEndBtnFlame > 0) DbgPMenuEndBtnFlame--;
        if (Input.isTriggered('dbg_Ex') || PN_DbgMenuPBtn_Flg) {
            if (!P_Dbg_Flg) {
                DbgPMenuEndBtnFlame = 3;
                CharaFlzFlame = 3;
                P_Dbg_Flg = true;
                this.SetCmnEventSc(CN_DbgEx); 
            } else {
                if (DbgPMenuEndBtnFlame <= 0) DbgPMenuEndFlg = true;
            }
        }
        this.SpriteCngColor(PN_DbgMenuF3Btn, [0, 0, 0, 0]);
        if (overPointerSpCk(PN_DbgMenuF3Btn)) {
            this.SpriteCngColor(PN_DbgMenuF3Btn, [150, 150, 150, 0]);
            if (TouchInput.isTriggered()) {
                CharaFlzFlame = 3;
                Nupuryu_VTestFlg = true;
            }
        }
    }
}
let jampSaveNo = -1;
let N_SaveDataJumpFrame = -1;
Game_Interpreter.prototype.N_SaveDataJump = function (saveNo) {
    N_SaveDataJumpFrame = 0;
    _LoadStartingFlame = 0;
    jampSaveNo = saveNo;
}
let N_SaveDataJump_NUpdateSc = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    N_SaveDataJump_NUpdateSc.call(this);
    if (N_SaveDataJumpFrame >= 0) {
        N_SaveDataJumpFrame++;
        if (N_SaveDataJumpFrame == 3) {
            N_SaveDataJumpFrame = -1;
            this.LoadStarting(jampSaveNo);
            SoundManager.playLoad();
            CharaFlzFlame = 3;
            QLoadingFlg = true;
            PicFrame_ReDrawFlg = true;
        }
    }
}
var copyPlayerData = null;
var copyTrainerLv = -1;
var copyGold = -1;
var copyKeikenKakera = -1;
var copyBox = null;
var copyZukan_yZukan = null;
var copyZukan_mZukan = null;
var copyWinedTrainerArr = null;
Game_Interpreter.prototype.N_SkipSaveData = function (_setSaveNo) {
    copyTrainerLv = $gameSystem.TrainerLv;
    copyPlayerData = $gameSystem.Player;
    copyBox = $gameSystem.MonBox;
    copyZukan_yZukan = $gameSystem.yZukan;
    copyZukan_mZukan = $gameSystem.mZukan;
    copyWinedTrainerArr = $gameSystem.WinedTrainerArr;
    copyGold = $gameParty._gold;
    copyKeikenKakera = $gameSystem.KeikenKakera;
    this.LoadStarting(_setSaveNo);
    SoundManager.playLoad();
    CharaFlzFlame = 3;
    skipDataBackFlame = 3;
    PicFrame_ReDrawFlg = true;
}
let SkipSaveDataBack = function () {
    if (copyPlayerData != null) {
        $gameSystem.TrainerLv = copyTrainerLv;
        $gameSystem.Player = copyPlayerData;
        $gameSystem.MonBox = copyBox;
        $gameSystem.yZukan = copyZukan_yZukan;
        $gameSystem.mZukan = copyZukan_mZukan;
        $gameSystem.WinedTrainerArr = copyWinedTrainerArr;
        $gameParty._gold = copyGold;
        $gameSystem.KeikenKakera = copyKeikenKakera;
        Skipチケープ変化();
        copyPlayerData = null;
        copyTrainerLv = -1;
        copyGold = -1;
        copyKeikenKakera = -1;
        copyBox = null;
        copyZukan_yZukan = null;
        copyZukan_mZukan = null;
        copyWinedTrainerArr = null;
    }
}
var skipDataBackFlame = 0;
let NupuDataSkipUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    if (skipDataBackFlame > 0) {
        skipDataBackFlame--;
        if (skipDataBackFlame == 0) SkipSaveDataBack();
    }
    NupuDataSkipUpdate.call(this);
}
let DbgSelecter;
Game_Interpreter.prototype.N_DbgEx_Start = function () {
    DbgBBtlEmNo = -1;
    DbgSelecter = new OneSelecter(Dbg_ViewArr.length - 1);
    this.SetSprite(PN_DbgBase, DbgPath + "PN_DbgBase", 0, 0);
    this.DelSpriteSpan(PN_DbgTxt, PN_DbgTxt + 19);
    for (let i = 0; i <= Dbg_ViewArr.length - 1; i++) {
        this.SpriteStr(PN_DbgTxt + i, Dbg_ViewArr[i], 24, 1110, 70 + i * 35);
    }
    this.SetSprite(PN_DbgSelecter, DbgPath + "PN_DbgSelecter", 1110, 70 + DbgSelecter.selecterNo * 35);
}
let DbgFlameTopSwitch = false;
Game_Interpreter.prototype.N_DbgEx_Update = function () {
    if (Dbg_Mode_TemotiCngFlg) {
        this.Dbg_Mode_TemotiCng_Update();
        return true; 
    }
    if (N_DbgS_Flg) {
        this.N_DbgS_Update();
        return true;
    }
    if (N_DbgB_Flg) {
        this.N_DbgB_Update();
        return true;
    }
    let _okFlg = false;
    let _ckArr = [];
    for (let i = 0; i <= Dbg_ViewArr.length - 1; i++) {
        _ckArr.push(PN_DbgTxt + i);
    }
    let _ckPicNo = overPointerSpCkArr_GetNo(_ckArr);
    if (_ckPicNo != -1) {
        DbgSelecter.selecterNo = _ckPicNo;
        _okFlg = TouchInput.isTriggered();
    }
    if (Input.isTriggered('up')) {
        DbgSelecter.selectNo_Up();
    }
    if (Input.isTriggered('down')) {
        DbgSelecter.selectNo_Down();
    }
    if (DbgSelecter.IsSelecterMove) {
        this.SetSprite(PN_DbgSelecter, DbgPath + "PN_DbgSelecter",
            1110, 70 + DbgSelecter.selecterNo * 35);
    }
    if (Input.isTriggered('ok') || _okFlg) {
        switch (Dbg_ViewArr[DbgSelecter.selecterNo]) {
            case "手持ち：自由変更":
                this.Dbg_Mode_TemotiCng_Start();
                break;
            case "全アイテム50ゲット":
                AllItem50Get();
                this.DelSpriteSpan(PN_DbgBase, PN_DbgTxt + 19);
                return false; 
            case "手持ちｾｰﾌﾞ/ﾛｰﾄﾞ":
                this.N_DbgS_Start();
                break;
            case "自由敵戦闘":
                this.N_DbgB_Start();
                break;
            case "フレーム情報削除":
                DbgFlameTopSwitch = !DbgFlameTopSwitch;
                if (DbgFlameTopSwitch) _フレーム上情報非表示();
                else _フレーム上情報表示();
                DbgPMenuEndFlg = true;
                SoundManager.playOk();
                break;
            case "図鑑全て取得":
                for (let i = 0; i <= $gameSystem.yZukan.length - 1; i++) {
                    $gameSystem.yZukan[i].lookFlg = true;
                    $gameSystem.yZukan[i].getFlg = true;
                }
                for (let i = 0; i <= $gameSystem.mZukan.length - 1; i++) {
                    $gameSystem.mZukan[i].lookFlg = true;
                    $gameSystem.mZukan[i].getFlg = true;
                }
                DbgPMenuEndFlg = true;
                SoundManager.playOk();
                break;
            case "デバッグモード終了":
                this.DelSpriteSpan(PN_DbgBase, PN_DbgTxt + 19);
                this.DbgModeEnd();
                DbgPMenuEndFlg = true;
                break;
        }
    }
    if (Input.isTriggered('menu') || Input.isTriggered('dbg_Ex') || TouchInput.isCancelled() || DbgPMenuEndFlg) {
        DbgPMenuEndFlg = false;
        this.DelSpriteSpan(PN_DbgBase, PN_DbgTxt + 19);
        return false; 
    }
    return true; 
}
let AllItem50Get = function () {
    for (let i = 1; i <= $dataItems.length - 1; i++) {
        if ($dataItems[i].name != "") {
            $gameParty.gainItem($dataItems[i], 50)
        }
    }
}
const DbgYPath = "pictures/_Debug/DbgY/";
const PN_DbgYSetBase = PN_DbgTxt;
const PN_DbgYTxt = PN_DbgYSetBase + 1;
const PN_DbgYSelNo = PN_DbgYTxt + 1;
const PN_DbgYSkip = PN_DbgYSelNo + 12;
const PN_DbgYDrawTxt = PN_DbgYSkip + 1;
const PN_DbgYSelBase = PN_DbgYDrawTxt + 20;
const PN_DbgYSelChara = PN_DbgYSelBase + 1;
const PN_DbgYSelLv = PN_DbgYSelChara + 1;
const PN_DbgYStarRank = PN_DbgYSelLv + 2
const PN_DbgYKettei = PN_DbgYStarRank + 1;
let Dbg_Mode_TemotiCngFlg = false;
let DbgY_SettingNo = 0; 
let DbgY_SelectNoGrp = 0; 
let DbgY_SelectChrNo = 0;   
let DbyY_SelStarRank = 0;
let DbgY_SelectLvCnt = [0, 0];
let DbgYSelNoPicArr = [];
for (let i = 0; i <= 12 - 1; i++) {
    DbgYSelNoPicArr.push(PN_DbgYSelNo + i);
}
let DbgYMonTxtPicArr = [];
for (let i = 0; i <= 20 - 1; i++) {
    DbgYMonTxtPicArr.push(PN_DbgYDrawTxt + i);
}
Game_Interpreter.prototype.Dbg_Mode_TemotiCng_Start = function () {
    DbgY_SettingNo = 0;
    Dbg_Mode_TemotiCngFlg = true;
    this.SetSprite(PN_DbgYSetBase, DbgYPath + "PN_DbgYSetBase", 0, 0);
    this.Dbg_Mode_DbgY_ReDraw();
    this.SetSprite(PN_DbgYKettei, DbgYPath + "PN_DbgYKettei", 780, 700);
    $gameSystem.Player.syojiTikemon = [];
}
Game_Interpreter.prototype.Dbg_Mode_DbgY_ReDraw = function () {
    this.SpriteStr(PN_DbgYTxt, (DbgY_SettingNo + 1) + "体目", 32, 319, 18);
    this.SetSprite(PN_DbgYSelNo + 0, DbgYPath + "PN_DbgYSelNo1", 338 + 138 * 0, 70);
    this.SetSprite(PN_DbgYSelNo + 1, DbgYPath + "PN_DbgYSelNo2", 338 + 138 * 1, 70);
    this.SetSprite(PN_DbgYSelNo + 2, DbgYPath + "PN_DbgYSelNo3", 338 + 138 * 2, 70);
    this.SetSprite(PN_DbgYSelNo + 3, DbgYPath + "PN_DbgYSelNo4", 338 + 138 * 3, 70);
    this.SetSprite(PN_DbgYSelNo + 4, DbgYPath + "PN_DbgYSelNo5", 338 + 138 * 4, 70);
    this.SetSprite(PN_DbgYSelNo + 5, DbgYPath + "PN_DbgYSelNo6", 338 + 138 * 5, 70);
    this.SetSprite(PN_DbgYSelNo + 6, DbgYPath + "PN_DbgYSelNo7", 338 + 138 * 0, 112);
    this.SetSprite(PN_DbgYSelNo + 7, DbgYPath + "PN_DbgYSelNo8", 338 + 138 * 1, 112);
    this.SetSprite(PN_DbgYSelNo + 8, DbgYPath + "PN_DbgYSelNo9", 338 + 138 * 2, 112);
    this.SetSprite(PN_DbgYSelNo + 9, DbgYPath + "PN_DbgYSelNo10", 338 + 138 * 3, 112);
    this.SetSprite(PN_DbgYSelNo + 10, DbgYPath + "PN_DbgYSelNo11", 338 + 138 * 4, 112);
    this.SetSprite(PN_DbgYSelNo + 11, DbgYPath + "PN_DbgYSelNo12", 338 + 138 * 5, 112);
    if (DbgY_SettingNo == 0) {
        this.DelSprite(PN_DbgYSkip);
    } else {
        this.SetSprite(PN_DbgYSkip, DbgYPath + "PN_DbgYSkip", 625, 112);
    }
    this.DelSpriteSpan(PN_DbgYDrawTxt, PN_DbgYDrawTxt + 19)
    for (let i = 0; i <= 20 - 1; i++) {
        let _ckNo = i + DbgY_SelectNoGrp * 20;
        if ($N_Yarimon_DB.mZukanDatas.length - 1 <= _ckNo) break;
        this.SpriteStr(PN_DbgYDrawTxt + i, $N_Yarimon_DB.mZukanDatas[_ckNo].name,
            24, 370, 160 + 28 * i);
    }
    this.SetSpriteC(PN_DbgYSelLv + 0, DbgPath + "PN_DbgSelR",
        814 + 20, 307 + 13 + DbgY_SelectLvCnt[0] * 35);
    this.SetSpriteC(PN_DbgYSelLv + 1, DbgPath + "PN_DbgSelL",
        814 + 80 + 35, 307 + 13 + DbgY_SelectLvCnt[1] * 35);
    this.SetSprite(PN_DbgYStarRank, DbgYPath + "PN_DbgYStarRank", 726 + 31 * DbyY_SelStarRank, 173)
}
Game_Interpreter.prototype.Dbg_Mode_TemotiCng_Update = function () {
    this.SpriteCngColorArr(DbgYSelNoPicArr);
    this.SpriteCngColorArr(DbgYMonTxtPicArr);
    this.SpriteCngColor(PN_DbgYDrawTxt + DbgY_SelectChrNo, [150, 0, 0, 0]);
    this.SpriteCngColor(PN_DbgYSelNo + DbgY_SelectNoGrp, [100, 100, 150, 0]);
    this.SpriteCngColor(PN_DbgYSkip);
    this.SpriteCngColor(PN_DbgYKettei);
    let _ckPicNo = overPointerSpCkArr_GetNo(DbgYSelNoPicArr);
    if (_ckPicNo != -1) {
        this.SpriteCngColor(PN_DbgYSelNo + _ckPicNo, [100, 100, 100, 0]);
        if (TouchInput.isTriggered()) {
            DbgY_SelectChrNo = 0;
            DbgY_SelectNoGrp = _ckPicNo;
            this.Dbg_Mode_DbgY_ReDraw();
        }
    }
    if (overPointerSpCk(PN_DbgYSkip)) {
        this.SpriteCngColor(PN_DbgYSkip, [100, 100, 100, 0]);
        if (TouchInput.isTriggered()) {
            Dbg_Mode_TemotiCngFlg = false; 
        }
    }
    _ckPicNo = overPointerSpCkArr_GetNo(DbgYMonTxtPicArr);
    if (_ckPicNo != -1) {
        this.SpriteCngColor(PN_DbgYDrawTxt + _ckPicNo, [150, 150, 150, 0]);
        if (TouchInput.isTriggered()) {
            DbgY_SelectChrNo = _ckPicNo;
            this.Dbg_Mode_DbgY_ReDraw();
        }
    }
    if (overPointerSpCk(PN_DbgYKettei)) {
        this.SpriteCngColor(PN_DbgYKettei, [100, 100, 100, 0]);
        if (TouchInput.isTriggered()) {
            let _CharaNo = DbgY_SelectChrNo + DbgY_SelectNoGrp * 20;
            let _CharaLv = DbgY_SelectLvCnt[0] * 10 + DbgY_SelectLvCnt[1];
            $gameSystem.Player.syojiTikemon.push(GetYarimonNo(_CharaNo + 1, _CharaLv, DbyY_SelStarRank));
            DbgY_SettingNo++;
            if (DbgY_SettingNo == 3) {
                this.Dbg_Mode_DbgY_ReDraw();
                Dbg_Mode_TemotiCngFlg = false; 
                this.DelSpriteSpan(PN_DbgYSetBase, PN_DbgYKettei);
                this.N_DbgEx_Start();
            }
        }
    }
    let _ckPicArr = [];
    for (let i = 0; i < 10; i++) _ckPicArr.push([814, 307 + i * 35, 55, 26]);
    let _ckNo = overSpriteClickable(PN_DbgYSetBase, _ckPicArr);
    if (_ckNo != -1 && TouchInput.isTriggered()) {
        DbgY_SelectLvCnt[0] = _ckNo;
        this.Dbg_Mode_DbgY_ReDraw();
    }
    _ckPicArr = [];
    for (let i = 0; i < 10; i++) _ckPicArr.push([814 + 80, 307 + i * 35, 55, 26]);
    _ckNo = overSpriteClickable(PN_DbgYSetBase, _ckPicArr);
    if (_ckNo != -1 && TouchInput.isTriggered()) {
        DbgY_SelectLvCnt[1] = _ckNo;
        this.Dbg_Mode_DbgY_ReDraw();
    }
    _ckPicArr = [];
    for (let i = 0; i < 10; i++) _ckPicArr.push([716 + (31 * i), 173, 28, 28]);
    _ckNo = overSpriteClickable(PN_DbgYSetBase, _ckPicArr);
    if (_ckNo != -1 && TouchInput.isTriggered()) {
        DbyY_SelStarRank = _ckNo;
        this.Dbg_Mode_DbgY_ReDraw();
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        if (DbgY_SettingNo > 0) {
            Dbg_Mode_TemotiCngFlg = false; 
            this.DelSpriteSpan(PN_DbgYSetBase, PN_DbgYKettei);
            this.N_DbgEx_Start();
        }
    }
}
Game_Interpreter.prototype.N_Dbg_所持モンLvMax = function () {
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        $gameSystem.Player.syojiTikemon[i].lv = $gameSystem.TrainerLv;
    }
}
const DbgSPath = "pictures/_Debug/DbgS/";
const PN_DbgSBase = PN_DbgTxt;
const PN_DbgSSelH = PN_DbgSBase + 1;
const PN_DbgSTxt = PN_DbgSSelH + 1;
let N_DbgS_Flg = false;
class DbgSData {
    constructor(_id, _lv, _sRank) {
        this.Id = _id;
        this.Lv = _lv;
        this.SRank = _sRank;
    }
}
let DbgSDataArr = [];
Game_Interpreter.prototype.N_DbgS_Start = function () {
    N_DbgS_Flg = true;
    this.SetSprite(PN_DbgSBase, DbgSPath + "PN_DbgSBase", 0, 0);
    let _ckStr = "";
    try {
        let ckfs = require('fs');
        _ckStr = ckfs.readFileSync("saveYarimon.txt", 'utf-8');
    } catch (e) {
        _ckStr = "";
        for (let i = 0; i <= 14 - 1; i++) {
            _ckStr += "\n";
        }
        try {
            let ckfs = require('fs');
            let stream = ckfs.createWriteStream("saveYarimon.txt");
            stream.write(_ckStr, 'utf-8');
            stream.end("");
        } catch (e2) {}
    }
    DbgSDataArr = [];
    let _ckArr = _ckStr.split('\n');
    for (let i = 0; i <= _ckArr.length - 1; i++) {
        if (i >= 14) break;
        let _dataArr = _ckArr[i].split('■');
        let _sDataArr = [];
        for (let j = 0; j <= _dataArr.length - 1; j++) {
            let _setStr = _dataArr[j].split(',');
            if (_setStr.length >= 3) {
                _sDataArr.push(
                    new DbgSData(Number(_setStr[0]), Number(_setStr[1]), Number(_setStr[2]))
                );
            }
        }
        DbgSDataArr.push(_sDataArr);
    }
    this.N_DbgS_ReDraw();
}
Game_Interpreter.prototype.DbgS_DataSave = function (_No) {
    let _setArr = [];
    for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
        let _Mon = $gameSystem.Player.syojiTikemon[i];
        _setArr.push(new DbgSData(_Mon.id, _Mon.lv, Math.floor(_Mon.btlCount / StarRankBtlValue)));
    }
    DbgSDataArr[_No] = _setArr;
    let _saveStr = "";
    for (let i = 0; i <= DbgSDataArr.length - 1; i++) {
        let _ssStr = "";
        for (let j = 0; j <= DbgSDataArr[i].length - 1; j++) {
            if (_ssStr != "") _ssStr += "■";
            _ssStr += DbgSDataArr[i][j].Id + "," + DbgSDataArr[i][j].Lv + "," + DbgSDataArr[i][j].SRank;
        }
        _saveStr += _ssStr + "\n";
    }
    try {
        let ckfs = require('fs');
        let stream = ckfs.createWriteStream("saveYarimon.txt");
        stream.write(_saveStr, 'utf-8');
        stream.end("");
    } catch (e) {}
    this.N_DbgS_ReDraw();
}
Game_Interpreter.prototype.N_DbgS_ReDraw = function () {
    DText_NRZureY = -4;
    for (let i = 0; i <= DbgSDataArr.length - 1; i++) {
        let _ckStr = "";
        for (let j = 0; j <= DbgSDataArr[i].length - 1; j++) {
            let _Mon = new YarimonData(DbgSDataArr[i][j].Id, DbgSDataArr[i][j].Lv);
            _ckStr += _Mon.YarimonData.name + ":Lv." + DbgSDataArr[i][j].Lv +
                ":" + DbgSDataArr[i][j].SRank + "\n";
        }
        let _X = i % 2;
        let _Y = Math.floor(i / 2);
        this.SpriteStr(PN_DbgSTxt + i, _ckStr, 16, 523 - 182 + 360 * _X, 91 + 3 + 100 * _Y);
    }
    DText_NRZureY = 0;
}
Game_Interpreter.prototype.N_DbgS_Update = function () {
    let _ckArr_Save = [];
    let _ckArr_Load = [];
    for (let i = 0; i <= 14 - 1; i++) {
        let _X = i % 2;
        let _Y = Math.floor(i / 2);
        _ckArr_Save.push([523 + 360 * _X, 91 + 100 * _Y, 60, 60]);
        _ckArr_Load.push([523 + 72 + 360 * _X, 91 + 100 * _Y, 60, 60]);
    }
    this.DelSprite(PN_DbgSSelH);
    let _ckSaveNo = overSpriteClickable(PN_DbgSBase, _ckArr_Save);
    if (_ckSaveNo != -1) {
        let _X = _ckSaveNo % 2;
        let _Y = Math.floor(_ckSaveNo / 2);
        this.SetSprite(PN_DbgSSelH, DbgSPath + "PN_DbgSSelH", 523 + 360 * _X, 91 + 100 * _Y);
        if (TouchInput.isTriggered()) {
            this.DbgS_DataSave(_ckSaveNo);
            this.N_DbgS_ReDraw();
        }
    }
    let _ckLoadNo = overSpriteClickable(PN_DbgSBase, _ckArr_Load);
    if (_ckLoadNo != -1) {
        let _X = _ckLoadNo % 2;
        let _Y = Math.floor(_ckLoadNo / 2);
        this.SetSprite(PN_DbgSSelH, DbgSPath + "PN_DbgSSelH", 523 + 72 + 360 * _X, 91 + 100 * _Y);
        this.N_DbgS_ReDraw();
        if (TouchInput.isPressed() && DbgSDataArr[_ckLoadNo].length > 0) {
            $gameSystem.Player.syojiTikemon = [];
            for (let i = 0; i <= DbgSDataArr[_ckLoadNo].length - 1; i++) {
                $gameSystem.Player.syojiTikemon.push(
                    new YarimonData(
                        DbgSDataArr[_ckLoadNo][i].Id,
                        DbgSDataArr[_ckLoadNo][i].Lv,
                        DbgSDataArr[_ckLoadNo][i].SRank
                    )
                );
            }
        }
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        N_DbgS_Flg = false; 
        this.DelSpriteSpan(PN_DbgYSetBase, PN_DbgYKettei);
        this.N_DbgEx_Start();
    }
}
const DbgBPath = "pictures/_Debug/DbgB/";
const PN_DbgBBase = PN_DbgTxt;
const PN_DbgBSelNo = PN_DbgBBase + 1;
const PN_DbgBDrawTxt = PN_DbgBSelNo + 8;
let DbgBSelNoPicArr = [];
for (let i = 0; i <= 8 - 1; i++) {
    DbgBSelNoPicArr.push(PN_DbgBSelNo + i);
}
let DbgBMonTxtPicArr = [];
for (let i = 0; i <= 20 - 1; i++) {
    DbgBMonTxtPicArr.push(PN_DbgBDrawTxt + i);
}
let DbgB_SelectNoGrp = 0; 
let N_DbgB_Flg = false;
Game_Interpreter.prototype.N_DbgB_Start = function () {
    N_DbgB_Flg = true;
    this.SetSprite(PN_DbgBBase, DbgBPath + "PN_DbgBBase", 0, 0);
    this.Dbg_Mode_DbgB_ReDraw();
}
Game_Interpreter.prototype.Dbg_Mode_DbgB_ReDraw = function () {
    this.SetSprite(PN_DbgYSelNo + 0, DbgYPath + "PN_DbgYSelNo1", 338 + 138 * 0, 70);
    this.SetSprite(PN_DbgYSelNo + 1, DbgYPath + "PN_DbgYSelNo2", 338 + 138 * 1, 70);
    this.SetSprite(PN_DbgYSelNo + 2, DbgYPath + "PN_DbgYSelNo3", 338 + 138 * 2, 70);
    this.SetSprite(PN_DbgYSelNo + 3, DbgYPath + "PN_DbgYSelNo4", 338 + 138 * 3, 70);
    this.SetSprite(PN_DbgYSelNo + 4, DbgYPath + "PN_DbgYSelNo5", 338 + 138 * 4, 70);
    this.SetSprite(PN_DbgYSelNo + 5, DbgYPath + "PN_DbgYSelNo6", 338 + 138 * 5, 70);
    this.SetSprite(PN_DbgYSelNo + 6, DbgYPath + "PN_DbgYSelNo7", 338 + 138 * 0, 112);
    this.SetSprite(PN_DbgYSelNo + 7, DbgYPath + "PN_DbgYSelNo8", 338 + 138 * 1, 112);
    this.SetSprite(PN_DbgYSelNo + 8, DbgYPath + "PN_DbgYSelNo9", 338 + 138 * 2, 112);
    this.SetSprite(PN_DbgYSelNo + 9, DbgYPath + "PN_DbgYSelNo10", 338 + 138 * 3, 112);
    this.SetSprite(PN_DbgYSelNo + 10, DbgYPath + "PN_DbgYSelNo11", 338 + 138 * 4, 112);
    this.SetSprite(PN_DbgYSelNo + 11, DbgYPath + "PN_DbgYSelNo12", 338 + 138 * 5, 112);
    this.DelSpriteSpan(PN_DbgBDrawTxt, PN_DbgBDrawTxt + 19)
    for (let i = 0; i <= 20 - 1; i++) {
        let _ckNo = DbgB_SelectNoGrp * 20 + i;
        if ($N_Yarimon_DB.trainers.length - 1 <= _ckNo) break;
        this.SpriteStr(PN_DbgYDrawTxt + i, $N_Yarimon_DB.trainers[_ckNo].name,
            24, 370, 160 + 28 * i);
    }
}
Game_Interpreter.prototype.N_DbgB_Update = function () {
    this.SpriteCngColorArr(DbgBSelNoPicArr);
    this.SpriteCngColorArr(DbgBMonTxtPicArr);
    let _ckPicNo = overPointerSpCkArr_GetNo(DbgBSelNoPicArr);
    if (_ckPicNo != -1) {
        this.SpriteCngColor(PN_DbgBSelNo + _ckPicNo, [100, 100, 100, 0]);
        if (TouchInput.isTriggered()) {
            DbgB_SelectNoGrp = _ckPicNo;
            this.Dbg_Mode_DbgB_ReDraw();
        }
    }
    _ckPicNo = overPointerSpCkArr_GetNo(DbgBMonTxtPicArr);
    if (_ckPicNo != -1) {
        this.SpriteCngColor(PN_DbgBDrawTxt + _ckPicNo, [150, 150, 150, 0]);
        if (TouchInput.isTriggered()) {
            N_DbgB_Flg = false; 
            this.DelSpriteSpan(PN_DbgBBase, PN_DbgYDrawTxt + 19);
            DbgBBtlEmNo = _ckPicNo + (DbgB_SelectNoGrp * 20) - 2;
            DbgBBtlEmNo = $N_Yarimon_DB.trainers[DbgBBtlEmNo].id;
            DbgPMenuEndFlg = true;
        }
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        N_DbgS_Flg = false; 
        this.DelSpriteSpan(PN_DbgBBase, PN_DbgYDrawTxt + 19);
        this.N_DbgEx_Start();
    }
}
const PN_DbgBtl_Base = 450;
const PN_DbgBtl = PN_DbgBtl_Base + 1;
Game_Interpreter.prototype.BtlDbgDraw = function () {
    this.SetSprite(PN_DbgBtl + 0, DbgBPath + "PN_DbgBtl_1", 1181, 72);
    this.SetSprite(PN_DbgBtl + 1, DbgBPath + "PN_DbgBtl_2", 1291, 72);
    this.SetSprite(PN_DbgBtl + 2, DbgBPath + "PN_DbgBtl_3", 1361, 72);
}
let BtlDbg_NUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    BtlDbg_NUpdate.call(this);
    if (battle_Class.isBattle && DbgFlg) {
        this.SpriteCngColorArr([PN_DbgBtl + 0, PN_DbgBtl + 1, PN_DbgBtl + 2]);
        let _ckPic = overPointerSpCkArr([PN_DbgBtl + 0, PN_DbgBtl + 1, PN_DbgBtl + 2]);
        if (_ckPic != -1) {
            this.SpriteCngColor(_ckPic, [70, 70, 70, 0]);
            if (TouchInput.isTriggered()) {
                switch (_ckPic) {
                    case PN_DbgBtl + 0: 
                        for (let i = 0; i <= battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas.length - 1; i++) {
                            if (battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[i].id == WazaID._チートタックル) {
                                battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[i].reChargeTurn = 0;
                            }
                        }
                        break;
                    case PN_DbgBtl + 1: 
                        this.DelSpriteSpan(PN_BtlSelectBase, PN_BtlLayer2Base);
                        this.DelSprite(PN_BtlSelecter);
                        battle_Class.ModeCng(Battle_Class.Btl_End); 
                        battle_Class.mode.WinFlg = true;
                        break;
                    case PN_DbgBtl + 2: 
                        this.DelSpriteSpan(PN_BtlSelectBase, PN_BtlLayer2Base);
                        this.DelSprite(PN_BtlSelecter);
                        battle_Class.ModeCng(Battle_Class.Btl_End); 
                        battle_Class.mode.WinFlg = false;
                        break;
                }
            }
        }
    }
}
let NS_DbgUpdate = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    NS_DbgUpdate.call(this);
    if (DbgFlg) {
        let _dbgNo = -1;
        if (Input.isTriggered('dbg_0')) _dbgNo = 0;
        if (Input.isTriggered('dbg_1')) _dbgNo = 1;
        if (Input.isTriggered('dbg_2')) _dbgNo = 2;
        if (Input.isTriggered('dbg_3')) _dbgNo = 3;
        if (Input.isTriggered('dbg_4')) _dbgNo = 4;
        if (Input.isTriggered('dbg_5')) _dbgNo = 5;
        if (Input.isTriggered('dbg_6')) _dbgNo = 6;
        if (Input.isTriggered('dbg_7')) _dbgNo = 7;
        if (Input.isTriggered('dbg_8')) _dbgNo = 8;
        if (Input.isTriggered('dbg_9')) _dbgNo = 9;
        if (_dbgNo != -1) this.Dbg_KeyDown(_dbgNo);
    }
}
let Dbg_HelpTxt = [
    "0キー：◆デバッグコマンド一覧　を閉じる",
    "1キー：プレイヤーのHPを0に",
    "2キー：敵のHPを0に",
    "3キー：プレイヤーのHPを1に",
    "4キー：敵のHPを1に",
    "5キー：",
    "6キー：",
    "7キー：所持金を0に",
    "8キー：所持金+10000",
    "9キー："
];
const _DbgPicNo = PVS_MaxPicNo - 15; 
let _DbgDrawFlg = false;
Game_Interpreter.prototype.Dbg_helpDraw = function () {
    this.SetSprite(_DbgPicNo, "system/DbgHelp", NErrPos._x, NErrPos._y);
    D_Text_Cng_font = ""; 
    let fseSet = "\\ow[0]"
    for (let i = 0; i <= Dbg_HelpTxt.length - 1; i++) {
        this.SpriteStr(_DbgPicNo + 1 + i, fseSet + Dbg_HelpTxt[i], 16, NErrPos._x + 34, NErrPos._y + 39 + (20 * i));
        if (i == 10) {
            break;
        }
    }
    D_Text_Cng_font = ""; 
    _DbgDrawFlg = true;
}
Game_Interpreter.prototype.Dbg_KeyDown = function (_DbgNo) {
    if (_DbgDrawFlg) {
        this.DelSpriteSpan(_DbgPicNo, PVS_MaxPicNo);
    }
    switch (_DbgNo) {
        case 1: 
            if (battle_Class.isBattle) battle_Class.plYarimons[battle_Class.PLMonNo].hp = 0;
            break;
        case 2: 
            if (battle_Class.isBattle) battle_Class.emYarimons[battle_Class.EmMonNo].hp = 0;
            break;
        case 3: 
            if (battle_Class.isBattle) battle_Class.plYarimons[battle_Class.PLMonNo].hp = 1;
            break;
        case 4: 
            if (battle_Class.isBattle) battle_Class.emYarimons[battle_Class.EmMonNo].hp = 1;
            break;
        case 5:
            break;
        case 6:
            break;
        case 7: 
            $gameParty.gainGold(-99999999);
            break;
        case 8: 
            $gameParty.gainGold(10000);
            break;
        case 9:
            break;
        case 0: 
            if (!_DbgDrawFlg) {
                this.Dbg_helpDraw();
            } else {
                _DbgDrawFlg = false;
            }
            break;
    }
    console.log(Dbg_HelpTxt[_DbgNo]);
    if (_DbgNo != 0) _DbgDrawFlg = false;
}
Game_Interpreter.prototype.MonBoxDebug = function () {
    $gameSystem.MonBox = []; 
    for (let i = 0; i <= 14 - 1; i++) {
        let _BoxArr = [];
        for (let j = 0; j <= 20 - 1; j++) {
            _BoxArr.push(null);
        }
        $gameSystem.MonBox.push(_BoxArr);
    }
    for (let i = 0; i <= 40 - 1; i++) {
        MonBoxAdd(new YarimonData(1, i + 1));
    }
}
