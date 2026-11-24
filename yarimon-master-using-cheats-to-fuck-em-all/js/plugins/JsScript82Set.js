const PcInputPicPath = "pictures/PcInput/";
const PN_PcInputBack = 560;
const PN_PcInputBtn = PN_PcInputBack + 1;
const PN_PcInputBtnE = PN_PcInputBtn + 10;
const PN_PcInputBtnC = PN_PcInputBtnE + 1;
const PN_PcInputBtnB = PN_PcInputBtnC + 1;
const PN_PcInputTxt = PN_PcInputBtnB + 1;
const VN_PcInput = 385;
let PcInputSelectX = 1;
let PcInputSelectY = 1;
let PcInputSelectPicArr = [
    [PN_PcInputBtn + 1 , PN_PcInputBtn + 2 , PN_PcInputBtn + 3 , PN_PcInputBtnB ],
    [PN_PcInputBtn + 4 , PN_PcInputBtn + 5 , PN_PcInputBtn + 6 ],
    [PN_PcInputBtn + 7 , PN_PcInputBtn + 8 , PN_PcInputBtn + 9  , PN_PcInputBtnE],
    [PN_PcInputBtn + 0 , PN_PcInputBtn + 0 , PN_PcInputBtnC , PN_PcInputBtnE ]
]
let PcInputOkValueArr = [
    [7 , 8 , 9 , "" ],
    [4 , 5 , 6 ],
    [1 , 2 , 3  , ""],
    [0, 0 , "" , "" ]
]
var PcInputValue = "";
var PcInputPicArr = [];
Game_Interpreter.prototype.PcInputStart = function () {
    PcInputValue = "";
    PcInputSelectX = 1;　PcInputSelectY = 1;
    PcInputPicArr = [];
    this.SetSpriteFIn( PN_PcInputBack , PcInputPicPath + "PN_PcInputBack" , 0 , 0 , 0 , 0 , 15);
    for (let i = 0; i < 9; i++) {
        var xPos = (i % 3) * 96 + 527;
        var yPos = Math.floor(i / 3) * 96 + 281;
        var btnNo = 0;
        if (i == 0) btnNo = 7;
        if (i == 1) btnNo = 8;
        if (i == 2) btnNo = 9;
        if (i == 3) btnNo = 4;
        if (i == 4) btnNo = 5;
        if (i == 5) btnNo = 6;
        if (i == 6) btnNo = 1;
        if (i == 7) btnNo = 2;
        if (i == 8) btnNo = 3;
        this.SetSpriteFIn( PN_PcInputBtn + i + 1 , PcInputPicPath + "PN_PcInputBtn" + btnNo , xPos , yPos , 0 , 0 , 15);
        PcInputPicArr.push(PN_PcInputBtn + i + 1);
    }
    this.SetSpriteFIn( PN_PcInputBtn + 0 , PcInputPicPath + "PN_PcInputBtn0" , 527 , 3 * 96 + 281 , 0 , 0 , 15);
    this.SetSpriteFIn( PN_PcInputBtnB , PcInputPicPath + "PN_PcInputBtnB" , 3 * 96 + 527 , 281 , 0 , 0 , 15);
    this.SetSpriteFIn( PN_PcInputBtnE , PcInputPicPath + "PN_PcInputBtnE" , 3 * 96 + 527 , 2 * 96 + 281 , 0 , 0 , 15);
    this.SetSpriteFIn( PN_PcInputBtnC , PcInputPicPath + "PN_PcInputBtnC" ,  2  * 96 + 527 , 3 * 96 + 281, 0 , 0 , 15);
    PcInputPicArr.push(PN_PcInputBtn + 0);
    PcInputPicArr.push(PN_PcInputBtnB);
    PcInputPicArr.push(PN_PcInputBtnE);
    PcInputPicArr.push(PN_PcInputBtnC);
}
Game_Interpreter.prototype.PcInputUpdate = function () {
    menuOffFlame = 5;
    var setTxt = PcInputValue;
    if (PcInputValue.length < 6) setTxt += "_";
    this.SpriteStrC( PN_PcInputTxt , setTxt , 52 , 710 , 212);
    this.SpriteCngColorArr( PcInputPicArr);
    var ckPicNo = overPointerSpCkArr(PcInputPicArr);
    var befNo = PcInputSelectPicArr[PcInputSelectY][PcInputSelectX];
    if (Input.isTriggered('up')) {
        if (PcInputSelectY > 0) {
            PcInputSelectY--;
            let LoopOkFlg = PcInputSelectPicArr[PcInputSelectY][PcInputSelectX] == undefined ||
                befNo == PcInputSelectPicArr[PcInputSelectY][PcInputSelectX];
            while(PcInputSelectY > 0 && LoopOkFlg){
                PcInputSelectY--;
            }
        }
    }
    if (Input.isTriggered('down')) {
        if (PcInputSelectY < PcInputSelectPicArr.length - 1) {
            PcInputSelectY++;
            let LoopOkFlg = PcInputSelectPicArr[PcInputSelectY][PcInputSelectX] == undefined ||
                befNo == PcInputSelectPicArr[PcInputSelectY][PcInputSelectX];
            while (PcInputSelectY < PcInputSelectPicArr.length - 1 && LoopOkFlg) {
                PcInputSelectY++;
            }
        }
    }
    if (Input.isTriggered('left')) {
        if (PcInputSelectX > 0) {
            PcInputSelectX--;
            while(PcInputSelectX > 0 && befNo == PcInputSelectPicArr[PcInputSelectY][PcInputSelectX]){
                PcInputSelectX--;
            }
        }
    }
    if (Input.isTriggered('right')) {
        if (PcInputSelectX < PcInputSelectPicArr[PcInputSelectY].length - 1) {
            PcInputSelectX++;
            while (PcInputSelectX < PcInputSelectPicArr[PcInputSelectY].length - 1 && befNo == PcInputSelectPicArr[PcInputSelectY][PcInputSelectX]) {
                PcInputSelectX++;
            }
        }
    }
    let okFlg = false;
    if (Input.isTriggered('ok')) okFlg = true;
    if (ckPicNo != -1) {
        if (TouchInput.isTriggered()) okFlg = true;
        switch (ckPicNo) {
            case PN_PcInputBtnE:    
                PcInputSelectX = 3; PcInputSelectY = 2;
                break;
            case PN_PcInputBtnB:    
                PcInputSelectX = 3; PcInputSelectY = 0;
                break;
            case PN_PcInputBtnC:    
                PcInputSelectX = 2; PcInputSelectY = 3;
                break;
            default:    
                var btnNo = ckPicNo - PN_PcInputBtn;
                if (btnNo == 0) { PcInputSelectX = 0; PcInputSelectY = 3; }
                if (btnNo == 7) { PcInputSelectX = 0; PcInputSelectY = 2; }
                if (btnNo == 8) { PcInputSelectX = 1; PcInputSelectY = 2; }
                if (btnNo == 9) { PcInputSelectX = 2; PcInputSelectY = 2; }
                if (btnNo == 4) { PcInputSelectX = 0; PcInputSelectY = 1; }
                if (btnNo == 5) { PcInputSelectX = 1; PcInputSelectY = 1; }
                if (btnNo == 6) { PcInputSelectX = 2; PcInputSelectY = 1; }
                if (btnNo == 1) { PcInputSelectX = 0; PcInputSelectY = 0; }
                if (btnNo == 2) { PcInputSelectX = 1; PcInputSelectY = 0; }
                if (btnNo == 3) { PcInputSelectX = 2; PcInputSelectY = 0; }
                break;
        }
    }
    if (TouchInput.isCancelled() || Input.isTriggered('menu')) {
        if (PcInputValue == "") {
            return false;
        }
        PcInputValue = PcInputValue.slice(0, -1);
    }
    if (okFlg) {
        var okValue = PcInputSelectPicArr[PcInputSelectY][PcInputSelectX];
        switch (okValue) {
            case PN_PcInputBtnE:    
                this.PlaySe("_Kettei");
                $gameVariables.setValue(VN_PcInput , Number(PcInputValue));
                return false; 
            case PN_PcInputBtnB:    
                PcInputValue = PcInputValue.slice(0, -1);
                this.PlaySe("_Select_Card");
                break;
            case PN_PcInputBtnC:    
                PcInputValue = "";
                this.PlaySe("_Select_Card");
                break;
            default:    
                this.PlaySe("_Cancel");
                if (PcInputValue.length < 6)
                    PcInputValue += PcInputOkValueArr[PcInputSelectY][PcInputSelectX];
                break;
        }
    }
    this.SpriteCngColor( PcInputSelectPicArr[PcInputSelectY][PcInputSelectX] , [90,90,90,0]);
    return true; 
}
Game_Interpreter.prototype.PcInputEnd = function () {
    this.DelSpriteSpan(PN_PcInputBack , PN_PcInputTxt);
}
