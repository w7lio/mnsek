Game_Interpreter.prototype.All_回復 = function () {
    for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
        $gameSystem.Player.syojiTikemon[i].hp = MHP($gameSystem.Player.syojiTikemon[i]);
    }
    for (let i = 0; i <= 9 - 1; i++) {
        for (let j = 0; j <= 20 - 1; j++) {
            if ($gameSystem.MonBox[i][j] == null) continue;
            $gameSystem.MonBox[i][j].hp = MHP($gameSystem.MonBox[i][j]);
        }
    }
}
const PN_BtlMaeBack = 70;
const PN_BtlMaeBall = PN_BtlMaeBack + 2;
const PN_BtlMaeTxt = PN_BtlMaeBall + 3;
let VN_BtlMaeTxt = 302;
let _戦闘TrainerID = -1;
Game_Interpreter.prototype.戦闘前立ち絵描画 = function () {
    let tatieNo = 1;
    var i手動トレーナーID = $gameVariables.value(VN_TrId手動設定);
    if (i手動トレーナーID > 0) {
        _戦闘TrainerID = i手動トレーナーID;
        try {
            this.character(0).TrainerId = _戦闘TrainerID;
            tatieNo = _戦闘TrainerID;
        } catch (e) {
            console.log("◆ TrainerIDエラー回避 ◆");
        }
    } else {
        tatieNo = this.character(0).TrainerId;
    }
    let trData = GetTrainerData(tatieNo);
    btlTrainerId = tatieNo;
    let bPicPath = Btl_EmTatie + trData.picPath + "_Bup";
    this.SetSprite( PN_BtlMaeBack , "Black" , 0 , 0 , 150);
    this.SetSprite( PN_BtlMaeBack + 1 , bPicPath , 577 + 15 , 122 , 0 , 70 , 70);
    this.MoveSprite( PN_BtlMaeBack + 1 , 577 , 122 , 25 , 255 , true , true);
    for (let i = 0; i <= 3 - 1; i++) {
        let setX = BPs._x + 715; let setY = BPs._y + 318 + 44 * i;
        if (trData.syojiTikemon.length > i) {
            this.SetSprite(PN_BtlMaeBall + i , Btl_PicPath + "PN_BtlTrnBall" , setX , setY);
            var viewLv = trData.syojiTikemon[i].lv;
            if (trData.syojiTikemon[i].TrnLvSaFlg) {
                viewLv += $gameSystem.TrainerLv;
                if (trData.trLvHikakuMinLv > viewLv) viewLv = trData.trLvHikakuMinLv;
            }
            this.SpriteStr(PN_BtlMaeTxt + i , SWCol.Blk + " Lv." + viewLv + " " , 20 , setX + 26 , setY + 17);
        } else {
            this.SetSprite(PN_BtlMaeBall + i , Btl_PicPath + "PN_BtlTrnNBall" , setX , setY);
        }
    }
    let setSuisyoLv = trData.suisyoLv;
    if (trData.suisyoLv == 0) setSuisyoLv = $gameSystem.TrainerLv;
    let _nameStr = trData.jobName + NLngStrGet(" の ") + trData.name + NLngStrGet("（推奨Lv.") + setSuisyoLv + "）";
    if ($gameSystem.WinedTrainerArr.indexOf(btlTrainerId) != -1) _nameStr += NLngStrGet("※勝利済");
    $gameVariables.setValue(VN_BtlMaeTxt ,_nameStr);
}
Game_Interpreter.prototype.戦闘ヤリモンSetting = function () {
    var i手動トレーナーID = $gameVariables.value(VN_TrId手動設定);
    if (i手動トレーナーID > 0) _戦闘TrainerID = i手動トレーナーID;
    let tatieNo;
    try {
        tatieNo = this.character(0).TrainerId
    } catch (e) {
        tatieNo = _戦闘TrainerID;
    }
    btlTrainerId = tatieNo;
}
Game_Interpreter.prototype.戦闘前立ち絵削除 = function () {
    this.DelSprite(PN_TalkWin);
    this.DelSprite(PN_BtlMaeBack + 0);
    this.DelSprite(PN_BtlMaeBack + 1);
    this.DelSpriteSpan(PN_BtlMaeBall , PN_BtlMaeTxt + 2);
}
