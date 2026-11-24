const PN_ftTikeBar = PN_PicFlameTop + 1;
const PN_ftTikeState = PN_ftTikeBar + (dmBtnPicCnt * 3);
const ft_IjoPicCnt = 6;
const PN_ftTikeEmBar = PN_ftTikeState + (ft_IjoPicCnt * 3);
const ft_EmPicCnt = 3;
const PN_ftPlYarare = PN_ftTikeEmBar + (ft_EmPicCnt * 3);
const PN_ftWeekPl = PN_ftPlYarare + 3;
const PN_ftWeekEm = PN_ftWeekPl + 6;
const PN_ftStateCng = PN_ftWeekEm + 6;
const PN_ftNewWaza = PN_ftStateCng + 2;
const PN_ftTorLvTxt = PN_ftNewWaza + 3;
const PN_ftYaseiKaihi = PN_ftTorLvTxt + 1;
const PN_ftMetamo = PN_ftYaseiKaihi + 3;
const PN_ftEnd = 480;
const PN_ExAtkCount = PN_ftEnd - 1;
const PN_ftHintBase = 423;
const PN_ftHintTxt = PN_ftHintBase + 1;
let befFrameTop表示 = false;
let befHintTop表示 = false;
let befNewWaza表示Arr = [false, false, false];
let Nupu_PicFrameTop_Initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    Nupu_PicFrameTop_Initialize.call(this);
    this.FrameTop表示 = false;    
    this.HintTop表示 = false;     
};
const SW_フレームヒビ版に = 189;
Game_Interpreter.prototype.PicFrameBaseDraw = function () {
    if ($gameSwitches.value(SW_フレームヒビ版に)) {
        this.SetSprite(PN_PicFlame, "PN_PicFlame_2", 0, 0);
    } else {
        this.SetSprite(PN_PicFlame, "PN_PicFlame", 0, 0);
    }
}
Game_Interpreter.prototype.PicFrameDel = function () {
    this.DelSprite(PN_PicFlame);
}
let _フレーム上情報表示 = function () {
    $gameSystem.FrameTop表示 = true;
}
let PN_PicFrameTop_ImgCng = function (_img) {
    this.SetSprite(PN_PicFlameTop, _img, 0, 0);
}
let _フレーム上情報非表示 = function () {
    $gameSystem.FrameTop表示 = false;
}
let _フレーム上Hint表示 = function () {
    $gameSystem.HintTop表示 = true;
}
let _フレーム上Hint非表示 = function () {
    $gameSystem.HintTop表示 = false;
}
let picFlamePlayerCharaArr = [];
let picFlameEnemyCharaArr = [];
class BefCharaData {
    constructor(_lv, _id, _hp, _mhp) {
        this.lv = _lv;
        this.id = _id;
        this.hp = _hp;
        this.mhp = _mhp;
        this.Ijos = [];
        this.Rank = [0, 0, 0, 0, 0]; 
        this.viewFlg = true;
    }
}
let Get弱点IconStr = function (ckType) { 
    let _jakutenArr = [];
    if (BtlStatic.Type_相性Get(ckType, ConstType._無) > 1) _jakutenArr.push(ConstType._無);
    if (BtlStatic.Type_相性Get(ckType, ConstType._火) > 1) _jakutenArr.push(ConstType._火);
    if (BtlStatic.Type_相性Get(ckType, ConstType._水) > 1) _jakutenArr.push(ConstType._水);
    if (BtlStatic.Type_相性Get(ckType, ConstType._風) > 1) _jakutenArr.push(ConstType._風);
    if (BtlStatic.Type_相性Get(ckType, ConstType._土) > 1) _jakutenArr.push(ConstType._土);
    if (BtlStatic.Type_相性Get(ckType, ConstType._光) > 1) _jakutenArr.push(ConstType._光);
    if (BtlStatic.Type_相性Get(ckType, ConstType._闇) > 1) _jakutenArr.push(ConstType._闇);
    let rtnStr = "";
    _jakutenArr.forEach(_SkillType => {
        if (_SkillType == ConstType._無) rtnStr += "\\I[1]";
        if (_SkillType == ConstType._火) rtnStr += "\\I[2]";
        if (_SkillType == ConstType._水) rtnStr += "\\I[3]";
        if (_SkillType == ConstType._風) rtnStr += "\\I[4]";
        if (_SkillType == ConstType._土) rtnStr += "\\I[5]";
        if (_SkillType == ConstType._光) rtnStr += "\\I[6]";
        if (_SkillType == ConstType._闇) rtnStr += "\\I[7]";
    });
    return rtnStr;
}
const VN_ExAtkCount = 60;   
Game_Interpreter.prototype.PicFrameDraw = function (ckNo, ckData, picFlameData) {
    let _setX = 67;
    let _setY = 164 + (180 * ckNo);
    if (picFlameData.viewFlg) {
        this.SetSprite(PN_PicFlame, "PN_PicFlame", 0, 0);
        this.YarimonWakuDrawSprite(PN_ftTikeBar + (ckNo * dmBtnPicCnt), ckData, _setX, _setY);
        if (ckData.hp != 0) {
            this.DelSprite(PN_ftPlYarare + ckNo);
            this.DelSpriteSpan(PN_ftWeekPl + ckNo * 2, PN_ftWeekPl + ckNo * 2 + 1);
            let _rtnStr = Get弱点IconStr(ckData.YarimonData.state.type);
            if (_rtnStr != "") {
                DText_NRZureX = -10;
                this.SetSprite(PN_ftWeekPl + ckNo * 2, "PN_ftWeek", _setX + 107, _setY + 118);
                this.SpriteStr(PN_ftWeekPl + ckNo * 2 + 1, _rtnStr, 24, _setX + 107 + 8, _setY + 118 + 20 , 255 , 80 , 80);
                DText_NRZureX = 0;
            }
        } else {
            this.SetSprite(PN_ftPlYarare + ckNo, "PN_PicFlameTop_Batu", _setX, _setY + 20)
        }
    } else {
        this.SetSprite(PN_ftTikeBar + (ckNo * dmBtnPicCnt), "PN_PicFlameTop_Que", _setX, _setY + 20);
    }
    if ($gameVariables.value(VN_ExAtkCount) > 0) {
        this.SpriteStrC( PN_ExAtkCount , " Ex Attack Count " + $gameVariables.value(VN_ExAtkCount) + " ", 10 , 720 , 778);
    }
}
let picHintDrawStr = "";
let picSubHintDrawStr = "";
Game_Interpreter.prototype.PicFrameHintDraw = function () {
    if ($gameSystem.HintTop表示) {
        DText_NRZureY = 0;
        let zureX = 0;
        this.SetSprite(PN_ftHintBase, "PN_ftHintBase", zureX, 0, 255);
        if ($gameVariables.value(VN_HintTxt) == 0) $gameVariables.setValue(VN_HintTxt, "");
        picHintDrawStr = $gameVariables.value(VN_HintTxt);
        let _setStr = "";
        let _setTextSize = 16;
        _setStr = Str_文字数改行(picHintDrawStr, 13);
        if (LngMode == "en") {
            if (picHintDrawStr != 0) _setStr = wrapText(picHintDrawStr , 30);
            _setTextSize = 15;
        }
        this.SpriteStr(PN_ftHintTxt + 0, _setStr, _setTextSize, 1215 + zureX, 310);
        this.MoveSpriteAdd(PN_ftHintBase, -zureX, 0, 5);
        let _arrStr = Str_SubArrGet();
        picSubHintDrawStr = _arrStr;
        this.SpriteStr(PN_ftHintTxt + 1, _arrStr, _setTextSize, 1215 + zureX, 310 + 73);
        this.MoveSpriteAdd(PN_ftHintTxt + 1, -zureX, 0, 5);
        for (let i = 0; i <= 6 - 1; i++) {
            this.MoveSpriteAdd(PN_ftHintTxt + i, -zureX, 0, 5);
        }
    } else {
        this.DelSpriteSpan(PN_ftHintBase, PN_ftHintTxt + 5);
    }
}
let Str_文字数改行 = function (_str, _cnt) {
    let _rtnStr = "";
    for (let i = 0; i < _str.length; i += _cnt) {
        if (_rtnStr != "") _rtnStr += "\n";
        _rtnStr += _str.slice(i, i + _cnt);
    }
    return _rtnStr;
}
let Str_SubArrGet = function () {
    let _arrStr = "";
    for (let i = 0; i <= 6 - 1; i++) {
        if ($gameVariables.value(VN_HintTxt + 1 + i) == 0) {
            $gameVariables.setValue(VN_HintTxt + 1 + i, "");
        }
        let _setStr = Str_文字数改行($gameVariables.value(VN_HintTxt + 1 + i), 13);
        if (LngMode == "en") {
            var ckStr = $gameVariables.value(VN_HintTxt + 1 + i);
            _setStr = wrapText(ckStr , 30);
        }
        if (_setStr != "") {
            _arrStr += _setStr + "\n";
        }
    }
    return _arrStr;
}
Game_Interpreter.prototype.PicFrameEnemyDraw = function (ckNo, ckData, picFlameData) {
    let _setX = 1235;
    let _setY = 164 + (180 * ckNo);
    if (picFlameData.viewFlg) {
        this.EnemyYarimonWakuDrawSprite(PN_ftTikeEmBar + (ckNo * ft_EmPicCnt), ckData, _setX, _setY);
        if (ckData.hp != 0) {
            this.DelSprite(PN_ftTikeEmBar + (ckNo * ft_EmPicCnt) + 2);
            let _rtnStr = Get弱点IconStr(ckData.YarimonData.state.type);
            if (_rtnStr != "") {
                DText_NRZureX = -10;
                this.SetSprite(PN_ftWeekEm + ckNo * 2, "PN_ftWeek", _setX - 39, _setY + 118);
                this.SpriteStr(PN_ftWeekEm + ckNo * 2 + 1, _rtnStr, 24, _setX - 39 + 8, _setY + 118 + 20);
                DText_NRZureX = 0;
            }
        } else {
            this.SetSprite(PN_ftTikeEmBar + (ckNo * ft_EmPicCnt) + 2, "PN_PicFlameTop_Batu", _setX, _setY + 20);
        }
    } else {
        this.SetSprite(PN_ftTikeEmBar + (ckNo * ft_EmPicCnt), "PN_PicFlameTop_Que", _setX, _setY + 20);
        D_Text_Cng_font = "kdam";    
        this.SpriteStr(PN_ftWeekEm + ckNo * 2 + 1, ckData.lv, 24, _setX - 39 + 8, _setY + 118 + 20);
        var setLv = ckData.lv;
        if (IsEndLaboMode()) setLv = 75;
        this.SpriteStrR(PN_ftWeekEm + ckNo * 2 + 1, SCol.Blk + SWCol.Wht + "Lv." +
            setLv, 24, _setX + 165, _setY + 20);
        D_Text_Cng_font = "";    
    }
}
Game_Interpreter.prototype.PicFrameEnemyReDraw = function () {
    if ($gameSystem.FrameTop表示) {
        for (let i = 0; i <= picFlameEnemyCharaArr.length - 1; i++) {
            let _ckData = battle_Class.emYarimons[i];
            let _pftData = picFlameEnemyCharaArr[i];
            this.PicFrameEnemyDraw(i, _ckData, _pftData);
        }
    }
}
let GetRankStr = function (picFrameData, rankArr) {
    let _DrawStr = "";
    let rnCnt = 0;
    for (let j = 0; j <= rankArr.length - 1; j++) {
        picFrameData.Rank.push(rankArr[j]);
        if (rankArr[j] == 0) continue;
        let BaseIcoNo = 0;
        if (j == 0) BaseIcoNo = 16; 
        if (j == 1) BaseIcoNo = 32; 
        if (j == 2) BaseIcoNo = 48; 
        if (j == 3) BaseIcoNo = 64; 
        if (j == 4) BaseIcoNo = 80; 
        if (rankArr[j] > 0) {
            BaseIcoNo += rankArr[j] - 1;
        } else {
            BaseIcoNo += -rankArr[j] + 8 - 1;
        }
        _DrawStr += "\\I[" + BaseIcoNo + "]";
        rnCnt++;
        if (rnCnt == 2) {
            _DrawStr += "\n";
        }
    }
    return _DrawStr;
}
let _フレーム上情報Re表示 = function () {
    befFrameTrnLv = -1;
    befFrameTop表示 = false;
}
let PicFrameBtlStart = Game_Interpreter.prototype.BattleStart;
Game_Interpreter.prototype.BattleStart = function () {
    PicFrameBtlStart.call(this);
    this.DelSpriteSpan(PN_ftHintBase, PN_ftHintTxt + 5);
}
let PicFrame_ReDrawFlg = false;
let PicFlameTop_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    PicFlameTop_performTransfer.call(this); 
    PicFrame_ReDrawFlg = true;
}
let picFrameBtlCngFlame = 0;
let befFrameTrnLv = -1;
let flameRedrawFlg = false;
let befHintText = "";
let trLvupEffectFlg = false;
let PicFrame_Update = Game_Interpreter.prototype.NUpdateSc;
const PN_ELDgbGrpNo = 620;
Game_Interpreter.prototype.NUpdateSc = function () {
    PicFrame_Update.call(this);
    if (PicFrame_ReDrawFlg) {
        befFrameTop表示 = befHintTop表示 = false;
        befFrameTrnLv = -1;
        PicFrame_ReDrawFlg = false;
    }
    if (befFrameTop表示 != $gameSystem.FrameTop表示) {
        if ($gameSystem.FrameTop表示) {
            if (flameRedrawFlg) this.SetSprite(PN_PicFlame, "PN_PicFlame", 0, 0);
            this.DelSpriteSpan(PN_ftTikeBar , PN_ftEnd);
            picFlamePlayerCharaArr = [];
            for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
                let _ckData = $gameSystem.Player.syojiTikemon[i];
                let _pftData = new BefCharaData(_ckData.lv, _ckData.id, _ckData.hp, MHP(_ckData));
                this.PicFrameDraw(i, _ckData, _pftData);
                picFlamePlayerCharaArr.push(_pftData);
                if (DbgFlg) {
                    if (_ckData.GrpNo != undefined) {
                        this.SpriteStr( PN_ELDgbGrpNo + i , _ckData.GrpNo , 16 , 208 , 177 + 180 * i);
                    }
                }
            }
        } else {
            this.DelSpriteSpan(PN_PicFlameTop, PN_ftEnd);
        }
        flameRedrawFlg = true;
    }
    if (!battle_Class.isBattle) {
        if ($gameSystem.FrameTop表示) {
            if (befHintTop表示 != $gameSystem.HintTop表示 || befHintText != $gameVariables.value(VN_HintTxt)) {
                befHintTop表示 = $gameSystem.HintTop表示;
                befHintText = $gameVariables.value(VN_HintTxt)
                this.PicFrameHintDraw();
            }
        }
    }
    if ($gameSystem._野生回避Cnt == undefined) $gameSystem._野生回避Cnt = 0;
    if ($gameSystem._野生回避Cnt > 0) {
        this.SetSpriteC(PN_ftYaseiKaihi, "PN_ftYaseiKaihi", 347, 755);
        this.SpriteStrC(PN_ftYaseiKaihi + 1, $gameSystem._野生回避Cnt, 32, 347, 755);
    } else {
        this.DelSpriteSpan(PN_ftYaseiKaihi + 0, PN_ftYaseiKaihi + 1);
    }
    if (!$gameSystem.FrameTop表示) this.DelSpriteSpan(PN_ftYaseiKaihi + 0, PN_ftYaseiKaihi + 1);
    if ($gameSystem.FrameTop表示) {
        if ($gameSystem.TrainerLv != befFrameTrnLv) {
            if (befFrameTrnLv != -1 || trLvupEffectFlg) {
                this.PlayPtcPic("TrLvUp",160,145); 
                trLvupEffectFlg = false;
            }
            befFrameTrnLv = $gameSystem.TrainerLv;
            this.SpriteStr(PN_ftTorLvTxt, $gameSystem.TrainerLv, 30, 163, 106);
        }
        if (battle_Class.isBattle) { 
            if (picFrameBtlCngFlame > 0) {
                picFrameBtlCngFlame--;
            } else {
                for (let i = 0; i < 3; i++) {
                    this.DelSprite(PN_ftNewWaza + i); 
                }
                this.SetSprite(PN_PicFlameTop, "PN_PicFlameTop_Em", 0, 0);
                for (let i = 0; i <= picFlamePlayerCharaArr.length - 1; i++) {
                    let _ckData = battle_Class.plYarimons[i];
                    let _pftData = picFlamePlayerCharaArr[i];
                    if (_ckData.lv != _pftData.lv || _ckData.YarimonData.id != _pftData.id ||
                        _ckData.hp != _pftData.hp || _ckData.MHP != _pftData.mhp || PicFrame_ReDrawFlg) {
                        this.PicFrameDraw(i, _ckData, _pftData);
                        _pftData.lv = _ckData.lv;
                        _pftData.id = _ckData.id;
                        _pftData.hp = _ckData.hp;
                        _pftData.mhp = _ckData.MHP;
                        PicFrame_ReDrawFlg = false;
                    }
                    if (_pftData.Ijos.toString() != _ckData.Ijos.toString()) {
                        this.DelSpriteSpan(PN_ftTikeState + (i * ft_IjoPicCnt),
                            PN_ftTikeState + (i * ft_IjoPicCnt) + ft_IjoPicCnt - 1);
                        _pftData.Ijos = [];
                        for (let j = 0; j <= _ckData.Ijos.length - 1; j++) {
                            _pftData.Ijos.push(_ckData.Ijos[j]);
                            this.SetSprite(PN_ftTikeState + (i * ft_IjoPicCnt) + j, IjoImgGet(_ckData.Ijos[j]),
                                67 - 63, 184 + 6 + (32 * j) + (180 * i));
                        }
                    }
                    if (i == battle_Class.PLMonNo) {
                        let _ckRank = [_ckData.R_Atk, _ckData.R_Def, _ckData.R_Agi, _ckData.R_Hit, _ckData.R_Avo];
                        if (_ckRank.toString() == [0, 0, 0, 0, 0].toString()) this.DelSprite(PN_ftStateCng + 0);
                        if (_pftData.Rank.toString() != _ckRank.toString()) {
                            this.DelSprite(PN_ftStateCng + 0);
                            _pftData.Rank = [];
                            let _DrawStr = GetRankStr(_pftData, _ckRank);
                            DText_NRZureX = -8;
                            DText_NRZureY = -6;
                            this.SpriteStr(PN_ftStateCng + 0, _DrawStr, 24, 67 + 143, 184 + 10 + (180 * i));
                            DText_NRZureX = DText_NRZureY = 0;
                        }
                    }
                }
                for (let i = 0; i <= picFlameEnemyCharaArr.length - 1; i++) {
                    let _ckData = battle_Class.emYarimons[i];
                    let _pftData = picFlameEnemyCharaArr[i];
                    if (_ckData.lv != _pftData.lv || _ckData.YarimonData.id != _pftData.id ||
                        _ckData.hp != _pftData.hp || _ckData.MHP != _pftData.mhp) {
                        this.PicFrameEnemyDraw(i, _ckData, _pftData);
                        _pftData.lv = _ckData.lv;
                        _pftData.id = _ckData.id;
                        if (_ckData.id == undefined) _ckData.id = _ckData.YarimonData.id;
                        _pftData.hp = _ckData.hp;
                        _pftData.mhp = _ckData.MHP;
                        if (DbgFlg) {
                            if (_ckData.GrpNo != undefined) {
                                this.SpriteStr( PN_ELDgbGrpNo + i + 3 , _ckData.GrpNo , 16 , 1200 , 177 + 180 * i);
                            }
                        }
                    }
                    if (i == battle_Class.EmMonNo) {
                        let _ckRank = [_ckData.R_Atk, _ckData.R_Def, _ckData.R_Agi, _ckData.R_Hit, _ckData.R_Avo];
                        if (_ckRank.toString() == [0, 0, 0, 0, 0].toString()) this.DelSprite(PN_ftStateCng + 1);
                        if (_pftData.Rank.toString() != _ckRank.toString()) {
                            this.DelSprite(PN_ftStateCng + 1);
                            _pftData.Rank = [];
                            let _DrawStr = GetRankStr(_pftData, _ckRank);
                            DText_NRZureX = -8;
                            DText_NRZureY = -6;
                            this.SpriteStr(PN_ftStateCng + 1, _DrawStr, 24, 1035 + 143, 184 + 10 + (180 * i));
                            DText_NRZureX = DText_NRZureY = 0;
                        }
                    }
                }
            }
        } else {
            this.SetSprite(PN_PicFlameTop, "PN_PicFlameTop", 0, 0);
            while (picFlamePlayerCharaArr.length < $gameSystem.Player.syojiTikemon.length) {
                picFlamePlayerCharaArr.push(new BefCharaData(-1, -1, -1, -1));
            }
            while (picFlamePlayerCharaArr.length > $gameSystem.Player.syojiTikemon.length) {
                picFlamePlayerCharaArr.shift();
                for (let i = 0; i <= picFlamePlayerCharaArr.length - 1; i++) {
                    picFlamePlayerCharaArr[i] = new BefCharaData(-1, -1, -1, -1);
                }
            }
            for (let i = 0; i <= 3 - 1; i++) {
                if (befNewWaza表示Arr[i] != $gameSystem.NewWazaArr[i]) {
                    befNewWaza表示Arr[i] = $gameSystem.NewWazaArr[i];
                    if ($gameSystem.NewWazaArr[i]) {
                        this.SetSprite(PN_ftNewWaza + i, MenuPicPath + "PN_ftNewWaza", 181, 244 + 180 * i);
                    } else {
                        this.DelSprite(PN_ftNewWaza + i);
                    }
                }
                if (picFlamePlayerCharaArr.length - 1 < i) {
                    this.DelSpriteSpan(PN_ftTikeBar + (i * dmBtnPicCnt),
                        PN_ftTikeBar + (i * dmBtnPicCnt) + dmBtnPicCnt - 1);
                    this.DelSpriteSpan(PN_ftTikeState + (i * ft_IjoPicCnt),
                        PN_ftTikeState + (i * ft_IjoPicCnt) + ft_IjoPicCnt - 1);
                    this.DelSpriteSpan(PN_ftWeekPl + (i * 2), PN_ftWeekPl + 1 + (i * 2));
                    this.DelSprite(PN_ftNewWaza + i);
                    this.DelSprite(PN_ftMetamo + i);
                    $gameSystem.NewWazaArr[i] = false;
                    continue;
                }
                if ($gameSystem.Player.syojiTikemon[i] == null) {
                    $gameSystem.Player.syojiTikemon.splice(i, 1);
                    picFlamePlayerCharaArr.splice(i, 1);
                    i--;
                    continue;
                }
                let _ckData = $gameSystem.Player.syojiTikemon[i];
                let _pftData = picFlamePlayerCharaArr[i];
                if (_ckData.lv != _pftData.lv || _ckData.id != _pftData.id ||
                    _ckData.hp != _pftData.hp || MHP(_ckData) != _pftData.mhp || PicFrame_ReDrawFlg) {
                    this.PicFrameDraw(i, _ckData, _pftData);
                    _pftData.lv = _ckData.lv;
                    _pftData.id = _ckData.id;
                    _pftData.hp = _ckData.hp;
                    _pftData.mhp = MHP(_ckData);
                }
                switch (_ckData.YarimonData.id) {
                    case 21: 
                        _ckData.YarimonData.sinka_id = 185; _ckData.YarimonData.sinka_lv = 100;
                        break;
                    case 24: 
                        _ckData.YarimonData.sinka_id = 188; _ckData.YarimonData.sinka_lv = 100;
                        break;
                    case 59: 
                        _ckData.YarimonData.sinka_id = 184; _ckData.YarimonData.sinka_lv = 100;
                        break;
                    case 78: 
                        _ckData.YarimonData.sinka_id = 190; _ckData.YarimonData.sinka_lv = 100;
                        break;
                    case 91: 
                        _ckData.YarimonData.sinka_id = 189; _ckData.YarimonData.sinka_lv = 100;
                        break;
                    case 123: 
                        _ckData.YarimonData.sinka_id = 183; _ckData.YarimonData.sinka_lv = 100;
                        break;
                    case 140: 
                        _ckData.YarimonData.sinka_id = 187; _ckData.YarimonData.sinka_lv = 100;
                        break;
                    case 144: 
                        _ckData.YarimonData.sinka_id = 215; _ckData.YarimonData.sinka_lv = 100;
                        break;
                    case 146: 
                        _ckData.YarimonData.sinka_id = 186; _ckData.YarimonData.sinka_lv = 100;
                        break;
                }
                if (_ckData.lv > _ckData.YarimonData.sinka_lv && _ckData.YarimonData.sinka_lv != 0) {
                    D_Text_Cng_font = "Makinas";
                    if (!IsEndLaboMode())
                        this.SpriteStr( PN_ftMetamo + i , SWCol.Blk + "\\c[17]" + NLngStrGet("ソウルアップ可") , 18 , 30 , 184 + 130 + 180 * i);
                    D_Text_Cng_font = "";
                } else {
                    this.DelSprite(PN_ftMetamo + i);
                }
            }
            PicFrame_ReDrawFlg = false;
        }
    }
    befFrameTop表示 = $gameSystem.FrameTop表示;
}
