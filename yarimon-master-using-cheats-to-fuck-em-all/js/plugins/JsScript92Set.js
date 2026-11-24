const SW_Trial = 500;   
const SW_Nomal = 40;    
let _TrialImgArr = [];
let _NomalImgArr = [];
let Trial_FileSet = function(_FileName) {
    let ckArr = _FileName.split('/');
    if(_TrialImgArr.indexOf(ckArr[ckArr.length - 1]) != -1 && $gameSwitches.value(SW_Trial)) {
        _FileName += "_Trial";
    }
    if(_NomalImgArr.indexOf(ckArr[ckArr.length - 1]) != -1 && $gameSwitches.value(SW_Nomal)) {
        _FileName += "_Nomal";
    }
    return _FileName;
}
let NTrial_SetPict = SetPict;
SetPict = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    FileName = Trial_FileSet(FileName);
    NTrial_SetPict.apply(this, arguments);
}
let NTrial_SetSprite = SetSprite;
SetSprite = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    _Path = Trial_FileSet(_Path);
    NTrial_SetSprite.apply(this, arguments);
}
let NTrial_FileNameGet = _FileNameGet;
_FileNameGet = function(_Path){
    FileName = Trial_FileSet(_Path);
    NTrial_FileNameGet.apply(this, arguments);
    if(FileName.lastIndexOf("/") == -1) return FileName;
    return FileName.slice(FileName.lastIndexOf("/") + 1);
}
