Game_Interpreter.prototype.BtlSelect_Update = function (ckMode) {
    if(escapeCancel_Updateflame >= 0) {
        this.Btl_EscapeCancel_Update(ckMode);
        return;
    }
    switch (ckMode.modeName) {
        case Btl_Select.Select: 
            this.BtlSelect_Select_Update(ckMode);
            break;
        case Btl_Select.Tatakau: 
            this.BtlSelect_Tatakau_Update(ckMode.mode);
            break;
        case Btl_Select.Yarimon: 
            this.BtlSelect_Yarimon_BaseUpdate(ckMode.mode);
            break;
        case Btl_Select.Dougu:   
            this.Btl_Select_DouguUpdate(ckMode.mode);
            break;
    }
}
let Btl_SelectPicPath = Btl_PicPath + "Select/";
let NotDouguUseFlg = false;
Game_Interpreter.prototype.BtlSelect_Select_BaseDraw = function (ckMode) {
    this.SetSprite(PN_BtlSelectBase , Btl_SelectPicPath + "PN_BtlSelectBase" , BPs._x , BPs._y);
    let DrawStr = battle_Class.plYarimons[battle_Class.PLMonNo].stName + NLngStrGet("の行動");
    this.SpriteStrC(PN_BtlSelectTxt , DrawStr , 28 , BPs._x + 180 , BPs._y + 442);
    D_Text_Cng_font = "";    
    for (let i = 0; i <= 4 - 1; i++) {
        let _setY = BPs._y + 508;
        let _SpriteStr = Btl_SelectPicPath + "PN_BtlSelectBtn" + (i + 1);
        if (Checkラボorツアー() && i == 3) _SpriteStr += "_Ex";
        if (i == 1 && battle_Class.plYarimons.length == 1) _SpriteStr += "_not";
        if (i == 2 && (EndContentsBtlFlg || NotDouguUseFlg || IsEndLaboMode())) _SpriteStr += "_not";
        this.SetSprite(PN_BtlSelectBtn + i , _SpriteStr , BPs._x + 52 + (136 * i) , _setY);
    }
    this.BtlSelect_Select_MoveBtn(ckMode);
    battle_Class.TextAdd(["" , ""] , 1);
}
Game_Interpreter.prototype.BtlSelect_Select_MoveBtn = function (ckMode) {
    for (let i = 0; i <= 4 - 1; i++) {
        let _setY = BPs._y + 508;
        if (ckMode.selecterNo != i) _setY += 15;
        this.MoveSprite(PN_BtlSelectBtn + i , BPs._x + 52 + (136 * i) , _setY , 5);
    }
}
Game_Interpreter.prototype.BtlSelect_Select_Update = function (ckMode) {
    if(ckMode.mode.flame == 1) {
        battle_Class.plYarimons[battle_Class.PLMonNo].Def_Mode = false;
        battle_Class.emYarimons[battle_Class.EmMonNo].Def_Mode = false;
        TurnDownFlgReset();
        this.BtlSelect_Select_BaseDraw(ckMode); return;
    }
    this.SetSprite(PN_BtlSelecter , Btl_SelectPicPath + "PN_BtlSelecter" ,
        BPs._x + 52 + 52 + (136 * ckMode.selecterNo) , BPs._y + 508 - 11);
    let okFlg = false;
    let ckPicArr = [];
    for (let i = 0; i <= 4 - 1; i++) {
        ckPicArr.push(PN_BtlSelectBtn + i);
    }
    let ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if (ckPicNo != -1) {
        ckMode.selecterNo = ckPicNo;
        okFlg = TouchInput.isTriggered();
    }
    if (Input.isTriggered('right')) {
        ckMode.selectNo_Down();
    }
    if (Input.isTriggered('left')) {
        ckMode.selectNo_Up();
    }
    if (ckMode.IsSelecterMove) {
        this.BtlSelect_Select_MoveBtn(ckMode);
        SoundManager.playCursor();
    }
    if(Input.isTriggered('ok')) okFlg = true;
    if (okFlg) {
        if ((EndContentsBtlFlg || NotDouguUseFlg || IsEndLaboMode()) && ckMode.selecterNo == 2) return;
        SoundManager.playOk();
        DouguMenuPNSetting(PN_BtlLayer2Base + 1 , PN_BtlSelecter);
        if(!ckMode.select_OkNoCng()) {
            escapeCancel_Updateflame = 0;
        }
    }
}
const WazaId_悪あがき = 185; 
let PlayerUseWazaData = null;
let EnemyUseWazaData = null;
Game_Interpreter.prototype.BtlSelect_Tatakau_Update = function (ckMode) {
    if(ckMode.flame == 1) {
        this.BtlSelect_Tatakau_BaseDraw(ckMode);
        ckMode.selectNoMax = battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas.length - 1;
        this.BtlSelect_Tatakau_WazaBtnDraw(ckMode);
        if(!CanWazaUse()) { 
            battle_Class.ModeCng(Battle_Class.Btl_Battle);
            battle_Class.mode.Setting(WazaId_悪あがき);
            this.BtlL2PicDel(); 
            this.DelSprite(PN_BtlSelecter); 
            return;
        }
    }
    if(ckMode.flame < 5) { return; }
    let okFlg = false;
    let ckPicArr = [];
    for (let i = 0; i <= 4 - 1; i++) {
        ckPicArr.push(PN_BtlTtkBtn + (i * BtlBtnPicCnt));
    }
    let ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if(ckPicNo != -1) {
        ckMode.selecterNo = ckPicNo;
        okFlg = TouchInput.isTriggered();
    }
    if (overPointerSpCk(PN_BtlTtkSelBtn)) {
        okFlg = TouchInput.isTriggered();
    }
    this.SetSprite(PN_BtlSelecter , Btl_SelectPicPath + "PN_BtlSelecter" ,
        BPs._x + 72 + (100 * ckMode.selecterNo) , BPs._y + 494);
    if (Input.isTriggered('right')) {
        ckMode.selectNo_Down();
    }
    if (Input.isTriggered('left')) {
        ckMode.selectNo_Up();
    }
    if (ckMode.IsSelecterMove) {
        this.BtlSelect_Tatakau_WazaBtnDraw(ckMode);
        SoundManager.playCursor();
    }
    if (Input.isTriggered('ok') || okFlg) {
        SoundManager.playOk();
        if(battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[ckMode.selecterNo].reChargeTurn > 0) return;
        PlayerUseWazaData = battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[ckMode.selecterNo];
        if (PlayerUseWazaData.id == WazaID._チートタックル || PlayerUseWazaData.id == WazaID._未来への翼) {
            useFlg_チートタックル = true;
            AddExAtkCount++;
        }
        battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[ckMode.selecterNo].reChargeTurn =
            battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[ckMode.selecterNo].pp;
        let _selWazaId = battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[ckMode.selecterNo].id;
        battle_Class.ModeCng(Battle_Class.Btl_Battle);
        battle_Class.mode.Setting(_selWazaId);
        this.BtlL2PicDel(); 
        this.DelSprite(PN_BtlSelecter); 
    }
    if(Input.isTriggered('menu') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        this.BtlL2PicDel();
        ckMode.parent.ModeCng(Btl_Select.Select);
    }
}
let CanWazaUse = function () {
    for (let i = 0; i <= battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas.length - 1; i++) {
        let ckWaza = battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[i];
        if (ckWaza.reChargeTurn == 0) return true;
    }
    return false;
}
let Btl_BtlPicPath = Btl_PicPath + "Battle/";
Game_Interpreter.prototype.BtlSelect_Tatakau_BaseDraw = function (ckMode) {
    if(useFlg_チートタックル) {
        battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas.forEach(wData => {
            if (wData.id == WazaID._チートタックル && $gameVariables.value(NanidVarNo) != Nanid.Easy) {
                wData.reChargeTurn = 999999;
            }
        })
    }
    this.BtlL1PicDel();
    this.SetSprite(PN_BtlTtkBase , Btl_BtlPicPath + "PN_BtlTtkBase" , BPs._x , BPs._y);
    this.BtlSelect_Tatakau_WazaBtnDraw(ckMode);
    if(ckMode.selecterNo > battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas.length - 1) {
        ckMode.selecterNo = battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas.length - 1;
    }
}
Game_Interpreter.prototype.BtlSelect_Tatakau_WazaBtnDraw = function (ckMode) {
    for (let i = 0; i <= battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas.length - 1; i++) {
        let wazaData = battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[i];
        let setX = BPs._x + 18 + (100 * i);
        let setY = BPs._y + 509;
        setY += 25;
        let wazaWakuWinPicNo = PN_BtlTtkBtn + (i * BtlBtnPicCnt);
        if(ckMode.selecterNo == i) { 
            this.WazaWakuWinDraw(PN_BtlTtkSelBtn , wazaData , setX , setY);
            setY -= 25;
            this.MoveSprite( PN_BtlTtkSelBtn + 0 , setX , setY , 5);
            this.MoveSprite( PN_BtlTtkSelBtn + 1 , setX + 15 , setY + 15 , 5);
            if(wazaData.reChargeTurn > 0) {
                this.MoveSprite( PN_BtlTtkSelBtn + 2 , setX , setY , 1);
                this.MoveSprite( PN_BtlTtkSelBtn + 3 , setX + 66 , setY + 19 , 1);
            } else {
                this.MoveSprite( PN_BtlTtkSelBtn + 2 , setX + 33 , setY + 71 , 1);
                this.MoveSprite( PN_BtlTtkSelBtn + 3 , setX + 56 , setY + 84 , 1);
            }
            this.WazaSetuWinDraw(PN_BtlTtkWazaType , wazaData , BPs._x + 461 , BPs._y + 461);
        } else {
            this.WazaWakuWinDraw(wazaWakuWinPicNo , wazaData , setX , setY);
        }
    }
}
Game_Interpreter.prototype.WazaWakuWinDraw = function (picNo , wazaData , setX , setY , scale , iconCenterFlg) {
    scale = typeof scale !== 'undefined' ? scale : 100;
    iconCenterFlg = typeof iconCenterFlg !== 'undefined' ? iconCenterFlg : false;
    let _befTxtFont = D_Text_Cng_font;
    let setWaza = GetWazaData(wazaData.id);
    let BtnStr = "PN_BtlTtkBtn" + GetTypeNo(setWaza.type);
    this.SetSprite(picNo , Btl_BtlPicPath + BtnStr , setX , setY , 255  , scale , scale);
    DText_NRZureY = -20;
    let nameTxt = "";
    if (LngMode == "en") {
        DText_NRZureX = 2;
        DText_NRZureY = -15;
        nameTxt = setWaza.name.replace(' ', '\n');  
    } else {
        if (setWaza.name.length > 4) {
            nameTxt = setWaza.name.substr( 0, 4 ) + "\n";
            nameTxt += setWaza.name.substr(4);
        } else {
            nameTxt = setWaza.name;
        }
    }
    this.SpriteStr(picNo + 1 , SCol.Blk + SWCol.Wht + nameTxt , 22 * (scale / 100)  ,
        setX + 15 * (scale / 100) , setY + 15 * (scale / 100) , );
    DText_NRZureX = 0;
    DText_NRZureY = 0;
    let iconZureY = -22;
    if　(iconCenterFlg) iconZureY += 100;
    if(wazaData.reChargeTurn == undefined) wazaData.reChargeTurn = 0;
    if(wazaData.reChargeTurn > 0) { 
        this.SetSprite(picNo + 2 , Btl_BtlPicPath + "PN_BtlChargeWin" , setX , setY , 255  , scale , scale);
        this.SpriteStrC(picNo + 3 , " " + wazaData.reChargeTurn + " " , 24 * (scale / 100)  ,
            setX + 66 , setY + 19);
    } else {
        this.SetSprite(picNo + 2 , Btl_BtlPicPath + "PN_BtlIconAtk" ,
            setX + 33 * (scale / 100) , setY + iconZureY * (scale / 100) , 255  , scale , scale);
        DText_NRZureX = 3;
        let strSize = 24;
        let strCol = SCol.Blk + SWCol.Wht;
        if (setWaza.iryoku > 50000) {
            strSize = 18;
        }
        this.SpriteStr(picNo + 3 , strCol + " " + setWaza.iryoku + " " , strSize * (scale / 100)  ,
            setX + 48 * (scale / 100) , setY + iconZureY * (scale / 100) + 13);
        DText_NRZureX = 0;
    }
    D_Text_Cng_font = _befTxtFont; 
}
Game_Interpreter.prototype.WazaSetuWinDraw = function (picNo , wazaData , setX , setY) {
    let setWaza = GetWazaData(wazaData.id);
    let textPicNo = picNo + 1;
    let setTxtSize = 24;
    if (LngMode == "en") setTxtSize = 20;
    this.SpriteStr(textPicNo  + 0 , SCol.Blk + SWCol.Wht + setWaza.name , setTxtSize  , setX , setY);
    this.SpriteStr(textPicNo  + 1 , SCol.Blk + SWCol.Wht + NLngStrGet("ク-ル:") + wazaData.pp , 22 , setX + 229 , setY + 7);
    this.SpriteStr(textPicNo  + 2 , SCol.Blk + SWCol.Wht + NLngStrGet("威力:") + setWaza.iryoku + NLngStrGet("　命中:") + setWaza.hit ,
        24 , setX + 9 , setY + 43);
    DText_NRZureX = 1;
    if (LngMode == "en") { 
        this.SpriteStr(textPicNo  + 3 , SCol.Blk + SWCol.Wht + setWaza.setu , 16 , setX + 9 , setY + 43 + 38);
    } else{
        this.SpriteStr(textPicNo  + 3 , SCol.Blk + SWCol.Wht + setWaza.setu , 18 , setX + 9 , setY + 43 + 43);
    }
    Text_NRZureX = 0;
    let typePicStr = "PN_BtlTtkWazaType" + GetTypeNo(setWaza.type);
    this.SetSprite(picNo , Btl_BtlPicPath + typePicStr , setX + 222 , setY + 51);
}
Game_Interpreter.prototype.WazaSetuWinDel = function (picNo) {
    let textPicNo = picNo + 1;
    this.DelSpriteSpan(picNo , textPicNo  + 3)
}
let Btl_CngPicPath = Btl_PicPath + "Cng/";
Game_Interpreter.prototype.BtlSelect_Yarimon_BaseDraw = function (ckMode) {
    this.BtlL1PicDel();
    this.SetSprite(PN_BtlCngBase , Btl_CngPicPath + "PN_BtlCngBase" , BPs._x , BPs._y);
    this.BtlSelect_Yarimon_BtnDraw(ckMode);
    ckMode.selectNoMax = battle_Class.plYarimons.length - 2;
    if (battle_Class.plYarimons[battle_Class.PLMonNo].hp > 0) {
        this.BtlSelect_Yarimon_KoseiDraw(battle_Class.plYarimons[battle_Class.PLMonNo] ,0,358,180);
    }
}
Game_Interpreter.prototype.BtlSelect_Yarimon_KoseiDraw = function (ckMonData , picNo , xPos , yPos) {
    let setPicNo = PN_BtlKoseiWin + picNo * 3;
    this.SetSprite(setPicNo , Btl_SelectPicPath + "PN_BtlKoseiWin" , xPos , yPos)
    this.SpriteStr( setPicNo + 1 , SCol.Blk0 + NLngStrGet(ckMonData.Tokusei.name) , 16 , xPos + 13 , yPos + 15);
    let setSetuY = yPos + 45;
    if (LngMode == "en") {
        DText_NRZureY = -5; setSetuY -= 3;
    }
    this.SpriteStr( setPicNo + 2 , SCol.Blk0 + ckMonData.Tokusei.setu , 16 , xPos + 13 , setSetuY);
    DText_NRZureY = 0;
}
Game_Interpreter.prototype.BtlSelect_Yarimon_BaseUpdate = function (ckMode) {
    if(ckMode.flame == 1) {
        this.BtlSelect_Yarimon_BaseDraw(ckMode);
    }
    if (ckMode.selMonNo.length <= ckMode.selecterNo) ckMode.selecterNo = ckMode.selMonNo.length - 1;
    this.BtlSelect_Yarimon_KoseiDraw(battle_Class.plYarimons[ckMode.selMonNo[ckMode.selecterNo]] ,1,672,455);
    let _okFlg = false;
    let _ckPicArr = [];
    for (let i = 0; i <= 2 - 1; i++) {
        _ckPicArr.push(PN_BtlCngTikeBar + 2 + (i * BtlCngPicCnt));
    }
    let _ckPicNo = overPointerSpCkArr_GetNo(_ckPicArr);
    if(_ckPicNo != -1) {
        ckMode.selecterNo = _ckPicNo;
        _okFlg = TouchInput.isTriggered();
    }
    if (Input.isTriggered('right')) {
        ckMode.selectNo_Down();
    }
    if (Input.isTriggered('left')) {
        ckMode.selectNo_Up();
    }
    if (ckMode.IsSelecterMove) {
        SoundManager.playCursor();
        this.BtlSelect_Yarimon_BtnDraw(ckMode);
        this.BtlSelect_Yarimon_KoseiDraw(battle_Class.plYarimons[ckMode.selecterNo] ,1,672,455);
    }
    if (Input.isTriggered('ok') || _okFlg) {
        if(battle_Class.plYarimons[ckMode.selMonNo[ckMode.selecterNo]].hp <= 0) return;
        if(ckMode.hinsiCngFlg) {
            this.Btl_Yarimon_CngMove(ckMode.selMonNo[ckMode.selecterNo] , ckMode.hinsiCngFlg);
            this.BtlL2PicDel();
            this.DelSprite(PN_BtlSelecter); 
            ckMode.parent.ModeCng(Btl_Battle_CngYarimon.Back);
        } else {
            battle_Class.ModeCng(Battle_Class.Btl_Battle); 
            battle_Class.mode.CngYarimonNo = ckMode.selMonNo[ckMode.selecterNo];
            battle_Class.mode.Setting(ExWazaid.MonCng);
            this.BtlL2PicDel();
            this.DelSprite(PN_BtlSelecter); 
        }
        SoundManager.playOk();
    }
    if(Input.isTriggered('menu') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        this.BtlL2PicDel();
        this.DelSprite(PN_BtlSelecter); 
        ckMode.parent.ModeCng(Btl_Select.Select);
    }
}
Game_Interpreter.prototype.BtlSelect_Yarimon_BtnDraw = function (ckMode) {
    let _setX = BPs._x + 63;
    let _setY = BPs._y + 490;
    this.SetSprite(PN_BtlSelecter , Btl_SelectPicPath + "PN_BtlSelecter" , BPs._x + 117 + (ckMode.selecterNo * 145) , BPs._y + 479);
    ckMode.selMonNo = [];
    let _vCnt = 0;
    for (let i = 0; i < battle_Class.plYarimons.length; i++) {
        if(battle_Class.PLMonNo == i) continue;
        ckMode.selMonNo.push(i);
        let _winX = _setX + (_vCnt * 145);
        let _winY = _setY;
        //     battle_Class.plYarimons[i].lv , battle_Class.plYarimons[i].starRank);
        this.YarimonWakuDraw(PN_BtlCngTikeBar + 0 + (_vCnt * BtlCngPicCnt) , battle_Class.plYarimons[i]  , _winX , _winY , battle_Class.plYarimons[i].hp);
        if (_vCnt != ckMode.selecterNo) {
            this.YarimonWakuMove(PN_BtlCngTikeBar + 0 + (_vCnt * BtlCngPicCnt) , _winX , _winY + 25 , 5);
        } else {
            this.YarimonSetuWinDraw(battle_Class.plYarimons[i]); 
        }
        _vCnt++;
    }
}
Game_Interpreter.prototype.Btl_Select_DouguUpdate = function (ckMode) {
    this.Menu_DouguUpdate(ckMode);
}
let escapeCancel_Updateflame = -1;
Game_Interpreter.prototype.Btl_EscapeCancel_Update = function (ckMode) {
    if (this.Btl_EscapeCancelEx_Update(ckMode)) return;
    escapeCancel_Updateflame++;
    if (escapeCancel_Updateflame == 1) {
        this.BtlL1PicDel();
        this.DelSprite(PN_BtlSelecter);
        let _逃走セリフ設定Str = $gameVariables.value(VN_Tr逃げるTxt);
        if(_逃走セリフ設定Str != 0) {
            battle_Class.TextAdd([_逃走セリフ設定Str , ""] , 1 , true);
        } else {
            if (!LastBtlFlg) 
                battle_Class.TextAdd([NLngStrGet("トレーナーとの戦いは逃げられない！") , NLngStrGet("にげたいけど…")] , 1 , true);
            else
                battle_Class.TextAdd([NLngStrGet("この戦いから逃げるわけにはいかない！") , ""] , 1 , true);
        }
        battle_Class.TextAdd(["" , ""] , 1);
    }
    if(escapeCancel_Updateflame == 10) {
        escapeCancel_Updateflame = -1;
        this.BtlSelect_Select_BaseDraw(ckMode);
    }
}
let escapeCancel_UpdateflameEx = -1;
let escapeCancel_Selecter = -1;
Game_Interpreter.prototype.Btl_EscapeCancelEx_Update = function (ckMode) {
    if (Checkラボorツアー()) {
        let okFlg = false;
        let exitFlg = false;
        escapeCancel_UpdateflameEx++;
        if (escapeCancel_UpdateflameEx == 1) { 
            escapeCancel_Selecter = 1;
            this.BtlL1PicDel(); 
            this.SetSprite(PN_BtlCngBase , Btl_SelectPicPath + "PN_BtlKousanBase" , BPs._x , BPs._y);
            this.Btl_EscapeCancelEx_Select(); 
        }
        let befSelectNo = escapeCancel_Selecter;
        if (Input.isTriggered('left')) escapeCancel_Selecter = 0;
        if (Input.isTriggered('right')) escapeCancel_Selecter = 1;
        if (Input.isTriggered('ok')) okFlg = true;
        let spriteSelNo = overPointerSpCkArr([PN_BtlSelectBtn + 0 , PN_BtlSelectBtn + 1]);
        if (spriteSelNo != -1) {
            escapeCancel_Selecter = spriteSelNo - PN_BtlSelectBtn;
            if (TouchInput.isTriggered()) okFlg = true;
        }
        if (TouchInput.isCancelled() || Input.isTriggered('escape')) exitFlg = true;
        if (befSelectNo != escapeCancel_Selecter) {
            SoundManager.playCursor();
            this.Btl_EscapeCancelEx_Select();
        }
        this.SetSprite(PN_BtlSelecter , Btl_SelectPicPath + "PN_BtlSelecter" , BPs._x + 105 + (escapeCancel_Selecter * 136) , BPs._y + 500);
        if (okFlg) {
            switch (escapeCancel_Selecter) {
                case 0:
                    this.BtlL1PicDel(); 
                    ckMode.CngNigeru();
                    break;
                case 1:
                    exitFlg = true;
                    break;
            }
        }
        if (exitFlg) {
            escapeCancel_UpdateflameEx = -1;
            escapeCancel_Updateflame = -1;
            this.SetSprite(PN_BtlCngBase , Btl_SelectPicPath + "PN_BtlSelectBase" , BPs._x , BPs._y);
            SoundManager.playCancel();
            this.BtlL2PicDel();
            ckMode.parent.ModeCng(Btl_Select.Select);
        }
        return true;
    }
    return false; 
}
Game_Interpreter.prototype.Btl_EscapeCancelEx_Select = function () {
    for (let i = 0; i < 2; i++) {
        let _setY = BPs._y + 508;
        let _SpriteStr = Btl_SelectPicPath + "PN_BtlSelectBtnYes";
        if (i == 1) _SpriteStr = Btl_SelectPicPath + "PN_BtlSelectBtnNo";
        if (escapeCancel_Selecter != i) _setY += 15;
        this.SetSprite(PN_BtlSelectBtn + i , _SpriteStr , BPs._x + 52 + (136 * i) , _setY);
    }
}
