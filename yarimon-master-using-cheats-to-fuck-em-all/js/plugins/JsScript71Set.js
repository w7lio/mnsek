let mOpti_PPath = MenuPicPath + "/Opt/";
Game_Interpreter.prototype.Menu_OptionUpdate = function (ckMode , titleFlg) {
    titleFlg = typeof titleFlg !== 'undefined' ? titleFlg : false;
    if(ckMode.flame == 1) {
        this.SetSprite(PN_moBase, mOpti_PPath + "PN_moBase", BPs._x, BPs._y);
        this.M_Option_Draw();
    }
    if(ckMode.flame > 1) { 
        let csPosY = BPs._y + 141 + 80 * ckMode.selecterNo;
        if (ckMode.selecterNo == 3) csPosY = BPs._y + 141 + 80 * 2 + 33;
        if (ckMode.selecterNo == 4) csPosY = BPs._y + 141 + 80 * 3 + 30;
        this.SetSprite(PN_mL2Selecter , MenuPicPath + "PN_mSelecter",
            BPs._x + 55, csPosY , 255 , -100);
        let reDrawFlg = false;  
        let saveFlg = false;    
        let ckPicArr = [
            [66 , 139 + (0 * 80) ,304,25],
            [66 , 139 + (1 * 80) ,304,25],
            [66 , 139 + (2 * 80) ,304,25],
            [66 , 336 ,166,21] 
        ]
        let ckPicNo = overSpriteClickable(PN_smBase , ckPicArr);
        if (ckPicNo != -1) {
            ckMode.selecterNo = ckPicNo;
            if (TouchInput.isTriggered()) {
                if (ckPicNo == 3) {
                    $gameSwitches.setValue(VoiceMuteSwNo , !$gameSwitches.value(VoiceMuteSwNo));
                } else {
                    ckMode.VolumeCngVar(Math.floor(ClickablePos._x / 304 * 100));
                }
                saveFlg = reDrawFlg = true; 
            }
            if (TouchInput.isTriggered()) SoundManager.playCursor();
        }
        let moNanFlg = false;
        if (overPointerSpCk(PN_moNan)) {
            ckMode.selecterNo = 4;
            if (TouchInput.isTriggered()) {
                moNanFlg = true;
                SoundManager.playCursor();
            }
        }
        if (Input.isTriggered('up')) {
            SoundManager.playCursor();
            ckMode.selectNo_Up();
        }
        if (Input.isTriggered('down')) {
            SoundManager.playCursor();
            ckMode.selectNo_Down();
        }
        if (Input.isTriggered('left')) {
            SoundManager.playCursor();
            ckMode.LeftKeyDown();
            saveFlg = reDrawFlg = true;
        }
        if (Input.isTriggered('right')) {
            SoundManager.playCursor();
            ckMode.RightKeyDown();
            saveFlg = reDrawFlg = true;
        }
        if ((Input.isTriggered('ok') && ckMode.selecterNo == 3) || moNanFlg) {
            SoundManager.playCursor();
            ckMode.RightKeyDown();
            saveFlg = reDrawFlg = true;
        }
        if (reDrawFlg || ckMode.IsSelecterMove) {
            this.M_Option_Draw();
        }
        if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
            ConfigManager.save(); 
            this.UTA_Save();
            SoundManager.playCancel();
            this.Layer2_DelSprite();
            if(titleFlg) {
                titleBox.mode.ModeCng(Title_Select.Select); 
            } else {
                menuBox.ModeCng(MenuBox.Select); 
            }
        }
    }
}
Game_Interpreter.prototype.M_Option_Draw = function () {
    let _sVar = $gameVariables.value(MasterVolVarNo);
    this.SetSprite(PN_moBar + 0, mOpti_PPath + "PN_moBar", BPs._x + 68, BPs._y + 141 + 80 * 0 , 255,_sVar);
    this.SpriteStr( PN_moTxt + 0 , SCol.Blk0 + _sVar + " " , 27 , BPs._x + 385, BPs._y + 134 + 80 * 0);
    _sVar = ConfigManager['bgmVolume'];
    this.SetSprite(PN_moBar + 1, mOpti_PPath + "PN_moBar", BPs._x + 68, BPs._y + 141 + 80 * 1 , 255, _sVar);
    this.SpriteStr( PN_moTxt + 1 , SCol.Blk0 + _sVar + " " , 27 , BPs._x + 385, BPs._y + 134 + 80 * 1);
    _sVar = ConfigManager['seVolume'];
    this.SetSprite(PN_moBar + 2, mOpti_PPath + "PN_moBar", BPs._x + 68, BPs._y + 141 + 80 * 2 , 255, _sVar);
    this.SpriteStr(PN_moTxt + 2 , SCol.Blk0 + _sVar + " " , 27 , BPs._x + 385, BPs._y + 134 + 80 * 2);
    if (!$gameSwitches.value(VoiceMuteSwNo))
        this.SetSprite(PN_moVoiceCk, mOpti_PPath + "PN_moVoiceCk", BPs._x + 66, BPs._y + 336 , 255);
    else
        this.DelSprite(PN_moVoiceCk);
    if ($gameVariables.value(NanidVarNo) == Nanid.Nomal) { 
        this.SetSprite(PN_moNan, mOpti_PPath + "PN_moNan0", BPs._x + 56, BPs._y + 366 , 255);
    } else { 
        this.SetSprite(PN_moNan, mOpti_PPath + "PN_moNan1", BPs._x + 56, BPs._y + 366 , 255);
    }
    D_Text_Cng_font = ""; 
};
Game_Interpreter.prototype.Layer1_DelSprite = function () {
    this.DelSpriteSpan(PN_mBase , PN_mL1End);
}
Game_Interpreter.prototype.Layer2_DelSprite = function () {
    this.DelSpriteSpan(PN_mL2Base , PN_mL2End);
}
let N_LoadSuccessFlg = false;
let _LoadSelectNo = 0; 
let _LoadStartingFlame = 0; 
Game_Interpreter.prototype.LoadStarting = function (_LoadNo) {
    if (_LoadStartingFlame == 0) {
        _LoadSelectNo = _LoadNo; 
        SoundManager.playLoad(); 
        SceneManager.push(Scene_Load);
        PicFrame_ReDrawFlg = true;
    }
    _LoadStartingFlame++;
}
Scene_File.prototype.savefileId = function() {
    return _LoadSelectNo;
};
Scene_Load.prototype.update = function () {
    Scene_File.prototype.update.call(this);
    if (_LoadSelectNo != 0) {
        this.onSavefileOk();
        _LoadSelectNo = 0
    }
}
Scene_Load.prototype.createWindowLayer = function () {
    var width = 0;
    var height = 0;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    this._windowLayer = new WindowLayer();
    this._windowLayer.move(x, y, width, height);
    this.addChild(this._windowLayer);
}
Scene_Load.prototype.onLoadSuccess = function () {
    this.fadeOutAll();
    this.reloadMapIfUpdated();+
        SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
    N_LoadSuccessFlg = true;
    for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
        var _id = $gameSystem.Player.syojiTikemon[i].YarimonData.id;
        $gameSystem.Player.syojiTikemon[i].YarimonData.name = GetYarimonData_ID(_id).name;
    }
    for (let i = 0; i < $gameSystem.MonBox.length; i++) {
        for (let j = 0; j < $gameSystem.MonBox[i].length; j++) {
            if ($gameSystem.MonBox[i][j] != null) {
                var _id = $gameSystem.MonBox[i][j].YarimonData.id;
                $gameSystem.MonBox[i][j].YarimonData.name = GetYarimonData_ID(_id).name;
            }
        }
    }
    for (let i = 0; i < $N_Yariman_DB.length; i++) {
        let addFlg = true;
        for (let j = 0; j < $gameSystem.mZukan.length; j++) {
            if ($N_Yariman_DB[i].id == $gameSystem.mZukan[j].id) {
                addFlg = false;
            }
        }
        if (addFlg) {
            $gameSystem.mZukan.push(new SaveZukan($N_Yariman_DB[i].id));
        }
    }
    if ($gameMap.mapId() == 31) { 
        $gamePlayer.reserveTransfer(2, 31, 13, 2, 0);
        for (let ei = ErrLogPic; ei <= ErrLogPic + 10; ei++) DelPict(ei);
        $gameMessage.add("◆戦闘時フリーズ状態を修正しました◆");
    }
    SaveFolCngName = "";
};
