Game_Interpreter.prototype.Menu_YarimonUpdate = function (ckMode) {
    if (ckMode.flame == 1) {
        this.Menu_YarimonDraw(ckMode);
    }
    switch (ckMode.modeName) {
        case Menu_Yarimon.Select:
            this.Menu_Yarimon_SelectUpdate(ckMode);
            break;
        case Menu_Yarimon.Detail:
            this.Menu_Yarimon_DetailUpdate(ckMode.mode);
            break
    }
};
Game_Interpreter.prototype.Menu_Yarimon_SelectUpdate = function (ckMode) {
    if (Menu_Yarimon_SelFlg) {
        this.Menu_Yarimon_Select_SelectUpdate(ckMode);
        return;
    }
    let okFlg = false;
    let ckPicNo = overPointerSpCkArr_GetNo(
        [PN_ymTikeBar + (0 * dmBtnPicCnt) + 2,
            PN_ymTikeBar + (1 * dmBtnPicCnt) + 2,
            PN_ymTikeBar + (2 * dmBtnPicCnt) + 2]
    );
    if (ckPicNo != -1) {
        ckMode.selecterNo = ckPicNo;
        okFlg = TouchInput.isTriggered();
    }
    if (!battle_Class.isBattle) {
        let _cbmArr = [[22, 583, 164, 41]];
        if (overSpriteClickable(PN_ymBase, _cbmArr) != -1) {
            ckMode.selecterNo = ckMode.selectNoMax
            okFlg = TouchInput.isTriggered();
        }
    }
    if (menuBoxSelOkFlg && ckMode.selecterNo == ckMode.selectNoMax) {
        this.SetSprite(PN_mL2Selecter, mYarimon_PPath + "PN_BoxSelect", BPs._x + 22, BPs._y + 583, 255);
    } else {
        this.SetSprite(PN_mL2Selecter, MenuPicPath + "PN_mSelecter",
            BPs._x + 163, BPs._y + 154 + (168 * ckMode.selecterNo), 255);
    }
    if (Input.isTriggered('up')) {
        ckMode.selectNo_Up(() => {
        });
    }
    if (Input.isTriggered('down')) {
        ckMode.selectNo_Down(() => {
        });
    }
    if (ckMode.IsSelecterMove) {
        SoundManager.playCursor();
        this.Menu_YarimonDraw(ckMode);
    }
    if (Input.isTriggered('ok') || okFlg) {
        SoundManager.playOk();
        if (menuBoxSelOkFlg && ckMode.selecterNo == ckMode.selectNoMax) {
            MonBox_NoClickFlame = 5;
            this.Layer2_DelSprite();
            menuBox.ModeCng(MenuBox.Select); 
            this.Layer1_DelSprite(); 
            menuBox.Menu_Close(false);
            menuBoxOpenFlg = true;
            this.SetCmnEventSc(CN_BoxOpen); 
        } else {
            this.Menu_YarimonSelectStart(ckMode);
        }
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        this.DelSprite(PN_dmSelecter);
        if (!battle_Class.isBattle) {
            this.Layer2_DelSprite();
            this.Menu_OpenDraw(false);
            menuBox.ModeCng(MenuBox.Select); 
        } else {
            this.BtlL2PicDel();
            ckMode.parent.ModeCng(Btl_Select.Select);
        }
    }
}
let mYarimon_PPath = MenuPicPath + "/Yarimon/";
Game_Interpreter.prototype.Menu_YarimonWakuDraw = function (No) {
    No = typeof No !== 'undefined' ? No : -1;
    for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
        if (No != -1) {
            if (No != i) continue;
        }
        this.YarimonWakuDraw(PN_ymTikeBar + (i * dmBtnPicCnt), $gameSystem.Player.syojiTikemon[i],
            BPs._x + 22, BPs._y + 79 + (168 * i));
    }
}
let menuBoxSelOkFlg = false;
let menuBoxOpenFlg = false;
Game_Interpreter.prototype.Menu_YarimonDraw = function (ckMode) {
    this.Menu_YarimonBaseDraw();
    ckMode.selectNoMax = $gameSystem.Player.syojiTikemon.length - 1;
    this.Menu_YarimonWakuDraw();
    menuBoxSelOkFlg = !battle_Class.isBattle && !IsEndLaboMode();
    if (menuBoxSelOkFlg) {
        ckMode.selectNoMax++; 
        if (ckMode.selecterNo > ckMode.selectNoMax) ckMode.selecterNo = 0;
        if (ckMode.selecterNo != ckMode.selectNoMax) {
            this.Menu_YarimonDetailDraw($gameSystem.Player.syojiTikemon[ckMode.selecterNo]);
        }
    } else {
        this.Menu_YarimonDetailDraw($gameSystem.Player.syojiTikemon[ckMode.selecterNo]);
    }
}
Game_Interpreter.prototype.Menu_YarimonBaseDraw = function () {
    menuBoxSelOkFlg = !battle_Class.isBattle && !IsEndLaboMode();
    if (!menuBoxSelOkFlg) {
        this.SetSprite(PN_ymBase, mYarimon_PPath + "PN_ymBase", BPs._x, BPs._y);
    } else {
        this.SetSprite(PN_ymBase, mYarimon_PPath + "PN_ymBase_b", BPs._x, BPs._y);
    }
    this.SetSprite(PN_ymTrnLvBase, mYarimon_PPath + "PN_ymTrnLvBase", BPs._x + 260, BPs._y + 0);
    this.SpriteStr(PN_ymTrnLvTxt + 0, SWCol.Blk + " " + $gameSystem.TrainerLv + " ", 22, BPs._x + 260 + 206, BPs._y + 6);
    this.SpriteStr(PN_ymTrnLvTxt + 1, SWCol.Blk + " " + $gameSystem.KeikenKakera + " ", 22, BPs._x + 260 + 206, BPs._y + 6 + 28);
    D_Text_Cng_font = ""; 
}
Game_Interpreter.prototype.Menu_YarimonDetailDraw = function (ckYarimon , endLaboFlg) {
    endLaboFlg = typeof endLaboFlg !== 'undefined' ? endLaboFlg : false;
    let zureY = 0;
    if (endLaboFlg) zureY = 10;
    let yMon = new BtlYarimonData(ckYarimon);
    this.SetSprite(PN_ymMonsPic, Btl_Yarimon + ckYarimon.YarimonData.picPath, BPs._x + 247, BPs._y + 89);
    this.SpriteStr(PN_ymTxt + 0, SCol.Blk + SWCol.Wht + ckYarimon.YarimonData.name, 26, BPs._x + 581, BPs._y + 87 + zureY);
    D_Text_Cng_font = "kdam";
    this.SpriteStr(PN_ymTxt + 1, SCol.Blk + SWCol.Wht + "Lv." + ckYarimon.lv, 24, BPs._x + 738, BPs._y + 113);
    let mHp = yMon.MHP;
    this.SpriteStrR(PN_ymTxt + 2, SCol.Blk + SWCol.Wht + " " + ckYarimon.hp + "/" + mHp + " ", 22, BPs._x + 809, BPs._y + 162 + zureY);
    this.SpriteStrC(PN_ymTxt + 3, SCol.Blk + SWCol.Wht + " " + Atk(ckYarimon) + " ", 24, BPs._x + 730, BPs._y + 213 + (38 * 0) + zureY);
    this.SpriteStrC(PN_ymTxt + 4, SCol.Blk + SWCol.Wht + " " + Def(ckYarimon) + " ", 24, BPs._x + 730, BPs._y + 213 + (38 * 1) + zureY);
    this.SpriteStrC(PN_ymTxt + 5, SCol.Blk + SWCol.Wht + " " + Agi(ckYarimon) + " ", 24, BPs._x + 730, BPs._y + 213 + (38 * 2) + zureY);
    this.SetSprite(PN_ymBarWaku, mYarimon_PPath + "PN_ymBarWaku", BPs._x + 683, BPs._y + 150 + zureY);
    this.SetSprite(PN_ymBar + 0, mYarimon_PPath + "PN_ymBar", BPs._x + 683 + 4, BPs._y + 150 + 2 + zureY);
    let hp割合 = (ckYarimon.hp / mHp) * 100;
    this.SetSprite(PN_ymBar + 1, mYarimon_PPath + "PN_ymBar", BPs._x + 683 + 4, BPs._y + 150 + 2 + zureY, 255, hp割合);
    this.SpriteCngColor(PN_ymBar + 1, BarColGet(hp割合));
    let typePicPath = "PN_ymType" + GetTypeNo(ckYarimon.YarimonData.state.type);
    this.SetSprite(PN_ymTypeImg, mYarimon_PPath + typePicPath, BPs._x + 656, BPs._y + 309 + zureY, 255);
    if (yMon.starRank == 0) {
        this.DelSprite(PN_ymStarRnk);
    } else {
        this.SetSprite(PN_ymStarRnk, mYarimon_PPath + "s" + yMon.starRank, BPs._x + 577, BPs._y + 124);
    }
    this.SpriteStr(PN_ymPsvTxt + 0, SCol.Blk0 + GetDbLocStr(yMon.Tokusei.name , yMon.Tokusei.name_Locs)  , 18, BPs._x + 474, BPs._y + 378 + zureY);
    if (LngMode == "en") {
        DText_NRZureY = -3;
        this.SpriteStr(PN_ymPsvTxt + 1, SCol.Blk0 + yMon.Tokusei.setu, 16, BPs._x + 474, BPs._y + 380 + 23 + zureY);
        DText_NRZureY = 0;
    } else {
        this.SpriteStr(PN_ymPsvTxt + 1, SCol.Blk0 + yMon.Tokusei.setu, 18, BPs._x + 474, BPs._y + 380 + 26 + zureY);
    }
    D_Text_Cng_font = "";
    this.DelSpriteSpan(PN_ymBtlTtkBtn, PN_ymBtlTtkBtn + (3 * BtlBtnPicCnt) + BtlBtnPicCnt); 
    if (!MonBoxModeFlg) {
        let ckCount = LearnWazaCounter(ckYarimon);
        if (LngMode == "en") DText_NRZureX = 2;
        if (!endLaboFlg)
            this.SpriteStr(PN_ymBtlTtkCntTxt, SCol.Blk + SWCol.Wht + NLngStrGet(" 習得技：") + ckCount + "　", 16, BPs._x + 212, BPs._y + 392);
        if (LngMode == "en") DText_NRZureX = 0;
    }
    for (let i = 0; i <= ckYarimon.btlWazas.length - 1; i++) {
        let posX = i % 2;
        let posY = Math.floor(i / 2);
        this.WazaWakuWinDraw(PN_ymBtlTtkBtn + (i * BtlBtnPicCnt), ckYarimon.btlWazas[i],
            BPs._x + 249 + 97 * posX, BPs._y + 414 + 102 * posY, 70, true);
    }
}
let BarColGet = function (hp割合) {
    if (hp割合 < 25) return [223, 33, 46];
    if (hp割合 < 50) return [227, 200, 76];
    return [0, 255, 107];
}
Game_Interpreter.prototype.MenuBoxOpenBack = function () {
    DouguMenuPNSetting(PN_mL2Base + 1, PN_mL2Selecter);
    MenuFlgSwich = true;
    menuBox.isOpen = true;
    this.Menu_OpenDraw(false);
    menuBox.ModeCng(MenuBox.Yarimon);
    this.Menu_YarimonBaseDraw();
    menuBox.mode.selecterNo = 0;
    this.Menu_YarimonDraw(menuBox.mode);
    menu_Update_SkipFlame = 3;
}
let Menu_Yarimon_SelFlg = false;
let Menu_Yarimon_SelNo = 0;
let Menu_Yarimon_SelNoMax = 0;
let Menu_Yarimon_SelArr = [];
let befLvUpFlg = false;
let Menu_YarimonPicArr = [];
Game_Interpreter.prototype.Menu_YarimonSelectStart = function (ckMode) {
    Menu_Yarimon_SelFlg = true;
    Menu_Yarimon_SelNo = 0;
    let yarimon = $gameSystem.Player.syojiTikemon[ckMode.selecterNo];
    let yarimonData = yarimon.YarimonData;
    let setY = 195 + ckMode.selecterNo * 168;
    Menu_Yarimon_SelArr = [];
    this.DelSpriteSpan(PN_ymCkSelect + 0, PN_ymWazaCkSelect);
    Menu_YarimonPicArr = [];
    Menu_Yarimon_SelArr.push("Waza");
    let setWazaBtn = "PN_ymCkSelect";
    this.SetSprite(PN_ymTrnLvBase - 1, MonBox_PicPath + "PN_bxBlack_2_m" + ckMode.selecterNo, BPs._x, BPs._y, 155);
    this.SetSprite(PN_ymCkSelect + 0 + (0 * 2), mYarimon_PPath + setWazaBtn, 472, setY);
    Menu_YarimonPicArr.push(PN_ymCkSelect + 0 + (0 * 2));
    let wazaStr = NLngStrGet("わざの確認");
    if (WazaCngOkCheck(ckMode) && !IsEndLaboMode()) wazaStr = NLngStrGet("わざの変更/確認");
    let tSize = 20;
    if (LngMode == "en") tSize = 18;
    this.SpriteStr(PN_ymCkSelect + 1 + (0 * 2), SCol.Blk0 + wazaStr, tSize, 472 + 19, setY + 9);
    let setMax = 0;
    if ($gameSystem.Player.syojiTikemon.length > 1) {
        setMax++;
        this.SetSprite(PN_ymCkSelect + 0 + (setMax * 2), mYarimon_PPath + "PN_ymCkSelect", 472, setY + 50 * setMax);
        this.SpriteStr(PN_ymCkSelect + 1 + (setMax * 2), SCol.Blk0 + NLngStrGet("ならびかえ"), 20, 472 + 19, setY + 50 * setMax + 9);
        Menu_YarimonPicArr.push(PN_ymCkSelect + 0 + (setMax * 2));
        Menu_Yarimon_SelArr.push("Sort");
    }
    if (yarimon.lv > yarimonData.sinka_lv && yarimonData.sinka_lv != 0 && !yarimonData.ExPowerFlg && !IsEndLaboMode()) {
        setMax++;
        this.SetSprite(PN_ymCkSelect + 0 + (setMax * 2), mYarimon_PPath + "PN_ymCkSelect", 472, setY + 50 * setMax);
        this.SpriteStr(PN_ymCkSelect + 1 + (setMax * 2), SCol.Yel + SWCol.Blk + NLngStrGet(" ソウルアップ "), 20, 472 + 10, setY + 50 * setMax + 8);
        Menu_YarimonPicArr.push(PN_ymCkSelect + 0 + (setMax * 2));
        Menu_Yarimon_SelArr.push("Sinka");
    }
    if ($gameSystem.TrainerLv > yarimon.lv && $gameSystem.KeikenKakera > yarimon.lv && !IsEndLaboMode()) {
        setMax++;
        this.SetSprite(PN_ymCkSelect + 0 + (setMax * 2), mYarimon_PPath + "PN_ymCkSelect", 472, setY + 50 * setMax);
        this.SpriteStr(PN_ymCkSelect + 1 + (setMax * 2), SCol.Blk0 + NLngStrGet("Lvアップ") + "\\I[96]-" + yarimon.lv, 20, 472 + 19, setY + 50 * setMax + 9);
        Menu_YarimonPicArr.push(PN_ymCkSelect + 0 + (setMax * 2));
        if (befLvUpFlg) Menu_Yarimon_SelNo = setMax;
        Menu_Yarimon_SelArr.push("Lvup");
    }
    Menu_Yarimon_SelNoMax = setMax;
    D_Text_Cng_font = "";
    befLvUpFlg = false;
}
Game_Interpreter.prototype.Menu_Yarimon_Select_SelectUpdate = function (ckMode) {
    if (menu_SortFlg) {
        this.Menu_Yarimon_SortUpdate(ckMode);
        return;
    }
    if (SinkaEffect_Flg) {
        this.Menu_Yarimon_SinkaEffectUpdate(ckMode);
        return;
    }
    if (menu_Yarimon_YesNoFlg) {
        this.Menu_Yarimon_YesNoUpdate(ckMode);
        return;
    }
    let okFlg = false;
    let ckPicNo = overPointerSpCkArr_GetNo(Menu_YarimonPicArr);
    if (ckPicNo != -1) {
        Menu_Yarimon_SelNo = ckPicNo;
        okFlg = TouchInput.isTriggered();
    }
    let setY = 195 + ckMode.selecterNo * 168 + Menu_Yarimon_SelNo * 50 + 9;
    this.SetSprite(PN_mL2Selecter, MenuPicPath + "PN_mSelecter", 472 + 195, setY, 255);
    for (let i = 0; i <= Menu_Yarimon_SelNoMax; i++) {
        this.SpriteCngColor(PN_ymCkSelect + 0 + (i * 2), [-100, -100, -100]);
    }
    this.SpriteCngColor(PN_ymCkSelect + 0 + (Menu_Yarimon_SelNo * 2), [0, 0, 0]);
    if (Input.isTriggered('up')) {
        SoundManager.playCursor();
        Menu_Yarimon_SelNo--;
        if (Menu_Yarimon_SelNo < 0) {
            Menu_Yarimon_SelNo = Menu_Yarimon_SelNoMax;
        }
    }
    if (Input.isTriggered('down')) {
        SoundManager.playCursor();
        Menu_Yarimon_SelNo++;
        if (Menu_Yarimon_SelNo > Menu_Yarimon_SelNoMax) {
            Menu_Yarimon_SelNo = 0;
        }
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        this.DelSpriteSpan(PN_ymCkSelect, PN_ymWazaCkSelect);
        this.DelSprite(PN_ymTrnLvBase - 1);   
        Menu_Yarimon_SelFlg = false;
    }
    if (Input.isTriggered('ok') || okFlg) {
        SoundManager.playOk();
        this.DelSprite(PN_mL2Selecter);
        this.DelSprite(PN_ymTrnLvBase - 1);   
        let ckYarimon = $gameSystem.Player.syojiTikemon[ckMode.selecterNo];
        switch (Menu_Yarimon_SelArr[Menu_Yarimon_SelNo]) {
            case "Waza":
                $gameSystem.NewWazaArr[ckMode.selecterNo] = false;
                ckMode.ModeCng(Menu_Yarimon.Detail); 
                ckMode.mode.selYarimon = $gameSystem.Player.syojiTikemon[ckMode.selecterNo];
                this.DelSpriteSpan(PN_ymCkSelect, PN_ymWazaCkSelect);
                Menu_Yarimon_SelFlg = false;
                this.SetSprite(PN_ymTrnLvBase - 1, MonBox_PicPath + "PN_bxBlack_2_mWaza", BPs._x, BPs._y, 155);
                break;
            case "Sort":
                this.Menu_Yarimon_SortStart(ckMode);
                this.SetSprite(PN_ymTrnLvBase - 1, MonBox_PicPath + "PN_bxBlack_2_mCng", BPs._x, BPs._y, 155);
                break;
            case "Sinka":
                this.Menu_Yarimon_YesNoStart(ckMode);
                break;
            case "Lvup":
                befLvUpFlg = true;
                $gameSystem.KeikenKakera -= ckYarimon.lv;
                ckYarimon.lv += 1; 
                let yMon = new BtlYarimonData(ckYarimon);
                ckYarimon.hp = yMon.MHP;
                let yarimonData = yMon.YarimonData;
                let syojiTikemon = $gameSystem.Player.syojiTikemon[ckMode.selecterNo];
                var ckWazaLength = syojiTikemon.btlWazas.length;
                lvUpNewWazaFlg = CheckNewWazaGet_YarimonData(yarimonData, ckYarimon.lv - 1, ckYarimon.lv);
                yarimonData.wazaList.forEach(lnWaza => {
                    if (lnWaza.lv == ckYarimon.lv) {
                        if (syojiTikemon.btlWazas.length < 4) {
                            $N_Yarimon_DB.wazaDatas.forEach(_wazaData => {
                                if (_wazaData.id == lnWaza.id) {
                                    syojiTikemon.btlWazas.push(new WazaData(_wazaData.id, _wazaData.kaisu));
                                }
                            });
                        }
                    }
                });
                this.Menu_YarimonDraw(ckMode);
                this.Menu_YarimonSelectStart(ckMode);
                this.PlayPtcPic("LevelUp", 400, 265 + 170 * ckMode.selecterNo);
                if (lvUpNewWazaFlg) {
                    this.Menu_Yarimon_TxtAdd(NLngStrGet("<value> は新しい技を使えるようになった!!" , [yarimonData.name]), "");
                    $gameSystem.NewWazaArr[ckMode.selecterNo] = ckWazaLength >= 4;  
                    for (let i = 0; i <= Menu_Yarimon_SelArr.length - 1; i++) {
                        if (Menu_Yarimon_SelArr[i] == "Waza") {
                            this.CngSprite(PN_ymCkSelect + 0 + (i * 2), mYarimon_PPath + "PN_ymCkSelect_new");
                        }
                    }
                }
                break;
        }
        if (Menu_Yarimon_SelNo == 0) {
        }
        if (Menu_Yarimon_SelNo == 1) {
        }
    }
}
let menu_SortFlg = false;
let menu_SortSelNo = -1;
let menu_SortSelCngNo = -1;
let befMenu_SortSelCngNo = -1;
Game_Interpreter.prototype.Menu_Yarimon_SortStart = function (ckMode) {
    menu_SortFlg = true;
    menu_SortSelNo = ckMode.selecterNo;
    menu_SortSelCngNo = ckMode.selecterNo;
    befMenu_SortSelCngNo = menu_SortSelCngNo;
    this.SetSprite(PN_SortSel + 0, MenuPicPath + "PN_SortSel1", BPs._x + 22, BPs._y + 97 + (168 * menu_SortSelNo));
    this.SetSprite(PN_SortSel + 1, MenuPicPath + "PN_SortSel2", BPs._x + 22, BPs._y + 97 + (168 * menu_SortSelCngNo));
}
Game_Interpreter.prototype.Menu_Yarimon_SortUpdate = function (ckMode) {
    let okFlg = false;
    let ckPicNo = overPointerSpCkArr_GetNo(
        [PN_ymTikeBar + (0 * dmBtnPicCnt) + 2,
            PN_ymTikeBar + (1 * dmBtnPicCnt) + 2,
            PN_ymTikeBar + (2 * dmBtnPicCnt) + 2]);
    if (ckPicNo != -1) {
        menu_SortSelCngNo = ckPicNo;
        okFlg = TouchInput.isTriggered();
    }
    if (Input.isTriggered('up')) {
        menu_SortSelCngNo--;
        if (menu_SortSelCngNo < 0) {
            menu_SortSelCngNo = $gameSystem.Player.syojiTikemon.length - 1;
        }
    }
    if (Input.isTriggered('down')) {
        menu_SortSelCngNo++;
        if (menu_SortSelCngNo >= $gameSystem.Player.syojiTikemon.length) {
            menu_SortSelCngNo = 0;
        }
    }
    if (befMenu_SortSelCngNo != menu_SortSelCngNo) {
        SoundManager.playCursor();
        befMenu_SortSelCngNo = menu_SortSelCngNo;
        this.SetSprite(PN_SortSel + 1, MenuPicPath + "PN_SortSel2", BPs._x + 22, BPs._y + 97 + (168 * menu_SortSelCngNo));
    }
    if (Input.isTriggered('ok') || okFlg) {
        this.DelSpriteSpan(PN_SortSel + 0, PN_SortSel + 1);
        if (menu_SortSelNo != menu_SortSelCngNo) {
            $gameSystem.Player.syojiTikemon =
                replaceArrayElements($gameSystem.Player.syojiTikemon, menu_SortSelCngNo, menu_SortSelNo);
            this.Menu_YarimonDraw(ckMode);
            $gameSystem.NewWazaArr = replaceArrayElements($gameSystem.NewWazaArr, menu_SortSelCngNo, menu_SortSelNo);
        }
        this.DelSpriteSpan(PN_ymCkSelect + 0, PN_ymWazaCkSelect);
        menu_SortFlg = Menu_Yarimon_SelFlg = false;
        this.DelSprite(PN_ymTrnLvBase - 1);   
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        this.DelSpriteSpan(PN_SortSel + 0, PN_SortSel + 1);
        SoundManager.playCancel();
        menu_SortFlg = false;
        this.SetSprite(PN_ymTrnLvBase - 1, MonBox_PicPath + "PN_bxBlack_2_m" + ckMode.selecterNo, BPs._x, BPs._y, 155);
    }
}
let menu_Yarimon_YesNoFlg = false;
let menu_Yarimon_YesNoNo = 0;
let menu_Yarimon_YesNoNo_Bef = 0;
Game_Interpreter.prototype.Menu_Yarimon_YesNoStart = function (ckMode) {
    Zukan_PicPath = Btl_Yarimon;
    menu_Yarimon_YesNoNo = menu_Yarimon_YesNoNo_Bef = 0;
    menu_Yarimon_YesNoFlg = true;
    this.SetSprite(PN_ymSinkaBack, mYarimon_PPath + "PN_ymSinkaBack", BPs._x, BPs._y);
    this.SetSprite(PN_mL2Selecter, MenuPicPath + "PN_mSelecter",
        BPs._x + 352 + 215 * menu_Yarimon_YesNoNo, BPs._y + 438, 255);
    let _yMon = $gameSystem.Player.syojiTikemon[ckMode.selecterNo];
    let _yData = _yMon.YarimonData;
    let _Mons = GetYarimonData_ID(_yData.sinka_id);
    this.SpriteStrC(PN_ymSinkaTxt, NLngStrGet("<value> にソウルアップさせますか？" , [_Mons.name]), 24, BPs._x + 405, BPs._y + 395);
    this.SetSprite(PN_ymSinkaMon, Zukan_PicPath + _Mons.picPath, BPs._x + 240, BPs._y + 81);
    this.SpriteCngColor(PN_ymSinkaMon, [255, 255, 255]);
}
Game_Interpreter.prototype.Menu_Yarimon_YesNoUpdate = function (ckMode) {
    this.SetSprite(PN_mL2Selecter, MenuPicPath + "PN_mSelecter",
        BPs._x + 352 + 215 * menu_Yarimon_YesNoNo, BPs._y + 438, 255);
    let _okFlg = false;
    let _ckCblMap = [
        [230, 432, 165, 38],
        [230 + 194, 432, 165, 38]
    ];
    let _ckPicNo = overSpriteClickable(PN_ymSinkaBack, _ckCblMap);
    if (_ckPicNo != -1) {
        menu_Yarimon_YesNoNo = _ckPicNo;
        if (menu_Yarimon_YesNoNo != menu_Yarimon_YesNoNo_Bef) {
            SoundManager.playCursor();
            menu_Yarimon_YesNoNo = menu_Yarimon_YesNoNo_Bef = _ckPicNo;
        }
        _okFlg = TouchInput.isTriggered();
    }
    if (Input.isTriggered('left')) {
        SoundManager.playCursor();
        menu_Yarimon_YesNoNo--;
        if (menu_Yarimon_YesNoNo != menu_Yarimon_YesNoNo_Bef) {
            menu_Yarimon_YesNoNo = menu_Yarimon_YesNoNo_Bef = 1;
        }
    }
    if (Input.isTriggered('right')) {
        SoundManager.playCursor();
        menu_Yarimon_YesNoNo++;
        if (menu_Yarimon_YesNoNo > 1) {
            menu_Yarimon_YesNoNo = menu_Yarimon_YesNoNo_Bef = 0;
        }
    }
    if (Input.isTriggered('ok') || _okFlg) {
        SoundManager.playOk();
        if (menu_Yarimon_YesNoNo == 0) { 
            this.Menu_Yarimon_SinkaEffectStart(ckMode);
        } else { 
            this.DelSpriteSpan(PN_ymSinkaBack, PN_ymSinkaMon);
            menu_Yarimon_YesNoFlg = false;
        }
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        this.DelSpriteSpan(PN_ymSinkaBack, PN_ymSinkaMon);
        menu_Yarimon_YesNoFlg = false;
        this.SetSprite(PN_ymTrnLvBase - 1, MonBox_PicPath + "PN_bxBlack_2_m" + ckMode.selecterNo, BPs._x, BPs._y, 155);
    }
}
let SinkaEffect_Flg = false;
let SinkaEffect_flame = 0;
Game_Interpreter.prototype.Menu_Yarimon_SinkaEffectStart = function (ckMode) {
    this.DelSprite(PN_mL2Selecter);
    menu_Yarimon_YesNoFlg = false;
    SinkaEffect_Flg = true;
    SinkaEffect_flame = 0;
    this.DelSprite(PN_ymSinkaTxt);
    this.SetSprite(PN_ymSinkaBack, mYarimon_PPath + "PN_ymSinkaBack_2", BPs._x, BPs._y);
}
Game_Interpreter.prototype.Menu_Yarimon_SinkaEffectUpdate = function (ckMode) {
    SinkaEffect_flame++;
    if (SinkaEffect_flame == 1) {
        this.PlayPtcPic("SinkaEff", BPs._x + 406, BPs._y + 260);
    }
    if (SinkaEffect_flame == 60) {
        let syojiTikemon = $gameSystem.Player.syojiTikemon[ckMode.selecterNo];
        let yarimonData = syojiTikemon.YarimonData;
        let sinkaYarimonData = GetYarimonData_ID(yarimonData.sinka_id);
        let sinkaZukanNo = GetYarimonZukanNo(yarimonData.sinka_id);
        $gameSystem.yZukan[sinkaZukanNo].lookFlg = true;
        $gameSystem.yZukan[sinkaZukanNo].getFlg = true;
        this.SetSprite(PN_ymSinkaMon, Zukan_PicPath + sinkaYarimonData.picPath, BPs._x + 240, BPs._y + 81);
        this.SpriteCngColor(PN_ymSinkaMon);
        this.PlayPtcPic("SinkaCng", BPs._x + 406, BPs._y + 260);
        let setWord = yarimonData.name + NLngStrGet("は") + NLngStrGet("<value>にソウルアップした！" , [sinkaYarimonData.name]);
        if (LngMode != "jp") {
            setWord = yarimonData.name + " " + NLngStrGet("<value>にソウルアップした！" , [sinkaYarimonData.name]);
        }
        this.SpriteStrC(PN_ymSinkaTxt, setWord, 28, BPs._x + 406, BPs._y + 434);
        $gameSystem.Player.syojiTikemon[ckMode.selecterNo].id = yarimonData.sinka_id;
    }
    if (SinkaEffect_flame >= 64) {
        if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
            SoundManager.playOk();
            SinkaEffect_Flg = false;
            this.DelSpriteSpan(PN_ymCkSelect, PN_ymWazaCkSelect);
            $gameSystem.Player.syojiTikemon[ckMode.selecterNo].YarimonData =
                GetYarimonData_ID($gameSystem.Player.syojiTikemon[ckMode.selecterNo].YarimonData.sinka_id);
            Menu_Yarimon_SelFlg = false; 
            this.Menu_YarimonDraw(ckMode);
        }
    }
}
let DtlWazaEditFlg = false;
Game_Interpreter.prototype.Menu_Yarimon_DetailUpdate = function (ckMode, yarimon) {
    yarimon = typeof yarimon !== 'undefined' ? yarimon : null;
    if (DtlWazaEditFlg) {
        DtlWazaEditFlg = this.DetailWazaSelecter_Update();
        if (!DtlWazaEditFlg) {
            let setWazaNo = ckMode.selecterNoX + ckMode.selecterNoY * 2;
            ckMode.selYarimon.btlWazas[setWazaNo] = new BtlWaza(GetWazaData(DtlCngWazaId));
            this.WazaWakuWinDraw(PN_ymBtlTtkBtn + (setWazaNo * BtlBtnPicCnt), ckMode.selYarimon.btlWazas[setWazaNo],
                BPs._x + 249 + 97 * ckMode.selecterNoX, BPs._y + 414 + 102 * ckMode.selecterNoY, 70, true);
            let _drowWaza = ckMode.selYarimon.btlWazas[setWazaNo];
            this.WazaSetuWinDraw(PN_ymTtkWazaType + 1, _drowWaza, BPs._x + 487, BPs._y + 464);
        }
        return;
    }
    if (ckMode.flame == 1) { 
        ckMode.selectNoMaxX = 1;
        ckMode.selectNoMaxY = 1;
        ckMode.selecterNoX = 0;
        ckMode.selecterNoY = 0;
        ckMode.selectGrid_Reset();
        let ckYarimon;
        if (yarimon == null) {
            ckYarimon = $gameSystem.Player.syojiTikemon[ckMode.parent.selecterNo];
        } else {
            ckYarimon = yarimon;
        }
        ckMode.selectGrid[0][0] = ckYarimon.btlWazas.length > 0;
        ckMode.selectGrid[0][1] = ckYarimon.btlWazas.length > 1;
        ckMode.selectGrid[1][0] = ckYarimon.btlWazas.length > 2;
        ckMode.selectGrid[1][1] = ckYarimon.btlWazas.length > 3;
        let _selWazaNo = ckMode.selecterNoX + ckMode.selecterNoY * 2;
        let _drowWaza = ckMode.selYarimon.btlWazas[_selWazaNo];
        this.WazaSetuWinDraw(PN_ymTtkWazaType + 1, _drowWaza, BPs._x + 487, BPs._y + 464);
    }
    let _setX = BPs._x + 247 + (ckMode.selecterNoX * 97);
    let _setY = BPs._y + 411 + (ckMode.selecterNoY * 102);
    this.SetSprite(PN_ymBtlTtkSel, mYarimon_PPath + "PN_ymBtlTtkSel", _setX, _setY, 255);
    let _okFlg = false;
    let _ckPicNo = overPointerSpCkArr_GetNo(
        [PN_ymBtlTtkBtn + (0 * BtlBtnPicCnt), PN_ymBtlTtkBtn + (1 * BtlBtnPicCnt),
            PN_ymBtlTtkBtn + (2 * BtlBtnPicCnt), PN_ymBtlTtkBtn + (3 * BtlBtnPicCnt)]);
    if (_ckPicNo != -1) {
        _selWazaNo = _ckPicNo;
        ckMode.selecterNoX = _selWazaNo % 2;
        ckMode.selecterNoY = Math.floor(_selWazaNo / 2);
        _okFlg = TouchInput.isTriggered();
    }
    if (Input.isTriggered('ok') || _okFlg) {
        if (IsEndLaboMode()) return;
        SoundManager.playOk();
        let _selWazaNo = ckMode.selecterNoX + ckMode.selecterNoY * 2;
        DtlCngWazaId = ckMode.selYarimon.btlWazas[_selWazaNo].id;
        this.DetailWazaSelecter_Start(ckMode);
    }
    if (Input.isTriggered('up')) {
        ckMode.selecter_Up();
    }
    if (Input.isTriggered('down')) {
        ckMode.selecter_Down();
    }
    if (Input.isTriggered('left')) { 
        ckMode.selecter_Left();
    }
    if (Input.isTriggered('right')) { 
        ckMode.selecter_Right();
    }
    if (ckMode.IsSelecterGridMove) {
        SoundManager.playCursor();
        let _selWazaNo = ckMode.selecterNoX + ckMode.selecterNoY * 2;
        let _drowWaza = ckMode.selYarimon.btlWazas[_selWazaNo];
        this.WazaSetuWinDraw(PN_ymTtkWazaType + 1, _drowWaza, BPs._x + 487, BPs._y + 464);
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        this.DelSprite(PN_ymBtlTtkSel);
        this.DelSpriteSpan(PN_ymTtkWazaType, PN_ymTtkWazaType + 4); 
        ckMode.parent.ModeCng(Menu_Yarimon.Select);
        this.WazaSetuWinDel(PN_ymTtkWazaType + 1);
        this.DelSprite(PN_ymTrnLvBase - 1);   
    }
}
let DtlWazaEditSelecter = null;
let DtlCngWazaId = -1;
let DtlWazaYData;
let DtlWazaLnArr = [];
class DetailWazaData {
    constructor(_id) {
        this.Id = _id;
        this.Cnt = 1;
    }
}
const SW_最強技Flg = 42;
let WazaCngOkCheck = function (ckMode) {
    let yarimon = $gameSystem.Player.syojiTikemon[ckMode.selecterNo];
    return LearnWazaCounter(yarimon) > 4;
}
let LearnWazaCounter = function (yarimon) {
    let ckWazaList = GetYarimonData_ID(yarimon.id).wazaList;
    let ckCounter = 0;
    ckWazaList.forEach(ckWaza => {
        if (yarimon.lv >= ckWaza.lv) ckCounter++;
    });
    let yType = yarimon.YarimonData.state.type;
    if (yType == ConstType._無 && $gameSwitches.value(SW_最強技Flg + 0)) ckCounter++;
    if (yType == ConstType._火 && $gameSwitches.value(SW_最強技Flg + 1)) ckCounter++;
    if (yType == ConstType._水 && $gameSwitches.value(SW_最強技Flg + 2)) ckCounter++;
    if (yType == ConstType._風 && $gameSwitches.value(SW_最強技Flg + 3)) ckCounter++;
    if (yType == ConstType._土 && $gameSwitches.value(SW_最強技Flg + 4)) ckCounter++;
    return ckCounter;
}
Game_Interpreter.prototype.DetailWazaSelecter_Start = function (ckMode) {
    DtlWazaEditFlg = true;
    DtlWazaEditSelecter = new ArrSelecter(5, 2);
    DtlWazaLnArr = [];
    DtlWazaYData = GetYarimonData_ID(ckMode.selYarimon.id);
    DtlWazaYData.wazaList.forEach(wazaData => {
        let addFlg = true;
        DtlWazaLnArr.forEach(learnWazaData => {
            if (wazaData.id == learnWazaData.Id) {
                learnWazaData.Cnt++;
                addFlg = false;
            }
        });
        if (addFlg) {
            DtlWazaLnArr.push(new DetailWazaData(wazaData.id));
        }
    });
    let Mons = ckMode.selYarimon;
    let _最強技SetFlg = false;
    DtlWazaLnArr.forEach(lnWData => {
        Mons.btlWazas.forEach(wData => {
            if (wData.id == 14 || wData.id == 29 || wData.id == 43 ||
                wData.id == 61 || wData.id == 82 || wData.id == 100 ||
                wData.id == 115) {
                _最強技SetFlg = true;
            }
            if (wData.id == lnWData.Id) {
                lnWData.Cnt--;
            }
        });
    });
    for (let i = 0; i <= DtlWazaLnArr.length - 1; i++) {
        if (DtlWazaLnArr[i].Cnt <= 0) { 
            DtlWazaLnArr.splice(i, 1);
            i--;
        }
    }
    for (let i = 0; i <= DtlWazaLnArr.length - 1; i++) {
        Mons.YarimonData.wazaList.forEach(lnWaza => {
            try {
                if (lnWaza.id == DtlWazaLnArr[i].Id && lnWaza.lv > Mons.lv) {
                    DtlWazaLnArr.splice(i, 1);
                    i--;
                }
            } catch (e) {
            }
        });
        try {
            if (DtlWazaLnArr[i].Cnt <= 0) { 
                DtlWazaLnArr.splice(i, 1);
                i--;
            }
        } catch (e) {
        }
    }
    if (!_最強技SetFlg) {
        switch (DtlWazaYData.state.type) {
            case ConstType._無:
                if ($gameSwitches.value(SW_最強技Flg + 0)) DtlWazaLnArr.push(new DetailWazaData(14));
                break;
            case ConstType._火:
                if ($gameSwitches.value(SW_最強技Flg + 1)) DtlWazaLnArr.push(new DetailWazaData(29));
                break;
            case ConstType._水:
                if ($gameSwitches.value(SW_最強技Flg + 2)) DtlWazaLnArr.push(new DetailWazaData(43));
                break;
            case ConstType._風:
                if ($gameSwitches.value(SW_最強技Flg + 3)) DtlWazaLnArr.push(new DetailWazaData(61));
                break;
            case ConstType._土:
                if ($gameSwitches.value(SW_最強技Flg + 4)) DtlWazaLnArr.push(new DetailWazaData(82));
                break;
            case ConstType._光:
                if ($gameSwitches.value(SW_最強技Flg + 5)) DtlWazaLnArr.push(new DetailWazaData(100));
                break;
            case ConstType._闇:
                if ($gameSwitches.value(SW_最強技Flg + 6)) DtlWazaLnArr.push(new DetailWazaData(115));
                break;
        }
    }
    if (DtlWazaLnArr.length == 0) {
        DtlWazaEditFlg = false;
        return; 
    }
    this.SetSprite(PN_ymWazaCkBack, mYarimon_PPath + "PN_ymWazaCkBack", BPs._x, BPs._y);
    for (let i = 0; i <= DtlWazaLnArr.length - 1; i++) {
        let XNo = i % 5;
        let YNo = Math.floor(i / 5);
        if (YNo > 1) break;
        DtlWazaEditSelecter.selectArr[YNo][XNo] = true;
        let wazaData = GetWazaData(DtlWazaLnArr[i].Id);
        this.WazaWakuWinDraw(PN_ymWazaCkBtn + (i * BtlBtnPicCnt),
            wazaData, BPs._x + 138 + 110 * XNo, BPs._y + 155 + 110 * YNo, 70, true);
    }
    this.SetSprite(PN_ymWazaCkSelect, mYarimon_PPath + "PN_ymBtlTtkSel", BPs._x + 138, BPs._y + 152);
    let btlWaza = new BtlWaza(GetWazaData(DtlWazaLnArr[0].Id));
    this.WazaSetuWinDraw(PN_ymTtkWazaType + 1, btlWaza, BPs._x + 487, BPs._y + 464);
}
Game_Interpreter.prototype.DetailWazaSelecter_Update = function () {
    let okFlg = false;
    let ckPicArr = [];
    for (let i = 0; i <= 10 - 1; i++) {
        ckPicArr.push(PN_ymWazaCkBtn + (i * BtlBtnPicCnt));
    }
    let _ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if (_ckPicNo != -1) {
        DtlWazaEditSelecter.selecterX = _ckPicNo % 5;
        DtlWazaEditSelecter.selecterY = Math.floor(_ckPicNo / 5);
        okFlg = TouchInput.isTriggered();
    }
    if (Input.isTriggered('ok') || okFlg) { 
        SoundManager.playOk();
        let selNo = DtlWazaEditSelecter.selecterY * 5 + DtlWazaEditSelecter.selecterX;
        DtlCngWazaId = DtlWazaLnArr[selNo].Id;
        this.DelSpriteSpan(PN_ymWazaCkBack, PN_ymWazaCkSelect);
        return false; 
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        this.DelSpriteSpan(PN_ymWazaCkBack, PN_ymWazaCkSelect);
        return false; 
    }
    if (Input.isTriggered('up')) {
        DtlWazaEditSelecter.selecter_Up();
    }
    if (Input.isTriggered('down')) {
        DtlWazaEditSelecter.selecter_Down();
    }
    if (Input.isTriggered('left')) { 
        DtlWazaEditSelecter.selecter_Left();
    }
    if (Input.isTriggered('right')) { 
        DtlWazaEditSelecter.selecter_Right();
    }
    if (DtlWazaEditSelecter.IsSelecterMove) {
        SoundManager.playCursor();
        this.SetSprite(PN_ymWazaCkSelect, mYarimon_PPath + "PN_ymBtlTtkSel", BPs._x + 138, BPs._y + 152)
        let selNo = DtlWazaEditSelecter.selecterY * 5 + DtlWazaEditSelecter.selecterX;
        let btlWaza = new BtlWaza(GetWazaData(DtlWazaLnArr[selNo].Id));
        this.WazaSetuWinDraw(PN_ymTtkWazaType + 1, btlWaza, BPs._x + 487, BPs._y + 464);
        this.SetSprite(PN_ymWazaCkSelect, mYarimon_PPath + "PN_ymBtlTtkSel",
            BPs._x + 138 + 110 * DtlWazaEditSelecter.selecterX,
            BPs._y + 152 + 110 * DtlWazaEditSelecter.selecterY);
    }
    return true;
}
