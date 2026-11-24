Game_Interpreter.prototype.BtlBattle_Update = function (ckMode) {
    switch (ckMode.modeName) {
        case Btl_Battle.Setting: 
            this.BtlBattle_Setting_Update(ckMode);
            break;
        case Btl_Battle.PlAction: 
            this.BtlBattle_Action_Update(ckMode.mode);
            break;
        case Btl_Battle.EmAction: 
            this.BtlBattle_Action_Update(ckMode.mode);
            break;
        case Btl_Battle.Check: 
            this.BtlBattle_Check_Check(ckMode);
            break;
        case Btl_Battle.CngYarimon: 
            this.BtlBattle_CngYarimon_Update(ckMode.mode);
            break;
        case Btl_Battle.EmCngYarimon: 
            this.BtlBattle_EmCngYarimon_Update(ckMode.mode);
            break;
        case Btl_Battle.PlIjo: 
            this.BtlBattle_PlIjo_Update(ckMode.mode);
            break;
        case Btl_Battle.EmIjo: 
            this.BtlBattle_EmIjo_Update(ckMode.mode);
            break;
    }
}
Game_Interpreter.prototype.BtlBattle_Setting_Update = function (ckMode) {
}
let BtlWazaEffectStacSet = function (picNo , _picName , xPos , yPox) {
    if (_picName.indexOf("Cmb") != -1)
        StacPlayPtcComboPic(picNo, _picName, xPos, yPox);
    else
        StacPlayPtcSprite(picNo, _picName, xPos, yPox);
}
/* ■ 戦闘メイン行動:Update ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
const yarimonBaseY = 231 + 145;
let enemyYarimonX = 0;
let enemyYarimonY = yarimonBaseY;
let playerYarimonX = 0;
let playerYarimonY = yarimonBaseY;
let btlEscapeFlg = false; 
let btlAddEffect = []; 
let btlAddEffect_No = 0; 
let btlHitCheck = true; 
let btlDmgVar = 0;
let btlEffSkipFlg = false;
let btlWazaId = -1;
Game_Interpreter.prototype.BtlBattle_Action_Update = function (ckMode) {
    switch (ckMode.modeName) {
        case Btl_Battle_Action.Effect:
            this.BtlBattle_Action_EffectUpdate(ckMode);
            break;
        case Btl_Battle_Action.Damage:
            this.BtlBattle_Action_DamageUpdate(ckMode);
            break;
        case Btl_Battle_Action.AddEffect:
            this.BtlBattle_Action_AddEffectUpdate(ckMode);
            break;
    }
    if (Btl_BarDraw_Flg) {
        Btl_BarDraw_Flg = false;
        this.BtlBarDraw(true);
    }
}
Game_Interpreter.prototype.BtlBattle_Action_EffectUpdate = function (ckMode) {
    let ckFlame = ckMode.modeflame;
    let btlBarDrawFlame = 30;
    if (ckFlame == 1) { 
        btlAddEffect_No = 0;
        btlEscapeFlg = false;
        if (ckMode.parent.PlayerDoingFlg) { 
            btlWazaId = ckMode.parent.PlayerWazaId;
            switch (btlWazaId) {
                case ExWazaid.MonCng: 
                    this.Btl_Yarimon_CngMove(ckMode.parent.CngYarimonNo);
                    break;
                case ExWazaid.NotMove: 
                    break;
                case ExWazaid.Escape: 
                    this.DelSprite(PN_BtlSelecter);
                    this.BtlL1PicDel();
                    let _rndVar = Math.random() * 5;
                    let _self1 = "";
                    let _self2 = "";
                    switch (Math.floor(_rndVar)) {
                        case 0:
                            _self1 = NLngStrGet("やばい！　逃げろ！！");
                            _self2 = "";
                            break;
                        case 1:
                            _self1 = NLngStrGet("ここは逃げるべき時！");
                            _self2 = "";
                            break;
                        case 2:
                            _self1 = NLngStrGet("一時撤退だー！");
                            _self2 = "";
                            break;
                        case 3:
                            _self1 = NLngStrGet("撤退、撤退ーーーっ！");
                            _self2 = "";
                            break;
                        case 4:
                            _self1 = NLngStrGet("あっ、予定を思い出した！");
                            _self2 = "";
                            break;
                    }
                    if (Checkラボorツアー()) {
                        set_branch = _BtlBranch.Lose; 
                        _self1 = NLngStrGet("まいった…降参だ！");
                        _self2 = "";
                    } else {
                        this.MoveSpriteAdd(PN_PlYarimon, -300, 0, 30);
                    }
                    battle_Class.TextAdd([_self1, _self2], 1, true);
                    btlEscapeFlg = true;
                    break;
                case ExWazaid.GetSet: 
                    battle_Class.emYarimons[0].Ijos.push(Ijo._Get);
                    btlEffSkipFlg = true;
                    StacPlayPtcSprite(PN_BtlPtc, "Effect_Get", enemyYarimonX, enemyYarimonY);
                    battle_Class.TextAdd([NLngStrGet("スターディスクを使った！"), ""], 60, true);
                    this.BtlBarDraw(true); 
                    battle_Class.TextAdd([NLngStrGet("相手はGet状態になった！"), NLngStrGet("倒したら仲間になるぞ！")], 1, true);
                    break;
                case ExWazaid.UseDougu: 
                    let _setEff = new _setEfData(
                        BtlUseDouguData[0].data1,
                        BtlUseDouguData[0].data2,
                        100, "能力変化", true);
                    let _ckStr = BtlStatusRankCng(ckMode.parent.DoingYarimon, _setEff.EffectData)
                    battle_Class.TextAdd([UseDouguTxt + NLngStrGet("を使った"), _ckStr], 1, false);
                    this.BtlBarDraw(true); 
                    break;
                default: 
                    if (ckMode.parent.DoingYarimon.Ijos.indexOf(Ijo._痺れ) != -1 &&
                        !ckMode.parent.DoingYarimon.SibireSkip) {
                        battle_Class.TextAdd([
                            ckMode.parent.DoingYarimon.stName + NLngStrGet(" は痺れた直後で行動できない！"),
                            ""], 1);
                        ckMode.parent.DoingYarimon.SibireSkip = true;
                        btlAddEffect = [];
                        btlEffSkipFlg = true;
                    } else if (!btlHitCheck) {
                        battle_Class.TextAdd([
                            ckMode.parent.DoingYarimon.stName + NLngStrGet(" の 攻撃ははずれた！"),
                            ""], 1);
                        btlAddEffect = [];
                        if (battle_Class.emYarimons[battle_Class.EmMonNo].Tokusei.name == PassiveName._惑いの光 && !LastBtlFlg) {
                            Btl_TokuseiWin_Set(battle_Class.emYarimons[battle_Class.EmMonNo]);
                            battle_Class.TextAdd([
                                ckMode.parent.DoingYarimon.stName + NLngStrGet(" の 攻撃ははずれた！"),
                                NLngStrGet("惑いの光で勢いあまって、壁に激突した！")], 1);
                            let _effect = new oriEffectData("");
                            _effect.name = "特性ダメージ";
                            _effect.kakuritu = 33;
                            _effect.oneselfFlg = true;
                            btlAddEffect.push(new AddEffectData(0, _effect))
                        }
                        btlEffSkipFlg = true;
                        StacMoveSprite(PN_PlYarimon, playerYarimonX - 50, playerYarimonY, 20, 255);
                        //let _addTimer = StacSpriteimerGet(PN_PlYarimon);
                        this.PlaySe("noHit");
                        StacMoveSprite(PN_PlYarimon, playerYarimonX + 50, playerYarimonY, 5, 255);
                        StacMoveSprite(PN_PlYarimon, playerYarimonX, playerYarimonY, 5, 255);
                        StacWaitSprite(PN_PlYarimon, 30);
                    } else {
                        battle_Class.TextAdd([
                            ckMode.parent.DoingYarimon.stName + NLngStrGet(" の ") + ckMode.parent.DoingWaza.name + "！",
                            ""], 1);
                        switch (ckMode.parent.DoingWaza.id) {
                            case WazaID._未来への翼:
                            case WazaID._未来への翼 - 1: 
                                this.BtlTextDrawSingle(ckMode.parent.DoingYarimon.stName + NLngStrGet(" の ") + ckMode.parent.DoingWaza.name + "！");
                                this.BtlEx_未来への翼();
                                break;
                            default:
                                EasingStr = "easeOutQuad";
                                StacMoveSprite(PN_PlYarimon, playerYarimonX - 50, playerYarimonY, 20, 255);
                                StacMoveSprite(PN_PlYarimon, playerYarimonX + 50, playerYarimonY, 5, 255);
                                StacMoveSprite(PN_PlYarimon, playerYarimonX, playerYarimonY, 5, 255);
                                StacWaitSprite(PN_PlYarimon, 30);
                                let picName = GetWazaPtcName(ckMode.parent.DoingWaza.id);
                                if (WazaEffectGet(ckMode.parent.DoingWaza.id)) {
                                    BtlWazaEffectStacSet(PN_BtlPtc, picName, playerYarimonX, playerYarimonY);
                                } else {
                                    BtlWazaEffectStacSet(PN_BtlPtc, picName, enemyYarimonX, enemyYarimonY);
                                }
                                break;
                        }
                        EasingStr = "";
                    }
                    break;
            }
        } else {
            btlWazaId = ckMode.parent.DoingWaza.id;
            if (ckMode.parent.DoingYarimon.Ijos.indexOf(Ijo._痺れ) != -1 &&
                !ckMode.parent.DoingYarimon.SibireSkip) {
                battle_Class.TextAdd([
                    ckMode.parent.DoingYarimon.stName + NLngStrGet(" は痺れた直後で行動できない！"), ""], 1);
                ckMode.parent.DoingYarimon.SibireSkip = true;
                btlAddEffect = [];
                btlEffSkipFlg = true;
            } else if (!btlHitCheck) {
                battle_Class.TextAdd([
                    ckMode.parent.DoingYarimon.stName + NLngStrGet(" の 攻撃ははずれた！"),
                    ""], 1);
                btlAddEffect = [];
                if (battle_Class.plYarimons[battle_Class.PLMonNo].Tokusei.name == PassiveName._惑いの光 && !LastBtlFlg) {
                    Btl_TokuseiWin_Set(battle_Class.plYarimons[battle_Class.PLMonNo]);
                    battle_Class.TextAdd([
                        ckMode.parent.DoingYarimon.stName + NLngStrGet(" の 攻撃ははずれた！"),
                        NLngStrGet("惑いの光で勢いあまって、壁に激突した！")], 1);
                    let _effect = new oriEffectData("");
                    _effect.name = "特性ダメージ";
                    _effect.kakuritu = 33;
                    _effect.oneselfFlg = true;
                    btlAddEffect.push(new AddEffectData(0, _effect))
                }
                btlEffSkipFlg = true;
                if (!LastBtlFlg) this.PlaySe("noHit");
                StacMoveSprite(PN_EmYarimon, enemyYarimonX + 50, enemyYarimonY, 20, 255, true);
                StacMoveSprite(PN_EmYarimon, enemyYarimonX - 50, enemyYarimonY, 5, 255, true);
                StacMoveSprite(PN_EmYarimon, enemyYarimonX, enemyYarimonY, 5, 255, true);
                StacWaitSprite(PN_EmYarimon, 30);
            } else {
                switch (ckMode.parent.DoingWaza.id) {
                    case WazaID._薙ぎ払い業:
                        this.BtlTextDrawSingle(ckMode.parent.DoingYarimon.stName + NLngStrGet(" の ") + ckMode.parent.DoingWaza.name + "！");
                        this.BtlEx_薙ぎ払い業();
                        break;
                    case WazaID._終わりの翼:
                        this.BtlTextDrawSingle(ckMode.parent.DoingYarimon.stName + NLngStrGet(" の ") + ckMode.parent.DoingWaza.name + "！");
                        this.BtlEx_終わりの翼();
                        break;
                    default:
                        if (ckMode.parent.DoingWaza.id == WazaID._天からの救済) btlBarDrawFlame = 120;
                        battle_Class.TextAdd([
                            ckMode.parent.DoingYarimon.stName + NLngStrGet(" の ") + ckMode.parent.DoingWaza.name + "！",
                            ""], 1);
                        EasingStr = "easeOutQuad";
                        StacMoveSprite(PN_EmYarimon, enemyYarimonX + 50, enemyYarimonY, 20, 255, true);
                        StacMoveSprite(PN_EmYarimon, enemyYarimonX - 50, enemyYarimonY, 5, 255, true);
                        StacMoveSprite(PN_EmYarimon, enemyYarimonX, enemyYarimonY, 5, 255, true);
                        StacWaitSprite(PN_EmYarimon, 30);
                        let picName = GetWazaPtcName(ckMode.parent.DoingWaza.id);
                        if (WazaEffectGet(ckMode.parent.DoingWaza.id)) {
                            BtlWazaEffectStacSet(PN_BtlPtc, picName, enemyYarimonX, enemyYarimonY);
                        } else {
                            BtlWazaEffectStacSet(PN_BtlPtc, picName, playerYarimonX, playerYarimonY);
                        }
                        EasingStr = "";
                        break;
                }
            }
        }
    }
    if (ckFlame == 3 && btlEscapeFlg) {
        set_branch = _BtlBranch.Win;
        if (Checkラボorツアー()) set_branch = _BtlBranch.Lose;
    }
    if (ckFlame == 10 && btlEscapeFlg) {
        this.SetSpriteFIn(PN_BtlEn, "Black", 0, 0, 0, 0, 15);
    }
    if (ckFlame == 25 && btlEscapeFlg) {
        EndPlayerCopyArr = $gameSystem.Player.syojiTikemon.slice();
        this.InstantLoad(); 
    }
    if (ckFlame == btlBarDrawFlame) { 
        if (btlEffSkipFlg) {
            ckMode.ModeCng(Btl_Battle_Action.AddEffect);
            btlEffSkipFlg = false;
            this.BtlBarDraw(true);
            return;
        }
        if (ckMode.parent.PlayerWazaId == ExWazaid.NotMove && ckMode.parent.PlayerDoingFlg) {
            var addStr = "";
            for (let i = 0; i <= ItemUseTextArr.length - 1; i++) {
                addStr += ItemUseTextArr[i];
            }
            ItemUseTextArr = [];
            battle_Class.TextAdd([NLngStrGet("<value>を使った！" , [UseDouguTxt]), addStr], 30, true);
            battle_Class.TextAdd(["", ""], 1);
            ckMode.parent.ModeCng(Btl_Battle.Check);
            this.BtlBarDraw(true); 
        } else {
            ckMode.ModeCng(Btl_Battle_Action.Damage);
        }
    }
}
let DmgeCounterAdd = 0;
Game_Interpreter.prototype.BtlBattle_Action_DamageUpdate = function (ckMode) {
    let ckFlame = ckMode.modeflame;
    if (ckFlame == 1) { 
        this.BtlBarDraw(true); 
        if (battle_Class.plYarimons[battle_Class.PLMonNo].hp <= 0 || battle_Class.emYarimons[battle_Class.EmMonNo].hp <= 0) {
        } else {
            for (let i = 0; i <= ckMode.parent.DmgTxtArr.length - 1; i++) {
                let counter = 60 + DmgeCounterAdd;
                if (i == ckMode.parent.DmgTxtArr.length - 1) counter = 1;
                battle_Class.TextAdd([ckMode.parent.DmgTxtArr[i], ""], counter);
                Tokusei_Effect();
                DmgeCounterAdd = 0;
            }
        }
        if (ckMode.parent.PLDmgEffectArr.length > 0 && battle_Class.plYarimons[battle_Class.PLMonNo].hp > 0) {
            this.Plダメージ揺れ();
        }
        if (ckMode.parent.EmDmgEffectArr.length > 0 && battle_Class.emYarimons[battle_Class.EmMonNo].hp > 0) {
            this.Emダメージ揺れ();
        }
    }
    if (ckFlame == 5) {
        if (btlWazaId == ExWazaid.MonCng) {
            this.Btl_CngYarimon_TokuseiSetting(
                battle_Class.plYarimons[battle_Class.PLMonNo],
                battle_Class.emYarimons[battle_Class.EmMonNo]);
        }
    }
    let zureFlame = 30;
    if (ckFlame == 60 - zureFlame) { 
        if (battle_Class.plYarimons[battle_Class.PLMonNo].hp <= 0) {
            this.PlYarimonDown();
        }
    }
    if (ckFlame == 62 - zureFlame) {
        if (battle_Class.emYarimons[battle_Class.EmMonNo].hp <= 0) {
            this.EmYarimonDown();
        }
    }
    if (ckFlame == 63 - zureFlame) {
        if (btlAddEffect.length > 0 && btlHitCheck) { 
            btlAddEffect_No = 0;
            ckMode.ModeCng(Btl_Battle_Action.AddEffect);
        }
    }
    if (ckFlame == 64 - zureFlame) ckMode.ModeCng(Btl_Battle_Action.AddEffect);
    if (battle_Class.plYarimons[battle_Class.PLMonNo].hp <= 0 || battle_Class.emYarimons[battle_Class.EmMonNo].hp <= 0) {
        if (ckFlame == 90 - zureFlame) {
            ckMode.parent.ModeCng(Btl_Battle.Check);
        }
    }
}
Game_Interpreter.prototype.BtlBattle_Action_AddEffectUpdate = function (ckMode) {
    let ckFlame = ckMode.modeflame;
    if (ckFlame == 1) {
        if (btlAddEffect.length == 0) {
            btlAddEffect_No = 0;
            BtlAddEffEndFlame = 1; 
        } else {
            BtlAddEffEndFlame = 60;
            Btl_DmgTokusei_Flame = 0;
            let addEffectData = btlAddEffect[btlAddEffect_No];
            let AtkMon = battle_Class.plYarimons[battle_Class.PLMonNo];
            let DefMon = battle_Class.emYarimons[battle_Class.EmMonNo];
            if (!ckMode.parent.PlayerDoingFlg) {
                AtkMon = battle_Class.emYarimons[battle_Class.EmMonNo];
                DefMon = battle_Class.plYarimons[battle_Class.PLMonNo];
            }
            if (addEffectData != undefined) {
                AddEffectSetting(ckMode, AtkMon, DefMon, addEffectData);
            }
        }
    }
    this.EffectActionArr_Update(ckFlame);
    if (ckFlame >= BtlAddEffEndFlame) {
        let AtkMon = battle_Class.plYarimons[battle_Class.PLMonNo];
        let DefMon = battle_Class.emYarimons[battle_Class.EmMonNo];
        if (!ckMode.parent.PlayerDoingFlg) {
            AtkMon = battle_Class.emYarimons[battle_Class.EmMonNo];
            DefMon = battle_Class.plYarimons[battle_Class.PLMonNo];
        }
        var ckEffect = btlAddEffect[btlAddEffect_No];
        if (ckEffect == undefined) {
        } else {
            if (AtkMon.hp <= 0) {
                if (!AtkMon.EnemyFlg) {
                    this.PlYarimonDown();
                } else {
                    this.EmYarimonDown();
                }
                for (let i = btlAddEffect_No + 1; i < btlAddEffect.length; i++) {
                    if (btlAddEffect[i].EffectData.oneselfFlg) btlAddEffect.splice(i , 1);
                }
            }
            if (DefMon.hp <= 0) {
                if (!DefMon.EnemyFlg) {
                    this.PlYarimonDown();
                } else {
                    this.EmYarimonDown();
                }
                for (let i = btlAddEffect_No + 1; i < btlAddEffect.length; i++) {
                    if (!btlAddEffect[i].EffectData.oneselfFlg) btlAddEffect.splice(i , 1);
                }
            }
        }
        btlAddEffect_No++;
        if (btlAddEffect.length <= btlAddEffect_No) { 
            if (this.Btl_DmgTokusei_Update(AtkMon, DefMon)) {
                ckMode.flame--;
                return;
            }
            Btl_DmgTokusei_Flame = 0; 
            ckMode.parent.ModeCng(Btl_Battle.Check);
        } else {
            ckMode.ResetFlame();
        }
    }
}
Game_Interpreter.prototype.Btl_Yarimon_CngMove = function (yarimonNo, hinsiFlg) {
    hinsiFlg = typeof hinsiFlg !== 'undefined' ? hinsiFlg : false;
    if (!hinsiFlg) {
        battle_Class.plYarimons[battle_Class.PLMonNo].R_Atk = 0;
        battle_Class.plYarimons[battle_Class.PLMonNo].R_Atk = 0;
        battle_Class.plYarimons[battle_Class.PLMonNo].R_Def = 0;
        battle_Class.plYarimons[battle_Class.PLMonNo].R_Agi = 0;
        battle_Class.plYarimons[battle_Class.PLMonNo].R_Avo = 0;
        battle_Class.plYarimons[battle_Class.PLMonNo].R_Hit = 0;
        battle_Class.TextAdd([
            NLngStrGet("もどれ！") + battle_Class.plYarimons[battle_Class.PLMonNo].Name,
            ""], 30);
        StacPlayPtcSprite(PN_PlYarimon, "BollEffect", playerYarimonX, 484, 1);
    } else {
        //     !battle_Class.plYarimons[battle_Class.PLMonNo].TokuseiUseFlg) {
        //     Btl_TokuseiWin_Set(battle_Class.plYarimons[battle_Class.PLMonNo]);
        //         Math.floor(battle_Class.plYarimons[battle_Class.PLMonNo].MHP / 2);
    }
    StacSpriteCngColor(PN_PlYarimon, [255, 255, 0], 5);
    StacSetSpriteC(PN_PlYarimon, Btl_PicPath + "PN_SrowBoll", 271, 235, 1);
    StacRotatePic(PN_PlYarimon, 60, 1);
    StacMoveSprite(PN_PlYarimon, playerYarimonX, 484, 20);
    battle_Class.PLMonNo = yarimonNo;
    battle_Class.TextAdd([
        NLngStrGet("がんばれ！") + battle_Class.plYarimons[yarimonNo].Name,
        ""], 1);
    PlTurnDownFlg = false;
    let picPath = battle_Class.plYarimons[yarimonNo].YarimonData.picPath;
    StacSetSpriteC(PN_PlYarimon, Btl_Yarimon + picPath, playerYarimonX, 484, 255, 0, 0);
    StacPlayPtcSprite(PN_PlYarimon, "BollEffect", playerYarimonX, 484, 1);
    EasingStr = "easeOutElastic";
    StacMoveSprite(PN_PlYarimon, playerYarimonX, playerYarimonY, 5, 255);
    EasingStr = "";
}
Game_Interpreter.prototype.BtlBattle_Check_Check = function (ckMode) {
    let ckFlame = ckMode.modeflame;
    if (ckFlame == 1) {
        this.Btl_Battle_Check_TokuseiSetting(
            battle_Class.plYarimons[battle_Class.PLMonNo],
            battle_Class.emYarimons[battle_Class.EmMonNo]);
    }
    if (ckFlame == 3) {
        this.Btl_Battle_Check_TokuseiSetting(
            battle_Class.emYarimons[battle_Class.EmMonNo],
            battle_Class.plYarimons[battle_Class.PLMonNo]);
    }
    if (ckFlame == 5) {
        ckMode.Check();
        return;
    }
    this.Btl_Battle_Check_Update(ckMode.mode);
}
Game_Interpreter.prototype.Btl_Battle_Check_Update = function (ckMode) {
    switch (ckMode.mode) {
        case Btl_End.Start:
        case Btl_End.Text:
            this.Btl_Battle_Check_Start_Update(ckMode);
            break;
    }
}
Game_Interpreter.prototype.Btl_Battle_Check_Start_Update = function (ckMode) {
    let ckFlame = ckMode.mode.modeflame;
    if (!battle_Class.isYasei) {
        if (ckFlame == 1) {
            this.SetSprite(PN_BtlPlTatie, Btl_PicPath + "Player_Tatie", -100, 232);
            this.MoveSprite(PN_BtlPlTatie, 287 + 10, 232, 60);
            this.SetSprite(PN_BtlEmTatie, Btl_EmTatie + battle_Class.Trainer.picPath, 1100, 102, 255, 60, 60);
            this.MoveSprite(PN_BtlEmTatie, 732, 102, 60, 255, true, true);
            return;
        }
        if (ckFlame == 60) {
            if (ckMode.WinFlg) { 
            } else { 
            }
            return;
        }
    } else {
    }
}
Game_Interpreter.prototype.BtlBattle_CngYarimon_Update = function (ckMode) {
    switch (ckMode.modeName) {
        case Btl_Battle_CngYarimon.Yarimon:
            this.BtlSelect_Yarimon_BaseUpdate(ckMode.mode);
            break;
        case Btl_Battle_CngYarimon.Back:
            this.Btl_ngYarimon_Back_Update(ckMode)
            break;
    }
}
Game_Interpreter.prototype.Btl_ngYarimon_Back_Update = function (ckMode) {
    let ckFlame = ckMode.mode.flame;
    if (ckFlame >= 30) { 
        ckMode.parent.PLMovedFlg = true;
        this.BtlBarDraw(true); 
        this.Btl_CngYarimon_TokuseiSetting(
            battle_Class.plYarimons[battle_Class.PLMonNo],
            battle_Class.emYarimons[battle_Class.EmMonNo])
        ckMode.parent.ModeCng(Btl_Battle.Check);
    }
}
Game_Interpreter.prototype.BtlBattle_EmCngYarimon_Update = function (ckMode) {
    if (LastBtlFlg) { 
        if (battle_Class.EmMonNo == 0) battle_Class.EmMonNo = 1;
        else battle_Class.EmMonNo = 2;
        ckMode.parent.EmMovedFlg = true; 
        ckMode.parent.ModeCng(Btl_Battle.Check);
        return;
    }
    //敵：チケモン：交換時::ModeBox(Btl_Battle.EmCngYarimon)
    let ckFlame = ckMode.flame;
    if (ckFlame == 1) {
        Btl_CngYarimon_Tokusei_Flame = 0;
        for (let i = 0; i <= battle_Class.emYarimons.length - 1; i++) {
            if (battle_Class.emYarimons[i].hp > 0) {
                this.Btl_EmCngYarimon_Move(i);
                return;
            }
        }
    }
    if (ckFlame == 30) {
        for (let i = 0; i <= battle_Class.emYarimons.length - 1; i++) {
            //     battle_Class.emYarimons[i].Tokusei.name == PassiveName._転生の炎) {
            //     battle_Class.emYarimons[i].hp = Math.floor(battle_Class.emYarimons[i].MHP / 2);
            //     Btl_TokuseiWin_Set(battle_Class.emYarimons[i]);
        }
        ckMode.parent.EmMovedFlg = true;
        this.BtlBarDraw(true); 
        this.Btl_CngYarimon_TokuseiSetting(
            battle_Class.emYarimons[battle_Class.EmMonNo],
            battle_Class.plYarimons[battle_Class.PLMonNo])
        ckMode.parent.ModeCng(Btl_Battle.Check);
    }
}
let playerIjoCount = 0;
const IjoEffFlame = 45;
Game_Interpreter.prototype.BtlBattle_PlIjo_Update = function (ckMode) {
    let ckFlame = ckMode.flame;
    if (ckFlame == 1) {
        playerIjoCount = ijoTokuseiFlame = 0;
        btlAddEffect = []; 
        return;
    }
    if (ckFlame == 3) {
        if (battle_Class.plYarimons[battle_Class.PLMonNo].Ijos.length == playerIjoCount ||
            battle_Class.plYarimons[battle_Class.PLMonNo].hp <= 0) {
            if (this.BattleIjo_TokuseiUpdate(battle_Class.plYarimons[battle_Class.PLMonNo])) {
                ckMode.flame--; 
                return;
            }
            ckMode.parent.PLIjoCheck = true;
            battle_Class.TextAdd(["", ""], 1);
            if (battle_Class.plYarimons[battle_Class.PLMonNo].hp <= 0) {
                ckMode.parent.ModeCng(Btl_Battle.PlAction);
                ckMode.parent.mode.ModeCng(Btl_Battle_Action.Damage);
                ckMode.parent.mode.flame = 60;
                return;
            }
            ckMode.parent.ModeCng(Btl_Battle.Check);
            return;
        }
        this.Btl_Ijo_AddText(battle_Class.plYarimons[battle_Class.PLMonNo], playerIjoCount, ckMode);
    }
    if (ckFlame == IjoEffFlame) {
        if (battle_Class.plYarimons[battle_Class.PLMonNo].hp <= 0) {
            this.PlYarimonDown();
            playerIjoCount = battle_Class.plYarimons[battle_Class.PLMonNo].Ijos.length; 
        } else {
            playerIjoCount++;
        }
        ckMode.flame = 2; 
    }
}
let enemyIjoCount = 0;
Game_Interpreter.prototype.BtlBattle_EmIjo_Update = function (ckMode) {
    let ckFlame = ckMode.flame;
    if (ckFlame == 1) {
        enemyIjoCount = ijoTokuseiFlame = 0;
        btlAddEffect = []; 
        return;
    }
    if (ckFlame == 3) {
        if (battle_Class.emYarimons[battle_Class.EmMonNo].Ijos.length <= enemyIjoCount ||
            battle_Class.emYarimons[battle_Class.EmMonNo].hp <= 0) {
            if (this.BattleIjo_TokuseiUpdate(battle_Class.emYarimons[battle_Class.EmMonNo])) {
                ckMode.flame--; 
                return;
            }
            ckMode.parent.EmIjoCheck = true;
            battle_Class.TextAdd(["", ""], 1);
            if (battle_Class.emYarimons[battle_Class.EmMonNo].hp <= 0) {
                ckMode.parent.ModeCng(Btl_Battle.EmAction);
                ckMode.parent.mode.ModeCng(Btl_Battle_Action.Damage);
                ckMode.parent.mode.flame = 60;
                return;
            } else {
                ckMode.parent.ModeCng(Btl_Battle.Check);
            }
            return;
        }
        this.Btl_Ijo_AddText(battle_Class.emYarimons[battle_Class.EmMonNo], enemyIjoCount, ckMode);
    }
    if (ckFlame == IjoEffFlame) {
        if (battle_Class.emYarimons[battle_Class.EmMonNo].hp <= 0) {
            this.EmYarimonDown();
        }
        ckMode.flame = 2; 
        enemyIjoCount++;
    }
}
let ijoTokuseiFlame = 0;
Game_Interpreter.prototype.BattleIjo_TokuseiUpdate = function (btlYarimonData) {
    ijoTokuseiFlame++;
    if (ijoTokuseiFlame == 1 && btlYarimonData.hp > 0) {
        switch (btlYarimonData.Tokusei.name) {
            case PassiveName._大地に張る根:
                if (btlYarimonData.Ijos.indexOf(Ijo._呪い) != -1) return false;
                battle_Class.TextAdd([
                    NLngStrGet("<value> の 根が栄養を吸って回復する！" , [btlYarimonData.stName]), ""], 1);
                btlYarimonData.hp += Math.floor(btlYarimonData.MHP / 8);
                this.BtlBarDraw(true); 
                TokuseiEffData = new TokuseiEff(btlYarimonData, "Effect_Tokusei");
                break;
            case PassiveName._ブラックホール:
                battle_Class.TextAdd([NLngStrGet("<value> は 重力によって能力を元に戻した" , [btlYarimonData.stName]), ""], 30);
                _能力リセット(battle_Class.plYarimons[battle_Class.PLMonNo]);
                _能力リセット(battle_Class.emYarimons[battle_Class.EmMonNo]);
                TokuseiEffData = new TokuseiEff(btlYarimonData, "Effect_Tokusei");
                break;
            case PassiveName._ラスボス特性:
                battle_Class.emYarimons[battle_Class.EmMonNo].TokuseiUseCount++;
                if (battle_Class.emYarimons[battle_Class.EmMonNo].TokuseiUseCount == 3) {
                    battle_Class.TextAdd([NLngStrGet("<value> は 自身の異常を自己修復した" , [btlYarimonData.stName]), ""], 30);
                    _能力リセット(battle_Class.emYarimons[battle_Class.EmMonNo] , true);
                    battle_Class.emYarimons[battle_Class.EmMonNo].Ijos = [];
                    TokuseiEffData = new TokuseiEff(btlYarimonData, "Effect_Tokusei");
                    battle_Class.emYarimons[battle_Class.EmMonNo].TokuseiUseCount = 0;
                }
                break;
            default:
                return false;
        }
        Tokusei_Effect();
    }
    if (ijoTokuseiFlame == IjoEffFlame) return false;
    return true; 
}
