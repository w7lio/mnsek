let GetYarimonData_ID = function (id) {
    for (let i = 0; i <= $N_Yarimon_DB.mZukanDatas.length - 1; i++) {
        if ($N_Yarimon_DB.mZukanDatas[i].id == id) {
            return $N_Yarimon_DB.mZukanDatas[i];
        }
    }
    return null;
}
let GetYarimonData_No = function (zukanNo) {
    return $N_Yarimon_DB.mZukanDatas[zukanNo - 1];
}
let WazaEffectGet = function (id) {
    for (let i = 0; i <= $N_Yarimon_DB.wazaDatas.length - 1; i++) {
        if ($N_Yarimon_DB.wazaDatas[i].id == id) {
            BtlEffAfterWait_Flame = $N_Yarimon_DB.wazaDatas[i].effAftWaitFlame;
            return $N_Yarimon_DB.wazaDatas[i].effectOneSelfFlg;
        }
    }
    return false;
}
let GetYarimonZukanNo = function (id) {
    for (let i = 0; i <= $N_Yarimon_DB.mZukanDatas.length - 1; i++) {
        if ($N_Yarimon_DB.mZukanDatas[i].id == id) {
            return i;
        }
    }
    return -1;
}
let GetWazaPtcName = function (id) {
    for (let i = 0; i <= $N_Yarimon_DB.wazaDatas.length - 1; i++) {
        if ($N_Yarimon_DB.wazaDatas[i].id == id) {
            if (!$N_Yarimon_DB.wazaDatas[i].ptcCmbFlg)
                return "btl_" + (i + 1);
            else
                return "Cmb" + (i + 1);
        }
    }
}
let WazaData_Setting = function (wazaData) {
    let rtnWazaData = new SetWazaData(wazaData);
    return rtnWazaData;
}
class SetWazaData {
    constructor(wazaData) {
        this.comboEffectFlg = wazaData.comboEffectFlg;
        this.effect = wazaData.effect;
        this.effectMoveFlg = wazaData.effectMoveFlg;
        this.hit = wazaData.hit;
        this.id = wazaData.id;
        this.iryoku = wazaData.iryoku;
        this.kaisu = wazaData.kaisu;
        this.name = wazaData.name;
        this.setu = wazaData.setu;
        this.type = wazaData.type;
        this.yusendo = wazaData.yusendo;
        this.exSkillArr = [];
        for (let i = 0; i <= wazaData.exSkillArr.length - 1; i++) {
            this.exSkillArr.push(wazaData.exSkillArr[i]);
        }
        this.wazaZokuArr = [];
        for (let i = 0; i <= wazaData.wazaZokuArr.length - 1; i++) {
            this.wazaZokuArr.push(wazaData.wazaZokuArr[i]);
        }
    }
}
let CheckWazaAtk_WazaData = function (wazaData) {
    if (wazaData.iryoku > 0) return true;
    for (let i = 0; i <= wazaData.exSkillArr.length - 1; i++) {
        if (!wazaData.exSkillArr[i].oneselfFlg) return true; 
    }
    return false;
}
let GetTrainerData = function (id) {
    for (let i = 0; i <= $N_Yarimon_DB.trainers.length - 1; i++) {
        if ($N_Yarimon_DB.trainers[i].id == id) {
            return $N_Yarimon_DB.trainers[i];
        }
    }
    return null;
}
let YaseiYarimon = null;
let YaseiBattle_Setting = function (id, lv, starRank) {
    let setYarimon = new YarimonData(id);
    setYarimon.lv = lv;
    setYarimon.starRank = starRank;
    YaseiYarimon = new BtlYarimonData(setYarimon);
    YaseiYarimon.EnemyFlg = true;
}
class BtlYarimonData {
    get MHP() {
        let StarVar = 0.3;
        let _ckVar = (this.S_HP * 2 + 31 + (this.starRank * StarVar * 25.2 / 4)) * this.lv / 100 + this.lv + 10;
        return Math.floor(_ckVar);
    }
    get Atk() {
        let StarVar = 0.3;
        let _ckVar = ((this.S_Atk * 2 + 31 + (this.starRank * StarVar * 25.2 / 4)) * this.lv / 100 + 5) * this._Rank_補正値(this.R_Atk);
        return Math.floor(_ckVar);
    }
    get Def() {
        let StarVar = 0.3;
        let _ckVar = ((this.S_Def * 2 + 31 + (this.starRank * StarVar * 25.2 / 4)) * this.lv / 100 + 5) * this._Rank_補正値(this.R_Def);
        return Math.floor(_ckVar);
    }
    get BaseDef() {
        let StarVar = 0.3;
        let _ckVar = ((this.S_Def * 2 + 31 + (this.starRank * StarVar * 25.2 / 4)) * this.lv / 100 + 5);
        return Math.floor(_ckVar);
    }
    get Agi() {
        let StarVar = 0.3;
        let _ckVar = ((this.S_Agi * 2 + 31 + (this.starRank * StarVar * 25.2 / 4)) * this.lv / 100 + 5) * this._Rank_補正値(this.R_Agi);
        return Math.floor(_ckVar);
    }
    get hp() {
        return this._hp;
    }
    set hp(value) {
        this._hp = Math.floor(value);
        if (this._hp > this.MHP) this._hp = this.MHP;
        if (this._hp <= 0) this._hp = 0;
    }
    get stName() {
        if (this.EnemyFlg) {
            return NLngStrGet("相手の ") + this.Name;
        }
        return this.Name;
    }
    constructor(yarimonData, setHp) { 
        setHp = typeof setHp !== 'undefined' ? setHp : false;
        if (yarimonData.YarimonData != undefined) yarimonData.id = yarimonData.YarimonData.id;
        this.YarimonData = GetYarimonData_ID(yarimonData.id);
        this.Name = this.YarimonData.name;
        this._hp = 0;
        this.S_HP = this.YarimonData.state.hp;      
        this.S_Atk = this.YarimonData.state.atk;    
        this.S_Def = this.YarimonData.state.def;    
        this.S_Agi = this.YarimonData.state.agi;    
        this.Type = this.YarimonData.state.type;    
        let stArr = [this.S_HP, this.S_Atk, this.S_Def, this.S_Agi];
        stArr.sort();
        this.MaxStNo = 0; 
        if (stArr[stArr.length - 1] == this.S_Agi) this.MaxStNo = 3;
        if (stArr[stArr.length - 1] == this.S_Def) this.MaxStNo = 2;
        if (stArr[stArr.length - 1] == this.S_Atk) this.MaxStNo = 1;
        if (stArr[stArr.length - 1] == this.S_HP) this.MaxStNo = 0;
        this.ExPowerFlg = false;
        if (yarimonData.ExPowerFlg == undefined) {
            yarimonData.ExPowerFlg = false;
            if (yarimonData.SoulBurstFlg != undefined) yarimonData.ExPowerFlg = yarimonData.SoulBurstFlg;
        }
        //if ($gameSwitches.value(SW_最凶ツアー中)) yarimonData.ExPowerFlg = true;
        if (yarimonData.ExPowerFlg) {
            this.ExPowerFlg = true;
            var sum種族値 = this.S_HP + this.S_Atk * 2 + this.S_Def * 2 + this.S_Agi;
            var base種族値 = sum種族値;
            if (base種族値 <= 520) base種族値 = 520;
            var ES_HP = this.S_HP;
            var ES_Atk = this.S_Atk;
            var ES_Def = this.S_Def;
            var ES_Agi = this.S_Agi;
            while (sum種族値 < base種族値 + 50) {
                ES_HP += ES_HP * 0.01;
                ES_Atk += ES_Atk * 0.01;
                ES_Def += ES_Def * 0.01;
                ES_Agi += ES_Agi * 0.01;
                sum種族値 = ES_HP + ES_Atk * 2 + ES_Def * 2 + ES_Agi;
            }
            this.S_HP = Math.round(ES_HP);
            this.S_Atk = Math.round(ES_Atk);
            this.S_Def = Math.round(ES_Def);
            this.S_Agi = Math.round(ES_Agi);
        }
        if (yarimonData.starRank == undefined) {
            let rtnCnt = Math.floor(yarimonData.btlCount / StarRankBtlValue);
            if (rtnCnt > 10) rtnCnt = 10; 
            this.starRank = rtnCnt; 
        } else {
            this.starRank = yarimonData.starRank; 
        }
        this.lv = yarimonData.lv;  
        if (yarimonData.TrnLvSaFlg != undefined) {
            if (yarimonData.TrnLvSaFlg) {
                this.lv = yarimonData.lv + $gameSystem.TrainerLv;
                if (TrLvHikakuMinLv > this.lv) this.lv = TrLvHikakuMinLv;
            }
        }
        this.hp = this.MHP;     
        if (setHp != false) {
            this.hp = setHp;
        }
        this.Ijos = yarimonData.Ijos;
        if (this.Ijos == undefined) this.Ijos = [];
        this.SibireSkip = false; 
        this.TokuseiUseFlg = false; //特性を使用した(1戦闘に一回)
        this.TokuseiUseCount = 0;   
        this.WazaDmg = 0; 
        this.R_Atk = 0;   
        this.R_Def = 0;   
        this.R_Agi = 0;   
        this.R_Avo = 0;   
        this.R_Hit = 0;   
        this.Def_Mode = false;
        this.EnemyFlg = false;
        let WazaArr = [];
        if (yarimonData.btlWazas == undefined) yarimonData.btlWazas = [];
        for (let i = 0; i <= yarimonData.btlWazas.length - 1; i++) {
            if (yarimonData.btlWazas[i].id == -1) continue;
            if ($gameSwitches.value(SW_本気Starツアー) && yarimonData.btlWazas[i].id == WazaID._チートタックル) {
                yarimonData.btlWazas[i].id = WazaID._キズナタックル;
                yarimonData.btlWazas[i].pp = undefined;
                WazaArr.push(new BtlWaza(yarimonData.btlWazas[i], 1)); 
            } else {
                WazaArr.push(new BtlWaza(yarimonData.btlWazas[i], yarimonData.btlWazas[i].yusendo)); 
            }
        }
        this.btlWazas = WazaArr; 
    }
    ResetYarimonData() {
        let yarimonData = new YarimonData(this.YarimonData.id, this.lv, this.starRank);
        yarimonData.btlWazas = [];
        for (let i = 0; i <= this.btlWazas.length - 1; i++) {
            yarimonData.btlWazas.push(new WazaData(this.btlWazas[i].id));
        }
        return yarimonData;
    }
    _Rank_補正値(_補正値) {
        if (_補正値 == 0) return 1;
        if (_補正値 < 0) return 2 / (2 + -_補正値);
        if (_補正値 > 0) return (2 + _補正値) / 2;
    }
    _わざ威力_補正値(_UseSkill) {
        if (this.Type == _UseSkill.type) return 1.5;
        return 1;
    }
    get Tokusei() {
        for (let i = 0; i <= $N_Yarimon_DB.tokuseiDatas.length - 1; i++) {
            if ($N_Yarimon_DB.tokuseiDatas[i].id == this.YarimonData.tokuseiId) {
                return $N_Yarimon_DB.tokuseiDatas[i];
            }
        }
        return null;
    }
}
class TrYarimonData {
    constructor() {
        this.btlWazas = [];
        this.encounterRate = 0;
        this.id = 0;
        this.lv = 0;
        this.maxLv = 0;
        this.minLv = 0;
        this.starRank = 0;
    }
}
class TrWazaData {
    constructor(_id, _yusendo) {
        this.id = _id;
        this.yusendo = _yusendo;
    }
}
class BtlWaza {
    constructor(_btlWaza, _yusendo) {
        _yusendo = typeof _yusendo !== 'undefined' ? _yusendo : 5;
        this.id = _btlWaza.id;
        if (_btlWaza.pp == undefined) {
            _btlWaza.pp = GetWazaData(_btlWaza.id).kaisu;
        }
        this.pp = _btlWaza.pp;
        this.reChargeTurn = 0; 
        this.yusendo = _yusendo;
    }
}
const _抜群倍率 = 1.5;
const _いまひとつ倍率 = 0.75;
let TokuseiEffData = null;
class TokuseiEff {
    constructor(_Chara, _EffName) {
        this.Chara = _Chara;
        this.EffName = _EffName;
    }
}
class BtlStatic {
    static Dmg_Get(_AtkChara, _DefChara, _WazaId, _DmgTxtArr) {
        let A_Atk = _AtkChara.Atk; 
        let B_Def = _DefChara.Def; 
        let _WazaData = GetWazaData(_WazaId); 
        let _iryoku = _WazaData.iryoku;
        let _SetDmgTxt = "";
        if (_DefChara.Tokusei.name == PassiveName._エレメント &&
            _DefChara.YarimonData.state.type == _WazaData.type && !_WazaData.effectOneSelfFlg) {
            _SetDmgTxt = NLngStrGet("同属性の攻撃は ") + NLngStrGet("<value>に吸収される" , [_DefChara.stName]) + "\n";
            Btl_TokuseiWin_Set(_DefChara);
            _iryoku = 0; 
            let _effect = new oriEffectData("");
            _effect.name = "回復";
            _effect.kakuritu = 25;
            _effect.oneselfFlg = false;
            btlAddEffect.push(new AddEffectData(0, _effect));
        }
        var VDefChara技クールダウン減少 = function () {
            for (let i = 0; i < _DefChara.btlWazas.length; i++) {
                if (_DefChara.btlWazas[i].reChargeTurn > 0){
                    _DefChara.btlWazas[i].reChargeTurn -= 3;
                    if (_DefChara.btlWazas[i].reChargeTurn < 0) _DefChara.btlWazas[i].reChargeTurn = 0;
                }
            }
        }
        let type相性Var = this.Type_相性Get(_DefChara.Type, _WazaData.type);
        if (_DefChara.Tokusei.name == PassiveName._幽体 && _WazaData.type == ConstType._無) {
            _SetDmgTxt += NLngStrGet("<value>なので、無属性はあまり効いていない" , [NLngStrGet(_DefChara.Tokusei.name)]) + "\n";
            Btl_TokuseiWin_Set(_DefChara);
            type相性Var = _いまひとつ倍率;
        }
        if (type相性Var > 1 && _iryoku != 0) {
            _SetDmgTxt = NLngStrGet("かなり効いている！！") + "\n";
            B_Def = _DefChara.BaseDef;
            if (_AtkChara.Tokusei.name == PassiveName._こいこい) {
                _SetDmgTxt += NLngStrGet(_AtkChara.Tokusei.name) + NLngStrGet("！勢いに乗ってダメージが増加！") + "\n";
                type相性Var = 2.0; 
            } else {
                if (_DefChara.Tokusei.name == PassiveName._丈夫な甲殻) {
                    _SetDmgTxt += NLngStrGet(_DefChara.Tokusei.name) + NLngStrGet("が、丈夫な甲殻が弱点ダメージを軽減した！") + "\n";
                    type相性Var = 1.1;
                    Btl_TokuseiWin_Set(_DefChara);
                }
            }
        } else {
            if ((_DefChara.Tokusei.name == PassiveName._潤いバリア || _DefChara.Tokusei.name == PassiveName._ラブリーボディ)
                && !_DefChara.TokuseiUseFlg
                && _iryoku > 0　&& (_WazaData.id != WazaID._チートタックル && _WazaData.id != WazaID._未来への翼)) {
                Btl_TokuseiWin_Set(_DefChara);
                if (_DefChara.Tokusei.name == PassiveName._潤いバリア)
                    _SetDmgTxt = NLngStrGet("潤いバリアが弾けてダメージを防いだ！") + "\n";
                if (_DefChara.Tokusei.name == PassiveName._ラブリーボディ)
                    _SetDmgTxt = NLngStrGet("愛くるしいボディが一度だけ攻撃を防ぐ！") + "\n";
                _iryoku = 0; 
                _DefChara.TokuseiUseFlg = true;
                TokuseiEffData = new TokuseiEff(_DefChara, "Effect_Tokusei");
            }
        }
        switch (_WazaData.id) {
            case WazaID._未来への翼:
            case WazaID._未来への翼 - 1:
            case WazaID._チートタックル:
                if (LastBtlFlg) _iryoku = 300;
                break;
            case WazaID._終わりの翼:
                if (_DefChara.Name == NLngStrGet("チケフレア")) {
                    if (_DefChara.Def_Mode) _iryoku = 100;
                }
                break;
            case WazaID._チートタックルEx1:
            case WazaID._チートタックルEx2:
                if (_DefChara.Name == NLngStrGet("チケフレア")) {
                    _iryoku = 100;
                    if (_DefChara.Def_Mode) _iryoku = 30;
                }
                _AtkChara.usedY9Ids = [];
                break;
        }
        if (type相性Var < 1 && _iryoku != 0) {
            if (_AtkChara.Tokusei.name == PassiveName._ゴリ押し) {
                Btl_TokuseiWin_Set(_AtkChara);
                type相性Var = 0.95;
                _SetDmgTxt = NLngStrGet("あまり効いていない……") + "\n" + NLngStrGet("が、ゴリ押しの力任せで思ったより効いた！");
            } else {
                _SetDmgTxt = NLngStrGet("あまり効いていない…") + "\n";
            }
        }
        if (_AtkChara.Tokusei.name == PassiveName._内燃機関) {
            if (_WazaData.type == ConstType._火) {
                Btl_TokuseiWin_Set(_AtkChara);
                _SetDmgTxt += NLngStrGet("<value>の 内燃機関が燃え上がる！" , [_AtkChara.stName]) + "\n";
                for (let i = 0; i <= _AtkChara.btlWazas.length - 1; i++) {
                    if (_AtkChara.btlWazas[i].reChargeTurn > 0) _AtkChara.btlWazas[i].reChargeTurn--;
                }
                TokuseiEffData = new TokuseiEff(_AtkChara, "Effect_Tokusei");
            }
        }
        if (_DefChara.Tokusei.name == PassiveName._耐熱装甲 &&
            _WazaData.type == ConstType._火 && !_WazaData.effectOneSelfFlg) {
            type相性Var *= 0.75;
            _SetDmgTxt += NLngStrGet(_DefChara.Tokusei.name) + NLngStrGet("によって、あまり熱を感じない！") + "\n";
        }
        let PsvAddConuter = 45;
        if (_DefChara.Tokusei.name == PassiveName._グライダー && _WazaData.type == ConstType._風 && !_WazaData.effectOneSelfFlg) {
            _SetDmgTxt += NLngStrGet("<value>は風に乗り、行動速度上昇！" , [_DefChara.stName]);
            Btl_TokuseiWin_Set(_DefChara);
            VDefChara技クールダウン減少();
            DmgeCounterAdd = PsvAddConuter;
        }
        if (_DefChara.Tokusei.name == PassiveName._電動ドライブ && _WazaData.type == ConstType._光 && !_WazaData.effectOneSelfFlg) {
            _SetDmgTxt += NLngStrGet("<value>は加速して、行動速度上昇！" , [_DefChara.stName]);
            Btl_TokuseiWin_Set(_DefChara);
            VDefChara技クールダウン減少();
            DmgeCounterAdd = PsvAddConuter;
        }
        if (_DefChara.Tokusei.name == PassiveName._ダークオーラ && _WazaData.type == ConstType._闇 && !_WazaData.effectOneSelfFlg) {
            _SetDmgTxt += NLngStrGet("<value>は闇をまとい、行動速度上昇！" , [_DefChara.stName]);
            Btl_TokuseiWin_Set(_DefChara);
            VDefChara技クールダウン減少();
            DmgeCounterAdd = PsvAddConuter;
        }
        if (_DefChara.Tokusei.name == PassiveName._腕利き && _WazaData.type == ConstType._無 && !_WazaData.effectOneSelfFlg) {
            _SetDmgTxt += NLngStrGet("<value>の腕利きで、行動速度上昇！" , [_DefChara.stName]);
            Btl_TokuseiWin_Set(_DefChara);
            VDefChara技クールダウン減少();
            DmgeCounterAdd = PsvAddConuter;
        }
        if (_DefChara.Ijos.indexOf(Ijo._切創) != -1) A_Atk = Math.floor(A_Atk * 0.75);
        if (_DefChara.Ijos.indexOf(Ijo._炎上) != -1) B_Def = Math.floor(B_Def * 0.75);
        let _tokusei補正値 = 1;
        if (_AtkChara.Tokusei.name == PassiveName._祟り目 && _DefChara.Ijos.length > 0) {
            Btl_TokuseiWin_Set(_AtkChara);
            _tokusei補正値 = 1.5;
            _SetDmgTxt += "" + NLngStrGet("<value>の 祟り目によりダメージが増加！" , [_AtkChara.stName]) + "\n";
        }
        if (_AtkChara.Tokusei.name == PassiveName._パルスレーダー) {
            let _plsFlg = false;
            if (_DefChara.R_Atk != 0) _plsFlg = true;
            if (_DefChara.R_Def != 0) _plsFlg = true;
            if (_DefChara.R_Agi != 0) _plsFlg = true;
            if (_DefChara.R_Avo != 0) _plsFlg = true;
            if (_DefChara.R_Hit != 0) _plsFlg = true;
            if (_plsFlg && _iryoku > 0) {
                _SetDmgTxt += NLngStrGet("<value>が威力を上昇させる" , [NLngStrGet(PassiveName._パルスレーダー)]) + "\n";
                _tokusei補正値 = 1.5;
                Btl_TokuseiWin_Set(_AtkChara);
            }
        }
        let _Damage = (_AtkChara.lv * 2 / 5 + 2) *
            (_iryoku * _AtkChara._わざ威力_補正値(_WazaData) * (A_Atk / B_Def)) / 50 * type相性Var;
        _Damage = Math.floor(_Damage * _tokusei補正値);
        if (type相性Var >= 1.5) Btl_SePlay("BtlCtrHit");
        if (_SetDmgTxt != "") _DmgTxtArr.push(_SetDmgTxt);
        return Math.round(_Damage);
    }
    static Type_相性Get(_DefType, _SkillType) {
        if (_DefType == ConstType._無) {
            return 1;
        }
        if (_DefType == ConstType._火) {
            if (_SkillType == ConstType._火) return _いまひとつ倍率;
            if (_SkillType == ConstType._風) return _いまひとつ倍率;
            // if (_SkillType == ConstType._闇) return _いまひとつ倍率;
            // if (_SkillType == ConstType._土) return _抜群倍率;
            if (_SkillType == ConstType._水) return _抜群倍率;
            return 1;
        }
        if (_DefType == ConstType._水) {
            if (_SkillType == ConstType._水) return _いまひとつ倍率;
            if (_SkillType == ConstType._土) return _抜群倍率;
            if (_SkillType == ConstType._火) return _いまひとつ倍率;
            //if (_SkillType == ConstType._光) return _抜群倍率;
            //if (_SkillType == ConstType._闇) return _抜群倍率;
            return 1;
        }
        if (_DefType == ConstType._土) {
            if (_SkillType == ConstType._土) return _いまひとつ倍率;
            // if (_SkillType == ConstType._火) return _いまひとつ倍率;
            // if (_SkillType == ConstType._光) return _いまひとつ倍率;
            if (_SkillType == ConstType._風) return _抜群倍率;
            if (_SkillType == ConstType._水) return _いまひとつ倍率;
            return 1;
        }
        if (_DefType == ConstType._風) {
            if (_SkillType == ConstType._風) return _いまひとつ倍率;
            if (_SkillType == ConstType._土) return _いまひとつ倍率;
            // if (_SkillType == ConstType._光) return _いまひとつ倍率;
            if (_SkillType == ConstType._火) return _抜群倍率;
            // if (_SkillType == ConstType._闇) return _抜群倍率;
            return 1;
        }
        if (_DefType == ConstType._光) {
            if (_SkillType == ConstType._光) return _いまひとつ倍率;
            // if (_SkillType == ConstType._水) return _いまひとつ倍率;
            if (_SkillType == ConstType._闇) return _抜群倍率;
            // (_SkillType == ConstType._風) return _抜群倍率;
            // (_SkillType == ConstType._土) return _抜群倍率;
            return 1;
        }
        if (_DefType == ConstType._闇) {
            if (_SkillType == ConstType._闇) return _いまひとつ倍率;
            // if (_SkillType == ConstType._風) return _いまひとつ倍率;
            // if (_SkillType == ConstType._水) return _いまひとつ倍率;
            // if (_SkillType == ConstType._火) return _抜群倍率;
            if (_SkillType == ConstType._光) return _抜群倍率;
            return 1;
        }
        return 1; 
    }
}
class ExWazaid {
    static get UseDougu() {
        return -6
    } 
    static get Sibire() {
        return -5
    }
    static get GetSet() {
        return -4
    } 
    static get Escape() {
        return -3
    }
    static get NotMove() {
        return -2
    }
    static get MonCng() {
        return -1
    }
}
class ConstType {
    static get _無() {
        return "無"
    }
    static get _火() {
        return "火"
    }
    static get _水() {
        return "水"
    }
    static get _風() {
        return "風"
    }
    static get _土() {
        return "土"
    }
    static get _光() {
        return "光"
    }
    static get _闇() {
        return "闇"
    }
}
class Ijo {
    static get _凍結() {
        return "凍結"
    }
    static get _炎上() {
        return "炎上"
    }
    static get _泥沼() {
        return "泥沼"
    }
    static get _痺れ() {
        return "痺れ"
    }
    static get _切創() {
        return "切創"
    }
    static get _呪い() {
        return "呪い"
    }
    static get _Get() {
        return "Get"
    }
}
class NRank {
    static get _攻撃() {
        return "攻撃"
    }
    static get _防御() {
        return "防御"
    }
    static get _素早さ() {
        return "素早さ"
    }
    static get _回避() {
        return "回避"
    }
    static get _命中() {
        return "命中"
    }
}
class BtlDmgEffect {
    static get Dmg() {
        return "Dmg"
    }
}
class DouguKouka {
    static get _HP回復() {
        return "HP回復"
    }
    static get _状態異常回復() {
        return "状態異常回復"
    }
    static get _能力変化() {
        return "能力変化"
    }
    static get _ゲット処理() {
        return "ゲット処理"
    }
    static get _野生戦闘回避() {
        return "野生戦闘回避"
    }
    static get _コモンイベント() {
        return "コモンイベント"
    }
}
