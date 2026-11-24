Game_Interpreter.prototype.Bef_BtlStart_点滅演出Update = function () {
    if (battle_Class.mode.modeName == Btl_Start.Bef_Start) {
        this.DelSprite(PN_TalkWin);
        this.DelSprite(PN_BtlMaeBack + 0);
        this.DelSprite(PN_BtlMaeBack + 1);
        battle_Class.isYasei = (Number(this._params[1]) == 999);
        this.Bef_BtlStart_Update();
        return true; 
    }
    return false;
}
const btlBef点滅Flame = 10;
Game_Interpreter.prototype.Bef_BtlStart_Update = function () {
    let _mode = battle_Class.mode;
    if (Btl開始EffFlg) {
        battle_Class.mode.ModeCng(Btl_Start.Start);
        Btl開始EffFlg = false;
        return;
    }
    if (_mode.mode.flame == 0) {
        this.PlayBgm($gameSystem.btlBGM);
        this.DelSpriteSpan(PN_BtlMaeBall , PN_BtlMaeTxt + 2);
        for (let i = 0; i <= btlNewWazaSave.length - 1; i++)
            btlNewWazaSave[i] = $gameSystem.NewWazaArr[i];
    }
    battle_Class.Update();
    if (_mode.mode.flame == 1 || _mode.mode.flame == btlBef点滅Flame * 2) {
        this.SetSpriteFIn(PN_BtlEn , Btl_PicPath + "PN_BtlBack_White" , BPs._x , BPs._y , 0 , 0 , btlBef点滅Flame);
        if ($gameSwitches.value(SW_TrStarTrn)) {
            this.PlaySe("ice_Hissatu");
        }
    }
    if (_mode.mode.flame == btlBef点滅Flame * 1 || _mode.mode.flame ==  btlBef点滅Flame * 3) {
        this.MoveSprite(PN_BtlEn , true , true , btlBef点滅Flame , 0);
    }
    if (_mode.mode.flame == btlBef点滅Flame * 4) {
        this.SetSprite(PN_BtlEn + 1 , Btl_PicPath + "PN_BefBtl" , -1440 , 0);
        this.SetSprite(PN_BtlEn + 2 , Btl_PicPath + "PN_BefBtl" , 1440 , 0);
        EasingStr = "easeInQuad";
        this.MoveSprite(PN_BtlEn + 1 , 0 , true , 30);
        this.MoveSprite(PN_BtlEn + 2 , 16 , true , 30);
        EasingStr = "";
    }
    if (_mode.mode.flame == 80) {
        if ($gameSwitches.value(SW_TrStarTrn)) {
            this.SetPtcPic("StarTrnStart",712,400);
        }
    }
    if (_mode.mode.flame == btlBef点滅Flame * 4 + 60) {
        this.SetSprite(PN_BtlEn + 4 , Btl_PicPath + "PN_BtlBack" , BPs._x , BPs._y);
        battle_Class.mode.ModeCng(Btl_Start.Start);
    }
}
Game_Interpreter.prototype.BtlStart_Draw = function () { 
    this.SetSprite(PN_BtlBackGnd  , Btl_PicPath + "PN_BtlBack_White" , BPs._x , BPs._y);
    this.SetSprite(PN_BtlTalkWin  , Btl_PicPath + "Btl_Self" , BPs._x , BPs._y);
}
Game_Interpreter.prototype.BtlStart_Update = function (ckMode) {
    if (!LastBtlFlg) { 
        playerYarimonX = 497;
        enemyYarimonX = 786 + 156;
        playerYarimonY = yarimonBaseY;
        enemyYarimonY = yarimonBaseY;
    } else {
        playerYarimonX = 202 + 156;
        enemyYarimonX = 800 + 222;
        playerYarimonY = 214 + 145;
        enemyYarimonY = 109 + 212;
    }
    if (bustUpFlg && ckMode.modeName != Btl_Start.Trn_BustUp) {
        this.DelSprite(PN_BtlBustBackEff);
    }
    bustUpFlg = false;
    let ckFlame = ckMode.modeflame;
    switch (ckMode.modeName) {
        case Btl_Start.Start:
            if (ckFlame == 1) {
                this.SetSprite(PN_BtlEn + 1 , Btl_PicPath + "PN_BefBtl" , 0 , 0);
                this.SetSprite(PN_BtlEn + 2 , Btl_PicPath + "PN_BefBtl" , 16 , 0);
                this.SetSprite(PN_PicFlame, "PN_PicFlame", 0, 0);
                BtlEndAddYarimon = null; 
                EasingStr = ""
                if (LastBtlFlg) { 
                    ckMode.ModeCng(Btl_Start.LastBtl);
                } else {
                    this.BtlStart_Draw(); 
                    EasingStr = "easeOutQuad";
                    this.SetSpriteC(PN_BtlEn + 4 , Btl_PicPath + "PN_BtlStart" , 1440 / 2 , 810 / 2 , 255 , 0 , 0 );
                    this.MoveSprite(PN_BtlEn + 4 , true, true , 60 , 255 , 800 , 800); 
                    if (battle_Class.isYasei) {
                        ckMode.ModeCng_Flame(Btl_Start.Yasei , 45);
                    } else {
                        ckMode.ModeCng_Flame(Btl_Start.Trn_BustUp , 45);
                    }
                }
                if (DbgFlg) this.BtlDbgDraw();
            }
            break;
        case Btl_Start.LastBtl: 
            if (DLC2BtlFlg) {
                if (ckFlame == 1) {
                    _フレーム上情報非表示();
                    this.DelSpriteSpan(0 , 510);
                    this.SetSprite(PN_BtlBackGnd , "LastBtlBackDLC2",0,0);
                    this.SetSpriteC(PN_BtlEn + 0, "PN_PicNoice", 1440 / 2,810 / 2 , 130);
                    this.SetPtcPic("DLC2BtlEff",600,100,333);
                }
                if (ckFlame == 10) {
                    this.SetSpriteC(PN_PlYarimon , Btl_Yarimon + "mon335" , playerYarimonX - 100 , playerYarimonY , 0);
                    this.MoveSpriteAdd(PN_PlYarimon , 100 , 0 , 15);
                    this.SetSpriteC(PN_EmYarimon , Btl_Yarimon + "monLast_DLC2_0001" , enemyYarimonX + 50 , enemyYarimonY , 0);
                    this.MoveSpriteAdd(PN_EmYarimon , -50 , 0 , 15); 
                }
                if (ckFlame == 40) {
                    this.SetSprite(PN_PicFlame , "PN_PicFlame_DLC2" , 0 , 0);
                    this.Btl_Start_PlYarimonState();
                    this.BtlBarDraw();
                    this.SetSpriteC(PN_BtlEn + 0, "PN_PicNoice", 1440 / 2,810 / 2 , 200);
                    this.MoveSprite(PN_BtlEn + 0 , true , true , 20 , 0);
                    this.BtlEv_TalkStart();
                    this.SetCmnEvent(461);
                    ckMode.ModeCng(Btl_Start.End);
                } else {
                    if (ckFlame % 5 == 4) {
                        this.SetSpriteC(PN_BtlEn + 0, "PN_PicNoice", 1440 / 2,810 / 2 , Math.floor( Math.random() * 250));
                    }
                }
            } else {
                if (ckFlame == 1) {
                    this.DelSpriteSpan(0 , 510);
                    this.SetSprite(PN_BtlBackGnd , "LastBtlBack",0,0);
                    this.LastBlackSet();
                    this.SetPtcPic("LastBtlEff",600,0,333);
                }
                if (ckFlame == 20) {
                    this.LastBlack落下(); 
                }
                if (ckFlame == 30) { 
                    this.SetSpriteC(PN_PlYarimon , Btl_Yarimon + "mon335" , playerYarimonX - 100 , playerYarimonY , 0);
                    this.MoveSpriteAdd(PN_PlYarimon , 100 , 0 , 15);
                    this.SetSpriteC(PN_EmYarimon , Btl_Yarimon + "monLast" , enemyYarimonX + 50 , enemyYarimonY , 0);
                    this.MoveSpriteAdd(PN_EmYarimon , -50 , 0 , 15);
                }
                if (ckFlame == 60) {
                    this.SetSprite(PN_PicFlame , "PN_PicFlame_Last" , 0 , 0);
                    this.Btl_Start_PlYarimonState();
                    this.BtlBarDraw();
                }
                if (ckFlame == 90) {
                    this.BtlEv_TalkStart();
                    this.SetCmnEvent(180);
                    ckMode.ModeCng(Btl_Start.End);
                }
            }
            break;
        case Btl_Start.Yasei:
            this.MoveSprite(PN_BtlBustUpBack , true , true ,10 , 0);
            if (ckFlame == 1) {
                this.SetSprite(PN_BtlBackGnd  , Btl_PicBtlBack + $gameSystem.btlBackImg , BPs._x , BPs._y , 0);
                this.MoveSprite(PN_BtlBackGnd , true, true , 60);
                this.DelSpriteSpan(PN_BtlEn , PN_BtlEn + 4);
                this.PicNoCng(PN_BtlEn + 4 , PN_BtlBustBack);
                let _picPath = battle_Class.emYarimons[battle_Class.EmMonNo].YarimonData.picPath;
                this.SetSpriteC(PN_EmYarimon , Btl_Yarimon + _picPath , 786 + 450  , enemyYarimonY , 255 , -100);
                StacMoveSprite(PN_EmYarimon , enemyYarimonX , enemyYarimonY , 30 , 255 , -100);
            }
            if (ckFlame == 3) {
                this.MoveSprite(PN_BtlBustUp , true , true ,10 , 0);
                this.MoveSprite(PN_BtlBustUpBack , true , true ,10 , 0);
                ckMode.ModeCng_Flame(Btl_Start.Trn_Start , 10);
                battle_Class.TextAdd(["" , ""] , 1);
            }
            break;
        case Btl_Start.Trn_BustUp:
            bustUpFlg = true;
            if (ckFlame == 1) {
                this.DelSpriteSpan(PN_BtlEn , PN_BtlEn + 4);
                this.PicNoCng( PN_BtlEn + 4 , PN_BtlBustBack);
            }
            if (ckFlame == 2) {
                this.SetSpriteFIn( PN_BtlBustUp , Btl_EmTatie + battle_Class.Trainer.picPath + "_Bup" ,
                    BPs._x + 10 , BPs._y , -10 , 0 , 20);
                let bustBackImg = "PN_BtlBustUpBack";
                if ($gameSwitches.value(SW_TrStarTrn)) {
                    bustBackImg = "PN_BtlBustUpBack_star";
                    this.SetPtcPic("StarTrn",712,310,90);
                }
                this.SetSpriteC( PN_BtlBustUpBack , Btl_PicPath + bustBackImg , BPs._x + (BSize._x / 2) ,
                    BPs._y + (BSize._y / 2) , 0 , 100 , 0);
                this.MoveSprite(PN_BtlBustUpBack , true , true , 20 , 255 );
                this.SetSpriteC( PN_BtlBustBackEff , Btl_PicPath + "PN_BtlBustBackEff" , BPs._x + (BSize._x / 2) + (BSize._x / 2) ,
                    BPs._y + (BSize._y / 2) , 255 , 100 , 100);
                let startSelfTxt = battle_Class.Trainer.startSelf;
                if (EndContentsBtlFlg) startSelfTxt = battle_Class.Trainer.endContentsTrData.startSelf;
                if (IsEndLaboMode()) startSelfTxt = battle_Class.Trainer.endLaboTrData.startSelf;
                battle_Class.TextAdd([startSelfTxt , ""] , 10 , true);
            }
            if (ckFlame == 3) {
                this.MoveSprite(PN_BtlBustUp , true , true ,10 , 0);
                this.MoveSprite(PN_BtlBustUpBack , true , true ,10 , 0);
                ckMode.ModeCng_Flame(Btl_Start.Trn_Start , 10);
                battle_Class.TextAdd(["" , ""] , 1);
            }
            break;
        case Btl_Start.Trn_Start:
            this.StopPtcSc(90 , true); 
            if (ckFlame == 1) {
                if(!battle_Class.isYasei) {
                    this.SetSprite(PN_BtlBackGnd  , Btl_PicBtlBack + $gameSystem.btlBackImg , BPs._x , BPs._y);
                    this.SetSprite(PN_BtlPlTatie , Btl_PicPath + "Player_Tatie" , 287 + 10 , 232);
                    this.MoveSprite(PN_BtlPlTatie , 287 , true , 15);
                    this.SetSprite(PN_BtlEmTatie , Btl_EmTatie + battle_Class.Trainer.picPath , 732 - 10 , 102 , 255 , 60 , 60);
                    this.MoveSprite(PN_BtlEmTatie , 732 , true , 15 , true , true, true);
                } else {
                    this.SetSprite(PN_BtlPlTatie , Btl_PicPath + "Player_Tatie" , 287 - 150 , 232);
                    this.MoveSprite(PN_BtlPlTatie , 287 , true , 15);
                }
            }
            if (ckFlame == 30) {
                if(!battle_Class.isYasei) {
                    this.MoveSprite(PN_BtlEmTatie , 732 + 380 , true , 60 , true , true , true);
                    this.SetSpriteC(PN_EmYarimon , Btl_PicPath + "PN_SrowBoll" , 926 , 267  , 255);
                    this.PlaySpriteAnimeC(PN_EmYarimon , Btl_PicPath + "PN_SrowBollA" , 4 , 2, 926 , 267);
                    EasingStr = "easeOutQuad";
                    StacMoveSprite(PN_EmYarimon , 954 , 267 - 130 , 30);
                    EasingStr = "easeInQuad";
                    StacMoveSprite(PN_EmYarimon , 954 , 484 , 30);
                    EasingStr = "";
                    StacPlayPtcSprite(PN_EmYarimon , "BollEffect" , 954 , 484);
                    let _picPath = battle_Class.emYarimons[battle_Class.EmMonNo].YarimonData.picPath;
                    StacSetSpriteC(PN_EmYarimon , Btl_Yarimon + _picPath , enemyYarimonX , 484 , 255 , 0 ,0);
                    StacWaitSprite(PN_EmYarimon , 10);
                    EasingStr = "easeOutElastic";
                    StacMoveSprite(PN_EmYarimon , enemyYarimonX , enemyYarimonY , 20 , 255 , -100);
                    EasingStr = "";
                } else {
                    this.PicFrameEnemyReDraw();
                }
                let _name = battle_Class.plYarimons[battle_Class.PLMonNo].YarimonData.name;
                battle_Class.TextAdd([NLngStrGet("いけっ！　") + _name + "！" , ""] , 1);
            }
            if (ckFlame == 30 + 70) {
                this.Btl_Start_EmYarimonState();
            }
            if (ckFlame == 45) {
                this.MoveSprite(PN_BtlPlTatie , -100 , true , 60);
                this.SetSpriteC(PN_PlYarimon , Btl_PicPath + "PN_SrowBoll" , playerYarimonX , 267  , 255);
                this.PlaySpriteAnimeC(PN_PlYarimon , Btl_PicPath + "PN_SrowBollA" , 4 , 2, 267  , 255);
                EasingStr = "easeOutQuad";
                StacMoveSprite(PN_PlYarimon , playerYarimonX , 267 - 130 , 30);
                EasingStr = "easeInQuad";
                StacMoveSprite(PN_PlYarimon , playerYarimonX , 484 , 30);
                EasingStr = "";
                StacPlayPtcSprite(PN_PlYarimon , "BollEffect" , playerYarimonX , 484);
                let _picPath = battle_Class.plYarimons[battle_Class.PLMonNo].YarimonData.picPath;
                StacSetSpriteC(PN_PlYarimon , Btl_Yarimon + _picPath , playerYarimonX , 484 , 255 , 0 ,0);
                StacWaitSprite(PN_PlYarimon , 10);
                EasingStr = "easeOutElastic";
                StacMoveSprite(PN_PlYarimon , playerYarimonX , playerYarimonY , 20 , 255);
                EasingStr = "";
            }
            if (ckFlame == 45 + 70) {
                picFlameEnemyCharaArr[0].viewFlg = true;
                this.PicFrameEnemyReDraw();
                this.Btl_Start_PlYarimonState();
                this.BtlBarDraw(); 
            }
            if (ckFlame == 45 + 70) {
                ckMode.ModeCng(Btl_Start.End);
            }
            break;
        case Btl_Start.End:
            if(ckFlame == 1) {
                this.Btl_CngYarimon_TokuseiSetting(
                    battle_Class.plYarimons[battle_Class.PLMonNo],
                    battle_Class.emYarimons[battle_Class.EmMonNo]);
            }
            if(ckFlame == 3) {
                this.Btl_CngYarimon_TokuseiSetting(
                    battle_Class.emYarimons[battle_Class.EmMonNo],
                    battle_Class.plYarimons[battle_Class.PLMonNo]);
            }
            if(ckFlame == 5) {
                ckMode.parent.ModeCng(Battle_Class.Btl_Select); 
                ckMode.parent.mode.selecterNo = 0;
            }
            break;
    }
}
Game_Interpreter.prototype.Btl_Start_EmYarimonState = function () {
    for (let i = 1; i <= battle_Class.emYarimons.length - 1; i++) {
        this.SetSprite(PN_TemotiBoll_R + i - 1 , Btl_PicPath + "PN_TemotiBoll" , 1096 + 42 , 222 + 55 * (i - 1) , 255);
        this.MoveSprite(PN_TemotiBoll_R + i - 1 , 1096 , 222 + 55 * (i - 1) , 15);
    }
}
Game_Interpreter.prototype.Btl_Start_PlYarimonState = function () {
    let _setPsX = 340; let _setPsY = 222;
    if (LastBtlFlg) 
        _setPsX = 28;
    for (let i = 1; i <= battle_Class.plYarimons.length - 1; i++) {
        this.SetSprite(PN_TemotiBoll_L + i - 1 , Btl_PicPath + "PN_TemotiBoll" ,
            _setPsX - 42 , _setPsY + 55 * (i - 1) , 255 , -100);
        this.MoveSprite(PN_TemotiBoll_L + i - 1 , _setPsX , _setPsY + 55 * (i - 1) , 15 , 255 , -100);
    }
}
