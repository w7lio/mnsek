let BtlStopEventFlame = 0;
let BtlStopEventFlame_NUpdateSc = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    BtlStopEventFlame_NUpdateSc.call(this);
    if (BtlStopEventFlame > 0) BtlStopEventFlame--;
}
let DLC2モンスター戦闘前保存 = function () {
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        Dlc2BtlBefParty.push($gameSystem.Player.syojiTikemon[i]);
    }
}
let Checkラボorツアー = function () {
    return $gameSwitches.value(SW_EL戦闘中) || EndContentsBtlFlg;
}
let Dlc2BtlBefParty = [];
let BトレーナーLv上げないFlg = false;
const SW_最凶ツアー中 = 585;
Game_Interpreter.prototype.command301 = function() {
    if(this.Bef_BtlStart_点滅演出Update()) return false; 
    if (!battle_Class.isBattle) {
        DLC2Btlチケフレア復活Flg = false;
        AddExAtkCount = 0;
        enemyIjoCount = ijoTokuseiFlame = 0;
        TurnDownFlgReset();
        BtlSetup変数Reset();
        if ($gameVariables.value(VN_TrId手動設定) != 0) {
            btlTrainerId = $gameVariables.value(VN_TrId手動設定);
            $gameVariables.setValue(VN_TrId手動設定 ,0);
        }
        $gameSwitches.setValue(SW_会話中 , false); 
        BtlStopEventFlame = 90; 
        this.InstantSave(); 
        AudioManager.fadeOutBgs(1); 
        if (battle_Class.isYasei) { 
            battle_Class.Setting_Yasei(YaseiYarimon);     
        } else {
            battle_Class.Setting_EmTrainer(btlTrainerId); 
        }
        if ($gameSwitches.value(SW_Tr演出OFF)) battle_Class.isYasei = true;
        while (picFlameEnemyCharaArr.length < battle_Class.emYarimons.length) {
            picFlameEnemyCharaArr.push(new BefCharaData(-1,-1,-1,-1));
            picFlameEnemyCharaArr[picFlameEnemyCharaArr.length - 1].viewFlg = false;
        }
        for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
            battle_Class.plYarimons[i].hp = $gameSystem.Player.syojiTikemon[i].hp;
            battle_Class.plYarimons[i].Ijos = [];
        }
        this.BattleStart();
        $gamePlayer.reserveTransfer(BattleMapID, 0, 0, 0, 2); 
        this._index = this._list.length; 
    } else {
        $gameVariables.setValue(VN_ExAtkCount ,$gameVariables.value(VN_ExAtkCount) + AddExAtkCount);
        $gameSwitches.setValue(SW_Tr演出OFF , false);
        $gameVariables.setValue(VN_Tr逃げるTxt ,0);
        btlItemSyohiArr.forEach(itemId => {
            $gameParty.loseItem($dataItems[itemId], 1);
        });
        lookYarimonIdArr.forEach(_id => {
            SetZukanLook_Id(_id);
        });
        if(getYarimonId != -1) SetZukanGet_Id(getYarimonId);
        this.command244();
        if (!EndContentsBtlFlg && !IsEndLaboMode() && !DLC2BtlFlg) {
            $gameSystem.Player.syojiTikemon = EndPlayerCopyArr.slice(); 
            for (let i = 0; i <= battle_Class.plYarimons.length - 1; i++) {
                $gameSystem.Player.syojiTikemon[i].hp = battle_Class.plYarimons[i].hp;
                if ($gameSystem.Player.syojiTikemon[i].hp <= 0) $gameSystem.Player.syojiTikemon[i].hp = 1;
                if (set_branch == _BtlBranch.Win) $gameSystem.Player.syojiTikemon[i].btlCount++;
            }
        }
        if (DLC2BtlFlg) {
            AudioManager.fadeOutBgm(0.1);
            this.SetSprite(PN_Ensyutu , "LightBlue");
            this.MoveSprite(PN_Ensyutu , true , true, 60 , 0);
            for (let i = 0; i < Dlc2BtlBefParty.length; i++) {
                $gameSystem.Player.syojiTikemon[i] = Dlc2BtlBefParty[i];
            }
            Dlc2BtlBefParty = [];
            DLC2BtlFlg = false;
        }
        battle_Class.Close();
        this.DelSpriteSpan(PN_BtlEn , PN_BtlEn + 4);
        this.DelSpriteSpan(PN_ftTikeEmBar , PN_ftPlYarare - 1); 
        this.DelSpriteSpan(PN_ftWeekEm , PN_ftEnd); 
        if (!$gameSwitches.value(SW_EL戦闘中) && !EndContentsBtlFlg) {
            if (set_branch == _BtlBranch.Win) { 
                if (TrainerUpFlg && !BトレーナーLv上げないFlg) {
                    $gameSystem.TrainerLv++;
                    trLvupEffectFlg = true;
                    TrainerUpFlg = false;
                }
                if(!battle_Class.isYasei) {
                    $gameParty._gold += _賞金;
                    $gameSystem.KeikenKakera += _経験P;
                }
            }
            if (BtlGetYarimonNo != -1) {
                SetZukanGet_Id($gameSystem.yZukan[BtlGetZukanNo].id);
                BtlGetYarimonNo = -1;
            }
            if (BtlEndAddYarimon != null) {
                if(BtlEndAddYarimon.lv > $gameSystem.TrainerLv) {
                    BtlEndAddYarimon.lv = $gameSystem.TrainerLv;
                }
                BtlEndAddYarimon = new YarimonData(BtlEndAddYarimon.id , BtlEndAddYarimon.lv , 0); 
                BtlEndAddYarimon.hp = MHP(BtlEndAddYarimon);
                if($gameSystem.Player.syojiTikemon.length >= 3) {
                    MonBoxAdd(BtlEndAddYarimon);
                } else {
                    $gameSystem.Player.syojiTikemon.push(BtlEndAddYarimon);
                }
                BtlEndAddYarimon = null;
            }
            for (let i = 0; i <= btlNewWazaSave.length - 1; i++) {
                $gameSystem.NewWazaArr[i] = btlNewWazaSave[i];
            }
            if (btlWinTrainerId != -1) $gameSystem.WinedTrainerArr.push(btlWinTrainerId);
        }
        this._branch[this._indent] = set_branch;
        _フレーム上情報Re表示();
        EndContentsBtlFlg = false; 
    }
    return true; 
};
