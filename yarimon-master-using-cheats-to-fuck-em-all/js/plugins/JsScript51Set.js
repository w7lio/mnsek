let TrLvHikakuMinLv = 0;
let PlWaza外しCount = 0;
class Battle_Class extends ModeBox { 
    static get Btl_Start() { return 'Btl_Start' }
    static get Btl_Select() { return 'Btl_Select' }
    static get Btl_Battle() { return 'Btl_Battle' }
    static get Btl_End() { return 'Btl_End' }
    static get Btl_Escape() { return 'Btl_Escape' }
    static get Btl_Talk() { return 'Btl_Talk' }
    constructor(){ 
        super("Battle_Class" , [
            new Btl_Start() ,
            new Btl_Select() ,
            new Btl_Battle() ,
            new Btl_End() ,
            new ModeBox(Battle_Class.Btl_Escape) ,
            new Btl_Talk()
        ]);
        this.ModeCng(Battle_Class.Btl_Start); 
        this.resetModeName = Battle_Class.Btl_Start;
        this.First_Setting();
    }
    First_Setting() {
        this.isBattle = false; 
        this.isYasei = false; 
        this.plYarimons = []; 
        this.emYarimons = []; 
        this.Trainer = null;
        this.PLMonNo = 0; 
        this.EmMonNo = 0;
        this.textArr = [];
        this.textDrawFlg = false; 
        this.clickFlame = 0; 
    }
    Setting_EmTrainer(_TrainerID) {
        this.Setting_Player();
        this.isBattle = true;
        this.emYarimons = [];
        this.Trainer = null;
        this.Trainer = GetTrainerData(_TrainerID);
        TrLvHikakuMinLv = 0;
        if (!IsEndLaboMode()) {
            if (!EndContentsBtlFlg) {
                TrLvHikakuMinLv = this.Trainer.trLvHikakuMinLv;
                for (let i = 0; i <= this.Trainer.syojiTikemon.length - 1; i++) {
                    let befBoostFlg = this.Trainer.syojiTikemon[i].SoulBurstFlg;
                    if ($gameSwitches.value(SW_最凶ツアー中)) this.Trainer.syojiTikemon[i].SoulBurstFlg = true;
                    let _setMons = new BtlYarimonData(this.Trainer.syojiTikemon[i]);
                    this.Trainer.syojiTikemon[i].SoulBurstFlg = befBoostFlg;
                    lookYarimonIdArr.push(this.Trainer.syojiTikemon[i].id);
                    _setMons.EnemyFlg = true;
                    this.emYarimons.push(_setMons);
                }
            } else {
                for (let i = 0; i <= this.Trainer.endContentsTrData.syojiYarimonIds.length - 1; i++) {
                    if (GetEC難易度() <= 2 && i == 2) continue;
                    var monId = this.Trainer.endContentsTrData.syojiYarimonIds[i];
                    if (($gameVariables.value(VN_EC周回数) >= 3)) monId = -1;
                    var setMonData = GetECモンスターData(monId);
                    let _setMons = new BtlYarimonData(setMonData);
                    lookYarimonIdArr.push(setMonData.id);
                    _setMons.EnemyFlg = true;
                    this.emYarimons.push(_setMons);
                }
            }
        } else {
            for (let i = 0; i < $gameSystem.EndLaboMonDatas.length; i++) {
                this.emYarimons.push($gameSystem.EndLaboMonDatas[i]);
            }
        }
    }
    Setting_Yasei(_Btl_Yarimon) {
        this.Setting_Player();
        this.isBattle = true;
        if (SetYaseiMonster.id == undefined) {
            SetYaseiMonster = new YaseiMonster();
            SetYaseiMonster.id = 1;
            SetYaseiMonster.lv = 1;
        }
        YaseiBattle_Setting(SetYaseiMonster.id , SetYaseiMonster.lv , 0);
        lookYarimonIdArr.push(SetYaseiMonster.id);
        this.emYarimons = [];
        let ckYData = GetYarimonData_ID(SetYaseiMonster.id);
        YaseiYarimon.btlWazas = [];
        for (let i = ckYData.wazaList.length - 1; i >= 0; i--) {
            if(ckYData.wazaList[i].lv <= SetYaseiMonster.lv) {
                YaseiYarimon.btlWazas.push(new BtlWaza(ckYData.wazaList[i]));
            }
            if(YaseiYarimon.btlWazas.length >= 4) break;
        }
        this.emYarimons.push(YaseiYarimon);
    }
    Setting_Player() {
        this.plYarimons = [];
        for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
            this.plYarimons.push(new BtlYarimonData($gameSystem.Player.syojiTikemon[i]));
        }
    }
    Update() { 
        if(this.textArr.length > 0) {
            this.TextUpdate(); 
            return;
        }
        if(_CngTokuseiEffData != null) return;
        if(_CheckTokuseiEffData != null) return;
        super.Update();
    }
    TextOnlyUpdate() { 
        if(this.textArr.length > 0) {
            this.TextUpdate(); 
            return;
        }
    }
    get IsTextMode() {
        return (this.textArr.length > 0);
    }
    get IsTextClick() {
        if (this.textArr.length > 0) {
            if (this.textArr[0].clickFlg) return true;
        }
        return false;
    }
    get SinClickFlame() {
        return Math.sin((this.clickFlame * 5) * (Math.PI/180));
    }
    get ViewText() {
        this.textDrawFlg = false;
        if (this.textArr.length == 0) {
            return ["" , ""];
        }
        return this.textArr[0].textArr;
    }
    get ViewTextData() {
        return this.textArr[0];
    }
    TextUpdate() {
        this.clickFlame++;
        if(this.textArr[0].viewFlame <= 0) {
            let _nextFlg = true;
            if (this.textArr[0].clickFlg) { 
                _nextFlg = (TouchInput.isTriggered() || Input.isTriggered('ok') || Input.isPressed('control'));
                if (_nextFlg && BtlMenuTalkFlg) {
                }
            }
            if (_nextFlg) { 
                this.textArr.shift();
                this.textDrawFlg = true;
                this.clickFlame = 0;
            }
        } else {
            this.textArr[0].viewFlame--;
        }
    }
    TextNext() {
        if (this.textArr.length > 0) this.textArr.shift();
        this.textDrawFlg = true;
    }
    TextAdd(_TextArr , _viewFlame , _clickFlg = false , zureX = 0 , zureY = 0 , playSe = "") {
        this.Update(); 
        Btl_TextX = zureX; Btl_TextY = zureY; Btl_PlaySe = playSe;
        this.textArr.push(new Btl_Text(_TextArr , _viewFlame , _clickFlg));
        this.textDrawFlg = true;
    }
    TextClear (){
        this.textArr = [];
    }
    Close() {
        this.Reset(); 
        this.First_Setting();
    }
}
let Btl_TextX = 0;
let Btl_TextY = 0;
let Btl_PlaySe = "";
class Btl_Text { 
    constructor(_TextArr , _viewFlame , _clickFlg = false) {
        this.textArr = _TextArr;
        this.viewFlame = _viewFlame;
        this.clickFlg = _clickFlg;
        this.zureX = Btl_TextX;
        this.zureY = Btl_TextY;
        this.playSe = Btl_PlaySe;
        this.drawFlg = false; 
        Btl_TextX = 0;
        Btl_TextY = 0;
        Btl_PlaySe = "";
    }
}
class Btl_Start extends ModeBox {
    static get Bef_Start(){ return 'Bef_Start'}
    static get Start(){ return 'Start'}
    static get Yasei(){ return 'Yasei'}
    static get LastBtl(){ return 'LastBtl'}
    static get Trn_BustUp(){ return 'Trn_BustUp'}
    static get Trn_Start(){ return 'Trn_Start'}
    static get End(){ return 'End'}
    constructor() {
        super(Battle_Class.Btl_Start , [
            new ModeBox(Btl_Start.Bef_Start) ,
            new ModeBox(Btl_Start.Start) ,
            new ModeBox(Btl_Start.Yasei) ,
            new ModeBox(Btl_Start.LastBtl) ,
            new ModeBox(Btl_Start.Trn_BustUp) ,
            new ModeBox(Btl_Start.Trn_Start) ,
            new ModeBox(Btl_Start.End)
        ]);
        this.ModeCng(Btl_Start.Bef_Start);
        this.resetModeName = Btl_Start.Bef_Start;
    }
    Update() {
        super.Update();
    }
}
class Btl_Select extends Select_ModeBox {
    static get Select(){ return 'Select'}
    static get Tatakau(){ return 'Tatakau'}
    static get Dougu(){ return 'Dougu'}
    static get Yarimon(){ return 'Yarimon'}
    constructor() {
        super (Battle_Class.Btl_Select , [
            new ModeBox(Btl_Select.Select) ,
            new Btl_Select_Tatakau(Btl_Select.Tatakau) ,
            new Menu_Dougu([emDougu._回復 , emDougu._戦闘]) , 
            new Btl_Select_Yarimon()
        ]);
        this.selectNoMax = 3; 
        this.selecterNo = 0; 
        this.ModeCng(Btl_Select.Select); 
        this.resetModeName = Btl_Select.Select;
    }
    select_OkNoCng() {
        switch (this.selecterNo) {
            case 0: 
                this.ModeCng(Btl_Select.Tatakau);
                break;
            case 1: 
                if(battle_Class.plYarimons.length > 1) {
                    this.ModeCng(Btl_Select.Yarimon);
                }
                break;
            case 2: 
                this.ModeCng(Btl_Select.Dougu);
                break;
            case 3: 
                if(battle_Class.isYasei) {
                    if ($gameSwitches.value(SW_Tr演出OFF)) return false;
                    battle_Class.ModeCng(Battle_Class.Btl_Battle);
                    battle_Class.mode.Setting(ExWazaid.Escape); 
                } else {
                    return false;
                }
                break;
        }
        return true;
    }
    CngNigeru() {
        battle_Class.ModeCng(Battle_Class.Btl_Battle);
        battle_Class.mode.Setting(ExWazaid.Escape); 
    }
}
class Btl_Select_Tatakau extends Select_ModeBox { 
    static get Select() { return "Select"} 
    constructor() { 
        super(Btl_Select.Tatakau , [
            new ModeBox(Btl_Select_Tatakau.Select)
        ]);
        this.ModeCng(Btl_Select_Tatakau.Select); 
        this.resetModeName = Btl_Select_Tatakau.Select;
    }
    WazaOk(){
        battle_Class.ModeCng(Battle_Class.Btl_Battle);
    }
    Update() {
        super.Update();
    }
}
class Btl_Select_Dougu extends Select_ModeBox { 
    static get Select() { return "Select"} 
    constructor(){ 
        super(Btl_Select.Dougu , [
            new ModeBox(Btl_Select_Dougu.Select)
        ]);
        this.ModeCng(Btl_Select_Dougu.Select); 
        this.resetModeName = Btl_Select_Dougu.Select;
    }
    Update() {
        super.Update();
    }
}
class Btl_Select_Yarimon extends Select_ModeBox { 
    static get Select() { return "Select"} 
    constructor( hinsiFlg ){ 
        hinsiFlg = typeof hinsiFlg !== 'undefined' ? hinsiFlg : false;
        super(Btl_Select.Yarimon , [
            new ModeBox(Btl_Select_Yarimon.Select)
        ]);
        this.ModeCng(Btl_Select_Yarimon.Select); 
        this.resetModeName = Btl_Select_Yarimon.Select;
        this.hinsiCngFlg = hinsiFlg; 
        this.selMonNo = [];
    }
    Update() {
        super.Update();
    }
}
class Btl_Battle extends ModeBox {
    static get Setting(){ return 'Setting'} 
    static get PlAction(){ return 'PlAction'}
    static get EmAction(){ return 'EmAction'}
    static get Check(){ return 'Check'}
    static get CngYarimon(){ return 'CngYarimon'}
    static get EmCngYarimon(){ return 'EmCngYarimon'}
    static get PlIjo(){ return 'PlIjo'}
    static get EmIjo(){ return 'EmIjo'}
    constructor() {
        super (Battle_Class.Btl_Battle , [
            new ModeBox(Btl_Battle.Setting) ,
            new Btl_Battle_Action(Btl_Battle.PlAction) ,
            new Btl_Battle_Action(Btl_Battle.EmAction) ,
            new Btl_Battle_CngYarimon() ,
            new ModeBox(Btl_Battle.EmCngYarimon) ,
            new ModeBox(Btl_Battle.Check) ,
            new ModeBox(Btl_Battle.PlIjo) ,
            new ModeBox(Btl_Battle.EmIjo)
        ]);
        this.ModeCng(Btl_Battle.Setting);
        this.resetModeName = Btl_Battle.Setting;
        this.PLMovedFlg = false;　
        this.EmMovedFlg = false;
        this.PlayerWazaId = 0;
        this.EnemyWazaId = 0;
        this.CngYarimonNo = -1;
        this.PlayerDoingFlg = false; 
        this.DoingYarimon = null;
        this.DoingWaza = null;
        this.PLDmgEffectArr = [];
        this.EmDmgEffectArr = [];
        this.PLIjoCheck = false;
        this.EmIjoCheck = false;
        this.DmgTxtArr = []; 
    }
    Setting (_plWazaId) {
        this.PlayerWazaId = _plWazaId;
        this.EnemyWazaId = this.EmWazaID_Set(); 
        switch (_plWazaId) {
            case ExWazaid.NotMove:
            case ExWazaid.Escape:
            case ExWazaid.GetSet:
            case ExWazaid.UseDougu:
            case ExWazaid.MonCng:
                this.PlMoveCng();
                return;
        }
        battle_Class.plYarimons[battle_Class.PLMonNo].Def_Mode = false;
        battle_Class.emYarimons[battle_Class.EmMonNo].Def_Mode = false;
        let ckPlAgi = battle_Class.plYarimons[battle_Class.PLMonNo].Agi;
        let ckEmAgi = battle_Class.emYarimons[battle_Class.EmMonNo].Agi;
        if (battle_Class.plYarimons[battle_Class.PLMonNo].Ijos.indexOf(Ijo._泥沼) != -1) ckPlAgi = Math.floor(ckPlAgi / 2);
        if (battle_Class.emYarimons[battle_Class.EmMonNo].Ijos.indexOf(Ijo._泥沼) != -1) ckEmAgi = Math.floor(ckEmAgi / 2);
        let PLFast = ckPlAgi >= ckEmAgi;
        let PLWaza = GetWazaData(this.PlayerWazaId);
        let EmWaza = GetWazaData(this.EnemyWazaId);
        if(PLWaza.yusendo != EmWaza.yusendo) {
            PLFast = PLWaza.yusendo > EmWaza.yusendo;
        }
        if(_plWazaId == -1) PLFast = true;
        if ( PLFast ) {
            this.PlMoveCng();
        } else {
            this.EmMoveCng();
        }
    }
    EmWazaID_Set() { 
        let _wazaRnd = [];
        let _sumYusendo = 0;
        let _ckYarimon = battle_Class.emYarimons[battle_Class.EmMonNo];
        if(_ckYarimon.usedY9Ids == undefined) _ckYarimon.usedY9Ids = [];
        var addYusendo8 = false;
        for (let i = 0; i <= _ckYarimon.btlWazas.length - 1; i++) {
            let _ckWaza = _ckYarimon.btlWazas[i];
            if (_ckWaza.reChargeTurn == 0 && _ckYarimon.btlWazas[i].yusendo == 8) {
                addYusendo8 = true;
            }
        }
        for (let i = 0; i <= _ckYarimon.btlWazas.length - 1; i++) {
            let _ckWaza = _ckYarimon.btlWazas[i];
            if(_ckWaza.yusendo == 9) {
                if(_ckYarimon.usedY9Ids.indexOf(i) != -1) continue; 
                if (_ckYarimon.btlWazas[i].reChargeTurn > 0) continue;
                _ckYarimon.usedY9Ids.push(i);
                EnemyUseWazaData = _ckYarimon.btlWazas[i];
                _ckYarimon.btlWazas[i].reChargeTurn = _ckYarimon.btlWazas[i].pp;
                return _ckYarimon.btlWazas[i].id;
            } else {
                if (_ckWaza.reChargeTurn == 0) {
                    if (addYusendo8 && _ckYarimon.btlWazas[i].yusendo < 8) continue;
                    _wazaRnd.push([i , _ckYarimon.btlWazas[i].yusendo]);
                    _sumYusendo += _ckYarimon.btlWazas[i].yusendo;
                }
            }
        }
        if (_wazaRnd.length == 0) {
            for (let i = 0; i <= _ckYarimon.usedY9Ids.length - 1; i++) {
                let _ckNo = _ckYarimon.usedY9Ids[i];
                let _ckWaza = _ckYarimon.btlWazas[_ckNo];
                if (_ckWaza.reChargeTurn != 0) {
                    _wazaRnd.push([i , _ckYarimon.btlWazas[i].yusendo]);
                    _sumYusendo += _ckYarimon.btlWazas[i].yusendo;
                }
            }
            if (_wazaRnd.length == 0) return WazaId_悪あがき; 
        }
        let _ckRandVar = _sumYusendo * Math.random();
        let _sumVar = 0;
        for (let i = 0; i <= _wazaRnd.length - 1; i++) {
            let _ckNo = _wazaRnd[i][0];
            _sumVar += _wazaRnd[i][1];
            if (_ckRandVar <= _sumVar) {
                var rtnWazaId = _ckYarimon.btlWazas[_ckNo].id;
                if (rtnWazaId == WazaID._終わりの翼) {
                    if (_ckYarimon.btlWazas[2].reChargeTurn == 0) {
                        _ckNo = 2;
                        rtnWazaId = _ckYarimon.btlWazas[_ckNo].id;
                    }
                }
                EnemyUseWazaData = _ckYarimon.btlWazas[_ckNo];
                _ckYarimon.btlWazas[_ckNo].reChargeTurn = _ckYarimon.btlWazas[_ckNo].pp;
                return rtnWazaId;
            }
        }
    }
    Check() {
        let _plAllHp0Flg = true;
        for (let i = 0; i <= battle_Class.plYarimons.length - 1; i++) {
            if(battle_Class.plYarimons[i].hp > 0) {
                _plAllHp0Flg = false;
            }
        }
        let _emAllHp0Flg = true;
        for (let i = 0; i <= battle_Class.emYarimons.length - 1; i++) {
            if(battle_Class.emYarimons[i].hp > 0) {
                _emAllHp0Flg = false;
            }
        }
        let _EndFlg = (_plAllHp0Flg || _emAllHp0Flg);
        if (_EndFlg) {
            Btl_End_Start();
            this.parent.ModeCng(Battle_Class.Btl_End);
            this.parent.mode.WinFlg = _emAllHp0Flg; 
            return;
        }
        let _EndCheck = function (_this) {
            if (battle_Class.plYarimons[battle_Class.PLMonNo].hp == 0 ) {
                _this.ModeCng(Btl_Battle.CngYarimon);
                return true;
            }
            if (battle_Class.emYarimons[battle_Class.EmMonNo].hp == 0) {
                _this.ModeCng(Btl_Battle.EmCngYarimon);
                return true;
            }
            return false;
        }
        if(_EndCheck(this)) return;
        if (this.PLMovedFlg && this.EmMovedFlg) {
            if (!this.EmIjoCheck) {
                this.ModeCng(Btl_Battle.EmIjo);
                return;
            }
            if (_EndCheck(this)) return;
            if (!this.PLIjoCheck) {
                this.ModeCng(Btl_Battle.PlIjo);
                return;
            }
            if(_EndCheck(this)) return;
            for (let i = 0; i <= battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas.length - 1; i++) {
                if(battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[i].reChargeTurn > 0) {
                    battle_Class.plYarimons[battle_Class.PLMonNo].btlWazas[i].reChargeTurn--;
                }
            }
            for (let i = 0; i <= battle_Class.emYarimons[battle_Class.EmMonNo].btlWazas.length - 1; i++) {
                if(battle_Class.emYarimons[battle_Class.EmMonNo].btlWazas[i].reChargeTurn > 0) {
                    battle_Class.emYarimons[battle_Class.EmMonNo].btlWazas[i].reChargeTurn--;
                }
            }
            this.PLIjoCheck = false;
            this.EmIjoCheck = false;
            this.parent.ModeCng(Battle_Class.Btl_Select);
            return;
        }
        if (!this.PLMovedFlg) {
            this.PlMoveCng();
            return;
        }
        if (!this.EmMovedFlg) {
            this.EmMoveCng();
            return;
        }
    }
    PlMoveCng() {
        picFrameBtlCngFlame = 5;
        btlHitCheck = true;
        this.PlayerDoingFlg = true;
        this.DoingYarimon = battle_Class.plYarimons[battle_Class.PLMonNo];
        this.DoingWaza = GetWazaData(this.PlayerWazaId);
        this.ModeCng(Btl_Battle.PlAction);
        this.PLMovedFlg = true;
        this.PlAttackCalcu();
        if(!btlHitCheck) { 
            PlayerUseWazaData.reChargeTurn = 0;
        }
    }
    EmMoveCng() {
        picFrameBtlCngFlame = 5;
        btlHitCheck = true;
        this.PlayerDoingFlg = false;
        this.DoingYarimon = battle_Class.emYarimons[battle_Class.EmMonNo];
        this.DoingWaza = GetWazaData(this.EnemyWazaId);
        this.ModeCng(Btl_Battle.EmAction);
        this.EmMovedFlg = true;
        this.EmAttackCalcu();
        if(!btlHitCheck) { 
            EnemyUseWazaData.reChargeTurn = 0;
        }
    }
    PlAttackCalcu(_hitFlg) {
        _hitFlg = typeof _hitFlg !== 'undefined' ? _hitFlg : false;
        btlDmgVar = 0;
        btlHitCheck = true;
        btlAddEffect = []; 
        this.PLDmgEffectArr = [];
        this.EmDmgEffectArr = [];
        this.DmgTxtArr = [];
        let AtkMon = battle_Class.plYarimons[battle_Class.PLMonNo];
        let DefMon = battle_Class.emYarimons[battle_Class.EmMonNo];
        let WazaId = this.PlayerWazaId;
        let DmgEffectArr = this.EmDmgEffectArr;
        DefMon.WazaDmg = 0;
        switch (WazaId) {
            case ExWazaid.NotMove:
            case ExWazaid.MonCng:
            case ExWazaid.Escape:
                break;
            case ExWazaid.GetSet:
                btlAddEffect.push(new AddEffectData(0 , ExWazaid.GetSet));
                break;
            case ExWazaid.UseDougu:
                btlAddEffect.push(new AddEffectData(0 , ExWazaid.UseDougu));
                break;
            default:
                if(AtkMon.Ijos.indexOf(Ijo._痺れ) != -1 && !AtkMon.SibireSkip) return;
                this.Waza_DmgSetting(AtkMon , DefMon , WazaId , DmgEffectArr);
                break;
        }
    }
    Waza_DmgSetting(AtkMon , DefMon , WazaId , DmgEffectArr) {
        let _WazaData = GetWazaData(WazaId);
        let atkWazaFlg = CheckWazaAtk_WazaData(_WazaData);
        this.Waza_HitCheck(_WazaData , AtkMon , DefMon);
        switch (WazaId) {
            case WazaID._チートタックル:
            case WazaID._未来への翼:
            case WazaID._終わりの翼:
            case WazaID._チートタックルEx1:
            case WazaID._チートタックルEx2:
                btlHitCheck = true; 
                break;
            default:
                if (atkWazaFlg && DefMon.Def_Mode) {
                    btlHitCheck = false; return;
                }
                break;
        }
        if(!btlHitCheck && !_WazaData.effectOneSelfFlg) {
            if (!AtkMon.EnemyFlg) PlWaza外しCount++;
            return; 
        }
        PlWaza外しCount = 0;
        let _DmgVar = BtlStatic.Dmg_Get(AtkMon ,　DefMon , WazaId , this.DmgTxtArr);
        btlDmgVar = _DmgVar;
        let _befHp = DefMon.hp;
        DefMon.hp -= _DmgVar;
        if (_befHp != DefMon.hp) {
            DmgEffectArr.push(BtlDmgEffect.Dmg);
        }
        DefMon.WazaDmg += _DmgVar;
        this.CharaHPCheck();
        this.BtlAddEffect_Setting(_DmgVar , WazaId);
    }
    Waza_HitCheck(_WazaData , AtkMon , DefMon) {
        if (_WazaData.effectOneSelfFlg) {
            btlHitCheck = true;
            return;
        }
        let ckHit = AtkMon.R_Hit;   
        let ckAvo = DefMon.R_Avo;   
        if(AtkMon.Ijos.indexOf(Ijo._泥沼) != -1) ckHit--;
        if(DefMon.Ijos.indexOf(Ijo._凍結) != -1) ckAvo--;
        let R_HitVar = ckHit - ckAvo;
        let _a = 3;
        if (R_HitVar > 0) _a += R_HitVar;
        let _b = 3;
        if (R_HitVar < 0) _b += -R_HitVar;
        let _最低命中値 = 0.25;
        var _命中倍率 = _a / _b;
        if (_命中倍率 < _最低命中値) _命中倍率 = _最低命中値;
        let hitCkVar = _WazaData.hit * _命中倍率;
        if (!AtkMon.EnemyFlg) hitCkVar += PlWaza外しCount * 10;
        let hitRnd = Math.random() * 100;
        btlHitCheck = (hitCkVar >= hitRnd);
        if (useFlg_チートタックル) btlHitCheck = true; 
        switch (_WazaData.id) {
            case WazaID._チートタックルEx1:
            case WazaID._チートタックルEx2:
                btlHitCheck = true;
                break;
        }
        if (AtkMon.Tokusei.name == PassiveName._慧眼 && !btlHitCheck) {
            hitCkVar = _WazaData.hit * (_a / _b);
            hitRnd = Math.random() * 100;
            btlHitCheck = (hitCkVar >= hitRnd);
        }
    }
    EmAttackCalcu(_hitFlg) {
        _hitFlg = typeof _hitFlg !== 'undefined' ? _hitFlg : false;
        btlDmgVar = 0;
        btlHitCheck = true;
        btlAddEffect = []; 
        this.PLDmgEffectArr = [];
        this.EmDmgEffectArr = [];
        this.DmgTxtArr = [];
        let AtkMon = battle_Class.emYarimons[battle_Class.EmMonNo];
        let DefMon = battle_Class.plYarimons[battle_Class.PLMonNo];
        let WazaId = this.EnemyWazaId;
        let DmgEffectArr = this.PLDmgEffectArr;
        DefMon.WazaDmg = 0;
        if(AtkMon.Ijos.indexOf(Ijo._痺れ) != -1 && !AtkMon.SibireSkip) return;
        this.Waza_DmgSetting(AtkMon , DefMon , WazaId , DmgEffectArr);
    }
    BtlAddEffect_Setting(_dmgVar , WazaId){
        let _WazaData = GetWazaData(WazaId);
        _WazaData.exSkillArr.forEach( exData => {
            btlAddEffect.push(new AddEffectData(_dmgVar , exData));
        });
    }
    CharaHPCheck() {
        if (battle_Class.plYarimons[battle_Class.PLMonNo].hp <= 0) {
            battle_Class.plYarimons[battle_Class.PLMonNo].hp = 0;
        }
        if (battle_Class.emYarimons[battle_Class.EmMonNo].hp <= 0) {
            battle_Class.emYarimons[battle_Class.EmMonNo].hp = 0;
        }
    }
    Reset() {
        super.Reset();
        this.PLMovedFlg = false;
        this.EmMovedFlg = false;
    }
}
class AddEffectData {
    constructor(_DmgVar , _EffectData){
        this.DmgVar = _DmgVar;
        this.EffectData = _EffectData;
    }
}
class oriEffectData {
    constructor(_name){
        this.name = _name;
        this.data = 0;
        this.kakuritu = 100;
        this.oneselfFlg = false;
    }
}
class Btl_Battle_CngYarimon extends ModeBox {
    static get Yarimon(){ return 'Yarimon'}
    static get Back(){ return "Back"} 
    constructor() { 
        super(Btl_Battle.CngYarimon , [
            new Btl_Select_Yarimon(true) ,
            new ModeBox(Btl_Battle_CngYarimon.Back)
        ]);
        this.ModeCng(Btl_Battle_CngYarimon.Yarimon);
        this.resetModeName = Btl_Battle_CngYarimon.Yarimon;
    }
    Update() {
        super.Update();
    }
    Reset() {
        super.Reset();
    }
}
class Btl_Battle_Action extends ModeBox {
    static get Effect(){ return "Effect"} 
    static get Damage(){ return "Damage"} 
    static get AddEffect(){ return "AddEffect"} 
    constructor(_name){ 
        super(_name , [
            new ModeBox(Btl_Battle_Action.Effect) ,
            new ModeBox(Btl_Battle_Action.Damage) ,
            new ModeBox(Btl_Battle_Action.AddEffect)
        ]);
        this.ModeCng(Btl_Battle_Action.Effect); 
        this.resetModeName = Btl_Battle_Action.Effect;
    }
    Update() {
        super.Update();
    }
    NextModeCng() {
    }
    Reset() {
        super.Reset();
    }
}
class Btl_End extends ModeBox {
    static get Start(){ return 'Start'}
    static get Text(){ return 'Text'}
    constructor() {
        super(Battle_Class.Btl_End , [
            new ModeBox(Btl_End.Start) ,
            new ModeBox(Btl_End.Text)
        ]);
        this.WinFlg = true;
        this.Escape = false;
    }
    Update() {
        super.Update();
    }
}
class Btl_Talk extends ModeBox {
    static get Talk(){ return 'Talk'}
    constructor() {
        super(Battle_Class.Btl_Talk , [
            new ModeBox(Btl_Talk.Talk)
        ]);
    }
    Update() {
        super.Update();
    }
}
