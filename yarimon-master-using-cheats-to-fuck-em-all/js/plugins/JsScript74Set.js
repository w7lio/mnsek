let PN_zmBase = PN_mL2Base + 1;
let PN_zmMonsPic = PN_zmBase + 1;
let PN_zmNameWin = PN_zmMonsPic + 2;
let PN_zmTxt = PN_zmNameWin + 1;
let PN_zmType = PN_zmTxt + 3;
let PN_zmSelWin = PN_zmType + 1
let PN_zmZTxt = PN_zmSelWin + 2;
let PN_zmZcngTxt = PN_zmZTxt + 11;
let PN_zmBtnU = PN_zmZcngTxt + 11;
let PN_zmBtnD = PN_zmBtnU + 1;
let PN_zmBtnL = PN_zmBtnD + 1;
let PN_zmBtnR = PN_zmBtnL + 1;
let PN_zmDxTxt = PN_zmBtnR + 1;
let PN_zmDZTxt = PN_zmDxTxt + 3;
let PN_zmDZPic = PN_zmDZTxt + 3;
let PN_zmDHint = PN_zmDZPic + 1;
let PN_zmDHintTxt = PN_zmDHint + 1;
let PN_zmDtlCmp = PN_zmDHintTxt + 1;
let PN_zmDBase = 601;
let PN_zmDtlBtn = PN_zmDBase - 1;
let PN_zmDTatie = PN_zmDBase + 1;
let PN_zmDHSnBs = PN_zmDTatie + 1;
let PN_zmDHSn = PN_zmDHSnBs + 6;
let PN_zmDHSnTxt = PN_zmDHSn + 6;
let PN_zmDHHntTxt  = PN_zmDHSnTxt + 6;
let PN_zmDBtn = PN_zmDHHntTxt  + 6;
let PN_zmDBtnTxt = PN_zmDBtn + 5;
let PN_zmDSelect = PN_zmDBtnTxt + 5;
let PN_zmYNBase = 640;
let PN_zmYNTxt = PN_zmYNBase + 1;
let PN_zmYNPic = PN_zmYNTxt + 1;
let PN_zmYNSelect = PN_zmYNPic + 1;
const SW_Z151表示 = 25; 
const SW_200匹図鑑ON = 583;
const VN_見つけた数 = 308;
const VN_ゲット数 = 309;
let ZukanMonFstZure = -1;
let ZukanMonFstSelectNo = 0;
let ZukanManFstZure = -1;
let ZukanManFstSelectNo = 0;
let mZukan_PicPath = MenuPicPath + "Zukan/";
let ZukanDrawData = null;
let Zukan_PicPath = Btl_Yarimon;
let Zukan_YarimanFlg = false;
let MaxZukanCount = 201;
let GetYarimonZukanMaxNo = function () {
    if ($gameSwitches.value(SW_200匹図鑑ON)) {
        for (let i = $gameSystem.yZukan.length; i <= $N_Yarimon_DB.mZukanDatas.length - 1; i++) {
            var monData = $N_Yarimon_DB.mZukanDatas[i];
            $gameSystem.yZukan.push(new SaveZukan(monData.id));
        }
        return MaxZukanCount - 1;
    }
    if (!$gameSwitches.value(SW_Z151表示)) return 151 - 1;
    return $gameSystem.yZukan.length - 1;
}
let GetLookAndGetYarimonCount = function () {
    var lookCnt = 0; var getCnt = 0;
    for (let i = 0; i <= GetYarimonZukanMaxNo(); i++) {
        var ckNo = i;
        if (ckNo > 150) break; 
        if ($gameSystem.yZukan[ckNo].lookFlg) lookCnt++;
        if ($gameSystem.yZukan[ckNo].getFlg) getCnt++;
    }
    $gameVariables.setValue(VN_見つけた数 ,lookCnt);
    $gameVariables.setValue(VN_ゲット数 ,getCnt);
}
const AddZukanNo = 29;
let GetLookAndGetYarimonCount_DLC2 = function () {
    var lookCnt = 0; var getCnt = 0;
    for (let i = 0; i <= GetYarimonZukanMaxNo(); i++) {
        var ckNo = i;
        if (ckNo > 150) ckNo += AddZukanNo; 
        if ($gameSystem.yZukan[ckNo].lookFlg) lookCnt++;
        if ($gameSystem.yZukan[ckNo].getFlg) getCnt++;
    }
    $gameVariables.setValue(VN_見つけた数 ,lookCnt);
    $gameVariables.setValue(VN_ゲット数 ,getCnt);
}
let GetYarimonZukanCount = function () {
    let getCnt = 0;
    for (let i = 0; i <= GetYarimonZukanMaxNo() - 1; i++) {
        var ckNo = i;
        if (ckNo > 150) ckNo += AddZukanNo;
        if ($gameSystem.yZukan[ckNo].getFlg) getCnt++;
    }
    return getCnt;
}
Game_Interpreter.prototype.Menu_ZukanDraw = function (ckMode) { 
    let addStr = "";
    if (Zukan_YarimanFlg) addStr = "_y";
    if (Zukan_YarimanFlg && ZukanManFstZure != -1) {
        ckMode.zureNo = ZukanManFstZure;
        ckMode.selecterNo = ZukanManFstSelectNo;
    }
    if (!Zukan_YarimanFlg && ZukanMonFstZure != -1) {
        ckMode.zureNo = ZukanMonFstZure;
        ckMode.selecterNo = ZukanMonFstSelectNo;
    }
    ZukanManFstZure = -1;
    let selectNo = ckMode.selecterNo + ckMode.zureNo;
    if (ckMode.zureNo > 150) selectNo += AddZukanNo;
    ZukanDrawData = GetZukanData_No(selectNo);
    var NameWinX = BPs._x + 570;
    this.SetSprite(PN_zmBase, mZukan_PicPath + "PN_zmBase" + addStr, BPs._x, BPs._y);
    this.SetSpriteC(PN_zmNameWin, mZukan_PicPath + "PN_zmNameWin" + addStr, NameWinX, BPs._y + 299);
    this.SpriteStrC(PN_zmTxt + 0, SCol.Blk0 + ZukanDrawData.name, 26, NameWinX, BPs._y + 299);
    let lookCnt = 0;
    let getCnt = 0;
    if (Zukan_YarimanFlg) {
        let copyArr = $gameSystem.mZukan.slice();
        $gameSystem.mZukan = [];
        for (let i = 0; i < $N_Yariman_DB.length; i++) {
            for (let j = 0; j < copyArr.length; j++) {
                if ($N_Yariman_DB[i].id == copyArr[j].id) $gameSystem.mZukan.push(copyArr[j]);
            }
        }
        for (let i = 0; i <= $gameSystem.mZukan.length - 1; i++) {
            if ($gameSystem.mZukan[i].lookFlg) lookCnt++;
            if ($gameSystem.mZukan[i].getFlg) getCnt++;
        }
    } else {
        var maxZukanNo = GetYarimonZukanMaxNo();
        for (let i = 0; i <= maxZukanNo; i++) {
            let ckNo = i;
            if (ckNo > 150) {
                ckNo += AddZukanNo; 
            }
            if ($gameSystem.yZukan[ckNo].lookFlg) lookCnt++;
            if ($gameSystem.yZukan[ckNo].getFlg) getCnt++;
        }
    }
    this.SpriteStr(PN_zmTxt + 1, SCol.Blk0 + lookCnt, 28, BPs._x + 408, BPs._y + 28); 
    this.SpriteStr(PN_zmTxt + 2, SCol.Blk0 + getCnt, 28, BPs._x + 408, BPs._y + 25 + 34); 
    var _MonX = BPs._x + 422;
    var _MonY = BPs._y + 127;
    if (Zukan_YarimanFlg) {
        Zukan_PicPath = "pictures/H_Scene/_DataBase/Zukan/Bustup/";
        this.SetSprite(PN_zmMonsPic, Zukan_PicPath + ZukanDrawData.zukanPicPath, _MonX, BPs._y + 21);
    } else {
        Zukan_PicPath = Btl_Yarimon;
        this.SetSprite(PN_zmMonsPic, Zukan_PicPath + ZukanDrawData.picPath, _MonX, BPs._y + 21);
        let setPicPath = "PN_zmType" + GetTypeNo(ZukanDrawData.state.type);
        this.SetSprite(PN_zmType, mZukan_PicPath + setPicPath, _MonX + 240, BPs._y + 254);
    }
    this.SetSprite(PN_zmSelWin, mZukan_PicPath + "PN_zmSelWin" + addStr, BPs._x - 18, BPs._y + 125 + (ckMode.selecterNo * 44));
    for (let i = 0; i <= 10 - 1; i++) {
        var ckZukanNo = ckMode.zureNo + i;
        this.SpriteStr(PN_zmZTxt + i, GetZukanTxt(ckZukanNo), 26, BPs._x + 25, _MonY + (i * 44), GetZukanTxtOpi(ckZukanNo));
    }
    D_Text_Cng_font = "";
    this.Menu_ZukanBtnDraw(ckMode);
    this.Menu_ZukanTextDraw(ZukanDrawData , ZukanDrawData.id);
}
let GetZukanTxt = function (No) {
    let valueNo = No;
    return SCol.Blk0 + "No" + zeroPadding(valueNo, 3) + "　" + GetZukanName_No(No);
}
let GetZukanTxtOpi = function (No) {
    if (Zukan_YarimanFlg) {
        if (!$gameSystem.mZukan[No].getFlg) return 150;
    } else {
        if (No > 150) No += AddZukanNo;
        if (!$gameSystem.yZukan[No].getFlg) return 150;
    }
    return 255;
}
Game_Interpreter.prototype.Menu_ZukanBtnDraw = function (ckMode) {
    let addStr = "";
    if (Zukan_YarimanFlg) addStr = "_y";
    let firstViewNo = ckMode.zureNo;
    var _posX = BPs._x + 122;
    var _posY = BPs._y + 86;
    if (firstViewNo > 0) {
        this.SetSprite(PN_zmBtnU, mZukan_PicPath + "PN_zmBtnU" + addStr, _posX, _posY);
    } else {
        this.DelSprite(PN_zmBtnU);
    }
    if (firstViewNo > 4) {
        this.SetSprite(PN_zmBtnL, mZukan_PicPath + "PN_zmBtnL" + addStr, _posX + 120, _posY - 8);
    } else {
        this.DelSprite(PN_zmBtnL);
    }
    let maxCnt = GetYarimonZukanMaxNo();
    if (Zukan_YarimanFlg) maxCnt = $gameSystem.mZukan.length - 1;
    if (firstViewNo + ckMode.selectNoMax < maxCnt) {
        this.SetSprite(PN_zmBtnD, mZukan_PicPath + "PN_zmBtnD" + addStr, _posX, _posY + 490);
    } else {
        this.DelSprite(PN_zmBtnD);
    }
    if (firstViewNo + ckMode.selectNoMax < maxCnt) {
        this.SetSprite(PN_zmBtnR, mZukan_PicPath + "PN_zmBtnR" + addStr, _posX + 120, _posY + 478);
    } else {
        this.DelSprite(PN_zmBtnR);
    }
}
Game_Interpreter.prototype.Menu_ZukanUpdate = function (ckMode) {
    if (ckMode.flame == 1) {
        this.Menu_ZukanDraw(ckMode); 
    }
    switch (ckMode.modeName) {
        case Menu_Zukan.Select:
            this.Menu_Zukan_SelectUpdate(ckMode);
            break;
        case Menu_Zukan.Detail:
            this.Menu_Zukan_DetailUpdate(ckMode.mode);
            break;
    }
};
let ZukanMoveType = {
    Up: 1,
    Down: 2,
    Left: 3,
    Right: 4
};
let _ZukanCngTxtArr = [];
Game_Interpreter.prototype.Menu_Zukan_SelectUpdate = function (ckMode) {
    let maxCnt = GetYarimonZukanMaxNo();
    if (Zukan_YarimanFlg) {
        maxCnt = $gameSystem.mZukan.length - 1;
    }
    let firstViewNo = ckMode.zureNo;
    let moveType = -1;
    let ckPicArr = [];
    let zukanOkFlg = false;
    for (let i = 0; i <= 10 - 1; i++) ckPicArr.push(PN_zmZTxt + i);
    let wheelSkipFlg = false;
    let upOkFlg = false;
    let downOkFlg = false;
    let rightOkFlg = false;
    let leftOkFlg = false;
    let scroolZureFlg = false;
    if (TouchInput.wheelY < 0) upOkFlg = scroolZureFlg = true;
    if (TouchInput.wheelY > 0) downOkFlg = scroolZureFlg = true;
    wheelSkipFlg = upOkFlg || downOkFlg;
    let ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if (ckPicNo != -1 && !wheelSkipFlg) {
        if (ckMode.selecterNo != ckPicNo) {
            SoundManager.playCursor();
            this.Menu_ZukanDraw(ckMode);
        }
        ckMode.selecterNo = ckPicNo;
        zukanOkFlg = TouchInput.isTriggered();
    }
    ckPicNo = overPointerSpCkArr_GetNo(_ZukanCngTxtArr);
    if (ckPicNo != -1 && !wheelSkipFlg) {
        if (ckMode.selecterNo != ckPicNo) { 
            SoundManager.playCursor();
        }
        ckMode.selecterNo = ckPicNo;
        zukanOkFlg = TouchInput.isTriggered();
    }
    this.SpriteCngColor(PN_zmBtnU);
    if (overPointerSpCk(PN_zmBtnU)) {
        this.SpriteCngColor(PN_zmBtnU, [120, 120, 120, 0]);
        upOkFlg = TouchInput.isTriggered();
    }
    this.SpriteCngColor(PN_zmBtnD);
    if (overPointerSpCk(PN_zmBtnD)) {
        this.SpriteCngColor(PN_zmBtnD, [120, 120, 120, 0]);
        downOkFlg = TouchInput.isTriggered();
    }
    this.SpriteCngColor(PN_zmBtnR);
    if (overPointerSpCk(PN_zmBtnR)) {
        this.SpriteCngColor(PN_zmBtnR, [120, 120, 120, 0]);
        rightOkFlg = TouchInput.isTriggered();
    }
    this.SpriteCngColor(PN_zmBtnL);
    if (overPointerSpCk(PN_zmBtnL)) {
        this.SpriteCngColor(PN_zmBtnL, [120, 120, 120, 0]);
        leftOkFlg = TouchInput.isTriggered();
    }
    this.SpriteCngColor(PN_zmDtlBtn);
    if (overPointerSpCk(PN_zmDtlBtn)) {
        zukanOkFlg = TouchInput.isTriggered();
        this.SpriteCngColor(PN_zmDtlBtn, [120, 120, 120, 0]);
    }
    if ((Input.isTriggered('up') || upOkFlg ||
        (upDownFlame > 25 && upDownFlame % 5 == 0))) {
        var ZureScroolY = function () {
            if (ckMode.zureNo <= 0) {
            } else {
                ckMode.zureNo--;
                moveType = ZukanMoveType.Down;
                SoundManager.playCursor();
            }
        }
        if (scroolZureFlg) {
            ZureScroolY();
        } else {
            if (ckMode.selecterNo == 0) {
                ZureScroolY();
            } else {
                ckMode.selectNo_Up();
                moveType = ZukanMoveType.Down;
                SoundManager.playCursor();
            }
        }
    }
    if (Input.isTriggered('down') || downOkFlg || (downDownFlame > 25 && downDownFlame % 5 == 0)) {
        var ZureScroolY = function () {
            if (ckMode.zureNo + ckMode.selectNoMax >= maxCnt) {
            } else {
                ckMode.zureNo++;
                moveType = ZukanMoveType.Up;
                SoundManager.playCursor();
            }
        }
        if (scroolZureFlg) {
            ZureScroolY();
        } else {
            if (ckMode.selecterNo == ckMode.selectNoMax) {
                ZureScroolY();
            } else {
                ckMode.selectNo_Down();
                moveType = ZukanMoveType.Up;
                SoundManager.playCursor();
            }
        }
    }
    if ((Input.isTriggered('left') || leftOkFlg ||
        (leftDownFlame > 25 && leftDownFlame % 8 == 0)) && firstViewNo > 0) {
        moveType = ZukanMoveType.Left;
        this.Menu_ZukanBtnDraw(ckMode);
        SoundManager.playCursor();
    }
    if (Input.isTriggered('right') || rightOkFlg ||
        (rightDownFlame > 25 && rightDownFlame % 8 == 0)) {
        moveType = ZukanMoveType.Right;
        this.Menu_ZukanBtnDraw(ckMode);
        SoundManager.playCursor();
    }
    if (Input.isTriggered('ok') || zukanOkFlg) {
        if (Zukan_YarimanFlg) {
            if (!$gameSystem.mZukan[ckMode.selecterNo + ckMode.zureNo].lookFlg) return;
        } else {
            return;
        }
        ckMode.ModeCng(Menu_Zukan.Detail);
        ckMode.mode.selNo = ckMode.selecterNo + ckMode.zureNo + 1;
        ckMode.mode.selYarimon = $N_Yarimon_DB.mZukanDatas[ckMode.selecterNo + ckMode.zureNo];
        SoundManager.playOk();
    }
    if (ckMode.IsSelecterMove) {
        this.Menu_Zukan_Select_SelecterMove(ckMode, moveType);
        moveType = -1;
        this.Menu_ZukanBtnDraw(ckMode);
    }
    if (moveType != -1) {
        this.Menu_Zukan_SelectTextMove(ckMode, moveType);
        this.Menu_ZukanBtnDraw(ckMode);
        this.DelSpriteSpan(PN_zmZTxt, PN_zmZTxt + 10);
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        if (!Zukan_YarimanFlg) {
            if (ckMode.zureNo + ckMode.selectNoMax >= maxCnt) {
                ckMode.zureNo = maxCnt - ckMode.selectNoMax - 1;
                ckMode.selecterNo = ckMode.selectNoMax;
            }
            ZukanMonFstZure = ckMode.zureNo;
            ZukanMonFstSelectNo = ckMode.selecterNo;
        }
        else {
            if (ckMode.zureNo + ckMode.selectNoMax >= maxCnt) {
                ckMode.zureNo = maxCnt - ckMode.selectNoMax - 1;
                ckMode.selecterNo = ckMode.selectNoMax;
            }
            ZukanManFstZure = ckMode.zureNo;
            ZukanManFstSelectNo = ckMode.selecterNo;
        }
        ckMode.Reset();
        this.Layer2_DelSprite();
        this.DelSprite(PN_zmDtlBtn);  
        menuBox.ModeCng(MenuBox.Select); 
        SoundManager.playCancel();
    }
};
function zeroPadding(num, length) {
    num += 1;
    return ('000' + num).slice(-length);
}
function GetZukanName_No(No) {
    if (Zukan_YarimanFlg) {
        if (!$gameSystem.mZukan[No].lookFlg) return "？？？？？？";
        let rtnName = $N_Yariman_DB[No].name;
        while (rtnName.length < 6) rtnName += "　";
        return rtnName;
    } else {
        if (No > 150) No += AddZukanNo;
        if (!$gameSystem.yZukan[No].lookFlg) return "？？？？？？";
        return $N_Yarimon_DB.mZukanDatas[No].name;
    }
}
function GetZukanData_Id(Id) {
    if (Id > 150) Id += AddZukanNo;
    return GetZukanData_No(Id);
}
function GetZukanData_No(No) {
    if (Zukan_YarimanFlg) {
        let rtnData = new ZukanData();
        if ($gameSystem.mZukan[No].lookFlg) {
            rtnData = new ZukanData($N_Yariman_DB[No].zukanPicPath);
            rtnData.name = $N_Yariman_DB[No].name;
            rtnData.cProfile.hint = "look";
        }
        else
        {
            rtnData.cProfile.hint = $N_Yariman_DB[No].cProfile.hint;
        }
        if ($gameSystem.mZukan[No].getFlg) {
            rtnData = $N_Yariman_DB[No];
            rtnData.cProfile.hint = "look";
        }
        rtnData.picPath = rtnData.zukanPicPath;
        return rtnData;
    }
    else
    {
        //if (No > 150) No += AddZukanNo;
        let rtnData = new ZukanData();
        if ($gameSystem.yZukan[No].lookFlg) {
            rtnData = new ZukanData($N_Yarimon_DB.mZukanDatas[No].picPath);
            rtnData.name = $N_Yarimon_DB.mZukanDatas[No].name;
        }
        if ($gameSystem.yZukan[No].getFlg) rtnData = $N_Yarimon_DB.mZukanDatas[No];
        rtnData.id = $N_Yarimon_DB.mZukanDatas[No].id;
        return rtnData;
    }
}
class ZukanData {
    constructor(_PicName) {
        _PicName = typeof _PicName !== 'undefined' ? _PicName : "mon0";
        this.name = "？？？？？？";
        this.picPath = _PicName;
        this.zukanPicPath = _PicName;
        this.state = new ZukanStateData();
        this.ecology = new ZukanEcologyData();
        this.cProfile = new ZukanProfileData();
        this.jobName = "？？？？？？？？";
        this.setumei = "";
        this.hint = "";
    }
}
class ZukanStateData {
    constructor() {
        this.type = "";
    }
}
class ZukanEcologyData {
    constructor() {
        this.monName = "？？？？";
        this.takasa = "???";
        this.omosa = "???";
        this.setu = "";
    }
}
class ZukanProfileData {
    constructor() {
        this.bust = "???";
        this.west = "???";
        this.hip = "???";
        this.sintyo = "???";
        this.taiju = "???";
        this.setu = "???";
        this.setu2 = "???";
        this.setu3 = "???";
        this.hint = "";
    }
}
let _MonsMoveFlame = 5;
Game_Interpreter.prototype.Menu_Zukan_SelectTextMove = function (ckMode, moveType) {
    let firstViewNo = ckMode.zureNo;
    var _MonTextX = BPs._x + 25;
    var _MonTextY = BPs._y + 127;
    var _MonX = BPs._x + 422;
    let maxCnt = GetYarimonZukanMaxNo();
    if (Zukan_YarimanFlg) {
        maxCnt = $gameSystem.mZukan.length - 1;
    }
    this.SetSprite(PN_zmMonsPic + 0, Zukan_PicPath + ZukanDrawData.picPath, _MonX, BPs._y + 21);
    ZukanDrawData = GetZukanData_Id(ckMode.selecterNo + firstViewNo);
    switch (moveType) {
        case ZukanMoveType.Down: 
            _ZukanCngTxtArr = [];
            this.SpriteStr(PN_zmZcngTxt + 0, GetZukanTxt(firstViewNo), 26, _MonTextX, _MonTextY + (-1 * 44), 0);
            this.MoveSprite(PN_zmZcngTxt + 0, _MonTextX, _MonTextY, 5, GetZukanTxtOpi(firstViewNo));
            _ZukanCngTxtArr.push(PN_zmZcngTxt + 0);
            for (let i = 0; i <= 10 - 1; i++) {
                if (i < 10 - 1) _ZukanCngTxtArr.push(PN_zmZcngTxt + i + 1);
                this.SpriteStr(PN_zmZcngTxt + i + 1, GetZukanTxt(firstViewNo + i + 1), 26, _MonTextX, _MonTextY + (i * 44));
                let _opi = GetZukanTxtOpi(firstViewNo + i + 1);
                if (i == 9) _opi = 0;
                this.MoveSprite(PN_zmZcngTxt + i + 1, _MonTextX, _MonTextY + ((i + 1) * 44), 5, _opi);
            }
            this.DelSpriteSpan(PN_zmZTxt, PN_zmZTxt + 10);
            this.MoveSprite(PN_zmMonsPic, _MonX, BPs._y + 21 + 50, _MonsMoveFlame, 0);
            this.SetSprite(PN_zmMonsPic + 1, Zukan_PicPath + ZukanDrawData.picPath, _MonX, BPs._y + 21 - 50);
            this.MoveSprite(PN_zmMonsPic + 1, _MonX, BPs._y + 21, _MonsMoveFlame, 255);
            break;
        case ZukanMoveType.Up: 
            _ZukanCngTxtArr = [];
            this.SpriteStr(PN_zmZcngTxt + 0, GetZukanTxt(firstViewNo + 9), 26, _MonTextX, _MonTextY + (10 * 44), 0);
            this.MoveSprite(PN_zmZcngTxt + 0, _MonTextX, _MonTextY + (9 * 44), 5, GetZukanTxtOpi(firstViewNo + 9));
            for (let i = 0; i <= 10 - 1; i++) {
                if (i > 0) _ZukanCngTxtArr.push(PN_zmZcngTxt + i + 1);
                this.SpriteStr(PN_zmZcngTxt + i + 1, GetZukanTxt(firstViewNo + i - 1),
                    26, _MonTextX, _MonTextY + (i * 44));
                let _opi = GetZukanTxtOpi(firstViewNo + i - 1);
                if (i == 0) _opi = 0;
                this.MoveSprite(PN_zmZcngTxt + i + 1, _MonTextX, _MonTextY + ((i - 1) * 44), 5, _opi);
            }
            _ZukanCngTxtArr.push(PN_zmZcngTxt + 0)
            this.DelSpriteSpan(PN_zmZTxt, PN_zmZTxt + 10);
            this.MoveSprite(PN_zmMonsPic, _MonX, BPs._y + 21 - 50, _MonsMoveFlame, 0);
            this.SetSprite(PN_zmMonsPic + 1, Zukan_PicPath + ZukanDrawData.picPath, _MonX, BPs._y + 21 + 50);
            this.MoveSprite(PN_zmMonsPic + 1, _MonX, BPs._y + 21, _MonsMoveFlame, 255);
            break;
        case ZukanMoveType.Left: 
            _ZukanCngTxtArr = [];
            ckMode.zureNo -= 10;
            if (ckMode.zureNo < 0) ckMode.zureNo = 0;
            this.DelSpriteSpan(PN_zmZTxt, PN_zmZcngTxt + 11);
            for (let i = 0; i <= 10 - 1; i++) {
                this.SpriteStr(PN_zmZTxt + i, GetZukanTxt(firstViewNo + i), 26, _MonTextX, _MonTextY + (i * 44), GetZukanTxtOpi(firstViewNo + i));
                this.MoveSprite(PN_zmZTxt + i, _MonTextX, _MonTextY + (i * 44) - 50, 5, 0);
            }
            this.DelSpriteSpan(PN_zmZcngTxt, PN_zmZcngTxt + 5);
            for (let i = 0; i <= 10 - 1; i++) {
                _ZukanCngTxtArr.push(PN_zmZcngTxt + i)
                let _DrawFastNo = firstViewNo - 10;
                if (_DrawFastNo < 0) _DrawFastNo = 0;
                this.SpriteStr(PN_zmZcngTxt + i, GetZukanTxt(_DrawFastNo + i), 26, _MonTextX, _MonTextY + (i * 44) - 50, 0);
                this.MoveSprite(PN_zmZcngTxt + i, _MonTextX, _MonTextY + (i * 44), 5, GetZukanTxtOpi(_DrawFastNo + i));
            }
            ZukanDrawData = GetZukanData_Id(ckMode.selecterNo + ckMode.zureNo);
            this.MoveSprite(PN_zmMonsPic, _MonX - 50, BPs._y + 21, _MonsMoveFlame, 0);
            this.SetSprite(PN_zmMonsPic + 1, Zukan_PicPath + ZukanDrawData.picPath, _MonX + 50, BPs._y + 21);
            this.MoveSprite(PN_zmMonsPic + 1, _MonX, BPs._y + 21, _MonsMoveFlame, 255);
            break;
        case ZukanMoveType.Right: 
            _ZukanCngTxtArr = [];
            ckMode.zureNo += 10;
            if (maxCnt <= ckMode.zureNo + ckMode.selectNoMax) {
                ckMode.zureNo = maxCnt - ckMode.selectNoMax;
                firstViewNo = ckMode.zureNo - 10;
            }
            this.DelSpriteSpan(PN_zmZTxt, PN_zmZcngTxt + 11);
            for (let i = 0; i <= 10 - 1; i++) {
                this.SpriteStr(PN_zmZTxt + i, GetZukanTxt(firstViewNo + i), 26, _MonTextX, _MonTextY + (i * 44), GetZukanTxtOpi(firstViewNo + i));
                this.MoveSprite(PN_zmZTxt + i, _MonTextX, _MonTextY + (i * 44) + 50, 5, 0);
            }
            this.DelSpriteSpan(PN_zmZcngTxt, PN_zmZcngTxt + 10);
            for (let i = 0; i <= 10 - 1; i++) {
                _ZukanCngTxtArr.push(PN_zmZcngTxt + i);
                this.SpriteStr(PN_zmZcngTxt + i, GetZukanTxt(firstViewNo + 10 + i), 26, _MonTextX, _MonTextY + (i * 44) + 50, 0);
                this.MoveSprite(PN_zmZcngTxt + i, _MonTextX, _MonTextY + (i * 44), 5, GetZukanTxtOpi(firstViewNo + 10 + i));
            }
            ZukanDrawData = GetZukanData_Id(ckMode.selecterNo + ckMode.zureNo);
            this.MoveSprite(PN_zmMonsPic, _MonX + 50, BPs._y + 21, _MonsMoveFlame, 0);
            this.SetSprite(PN_zmMonsPic + 1, Zukan_PicPath + ZukanDrawData.picPath, _MonX - 50, BPs._y + 21);
            this.MoveSprite(PN_zmMonsPic + 1, _MonX, BPs._y + 21, _MonsMoveFlame, 255);
            break;
    }
    var yId = $N_Yarimon_DB.mZukanDatas[ckMode.selecterNo + ckMode.zureNo].id;
    this.Menu_ZukanTextDraw(ZukanDrawData , ZukanDrawData.id);
    var NameWinX = BPs._x + 570;
    this.SpriteStrC(PN_zmTxt + 0, SCol.Blk0 + ZukanDrawData.name, 26, NameWinX - 10, BPs._y + 299);
    this.MoveSprite(PN_zmTxt + 0, NameWinX, BPs._y + 299, 5);
    if (!Zukan_YarimanFlg) {
        let setPicPath = "PN_zmType" + GetTypeNo(ZukanDrawData.state.type);
        this.SetSprite(PN_zmType, mZukan_PicPath + setPicPath, NameWinX + 90 - 10, BPs._y + 254);
        this.MoveSprite(PN_zmType, NameWinX + 90, BPs._y + 254, 5);
    }
    D_Text_Cng_font = "";
}
Game_Interpreter.prototype.Menu_ZukanTextDraw = function (zukanData , yId) {
    yId = typeof yId !== 'undefined' ? yId : -1;
    this.DelSpriteSpan(PN_zmDxTxt + 0, PN_zmDZPic);
    if (!Zukan_YarimanFlg) {
        if (zukanData.ecology.setu == "" && yId != -1) {
            let yMapIds = [];
            $N_Yarimon_DB.yaseiMapSettings.forEach( yaseiData => {
                let addFlg = false;
                yaseiData.reasonDatas.forEach( reasonData => {
                    reasonData.yarimonDatas.forEach( yarimonData => {
                        if (yId == yarimonData.id) {
                            addFlg = true;
                            return;
                        }
                    });
                    if (addFlg) return;
                });
                if (addFlg) yMapIds.push(yaseiData.mapId)
            });
            let setuAddCnt = 0;
            yMapIds.forEach( mapId => {
                $dataMapInfos.forEach( mapInfoData => {
                    if (mapInfoData != null) {
                        if (mapInfoData.id == mapId) {
                            if (setuAddCnt == 2) zukanData.ecology.setu += "\n";
                            if (setuAddCnt == 4) {
                                zukanData.ecology.setu += NLngStrGet("　など");
                                return;
                            }
                            let mapName = "・" + NLngStrGet(mapInfoData.name.split('::')[0]);
                            if (mapId >= 210) mapName += "(DLC2)"
                            zukanData.ecology.setu += mapName;
                            setuAddCnt++;
                        }
                    }
                });
            });
            if (zukanData.ecology.setu == "") zukanData.ecology.setu = NLngStrGet("◆ 未出現個体 ◆");
            zukanData.ecology.setu = NLngStrGet("【出現場所】") + "\n" + zukanData.ecology.setu;
        }
        if (LngMode == "en") {
            this.SpriteStr(PN_zmDxTxt + 0, SCol.Blk0 + zukanData.ecology.setu, 16,
                BPs._x + 355, BPs._y + 385);
        } else {
            this.SpriteStr(PN_zmDxTxt + 0, SCol.Blk0 + zukanData.ecology.setu, 20,
                BPs._x + 370, BPs._y + 385);
        }
        this.SpriteStr(PN_zmDZTxt + 0, SCol.Blk0 + zukanData.ecology.takasa + "m", 20,
            BPs._x + 475, BPs._y + 495);
        this.SpriteStr(PN_zmDZTxt + 1, SCol.Blk0 + zukanData.ecology.omosa + "kg", 20,
            BPs._x + 475, BPs._y + 495 + 40);
    } else {
        if (zukanData.cProfile.hint == "look") {
            this.MoveSprite(PN_zmDHint, true, true, 5, 0);
            this.MoveSprite(PN_zmDHintTxt, true, true, 5, 0);
            if (LngMode == "en") {
                this.SpriteStr(PN_zmDxTxt + 0, SCol.Blk0 + zukanData.cProfile.setu, 16,
                    BPs._x + 355, BPs._y + 385);
            } else {
                this.SpriteStr(PN_zmDxTxt + 0, SCol.Blk0 + zukanData.cProfile.setu, 20,
                    BPs._x + 370, BPs._y + 385);
            }
            this.SpriteStr(PN_zmDZTxt + 0, SCol.Blk0 + zukanData.cProfile.sintyo + "cm", 20,
                BPs._x + 455, BPs._y + 480);
            this.SpriteStr(PN_zmDZTxt + 1, SCol.Blk0 + zukanData.cProfile.taiju + "kg", 20,
                BPs._x + 455, BPs._y + 480 + 32);
            this.SpriteStr(PN_zmDZTxt + 2,
                SCol.Blk0 + zukanData.cProfile.bust + "/" + zukanData.cProfile.west + "/" + zukanData.cProfile.hip, 20,
                BPs._x + 455, BPs._y + 480 + 32 * 2);
            let ckMZukanData = null;
            $gameSystem.mZukan.forEach(ckZukan => {
                if (ckZukan.id == zukanData.id) {
                    ckMZukanData = ckZukan;
                }
            });
            if (ckMZukanData != null) {
                for (let i = 0; i <= ckMZukanData.hSceneFlg.length - 1; i++) {
                    if (ckMZukanData.hSceneFlg[i]) {
                        this.SetSpriteC(PN_zmDZPic, HsceneHscenePicPath + zukanData.hScene[i].picPath,
                            BPs._x + 710, BPs._y + 560
                        );
                        this.AngleSprite(PN_zmDZPic, -7);
                        this.SetSprite(PN_zmDtlBtn, mZukan_DtlPicPath + "PN_zmDtlBtn", BPs._x + 370, BPs._y + 571);
                        break;
                    }
                }
                if (ckMZukanData.hSceneFlg.every(value => value === true)) {
                    this.SetSprite(PN_zmDtlCmp, mZukan_DtlPicPath + "PN_zmDtlCmp", 906, 565);
                } else {
                    this.DelSprite(PN_zmDtlCmp);
                }
            }
        } else {
            this.SetSpriteFIn(PN_zmDHint, mZukan_PicPath + "PN_zmHint", BPs._x, BPs._y, 0, 0, 5);
            this.SpriteStr(PN_zmDHintTxt, zukanData.cProfile.hint, 20, 698, 225, 0);
            this.MoveSprite(PN_zmDHintTxt, true, true, 5);
            this.DelSprite(PN_zmDtlBtn);
            this.DelSprite(PN_zmDtlCmp);
        }
    }
}
Game_Interpreter.prototype.Menu_Zukan_Select_SelecterMove = function (ckMode, moveType) {
    var _MonX = BPs._x + 422;
    this.MoveSprite(PN_zmSelWin, BPs._x - 18, BPs._y + 125 + (ckMode.selecterNo * 44), 2);
    var yId = $N_Yarimon_DB.mZukanDatas[ckMode.selecterNo + ckMode.zureNo].id;
    ZukanDrawData = GetZukanData_Id(ckMode.selecterNo + ckMode.zureNo);
    this.Menu_ZukanTextDraw(ZukanDrawData , ZukanDrawData.id);
    switch (moveType) {
        case ZukanMoveType.Down:
            this.MoveSprite(PN_zmMonsPic, _MonX, BPs._y + 21 + 50, _MonsMoveFlame, 0);
            this.SetSprite(PN_zmMonsPic + 1, Zukan_PicPath + ZukanDrawData.picPath, _MonX, BPs._y + 21 - 50);
            this.MoveSprite(PN_zmMonsPic + 1, _MonX, BPs._y + 21, _MonsMoveFlame, 255);
            break;
        case ZukanMoveType.Up:
            this.MoveSprite(PN_zmMonsPic, _MonX, BPs._y + 21 - 50, _MonsMoveFlame, 0);
            this.SetSprite(PN_zmMonsPic + 1, Zukan_PicPath + ZukanDrawData.picPath, _MonX, BPs._y + 21 + 50);
            this.MoveSprite(PN_zmMonsPic + 1, _MonX, BPs._y + 21, _MonsMoveFlame, 255);
            break;
        default :
            this.MoveSprite(PN_zmMonsPic, _MonX, BPs._y + 21, _MonsMoveFlame, 0);
            this.SetSprite(PN_zmMonsPic + 1, Zukan_PicPath + ZukanDrawData.picPath, _MonX, BPs._y + 21);
            this.MoveSprite(PN_zmMonsPic + 1, _MonX, BPs._y + 21, _MonsMoveFlame, 255);
            break;
    }
    var NameWinX = BPs._x + 570;
    this.SpriteStrC(PN_zmTxt + 0, SCol.Blk0 + ZukanDrawData.name, 26, NameWinX - 10, BPs._y + 299);
    this.MoveSprite(PN_zmTxt + 0, NameWinX, BPs._y + 299, 5);
    if (!Zukan_YarimanFlg) {
        let _setPic = "PN_zmType" + GetTypeNo(ZukanDrawData.state.type);
        this.SetSprite(PN_zmType, mZukan_PicPath + _setPic, NameWinX + 90 - 10, BPs._y + 254);
        this.MoveSprite(PN_zmType, NameWinX + 90, BPs._y + 254, 5);
    }
    D_Text_Cng_font = "";
}
let mZukan_DtlPicPath = mZukan_PicPath + "Detail/";
let mZukan_BtlTatiePath = "pictures/H_Scene/_DataBase/Battle/BattleTatie/";
let mZukan_PicArr = [];
let mZukan_TPicArr = [];
let viewGetZukanData;
let viewZukanData;
let viewDetailID = 0;
let TatieSelectMode = false;
let TatieSelectNo = 0;
Game_Interpreter.prototype.Menu_Zukan_DetailDraw = function (ckMode) {
    var id = ckMode.selNo;
    mZukan_PicArr = [];
    viewDetailID = id;  
    ckMode.selectNoMaxX = 1;
    ckMode.selectNoMaxY = 2;
    ckMode.selecterLoopFlgX = false;
    ckMode.selecterNoX = 0;
    ckMode.selecterNoY = 0;
    ckMode.selectGrid_Reset(false);
    TatieSelectMode = false;
    TatieSelectNo = 0;
    let zukanData = GetZukanData_No(id - 1);
    viewGetZukanData = zukanData;
    this.SetSprite(PN_zmDBase, mZukan_DtlPicPath + "PN_mBack", 0, 0);
    viewZukanData = $gameSystem.mZukan[id - 1];
    for (let i = 0; i <= viewZukanData.hSceneFlg.length - 1; i++) {
        mZukan_PicArr.push(PN_zmDHSn + i);
        var setPicName = "lock";
        var setText = NLngStrGet("未発見");
        var setHint = "★" + viewGetZukanData.hScene[i].hint;
        if (viewGetZukanData.hScene[i].dlcNo > 0) {
            setPicName += viewGetZukanData.hScene[i].dlcNo;
        }
        if (viewZukanData.hSceneFlg[i]) {
            setPicName = viewGetZukanData.hScene[i].picPath;
            setText = viewGetZukanData.hScene[i].desc;
            setHint = "";
        }
        ckMode.selectGrid[Math.floor(i / 2)][i % 2] = true;
        var zureX = (i % 2) * 305;
        var zureY = Math.floor(i / 2) * 200;
        this.SetSprite(PN_zmDHSnBs + i, mZukan_DtlPicPath + "PN_mNameWin",
            650 + zureX, 125 + zureY);
        this.SetSprite(PN_zmDHSn + i, HsceneHscenePicPath + setPicName,
            703 + zureX, 155 + zureY);
        this.SpriteStrC(PN_zmDHSnTxt + i, setText, 20, 807 + zureX, 139 + zureY);
        this.SpriteStrC(PN_zmDHHntTxt + i, setHint, 16, 810 + zureX, 139 + zureY + 168);
    }
    this.MenuZukanTatieDetailBtnDraw(); 
    D_Text_Cng_font = ""; 
}
Game_Interpreter.prototype.MenuZukanTatieDetailBtnDraw = function () {
    mZukan_TPicArr = [];
    let zukanData = GetZukanData_No(viewDetailID - 1);
    var tViewFlg = false;
    this.SetSprite(PN_zmDSelect, mZukan_DtlPicPath + "PN_mSelectTatieWin", 522, 156 + TatieSelectNo * 50);
    for (let i = 0; i <= $gameSystem.mZukan[viewDetailID - 1].hTatieFlg.length - 1; i++) {
        mZukan_TPicArr.push(PN_zmDBtn + i);
        this.SetSpriteC(PN_zmDBtn + i, mZukan_DtlPicPath + "PN_zmDBtn",
            605, 180 + 50 * i);
        if ($gameSystem.mZukan[viewDetailID - 1].hTatieFlg[i]) {
            this.SpriteStrC(PN_zmDBtnTxt + i, SCol.Blk0 + zukanData.tatiePic.tatieDatas[i].name, 20,
                605, 180 + 50 * i);
        } else {
            this.SpriteStrC(PN_zmDBtnTxt + i, SCol.Blk0 + NLngStrGet("未開放"), 20,
                605, 180 + 50 * i);
        }
        if (TatieSelectNo != i)
            this.MoveSprite(PN_zmDBtn + i, true, true, 1, 150);
        else
            tViewFlg = $gameSystem.mZukan[viewDetailID - 1].hTatieFlg[i];
    }
    if (tViewFlg) {
        var picPath = zukanData.tatiePic.tatieDatas[TatieSelectNo].picPath;
        this.SetSpriteC(PN_zmDTatie, mZukan_BtlTatiePath + picPath, 370, 400);
    }
}
Game_Interpreter.prototype.Menu_Zukan_DetailUpdate = function (ckMode) {
    this.Menu_Zukan_Detail_SelectUpdate(ckMode);
};
let befZukan_Kaiso_Flg = false;
let befZukanBackFlame = 0;
Game_Interpreter.prototype.Menu_Zukan_Detail_SelectUpdate = function (ckMode) {
    var okFlg = false;
    if (befZukan_Kaiso_Flg) {
        if (!Zukan_Kaiso_Flg) befZukanBackFlame = 3;
    }
    befZukan_Kaiso_Flg = Zukan_Kaiso_Flg;
    if (befZukanBackFlame > 0) {
        befZukanBackFlame--;
        if (befZukanBackFlame == 0) {
            this.AllSpriteLoad();
            this.DelSpriteSpan(PN_zmYNBase, PN_zmYNSelect);
        }
        return;
    }
    var ckPicNo = overPointerSpCkArr(mZukan_PicArr);
    var cngFlg = false;
    if (ckPicNo != -1) {
        ckPicNo -= PN_zmDHSn;
        var ckX = ckPicNo % 2;
        var ckY = Math.floor(ckPicNo / 2);
        cngFlg = ckMode.selecterNoX != ckX || ckMode.selecterNoY != ckY || TatieSelectMode;
        TatieSelectMode = false;
        ckMode.selecterNoX = ckX;
        ckMode.selecterNoY = ckY;
        if (TouchInput.isTriggered() && viewZukanData.hSceneFlg[ckX + ckY * 2]) okFlg = true;
    }
    var ckTPicNo = overPointerSpCkArr(mZukan_TPicArr);
    if (ckTPicNo != -1) {
        ckTPicNo -= PN_zmDBtn;
        cngFlg = (ckTPicNo != TatieSelectNo || !TatieSelectMode);
        TatieSelectNo = ckTPicNo;
        TatieSelectMode = true;
    }
    if (cngFlg) {
        this.MenuZukanTatieDetailBtnDraw(); 
        SoundManager.playCursor();
        return;
    }
    if (TatieSelectMode) {
        this.TatieSelectUpdate(ckMode);
        return;
    }
    if (Zukan_Kaiso_Flg) return;    
    if (Zukan_YesNoFlg) {
        this.Menu_Zukan_Detail_YesNoUpdate(ckMode);
        return;
    }
    if (ckMode.flame == 1) {
        this.Menu_Zukan_DetailDraw(ckMode);
    }
    this.SetSprite(PN_zmDSelect, mZukan_DtlPicPath + "PN_mSelectWin",
        672 + ckMode.selecterNoX * 305, 151 + ckMode.selecterNoY * 200);
    if (Input.isTriggered('up')) {
        ckMode.selecter_Up();
    }
    if (Input.isTriggered('down')) {
        ckMode.selecter_Down();
    }
    if (Input.isTriggered('left')) { 
        if (ckMode.selecterNoX == 0) {
            TatieSelectMode = true;
            SoundManager.playCursor();
            this.MenuZukanTatieDetailBtnDraw(); 
        } else
            ckMode.selecter_Left();
    }
    if (Input.isTriggered('right')) { 
        ckMode.selecter_Right();
    }
    if (ckMode.IsSelecterGridMove) { 
        SoundManager.playCursor();
    }
    if (Input.isTriggered('ok') || okFlg) {
        let selNo = ckMode.selecterNoX + ckMode.selecterNoY * 2;
        if (!viewZukanData.hSceneFlg[selNo]) return;
        Zukan_YesNoFlg = true;
        Zukan_Kaiso_SelNo = selNo;
        Zukan_Kaiso_Txt = viewGetZukanData.hScene[Zukan_Kaiso_SelNo].desc
        Zukan_Kaiso_PicPath = viewGetZukanData.hScene[Zukan_Kaiso_SelNo].picPath;
        this.Menu_Zukan_Detail_YesNoView();
        return;
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        DelSprite(PN_TalkWin);
        TatieSelectMode = false;
        SoundManager.playCursor();
        this.DelSpriteSpan(PN_zmDtlBtn + 1, PN_zmDSelect);
        ckMode.parent.ModeCng(MenuBox.Select); 
    }
}
Game_Interpreter.prototype.TatieSelectUpdate = function (ckMode) {
    if (Input.isTriggered('right')) {
        TatieSelectMode = false;
        SoundManager.playCursor();
    }
    var tLenght = $gameSystem.mZukan[viewDetailID - 1].hTatieFlg.length;
    if (Input.isTriggered('up')) {
        TatieSelectNo--;
        if (TatieSelectNo < 0) TatieSelectNo = tLenght - 1;
        this.MenuZukanTatieDetailBtnDraw();
        SoundManager.playCursor();
    }
    if (Input.isTriggered('down')) {
        TatieSelectNo++;
        if (TatieSelectNo >= tLenght) TatieSelectNo = 0;
        this.MenuZukanTatieDetailBtnDraw();
        SoundManager.playCursor();
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        TatieSelectMode = false;
        SoundManager.playCursor();
        this.DelSpriteSpan(PN_zmDtlBtn, PN_zmDSelect);
        ckMode.parent.ModeCng(MenuBox.Select); 
    }
}
let HsceneHscenePicPath = "pictures/H_Scene/_DataBase/Zukan/ScenePic/";
const CN_回想 = 750;
let Zukan_Kaiso_SelNo = 0;
let Zukan_Kaiso_Txt = "";
let Zukan_Kaiso_PicPath = "";
let Zukan_Kaiso_Flg = false;
let Zukan_YesNoFlg = false;
let Zukan_YesNoNo = 0;
let befZukan_YesNoNo = 0;
Game_Interpreter.prototype.Menu_Zukan_Detail_YesNoView = function () {
    Zukan_YesNoNo = 0;
    this.SetSprite(PN_zmYNBase, mZukan_DtlPicPath + "PN_zmSBase_YesNo", 0, BPs._y);
    this.SpriteStrC(PN_zmYNTxt, Zukan_Kaiso_Txt, 24, BPs._x + 389, BPs._y + 175);
    this.SetSpriteC(PN_zmYNPic, HsceneHscenePicPath + Zukan_Kaiso_PicPath,
        BPs._x + 389, BPs._y + 320);
}
Game_Interpreter.prototype.Menu_Zukan_Detail_YesNoUpdate = function (ckMode) {
    if (Zukan_YesNoFlg) {
        this.SetSprite(PN_PicFlame, "PN_PicFlame", 0, 0);
        this.SetSprite(PN_zmYNSelect, mZukan_DtlPicPath + "PN_zmYNPic", BPs._x + 180 + (230 * Zukan_YesNoNo), BPs._y + 420);
        let okFlg = false;
        let moveFlg = false;
        let ckClickMapArr = [
            [170 + BPs._x , 412, 200, 50],
            [170 + 245 + BPs._x , 412, 200, 50]
        ];
        let ckPicNo = overSpriteClickable(PN_zmYNBase, ckClickMapArr);
        if (ckPicNo != -1) {
            Zukan_YesNoNo = ckPicNo;
            okFlg = TouchInput.isTriggered();
        }
        if (Input.isTriggered('left')) {
            Zukan_YesNoNo--;
            if (Zukan_YesNoNo < 0) Zukan_YesNoNo = 0;
        }
        if (Input.isTriggered('right')) {
            Zukan_YesNoNo++;
            if (Zukan_YesNoNo > 1) Zukan_YesNoNo = 1;
        }
        moveFlg = (Zukan_YesNoNo != befZukan_YesNoNo);
        befZukan_YesNoNo = Zukan_YesNoNo;
        if (moveFlg) {
            SoundManager.playCursor();
        }
        let cancelFlg = false;
        if (Input.isTriggered('ok') || okFlg) {
            if (Zukan_YesNoNo == 0) {
                Zukan_Kaiso_Flg = true; 
                Menu回想Flg = true;
                this.AllSaveSprite(); 
                let _jTxt = viewGetZukanData.hScene[Zukan_Kaiso_SelNo].eventName;
                Zukan_YesNoFlg = false;
                this.DelSpriteSpan(PN_zmYNBase, PN_zmYNSelect);
                this.DelSpriteSpan(PN_mBase, PN_mL2End);
                this.InstantSave(); 
                Zukan_Kaiso_Txt = _jTxt;
                this.TmpEvPCall(Zukan_Kaiso_Txt);
                this.SetSprite(PN_PicFlame, "PN_PicFlame", 0, 0);
                this.PlaySe("_Menu_Open");
                this.SetCmnEventSc(CN_回想);
                return;
            } else {
                cancelFlg = true;
            }
        }
        if (Input.isTriggered('menu') || TouchInput.isCancelled() || cancelFlg) {
            Zukan_YesNoFlg = false;
            this.DelSpriteSpan(PN_zmYNBase, PN_zmYNSelect);
            SoundManager.playCancel();
        }
        return;
    }
    let okFlg = false;
    let ckPicArr = [];
    for (let i = 0; i <= 11 - 1; i++) {
        ckPicArr.push(PN_zmSHPic + i);
    }
    let ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if (ckPicNo != -1) {
        ckMode.selecterNo = ckPicNo;
        okFlg = TouchInput.isTriggered();
    }
    if (Input.isTriggered('left')) {
        ckMode.selectNo_Up();
    }
    if (Input.isTriggered('right')) {
        ckMode.selectNo_Down();
    }
    if (Input.isTriggered('ok') || okFlg) {
        Zukan_YesNoFlg = true;
        D_Text_Cng_font = "";
    }
    if (ckMode.IsSelecterMove) {
        D_Text_Cng_font = "";    
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        this.DelSpriteSpan(PN_zmSBase, PN_mL2Selecter); 
        this.DelSpriteSpan(PN_zmSBase, PN_mL2Selecter); 
        this.MoveSprite(PN_mL2Selecter, true, true, 1, 255);
        ckMode.parent.ModeCng(Zukan_Datail.Select); 
    }
}
