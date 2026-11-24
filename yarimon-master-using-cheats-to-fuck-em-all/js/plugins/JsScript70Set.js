const mmp_PicPath = "pictures/Menu/Map/";
const PN_mpBase = PN_mL2Base + 1;
const PN_mpBtn = PN_mpBase + 1;
const PN_mpClose = PN_mpBtn + 7;
const PN_mpMap = PN_mpClose + 1;
const PN_mpTopH = PN_mpMap + 1;
const PN_mpSelecter = PN_mpTopH + 5;
let m_Map_Flame = 0;
let m_Map_Selecter;
Game_Interpreter.prototype.Menu_MapCheckDraw = function () {
    m_Map_Selecter = new OneSelecter(7);
    this.SetSprite(PN_mpBase , mmp_PicPath + "PN_mpBase" , BPs._x , BPs._y);
    this.Menu_MapCheckBtnDraw();
}
let m_Map_PicArr = [];
Game_Interpreter.prototype.Menu_MapCheckBtnDraw = function () {
    m_Map_PicArr = [];
    for (let i = 0; i <= 7 - 1; i++) {
        let _setX = BPs._x;
        if (i == m_Map_Selecter.selecterNo) _setX -= 10;
        this.SetSprite(PN_mpBtn + i , mmp_PicPath + "PN_mpBtn_" + i , _setX , BPs._y + 95 + (60 * i));
        m_Map_PicArr.push(PN_mpBtn + i);
    }
    let _cSetX = BPs._x;
    let _cSetY = BPs._y + 115 + (60 * m_Map_Selecter.selecterNo);
    this.SetSprite(PN_mpMap , mmp_PicPath + "PN_mpMap" , BPs._x , BPs._y);
    if (m_Map_Selecter.selecterNo == m_Map_Selecter.selectNoMax) {
        _cSetX -= 10;
        _cSetY = BPs._y + 570;
        this.DelSprite(PN_mpTopH);
    } else {
        this.SetSprite(PN_mpTopH , mmp_PicPath + "PN_mpTopH_" + m_Map_Selecter.selecterNo , BPs._x , BPs._y);
    }
    this.SetSprite(PN_mpClose , mmp_PicPath + "PN_mpCloseBtn" , _cSetX , BPs._y + 540);
    this.SetSpriteC(
        PN_mpSelecter , MenuPicPath + "PN_mSelecter", BPs._x + 250 , _cSetY
    );
}
Game_Interpreter.prototype.Menu_MapCheckUpdate = function (_mode) {
    m_Map_Flame++;
    if (m_Map_Flame == 1) this.Menu_MapCheckDraw(_mode);
    if (m_Map_Flame > 1) {
        let _okFlg = false; let _cancelFlg = false;
        let _ckNo = overPointerSpCkArr_GetNo(m_Map_PicArr);
        if (_ckNo != -1) {
            m_Map_Selecter.selecterNo = _ckNo;
        }
        if (overPointerSpCk(PN_mpClose)) {
            m_Map_Selecter.selecterNo = m_Map_Selecter.selectNoMax;
        }
        if (TouchInput.isTriggered()) {
            _okFlg = true;
        }
        if (Input.isTriggered('up')) {
            m_Map_Selecter.selectNo_Up();
        }
        if (Input.isTriggered('down')) {
            m_Map_Selecter.selectNo_Down();
        }
        if(m_Map_Selecter.IsSelecterMove) {
            SoundManager.playCursor();
            this.Menu_MapCheckBtnDraw();
        }
        if(Input.isTriggered('ok') || _okFlg) {
            if (m_Map_Selecter.selecterNo == m_Map_Selecter.selectNoMax) {
                _cancelFlg = true;
                SoundManager.playCancel();
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
