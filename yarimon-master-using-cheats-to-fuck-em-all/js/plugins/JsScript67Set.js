let menu_Update_SkipFlame = 0;
Game_Interpreter.prototype.Menu_Update = function () {
    MenuFlame++;
    if(menu_Update_SkipFlame > 0) {
        menu_Update_SkipFlame--;
        return;
    }
    if(MenuTextArr.length > 0) {
        MenuSin = Math.sin((MenuFlame * 5) * (Math.PI/180));
        this.Menu_Yarimon_TxtUpdate();
        return;
    }
    menuBox.Update(); 
    let ckMode = menuBox.mode;
    if(menuBox.modeName == MenuBox.Open) {
        this.Menu_OpenDraw();
        return;
    }
    if(menuBox.modeName == MenuBox.Close) {
        this.Layer1_DelSprite(); 
        this.Menu_End();
        menuBox.Menu_Close();
        return;
    }
    switch (menuBox.modeName) {
        case MenuBox.Select:
            this.Menu_SelectUpdate(menuBox);
            break;
        case MenuBox.Zukan:
            this.Menu_ZukanUpdate(ckMode);
            break;
        case MenuBox.Yarimon:
            this.Menu_YarimonUpdate(ckMode);
            break;
        case MenuBox.Dougu:
            this.Menu_DouguUpdate(ckMode);
            break;
        case MenuBox.Save:
            this.Menu_SaveUpdate(ckMode);
            break;
        case MenuBox.Option:
            this.Menu_OptionUpdate(ckMode);
            break;
        case MenuBox.FastTrb:
            this.Menu_FastTrbUpdate(ckMode);
            break;
        case MenuBox.MapCheck:
            this.Menu_MapCheckUpdate(ckMode);
            break;
    }
};
