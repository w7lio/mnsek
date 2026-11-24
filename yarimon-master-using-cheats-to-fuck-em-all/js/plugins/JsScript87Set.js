/*:
 * @plugindesc 
 * @author ぬぷ竜
 */
let NS_createPictures = Spriteset_Base.prototype.createPictures;
Spriteset_Base.prototype.createPictures = function () {
    NS_createPictures.apply(this, arguments);
    this.removeChild(this._pictureContainer);
    this.N_Sprite_Create(); 
};
let ViewSpriteArr = []; 
let ViewSpriteArr_Add = function (_No) {
    if (ViewSpriteArr.indexOf(_No) == -1) {
        ViewSpriteArr.push(_No);
    }
}
let ViewSpriteArr_Remove = function (_No) {
    if (ViewSpriteArr.indexOf(_No) != -1) {
        ViewSpriteArr.splice(ViewSpriteArr.indexOf(_No), 1);
    }
}
let ViewSpriteArr_Reset = function (_No) {
    ViewSpriteArr = [];
}
let N_Sprite_All = []; 
let N_Sprite_L = null; 
let N_Sprite_M = null; 
let N_Sprite_T = null; 
Spriteset_Base.prototype.N_Sprite_Create = function () {
    let width = Graphics.boxWidth;
    let height = Graphics.boxHeight;
    let x = (Graphics.width - width) / 2;
    let y = (Graphics.height - height) / 2;
    N_Sprite_L = new Sprite();
    N_Sprite_L.setFrame(x, y, width, height);
    N_Sprite_M = new Sprite();
    N_Sprite_M.setFrame(x, y, width, height);
    N_Sprite_T = new Sprite();
    N_Sprite_T.setFrame(x, y, width, height);
    this.Set_N_Sprite_L();
    N_Sprite_All = [];
    N_Sprite_All.push(N_Sprite_L);
    N_Sprite_All.push(N_Sprite_M);
    N_Sprite_All.push(N_Sprite_T);
}
Spriteset_Base.prototype.Set_N_Sprite_L = function () {
    this.addChild(N_Sprite_L);
};
let NS_createWindowLayer = Scene_Base.prototype.createWindowLayer;
Scene_Base.prototype.createWindowLayer = function () {
    if (this._spriteset) {
        this._spriteset.SetUp_N_Sprite_T(this);
    }
    NS_createWindowLayer.apply(this, arguments);
}
Spriteset_Base.prototype.SetUp_N_Sprite_T = function (parentScene) {
    let _INNo = parentScene.children.length - 1;
    if (_INNo < 0) _INNo = 0;
    parentScene.addChildAt(N_Sprite_M, _INNo);
    parentScene.addChildAt(N_Sprite_T, _INNo + 1);
};
let N_Sprite_MNo = 0; 
let N_Sprite_TNo = 0; 
let SpriteLayer = 0; 
let SelSprite = function (_No) { 
    _No = typeof _No !== 'undefined' ? _No : 0;
    if (_No >= N_Sprite_TNo) { 
        return N_Sprite_T;
    }
    if (_No >= N_Sprite_MNo && N_Sprite_MNo != 0) { 
        return N_Sprite_M;
    }
    return N_Sprite_L; 
}
let DebugSpriteNo = function (_CkPNo, _PlsStr) {
    _PlsStr = typeof _PlsStr !== 'undefined' ? _PlsStr : "";
    let _DrawArr = [];
    for (let i = 0; i <= DbgPNo.length - 1; i++) {
        if (DbgPNo[i] == _CkPNo) {
            _DrawArr.push("[デバッグ]Sprite:" + DbgPNo[i] + ":" + _PlsStr);
        }
    }
    for (let i = 0; i <= _DrawArr.length - 1; i++) {
        console.log(_DrawArr[i]);
    }
}
Game_Interpreter.prototype.SetSprite = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    SetSprite(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
let SetSprite = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    _x = typeof _x !== 'undefined' ? _x : 0;
    _y = typeof _y !== 'undefined' ? _y : 0;
    _opi = typeof _opi !== 'undefined' ? _opi : 255;
    _mx = typeof _mx !== 'undefined' ? _mx : 100;
    _my = typeof _my !== 'undefined' ? _my : 100;
    _blendMode = typeof _blendMode !== 'undefined' ? _blendMode : 0;
    let _N_Sprite = SelSprite(_No);
    let _FolPath = _FolPathGet(_Path);
    let _FileName = _FileNameGet(_Path);
    let _ckSpriteData = GetSpriteData(_No);
    let _pitOnFlg = false;
    if (_ckSpriteData != null) {
        if (_ckSpriteData._bitmap != null) {
            _pitOnFlg = true;
        }
    }
    if (_pitOnFlg) {
        if ("img/" + _Path + ".png" == _ckSpriteData._bitmap._url) {
            _ckSpriteData._x = _x;
            _ckSpriteData._y = _y;
            _ckSpriteData._opacity = _opi;
            _ckSpriteData._scaleX = _mx;
            _ckSpriteData._scaleY = _my;
            _ckSpriteData._blendMode = _blendMode;
            _ckSpriteData.AnchorSet(); 
        } else {
            DelSprite(_No);
            let _INNo = _GetSpriteInNo(_No);
            let _SetSprite = _NSprite(_No, _FolPath, _FileName, _x, _y, _opi, _mx, _my, _blendMode);
            _N_Sprite.addChildAt(_SetSprite, _INNo);
        }
    } else {
        let _INNo = _GetSpriteInNo(_No);
        let _SetSprite = _NSprite(_No, _FolPath, _FileName, _x, _y, _opi, _mx, _my, _blendMode);
        _N_Sprite.addChildAt(_SetSprite, _INNo);
    }
    ViewSpriteArr_Add(_No);
    DebugSpriteNo(_No, "SetSprite");
}
Game_Interpreter.prototype.SetSpriteC = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    SetSpriteC(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
let SetSpriteC = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    _NSprite_AncNo = 1;
    SetSprite(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
Game_Interpreter.prototype.SetSpriteR = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    SetSpriteR(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
let SetSpriteR = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    _NSprite_AncNo = 2;
    SetSprite(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
Game_Interpreter.prototype.SetSpriteB = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    SetSpriteB(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
let SetSpriteB = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    _NSprite_AncNo = 3;
    SetSprite(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
Game_Interpreter.prototype.SetSpriteBC = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    SetSpriteBC(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
let SetSpriteBC = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    _NSprite_AncNo = 4;
    SetSprite(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
let _FolPathGet = function (_Path) {
    let _FolPath = "img/";
    if (_Path.lastIndexOf("/") == -1) return (_FolPath + "pictures/")
    return (_FolPath + _Path.slice(0, _Path.lastIndexOf("/") + 1));
}
let _FileNameGet = function (_Path) {
    if (_Path.lastIndexOf("/") == -1) return _Path;
    return _Path.slice(_Path.lastIndexOf("/") + 1);
}
Game_Interpreter.prototype.SetSpriteFIn = function (_No, _Path, _x, _y, _zureX, _zureY, _time, _opi, _mx, _my) {
    _zureX = typeof _zureX !== 'undefined' ? _zureX : 0;
    _zureY = typeof _zureY !== 'undefined' ? _zureY : 0;
    _opi = typeof _opi !== 'undefined' ? _opi : 255;
    _mx = typeof _mx !== 'undefined' ? _mx : 100;
    _my = typeof _my !== 'undefined' ? _my : 100;
    SetSprite(_No, _Path, _x, _y, 0, _mx, _my);
    MoveSprite(_No, _x + _zureX, _y + _zureY, _time, _opi, _mx, _my);
}
Game_Interpreter.prototype.SetSpriteFInC = function (_No, _Path, _x, _y, _zureX, _zureY, _time, _opi, _mx, _my) {
    _NSprite_AncNo = 1;
    this.SetSpriteFIn(_No, _Path, _x, _y, _zureX, _zureY, _time, _opi, _mx, _my);
}
Game_Interpreter.prototype.SetSpriteFInR = function (_No, _Path, _x, _y, _zureX, _zureY, _time, _opi, _mx, _my) {
    _NSprite_AncNo = 2;
    this.SetSpriteFIn(_No, _Path, _x, _y, _zureX, _zureY, _time, _opi, _mx, _my);
}
function overSpriteClickable(_PicNo, _CMapArr) {
    if (this.overPointerSpCk(_PicNo)) {
        let _CkZureX = 0;
        let _CkZureY = 0;
        let _CkSprite = GetSpriteData(_PicNo);
        if (_CkSprite.anchor.x == 0.5 && _CkSprite.anchor.y == 0.5) { 
            _CkZureX = _CkSprite.width / 2;
            _CkZureY = _CkSprite.height / 2;
        }
        for (let i = 0; i <= _CMapArr.length - 1; i++) {
            if (_TcPosX >= _CMapArr[i][0] + _CkSprite._x - _CkZureX &&
                _TcPosX <= _CMapArr[i][0] + _CMapArr[i][2] + _CkSprite._x - _CkZureX &&
                _TcPosY >= _CMapArr[i][1] + _CkSprite._y - _CkZureY &&
                _TcPosY <= _CMapArr[i][1] + _CMapArr[i][3] + _CkSprite._y - _CkZureY) {
                ClickablePos._x = _TcPosX - (_CMapArr[i][0] + _CkSprite._x - _CkZureX);
                ClickablePos._y = _TcPosY - (_CMapArr[i][1] + _CkSprite._y - _CkZureY);
                return i;
            }
        }
    }
    return -1; 
}
//オーバーしているピクチャの触っている部分のX箇所が全体の何%の位置かを返す(0~100)
function overSpriteParX(_PicNo) {
    if (this.overPointerSpCk(_PicNo)) {
        let _CkZureX = 0;
        let _CkSprite = GetSpriteData(_PicNo);
        if (_CkSprite.anchor.x == 0.5 && _CkSprite.anchor.y == 0.5) { 
            _CkZureX = _CkSprite.width / 2;
        }
        return (_TcPosX - (_CkSprite._x - _CkZureX)) / _CkSprite.width * 100;
    }
    return -1; 
}
//オーバーしているピクチャの触っている部分のY箇所が全体の何%の位置かを返す(0~100)
function overSpriteParY(_PicNo) {
    if (this.overPointerSpCk(_PicNo)) {
        let _CkZureY = 0;
        let _CkSprite = GetSpriteData(_PicNo);
        if (_CkSprite.anchor.x == 0.5 && _CkSprite.anchor.y == 0.5) { 
            _CkZureY = _CkSprite.height / 2;
        }
        return (_TcPosY - (_CkSprite._y - _CkZureY)) / _CkSprite.height * 100;
    }
    return -1; 
}
Game_Interpreter.prototype.CngSprite = function (_No, _Path) {
    CngSprite(_No, _Path);
}
let CngSprite = function (_No, _Path) {
    let _N_Sprite = SelSprite(_No); 
    for (let i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            let _FolPath = _FolPathGet(_Path);
            let _FileName = _FileNameGet(_Path);
            let _bitmap = ImageManager.loadBitmap(_FolPath, _FileName, 0, true)
            _N_Sprite.children[i].bitmap = _bitmap;
            break;
        }
    }
    DebugSpriteNo(_No, "CngSprite");
}
Game_Interpreter.prototype.SpriteNoCng = function (_No, _CngNo) {
    SpriteNoCng(_No, _CngNo);
}
let SpriteNoCng = function (_No, _CngNo) {
    let _SetSprite = GetSpriteData(_No);
    if (_SetSprite == null) return;
    DelSprite(_No);
    _SetSprite.No = _CngNo;
    DelSprite(_CngNo);  
    let _INNo = _GetSpriteInNo(_CngNo);
    let _N_Sprite = SelSprite(_CngNo); 
    _N_Sprite.addChildAt(_SetSprite, _INNo);
}
Game_Interpreter.prototype.ReDrawSprite = function (_No, _Path) {
}
Game_Interpreter.prototype.DelSprite = function (_No, _SpStrFlg) {
    DelSprite(_No, _SpStrFlg);
};
let DelSprite = function (_No, _SpStrFlg) { 
    let _N_Sprite = SelSprite(_No); 
    for (let i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            _N_Sprite.children[i] = null;
            _N_Sprite.children.splice(i, 1);
            //_N_Sprite.removeChildAt(i);
            break;
        }
    }
    ViewSpriteArr_Remove(_No);
    DebugSpriteNo(_No, "DelSprite");
    if (!_SpStrFlg) _SpriteStrArr_Dell(_No);
    _SpStrFlg = false;
}
let Alpha0Sprite = function (_No) {
    let _N_Sprite = SelSprite(_No); 
    for (let i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            _N_Sprite.children[i]._opacity = 0;
            //_N_Sprite.removeChildAt(i);
            break;
        }
    }
    DebugSpriteNo(_No, "DelSprite");
}
let AlphaCngSprite = function (_No, _setopi) {
    let _N_Sprite = SelSprite(_No); 
    for (let i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            _N_Sprite.children[i]._opacity = _setopi;
            break;
        }
    }
    DebugSpriteNo(_No, "DelSprite");
}
Game_Interpreter.prototype.DelSpriteArr = function (_PicArr) {
    DelSpriteArr(_PicArr);
}
let DelSpriteArr = function (_PicArr) {
    for (let i = 0; i <= _PicArr.length - 1; i++) {
        DelSprite(_PicArr[i]);
    }
}
let Alpha0SpriteArr = function (_PicArr) {
    for (let i = 0; i <= _PicArr.length - 1; i++) {
        Alpha0Sprite(_PicArr[i]);
    }
}
Game_Interpreter.prototype.DelSpriteSpan = function (_SNo, _ENo) {
    DelSpriteSpan(_SNo, _ENo);
}
let DelSpriteSpan = function (_SNo, _ENo) {
    for (let i = _SNo; i <= _ENo; i++) {
        DelSprite(i);
    }
}
let Alpha0SpriteSpan = function (_SNo, _ENo) {
    for (let i = _SNo; i <= _ENo; i++) {
        Alpha0Sprite(i);
    }
}
Game_Interpreter.prototype.FOutSpriteSpan = function (_SNo, _ENo, _time) {
    FOutSpriteSpan(_SNo, _ENo, _time);
}
let FOutSpriteSpan = function (_SNo, _ENo, _time) {
    _time = typeof _time !== 'undefined' ? _time : 15;
    for (let i = _SNo; i <= _ENo; i++) {
        MoveSprite(i, true, true, _time, 0, true, true);
    }
}
Game_Interpreter.prototype.ALLDelSprite = function () {
    ALLDelSprite();
}
let ALLDelSprite = function () {
    for (let i = 0; i <= N_Sprite_L.children.length - 1; i++) {
        N_Sprite_L.removeChild(N_Sprite_L.children[i]);
        i--;
    }
    for (let i = 0; i <= N_Sprite_M.children.length - 1; i++) {
        N_Sprite_M.removeChild(N_Sprite_M.children[i]);
        i--;
    }
    for (let i = 0; i <= N_Sprite_T.children.length - 1; i++) {
        N_Sprite_T.removeChild(N_Sprite_T.children[i]);
        i--;
    }
}
Game_Interpreter.prototype.MoveSprite = function (_No, _x, _y, _time, _opi, _mx, _my) {
    MoveSprite(_No, _x, _y, _time, _opi, _mx, _my);
}
let MoveSprite = function (_No, _x, _y, _time, _opi, _mx, _my) {
    _opi = typeof _opi !== 'undefined' ? _opi : 255;
    _mx = typeof _mx !== 'undefined' ? _mx : 100;
    _my = typeof _my !== 'undefined' ? _my : 100;
    let _N_Sprite = SelSprite(_No);
    if (GetSpriteData(_No) == null) return;
    if (_x == true) _x = GetSpriteData(_No)._x;
    if (_y == true) _y = GetSpriteData(_No)._y;
    if (_opi == true) _opi = GetSpriteData(_No)._opacity;
    if (_mx == true) _mx = GetSpriteData(_No)._scaleX;
    if (_my == true) _my = GetSpriteData(_No)._scaleY;
    for (let i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            _N_Sprite.children[i].SetEasing(EasingStr); 
            let _setBlendMode = _N_Sprite.children[i].blendMode;
            _N_Sprite.children[i].move(_x, _y, _mx, _my, _opi, _setBlendMode, _time);
        }
    }
    DebugSpriteNo(_No, "MoveSprite");
}
Game_Interpreter.prototype.MoveSpriteAdd = function (_No, addx, addy, _time, _opi) {
    MoveSpriteAdd(_No, addx, addy, _time, _opi);
}
let MoveSpriteAdd = function (_No, addx, addy, _time, _opi) {
    _opi = typeof _opi !== 'undefined' ? _opi : 255;
    let _mx = true;
    let _my = true;
    if (GetSpriteData(_No) == null) return;
    if (_opi == true) _opi = GetSpriteData(_No)._opacity;
    if (_mx == true) _mx = GetSpriteData(_No)._scaleX;
    if (_my == true) _my = GetSpriteData(_No)._scaleY;
    GetSpriteData(_No).SetEasing(EasingStr); 
    setx = GetSpriteData(_No)._x + addx;
    sety = GetSpriteData(_No)._y + addy;
    MoveSprite(_No, setx, sety, _time, _opi, _mx, _my);
}
Game_Interpreter.prototype.AngleSprite = function (_No, _Angle) {
    AngleSprite(_No, _Angle);
}
let AngleSprite = function (_No, _Angle) {
    let _Sprite = GetSpriteData(_No);
    if (_Sprite == null) return;
    let _angl = Math.PI * (_Angle / 180);
    _Sprite.rotation = _angl
    DebugSpriteNo(_No, "AngleSprite");
}
Game_Interpreter.prototype.RotateSprite = function (_No, _Speed) {
    RotateSprite(_No, _Speed);
}
let RotateSprite = function (_No, _Speed) {
    let _Sprite = GetSpriteData(_No);
    if (_Sprite == null) return;
    _Sprite._rotationSpeed = _Speed;
    DebugSpriteNo(_No, "RotateSprite");
}
Game_Interpreter.prototype.SpriteCngColor = function (_No, _ColArr , _Flame) {
    SpriteCngColor(_No, _ColArr , _Flame);
}
let SpriteCngColor = function (_No, _ColArr , _Flame) {
    _ColArr = typeof _ColArr !== 'undefined' ? _ColArr : [0, 0, 0, 0]; 
    _Flame = typeof _Flame !== 'undefined' ? _Flame : 0; 
    let _Sprite = GetSpriteData(_No);
    if (_Sprite == null) return;
    if (_Flame == 0) {
        _Sprite._tone = _ColArr;
        _Sprite.setColorTone(_Sprite._tone);
    } else {
        _Sprite._toneTarget = _ColArr;
        _Sprite._toneDuration = _Flame;
    }
    DebugSpriteNo(_No, "SpriteCngColor");
}
Game_Interpreter.prototype.SpriteCngColorArr = function (_NoArr, _ColArr) {
    SpriteCngColorArr(_NoArr, _ColArr);
}
let SpriteCngColorArr = function (_NoArr, _ColArr) {
    _ColArr = typeof _ColArr !== 'undefined' ? _ColArr : [0, 0, 0, 0]; 
    for (let i = 0; i <= _NoArr.length - 1; i++) {
        SpriteCngColor(_NoArr[i], _ColArr);
    }
}
Game_Interpreter.prototype.SpriteFilterSet = function (_No, _FilterName) {
    let _SetArr = [6000 + _No, _FilterName, 6000 + _No];
    this.N_Plgin("createFilter", _SetArr);
    DebugSpriteNo(_No, "SpriteFilterSet");
}
Game_Interpreter.prototype.SpriteFilterPraSet = function (_No, _PraArr) {
    let _SetArr = [6000 + _No];
    for (let i = 0; i <= _PraArr.length - 1; i++) {
        _SetArr.push(_PraArr[i]);
    }
    this.N_Plgin("setFilter", _SetArr);
}
Game_Interpreter.prototype.spCmp_Update = function () {
    this.CmpSprite_Update();
    this.CmpSprite_Setting_Update(); 
}
let _SpCmpKeepArr = []; 
class SpCmpKeep {
    constructor(_ANo, _Sprite, _xPos, _yPos) {
        this._ANo = _ANo;
        this._Sprite = _Sprite; 
        this._xPos = _xPos;
        this._yPos = _yPos;
    }
}
Game_Interpreter.prototype.CmpSprite_Update = function () {
    let _CkArr = _SpCmpKeepArr.slice();
    _SpCmpKeepArr = []; 
    for (let i = 0; i <= _CkArr.length - 1; i++) {
        this.CmpSprite(_CkArr[i]._ANo, _CkArr[i]._Sprite, _CkArr[i]._xPos, _CkArr[i]._yPos);
    }
}
Game_Interpreter.prototype.CmpSprite = function (_ANo, _BNo, _xPos, _yPos) {
    _xPos = typeof _xPos !== 'undefined' ? _xPos : 0;
    _yPos = typeof _yPos !== 'undefined' ? _yPos : 0;
    let _N_Sprite = SelSprite(_ANo); 
    let _ASprite = GetSpriteData(_ANo);
    let _BSprite = null;
    if (!isNaN(_BNo)) {
        _BSprite = GetSpriteData(_BNo);
        this.DelSprite(_BNo);
    } else {
        _BSprite = _BNo; 
    }
    if (_ASprite == null || _BSprite == null) return; 
    if (!_ASprite.bitmap.isReady() || !_BSprite.bitmap.isReady()) {
        _SpCmpKeepArr.push(new SpCmpKeep(_ANo, _BSprite, _xPos, _yPos));
        return;
    }
    let bitmap_d = _ASprite.bitmap; 
    let bitmap_s = _BSprite.bitmap; 
    let _bitmap_c = new Bitmap(bitmap_d.width, bitmap_d.height);
    _bitmap_c.smooth = true;
    _bitmap_c.bltImage(bitmap_d, 0, 0, bitmap_d.width, bitmap_d.height, 0, 0);
    _bitmap_c.bltImage(bitmap_s, 0, 0, bitmap_s.width, bitmap_s.height, _xPos, _yPos);
    let _cmpSprite = new NSprite(_bitmap_c);
    _cmpSprite.Sprite_Data_Copy(_ASprite);
    this.DelSprite(_ANo);
    let _INNo = _GetSpriteInNo(_ANo);
    _N_Sprite.addChildAt(_cmpSprite, _INNo)
    ViewSpriteArr_Add(_ANo);
    DebugSpriteNo(_ANo, "SpriteFilterSet");
}
let _CmpSprite_Setting_Keep = [];
class _CmpSprite_Setting {
    constructor(_No, _CmpSpriteArr) {
        this._No = _No;
        this._CmpSpriteArr = _CmpSpriteArr;
    }
}
class _CmpSprite {
    constructor(_Path, _x, _y) {
        _x = typeof _x !== 'undefined' ? _x : 0;
        _y = typeof _y !== 'undefined' ? _y : 0;
        this._Path = _Path;
        this._Sprite = null;
        this._x = _x; 
        this._y = _y; 
    }
}
Game_Interpreter.prototype.CmpSprite_Setting = function (_No, _CmpSpriteArr, _xPos, _yPos, _opi, _mx, _my) {
    _opi = typeof _opi !== 'undefined' ? _opi : 255;
    _mx = typeof _mx !== 'undefined' ? _mx : 100;
    _my = typeof _my !== 'undefined' ? _my : 100;
    this.SetSprite(_No, _CmpSpriteArr[0]._Path, _xPos, _yPos, _opi, _mx, _my);
    for (let i = 1; i <= _CmpSpriteArr.length - 1; i++) {
        let _FolPath = _FolPathGet(_CmpSpriteArr[i]._Path);
        let _FileName = _FileNameGet(_CmpSpriteArr[i]._Path);
        let _bitmap = ImageManager.loadBitmap(_FolPath, _FileName, 0, true);
        _CmpSpriteArr[i]._Sprite = new NSprite(_bitmap);
    }
    _CmpSprite_Setting_Keep.push(new _CmpSprite_Setting(_No, _CmpSpriteArr));
    _NSprite_AncNo = 0;
    DebugSpriteNo(_No, "CmpSprite_Setting");
}
Game_Interpreter.prototype.CmpSprite_SettingC = function (_No, _CmpSpriteArr, _xPos, _yPos, _opi, _mx, _my) {
    _NSprite_AncNo = 1;
    this.CmpSprite_Setting(_No, _CmpSpriteArr, _xPos, _yPos, _opi, _mx, _my);
}
Game_Interpreter.prototype.CmpSprite_SettingR = function (_No, _CmpSpriteArr, _xPos, _yPos, _opi, _mx, _my) {
    _NSprite_AncNo = 2;
    this.CmpSprite_Setting(_No, _CmpSpriteArr, _xPos, _yPos, _opi, _mx, _my);
}
Game_Interpreter.prototype.CmpSprite_Setting_Update = function () {
    for (let i = 0; i <= _CmpSprite_Setting_Keep.length - 1; i++) {
        if (this.CmpSprite_Setting_Draw(_CmpSprite_Setting_Keep[i]._No, _CmpSprite_Setting_Keep[i]._CmpSpriteArr)) {
            _CmpSprite_Setting_Keep.splice(i, 1);
            i--; 
        }
    }
}
Game_Interpreter.prototype.CmpSprite_Setting_Draw = function (_No, _CmpSpriteArr) {
    for (let i = 1; i <= _CmpSpriteArr.length - 1; i++) {
        if (!_CmpSpriteArr[i]._Sprite.bitmap.isReady()) return false;
    }
    if (GetSpriteData(_No) == null) return true; 
    if (!GetSpriteData(_No).bitmap.isReady()) {
        return false;
    }
    let _bitmap_base = GetSpriteData(_No).bitmap;
    let _bitmap_c = new Bitmap(_bitmap_base.width, _bitmap_base.height);
    _bitmap_c.smooth = true;
    _bitmap_c.bltImage(_bitmap_base, 0, 0, _bitmap_base.width, _bitmap_base.height, 0, 0);
    for (let i = 1; i <= _CmpSpriteArr.length - 1; i++) {
        let bitmap_s = _CmpSpriteArr[i]._Sprite.bitmap
        _bitmap_c.bltImage(bitmap_s, 0, 0, bitmap_s.width, bitmap_s.height,
            _CmpSpriteArr[i]._x, _CmpSpriteArr[i]._y);
    }
    let _cmpSprite = new NSprite(_bitmap_c);
    _cmpSprite.Sprite_Data_Copy(GetSpriteData(_No));
    this.DelSprite(_No);
    let _N_Sprite = SelSprite(_No); 
    let _INNo = _GetSpriteInNo(_No);
    _N_Sprite.addChildAt(_cmpSprite, _INNo)
    ViewSpriteArr_Add(_No);
    return true;
}
class _DrawStr {
    constructor(_No, _Text, _Size, _x, _y, _opi, _mx, _my, _Font) {
        this._No = _No;
        this._Text = _Text;
        this._Size = _Size;
        this._x = _x;
        this._y = _y;
        this._opi = _opi; 
        this._mx = _mx;
        this._my = _my;
        this._Font = _Font;
    }
}
let _SpriteStrArr = [];
let SpriteSkipCk = function (DrawStr) {
    let _AddFlg = true;
    for (let i = 0; i <= _SpriteStrArr.length - 1; i++) {
        if (_SpriteStrArr[i]._No == DrawStr._No) {
            _AddFlg = false;
            if (_SpriteStrArr[i]._Text != DrawStr._Text ||
                _SpriteStrArr[i]._Size != DrawStr._Size ||
                _SpriteStrArr[i]._Font != DrawStr._Font) {
                _SpriteStrArr[i] = DrawStr;
                return false; 
            }
            if (GetSpriteData(DrawStr._No) == null) return true;
            GetSpriteData(DrawStr._No)._x = DrawStr._x;
            GetSpriteData(DrawStr._No)._y = DrawStr._y;
            GetSpriteData(DrawStr._No)._opacity = DrawStr._opi;
            GetSpriteData(DrawStr._No)._scaleX = DrawStr._mx;
            GetSpriteData(DrawStr._No)._scaleY = DrawStr._my;
            _SpriteStrArr[i] = DrawStr;
            return true;
        }
    }
    if (_AddFlg) {
        _SpriteStrArr.push(DrawStr);
        return false; 
    }
}
let _SpriteStrArr_Dell = function (_No) {
    for (let i = 0; i <= _SpriteStrArr.length - 1; i++) {
        if (_SpriteStrArr[i]._No == _No) {
            _SpriteStrArr.splice(i, 1);
        }
    }
}
let SpriteStrDataGet = function (_PNo) {
    if (GetSpriteData(_PNo) != null) {
        if (GetSpriteData(_PNo).dTextInfo != null) {
            GetSpriteData(_PNo).dTextInfo.originalValue =
                GetSpriteData(_PNo).dTextInfo.originalValue.replace("\n", "");
        }
        return GetSpriteData(_PNo).dTextInfo;
    }
    return null;
}
let _SetdTextInfo = null;
Game_Interpreter.prototype.SpriteStr = function (_No, _Text, _Size, _x, _y, _opi, _mx, _my) {
    _opi = typeof _opi !== 'undefined' ? _opi : 255;
    _mx = typeof _mx !== 'undefined' ? _mx : 100;
    _my = typeof _my !== 'undefined' ? _my : 100;
    let _Font = "MainFont";
    if (D_Text_Cng_font != "") _Font = D_Text_Cng_font;
    if (_OneShotFont != "") _Font = _OneShotFont;
    if (_Font != "") this.pluginCommand("D_TEXT_SETTING", ["FONT", _Font]);
    let _N_Sprite = SelSprite(_No); 
    let args = new Array(_Text, String(_Size));
    if (SpriteStrDataGet(_No) != null) {
        if (SpriteStrDataGet(_No).originalValue == _Text &&
            SpriteStrDataGet(_No).size == _Size &&
            SpriteStrDataGet(_No).font == _Font) {
            GetSpriteData(_No)._x = _x;
            GetSpriteData(_No)._y = _y;
            GetSpriteData(_No)._opacity = _opi;
            GetSpriteData(_No)._scaleX = _mx;
            GetSpriteData(_No)._scaleY = _my;
            this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
            _NSprite_AncNo = 0;
            _OneShotFont = "";
            ViewSpriteArr_Add(_No);
            DebugSpriteNo(_No, "SpriteStr");
            return;
        }
    }
    SpriteStrCounter++;
    this.pluginCommand("D_TEXT", args);
    if ($gameScreen.isSettingDText()) {
        _SetdTextInfo = $gameScreen.getDTextPictureInfo();
        $gameScreen.clearDTextPicture();
        this.DelSprite(_No, true);
        let _sprite = new NSprite();
        _sprite.loadBitmap(); 
        _sprite.No = _No;
        _sprite._x = _x;
        _sprite._y = _y;
        _sprite._opacity = _opi;
        _sprite._scaleX = _mx;
        _sprite._scaleY = _my;
        _sprite.dTextInfo = _SetdTextInfo;
        _sprite.dLayer = N_Sprite_DLayer; 
        _sprite.ParaSet(); 
        let _INNo = _GetSpriteInNo(_No);
        _N_Sprite.addChildAt(_sprite, _INNo);
        _SetdTextInfo = null;
    }
    this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
    _OneShotFont = "";
    ViewSpriteArr_Add(_No);
    DebugSpriteNo(_No, "SpriteStr");
    //console.log("◆SpriteStr::文字表示中::メモリーリーク注意◆");
}
Game_Interpreter.prototype.SpriteStrC = function (_No, _Text, _Size, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 1;
    this.SpriteStr(_No, _Text, _Size, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.SpriteStrR = function (_No, _Text, _Size, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 2;
    this.SpriteStr(_No, _Text, _Size, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.SpriteStrB = function (_No, _Text, _Size, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 3;
    this.SpriteStr(_No, _Text, _Size, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.SpriteStrPop = function (_No, _Text, _Size, _x, _y, _time, _popY) {
    _time = typeof _time !== 'undefined' ? _time : 60;
    _popY = typeof _popY !== 'undefined' ? _popY : 30;
    this.SpriteStr(_No, _Text, _Size, _x, _y);
    this.MoveSprite(_No, _x, _y - _popY, _time, 0);
}
Game_Interpreter.prototype.SpriteStrPopC = function (_No, _Text) {
    _NSprite_AncNo = 1;
    this.SpriteStrPop(_No, _Text, _Size, _x, _y, _time, _popY);
}
Game_Interpreter.prototype.CngSpriteStr = function (_No, _Text, _Size) {
    if (SpriteStrDataGet(_No) != null) {
        let _Font = "MainFont";
        if (D_Text_Cng_font != "") _Font = D_Text_Cng_font;
        if (_OneShotFont != "") _Font = _OneShotFont;
        if (_Font != "") this.pluginCommand("D_TEXT_SETTING", ["FONT", _Font]);
        _Size = typeof _Size !== 'undefined' ? _Size : SpriteStrDataGet(_No).size;
        if (SpriteStrDataGet(_No).originalValue == _Text &&
            SpriteStrDataGet(_No).size == _Size) {
            return; 
        } else {
            let _StData = GetSpriteData(_No);
            _NSprite_AncNo = 0;
            if (_StData._anchor._x == 0.5 && _StData._anchor._y == 0.5) _NSprite_AncNo = 1;
            if (_StData._anchor._x == 1 && _StData._anchor._y == 0) _NSprite_AncNo = 2;
            this.SpriteStr(_No, _Text, _Size, _StData._x, _StData._y, _StData._opacity
                , _StData._scaleX, _StData._scaleY)
        }
        this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
        _OneShotFont = "";
        DebugSpriteNo(_No, "CngSpriteStr");
    }
}
let SpriteAnimeLoopFlg = true;
Game_Interpreter.prototype.PlaySpriteAnime = function (_No, _Path, _CellSu, _CellFlm, _x, _y, _opi, _mx, _my, _CstmArr) {
    var _CstmArr = typeof _CstmArr !== 'undefined' ? _CstmArr : [];
    let _N_Sprite = SelSprite(_No); 
    let _FolPath = _FolPathGet(_Path);
    let _FileName = _FileNameGet(_Path);
    this.DelSprite(_No);
    let _INNo = _GetSpriteInNo(_No);
    let _SetSprite = _NSprite(_No, _FolPath, _FileName, _x, _y, _opi, _mx, _my);
    _SetSprite.AnimeSetting(_CellSu, _CellFlm, SpriteAnimeLoopFlg, _CstmArr);
    SpriteAnimeLoopFlg = true;
    _N_Sprite.addChildAt(_SetSprite, _INNo);
    ViewSpriteArr_Add(_No);
    DebugSpriteNo(_No, "PlaySpriteAnime");
}
Game_Interpreter.prototype.PlaySpriteAnimeC = function (_No, _Path, _CellSu, _CellFlm, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 1;
    this.PlaySpriteAnime(_No, _Path, _CellSu, _CellFlm, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.PlaySpriteAnimeR = function (_No, _Path, _CellSu, _CellFlm, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 2;
    this.PlaySpriteAnime(_No, _Path, _CellSu, _CellFlm, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.SetSpriteCell = function (_No, _Path, _CellSu, _CellNo, _x, _y, _opi, _mx, _my) {
    let _N_Sprite = SelSprite(_No); 
    let _FolPath = _FolPathGet(_Path);
    let _FileName = _FileNameGet(_Path);
    this.DelSprite(_No);
    let _INNo = _GetSpriteInNo(_No);
    let _SetSprite = _NSprite(_No, _FolPath, _FileName, _x, _y, _opi, _mx, _my);
    _SetSprite.CellSet(_CellSu, _CellNo);
    _N_Sprite.addChildAt(_SetSprite, _INNo);
    ViewSpriteArr_Add(_No);
    DebugSpriteNo(_No, "SetSpriteCell");
}
Game_Interpreter.prototype.SetSpriteCellC = function (_No, _Path, _CellSu, _CellNo, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 1;
    this.SetSpriteCell(_No, _Path, _CellSu, _CellNo, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.SetSpriteCellR = function (_No, _Path, _CellSu, _CellNo, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 2;
    this.SetSpriteCell(_No, _Path, _CellSu, _CellNo, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.SpriteCellCng = function (PicNo, _CellNo) {
    _SetSprite = GetSpriteData(PicNo);
    _SetSprite.CellSet(_SetSprite.cellCnt, _CellNo);
}
Game_Interpreter.prototype.KeepSprite = function (_SaveSprite) {
    for (let i = 0; i <= N_Sprite_L.children.length - 1; i++) {
        _SaveSprite[0].push(N_Sprite_L.children[i]);
        N_Sprite_L.removeChild(N_Sprite_L.children[i]);
        i--;
    }
    for (let i = 0; i <= N_Sprite_M.children.length - 1; i++) {
        _SaveSprite[1].push(N_Sprite_M.children[i]);
        N_Sprite_M.removeChild(N_Sprite_M.children[i]);
        i--;
    }
    for (let i = 0; i <= N_Sprite_T.children.length - 1; i++) {
        _SaveSprite[2].push(N_Sprite_T.children[i]);
        N_Sprite_T.removeChild(N_Sprite_T.children[i]);
        i--;
    }
}
Game_Interpreter.prototype.ReturnSprite = function (_SaveSprite) {
    for (let i = 0; i <= _SaveSprite[0].length - 1; i++) {
        N_Sprite_L.addChild(_SaveSprite[0][i]);
    }
    for (let i = 0; i <= _SaveSprite[1].length - 1; i++) {
        N_Sprite_M.addChild(_SaveSprite[1][i]);
    }
    for (let i = 0; i <= _SaveSprite[2].length - 1; i++) {
        N_Sprite_T.addChild(_SaveSprite[2][i]);
    }
}
let GetSpriteData = function (_No) {
    let _N_Sprite = SelSprite(_No); 
    if (_N_Sprite == undefined) return null;
    for (let i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            return _N_Sprite.children[i];
        }
    }
    return null;
}
let _GetSpriteInNo = function (_No) {
    let _N_Sprite = SelSprite(_No); 
    for (let i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No > _No) {
            return i;
        }
    }
    return _N_Sprite.children.length;
}
Game_Interpreter.prototype.KeepSetSpriteStr = function (_No, _Data, _x, _y, _opi, _mx, _my, _blendMode) {
    _x = typeof _x !== 'undefined' ? _x : 0;
    _y = typeof _y !== 'undefined' ? _y : 0;
    _opi = typeof _opi !== 'undefined' ? _opi : 255;
    _mx = typeof _mx !== 'undefined' ? _mx : 100;
    _my = typeof _my !== 'undefined' ? _my : 100;
    this.DelSprite(_No, true);
    let _sprite = _Data; 
    _sprite.No = _No;
    _sprite._x = _x;
    _sprite._y = _y;
    _sprite._opacity = _opi;
    _sprite._scaleX = _mx;
    _sprite._scaleY = _my;
    _sprite.ParaSet(); 
    let _N_Sprite = SelSprite(_No); 
    let _INNo = _GetSpriteInNo(_No);
    _N_Sprite.addChildAt(_sprite, _INNo);
    DebugSpriteNo(_No, "KeepSetSpriteStr");
}
function overPointerSpCk(_No) {
    if (MouseStopFlame > MouseMukoFlame || N_Input_Stop > 0) return false; 
    return $gameScreen.isPointerInnerSprite(_No);
}
function overPointerSpCkTm(_No) {
    if (MouseStopFlame > MouseMukoFlame || N_Input_Stop > 0) return false; 
    return $gameScreen.isPointerInnerSpriteTm(_No);
}
let _p_sp_tmFlg = false;
function overPointerSpCkArr(_NoArr) {
    if (MouseStopFlame > MouseMukoFlame || N_Input_Stop > 0) return -1; 
    let _RtnNo = -1;
    for (let i = 0; i <= _NoArr.length - 1; i++) {
        if (_p_sp_tmFlg) {
            if (overPointerSpCkTm(_NoArr[i])) {
                if (_RtnNo < _NoArr[i]) _RtnNo = _NoArr[i];
            }
        } else {
            if (overPointerSpCk(_NoArr[i])) {
                if (_RtnNo < _NoArr[i]) _RtnNo = _NoArr[i];
            }
        }
    }
    _p_sp_tmFlg = false;
    return _RtnNo;
}
function overPointerSpCkArr_GetNo(_PicNoArr) {
    for (let i = 0; i <= _PicNoArr.length - 1; i++) {
        if (this.overPointerSpCk(_PicNoArr[i])) {
            return i;
        }
    }
    return -1;
}
function overPointerSpCkArrTm(_NoArr) {
    _p_sp_tmFlg = true;
    return overPointerSpCkArr(_NoArr);
}
function overPointerSpCkArrTm_GetNo(_PicNoArr) {
    for (let i = 0; i <= _PicNoArr.length - 1; i++) {
        if (this.overPointerSpCkTm(_PicNoArr[i])) {
            return i;
        }
    }
    return -1;
}
Game_Interpreter.prototype.SpriteObjGet = function (_No) {
    return GetSpriteData(_No);
}
Game_Interpreter.prototype.SpriteInObj = function (_No, _Sprite, _x, _y, _opi, _mx, _my, _blendMode) {
    _x = typeof _x !== 'undefined' ? _x : _Sprite._x;
    _y = typeof _y !== 'undefined' ? _y : _Sprite._y;
    _opi = typeof _opi !== 'undefined' ? _opi : _Sprite._opacity;
    _mx = typeof _mx !== 'undefined' ? _mx : _Sprite._scaleX;
    _my = typeof _my !== 'undefined' ? _my : _Sprite._scaleY;
    _blendMode = typeof _blendMode !== 'undefined' ? _blendMode : _Sprite.blendMode;
    this.DelSprite(_No);
    _Sprite.No = _No;
    _Sprite._x = _x;
    _Sprite._y = _y;
    _Sprite._opacity = _opi;
    _Sprite._scaleX = _mx;
    _Sprite._scaleY = _my;
    _Sprite.blendMode = _blendMode;
    let _N_Sprite = SelSprite(_No); 
    let _INNo = _GetSpriteInNo(_No);
    _Sprite.No = _No;
    _N_Sprite.addChildAt(_Sprite, _INNo);
    ViewSpriteArr_Add(_No);
    DebugSpriteNo(_No, "SpriteInObj");
}
let SpriteKeep = [];
Game_Interpreter.prototype.AllSaveSprite = function () {
    for (let i = 0; i < N_Sprite_T.children.length; i++) {
        SpriteKeep.push(N_Sprite_T.children[i]);
    }
    for (let i = 0; i < N_Sprite_M.children.length; i++) {
        SpriteKeep.push(N_Sprite_M.children[i]);
    }
    for (let i = 0; i < N_Sprite_L.children.length; i++) {
        SpriteKeep.push(N_Sprite_L.children[i]);
    }
}
Game_Interpreter.prototype.AllSpriteLoad = function () {
    for (let i = 0; i < SpriteKeep.length; i++) {
        this.SpriteInObj(SpriteKeep[i].No, SpriteKeep[i]);
    }
    SpriteKeep = [];
}
Game_Interpreter.prototype.NTest = function () {
    let _FolPath = "enemies/";
    let _CmpArr = [
        new _CmpSprite(_FolPath + "Trash_WB"),
        new _CmpSprite(_FolPath + "spina"),
        new _CmpSprite(_FolPath + "Trash_W"),
        new _CmpSprite(_FolPath + "kajua_A", 100)
    ]
    this.CmpSprite_Setting(1, _CmpArr, 100, 100);
}
Game_Interpreter.prototype.NTest2 = function () {
    let _FolPath = "enemies/";
    this.SetSprite(1, _FolPath + "Trash_WB", 100, 100)
}
let N_Sprite_DLayer = 0; 
let _NSprite = function (_No, _FolPath, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    _opi = typeof _opi !== 'undefined' ? _opi : 255;
    _mx = typeof _mx !== 'undefined' ? _mx : 100;
    _my = typeof _my !== 'undefined' ? _my : 100;
    _blendMode = typeof _blendMode !== 'undefined' ? _blendMode : 0;
    let _bitmap = null;
    if (_FolPath != "" && _Path != "") {
        _bitmap = ImageManager.loadBitmap(_FolPath, _Path, 0, true);
    }
    let _sprite = new NSprite(_bitmap);
    _sprite._name = _Path;
    _sprite.No = _No;
    _sprite._x = _x;
    _sprite._y = _y;
    _sprite._opacity = _opi;
    _sprite._scaleX = _mx;
    _sprite._scaleY = _my;
    _sprite.blendMode = _blendMode;
    _sprite.dLayer = N_Sprite_DLayer; 
    _sprite.ParaSet(); 
    return _sprite;
}
function NSprite() {
    this.initialize.apply(this, arguments);
}
NSprite.prototype = Object.create(Sprite.prototype);
NSprite.prototype.constructor = NSprite;
NSprite.prototype.initialize = function (_bitmap) {
    Sprite.prototype.initialize.call(this, _bitmap);
    this.initBasic();
    this.initTarget();
    this.initTone();
    this.initRotation();
    this.AnchorSet(); 
    this.initAnimation(); 
};
NSprite.prototype.initBasic = function () {
    this._name = '';
    this._origin = 0;
    this._x = 0;
    this._y = 0;
    this._scaleX = 100;
    this._scaleY = 100;
    this._opacity = 255;
    this._blendMode = 0;
    this.dTextInfo = null;
};
NSprite.prototype.initTarget = function () {
    this._targetX = this._x;
    this._targetY = this._y;
    this._targetScaleX = this._scaleX;
    this._targetScaleY = this._scaleY;
    this._targetOpacity = this._opacity;
    this._duration = 0;
};
NSprite.prototype.initTone = function () {
    this._tone = null;
    this._toneTarget = null;
    this._toneDuration = 0;
};
NSprite.prototype.initRotation = function () {
    this._angle = 0;
    this._rotationSpeed = 0;
};
NSprite.prototype.move = function (x, y, scaleX, scaleY, opacity, blendMode, duration) {
    this._targetX = x;
    this._targetY = y;
    this._targetScaleX = scaleX;
    this._targetScaleY = scaleY;
    this._targetOpacity = opacity;
    this._blendMode = blendMode;
    this._duration = duration;
};
NSprite.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateMove();
    this.updateTone();
    this.updateRotation();
    this.updateAnimation();
}
NSprite.prototype.ParaSet = function () {
    this.x = this._x;
    this.y = this._y;
    this.opacity = this._opacity;
    this.scale.x = (this._scaleX / 100);
    this.scale.y = (this._scaleY / 100);
}
NSprite.prototype.updateMove = function () {
    if (this._duration > 0) {
        let d = this._duration;
        this._x = (this._x * (d - 1) + this._targetX) / d;
        this._y = (this._y * (d - 1) + this._targetY) / d;
        this._scaleX = (this._scaleX * (d - 1) + this._targetScaleX) / d;
        this._scaleY = (this._scaleY * (d - 1) + this._targetScaleY) / d;
        this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
        this._duration--;
    }
    this.ParaSet(); 
}
NSprite.prototype.updateTone = function () {
    if (this._toneDuration > 0) {
        if (this._tone == null || this._toneTarget == null) {
            this._toneDuration = 0;
            return;
        }
        let d = this._toneDuration;
        for (let i = 0; i < this._tone.length; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this.setColorTone(this._tone);
        this._toneDuration--;
    }
};
NSprite.prototype.updateRotation = function () {
    if (this._rotationSpeed !== 0) {
        this._angle += this._rotationSpeed / 2;
        let _angl = Math.PI * (this._angle / 180);
        this.rotation = _angl
    }
};
let _NSprite_AncNo = 0; 
NSprite.prototype.AnchorSet = function () {
    switch (_NSprite_AncNo) {
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
    _NSprite_AncNo = 0; 
}
NSprite.prototype.Sprite_Data_Copy = function (_SetSprite) {
    this.No = _SetSprite.No;
    this._x = _SetSprite._x;
    this._y = _SetSprite._y;
    this._scaleX = _SetSprite._scaleX;
    this._scaleY = _SetSprite._scaleY;
    this._opacity = _SetSprite._opacity;
    this._blendMode = _SetSprite._blendMode;
    this._targetX = _SetSprite._targetX;
    this._targetY = _SetSprite._targetY;
    this._targetScaleX = _SetSprite._targetScaleX;
    this._targetScaleY = _SetSprite._targetScaleY;
    this._targetOpacity = _SetSprite._targetOpacity;
    this._duration = _SetSprite._duration;
    this._tone = _SetSprite._tone;
    this._toneTarget = _SetSprite._toneTarget;
    this._toneDuration = _SetSprite._toneDuration;
    this._angle = _SetSprite._angle;
    this._rotationSpeed = _SetSprite._rotationSpeed;
    this.anchor.x = _SetSprite.anchor.x;
    this.anchor.y = _SetSprite.anchor.y;
    this._time = _SetSprite._time;
    this._easingX = _SetSprite._easingX;
    this._easingY = _SetSprite._easingY;
    this._easingSx = _SetSprite._easingSx;
    this._easingSy = _SetSprite._easingSy;
    this._easingOp = _SetSprite._easingOp;
}
NSprite.prototype.initAnimation = function () {
    this.AnimeFlg = false; 
    this.Aflame = 0;    
    this.ACngFlame = 0; 
    this.cellCnt = 0;   
    this.ALoopFlg = false;  
    this.CstmCnt = 0; 
    this.CstmArr = [];  
    this.CellFlg = false; 
    this.CellNo = 0; 
};
NSprite.prototype.AnimeSetting = function (_CellCnt, _ACngFlame, _LoopFlg, _CstmArr) {
    _LoopFlg = typeof _LoopFlg !== 'undefined' ? _LoopFlg : true;
    _CstmArr = typeof _CstmArr !== 'undefined' ? _CstmArr : [];
    this.AnimeFlg = true;
    this.cellCnt = _CellCnt;   
    this.ACngFlame = _ACngFlame; 
    this.ALoopFlg = _LoopFlg;  
    this.CstmCnt = 0; 
    this.CstmArr = _CstmArr;  
    let width = this.bitmap.width / this.cellCnt;
    this.setFrame(0, 0, width, this.bitmap.height);
}
NSprite.prototype.updateAnimation = function () {
    if (this.AnimeFlg) {
        this.Aflame++; 
        if (this.Aflame % this.ACngFlame == 0) { 
            let width = this.bitmap.width / this.cellCnt;
            let x = 0;
            if (this.CstmArr.length == 0) {
                let _NowCell = Math.floor(this.Aflame / this.ACngFlame);
                if (_NowCell == this.cellCnt) {
                    if (this.ALoopFlg) {
                        this.Aflame = 0;
                        _NowCell = 0;
                    } else {
                        this.AnimeFlg = false;
                        return;
                    }
                }
                x = _NowCell * width;
            } else {
                this.CstmCnt++;
                if (this.CstmCnt >= this.CstmArr.length) {
                    this.CstmCnt = 0;
                }
                x = (this.CstmArr[this.CstmCnt] - 1) * width;
            }
            this.setFrame(x, 0, width, this.bitmap.height);
        }
    }
    if (this.CellFlg && this.bitmap.isReady()) {
        let width = this.bitmap.width / this.cellCnt;
        let x = this.CellNo * width;
        this.setFrame(x, 0, width, this.bitmap.height);
        this.CellFlg = false;
    }
}
NSprite.prototype.CellSet = function (_CellSu, _CellNo) {
    this.cellCnt = _CellSu;   
    this.CellNo = _CellNo;
    this.CellFlg = true;
    this.AnimeFlg = false;
}
let N_SpriteStacArr = [];
Game_Interpreter.prototype.StacSpriteUpdate = function () {
    for (let i = 0; i <= N_SpriteStacArr.length - 1; i++) {
        let _stac = N_SpriteStacArr[i].stacArr[0];
        let _data = _stac.data;
        if (!N_SpriteStacArr[i].stacArr[0].doFlg) {
            let _BefEasingStr = EasingStr;
            EasingStr = _stac.easing;
            switch (_stac.type) {
                case picStacType.SetPict: 
                    NP_原点 = _stac.NP_原点;
                    switch (NP_原点) {
                        case 0:
                            this.SetSprite(_data[0], _data[1], _data[2], _data[3],
                                _data[4], _data[5], _data[6], _data[7]);
                            break;
                        case 1:
                            this.SetSpriteC(_data[0], _data[1], _data[2], _data[3],
                                _data[4], _data[5], _data[6], _data[7]);
                            break;
                    }
                    break;
                case picStacType.MovePict: 
                    this.MoveSprite(_data[0], _data[1], _data[2], _data[3], _data[4], _data[5], _data[6]);
                    break;
                case picStacType.MovePictAdd: 
                    this.MoveSpriteAdd(_data[0], _data[1], _data[2], _data[3], _data[4], _data[5], _data[6]);
                    break;
                case picStacType.DelPict: 
                    this.DelSprite(_data[0]);
                    break;
                case picStacType.PicCngColor: 
                    this.SpriteCngColor(_data[0], _data[1], _data[2]);
                    break;
                case picStacType.Wait: 
                    break;
                case picStacType.PlayPtcPic: 
                    this.PlayPtcSc(_data[0], _data[1], _data[2]);
                    break;
                case picStacType.PlayPtcComboPic: 
                    this.NPtcComboSet(_data[0], Ptc_CType.Pic, [_data[1], _data[2]]);
                    break;
                case picStacType.RotatePic: 
                    //$gameScreen.rotatePicture(_data[0], _data[1]);
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
                N_SpriteStacArr[i].stacArr.shift();
                if (N_SpriteStacArr[i].stacArr.length == 0) {
                    N_SpriteStacArr.splice(i, 1);
                    i--;
                }
            }
        }
    }
}
