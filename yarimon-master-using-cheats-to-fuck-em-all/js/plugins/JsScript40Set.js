/*:
 * @plugindesc 
 * @author ぬぷ竜
 */
Game_Interpreter.prototype.PreLoadArr = function (_SetArr){
    for (let i = 0; i <= _SetArr.length - 1; i++){
        ImageManager.loadBitmap("", _SetArr[i], null, false);
    }
}
Game_Interpreter.prototype.PreLoadArr_Wait = function (_SetArr , _flame){
    _flame = typeof _flame !== 'undefined' ? _flame : 20;
    _ImgLoadArr = _SetArr;
    _ImgLoad_Waitflame = _flame;
}
Game_Interpreter.prototype.PreLoadArr_WaitPush = function (_SetArr , _flame){
    _flame = typeof _flame !== 'undefined' ? _flame : 10;
    _ImgLoad_Waitflame = _flame;
    for (let i = 0; i <= _SetArr.length - 1; i++) {
        _ImgLoadArr.push(_SetArr[i]);
    }
}
let _ImgLoadArr = []; 
let _ImgLoad_flame = 0;
let _ImgLoad_Waitflame = 0;
let N_Input_Stop = 0; 
let _ImgBackLoad = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    _ImgBackLoad.call(this);
    if(_ImgLoadArr.length > 0 && _ImgLoad_flame == 0){
        let LoadImg = _ImgLoadArr[0];
        _ImgLoadArr.shift();
        _ImgLoad_flame = _ImgLoad_Waitflame;
        ImageManager.loadBitmap("", LoadImg, null, false);
        console.log("ImgLoading::" + LoadImg);
    }
    if(_ImgLoad_flame > 0) _ImgLoad_flame--;
    if(N_Input_Stop > 0) N_Input_Stop--;
}
Sprite_Picture.prototype.updateOrigin = function () {
    let picture = this.picture();
    switch (picture.origin()) {
        case 0: 
            this.anchor.x = 0;
            this.anchor.y = 0;
            break;
        case 1: 
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            break;
        case 2: 
            this.anchor.x = 1;
            this.anchor.y = 0;
            break;
        case 3: 
            this.anchor.x = 0;
            this.anchor.y = 1;
            break;
        case 4: 
            this.anchor.x = 0.5;
            this.anchor.y = 1;
            break;
    }
};
let ViewPicArr = []; 
let ViewPicReset = function () {
    ViewPicArr = []; 
};
let ViewPicAdd = function (_PicNo) {
    if (ViewPicArr.indexOf(_PicNo) == -1) { 
        ViewPicArr.push(_PicNo);
    }
};
let ViewPicDel = function (_PicNo) {
    let _index = ViewPicArr.indexOf(_PicNo);
    if (_index != -1) { 
        ViewPicArr.splice(_index, 1);
    }
};
Game_Interpreter.prototype.ViewPicArrFadeIn = function () {
    for (let i = 0; i <= ViewPicArr.length - 1; i++) {
        this.MovePict(ViewPicArr[i], true, true, 10);
    }
}
let NP_原点 = 0; 
let _NP_ImageCacheArr = [];
let _NPicZureX = 0; 
let _NPicZureY = 0; 
Game_Interpreter.prototype.SetPict = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) { SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend); }
let SetPict = function (PicNo, FileName, setx, sety, opi, mx, my, _blend){
    setx = typeof setx !== 'undefined' ? setx : 0;
    sety = typeof sety !== 'undefined' ? sety : 0;
    opi = typeof opi !== 'undefined' ? opi : 255;
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    _blend = typeof _blend !== 'undefined' ? _blend : 0;
    setx += _NPicZureX; sety += _NPicZureY;
    _NP_ImageCacheArr.push(FileName);
    $gameScreen.showPicture(PicNo, FileName, NP_原点, setx, sety, mx, my, opi, _blend);
    ViewPicAdd(PicNo);
    if (NP_原点 == 0) DebugPicNo(PicNo, "SetPict");
    NP_原点 = 0; 
}
Game_Interpreter.prototype.SetPictC = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    SetPictC(PicNo, FileName, setx, sety, opi, mx, my, _blend);}
let SetPictC = function (PicNo, FileName, setx, sety, opi, mx, my, _blend){
    NP_原点 = 1;
    SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend);
    DebugPicNo(PicNo, "SetPictC");
}
Game_Interpreter.prototype.SetPictR = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    SetPictR(PicNo, FileName, setx, sety, opi, mx, my, _blend); }
let SetPictR = function (PicNo, FileName, setx, sety, opi, mx, my, _blend){
    NP_原点 = 2;
    SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend);
    DebugPicNo(PicNo, "SetPictR");
}
Game_Interpreter.prototype.SetPictB = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    SetPictB(PicNo, FileName, setx, sety, opi, mx, my, _blend); }
let SetPictB = function (PicNo, FileName, setx, sety, opi, mx, my, _blend){
    NP_原点 = 3;
    SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend);
    DebugPicNo(PicNo, "SetPictB");
}
Game_Interpreter.prototype.SetPictBC = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    SetPictBC(PicNo, FileName, setx, sety, opi, mx, my, _blend); }
let SetPictBC = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    NP_原点 = 4;
    SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend);
    DebugPicNo(PicNo, "SetPictBC");
}
let _ImLimitOpen = false;
ImageCache.limit = 1000 * 1000 * 1000; 
ImageCache.prototype._truncateCache = function(){
    let items = this._items;
    let sizeLeft = ImageCache.limit;
    if(_ImLimitOpen){
        sizeLeft = 10 * 1000 * 1000; 
    }
    Object.keys(items).map(function(key){
        return items[key];
    }).sort(function(a, b){
        return b.touch - a.touch;
    }).forEach(function(item){
        if(sizeLeft > 0 || this._mustBeHeld(item)){
            let bitmap = item.bitmap;
            sizeLeft -= bitmap.width * bitmap.height;
        }else{
            console.log("ImageCache.limit");
            delete items[item.key];
        }
    }.bind(this));
};
Game_Interpreter.prototype.SetPictFIn = function (PicNo, FileName, setx, sety, zureX, zureY, time, _opi, _mx, _my) { SetPictFIn(PicNo, FileName, setx, sety, zureX, zureY, time, _opi, _mx, _my); }
let SetPictFIn = function (PicNo, FileName, setx, sety, zureX, zureY, time, _opi, _mx, _my) {
    _opi = typeof _opi !== 'undefined' ? _opi : 255;
    _mx = typeof _mx !== 'undefined' ? _mx : 100;
    _my = typeof _my !== 'undefined' ? _my : 100;
    SetPict(PicNo, FileName, setx + zureX, sety + zureY, 0, _mx, _my);
    MovePict(PicNo, setx, sety, time, _opi , true , true);
}
Game_Interpreter.prototype.SetPictFInC = function (PicNo, FileName, setx, sety, zureX, zureY, time, _opi, _mx, _my) { SetPictFInC(PicNo, FileName, setx, sety, zureX, zureY, time, _opi, _mx, _my); }
let SetPictFInC = function (PicNo, FileName, setx, sety, zureX, zureY, time, _opi, _mx, _my){
    _opi = typeof _opi !== 'undefined' ? _opi : 255;
    _mx = typeof _mx !== 'undefined' ? _mx : 100;
    _my = typeof _my !== 'undefined' ? _my : 100;
    SetPictC(PicNo, FileName, setx + zureX, sety + zureY, 0, _mx, _my);
    MovePict(PicNo, setx, sety, time, _opi, true, true);
}
Game_Interpreter.prototype.CngPict = function (PicNo, FileName) { CngPict(PicNo, FileName); }
let CngPict = function (PicNo, FileName) {
    if ($gameScreen.picture(PicNo) != undefined) {
        $gameScreen.picture(PicNo)._name = FileName;
    }
    DebugPicNo(PicNo, "CngPict");
}
//Pictureの移動 this.MovePict(ピクチャNo , 場所X, 場所Y , フレーム , 透明度 ,拡大X , 拡大Y)
Game_Interpreter.prototype.MovePict = function (PicNo, setx, sety, time, opi, mx, my) { MovePict(PicNo, setx, sety, time, opi, mx, my); }
let MovePict = function (PicNo, setx, sety, time, opi, mx, my) {
    opi = typeof opi !== 'undefined' ? opi : 255;
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    if ($gameScreen.picture(PicNo) == undefined) return;
    if (setx == true) setx = $gameScreen.picture(PicNo)._x;
    if (sety == true) sety = $gameScreen.picture(PicNo)._y;
    if (opi == true) opi = $gameScreen.picture(PicNo)._opacity;
    if (mx == true) mx = $gameScreen.picture(PicNo)._scaleX;
    if (my == true) my = $gameScreen.picture(PicNo)._scaleY;
    let _origin = $gameScreen.picture(PicNo)._origin; 
    let _blend = $gameScreen.picture(PicNo)._blendMode;
    EMoveSet(EasingStr);
    setx += _NPicZureX; sety += _NPicZureY;
    $gameScreen.movePicture(PicNo, _origin, setx, sety, mx, my, opi, _blend, time);
    DebugPicNo(PicNo, "MovePict");
}
Game_Interpreter.prototype.MovePictAdd = function (PicNo, addx, addy, time, opi) { MovePictAdd(PicNo, addx, addy, time, opi); }
let MovePictAdd = function  (PicNo, addx, addy, time, opi) {
    opi = typeof opi !== 'undefined' ? opi : 255;
    if ($gameScreen.picture(PicNo) == undefined) return;
    let setx = $gameScreen.picture(PicNo)._x; let sety = $gameScreen.picture(PicNo)._y;
    let mx = true; let my = true;
    if (addx != true) setx += addx;
    if (addy != true) sety += addy;
    if (opi == true) opi = $gameScreen.picture(PicNo)._opacity;
    if (mx == true) mx = $gameScreen.picture(PicNo)._scaleX;
    if (my == true) my = $gameScreen.picture(PicNo)._scaleY;
    let _origin = $gameScreen.picture(PicNo)._origin; 
    let _blend = $gameScreen.picture(PicNo)._blendMode;
    EMoveSet(EasingStr);
    setx += _NPicZureX; sety += _NPicZureY;
    $gameScreen.movePicture(PicNo, _origin, setx, sety, mx, my, opi, _blend, time);
    DebugPicNo(PicNo, "MovePict");
}
Game_Interpreter.prototype.AnglePict = function (PicNo, _Angle) { AnglePict(PicNo, _Angle); }
let AnglePict = function (PicNo, _Angle) {
    _Angle = typeof _Angle !== 'undefined' ? _Angle : 0;
    let picture = $gameScreen.picture(PicNo);
    if (picture) {
        picture.setAngleDirect(_Angle);
    }
    DebugPicNo(PicNo, "AnglePict");
}
Game_Picture.prototype.setAngleDirect = function (value) {
    this._rotationSpeed = 0;
    this._angle = value % 360;
};
Game_Interpreter.prototype.PicCngColor = function (PicNo, _ColArr, _timer) { PicCngColor(PicNo, _ColArr, _timer); }
let PicCngColor = function (PicNo, _ColArr, _timer) {
    _ColArr = typeof _ColArr !== 'undefined' ? _ColArr : [0, 0, 0, 0]; 
    _timer = typeof _timer !== 'undefined' ? _timer : 0;
    $gameScreen.tintPicture(PicNo, _ColArr, _timer);
    DebugPicNo(PicNo, "PicCngColor");
}
Game_Interpreter.prototype.PicCngColorArr = function (PicArr, _ColArr, _timer) { PicCngColorArr(PicArr, _ColArr, _timer); }
let PicCngColorArr = function (PicArr, _ColArr, _timer) {
    for (let i = 0; i <= PicArr.length - 1; i++) {
        PicCngColor(PicArr[i], _ColArr, _timer)
    }
}
Game_Interpreter.prototype.PicArSetOpacity = function (PicArr, SetOpacity) { PicArSetOpacity(PicArr, SetOpacity); }
let PicArSetOpacity = function (PicArr, SetOpacity) {
    for (let i = 0; i <= PicArr.length - 1; i++) {
        if ($gameScreen.picture(PicArr[i]) != undefined) {
            $gameScreen.picture(PicArr[i])._opacity = SetOpacity;
        }
    }
}
Game_Interpreter.prototype.DelPict = function (PicNo) { DelPict(PicNo); }
let DelPict = function (PicNo) {
    $gameScreen.erasePicture(PicNo);
    ViewPicDel( PicNo );
    DebugPicNo( PicNo , "DelPict");
}
Game_Interpreter.prototype.DelPictArr = function (DelArr) { DelPictArr(DelArr); }
let DelPictArr = function (DelArr) {
    for (let di = 0; di <= DelArr.length - 1; di++) {
        DelPict(DelArr[di]);
        DebugPicNo(DelArr[di], "DelPictArr");
    }
}
Game_Interpreter.prototype.DelPictSpan = function (_開始No , _終了No) { DelPictSpan(_開始No , _終了No); }
let DelPictSpan = function (_開始No , _終了No) {
    for (let i = _開始No; i <= _終了No; i++){
        DelPict(i);
    }
}
let NPic_FOutArr = [];
Game_Interpreter.prototype.FOutPict = function (_PicNo , _time) { FOutPict(_PicNo , _time) }
let FOutPict = function (_PicNo , _time) {
    _time = typeof _time !== 'undefined' ? _time : 15;
    MovePict(_PicNo , true , true , _time , 0 , true , true); 
    NPic_FOutArr.push([_PicNo , _time + 5]);
}
let _NPict_FOutUpdate = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    _NPict_FOutUpdate.call(this);
    for (let i = 0; i <= NPic_FOutArr.length - 1; i++) {
        let _ckObj = this.PicObjGet(NPic_FOutArr[i][0]);
        if(_ckObj == null) {
            NPic_FOutArr.splice(i , 1);
            i--;
            continue;
        }
        if(_ckObj._opacity <= 1) {
            DelPict(NPic_FOutArr[i][0]);
            NPic_FOutArr.splice(i , 1);
            i--;
        } else {
            NPic_FOutArr[i][1]--;
            if(NPic_FOutArr[i][1] <= 0) {
                NPic_FOutArr.splice(i , 1);
                i--;
            }
        }
    }
}
Game_Interpreter.prototype.FOutPictSpan = function (_開始No , _終了No , _time) { FOutPictSpan(_開始No , _終了No , _time); }
let FOutPictSpan = function (_開始No , _終了No , _time) {
    _time = typeof _time !== 'undefined' ? _time : 15;
    for (let i = _開始No; i <= _終了No; i++){
        MovePict(i , true , true , _time , 0 , true , true);
    }
}
Game_Interpreter.prototype.ALLDelPict = function (notarr) { ALLDelPict(notarr); }
let ALLDelPict = function (notarr) {
    notarr = typeof notarr !== 'undefined' ? notarr : null;
    let _maxPic = $gameScreen.maxPictures();
    for (let i = 1; i <= _maxPic - 10; i++) {
        let notdelflg = false;
        if (notarr != null) {
            for (let j = 0; j <= notarr.length - 1; j++) {
                if (notarr[j] == i) {
                    notdelflg = true;
                }
            }
        }
        if (!notdelflg) {
            DelPict(i);
        }
    }
}
Game_Interpreter.prototype.PicNoCng = function (PicNo, _PicCngNo) { PicNoCng(PicNo, _PicCngNo); }
let PicNoCng = function (PicNo, _PicCngNo) {
    if ($gameScreen.picture(PicNo) != undefined) { 
        $gameScreen.PicNoCng(PicNo, _PicCngNo);
    }
}
let PicCng中継No = -1;
Game_Interpreter.prototype.PicNoCng_2 = function (PicNo, _PicCngNo) { PicNoCng_2(PicNo, _PicCngNo); }
let PicNoCng_2 = function (PicNo, _PicCngNo , _中継PicNo) {
    PicCng中継No = _中継PicNo;
    $gameScreen.PicNoCng(PicNo, _PicCngNo);
}
Game_Screen.prototype.PicNoCng = function (PicNo, _PicCngNo) {
    let realPictureId = this.realPictureId(PicNo);
    let cngPictureId = this.realPictureId(_PicCngNo);
    let keepPictureId = -1;
    if (PicCng中継No != -1) {
        keepPictureId = this.realPictureId(PicCng中継No);
        this._pictures[keepPictureId] = this._pictures[cngPictureId];
    }
    this._pictures[cngPictureId] = this._pictures[realPictureId];
    this._pictures[realPictureId] = null;
    if (PicCng中継No != -1) {
        keepPictureId = this.realPictureId(PicCng中継No);
        this._pictures[cngPictureId] = this._pictures[keepPictureId];
        this._pictures[keepPictureId] = null;
        PicCng中継No = -1;
    }
};
Game_Interpreter.prototype.PicObjGet = function (_PicNo) { return PicObjGet(_PicNo); }
let PicObjGet = function (_PicNo) {
    if ($gameScreen.picture(_PicNo) != undefined) { 
        return $gameScreen.PicObjGet(_PicNo);
    }
    return null;
}
Game_Screen.prototype.PicObjGet = function (_PicNo) {
    let realPictureId = this.realPictureId(_PicNo);
    return this._pictures[realPictureId];
};
Game_Interpreter.prototype.PicInObj = function (_PicNo, _PicObj) { PicInObj(_PicNo, _PicObj); }
let PicInObj = function (_PicNo, _PicObj) {
    $gameScreen.PicInObj(_PicNo, _PicObj);
}
Game_Screen.prototype.PicInObj = function (_PicNo, _PicObj) {
    this._pictures.splice(_PicNo, 1); 
    this._pictures.splice(_PicNo, 0, _PicObj); 
};
let PicStrDataGet = function(_PNo) {
    if($gameScreen.PicObjGet(_PNo) != null){
        if($gameScreen.PicObjGet(_PNo).dTextInfo != null){
            $gameScreen.PicObjGet(_PNo).dTextInfo.originalValue = 
                $gameScreen.PicObjGet(_PNo).dTextInfo.originalValue.replace("\n","");
        }
        return $gameScreen.PicObjGet(_PNo).dTextInfo;
    }
}
let PictStrCounter = 0;
let PictStrCheckFlame = 0;
const PictStrCheckSec = 10;
let SpriteStrCounter = 0;
let SpriteStrCheckFlame = 0;
const SpriteStrCheckSec = 10;
let PictStr_NUpdateSc = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    PictStr_NUpdateSc.call(this);
    PictStrCheckFlame++;
    if (PictStrCheckFlame > 60 * PictStrCheckSec) { 
        if (PictStrCounter > 60 * PictStrCheckSec) {
            console.log("◆◆◆ PictStrでメモリリークの危険性があります ◆◆◆◆");
        }
        PictStrCheckFlame = 0;
        PictStrCounter = 0;
    }
    SpriteStrCheckFlame++;
    if (SpriteStrCheckFlame > 60 * SpriteStrCheckSec) { 
        if (SpriteStrCounter > 60 * SpriteStrCheckSec) {
            console.log("◆◆◆ SpriteStrでメモリリークの危険性があります ◆◆◆◆");
        }
        SpriteStrCheckFlame = 0;
        SpriteStrCounter = 0;
    }
}
let _OneShotFont = "";
let D_Text_Cng_font = ""; 
Game_Interpreter.prototype.SetPicStr = function (PicNo, moji, Size, setx, sety, opi) {
    opi = typeof opi !== 'undefined' ? opi : 255;
    let _Font = "MainFont";
    if (D_Text_Cng_font != "") _Font = D_Text_Cng_font;
    if (_OneShotFont != "") _Font = _OneShotFont;
    if (_Font != "") {
        this.pluginCommand("D_TEXT_SETTING", ["FONT", _Font]);
    } 
    let args = new Array(moji, String(Size));
    if(PicStrDataGet(PicNo) != null){
        if (PicStrDataGet(PicNo).originalValue == moji && 
            PicStrDataGet(PicNo).size == Size && 
            PicStrDataGet(PicNo).font == _Font) {
                this.PicObjGet(PicNo)._x = setx;
                this.PicObjGet(PicNo)._y = sety;
                this.PicObjGet(PicNo)._opacity = opi;
                this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
                NP_原点 = 0;
                _OneShotFont = "";
                ViewPicAdd(PicNo);
                return;
        }
    }
    PictStrCounter++;
    this.pluginCommand("D_TEXT", args);
    $gameScreen.showPicture(PicNo, "", NP_原点, setx, sety, 100, 100, opi, 0);
    ViewPicAdd(PicNo);
    this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
    NP_原点 = 0;
    _OneShotFont = "";
    DebugPicNo(PicNo, "SetPicStr");
};
Game_Interpreter.prototype.SetPicStrC = function (PicNo, moji, Size, setx, sety, opi) {
    NP_原点 = 1; 
    this.SetPicStr(PicNo, moji, Size, setx, sety, opi);
};
Game_Interpreter.prototype.SetPicStrR = function (PicNo, moji, Size, setx, sety, opi) {
    NP_原点 = 2; 
    this.SetPicStr(PicNo, moji, Size, setx, sety, opi);
};
Game_Interpreter.prototype.SetPicStrBG = function (BGcolor) {
    let args = new Array("BG_COLOR", BGcolor);
    this.pluginCommand("D_TEXT_SETTING", args);
};
Game_Interpreter.prototype.SetPicStrFont = function (FontStr) {
    _OneShotFont = FontStr;
};
Game_Interpreter.prototype.SetPicStrPop = function (PicNo, moji, Size, setx, sety, stime, Popy) {
    stime = typeof stime !== 'undefined' ? stime : 60;
    Popy = typeof Popy !== 'undefined' ? Popy : 30;
    this.SetPicStr(PicNo, moji, Size, setx, sety);
    this.MovePict(PicNo, setx, sety - Popy, stime, 0)
    ViewPicAdd(PicNo);
}
Game_Interpreter.prototype.SetPicStrPopC = function (PicNo, moji, Size, setx, sety, stime, Popy) {
    stime = typeof stime !== 'undefined' ? stime : 60;
    Popy = typeof Popy !== 'undefined' ? Popy : 30;
    this.SetPicStrC(PicNo, moji, Size, setx, sety);
    this.MovePict(PicNo, setx, sety - Popy, stime, 0)
    ViewPicAdd(PicNo);
}
let D_Text_Align = ""; 
Game_Interpreter.prototype.SetPicStrArr = function (PicNo, mojiArr, setx, sety, opi) {
    opi = typeof opi !== 'undefined' ? opi : 255;
    if (D_Text_Cng_font != "") this.pluginCommand("D_TEXT_SETTING", ["FONT", D_Text_Cng_font]);
    if (_OneShotFont != "") this.pluginCommand("D_TEXT_SETTING", ["FONT", _OneShotFont]);
    switch (D_Text_Align) {
        case "":
        case "l":
            this.pluginCommand("D_TEXT_SETTING", ["ALIGN", "0"]); break;
        case "c":
            this.pluginCommand("D_TEXT_SETTING", ["ALIGN", "1"]); break;
        case "r":
            this.pluginCommand("D_TEXT_SETTING", ["ALIGN", "2"]); break;
    }
    for (let i = 0; i <= mojiArr.length - 1; i++) {
        let args = new Array(mojiArr[i][0], String(mojiArr[i][1]));
        this.pluginCommand("D_TEXT", args);
    }
    $gameScreen.showPicture(PicNo, "", NP_原点, setx, sety, 100, 100, opi, 0);
    ViewPicAdd(PicNo);
    this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
    this.pluginCommand("D_TEXT_SETTING", ["ALIGN", "0"]); 
    NP_原点 = 0;
    _OneShotFont = "";
}
Game_Interpreter.prototype.SetPicStrArrC = function (PicNo, mojiArr, setx, sety, opi) {
    NP_原点 = 1; 
    this.SetPicStrArr(PicNo, mojiArr, setx, sety, opi);
}
Game_Interpreter.prototype.SetPicStrArrR = function (PicNo, mojiArr, setx, sety, opi) {
    NP_原点 = 2; 
    this.SetPicStrArr(PicNo, mojiArr, setx, sety, opi);
}
let PPicAnimeLoopFlg = true;
let _PAnimeCenterFlg = false;
let PicAnimeOne = function(){ 
    PPicAnimeLoopFlg = false;
}
let _PicAnimeLCLoop = 0;
let PicAnimeLCLoop = function (_lcnt) { 
    _PicAnimeLCLoop = _lcnt;
}
let _PlayPicAnime_RenFlg = false; 
let _PlayPicAnime_Type = 3; 
let _PlayPicAnime_CstmArr = [];
let _PACustmList = [];      
Game_Interpreter.prototype.PlayRenAnime = function (PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr) {
    _CstmArr = typeof _CstmArr !== 'undefined' ? _CstmArr : [];
    _PlayPicAnime_RenFlg = true;
    _PlayPicAnime_Type = CellType;
    _PlayPicAnime_CstmArr = _CstmArr;
    this.PlayPicAnime(PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my , _CstmArr);
}
Game_Interpreter.prototype.PlayRenAnimeC = function (PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr) {
    _PAnimeCenterFlg = true;
    this.PlayRenAnime(PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr);
    _PAnimeCenterFlg = false;
}
Game_Interpreter.prototype.PlayRenAnimeOne = function (PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr) {
    PPicAnimeLoopFlg = false;
    this.PlayRenAnime(PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr);
}
Game_Interpreter.prototype.PlayRenAnimeCOne = function (PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr) {
    PPicAnimeLoopFlg = false;
    this.PlayRenAnimeC(PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr);
}
Game_Interpreter.prototype.PlayPicAnime = function (PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my) {
    opi = typeof opi !== 'undefined' ? opi : 255;
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    let _ALoadStyle = "横";
    if(_PlayPicAnime_RenFlg) _ALoadStyle = "連番"
    let args = new Array(String(CellSu), String(CellFlm), _ALoadStyle, "0");
    _PlayPicAnime_RenFlg = false;
    this.pluginCommand("PA_INIT", args);
    if (_PAnimeCenterFlg) {
        this.SetPictC(PicNo, FileName, setx, sety, opi, mx, my);
    } else {
        this.SetPict(PicNo, FileName, setx, sety, opi, mx, my);
    }
    args2 = new Array(String(PicNo), String(_PlayPicAnime_Type));
    if(_PlayPicAnime_Type == 3) {
        let _SetCC = "[" + CellSu;
        let ci = 1
        for (ci = 1; ci <= CellSu; ci++) {
            if (_SetCC == "[") {
                _SetCC += String(ci);
            } else {
                _SetCC += "," + String(ci)
            }
        }
        if(_PicAnimeLCLoop > 0){
            for (let i = 0; i <= _PicAnimeLCLoop - 1; i++) {
                _SetCC += "," + String(ci - 1); 
            }
        }
        _SetCC += "]";
        if(_PlayPicAnime_CstmArr.length > 0){
            _SetCC = "[";
            for (let i = 0; i <= _PlayPicAnime_CstmArr.length - 1; i++) {
                if (_SetCC == "[") {
                    _SetCC += String(_PlayPicAnime_CstmArr[i]);
                } else {
                    _SetCC += "," + String(_PlayPicAnime_CstmArr[i])
                }
            }
            _SetCC += "]";
        }
        args2 = new Array(String(PicNo), String(_PlayPicAnime_Type), _SetCC);
    }
    if (PPicAnimeLoopFlg) {
        this.pluginCommand("PA_START_LOOP", args2);
    } else {
        this.pluginCommand("PA_START", args2);
    }
    _PlayPicAnime_Type = 3; 
    _PicAnimeLCLoop = 0;
    PPicAnimeLoopFlg = true; 
}
//アニメ表示(中心)
Game_Interpreter.prototype.PlayPicAnimeC = function (PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my) {
    opi = typeof opi !== 'undefined' ? opi : 255;
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    _PAnimeCenterFlg = true;
    this.PlayPicAnime(PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my);
    _PAnimeCenterFlg = false;
}
Game_Interpreter.prototype.PlayPicAnimeCOne = function (PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my) {
    PPicAnimeLoopFlg = false; 
    this.PlayPicAnimeC(PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my);
}
Game_Interpreter.prototype.PicAnimeCell = function (PicNo, FileName, CellSu, _CellNo, setx, sety, opi, mx, my) {
    _CellNo = typeof _CellNo !== 'undefined' ? _CellNo : 1;
    opi = typeof opi !== 'undefined' ? opi : 255;
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    let CellFlm = 10;
    let args = new Array(String(CellSu), String(CellFlm), "横", "0");
    this.pluginCommand("PA_INIT", args);
    if (_PAnimeCenterFlg) {
        this.SetPictC(PicNo, FileName, setx, sety, opi, mx, my);
    } else {
        this.SetPict(PicNo, FileName, setx, sety, opi, mx, my);
    }
    this.pluginCommand("PA_SET_CELL", [String(PicNo), String(_CellNo)]); 
    this.pluginCommand("PA_STOP_FORCE", [String(PicNo)]); 
}
Game_Interpreter.prototype.PicAnimeCellC = function (PicNo, FileName, CellSu, _CellNo, setx, sety, opi, mx, my) {
    _CellNo = typeof _CellNo !== 'undefined' ? _CellNo : 1;
    opi = typeof opi !== 'undefined' ? opi : 255;
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    _PAnimeCenterFlg = true;
    this.PicAnimeCell(PicNo, FileName, CellSu, _CellNo, setx, sety, opi, mx, my);
    _PAnimeCenterFlg = false;
}
Game_Interpreter.prototype.PicAnimeCellCng = function (PicNo, _CellNo) {
    this.pluginCommand("PA_SET_CELL", [String(PicNo), String(_CellNo)]); 
}
let EasingStr = ""; 
Game_Interpreter.prototype.EMoveSet = function (_EasingStr) {
    let args = new Array(_EasingStr);
    this.pluginCommand("easing", args);
}
let EMoveSet = function (_EasingStr){
    $gameTemp._easingX = _EasingStr;
    $gameTemp._easingY = _EasingStr;
    $gameTemp._easingSx = _EasingStr;
    $gameTemp._easingSy = _EasingStr;
    $gameTemp._easingOp = _EasingStr;
}
function overPointerCk(_PicNo) {
    if (MouseStopFlame > MouseMukoFlame || N_Input_Stop > 0) return false; 
    let picture = SceneManager.getPictureSprite(_PicNo);
    if (picture.opacity === 0) return false; 
    return $gameScreen.isPointerInnerPicture(_PicNo);
}
function overPointerCkTm(_PicNo) {
    if (MouseStopFlame > MouseMukoFlame || N_Input_Stop > 0) return false; 
    return $gameScreen.isPointerInnerPictureTm(_PicNo);
}
//対象のピクチャ上にポインタがあるかを調べる(配列で)：一番数値の大きい数字を返す：ない場合は-1
function overPointerCkArr(_PicNoArr) {
    for (let i = 0; i <= _PicNoArr.length - 1; i++) {
        if (this.overPointerCk(_PicNoArr[i])) {
            return _PicNoArr[i];
        }
    }
    return -1;
}
function overPointerCkArr_GetNo(_PicNoArr) {
    for (let i = 0; i <= _PicNoArr.length - 1; i++) {
        if (this.overPointerCk(_PicNoArr[i])) {
            return i;
        }
    }
    return -1;
}
function overPointerCkArrTm(_PicNoArr) {
    for (let i = 0; i <= _PicNoArr.length - 1; i++) {
        if (this.overPointerCkTm(_PicNoArr[i])) {
            return _PicNoArr[i];
        }
    }
    return -1;
}
function overPointerCkArrTm_GetNo(_PicNoArr) {
    for (let i = 0; i <= _PicNoArr.length - 1; i++) {
        if (this.overPointerCkTm(_PicNoArr[i])) {
            return i;
        }
    }
    return -1;
}
Game_Screen.prototype.isPointerInnerPictureTm = function (pictureId) {
    let picture = SceneManager.getPictureSprite(pictureId);
    if (picture) {
        let _rtnFlg = picture.isIncludePointer();
        if (_rtnFlg) {
            return !picture.isTransparentN();
        }
    } else {
        return false;
    }
}
Sprite_Picture.prototype.isTransparentN = function () {
    if (this.opacity === 0) return true; 
    let dx = this.getTouchScreenX() - this.x;
    let dy = this.getTouchScreenY() - this.y;
    let sin = Math.sin(-this.rotation);
    let cos = Math.cos(-this.rotation);
    let bx = Math.floor(dx * cos + dy * -sin) / this.scale.x + this.anchor.x * this.width;
    let by = Math.floor(dx * sin + dy * cos) / this.scale.y + this.anchor.y * this.height;
    return this.bitmap.getAlphaPixel(bx, by) === 0; 
};
let _TcPosX = 0;
let _TcPosY = 0;
let Nupu_updatePointer = Game_Screen.prototype.updatePointer;
Game_Screen.prototype.updatePointer = function () {
    Nupu_updatePointer.call(this);
    _TcPosX = TouchInput.x;
    _TcPosY = TouchInput.y;
};
let ClickablePos = new Pos2D(0 , 0);
function overPicClickable(_PicNo, _CMapArr) {
    ClickablePos = new Pos2D(0 , 0);
    if (this.overPointerCk(_PicNo)) {
        let _CkZureX = 0;
        let _CkZureY = 0;
        if ($gameScreen.picture(_PicNo)._origin == 1) { 
            _CkZureX = _CkPicWidth(_PicNo) / 2;
            _CkZureY = _CkPicHeight(_PicNo) / 2;
        }
        for (let i = 0; i <= _CMapArr.length - 1; i++) {
            if (_TcPosX >= _CMapArr[i][0] + $gameScreen.picture(_PicNo)._x - _CkZureX &&
                _TcPosX <= _CMapArr[i][0] + _CMapArr[i][2] + $gameScreen.picture(_PicNo)._x - _CkZureX &&
                _TcPosY >= _CMapArr[i][1] + $gameScreen.picture(_PicNo)._y - _CkZureY &&
                _TcPosY <= _CMapArr[i][1] + _CMapArr[i][3] + $gameScreen.picture(_PicNo)._y - _CkZureY) {
                ClickablePos._x = _TcPosX - (_CMapArr[i][0] + $gameScreen.picture(_PicNo)._x - _CkZureX);
                ClickablePos._y = _TcPosY - (_CMapArr[i][1] + $gameScreen.picture(_PicNo)._y - _CkZureY);
                return i;
            }
        }
    }
    return -1; 
}
//オーバーしているピクチャの触っている部分のX箇所が全体の何%の位置かを返す(0~100)
function overPicParX(_PicNo) {
    if (this.overPointerCk(_PicNo)) {
        let _CkZureX = 0;
        if ($gameScreen.picture(_PicNo)._origin == 1) { 
            _CkZureX = _CkPicWidth(_PicNo) / 2;
        }
        return (_TcPosX - ($gameScreen.picture(_PicNo)._x - _CkZureX)) / _CkPicWidth(_PicNo) * 100;
    }
    return -1; 
}
//オーバーしているピクチャの触っている部分のY箇所が全体の何%の位置かを返す(0~100)
function overPicParY(_PicNo) {
    if (this.overPointerCk(_PicNo)) {
        let _CkZureY = 0;
        if ($gameScreen.picture(_PicNo)._origin == 1) { 
            _CkZureY = _CkPicHeight(_PicNo) / 2;
        }
        return (_TcPosY - ($gameScreen.picture(_PicNo)._y - _CkZureY)) / _CkPicHeight(_PicNo) * 100;
    }
    return -1; 
}
let _CkPicWidth = function (_PicNo) {
    let pictureId = _PicNo;
    let spritePicture = SceneManager._scene._spriteset._pictureContainer.children.filter(function (picture) {
        return picture._pictureId === pictureId;
    })[0];
    return spritePicture.width;
}
let _CkPicHeight = function (_PicNo) {
    let pictureId = _PicNo;
    let spritePicture = SceneManager._scene._spriteset._pictureContainer.children.filter(function (picture) {
        return picture._pictureId === pictureId;
    })[0];
    return spritePicture.height;
}
let GetPictureSpriteData = function (_PicNo) {
    let pictureId = _PicNo;
    let spritePicture = SceneManager._scene._spriteset._pictureContainer.children.filter(function (picture) {
        return picture._pictureId === pictureId;
    })[0];
    return spritePicture;
}
let GetPicName = function (_PicNo) {
    if ($gameScreen.picture(_PicNo) == undefined) return "";
    return $gameScreen.picture(_PicNo)._name;
}
let _cmpSetting = ""; 
Game_Interpreter.prototype.CmpPict = function (_APictNo, _BPictNo, _xPos, _yPos, _xSize, _ySize) {
    _xPos = typeof _xPos !== 'undefined' ? _xPos : 0;
    _yPos = typeof _yPos !== 'undefined' ? _yPos : 0;
    let _setCmp = "source-over";
    if (_cmpSetting != "") {
        _setCmp = _cmpSetting;
    }
    let _SetArr = [_APictNo, _BPictNo, _setCmp, _xPos, _yPos];
    if (_xSize != undefined) _SetArr.push(_xSize);
    if (_ySize != undefined) _SetArr.push(_ySize);
    this.N_Plgin("compose_picture", _SetArr);
    this.DelPict(_BPictNo);
}
Game_Interpreter.prototype.PicFilterSet = function (_PicNo , _FilStr) {
    let _SetArr = [5000 + _PicNo , _FilStr , 5000 + _PicNo];
    this.N_Plgin("createFilter", _SetArr);
}
Game_Interpreter.prototype.PicFilterPraSet = function (_PicNo , _PraArr) {
    let _SetArr = [5000 + _PicNo];
    for (let i = 0; i <= _PraArr.length - 1; i++) {
            _SetArr.push(_PraArr[i]);
    }
    this.N_Plgin("setFilter", _SetArr);
}
Game_Interpreter.prototype.PicTranIn = function (_PicNo , _TranPic , _time) {
    this.MovePict(_PicNo , true , true , 255 , 0); 
    // this.N_Plgin("GWFade", _SetArr);
}
Game_Interpreter.prototype.PicTranOut = function (_PicNo , _TranPic , _time) {
    this.MovePict(_PicNo , true , true , _time , 0); 
    // this.N_Plgin("GWFade", _SetArr);
}
Game_Interpreter.prototype.EffImgFadeIn = function (_PicNo , _TranPic , _time , _PicImg) {
    _time = typeof _time !== 'undefined' ? _time : 15;
    _PicImg = typeof _PicImg !== 'undefined' ? _PicImg : "Black";
    this.SetPict( _PicNo , _PicImg , 0 , 0 , 255);
    let _SetArr = ["picture" , _PicNo , "fadeIn" , _TranPic , _time];
    this.N_Plgin("GWFade", _SetArr);
}
Game_Interpreter.prototype.EffImgFadeInR = function (_PicNo , _TranPic , _time , _PicImg) {
    NP_原点 = 1;
    this.EffImgFadeIn(_PicNo , _TranPic , _time , _PicImg);
}
Game_Interpreter.prototype.EffImgFadeInC = function (_PicNo , _TranPic , _time , _PicImg) {
    NP_原点 = 2;
    this.EffImgFadeIn(_PicNo , _TranPic , _time , _PicImg);
}
Game_Interpreter.prototype.EffImgFadeOut = function (_PicNo , _TranPic , _time , _PicImg) {
    _time = typeof _time !== 'undefined' ? _time : 15;
    _PicImg = typeof _PicImg !== 'undefined' ? _PicImg : "Black";
    this.SetPict( _PicNo , _PicImg , 0 , 0 , 255);
    let _SetArr = ["picture" , _PicNo , "fadeOut" , _TranPic , _time];
    this.N_Plgin("GWFade", _SetArr);
}
Game_Interpreter.prototype.SetPicMask = function (_PicNo , _MaskPicNo) {
    SceneManager._scene._spriteset._pictureContainer.children[_PicNo - 1].mask = SceneManager._scene._spriteset._pictureContainer.children[_MaskPicNo - 1];
}
Game_Interpreter.prototype.DelPicMask = function (_PicNo) {
    SceneManager._scene._spriteset._pictureContainer.children[_PicNo - 1].mask = false;
}
let picStacType = {
    MovePict: 1,
    MovePictAdd: 101,
    DelPict: 2,
    PicCngColor: 3,
    SetPict: 4,
    Wait: 5,
    PlayPtcPic: 6,
    PlayPtcComboPic: 7,
    RotatePic: 8,
    PlaySe: 9
};
class N_PicStacObj {
    constructor(picNo){
        this.picNo = picNo;
        this.stacArr = [];
    }
}
class N_PicStac {
    constructor(_flame){
        this.type = picStacType.MovePict;
        this.flame = _flame;
        this.data = [];
        this.easing = "";
        this.NP_原点 = 0;
        this.doFlg = false; 
    }
}
let N_PicStacArr = [];
let N_PicStac_NUpdateSc = Game_Interpreter.prototype.NUpdateSc;
Game_Interpreter.prototype.NUpdateSc = function () {
    N_PicStac_NUpdateSc.call(this);
    this.StacSpriteUpdate();
    for (let i = 0; i <= N_PicStacArr.length - 1; i++) {
        let _stac = N_PicStacArr[i].stacArr[0];
        let _data = _stac.data;
        if (!N_PicStacArr[i].stacArr[0].doFlg) {
            let _BefEasingStr = EasingStr;
            EasingStr = _stac.easing;
            switch (_stac.type) {
                case picStacType.SetPict: 
                    NP_原点 = _stac.NP_原点;
                    this.SetPict(_data[0] , _data[1] , _data[2] , _data[3] ,
                        _data[4] , _data[5] , _data[6] , _data[7]);
                    break;
                case picStacType.MovePict: 
                    this.MovePict(_data[0] , _data[1] , _data[2] , _data[3] , _data[4] , _data[5] , _data[6]);
                    break;
                case picStacType.MovePictAdd: 
                    this.MovePictAdd(_data[0] , _data[1] , _data[2] , _data[3] , _data[4] , _data[5] , _data[6]);
                    break;
                case picStacType.DelPict: 
                    this.DelPict(_data[0]);
                    break;
                case picStacType.PicCngColor: 
                    this.PicCngColor( _data[0] , _data[1] , _data[2]);
                    break;
                case picStacType.Wait: 
                    break;
                case picStacType.PlayPtcPic: 
                    this.PlayPtcSc(_data[0] , _data[1] , _data[2]);
                    break;
                case picStacType.PlayPtcComboPic: 
                    this.NPtcComboSet(_data[0] , Ptc_CType.Pic , [_data[1],_data[2]]);
                    break;
                case picStacType.RotatePic: 
                    $gameScreen.rotatePicture(_data[0], _data[1]);
                    break;
                case picStacType.PlaySe:
                    this.PlaySe(_data[0]);
                    break;
            }
            EasingStr = _BefEasingStr;
            _stac.doFlg = true;
        } else {
            _stac.flame--;
            if (_stac.flame <= 0) {
                N_PicStacArr[i].stacArr.shift();
                if (N_PicStacArr[i].stacArr.length == 0) {
                    N_PicStacArr.splice(i,1); i--;
                }
            }
        }
    }
}
let StacSpriteFlg = false;
let StacSetPict_Set_NP_原点 = 0;
let StacSetPict = function (picNo, filename, setx, sety , opi, mx, my, _blend) {
    if (!StacSpriteFlg) {
        if (setx == true) setx = $gameScreen.picture(PicNo)._x;
        if (sety == true) sety = $gameScreen.picture(PicNo)._y;
    } else {
        if (setx == true) setx = GetSpriteData(PicNo)._x;
        if (sety == true) sety = GetSpriteData(PicNo)._y;
    }
    setx = typeof setx !== 'undefined' ? setx : 0;
    sety = typeof sety !== 'undefined' ? sety : 0;
    opi = typeof opi !== 'undefined' ? opi : 255;
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    _blend = typeof _blend !== 'undefined' ? _blend : 0;
    let _setStac = new N_PicStac(1);
    _setStac.type = picStacType.SetPict;
    _setStac.data = [picNo , filename , setx , sety , opi , mx , my , _blend];
    _setStac.NP_原点 = StacSetPict_Set_NP_原点;
    _setStac.easing = EasingStr;
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    StacSetPict_Set_NP_原点 = 0; 
    StacSpriteFlg = false;
}
let StacSetSprite = function (picNo, filename, setx, sety , opi, mx, my, _blend) {
    StacSpriteFlg = true;
    StacSetPict(picNo, filename, setx, sety , opi, mx, my, _blend);
}
let StacClearPict = function (picNo) {
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr = [];
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr = [];
    StacSpriteFlg = false;
}
let StacClearSprite = function (picNo) {
    StacSpriteFlg = true;
    StacClearPict(picNo);
}
let StacSetPictC = function (picNo, filename, setx, sety , opi, mx, my, _blend) {
    StacSetPict_Set_NP_原点 = 1;
    StacSetPict(picNo, filename, setx, sety , opi, mx, my, _blend);
}
let StacSetSpriteC = function (picNo, filename, setx, sety , opi, mx, my, _blend) {
    StacSpriteFlg = true;
    StacSetPictC(picNo, filename, setx, sety , opi, mx, my, _blend);
}
let StacMovePict = function (picNo, setx, sety, time, opi, mx, my) {
    time = typeof time !== 'undefined' ? time : 1;
    opi = typeof opi !== 'undefined' ? opi : 255;
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    let _setStac = new N_PicStac(time);
    _setStac.type = picStacType.MovePict;
    _setStac.data = [picNo, setx, sety, time, opi, mx, my];
    _setStac.easing = EasingStr;
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    StacSpriteFlg = false;
}
let StacMoveSprite = function (picNo, setx, sety, time, opi, mx, my) {
    StacSpriteFlg = true;
    StacMovePict(picNo, setx, sety, time, opi, mx, my)
}
let StacMovePictAdd = function (picNo, setx, sety, time, opi, mx, my) {
    time = typeof time !== 'undefined' ? time : 1;
    opi = typeof opi !== 'undefined' ? opi : 255;
    mx = typeof mx !== 'undefined' ? mx : 100;
    my = typeof my !== 'undefined' ? my : 100;
    let _setStac = new N_PicStac(time);
    _setStac.type = picStacType.MovePictAdd;
    _setStac.data = [picNo, setx, sety, time, opi, mx, my];
    _setStac.easing = EasingStr;
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    StacSpriteFlg = false;
}
let StacMoveSpriteAdd = function (picNo, setx, sety, time, opi, mx, my) {
    StacSpriteFlg = true;
    StacMovePictAdd(picNo, setx, sety, time, opi, mx, my)
}
let StacPlaySePict = function (picNo , seStr) {
    let _setStac = new N_PicStac(1);
    _setStac.type = picStacType.PlaySe;
    _setStac.data = [seStr];
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    StacSpriteFlg = false;
}
let StacPlaySeSprite = function (picNo , seStr) {
    StacSpriteFlg = true;
    StacPlaySePict(picNo , seStr);
}
let StacPicCngColor = function (picNo, _ColArr, _timer) {
    _ColArr = typeof _ColArr !== 'undefined' ? _ColArr : [0, 0, 0, 0]; 
    _timer = typeof _timer !== 'undefined' ? _timer : 1;
    let _setStac = new N_PicStac(_timer);
    _setStac.type = picStacType.PicCngColor;
    _setStac.data = [picNo, _ColArr, _timer];
    _setStac.easing = EasingStr;
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    StacSpriteFlg = false;
}
let StacSpriteCngColor = function (picNo, _ColArr, _timer) {
    StacSpriteFlg = true;
    StacPicCngColor(picNo, _ColArr, _timer);
}
let StacDelPict = function (picNo , _timer) {
    _timer = typeof _timer !== 'undefined' ? _timer : 1;
    let _setStac = new N_PicStac(_timer);
    _setStac.type = picStacType.DelPict;
    _setStac.data = [picNo];
    _setStac.easing = EasingStr;
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    StacSpriteFlg = false;
}
let StacDelSprite = function (picNo , _timer) {
    StacSpriteFlg = true;
    StacDelPict(picNo , _timer);
}
let StacWaitPict = function (picNo , _timer) {
    _timer = typeof _timer !== 'undefined' ? _timer : 1;
    let _setStac = new N_PicStac(_timer);
    _setStac.type = picStacType.Wait;
    _setStac.data = [];
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    StacSpriteFlg = false;
}
let StacWaitSprite = function (picNo , _timer) {
    StacSpriteFlg = true;
    StacWaitPict(picNo , _timer);
}
let StacPlayPtcPict = function (picNo , _PtcName , setX , setY , _timer){
    _timer = typeof _timer !== 'undefined' ? _timer : 1;
    let _setStac = new N_PicStac(_timer);
    _setStac.type = picStacType.PlayPtcPic;
    _setStac.data = [_PtcName , setX , setY];
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    StacSpriteFlg = false;
}
let StacPlayPtcSprite = function (picNo , _PtcName , setX , setY , _timer){
    StacSpriteFlg = true;
    StacPlayPtcPict(picNo , _PtcName , setX , setY , _timer);
}
let StacPlayPtcComboPic = function (picNo , _ComboName , setX , setY , _timer){
    _timer = typeof _timer !== 'undefined' ? _timer : 1;
    let _setStac = new N_PicStac(_timer);
    _setStac.type = picStacType.PlayPtcComboPic;
    _setStac.data = [_ComboName , setX , setY];
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    StacSpriteFlg = false;
}
let StacPlayPtcComboSprite = function (picNo , _ComboName , setX , setY , _timer){
    StacSpriteFlg = true;
    StacPlayPtcComboPic(picNo , _ComboName , setX , setY , _timer);
}
let StacRotatePic = function (picNo , _rotate , _timer){
    _timer = typeof _timer !== 'undefined' ? _timer : 1;
    let _setStac = new N_PicStac(_timer);
    _setStac.type = picStacType.RotatePic;
    _setStac.data = [picNo , _rotate];
    if (!StacSpriteFlg) N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    else N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.push(_setStac);
    StacSpriteFlg = false;
}
let StacRotateSprite = function (picNo , _rotate , _timer){
    StacSpriteFlg = true;
    StacRotatePic(picNo , _rotate , _timer);
}
let StacPicTimerGet = function (picNo) {
    let _flame = 0;
    if (!StacSpriteFlg) {
        N_PicStacArr[N_PicStacArr_NoGet(picNo)].stacArr.forEach( data => {
            _flame += data.flame;
        });
    } else {
        N_SpriteStacArr[N_PicStacArr_NoGet(picNo)].stacArr.forEach( data => {
            _flame += data.flame;
        });
    }
    StacSpriteFlg = false;
    return _flame;
}
let StacSpriteTimerGet = function (picNo) {
    StacSpriteFlg = true;
    StacPicTimerGet(picNo);
}
let N_PicStacArr_NoGet = function (picNo) {
    if (!StacSpriteFlg) {
        for (let i = 0; i <= N_PicStacArr.length - 1; i++) {
            if(N_PicStacArr[i].picNo == picNo) {
                return i;
            }
        }
        N_PicStacArr.push(new N_PicStacObj(picNo));
        return N_PicStacArr.length - 1;
    } else {
        for (let i = 0; i <= N_SpriteStacArr.length - 1; i++) {
            if(N_SpriteStacArr[i].picNo == picNo) {
                return i;
            }
        }
        N_SpriteStacArr.push(new N_PicStacObj(picNo));
        return N_SpriteStacArr.length - 1;
    }
}
let DebugPicNo = function (_CkPNo, _PlsStr) {
    _PlsStr = typeof _PlsStr !== 'undefined' ? _PlsStr : "";
    let _DrawArr = [];
    for (let i = 0; i <= DbgPNo.length - 1; i++) {
        if (DbgPNo[i] == _CkPNo) {
            _DrawArr.push("[デバッグ]Picture:" + DbgPNo[i] + ":" + _PlsStr);
        }
    }
    for (let i = 0; i <= _DrawArr.length - 1; i++) {
        console.log(_DrawArr[i]);
    }
}
ImageManager.loadBitmap = function (folder, filename, hue, smooth) {
    if (filename) {
        let path = folder + encodeURIComponent(filename) + '.png';
        if (filename.indexOf('/') !== -1) {
            path = "img/" + filename + '.png';
        }
        let bitmap = this.loadNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};
