/*:ja
 * @plugindesc 
 */
let _H会話フラグ = false;
const SW_Fuck = 3; 
const SW_TktOff = 19; 
_LngImgArr =
    ["AutoBtn","NupuryuHint","PN_ftWeek","PN_PicFlameTop_Em","PN_PicFlameTop"
    ,"PN_Staff","PN_YaseiWin","IconSet","ijo1","ijo2"
    ,"ijo3","ijo4","ijo5","ijo6","PN_BtlGetZukanBase"
    ,"PN_DsBase","PN_DsEnd","PN_ELBack1","PN_ELBack2","PN_ELCng"
    ,"PN_ELExitCheck","PN_ELPartySub2","PN_ELPartySub","PN_ftNewWaza","PN_mBack"
    ,"PN_mBtn1","PN_mBtn2","PN_mBtn3","PN_mBtn4","PN_mBtn5"
    ,"PN_mBtn6","PN_mBtn_w","PN_mBtn_w_not","PN_mBtn_y","PN_mTrCardBaseEx"
    ,"PN_mTrCardBase","PN_bxBase","PN_bxBlack_2_mWaza","PN_ymBase_Dtl","PN_MscBack"
    ,"PN_KakeMoney","PN_spBase","PN_spBtn","PN_T2_Sel1","PN_T2_Sel2"
    ,"PN_T2_Sel3","PN_T2_Sel4","PN_T2_Sel4_Kari","PN_T2_Sel5","PN_TDlcBtn1"
    ,"PN_TDlcBtn2","PN_TDlcBtn3","PN_TDlcDesc1","PN_TDlcDesc2","PN_TDlcDesc3"
    ,"PN_TDlc_Base","PN_TLogo","PN_Tutorial_1","PN_Tutorial_2","PN_Tutorial_3_2"
    ,"PN_Tutorial_3","PN_Tutorial_4","PN_Tutorial_5","PN_Tutorial_6","PN_Tutorial_7"
    ,"PN_Tutorial_8","PN_Tutorial_9","PN_WMapBase","PN_BtlTtkBase","PN_BtlCngBase"
    ,"CutLast1s","CutLast2s","CutLast3sa","CutLast3s","PN_BtlKoseiWin"
    ,"PN_BtlKousanBase","PN_BtlSelectBtn1","PN_BtlSelectBtn2","PN_BtlSelectBtn2_not","PN_BtlSelectBtn3"
    ,"PN_BtlSelectBtn3_not","PN_BtlSelectBtn4","PN_BtlSelectBtn4_Ex","PN_BtlSelectBtnNo","PN_BtlSelectBtnYes"
    ,"898_E2_0001","898_E2_0002","898_E2_0004","898_E2_0005","898_E2_0006"
    ,"898_E2_0007","PN_dmBase","PN_dmBtn1","PN_dmBtn2","PN_dmBtn3"
    ,"PN_dmBtn4","PN_dmDtlBtn","PN_dmTopImg1","PN_dmTopImg2","PN_dmTopImg3"
    ,"PN_dmTopImg4","PN_ftBase","PN_ftBtn1","PN_ftBtn2","PN_ftBtn3"
    ,"PN_ftBtn4","PN_ftBtn5","PN_ftBtn6","PN_ftCloseBtn","PN_ftYNBase"
    ,"PN_moBase","PN_moNan0","PN_moNan1","PN_smBase_Load","PN_smBase_Save"
    ,"PN_ymBase_b","PN_ymBase","PN_ymExpBase","PN_ymSinkaBack","PN_ymTrnLvBase"
    ,"PN_ymType0","PN_ymType1","PN_ymType2","PN_ymType3","PN_ymType4"
    ,"PN_ymType5","PN_ymType6","PN_ymWazaCkBack","PN_zmBase","PN_zmBase_y"
    ,"PN_zmHint","Tike_EdgBk4","Tike_EdgBk5","Tike_EdgBk6","PN_mBack"
    ,"PN_zmDBase","PN_zmDBase_y","PN_zmDBtn1_y","PN_zmDBtn3","PN_zmDBtn3_y"
    ,"PN_zmDtlBtn","PN_zmSBase","PN_zmSBase_YesNo"]
;
_TrialImgArr = ["PN_PicFlame" , "PN_TLogo"];
_NomalImgArr = ["PN_TLogo"];
let GetDbLocStr = function (jp , Locs) {
    if (Locs == null) return jp;
    for (let i = 0; i <= Locs.length - 1; i++) {
        if (Locs[i].locName == LngMode) return Locs[i].value;
    }
    return jp;
}
let AddLoc
let LngDBUpdateFlg = false;
let LngDBUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    LngDBUpdate.call(this);
    if (!LngDBUpdateFlg) {
        if (LngMode != "jp") {
            var GetLocName = function (Locs) {
                if (Locs == null)
                    return ";"
                for (let i = 0; i <= Locs.length - 1; i++) {
                    if (Locs[i].locName == LngMode) return Locs[i].value;
                }
                return "";
            }
            for (let i = 0; i <= $N_Yarimon_DB.douguDatas.length - 1; i++) {
                $N_Yarimon_DB.douguDatas[i].name = GetLocName($N_Yarimon_DB.douguDatas[i].name_Locs);
                $N_Yarimon_DB.douguDatas[i].setu = GetLocName($N_Yarimon_DB.douguDatas[i].setu_Locs);
            }
            for (let i = 0; i <= $N_Yarimon_DB.trainers.length - 1; i++) {
                $N_Yarimon_DB.trainers[i].name = GetLocName($N_Yarimon_DB.trainers[i].name_Locs);
                $N_Yarimon_DB.trainers[i].jobName = GetLocName($N_Yarimon_DB.trainers[i].jobName_Locs);
                $N_Yarimon_DB.trainers[i].startSelf = GetLocName($N_Yarimon_DB.trainers[i].startSelf_Locs);
                $N_Yarimon_DB.trainers[i].winSelf = GetLocName($N_Yarimon_DB.trainers[i].winSelf_Locs);
                $N_Yarimon_DB.trainers[i].endContentsTrData.startSelf = GetLocName($N_Yarimon_DB.trainers[i].endContentsTrData.startSelf_Locs);
                $N_Yarimon_DB.trainers[i].endContentsTrData.winSelf = GetLocName($N_Yarimon_DB.trainers[i].endContentsTrData.winSelf_Locs);
                $N_Yarimon_DB.trainers[i].endLaboTrData.startSelf = GetLocName($N_Yarimon_DB.trainers[i].endLaboTrData.startSelf_Locs);
                $N_Yarimon_DB.trainers[i].endLaboTrData.winSelf = GetLocName($N_Yarimon_DB.trainers[i].endLaboTrData.winSelf_Locs);
            }
            for (let i = 0; i <= $N_Yarimon_DB.mZukanDatas.length - 1; i++) {
                $N_Yarimon_DB.mZukanDatas[i].name = GetLocName($N_Yarimon_DB.mZukanDatas[i].name_Locs);
                $N_Yarimon_DB.mZukanDatas[i].ecology.monName = GetLocName($N_Yarimon_DB.mZukanDatas[i].ecology.monName_Locs);
                $N_Yarimon_DB.mZukanDatas[i].ecology.setu = GetLocName($N_Yarimon_DB.mZukanDatas[i].ecology.setu_Locs);
            }
            for (let i = 0; i <= $N_Yarimon_DB.wazaDatas.length - 1; i++) {
                $N_Yarimon_DB.wazaDatas[i].name = GetLocName($N_Yarimon_DB.wazaDatas[i].name_Locs);
                $N_Yarimon_DB.wazaDatas[i].setu = GetLocName($N_Yarimon_DB.wazaDatas[i].setu_Locs)
            }
            for (let i = 0; i <= $N_Yarimon_DB.tokuseiDatas.length - 1; i++) {
                //$N_Yarimon_DB.tokuseiDatas[i].name = GetLocName($N_Yarimon_DB.tokuseiDatas[i].name_Locs);
                N_LocalizeAddData($N_Yarimon_DB.tokuseiDatas[i].name , $N_Yarimon_DB.tokuseiDatas[i].name_Locs);
                $N_Yarimon_DB.tokuseiDatas[i].setu = GetLocName($N_Yarimon_DB.tokuseiDatas[i].setu_Locs);
            }
            for (let i = 0; i <= $N_Yariman_DB.length - 1; i++) {
                $N_Yariman_DB[i].name = GetLocName($N_Yariman_DB[i].name_Locs);
                $N_Yariman_DB[i].jobName = GetLocName($N_Yariman_DB[i].jobName_Locs);
                $N_Yariman_DB[i].cProfile.setu = GetLocName($N_Yariman_DB[i].cProfile.setu_Locs);
                $N_Yariman_DB[i].cProfile.hint = GetLocName($N_Yariman_DB[i].cProfile.hint_Locs);
                for (let j = 0; j <= $N_Yariman_DB[i].tatiePic.tatieDatas.length - 1; j++) {
                    if ($N_Yariman_DB[i].tatiePic.tatieDatas[j].name == "メイド")
                        console.log("");
                    if ($N_Yariman_DB[i].tatiePic.tatieDatas[j].name_Locs != null)
                        $N_Yariman_DB[i].tatiePic.tatieDatas[j].name = GetLocName($N_Yariman_DB[i].tatiePic.tatieDatas[j].name_Locs);
                }
                for (let j = 0; j <= $N_Yariman_DB[i].hScene.length - 1; j++) {
                    $N_Yariman_DB[i].hScene[j].desc = GetLocName($N_Yariman_DB[i].hScene[j].desc_Locs);
                    if ($N_Yariman_DB[i].hScene[j].hint_Locs != null)
                        $N_Yariman_DB[i].hScene[j].hint = GetLocName($N_Yariman_DB[i].hScene[j].hint_Locs);
                }
            }
        }
        LngDBUpdateFlg = true;
    }
}
Game_Interpreter.prototype.N_GameStart = function () {
    this.PicFrameBaseDraw();
}
const EnstCmn = 10;
let EnstStr = "";
let EnstVar = [];
Game_Interpreter.prototype.NNEnstSet = function (_SetEnst) {
    let _ckArr = _SetEnst.split(':');
    EnstStr = _ckArr[0];
    EnstVar = [];
    for (let i = 1; i <= _ckArr.length - 1; i++) {
        EnstVar.push(_ckArr[i]);
    }
    this.SetCmnEvent(EnstCmn);
}
let Check勝利トレーナーID = function (ckTrId) {
    return $gameSystem.WinedTrainerArr.indexOf(ckTrId) != -1;
}
let Txt種類 = "N";
let _演出切り替えFlg = false; 
let _即演出Flg = false; 
Game_Interpreter.prototype.EnstTxtLoad = function () {
    _即演出Flg = false;
    Txt種類 = EnstVar[0];
    switch (Txt種類) {
        case "H":
            PlayEvStr = EnstVar[1] + "_Txt" + EnstVar[2];
            break;
        case "N":
            PlayEvStr = EnstVar[1] + "_NTxt" + EnstVar[2];
            break;
    }
    if (EnstVar.length > 3) {
        _即演出Flg = true;
    }
    _演出切り替えFlg = true;
}
let n_TalkImgDatas = null;
class N_TalkImgDatas {
    constructor(_setData) {
        this.loadImgDatas = [];
        for (let i = 0; i < _setData.loadImgDatas.length; i++) {
            this.loadImgDatas.push(new N_TalkImgData(_setData.loadImgDatas[i]));
        }
    }
}
class N_TalkImgData {
    constructor(_setData) {
        this.charaName = _setData.charaName;
        this.fileName = _setData.fileName;
        this.imgNames = [];
        for (let i = 0; i < _setData.imgNames.length; i++) {
            this.imgNames.push("pictures/" + _setData.imgNames[i]);
        }
    }
}
Game_Interpreter.prototype.TmpEv_事前ロード = function () {
    console.log("TmpEv_事前ロード");
    if (n_TalkImgDatas == null) n_TalkImgDatas = new N_TalkImgDatas($Nupu_Yariman_Img);
    for (let i = 0; i < n_TalkImgDatas.loadImgDatas.length; i++) {
        let ckData = n_TalkImgDatas.loadImgDatas[i];
        if (ckData.charaName == EnstVar[1] && ckData.fileName == "Txt" + EnstVar[2]) {
            this.PreLoadArr_WaitPush(ckData.imgNames);
        }
    }
}
let evRootFlame = 0;
let _Event_NUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    _Event_NUpdate.call(this);
    evRootFlame++;
}
const PN_ChoiceBase = 550;
const PN_ChoiceTxt = PN_ChoiceBase + 1;
const PN_ChoiceSelecter = PN_ChoiceTxt + 6;
let _ChoiceMode = false;
let _ChoiceCloseFlg = false;
let _ChoiceSelectNo = -1;
let _ChoiceOkFlg = false;
let _ChoicePosX = 400;
let _ChoicePosY = 300;
let NChoice_Set = Game_Interpreter.prototype.setupChoices;
let NUpdatePlacement = Window_ChoiceList.prototype.updatePlacement;
let NSel_command102 = Game_Player.prototype.reserveTransfer;
Game_Interpreter.prototype.command102 = function () {
    return NSel_command102();
};
Game_Interpreter.prototype.setupChoices = function (params) {
    _ChoiceOkFlg = false;
    _ChoiceMode = true;
    _ChoiceSelectNo = params[2];
    var longStr = "";
    let maxSelectLen = 0;
    for (let i = 0; i <= params[0].length - 1; i++) {
        if (maxSelectLen < params[0][i].length) maxSelectLen = params[0][i].length;
        while (params[0][i].length < 5) params[0][i] += "　";
        var setTxtSize = 28;
        if (LngMode == "en") setTxtSize = 22;
        this.SpriteStr(PN_ChoiceTxt + i, SCol.Blk0 + params[0][i], setTxtSize, _ChoicePosX + 60, _ChoicePosY + 30 + (i * 40));
    }
    if (maxSelectLen > 5) longStr = "_l";
    if (maxSelectLen > 7) longStr = "_ll";
    if (maxSelectLen > 9) longStr = "_lll";
    this.SetSprite(PN_ChoiceBase, "PN_ChoiceBase_" + params[0].length + longStr, _ChoicePosX, _ChoicePosY); 
    if (_ChoiceSelectNo == -1) {
        params[2] = 0;
        _ChoiceSelectNo = 0;
    }
    this.SetSprite(PN_ChoiceSelecter, "PN_ChoiceSelecter", _ChoicePosX + 30, _ChoicePosY + 32 + (_ChoiceSelectNo * 40)); 
    NChoice_Set.call(this, params);
};
Window_ChoiceList.prototype.updatePlacement = function() {
    NUpdatePlacement.call(this);
    this.x += 1000;
}
let Choice_IndexCng = -1;
let NChoice_Update = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    NChoice_Update.call(this);
    if (_ChoiceMode) {
        this.SetSprite(PN_ChoiceSelecter, "PN_ChoiceSelecter", _ChoicePosX + 30, _ChoicePosY + 32 + (_ChoiceSelectNo * 40)); 
        Choice_IndexCng = _ChoiceSelectNo;
        let _chiceInt = overPointerSpCkArr_GetNo([
            PN_ChoiceTxt + 0, PN_ChoiceTxt + 1, PN_ChoiceTxt + 2,
            PN_ChoiceTxt + 3, PN_ChoiceTxt + 4, PN_ChoiceTxt + 5
        ]);
        Choice_IndexCng = -1;
        if (_chiceInt != -1) {
            if (_ChoiceSelectNo != _chiceInt) SoundManager.playCursor();
            _ChoiceSelectNo = Choice_IndexCng = _chiceInt;
            if (TouchInput.isTriggered()) {
                _ChoiceOkFlg = true;
            }
        }
    }
    if (_ChoiceCloseFlg) {
        _ChoiceCloseFlg = false;
        this.DelSpriteSpan(PN_ChoiceBase, PN_ChoiceSelecter);
    }
}
Window_ChoiceList.prototype.drawItem = function (index) {
    //var rect = this.itemRectForText(index);
    //this.drawTextEx(this.commandName(index), rect.x, rect.y);
};
Window_ChoiceList.prototype.isOkTriggered = function () {
    if (_ChoiceOkFlg) return true;
    return Input.isTriggered('ok');
};
let N_updateBackground = Window_ChoiceList.prototype.update;
Window_ChoiceList.prototype.update = function () {
    N_updateBackground.call(this);
    if (this.active) {
        _ChoiceSelectNo = this._index;
        if (Choice_IndexCng != -1) {
            this._index = Choice_IndexCng;
            _ChoiceSelectNo = this._index;
        }
    }
};
let N_ChoiceClose = Window_ChoiceList.prototype.close;
Window_ChoiceList.prototype.close = function () {
    N_ChoiceClose.call(this);
    _ChoiceMode = false;
    _ChoiceCloseFlg = true;
}
let Map移動_X = 0;
let Map移動_Y = 0;
let Map移動_psName = "";
Game_Interpreter.prototype.Map移動_Set = function (_psName) {
    Map移動_psName = _psName;
    Map移動_X = 0;
    Map移動_Y = 0;
}
Game_Interpreter.prototype.Map移動_縦 = function (_Size, _psName) {
    if (Math.abs(this.character(0)._x - PL_realX) <= 0.2) {
        if (PL_realY - this.character(0)._y < _Size && PL_realY - this.character(0)._y >= 0) {
            Map移動_psName = _psName;
            Map移動_X = 0;
            Map移動_Y = PL_realY - this.character(0)._y;
            return true;
        }
    }
    return false;
}
Game_Interpreter.prototype.Map移動_横 = function (_Size, _psName) {
    if (Math.abs(this.character(0)._y - PL_realY) <= 0.2) {
        if (PL_realX - this.character(0)._x < _Size && PL_realX - this.character(0)._x >= 0) {
            Map移動_psName = _psName;
            Map移動_X = PL_realX - this.character(0)._x;
            Map移動_Y = 0;
            return true;
        }
    }
    return false;
}
let saveEffectSprite = null;
let saveEffectSprite2 = null;
let Map移動_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
    Map移動_reserveTransfer.call(this, mapId, x, y, d, fadeType);
    saveEffectSprite = GetSpriteData(PN_Ensyutu);
    saveEffectSprite2 = GetSpriteData(PN_FlameEffect);
    saveEffectSettingFlame = 1;
};
let Map移動_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    Map移動_performTransfer.call(this); 
    if (Map移動_psName != "") {
        $dataMap.events.forEach(_event => {
            if (_event != null) {
                if (_event.name == Map移動_psName) {
                    $gamePlayer._x = _event.x + Map移動_X;
                    $gamePlayer._y = _event.y + Map移動_Y;
                    $gamePlayer._realX = _event.x + Map移動_X;
                    $gamePlayer._realY = _event.y + Map移動_Y;
                    $gameMap.setDisplayPos($gamePlayer._x - 15, $gamePlayer._y - 8.5);
                    Map移動_psName = "";
                    return false;
                }
            }
        });
    }
}
let Map移動_Update = Game_Interpreter.prototype.NUpdate;
let saveEffectSettingFlame = 0;
Game_Interpreter.prototype.NUpdate = function () {
    Map移動_Update.call(this);
    if (saveEffectSprite != null || saveEffectSprite2 != null) {
        saveEffectSettingFlame--;
        if (saveEffectSettingFlame == 0) {
            if (saveEffectSprite != null) {
                this.SpriteInObj(PN_Ensyutu, saveEffectSprite);
            }
            if (saveEffectSprite2 != null) {
                this.SpriteInObj(PN_FlameEffect, saveEffectSprite2);
            }
            saveEffectSprite = null;
            saveEffectSprite2 = null;
        }
    }
}
class NNPlayAnime { 
    constructor(_CName, _Anime, _lFlg, _AName) {
        this._CAnimeArr = [];
        for (let i = 0; i <= _CharaAnime.length - 1; i++) {
            if (_CName == _CharaAnime[i]._folName && _CharaAnime[i]._AName == _Anime) {
                this._CAnimeArr = _CharaAnime[i]._CAnimeArr;
            }
        }
        this._lFlg = _lFlg;     
        this._ANo = 0;          
        this._flame = 0;        
        this._AName = _AName;   
        this._EndFlg = false;   
    }
}
let _VCarArr = [];  
let NN_PAnime;      
Game_Interpreter.prototype.NNPicSet = function (_CharaFol, _SetName) {
    if (_SetName.indexOf('[A]') != -1 || _SetName.indexOf('[AL]') != -1) {
        let _lpflg = false;
        if (_SetName.indexOf('[A]') != -1) _VCarAArr = _SetName.split('[A]');
        if (_SetName.indexOf('[AL]') != -1) {
            _VCarAArr = _SetName.split('[AL]');
            _lpflg = true;
        }
        let _AnimeName = _VCarAArr[1];
        if (NN_PAnime != undefined) {
            if (NN_PAnime.name == _AnimeName) {
                return;
            }
        }
        for (let i = 0; i <= $Nupu_MV_Data.mv_Chara.length - 1; i++) {
            if (_CharaFol == $Nupu_MV_Data.mv_Chara[i].name) {
                for (let j = 0; j <= $Nupu_MV_Data.mv_Chara[i].animeList.length - 1; j++) {
                    let _ckName = $Nupu_MV_Data.mv_Chara[i].animeList[j].name;
                    if (_ckName == _AnimeName) {
                        NN_PAnime = $Nupu_MV_Data.mv_Chara[i].animeList[j];
                        NN_PAnime._CharaName = _CharaFol;
                        NN_PAnime._EndFlg = false;
                        NN_PAnime._flame = 0;
                        NN_PAnime._ANo = 0;   
                        NN_PAnime._LoopFlg = _lpflg;
                        break;
                    }
                }
                break;
            }
        }
        //this.H_AnimeLoading(NN_PAnime);   //事前ロードを強化した為不必要になった
        let _PName = NN_PAnime.flameList[0].picPath;
        let _ckPic = new NN_Pic(_PName);
        this.H_CView(_CharaFol, _ckPic._mName, _ckPic._pNo);
    } else {
        NN_PAnime = undefined;
        let _ckPic = new NN_Pic(_SetName);
        this.H_CView(_CharaFol, _ckPic._mName, _ckPic._pNo);
    }
}
class NN_Pic {
    constructor(_fileName) {
        this._mName = ""; 
        this._pNo = "";   
        let _VCarArr = _fileName.split('_');
        for (let i = 0; i <= _VCarArr.length - 1; i++) {
            if (i == _VCarArr.length - 1) {
                this._pNo = _VCarArr[i];
            } else {
                if (this._mName != "") this._mName += "_";
                this._mName += _VCarArr[i];
            }
        }
    }
}
const _AnimeSpeed = 0.75; 
let NN_AnimeUpdate = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    NN_AnimeUpdate.call(this);
    if (!$gameSwitches.value(SW_HTalk)) {
        NN_PAnime = undefined; 
    } else {
        if (NN_PAnime != undefined) {
            if (!NN_PAnime._EndFlg) { 
                if (NN_PAnime.flameList[NN_PAnime._ANo].flame * _AnimeSpeed < NN_PAnime._flame) {
                    NN_PAnime._flame = 0;
                    NN_PAnime._ANo++;
                    if (NN_PAnime._ANo == NN_PAnime.flameList.length) {
                        if (NN_PAnime._LoopFlg) {
                            NN_PAnime._ANo = 0; 
                        } else {
                            NN_PAnime._EndFlg = true; 
                            return;
                        }
                    }
                    let _NN_Pic = new NN_Pic(NN_PAnime.flameList[NN_PAnime._ANo].picPath);
                    this.H_CView(NN_PAnime._CharaName, _NN_Pic._mName, _NN_Pic._pNo);
                    this.PlaySe(NN_PAnime.flameList[NN_PAnime._ANo].sePath.replace(".ogg", ""));
                    if (NN_PAnime.flameList[NN_PAnime._ANo].voiceData != undefined) {
                        if (NN_PAnime.flameList[NN_PAnime._ANo].voiceData.charaName != "") {
                            var vCharaName = NN_PAnime.flameList[NN_PAnime._ANo].voiceData.charaName;
                            var vFileName = "";
                            if (NN_PAnime.flameList[NN_PAnime._ANo].voiceData.randomFlg) {
                                let voiceData = NN_PAnime.flameList[NN_PAnime._ANo].voiceData;
                                if (voiceData.playedArr == undefined) voiceData.playedArr = [];
                                if (voiceData.playedArr.length == voiceData.paths.length) {
                                    voiceData.playedArr = [];
                                }
                                var selectArr = [];
                                voiceData.paths.forEach( pathName => {
                                    if (voiceData.playedArr.indexOf(pathName) == -1) {
                                        selectArr.push(pathName);
                                    }
                                });
                                vFileName = selectArr[Math.floor( Math.random() * selectArr.length)];
                                voiceData.playedArr.push(vFileName);
                            } else {
                                vFileName = NN_PAnime.flameList[NN_PAnime._ANo].voiceData.path;
                            }
                            if (vCharaName != "" && vFileName != "" && vFileName != undefined) {
                                this.PVoice(vCharaName , vFileName);
                            }
                        }
                    }
                }
            }
            NN_PAnime._flame++;
        }
    }
}
Window_Base.prototype.setPopupBasePosition = function () {
    let pos = $gameSystem.getPopupAdjustPosition();
    this.x = this.getPopupBaseX() - this.width / 2 + (pos ? pos[0] : 0);
    this.y = this.getPopupBaseY() - this.height - this.getHeightForPopup() + (pos ? pos[1] : 0);
    if ($gameSwitches.value(SW_会話中)) {
        let _fzX = 0;
        let _fzY = 0;
        for (let i = 0; i <= FukiMSet.length - 1; i++) {
            if (FukiName == FukiMSet[i][0]) {
                _fzX = FukiMSet[i][1];
                _fzY = FukiMSet[i][2];
            }
        }
        this.x = _FImgPos._x + _fzX;
        this.y = _FImgPos._y + _fzY;
    }
};
let FstRznSetFlg = false;
let MapMove_RznSet = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    MapMove_RznSet.call(this); 
    FstRznSetFlg = true;
}
var bef足元X = -1;
var bef足元Y = -1;
Game_Interpreter.prototype._足元Check = function () {
    var cngFlg = bef足元X != $gamePlayer.x || bef足元Y != $gamePlayer.y;
    bef足元X = $gamePlayer.x;
    bef足元Y = $gamePlayer.y;
    var ckNo = $gameMap.regionId(bef足元X, bef足元Y);
    if(ckNo <= 35 && ckNo != 0 && cngFlg) {
        if (ckNo < 11 | ckNo > 31) {
            this.CopyTmpEvSet("草むらテンプレート", bef足元X, bef足元Y);
        } else if (ckNo > 15 && ckNo <= 20) { 
            this.CopyTmpEvSet("演出無しテンプレート",  bef足元X, bef足元Y);
        } else {
            this.CopyTmpEvSet("土ほこりテンプレート",  bef足元X, bef足元Y);
        }
    }
    if (ckNo >= 36 || ckNo == 0 || !$gameSystem.FrameTop表示) {
        this.DelSpriteSpan(PN_YaseiWin , PN_YaseiMon + 5);
        yPictures = [];
    }
    if (yPictures.length > 0) {
        for (let i = 0; i <= 6 - 1; i++) {
            if (yPictures.length <= i) DelSprite(PN_YaseiMon + i);
            else {
                var xPos = (i % 3) * 85 + 1220;
                var yPos = Math.floor(i / 3) * 70 + 688;
                this.SetSpriteC(PN_YaseiMon + i , Btl_Yarimon + yPictures[i] ,
                    xPos , yPos , 255,25,25);
                if (!yViewFlgs[i]) {
                    this.SpriteCngColor( PN_YaseiMon + i  , [-255,-255,-255,0]);
                }
            }
        }
        this.SetSprite(PN_YaseiWin , "PN_YaseiWin" , 0,0);
    }
}
let befMapID = -1;
let FstRzn_Update = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    FstRzn_Update.call(this);
    this._足元Check();
    if (FstRznSetFlg) {
        if ($gameMap._mapId == befMapID) {
        } else {
            for (let i = 0; i <= $dataMap.width - 1; i++) {
                for (let j = 0; j <= $dataMap.height - 1; j++) {
                    let _PsX = i;
                    let _PsY = j;
                    let ckRznId = $gameMap.regionId(i, j);
                    if (ckRznId == 0) continue;
                    if (ckRznId == 233)
                        this.CopyTmpEvSet("上矢印テンプレート", _PsX, _PsY);
                    if (ckRznId == 240)
                        this.CopyTmpEvSet("左矢印テンプレート", _PsX, _PsY);
                    if (ckRznId == 241)
                        this.CopyTmpEvSet("下矢印テンプレート", _PsX, _PsY);
                    if (ckRznId == 242)
                        this.CopyTmpEvSet("右矢印テンプレート", _PsX, _PsY);
                    if (ckRznId == 247)
                        this.CopyTmpEvSet("波打ちテンプレート", _PsX, _PsY);
                    if (ckRznId == 248)
                        this.CopyTmpEvSet("ジャンプ棚テンプレート", _PsX, _PsY);
                    if (ckRznId == 249)
                        this.CopyTmpEvSet("きのこ", _PsX, _PsY);
                }
            }
        }
        befMapID = $gameMap._mapId;
        FstRznSetFlg = false;   
    }
}
const PN_MapNameWin = 20;
const PN_MapNameTxt = PN_MapNameWin + 1;
const PN_MapNameZureY = 13;
const SW_マップ名非表示 = 16;
let MapName_MapCnged = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    MapName_MapCnged.call(this); 
    _SetMapName = MetaChecker($dataMap, "MapName", "del");
    _SetMapName = NLngStrGet(_SetMapName);
}
let NowMapName = "";
let _SetMapName = "";
let MapName_Update = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    MapName_Update.call(this);
    if (_SetMapName == "del") {
        this.DelSpriteSpan(PN_MapNameWin, PN_MapNameTxt);
        _SetMapName = "";
    }
    if (_SetMapName != "" && NowMapName != _SetMapName) {
        if (!$gameSwitches.value(SW_マップ名非表示)) {
            NowMapName = _SetMapName;
            EasingStr = "easeOutQuad";
            StacClearSprite(PN_MapNameWin);
            this.SetSprite(PN_MapNameWin, "PN_MapNameWin", BPs._x - 355, BPs._y + PN_MapNameZureY);
            StacWaitSprite(PN_MapNameWin, 15);
            StacMoveSprite(PN_MapNameWin, BPs._x, true, 15);
            StacWaitSprite(PN_MapNameWin, 120);
            StacMoveSprite(PN_MapNameWin, BPs._x - 355, true, 30);
            StacClearSprite(PN_MapNameTxt);
            this.SpriteStr(PN_MapNameTxt, SCol.Blk0 + _SetMapName, 28, BPs._x - 355 + 18, BPs._y + PN_MapNameZureY + 11);
            StacWaitSprite(PN_MapNameTxt, 15);
            StacMoveSprite(PN_MapNameTxt, BPs._x + 18, true, 15);
            StacWaitSprite(PN_MapNameTxt, 120);
            StacMoveSprite(PN_MapNameTxt, BPs._x - 355 + 18, true, 30);
        }
        $gameSwitches.setValue(SW_マップ名非表示 , false);
        _SetMapName = D_Text_Cng_font = EasingStr = "";
    }
    if (_newYarimanZukanFlg && !$gameMap.isEventRunning() && $gameSwitches.value(SW_ZukanGet)) {
        let setYStr = "";
        for (let i = 0; i <= _newYarimanZukanNames.length - 1; i++) {
            if (setYStr != "") setYStr += "と"
            setYStr += _newYarimanZukanNames[i];
        }
        EasingStr = "easeOutQuad";
        StacClearSprite(PN_MapNameWin);
        this.SetSprite(PN_MapNameWin, "PN_ManGetWin", BPs._x - 512, BPs._y + PN_MapNameZureY);
        StacWaitSprite(PN_MapNameWin, 15);
        StacMoveSprite(PN_MapNameWin, BPs._x, true, 15);
        StacWaitSprite(PN_MapNameWin, 120);
        StacMoveSprite(PN_MapNameWin, BPs._x - 512, true, 30);
        StacClearSprite(PN_MapNameTxt);
        this.SpriteStr(PN_MapNameTxt, NLngStrGet("<value>の ヤリマン図鑑が解放された" , [setYStr]) , 22, BPs._x - 512 + 18 , BPs._y + PN_MapNameZureY + 13);
        StacWaitSprite(PN_MapNameTxt, 15);
        StacMoveSprite(PN_MapNameTxt, BPs._x + 18, true, 15);
        StacWaitSprite(PN_MapNameTxt, 120);
        StacMoveSprite(PN_MapNameTxt, BPs._x - 512 + 18, true, 30);
        _newYarimanZukanFlg = false;
        _newYarimanZukanNames = [];
        EasingStr = "";
    }
}
let GameFirstFlame = true;
let _TktGrFlg = false;
let NupuSetting_StartUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    NupuSetting_StartUpdate.call(this);
    if (GameFirstFlame) {
        this.SpriteStr(10, "  ", 24, 300, 300, 255);
        D_Text_Cng_font = "";
        GameFirstFlame = false;
    }
    if ($gameVariables.value(VoiceVolVarNo) == ConfigManager['seVolume'])
        $gameVariables.setValue(VoiceVolVarNo ,ConfigManager['seVolume'] * 1.25);
}
let NaGCUpFlg = false;
let NupuMap_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    NupuMap_performTransfer.call(this); 
    NaGCUpFlg = true; 
    _MMoveFlame = 0;
}
let _MMoveFlame = 0; 
let NupuSetting_NUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    NupuSetting_NUpdate.call(this);
    _MMoveFlame++;
}
let Vガベージコレクション実行 = function () {
    NaGCUpFlg = true;
}
const PN_TestBase = 500;
const PN_Test_CText = PN_TestBase + 1;
const AddTxtPicCnt = 100;
const PN_Test_Harf = PN_Test_CText + AddTxtPicCnt;
let _EvSel_X = 0;
let _EvSel_Y = 0;
let _EvSel_No = 0;
let _EvSel_Chara_i = 0;
let PlayEvStr = ""; 
let _Ev_Sel_Mode = {
    Chara: 1,
    Text: 2
};
let Ev_Sel_Mode = _Ev_Sel_Mode.Chara;
let Ev_PicArr = [];
let Ev_Self_HTalkFlg = false;
let Ev_Sel_EventName = "";
let _DbgBefSelPicNo = -1;
let _DbgSelectPicNo = -1;
let _DgbOverBGArr = [];
Game_Interpreter.prototype.Ev_Selecter = function () {
    for (let i = 0; i < _DgbOverBGArr.length; i++) {
        if (_DbgBefSelPicNo == _DgbOverBGArr[i]) continue;
        this.DelSprite(_DgbOverBGArr[i]);
        _DgbOverBGArr.splice(i , 1); i--;
    }
    let colCngVal = 28; 
    switch (Ev_Sel_Mode) {
        case _Ev_Sel_Mode.Chara: 
            Ev_PicArr = [];
            for (let i = 0; i <= $Nupu_MV_Data.mv_Chara.length - 1; i++) {
                if (_DbgBefSelPicNo == PN_Test_CText + i) this.DelSprite(PN_Test_CText + i);
                let _setX = Math.floor(i / colCngVal);
                let _setY = i % colCngVal;
                let _cName = $Nupu_MV_Data.mv_Chara[i].name;
                if (_setX == _EvSel_X && _setY == _EvSel_Y) {
                    this.DelSprite(PN_Test_CText + i);
                    this.SetPicStrBG("rgba(255,255,0,0.5)");
                    _DbgBefSelPicNo = PN_Test_CText + i;
                    _DgbOverBGArr.push(PN_Test_CText + i);
                }
                this.SpriteStr(PN_Test_CText + i, _cName, 18, 20 + (120 * _setX), 75 + (25 * _setY) - 5);
                Ev_PicArr.push(PN_Test_CText + i);
            }
            let _CNo = overPointerSpCkArr(Ev_PicArr);
            if (_CNo != -1) {
                let _cki = _CNo - PN_Test_CText;
                _EvSel_X = Math.floor(_cki / colCngVal);
                _EvSel_Y = _cki % colCngVal;
                if (TouchInput.isTriggered()) {
                    _EvSel_Chara_i = _cki;
                    Ev_Sel_Mode = _Ev_Sel_Mode.Text;
                    _EvSel_X = _EvSel_Y = 0;
                    DelSpriteSpan(PN_Test_CText, PN_Test_CText + 300);
                }
            }
            break;
        case _Ev_Sel_Mode.Text: 
            Ev_PicArr = [];
            let _lastX = 0;
            let _txtMemoLenght = $Nupu_MV_Data.mv_Chara[_EvSel_Chara_i].textMemo.length;
            let _EvSelFlg = _EvSel_X <= Math.floor(_txtMemoLenght / colCngVal);
            let _colCnt = 0;
            for (let i = 0; i <= $Nupu_MV_Data.mv_Chara[_EvSel_Chara_i].textMemo.length - 1; i++) {
                let _setX = Math.floor(i / colCngVal);
                let _setY = i % colCngVal;
                _lastX = _setX;
                if (_DbgBefSelPicNo == PN_Test_CText + i) this.DelSprite(PN_Test_CText + i);
                let _drawStr = $Nupu_MV_Data.mv_Chara[_EvSel_Chara_i].textMemo[i].desc;
                for (let i = _drawStr.length; i <= 10 - 1; i++)
                    _drawStr += " ";
                if (_DbgSelectPicNo == PN_Test_CText + i) {
                    this.DelSprite(PN_Test_CText + i);
                    this.SetPicStrBG("rgba(255,255,0,0.5)");
                    _DbgBefSelPicNo = PN_Test_CText + i;
                    _DgbOverBGArr.push(_DbgBefSelPicNo);
                }
                this.SpriteStr(PN_Test_CText + i, _drawStr, 18, 20 + (200 * _setX), 75 + (25 * _setY));
                Ev_PicArr.push(PN_Test_CText + i);
                _colCnt = Math.floor(i / colCngVal);
            }
            for (let i = 0; i <= $Nupu_MV_Data.mv_Chara[_EvSel_Chara_i].nTextMemo.length - 1; i++) {
                let _setX = Math.floor(i / colCngVal) + _lastX + _colCnt;
                let _setY = i % colCngVal;
                if (_DbgBefSelPicNo == PN_Test_Harf + i) this.DelSprite(PN_Test_Harf + i);
                let _drawStr = $Nupu_MV_Data.mv_Chara[_EvSel_Chara_i].nTextMemo[i].desc;
                for (let i = _drawStr.length; i <= 10 - 1; i++) {
                    _drawStr += " ";
                }
                if (_DbgSelectPicNo == PN_Test_Harf + i) {
                    this.DelSprite(PN_Test_Harf + i);
                    this.SetPicStrBG("rgba(255,255,0,0.5)");
                    _DbgBefSelPicNo = PN_Test_Harf + i;
                    _DgbOverBGArr.push(_DbgBefSelPicNo);
                }
                this.SpriteStr(PN_Test_Harf + i, _drawStr, 18, 20 + (160 * (_setX + 1)), 75 + (colCngVal * _setY));
                Ev_PicArr.push(PN_Test_Harf + i);
            }
            let _CNo_T = overPointerSpCkArrTm(Ev_PicArr);
            if (_CNo_T != -1) {
                _DbgSelectPicNo = _CNo_T;
                if (_CNo_T >= PN_Test_Harf) {
                    Ev_Self_HTalkFlg = false;
                    _EvSel_No = _CNo_T - PN_Test_Harf;
                } else {
                    Ev_Self_HTalkFlg = true;
                    _EvSel_No = _CNo_T - PN_Test_CText;
                }
                if (TouchInput.isTriggered()) {
                    DelSpriteSpan(PN_Test_CText, PN_Test_CText + 300);
                    let _SelText = $Nupu_MV_Data.mv_Chara[_EvSel_Chara_i].name;
                    if (!Ev_Self_HTalkFlg) {
                        _SelText += "_" + $Nupu_MV_Data.mv_Chara[_EvSel_Chara_i].nTextMemo[_EvSel_No].name;
                    } else {
                        _SelText += "_" + $Nupu_MV_Data.mv_Chara[_EvSel_Chara_i].textMemo[_EvSel_No].name;
                    }
                    Ev_Sel_EventName = _SelText;
                    this.Ev_Selecter_Close();
                    return false;
                }
            }
            if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
                Ev_Sel_Mode = _Ev_Sel_Mode.Chara;
                _EvSel_X = _EvSel_Y = 0;
                DelSpriteSpan(PN_Test_CText, PN_Test_CText + 300);
            }
            break;
    }
    return true; 
}
let N_Setting_NTM_execCallMapEvent = Game_Interpreter.prototype.NTM_execCallMapEvent;
Game_Interpreter.prototype.NTM_execCallMapEvent = function (args) {
    N_Setting_NTM_execCallMapEvent.apply(this, arguments);
    if ($N_Yarimon_DB.NotHTextList.indexOf(args[0]) == -1 && DbgFlg) {
        this.SetSprite(_DbgPicNo, "PN_DbgHPic", 1340, 0);
    } else {
        this.DelSprite(_DbgPicNo);
    }
};
Game_Interpreter.prototype.Ev_Selecter_Close = function () {
    DelSpriteSpan(PN_Test_CText, PN_Test_CText + 60);
    Ev_Sel_Mode = _Ev_Sel_Mode.Chara;
}
Game_Interpreter.prototype._透明度ループ = function () {
    if (this.character(0)._透明UpFlg == null) this.character(0)._透明UpFlg = false;
    if (this.character(0)._透明UpFlg) {
        this.character(0)._opacity += 3;
        if (this.character(0)._opacity >= 155) this.character(0)._opacity += 6;
        if (this.character(0)._opacity >= 255) {
            this.character(0)._opacity = 255;
            this.character(0)._透明UpFlg = false;
        }
    } else {
        this.character(0)._opacity -= 3;
        if (this.character(0)._opacity >= 155) this.character(0)._opacity -= 6;
        if (this.character(0)._opacity <= 0) {
            this.character(0)._opacity = 0;
            this.character(0)._透明UpFlg = true;
        }
    }
}
let _ザーメンChara = null;
Game_Interpreter.prototype.ザーメン位置設定 = function (_XPs, _YPs) {
    let _RndNo = Math.floor(Math.random() * 3) + 1;
    let _SetEvName = "ザーメン_" + _RndNo;
    if ($dataMapInfos[$gameMap._mapId].name.indexOf("IN") != -1) {
        _SetEvName += "_IN";
    }
    this.CopyTmpEvSet(_SetEvName, _XPs, _YPs);
}
Game_Interpreter.prototype.ザーメンその場設定 = function (_MobFlg) {
    _MobFlg = typeof _MobFlg !== 'undefined' ? _MobFlg : false;
    this.ザーメン配置セーブ();
    this.ザーメンEvSet(_MobFlg);
}
Game_Interpreter.prototype.ザーメン配置セーブ = function () {
    _ザーメンChara = this.character(0);
}
Game_Interpreter.prototype.ザーメンEvSet = function (_MobFlg) {
    let _RndNo = Math.floor(Math.random() * 3) + 1;
    let _SetEvName = "ザーメン_" + _RndNo;
    if ($dataMapInfos[$gameMap._mapId].name.indexOf("IN") != -1) {
        _SetEvName += "_IN";
    }
    if (!回想Flg) {
        this.CopyTmpEvSet(_SetEvName, _ザーメンChara._x, _ザーメンChara._y);
        if (_MobFlg) {
            if (_MobFuckNo != -1) {
                if ($gameSystem.MobFuckList.indexOf(_MobFuckNo) == -1) {
                    $gameSystem.MobFuckList.push(_MobFuckNo);
                }
            }
        }
    }
    _MobFuckNo = -1;
}
Game_Interpreter.prototype.黒フェード表示 = function (_Pixel) {
    this.SetSpriteFIn(PN_UnderBlack, "PN_UnderBlack", 0, 810, 0, 0, 10, 255, 100, -100 * (150 / _Pixel))
}
Game_Interpreter.prototype.黒フェード終了 = function () {
    this.MoveSprite(PN_UnderBlack, true, true, 10, 0);
}
let _Ending_Img高さ = 0;
let _Ending_ImgTime = 720; 
let _Ending_Start_flame = 120; 
let _Ending_flame = 0;
let _Ending_Zuref = 0;
let _EndStartFlg = false;
let _Ending_BgmOffFlg = false;
let _EndingCheckFlg = false; 
const CN_BGMOFF = 50;
Game_Interpreter.prototype.N_Ending_Draw = function () {
    EasingStr = "";
    _Ending_flame = 0;
    this.SetSpriteFIn(PN_Staff, "PN_Staff", 0, 0, 0, 0, _Ending_Start_flame);
    _EndStartFlg = true;
    _Ending_BgmOffFlg = false;
    _EndingCheckFlg = true;
}
Game_Interpreter.prototype.N_Ending_Update = function () {
    if (GetSpriteData(PN_Staff).alpha == 1 && _EndStartFlg) {
        _Ending_Img高さ = GetSpriteData(PN_Staff).height;
        this.MoveSprite(PN_Staff, 0, -_Ending_Img高さ + 810, _Ending_ImgTime);
        _EndStartFlg = false;
    }
    if (GetSpriteData(PN_Staff)._y == -_Ending_Img高さ + 810) {
        if (!_Ending_BgmOffFlg) {
            _Ending_BgmOffFlg = true;
            this.SetCmnEvent(CN_BGMOFF); 
        }
        if (TouchInput.isTriggered() || Input.isTriggered('ok')) {
            this.SetSprite(PN_FlameEffect , "Black"); 
            this.MoveSprite(PN_Staff, true, true, 60, 0);
            if (NN_PAnime != undefined) NN_PAnime._EndFlg = true;
            return false;
        }
        return true;
    }
    _Ending_flame++;
    return true; 
}
let _BefHideMsgWin = null;
let _MsgHide_Update = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    _MsgHide_Update.call(this);
    if (_BefHideMsgWin != SceneManager._scene._messageWindow._hideByMessageWindowHidden) {
        if (SceneManager._scene._messageWindow._hideByMessageWindowHidden) {
            this.MoveSprite(PN_TalkWin, true, true, 1, 0);
        } else {
            this.MoveSprite(PN_TalkWin, true, true, 1, HTalkBackOpi);
        }
    }
    if (SceneManager._scene._messageWindow._hideByMessageWindowHidden != undefined) {
        _BefHideMsgWin = SceneManager._scene._messageWindow._hideByMessageWindowHidden;
    }
}
let BuffEffectArr = [];
class BuffEffData {
    constructor(_chara, _ckEff) {
        this._chara = _chara;
        this._ckEff = _ckEff;
    }
}
let BuffEffectSet = function (_chara, _ckEff) {
    BuffEffectArr.push(new BuffEffData(_chara, _ckEff));
}
class SelfKeep {
    constructor(_MapId, _EvId, _SelfStr) {
        this._MapId = _MapId;
        this._EvId = _EvId;
        this._SelfStr = _SelfStr;
    }
}
let _Self_Keep_Save = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    _Self_Keep_Save.call(this);
    this._SelfKeepArr = []; 
};
Game_Interpreter.prototype.SelfKeepArr_Add = function (_SelfKeep) {
    let _AddFlg = true;
    for (let i = 0; i <= $gameSystem._SelfKeepArr.length - 1; i++) {
        if ($gameSystem._SelfKeepArr[i]._MapId == _SelfKeep._MapId &&
            $gameSystem._SelfKeepArr[i]._EvId == _SelfKeep._EvId &&
            $gameSystem._SelfKeepArr[i]._SelfStr == _SelfKeep._SelfStr) {
            _AddFlg = false;
        }
    }
    if (_AddFlg) {
        $gameSystem._SelfKeepArr.push(_SelfKeep);
    }
}
Game_Interpreter.prototype.SelfKeepSet = function (_SelfStr) {
    let _MapId = $gameMap._mapId;
    let _EvNo = this.character(0)._eventId;
    let _SetSelfKeep = new SelfKeep(_MapId, _EvNo, _SelfStr);
    this.SelfKeepArr_Add(_SetSelfKeep);
}
Game_Interpreter.prototype.SelfKeep_AllReSet = function () {
    for (let i = 0; i <= $gameSystem._SelfKeepArr.length - 1; i++) {
        let _MapId = $gameSystem._SelfKeepArr[i]._MapId;
        let _EvNo = $gameSystem._SelfKeepArr[i]._EvId;
        let _SelfStr = $gameSystem._SelfKeepArr[i]._SelfStr;
        key = [_MapId, _EvNo, _SelfStr];
        $gameSelfSwitches.setValue(key, false); 
    }
}
let saveOnlyBox = new Menu_Save();
let saveCheckFlg = false; 
Game_Interpreter.prototype.SaveWindowOnly_Open = function () {
    this.MoveSprite(PN_FlameEffect , true , true , 15 , 0);
    saveOnlyBox = new Menu_Save();
    saveExitFlg = false;
    saveCheckFlg = false;
    saveOnlyFlg = true; 
}
Game_Interpreter.prototype.SaveWindowOnly_Update = function () {
    saveOnlyBox.Update();
    this.Menu_SaveUpdate(saveOnlyBox , false);
    if (saveExitFlg) {
        this.DelSpriteSpan(PN_smBase , PN_BtlEn);
        return false;
    }
    return true; 
}
Game_Interpreter.prototype.Sc図鑑開放 = function () {
    let _図鑑No = Number(EnstVar[0]);
    let _シーンNo = Number(EnstVar[1]);
    if (_シーンNo == -1) return;
    MenuHSceneOpen(_図鑑No, _シーンNo);
}
Game_Interpreter.prototype.AllMan図鑑開放 = function () {
    for (let i = 0; i < $gameSystem.mZukan.length; i++) {
        let ckMZukan = $gameSystem.mZukan[i];
        for (let j = 0; j < $N_Yariman_DB.length; j++) {
            let ckYData = $N_Yariman_DB[j];
            if (ckMZukan.id != ckYData.id) continue;
            for (let k = 0; k < ckYData.hScene.length; k++) {
                if (ckMZukan.hSceneFlg.length <= k) ckMZukan.hSceneFlg.push(false);
                ckMZukan.hSceneFlg[k] = true;
            }
            for (let k = 0; k < ckYData.tatiePic.tatieDatas.length; k++) {
                if (ckMZukan.hTatieFlg.length <= k) ckMZukan.hTatieFlg.push(false);
                ckMZukan.hTatieFlg[k] = true;
            }
            ckMZukan.lookFlg = ckMZukan.getFlg = true;
        }
    }
}
Game_Interpreter.prototype.AllMon図鑑開放 = function (loolOnlyFlg) {
    loolOnlyFlg = typeof loolOnlyFlg !== 'undefined' ? loolOnlyFlg : false;
    for (let i = 0; i < 151; i++) {
        $gameSystem.yZukan[i].lookFlg = true;
        $gameSystem.yZukan[i].getFlg = !loolOnlyFlg;
    }
    if ($gameSwitches.value(SW_200匹図鑑ON)) {
        for (let i = 180; i < 230; i++) {
            $gameSystem.yZukan[i].lookFlg = true;
            $gameSystem.yZukan[i].getFlg = !loolOnlyFlg;
        }
    }
}
Game_Interpreter.prototype.NupuryuヒントView = function () {
    this.SetSprite(PN_DsBase , "NupuryuHint" , 0 , 810);
    this.PlaySe("_Select_Card");
    EasingStr = "easeOutQuad";
    this.MoveSprite(PN_DsBase , 0 , 0 , 30);
    EasingStr = "";
}
Game_Interpreter.prototype.NupuryuヒントClose = function () {
    this.PlaySe("_Select_Card");
    EasingStr = "easeOutQuad";
    this.MoveSprite(PN_DsBase , 0 , -810 , 30);
    EasingStr = "";
}
let PN_Syojo = 560;
const SW_SyojoNDLC = 477;
Game_Interpreter.prototype.N賞状View = function (fileName) {
    var fileName = typeof fileName !== 'undefined' ? fileName : "";
    if (fileName == "") {
        if ($gameSwitches.value(SW_SyojoNDLC))
            this.SetSpriteFIn( PN_Syojo , "PN_Syojo_NDlc" , 0 , 0 , 0 , 0 , 10);
        else
            this.SetSpriteFIn( PN_Syojo , "PN_Syojo" , 0 , 0 , 0 , 0 , 10);
    } else {
        this.SetSpriteFIn( PN_Syojo , fileName, 0 , 0 , 0 , 0 , 10);
    }
}
Game_Interpreter.prototype.N賞状End = function () {
    this.MoveSprite(PN_Syojo , 0 , 0 , 10 , 0);
}
var NetaTitle_flame = 0;
var NetaSelectNo = 0;
let NetaCbm= [
    [623,489 + 45 * 0,192,36],
    [623,489 + 45 * 1,192,36],
    [623,489 + 45 * 2,192,36]
];
const NetaTitle = 488;
const NetaTitle_win = NetaTitle + 1;
const NetaTitle_selecter = NetaTitle_win + 1;
const NetaTitle_moji = NetaTitle_selecter + 1;
const NetaTitle_top = NetaTitle_moji + 1;
let NetaEndFlame = 0;
Game_Interpreter.prototype.NetaTitleStart = function () {
    NetaTitle_flame = 0;
    NetaSelectNo = 0;
    NetaEndFlame = 0;
    this.SetSpriteFIn( NetaTitle , "NetaTitle" , 0 , 0 , 0 , 0 , 10);
}
Game_Interpreter.prototype.NetaTitleUpdate = function () {
    NetaTitle_flame++;
    if (NetaTitle_flame == 30) {
        this.SetSpriteFIn( NetaTitle_top , "NetaTitle_top" , 0 , 0 , 0 , 0 , 10);
    }
    if (NetaTitle_flame == 45) {
        this.SetSpriteFIn( NetaTitle_win , "NetaTitle_win" , 0 , 0 , 0 , 0 , 10);
        this.SetSpriteFIn( NetaTitle_moji , "NetaTitle_moji" , 0 , 0 , 0 , 0 , 10);
    }
    if (NetaTitle_flame == 55) {
        this.SetSprite(NetaTitle_selecter , "NetaTitle_selecter" , 623 , 489);
    }
    if (NetaTitle_flame >= 60 && NetaEndFlame == 0) {
        let _cbmNo = overSpriteClickable( NetaTitle_top , NetaCbm);
        if (_cbmNo != -1) {
            if (NetaSelectNo != _cbmNo) {
                this.PlaySe("NetaCursor");
                NetaSelectNo = _cbmNo;
            }
        }
        if (Input.isTriggered('up')) {
            this.PlaySe("NetaCursor");
            NetaSelectNo--;
        }
        if (Input.isTriggered('down')) {
            this.PlaySe("NetaCursor");
            NetaSelectNo++;
        }
        if (NetaSelectNo < 0) NetaSelectNo = 2;
        if (NetaSelectNo > 2) NetaSelectNo = 0;
        this.SetSprite(NetaTitle_selecter , "NetaTitle_selecter" , 623 , 489 + 45 * NetaSelectNo);
        if (Input.isTriggered('ok') || (TouchInput.isPressed() && _cbmNo != -1)) {
            this.PlaySe("NetaDecision");
            this.MoveSprite(NetaTitle_win , true, true, 60 , 0);
            this.MoveSprite(NetaTitle_selecter , true, true, 60 , 0);
            this.MoveSprite(NetaTitle_moji , true, true, 60 , 0);
            this.SetSpriteFIn( NetaTitle_top , "BlackBack" , 0 , 0 , 0 , 0 , 60);
            NetaEndFlame = 60;
        }
    }
    if (NetaEndFlame > 0) {
        NetaEndFlame--;
        if (NetaEndFlame == 1) {
            this.DelSpriteSpan(NetaTitle + 1 , NetaTitle_top);
            this.SetSprite(NetaTitle , "BlackBack");
            return false;
        }
    }
    return true; 
}
Game_Interpreter.prototype.NetaTitleClose = function () {
    this.DelSpriteSpan(NetaTitle , NetaTitle_top);
}
Window_Base.prototype.standardFontSize = function() {
    if (LngMode == "en") return 22;
    return Yanfly.Param.FontSize;
};
function InsertLineBreaks(text, maxLength) {
    let result = '';
    let currentLine = '';
    text.split(' ').forEach(word => {
        if ((currentLine + word).length > maxLength) {
            result += currentLine.trim() + '\n';
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });
    result += currentLine.trim();
    return result;
}
