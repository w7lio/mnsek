/*:ja
 * @plugindesc 
 */
/*
    MessageWindowPopup.js 必須＆改造
*/
const picPath = "pictures/H_Scene/";   
const FukiPicPath = "pictures/H_Scene/Fukidasi/";   
let _HTalkFlg = false;  
class H_Set { 
    constructor(_FolName, _mName, _Par, _x, _y) {
        this._FolName = _FolName; 
        this._mName = _mName;   
        this._Par = _Par;   
        this._x = _x;       
        this._y = _y;       
    }
}
class Chara_FPos {
    constructor(_folName, _FPosArr) {
        this._folName = _folName;
        this._FPosArr = _FPosArr;
    }
}
class _CFPos {
    constructor(_mName, _x, _y) {
        this._mName = _mName;  
        this._x = _x;      
        this._y = _y;      
    }
}
class Fuki {
    constructor(_FName, _FPosArr) {
        this._FName = _FName;
        this._FPosArr = _FPosArr;
    }
}
class F_Opt {
    constructor(_pWidth, _ZX, _ZY) {
        this._pWidth = _pWidth; 
        this._ZX = _ZX;         
        this._ZY = _ZY;         
    }
}
const HPicPath = "pictures/H_Scene/";
let fuki_vflg = false; 
let txt_haba = 0;   
let FPos;   
Game_Interpreter.prototype.H_CView = function (_folName, _mName, _PNo) {
    let _Mag = 100;
    let _zureX = 0; let _zureY = 0;
    for (let i = 0; i <= $Nupu_MV_Data.mv_Chara.length - 1; i++) {
        if ($Nupu_MV_Data.mv_Chara[i].name != _folName) continue;
        for (let j = 0; j <= $Nupu_MV_Data.mv_Chara[i].picDataList.length - 1; j++) {
            let _ckmName = $Nupu_MV_Data.mv_Chara[i].picDataList[j].name;
            if (_ckmName == _mName) {
                _Mag = $Nupu_MV_Data.mv_Chara[i].picDataList[j]._拡大率;
                _zureX = $Nupu_MV_Data.mv_Chara[i].picDataList[j]._ズレX;
                _zureY = $Nupu_MV_Data.mv_Chara[i].picDataList[j]._ズレY;
                break;
            }
        }
        break;
    }
    let _picNm = HPicPath + _folName + "/" + _mName + "_" + _PNo;
    this.SetSprite(PN_HScene, _picNm, _zureX, _zureY, 255, _Mag, _Mag);
}
Game_Interpreter.prototype.H_AnimeLoading = function (_animeData) {
    for (let i = 0; i < _animeData.flameList.length; i++) {
        let ckData = _animeData.flameList[i];
        ImageManager.loadBitmap("", HPicPath + _animeData._CharaName + "/" + ckData.picPath, 0, true);
    }
}
let _FImgPos = new Pos2D(0, 0);
let _FTxtPos = new Pos2D(0, 0);
let FukiName = "Nomal"; 
let NTH_Fuki_Update = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    NTH_Fuki_Update.call(this)
    if (fuki_vflg && _HTalkFlg && $gameSwitches.value(SW_会話中)) {
        if (_FImgPos._x == 0 && _FImgPos._y == 0) return;
        let _SetX = _FImgPos._x;
        let _SetY = _FImgPos._y;
        this.N_Plgin("MWP_FREE", [_FImgPos._x + _FTxtPos._x, _FImgPos._y + _FTxtPos._y]);
        if (FukiName == "") return; 
        fuki_vflg = false;
    }
}
let NTH_Cd101 = Game_Interpreter.prototype.command101;
Game_Interpreter.prototype.command101 = function () {
    NTH_Cd101.call(this);
    if (_HTalkFlg) {
        if ($gameMessage._texts.length > 0) {
            $gameMessage._texts[0] = "\\OW[4]\\OC[0]\\C[15]" + $gameMessage._texts[0];
        }
    }
}
