let BtlEventFlg = false;
Game_Interpreter.prototype.BtlEvent_Update = function () {
    if (BtlEx_未来への翼_EvUpdateFlg) this.BtlEx_未来への翼_EvUpdate();
    return BtlEventFlg; 
}
Game_Interpreter.prototype.BtlEv_Start = function () {
    BtlEventFlg = true;
}
Game_Interpreter.prototype.BtlEv_End = function () {
    BtlEventFlg = false;
}
Game_Interpreter.prototype.BtlPicAllDel = function () {
    this.DelSpriteSpan(1 , PN_TalkBack - 1);
}
Game_Interpreter.prototype.BtlEv_TalkStart = function () {
    this.BtlEv_Start();
    $gameSwitches.setValue(SW_会話中, true);
    $gameSwitches.setValue(SW_HTalk, false);
    this.Talk_Start();
    if (LastBtlFlg && !DLC2BtlFlg)
        this.SetSprite(PN_TalkWin, "PN_TalkWin_Last", BPs._x, BPs._y);
    else
        this.SetSprite(PN_TalkWin, "PN_TalkWin", BPs._x, BPs._y);
}
Game_Interpreter.prototype.BtlEv_TalkEnd = function () {
    this.BtlEv_End();
    this.DelSprite(PN_TalkWin);
}
const BtlExPicPath = "pictures/Battle/ExEffect/";
let BtlExFlame = 0;
let BtlExEffectNo = -1;
Game_Interpreter.prototype.BtlExEffect_Update = function () {
    if (BtlExFlame > 0) {
        BtlExFlame--;
        switch (BtlExEffectNo) {
            case WazaID._未来への翼:
            case WazaID._未来への翼 - 1:
                this.BtlEx_未来への翼_Update();
                break;
            case WazaID._薙ぎ払い業:
                this.BtlEx_薙ぎ払い業_Update();
                break;
            case WazaID._終わりの翼:
                this.BtlEx_終わりの翼_Update();
                break;
            case WazaID._鋼の魂:
                this.BtlEx_鋼の魂_Update();
                break;
        }
        return true;
    }
    return false;
}
const CutInFlame = 55;
Game_Interpreter.prototype.BtlEx_カットイン設定 = function (_exImgName) {
    this.SetSpriteFIn(PN_BtlEn + 0, "Black", 0, 0, 0, 0, 3, 180);
    this.SetSpriteC(PN_Ensyutu, BtlExPicPath + _exImgName, 720 - 100, 355, 0);
    StacMoveSprite(PN_Ensyutu, 730, true, 10, 255);
    StacWaitPict(PN_BtlEn + 0, CutInFlame - 15);
    StacMoveSprite(PN_Ensyutu, 750, true, CutInFlame - 15);
    StacMoveSprite(PN_BtlEn + 0, true, true, 5, 0);
    StacMoveSprite(PN_Ensyutu, 720 + 100, true, 10, 0);
}
Game_Interpreter.prototype.BtlEx_ピクチャフラッシュ = function (_flashImg, _flame) {
    this.SetSprite(PN_Ensyutu, _flashImg, 0, 0, 0);
    StacMoveSprite(PN_Ensyutu, true, true, _flame);
    StacMoveSprite(PN_Ensyutu, true, true, _flame, 0);
}
Game_Interpreter.prototype.BtlEx_ピクチャフラッシュON = function (_flashImg , _flame) {
    this.SetSprite(PN_Ensyutu, _flashImg, 0, 0, 0);
    StacMoveSprite(PN_Ensyutu, true, true, _flame);
}
Game_Interpreter.prototype.BtlEx_ピクチャフラッシュOFF = function (_flame) {
    StacMoveSprite(PN_Ensyutu, true, true, _flame, 0);
}
Game_Interpreter.prototype.BtlEx_カットイン画像表示 = function (_exImgName) {
    this.DelSprite(PN_Ensyutu + 2);
    this.SetSpriteFIn(PN_BtlEn, "Black", 0, 0, 0, 0, 5, 180);
    this.SetSpriteFIn(PN_Ensyutu + 1, BtlExPicPath + _exImgName, 0, 0, 0 , 0 , 5);
}
Game_Interpreter.prototype.BtlEx_カットイン削除 = function () {
    this.MoveSprite(PN_BtlEn , true, true, 10 , 0);
    this.MoveSprite(PN_Ensyutu + 1 , true, true, 10 , 0);
    this.DelSprite(PN_Ensyutu + 2);
}
Game_Interpreter.prototype.BtlEx_カットインセリフ表示 = function (_exImgName) {
    this.SetSpriteFIn(PN_Ensyutu + 2, BtlExPicPath + _exImgName, 0, 0, 0 , 0 , 5);
}
let BtlEx_未来への翼_EvUpdateFlg = false;
Game_Interpreter.prototype.BtlEx_未来への翼_EvStart = function () {
    BtlExEffectNo = WazaID._未来への翼;
    BtlExFlame = AsuBtlExSetFlame;
    this.PlaySe("_zSanda1");
    this.BtlEx_カットイン設定("CutIn_Furea");
    BtlEx_未来への翼_EvUpdateFlg = true;
    this.StopPtcSc(333); 
}
let AsuZureX = -703;
let AsuZureY = -309;
const AsuBtlExSetFlame = 150;
Game_Interpreter.prototype.BtlEx_未来への翼 = function () {
    BtlExEffectNo = WazaID._未来への翼;
    BtlExFlame = AsuBtlExSetFlame;
    this.PlaySe("_zSanda1");
    this.BtlEx_カットイン設定("CutIn_Furea");
}
Game_Interpreter.prototype.BtlEx_未来への翼_Update = function () {
    switch (BtlExFlame) {
        case AsuBtlExSetFlame - CutInFlame:
            this.MoveSprite(PN_PlYarimon, playerYarimonX - 30, playerYarimonY, 7);
            this.SetSprite(PN_PlYarimon, BtlExPicPath + "WazaEffect",
                playerYarimonX + AsuZureX - 30, playerYarimonY + AsuZureY);
            break;
        case AsuBtlExSetFlame - CutInFlame - 7:
            this.MoveSprite(PN_PlYarimon, enemyYarimonX + AsuZureX - 400, playerYarimonY + AsuZureY, 8);
            this.SetPtcPic("btl_189_5", enemyYarimonX - 500, enemyYarimonY, 5555);
            break;
        case AsuBtlExSetFlame - CutInFlame - 15: 
            EasingStr = "easeInQuad";
            this.MoveSprite(PN_PlYarimon, enemyYarimonX + AsuZureX - 300, playerYarimonY + AsuZureY, 35);
            EasingStr = "";
            $gameScreen.startShake(2, 9, 60);
            break
        case AsuBtlExSetFlame - CutInFlame - 50:
            this.BtlEx_ピクチャフラッシュ("White" , 5);
            this.PlayPtcPic("btl_189", enemyYarimonX, enemyYarimonY);
            this.PlayPtcPic("btl_189_3", enemyYarimonX, enemyYarimonY);
            this.PlayPtcPic("btl_189_4", enemyYarimonX, enemyYarimonY);
            this.StopPtcSc(5555);
            break;
        case AsuBtlExSetFlame - CutInFlame - 55:
            this.PlayPtcPic("btl_189_2", enemyYarimonX, enemyYarimonY);
            this.MoveSprite(PN_PlYarimon, enemyYarimonX + AsuZureX + 1100, playerYarimonY + AsuZureY, 5);
            if (BtlEx_未来への翼_EvUpdateFlg) {
                this.SetSprite(PN_Ensyutu, "White", 0, 0, 0);
                this.MoveSprite(PN_Ensyutu , true , true , 5);
                this.SetCmnEvent(CN_ラスボス第形３態撃破_2); 
            }
            break;
        case AsuBtlExSetFlame - CutInFlame - 70:
            if (BtlEx_未来への翼_EvUpdateFlg) {
                BtlEx_未来への翼_EvUpdateFlg = false;
                BtlExFlame = 0;
            }
            break;
        case 5: 
            if (DLC2Btlチケフレア復活Flg) {
                this.SetSpriteC(PN_PlYarimon, Btl_Yarimon + "mon335_2", playerYarimonX - 50, playerYarimonY, 0);
            } else {
                this.SetSpriteC(PN_PlYarimon, Btl_Yarimon + "mon335", playerYarimonX - 50, playerYarimonY, 0);
            }
            this.MoveSprite(PN_PlYarimon, playerYarimonX, playerYarimonY, 15);
            break;
    }
}
const _薙ぎ払い業演出Flame = 240;
Game_Interpreter.prototype.BtlEx_薙ぎ払い業 = function () {
    BtlExEffectNo = WazaID._薙ぎ払い業;
    BtlExFlame = _薙ぎ払い業演出Flame;
}
const _薙ぎ払い業演出_fstAtkFlm = 80;
Game_Interpreter.prototype.BtlEx_薙ぎ払い業_Update = function () {
    switch (BtlExFlame) {
        case _薙ぎ払い業演出Flame - 7: 
            this.SetSpriteC(PN_ExPicEffect, BtlExPicPath + "CrstlBit", playerYarimonX, playerYarimonY, 0);
            this.MoveSprite(PN_ExPicEffect, true, true, 10, 255);
            //$gameScreen.rotatePicture(PN_ExPicEffect, 15); //回転ビットの出現
            RotateSprite(PN_ExPicEffect , 40);
            this.PlayPtcPic("btl_197_5", playerYarimonX, playerYarimonY);
            this.NPtcComboSet("Bim197",Ptc_CType.Pic,[playerYarimonX, playerYarimonY]);
            break;
        case _薙ぎ払い業演出Flame - _薙ぎ払い業演出_fstAtkFlm: 
            this.MoveSprite(PN_ExPicEffect, true, true, 10, 0);
            this.PlayPtcPic("btl_197_1", playerYarimonX, playerYarimonY);
            $gameScreen.startShake(2, 9, 45);
            break;
        case _薙ぎ払い業演出Flame - _薙ぎ払い業演出_fstAtkFlm - 15: 
            this.PlayPtcPic("btl_197_2", playerYarimonX, playerYarimonY);
            break;
        case _薙ぎ払い業演出Flame - _薙ぎ払い業演出_fstAtkFlm - 30: 
            this.PlayPtcPic("btl_197_1", playerYarimonX, playerYarimonY - 50);
            break;
        case _薙ぎ払い業演出Flame - _薙ぎ払い業演出_fstAtkFlm - 40: 
            this.PlayPtcPic("btl_197_1", playerYarimonX, playerYarimonY - 50);
            break;
        case _薙ぎ払い業演出Flame - _薙ぎ払い業演出_fstAtkFlm - 48: 
            this.PlayPtcPic("btl_191", playerYarimonX - 50, playerYarimonY - 50);
            break;
        case _薙ぎ払い業演出Flame - _薙ぎ払い業演出_fstAtkFlm - 56: 
            this.PlayPtcPic("btl_191", playerYarimonX + 50, playerYarimonY + 50);
            break;
        case _薙ぎ払い業演出Flame - _薙ぎ払い業演出_fstAtkFlm - 90: 
            $gameScreen.startShake(2, 9, 30);
            this.PlayPtcPic("btl_197_3", playerYarimonX, playerYarimonY);
            break;
        case _薙ぎ払い業演出Flame - _薙ぎ払い業演出_fstAtkFlm - 110: 
            this.BtlEx_ピクチャフラッシュ("White" , 5);
            this.PlayPtcPic("btl_197_4", playerYarimonX, playerYarimonY + 150);
            break;
        case 5: 
            break;
    }
}
const _終わりの翼演出Flame = 240;
Game_Interpreter.prototype.BtlEx_終わりの翼 = function () {
    BtlExEffectNo = WazaID._終わりの翼;
    BtlExFlame = _終わりの翼演出Flame;
    this.PlaySe("_zSanda1");
    this.BtlEx_カットイン設定("CutIn_Gost");
}
Game_Interpreter.prototype.BtlEx_終わりの翼_Update = function () {
    switch (BtlExFlame) {
        case _終わりの翼演出Flame - CutInFlame:
            this.BtlEx_ピクチャフラッシュ("Red", 5);
            this.SetPtcPic("btl_198_5", enemyYarimonX, enemyYarimonY, 5555);
            break;
        case _終わりの翼演出Flame - CutInFlame - 5:
            this.PlaySe("ice_spell_freeze_small_04");
            this.CngSprite(PN_EmYarimon, EventCgPath + "monLast_atk");
            $gameScreen.startShake(2, 9, _終わりの翼演出Flame - CutInFlame - 5);
            break;
        case _終わりの翼演出Flame - CutInFlame - 10:
            this.MoveSpriteAdd(PN_EmYarimon, 30, 0, 10);
            break;
        case _終わりの翼演出Flame - CutInFlame - 20:
            EasingStr = "easeInQuad";
            this.MoveSprite(PN_EmYarimon, enemyYarimonX - 70, true, 40);
            EasingStr = "";
            break;
        case _終わりの翼演出Flame - CutInFlame - 60:
            this.MoveSprite(PN_EmYarimon, playerYarimonX - 1500, true, 5);
            this.SetPtcPic("btl_198", enemyYarimonX - 500, enemyYarimonY);
            this.SetPtcPic("btl_198_2", enemyYarimonX - 500, enemyYarimonY);
            break;
        case _終わりの翼演出Flame - CutInFlame - 120:
            this.BtlEx_ピクチャフラッシュ("White", 5);
            this.NPtcComboSet("CmbOwari", Ptc_CType.Pic, [playerYarimonX, playerYarimonY]);
            break;
        case 5:
            this.PlaySe("BtlCtrHit");
            this.SetSpriteC(PN_EmYarimon , EventCgPath + "monLast" , enemyYarimonX + 50 , enemyYarimonY , 0);
            this.MoveSpriteAdd(PN_EmYarimon , -50 , 0 , 15 , 255);
            break;
    }
}
const _鋼の魂演出Flame = 50 + 30 + 60 + 10;
Game_Interpreter.prototype.BtlEx_鋼の魂_Start = function () {
    BtlExFlame = _鋼の魂演出Flame;
}
const PN_BtlExPsvEffect = 475;
let DLC2Btlチケフレア復活Flg = false;
Game_Interpreter.prototype.BtlEx_鋼の魂_Update = function () {
    switch (BtlExFlame) {
        case _鋼の魂演出Flame - 1: 
            this.PlaySe("_zbDown");
            this.MoveSpriteAdd(PN_PlYarimon, 0, 50, 40, -255);
            break;
        case _鋼の魂演出Flame - 50: 
            EasingStr = "easeOutQuad";
            this.PlaySe("_zWind4");
            this.BtlBarDraw(true);
            this.SetSprite(PN_BtlExPsvEffect, BtlExPicPath + "Psv_Hagane",50, 0 , 0);
            this.MoveSprite(PN_BtlExPsvEffect , 20 , 0 , 30);
            this.BtlTextDrawSingle(NLngStrGet("相棒の魂の熱がチケフレアに届く！"));
            EasingStr = "";
            break;
        case _鋼の魂演出Flame - 50 - 30: 
            this.MoveSprite(PN_BtlExPsvEffect , 0 , 0 , 40);
            break;
        case _鋼の魂演出Flame - 50 - 30 - 60:
            this.MoveSprite(PN_BtlExPsvEffect , -50 , 0 , 10 , 0);
            this.MoveSpriteAdd(PN_PlYarimon, 0, -50, 40);
            if (DLC2BtlFlg) {
                this.CngSprite(PN_PlYarimon , Btl_Yarimon + "mon335_2");
                if (!DLC2Btlチケフレア復活Flg) {
                    battle_Class.plYarimons[0].S_Def *= 1.5; 
                    DLC2Btlチケフレア復活Flg = true;
                }
            }
            this.PlayPtcPic("SinkaEff", playerYarimonX, playerYarimonY);
            if ($gameVariables.value(NanidVarNo) != Nanid.Easy) {
                battle_Class.TextAdd([NLngStrGet("チケフレアは踏みとどまった…！次はない！"), ""], 60);
            } else {
                battle_Class.TextAdd([NLngStrGet("チケフレアは踏みとどまった…！"), ""], 60);
            }
            break;
    }
}
const CN_ラスボス第１形態撃破 = 181;
const CN_ラスボス第２形態撃破 = 472;
const CN_ラスボス第３形態撃破 = 182;
const CN_ラスボス第形３態撃破_2 = 183;
const CN_DLCボス第１形態撃破 = 459;
const CN_DLCボス第２形態撃破 = 458;
const CN_DLCボス第３形態撃破 = 457;
Game_Interpreter.prototype.LastEmYarimonDown = function () {
    if (DLC2BtlFlg) {
        if (battle_Class.EmMonNo == 0) { 
            this.BtlEv_Start(); 
            this.PlaySe("_zbDown");
            this.MoveSpriteAdd(PN_EmYarimon , 0 , 50 , 40 , 0);
            this.SetCmnEvent(CN_DLCボス第１形態撃破);
        }
        else if(battle_Class.EmMonNo == 1) { 
            this.BtlEv_Start(); 
            this.SetCmnEvent(CN_DLCボス第２形態撃破);
        }
        else {
            this.SetCmnEvent(CN_DLCボス第３形態撃破);
        }
    } else {
        if (battle_Class.EmMonNo == 0) { 
            this.BtlEv_Start(); 
            this.SetSprite(PN_EmYarimon_Ex, EventCgPath + "monLast_1", enemyYarimonX, enemyYarimonY, 0);
            this.SetSprite(PN_EmYarimon_Ex, EventCgPath + "monLast_2", enemyYarimonX, enemyYarimonY, 0);
            this.SetSprite(PN_TalkWin, "PN_TalkWin_Last", BPs._x, BPs._y);
            this.SetCmnEvent(CN_ラスボス第１形態撃破);
        }
        else if(battle_Class.EmMonNo == 1) { 
            this.BtlEv_Start(); 
            this.SetSprite(PN_TalkWin, "PN_TalkWin_Last", BPs._x, BPs._y);
            this.SetCmnEvent(CN_ラスボス第２形態撃破);
        }
        else {
            this.SetCmnEvent(CN_ラスボス第３形態撃破);
        }
    }
    EmTurnDownFlg = true;
}
Game_Interpreter.prototype.LastEmCng_1 = function () {
    this.DelSprite(PN_TalkWin);
    this.BtlTextDrawSingle(NLngStrGet("T-03 は 気合で踏みとどまっている"));
    this.SetSpriteC(PN_EmYarimon, EventCgPath + "monLast_1", enemyYarimonX, enemyYarimonY);
    this.SetSpriteC(PN_EmYarimon_Ex, EventCgPath + "monLast_3", enemyYarimonX, enemyYarimonY -10 , 0);
    this.MoveSpriteAdd(PN_EmYarimon_Ex, 0, 10, 15);
}
Game_Interpreter.prototype.LastEmCng_1b = function () {
    this.MoveSprite(PN_BtlStBarLast + 1, true, true, 60, 255, 100);
}
Game_Interpreter.prototype.LastEmCng_2 = function () {
    this.DelSprite(PN_TalkWin);
    enemyYarimonY -= 20; 
    this.SetSpriteC(PN_EmYarimon, EventCgPath + "monLast", enemyYarimonX, enemyYarimonY);
    this.SpriteCngColor(PN_EmYarimon, [-255, -255, -255, 0], 0);
    this.MoveSprite(PN_BtlStBarLast + 1, true, true, 60, 255, 100);
}
Game_Interpreter.prototype.LastEmCng_3 = function () {
    this.SpriteCngColor(PN_EmYarimon, [0, 0, 0, 0], 180);
}
Game_Interpreter.prototype.DLC2EmCng_1 = function () {
    this.DelSprite(PN_TalkWin);
    this.SetSpriteC(PN_EmYarimon , Btl_Yarimon + "monLast_DLC2_0002" ,
        enemyYarimonX + 50 , enemyYarimonY + 50 , 0);
    this.MoveSpriteAdd(PN_EmYarimon , 0 , -50 , 30); 
}
Game_Interpreter.prototype.DLC2EmCng_2 = function () {
    this.DelSprite(PN_TalkWin);
    this.SetSpriteC(PN_EmYarimon , Btl_Yarimon + "monLast_DLC2_0003" ,
        enemyYarimonX + 50 , enemyYarimonY + 50 , 0);
    this.MoveSpriteAdd(PN_EmYarimon , 0 , -50 , 30); 
}
