const VN_ELトレーナーID = 322;
const SW_EL戦闘中 = 593; 
var endLaboTrainerData = null;
let GetLaboSelectData = function () {
    let btlNo = $gameVariables.value(VN_エンドラボ回戦数);
    if (btlNo == 0) {
        btlNo = 1;
        $gameVariables.setValue(VN_エンドラボ回戦数 ,btlNo);
    }
    return JSON.parse(JSON.stringify($N_LaboratoryData.laboSelectYarimonDatas[btlNo - 1]));
}
let BtlLabo対戦相手GrpNos = [];
let BtlLabo_戦闘相手設定_ボーナス選出Flg = false;
Game_Interpreter.prototype.BtlLabo_戦闘相手設定 = function (only設定無視) {
    only設定無視 = typeof only設定無視 !== 'undefined' ? only設定無視 : false
    BtlLabo対戦相手GrpNos = [];
    let btlNo = $gameVariables.value(VN_エンドラボ回戦数);
    if (btlNo == 0) {
        $gameVariables.setValue(VN_エンドラボ回戦数 ,1);
        btlNo = 1;
    }
    var a選択トレーナーDatas = [];
    for (const trainerData of $N_Yarimon_DB.trainers) {
        if (trainerData.endLaboTrData.btlNo == btlNo) {
            a選択トレーナーDatas.push(trainerData);
            endLaboTrainerData = trainerData;
        }
    }
    endLaboTrainerData = ArrGetRandData(a選択トレーナーDatas);
    $gameSystem.EndLaboTrnIds.push(endLaboTrainerData.id);
    $gameVariables.setValue(VN_ELトレーナーID , endLaboTrainerData.id);
    let trainer = GetTrainerData(endLaboTrainerData.id);
    var selectYarimonData = GetLaboSelectData();
    $gameSystem.EndLaboMonDatas = [];
    let SetYarimonData = function (grpNo , starNo) {
        BtlLabo対戦相手GrpNos.push(grpNo);
        var rndMonDatas = [];
        var NgIds = [];
        for (let i = 0; i < endLaboTrainerData.endLaboTrData.syojiYarimonIds.length; i++) {
            NgIds.push(endLaboTrainerData.endLaboTrData.syojiYarimonIds[i]);
        }
        for (let i = 0; i < $gameSystem.EndLaboMonDatas.length; i++) {
            NgIds.push($gameSystem.EndLaboMonDatas[i].YarimonData.id);
        }
        var monId = GetRandGrpYarimonId(grpNo , NgIds);
        for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
            if (monId == $N_LaboratoryData.laboYarimonDatas[i].id) {
                var setMonData = GetELモンスターData(monId , grpNo);
                let _setMons = new BtlYarimonData(setMonData);
                _setMons.btlWazas = [];
                for (let k = 0; k < setMonData.btlWazas.length; k++) {
                    var setWazaData = new BtlWaza(setMonData.btlWazas[k], setMonData.btlWazas[k].yusendo)
                    _setMons.btlWazas.push(setWazaData);
                }
                _setMons.EnemyFlg = true;
                _setMons.starRank = starNo;
                _setMons.lv += selectYarimonData.cngLv;
                _setMons.GrpNo = grpNo; 
                $gameSystem.EndLaboMonDatas.push(_setMons);
                break;
            }
        }
    }
    if (BtlLabo_戦闘相手設定_ボーナス選出Flg) {
        if (selectYarimonData.grp3Cnt == 0 && selectYarimonData.grp4Cnt == 0) {
            if (selectYarimonData.grp1Cnt > 0) {
                selectYarimonData.grp1Cnt--;
            } else if (selectYarimonData.grp2Cnt > 0) {
                selectYarimonData.grp2Cnt--;
            }
            selectYarimonData.grp3Cnt++;
        } else {
            if (selectYarimonData.grp1Cnt > 0) {
                selectYarimonData.grp1Cnt--;
            } else if (selectYarimonData.grp2Cnt > 0) {
                selectYarimonData.grp2Cnt--;
            } else if (selectYarimonData.grp3Cnt > 0) {
                selectYarimonData.grp2Cnt--;
            }
            selectYarimonData.grp4Cnt++;
            if (selectYarimonData.grp4Cnt > 3) selectYarimonData.grp4Cnt = 3;
        }
    }
    let GrpCheckArr = [];
    for (let i = 0; i < selectYarimonData.grp1Cnt; i++) {
        SetYarimonData(0 , selectYarimonData.grp1Star);
        GrpCheckArr.push(0);
    }
    for (let i = 0; i < selectYarimonData.grp2Cnt; i++) {
        SetYarimonData(1 , selectYarimonData.grp2Star);
        GrpCheckArr.push(1);
    }
    for (let i = 0; i < selectYarimonData.grp3Cnt; i++) {
        SetYarimonData(2 , selectYarimonData.grp3Star);
        GrpCheckArr.push(2);
    }
    for (let i = 0; i < selectYarimonData.grp4Cnt; i++) {
        SetYarimonData(3 , selectYarimonData.grp4Star);
        GrpCheckArr.push(3);
    }
    if (!only設定無視) {
        for (let i = 0; i < 3; i++) {
            var monId = endLaboTrainerData.endLaboTrData.syojiYarimonIds[i];
            if (monId == -1) continue;
            let CkGrpYarimonData = GetYarimonGrpDataId(monId);
            let ckGrpNo = BtlLabo対戦相手GrpNos[i];
            for (let j = 0; j < 4; j++) {
                if (ckGrpNo < 0) ckGrpNo = 3;
                if (!CkGrpYarimonData.laboGrpYarimonDatas[ckGrpNo].check) {
                    ckGrpNo--;
                    continue;
                }
                var setMonData = GetELモンスターData(monId , ckGrpNo);
                setMonData.ExPowerFlg = $gameSystem.EndLaboMonDatas[i].ExPowerFlg;
                let _setMons = new BtlYarimonData(setMonData);
                _setMons.EnemyFlg = true;
                _setMons.starRank = $gameSystem.EndLaboMonDatas[i].starRank;
                _setMons.lv += selectYarimonData.cngLv;
                _setMons.GrpNo = ckGrpNo; 
                BtlLabo対戦相手GrpNos[i] = ckGrpNo; 
                $gameSystem.EndLaboMonDatas[i] = _setMons;
            }
        }
    }
    while ($gameSystem.EndLaboMonDatas.length > 3) {
        $gameSystem.EndLaboMonDatas.shift(); 
    }
    while (BtlLabo対戦相手GrpNos.length > 3) {
        BtlLabo対戦相手GrpNos.shift(); 
    }
    for (let i = 0; i < $gameSystem.EndLaboMonDatas.length; i++) {
        $gameSystem.EndLaboMonDatas[i]._hp =  $gameSystem.EndLaboMonDatas[i].MHP;
    }
    this.PLYarimon_HpCng(999);  
    this.BtlLabo_敵事前情報の取得(); 
    BtlLabo_戦闘相手設定_ボーナス選出Flg = false;
}
let GetYarimonGrpDataId = function (_id) {
    for (let j = 0; j < $N_LaboratoryData.laboYarimonDatas.length; j++) {
        if ($N_LaboratoryData.laboYarimonDatas[j].id == _id) {
            return $N_LaboratoryData.laboYarimonDatas[j];
        }
    }
}
const VN_エンドラボ敵情報 = 323;
Game_Interpreter.prototype.BtlLabo_敵事前情報の取得 = function () {
    var _fstType = "";
    var _無Cnt = 0; var _火Cnt = 0;
    var _水Cnt = 0; var _風Cnt = 0;
    var _土Cnt = 0; var _光Cnt = 0;
    var _闇Cnt = 0;
    for (let i = 0; i < $gameSystem.EndLaboMonDatas.length; i++) {
        if (i == 0) _fstType = $gameSystem.EndLaboMonDatas[i].Type;
        switch ($gameSystem.EndLaboMonDatas[i].Type) {
            case "無": _無Cnt++; break;
            case "火": _火Cnt++; break;
            case "水": _水Cnt++; break;
            case "風": _風Cnt++; break;
            case "土": _土Cnt++; break;
            case "光": _光Cnt++; break;
            case "闇": _闇Cnt++; break;
        }
    }
    $gameVariables.setValue(VN_エンドラボ敵情報 ,"先頭のヤリモンは" + _fstType + "属性みたいですね");
    if (_無Cnt >= 2) $gameVariables.setValue(VN_エンドラボ敵情報 ,"どうやら無属性が好きみたいですね");
    if (_火Cnt >= 2) $gameVariables.setValue(VN_エンドラボ敵情報 ,"どうやら火属性が好きみたいですね");
    if (_水Cnt >= 2) $gameVariables.setValue(VN_エンドラボ敵情報 ,"どうやら水属性が好きみたいですね");
    if (_風Cnt >= 2) $gameVariables.setValue(VN_エンドラボ敵情報 ,"どうやら風属性が好きみたいですね");
    if (_土Cnt >= 2) $gameVariables.setValue(VN_エンドラボ敵情報 ,"どうやら土属性が好きみたいですね");
    if (_光Cnt >= 2) $gameVariables.setValue(VN_エンドラボ敵情報 ,"どうやら光属性が好きみたいですね");
    if (_闇Cnt >= 2) $gameVariables.setValue(VN_エンドラボ敵情報 ,"どうやら闇属性が好きみたいですね");
}
Game_Interpreter.prototype.BtlLabo_勝利後ヤリモン設定 = function () {
    laboSetMonIds = [];
    for (let i = 0; i < $gameSystem.EndLaboMonDatas.length; i++) {
        laboSetMonIds.push($gameSystem.EndLaboMonDatas[i].YarimonData.id);
    }
    for (let i = 0; i < $gameSystem.EndLaboMonDatas.length; i++) {
        for (let j = 0; j < $gameSystem.yZukan[i].length; j++) {
            if ($gameSystem.yZukan[j].id == $gameSystem.EndLaboMonDatas[i].YarimonData.id) {
                $gameSystem.yZukan[i].lookFlg = true;
                $gameSystem.yZukan[i].getFlg = true;
            }
        }
    }
}
let GetELモンスターData = function (_id , grpNo) {
    _id = typeof _id !== 'undefined' ? _id : -1;
    let rtnYarimonData = new TrYarimonData();
    rtnYarimonData.id = _id;
    rtnYarimonData.lv = 75;
    rtnYarimonData.starRank = 0;
    for (let i = 0; i < $N_LaboratoryData.laboYarimonDatas.length; i++) {
        if ($N_LaboratoryData.laboYarimonDatas[i].id == rtnYarimonData.id) {
            var grpArr = $N_LaboratoryData.laboYarimonDatas[i].laboGrpYarimonDatas;
            if (!grpArr[grpNo].check) {
                for (let j = 0; j < 3; j++) {
                    grpNo++;
                    if (grpNo > 3) grpNo = 0;
                    if (grpArr[grpNo].check)
                        break;
                }
            }
            var monData = $N_LaboratoryData.laboYarimonDatas[i].laboGrpYarimonDatas[grpNo];
            rtnYarimonData.btlWazas = [];
            for (let k = 0; k < monData.btlWazas.length; k++) rtnYarimonData.btlWazas.push(monData.btlWazas[k]);
            break;
        }
    }
    return rtnYarimonData;
}
Game_Interpreter.prototype.SetEndraboTrainerDot = function (eventId) {
    var event = $gameMap.event(eventId);
    event.setImage(endLaboTrainerData.charaDotName , endLaboTrainerData.charaDotIndex);
}
Game_Interpreter.prototype.BtlLabo_勝利後成長 = function () {
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        var powUpYarimon = $gameSystem.Player.syojiTikemon[i];
        //powUpYarimon.btlCount += Math.floor(StarRankBtlValue / 2); //戦闘した回数（スターランクに影響
    }
}
Game_Interpreter.prototype.BtlLabo_ボーナス選出事前処理 = function () {
    this.ボーナスヤリモン取得設定(5);
}
Game_Interpreter.prototype.BtlLabo_ボーナス成長 = function () {
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        var powUpYarimon = $gameSystem.Player.syojiTikemon[i];
        powUpYarimon.btlCount += StarRankBtlValue * 2; 
    }
}
let BtlLabo_ヤリモン変化Id = -1;
Game_Interpreter.prototype.BtlLabo_ヤリモン変化No取得 = function () {
    BtlLabo_ヤリモン変化Id = Math.floor( Math.random() * 8);
    switch (BtlLabo_ヤリモン変化Id) {
        case 0: 
        case 1: 
        case 2: 
            return "スターランクアップ"
        case 3: 
        case 4: 
        case 5: 
            return "レベルアップ"
        case 6: 
            return "ヤリモン変化"
        case 7: 
            return "ソウルブースト"
    }
}
let BtlLabo_ヤリモン変化Type = 0;
let VN_ぬぷ竜1時変数5 = 40;
Game_Interpreter.prototype.BtlLabo_ヤリモン変化 = function () {
    var ckValue = Math.floor( Math.random() * 3);
    var powUpYarimon = $gameSystem.Player.syojiTikemon[ckValue];
    let CheckStarRankMon = function () {
        ckValue++;
        if (ckValue > 2) ckValue = 0;
        powUpYarimon = $gameSystem.Player.syojiTikemon[ckValue];
    }
    switch (BtlLabo_ヤリモン変化Id) {
        case 0: 
        case 1: 
        case 2: 
            if (powUpYarimon.btlCount >= StarRankBtlValue * 10) CheckStarRankMon();
            if (powUpYarimon.btlCount >= StarRankBtlValue * 10) CheckStarRankMon();
            if (powUpYarimon.btlCount >= StarRankBtlValue * 10) CheckStarRankMon();
            break;
    }
    $gameVariables.setValue(VN_ぬぷ竜1時変数5 ,powUpYarimon.YarimonData.name);
    switch (BtlLabo_ヤリモン変化Id) {
        case 0: 
            powUpYarimon.btlCount += StarRankBtlValue * 3;
        case 1: 
            powUpYarimon.btlCount += StarRankBtlValue;
        case 2: 
            powUpYarimon.btlCount += StarRankBtlValue;
            BtlLabo_ヤリモン変化Type = 0;
            break;
        case 3: 
            powUpYarimon.lv += 1;
        case 4: 
            powUpYarimon.lv += 1;
        case 5: 
            powUpYarimon.lv += 1;
            BtlLabo_ヤリモン変化Type = 1;
            break;
        case 6: 
            this.ボーナスヤリモン取得設定(50); 
            var setYarimon = $gameSystem.EndLaboMonDatas[Math.floor( Math.random() * 3)];
            powUpYarimon.YarimonData = setYarimon.YarimonData;
            powUpYarimon.id = setYarimon.YarimonData.id;
            powUpYarimon.btlCount = 50;
            powUpYarimon.ExPowerFlg = false;
            powUpYarimon.btlWazas = [];
            for (let j = 0; j < setYarimon.btlWazas.length; j++) {
                $N_Yarimon_DB.wazaDatas.forEach(_wazaData => {
                    if (_wazaData.id == setYarimon.btlWazas[j].id) {
                        powUpYarimon.btlWazas.push(new WazaData(_wazaData.id , _wazaData.kaisu));
                    }
                });
            }
            BtlLabo_ヤリモン変化Type = 2;
            break;
        case 7: 
            powUpYarimon.ExPowerFlg = true;
            BtlLabo_ヤリモン変化Type = 3;
            break;
    }
}
Game_Interpreter.prototype.ボーナスヤリモン取得設定 = function (upBtlCount) {
    var befCount = $gameVariables.value(VN_エンドラボ回戦数);
    var setCount = befCount + upBtlCount; 
    if ($N_LaboratoryData.laboSelectYarimonDatas.length < setCount) setCount = $N_LaboratoryData.laboSelectYarimonDatas.length;
    $gameVariables.setValue(VN_エンドラボ回戦数 , setCount);
    BtlLabo_戦闘相手設定_ボーナス選出Flg = true;
    this.BtlLabo_戦闘相手設定(true);
    $gameVariables.setValue(VN_エンドラボ回戦数 , befCount); 
    this.BtlLabo_勝利後ヤリモン設定(); 
}
