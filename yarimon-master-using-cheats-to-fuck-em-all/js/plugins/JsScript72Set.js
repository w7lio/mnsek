const VN_SaveTitle = 19;
let mSave_PPath = MenuPicPath + "Save/";
let msScBar = new N_Scroll(mSave_PPath + "PN_smBar", 467, PN_smBar, BPs._x + 751, BPs._y + 99);
msScBar.ItemCount = mSave_CntMax; 
msScBar.ViewCount = 4;  
msScBar.ZureNo = 0;     
let AutoModeSelectFlg = false;
let AutoSaveTxt_Arr = [];
const AutoSaveNo = 30;
Game_Interpreter.prototype.Menu_SaveUpdate = function (ckMode , loadFlg) {
    loadFlg = typeof loadFlg !== 'undefined' ? loadFlg : false;
    if (ckMode.flame == 1) { 
        saveExitFlg = false;
        AutoModeSelectFlg = false;
        ckMode.n_Scroll = msScBar;
        ckMode.loadFlg = loadFlg;
        ckMode.DataGet();
        if (ckMode.loadFlg) {
            this.SetSprite(PN_smBase , mSave_PPath + "PN_smBase_Load" , BPs._x , BPs._y);
            this.SetSprite(PN_smAutoSave , mSave_PPath + "PN_smAutoSave" , BPs._x , BPs._y);
            var autoSaveStr = $gameVariables.value(VN_AutoSave);
            if (autoSaveStr == 0) {
                this.SpriteStrC(PN_smAutoSave + 1 , SCol.Blk0 + NLngStrGet("-- データ無し --") , 18 , BPs._x + 634, BPs._y + 46 , 190);
            } else {
                AutoSaveTxt_Arr = autoSaveStr.split(',');
                DText_NRZureY = -7; 
                this.SpriteStr(PN_smAutoSave + 1 , SCol.Blk0 + AutoSaveTxt_Arr[0] , 14 , BPs._x + 517, BPs._y + 29);
                DText_NRZureY = -7; 
                this.SpriteStr(PN_smAutoSave + 2 , SCol.Blk0 + AutoSaveTxt_Arr[1] , 14 , BPs._x + 507 + 95, BPs._y + 29);
            }
        } else {
            this.SetSprite(PN_smBase , mSave_PPath + "PN_smBase_Save" , BPs._x , BPs._y);
        }
        this.Menu_SaveDraw(ckMode);
    }
    if( ckMode.flame >= 1) {
        this.Menu_Save_BaseUpdate(ckMode);
    }
};
Game_Interpreter.prototype.Menu_SaveDraw = function (ckMode) {
    this.ScrollSpView(ckMode.n_Scroll , 255);
    for (let i = 0; i <= 4 - 1; i++) {
        let saveNo = ckMode.n_Scroll.ZureNo + i + 1;
        if (SaveTxt1_Arr[ckMode.n_Scroll.ZureNo + i] != "") {
            let saveName = "No." + saveNo + " " + SaveTxt1_Arr[ckMode.n_Scroll.ZureNo + i];
            let _TktStr = SaveTxt2_Arr[ckMode.n_Scroll.ZureNo + i];
            let _ZukanStr = SaveTxt3_Arr[ckMode.n_Scroll.ZureNo + i];
            this.SpriteStr(PN_smTxt + i , SCol.Blk0 + saveName , 22 , BPs._x + 89, BPs._y + 115 + 123 * i);
            let setTxtSize = 22;
            let zureY = 0;
            if (LngMode == "en") {
                setTxtSize = 18; zureY = 2;
            }
            this.SpriteStr(PN_smTkmnTxt + i , SCol.Blk0 + _TktStr , setTxtSize , BPs._x + 89 + 120, BPs._y + 115 + zureY + 123 * i);
            this.SpriteStr(PN_smChrTxt + i , SCol.Blk0 + _ZukanStr , 22 , BPs._x + 89 + 120, BPs._y + 150 + 123 * i);
        } else {
            let drawStr = "No." + saveNo + " --------";
            this.SpriteStr(PN_smTxt + i , SCol.Blk0 + drawStr , 22 , BPs._x + 89, BPs._y + 115 + 123 * i);
            this.SpriteStrC(PN_smTkmnTxt + i , SCol.Blk0 + NLngStrGet("-- データ無し --") , 22 , BPs._x + 393, BPs._y + 160 + 123 * i , 190);
            this.DelSprite(PN_smChrTxt + i);
        }
    }
    D_Text_Cng_font = "";
};
let SaveDownFlame = 0;
const ConstSaveFlame = 15;
Game_Interpreter.prototype.Menu_Save_BaseUpdate = function (ckMode) {
    let mSave_SelNo = ckMode.selecterNo - ckMode.n_Scroll.ZureNo; 
    if (AutoModeSelectFlg) {
        this.SetSpriteC(PN_mL2Selecter, MenuPicPath + "PN_mSelecter", BPs._x + 467, BPs._y + 42 , 255 , -100);
        this.DelSprite(PN_smSelWin);
    } else {
        this.SetSprite(PN_mL2Selecter, MenuPicPath + "PN_mSelecter", BPs._x + 60, BPs._y + 134 + 123 * mSave_SelNo , 255 , -100);
        this.SetSprite(PN_smSelWin, mSave_PPath + "PN_smSelWin", BPs._x + 75, BPs._y + 90 + 123 * mSave_SelNo);
    }
    let _okFlg = false;
    let _ckCblMap = [
        [75 , 90 + (0 * 123) , 657 , 114] , [75 , 90 + (1 * 123) , 657 , 114] ,
        [75 , 90 + (2 * 123) , 657 , 114] , [75 , 90 + (3 * 123) , 657 , 114]
    ];
    if(TouchInput.wheelY < 0) {
        ckMode.n_Scroll.ZureNo--;
        if(ckMode.n_Scroll.ZureNo < 0) ckMode.n_Scroll.ZureNo = 0;
        SoundManager.playCursor();
        this.Menu_SaveDraw(ckMode);
    }
    if(TouchInput.wheelY > 0) {
        ckMode.n_Scroll.ZureNo++;
        SoundManager.playCursor();
        this.Menu_SaveDraw(ckMode);
    }
    if (ckMode.selecterNo < ckMode.n_Scroll.ZureNo) ckMode.selecterNo = ckMode.n_Scroll.ZureNo;
    if (ckMode.selecterNo > ckMode.n_Scroll.ZureNo + 3) ckMode.selecterNo = ckMode.n_Scroll.ZureNo + 3;
    let _ckPicNo = overSpriteClickable( PN_smBase , _ckCblMap);
    if(_ckPicNo != -1) {
        AutoModeSelectFlg = false;
        ckMode.selecterNo = _ckPicNo + ckMode.n_Scroll.ZureNo;
        _okFlg = TouchInput.isTriggered();
    }
    if (ckMode.loadFlg) {
        if (overPointerSpCkTm(PN_smAutoSave) && !AutoModeSelectFlg) {
            SoundManager.playCursor();
            AutoModeSelectFlg = true;
        }
        if (AutoModeSelectFlg) this.SetSprite(PN_smAutoSave , mSave_PPath + "PN_smAutoSaveSel" , BPs._x , BPs._y);
        else this.SetSprite(PN_smAutoSave , mSave_PPath + "PN_smAutoSave" , BPs._x , BPs._y);
        if (AutoModeSelectFlg && overPointerSpCkTm(PN_smAutoSave)) {
            if (Input.isTriggered('ok') || TouchInput.isTriggered()) _okFlg = true;
        }
    }
    if (!Input.isPressed('up') && !Input.isPressed('down')) {
        SaveDownFlame = ConstSaveFlame;
    }
    var _upFlg = false;
    if (Input.isPressed('up')) {
        SaveDownFlame--;
        _upFlg = SaveDownFlame <= 0;
        if (_upFlg) SaveDownFlame = ConstSaveFlame;
    }
    var _downFlg = false;
    if (Input.isPressed('down')) {
        SaveDownFlame--;
        _downFlg = SaveDownFlame <= 0;
        if (_downFlg) SaveDownFlame = ConstSaveFlame;
    }
    if (Input.isTriggered('up') || _upFlg) {
        if (mSave_SelNo == 0 && ckMode.n_Scroll.ZureNo == 0 && !AutoModeSelectFlg && ckMode.loadFlg) {
            SoundManager.playCursor();
            AutoModeSelectFlg = true;
        } else {
            ckMode.selectNo_Up();
        }
    }
    if (Input.isTriggered('down') || _downFlg) {
        if (AutoModeSelectFlg) {
            SoundManager.playCursor();
            AutoModeSelectFlg = false;
        } else {
            ckMode.selectNo_Down();
        }
    }
    if (ckMode.IsSelecterMove) {
        SoundManager.playCursor();
        this.Menu_SaveDraw(ckMode);
    }
    if (Input.isTriggered('ok') || _okFlg) {
        if(ckMode.loadFlg) {
            BaseGrobalFolName = "ndata";
            if (AutoModeSelectFlg && AutoSaveTxt_Arr.length > 0) {
                LocalLoadFileNo = AutoSaveNo;
                this.LoadStarting(AutoSaveNo);
                SoundManager.playLoad();
            } else {
                if (SaveTxt1_Arr[ckMode.n_Scroll.ZureNo + mSave_SelNo] != "") {
                    LocalLoadFileNo = ckMode.n_Scroll.ZureNo + mSave_SelNo + 1;
                    this.LoadStarting(LocalLoadFileNo);
                    SoundManager.playLoad();
                }
            }
        }
        else
        {
            SaveTxt1_Arr[ckMode.n_Scroll.ZureNo + mSave_SelNo] = $gameVariables.value(VN_SaveTitle);
            SaveTxt2_Arr[ckMode.n_Scroll.ZureNo + mSave_SelNo] = $gameVariables.value(VN_HintTxt);
            let lookCnt = 0; let getCnt = 0;
            for (let i = 0; i <= GetYarimonZukanMaxNo(); i++) {
                var ckNo = i;
                if (ckNo > 150) ckNo += AddZukanNo;
                if ($gameSystem.yZukan[ckNo].lookFlg) lookCnt++;
                if ($gameSystem.yZukan[ckNo].getFlg) getCnt++;
            }
            let lookCntY = 0; let getCntY = 0;
            for (let i = 0; i <= $gameSystem.mZukan.length - 1; i++) {
                if ($gameSystem.mZukan[i].lookFlg) lookCntY++;
                if ($gameSystem.mZukan[i].getFlg) getCntY++;
            }
            var _getMonStr = NLngStrGet("ヤリモン図鑑：") + getCnt + NLngStrGet("　ヤリマン図鑑：") + getCntY;
            SaveTxt3_Arr[ckMode.n_Scroll.ZureNo + mSave_SelNo] = _getMonStr;
            $gameVariables.setValue(VN_BefSaveNo ,ckMode.selecterNo);
            $gameVariables.setValue(VN_BefZureNo ,ckMode.n_Scroll.ZureNo);
            this.SaveTxtSave_SaveNo(ckMode.n_Scroll.ZureNo + mSave_SelNo);
            this.GameFileSave(ckMode.n_Scroll.ZureNo + mSave_SelNo + 1);
            this.Menu_SaveDraw(ckMode);
            SoundManager.playSave();
            saveCheckFlg = true;
        }
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        this.Layer2_DelSprite();
        if(ckMode.loadFlg) {
            titleBox.mode.ModeCng(Title_Select.Select); 
        } else {
            saveExitFlg = true;
            if (!saveOnlyFlg) menuBox.ModeCng(MenuBox.Select); 
            saveOnlyFlg = false;
        }
    }
}
let saveOnlyFlg = false;
let saveExitFlg = false;
Game_Interpreter.prototype.SaveTxtSave_SaveNo = function (_SaveNo) {
    let SaveStr1 = "";
    let SaveStr2 = "";
    let SaveStr3 = "";
    for (let i = 0; i <= mSave_CntMax - 1; i++) {
        if(i != 0) {
            SaveStr1 += ",";
            SaveStr2 += ",";
            SaveStr3 += ",";
        }
        SaveStr1 += SaveTxt1_Arr[i];
        SaveStr2 += SaveTxt2_Arr[i];
        SaveStr3 += SaveTxt3_Arr[i];
    }
    $gameVariables.setValue(VN_SaveStr_1 , SaveStr1);
    $gameVariables.setValue(VN_SaveStr_2 , SaveStr2);
    $gameVariables.setValue(VN_SaveStr_3 , SaveStr3);
    this.UTA_Save(); 
    AutoSave_WaitFlame = AutoSaveSetWaitFlame;
}
let SaveTxt1_Arr = [];  
let SaveTxt2_Arr = [];  
let SaveTxt3_Arr = [];  
let RecoSaveArr = [];
let GetSaveTxtArrs = function () {
    let _Str1 = $gameVariables.value(VN_SaveStr_1);
    let _Str2 = $gameVariables.value(VN_SaveStr_2);
    let _Str3 = $gameVariables.value(VN_SaveStr_3);
    if(_Str1 == 0) _Str1 = "";
    if(_Str2 == 0) _Str2 = "";
    if(_Str3 == 0) _Str3 = "";
    SaveTxt1_Arr = _Str1.split(','); 
    SaveTxt2_Arr = _Str2.split(','); 
    SaveTxt3_Arr = _Str3.split(','); 
    if(SaveTxt1_Arr.length != mSave_CntMax) { 
        SaveTxt1_Arr = [];  
        SaveTxt2_Arr = [];  
        SaveTxt3_Arr = [];  
        for (let i = 0; i <= mSave_CntMax - 1; i++) {
            SaveTxt1_Arr.push("");
            SaveTxt2_Arr.push("");
            SaveTxt3_Arr.push("");
        }
    }
    RecoSaveArr = [];
    for (let i = 0; i <= mSave_CntMax - 1; i++) {
        if (StorageManager.exists(i + 1) && SaveTxt1_Arr[i] == "") {
            SaveTxt1_Arr[i] = "※データを回復しました※"
            SaveTxt3_Arr[i] = "ロードした後に再度セーブをしてください"
            RecoSaveArr.push(true);
        } else {
            RecoSaveArr.push(false);
        }
    }
    if ($gameVariables.value(VN_AutoSave) == 0 && StorageManager.exists(30)) {
        $gameVariables.setValue(VN_AutoSave , "※データを回復しました※" + "," + "");
    }
}
const PN_AutoSaveIcon = 575;
const PN_AutoSaveTxt = 576;
var AutoSave_WaitFlame = 0;
const AutoSaveSetWaitFlame =  3600; 
let AutoSave_NUpdateSc = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    if (AutoSave_WaitFlame > 0) AutoSave_WaitFlame--;
    if (AutoSave_WaitFlame <= 0) {
        this.DelPict(PN_AutoSaveIcon);
        this.DelPict(PN_AutoSaveTxt);
    }
    AutoSave_NUpdateSc.call(this);
}
Game_Interpreter.prototype.AutoSave = function () {
    if (AutoSave_WaitFlame > 0) return; 
    if (!$gameSystem.isMenuEnabled()) return; 
    var now = new Date();
    var year = String(now.getFullYear()).substring(2);
    var month = String(now.getMonth() + 1).padStart(2, '0'); 
    var day = String(now.getDate()).padStart(2, '0');
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    let value1Str = `${day}/${month}/${year}\n${hours}:${minutes}`;
    let lookCnt = 0; let getCnt = 0;
    for (let i = 0; i <= GetYarimonZukanMaxNo(); i++) {
        if ($gameSystem.yZukan[i].lookFlg) lookCnt++;
        if ($gameSystem.yZukan[i].getFlg) getCnt++;
    }
    let lookCntY = 0; let getCntY = 0;
    for (let i = 0; i <= $gameSystem.mZukan.length - 1; i++) {
        if ($gameSystem.mZukan[i].lookFlg) lookCntY++;
        if ($gameSystem.mZukan[i].getFlg) getCntY++;
    }
    let value2Str = "　" + NLngStrGet("ヤリモン図鑑：") + getCnt + "\n" + NLngStrGet("　ヤリマン図鑑：") + getCntY;
    $gameVariables.setValue(VN_AutoSave , value1Str + "," + value2Str);
    this.UTA_Save();    
    this.GameFileSave(AutoSaveNo);  
    this.SetPictC(PN_AutoSaveIcon , "PN_AutoSaveIcon" , 1324 , 792);
    $gameScreen.rotatePicture(PN_AutoSaveIcon, 20);
    StacWaitPict(PN_AutoSaveIcon , 30);
    StacMovePict(PN_AutoSaveIcon , true , true , 30 , 0);
    this.SetPict( PN_AutoSaveTxt , "PN_AutoSaveTxt" , 1339 , 785);
    StacWaitPict(PN_AutoSaveTxt , 30);
    StacMovePict(PN_AutoSaveTxt , true , true , 30 , 0);
    AutoSave_WaitFlame = AutoSaveSetWaitFlame;
}
