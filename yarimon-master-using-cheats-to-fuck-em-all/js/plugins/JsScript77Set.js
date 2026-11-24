class Menu_Zukan extends Select_ModeBox {
    static get Select(){ return "Select"} 
    static get Detail(){ return "Detail"} 
    constructor() {
        super(MenuBox.Zukan , [
            new ModeBox(Menu_Zukan.Select) ,
            new Zukan_Datail()
        ]);
        this.ModeCng(Menu_Zukan.Select); 
        this.resetModeName = Menu_Zukan.Select;
        this.zureNo = 0; 
        this.selectNoMax = 9;
        this.selecterLoopFlg = false; 
    }
    Update() {
        super.Update();
    }
    Reset() {
        super.Reset();
        this.zureNo = 0;
        this.selecterNo = 0;
    }
}
class Zukan_Datail extends Select_ModeBox {
    static get Select(){ return "Select"} 
    static get YesNoSelect(){ return "YesNoSelect"} 
    constructor(){ 
        super(Menu_Zukan.Detail , [
            new ModeBox(Zukan_Datail.Select) ,
            new Zukan_Datail_YesNoSelect()
        ]);
        this.resetModeName = Zukan_Datail.Select;
        this.selectNoMax = 2;
        this.selNo = 0;
    }
    DetailOpen(_No) { 
    }
    Update() {
        super.Update();
    }
    Reset() {
        super.Reset();
        this.selecterNo = 0;
    }
}
class Zukan_Datail_YesNoSelect extends Select_ModeBox {
    static get Select(){ return "Select"} 
    constructor(){ 
        super(Zukan_Datail.SexSelect , [
            new ModeBox(Zukan_Datail_YesNoSelect.Select)
        ]);
        this.ModeCng(Zukan_Datail_YesNoSelect.Select); 
        this.resetModeName = Zukan_Datail_YesNoSelect.Select;
        this.selectNoMax = 1;
    }
    Update() {
        super.Update();
    }
    Reset() {
        super.Reset();
        this.selecterNo = 0;
    }
}
