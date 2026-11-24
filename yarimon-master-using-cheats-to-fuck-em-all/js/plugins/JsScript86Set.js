let PN_spBase = 112;
let PN_spGoldTxt = PN_spBase + 1;
let PN_spStName = PN_spGoldTxt + 1;
let PN_spStSetu = PN_spStName + 1;
let PN_spStCnt = PN_spStSetu + 1;
let PN_spBtn = PN_spStCnt + 1;
const spBtn_PicCnt = 5;
let PN_spBackBtn = PN_spBtn + (7 * spBtn_PicCnt);
let PN_spRedSel = PN_spBackBtn + 2;
const MSpPath = "pictures/Shop/";
let N_ShopArr = [];
Game_Interpreter.prototype.command302 = function() {
    N_ShopArr = [];
    if (!$gameParty.inBattle()) {
        var goods = [this._params];
        while (this.nextEventCode() === 605) {
            this._index++;
            goods.push(this.currentCommand().parameters);
        }
        goods.forEach( _prm => {
            N_ShopArr.push(_prm[1]);
        });
    }
    return true;
};
let ShopSave_Initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    ShopSave_Initialize.call(this);
    this.ImpBuyIds = []; 
};
let shopSelectNo = 0;
let befshopSelectNo = 0;
let shopSelWaitFlame = 0;
Game_Interpreter.prototype.ShopStart = function() {
    shopSelectNo = befshopSelectNo = 0; shopSelWaitFlame = 5;
    shopBackSelFlg = false;
    this.ShopDraw();
    this.ShopSetuStr();
}
Game_Interpreter.prototype.ShopDraw = function() {
    if ($gameSystem.ImpBuyIds == undefined) $gameSystem.ImpBuyIds = [];
    for (let i = 0; i <= N_ShopArr.length - 1; i++) {
        if ($gameSystem.ImpBuyIds.indexOf(N_ShopArr[i]) != -1) {
            N_ShopArr.splice(i , 1); i--;
        }
    }
    this.SetSprite( PN_spBase , MSpPath + "PN_spBase" , BPs._x , BPs._y);
    this.SpriteStrR(PN_spGoldTxt , ColBlackWhtStr + $gameParty._gold , 22 , BPs._x + 776 , BPs._y + 439);
    let iDrawCnt = 0;
    for (let i = 0; i <= 5; i++) {
        let PicNo_Base = PN_spBtn + (spBtn_PicCnt * i);
        if (N_ShopArr.length <= i) {
            this.DelSpriteSpan(PicNo_Base + 0 , PicNo_Base + 4);
            continue;
        }
        let _itemData = $N_Yarimon_DB.douguDatas[N_ShopArr[i] - 1];
        let _setX = BPs._x + 26;
        let _setY = BPs._y + 76 + (68 * i)
        this.SetSprite(PicNo_Base + 0 , MSpPath + "PN_spBtn" , _setX , _setY);
        this.SetSpriteC(PicNo_Base + 1 , mDougu_IconPath + _itemData.picPath , _setX + 12 , _setY + 25);
        let nameFontSize = 22;
        let setZureY = 0;
        if(LngMode == "en") {
            if (_itemData.name.length > 15) {
                nameFontSize = 17; setZureY = 3;
            }
        }
        this.SpriteStr(PicNo_Base + 2 , ColBlackWhtStr + _itemData.name , nameFontSize , _setX + 34 , _setY + 10 + setZureY);
        this.SpriteStrR(PicNo_Base + 3 , ColBlackWhtStr + _itemData.price + NLngStrGet(" 円")  , 22 ,
            _setX + 338 , _setY + 10);
        let ItemCnt = $gameParty.numItems($dataItems[N_ShopArr[i]]);
        this.SpriteStrC(PicNo_Base + 4 , ColBlackWhtStr + " " + ItemCnt + " " , 24 , _setX + 372 , _setY + 38);
    }
    if (N_ShopArr.length == 0) shopBackSelFlg = true;
    this.SetSprite(PN_spBackBtn + 0 , MSpPath + "PN_spBackBtn" , BPs._x + 26 , BPs._y + 543)
    this.SpriteStr(PN_spBackBtn + 1 , ColBlackWhtStr + NLngStrGet("戻る") , 28 , BPs._x + 105 , BPs._y + 555);
}
Game_Interpreter.prototype.ShopSetuStr = function() {
    if (shopBackSelFlg) {
        this.DelSpriteSpan(PN_spStName , PN_spStCnt);
    } else {
        let _selItemData = $N_Yarimon_DB.douguDatas[N_ShopArr[shopSelectNo] - 1];
        if (_selItemData == undefined) {
            shopSelectNo = 0;
            this.DelSpriteSpan(PN_spStName , PN_spStCnt);
            return;
        }
        this.SpriteStr(PN_spStName , ColBlackWhtStr + _selItemData.name , 22 , BPs._x + 460 , BPs._y + 495);
        let setTxtSize = 22;
        if (LngMode == "en") {
            setTxtSize = 18;
        }
        this.SpriteStr(PN_spStSetu , ColBlackWhtStr + _selItemData.setu , setTxtSize ,
            BPs._x + 460 , BPs._y + 495 + 50);
        let ItemCnt2 = $gameParty.numItems($dataItems[N_ShopArr[shopSelectNo]]);
        this.SpriteStrC(PN_spStCnt , ColBlackWhtStr + " " + ItemCnt2 + " " , 22 ,
            BPs._x + 460 + 325 , BPs._y + 512);
    }
}
let shopBackSelFlg = false;
Game_Interpreter.prototype.ShopUpdate = function() {
    let _setX = BPs._x + 26;　
    let _setY = BPs._y + 76 + (68 * shopSelectNo);
    if (shopBackSelFlg) {
        this.SetSprite(PN_spRedSel , MSpPath + "PN_spRedSel_2" , 23 + BPs._x , 540 + BPs._y);
    } else {
        this.SetSprite(PN_spRedSel , MSpPath + "PN_spRedSel" , _setX - 4 , _setY - 3);
    }
    if(shopSelWaitFlame > 0) {
        shopSelWaitFlame--;
        return true; 
    }
    let mvFlg = false;
    let _okFlg = false;
    let _ckPicArr = [];
    for (let i = 0; i <= 7 - 1; i++) {
        _ckPicArr.push(PN_spBtn + (i * spBtn_PicCnt));
    }
    let _ckPicNo = overPointerSpCkArr_GetNo(_ckPicArr);
    if (_ckPicNo != -1) {
        shopSelectNo = _ckPicNo;
        mvFlg = (befshopSelectNo != shopSelectNo)
        befshopSelectNo = shopSelectNo;
        _okFlg = TouchInput.isTriggered();
    }
    if (overPointerSpCk(PN_spBackBtn)) {
        shopSelectNo = N_ShopArr.length
        mvFlg = (befshopSelectNo != shopSelectNo)
        befshopSelectNo = shopSelectNo;
        _okFlg = TouchInput.isTriggered();
    }
    if(Input.isTriggered('up')) {
        shopSelectNo--;
        mvFlg = true;
    }
    if(Input.isTriggered('down')) {
        shopSelectNo++;
        mvFlg = true;
    }
    if (N_ShopArr.length == 0) shopBackSelFlg = true;
    let _cancelFlg = false;
    if (Input.isTriggered('ok') || _okFlg) {
        if (shopBackSelFlg) {
            _cancelFlg = true;
            SoundManager.playCancel();
        } else {
            let _ckItem = $N_Yarimon_DB.douguDatas[N_ShopArr[shopSelectNo] - 1];
            if ($gameParty._gold >= _ckItem.price) {
                $gameParty._gold -= _ckItem.price;
                $gameParty.gainItem($dataItems[N_ShopArr[shopSelectNo]], 1);
                if (_ckItem.bunrui == "大切") {
                    befshopSelectNo = 0;
                    $gameSystem.ImpBuyIds.push(N_ShopArr[shopSelectNo]);
                }
                this.ShopDraw();
                this.ShopSetuStr();
                SoundManager.playShop();
            } else {
                SoundManager.playCancel();
            }
        }
    }
    if (mvFlg) {
        SoundManager.playCursor();
        shopBackSelFlg = false;
        if (shopSelectNo < 0) {
            shopBackSelFlg = true;
            shopSelectNo = N_ShopArr.length;
        }
        if (shopSelectNo >= N_ShopArr.length) {
            shopBackSelFlg = true;
        }
        if (shopSelectNo >= N_ShopArr.length + 1) {
            shopBackSelFlg = false;
            shopSelectNo = 0;
        }
        this.ShopSetuStr();
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled() || _cancelFlg) {
        SoundManager.playCancel();
        this.DelSpriteSpan(PN_spBase , PN_spRedSel);
        menuOffFlame = 5;
        return false;
    }
    return true; 
}
