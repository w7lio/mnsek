const dmBtnPicCnt = 7; 
let MenuFlgSwich = false;
let Menu回想Flg = false;  
let menuBox = new MenuBox();
let Nupu_MenuUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    if (N_LoadSuccessFlg) { 
        this.NLoadedPictureDell();
        N_LoadSuccessFlg = false;
        LocalLoadFileNo = -1;
        DLCZukanReSetting();
        if (CheckHSceneOpen(16 , 1)) {
            MenuHTatieOpen(2, 3); 
            MenuHTatieOpen(16, 1); 
        }
        if (CheckHSceneOpen(1 , 2)) MenuHTatieOpen(1, 2);
        if (CheckHSceneOpen(25 , 1)) MenuHTatieOpen(25, 1);
        for (let i = $gameSystem.yZukan.length; i <= $N_Yarimon_DB.mZukanDatas.length - 1; i++) {
            var monData = $N_Yarimon_DB.mZukanDatas[i];
            $gameSystem.yZukan.push(new SaveZukan(monData.id));
        }
        for (let i = 0; i < $N_Yarimon_DB.mZukanDatas.length; i++) {
            var monData = $N_Yarimon_DB.mZukanDatas[i];
            if ($gameSystem.yZukan[i].id != monData.id) {
                $gameSystem.yZukan[i].id = monData.id; 
            }
        }
    }
    Nupu_MenuUpdate.call(this);
    if (menuBox.isOpen) {
        this.Menu_Update();
    }
};
let Menu_Initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    Menu_Initialize.call(this);
    this.NewWazaArr = [false, false, false];
    this.SinkaFlgArr = [false, false, false];
};
Game_Interpreter.prototype.NLoadedPictureDell = function () {
    this.MenuPicDel(); 
};
Game_Interpreter.prototype.Menu_SelectBtn_Move = function () {
    for (let i = 0; i <= 6 - 1; i++) {
        let btn_X = BPs._x;
        if (i != menuBox.selecterNo || menuBox.selecterNo2 != 0) btn_X -= 25;
        this.MoveSprite(PN_mBtn + i, btn_X, BPs._y + 73 + (80 * i), 5);
    }
}
let MenuTextArr = [];
Game_Interpreter.prototype.Menu_Yarimon_TxtUpdate = function () {
    if (MenuTextArr.length > 0) {
        if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
            MenuTextArr.shift();
            if (MenuTextArr.length == 0) {
                this.DelSpriteSpan(PN_MnTalkWin, PN_MnTalkTxt + 1);
            } else {
                let _txt1 = MenuTextArr[0][0];
                let _txt2 = MenuTextArr[0][1];
                this.Menu_Yarimon_TxtAdd(_txt1, _txt2);
            }
        }
    }
}
Game_Interpreter.prototype.Menu_Yarimon_TxtAdd = function (_txt1, _txt2) {
    _txt1 = typeof _txt1 !== 'undefined' ? _txt1 : "";
    _txt2 = typeof _txt2 !== 'undefined' ? _txt2 : "";
    MenuTextArr.push([_txt1, _txt2]);
    if (MenuTextArr.length == 1) {
        this.Menu_Yarimon_TxtDraw(_txt1, _txt2);
    }
}
Game_Interpreter.prototype.Menu_Yarimon_TxtDraw = function (_txt1, _txt2) {
    this.SetSprite(PN_MnTalkWin, "PN_TalkWin", BPs._x, BPs._y);
    this.SpriteStr(PN_MnTalkTxt + 0, SCol.Blk0 + _txt1, 28, 403, 581);
    this.SpriteStr(PN_MnTalkTxt + 1, SCol.Blk0 + _txt2, 28, 403, 581 + 54);
}
Game_Interpreter.prototype.PLYarimon_HpCng = function (_setHp) {
    for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
        $gameSystem.Player.syojiTikemon[i].Ijos = [];
        if ($gameSystem.Player.syojiTikemon[i].hp < _setHp) {
            let _psX = 132;
            let _psY = 248 + 180 * i;
            this.PlayPtcSc("Effect_Kaihuku", _psX, _psY);
        }
        if (_setHp >= 999) _setHp = 9999;
        $gameSystem.Player.syojiTikemon[i].hp = _setHp;
        let _mhp = MHP($gameSystem.Player.syojiTikemon[i]);
        if ($gameSystem.Player.syojiTikemon[i].hp >= _mhp) {
            $gameSystem.Player.syojiTikemon[i].hp = _mhp;
        }
    }
    for (let i = 0; i <= $gameSystem.MonBox.length - 1; i++) {
        var ckBox = $gameSystem.MonBox[i];
        for (let j = 0; j <= ckBox.length - 1; j++) {
            var ckMonster = ckBox[j];
            if (ckMonster == null) continue;
            try {
                ckMonster.hp = MHP(ckMonster);
            } catch (e) {
                console.log(e);
            }
        }
    }
}
Game_Interpreter.prototype.Menu_End = function (_cngFlg) {
    _cngFlg = typeof _cngFlg !== 'undefined' ? _cngFlg : true;
    Menu回想Flg = false; 
    this.MenuPicDel();
    if (_cngFlg) {
        let args = new Array("off");
        this.pluginCommand("waitBlur", args);
        this.PlaySe("_Menu_Open", 60);
    }
    Menu_OpenDraw_Flame = 0;
};
Game_Interpreter.prototype.MenuPicDel = function () {
    DelSprite(PN_TalkWin); 
    for (let i = PN_mBase; i <= PN_mL2End; i++) {
        this.DelSprite(i);
    }
};
let menuOffFlame = 0; 
(function () {
    Scene_Map.prototype.isMenuCalled = function () {
        if (menuOffFlame > 0) {
            menuOffFlame--;
            return;
        }
        if (battle_Class.isBattle) return;      
        if ($gamePlayer.isMoving()) return;     
        if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
            if ($gameSystem.isMenuEnabled()) {  
                MenuFlgSwich = true;
                menuBox.Menu_Open();
            }
            if (menuBox.IsMenuClose) { 
                menuBox.Menu_Close();
            }
        }
        return false; 
    };
    Scene_Base.prototype.checkGameover = function () {
        if ($gameParty.isAllDead()) {
            //SceneManager.goto(Scene_Gameover);
            //$gameScreen.startFadeOut(30); //フェードアウトするぜ
            //$gameSwitches.setValue(switchId, true); //全滅したぜ
            //$gameParty.reviveBattleMembers(); //みんな生き返るぜ
        }
    };
})();
var Nupu_Game_Player_triggerAction = Game_Player.prototype.triggerAction;
Game_Player.prototype.triggerAction = function () {
    if (!MenuFlgSwich) { 
        Nupu_Game_Player_triggerAction.call(this);
    }
    return false;
};
