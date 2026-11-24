/* 
var LngMode = "jp"; 
var fs = require('fs');
LngMode = fs.readFileSync("lng.txt", 'utf-8');
 */
try {
    DataManager._databaseFiles.push({ 
        name:'$N_Localize' ,
        src:'N_Localize.json'
    });
} catch (e) {
    console.log("◆ N_Localize.json：スクリプト翻訳ファイル は 存在しません ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆");
}
let _LngImgArr = [];
let Lng_FileSet = function(_FileName) {
    let ckArr = _FileName.split('/');
    if(_LngImgArr.indexOf(ckArr[ckArr.length - 1]) != -1) {
        if (LngMode == "en") _FileName += "_en";
        if (LngMode == "cn") _FileName += "_cn";
        if (LngMode == "tc") _FileName += "_tc";
        if (LngMode == "ko") _FileName += "_ko";
    }
    return _FileName;
}
let Nlng_SetPict = SetPict;
SetPict = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    FileName = Lng_FileSet(FileName);
    Nlng_SetPict.apply(this, arguments);
}
let Nlng_SetSprite = SetSprite;
SetSprite = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    _Path = Lng_FileSet(_Path);
    Nlng_SetSprite.apply(this, arguments);
}
let Nlng_FileNameGet = _FileNameGet;
_FileNameGet = function(_Path){
    let fileName = Lng_FileSet(_Path);
    Nlng_FileNameGet.apply(this, arguments);
    if(fileName.lastIndexOf("/") == -1) return fileName;
    return fileName.slice(fileName.lastIndexOf("/") + 1);
}
let NLngStrGet = function (jpStr , values) {
    values = typeof values !== 'undefined' ? values : [];
    var rtnStr = jpStr;
    for (let i = 0; i <= $N_Localize.length - 1; i++) {
        var breakFlg = false;
        if ($N_Localize[i].jp == rtnStr) {
            for (let j = 0; j <= $N_Localize[i].trnDatas.length - 1; j++) {
                if ($N_Localize[i].trnDatas[j].name == LngMode) {
                    rtnStr = $N_Localize[i].trnDatas[j].str;
                    breakFlg = true;
                    break;
                }
            }
        }
        if (breakFlg) break;
    }
    if (Array.isArray(values)) {
        for (let i = 0; i <= values.length - 1; i++) {
            if (i == 0) rtnStr = rtnStr.replace("<value>" , values[0]); 
            rtnStr = rtnStr.replace("<value" + (i + 1) + ">" , values[i]);
        }
    } else {
        rtnStr = rtnStr.replace("<value>" , values);
        rtnStr = rtnStr.replace("<value1>" , values);
    }
    return rtnStr;
}
class LngCngData {
    constructor(_jp , _trnDatas) {
        this.jp = _jp;
        this.trnDatas = _trnDatas;
    }
}
class LngArrData {
    constructor(_name , _str) {
        this.name = _name;
        this.str = _str;
    }
}
let N_LocalizeAddData = function (jpStr , _LocArr) {
    if (_LocArr == null || jpStr == "") return;
    for (let i = 0; i <= $N_Localize.length - 1; i++) {
        if ($N_Localize[i].jp == jpStr) return;
    }
    var AddLngArr = [];
    for (let i = 0; i < _LocArr.length; i++)
        AddLngArr.push(new LngArrData(_LocArr[i].locName , _LocArr[i].value))
    var AddNewLocData = new LngCngData(jpStr , AddLngArr);
    $N_Localize.push(AddNewLocData);
}
