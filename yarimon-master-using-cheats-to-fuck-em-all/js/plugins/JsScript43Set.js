/* ■ 戦闘 ■■■■■■■■■■■■■■■■■■■■■■■■
0.ツクール処理の上書き
戦闘情報の初期化:
戦闘更新:Btl_Update
1.開始:Btl_Start
2.戦闘選択:Btl_Select
3.行動フェイズ:Btl_Do
4.終了:Btl_End
*/
Game_Interpreter.prototype.BattleStart = function () {
}
let LastBtlFlg = false;      
let DLC2BtlFlg = false;      
let Btl開始EffFlg = false;    
let AddExAtkCount = 0;       
let _BtlBack_Save = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    _BtlBack_Save.call(this);
    this.btlBackImg = ""; 
    this.btlBGM = ""; 
    this.WinBGM = "";
    this.WinedTrainerArr = []; 
    battle_Class.TextClear(); 
    escapeCancel_Updateflame = -1;
    escapeCancel_UpdateflameEx = -1;
};
Game_Interpreter.prototype.command283 = function () {
    $gameSystem.btlBackImg = this._params[0];
    return true;
};
Game_Interpreter.prototype.command132 = function () {
    $gameSystem.btlBGM = this._params[0].name;
    return true;
};
Game_Interpreter.prototype.command133 = function () {
    $gameSystem.WinBGM = this._params[0].name;
    return true;
};
let BtlEffAfterWait_Flame = 0;
let BtlEffAfterWait_Update = function () {
    if (BtlEffAfterWait_Flame >= 0) BtlEffAfterWait_Flame--;
    return BtlEffAfterWait_Flame > 0;
}
let bustUpFlg = false;
Game_Interpreter.prototype.BtlStartBackUpdate = function (){
    if (bustUpFlg) {
        let ckUpdateFlm = (btlFlame - 2)  % 15;
        let moveBackX = BSize._x * (ckUpdateFlm / 30);
        this.SetSpriteC( PN_BtlBustBackEff , Btl_PicPath + "PN_BtlBustBackEff" , BPs._x + (BSize._x / 2) - moveBackX ,
            BPs._y + (BSize._y / 2) , 255 , 100 , 100);
    }
}
let TalkWaitFlame = 0;
let btlFlame = 0;
Game_Interpreter.prototype.Btl_Update = function () {
    btlStartEffect = false;
    btlFlame++;
    this.BtlStartBackUpdate();
    if (this.BtlExEffect_Update()) {
        return;
    }
    if (this.BtlEvent_Update()) return;
    if (BtlEffAfterWait_Update()) return;
    battle_Class.Update(); 
    this.Btl_SeUpdate(); 
    this.Btl_TokuseiWin_Update(); 
    if (TalkWaitFlame > 0) {
        TalkWaitFlame--;
        return;
    }
    if (battle_Class.IsTextMode) {
        this.BtlText_Update(); 
        return; 
    } else {
        this.DelSpriteSpan(PN_BtlTalkWin_m, PN_BtlTalkClick_m);
        BtlMenuTalkFlg = false;
    }
    if (this.Btl_CngYarimon_TokuseiCheck()) return;
    if (this.Btl_Battle_Check_TokuseiCheck()) return;
    switch (battle_Class.modeName) { 
        case Battle_Class.Btl_Start:
            this.BtlStart_Update(battle_Class.mode);
            break;
        case Battle_Class.Btl_Select:
            this.BtlSelect_Update(battle_Class.mode);
            break;
        case Battle_Class.Btl_Battle:
            PicFlameBtlCngFlame = 5;
            this.BtlBattle_Update(battle_Class.mode);
            break;
        case Battle_Class.Btl_End:
            this.Btl_End_Update(battle_Class.mode);
            break;
    }
}
let Btl_SeList = [];
let Btl_SePlay = function (sePath) {
    Btl_SeList.push(sePath);
}
Game_Interpreter.prototype.Btl_SeUpdate = function () {
    if (Btl_SeList.length > 0) {
        Btl_SeList.forEach(sePath => {
            this.PlaySe(sePath);
        });
        Btl_SeList = [];
    }
}
/* 
battle_Class.TextAdd([
    "戦闘文字表示テスト戦闘文字表示テスト" ,
    "戦闘文字表示テスト戦闘文字表示テスト"] , 120 , true );
this.Btl_DrawText([]);
 */
let BtlMenuTalkFlg = false;
Game_Interpreter.prototype.BtlText_Update = function () {
    if (BtlMenuTalkFlg) {
        PN_BtlTalkWin = PN_BtlTalkWin_m;
        this.SetSprite(PN_BtlTalkWin, Btl_PicPath + "Btl_Self", BPs._x, BPs._y);
    } else {
        PN_BtlTalkWin = PN_BtlEnsyutu + 1;
    }
    PN_BtlTalkText = PN_BtlTalkWin + 1;
    PN_BtlTalkClick = PN_BtlTalkText + 2;
    let zureMarkY = 0;
    if (LngMode == "en") zureMarkY = 10;
    if (battle_Class.textDrawFlg) {
        let _textData = battle_Class.ViewTextData;
        this.BtlTextDraw(_textData);
        if (battle_Class.IsTextClick) { 
            this.SetSpriteC(PN_BtlTalkClick, Btl_PicPath + "PN_BtlTalkClick",
                1008, 670 + zureMarkY + battle_Class.SinClickFlame * 5);
        } else {
            this.DelSprite(PN_BtlTalkClick);
        }
    }
    if (battle_Class.IsTextClick) {
        this.SetSpriteC(PN_BtlTalkClick, Btl_PicPath + "PN_BtlTalkClick",
            1008, 670 + zureMarkY + battle_Class.SinClickFlame * 5);
    }
}
Game_Interpreter.prototype.BtlTextDraw = function (_TextData) {
    DText_NRZureY = 15; 
    if (_TextData.playSe != "") {
        this.PlaySe(_TextData.playSe);
        _TextData.playSe = "";
    }
    let _sangyoZureY = 0;
    let _sangyoZureY2 = 0;
    if (_TextData.textArr.length >= 2) {
        if (_TextData.textArr[1].indexOf("\n") != -1) {
            _sangyoZureY = -15;
            _sangyoZureY2 = _sangyoZureY - 13;
        }
    }
    if (_TextData.textArr.length >= 1) {
        if (_TextData.textArr[0].length > 50 && _TextData.textArr[0].indexOf("\n") == -1) {
            if (_TextData.textArr.length == 1 || _TextData.textArr.length >= 1 && _TextData.textArr[1] == "") {
                _TextData.textArr[0] = InsertLineBreaks(_TextData.textArr[0] , 50);
            }
        }
        this.SpriteStr(PN_BtlTalkText + 0, _TextData.textArr[0], 28,
            403 + _TextData.zureX, 581 + _TextData.zureY + _sangyoZureY);
    }
    if (_TextData.textArr.length >= 2) {
        this.SpriteStr(PN_BtlTalkText + 1, _TextData.textArr[1], 28,
            403 + _TextData.zureX, 581 + 54 + _TextData.zureY + _sangyoZureY2);
    }
    if (_TextData.textArr.length == 0) this.DelSpriteSpan(PN_BtlTalkText , PN_BtlTalkText + 1);
    if (_TextData.textArr.length == 1) this.DelSprite(PN_BtlTalkText + 1);
    DText_NRZureY = 0; 
}
Game_Interpreter.prototype.BtlTextDrawSingle = function (_txt) {
    this.DelSpriteSpan(PN_BtlTalkText, PN_BtlTalkText + 1);
    this.SpriteStr(PN_BtlTalkText + 0, _txt, 28, 403 + 0, 581 + 0);
}
Game_Interpreter.prototype.BtlBarDraw = function (_MoveFlg) {
    _MoveFlg = typeof _MoveFlg !== 'undefined' ? _MoveFlg : false;
    let _plPar = (battle_Class.plYarimons[battle_Class.PLMonNo].hp / battle_Class.plYarimons[battle_Class.PLMonNo].MHP) * 100;
    let _emBar = (battle_Class.emYarimons[battle_Class.EmMonNo].hp / battle_Class.emYarimons[battle_Class.EmMonNo].MHP) * 100;
    if (!_MoveFlg) {
        if (!LastBtlFlg) 
            this.SetSprite(PN_BtlStBase, Btl_PicPath + "PN_BtlStBase", BPs._x, BPs._y);
        else
        {
            this.MovePict(1,true,true,30,0);
            this.SetSprite(PN_BtlStBase, Btl_PicPath + "PN_BtlStBase_Last", BPs._x, BPs._y);
            if (DLC2BtlFlg) {
                this.SetSprite(PN_LastBtlEmHpWin, Btl_PicPath + "PN_LastBtlEmHpWinDLC2", 0, 0);
            } else {
                this.SetSprite(PN_LastBtlEmHpWin, Btl_PicPath + "PN_LastBtlEmHpWin", 0, 0);
            }
        }
        this.SetSpriteR(PN_BtlStBar_L + 0, Btl_PicPath + "PN_BtlStBar", BPs._x + 369, BPs._y + 49);
        this.SetSpriteR(PN_BtlStBar_L + 1, Btl_PicPath + "PN_BtlStBar", BPs._x + 369, BPs._y + 49, 255, _plPar);
        if (!LastBtlFlg) { 
            this.SetSprite(PN_BtlStBar_R + 0, Btl_PicPath + "PN_BtlStBar", BPs._x + 369 + 78, BPs._y + 49);
            this.SetSprite(PN_BtlStBar_R + 1, Btl_PicPath + "PN_BtlStBar", BPs._x + 369 + 78, BPs._y + 49, 255, _emBar);
        } else {
            this.SetSprite(PN_BtlStBarLast, Btl_PicPath + "PN_BtlStBar", 769, 110);
            this.SetSprite(PN_BtlStBarLast + 1, Btl_PicPath + "PN_BtlStBarLast", 769, 110, 255, _emBar);
        }
    } else {
        EasingStr = "easeOutQuad";
        this.MoveSprite(PN_BtlStBar_L + 1, true, true, 10, 255, _plPar);
        let _emBarPN = PN_BtlStBar_R + 1;
        if (LastBtlFlg) 
            _emBarPN = PN_BtlStBarLast + 1;
        this.MoveSprite(_emBarPN, true, true, 10, 255, _emBar);
        EasingStr = "";
    }
    this.SpriteCngColor(PN_BtlStBar_L + 1, BarColGet(_plPar));
    if (!LastBtlFlg) 
        this.SpriteCngColor(PN_BtlStBar_R + 1, BarColGet(_emBar));
    var txtCol = SCol.Blk;
    if (battle_Class.plYarimons[battle_Class.PLMonNo].ExPowerFlg) txtCol = SCol.Blu;
    this.SpriteStr(PN_BtlStTxt_L + 0, txtCol + SWCol.Wht +
        battle_Class.plYarimons[battle_Class.PLMonNo].Name, 24, BPs._x + 38, BPs._y + 15);
    if (!LastBtlFlg) {
        let monName = battle_Class.emYarimons[battle_Class.EmMonNo].Name;
        let txtSize = 24;
        if (monName.length > 6) txtSize = 20;
        var txtCol = SCol.Blk;
        if (battle_Class.emYarimons[battle_Class.EmMonNo].ExPowerFlg) txtCol = SCol.Blu;
        this.SpriteStr(PN_BtlStTxt_R + 0, txtCol + SWCol.Wht + monName, txtSize, BPs._x + 569, BPs._y + 15);
    }
    D_Text_Cng_font = "kdam";    
    if (battle_Class.plYarimons[battle_Class.PLMonNo].hp > battle_Class.plYarimons[battle_Class.PLMonNo].MHP) {
        battle_Class.plYarimons[battle_Class.PLMonNo].hp = battle_Class.plYarimons[battle_Class.PLMonNo].MHP;
    }
    if (battle_Class.emYarimons[battle_Class.EmMonNo].hp > battle_Class.emYarimons[battle_Class.EmMonNo].MHP) {
        battle_Class.emYarimons[battle_Class.EmMonNo].hp = battle_Class.emYarimons[battle_Class.EmMonNo].MHP;
    }
    this.SpriteStrR(PN_BtlStTxt_L + 2, SCol.Blk + SWCol.Wht +
        battle_Class.plYarimons[battle_Class.PLMonNo].hp + " / " + battle_Class.plYarimons[battle_Class.PLMonNo].MHP,
        22, BPs._x + 369 - 8, BPs._y + 46 + 4);
    if (!LastBtlFlg) { 
        this.SpriteStr(PN_BtlStTxt_R + 2, SCol.Blk + SWCol.Wht +
            battle_Class.emYarimons[battle_Class.EmMonNo].hp + " / " + battle_Class.emYarimons[battle_Class.EmMonNo].MHP,
            22, BPs._x + 369 + 78 + 11, BPs._y + 46 + 4);
    }
    this.SpriteStrR(PN_BtlStTxt_L + 1, SCol.Blk + SWCol.Wht + "Lv." +
        battle_Class.plYarimons[battle_Class.PLMonNo].lv, 20, BPs._x + 38 + 212, BPs._y + 16);
    if (!LastBtlFlg) { 
        var enemyDrawLv = battle_Class.emYarimons[battle_Class.EmMonNo].lv;
        if (IsEndLaboMode()) enemyDrawLv = 75;
        this.SpriteStrR(PN_BtlStTxt_R + 1, SCol.Blk + SWCol.Wht + "Lv." +
            enemyDrawLv, 20, BPs._x + 569 + 212, BPs._y + 16);
    }
    D_Text_Cng_font = "";    
    let _emGetFlg = false;
    for (let i = 0; i <= $gameSystem.yZukan.length - 1; i++) {
        if ($gameSystem.yZukan[i].id == battle_Class.emYarimons[battle_Class.EmMonNo].YarimonData.id) {
            _emGetFlg = $gameSystem.yZukan[i].getFlg;
            break;
        }
    }
    if (_emGetFlg) this.SetSpriteC(PN_EmGetIcon, Btl_PicPath + "PN_EmGetIcon", 864, 123);
    else this.DelSprite(PN_EmGetIcon); 
    this.DelSpriteSpan(PN_PLIjoIcon, PN_EmIjoIcon + 7);
    for (let i = 0; i <= battle_Class.plYarimons[battle_Class.PLMonNo].Ijos.length - 1; i++) {
        let _ipx = 361 + (i % 4) * 80;
        let _ipy = 176 + Math.floor(i / 4) * 35;
        let setImg = IjoImgGet(battle_Class.plYarimons[battle_Class.PLMonNo].Ijos[i]);
        this.SetSprite(PN_PLIjoIcon + i, setImg, _ipx, _ipy);
    }
    if (!LastBtlFlg) { 
        for (let i = 0; i <= battle_Class.emYarimons[battle_Class.EmMonNo].Ijos.length - 1; i++) {
            let _ipx = 764 + (i % 4) * 80;
            let _ipy = 176 + Math.floor(i / 4) * 35;
            let setImg = IjoImgGet(battle_Class.emYarimons[battle_Class.EmMonNo].Ijos[i]);
            this.SetSprite(PN_EmIjoIcon + i, setImg, _ipx, _ipy);
        }
    }
}
let IjoImgGet = function (_name) {
    if (_name == Ijo._凍結) return Btl_PicPath + "ijo1";
    if (_name == Ijo._炎上) return Btl_PicPath + "ijo2";
    if (_name == Ijo._泥沼) return Btl_PicPath + "ijo3";
    if (_name == Ijo._痺れ) return Btl_PicPath + "ijo4";
    if (_name == Ijo._切創) return Btl_PicPath + "ijo5";
    if (_name == Ijo._呪い) return Btl_PicPath + "ijo6";
    if (_name == Ijo._Get) return Btl_PicPath + "ijo10";
}
let setTokuseiFlame = 120;
let playerTokuseiFlame = 0;
let playerTokuseiChara = null;
let enemyTokuseiFlame = 0;
let enemyTokuseiChara = null;
let Btl_TokuseiWin_Set = function (btlYarimonData) {
    if (btlYarimonData.EnemyFlg) {
        enemyTokuseiChara = btlYarimonData;
        enemyTokuseiFlame = 120;
    } else {
        playerTokuseiChara = btlYarimonData;
        playerTokuseiFlame = 120;
    }
}
Game_Interpreter.prototype.Btl_TokuseiWin_Update = function () {
    if (playerTokuseiFlame == setTokuseiFlame) {
        let name = NLngStrGet(playerTokuseiChara.Tokusei.name);
        this.SetSpriteC(PN_BtlSkillWin, Btl_PicPath + "PN_BtlSkillWin", playerYarimonX, 234);
        this.SpriteStrC(PN_BtlSkillWin + 1, SCol.Blk + SWCol.Wht + name, 24, playerYarimonX, 234 + 9, 0);
        this.MoveSpriteAdd(PN_BtlSkillWin, true, -20, 15);
        this.MoveSpriteAdd(PN_BtlSkillWin + 1, true, -20, 15);
    }
    if (enemyTokuseiFlame == setTokuseiFlame) {
        let name = NLngStrGet(enemyTokuseiChara.Tokusei.name);
        this.SetSpriteC(PN_BtlEmSkillWin, Btl_PicPath + "PN_BtlSkillWin", enemyYarimonX, 234, 0);
        this.SpriteStrC(PN_BtlEmSkillWin + 1, SCol.Blk + SWCol.Wht + name, 24, enemyYarimonX, 234 + 9, 0);
        this.MoveSpriteAdd(PN_BtlEmSkillWin, true, -20, 15);
        this.MoveSpriteAdd(PN_BtlEmSkillWin + 1, true, -20, 15);
    }
    if (playerTokuseiFlame > 0) {
        playerTokuseiFlame--;
        if (playerTokuseiFlame == 0) {
            this.MoveSpriteAdd(PN_BtlSkillWin, true, -20, 15, 0);
            this.MoveSpriteAdd(PN_BtlSkillWin + 1, true, -20, 15, 0);
        }
    }
    if (enemyTokuseiFlame > 0) {
        enemyTokuseiFlame--;
        if (enemyTokuseiFlame == 0) {
            this.MoveSpriteAdd(PN_BtlEmSkillWin, true, -20, 15, 0);
            this.MoveSpriteAdd(PN_BtlEmSkillWin + 1, true, -20, 15, 0);
        }
    }
}
let wakuWinEnemyFlg = false;
Game_Interpreter.prototype.YarimonWakuDraw = function (picNo, yarimonData, winX, winY, setHp) {
    setHp = typeof setHp !== 'undefined' ? setHp : yarimonData.hp;
    if (wakuWinEnemyFlg) picNo -= 2;
    let lc_PN_dmTikeBar = picNo;
    let lc_PN_dmTikeWin = lc_PN_dmTikeBar + 2;
    let lc_PN_dmYarimon = lc_PN_dmTikeWin + 1;
    let lc_PN_dmTxt = lc_PN_dmYarimon + 1;
    let ckData = yarimonData.YarimonData;
    if (!wakuWinEnemyFlg) {
        this.SetSprite(lc_PN_dmTikeBar + 0, Btl_CngPicPath + "PN_BtlCngTikeBar", winX + 7, winY + 14);
        let _MHP = MHP(yarimonData);
        let _hp割合 = (setHp / _MHP) * 100;
        this.SetSprite(lc_PN_dmTikeBar + 1, Btl_CngPicPath + "PN_BtlCngTikeBar", winX + 7, winY + 14,
            255, _hp割合);
        this.SpriteCngColor(lc_PN_dmTikeBar + 1, BarColGet(_hp割合));
    }
    let _setPic = "PN_BtlCngTikeWin" + GetTypeNo(ckData.state.type);
    if (wakuWinEnemyFlg) _setPic += "_em";
    this.SetSprite(lc_PN_dmTikeWin, Btl_CngPicPath + _setPic, winX, winY);
    if (!wakuWinEnemyFlg) {
        this.SetSpriteC(lc_PN_dmYarimon, Btl_Yarimon + ckData.picPath, winX + 61, winY + 96, 255, 40, 40);
        this.SpriteStrC(lc_PN_dmTxt + 1, SCol.Blk + SWCol.Wht + ckData.name, 22, winX + 65, winY + 40);
        D_Text_Cng_font = "kdam";
        this.SpriteStrR(lc_PN_dmTxt + 2, SCol.Blk + SWCol.Wht + "Lv." + yarimonData.lv + " ", 18, winX + 138, winY + 50);
        DText_NRZureX = 3;
        let _MHP = MHP(yarimonData);
        this.SpriteStrR(lc_PN_dmTxt + 0, SCol.Blk + SWCol.Wht + "\\ow[2] " +
            setHp + "/" + _MHP + " ", 18, winX + 133, winY - 4);
        DText_NRZureX = 0;
    } else {
        this.SetSpriteC(lc_PN_dmYarimon, Btl_Yarimon + ckData.picPath, winX + 61, winY + 96, 255, -40, 40);
    }
    D_Text_Cng_font = "";    
    wakuWinEnemyFlg = false;
}
Game_Interpreter.prototype.YarimonWakuDrawSprite = function (picNo, yarimonData, winX, winY, setHp) {
    setHp = typeof setHp !== 'undefined' ? setHp : yarimonData.hp;
    if (wakuWinEnemyFlg) picNo -= 2;
    let lc_PN_dmTikeBar = picNo;
    let lc_PN_dmTikeWin = lc_PN_dmTikeBar + 2;
    let lc_PN_dmYarimon = lc_PN_dmTikeWin + 1;
    let lc_PN_dmTxt = lc_PN_dmYarimon + 1;
    let ckData = yarimonData.YarimonData;
    if (!wakuWinEnemyFlg) {
        this.SetSprite(lc_PN_dmTikeBar + 0, Btl_CngPicPath + "PN_BtlCngTikeBar", winX + 7, winY + 14);
        let _MHP = MHP(yarimonData);
        let _hp割合 = (setHp / _MHP) * 100;
        this.SetSprite(lc_PN_dmTikeBar + 1, Btl_CngPicPath + "PN_BtlCngTikeBar", winX + 7, winY + 14,
            255, _hp割合);
        this.SpriteCngColor(lc_PN_dmTikeBar + 1, BarColGet(_hp割合));
    }
    let _setPic = "PN_BtlCngTikeWin" + GetTypeNo(ckData.state.type);
    if (wakuWinEnemyFlg) _setPic += "_em";
    this.SetSprite(lc_PN_dmTikeWin, Btl_CngPicPath + _setPic, winX, winY);
    if (!wakuWinEnemyFlg) {
        this.SetSpriteC(lc_PN_dmYarimon, Btl_Yarimon + ckData.picPath, winX + 61, winY + 96, 255, 40, 40);
        var txtCol = SCol.Blk;
        if (yarimonData.ExPowerFlg) txtCol = SCol.Blu;
        this.SpriteStrC(lc_PN_dmTxt + 1, txtCol + SWCol.Wht + ckData.name, 22, winX + 65, winY + 40);
        D_Text_Cng_font = "kdam";
        this.SpriteStrR(lc_PN_dmTxt + 2, SCol.Blk + SWCol.Wht + "Lv." + yarimonData.lv + " ", 18, winX + 138, winY + 50);
        DText_NRZureX = 3;
        let _MHP = MHP(yarimonData);
        this.SpriteStrR(lc_PN_dmTxt + 0, SCol.Blk + SWCol.Wht + "\\ow[2] " +
            setHp + "/" + _MHP + " ", 18, winX + 133, winY - 4);
        DText_NRZureX = 0;
    } else {
        this.SetSpriteC(lc_PN_dmYarimon, Btl_Yarimon + ckData.picPath, winX + 61, winY + 96, 255, -40, 40);
    }
    D_Text_Cng_font = "";    
    wakuWinEnemyFlg = false;
}
Game_Interpreter.prototype.EnemyYarimonWakuDraw = function (picNo, yarimonData, winX, winY, setHp) {
    setHp = typeof setHp !== 'undefined' ? setHp : yarimonData.hp;
    wakuWinEnemyFlg = true;
    this.YarimonWakuDraw(picNo, yarimonData, winX, winY, setHp);
}
Game_Interpreter.prototype.EnemyYarimonWakuDrawSprite = function (picNo, yarimonData, winX, winY, setHp) {
    setHp = typeof setHp !== 'undefined' ? setHp : yarimonData.hp;
    wakuWinEnemyFlg = true;
    this.YarimonWakuDrawSprite(picNo, yarimonData, winX, winY, setHp);
}
Game_Interpreter.prototype.YarimonWakuMove = function (picNo, winX, winY, moveFlame) {
    let lc_PN_dmTikeBar = picNo;
    let lc_PN_dmTikeWin = lc_PN_dmTikeBar + 2;
    let lc_PN_dmYarimon = lc_PN_dmTikeWin + 1;
    let lc_PN_dmTxt = lc_PN_dmYarimon + 1;
    this.MoveSprite(lc_PN_dmTikeBar, winX + 7, winY + 14, moveFlame);
    this.MoveSprite(lc_PN_dmTikeBar + 1, winX + 7, winY + 14, moveFlame, 255, true, true);
    this.MoveSprite(lc_PN_dmTikeWin, winX, winY, moveFlame);
    this.MoveSprite(lc_PN_dmYarimon, winX + 61, winY + 96, moveFlame, 255, true, true);
    this.MoveSprite(lc_PN_dmTxt + 0, winX + 133, winY - 4, moveFlame);
    this.MoveSprite(lc_PN_dmTxt + 1, winX + 65, winY + 40, moveFlame);
    this.MoveSprite(lc_PN_dmTxt + 2, winX + 138, winY + 50, moveFlame);
}
Game_Interpreter.prototype.YarimonSetuWinDraw = function (btlYarimonData) {
    this.SetSprite(PN_BtlCngStType, Btl_BtlPicPath +
        "PN_BtlTtkWazaType" + GetTypeNo(btlYarimonData.Type), BPs._x + 683, BPs._y + 512);
    this.SetSpriteC(PN_BtlCngStMonster, Btl_Yarimon + btlYarimonData.YarimonData.picPath, BPs._x + 516, BPs._y + 565, 255, 45, 45);
    let _MHP = MHP(btlYarimonData);
    this.SetSprite(PN_BtlCngStBar + 0, Btl_CngPicPath + "PN_BtlCngStBar", BPs._x + 578 + 5, BPs._y + 506 + 14);
    let _plPar = (btlYarimonData.hp / _MHP) * 100;
    this.SetSprite(PN_BtlCngStBar + 1, Btl_CngPicPath + "PN_BtlCngStBar", BPs._x + 578 + 5, BPs._y + 506 + 14, 255, _plPar);
    this.SpriteCngColor(PN_BtlCngStBar + 1, BarColGet(_plPar));
    this.SetSprite(PN_BtlCngStBarWin, Btl_CngPicPath + "PN_BtlCngStBarWin", BPs._x + 578, BPs._y + 506);
    DText_NRZureX = 3;
    let _hpStr = " " + btlYarimonData.hp + "/" + _MHP;
    this.SpriteStrR(PN_BtlCngStTxt + 0, SCol.Blk + SWCol.Wht + "\\ow[2] " + _hpStr + " ", 18, BPs._x + 700, BPs._y + 502);
    this.SpriteStr(PN_BtlCngStTxt + 1, SCol.Blk + SWCol.Wht + btlYarimonData.Name, 24, BPs._x + 462, BPs._y + 463);
    this.SpriteStr(PN_BtlCngStTxt + 2, SCol.Blk + SWCol.Wht + "Lv." + btlYarimonData.lv + " ", 24, BPs._x + 687, BPs._y + 473);
    DText_NRZureX = 0;
    for (let i = 0; i <= btlYarimonData.btlWazas.length - 1; i++) {
        let _wazaX = BPs._x + 592;
        let _wazaY = BPs._y + 534;
        this.SetSprite(PN_BtlCngStWaza + i, Btl_CngPicPath + "PN_BtlCngStWaza", _wazaX + 11 * i, _wazaY + 22 * i);
        let _wazaData = GetWazaData(btlYarimonData.btlWazas[i].id);
        this.SpriteCngColor(PN_BtlCngStWaza + i, GetTypeColor(_wazaData.type));
        this.SpriteStr(PN_BtlCngStWaTxt + i, SColSet.BlkW + " " + _wazaData.name + " ", 16,
            _wazaX + 11 * i, _wazaY - 2 + 22 * i);
    }
}
let TurnDownFlgReset = function () {
    PlTurnDownFlg = EmTurnDownFlg = false;
}
let PlTurnDownFlg = false;
Game_Interpreter.prototype.PlYarimonDown = function () {
    if (PlTurnDownFlg) return; 
    var ckMonData = battle_Class.plYarimons[battle_Class.PLMonNo];
    if (ckMonData.Tokusei.name == PassiveName._鋼の魂) {
        if (ckMonData.TokuseiUseCount == 0) {
            ckMonData._hp = MHP(ckMonData);
            if ($gameVariables.value(NanidVarNo) != Nanid.Easy) ckMonData.TokuseiUseCount++;
            BtlExEffectNo = WazaID._鋼の魂;
            this.BtlEx_鋼の魂_Start(); return;
        }
    }
    if (ckMonData.TokuseiUseCount == 0 && ckMonData.Tokusei.name == PassiveName._転生の炎) {
        ckMonData.hp = Math.round(ckMonData.MHP * 0.3);
        battle_Class.TextAdd([NLngStrGet("<value>は転生の炎で蘇った！" , [ckMonData.stName]), ""], 60);
        this.BtlBarDraw(true);
        ckMonData.TokuseiUseCount++; return;
    }
    if (ckMonData.TokuseiUseCount == 0 && ckMonData.Tokusei.name == PassiveName._再生する身体) {
        ckMonData.hp = Math.round(ckMonData.MHP * 0.3);
        battle_Class.TextAdd([NLngStrGet("<value>は倒れたが急激に再生した！" , [ckMonData.stName]), ""], 60);
        this.BtlBarDraw(true);
        ckMonData.TokuseiUseCount++; return;
    }
    this.MoveSpriteAdd(PN_PlYarimon, 0, 100, 20, -255);
    battle_Class.TextClear();
    battle_Class.TextAdd([NLngStrGet("<value>は倒れた！" , [ckMonData.stName]), ""], 60);
    battle_Class.TextAdd(["", ""], 1);
    this.PlaySe("_zbDown");
    PlTurnDownFlg = true;
}
let EmTurnDownFlg = false;
Game_Interpreter.prototype.EmYarimonDown = function () {
    if (EmTurnDownFlg) return; 
    if (!LastBtlFlg) { 
        let ckMonData = battle_Class.emYarimons[battle_Class.EmMonNo];
        if (ckMonData.TokuseiUseCount == 0
            && (ckMonData.Tokusei.name == PassiveName._転生の炎 || ckMonData.Tokusei.name == PassiveName._再生する身体)
            && PlayerUseWazaData.id != WazaID._チートタックル
            && PlayerUseWazaData.id != WazaID._未来への翼) {
            ckMonData.hp = Math.round(ckMonData.MHP * 0.3);
            if (ckMonData.Tokusei.name == PassiveName._転生の炎) {
                battle_Class.TextAdd([NLngStrGet("<value>は転生の炎で蘇った！" , [ckMonData.stName]), ""], 60);
            }
            if (ckMonData.Tokusei.name == PassiveName._再生する身体) {
                battle_Class.TextAdd([NLngStrGet("<value>は倒れたが急激に再生した！" , [ckMonData.stName]), ""], 60);
            }
            this.BtlBarDraw(true);
            ckMonData.TokuseiUseCount++; return;
        }
        this.MoveSpriteAdd(PN_EmYarimon, 0, 100, 20, -255);
        battle_Class.TextClear();
        battle_Class.TextAdd([NLngStrGet("<value>は倒れた！" , [ckMonData.stName]), ""], 60);
        battle_Class.TextAdd(["", ""], 1);
        _経験P += ckMonData.lv; 
        this.PlaySe("_zbDown");
        EmTurnDownFlg = true;
    } else {
        this.LastEmYarimonDown();
    }
}
Game_Interpreter.prototype.EffectActionArr_Update = function (_ckFlame) {
    EffectActionArr.forEach(effAction => {
        if (_ckFlame == effAction.flame) {
            effAction.Action(); 
            this.BtlBarDraw(true); 
            Btl_DmgTokusei_EffCount--;
        }
    });
    BuffEffectArr.forEach(effData => {
        let ckVar = Number(effData._ckEff.data2);
        let _ptcName = "Effect_Buff";
        let _buffCol = [255, 0, 0];
        if (ckVar < 0) {
            _buffCol = [0, 0, 255];
            _ptcName = "Effect_Down";
        }
        if (effData._chara.EnemyFlg) {
            BtlWazaEffectStacSet(PN_BtlPtc, _ptcName, enemyYarimonX, enemyYarimonY);
            StacSpriteCngColor(PN_EmYarimon, _buffCol, 30);
            StacSpriteCngColor(PN_EmYarimon, [0, 0, 0], 30);
        } else {
            BtlWazaEffectStacSet(PN_BtlPtc, _ptcName, playerYarimonX, playerYarimonY);
            StacSpriteCngColor(PN_PlYarimon, _buffCol, 30);
            StacSpriteCngColor(PN_PlYarimon, [0, 0, 0], 30);
        }
    });
    BuffEffectArr = [];
}
let Tokusei_Effect = function () {
    if (TokuseiEffData == null) return;
    let _Chara = TokuseiEffData.Chara;
    let _EffectName = TokuseiEffData.EffName;
    if (_Chara.EnemyFlg) {
        BtlWazaEffectStacSet(PN_BtlPtc, _EffectName, enemyYarimonX, enemyYarimonY);
    } else {
        BtlWazaEffectStacSet(PN_BtlPtc, _EffectName, playerYarimonX, playerYarimonY);
    }
    TokuseiEffData = null;
}
Game_Interpreter.prototype.Plダメージ揺れ = function () {
    this.SpriteCngColor(PN_PlYarimon, [170, 0, 0]);
    StacMoveSprite(PN_PlYarimon, playerYarimonX + 30, playerYarimonY, 5, 255);
    StacMoveSprite(PN_PlYarimon, playerYarimonX - 30, playerYarimonY, 5, 255);
    StacMoveSprite(PN_PlYarimon, playerYarimonX + 30, playerYarimonY, 5, 255);
    StacSpriteCngColor(PN_PlYarimon, [0, 0, 0], 1);
    StacMoveSprite(PN_PlYarimon, playerYarimonX, playerYarimonY, 20, 255);
}
Game_Interpreter.prototype.Emダメージ揺れ = function () {
    this.SpriteCngColor(PN_EmYarimon, [170, 0, 0]);
    StacMoveSprite(PN_EmYarimon, enemyYarimonX - 30, enemyYarimonY, 5, 255, true);
    StacMoveSprite(PN_EmYarimon, enemyYarimonX + 30, enemyYarimonY, 5, 255, true);
    StacMoveSprite(PN_EmYarimon, enemyYarimonX - 30, enemyYarimonY, 5, 255, true);
    StacSpriteCngColor(PN_EmYarimon, [0, 0, 0], 1);
    StacMoveSprite(PN_EmYarimon, enemyYarimonX, enemyYarimonY, 5, 255, true);
}
let Btl_DmgTokusei_Flame = 0;
let Btl_DmgTOkusei_Effect = [];
let Btl_DmgTokusei_EffFrame = 0;
let Btl_DmgTokusei_EffCount = 0;
Game_Interpreter.prototype.Btl_DmgTokusei_Update = function (AtkMon, DefMon) {
    Btl_DmgTokusei_Flame++;
    if (Btl_DmgTokusei_Flame == 1) {
        Btl_DmgTokusei_EffFrame = 0;
        Btl_DmgTokusei_EffCount = 0;
        if (DefMon.WazaDmg > 0) { 
            let _addIjoStr = "";
            switch (DefMon.Tokusei.name) {
                case PassiveName._燃え移り:
                    if (Math.random() <= 0.3) _addIjoStr = Ijo._炎上;
                    break;
                case PassiveName._アイスオーラ:
                    if (Math.random() <= 0.3) _addIjoStr = Ijo._凍結;
                    break;
                case PassiveName._大地の守り:
                    if (Math.random() <= 0.3) _addIjoStr = Ijo._泥沼;
                    break;
                case PassiveName._帯電体質:
                    if (Math.random() <= 0.3) _addIjoStr = Ijo._痺れ;
                    break;
                case PassiveName._悪魔の秘術:
                    if (Math.random() <= 0.3) _addIjoStr = Ijo._呪い;
                    break;
                case PassiveName._ナチュルパウダー:
                    if (Math.random() <= 0.3) {
                        let _ckRnd = Math.floor(Math.random() * 3);
                        switch (_ckRnd) {
                            case 0:
                                _addIjoStr = Ijo._泥沼;
                                break;
                            case 1:
                                _addIjoStr = Ijo._痺れ;
                                break;
                            case 2:
                                _addIjoStr = Ijo._呪い;
                                break;
                        }
                    }
                    break;
                case PassiveName._むしばみ:
                    if (Math.random() <= 0.3) {
                        if (AtkMon.hp <= 0) return false;
                        if (DefMon.hp <= 0) return false;
                        TokuseiEffData = new TokuseiEff(DefMon, "Effect_Tokusei");
                        Btl_TokuseiWin_Set(DefMon);
                        Tokusei_Effect();
                        battle_Class.TextAdd([
                            NLngStrGet("<value> のむしばみが相手の能力をさげる" , [DefMon.stName]), ""], 60);
                        BtlCheckTokusei_EndFlame = 60;
                        let _effectK1 = new oriEffectData("");
                        _effectK1.name = "能力変化";
                        _effectK1.data = RndRankStr_Get(Math.floor(Math.random() * 5));
                        _effectK1.data2 = -1;
                        _effectK1.oneselfFlg = false;
                        Btl_DmgTokusei_EffCount++;
                        AddEffectSetting(null, DefMon, AtkMon, new AddEffectData(0, _effectK1));
                        return true;
                    }
                    break;
                default:
                    return false;
            }
            if (_addIjoStr != "") {
                if (AtkMon.Tokusei.name == PassiveName._ラスボス特性) return false;
                if (AtkMon.Tokusei.name == PassiveName._やわらかボディ) return false;
                if (AtkMon.Tokusei.name == PassiveName._鋼の魂) return false;
                if (AtkMon.Tokusei.name == PassiveName._幽体 && _addIjoStr == Ijo._呪い) return false;
                if (AtkMon.Tokusei.name == PassiveName._内燃機関 && _addIjoStr == Ijo._炎上) return false;
                if (AtkMon.Tokusei.name == PassiveName._耐熱装甲 && _addIjoStr == Ijo._炎上) return false;
                if (AtkMon.Ijos.indexOf(_addIjoStr) != -1) return false;
                AtkMon.Ijos.push(_addIjoStr);
                AddIjoEffect(AtkMon, _addIjoStr); 
                let _特性Name = NLngStrGet(DefMon.Tokusei.name);
                if (DefMon.Tokusei.name == PassiveName._ナチュルパウダー) {
                    _特性Name = NLngStrGet("粉末");
                }
                battle_Class.TextAdd(
                    [AtkMon.stName + NLngStrGet("は") + DefMon.stName + NLngStrGet("の ") + _特性Name + NLngStrGet(" で"),
                        NLngStrGet("<value>状態になった！" , [NLngStrGet(_addIjoStr)])], 1);
                this.BtlBarDraw(true); 
                TokuseiEffData = new TokuseiEff(DefMon, "Effect_Tokusei");
                Tokusei_Effect();
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    if (Btl_DmgTokusei_EffCount > 0) {
        this.EffectActionArr_Update(Btl_DmgTokusei_EffFrame)
        Btl_DmgTokusei_EffFrame++;
        if (BtlAddEffEndFlame <= Btl_DmgTokusei_EffFrame) {
            return false;
        }
        return true;
    }
    if (Btl_DmgTokusei_Flame == 60) {
        return false;
    }
    return true; 
}
let BtlAddEffEndFlame = 0;
let Btl_BarDraw_Flg = false;
let EffectActionArr = [];
class EffectActionData {
    constructor(_flame, _action) {
        this.flame = _flame;
        this.Action = _action; 
    }
}
let AddIjoEffect = function (_Chara, _ijoName) {
    let _setPtcName = "";
    switch (_ijoName) {
        case  Ijo._泥沼:
            _setPtcName = "Ijo_Doro";
            break;
        case  Ijo._呪い:
            _setPtcName = "Ijo_Noroi";
            break;
        case  Ijo._痺れ:
            _setPtcName = "Ijo_Sibire";
            break;
        case  Ijo._炎上:
            _setPtcName = "Ijo_Enjou";
            break;
        case  Ijo._切創:
            _setPtcName = "Ijo_Kirikizu";
            break;
        case  Ijo._凍結:
            _setPtcName = "Ijo_Touketu";
            break;
    }
    if (_Chara.EnemyFlg) {
        BtlWazaEffectStacSet(PN_BtlPtc, _setPtcName, enemyYarimonX, enemyYarimonY);
    } else {
        BtlWazaEffectStacSet(PN_BtlPtc, _setPtcName, playerYarimonX, playerYarimonY);
    }
}
let AddEffectSetting = function (_mode, _AtkYarimon, _DefYarimon, _effect) {
    EffectActionArr = [];
    let ckDmgVar = _effect.DmgVar;
    let ckEffect = _effect.EffectData;
    let ckEffKakuritu = ckEffect.kakuritu;
    let ckOneSelfFlg = ckEffect.oneselfFlg; 
    if (ckOneSelfFlg && _AtkYarimon.hp <= 0) {
        BtlAddEffEndFlame = 1; return;
    }
    if (!ckOneSelfFlg && _DefYarimon.hp <= 0) {
        BtlAddEffEndFlame = 1; return;
    }
    if (!ckOneSelfFlg && _AtkYarimon.hp <= 0) {
        BtlAddEffEndFlame = 1; return;
    }
    switch (ckEffect.name) {
        case "状態異常":
            if (ckOneSelfFlg && _AtkYarimon.Ijos.indexOf(ckEffect.data) != -1) {
                BtlAddEffEndFlame = 1; return;
            }
            if (!ckOneSelfFlg && _DefYarimon.Ijos.indexOf(ckEffect.data) != -1) {
                BtlAddEffEndFlame = 1; return;
            }
            if (_AtkYarimon.Tokusei.name == PassiveName._神通力) ckEffKakuritu *= 2; 
            if (ckEffKakuritu >= Math.random() * 100) {
                BtlAddEffEndFlame = 60;
                let _setStr = "";
                if (_DefYarimon.Tokusei.name == PassiveName._プリズムウォール && !ckOneSelfFlg && ckDmgVar > 0) {
                    ckOneSelfFlg = true;
                    _setStr = NLngStrGet("<value> が 特殊な効果を跳ね返した！" , [NLngStrGet(_DefYarimon.Tokusei.name)]) + "\n";
                }
                let _TokuseiIjoCheck = function (_ckMon, _IjoName) {
                    if (_ckMon.Tokusei.name == PassiveName._やわらかボディ ||
                        _ckMon.Tokusei.name == PassiveName._鋼の魂 ||
                        _ckMon.Tokusei.name == PassiveName._ラスボス特性) {
                        _setStr += NLngStrGet("<value>は 状態異常にならない！" , [_ckMon.stName]) + "\n"
                        battle_Class.TextAdd([_setStr, ""], 1);
                        return true;
                    }
                    if (_ckMon.Tokusei.name == PassiveName._幽体 && _IjoName == Ijo._呪い) {
                        _setStr += _ckMon.stName + NLngStrGet("は ") + NLngStrGet("<value>なので呪いは効かない！" , NLngStrGet(_ckMon.Tokusei.name)) + "\n"
                        battle_Class.TextAdd([_setStr, ""], 1);
                        return true;
                    }
                    if ((_ckMon.Tokusei.name == PassiveName._内燃機関 || _ckMon.Tokusei.name == PassiveName._耐熱装甲) && _IjoName == Ijo._炎上) {
                        _setStr += _ckMon.stName + NLngStrGet("は ") + NLngStrGet("<value>で炎上をしない！" , [NLngStrGet(_ckMon.Tokusei.name)]) + "\n"
                        battle_Class.TextAdd([_setStr, ""], 1);
                        return true;
                    }
                    return false;
                }
                let _IjoStrGet = function (ckStr) {
                    if (ckStr.split("\n").length > 2) return "";
                    switch (ckEffect.data) {
                        case Ijo._凍結:
                            return NLngStrGet("回避が下がり毎ターンダメージ！");
                        case Ijo._炎上:
                            return NLngStrGet("防御が下がり毎ターンダメージ！");
                        case Ijo._泥沼:
                            return NLngStrGet("素早さと命中が下がってしまう！");
                        case Ijo._痺れ:
                            return NLngStrGet("１回動けず技のクールタイムが増える！");
                        case Ijo._切創:
                            return NLngStrGet("攻撃が下がり毎ターンダメージ！");
                        case Ijo._呪い:
                            return NLngStrGet("回復ができず毎ターンダメージ！");
                    }
                }
                if (ckOneSelfFlg) {
                    if (_TokuseiIjoCheck(_AtkYarimon, ckEffect.data)) {
                        Tokusei_Effect();
                        return;
                    }
                    if (_AtkYarimon.Ijos.indexOf(ckEffect.data) != -1) return false;
                    _AtkYarimon.Ijos.push(ckEffect.data);
                    EffectActionArr.push(new EffectActionData(5, function () {
                        AddIjoEffect(_AtkYarimon, ckEffect.data); 
                        _setStr += _AtkYarimon.stName + NLngStrGet("は") + NLngStrGet("<value>状態になった！" , [NLngStrGet(ckEffect.data)]) + "\n";
                        _setStr += _IjoStrGet(_setStr) + "\n";
                        battle_Class.TextAdd([_setStr, ""], 1);
                    }));
                } else {
                    if (_TokuseiIjoCheck(_DefYarimon, ckEffect.data)) return;
                    if (_DefYarimon.Tokusei.name == PassiveName._金属装甲 && ckDmgVar > 0) {
                        _setStr += _DefYarimon.stName + NLngStrGet("の ") + NLngStrGet("<value>が追加効果を弾いた！" , [NLngStrGet(_DefYarimon.Tokusei.name)]) + "\n"
                        battle_Class.TextAdd([_setStr, ""], 1);
                        Tokusei_Effect();
                        return;
                    }
                    if (_DefYarimon.Ijos.indexOf(ckEffect.data) != -1) return false;
                    _DefYarimon.Ijos.push(ckEffect.data);
                    EffectActionArr.push(new EffectActionData(5, function () {
                        AddIjoEffect(_DefYarimon, ckEffect.data); 
                        _setStr += _DefYarimon.stName + NLngStrGet("は") + NLngStrGet("<value>状態になった！" , [NLngStrGet(ckEffect.data)]) + "\n";
                        _setStr += _IjoStrGet(_setStr) + "\n"
                        battle_Class.TextAdd([_setStr, ""], 1);
                    }));
                }
                EffectActionArr.push(new EffectActionData(15,
                    function () {
                        Btl_BarDraw_Flg = true;
                    }));
            } else {
                BtlAddEffEndFlame = 1;
            }
            break;
        case "能力変化":
            if (_AtkYarimon.Tokusei.name == PassiveName._神通力) ckEffKakuritu *= 2; 
            if (ckEffKakuritu >= Math.random() * 100) {
                BtlAddEffEndFlame = 60;
                let _setStr = "";
                if (_DefYarimon.Tokusei.name == PassiveName._プリズムウォール && !ckOneSelfFlg && ckDmgVar > 0) {
                    ckOneSelfFlg = true;
                    _setStr = NLngStrGet("<value> が 特殊な効果を跳ね返した！" , [NLngStrGet(_DefYarimon.Tokusei.name)]) + "\n";
                }
                let _upNo = Number(ckEffect.data2);
                if (ckOneSelfFlg) {
                    EffectActionArr.push(new EffectActionData(5, function () {
                        if (_upNo > 0 && _DefYarimon.Tokusei.name == PassiveName._悪知恵 &&　_DefYarimon.hp > 0) {
                            _setStr = _DefYarimon.stName + NLngStrGet("は ") + NLngStrGet("<value>で変化を奪う！" , [NLngStrGet(_DefYarimon.Tokusei.name)]) + "\n";
                            _setStr += BtlStatusRankCng(_DefYarimon, ckEffect);
                        } else {
                            _setStr += BtlStatusRankCng(_AtkYarimon, ckEffect);
                        }
                        battle_Class.TextAdd([_setStr, ""], 1);
                    }));
                } else {
                    if (_DefYarimon.Tokusei.name == PassiveName._金属装甲 && ckDmgVar > 0) {
                        _setStr += _DefYarimon.stName + NLngStrGet("の ") + NLngStrGet("<value>が追加効果を弾いた！" , NLngStrGet(_DefYarimon.Tokusei.name))
                        battle_Class.TextAdd([_setStr, ""], 1);
                        return;
                    }
                    EffectActionArr.push(new EffectActionData(5, function () {
                        if (_upNo > 0 && _AtkYarimon.Tokusei.name == PassiveName._悪知恵 &&　_AtkYarimon.hp > 0) {
                            _setStr = _AtkYarimon.stName + NLngStrGet("は ") + NLngStrGet("<value>で変化を奪う！" , [LngStrGet(_AtkYarimon.Tokusei.name)]) + "\n";
                            _setStr += BtlStatusRankCng(_AtkYarimon, ckEffect);
                        } else {
                            _setStr += BtlStatusRankCng(_DefYarimon, ckEffect);
                        }
                        battle_Class.TextAdd([_setStr, ""], 1);
                    }));
                }
            }
            break;
        case "連続ヒット":
            if (btlDmgVar == 0) break;
            let _HitCnt = 0;
            for (let i = 0; i <= ckEffKakuritu - 1; i++) {
                if (Math.random() * 100 <= _mode.parent.DoingWaza.hit) {
                    _HitCnt++;
                }
            }
            if (_HitCnt == 0) {
                BtlAddEffEndFlame = 60;
                EffectActionArr.push(new EffectActionData(5, function () {
                    battle_Class.TextAdd([NLngStrGet("1回当たった！"), ""], 1);
                }));
            }
            BtlAddEffEndFlame = (60 * _HitCnt) + 60;
            for (let i = 0; i <= _HitCnt - 1; i++) {
                EffectActionArr.push(new EffectActionData(5 + i * 60, function () {
                    battle_Class.TextAdd([NLngStrGet("連続ヒット！"), ""], 1);
                    if (_mode.name == Btl_Battle.PlAction) {
                        let _befHp = battle_Class.emYarimons[battle_Class.EmMonNo].hp;
                        battle_Class.emYarimons[battle_Class.EmMonNo].hp -= btlDmgVar;
                        battle_Class.emYarimons[battle_Class.EmMonNo].WazaDmg += btlDmgVar;
                        let _ptcName = GetWazaPtcName(_mode.parent.DoingWaza.id);
                        BtlWazaEffectStacSet(PN_BtlPtc, _ptcName, enemyYarimonX, enemyYarimonY);
                        StacMoveSprite(PN_EmYarimon, enemyYarimonX - 30, enemyYarimonY, 5, 255, true);
                        StacMoveSprite(PN_EmYarimon, enemyYarimonX + 30, enemyYarimonY, 5, 255, true);
                        StacMoveSprite(PN_EmYarimon, enemyYarimonX - 30, enemyYarimonY, 5, 255, true);
                        StacSpriteCngColor(PN_EmYarimon, [0, 0, 0], 1);
                        StacMoveSprite(PN_EmYarimon, enemyYarimonX, enemyYarimonY, 5, 255, true);
                        if (_befHp != battle_Class.emYarimons[battle_Class.EmMonNo].hp) {
                            _mode.parent.EmDmgEffectArr.push(BtlDmgEffect.Dmg);
                        }
                    } else {
                        let _befHp = battle_Class.plYarimons[battle_Class.PLMonNo].hp;
                        battle_Class.plYarimons[battle_Class.PLMonNo].hp -= btlDmgVar;
                        battle_Class.plYarimons[battle_Class.PLMonNo].WazaDmg += btlDmgVar;
                        let _ptcName = GetWazaPtcName(_mode.parent.DoingWaza.id);
                        BtlWazaEffectStacSet(PN_BtlPtc, _ptcName, playerYarimonX, playerYarimonY);
                        StacMoveSprite(PN_PlYarimon, playerYarimonX + 30, playerYarimonY, 5, 255);
                        StacMoveSprite(PN_PlYarimon, playerYarimonX - 30, playerYarimonY, 5, 255);
                        StacMoveSprite(PN_PlYarimon, playerYarimonX + 30, playerYarimonY, 5, 255);
                        StacSpriteCngColor(PN_PlYarimon, [0, 0, 0], 1);
                        StacMoveSprite(PN_PlYarimon, playerYarimonX, playerYarimonY, 20, 255);
                        if (_befHp != battle_Class.plYarimons[battle_Class.PLMonNo].hp) {
                            _mode.parent.PLDmgEffectArr.push(BtlDmgEffect.Dmg);
                        }
                    }
                }));
                EffectActionArr.push(new EffectActionData(15 + i * 60,
                    function () {
                        Btl_BarDraw_Flg = true;
                    }));
            }
            EffectActionArr.push(new EffectActionData(_HitCnt * 60,
                function () {
                    battle_Class.TextAdd([NLngStrGet("<value>回当たった！" , [(_HitCnt + 1)]), ""], 1);
                }));
            break;
        case "攻撃無効化":
            BtlAddEffEndFlame = 60;
            _AtkYarimon.Def_Mode = true;
            EffectActionArr.push(new EffectActionData(5, function () {
                battle_Class.TextAdd([NLngStrGet("<value>は守りの体制を取った！" , _AtkYarimon.stName), ""], 1);
            }));
            break;
        case "回復":
            BtlAddEffEndFlame = 60;
            if (ckOneSelfFlg) {
                if (_AtkYarimon.Ijos.indexOf(Ijo._呪い) != -1) {
                    battle_Class.TextAdd([NLngStrGet("<value>は 呪いによって回復できない！" , _AtkYarimon.stName), ""], 1);
                } else {
                    EffectActionArr.push(new EffectActionData(5, function () {
                        battle_Class.TextAdd([NLngStrGet("<value>の体力が回復した" , [_AtkYarimon.stName]), ""], 1);
                        _AtkYarimon.hp += _AtkYarimon.MHP * (ckEffKakuritu / 100);
                    }));
                }
                EffectActionArr.push(new EffectActionData(15,
                    function () {
                        Btl_BarDraw_Flg = true;
                    }));
            } else {
                if (_DefYarimon.Ijos.indexOf(Ijo._呪い) != -1) {
                    battle_Class.TextAdd([NLngStrGet("<value>は 呪いによって回復できない！" , _DefYarimon.stName), ""], 1);
                } else {
                    EffectActionArr.push(new EffectActionData(5, function () {
                        battle_Class.TextAdd([NLngStrGet("<value>の体力が回復した" , [_DefYarimon.stName]), ""], 1);
                        _DefYarimon.hp += _DefYarimon.MHP * (ckEffKakuritu / 100);
                    }));
                }
                EffectActionArr.push(new EffectActionData(15,
                    function () {
                        Btl_BarDraw_Flg = true;
                    }));
            }
            break;
        case "吸収":
            BtlAddEffEndFlame = 60;
            if (_AtkYarimon.Ijos.indexOf(Ijo._呪い) != -1) {
                battle_Class.TextAdd([NLngStrGet("<value>は 呪いによって回復できない！" , _AtkYarimon.stName), ""], 1);
            } else {
                EffectActionArr.push(new EffectActionData(5, function () {
                    battle_Class.TextAdd([NLngStrGet("<value>の体力が回復した" , _AtkYarimon.stName), ""], 1);
                    _AtkYarimon.hp += btlDmgVar * (ckEffKakuritu / 100);
                }));
            }
            EffectActionArr.push(new EffectActionData(15,
                function () {
                    Btl_BarDraw_Flg = true;
                }));
            break;
        case "追加ダメージ":
            BtlAddEffEndFlame = 60;
            if (ckOneSelfFlg) {
                EffectActionArr.push(new EffectActionData(5, function () {
                    battle_Class.TextAdd([NLngStrGet("<value>はダメージを受けた" , [_AtkYarimon.stName]), ""], 1);
                    _AtkYarimon.hp -= btlDmgVar * (ckEffKakuritu / 100);
                }));
            } else {
                if (_DefYarimon.Tokusei.name == PassiveName._金属装甲 && ckDmgVar > 0) return;
                EffectActionArr.push(new EffectActionData(5, function () {
                    battle_Class.TextAdd([NLngStrGet("<value>はダメージを受けた" , [_DefYarimon.stName]), ""], 1);
                    _DefYarimon.hp -= btlDmgVar * (ckEffKakuritu / 100);
                    _DefYarimon.WazaDmg += btlDmgVar * (ckEffKakuritu / 100);
                }));
            }
            break;
        case "特性ダメージ":
            BtlAddEffEndFlame = 60;
            if (ckOneSelfFlg) {
                EffectActionArr.push(new EffectActionData(5, function () {
                    battle_Class.TextAdd([NLngStrGet("<value>はダメージを受けた" , [_AtkYarimon.stName]), ""], 1);
                    _AtkYarimon.hp -= _AtkYarimon.MHP * (ckEffKakuritu / 100);
                }));
            } else {
                EffectActionArr.push(new EffectActionData(5, function () {
                    battle_Class.TextAdd([NLngStrGet("<value>はダメージを受けた" , [_DefYarimon.stName]), ""], 1);
                    _DefYarimon.hp -= _DefYarimon.MHP * (ckEffKakuritu / 100);
                }));
            }
            break;
        case "クールタイム操作":
            BtlAddEffEndFlame = 60;
            if (ckOneSelfFlg) {
                EffectActionArr.push(new EffectActionData(5, function () {
                    battle_Class.TextAdd([NLngStrGet("<value>のクールタイムが変化した" , [_AtkYarimon.stName]), ""], 1);
                }));
                for (let i = 0; i <= _AtkYarimon.btlWazas.length - 1; i++) {
                    _AtkYarimon.btlWazas[i].reChargeTurn += ckEffKakuritu;
                    if (_AtkYarimon.btlWazas[i].reChargeTurn < 0) _AtkYarimon.btlWazas[i].reChargeTurn = 0;
                }
            } else {
                if (_DefYarimon.Tokusei.name == PassiveName._金属装甲 && ckDmgVar > 0) return;
                EffectActionArr.push(new EffectActionData(5, function () {
                    battle_Class.TextAdd([NLngStrGet("<value>のクールタイムが変化した" , [_DefYarimon.stName]), ""], 1);
                }));
                for (let i = 0; i <= _DefYarimon.btlWazas.length - 1; i++) {
                    _DefYarimon.btlWazas[i].reChargeTurn += ckEffKakuritu;
                    if (_DefYarimon.btlWazas[i].reChargeTurn < 0) _DefYarimon.btlWazas[i].reChargeTurn = 0;
                }
            }
            break;
    }
}
let BtlStatusRankCng = function (chara, effect) {
    let _setStr = "";
    let ckNo = Number(effect.data2);
    if (ckNo > 0) _setStr = NLngStrGet("<value>が上がった！");
    if (ckNo > 1) _setStr = NLngStrGet("<value>がすごく上がった！");
    if (ckNo > 2) _setStr = NLngStrGet("<value>がハチャメチャに上がった！");
    if (ckNo == 0) return NLngStrGet("ステータスは変わらない");
    if (ckNo < 0) _setStr = NLngStrGet("<value>が下がった！");
    if (ckNo < -1) _setStr = NLngStrGet("<value>がすごく下がった！");
    if (ckNo < -2) _setStr = NLngStrGet("<value>がとんでもなく下がった！");
    _setStr = _setStr.replace("<value>" , [NLngStrGet(effect.data)]); 
    if (chara.Tokusei.name == PassiveName._華麗な動き) {
        if (ckNo < 0) {
            return NLngStrGet("<value>で能力低下を防いだ！" , [NLngStrGet(chara.Tokusei.name)]);
        }
    }
    if (chara.Tokusei.name == PassiveName._つぎはぎ) {
        if (ckNo < 0 && effect.data == "防御") {
            return NLngStrGet("<value>の身体が防御低下を防いだ！！" , [NLngStrGet(chara.Tokusei.name)]);
        }
    }
    BuffEffectSet(chara, effect);
    if (effect.data == "攻撃") {
        if (chara.R_Atk == 8 && ckNo > 0) {
            return chara.stName + NLngStrGet("の") + NLngStrGet("<value>は限界まで上がっている！" , [NLngStrGet(effect.data)]);
        }
        if (chara.R_Atk == -8 && ckNo < 0) {
            return chara.stName + NLngStrGet("の") + NLngStrGet("<value>は限界まで下がっている！" , [NLngStrGet(effect.data)]);
        }
        chara.R_Atk += Number(effect.data2);
        if (chara.R_Atk > 8) chara.R_Atk = 8;
        if (chara.R_Atk < -8) chara.R_Atk = -8;
        return chara.stName + NLngStrGet("の") + _setStr;
    }
    if (effect.data == "防御") {
        if (chara.R_Def == 8 && ckNo > 0) {
            return chara.stName + NLngStrGet("の") + NLngStrGet("<value>は限界まで上がっている！" , [NLngStrGet(effect.data)]);
        }
        if (chara.R_Def == -8 && ckNo < 0) {
            return chara.stName + NLngStrGet("の") + NLngStrGet("<value>は限界まで下がっている！" , [NLngStrGet(effect.data)]);
        }
        chara.R_Def += Number(effect.data2);
        if (chara.R_Def > 8) chara.R_Def = 8;
        if (chara.R_Def < -8) chara.R_Def = -8;
        return chara.stName + NLngStrGet("の") + _setStr;
    }
    if (effect.data == "素早さ") {
        if (chara.R_Agi == 8 && ckNo > 0) {
            return chara.stName + NLngStrGet("の") + NLngStrGet("<value>は限界まで上がっている！" , [NLngStrGet(effect.data)]);
        }
        if (chara.R_Agi == -8 && ckNo < 0) {
            return chara.stName + NLngStrGet("の") + NLngStrGet("<value>は限界まで下がっている！" , [NLngStrGet(effect.data)]);
        }
        chara.R_Agi += Number(effect.data2);
        if (chara.R_Agi > 8) chara.R_Agi = 8;
        if (chara.R_Agi < -8) chara.R_Agi = -8;
        return chara.stName + NLngStrGet("の") + _setStr;
    }
    if (effect.data == "回避") {
        if (chara.R_Avo == 8 && ckNo > 0) {
            return chara.stName + NLngStrGet("の") + NLngStrGet("<value>は限界まで上がっている！" , [NLngStrGet(effect.data)]);
        }
        if (chara.R_Avo == -8 && ckNo < 0) {
            return chara.stName + NLngStrGet("の") + NLngStrGet("<value>は限界まで下がっている！" , [NLngStrGet(effect.data)]);
        }
        chara.R_Avo += Number(effect.data2);
        if (chara.R_Avo > 8) chara.R_Avo = 8;
        if (chara.R_Avo < -8) chara.R_Avo = -8;
        return chara.stName + NLngStrGet("の") + _setStr;
    }
    if (effect.data == "命中") {
        if (chara.R_Hit == 8 && ckNo > 0) {
            return chara.stName + NLngStrGet("の") + NLngStrGet("<value>は限界まで上がっている！" , [NLngStrGet(effect.data)]);
        }
        if (chara.R_Hit == -8 && ckNo < 0) {
            return chara.stName + NLngStrGet("の") + NLngStrGet("<value>は限界まで下がっている！" , [NLngStrGet(effect.data)]);
        }
        chara.R_Hit += Number(effect.data2);
        if (chara.R_Hit > 8) chara.R_Hit = 8;
        if (chara.R_Hit < -8) chara.R_Hit = -8;
        return chara.stName + NLngStrGet("の") + _setStr;
    }
    return "";
}
let BtlCheckTokuseiFlame = 0;
let BtlCheckTokusei_EndFlame = 1;
let BtlCheckEffect = null;
let CheckTikeEffDataArr = [];
let _CheckTokuseiEffData = null;
Game_Interpreter.prototype.Btl_Battle_Check_TokuseiSetting = function (InMon, DefMon) {
    _CheckTokuseiEffData = new CngTokuseiEffData(InMon, DefMon);
}
Game_Interpreter.prototype.Btl_Battle_Check_TokuseiCheck = function (_AtkChara, _DefChara) {
    if (_CheckTokuseiEffData != null) {
        let _ckFlg = this.Btl_Battle_Check_TokuseiUpdate(_CheckTokuseiEffData.InMon, _CheckTokuseiEffData.DefMon);
        if (!_ckFlg) {
            EffectActionArr = [];
            CheckTikeEffDataArr = [];
            _CheckTokuseiEffData = null;
            Btl_CngYarimon_Tokusei_Flame = CngTikeEffNo = 0;
            battle_Class.Update();
        }
        return _ckFlg;
    }
    return false;
}
Game_Interpreter.prototype.Btl_Battle_Check_TokuseiUpdate = function (_AtkChara, _DefChara) {
    Btl_CngYarimon_Tokusei_Flame++;
    if (Btl_CngYarimon_Tokusei_Flame == 1) {
        CngTikeEffNo = 0;
        let _effect = new oriEffectData("");
        switch (_AtkChara.Tokusei.name) {
            case PassiveName._するどい刃:
                if (_DefChara.hp > 0) return false;
                TokuseiEffData = new TokuseiEff(_AtkChara, "Effect_Tokusei");
                Btl_TokuseiWin_Set(_AtkChara);
                Tokusei_Effect();
                battle_Class.TextAdd([
                    NLngStrGet("<value>の 攻撃に鋭さが増していく。" , [_AtkChara.stName]), ""], 1);
                BtlCheckTokusei_EndFlame = 60;
                let _effect = new oriEffectData("");
                _effect.name = "能力変化";
                _effect.data = NRank._攻撃;
                _effect.data2 = 1;
                _effect.oneselfFlg = true;
                CheckTikeEffDataArr.push(new AddEffectData(0, _effect))
                break;
            case PassiveName._兜締め:
                if (_DefChara.hp > 0) return false;
                TokuseiEffData = new TokuseiEff(_AtkChara, "Effect_Tokusei");
                Btl_TokuseiWin_Set(_AtkChara);
                Tokusei_Effect();
                battle_Class.TextAdd([
                    NLngStrGet("<value>は 油断せず兜の緒を締める。" , [_AtkChara.stName]), ""], 1);
                BtlCheckTokusei_EndFlame = 60;
                let _effectK1 = new oriEffectData("");
                _effectK1.name = "能力変化";
                _effectK1.data = NRank._攻撃;
                _effectK1.data2 = 1;
                _effectK1.oneselfFlg = true;
                CheckTikeEffDataArr.push(new AddEffectData(0, _effectK1));
                let _effectK2 = new oriEffectData("");
                _effectK2.name = "能力変化";
                _effectK2.data = NRank._防御;
                _effectK2.data2 = 1;
                _effectK2.oneselfFlg = true;
                CheckTikeEffDataArr.push(new AddEffectData(0, _effectK2));
                break
            case PassiveName._栄養搾取:
                if (_DefChara.hp > 0) return false;
                TokuseiEffData = new TokuseiEff(_AtkChara, "Effect_Tokusei");
                Btl_TokuseiWin_Set(_AtkChara);
                Tokusei_Effect();
                if (_AtkChara.Ijos.indexOf(Ijo._呪い) != -1) {
                    battle_Class.TextAdd([NLngStrGet("<value>は 呪いによって回復できない！" , _AtkChara.stName), ""], 1);
                } else {
                    battle_Class.TextAdd([
                        NLngStrGet("<value>は 栄養を搾取して回復する！" , [_AtkChara.stName]), ""], 1);
                    _AtkChara.hp += Math.floor(_AtkChara.MHP / 2);
                }
                BtlCheckTokusei_EndFlame = 60;
                this.BtlBarDraw(true); 
                break;
            default:
                return false;
        }
    }
    if (Btl_CngYarimon_Tokusei_Flame == Btl_CngYarimon_LoopFlame) {
        if (CheckTikeEffDataArr.length == CngTikeEffNo) return false;
        AddEffectSetting(null, _AtkChara, _DefChara, CheckTikeEffDataArr[CngTikeEffNo]);
        CngTikeEffNo++;
    }
    let _ckFlame = Btl_CngYarimon_Tokusei_Flame - Btl_CngYarimon_LoopFlame;
    this.EffectActionArr_Update(_ckFlame);
    if (Btl_CngYarimon_Tokusei_Flame == Btl_CngYarimon_LoopFlame + 60) {
        Btl_CngYarimon_Tokusei_Flame = Btl_CngYarimon_LoopFlame - 1;
    }
    return true;
}
class _setEfData {
    constructor(_data, _data2, _kakuritu, _name, _oneselfFlg) {
        this.DmgVar = 0;
        this.EffectData = new _setEffectData(_data, _data2, _kakuritu, _name, _oneselfFlg);
    }
}
class _setEffectData {
    constructor(_data, _data2, _kakuritu, _name, _oneselfFlg) {
        this.data = _data;
        this.data2 = _data2;
        this.kakuritu = _kakuritu;
        this.name = _name;
        this.oneselfFlg = _oneselfFlg;
    }
}
Game_Interpreter.prototype.Btl_Battle_Check_Text_Update = function (_mode) {
    let _ckflame = _mode.mode.modeflame;
}
Game_Interpreter.prototype.Btl_CngYarimon_BefTokusei = function (_mode) {
}
Game_Interpreter.prototype.Btl_EmCngYarimon_Move = function (_MonNo) {
    battle_Class.EmMonNo = _MonNo;
    if (battle_Class.Trainer.name != "原生ヤリモン") {
        StacSetSpriteC(PN_EmYarimon, Btl_PicPath + "PN_SrowBoll", 1170, 235, 1);
        StacRotatePic(PN_EmYarimon, 60, 1);
        StacMoveSprite(PN_EmYarimon, enemyYarimonX, 484, 20);
        battle_Class.TextAdd([
            battle_Class.Trainer.name + NLngStrGet(" は ") + NLngStrGet("<value> をくりだしてきた！" , [battle_Class.emYarimons[_MonNo].Name]),
            ""], 1);
    } else {
        StacSetSpriteC(PN_EmYarimon, "PtcPoint", 1170, 235, 1);
        StacMoveSprite(PN_EmYarimon, enemyYarimonX, 484, 20);
        battle_Class.TextAdd([
            NLngStrGet("<value> が襲いかかってくる！" , [battle_Class.emYarimons[_MonNo].Name]),
            ""], 1);
    }
    picFlameEnemyCharaArr[_MonNo].viewFlg = true;
    this.PicFrameEnemyReDraw();
    let _picPath = battle_Class.emYarimons[_MonNo].YarimonData.picPath;
    StacSetSpriteC(PN_EmYarimon, Btl_Yarimon + _picPath, enemyYarimonX, 484, 255, 0, 0);
    if (battle_Class.Trainer.name != "原生ヤリモン")
        StacPlayPtcPict(PN_EmYarimon, "BollEffect", enemyYarimonX, 484, 1);
    EasingStr = "easeOutElastic";
    StacMoveSprite(PN_EmYarimon, enemyYarimonX, enemyYarimonY, 5, 255, -100);
    EasingStr = "";
}
let _CngTokuseiEffData = null;
class CngTokuseiEffData {
    constructor(_InMon, _DefMon) {
        this.InMon = _InMon;
        this.DefMon = _DefMon;
    }
}
Game_Interpreter.prototype.Btl_CngYarimon_TokuseiSetting = function (InMon, DefMon) {
    _CngTokuseiEffData = new CngTokuseiEffData(InMon, DefMon);
}
Game_Interpreter.prototype.Btl_CngYarimon_TokuseiCheck = function () {
    if (_CngTokuseiEffData != null) {
        let _ckFlg = this.BattleYarimonChange_TokuseiUpdate(_CngTokuseiEffData.InMon, _CngTokuseiEffData.DefMon);
        if (!_ckFlg) {
            EffectActionArr = [];
            CngTikeEffDataArr = [];
            _CngTokuseiEffData = null;
            Btl_CngYarimon_Tokusei_Flame = CngTikeEffNo = 0;
            battle_Class.Update();
        }
        return _ckFlg;
    }
    return false;
}
let Btl_CngYarimon_Tokusei_Flame = 0;
let Btl_CngYarimon_LoopFlame = 60; 
let CngTikeEffNo = 0;
let CngTikeEffDataArr = [];
Game_Interpreter.prototype.BattleYarimonChange_TokuseiUpdate = function (InMon, DefMon) {
    Btl_CngYarimon_Tokusei_Flame++;
    if (Btl_CngYarimon_Tokusei_Flame == 1) {
        CngTikeEffNo = 0;
        let _effect = new oriEffectData("");
        switch (InMon.Tokusei.name) {
            case PassiveName._一発芸:
                if (InMon.TokuseiUseFlg) return false;
                InMon.TokuseiUseFlg = true;
                Btl_TokuseiWin_Set(InMon);
                battle_Class.TextAdd([
                    NLngStrGet("<value>の 一発芸が炸裂！" , [InMon.stName]), ""], 1);
                _effect.name = "能力変化";
                _effect.data = NRank._攻撃;
                _effect.data2 = -1;
                CngTikeEffDataArr.push(new AddEffectData(0, _effect));
                break;
            case PassiveName._テラーフェイス:
                if (InMon.TokuseiUseFlg) return false;
                InMon.TokuseiUseFlg = true;
                Btl_TokuseiWin_Set(InMon);
                battle_Class.TextAdd([
                    NLngStrGet("<value>の テラーフェイス！" , [InMon.stName]), ""], 1);
                _effect.name = "能力変化";
                _effect.data = NRank._防御;
                _effect.data2 = -1;
                CngTikeEffDataArr.push(new AddEffectData(0, _effect))
                break;
            case PassiveName._汁飛ばし:
                if (InMon.TokuseiUseFlg) return false;
                InMon.TokuseiUseFlg = true;
                Btl_TokuseiWin_Set(InMon);
                battle_Class.TextAdd([
                    NLngStrGet("<value>は とつぜん汁を飛ばした！" , [InMon.stName]), ""], 1);
                _effect.name = "能力変化";
                _effect.data = NRank._命中;
                _effect.data2 = -1;
                CngTikeEffDataArr.push(new AddEffectData(0, _effect))
                break;
            case PassiveName._きまぐれな風:
                battle_Class.TextAdd([
                    NLngStrGet("<value>の きまぐれな風がかき乱す！" , [InMon.stName]), ""], 1);
                Btl_TokuseiWin_Set(InMon);
                _effect.name = "能力変化";
                _effect.data = RndRankStr_Get(Math.floor(Math.random() * 5));
                _effect.data2 = -1;
                CngTikeEffDataArr.push(new AddEffectData(0, _effect))
                let _effect2 = new oriEffectData("");
                _effect2.name = "能力変化";
                _effect2.data = RndRankStr_Get(Math.floor(Math.random() * 5));
                _effect2.data2 = 1;
                _effect2.oneselfFlg = true;
                CngTikeEffDataArr.push(new AddEffectData(0, _effect2))
                break;
            case PassiveName._太陽放射:
                Btl_TokuseiWin_Set(InMon);
                battle_Class.TextAdd([
                    NLngStrGet("<value>は 炎を撒き散らした！" , [InMon.stName]), ""], 1);
                _effect.name = "状態異常";
                _effect.data = Ijo._炎上;
                CngTikeEffDataArr.push(new AddEffectData(0, _effect));
                break;
            case PassiveName._ガイアアーマー:
                if (InMon.TokuseiUseFlg) return false;
                InMon.TokuseiUseFlg = true;
                battle_Class.TextAdd([
                    NLngStrGet("<value>は 大地の力を身にまとう！" , [InMon.stName]), ""], 1);
                Btl_TokuseiWin_Set(InMon);
                let _effectG1 = new oriEffectData("");
                _effectG1.name = "能力変化";
                _effectG1.data = NRank._防御;
                _effectG1.data2 = 1;
                _effectG1.oneselfFlg = true;
                CngTikeEffDataArr.push(new AddEffectData(0, _effectG1))
                break
            case PassiveName._アクアクローク:
                if (InMon.TokuseiUseFlg) return false;
                InMon.TokuseiUseFlg = true;
                battle_Class.TextAdd([
                    NLngStrGet("<value>は 水の力を身にまとう！" , [InMon.stName]), ""], 1);
                Btl_TokuseiWin_Set(InMon);
                let _effectA1 = new oriEffectData("");
                _effectA1.name = "能力変化";
                _effectA1.data = NRank._回避;
                _effectA1.data2 = 1;
                _effectA1.oneselfFlg = true;
                CngTikeEffDataArr.push(new AddEffectData(0, _effectA1))
                break
            case PassiveName._ネクロフォース:
                if (InMon.TokuseiUseFlg) return false;
                InMon.TokuseiUseFlg = true;
                battle_Class.TextAdd([
                    NLngStrGet("<value>は 闇の力を身にまとう！" , [InMon.stName]), ""], 1);
                Btl_TokuseiWin_Set(InMon);
                let _effectN1 = new oriEffectData("");
                _effectN1.name = "能力変化";
                _effectN1.data = NRank._攻撃;
                _effectN1.data2 = 1;
                _effectN1.oneselfFlg = true;
                CngTikeEffDataArr.push(new AddEffectData(0, _effectN1))
                break
            case PassiveName._七色ボディ:
                battle_Class.TextAdd([
                    NLngStrGet("<value>の 身体が虹色の力を呼び覚ます！" , [InMon.stName]), ""], 1);
                Btl_TokuseiWin_Set(InMon);
                let _effectP1 = new oriEffectData("");
                _effectP1.name = "能力変化";
                _effectP1.data = RndRankStr_Get(Math.floor(Math.random() * 5));
                _effectP1.data2 = 1;
                _effectP1.oneselfFlg = true;
                CngTikeEffDataArr.push(new AddEffectData(0, _effectP1))
                let _effectP2 = new oriEffectData("");
                _effectP2.name = "能力変化";
                _effectP2.data = RndRankStr_Get(Math.floor(Math.random() * 5));
                _effectP2.data2 = 1;
                _effectP2.oneselfFlg = true;
                CngTikeEffDataArr.push(new AddEffectData(0, _effectP2))
                break;
            default:
                return false;
        }
    }
    if (Btl_CngYarimon_Tokusei_Flame == Btl_CngYarimon_LoopFlame) {
        if (CngTikeEffDataArr.length == CngTikeEffNo) return false;
        AddEffectSetting(null, InMon, DefMon, CngTikeEffDataArr[CngTikeEffNo]);
        CngTikeEffNo++;
    }
    let _ckFlame = Btl_CngYarimon_Tokusei_Flame - Btl_CngYarimon_LoopFlame;
    this.EffectActionArr_Update(_ckFlame);
    if (Btl_CngYarimon_Tokusei_Flame == Btl_CngYarimon_LoopFlame + 60) {
        Btl_CngYarimon_Tokusei_Flame = Btl_CngYarimon_LoopFlame - 1; 
    }
    return true;
}
let RndRankStr_Get = function (_ckNo) {
    switch (_ckNo) {
        case 0:
            return NRank._攻撃;
        case 1:
            return NRank._命中;
        case 2:
            return NRank._回避;
        case 3:
            return NRank._防御;
        case 4:
            return NRank._素早さ;
    }
    return null;
}
let _能力リセット = function (_mon , _マイナスのみ) {
    _マイナスのみ = typeof _マイナスのみ !== 'undefined' ? _マイナスのみ : false;
    if (_マイナスのみ) {
        if (_mon.R_Atk < 0) _mon.R_Atk = 0;
        if (_mon.R_Def < 0) _mon.R_Def = 0;
        if (_mon.R_Agi < 0) _mon.R_Agi = 0;
        if (_mon.R_Avo < 0) _mon.R_Avo = 0;
        if (_mon.R_Hit < 0) _mon.R_Hit = 0;
    } else {
        _mon.R_Atk = 0;
        _mon.R_Def = 0;
        _mon.R_Agi = 0;
        _mon.R_Avo = 0;
        _mon.R_Hit = 0;
    }
}
Game_Interpreter.prototype.Btl_Ijo_AddText = function (_mon, _Ijo_Cnt, _mode) {
    let IjoStr = _mon.Ijos[_Ijo_Cnt];
    switch (IjoStr) {
        case Ijo._凍結:
        case Ijo._炎上:
        case Ijo._切創:
        case Ijo._呪い:
            this.PlaySe("_zEffDmg");
            let _buffCol = [255, 0, 0];
            if (_mon.EnemyFlg) {
                StacSpriteCngColor(PN_EmYarimon, _buffCol, 15);
                StacSpriteCngColor(PN_EmYarimon, [0, 0, 0], 15);
            } else {
                StacSpriteCngColor(PN_PlYarimon, _buffCol, 15);
                StacSpriteCngColor(PN_PlYarimon, [0, 0, 0], 15);
            }
            break;
        default:
            break;
    }
    switch (IjoStr) {
        case Ijo._凍結:
            battle_Class.TextAdd([
                NLngStrGet( "<value> は 冷たさに震えている！" , _mon.stName), ""], 1);
            _mon.hp -= Math.floor(_mon.MHP / 8);
            AddIjoEffect(_mon, Ijo._凍結);
            break;
        case Ijo._炎上:
            battle_Class.TextAdd([
                NLngStrGet( "<value> は 炎で熱がっている！" , [_mon.stName]), ""], 1);
            _mon.hp -= Math.floor(_mon.MHP / 8);
            AddIjoEffect(_mon, Ijo._炎上);
            break;
        case Ijo._切創:
            battle_Class.TextAdd([
                NLngStrGet("<value> は 傷口がシクシク痛む！" , _mon.stName), ""], 1);
            _mon.hp -= Math.floor(_mon.MHP / 8);
            AddIjoEffect(_mon, Ijo._切創);
            break;
        case Ijo._呪い:
            battle_Class.TextAdd([
                NLngStrGet("<value> は 呪いで苦しんでいる！" , [_mon.stName]), ""], 1);
            _mon.hp -= Math.floor(_mon.MHP / 8);
            AddIjoEffect(_mon, Ijo._呪い);
            break;
        default:
            _mode.flame = IjoEffFlame - 1;
            break;
    }
    this.BtlBarDraw(true); 
}
let set_branch = -1; 
let _BtlBranch = { 
    Win: 0,
    Esc: 1,
    Lose: 2
};
let EndFlame = 0;
let Btl_End_Start = function () {
    EndFlame = 0;
    for (var i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++)
    {
        $gameSystem.Player.syojiTikemon[i].hp = battle_Class.plYarimons[i].hp;
    }
}
Game_Interpreter.prototype.Btl_End_Update = function (_mode) {
    EndFlame++;
    if (_mode.Escape) {
        this.Btl_End_EscapeUpdate(_mode);
        set_branch = _BtlBranch.Esc;
        return;
    }
    if (_mode.WinFlg) {
        this.Btl_End_WinUpdate(_mode);
    } else {
        this.Btl_End_LoseUpdate(_mode);
    }
}
Game_Interpreter.prototype.Btl_End_WinUpdate = function (_mode) {
    if (EndFlame == 1) {
        if (DLC2BtlFlg) { 
            set_branch = _BtlBranch.Win; 
            this.InstantLoad(); 
            flameRedrawFlg = true;
            return;
        }
        expFlame = BtlGetUpdateFlame = 0;
        set_branch = _BtlBranch.Win;
        this.DelSpriteSpan(PN_BtlStBar_R, PN_EmGetIcon);
        this.MoveSprite(PN_BtlPlTatie, -100, true, 60);
        if ($gameSystem.WinBGM == "") {
        } else {
            this.PlayBgm($gameSystem.WinBGM);
        }
        if (battle_Class.isYasei) {
            battle_Class.TextAdd([
                NLngStrGet("<value> を倒した！" , [battle_Class.emYarimons[0].Name]),
                ""], 30, true);
            if (battle_Class.emYarimons[0].Ijos.indexOf(Ijo._Get) != -1) {
                BtlGetUpdateFlg = true;
            }
        } else {
            let wonText = battle_Class.Trainer.jobName + NLngStrGet(" の ") + NLngStrGet("<value> に勝利した！" , [battle_Class.Trainer.name]);
            if (LngMode != "jp") {
                wonText = NLngStrGet("<value> に勝利した！" , [battle_Class.Trainer.jobName + " " + battle_Class.Trainer.name]);
            }
            battle_Class.TextAdd([wonText, ""], 30, true);
            this.SetSprite(PN_BtlEmTatie, Btl_EmTatie + battle_Class.Trainer.picPath, 732 + 380, 102, 255, 60, 60);
            this.MoveSprite(PN_BtlEmTatie, 732, true, 15, true, true, true);
            if (EndContentsBtlFlg) {
                battle_Class.TextAdd([ 
                    battle_Class.Trainer.endContentsTrData.winSelf, 
                    ""], 10, true);
            } else if (IsEndLaboMode()) {
                battle_Class.TextAdd([ 
                    battle_Class.Trainer.endLaboTrData.winSelf, 
                    ""], 10, true);
            } else {
                battle_Class.TextAdd([ 
                    battle_Class.Trainer.winSelf, 
                    ""], 10, true);
            }
        }
    }
    if (EndFlame == 4 && BtlGetUpdateFlg) { 
        if (this.Btl_End_GetUpdate()) EndFlame--;
    }
    if (EndFlame == 5 && !EndContentsBtlFlg && !IsEndLaboMode()) { 
        if (this.Btl_End_ExpUpdate()) EndFlame--;
    }
    if (EndFlame == 6 && !EndContentsBtlFlg && !IsEndLaboMode()) { 
        let _addSelfTxt = "";
        _addSelfTxt = NLngStrGet("経験値のかけらを") + _経験P + NLngStrGet("手に入れた")
        battle_Class.TextAdd([_addSelfTxt, ""], 10, true);
    }
    if (EndFlame == 10) { 
        this.SetSprite(PN_BtlEnsyutu, "Black", 0, 0, 0);
        this.MoveSprite(PN_BtlEnsyutu, 0, 0, 60);
        battle_Class.TextAdd([
            "", ""], 1);
    }
    if (EndFlame > 90) {
        this.InstantLoad(); 
        flameRedrawFlg = true;
    }
}
let BtlGetUpdateFlg = false;
let BtlGetUpdateFlame = 0;
let BtlGetZukanDrawFlg = false;
let BtlGetZukanNo = -1;
let BtlEndAddYarimon = null;
let BtlGetYarimonNo = -1;
const PN_BtlGetZukanBase = 320;
const PN_BtlGetZukanTxt = PN_BtlGetZukanBase + 1;
const PN_BtlGetZukanImg = PN_BtlGetZukanTxt + 1;
Game_Interpreter.prototype.Btl_End_GetUpdate = function () {
    BtlGetUpdateFlame++;
    if (BtlGetUpdateFlame == 1) {
        BtlGetZukanDrawFlg = false;
        getYarimonId = battle_Class.emYarimons[0].YarimonData.id;
        BtlGetZukanNo = GetYarimonZukanNo(getYarimonId);
    }
    if (BtlGetUpdateFlame == 30) {
        let _nakamaStr = NLngStrGet("<value> が仲間になった！" , [battle_Class.emYarimons[0].Name]);
        let _nakamaStr_2 = "";
        if (battle_Class.emYarimons[0].lv > $gameSystem.TrainerLv) {
            _nakamaStr_2 += NLngStrGet("※LvはトレーナーLvまで調整された")
        }
        battle_Class.TextAdd([_nakamaStr, _nakamaStr_2], 10, true, 0, 0, "_LevelUp");
        if (!$gameSystem.yZukan[BtlGetZukanNo].getFlg) {
            battle_Class.TextAdd([
                NLngStrGet("<value> の情報が図鑑に記録されたぞ！" , [battle_Class.emYarimons[0].Name]),
                ""], 10, true);
            BtlGetYarimonNo = BtlGetZukanNo;
        }
    }
    if (BtlGetUpdateFlame == 35) {
        if (!$gameSystem.yZukan[BtlGetZukanNo].getFlg) {
            BtlGetZukanDrawFlg = true;
            this.PlaySe("_NewZukan");
            $gameSystem.yZukan[BtlGetZukanNo].getFlg = true;
            Zukan_YarimanFlg = false;
            let zukanData = GetZukanData_No(BtlGetZukanNo);
            this.SetSprite(PN_BtlGetZukanBase , Btl_PicPath + "PN_BtlGetZukanBase" , 0,0);
            let setPicName = zukanData.picPath;
            let setText = zukanData.ecology.setu;
            this.SetSpriteC(PN_BtlGetZukanImg , Btl_Yarimon + setPicName , 711,266);
            let zureY = 0;
            let setTextSize = 20;
            if (LngMode == "en") {
                zureY = -80; setTextSize = 18;
            }
            this.SpriteStr(PN_BtlGetZukanTxt, SCol.Blk0 + setText, setTextSize,521 + zureY, 430);
        }
    }
    if (BtlGetUpdateFlame == 40 && BtlGetZukanDrawFlg) {
        if (Input.isTriggered('ok') || TouchInput.isTriggered()) { 
            BtlGetZukanDrawFlg = false;
            this.DelSpriteSpan(PN_BtlGetZukanBase, PN_BtlGetZukanImg);
        } else {
            BtlGetUpdateFlame--;
        }
    }
    if (BtlGetUpdateFlame == 45) {
        BtlEndAddYarimon = battle_Class.emYarimons[0].ResetYarimonData();
        if ($gameSystem.Player.syojiTikemon.length >= 3) {
            battle_Class.TextAdd([
                NLngStrGet("連れていけるヤリモンはいっぱいだ。"),
                NLngStrGet("<value> はベンチスペースへ送られた。" , [battle_Class.emYarimons[0].Name])], 10, true);
        }
    }
    if (BtlGetUpdateFlame == 60) {
        battle_Class.TextAdd(["", ""], 10, false);
        BtlGetUpdateFlg = false;
    }
    return BtlGetUpdateFlg;
}
let expFlame = 0;
let expCharaNo = 0;
let expLvUpText = [];
let EndPlayerCopyArr = [];
let TrainerUpFlg = false;
Game_Interpreter.prototype.Btl_End_ExpUpdate = function () {
    expFlame++;
    if (expFlame == 1) {
        expCharaNo = 0;
        TrainerUpFlg = false;
        if (!battle_Class.isYasei) { 
            if ($gameSystem.WinedTrainerArr.indexOf(btlTrainerId) == -1 && !BトレーナーLv上げないFlg) {
                btlWinTrainerId = btlTrainerId;
                battle_Class.TextAdd([
                    NLngStrGet("トレーナーレベルが上がった！"), ""], 10, true);
                TrainerUpFlg = true;
            }
        }
    }
    if (expFlame == 2) {
        let setText = NLngStrGet("経験値") + " " + _経験P + " " + NLngStrGet("が全員に行き渡った");
        if (LngMode == "en") setText = _経験P + " " + NLngStrGet("経験値") + " " + NLngStrGet("が全員に行き渡った");
        battle_Class.TextAdd([setText, ""], 15, true, 145);
        DouguMenuPNSetting(PN_BtlLayer2Base + 1, PN_BtlSelecter);
        this.SetSprite(PN_ymBase, mYarimon_PPath + "PN_ymExpBase", BPs._x, BPs._y);
        this.Menu_YarimonWakuDraw();
    }
    if (expFlame == 5) { 
        $gameSystem.Player.syojiTikemon[expCharaNo].exp += _経験P;
    }
    if (expFlame == 15) {
        let Mons = $gameSystem.Player.syojiTikemon[expCharaNo];
        let yData = $gameSystem.Player.syojiTikemon[expCharaNo].YarimonData;
        let lvUpEffectFlg = false; 
        let lvUpSinkaFlg = false; 
        let _befLv = Mons.lv;
        var addNewWazaFlg = false;
        let ckTrainerLv = $gameSystem.TrainerLv;
        if (TrainerUpFlg) ckTrainerLv++;
        while (Mons.exp > Mons.lv) {
            if (ckTrainerLv <= Mons.lv) {
                Mons.exp = Mons.lv - 1;
                break;
            }
            Mons.exp -= Mons.lv;
            Mons.lv++;
            //Mons.hp = MHP(Mons);
            yData.wazaList.forEach(lnWaza => {
                if (lnWaza.lv == Mons.lv) {
                    if (Mons.btlWazas.length < 4) {
                        $N_Yarimon_DB.wazaDatas.forEach(_wazaData => {
                            if (_wazaData.id == lnWaza.id) {
                                Mons.btlWazas.push(new WazaData(_wazaData.id, _wazaData.kaisu));
                            }
                        });
                    } else {
                        addNewWazaFlg = true;
                    }
                }
            });
            lvUpEffectFlg = true;
        }
        battle_Class.plYarimons[expCharaNo].lv = Mons.lv;
        let lvUpNewWazaFlg = CheckNewWazaGet_YarimonData(yData, _befLv, Mons.lv);
        if (yData.sinka_lv > 0 && Mons.lv > yData.sinka_lv) {
            lvUpSinkaFlg = true;
        }
        if (lvUpEffectFlg) {
            let WazaLnStr = "";
            if (lvUpNewWazaFlg) WazaLnStr = NLngStrGet("新しい技を使えるようになった!!");
            btlNewWazaSave[expCharaNo] = addNewWazaFlg;
            battle_Class.TextAdd([NLngStrGet("<value> のレベルが上がった！" , [yData.name]), WazaLnStr], 15, true, 145);
            this.Menu_YarimonWakuDraw(expCharaNo);
            this.PlayPtcPic("LevelUp", 400, 265 + 170 * expCharaNo);
        }
        if (lvUpSinkaFlg && !IsEndLaboMode()) {
            battle_Class.TextAdd([
                NLngStrGet("<value> はソウルアップできそうだ！" , [yData.name]), ""], 15, true, 145);
        }
        expCharaNo++;
        if (expCharaNo < $gameSystem.Player.syojiTikemon.length) {
            expFlame = 4;
        }
    }
    if (expFlame == 18) {
        this.DelSprite(PN_ymBase);
        this.DelSpriteSpan(PN_BtlLayer2Base + 1, PN_BtlSelecter);
        battle_Class.TextAdd(["", ""], 1);
        EndPlayerCopyArr = $gameSystem.Player.syojiTikemon.slice();
        return false;
    }
    return true; 
}
Game_Interpreter.prototype.Btl_End_LoseUpdate = function (_mode) {
    if (EndFlame == 1) {
        AudioManager.fadeOutBgm(1);
        set_branch = _BtlBranch.Lose;
        battle_Class.TextAdd([
            NLngStrGet("パーティーが全滅してしまった・・・"),
            NLngStrGet("※経験のかけらを") + _経験P + NLngStrGet("個手に入れた")], 60, true);
        this.SetSprite(PN_BtlEnsyutu, "Black", 0, 0, 0);
        this.MoveSprite(PN_BtlEnsyutu, 0, 0, 30);
    }
    if (EndFlame > 30) {
        EndPlayerCopyArr = $gameSystem.Player.syojiTikemon.slice();
        this.InstantLoad(); 
        flameRedrawFlg = true;
    }
}
Game_Interpreter.prototype.Btl_End_EscapeUpdate = function (_mode) {
    let EndFlame = _mode.flame;
    if (EndFlame == 1) {
        set_branch = _BtlBranch.Esc;
    }
}
