let MenuFlame = 0;
let MenuSin = 0;
let mBtn_w_notFlg = false;
let Menu_OpenDraw_Flame = 0;
const VN_HintTxt = 25;
const SW_魔法箒使用不可 = 470;
Game_Interpreter.prototype.Menu_OpenDraw = function (blurFlg) {
    blurFlg = typeof blurFlg !== 'undefined' ? blurFlg : true
    DText_NRZureY = 0;
    if (Menu_OpenDraw_Flame == 0) {
        DelSprite(PN_TalkWin); 
        if (blurFlg) { 
            let args = new Array("on");
            this.pluginCommand("waitBlur", args);
            this.PlaySe("_Menu_Open" , 60);
        }
        Menu_OpenDraw_Flame++;
        return;
    }
    this.DelSprite(PN_MapNameTxt);
    this.DelSprite(PN_MapNameWin);
    this.Menu_TrainerCardDraw(); 
    let setTxtSize = 26;
    if (LngMode == "en") setTxtSize = 23;
    this.SpriteStr( PN_mTrHintTxt , SCol.Yel0 + $gameVariables.value(VN_HintTxt) , setTxtSize , BPs._x + 156, BPs._y + 572);
    this.SetSprite(PN_mBase, MenuPicPath + "PN_mBack", BPs._x, BPs._y);
    menuBox.skipSelectNo = [];
    for (let i = 1; i <= 6 - 1; i++) {
        let _btnX = BPs._x; _btnX -= 25;
        if (IsEndLaboMode() && i == 2) {
            menuBox.skipSelectNo = [i];
            continue;
        }
        this.SetSprite(PN_mBtn + i, MenuPicPath + "PN_mBtn" + (i + 1) , _btnX , BPs._y + 73 + (80 * i));
    }
    if ($gameSwitches.value(SW_ZukanGet)) {
        menuBox.skipSelectNo = [];
        menuBox.selectNoMax2 = 1;
        let _btnX = BPs._x;
        _btnX -= 25;
        this.SetSprite(PN_mBtn + 0, MenuPicPath + "PN_mBtn1", _btnX , BPs._y + 73 + (80 * 0));
        this.SetSprite(PN_mBtn_y, MenuPicPath + "PN_mBtn_y", BPs._x + 267 , BPs._y + 73);
    } else {
        menuBox.skipSelectNo.push(0);
        if(menuBox.selecterNo == 0) menuBox.selecterNo = 1;
        menuBox.selectNoMax2 = 0;
    }
    let addCounter = 0;
    if ($gameSwitches.value(SW_FastTrFlg)) {
        addCounter++;
        if (MetaChecker($dataMap, "魔法のほうきOK", false) != false && !$gameSwitches.value(SW_魔法箒使用不可)) {
            mBtn_w_notFlg = false;
            this.SetSprite(PN_mBtn_w, MenuPicPath + "PN_mBtn_w", BPs._x + 267 * addCounter , BPs._y + 73 + (80 * 5));
        } else {
            mBtn_w_notFlg = true;
            this.SetSprite(PN_mBtn_w, MenuPicPath + "PN_mBtn_w_not", BPs._x + 267 * addCounter , BPs._y + 73 + (80 * 5));
        }
    }
    if ($gameSwitches.value(SW_MapGet)) {
        addCounter++;
        this.SetSprite(PN_mBtn_m, MenuPicPath + "PN_mBtn_m", BPs._x + 267 * addCounter , BPs._y + 73 + (80 * 5));
    }
    if(addCounter == 2) menuBox.selectNoMax2 = 2;
    this.Menu_SelectBtn_Move();
    Menu_OpenDraw_Flame = 0;
    menuBox.ModeCng(MenuBox.Select);
}
let TrainerCardPos = new Pos2D(BPs._x + 328, BPs._y + 175);
Game_Interpreter.prototype.Menu_TrainerCardDraw = function () {
    var cardBasePicName = "PN_mTrCardBase";
    if ($gamePlayer.characterName() == "Woman") cardBasePicName = "PN_mTrCardBaseEx";
    this.SetSprite(PN_mTrCardBase, MenuPicPath + cardBasePicName, TrainerCardPos._x, TrainerCardPos._y);
    this.SpriteStr(PN_mTrLvTxt , SCol.Blk0 + $gameSystem.TrainerLv , 32 ,
        TrainerCardPos._x + 322, TrainerCardPos._y + 119);
    this.SpriteStrR(PN_mTrGoldTxt ,SCol.Blk0 + $gameParty._gold , 20 ,
        TrainerCardPos._x + 377, TrainerCardPos._y + 260);
    for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
        let picPath = $gameSystem.Player.syojiTikemon[i].YarimonData.picPath;
        this.SetSprite(PN_mTrMon + i, Btl_Yarimon + picPath,
            TrainerCardPos._x + 153 + (80 * i), TrainerCardPos._y + 171 , 255 , 25 ,25);
    }
    D_Text_Cng_font = ""; 
}
