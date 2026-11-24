let mDougu_PicPath = MenuPicPath + "/Dougu/";
let mDougu_IconPath = "pictures/H_Scene/_DataBase/DouguIcon/";
let itemClass;
class ItemClass {
    constructor() {
        this.Bunrui = [];
        for (let i = 0; i <= $N_Yarimon_DB.douguDatas.length - 1; i++) {
            let count = $gameParty.numItems($dataItems[i + 1]);
            if (count > 0) {
                let setData = $N_Yarimon_DB.douguDatas[i];
                let ckNo = GetBunruiNo(setData.bunrui);
                let bunruiNo = -1;
                for (let j = 0; j <= this.Bunrui.length - 1; j++) {
                    if(this.Bunrui[j].Bunrui == ckNo) {
                        bunruiNo = j;
                        break;
                    }
                }
                if (bunruiNo == -1) {
                    this.Bunrui.push(new ItemBunruiData(ckNo));
                    bunruiNo = this.Bunrui.length - 1;
                }
                this.Bunrui[bunruiNo].Items.push(new ItemData(i , count , setData));
            }
        }
    }
}
class ItemBunruiData {
    constructor(bunrui) {
        this.Bunrui = bunrui;
        this.Items = [];
    }
}
class ItemData {
    constructor(id , count , data) {
        this.id = id;
        this.count = count;
        this.data = data;
    }
}
let GetItemBunruiData = function (ckMode) {
    let bunruiNo = ckMode.btnNoArr[ckMode.selecterNo];
    for (let i = 0; i <= itemClass.Bunrui.length - 1; i++) {
        if(itemClass.Bunrui[i].Bunrui == bunruiNo){
            return itemClass.Bunrui[i];
        }
    }
    return new ItemBunruiData(-1);
}
let itemBunrui; 
let itemDrawCnt = 0;
const ColBlackWhtStr = SCol.Blk0 + SWCol.Wht + "\\ow[2]";
Game_Interpreter.prototype.Menu_DouguDraw = function (ckMode) {
    douguEndFlg = false;
    ckMode.selItemBunrui = GetItemBunruiData(ckMode);
    this.DelSpriteSpan(PN_dmDtlBtn + 0 , PN_dmTopImg - 1);
    this.SetSprite(PN_dmBase , mDougu_PicPath + "PN_dmBase" , BPs._x , BPs._y);
    for (let i = 0; i <= ckMode.btnNoArr.length - 1; i++) {
        let setX = BPs._x + 0;
        let setY = BPs._y + 84 + (78 * i);
        if(i != ckMode.selecterNo) setX -= 20;
        this.SetSprite(PN_dmBtn + i , mDougu_PicPath + "PN_dmBtn" + ckMode.btnNoArr[i] , setX , setY);
    }
    this.SetSprite(PN_dmTopImg , mDougu_PicPath + "PN_dmTopImg" +
        ckMode.btnNoArr[ckMode.selecterNo] , BPs._x + 276 , BPs._y + 6);
    for (let i = 0; i <= ckMode.selItemBunrui.Items.length - 1; i++) {
        if(ckMode.selItemBunrui.Items[i].count <= 0) {
            ckMode.selItemBunrui.Items.splice(i , 1); i--;
        }
    }
    itemDrawCnt = ckMode.selItemBunrui.Items.length;
    for (let i = 0; i <= ckMode.selItemBunrui.Items.length - 1; i++) {
        let itemData = ckMode.selItemBunrui.Items[i];
        let posX = i % 2;
        let posY = Math.floor(i / 2);
        let setX = BPs._x + 267 + (274 * posX);
        let setY = BPs._y + 85 + (70 * posY);
        this.SetSprite(PN_dmDtlBtn + i ,  mDougu_PicPath + "PN_dmDtlBtn" , setX , setY);
        this.SetSpriteC(PN_dmDtlCnt + i ,  mDougu_IconPath + itemData.data.picPath , setX + 5 , setY + 25);
        let nameFontSize = 22;
        let setZureY = 0;
        if(LngMode == "en") {
            if (itemData.data.name.length > 15) {
                nameFontSize = 17; setZureY = 3;
            }
        }
        this.SpriteStr(PN_dmDtlTxt + i , ColBlackWhtStr + itemData.data.name , nameFontSize , setX + 27 , setY + 10 + setZureY);
        this.SpriteStrC(PN_dmDtlIcn + i , ColBlackWhtStr + " " + itemData.count + " " , 22 , setX + 232 , setY + 37);
        D_Text_Cng_font = ""; 
        if (i == 9) break;
    }
    for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
        if(battle_Class.isBattle) {
            this.YarimonWakuDraw(PN_dmTikeBar + (i * dmBtnPicCnt) , battle_Class.plYarimons[i] ,
                BPs._x + 13 + 144 * i , BPs._y + 490);
        } else {
            this.YarimonWakuDraw(PN_dmTikeBar + (i * dmBtnPicCnt) , $gameSystem.Player.syojiTikemon[i] ,
                BPs._x + 13 + 144 * i , BPs._y + 490);
        }
        if (i == 9) break;
    }
};
Game_Interpreter.prototype.Menu_DouguUpdate = function (ckMode) {
    if(ckMode.flame == 1) { 
        this.DelSpriteSpan(PN_dmBase , PN_mL2Selecter - 1)
        itemClass = new ItemClass();
        this.Menu_DouguDraw(ckMode);
    }
    switch (ckMode.modeName) {
        case Menu_Dougu.Select:
            this.Menu_Dougu_SelectUpdate(ckMode);
            break;
        case Menu_Dougu.Detail:
            this.Menu_Dougu_DetailUpdate(ckMode.mode);
            return;
    }
};
let douguSelectCngNo = -1;
let douguEndFlg = false;
Game_Interpreter.prototype.Menu_Dougu_SelectUpdate = function (ckMode) {
    this.SetSprite(PN_dmLight , mDougu_PicPath + "PN_dmLight1" , BPs._x , BPs._y);
    this.SetSprite(PN_dmSelecter, MenuPicPath + "PN_mSelecter",
        BPs._x + 193, BPs._y + 106 + (78 * ckMode.selecterNo) , 255);
    let okFlg = false;
    let ckPicArr = [];
    for (let i = 0; i <= 4 - 1; i++) {
        ckPicArr.push(PN_dmBtn + i);
    }
    this.SpriteCngColorArr(ckPicArr);
    let ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if(ckPicNo != -1) {
        this.SpriteCngColor(PN_dmBtn + ckPicNo , [70 ,70 ,70 ,0 ]);
        if(TouchInput.isTriggered()) {
            ckMode.selecterNo = ckPicNo;
        }
    }
    ckPicArr = [];
    for (let i = 0; i <= 10 - 1; i++) {
        ckPicArr.push(PN_dmDtlBtn + i);
    }
    let selectAudioFlg = false;
    ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if(ckPicNo != -1) {
        okFlg = selectAudioFlg = true;
    }
    if (douguSelectCngNo != -1) ckMode.selecterNo = douguSelectCngNo;
    douguSelectCngNo = -1;
    if(Input.isTriggered('up')) {
        ckMode.selectNo_Up();
    }
    if(Input.isTriggered('down')) {
        ckMode.selectNo_Down();
    }
    if(ckMode.IsSelecterMove) {
        SoundManager.playCursor();
        this.Menu_DouguDraw(ckMode);
    }
    if(Input.isTriggered('ok') || okFlg) {
        if(ckMode.selItemBunrui.Items.length == 0) return;
        if(!selectAudioFlg) SoundManager.playOk();
        ckMode.ModeCng(Menu_Dougu.Detail); 
        ckMode.mode.selectGrid_Reset(false); 
        for (let i = 0; i <= ckMode.selItemBunrui.Items.length - 1; i++) {
            let posX = i % 2;
            let posY = Math.floor(i / 2);
            ckMode.mode.selectGrid[posY][posX] = true;
            if (i >= 9) break;
        }
        ckMode.mode.selecterNoY = 0;
        ckMode.mode.selecterNoX = 0;
        let itemData = ckMode.selItemBunrui.Items[0];
        this.DouguSetuDraw_ItemData(itemData);
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled() || douguEndFlg) {
        SoundManager.playCancel();
        this.DelSprite(PN_dmSelecter);
        if (!battle_Class.isBattle) {
            this.Layer2_DelSprite();
            DouguMenuPNSetting(PN_mL2Base + 1 , PN_mL2Selecter);
            menuBox.ModeCng(MenuBox.Select); 
        } else {
            this.BtlL2PicDel();
            this.DelSpriteSpan(PN_dmBase , PN_BtlEn);
            ckMode.parent.ModeCng(Btl_Select.Select);
        }
    }
}
let menuTextArr = [];
let menuViewFlame = 0;
Game_Interpreter.prototype.Menu_Dougu_DetailUpdate = function (ckMode) {
    if(menuTextArr.length > 0) {
        this.SetSprite(PN_TalkWin , "PN_TalkWin", BPs._x , BPs._y);
        this.SpriteStr(PN_TalkText , SCol.Blk0 + menuTextArr[0] , 24 , BPs._x + 65 , BPs._y + 300 + 188);
        if(menuViewFlame > 0) menuViewFlame--;
        if (Input.isTriggered('ok') || Input.isTriggered('menu') || TouchInput.isPressed()) {
            if(menuViewFlame > 0) return;
            SoundManager.playCancel();
            menuTextArr.shift();
            if (menuTextArr.length == 0) {
                this.DelSpriteSpan(PN_TalkWin , PN_TalkText);
            }
        }
        return;
    }
    switch (ckMode.modeName) {
        case Menu_Dougu_Detail.Select:
            this.Menu_Dougu_Detail_SelectUpdate(ckMode);
            break;
        case Menu_Dougu_Detail.YarimonSelect:
            this.Menu_Dougu_Detail_YarimonSelectUpdate(ckMode.mode);
            break;
        case Menu_Dougu_Detail.YesNo:
            this.Menu_Dougu_Detail_YesNoUpdate(ckMode.mode);
            break;
        case Menu_Dougu_Detail.Using:
            this.Menu_Dougu_Detail_UsingUpdate(ckMode);
            break;
    }
};
Game_Interpreter.prototype.Menu_Dougu_Detail_SelectUpdate = function (ckMode) {
    this.SetSprite(PN_dmLight , mDougu_PicPath + "PN_dmLight2" , BPs._x , BPs._y);
    let posX = ckMode.selecterNoX;
    let posY = ckMode.selecterNoY;
    let setX = BPs._x + 267 + (274 * posX) - 3;
    let setY = BPs._y + 85 + (70 * posY) - 3;
    this.SetSprite(PN_dmRedSel , mDougu_PicPath + "PN_dmRedSel" , setX , setY);
    this.SetSprite(PN_dmSelecter, MenuPicPath + "PN_mSelecter", setX + 249 , setY + 17 , 255);
    let okFlg = false;
    let ckPicArr = [];
    for (let i = 0; i <= 10 - 1; i++) {
        ckPicArr.push(PN_dmDtlBtn + i);
    }
    let ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if(ckPicNo != -1) {
        ckMode.selecterNoX =　ckPicNo % 2;
        ckMode.selecterNoY = Math.floor(ckPicNo / 2);
        okFlg = TouchInput.isTriggered();
    }
    ckPicArr = [];
    for (let i = 0; i <= 4 - 1; i++) {
        ckPicArr.push(PN_dmBtn + i);
    }
    this.SpriteCngColorArr(ckPicArr);
    ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if(ckPicNo != -1) {
        this.SpriteCngColor(PN_dmBtn + ckPicNo , [70 ,70 ,70 ,0 ]);
        if(TouchInput.isTriggered()) {
            this.DelSprite(PN_dmRedSel);
            this.DouguSetuDel();
            ckMode.parent.ModeCng(Menu_Dougu.Select); 
            douguSelectCngNo = ckPicNo;
        }
    }
    if (Input.isTriggered('up')) {
        ckMode.selecter_Up();
    }
    if (Input.isTriggered('down')) {
        ckMode.selecter_Down();
    }
    if (Input.isTriggered('right')) {
        ckMode.selecter_Right();
    }
    if (Input.isTriggered('left')) {
        ckMode.selecter_Left();
    }
    if (ckMode.selecterNoX + ckMode.selecterNoY * 2 >= ckMode.parent.selItemBunrui.Items.length) {
        if (ckMode.selecterNoX > 0) ckMode.selecterNoX--;
        else {
            ckMode.selecterNoY--; ckMode.selecterNoX = 1;
        }
    }
    if (ckMode.IsSelecterGridMove) {
        let itemCnt = ckMode.selecterNoX + ckMode.selecterNoY * 2;
        let itemData = ckMode.parent.selItemBunrui.Items[itemCnt];
        if (itemData != undefined) {
            this.DouguSetuDraw_ItemData(itemData);
        } else
            itemDrawCnt == 0;
    }
    if (Input.isTriggered('ok') || okFlg) {
        let itemCnt = ckMode.selecterNoX + ckMode.selecterNoY * 2;
        let itemData = ckMode.parent.selItemBunrui.Items[itemCnt];
        if (GetBunruiNo(itemData.data.bunrui) == emDougu._戦闘) {
            if (!battle_Class.isBattle) {
                menuViewFlame = 10; 
                menuTextArr.push(NLngStrGet("戦闘中にしか使えないよ"));
                return;
            }
        }
        if (GetBunruiNo(itemData.bunrui) == emDougu._大切) {
            return;
        }
        ckMode.selectItem = itemData;
        if(Dougu_YarimonSelectFlg(itemData)) {
            this.CngPhase_Menu_Dougu_DetailUsing(ckMode.mode);
        } else {
            ckMode.ModeCng(Menu_Dougu_Detail.YarimonSelect); 
        }
        SoundManager.playOk();
    }
    if (Input.isTriggered('menu') || itemDrawCnt == 0) {
        SoundManager.playCancel();
        this.DelSprite(PN_dmRedSel);
        this.DouguSetuDel();
        ckMode.parent.ModeCng(Menu_Dougu.Select); 
    }
    if (TouchInput.isCancelled()) { 
        if (!battle_Class.isBattle) {
            this.Layer2_DelSprite();
            menuBox.ModeCng(MenuBox.Select); 
        } else {
            this.BtlL2PicDel();
            this.DelSpriteSpan(PN_dmBase , PN_dmTikeBar + 8 * 3);
            douguEndFlg = true;
            ckMode.parent.ModeCng(Btl_Select.Select);
        }
    }
}
let Dougu_YarimonSelectFlg = function (ckItem) {
    let rtnData = false;
    ckItem.data.exSkillList.forEach( exData => {
        switch (exData.bunrui) {
            case DouguKouka._ゲット処理:
                rtnData = true;
                break;
            case DouguKouka._野生戦闘回避:
                rtnData = true;
                break;
        }
    });
    return rtnData;
}
Game_Interpreter.prototype.DouguSetuDraw_ItemData = function (itemData) {
    this.SpriteStr(PN_dmStName , ColBlackWhtStr + itemData.data.name , 24 , BPs._x + 458 , BPs._y + 460);
    if (LngMode == "en") {
        this.SpriteStr(PN_dmStSetu , ColBlackWhtStr + itemData.data.setu , 18 , BPs._x + 458 , BPs._y + 460 + 48);
    } else {
        this.SpriteStr(PN_dmStSetu , ColBlackWhtStr + itemData.data.setu , 24 , BPs._x + 458 , BPs._y + 460 + 48);
    }
    this.SpriteStrC(PN_dmStCnt , ColBlackWhtStr + " " + itemData.count + " " , 24 , BPs._x + 785 , BPs._y + 475);
    this.PlaySe("_Select");
    D_Text_Cng_font = "";    
}
Game_Interpreter.prototype.DouguSetuDel = function () {
    this.DelSpriteSpan(PN_dmStName , PN_dmStCnt);
}
Game_Interpreter.prototype.Menu_Dougu_Detail_YarimonSelectUpdate = function (ckMode) {
    if(ckMode.flame == 1) {
        this.Menu_Dougu_Detail_YarimonSelectMove(ckMode); 
        ckMode.selectNoMax = $gameSystem.Player.syojiTikemon.length - 1;
    }
    this.SetSprite(PN_dmLight , mDougu_PicPath + "PN_dmLight3" , BPs._x , BPs._y);
    this.SetSprite(PN_dmSelecter, MenuPicPath + "PN_mSelecter_d" ,
        BPs._x + 64 + (144 * ckMode.selecterNo), BPs._y + 454 , 255);
    let okFlg = false;
    let ckPicArr = [
        PN_dmTikeBar + 2 + (0 * dmBtnPicCnt) ,
        PN_dmTikeBar + 2 + (1 * dmBtnPicCnt) ,
        PN_dmTikeBar + 2 + (2 * dmBtnPicCnt)
    ];
    let ckPicNo = overPointerSpCkArr_GetNo(ckPicArr);
    if(ckPicNo != -1) {
        ckMode.selecterNo = ckPicNo;
        okFlg = TouchInput.isTriggered();
    }
    if(Input.isTriggered('right')) {
        ckMode.selectNo_Down();
    }
    if(Input.isTriggered('left')) {
        ckMode.selectNo_Up();
    }
    if(ckMode.IsSelecterMove) {
        SoundManager.playCursor();
        this.Menu_Dougu_Detail_YarimonSelectMove(ckMode);
    }
    if(Input.isTriggered('ok') || okFlg) {
        SoundManager.playOk();
        ckMode.parent.selectMon = ckMode.selecterNo;
        this.CngPhase_Menu_Dougu_DetailUsing(ckMode);
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        ckMode.parent.ModeCng(Menu_Dougu_Detail.Select);
        this.Menu_Dougu_Detail_YarimonSelect_Move_戻す();
    }
}
Game_Interpreter.prototype.Menu_Dougu_Detail_YarimonSelectMove = function (ckMode) {
    for (let i = 0; i <= 3 - 1; i++) {
        let setX = BPs._x + 13 + (144 * i);
        let setY = BPs._y + 490;
        if(ckMode.selecterNo == i) setY -= 25;
        this.YarimonWakuMove(PN_dmTikeBar + (i * dmBtnPicCnt)  , setX , setY , 5);
    }
}
Game_Interpreter.prototype.Menu_Dougu_Detail_YarimonSelect_Move_戻す = function () {
    for (let i = 0; i <= 3 - 1; i++) {
        let setX = BPs._x + 13 + (144 * i);
        let setY = BPs._y + 490;
        this.YarimonWakuMove(PN_dmTikeBar + (i * dmBtnPicCnt)  , setX , setY , 5);
    }
}
Game_Interpreter.prototype.Menu_Dougu_Detail_YesNoUpdate = function (ckMode) {
}
let DouguUseNo = -1;
Game_Interpreter.prototype.CngPhase_Menu_Dougu_DetailUsing = function (ckMode) {
    ckMode.parent.selectMonData = null;
    if (battle_Class.isBattle) {
        ckMode.parent.selectMonData = battle_Class.plYarimons[ckMode.selecterNo];
        DouguUseNo = ckMode.selecterNo;
    } else {
        ckMode.parent.selectMonData = $gameSystem.Player.syojiTikemon[ckMode.selecterNo];
        DouguUseNo = ckMode.selecterNo;
    }
    ckMode.parent.ModeCng(Menu_Dougu_Detail.Using);
}
let BtlDouguKoukaStr = "";
let BtlUseDouguData = [];
let ItemUseTextArr = [];
Game_Interpreter.prototype.Menu_Dougu_Detail_UsingUpdate = function (ckMode) {
    BtlUseDouguData = [];
    ItemUseTextArr = [];
    let useFlg = false;
    let syohiFlg = false
    let getFlg = false;
    let talkStr = "";
    let useSe = "";
    BtlDouguKoukaStr = "";
    let effectPtcStr = "";
    let NotUseText = NLngStrGet("使っても効果が無いよ");
    ckMode.selectItem.data.exSkillList.forEach( exSkill => {
        switch (exSkill.bunrui) {
            case DouguKouka._HP回復:
                let _MHP = MHP(ckMode.selectMonData);
                let _回復量 = Number(exSkill.data2);
                if (!useFlg) {
                    useSe = "_zItemUse";
                    if (_回復量 == -2) {
                        if (ckMode.selectMonData.ExPowerFlg) {
                            talkStr = NLngStrGet("既に潜在能力は引き出されている");
                            break;
                        }
                        talkStr = NLngStrGet("<value>の潜在能力が引き出された！").replace("<value>" , ckMode.selectMonData.YarimonData.name);
                        ckMode.selectMonData.ExPowerFlg = true;
                        useFlg = true;
                        syohiFlg = true;
                        break;
                    }
                    if (_回復量 == -1) {
                        if (ckMode.selectMonData.btlCount >= 999) {
                            talkStr = NLngStrGet("既にスターランクがマックスだよ！");
                            useFlg = false;
                            syohiFlg = useFlg;
                            break;
                        } else {
                            effectPtcStr = "Effect_Kaihuku";
                            talkStr = NLngStrGet("スターランクがマックスになった！");
                            ckMode.selectMonData.btlCount = 999;
                            useFlg = true;
                            syohiFlg = true;
                            break;
                        }
                    }
                    useFlg = (ckMode.selectMonData.hp < _MHP);
                    if (ckMode.selectMonData.hp <= 0 && _回復量 != 1) useFlg = false;
                    syohiFlg = useFlg;
                }
                if (useFlg) {
                    if (ckMode.selectMonData.Ijos.indexOf("呪い") != -1) {
                        NotUseText += NLngStrGet("（呪いでHPが回復できない）")
                        useFlg = false;
                    } else {
                        let recHp = Number(exSkill.data2);
                        if (recHp >= 999) recHp = 9999;
                        ckMode.selectMonData.hp += recHp;
                        effectPtcStr = "Effect_Kaihuku";
                        if (ckMode.selectMonData.hp > _MHP) {
                            ckMode.selectMonData.hp = _MHP;
                        }
                    }
                }
                break;
            case DouguKouka._状態異常回復:
                for (let i = 0; i <= ckMode.selectMonData.Ijos.length - 1; i++) {
                    if　(ckMode.selectMonData.Ijos[i] == exSkill.data1 || exSkill.data1 == "全て") {
                        if　(!useFlg) {
                            useFlg = true;
                            syohiFlg = useFlg;
                            ItemUseTextArr.push(NLngStrGet("状態異常が治った"));
                            useSe = "_zItemUse";
                            effectPtcStr = "Effect_Kaihuku";
                        }
                        ckMode.selectMonData.Ijos.splice(i , 1);
                        i--;
                    }
                }
                break;
            case DouguKouka._能力変化:
                useFlg = true;
                syohiFlg = useFlg;
                BtlUseDouguData.push(exSkill);
                break;
            case DouguKouka._ゲット処理:
                if (battle_Class.isBattle) {
                    if(battle_Class.isYasei) {
                        if($gameSwitches.value(SW_Tr演出OFF)) {
                            talkStr = NLngStrGet("このヤリモンはゲットできない…！");
                        } else {
                            if(battle_Class.emYarimons[0].Ijos.indexOf(Ijo._Get) != -1) {
                                talkStr = NLngStrGet("既に相手はゲットできる状態だ！");
                            } else {
                                getFlg = true;
                                useFlg = true;
                                syohiFlg = true;
                            }
                        }
                    } else {
                        BtlMenuTalkFlg = true;
                        talkStr = NLngStrGet("野生のヤリモンしかゲットできないぞ！");
                    }
                }
                break;
            case DouguKouka._野生戦闘回避:
                if($gameSystem._野生回避Cnt > 0) {
                    talkStr = NLngStrGet("前の効果が残っているよ");
                } else {
                    talkStr = NLngStrGet("野生戦闘を") + NLngStrGet("<value>回　回避できるぞ！" , [exSkill.data2]);
                    $gameSystem._野生回避Cnt = Number(exSkill.data2);
                    useFlg = true;
                    syohiFlg = true;
                }
                break;
            case DouguKouka._コモンイベント:
                useFlg = true;
                break;
        }
    });
    if (useFlg) {
        if (syohiFlg) {
            btlItemSyohiArr.push(ckMode.selectItem.id + 1);
            $gameParty.loseItem($dataItems[ckMode.selectItem.id + 1], 1);
            ckMode.selectItem.count--;
            UseDouguTxt = $N_Yarimon_DB.douguDatas[ckMode.selectItem.id].name;
            this.Menu_DouguDraw(ckMode.parent);
        }
        if(useSe != "") this.PlaySe(useSe);
        if(effectPtcStr != "") {
            let _psX = 132;
            let _psY = 248 + 180 * DouguUseNo;
            this.PlayPtcSc(effectPtcStr,_psX,_psY);
        }
    }
    if (battle_Class.isBattle && useFlg) {
        this.BtlL1PicDel();
        this.BtlL2PicDel();
        this.DelSpriteSpan(PN_dmBase , PN_dmTikeBar + 8 * 3);
        this.DelSprite(PN_BtlSelecter); 
        _btlMode = ckMode.parent.parent.parent;
        _btlMode.ModeCng(Battle_Class.Btl_Battle);
        if (getFlg) {
            battle_Class.mode.Setting(ExWazaid.GetSet);
        } else {
            if(BtlUseDouguData.length > 0) {
                battle_Class.mode.Setting(ExWazaid.UseDougu);
            } else {
                battle_Class.mode.Setting(ExWazaid.NotMove); 
            }
        }
        _btlMode.mode.PLMovedFlg = true; 
    } else {
        if(!useFlg) {
            menuViewFlame = 10; 
            if (talkStr == "") talkStr = NotUseText;
            menuTextArr.push(talkStr);
        } else {
            if(talkStr != "") {
                menuViewFlame = 10; 
                menuTextArr.push(talkStr);
            }
        }
        ckMode.ModeCng(Menu_Dougu_Detail.Select);
    }
}
let UseDouguTxt = "";
