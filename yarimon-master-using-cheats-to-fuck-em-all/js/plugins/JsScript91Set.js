class TitleBox extends ModeBox {
    static get TitleBox(){ return "TitleBox"} 
    static get Title(){ return "Title"} 
    static get Select(){ return "Select"} 
    constructor(){ 
        super(TitleBox.TitleBox , [
            new ModeBox(TitleBox.Title),
            new Title_Select()
        ]);
        this.ModeCng(TitleBox.Title); 
    }
    Update() {
        super.Update();
    }
}
const MapID_opening = 3;
class Title_Select extends Select_ModeBox {
    static get Select(){ return "Select"} 
    constructor() {
        super(TitleBox.Select , [
            new ModeBox(Title_Select.Select) ,
            new Menu_Save() ,
            new Menu_Option(),
            new Title_LngSelect()
        ]);
        this.ModeCng(Title_Select.Select); 
        this.resetModeName = Title_Select.Select;
        this.selectNoMax = 4; 
        this.selecterNo = 0; 
    }
    OkModeCng() {
        switch (this.selecterNo) {
            case 0 : 
                _次のHTalk開始はWinPic非表示 = true;
                _Title_WinPicFlameDelFlg = true;
                $gamePlayer.reserveTransfer(MapID_opening, 1, 1, 0, 0);
                break;
            case 1 : 
                this.ModeCng(MenuBox.Save);
                break;
            case 2 : 
                this.ModeCng(MenuBox.Option);
                break;
            case 3: 
                this.ModeCng(Title_LngSelect.LngSelect);
                break;
            case 4: 
                break;
        }
    }
    Update() {
        super.Update();
    }
}
class Title_LngSelect extends Select_ModeBox {
    static get LngSelect(){ return "LngSelect"} 
    constructor() { 
        super(TitleBox.LngSelect , [
        ]);
        this.ModeCng(Title_LngSelect.LngSelect); 
        this.name = Title_LngSelect.LngSelect;
        this.resetModeName = Title_LngSelect.LngSelect;
        this.selectNoMax = 4; 
        this.selecterNo = 0; 
    }
    OkModeCng() {
        var _drawTxt = "";
        switch (this.selecterNo) {
            case 0 : 
                _drawTxt = "jp";
                break;
            case 1 : 
                _drawTxt = "en";
                break;
            case 2 : 
                _drawTxt = "cn";
                break;
            case 3 : 
                _drawTxt = "tc";
                break;
            case 4 : 
                _drawTxt = "ko";
                break;
        }
        if (LngMode != _drawTxt) {
            GameResetFlame = 1; 
            // [JoiPlay/Android] lưu ngôn ngữ vào localStorage, ghi lng.txt nếu chạy trên PC
            try { localStorage.setItem("Yarisute_LngMode", _drawTxt); } catch (e) {}
            try {
                if (typeof require === 'function' && typeof process === 'object') {
                    let ckfs = require('fs');
                    let stream = ckfs.createWriteStream("lng.txt");
                    stream.write(_drawTxt, 'utf-8');
                    stream.end("");
                }
            } catch (e) {}
            GameResetFlame = 1; 
            return;
        }
    }
    Update() {
        super.Update();
    }
}
