const mft_PicPath = "pictures/Menu/FastTravel/";
const PN_ftBase = PN_mL2Base + 1;
const PN_ftBtn = PN_ftBase + 1;
const PN_ftCloseBtn = PN_ftBtn + 6;
const PN_ftWin = PN_ftCloseBtn + 1;
const PN_ftTxt = PN_ftWin + 4;
const PN_ftSelecter = PN_ftTxt + 4;
const PN_ftYNBase = PN_ftSelecter + 1;
const PN_ftSelTop = PN_ftYNBase + 2;
let m_FastTrb_Flame = 0;
let m_FastTrb_Arr = [];
let m_FastTrb_selecter;
const CN_FastMove = 490;
let FastMoveSelNo = -1;
let m_FastTrb_TxtArr = [];
let FastTrabel_FirstSettingFlg = false;
let FastTrabel_NUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    FastTrabel_NUpdate.call(this);
    if (!FastTrabel_FirstSettingFlg) {
        FastTrabel_FirstSettingFlg = true;
        m_FastTrb_TxtArr.push(
            NLngStrGet("主人公の家・ヤリモン研究所・ヒカリの家") + "\n" +
            NLngStrGet("レオの家")
        );
        m_FastTrb_TxtArr.push(
            NLngStrGet("ヤリモンセンター・ビッグデパート") + "\n" +
            NLngStrGet("ヤリモン研究所・ヤリモンジム") + "\n" +
            NLngStrGet("開発センター")
        );
        m_FastTrb_TxtArr.push(
            NLngStrGet("ヤリモンセンター・ヤリモンジム") + "\n" +
            NLngStrGet("船着き場・海の家キャンディーペロリン") + "\n" +
            NLngStrGet("プール（ラッキーベスケ）")
        );
        m_FastTrb_TxtArr.push(
            NLngStrGet("ヤリモンセンター・ヤリモン道場") + "\n" +
            NLngStrGet("セントラル神社・学び屋")
        );
        m_FastTrb_TxtArr.push(
            NLngStrGet("セントラルタワー・シレンの森") + "\n" +
            ""
        );
        m_FastTrb_TxtArr.push(
            NLngStrGet("エンドラボラトリ・ホテル") + "\n"
        );
    }
}
let Menu_FastSave = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    Menu_FastSave.call(this);
    this.FastTrbArr = [false , false, false , false , false , false]; 
};
Game_Interpreter.prototype.Menu_FastTrb_Draw = function (_mode) {
    var slectCount = 5;
    if ($gameSystem.FastTrbArr[5]) slectCount = 6;
    m_FastTrb_selecter = new OneSelecter(slectCount);
    this.Menu_FastTrb_BtnDraw();
    this.SetSprite(PN_ftBase , mft_PicPath + "PN_ftBase" , BPs._x , BPs._y);
    if ($gameSystem.FastTrbArr.length < 6) $gameSystem.FastTrbArr.push(false);
};
let _FastTrb_PicArr = [];
Game_Interpreter.prototype.Menu_FastTrb_BtnDraw = function () {
    let _zureX = -10;
    let ZureBtnY = 80;
    _FastTrb_PicArr = [];
    var setScale = 100;
    var slectCount = 5;
    if ($gameSystem.FastTrbArr[5]) {
        slectCount = 6;
        setScale = 90;
        ZureBtnY *= setScale / 100;
    }
    for (let i = 0; i <= slectCount - 1; i++) {
        _FastTrb_PicArr.push(PN_ftBtn + i);
        let _setFlg = $gameSystem.FastTrbArr[i];
        if (_setFlg) {
            _zureX = -10;
            if(m_FastTrb_selecter.selecterNo == i) _zureX = 0;
            this.SetSprite(PN_ftBtn + i , mft_PicPath + "PN_ftBtn" + (i + 1) ,
                BPs._x + _zureX , BPs._y + 102 + (ZureBtnY * i)
                , 255 , setScale , setScale);
        } else {
            m_FastTrb_selecter.skipSelectNo.push(i);
        }
    }
    _FastTrb_PicArr.push(PN_ftCloseBtn);
    _zureX = -10;
    let _yPos = BPs._y + 126 + (ZureBtnY * m_FastTrb_selecter.selecterNo);
    if(m_FastTrb_selecter.selecterNo == m_FastTrb_selecter.selectNoMax) {
        _yPos = BPs._y + 126 + (ZureBtnY * m_FastTrb_selecter.selectNoMax);
        _zureX = 0;
    } else {
        this.SetSprite(PN_ftWin , mft_PicPath + "PN_ftWin" + (m_FastTrb_selecter.selecterNo + 1) , BPs._x , BPs._y);
        let setTextSize = 24;
        if (LngMode == "en") setTextSize = 20;
        this.SpriteStr(PN_ftTxt , m_FastTrb_TxtArr[m_FastTrb_selecter.selecterNo] , setTextSize ,
            BPs._x + 300 , BPs._y + 440);
    }
    this.SetSprite(PN_ftCloseBtn , mft_PicPath + "PN_ftCloseBtn" ,
        BPs._x + _zureX , BPs._y + 102 + (ZureBtnY * slectCount)
        , 255 , setScale , setScale);
    var selectZureX = 240;
    if ($gameSystem.FastTrbArr[5]) selectZureX -= 30;
    this.SetSprite(PN_ftSelecter, MenuPicPath + "PN_mSelecter", BPs._x + selectZureX , _yPos);
}
let Menu_FastTrb_YNModeFlg = false;
Game_Interpreter.prototype.Menu_FastTrbUpdate = function (_mode) {
    if (Menu_FastTrb_YNModeFlg) {
        this.Menu_FastTrb_YN_Update();
        return;
    }
    m_FastTrb_Flame++;
    if (m_FastTrb_Flame == 1) this.Menu_FastTrb_Draw(_mode);
    if (m_FastTrb_Flame > 1) {
        let _okFlg = false; let _cancelFlg = false;
        let _ckNo = overPointerSpCkArr_GetNo(_FastTrb_PicArr);
        if(_ckNo != -1) {
            m_FastTrb_selecter.selecterNo = _ckNo;
            if(TouchInput.isTriggered()) {
                if(m_FastTrb_selecter.selectNoMax != _ckNo) {
                    _okFlg = true;
                } else {
                    _cancelFlg = true;
                }
            }
        }
        if (Input.isTriggered('up')) {
            m_FastTrb_selecter.selectNo_Up();
        }
        if (Input.isTriggered('down')) {
            m_FastTrb_selecter.selectNo_Down();
        }
        if(m_FastTrb_selecter.IsSelecterMove) {
            SoundManager.playCursor();
            this.Menu_FastTrb_BtnDraw();
        }
        if(Input.isTriggered('ok') || _okFlg) {
            if(m_FastTrb_selecter.selecterNo == m_FastTrb_selecter.selectNoMax) {
                _cancelFlg = true;
                SoundManager.playCancel();
            } else {
                this.Menu_FastTrb_YN_Draw();
                SoundManager.playOk();
            }
        }
        if (Input.isTriggered('menu') || TouchInput.isCancelled() || _cancelFlg) {
            SoundManager.playCancel();
            this.DelSprite(PN_dmSelecter);
            this.Layer2_DelSprite();
            menuBox.ModeCng(MenuBox.Select); 
        }
    }
}
let m_FastTrb_YNselecter;
let Menu_FastTrb_YN_Flame = 0;
Game_Interpreter.prototype.Menu_FastTrb_YN_Draw = function () {
    m_FastTrb_YNselecter = new OneSelecter(1);
    m_FastTrb_YNselecter.loopFlg = false;
    Menu_FastTrb_YNModeFlg = true;
    Menu_FastTrb_YN_Flame = 0;
    this.SetSprite(PN_ftYNBase , mft_PicPath + "PN_ftYNBase" , BPs._x , BPs._y);
    this.SetSpriteC(PN_ftSelTop , MenuPicPath + "PN_mSelecter",
        BPs._x + 370 + 220 * m_FastTrb_YNselecter.selecterNo , BPs._y + 375);
    let _moveStr = "";
    if(m_FastTrb_selecter.selecterNo == 0) _moveStr = NLngStrGet("ハジメムラ");
    if(m_FastTrb_selecter.selecterNo == 1) _moveStr = NLngStrGet("ビッグシティ");
    if(m_FastTrb_selecter.selecterNo == 2) _moveStr = NLngStrGet("ハーバータウン");
    if(m_FastTrb_selecter.selecterNo == 3) _moveStr = NLngStrGet("和の里");
    if(m_FastTrb_selecter.selecterNo == 4) _moveStr = NLngStrGet("セントラル");
    if(m_FastTrb_selecter.selecterNo == 5) _moveStr = NLngStrGet("リゾート");
    this.SpriteStrC( PN_ftYNBase + 1 , NLngStrGet("<value> へ移動しますか？" , [_moveStr]) ,
        32 , BPs._x + 409 , BPs._y + 300);
}
Game_Interpreter.prototype.Menu_FastTrb_YN_Update = function () {
    Menu_FastTrb_YN_Flame++;
    if(Menu_FastTrb_YN_Flame > 2) {
        let _okFlg = false; let _cancelFlg = false;
        let _cbmArr = [
            [248 , 349, 135 ,52],
            [248 + 192, 349 , 135 , 52]
        ];
        let _ckNo = overSpriteClickable( PN_ftYNBase , _cbmArr);
        if(_ckNo != -1) {
            m_FastTrb_YNselecter.selecterNo = _ckNo;
            if(TouchInput.isTriggered()) {
                if(_ckNo == 1) {
                    _cancelFlg = true;
                } else {
                    _okFlg = true;
                }
            }
        }
        if (Input.isTriggered('left')) {
            m_FastTrb_YNselecter.selectNo_Up();
        }
        if (Input.isTriggered('right')) {
            m_FastTrb_YNselecter.selectNo_Down();
        }
        if (m_FastTrb_YNselecter.IsSelecterMove) {
            SoundManager.playCursor();
            this.SetSpriteC(PN_ftSelTop , MenuPicPath + "PN_mSelecter",
                BPs._x + 370 + 220 * m_FastTrb_YNselecter.selecterNo , BPs._y + 375);
        }
        if (Input.isTriggered('ok') || _okFlg) {
            if(m_FastTrb_YNselecter.selecterNo == m_FastTrb_YNselecter.selectNoMax) {
                SoundManager.playCancel();
                _cancelFlg = true;
            } else {
                AutoSave_WaitFlame += 180; 
                SoundManager.playOk();
                this.DelSpriteSpan(PN_ftYNBase , PN_ftSelTop);
                Menu_FastTrb_YNModeFlg = false;
                this.DelSprite(PN_dmSelecter);
                this.Layer2_DelSprite();
                menuBox.ModeCng(MenuBox.Select); 
                this.Layer1_DelSprite(); 
                this.Menu_End();
                menuBox.Menu_Close();
                FastMoveSelNo = m_FastTrb_selecter.selecterNo;
                this.SetCmnEventSc(CN_FastMove);
            }
        }
        if (Input.isTriggered('menu') || TouchInput.isCancelled() || _cancelFlg) {
            this.DelSpriteSpan(PN_ftYNBase , PN_ftSelTop);
            SoundManager.playCancel();
            Menu_FastTrb_YNModeFlg = false;
        }
    }
}
const PN_fwChara = 390;
const PN_fwEffect = PN_fwChara + 1;
let fwFlame = 0; 
let fwSwitch = true;
Game_Interpreter.prototype.Menu_FastTrb_FlyEffect_Start = function () {
    fwFlame = 0;
    this.SetSprite( PN_fwChara , "FlayWitch" , 1130 , PL_winY - 100);
    EasingStr = "easeInQuad";
    this.MoveSprite(PN_fwChara , PL_winX - 48 , PL_winY , 10);
    EasingStr = "";
    if(!fwSwitch) {
        this.SetSprite( PN_fwEffect , "FlayEffect" , -300 , 0);
        this.MoveSprite(PN_fwEffect , -1750 , 0 , 10);
    }
}
Game_Interpreter.prototype.Menu_FastTrb_FlyEffect_Update = function () {
    fwFlame++;
    if(fwFlame == 10) {
        $gamePlayer.setTransparent(fwSwitch);
        EasingStr = "easeInQuad";
        this.MoveSprite(PN_fwChara , 240 , PL_winY - 100 , 10);
        EasingStr = "";
    }
    if(fwFlame == 15 && fwSwitch) {
        this.SetSprite( PN_fwEffect , "FlayEffect" , 1130 , 0);
        this.MoveSprite(PN_fwEffect , 0 , 0 , 10);
    }
    if(fwFlame == 25) {
        if(!fwSwitch) this.DelSprite(PN_fwEffect);
        fwSwitch = !fwSwitch;
        return false;
    }
    return true; 
}
Game_Interpreter.prototype.Menu_FastTrb_FlyEffect_StartA = function () {
    fwFlame = 0;
    this.SetSprite( PN_fwChara , "FlayWitch" , 1130 , PL_winY - 100);
    EasingStr = "easeInQuad";
    this.MoveSprite(PN_fwChara , PL_winX - 48 , PL_winY , 10);
    StacWaitSprite(PN_fwChara , 10);
    EasingStr = "easeOutQuad";
    StacMoveSprite(PN_fwChara , PL_winX - 48 - 96 , PL_winY , 45);
    EasingStr = "";
}
Game_Interpreter.prototype.Menu_FastTrb_FlyEffect_StartB = function () {
    fwFlame = 0;
    this.SetSprite( PN_fwChara , "FlayWitch" , PL_winX - 48 - 96 , PL_winY);
    EasingStr = "easeInQuad";
    this.MoveSprite(PN_fwChara , 240 , PL_winY - 100 , 10);
    EasingStr = "";
    StacWaitSprite(PN_fwChara , 10);
    StacDelSprite(PN_fwChara , 10);
}
