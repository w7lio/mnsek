/*:ja
 * @plugindesc 
 */
DataManager._databaseFiles.push({ 
    name:'$Nupu_MV_Data',
    src:'Nupu_MV_Data.json'
});
DataManager._databaseFiles.push({ 
    name:'$N_Yarimon_DB' ,
    src:'N_Yarimon_DB.json'
});
DataManager._databaseFiles.push({ 
    name:'$N_Yariman_DB' ,
    src:'N_YariMan.json'
});
DataManager._databaseFiles.push({ 
    name:'$Nupu_Yariman_Img' ,
    src:'Nupu_Yariman_Img.json'
});
DataManager._databaseFiles.push({ 
    name:'$N_LaboratoryData' ,
    src:'N_LaboratoryData.json'
});
var DbgFlg = true;          
var AllAgeFlg = false;      
var LngDevFlg = false;       
var Lng仮Flg = true;        
let DbgPNo = [270];         
const MouseMukoFlame = 180; 
const VN_BefZureNo = 48;    
const VN_BefSaveNo = 49;    
const VN_Dbg_TemotiKeep = 400;  
const VN_SaveStr_1 = 50;    
const VN_SaveStr_2 = 51;    
const VN_SaveStr_3 = 52;    
const VN_AutoSave = 53;    
N_Sprite_TNo = 250;
const SW_Ending = 12;
const VoiceMuteSwNo = 11; 
const NanidVarNo = 43;  
class Nanid {
    static get Nomal() { return 0 }
    static get Easy() { return 1 }
}
const MasterVolVarNo = 44; 
const VoiceVolVarNo = 45; 
const F_MasterVol = 30; 
const F_BGMVol = 50;    
const F_SEVol = 50;     
const F_VoiceVol = 50;  
utakata.CommonSaveManager._targetSwitchList = [VoiceMuteSwNo , SW_Ending];  
utakata.CommonSaveManager._targetVariableList =
    [
        NanidVarNo ,
        MasterVolVarNo , VoiceVolVarNo ,
        VN_BefZureNo ,VN_BefSaveNo ,
        VN_SaveStr_1 , VN_SaveStr_2 , VN_SaveStr_3, VN_AutoSave ,
        VN_Dbg_TemotiKeep
    ]; 
Window_Base.prototype.standardFontFace = function() {
    switch (LngMode) {
        case "ko":
            return 'GameFont_KO';
        case "cn":
        case "tc":
            return 'GameFont_CN';
        default:
            return 'GameFont';
    }
};
Game_System.prototype.initMessageFontSettings = function() {
    switch (LngMode) {
        case "ko":
            this._msgFontName = 'GameFont_KO';
            break;
        case "cn":
        case "tc":
            this._msgFontName = 'GameFont_CN';
            break;
        default:
            this._msgFontName = 'GameFont';
            break;
    }
    this._msgFontSize = Yanfly.Param.MSGFontSize;
    this._msgFontOutline = Yanfly.Param.MSGFontOutline;
};
const N_Ptcls = [
["Antena_1","---",""]
,["TameAtk","character","溜め攻撃準備"]
,["Ticket_Make","character","チケット作竜"]
,["Hakase_1","---",""]
];
const N_PtcSe = [
["File_Name",5,"audio"]
,["C_RaviCrg",15,"battle_filed"]
];
