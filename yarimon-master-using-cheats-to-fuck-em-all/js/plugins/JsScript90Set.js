const TPicPath = "pictures/Title/";   
const PN_TBack = 1;
const PN_TBoy = PN_TBack + 1;
const PN_TPlayer = PN_TBoy + 1;
const PN_TMos = PN_TPlayer + 1;
const PN_TLogo = 10;
const PN_Sel = PN_TLogo + 1;
const PN_TLngBack = PN_Sel + 5;
const PN_TLng = PN_TLngBack + 1;
const PN_TDlc_Base = PN_Sel + 3;
const PN_TDlcBtn = PN_TDlc_Base + 1;
const PN_TDlcDesc = PN_TDlcBtn + 3;
let titleBox = new TitleBox();
let titleCanvasFlame = 999;
let titleCanvasFlg = false;
Game_Interpreter.prototype.N_Title_Start = function () {
    _EndingCheckFlg = false;
    this.SetSpriteR(PN_TBack, TPicPath + "PN_TBack", BPs._x + 816, BPs._y);
    this.SetSprite(PN_PicFlame, "PN_PicFlame", 0, 0);
    $gameVariables.setValue(VN_タイトル所利用, 0);
}
Game_Interpreter.prototype.N_Title_Start_2 = function () {
    this.MoveSpriteAdd(PN_TBack, 2217, 0, 70);
    this.SetSprite(PN_TBoy, TPicPath + "PN_TBoy", BPs._x, BPs._y , 0);
    this.MoveSprite(PN_TBoy , true , true , 10);
}
Game_Interpreter.prototype.N_Title_Update = function () {
    if (Title_DLC_DescModeFlg) { 
        this.DLC_Desc_Update();
        return;
    }
    titleBox.Update();
    switch (titleBox.modeName) {
        case TitleBox.Title:
            this.N_Title_Title_Update(titleBox);
            break;
        case TitleBox.Select:
            this.N_Title_Select_Update(titleBox.mode);
            break;
    }
}
const VN_タイトル所利用 = 390;
Game_Interpreter.prototype.N_Title_Title_Update = function (_mode) {
    let ckflame = _mode.flame;
    if (ckflame == 2) {
        this.StartFontLoad();
        this.N_Title_Start();
    }
    if (ckflame == 20) {
        this.PlaySe("gameStart");
        this.N_Title_Start_2();
    }
    if (ckflame == 120) {
        titleCanvasFlame = 60;
        $gameVariables.setValue(VN_タイトル所利用, 1);
        this.PlayBgm("Title");
        this.DelSprite(PN_TBack);
        this.SetSprite(PN_TPlayer, TPicPath + "PN_TPlayer", BPs._x - 816, BPs._y);
        EasingStr = "easeOutQuad";
        this.MoveSprite(PN_TPlayer, BPs._x, true, 30);
        EasingStr = "";
        this.SetSprite(PN_TLogo, TPicPath + "PN_TLogo", BPs._x, BPs._y - 500);
    }
    if (ckflame == 121) this.DelSprite(PN_TBoy);
    if (ckflame == 150) {
        EasingStr = "easeOutQuad";
        this.MoveSprite(PN_TLogo, true, BPs._y, 30);
        EasingStr = "";
    }
    if (ckflame > 180) {
        titleCanvasFlame--;
        if (titleCanvasFlame <= 0) {
            titleCanvasFlg = !titleCanvasFlg;
            if (titleCanvasFlg)
                this.SetSprite(PN_TBack, TPicPath + "PN_TBack_2", BPs._x, BPs._y , 255);
            else
                this.SetSprite(PN_TBack, TPicPath + "PN_TBack_2", BPs._x, BPs._y , 0);
            titleCanvasFlame = 30;
        }
        if (TouchInput.isTriggered() || Input.isTriggered('ok')) {
            _mode.ModeCng(TitleBox.Select); 
        }
    }
}
Game_Interpreter.prototype.N_Title_Select_Draw = function () {
    this.DelSpriteSpan(PN_TBoy, PN_TLogo);
    this.SetSprite(PN_TBack, TPicPath + "PN_T2_Base", BPs._x, BPs._y , 255);
    var _btnBaseY = 70;
    this.SetSprite(PN_Sel + 0, TPicPath + "PN_T2_Sel1", BPs._x + 185, BPs._y + _btnBaseY + (102 * 0));
    this.SetSprite(PN_Sel + 1, TPicPath + "PN_T2_Sel2", BPs._x + 185, BPs._y + _btnBaseY + (102 * 1));
    this.SetSprite(PN_Sel + 2, TPicPath + "PN_T2_Sel3", BPs._x + 185, BPs._y + _btnBaseY + (102 * 2));
    var addStr = "";
    //if (Lng仮Flg) addStr = "_Kari";
    this.SetSprite(PN_Sel + 3, TPicPath + "PN_T2_Sel4" + addStr, BPs._x + 185, BPs._y + _btnBaseY + (102 * 3));
    this.SetSprite(PN_Sel + 4, TPicPath + "PN_T2_Sel5", BPs._x + 185, BPs._y + _btnBaseY + (102 * 4));
    this.SpriteCngColorArr([PN_Sel + 0, PN_Sel + 1, PN_Sel + 2, PN_Sel + 3, PN_Sel + 4], [-20, -20, -20]);
    this.SpriteCngColor(PN_Sel + titleBox.mode.selecterNo);
}
Game_Interpreter.prototype.N_Title_Select_Update = function (_mode) {
    let ckflame = _mode.flame;
    if (ckflame == 1) {
        this.Layer2_DelSprite();
        this.N_Title_Select_Draw();
        if ($gameVariables.value(VN_SaveStr_1) != 0) _mode.selecterNo = 1;
    }
    let _okFlg = false;
    let _ckPicArr = [PN_Sel + 0, PN_Sel + 1, PN_Sel + 2, PN_Sel + 3, PN_Sel + 4];
    let _ckPicNo = overPointerSpCkArr_GetNo(_ckPicArr);
    if (_ckPicNo != -1) {
        _mode.selecterNo = _ckPicNo;
        _okFlg = TouchInput.isTriggered();
    }
    if (ckflame >= 1) {
        switch (_mode.modeName) {
            case Title_Select.Select:
                if (Input.isTriggered('up')) {
                    _mode.selectNo_Up();
                }
                if (Input.isTriggered('down')) {
                    _mode.selectNo_Down();
                }
                if (_mode.IsSelecterMove) {
                    SoundManager.playCursor();
                    this.N_Title_Select_Draw();
                }
                if (Input.isTriggered('ok') || _okFlg) {
                    SoundManager.playOk();
                    if (_mode.selecterNo == 4) { 
                        this.DLC_Desc_Start(); return;
                    }
                    _mode.OkModeCng();
                    if (_mode.selecterNo == 0) {
                        for (let i = PN_TBack; i <= PN_Sel + 4; i++) {
                            this.MoveSprite(i, true, true, 30, 0);
                        }
                    }
                }
                if (TouchInput.isCancelled() || Input.isTriggered('menu')) {
                    this.DelSpriteSpan(PN_TBack , PN_Sel + 4);
                    this.SetSprite(PN_TLogo, TPicPath + "PN_TLogo", BPs._x, BPs._y);
                    _mode.parent.ModeCng(TitleBox.Title);
                }
                break;
            case MenuBox.Save:
                this.Menu_SaveUpdate(_mode.mode, true);
                break;
            case MenuBox.Option:
                this.Menu_OptionUpdate(_mode.mode, true);
                break;
            case Title_LngSelect.LngSelect:
                this.LanguageUpdate(_mode);
                break;
            case "":
                break;
        }
    }
}
let chara1Data = ["", 0];
let chara2Data = ["", 0];
Game_Interpreter.prototype.TitleCharacterUpdate = function () {
    if (this.character(3)._x == 4) {
        this.character(3)._x = 24;
        this.character(3)._realX = 24;
        chara1Data = charaDataGetting();
        this.character(3)._characterName = chara1Data[0];
        this.character(3)._characterIndex = chara1Data[1];
    }
    if (this.character(5)._x == 4) {
        this.character(5)._x = 24;
        this.character(5)._realX = 24;
        chara2Data = charaDataGetting();
        this.character(5)._characterName = chara2Data[0];
        this.character(5)._characterIndex = chara2Data[1];
    }
}
let charaDataGetting = function () {
    let charaPic = "Woman";
    let charaIndex = 0;
    while (true) {
        switch (Math.floor( Math.random() * 16)) {
            case 0: 
                charaPic = "Woman"; charaIndex = 0; break;
            case 1: 
                charaPic = "Woman"; charaIndex = 1; break;
            case 2: 
                charaPic = "Woman"; charaIndex = 2; break;
            case 3: 
                charaPic = "Woman"; charaIndex = 3; break;
            case 4: 
                charaPic = "Woman"; charaIndex = 4; break;
            case 5: 
                charaPic = "Woman_Town"; charaIndex = 3; break;
            case 6:
                charaPic = "Woman_Town2"; charaIndex = 2; break;
            case 7:
                charaPic = "Woman_Town3"; charaIndex = 0; break;
            case 8:
                charaPic = "Woman_Town3"; charaIndex = 4; break;
            case 9:
                charaPic = "Woman_Town4"; charaIndex = 0; break;
            case 10:
                charaPic = "Woman_Town5"; charaIndex = 0; break;
            case 11:
                charaPic = "Woman_Wa"; charaIndex = 0; break;
            case 12:
                charaPic = "Woman_Wa"; charaIndex = 1; break;
            case 13:
                charaPic = "Woman_Wa"; charaIndex = 4; break;
            case 14:
                charaPic = "Woman_Wa2"; charaIndex = 0; break;
            case 15:
                charaPic = "Woman"; charaIndex = 0; break;
            default:
                break;
        }
        if (chara1Data[0] == charaPic && chara1Data[1] == charaIndex) continue;
        if (chara2Data[0] == charaPic && chara2Data[1] == charaIndex) continue;
        break;
    }
    return [charaPic , charaIndex];
}
let lngPicArr = [];
Game_Interpreter.prototype.N_Title_NLng_Draw = function (_mode) {
    this.SetSprite(PN_TLngBack, TPicPath + "PN_TLngBack", BPs._x, BPs._y);
    var addStr = "";
    if (LngDevFlg) addStr = "_dev";
    //if (Lng仮Flg) addStr = "_Kari";
    let lngPosY = 108;
    let lngPosYSpan = 102;
    this.SetSprite(PN_TLng + 0, TPicPath + "PN_TLng_1" + addStr, BPs._x + 185, BPs._y + lngPosY + (lngPosYSpan * 0));
    this.SetSprite(PN_TLng + 1, TPicPath + "PN_TLng_2" + addStr, BPs._x + 185, BPs._y + lngPosY + (lngPosYSpan * 1));
    this.SetSprite(PN_TLng + 2, TPicPath + "PN_TLng_3" + addStr, BPs._x + 185, BPs._y + lngPosY + (lngPosYSpan * 2));
    this.SetSprite(PN_TLng + 3, TPicPath + "PN_TLng_4" + addStr, BPs._x + 185, BPs._y + lngPosY + (lngPosYSpan * 3));
    this.SetSprite(PN_TLng + 4, TPicPath + "PN_TLng_5" + addStr, BPs._x + 185, BPs._y + lngPosY + (lngPosYSpan * 4));
    lngPicArr = [PN_TLng + 0 , PN_TLng + 1 , PN_TLng + 2 , PN_TLng + 3 , PN_TLng + 4];
    this.SpriteCngColorArr([PN_TLng + 0, PN_TLng + 1, PN_TLng + 2 , PN_TLng + 3 , PN_TLng + 4], [-20, -20, -20]);
    this.SpriteCngColor(PN_TLng + _mode.mode.selecterNo);
}
Game_Interpreter.prototype.LanguageUpdate = function (_mode) {
    let _okFlg = false;
    if (_mode.mode.flame == 1) {
        this.N_Title_NLng_StartDraw(_mode);
    }
    var moveFlg = false;
    var ckNo = overPointerSpCkArr(lngPicArr);
    if (ckNo != -1) {
        moveFlg = true;
        _mode.mode.selecterNo = ckNo - PN_TLng;
        if (TouchInput.isTriggered()) _okFlg = true;
    }
    if (Input.isTriggered('up')) {
        _mode.mode.selectNo_Up();
    }
    if (Input.isTriggered('down')) {
        _mode.mode.selectNo_Down();
    }
    if (_mode.mode.IsSelecterMove || moveFlg) {
        this.N_Title_NLng_Draw(_mode);
    }
    if (Input.isTriggered('ok') || _okFlg) {
        if (LngDevFlg) return;
        _mode.mode.OkModeCng();
    }
    if (TouchInput.isCancelled() || Input.isTriggered('menu')) {
        _mode.ModeCng(TitleBox.Select);
        this.DelSpriteSpan(PN_TLngBack , PN_TLng + 4);
    }
}
Game_Interpreter.prototype.N_Title_NLng_StartDraw = function (_mode) {
    _mode.mode.selecterNo = 0;
    if (LngMode == "en") _mode.mode.selecterNo = 1;
    if (LngMode == "cn") _mode.mode.selecterNo = 2;
    if (LngMode == "tc") _mode.mode.selecterNo = 3;
    if (LngMode == "ko") _mode.mode.selecterNo = 4;
    this.N_Title_NLng_Draw(_mode);
}
let Title_DLC_DescModeFlg = false;
let DLC_Desc_SelectNo = 0;
let DLC_Desc_PicArr = [PN_TDlcBtn + 0, PN_TDlcBtn + 1, PN_TDlcBtn + 2];
Game_Interpreter.prototype.DLC_Desc_Start = function () {
    Title_DLC_DescModeFlg = true;
    DLC_Desc_SelectNo = 0;
    this.SetSprite(PN_TDlc_Base, TPicPath + "PN_TDlc_Base", BPs._x, BPs._y);
    this.DLC_Desc_BtnDraw();
}
Game_Interpreter.prototype.DLC_Desc_BtnDraw = function () {
    for (let i = 0; i < 3; i++) {
        this.SetSprite(
            PN_TDlcBtn + i, TPicPath + "PN_TDlcBtn" + (i + 1) ,
            BPs._x + 12, BPs._y + 220 + (90 * i)
        );
    }
    this.SpriteCngColorArr(DLC_Desc_PicArr, [-20, -20, -20]);
    this.SpriteCngColor(PN_TDlcBtn + DLC_Desc_SelectNo);
}
Game_Interpreter.prototype.DLC_Desc_Update = function () {
    if (DLC_Desc_ViewFlg) {
        this.DLC_Desc_DescUpdate();
        return;
    }
    var moveFlg = false;
    var _okFlg = false;
    let _ckPicNo = overPointerSpCkArr_GetNo(DLC_Desc_PicArr);
    if (_ckPicNo != -1) {
        if (DLC_Desc_SelectNo != _ckPicNo) {
            DLC_Desc_SelectNo = _ckPicNo;
            moveFlg = true;
        }
        _okFlg = TouchInput.isTriggered();
    }
    if (Input.isTriggered('up')) {
        DLC_Desc_SelectNo--; moveFlg = true;
    }
    if (Input.isTriggered('down')) {
        DLC_Desc_SelectNo++; moveFlg = true;
    }
    if (moveFlg) {
        SoundManager.playCursor();
        if (DLC_Desc_SelectNo < 0) DLC_Desc_SelectNo = DLC_Desc_PicArr.length - 1;
        if (DLC_Desc_SelectNo >= DLC_Desc_PicArr.length) DLC_Desc_SelectNo = 0;
        this.DLC_Desc_BtnDraw();
    }
    if (Input.isTriggered('ok') || _okFlg) {
        SoundManager.playOk();
        this.DLC_Desc_DescView();
    }
    if (TouchInput.isCancelled() || Input.isTriggered('menu'))
    {
        Title_DLC_DescModeFlg = false;
        this.DLC_Desc_End();
    }
    this.SpriteCngColor(PN_TDlcBtn + DLC_Desc_SelectNo);
}
Game_Interpreter.prototype.DLC_Desc_End = function () {
    this.DelSpriteSpan(PN_TDlc_Base , PN_TDlcBtn + 2);
    this.N_Title_Select_Draw();
}
let DLC_Desc_ViewFlg = false;
let DLC_Desc_flame = 0;
Game_Interpreter.prototype.DLC_Desc_DescView = function () {
    DLC_Desc_ViewFlg = true;
    DLC_Desc_flame = 0;
    this.SetSpriteFIn( PN_TDlcDesc , TPicPath + "PN_TDlcDesc" + (DLC_Desc_SelectNo + 1) ,
        BPs._x , BPs._y , 0 , 0 , 3);
}
Game_Interpreter.prototype.DLC_Desc_DescUpdate = function () {
    DLC_Desc_flame++;
    if (DLC_Desc_flame < 5) return;
    if (TouchInput.isCancelled() || Input.isTriggered('menu') ||
        Input.isTriggered('ok') || TouchInput.isTriggered()) {
        this.DelSprite(PN_TDlcDesc);
        this.DLC_Desc_DescEnd();
    }
}
Game_Interpreter.prototype.DLC_Desc_DescEnd = function () {
    DLC_Desc_ViewFlg = false;
}
