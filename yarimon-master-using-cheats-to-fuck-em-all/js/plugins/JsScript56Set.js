const PN_DsBase = 560;  
const PN_DsPage = PN_DsBase + 1;
const PN_DsBtn = PN_DsPage + 1;
const PN_DsEnd = PN_DsBtn + 2;
const PN_DsPicPath = "pictures/DojinShop/";
const VN_同人BookNo = 303;
let _DojinFol = "";
let _DojinPageNo = 1;
class DShopData {
    constructor(No , Cnt){
        this.No = No;
        this.Cnt = Cnt;
    }
}
let DShopDatas = [];
DShopDatas.push(new DShopData(1 , 9));
DShopDatas.push(new DShopData(2 , 9));
DShopDatas.push(new DShopData(3 , 9));
DShopDatas.push(new DShopData(4 , 9));
DShopDatas.push(new DShopData(5 , 9));
DShopDatas.push(new DShopData(6 , 9));
DShopDatas.push(new DShopData(7 , 9));
DShopDatas.push(new DShopData(8 , 9));
DShopDatas.push(new DShopData(9 , 9));
DShopDatas.push(new DShopData(10 , 9));
DShopDatas.push(new DShopData(11 , 9));
DShopDatas.push(new DShopData(12 , 9));
let DShopSelectData = null;
Game_Interpreter.prototype.DShop_Draw = function () {
    DShopSelectData = null;
    for (let i = 0; i <= DShopDatas.length - 1; i++) {
        if(DShopDatas[i].No == $gameVariables.value(VN_同人BookNo)) {
            DShopSelectData = DShopDatas[i];
            break;
        }
    }
    if(DShopSelectData == null) return;
    _DojinPageNo = 1;
    this.SetSprite( PN_DsBase ,　PN_DsPicPath + "PN_DsBase" , 0 , 0);
    _DojinFol = "Book_" + $gameVariables.value(VN_同人BookNo);
    this.SetSprite( PN_DsPage ,　PN_DsPicPath + _DojinFol + "/" + _DojinPageNo , 464 , 9);
    this.SetSpriteC( PN_DsBtn + 0 ,　PN_DsPicPath + "PN_DsBtnL" , 372 , 388);
    this.SetSpriteC( PN_DsBtn + 1 ,　PN_DsPicPath + "PN_DsBtnR" , 1114 , 388);
}
Game_Interpreter.prototype.DShop_Close = function () {
    this.DelSpriteSpan(PN_DsBase , PN_DsEnd);
}
Game_Interpreter.prototype.DShop_Update = function () {
    if(DShopSelectData == null) return false; 
    let _closeFlg = false;
    let DShop_CMap = [
        [0,0,453,810],
        [988,0,453,810],
    ];
    let _cmbNo = overSpriteClickable( PN_DsBase , DShop_CMap);
    this.SetSpriteC( PN_DsBtn + 0 ,　PN_DsPicPath + "PN_DsBtnL_d" , 372 , 388 , 180);
    this.SetSpriteC( PN_DsBtn + 1 ,　PN_DsPicPath + "PN_DsBtnR_d" , 1114 , 388 , 180);
    if(overPointerSpCk(PN_DsBtn + 0) || _cmbNo == 0 || Input.isPressed('left')) {
        this.SetSpriteC( PN_DsBtn + 0 ,　PN_DsPicPath + "PN_DsBtnL" , 372 , 388 , 255 , 105 , 105);
    }
    if(overPointerSpCk(PN_DsBtn + 1) || _cmbNo == 1 || Input.isPressed('right')) {
        this.SetSpriteC(PN_DsBtn + 1 ,　PN_DsPicPath + "PN_DsBtnR" , 1114 , 388 , 255 , 105 , 105);
    }
    this.DelSprite(PN_DsEnd);
    if(_DojinPageNo == 1) this.SetSpriteC( PN_DsEnd ,　PN_DsPicPath + "PN_DsEnd" , 372 , 388)
    if(_DojinPageNo == DShopSelectData.Cnt) this.SetSpriteC(PN_DsEnd,　PN_DsPicPath + "PN_DsEnd" , 1114 , 388);
    if(Input.isTriggered('left') || (_cmbNo == 0 && TouchInput.isTriggered())) {
        this.PlaySe("Book_Page");
        _DojinPageNo--;
        if (_DojinPageNo == 0) {
            _closeFlg = true;
        } else {
            this.SetSprite( PN_DsPage ,　PN_DsPicPath + _DojinFol + "/" + _DojinPageNo , 464 - 20 , 9);
            this.MoveSpriteAdd(PN_DsPage , 20 , 0 , 10)
        }
    }
    if(Input.isTriggered('right') || (_cmbNo == 1 && TouchInput.isTriggered())) {
        this.PlaySe("Book_Page");
        _DojinPageNo++;
        if (_DojinPageNo > DShopSelectData.Cnt) {
            _closeFlg = true;
        } else {
            this.SetSprite( PN_DsPage ,　PN_DsPicPath + _DojinFol + "/" + _DojinPageNo , 464 - 20 , 9);
            this.MoveSpriteAdd(PN_DsPage , 20 , 0 , 10)
        }
    }
    if (Input.isTriggered('menu') || TouchInput.isCancelled() || _closeFlg) {
        this.DShop_Close();
        return false;
    }
    return true; 
}
