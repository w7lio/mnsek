/*
MenuBox
    Select
    Menu_Zukan
        Zukan_YZukan
            Select
            Detail
        Zukan_MZukan
            Select
            Detail
    Menu_Yarimon
        Select
        Detail
    Menu_Save
        Select
    Menu_Option
        Select
*/
class MenuBox extends Select_ModeBox {
    static get Open(){ return "Open"}
    static get Close(){ return "Close"}
    static get Select(){ return "Select"}
    static get Zukan(){ return "Zukan"}
    static get Yarimon(){ return "Yarimon"}
    static get Dougu(){ return "Dougu"}
    static get Save(){ return "Save"}
    static get Option(){ return "Option"}
    static get FastTrb() { return "FastTrb"}
    static get MapCheck() { return "MapCheck"}
    constructor() { 
        super("MenuBox" , [
              new ModeBox(MenuBox.Open)
            , new ModeBox(MenuBox.Close)
            , new ModeBox(MenuBox.Select)
            , new Menu_Zukan() 
            , new Menu_Yarimon() 
            , new Menu_Dougu([
                emDougu._道具,
                emDougu._回復,
                emDougu._戦闘,
                emDougu._大切
            ]) 
            , new Menu_Save() 
            , new Menu_Option() 
            , new ModeBox(MenuBox.FastTrb) 
            , new ModeBox(MenuBox.MapCheck) 
        ]);
        this.ModeCng(MenuBox.Open); 
        this.resetModeName = MenuBox.Open;
        this.isOpen = false; 
        this.SubConstructor();
    }
    SubConstructor() {
        this.selecterNo = 0; 
        this.selectNoMax = 5; 
        this.selecterNo2 = 0;
        this.selectNoMax2 = 1; 
    }
    select_OkNoCng(){
        if (this.selecterNo2 != 0) {
            m_FastTrb_Flame = 0;
            m_Map_Flame = 0;
            if(this.selecterNo2 == 1) {
                if(this.selecterNo > 2 && $gameSwitches.value(SW_FastTrFlg)) {
                    if ($gameSwitches.value(SW_FastTrFlg)) {
                        this.ModeCng(MenuBox.FastTrb);
                    } else {
                        this.ModeCng(MenuBox.MapCheck);
                    }
                } else {
                    this.ModeCng(MenuBox.Zukan);
                    Zukan_YarimanFlg = true;
                }
            } else {
                this.ModeCng(MenuBox.MapCheck);
            }
            return;
        }
        switch (this.selecterNo) {
            case 0: 
                this.ModeCng(MenuBox.Zukan);
                Zukan_YarimanFlg = false;
                break;
            case 1: 
                this.ModeCng(MenuBox.Yarimon);
                break;
            case 2: 
                this.ModeCng(MenuBox.Dougu);
                break;
            case 3: 
                this.ModeCng(MenuBox.Save);
                break;
            case 4: 
                this.ModeCng(MenuBox.Option);
                break;
            case 5: 
                this.ModeCng(MenuBox.Close);
                break;
        }
    }
    Update() {
        super.Update();
    }
    Menu_Open() {
        this.isOpen = true; 
    }
    static get IsMenuClose() {
        return (this.modeName == MenuBox.Select && this.flame >= 10);
    }
    Menu_Close() { 
        MenuFlgSwich = false;
        this.isOpen = false; 
        this.Reset();
    }
    Reset() {
        super.Reset();
    }
}
class Menu_Yarimon extends Select_ModeBox {
    static get Select(){ return "Select"} 
    static get Sort(){ return "Sort"}
    static get Detail(){ return "Detail"}
    static get YesNo(){ return "YesNo"}
    constructor(){ 
        super(MenuBox.Yarimon , [
            new ModeBox(Menu_Yarimon.Select) ,
            new ModeBox(Menu_Yarimon.Sort) ,
            new Menu_Yarimon_Detail() ,
            new ModeBox(Menu_Yarimon_Detail.YesNo),
        ]);
        this.ModeCng(Menu_Yarimon.Select); 
        this.resetModeName = Menu_Yarimon.Select;
        this.selectNoMax = 2;
    }
    Update() {
        super.Update();
    }
}
class Menu_Yarimon_Detail extends Select_ModeBox {
    static get Select(){ return "Select"} 
    static get Detail(){ return "Detail"} 
    static get WazaCng(){ return "WazaCng"} 
    constructor() {
        super(Menu_Yarimon.Detail, [
            new ModeBox(Menu_Yarimon_Detail.Select),
            new Menu_Dougu_Detail_YarimonSelect()
        ]);
        this.ModeCng(Menu_Yarimon_Detail.Select); 
        this.resetModeName = Menu_Yarimon_Detail.Select;
        this.selectNoMax = 1;
        this.selectNoMax2 = 1;
        this.selecterResetFlg = true; 
        this.selYarimon = null;
    }
    Update() {
        super.Update();
    }
}
class Menu_Yarimon_YesNo extends Select_ModeBox {
    static get Select(){ return "Select"} 
    constructor() {
        super(Menu_Yarimon.YesNo, [
            new ModeBox(Menu_Yarimon_YesNo.Select)
        ]);
        this.ModeCng(Menu_Yarimon_YesNo.Select); 
        this.resetModeName = Menu_Yarimon_YesNo.Select;
        this.selectNoMax = 1;
    }
    Update() {
        super.Update();
    }
}
let emDougu = {
    _道具:1 ,
    _回復:2 ,
    _戦闘:3 ,
    _大切:4
};
let GetBunruiNo = function (bunruiName) {
    if(bunruiName == "道具") return emDougu._道具;
    if(bunruiName == "回復") return emDougu._回復;
    if(bunruiName == "戦闘") return emDougu._戦闘;
    if(bunruiName == "大切") return emDougu._大切;
    return -1;
}
class Menu_Dougu extends Select_ModeBox {
    static get Select(){ return "Select"} 
    static get Detail(){ return "Detail"} 
    constructor(_btnNoArr) {
        super(MenuBox.Dougu , [
            new ModeBox(Menu_Dougu.Select), 
            new Menu_Dougu_Detail()  
        ]);
        this.ModeCng(Menu_Dougu.Select); 
        this.resetModeName = Menu_Dougu.Select;
        this.btnNoArr = _btnNoArr;
        this.selectNoMax = _btnNoArr.length - 1;
        this.selItemBunrui = null;
    }
    Update() {
        super.Update();
    }
}
class Menu_Dougu_Detail extends Select_ModeBox {
    static get Select() { return "Select"}
    static get YarimonSelect() { return "YarimonSelect"} 
    static get YesNo() { return "YesNo"} 
    static get Using() { return "Using"} 
    constructor() {
        super(Menu_Dougu.Detail, [
            new ModeBox(Menu_Dougu_Detail.Select),
            new Menu_Dougu_Detail_YarimonSelect(),
            new Menu_Dougu_Detail_YesNo(),
            new ModeBox(Menu_Dougu_Detail.Using)
        ]);
        this.ModeCng(Menu_Dougu_Detail.Select); 
        this.resetModeName = Menu_Dougu_Detail.Select;
        this.selectNoMax = 4;
        this.selectNoMax2 = 1;
        this.selectNoMaxY = 4;
        this.selectNoMaxX = 1;
        this.selectMonData = null;
        this.selectItem = null;
    }
    Update() {
        super.Update();
    }
}
class Menu_Dougu_Detail_YarimonSelect extends Select_ModeBox {
    static get Select(){ return "Select"}
    constructor() {
        super(Menu_Dougu_Detail.YarimonSelect, [
            new ModeBox(Menu_Dougu_Detail_YarimonSelect.Select)
        ]);
        this.ModeCng(Menu_Dougu_Detail_YarimonSelect.Select); 
        this.resetModeName = Menu_Dougu_Detail_YarimonSelect.Select;
        this.selectNoMax = 1;
    }
    Update() {
        super.Update();
    }
}
class Menu_Dougu_Detail_YesNo extends Select_ModeBox {
    static get Select(){ return "Select"}
    constructor() {
        super(Menu_Dougu_Detail.YesNo, [
            new ModeBox(Menu_Dougu_Detail_YesNo.Select)
        ]);
        this.ModeCng(Menu_Dougu_Detail_YesNo.Select); 
        this.resetModeName = Menu_Dougu_Detail_YesNo.Select;
        this.selectNoMax = 1;
    }
    Update() {
        super.Update();
    }
}
let mSave_CntMax = 20;
class Menu_Save extends Select_ModeBox {
    static get Select(){ return "Select"}
    constructor() { 
        super(MenuBox.Save , [
            new ModeBox(Menu_Save.Select)
        ]);
        this.ModeCng(Menu_Save.Select); 
        this.resetModeName = Menu_Save.Select;
        this.loadFlg = false;
        this.selectNoMax = mSave_CntMax - 1; 
        this.selecterNo = 0; 
    }
    DataGet() {
        this.selecterNo= $gameVariables.value(VN_BefSaveNo);
        this.n_Scroll.ZureNo = $gameVariables.value(VN_BefZureNo);
        GetSaveTxtArrs(); 
    }
    Update() {
        super.Update();
    }
}
let MSave_System = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    MSave_System.call(this);
    this.Title = "";
    this.SubStr = "";
    this.FuckArr = [];
};
class Menu_Option extends Select_ModeBox {
    static get Select(){ return "Select"}
    constructor(){ 
        super(MenuBox.Option , [
            new ModeBox(Menu_Option.Select)
        ]);
        this.ModeCng(Menu_Option.Select); 
        this.resetModeName = Menu_Option.Select;
        this.selectNoMax = 4; 
        this.selecterNo = 0; 
    }
    RightKeyDown() {
        this.VolumeCng(+10);
    }
    LeftKeyDown(){
        this.VolumeCng(-10);
    }
    VolumeCngVar(setVolume) {
        switch (this.selecterNo) {
            case 0:
                AudioManager.masterVolume = Math.floor(setVolume) / 100;
                $gameVariables.setValue(MasterVolVarNo ,setVolume);
                return true;
            case 1:
                ConfigManager['bgmVolume'] = setVolume;
                ConfigManager['meVolume'] = setVolume;
                return true;
            case 2:
                ConfigManager['seVolume'] = setVolume;
                ConfigManager['bgsVolume'] = setVolume;
                $gameVariables.setValue(VoiceVolVarNo ,setVolume);
                return true;
            case 3: 
                return true;
            case 4: 
                return true;
        }
    }
    VolumeCng(cangeValue) {
        let volume = 0;
        let setVolume = 0;
        switch (this.selecterNo) {
            case 0:
                volume = $gameVariables.value(MasterVolVarNo);
                setVolume = this._OptSetVarCng(volume , cangeValue);
                AudioManager.masterVolume = Math.floor(setVolume) / 100;
                $gameVariables.setValue(MasterVolVarNo ,setVolume);
                return true;
            case 1:
                volume = ConfigManager['bgmVolume'];
                setVolume = this._OptSetVarCng(volume , cangeValue);
                ConfigManager['bgmVolume'] = setVolume;
                ConfigManager['meVolume'] = setVolume;
                break;
            case 2:
                volume = ConfigManager['seVolume'];
                setVolume = this._OptSetVarCng(volume , cangeValue);
                ConfigManager['seVolume'] = setVolume;
                ConfigManager['bgsVolume'] = setVolume;
                break;
            case 3: 
                $gameSwitches.setValue(VoiceMuteSwNo , !$gameSwitches.value(VoiceMuteSwNo));
                return true;
            case 4: 
                if ($gameVariables.value(NanidVarNo) == Nanid.Nomal) $gameVariables.setValue(NanidVarNo ,Nanid.Easy);
                else $gameVariables.setValue(NanidVarNo ,Nanid.Nomal);
                return true;
        }
        return false;
    };
    _OptSetVarCng(volume , cngVolume) {
        volume += cngVolume;
        if(volume < 0) volume = 0;
        if(volume > 100) volume = 100;
        return volume;
    };
    Update() {
        super.Update();
    }
}
