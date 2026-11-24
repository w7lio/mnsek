let MonBox_PicPath = "pictures/MonBox/";
let PN_bxBase = 50;
let PN_bxMon = PN_bxBase + 1;
let PN_bxMonPic = PN_bxMon + (8 * 3) + 1;
let PN_bxMainSel = PN_bxMonPic + 20
let PN_bxMonLvTxt = PN_bxMainSel + 1;
let PN_bxBoxNo = PN_bxMonLvTxt + 20;
let PN_bxBoxSel = PN_bxBoxNo + 15;
let PN_bxMonSel = PN_bxBoxSel + 1;
let PN_bxCngSel = PN_bxMonSel + 1;
let PN_bxBoxLock = PN_bxCngSel + 1;
let PN_bxDtlMon = 150;
let PN_bxDtlWaza = PN_bxDtlMon + 8;
let PN_bxDtlMonBase = 150;
let PN_bxBlack = 175;
let PN_bxSelect = PN_bxBlack + 4;
let PN_bxymBase = 190;
let PN_bxWazaCkBack = 230;
let PN_bxDtlSelect = 280;
const MaxMonBoxCount = 14;
const MaxMonBoxMonCount = 20;
let MonBox_Select; 
let BoxModes = new ModeArr();
let BoxEndFlg = false;
const DtlArrStr = {
    _能力の確認: "能力の確認" ,
    _控えに移動: "控えに移動" ,
    _メインに移動: "メインに移動" ,
    _移動する: "移動する" ,
    _サヨナラ: "サヨナラ" ,
};
const MonBox_ModeStr = {
    Select: "Select" ,
    Detail: "Detail" ,
    Cng: "Cng" ,
};
let MonBoxModeFlg = false;
Game_Interpreter.prototype.MonBox_Start = function () {
    MonBoxModeFlg = true;
    MonBox_NoClickFlame = 10;
    BoxSelectNo = MonBox_MainSelNo = 0;
    BoxEndFlg = false;
    MonBox_Select = new ArrSelecter(5,4); 
    MonBox_Select.loopFlg = false;
    BoxModes = new ModeArr();
    let modeBoxSelect = new ModeData(MonBox_ModeStr.Select);
    modeBoxSelect.MainFlg = false;
    modeBoxSelect.MainNo = 0;
    modeBoxSelect.BoxFlg = false;
    modeBoxSelect.BoxNo = 0;
    modeBoxSelect.DtlSelArr = []; 
    modeBoxSelect.DtlSelFlame = 0;
    modeBoxSelect.DtlSelNo = -1;
    modeBoxSelect.DtlSelAction = null; 
    modeBoxSelect.CngFlg = false; 
    modeBoxSelect.CngMainFlg = false; 
    modeBoxSelect.CngMainNo = 0;
    modeBoxSelect.CngBoxNo = 0;
    modeBoxSelect.CngArrData = new ArrSelecter(5,4); 
    BoxModes.ModeAdd(modeBoxSelect);
    let modeBoxDetail = new ModeData(MonBox_ModeStr.Detail);
    BoxModes.ModeAdd(modeBoxDetail);
    let modeBoxCng = new ModeData(MonBox_ModeStr.Cng);
    BoxModes.ModeAdd(modeBoxCng);
    BoxModes.ModeCng(MonBox_ModeStr.Select);
    this.SetSprite( PN_bxBase , MonBox_PicPath + "PN_bxBase" , BPs._x , BPs._y);
    this.MonBox_syojiTikemon_Draw();
    this.MonBox_BoxDraw(); 
    let ckData = BoxModes.ModeGet(MonBox_ModeStr.Select);
    this.MonBox_Select_Setu_Draw(ckData);
}
Game_Interpreter.prototype.MonBox_syojiTikemon_Draw = function () {
    this.DelSpriteSpan(PN_bxMon , PN_bxMon + (3 * dmBtnPicCnt) - 1);
    for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
        if ($gameSystem.Player.syojiTikemon[i] == null) {
            $gameSystem.Player.syojiTikemon.splice(i , 1); i--;
            continue;
        }
        this.YarimonWakuDraw(PN_bxMon + (i * dmBtnPicCnt) , $gameSystem.Player.syojiTikemon[i] ,
            BPs._x + 22 , BPs._y + 79 + (168 * i));
        if (IdチケープCheck($gameSystem.Player.syojiTikemon[i].id)) {
            this.SetSprite( PN_bxBoxLock , MonBox_PicPath + "PN_bxBoxLock" ,
                BPs._x + 29 , BPs._y + 105 + (168 * i));
        }
    }
}
let MonBoxSetting_NUpdateSc = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    MonBoxSetting_NUpdateSc.call(this);
    while ($gameSystem.MonBox.length < MaxMonBoxCount) {
        let _BoxArr = [];
        for (let j = 0; j <= MaxMonBoxMonCount - 1; j++) {
            _BoxArr.push(null);
        }
        $gameSystem.MonBox.push(_BoxArr);
    }
}
Game_Interpreter.prototype.MonBox_BoxDraw = function () {
    let modeData = BoxModes.ModeGet(MonBox_ModeStr.Select);
    let boxNo = modeData.BoxNo;
    for (let i = 0; i <= MaxMonBoxCount - 1; i++) {
        let picStr = "box" + (i + 1);
        if(i == boxNo) {
            picStr = "box" + (i + 1) + "_on";
            this.SetSprite( PN_bxBoxNo + i , MonBox_PicPath + picStr , BPs._x + 270 + (36 * i) , BPs._y + 20);
        } else {
            this.SetSprite( PN_bxBoxNo + i , MonBox_PicPath + picStr , BPs._x + 270 + (36 * i) , BPs._y + 20 , 155);
        }
    }
    for (let i = 0; i <= $gameSystem.MonBox[boxNo].length - 1; i++) {
        let monstarData = $gameSystem.MonBox[boxNo][i];
        let noX = i % 5;
        let noY = Math.floor(i / 5);
        MonBox_Select.selectArr[noY][noX] = true;
        if($gameSystem.MonBox[boxNo][i] != null) {
            this.SetSprite(PN_bxMonPic + i , Btl_Yarimon + monstarData.YarimonData.picPath ,
                BPs._x + 257 + (104 * noX) , BPs._y + 71 + (98 * noY) , 255 , 31.7, 31.7);
            this.SpriteStrR( PN_bxMonLvTxt + i , SCol.Blk0 + SWCol.Wht + "Lv." + monstarData.lv , 20 ,
                BPs._x + 257 + 98 + (104 * noX) , BPs._y + 71 + (98 * noY));
        } else {
            this.DelSprite(PN_bxMonPic + i);
            this.DelSprite(PN_bxMonLvTxt + i);
        }
    }
    D_Text_Cng_font = "";
}
Game_Interpreter.prototype.MonBox_Update = function () {
    menuOffFlame = 5;
    switch (BoxModes.ModeName) {
        case MonBox_ModeStr.Select:
            this.MonBox_SelectUpdate();
            break;
        case MonBox_ModeStr.Detail:
            this.MonBox_DetailUpdate(); 
            break;
        case MonBox_ModeStr.Cng:
            break;
    }
    if (BoxEndFlg) return false; 
    return true; 
}
let MonBox_NoClickFlame = 0;
let MonBox_Select_Update_waitFlame = 0;
Game_Interpreter.prototype.MonBox_SelectUpdate = function () {
    let ckData = BoxModes.ModeGet(MonBox_ModeStr.Select);
    if(ckData.DtlSelArr.length > 0) {
        this.MonBox_Select_DtlSelect(ckData);
        return;
    }
    if(MonBox_Select_Update_waitFlame > 0) {
        MonBox_Select_Update_waitFlame--;
        return;
    }
    let okFlg = false;
    let ckPicArr = [];
    let ckPicNo = 0;
    ckPicArr = [];
    for (let i = 0; i <= MaxMonBoxCount - 1; i++) {
        ckPicArr.push(PN_bxBoxNo + i);
    }
    ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if (ckPicNo != -1) {
        ckData.BoxNo = ckPicNo;
        ckData.BoxFlg = true;
        this.MonBox_BoxDraw();
        this.DelSprite(PN_bxMonSel);
        this.DelSprite(PN_bxMainSel);
    }
    ckPicArr = [];
    for (let i = 0; i <= MaxMonBoxMonCount - 1; i++) {
        ckPicArr.push(PN_bxMonPic + i);
    }
    ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if (ckPicNo != -1) {
        ckData.BoxFlg = ckData.MainFlg = false;
        MonBox_Select.selecterY = Math.floor(ckPicNo / 5);
        MonBox_Select.selecterX = ckPicNo % 5;
        this.DelSprite(PN_bxMonSel);
        if (TouchInput.isPressed()) okFlg = true;
    }
    ckPicArr = [];
    for (let i = 0; i <= 3 - 1; i++) {
        ckPicArr.push(PN_bxMon + 2 + (i * dmBtnPicCnt));
    }
    ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if (ckPicNo != -1) {
        ckData.MainFlg = true;
        ckData.MainNo = ckPicNo;
        this.DelSprite(PN_bxMainSel);
        if (TouchInput.isPressed()) okFlg = true;
    }
    let ckClickMapArr = [
        [25 , 102 + 168 * 0 , 126 , 133],
        [25 , 102 + 168 * 1 , 126 , 133],
        [25 , 102 + 168 * 2 , 126 , 133]
    ];
    ckPicNo = overSpriteClickable(PN_bxBase , ckClickMapArr);
    if (ckPicNo != -1) {
        if (ckData.CngFlg) { 
            if(ckPicNo <= $gameSystem.Player.syojiTikemon.length) {
                MonBox_Select.selecterX = 0;
                ckData.MainFlg = true;
                ckData.MainNo = ckPicNo;
            }
        } else {
            if (ckPicNo < $gameSystem.Player.syojiTikemon.length) {
                MonBox_Select.selecterX = 0;
                ckData.MainFlg = true;
                ckData.MainNo = ckPicNo;
            }
        }
    }
    if (MonBox_NoClickFlame > 0) {
        MonBox_NoClickFlame--; okFlg = false;
    }
    if (!ckData.BoxFlg && !ckData.MainFlg) this.MonBox_Select_BaseUpdate(ckData , okFlg);
    if (ckData.BoxFlg) this.MonBox_Select_BoxUpdate(ckData); 
    if (ckData.MainFlg) this.MonBox_Select_MainUpdate(ckData , okFlg); 
    if(ckData.CngFlg) { 
        if (!ckData.CngMainFlg) {
            if(ckData.CngBoxNo == ckData.BoxNo) {
                this.SetSprite(PN_bxCngSel , MonBox_PicPath + "PN_bxMainSel_Cng" ,
                    BPs._x + 257 - 4 + (104 * ckData.CngArrData.selecterX) ,
                    BPs._y + 71 - 4 + (98 * ckData.CngArrData.selecterY));
            } else {
                this.DelSprite(PN_bxCngSel);
            }
        } else {
            this.SetSprite(PN_bxCngSel , MonBox_PicPath + "PN_bxMonSel_Cng" ,
                BPs._x + 22 , BPs._y + 79 + 20 + (168 * ckData.CngMainNo));
        }
    }
    if(Input.isTriggered('menu') || TouchInput.isCancelled()) { 
        if(ckData.CngFlg){
            ckData.CngFlg = false;
            this.DelSprite(PN_bxCngSel);
            MonBox_Select_Update_waitFlame = 5;
            return;
        }
        BoxEndFlg = true; 
        MonBoxModeFlg = false;
        this.DelSpriteSpan(PN_bxBase , PN_bxDtlSelect);
    }
}
Game_Interpreter.prototype.MonBox_Select_BaseUpdate = function (ckData , okFlg) {
    okFlg = typeof okFlg !== 'undefined' ? okFlg : false;
    if(MonBox_NoClickFlame > 0) {
        MonBox_NoClickFlame--;
        return;
    }
    let mvFlg = false;
    this.SetSprite(PN_bxMainSel , MonBox_PicPath + "PN_bxMainSel" ,
        BPs._x + 257 - 4 + (104 * MonBox_Select.selecterX) , BPs._y + 71 - 4 + (98 * MonBox_Select.selecterY));
    if (Input.isTriggered('up')) {
        if(MonBox_Select.selecterY == 0) {
            BoxModes.ModeGet(MonBox_ModeStr.Select).BoxFlg = true;
            this.DelSprite(PN_bxMainSel);
        } else {
            mvFlg = MonBox_Select.selecter_Up();
        }
    }
    if (Input.isTriggered('down')){
        mvFlg = MonBox_Select.selecter_Down();
    }
    if (Input.isTriggered('left')) {
        if (MonBox_Select.selecterX == 0) {
            BoxModes.ModeGet(MonBox_ModeStr.Select).MainFlg = true;
            this.DelSprite(PN_bxMainSel);
            this.MonBox_Select_Setu_Draw(ckData);
        } else {
            mvFlg = MonBox_Select.selecter_Left();
        }
    }
    if (Input.isTriggered('right')) {
        mvFlg = MonBox_Select.selecter_Right();
    }
    if(Input.isTriggered('ok') || okFlg) {
        if(ckData.CngFlg) {
            MonBox_NoClickFlame = 10;
            this.MonBox_Mon_Cng(ckData);
            return;
        }
        let ckMon = null;
        if(ckData.MainFlg) {
            ckMon = $gameSystem.Player.syojiTikemon[ckData.MainNo];
        } else {
            let _monSelNo = MonBox_Select.selecterY * 5 + MonBox_Select.selecterX;
            ckMon = $gameSystem.MonBox[ckData.BoxNo][_monSelNo];
        }
        if(ckMon == null) return;
        MonBox_DtlCkFlg = true;
        ckData.DtlSelArr = [];
        ckData.DtlSelArr.push(DtlArrStr._能力の確認);
        ckData.DtlSelArr.push(DtlArrStr._移動する);
        if ($gameSystem.Player.syojiTikemon.length < 3) {
            ckData.DtlSelArr.push(DtlArrStr._メインに移動);
        }
        ckData.DtlSelArr.push(DtlArrStr._サヨナラ);
        ckData.DtlSelNo = 0;
        this.MonBox_Select_DtlArrDraw(ckData);
    }
    if (mvFlg) {
        this.MonBox_Select_Setu_Draw(ckData);
    }
}
Game_Interpreter.prototype.MonBox_Mon_Cng = function (ckData) {
    ckData.CngFlg = false;
    this.DelSprite(PN_bxCngSel);
    let befMonster = null;
    let _newMon = null;
    if(ckData.CngMainFlg) { 
        befMonster = $gameSystem.Player.syojiTikemon[ckData.CngMainNo];
        $gameSystem.NewWazaArr[ckData.CngMainNo] = false;
        if(ckData.MainFlg) {
            _newMon = $gameSystem.Player.syojiTikemon[ckData.MainNo];
            $gameSystem.Player.syojiTikemon[ckData.MainNo] = befMonster;
            $gameSystem.NewWazaArr[ckData.MainNo] = false;
        } else {
            let _monSelNo = MonBox_Select.selecterY * 5 + MonBox_Select.selecterX;
            _newMon = $gameSystem.MonBox[ckData.BoxNo][_monSelNo];
            $gameSystem.MonBox[ckData.BoxNo][_monSelNo] = befMonster;
        }
        $gameSystem.Player.syojiTikemon[ckData.CngMainNo] = _newMon;
    } else {    
        let monsterCngNo = ckData.CngArrData.selecterX + ckData.CngArrData.selecterY * 5;
        befMonster = $gameSystem.MonBox[ckData.CngBoxNo][monsterCngNo];
        if(ckData.MainFlg) {
            if ($gameSystem.Player.syojiTikemon[ckData.MainNo] != undefined) {
                if (IdチケープCheck($gameSystem.Player.syojiTikemon[ckData.MainNo].id)) return;
            }
            _newMon = $gameSystem.Player.syojiTikemon[ckData.MainNo];
            $gameSystem.Player.syojiTikemon[ckData.MainNo] = befMonster;
            $gameSystem.NewWazaArr[ckData.MainNo] = false;
        } else {
            let _monSelNo = MonBox_Select.selecterY * 5 + MonBox_Select.selecterX;
            _newMon = $gameSystem.MonBox[ckData.BoxNo][_monSelNo];
            $gameSystem.MonBox[ckData.BoxNo][_monSelNo] = befMonster;
        }
        $gameSystem.MonBox[ckData.CngBoxNo][monsterCngNo] = _newMon;
    }
    this.MonBox_BoxDraw();
    this.MonBox_syojiTikemon_Draw(ckData);
    this.MonBox_Select_Setu_Draw(ckData);
}
Game_Interpreter.prototype.MonBox_Select_Setu_Draw = function (ckData) {
    let selectNo = MonBox_Select.selecterY * 5 + MonBox_Select.selecterX;
    let mData = $gameSystem.MonBox[ckData.BoxNo][selectNo];
    if(ckData.MainFlg) {
        mData = $gameSystem.Player.syojiTikemon[ckData.MainNo];
    }
    this.DelSpriteSpan(PN_bxDtlMon , PN_bxDtlWaza + (4 * BtlBtnPicCnt));
    if(mData == null) return;
    this.YarimonWakuDraw(PN_bxDtlMon , mData , BPs._x + 238 , BPs._y + 462);
    for (let i = 0; i <= mData.btlWazas.length - 1; i++) {
        this.WazaWakuWinDraw(PN_bxDtlWaza + (i * BtlBtnPicCnt) , mData.btlWazas[i] ,
            BPs._x + 393 + 97 * i , BPs._y + 525 , 70 , true);
    }
}
Game_Interpreter.prototype.MonBox_Select_BoxUpdate = function (ckData) {
    this.SetSprite(PN_bxBoxSel , MonBox_PicPath + "PN_bxBoxSel" ,
        BPs._x + 270 - 3 + (36 * ckData.BoxNo) , BPs._y + 20 - 3);
    let mvFlg = false;
    if (Input.isTriggered('right')) {
        ckData.BoxNo++; mvFlg = true;
    }
    if (Input.isTriggered('left')) {
        ckData.BoxNo--; mvFlg = true;
    }
    if (mvFlg) {
        if(ckData.BoxNo < 0) ckData.BoxNo = $gameSystem.MonBox.length - 1;
        if(ckData.BoxNo >= $gameSystem.MonBox.length) ckData.BoxNo = 0;
        this.MonBox_BoxDraw();
    }
    if (Input.isTriggered('down')) {
        ckData.BoxFlg = false;
        this.DelSprite(PN_bxBoxSel);
        MonBox_Select.selecterY = 0;
        MonBox_Select.selecterX = 0;
        this.MonBox_Select_Setu_Draw(ckData);
    }
}
Game_Interpreter.prototype.MonBox_Select_DtlArrDraw = function (ckData) {
    if(!ckData.MainFlg) {
        this.SetSprite(PN_bxBlack + 0 , MonBox_PicPath + "PN_bxBlack" ,
            BPs._x + 257 + (104 * MonBox_Select.selecterX) ,
            BPs._y + 70 + (98 * MonBox_Select.selecterY) - 623 , 155);
        this.SetSprite(PN_bxBlack + 1 , MonBox_PicPath + "PN_bxBlack" ,
            BPs._x + 257 + (104 * MonBox_Select.selecterX) ,
            BPs._y + 72 + (98 * MonBox_Select.selecterY) + 92 , 155);
        this.SetSpriteR(PN_bxBlack + 2 , MonBox_PicPath + "PN_bxBlack_2" ,
            BPs._x + 257 + (104 * MonBox_Select.selecterX) ,
            BPs._y , 155);
        this.SetSprite(PN_bxBlack + 3 , MonBox_PicPath + "PN_bxBlack_2" ,
            BPs._x + 257 + (104 * MonBox_Select.selecterX) + 99 ,
            BPs._y , 155);
    }
    for (let i = 0; i <= ckData.DtlSelArr.length - 1; i++) {
        let setX = BPs._x + 257 + (104 * MonBox_Select.selecterX) + 106;
        let setY = BPs._y + 70 + (98 * MonBox_Select.selecterY);
        if(ckData.MainFlg) {
            setX = 472;
            setY = 195 + ckData.MainNo * 168;
            this.SetSprite(PN_bxBlack + 3 , MonBox_PicPath + "PN_bxBlack_2_m" + ckData.MainNo ,
                BPs._x , BPs._y , 155);
        }
        setY += i * 50;
        if (MonBox_Select.selecterX > 2) setX -= 313;
        let opacity = 155;
        if(ckData.DtlSelNo == i) opacity = 255;
        this.SetSprite(PN_bxSelect + 0 + (i * 2) , MonBox_PicPath + "PN_ymCkSelect" , setX , setY , opacity);
        this.SpriteStr(PN_bxSelect + 1 + (i * 2) , SCol.Blk0 + NLngStrGet(ckData.DtlSelArr[i]) , 20 ,
            setX + 19 , setY + 9 , opacity);
    }
}
Game_Interpreter.prototype.MonBox_Select_MainUpdate = function (ckData , okFlg) {
    okFlg = typeof okFlg !== 'undefined' ? okFlg : false;
    this.SetSprite(PN_bxMonSel , MonBox_PicPath + "PN_bxMonSel" ,
        BPs._x + 22 , BPs._y + 79 + 20 + (168 * ckData.MainNo));
    let mvFlg = false;
    if (Input.isTriggered('down')) {
        ckData.MainNo++; mvFlg = true;
    }
    if (Input.isTriggered('up')) {
        ckData.MainNo--; mvFlg = true;
    }
    let ckClickMap = [
        [25 , 102 + 168 * 0 , 126 , 133] ,
        [25 , 102 + 168 * 1 , 126 , 133] ,
        [25 , 102 + 168 * 2 , 126 , 133]
    ];
    let clickNo = overSpriteClickable(PN_bxBase , ckClickMap);
    if (clickNo != -1) {
        if(ckData.MainNo != clickNo) {
            mvFlg = true;
        }
        ckData.MainNo = clickNo;
        if (TouchInput.isTriggered()) okFlg = true;
    }
    if (mvFlg) {
        if (ckData.MainNo >= 3) ckData.MainNo = 0;
        if (ckData.CngFlg) {
            if(ckData.MainNo > $gameSystem.Player.syojiTikemon.length) ckData.MainNo = 0;
        } else {
            if (ckData.MainNo >= $gameSystem.Player.syojiTikemon.length) ckData.MainNo = 0;
        }
        if (ckData.MainNo < 0) ckData.MainNo = $gameSystem.Player.syojiTikemon.length - 1;
        this.MonBox_Select_Setu_Draw(ckData);
    }
    if (Input.isTriggered('right')) {
        this.DelSprite(PN_bxMonSel);
        ckData.MainFlg = false;
        this.MonBox_Select_Setu_Draw(ckData);
    }
    if (Input.isTriggered('ok') || okFlg) {
        if (ckData.CngFlg) {
            MonBox_NoClickFlame = 10;
            this.MonBox_Mon_Cng(ckData);
            this.MonBox_syojiTikemon_Draw(ckData);
            return;
        }
        ckData.DtlSelArr = [];
        ckData.DtlSelArr.push(DtlArrStr._能力の確認);
        if($gameSystem.Player.syojiTikemon.length > 1) {
            if (!IdチケープCheck($gameSystem.Player.syojiTikemon[ckData.MainNo].id)) {
                ckData.DtlSelArr.push(DtlArrStr._控えに移動);
                ckData.DtlSelArr.push(DtlArrStr._移動する);
            }
        }
        ckData.DtlSelNo = 0;
        this.MonBox_Select_DtlArrDraw(ckData);
    }
}
Game_Interpreter.prototype.MonBox_Select_DtlSelect = function (ckData) {
    if (this.MonBox_Sayonara_Update(ckData)) return;
    ckData.DtlSelFlame++;
    if(ckData.DtlSelFlame == 1) {
        ckData.DtlSelNo = 0;
    }
    if(ckData.DtlSelFlame >= 5) {
        let moveFlg = false;
        if (Input.isTriggered('down')) {
            ckData.DtlSelNo++; moveFlg = true;
        }
        if (Input.isTriggered('up')) {
            ckData.DtlSelNo--; moveFlg = true;
        }
        let okFlg = false;
        let ckPicArr = [];
        for (let i = 0; i <= ckData.DtlSelArr.length - 1; i++) {
            ckPicArr.push(PN_bxSelect + (i * 2));
        }
        let ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
        if(ckPicNo != -1) {
            moveFlg = true;
            ckData.DtlSelNo = ckPicNo;
            okFlg = TouchInput.isTriggered();
        }
        if(MonBox_NoClickFlame > 0) {
            MonBox_NoClickFlame--;
            okFlg = false;
        }
        if (moveFlg) {
            if(ckData.DtlSelNo < 0) ckData.DtlSelNo = ckData.DtlSelArr.length - 1;
            if(ckData.DtlSelNo >= ckData.DtlSelArr.length) ckData.DtlSelNo = 0;
            this.MonBox_Select_DtlArrDraw(ckData);
        }
        let exitFlg = false;
        if (Input.isTriggered('ok') || okFlg) {
            switch (ckData.DtlSelArr[ckData.DtlSelNo]) {
                case DtlArrStr._能力の確認:
                    this.MonBox_Detail_Start();
                    MonBox_NoClickFlame = 10;
                    break;
                case DtlArrStr._移動する:
                    ckData.CngFlg = true;
                    ckData.CngMainFlg = ckData.MainFlg;
                    if (ckData.MainFlg) {
                        this.SetSprite(PN_bxCngSel , MonBox_PicPath + "PN_bxMonSel_Cng" ,
                            BPs._x + 22 , BPs._y + 79 + 20 + (168 * ckData.MainNo));
                        ckData.CngMainNo = ckData.MainNo;
                    } else {
                        this.SetSprite(PN_bxCngSel , MonBox_PicPath + "PN_bxMainSel_Cng" ,
                            BPs._x + 257 - 4 + (104 * MonBox_Select.selecterX) ,
                            BPs._y + 71 - 4 + (98 * MonBox_Select.selecterY));
                        ckData.CngBoxNo = ckData.BoxNo;
                        ckData.CngArrData.selecterX = MonBox_Select.selecterX;
                        ckData.CngArrData.selecterY = MonBox_Select.selecterY;
                    }
                    exitFlg = true;
                    MonBox_NoClickFlame = 10;
                    break;
                case DtlArrStr._控えに移動: 
                    for (let i = 0; i <= $gameSystem.MonBox.length - 1; i++) {
                        for (let j = 0; j <= $gameSystem.MonBox[i].length - 1; j++) {
                            if($gameSystem.MonBox[i][j] == null) {
                                $gameSystem.MonBox[i][j] = $gameSystem.Player.syojiTikemon[ckData.MainNo];
                                $gameSystem.Player.syojiTikemon.splice(ckData.MainNo , 1);
                                ckData.MainNo = 0;
                                ckData.MainFlg = false;
                                this.DelSprite(PN_bxMonSel);
                                MonBox_Select.selecterX = j % 5;
                                MonBox_Select.selecterY = Math.floor(j / 5);
                                this.MonBox_BoxDraw();
                                this.MonBox_syojiTikemon_Draw(ckData);
                                this.MonBox_Select_Setu_Draw(ckData);
                                exitFlg = true;
                                break;
                            }
                        }
                        if(exitFlg) break;
                    }
                    MonBox_NoClickFlame = 10;
                    break;
                case DtlArrStr._メインに移動:
                    let monsterSelectNo = MonBox_Select.selecterY * 5 + MonBox_Select.selecterX;
                    $gameSystem.Player.syojiTikemon.push(
                        $gameSystem.MonBox[ckData.BoxNo][monsterSelectNo]
                    );
                    $gameSystem.MonBox[ckData.BoxNo][monsterSelectNo] = null;
                    this.MonBox_BoxDraw();
                    this.MonBox_syojiTikemon_Draw(ckData);
                    this.MonBox_Select_Setu_Draw(ckData);
                    exitFlg = true;
                    MonBox_NoClickFlame = 10;
                    break;
                case DtlArrStr._サヨナラ:
                    let monsterSelectNo2 = MonBox_Select.selecterY * 5 + MonBox_Select.selecterX;
                    this.MonBox_Sayonara_Start(ckData , monsterSelectNo2);
                    break;
            }
        }
        if (Input.isTriggered('escape')) {
            ckData.DtlSelNo = -1;
        }
        if (MonBox_サヨナラしたFlg) {
            MonBox_サヨナラしたFlg = false;
            exitFlg = true;
            this.MonBox_BoxDraw();
        }
        if (Input.isTriggered('menu') || TouchInput.isCancelled() || exitFlg) {
            this.DelSpriteSpan(PN_bxBlack , PN_bxSelect + 1 + (ckData.DtlSelArr.length * 2));
            ckData.DtlSelArr = [];
        }
    }
}
let MonBox_SayonaraFlg = false;
let MonBox_SayonaraEnsyutu = false;
let MonBox_SayonaraEnsyutu_Flame = 0;
let MonBox_SayonaraMonName = "";
let MonBox_サヨナラしたFlg = false;
const PN_ymSinkaBack_2 = 300;
const PN_ymSinkaTxt_2 = PN_ymSinkaBack_2 + 1;
const PN_ymSinkaMon_2 = PN_ymSinkaTxt_2 + 1;
const PN_mL2Selecter_2 = 310;
let SayoSelectNo = 1;
let SayoSelectNo_Bef = -1;
let SayoMonSelectNo = -1;
Game_Interpreter.prototype.MonBox_Sayonara_Start = function (ckData , monsterSelectNo) {
    MonBox_SayonaraFlg = true;
    MonBox_SayonaraEnsyutu = false;
    MonBox_SayonaraEnsyutu_Flame = 0;
    Zukan_PicPath = Btl_Yarimon;
    SayoSelectNo = SayoSelectNo_Bef = 1;
    this.SetSprite(PN_ymSinkaBack_2, mYarimon_PPath + "PN_ymSinkaBack", BPs._x, BPs._y);
    this.SetSprite(PN_mL2Selecter_2, MenuPicPath + "PN_mSelecter",
        BPs._x + 352 + 215 * SayoSelectNo, BPs._y + 438, 255);
    SayoMonSelectNo = monsterSelectNo;
    let _Mons = $gameSystem.MonBox[ckData.BoxNo][SayoMonSelectNo].YarimonData;
    this.SpriteStrC(PN_ymSinkaTxt_2, NLngStrGet("<value> と別れますか？" , [_Mons.name]), 24, BPs._x + 405, BPs._y + 395);
    MonBox_SayonaraMonName = _Mons.name;
    this.SetSprite(PN_ymSinkaMon_2, Zukan_PicPath + _Mons.picPath, BPs._x + 240, BPs._y + 81);
}
Game_Interpreter.prototype.MonBox_Sayonara_Update = function (ckData) {
    if (!MonBox_SayonaraFlg) return false;
    if (this.MonBox_Sayonara_Ensyutu(ckData)) {
        return true;
    }
    this.SetSprite(PN_mL2Selecter_2, MenuPicPath + "PN_mSelecter",
        BPs._x + 352 + 215 * SayoSelectNo, BPs._y + 438, 255);
    let _okFlg = false;
    let _ckCblMap = [
        [230, 432, 165, 38],
        [230 + 194, 432, 165, 38]
    ];
    let _ckPicNo = overSpriteClickable(PN_ymSinkaBack_2, _ckCblMap);
    if (_ckPicNo != -1) {
        SayoSelectNo = _ckPicNo;
        if (SayoSelectNo != SayoSelectNo_Bef) {
            SoundManager.playCursor();
            SayoSelectNo = SayoSelectNo_Bef = _ckPicNo;
        }
        _okFlg = TouchInput.isTriggered();
    }
    if (Input.isTriggered('left')) {
        SoundManager.playCursor();
        SayoSelectNo--;
        if (SayoSelectNo != SayoSelectNo_Bef) {
            SayoSelectNo = SayoSelectNo_Bef = 0;
        }
    }
    if (Input.isTriggered('right')) {
        SoundManager.playCursor();
        SayoSelectNo++;
        if (SayoSelectNo > 1) {
            SayoSelectNo = SayoSelectNo_Bef = 1;
        }
    }
    if (Input.isTriggered('ok') || _okFlg) {
        SoundManager.playOk();
        if (SayoSelectNo == 0) { 
            MonBox_SayonaraEnsyutu = true;
        } else { 
            this.MonBox_Sayonara_End();
        }
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        this.MonBox_Sayonara_End();
    }
    return true;
}
Game_Interpreter.prototype.MonBox_Sayonara_Ensyutu = function (ckData) {
    if (MonBox_SayonaraEnsyutu) {
        MonBox_SayonaraEnsyutu_Flame++;
        if (MonBox_SayonaraEnsyutu_Flame == 1) {
            this.SpriteStrC(PN_ymSinkaTxt_2, NLngStrGet("<value> と 別れました" ,
                [MonBox_SayonaraMonName]), 24, BPs._x + 405, BPs._y + 395);
            this.MoveSprite(PN_ymSinkaMon_2 , true ,true , 60 , 0);
        }
        if (MonBox_SayonaraEnsyutu_Flame == 90) {
            $gameSystem.MonBox[ckData.BoxNo][SayoMonSelectNo] = null;
            MonBox_サヨナラしたFlg = true;
            this.MonBox_Sayonara_End(ckData);
        }
    }
    return MonBox_SayonaraEnsyutu;
}
Game_Interpreter.prototype.MonBox_Sayonara_End = function (ckData) {
    MonBox_SayonaraFlg = false;
    this.DelSpriteSpan(PN_ymSinkaBack_2 , PN_mL2Selecter_2);
}
let MonBox_DtlMode = new Menu_Yarimon_Detail();
Game_Interpreter.prototype.MonBox_Detail_Start = function () {
    BoxModes.ModeCng(MonBox_ModeStr.Detail);
    let selectData = BoxModes.ModeGet(MonBox_ModeStr.Select);
    let yarimonData = null;
    if (selectData.MainFlg) {
        yarimonData = $gameSystem.Player.syojiTikemon[selectData.MainNo];
    } else {
        let selectNo = MonBox_Select.selecterY * 5 + MonBox_Select.selecterX;
        yarimonData = $gameSystem.MonBox[selectData.BoxNo][selectNo];
    }
    DouguMenuPNSetting(PN_bxymBase , PN_bxDtlSelect);
    WazaCkBackPNSetting(PN_bxWazaCkBack);
    this.Menu_YarimonBaseDraw();
    this.SetSprite(PN_ymBase , MonBox_PicPath + "PN_ymBase_Dtl" , BPs._x , BPs._y);
    this.Menu_YarimonDetailDraw(yarimonData);
    MonBox_DtlMode = new Menu_Yarimon_Detail();
    MonBox_DtlMode.selectNoMaxX = 1;
    MonBox_DtlMode.selectNoMaxY = 1;
    MonBox_DtlMode.selectGrid_Reset();
    MonBox_DtlMode.selectGrid[0][0] = yarimonData.btlWazas.length > 0;
    MonBox_DtlMode.selectGrid[0][1] = yarimonData.btlWazas.length > 1;
    MonBox_DtlMode.selectGrid[1][0] = yarimonData.btlWazas.length > 2;
    MonBox_DtlMode.selectGrid[1][1] = yarimonData.btlWazas.length > 3;
    MonBox_DtlMode.selYarimon = yarimonData;
}
Game_Interpreter.prototype.MonBox_DetailUpdate = function () {
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        if(!DtlWazaEditFlg) {
            this.DelSpriteSpan(PN_bxymBase , PN_bxDtlSelect);
            BoxModes.ModeCng(MonBox_ModeStr.Select);
            return;
        }
    }
    this.Menu_Yarimon_DetailUpdate(MonBox_DtlMode , MonBox_DtlMode.selYarimon);
    MonBox_DtlMode.Update();
}
let MonBoxAdd = function (yarimonData) { 
    for (let i = 0; i <= $gameSystem.MonBox.length - 1; i++) {
        for (let j = 0; j <= $gameSystem.MonBox[i].length - 1; j++) {
            if($gameSystem.MonBox[i][j] == null) {
                $gameSystem.MonBox[i][j] = yarimonData;
                return true;
            }
        }
    }
    return false;
}
