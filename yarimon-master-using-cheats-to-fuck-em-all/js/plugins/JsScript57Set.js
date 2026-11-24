let EndContentsBtlFlg = false;
const VN_EC回戦数 = 304;
const VN_EC相手ID = 305;
const VN_EC周回数 = 306;
let GameEndContents_Initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    GameEndContents_Initialize.call(this);
    this.keepTikepuData = null;     
    this.keepTemotiLv = [0,0,0];    
    this.EndNanido0Trainers = [];   
    this.EndNanido1Trainers = [];   
    this.EndNanido2Trainers = [];   
    this.EndNanido3Trainers = [];   
    this.EndNanido4Trainers = [];   
    this.EndNanido5Trainers = [];   
}
Game_Interpreter.prototype.Ec_チケフレア外し = function () {
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        if ($gameSystem.Player.syojiTikemon[i].id == 171) {
            $gameSystem.keepTikepuData = $gameSystem.Player.syojiTikemon[i];
            $gameSystem.Player.syojiTikemon.splice(i , 1);
            break;
        }
    }
}
Game_Interpreter.prototype.Ec_チケフレア戻し = function () {
    if ($gameSystem.keepTikepuData == null) return;
    if ($gameSystem.Player.syojiTikemon.length > 2) {
        for (let i = 0; i <= $gameSystem.MonBox.length - 1; i++) {
            for (let j = 0; j <= $gameSystem.MonBox[i].length - 1; j++) {
                if($gameSystem.MonBox[i][j] == null) {
                    $gameSystem.MonBox[i][j] = $gameSystem.Player.syojiTikemon[2];
                    $gameSystem.Player.syojiTikemon.splice(2 , 1);
                    break;
                }
            }
        }
    }
    $gameSystem.Player.syojiTikemon.push($gameSystem.keepTikepuData);
    $gameSystem.keepTikepuData = null;
}
Game_Interpreter.prototype.Ec_手持ちLvUp = function () {
    $gameSystem.keepTemotiLv = [];
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        $gameSystem.keepTemotiLv.push($gameSystem.Player.syojiTikemon[i].lv);
        $gameSystem.Player.syojiTikemon[i].lv = 75;
    }
    this.PLYarimon_HpCng(999);  
}
Game_Interpreter.prototype.Ec_手持ちLv戻し = function () {
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        $gameSystem.Player.syojiTikemon[i].lv = $gameSystem.keepTemotiLv[i];
    }
    this.PLYarimon_HpCng(999);
    $gameSystem.keepTemotiLv = [];
}
Game_Interpreter.prototype.Ec_保存データリセット = function () {
    if ($gameSystem.EndNanido0Trainers == null) $gameSystem.EndNanido0Trainers = [];
    if ($gameSystem.EndNanido1Trainers == null) $gameSystem.EndNanido1Trainers = [];
    if ($gameSystem.EndNanido2Trainers == null) $gameSystem.EndNanido2Trainers = [];
    if ($gameSystem.EndNanido3Trainers == null) $gameSystem.EndNanido3Trainers = [];
    if ($gameSystem.EndNanido4Trainers == null) $gameSystem.EndNanido4Trainers = [];
    if ($gameSystem.EndNanido5Trainers == null) $gameSystem.EndNanido5Trainers = [];
    var addFlgs = [
        $gameSystem.EndNanido0Trainers.length == 0 ,
        $gameSystem.EndNanido1Trainers.length == 0 ,
        $gameSystem.EndNanido2Trainers.length == 0 ,
        $gameSystem.EndNanido3Trainers.length == 0 ,
        $gameSystem.EndNanido4Trainers.length == 0 ,
        $gameSystem.EndNanido5Trainers.length == 0
    ];
    for (let i = 0; i <= $N_Yarimon_DB.trainers.length - 1; i++) {
        var endData = $N_Yarimon_DB.trainers[i].endContentsTrData;
        if (endData.startSelf != "" && endData.startSelf != ";") {
            if (!addFlgs[endData.nanido]) continue;
            switch (endData.nanido) {
                case 0:
                    $gameSystem.EndNanido0Trainers.push($N_Yarimon_DB.trainers[i].id);
                    break;
                case 1:
                    $gameSystem.EndNanido1Trainers.push($N_Yarimon_DB.trainers[i].id);
                    break;
                case 2:
                    $gameSystem.EndNanido2Trainers.push($N_Yarimon_DB.trainers[i].id);
                    break;
                case 3:
                    $gameSystem.EndNanido3Trainers.push($N_Yarimon_DB.trainers[i].id);
                    break;
                case 4:
                    $gameSystem.EndNanido4Trainers.push($N_Yarimon_DB.trainers[i].id);
                    break;
                case 5:
                    $gameSystem.EndNanido5Trainers.push($N_Yarimon_DB.trainers[i].id);
                    break;
            }
        }
    }
}
let GetEC難易度 = function () {
    let _回戦数 = $gameVariables.value(304);
    if ($gameVariables.value(VN_EC周回数) < 3) {
        let _難易度 = 0;
        if (_回戦数 >= 6) _難易度 = 1;
        if (_回戦数 >= 6 + 4) _難易度 = 2;
        if (_回戦数 >= 6 + 4 + 4) _難易度 = 3;
        if (_回戦数 >= 6 + 4 + 4 + 4) _難易度 = 4;
        if (_回戦数 >= 6 + 4 + 4 + 4 + 4) _難易度 = 5;
        return _難易度;
    }
    _回戦数 = _回戦数 % 20;   
    return Math.floor((_回戦数) / 4);
}
let GetECモンスターData = function (_id) {
    _id = typeof _id !== 'undefined' ? _id : -1;
    let _難易度 = GetEC難易度();
    let rtnYarimonDatas = [];
    if (_id == -1) {
        for (let i = 0; i <= 151 - 1; i++) {
            let yarimonData = $N_Yarimon_DB.mZukanDatas[i];
            if (yarimonData.endContentsData.maxNanido >= _難易度 &&
                yarimonData.endContentsData.minNanido <= _難易度) {
                rtnYarimonDatas.push(yarimonData);
            }
        }
    } else {
        for (let i = 0; i <= $N_Yarimon_DB.mZukanDatas.length - 1; i++) {
            if (_id == $N_Yarimon_DB.mZukanDatas[i].id) {
                rtnYarimonDatas.push($N_Yarimon_DB.mZukanDatas[i]);
                break;
            }
        }
    }
    let rtnYarimonData = new TrYarimonData();
    let ckData = rtnYarimonDatas[Math.floor( Math.random() * rtnYarimonDatas.length)];
    rtnYarimonData.id = ckData.id;
    rtnYarimonData.lv = 75;
    if (($gameVariables.value(VN_EC周回数) >= 3)) {
        let _回戦数 = $gameVariables.value(304);
        let upCnt = Math.floor(_回戦数 % 4) + 1;
        rtnYarimonData.lv = 75 + upCnt;
    }
    rtnYarimonData.starRank = _難易度 + 5;
    for (let i = 0; i <= ckData.endContentsData.wazaDatas.length - 1; i++) {
        var setWazaData = new TrWazaData(
            ckData.endContentsData.wazaDatas[i].id , ckData.endContentsData.wazaDatas[i].yusendo);
        rtnYarimonData.btlWazas.push(setWazaData);
    }
    if (_難易度 >= 3) {
        var setWaza = ckData.wazaList[ckData.wazaList.length - 1];
        if (setWaza.lv == 999) {    
            var setWazaData = new TrWazaData(setWaza.id , 9);
            if (_難易度 == 3) setWazaData = new TrWazaData(setWaza.id , 5);
            rtnYarimonData.btlWazas[0] = setWazaData;   
        }
    }
    return rtnYarimonData;
}
Game_Interpreter.prototype.Ec_トレーナーSetting = function () {
    for (let i = 0; i < $gameSystem.EndNanido0Trainers.length; i++) {
        if ($gameSystem.EndNanido0Trainers[i] >= 140) {
            $gameSystem.EndNanido0Trainers.splice(i , 1); i--;
        }
    }
    for (let i = 0; i < $gameSystem.EndNanido1Trainers.length; i++) {
        if ($gameSystem.EndNanido1Trainers[i] >= 140) {
            $gameSystem.EndNanido1Trainers.splice(i , 1); i--;
        }
    }
    for (let i = 0; i < $gameSystem.EndNanido2Trainers.length; i++) {
        if ($gameSystem.EndNanido2Trainers[i] >= 140) {
            $gameSystem.EndNanido2Trainers.splice(i , 1); i--;
        }
    }
    for (let i = 0; i < $gameSystem.EndNanido3Trainers.length; i++) {
        if ($gameSystem.EndNanido3Trainers[i] >= 140) {
            $gameSystem.EndNanido3Trainers.splice(i , 1); i--;
        }
    }
    for (let i = 0; i < $gameSystem.EndNanido4Trainers.length; i++) {
        if ($gameSystem.EndNanido4Trainers[i] >= 140) {
            $gameSystem.EndNanido4Trainers.splice(i , 1); i--;
        }
    }
    for (let i = 0; i < $gameSystem.EndNanido5Trainers.length; i++) {
        if ($gameSystem.EndNanido5Trainers[i] >= 140) {
            $gameSystem.EndNanido5Trainers.splice(i , 1); i--;
        }
    }
    this.Ec_保存データリセット();
    let _難易度 = GetEC難易度();
    let _相手ID = 0;
    switch (_難易度) {
        case 0:
            let index0 = Math.floor(Math.random() * $gameSystem.EndNanido0Trainers.length);
            _相手ID = $gameSystem.EndNanido0Trainers[index0];
            $gameSystem.EndNanido0Trainers.splice(index0 , 1);
            break;
        case 1:
            let index1 = Math.floor(Math.random() * $gameSystem.EndNanido1Trainers.length);
            _相手ID = $gameSystem.EndNanido1Trainers[index1];
            $gameSystem.EndNanido1Trainers.splice(index1 , 1);
            break;
        case 2:
            let index2 = Math.floor(Math.random() * $gameSystem.EndNanido2Trainers.length);
            _相手ID = $gameSystem.EndNanido2Trainers[index2];
            $gameSystem.EndNanido2Trainers.splice(index2 , 1);
            break;
        case 3:
            let index3 = Math.floor(Math.random() * $gameSystem.EndNanido3Trainers.length);
            _相手ID = $gameSystem.EndNanido3Trainers[index3];
            $gameSystem.EndNanido3Trainers.splice(index3 , 1);
            break;
        case 4:
            let index4 = Math.floor(Math.random() * $gameSystem.EndNanido4Trainers.length);
            _相手ID = $gameSystem.EndNanido4Trainers[index4];
            $gameSystem.EndNanido4Trainers.splice(index4 , 1);
            break;
        case 5:
            let index5 = Math.floor(Math.random() * $gameSystem.EndNanido5Trainers.length);
            _相手ID = $gameSystem.EndNanido5Trainers[index5];
            $gameSystem.EndNanido5Trainers.splice(index5 , 1);
            break;
    }
    $gameVariables.setValue(VN_EC相手ID , _相手ID);
    EndContentsBtlFlg = true;
}
