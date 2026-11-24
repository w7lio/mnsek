/*:ja
 * @plugindesc 
 */
const _BasePosY = 640; 
const TatieMax = 9;     
const Tatie_Path = "pictures/Tatie/";   
const SW_会話中 = 15;
class _Chara {
    constructor(_No, _Name, _ZrPos) {
        this._No = _No;     
        this._Name = _Name; 
        this._ZrPos = _ZrPos;  
    }
}
const PN_TalkWin = 495;
const PN_TalkText = PN_TalkWin + 2;
const SW_HTalk = 14;
let N_Talk_FadeFlg = false;
let N_Talk_Update = Game_Interpreter.prototype.NUpdate;
let NHTalk_EndFlame = 0;
Game_Interpreter.prototype.NUpdate = function () {
    N_Talk_Update.call(this);
    if (NHTalk_EndFlame > 0) NHTalk_EndFlame--;
    if (N_NameBoxOpenFlg && NHTalk_EndFlame <= 0) {
        N_Talk_FadeFlg = true;
        if (!$gameSwitches.value(SW_HTalk)) {
            let _setAddStr = ""
            if (TalkWinAddStr != "") _setAddStr += "_" + TalkWinAddStr;
            var ckNameLng = 3;
            if (!talkFaceImgFlg) ckNameLng = 2;
            if (N_NameBoxTextLengh > 0) {
                if (N_NameBoxTextLengh <= ckNameLng) {
                    this.SetSprite(PN_TalkWin + 1, "PN_TalkNameWin_3" + _setAddStr, 363, 519);
                } else if (N_NameBoxTextLengh >= 8) {
                    this.SetSprite(PN_TalkWin + 1, "PN_TalkNameWin_8" + _setAddStr, 363, 519);
                } else if (N_NameBoxTextLengh >= 5) {
                    this.SetSprite(PN_TalkWin + 1, "PN_TalkNameWin_6" + _setAddStr, 363, 519);
                } else {
                    this.SetSprite(PN_TalkWin + 1, "PN_TalkNameWin" + _setAddStr, 363, 519);
                }
            } else {
                this.DelSprite(PN_TalkWin + 1);
            }
        }
    } else {
        if (N_Talk_FadeFlg) {
            N_Talk_FadeFlg = false;
            this.MoveSprite(PN_TalkWin + 1, true, true, 7, 0, true, true);
        }
        //this.DelSprite(PN_TalkWin + 1);
    }
}
let TalkWinAddStr = "";
const HTalkBackOpi = 255;
const SW_TalkBackOff = 182;
const SW_ExTalkWinFlg = 39;
Game_Interpreter.prototype.Talk_Start = function (_winStr) {
    _winStr = typeof _winStr !== 'undefined' ? _winStr : "";
    HTalkCenterFlg = false;
    if (!$gameSwitches.value(SW_HTalk)) {
        this.Talk_WinCng(_winStr)
    } else {
        NTxtPosZureY = 110;
        if (!_次のHTalk開始はWinPic非表示) {
            if (!$gameSwitches.value(SW_TalkBackOff)) {
                this.SetSprite(PN_TalkBack, "PN_TalkBack", 0, 0, 0);
                this.MoveSprite(PN_TalkBack, true, true, 5, 255, true, true);
            }
            if ($gameSwitches.value(SW_ExTalkWinFlg)) {
                this.SetSprite(PN_TalkWin, "PN_HTalkWinEx", 0, 0, 0);
                NTxtPosZureY = 140;
            }
            else {
                this.SetSprite(PN_TalkWin, "PN_HTalkWin", 0, 0, 0);
            }
            this.MoveSprite(PN_TalkWin, true, true, 5, HTalkBackOpi, true, true);
        }
        _次のHTalk開始はWinPic非表示 = false;
    }
}
let _次のHTalk開始はWinPic非表示 = false;
let _Title_WinPicFlameDelFlg = false;
let HTalkBackOff = false;
Game_Interpreter.prototype.HTalk_Start_Center = function (_winStr) {
    _winStr = typeof _winStr !== 'undefined' ? _winStr : "PN_TalkBack";
    HTalkCenterFlg = true;
    if (!$gameSwitches.value(SW_TalkBackOff)) {
        this.SetSprite(PN_TalkBack, "PN_TalkBack", 0, 0, 0);
        this.MoveSprite(PN_TalkBack, true, true, 5, 255, true, true);
    }
    HTalkBackOff = true;
    if (_winStr != "") {
        HTalkBackOff = false;
        this.SetSprite(PN_TalkWin, "PN_HTalkCWin", 0, 0, 0);
        this.MoveSprite(PN_TalkWin, true, true, 5, HTalkBackOpi, true, true);
    } else {
        this.DelSprite(PN_TalkWin);
    }
    NTxtPosZureY = -200;
}
Game_Interpreter.prototype.Talk_WinCng = function (_winStr) {
    _winStr = typeof _winStr !== 'undefined' ? _winStr : "";
    TalkWinAddStr = _winStr;
    let _setWinPath = "PN_TalkWin";
    if (TalkWinAddStr != "") _setWinPath += "_" + TalkWinAddStr;
    this.SetSprite(PN_TalkWin, _setWinPath, BPs._x, BPs._y);
    _FImgPos._x = 310;
    _FImgPos._y = 523;
    NTxtPosZureY = 0;
}
let HTalkCenterFlg = false;
Game_Interpreter.prototype.TalkWinCng = function (_Type) {
    if (!$gameSwitches.value(SW_HTalk)) return;
    if (HTalkCenterFlg) {
        if (!HTalkBackOff) this.SetSprite(PN_TalkWin, "PN_HTalkCWin", 0, 0, HTalkBackOpi);
        return;
    }
    if ($gameSwitches.value(SW_ExTalkWinFlg)) {
        this.SetSprite(PN_TalkWin, "PN_HTalkWinEx", 0, 0, HTalkBackOpi);
    } else {
        switch (_Type) {
            case "男":
                this.SetSprite(PN_TalkWin, "PN_HTalkWin_M", 0, 0, HTalkBackOpi);
                break;
            case "女":
                this.SetSprite(PN_TalkWin, "PN_HTalkWin", 0, 0, HTalkBackOpi);
                break;
            case "ナ":
                this.SetSprite(PN_TalkWin, "PN_HTalkWin_N", 0, 0, HTalkBackOpi);
                break;
        }
    }
}
Game_Interpreter.prototype.Talk_End = function () {
    if ($gameSwitches.value(SW_HTalk)) NHTalk_EndFlame = 11;
    this.MoveSprite(PN_TalkBack, true, true, 10, 0, true, true);
    this.MoveSprite(PN_HScene, true, true, 10, 0, true, true);
    //this.MoveSprite(PN_TalkWin, true, true, 10, 0, true, true);
    this.DelSprite(_DbgPicNo);
    this.DelSprite(PN_TalkWin);
    _FImgPos._x = 310; _FImgPos._y = 523;
    _文字白色Flg = false;
}
Game_Interpreter.prototype.Talk_WinDel = function () {
    this.MoveSprite(PN_HScene, true, true, 10, 0, true, true);
    this.MoveSprite(PN_TalkBack, true, true, 10, 0, true, true);
    this.MoveSprite(PN_TalkWin, true, true, 10, 0, true, true);
    this.DelSprite(_DbgPicNo);
}
Game_Interpreter.prototype.Talk_WinOnlyDel = function () {
    this.MoveSprite(PN_TalkWin, true, true, 10, 0, true, true);
}
let NTxtZureX = 0;
let NTxtZureY = 30;
let NTxtPosZureY = 0;
Window_Base.prototype.processNormalCharacter = function (textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    let zureLngY = 0;
    if (MainTextUpdateFlg && LngMode == "en") zureLngY = -10;
    this.contents.drawText(c, textState.x + NTxtZureX, textState.y + NTxtZureY + zureLngY, w * 2, textState.height);
    textState.x += w;
};
var _Nupu_updatePlacement = Window_Message.prototype.updatePlacement;
Window_Message.prototype.updatePlacement = function () {
    _Nupu_updatePlacement.apply(this, arguments);
    let NotFaceZureX = 0;
    let NotFaceZureY = 0;
    if (this._faceBitmap != null) {
        if (this._faceBitmap._image == null) {
            NotFaceZureX = 20;
            NotFaceZureY = -8;
        }
    }
    this.x = 330 + NotFaceZureX;
    this.y = 2 * (Graphics.boxHeight - this.height) / 2 - 92 + NTxtPosZureY + NotFaceZureY;
    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
};
const SelfPicPath = "pictures/self/";   
let _SelfWinNo = 0
let _selfOff = false; 
let _文字白色Flg = false;
let _talkAutoStartFlg = false;
const CN_会話中 = 4;
const CN_会話終了 = 2;
let NT_Cd101 = Game_Interpreter.prototype.command101;
Game_Interpreter.prototype.command101 = function () {
    this._params[2] = 2;
    NT_Cd101.call(this);
    var _txtCnt = 0;
    for (let i = 0; i <= $gameMessage._texts.length - 1; i++) {
        _txtCnt += $gameMessage._texts[i].length;
    }
    if (!$gameSwitches.value(SW_HTalk) && !_文字白色Flg) {
        _selfOff = false;
        if ($gameMessage._texts.length == 1) {
            _selfOff = $gameMessage._texts[0] == '';
        }
        if ($gameMessage._texts.length > 0) {
            $gameMessage._texts[0] = "\\OW[4]\\OC[0]\\C[15]" + $gameMessage._texts[0];
            _SelfWinNo = this._params[3] + 1;
        }
    }
    if (!$gameSwitches.value(SW_会話中) && _txtCnt != 0) {
        NTxtPosZureY = 0;
        this.SetCmnEvent(CN_会話中);
        _talkAutoStartFlg = true;
    }
    if (_talkAutoStartFlg) MsgAutoCloseFlame = 0;
}
let MsgAutoCloseFlame = 0;
let MsgAutoClose = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
    MsgAutoClose.call(this);
    if (_talkAutoStartFlg) {
        MsgAutoCloseFlame = 2;
    }
};
let TxtAutoClose_NUpdateSc = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    TxtAutoClose_NUpdateSc.call(this);
    if (MsgAutoCloseFlame > 0) {
        MsgAutoCloseFlame--;
        if (MsgAutoCloseFlame == 0) {
            _talkAutoStartFlg = false;
            this.SetCmnEventSc(CN_会話終了);
        }
    }
}
