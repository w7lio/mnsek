const EndLabo_PicPath = "pictures/EndLabo/";
const EndLaboDebug_PicPath = "pictures/EndLabo/Debug/";
const PN_ELBack = PN_ymBase; 
const PN_ELSelectR = PN_ymTikeBar;
const PN_ELYarimon = PN_ELSelectR + 1;
const PN_ELBallNoTate = PN_ELYarimon + 3;
const PN_ELMonSelect = PN_ELBallNoTate + 1;
const PN_ELMonDtl = PN_ELMonSelect + 1;
const PN_ELSelectBack = PN_ELMonDtl + 7;
const PN_ELSelectWin = PN_ELSelectBack + 1;
const PN_ELCng = PN_ELSelectWin + 7;
const PN_ELCngSelectR = PN_ELCng + 1;
const PN_ELCngYarimon = PN_ELCngSelectR + 1;
const PN_ELPartySub = PN_ELCngYarimon + 4;
const PN_ELSubYarimon = PN_ELPartySub + 1;
const PN_ELBallNoYoko = PN_ELSubYarimon + 4;
const PN_ELCngSelect = PN_ELBallNoYoko + 2;
const PN_ELCngDtl = PN_ELCngSelect + 1;
const PN_ELNewMark = PN_ELCngDtl + 5;
const PN_ELCngMonSelect = PN_ELMonSelect + 1;
const PN_ELCngMon = PN_ELCngMonSelect + 1;
const PN_ELCngBall = PN_ELCngMon + 2;
const PN_ELCngCkBack = PN_ELCngBall + 1;
const PN_ELCngCkDtl = PN_ELCngCkBack + 1;
const PN_ELSelectDoor = 205;
const VN_エンドラボ回戦数 = 324;
let EndLabo_Initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    EndLabo_Initialize.call(this);
    this.EndLaboBefParty = []; 
    this.EndLaboParty = []; 
    this.EndLaboTrnIds = [];  
    this.EndLaboMonDatas = [];  
    this.EndLaboSelectGrp0 = []; 
    this.EndLaboSelectGrp1 = []; 
    this.EndLaboSelectGrp2 = []; 
    this.EndLaboSelectGrp3 = []; 
};
let EndLabo_InitializeUpdate = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    EndLabo_InitializeUpdate.call(this);
    if ($gameSystem.EndLaboBefParty == undefined) $gameSystem.EndLaboBefParty = [];
    if ($gameSystem.EndLaboParty == undefined) $gameSystem.EndLaboParty = [];
    if ($gameSystem.EndLaboTrnIds == undefined) $gameSystem.EndLaboTrnIds = [];
    if ($gameSystem.EndLaboMonDatas == undefined) $gameSystem.EndLaboMonDatas = [];
    if ($gameSystem.EndLaboSelectGrp0 == undefined) $gameSystem.EndLaboSelectGrp0 = [];
    if ($gameSystem.EndLaboSelectGrp1 == undefined) $gameSystem.EndLaboSelectGrp1 = [];
    if ($gameSystem.EndLaboSelectGrp2 == undefined) $gameSystem.EndLaboSelectGrp2 = [];
    if ($gameSystem.EndLaboSelectGrp3 == undefined) $gameSystem.EndLaboSelectGrp3 = [];
}
let ResetEndLaboData = function () {
    $gameSystem.EndLaboBefParty = [];
    $gameSystem.EndLaboParty = [];
    $gameSystem.EndLaboTrnIds = [];
    $gameSystem.EndLaboMonDatas = [];
    $gameSystem.EndLaboSelectGrp0 = [];
    $gameSystem.EndLaboSelectGrp1 = [];
    $gameSystem.EndLaboSelectGrp2 = [];
    $gameSystem.EndLaboSelectGrp3 = [];
}
let GetRandGrpYarimonId = function (grpNo , offIds) {
    offIds = typeof offIds !== 'undefined' ? offIds : []; 
    var rtnValue = -1;
    switch (grpNo) {
        case 0:
            ArrRemoveArr($gameSystem.EndLaboSelectGrp0 , offIds);
            if ($gameSystem.EndLaboSelectGrp0.length == 0) {
                for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
                    var monData = $N_LaboratoryData.laboYarimonDatas[i];
                    if (monData.laboGrpYarimonDatas[grpNo].check) $gameSystem.EndLaboSelectGrp0.push(monData.id);
                }
                ShuffleArr($gameSystem.EndLaboSelectGrp0);
            }
            ArrRemoveArr($gameSystem.EndLaboSelectGrp0 , offIds);
            rtnValue = $gameSystem.EndLaboSelectGrp0[0];
            $gameSystem.EndLaboSelectGrp0.shift();
            break;
        case 1:
            ArrRemoveArr($gameSystem.EndLaboSelectGrp1 , offIds);
            if ($gameSystem.EndLaboSelectGrp1.length == 0) {
                for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
                    var monData = $N_LaboratoryData.laboYarimonDatas[i];
                    if (monData.laboGrpYarimonDatas[grpNo].check) $gameSystem.EndLaboSelectGrp1.push(monData.id);
                }
                ShuffleArr($gameSystem.EndLaboSelectGrp1);
            }
            ArrRemoveArr($gameSystem.EndLaboSelectGrp1 , offIds);
            rtnValue = $gameSystem.EndLaboSelectGrp1[0];
            $gameSystem.EndLaboSelectGrp1.shift();
            break;
        case 2:
            ArrRemoveArr($gameSystem.EndLaboSelectGrp2 , offIds);
            if ($gameSystem.EndLaboSelectGrp2.length == 0) {
                for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
                    var monData = $N_LaboratoryData.laboYarimonDatas[i];
                    if (monData.laboGrpYarimonDatas[grpNo].check) $gameSystem.EndLaboSelectGrp2.push(monData.id);
                }
                ShuffleArr($gameSystem.EndLaboSelectGrp2);
            }
            ArrRemoveArr($gameSystem.EndLaboSelectGrp2 , offIds);
            rtnValue = $gameSystem.EndLaboSelectGrp2[0];
            $gameSystem.EndLaboSelectGrp2.shift();
            break;
        case 3:
            ArrRemoveArr($gameSystem.EndLaboSelectGrp3 , offIds);
            if ($gameSystem.EndLaboSelectGrp3.length == 0) {
                for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
                    var monData = $N_LaboratoryData.laboYarimonDatas[i];
                    if (monData.laboGrpYarimonDatas[grpNo].check) $gameSystem.EndLaboSelectGrp3.push(monData.id);
                }
                ShuffleArr($gameSystem.EndLaboSelectGrp3);
            }
            ArrRemoveArr($gameSystem.EndLaboSelectGrp3 , offIds);
            rtnValue = $gameSystem.EndLaboSelectGrp3[0];
            $gameSystem.EndLaboSelectGrp3.shift();
            break;
    }
    return rtnValue;
}
Game_Interpreter.prototype.BtlLabo_所持チケモンSave = function () {
    ResetEndLaboData();
    $gameSystem.EndLaboBefParty = [];
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        $gameSystem.EndLaboBefParty.push(
            JSON.parse(JSON.stringify($gameSystem.Player.syojiTikemon[i]))
        );
    }
    $gameSystem.Player.syojiTikemon = []; 
}
Game_Interpreter.prototype.BtlLabo_所持チケモンLoad = function () {
    $gameSystem.Player.syojiTikemon = [];
    for (let i = 0; i < $gameSystem.EndLaboBefParty.length; i++) {
        $gameSystem.Player.syojiTikemon.push(
            JSON.parse(JSON.stringify($gameSystem.EndLaboBefParty[i]))
        );
    }
    $gameSystem.EndLaboBefParty = [];
}
Game_Interpreter.prototype.BtlLabo_中断Save = function () {
    $gameSystem.EndLaboParty = [];
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        $gameSystem.EndLaboParty.push(
            JSON.parse(JSON.stringify($gameSystem.Player.syojiTikemon[i]))
        );
    }
    this.BtlLabo_所持チケモンLoad();
}
Game_Interpreter.prototype.BtlLabo_クリア時ヤリモン処理 = function () {
    $gameSystem.EndLaboParty = [];
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        var yarimonData = JSON.parse(JSON.stringify($gameSystem.Player.syojiTikemon[i]));
        SetZukanGet_Id(yarimonData.id);
        MonBoxAdd(yarimonData);
    }
    this.BtlLabo_所持チケモンLoad();
}
Game_Interpreter.prototype.BtlLabo_所持チケモンReLoad = function () {
    $gameSystem.EndLaboBefParty = [];
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        $gameSystem.EndLaboBefParty.push(
            JSON.parse(JSON.stringify($gameSystem.Player.syojiTikemon[i]))
        );
    }
    $gameSystem.Player.syojiTikemon = []; 
    for (let i = 0; i < $gameSystem.EndLaboParty.length; i++) {
        $gameSystem.Player.syojiTikemon.push(
            JSON.parse(JSON.stringify($gameSystem.EndLaboParty[i]))
        );
    }
}
let IsEndLaboMode = function () {
    if ($gameSystem.EndLaboBefParty == undefined) $gameSystem.EndLaboBefParty = [];
    return $gameSystem.EndLaboBefParty.length != 0;
}
let IsEndLabo中断Save = function () {
    return $gameSystem.EndLaboParty.length > 0;
}
var selectYarimonDatasList = []; 
var selectYarimonDatasNo = 0;  
var selectYarimonDatas = [];    
var btlLabo選択ヤリモンNo = 0;
var btlLabo初回追加Flg = false;
var btlLaboManager = null;
var pヤリモン選択Phase = null;
var p変更選択Phase = null;
var p技確認Phase = null;
var pパーティー確認Phase = null;
var BtlLabo選択完了Flg = false; 
Game_Interpreter.prototype.BtlLabo_選択Start = function () {
    btlLabo選択ヤリモンNo = 0;
    btlLabo初回追加Flg = !IsEndLaboMode();
    btlLaboManager = new PhaseManager(this); 
    pヤリモン選択Phase = new EndLabo_Iヤリモン選択Phase(); 
    pヤリモン選択Phase.exitAction = function () {
        btlLaboManager.gi.DelSpriteSpan(PN_ELBack , PN_mL2Selecter);
        if (btlLabo初回追加Flg) $gameSystem.Player.syojiTikemon = [];
        BtlLabo選択完了Flg = false;
        btlLaboManager.exitFlg = true; 
    }
    btlLaboManager.CngPhase(pヤリモン選択Phase); 
    pヤリモン選択Phase.submmitAction = function () {
        p変更選択Phase = new EndLabo_I変更選択Phase();
        p変更選択Phase.submmitAction = function () { 
            pパーティー確認Phase = new EndLabo_Iパーティー確認Phase(false);
            pパーティー確認Phase.submmitAction = function () {
                btlLaboManager.gi.DelSpriteSpan(PN_ELBack , PN_mL2Selecter);
                BtlLabo選択完了Flg = true;
                btlLaboManager.exitFlg = true;
            }
            pパーティー確認Phase.cancelAction = function () {
                btlLaboManager.CngPhase(pヤリモン選択Phase); 
            }
            btlLaboManager.CngPhase(pパーティー確認Phase); 
        }
        p変更選択Phase.cancelAction = function () {
            btlLaboManager.CngPhase(pヤリモン選択Phase); 
        }
        btlLaboManager.CngPhase(p変更選択Phase); 
    }
    pヤリモン選択Phase.fstAddAction = function (gi) {
        if ($gameSystem.Player.syojiTikemon.length == 3) {
            pパーティー確認Phase = new EndLabo_Iパーティー確認Phase(true);
            pパーティー確認Phase.submmitAction = function () {
                gi.DelSpriteSpan(PN_ELBack , PN_mL2Selecter);
                BtlLabo選択完了Flg = true;
                btlLaboManager.exitFlg = true;
            }
            pパーティー確認Phase.cancelAction = function () {
                $gameSystem.Player.syojiTikemon = [];
                selectYarimonDatasNo = 0; 
                btlLabo選択ヤリモンNo = 0;
                gi.BtlLabo_DrawSelectMon();
                btlLaboManager.CngPhase(pヤリモン選択Phase); 
            }
            btlLaboManager.CngPhase(pパーティー確認Phase); 
        } else {
            selectYarimonDatasNo++;
            btlLabo選択ヤリモンNo = 0;
            gi.BtlLabo_DrawSelectMon();
            btlLaboManager.CngPhase(pヤリモン選択Phase); 
        }
    }
    if (!IsEndLaboMode()) {
        this.BtlLabo_所持チケモンSave();
        this.Labo最初からヤリモン設定();
    }
    if (laboSetMonIds.length > 0) this.BtlLabo_SettingMon(1);
    DouguMenuPNSetting(PN_mL2Base + 1 , PN_mL2Selecter);
    selectYarimonDatasNo = 0; 
    this.BtlLabo_DrawSelectMon();
    BtlLabo_選択UpdateFrame = 0;
}
Game_Interpreter.prototype.Labo最初からヤリモン設定 = function () {
    selectYarimonDatasList = [];
    if (selectYarimonDatasList.length == 0) this.BtlLabo_SettingMon(3);
}
Game_Interpreter.prototype.BtlLabo_Door閉じる = function () {
    isFastOff = true;
    EasingStr = "easeOutQuad";
    this.SetSprite(PN_ELSelectDoor + 0 , EndLabo_PicPath + "PN_ELSelectDoorR" , 500);
    this.SetSprite(PN_ELSelectDoor + 1 , EndLabo_PicPath + "PN_ELSelectDoorL" , -500);
    this.MoveSprite(PN_ELSelectDoor + 0 , 0 , 0 , 30);
    this.MoveSprite(PN_ELSelectDoor + 1 , 0 , 0 , 30);
    EasingStr = "";
}
let BtlLabo_選択UpdateFrame = 0;
const LaboDoorTime = 15;
Game_Interpreter.prototype.BtlLabo_選択Update = function () {
    if (BtlLabo_選択UpdateFrame < LaboDoorTime) {
        EasingStr = "easeOutQuad";
        this.MoveSprite(PN_ELSelectDoor + 0 , 500 , 0 , 30);
        this.MoveSprite(PN_ELSelectDoor + 1 , -500 , 0 , 30);
        EasingStr = "";
        BtlLabo_選択UpdateFrame++;
        if (BtlLabo_選択UpdateFrame == LaboDoorTime) isFastOff = false;
    }
    if (btlLaboManager != null) {
        btlLaboManager.Update();
        if (btlLaboManager.exitFlg) return false; 
    }
    return true; 
}
Game_Interpreter.prototype.BtlLabo_選択End = function () {
    btlLaboManager = null;
}
let laboSetMonIds = []; 
Game_Interpreter.prototype.BtlLabo_SettingMon = function (cnt) {
    let a重複IdCheckArr = [];
    selectYarimonDatasList = [];
    if (laboSetMonIds.length > 0) {
        var settingMonDatass = [];
        for (let k = 0; k < laboSetMonIds.length; k++) {
            var monId = laboSetMonIds[k];
            var selectLaboMonData;
            for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
                var monData = $N_LaboratoryData.laboYarimonDatas[i];
                if (monId == monData.id) {
                    selectLaboMonData = monData;
                    break;
                }
            }
            settingData = selectLaboMonData.laboGrpYarimonDatas[BtlLabo対戦相手GrpNos[k]];
            var setYarimonData = new YarimonData(selectLaboMonData.id , 75 , 0);
            setYarimonData.btlCount = 5 * StarRankBtlValue; 
            setYarimonData.btlWazas = [];
            for (let j = 0; j < settingData.btlWazas.length; j++) {
                $N_Yarimon_DB.wazaDatas.forEach(_wazaData => {
                    if (_wazaData.id == settingData.btlWazas[j].id) {
                        setYarimonData.btlWazas.push(new WazaData(_wazaData.id , _wazaData.kaisu));
                    }
                });
            }
            settingMonDatass.push(setYarimonData);
        }
        selectYarimonDatasList.push(settingMonDatass);
        laboSetMonIds = [];
        return; 
    }
    for (let k = 0; k < cnt; k++) {
        let setMonDatas = [];
        let grpNo = 0;
        for (let l = 0; l < 3; l++) { 
            let monId = GetRandGrpYarimonId(grpNo);
            for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
                if ($N_LaboratoryData.laboYarimonDatas[i].id == monId) {
                    var settingData = $N_LaboratoryData.laboYarimonDatas[i].laboGrpYarimonDatas[grpNo];
                    var setYarimonData = new YarimonData(monId , 75 , 0);
                    setYarimonData.btlCount = 5 * StarRankBtlValue; 
                    setYarimonData.btlWazas = [];
                    setYarimonData.GrpNo = grpNo; 
                    for (let j = 0; j < settingData.btlWazas.length; j++) {
                        $N_Yarimon_DB.wazaDatas.forEach( _wazaData => {
                            if (_wazaData.id == settingData.btlWazas[j].id) {
                                setYarimonData.btlWazas.push(new WazaData(_wazaData.id , _wazaData.kaisu));
                            }
                        });
                    }
                    setMonDatas.push(setYarimonData);
                }
            }
        }
        selectYarimonDatasList.push(setMonDatas);
    }
}
Game_Interpreter.prototype.BtlLabo_DrawSelectMon = function () {
    selectYarimonDatas = selectYarimonDatasList[selectYarimonDatasNo];
    for (let i = 0; i < selectYarimonDatas.length; i++) {
        selectYarimonDatas[i].hp = MHP(selectYarimonDatas[i]);
        var picPath = selectYarimonDatas[i].YarimonData.picPath;
        this.SetSpriteC(PN_ELYarimon + i, Btl_Yarimon + picPath, BPs._x + 108, BPs._y + 190 + 160 * i , 255 , 50 , 50);
    }
    this.SetSprite(PN_ELBack, EndLabo_PicPath + "PN_ELBack1", BPs._x, BPs._y);
    this.Menu_YarimonDetailDraw(selectYarimonDatas[btlLabo選択ヤリモンNo] , true);
    this.SetSprite(PN_ELBallNoTate, EndLabo_PicPath + "PN_ELBallNoTate", BPs._x, BPs._y);
}
let EndLabo_CbmArr= [];
const EndLabo_Iヤリモン選択PhaseMode =  {
    ISelectMode: 0 ,
    IDetailMode: 1 ,
    IWazaMode: 2 ,
    IExitMode: 3 ,
}
class EndLabo_Iヤリモン選択Phase extends PhaseBase {
    constructor() {
        super();
        this.submmitAction;
        this.fstAddAction;
        this.exitAction;
        this.mode = EndLabo_Iヤリモン選択PhaseMode.ISelectMode;
        this.detailSelectNo = 0;
        this.exitSelectNo = 0;
    }
    Enter(gi) {
        this.mode = EndLabo_Iヤリモン選択PhaseMode.ISelectMode;
        gi.DelSpriteSpan(PN_ELMonSelect , PN_mL2Selecter);
    }
    Update(gi) {
        switch (this.mode) {
            case EndLabo_Iヤリモン選択PhaseMode.ISelectMode: 
                EndLabo_CbmArr = [];
                for (let i = 0; i < 3; i++) EndLabo_CbmArr.push([36 , 131 + 160 * i , 149 , 129]);
                let _cbmNo = overSpriteClickable( PN_ELBack , EndLabo_CbmArr);
                if (_cbmNo != -1 && btlLabo選択ヤリモンNo != _cbmNo) {
                    SoundManager.playCursor();
                    btlLabo選択ヤリモンNo = _cbmNo;
                    gi.Menu_YarimonDetailDraw(selectYarimonDatas[btlLabo選択ヤリモンNo] , true);
                }
                gi.SetSpriteC(PN_mL2Selecter, MenuPicPath + "PN_mSelecter", BPs._x + 187, BPs._y + 194 + 160 * btlLabo選択ヤリモンNo);
                gi.SetSprite(PN_ELSelectR, EndLabo_PicPath + "PN_ELSelectR", BPs._x + 27, BPs._y + 122 + 160 * btlLabo選択ヤリモンNo);
                if (Input.isTriggered('up')) {
                    if (btlLabo選択ヤリモンNo > 0) {
                        btlLabo選択ヤリモンNo--;
                        gi.Menu_YarimonDetailDraw(selectYarimonDatas[btlLabo選択ヤリモンNo] , true);
                        SoundManager.playCursor();
                    }
                }
                if (Input.isTriggered('down')) {
                    if (btlLabo選択ヤリモンNo < 2) {
                        btlLabo選択ヤリモンNo++;
                        gi.Menu_YarimonDetailDraw(selectYarimonDatas[btlLabo選択ヤリモンNo] , true);
                        SoundManager.playCursor();
                    }
                }
                if (Input.isTriggered('ok') || (_cbmNo != -1 && TouchInput.isTriggered())) {
                    SoundManager.playCursor();
                    gi.SetSprite(PN_ELMonSelect , EndLabo_PicPath + "PN_ELMonSelect" + btlLabo選択ヤリモンNo, BPs._x, BPs._y);
                    this.detailSelectNo = 0;
                    this.mode = EndLabo_Iヤリモン選択PhaseMode.IDetailMode;
                }
                if (Input.isTriggered('menu') || TouchInput.isCancelled()) { 
                    this.exitSelectNo = 0;
                    this.mode = EndLabo_Iヤリモン選択PhaseMode.IExitMode;
                }
                break;
            case EndLabo_Iヤリモン選択PhaseMode.IDetailMode: 
                gi.SetSpriteC(PN_mL2Selecter, MenuPicPath + "PN_mSelecter",
                    BPs._x + 195 + 205, BPs._y + 194 + 160 * btlLabo選択ヤリモンNo - 32 + this.detailSelectNo * 48);
                let baseYPos = 140 + 160 * btlLabo選択ヤリモンNo;
                var offOpi = 180;
                let setOpi = offOpi;
                if (this.detailSelectNo == 0) setOpi = 255;
                gi.SetSprite(PN_ELMonDtl + 0 + (0 * 2), mYarimon_PPath + "PN_ymCkSelect", BPs._x + 200, BPs._y + baseYPos , setOpi);
                gi.SpriteStr(PN_ELMonDtl + 1 + (0 * 2), SCol.Blk0 + NLngStrGet("手持ちに加える"), 20, BPs._x + 200 + 19, BPs._y + baseYPos + 8 , setOpi);
                baseYPos += 48; setOpi = offOpi;
                if (this.detailSelectNo == 1) setOpi = 255;
                gi.SetSprite(PN_ELMonDtl + 0 + (1 * 2), mYarimon_PPath + "PN_ymCkSelect", BPs._x + 200, BPs._y + baseYPos , setOpi);
                gi.SpriteStr(PN_ELMonDtl + 1 + (1 * 2), SCol.Blk0 + NLngStrGet("技の確認"), 20, BPs._x + 200 + 19, BPs._y + baseYPos + 8 , setOpi);
                if (Input.isTriggered('up')) {
                    SoundManager.playCursor();
                    if (this.detailSelectNo > 0) this.detailSelectNo--;
                }
                if (Input.isTriggered('down')) {
                    SoundManager.playCursor();
                    if (this.detailSelectNo < 1) this.detailSelectNo++;
                }
                let touchNo = overPointerSpCkArr([PN_ELMonDtl + 0 + (0 * 2) , PN_ELMonDtl + 0 + (1 * 2)]);
                if (touchNo != -1 && this.detailSelectNo != (touchNo - PN_ELMonDtl) / 2) {
                    SoundManager.playCursor();
                    this.detailSelectNo = (touchNo - PN_ELMonDtl) / 2;
                }
                if (Input.isTriggered('ok') || (touchNo != -1) && TouchInput.isTriggered()) {
                    if (this.detailSelectNo == 0) {
                        if ($gameSystem.Player.syojiTikemon.length < 3) { 
                            $gameSystem.Player.syojiTikemon.push(selectYarimonDatas[btlLabo選択ヤリモンNo]);
                            this.fstAddAction(gi);
                        } else {
                            this.submmitAction();
                        }
                    }
                    if (this.detailSelectNo == 1) { 
                        this.selectX = 0; this.selectY = 0;
                        gi.DelSpriteSpan(PN_ELMonDtl , PN_ELSelectBack);
                        this.mode = EndLabo_Iヤリモン選択PhaseMode.IWazaMode;
                        var monData = selectYarimonDatas[btlLabo選択ヤリモンNo];
                        elWazaCheckManager = new EL_WazaCheckManager(gi , monData , PN_ELMonSelect);
                        let ckthis = this;
                        elWazaCheckManager.endAction = function (gi) {
                            gi.DelSpriteSpan(PN_ELMonSelect , PN_mL2Selecter);
                            gi.DelSprite(PN_ymBtlTtkSel);
                            ckthis.mode = EndLabo_Iヤリモン選択PhaseMode.ISelectMode;
                        }
                    }
                }
                if (Input.isTriggered('menu') || TouchInput.isCancelled()) { 
                    SoundManager.playCancel();
                    gi.DelSpriteSpan(PN_ELMonSelect , PN_mL2Selecter);
                    this.mode = EndLabo_Iヤリモン選択PhaseMode.ISelectMode;
                }
                break;
            case EndLabo_Iヤリモン選択PhaseMode.IWazaMode: 
                elWazaCheckManager.Update(gi);
                break;
            case EndLabo_Iヤリモン選択PhaseMode.IExitMode:
                gi.SetSprite(PN_ELCngSelect, EndLabo_PicPath + "PN_ELExitCheck", BPs._x, BPs._y);
                gi.SetSpriteC(PN_mL2Selecter, MenuPicPath + "PN_mSelecter",  BPs._x + 367 + 170 * this.exitSelectNo, BPs._y + 348);
                EndLabo_CbmArr = [];
                for (let i = 0; i < 2; i++) EndLabo_CbmArr.push([274 + 154 * i  , 333, 91 , 29]);
                let _cbmNo2 = overSpriteClickable( PN_ELCngSelect , EndLabo_CbmArr);
                if (_cbmNo2 != -1 && this.exitSelectNo != _cbmNo2) {
                    SoundManager.playCursor();
                    this.exitSelectNo = _cbmNo2;
                }
                if (Input.isTriggered('left')) {
                    if (this.exitSelectNo > 0) {
                        SoundManager.playCursor();
                        this.exitSelectNo--;
                    }
                }
                if (Input.isTriggered('right')) {
                    if (this.exitSelectNo < 1) {
                        SoundManager.playCursor();
                        this.exitSelectNo++;
                    }
                }
                let endFlg = false;
                if (Input.isTriggered('ok') || (_cbmNo2 != -1 && TouchInput.isTriggered())) {
                    if (this.exitSelectNo == 0) this.exitAction();
                    if (this.exitSelectNo == 1) endFlg = true;
                }
                if (Input.isTriggered('menu') || TouchInput.isCancelled() || endFlg) { 
                    SoundManager.playCancel();
                    gi.DelSpriteSpan(PN_ELCngSelect , PN_mL2Selecter);
                    this.mode = EndLabo_Iヤリモン選択PhaseMode.ISelectMode;
                }
                break;
        }
    }
    Exit(gi) { }
}
const EndLabo_I変更選択Mode = {
    MonSelect : 0 ,
    DtlSelect : 1 ,
    MonHikaku : 2 ,
    MonHikakuDtl : 3 ,
    IWazaMode : 4 ,
}
class EndLabo_I変更選択Phase extends PhaseBase {
    constructor() {
        super();
        this.submmitAction;
        this.cancelAction;
        this.selectMode = EndLabo_I変更選択Mode.MonSelect;
        this.selectNo = 0;
        this.dtlSelectNo = 0;
        this.drawMons = [];
        this.hikakuSelectNo = 0;
    }
    Enter(gi) { 
        this.selectNo = 0;
        this.SetMonSelect(gi);
    }
    SetMonSelect(gi) {
        gi.SetSprite(PN_ELCng, EndLabo_PicPath + "PN_ELCng", BPs._x, BPs._y);
        gi.SetSprite(PN_ELBallNoYoko, EndLabo_PicPath + "PN_ELBallNoYoko", BPs._x, BPs._y);
        for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
            var picPath = $gameSystem.Player.syojiTikemon[i].YarimonData.picPath;
            gi.SetSprite(PN_ELCngYarimon + i, Btl_Yarimon + picPath, BPs._x + 152 + 200 * i, BPs._y + 268 , 255 , 45 , 45);
        }
        this.selectMode = EndLabo_I変更選択Mode.MonSelect;
    }
    Update(gi) {
        switch (this.selectMode) {
            case EndLabo_I変更選択Mode.MonSelect: 
                gi.SetSprite(PN_ELCngSelectR, EndLabo_PicPath + "PN_ELSelectR", BPs._x + 134 + 200 * this.selectNo, BPs._y + 260);
                gi.SetSpriteC(PN_mL2Selecter, MenuPicPath + "PN_mSelecter_t", BPs._x + 215 + 200 * this.selectNo, BPs._y + 420);
                EndLabo_CbmArr = [];
                for (let i = 0; i < 3; i++) EndLabo_CbmArr.push([142 + 200 * i , 268 , 149 , 129]);
                let _cbmNo1 = overSpriteClickable( PN_ELBack , EndLabo_CbmArr);
                if (_cbmNo1 != -1 && this.selectNo != _cbmNo1) {
                    SoundManager.playCursor();
                    this.selectNo = _cbmNo1;
                }
                if (Input.isTriggered('left')) {
                    if (this.selectNo > 0) {
                        SoundManager.playCursor();
                        this.selectNo--;
                    }
                }
                if (Input.isTriggered('right')) {
                    if (this.selectNo < 2) {
                        SoundManager.playCursor();
                        this.selectNo++;
                    }
                }
                if (Input.isTriggered('ok') || (_cbmNo1 != -1 && TouchInput.isTriggered())) {
                    SoundManager.playCursor();
                    EndLabo_I変更キャラNo = this.selectNo; 
                    this.dtlSelectNo = 0;
                    this.selectMode = EndLabo_I変更選択Mode.DtlSelect;
                }
                if (Input.isTriggered('menu') || TouchInput.isCancelled()) { 
                    this.cancelAction();
                }
                break;
            case EndLabo_I変更選択Mode.DtlSelect: 
                gi.SetSprite(PN_ELCngSelect, EndLabo_PicPath + "PN_ELCngSelect" + this.selectNo , BPs._x, BPs._y);
                var basePosX = BPs._x + 296 + 200 * this.selectNo;
                if (this.selectNo == 2) basePosX -= 100;
                var offOpi = 180;
                let setOpi = offOpi;
                if (this.dtlSelectNo == 0) setOpi = 255;
                gi.SetSprite(PN_ELCngDtl + 0 + (0 * 2), mYarimon_PPath + "PN_ymCkSelect", basePosX, BPs._y + 276 , setOpi);
                gi.SpriteStr(PN_ELCngDtl + 1 + (0 * 2), SCol.Blk0 + NLngStrGet("手持ちに加える"), 20, basePosX + 19, BPs._y + 276 + 8 , setOpi);
                setOpi = offOpi;
                if (this.dtlSelectNo == 1) setOpi = 255;
                gi.SetSprite(PN_ELCngDtl + 0 + (1 * 2), mYarimon_PPath + "PN_ymCkSelect", basePosX, BPs._y + 276 + 50 , setOpi);
                gi.SpriteStr(PN_ELCngDtl + 1 + (1 * 2), SCol.Blk0 + NLngStrGet("強さの比較"), 20, basePosX + 19, BPs._y + 276 + 50 + 8 , setOpi);
                if (Input.isTriggered('up')) {
                    SoundManager.playCursor();
                    if (this.dtlSelectNo > 0) this.dtlSelectNo--;
                }
                if (Input.isTriggered('down')) {
                    SoundManager.playCursor();
                    if (this.dtlSelectNo < 1) this.dtlSelectNo++;
                }
                let touchNo = overPointerSpCkArr([PN_ELCngDtl + 0 + (0 * 2) , PN_ELCngDtl + 0 + (1 * 2)]);
                if (touchNo != -1 && this.dtlSelectNo != (touchNo - PN_ELCngDtl) / 2) {
                    SoundManager.playCursor();
                    this.dtlSelectNo = (touchNo - PN_ELCngDtl) / 2;
                }
                if (Input.isTriggered('ok') || (touchNo != -1 && TouchInput.isTriggered())) {
                    if (this.dtlSelectNo == 0) this.submmitAction();
                    if (this.dtlSelectNo == 1) { 
                        gi.DelSpriteSpan(PN_ELMonSelect , PN_mL2Selecter);
                        gi.SetSprite(PN_ELBack, EndLabo_PicPath + "PN_ELBack2", BPs._x, BPs._y);
                        this.drawMons = [];
                        this.hikakuSelectNo = 0;
                        gi.Menu_YarimonDetailDraw($gameSystem.Player.syojiTikemon[this.selectNo] , true);
                        gi.SetSpriteC(PN_ELCngMon + 0, Btl_Yarimon + $gameSystem.Player.syojiTikemon[this.selectNo].YarimonData.picPath,
                            BPs._x + 108, BPs._y + 190 + 160 * 0 , 255 , 50 , 50);
                        gi.SetSpriteC(PN_ELCngMon + 1, Btl_Yarimon + selectYarimonDatas[btlLabo選択ヤリモンNo].YarimonData.picPath,
                            BPs._x + 108, BPs._y + 190 + 160 * 1 , 255 , 50 , 50);
                        gi.SetSprite(PN_ELCngBall , EndLabo_PicPath + "PN_ELCngBall" , BPs._x , BPs._y);
                        this.selectMode = EndLabo_I変更選択Mode.MonHikaku;
                    }
                }
                gi.SetSpriteC(PN_mL2Selecter, MenuPicPath + "PN_mSelecter", basePosX + 205, BPs._y + 297 + this.dtlSelectNo * 50);
                if (Input.isTriggered('menu') || TouchInput.isCancelled()) { 
                    gi.DelSpriteSpan(PN_ELMonSelect , PN_mL2Selecter);
                    this.selectMode = EndLabo_I変更選択Mode.MonSelect;
                    this.SetMonSelect(gi);
                }
                break;
            case EndLabo_I変更選択Mode.MonHikaku:
                gi.SetSprite(PN_ELMonSelect , EndLabo_PicPath + "PN_ELWazaSelect2", BPs._x, BPs._y);
                gi.SetSprite(PN_ELCngMonSelect, EndLabo_PicPath + "PN_ELSelectR", BPs._x + 27, BPs._y + 122 + 160 * this.hikakuSelectNo);
                gi.DelSprite(PN_mL2Selecter);
                EndLabo_CbmArr = [];
                for (let i = 0; i < 2; i++) EndLabo_CbmArr.push([36 , 131 + 160 * i , 149 , 129]);
                let _cbmNo3 = overSpriteClickable( PN_ELBack , EndLabo_CbmArr);
                if (_cbmNo3 != -1 && this.hikakuSelectNo != _cbmNo3) {
                    SoundManager.playCursor();
                    this.hikakuSelectNo = _cbmNo3;
                    if (this.hikakuSelectNo == 0) gi.Menu_YarimonDetailDraw($gameSystem.Player.syojiTikemon[this.selectNo] , true);
                    if (this.hikakuSelectNo == 1) gi.Menu_YarimonDetailDraw(selectYarimonDatas[btlLabo選択ヤリモンNo] , true);
                }
                if (Input.isTriggered('up')) {
                    if (this.hikakuSelectNo > 0) {
                        SoundManager.playCursor();
                        gi.Menu_YarimonDetailDraw($gameSystem.Player.syojiTikemon[this.selectNo] , true);
                        this.hikakuSelectNo--;
                    }
                }
                if (Input.isTriggered('down')) {
                    if (this.hikakuSelectNo < 1) {
                        SoundManager.playCursor();
                        gi.Menu_YarimonDetailDraw(selectYarimonDatas[btlLabo選択ヤリモンNo] , true);
                        this.hikakuSelectNo++;
                    }
                }
                if (Input.isTriggered('ok') || (_cbmNo3 != -1) && TouchInput.isTriggered()) {
                    this.selectMode = EndLabo_I変更選択Mode.MonHikakuDtl;
                }
                if (Input.isTriggered('menu') || TouchInput.isCancelled()) { 
                    SoundManager.playCancel();
                    gi.DelSpriteSpan(PN_ELMonSelect , PN_mL2Selecter);
                    gi.DelSprite(PN_ymBtlTtkSel);
                    this.selectMode = EndLabo_I変更選択Mode.DtlSelect;
                    gi.Menu_YarimonDetailDraw(selectYarimonDatas[btlLabo選択ヤリモンNo] , true);
                    this.SetMonSelect(gi);
                }
                break;
            case EndLabo_I変更選択Mode.MonHikakuDtl:
                gi.SetSprite(PN_ELCngCkBack, EndLabo_PicPath + "PN_ELMonSelect" + this.hikakuSelectNo , BPs._x, BPs._y);
                let baseYPos = 140 + 160 * this.hikakuSelectNo;
                gi.SetSprite(PN_ELCngCkDtl + 0, mYarimon_PPath + "PN_ymCkSelect", BPs._x + 200, BPs._y + baseYPos);
                gi.SpriteStr(PN_ELCngCkDtl + 1, SCol.Blk0 + NLngStrGet("技の確認"), 20, BPs._x + 200 + 19, BPs._y + baseYPos + 8);
                gi.SetSpriteC(PN_mL2Selecter, MenuPicPath + "PN_mSelecter", BPs._x + 195 + 205, BPs._y + 194 + 160 * this.hikakuSelectNo - 32);
                if (Input.isTriggered('ok') || (overPointerSpCk(PN_ELCngCkDtl + 0)) && TouchInput.isTriggered()) {
                    this.selectMode = EndLabo_I変更選択Mode.IWazaMode;
                    var monData = $gameSystem.Player.syojiTikemon[this.selectNo];
                    if (this.hikakuSelectNo == 1) monData = selectYarimonDatas[btlLabo選択ヤリモンNo];
                    elWazaCheckManager = new EL_WazaCheckManager(gi , monData , PN_ELCngCkBack);
                    let ckthis = this;
                    elWazaCheckManager.endAction = function (gi) {
                        gi.DelSpriteSpan(PN_ELCngCkBack , PN_mL2Selecter);
                        gi.DelSprite(PN_ymBtlTtkSel);
                        ckthis.selectMode = EndLabo_I変更選択Mode.MonHikaku;
                    }
                }
                if (Input.isTriggered('menu') || TouchInput.isCancelled()) { 
                    gi.DelSpriteSpan(PN_ELCngCkBack , PN_mL2Selecter + 1);
                    this.selectMode = EndLabo_I変更選択Mode.MonHikaku;
                }
                break;
            case EndLabo_I変更選択Mode.IWazaMode:
                elWazaCheckManager.Update(gi);
                break;
        }
    }
    Exit(gi) { }
}
var EndLabo_I変更キャラNo = -1;
class EndLabo_Iパーティー確認Phase extends PhaseBase {
    constructor(fstFlg) {
        super();
        this.submmitAction;
        this.cancelAction;
        this.fstFlg = fstFlg; 
        this.selectNo = 0; 
    }
    Enter(gi) { 
        gi.DelSpriteSpan(PN_ELCngSelect , PN_mL2Selecter);
        if (this.fstFlg) {
            gi.SetSprite(PN_ELPartySub, EndLabo_PicPath + "PN_ELPartySub2", BPs._x, BPs._y);
        }
        else {
            gi.SetSprite(PN_ELPartySub, EndLabo_PicPath + "PN_ELPartySub", BPs._x, BPs._y);
        }
        for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
            var picPath = $gameSystem.Player.syojiTikemon[i].YarimonData.picPath;
            if (!this.fstFlg && i == EndLabo_I変更キャラNo) {
                picPath = picPath = selectYarimonDatas[btlLabo選択ヤリモンNo].YarimonData.picPath;
                gi.SetSprite(PN_ELNewMark, EndLabo_PicPath + "PN_ELNewMark", BPs._x + 190 + 200 * i, BPs._y + 258);
            }
            gi.SetSprite(PN_ELSubYarimon + i, Btl_Yarimon + picPath, BPs._x + 152 + 200 * i, BPs._y + 268 , 255 , 45 , 45);
        }
        gi.SetSprite(PN_ELBallNoYoko, EndLabo_PicPath + "PN_ELBallNoYoko", BPs._x, BPs._y);
    }
    Update(gi) {
        gi.SetSpriteC(PN_mL2Selecter, MenuPicPath + "PN_mSelecter", BPs._x + 359, BPs._y + 453);
        EndLabo_CbmArr = [];
        for (let i = 0; i < 2; i++) EndLabo_CbmArr.push([253 + 210 * i , 420 , 113 , 64]);
        let _cbmNo1 = overSpriteClickable( PN_ELBack , EndLabo_CbmArr);
        if (_cbmNo1 != -1  && this.selectNo != _cbmNo1) {
            SoundManager.playCursor();
            this.selectNo = _cbmNo1;
        }
        if (this.selectNo == 1) {
            if (this.fstFlg)
                gi.SetSpriteC(PN_mL2Selecter, MenuPicPath + "PN_mSelecter", BPs._x + 589, BPs._y + 453);
            else
                gi.SetSpriteC(PN_mL2Selecter, MenuPicPath + "PN_mSelecter", BPs._x + 589, BPs._y + 453);
        }
        if (Input.isTriggered('left')) {
            if (this.selectNo > 0) {
                SoundManager.playCursor();
                this.selectNo--;
            }
        }
        if (Input.isTriggered('right')) {
            if (this.selectNo < 2) {
                SoundManager.playCursor();
                this.selectNo++;
            }
        }
        if (Input.isTriggered('ok') || (_cbmNo1 != -1 && TouchInput.isTriggered())) {
            if (this.selectNo == 0) {
                $gameSystem.Player.syojiTikemon[EndLabo_I変更キャラNo] = selectYarimonDatas[btlLabo選択ヤリモンNo]
                this.submmitAction(); 
            }
            if (this.selectNo == 1) {
                this.cancelAction();
            }
        }
        if (Input.isTriggered('menu') || TouchInput.isCancelled()) { 
            this.cancelAction();
        }
    }
    Exit(gi) {
    }
}
let elWazaCheckManager = null;
class EL_WazaCheckManager {
    constructor(gi , monData , basePicNo) {
        this.gi = gi;
        this.basePicNo = basePicNo;
        this.endAction = null; 
        this.selectX = 0;
        this.selectY = 0;
        this.selectArr = [[] , []];
        for (let i = 0; i < monData.btlWazas.length; i++) {
            var setI = Math.floor(i / 2);
            this.selectArr[setI].push(monData.btlWazas[i]);
        }
        var wazaData = this.selectArr[this.selectY][this.selectX];
        gi.DelSpriteSpan(this.basePicNo , PN_mL2Selecter);
        gi.WazaSetuWinDraw(PN_ELCng, wazaData, BPs._x + 487, BPs._y + 475)
    }
    Enter (gi) {
    }
    Update (gi) {
        gi.SetSprite(this.basePicNo, EndLabo_PicPath + "PN_ELWazaSelect" , BPs._x, BPs._y);
        gi.SetSprite(PN_ymBtlTtkSel , EndLabo_PicPath + "PN_ELWaza",
            BPs._x + 248 + 97 * this.selectX, BPs._y + 411 + 102 * this.selectY);
        let cngFlg = false;
        if (overPointerSpCk(PN_ymBtlTtkBtn + (0 * BtlBtnPicCnt)) && (this.selectX != 0 || this.selectY != 0)){
            this.selectX = 0; this.selectY = 0; cngFlg = true;
        }
        if (overPointerSpCk(PN_ymBtlTtkBtn + (1 * BtlBtnPicCnt)) && (this.selectX != 1 || this.selectY != 0)){
            this.selectX = 1; this.selectY = 0; cngFlg = true;
        }
        if (overPointerSpCk(PN_ymBtlTtkBtn + (2 * BtlBtnPicCnt)) && (this.selectX != 0 || this.selectY != 1)){
            this.selectX = 0; this.selectY = 1; cngFlg = true;
        }
        if (overPointerSpCk(PN_ymBtlTtkBtn + (3 * BtlBtnPicCnt)) && (this.selectX != 1 || this.selectY != 1)){
            this.selectX = 1; this.selectY = 1; cngFlg = true;
        }
        if (Input.isTriggered('up')) {
            cngFlg = true; this.selectY--;
        }
        if (Input.isTriggered('down')) {
            cngFlg = true; this.selectY++;
        }
        if (Input.isTriggered('left')) {
            cngFlg = true; this.selectX--;
        }
        if (Input.isTriggered('right')) {
            cngFlg = true; this.selectX++;
        }
        if (cngFlg) {
            if (this.selectX < 0) this.selectX = 1;
            if (this.selectX > 1) this.selectX = 0;
            if (this.selectY < 0) this.selectY = 1;
            if (this.selectY > 1) this.selectY = 0;
            SoundManager.playCursor();
            var wazaData = this.selectArr[this.selectY][this.selectX];
            gi.WazaSetuWinDraw(PN_ELCng, wazaData, BPs._x + 487, BPs._y + 475);
        }
        if (Input.isTriggered('menu') || TouchInput.isCancelled()) { 
            SoundManager.playCancel();
            this.End(gi);
        }
    }
    End (gi) {
        this.endAction(gi);
    }
}
const PN_LDBase = 530;
const PN_LDGrpBtn = PN_LDBase + 1;
const PN_LDYSelectBtn = PN_LDGrpBtn + 4 * 3 + 1;
const PN_LDSubmitBtn = PN_LDYSelectBtn + 3;
const PN_LDKaisenBtn = PN_LDSubmitBtn + 1;
const PN_LDYName = PN_LDKaisenBtn + 1;
const PN_LDYarimonTxt = PN_LDYName + 3;
let laboDbgGrpNos = [0,0,0];
let laboDbgPicArr = [];
let LaboDebugSelectYarimonArr = [-1 , -1 , -1];
Game_Interpreter.prototype.LaboDebug_Start = function () {
    LaboDebugSelectYarimonArr = [-1 , -1 , -1];
    laboDbgPicArr = [];
    this.SetSprite(PN_LDBase , EndLaboDebug_PicPath + "PN_LDBase" , 0 , 0);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            this.SetSprite(PN_LDGrpBtn + i * 4 + j , EndLaboDebug_PicPath + "PN_LDGrpBtn" + (j + 1) , 469 + 50 * j , 162 + 70 * i);
            laboDbgPicArr.push(PN_LDGrpBtn + i * 4 + j);
        }
        this.SetSprite(PN_LDYSelectBtn + i , EndLaboDebug_PicPath + "PN_LDYSelectBtn" , 679 , 162 + 70 * i);
    }
    this.SetSprite(PN_LDSubmitBtn , EndLaboDebug_PicPath + "PN_LDSubmitBtn" , 478 , 392);
    this.SetSprite(PN_LDKaisenBtn , EndLaboDebug_PicPath + "PN_LDKaisenBtn" , 679 , 392);
    this.BtlLabo_所持チケモンSave();
}
let LaboDebug回戦数SelectFlg = false;
let LaboDebugYarimonSelectFlg = false;
let LaboDebugYarimonSelectNo = 0;
Game_Interpreter.prototype.LaboDebug_Update = function () {
    if (LaboDebugYarimonSelectFlg) {
        this.LaboDebug_YarimonSelectUpdate();
        return true;
    }
    if (LaboDebug回戦数SelectFlg) {
        this.LaboDebug_回戦数SelectUpdate();
        return true;
    }
    for (let i = 0; i < 3; i++) {
        if (LaboDebugSelectYarimonArr[i] == -1) {
            this.DelSprite(i + PN_LDYName);
        }
        else {
            for (let j = 0; j < $N_LaboratoryData.laboYarimonDatas.length; j++) {
                if ($N_LaboratoryData.laboYarimonDatas[j].id == LaboDebugSelectYarimonArr[i]) {
                    let check = $N_LaboratoryData.laboYarimonDatas[j].laboGrpYarimonDatas[laboDbgGrpNos[i]].check;
                    let setOpi = 255;
                    if (!check) setOpi = 150;
                    let setYarimonData = new YarimonData(LaboDebugSelectYarimonArr[i] , 75 , 0);
                    this.SpriteStr( i + PN_LDYName , setYarimonData.YarimonData.name , 27 , 835 , 166 + 70 * i , setOpi);
                }
            }
        }
    }
    this.SpriteCngColorArr(laboDbgPicArr);
    for (let i = 0; i < 3; i++) {
        this.SpriteCngColor( PN_LDGrpBtn + i * 4 + laboDbgGrpNos[i] , [150,150,0,0]);
    }
    let ckNo = overPointerSpCkArr(laboDbgPicArr);
    if (ckNo != -1) {
        if (TouchInput.isTriggered()) {
            let tcNo = (ckNo - PN_LDGrpBtn);
            laboDbgGrpNos[Math.floor(tcNo / 4)] = tcNo % 4;
        }
    }
    let ckArr = [PN_LDYSelectBtn + 0 , PN_LDYSelectBtn + 1 , PN_LDYSelectBtn + 2];
    this.SpriteCngColorArr(ckArr);
    ckNo = overPointerSpCkArr(ckArr);
    if (ckNo != -1) {
        this.SpriteCngColor( ckNo , [150,150,0,0]);
        if (TouchInput.isTriggered()) {
            LaboDebugYarimonSelectFlg = true;
            LaboDebugYarimonSelectNo = ckNo - PN_LDYSelectBtn;
        }
    }
    this.SpriteCngColor(PN_LDKaisenBtn);
    if (overPointerSpCk(PN_LDKaisenBtn)) {
        this.SpriteCngColor( PN_LDKaisenBtn , [150,150,0,0]);
        if (TouchInput.isTriggered()) {
            LaboDebugWheelCount = 0;
            LaboDebug回戦数SelectFlg = true;
            return true;
        }
    }
    this.SpriteCngColor(PN_LDSubmitBtn);
    if (overPointerSpCk(PN_LDSubmitBtn)) {
        this.SpriteCngColor( PN_LDSubmitBtn , [150,150,0,0]);
        if (TouchInput.isTriggered()) {
            this.DelSpriteSpan(PN_LDBase , PN_LDYarimonTxt + 20);
            return false;
        }
    }
    return true; 
}
class LaboDebugYarimonData {
    constructor(No , Name){
        this.No = No;
        this.Name = Name;
    }
}
let GetLaboYarimonData = function (id) {
    for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
        if ($N_LaboratoryData.laboYarimonDatas[i].id == id) {
            return $N_LaboratoryData.laboYarimonDatas[i];
        }
    }
}
let BtlLaboDebug選択回戦No = 1;
Game_Interpreter.prototype.LaboDebug_回戦数SelectUpdate = function () {
    let ckArr = [];
    for (let i = 0; i < 20; i++) {
        if (i + LaboDebugWheelCount * 20 + 1 < 51) {
            this.SpriteStr( PN_LDYarimonTxt + i , (i + LaboDebugWheelCount * 20 + 1) + "回戦から"
                , 20 , 1050 + 250 * Math.floor(i / 20) , 134 + 30 * i);
            ckArr.push(PN_LDYarimonTxt + i);
        } else {
            this.DelSprite(PN_LDYarimonTxt + i);
        }
    }
    this.SpriteCngColorArr(ckArr);
    ckNo = overPointerSpCkArr(ckArr);
    if (ckNo != -1) {
        this.SpriteCngColor( ckNo , [150,150,0,0]);
        if (TouchInput.isTriggered()) {
            BtlLaboDebug選択回戦No = ckNo - PN_LDYarimonTxt + 1 + LaboDebugWheelCount * 20;
            this.DelSpriteSpan(PN_LDYarimonTxt , PN_LDYarimonTxt + 19);
            LaboDebug回戦数SelectFlg = false;
            return;
        }
    }
    if (TouchInput.isCancelled()) {
        LaboDebug回戦数SelectFlg = false;
        this.DelSpriteSpan(PN_LDYarimonTxt , PN_LDYarimonTxt + 19);
        return;
    }
    if (TouchInput.wheelY < 0) LaboDebugWheelCount--;
    if (TouchInput.wheelY > 0) LaboDebugWheelCount++;
    if (LaboDebugWheelCount < 0) LaboDebugWheelCount = 0;
}
let LaboDebugYarimonArr = [];
let LaboDebugWheelCount = 0;
Game_Interpreter.prototype.LaboDebug_YarimonSelectUpdate = function () {
    LaboDebugYarimonArr = [];
    for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
        var enemyCheck = $N_LaboratoryData.laboYarimonDatas[i].laboGrpYarimonDatas[laboDbgGrpNos[LaboDebugYarimonSelectNo]].check;
        if (enemyCheck) {
            var setYarimonData = new YarimonData($N_LaboratoryData.laboYarimonDatas[i].id , 75 , 0);
            LaboDebugYarimonArr.push(new LaboDebugYarimonData(i , setYarimonData.YarimonData.name));
        }
    }
    this.DelSpriteSpan(PN_LDYarimonTxt , PN_LDYarimonTxt + 19);
    let ckArr = [];
    for (let i = 0; i < 20; i++) {
        if (LaboDebugYarimonArr.length > i + LaboDebugWheelCount * 20) {
            this.SpriteStr( PN_LDYarimonTxt + i , LaboDebugYarimonArr[i + LaboDebugWheelCount * 20].Name
                , 20 , 1050 + 250 * Math.floor(i / 20) , 134 + 30 * i);
            ckArr.push(PN_LDYarimonTxt + i);
        }
    }
    this.SpriteCngColorArr(ckArr);
    ckNo = overPointerSpCkArr(ckArr);
    if (ckNo != -1) {
        this.SpriteCngColor( ckNo , [150,150,0,0]);
        if (TouchInput.isTriggered()) {
            var selectNo = LaboDebugYarimonArr[ckNo - PN_LDYarimonTxt + LaboDebugWheelCount * 20].No;
            LaboDebugSelectYarimonArr[LaboDebugYarimonSelectNo] = $N_LaboratoryData.laboYarimonDatas[selectNo].id;
            LaboDebugYarimonSelectFlg = false;
            this.DelSpriteSpan(PN_LDYarimonTxt , PN_LDYarimonTxt + 19);
            return;
        }
    }
    if (TouchInput.isCancelled()) {
        LaboDebugYarimonSelectFlg = false;
        this.DelSpriteSpan(PN_LDYarimonTxt , PN_LDYarimonTxt + 19);
        return;
    }
    if (TouchInput.wheelY < 0) LaboDebugWheelCount--;
    if (TouchInput.wheelY > 0) LaboDebugWheelCount++;
    if (LaboDebugWheelCount < 0) LaboDebugWheelCount = 0;
}
class LaboDebugMonSelectData {
    constructor(Id , GrpData){
        this.Id = Id;
        this.GrpData = GrpData;
    }
}
Game_Interpreter.prototype.LaboDebug_End = function () {
    let GetGrpYarimonRnd = function (grpNo) {
        let selectMonsArr = [];
        for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
            if ($N_LaboratoryData.laboYarimonDatas[i].laboGrpYarimonDatas[grpNo].check) {
                selectMonsArr.push(
                    new LaboDebugMonSelectData(
                        $N_LaboratoryData.laboYarimonDatas[i].id ,
                        $N_LaboratoryData.laboYarimonDatas[i].laboGrpYarimonDatas[grpNo]));
            }
        }
        var settingData = ArrGetRandData(selectMonsArr);
        let setYarimonData = GetGrpYarimonData(settingData);
        return setYarimonData;
    }
    let GetGrpYarimonData = function (settingData) {
        var setYarimonData = new YarimonData(settingData.Id , 75 , 0);
        setYarimonData.btlCount = 5 * StarRankBtlValue; 
        setYarimonData.btlWazas = [];
        for (let j = 0; j < settingData.GrpData.btlWazas.length; j++) {
            $N_Yarimon_DB.wazaDatas.forEach( _wazaData => {
                if (_wazaData.id == settingData.GrpData.btlWazas[j].id) {
                    setYarimonData.btlWazas.push(new WazaData(_wazaData.id , _wazaData.kaisu));
                }
            });
        }
        setYarimonData.ExPowerFlg = settingData.GrpData.soulBoost;
        return setYarimonData;
    }
    $gameSystem.Player.syojiTikemon = [null , null , null];
    for (let i = 0; i < 3; i++) {
        if (LaboDebugSelectYarimonArr[i] != -1) {
            var laboYarimonData = GetLaboYarimonData(LaboDebugSelectYarimonArr[i]);
            var laboData = laboYarimonData.laboGrpYarimonDatas[laboDbgGrpNos[i]];
            if (laboData.check) {
                var monData = new LaboDebugMonSelectData(laboYarimonData.id , laboData);
                $gameSystem.Player.syojiTikemon[i] = GetGrpYarimonData(monData);
                //if (laboDbgGrpNos[i] == 3) $gameSystem.Player.syojiTikemon[i].ExPowerFlg = true;
            } else {
                $gameSystem.Player.syojiTikemon[i] = GetGrpYarimonRnd(laboDbgGrpNos[i]);
                $gameSystem.Player.syojiTikemon[i].GrpNo = laboDbgGrpNos[i];
            }
        } else {
            $gameSystem.Player.syojiTikemon[i] = GetGrpYarimonRnd(laboDbgGrpNos[i]);
            $gameSystem.Player.syojiTikemon[i].GrpNo = laboDbgGrpNos[i];
        }
    }
}
