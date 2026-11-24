let befMenu_selecterNo = -1;
let befMenu_selecterNo2 = -1;
Game_Interpreter.prototype.Menu_SelectUpdate = function (ckMode) {
    if(ckMode.flame == 2) {
        befMenu_selecterNo = befMenu_selecterNo2 = -1;
    }
    let _MenuYSa = 80;
    if (befMenu_selecterNo != ckMode.selecterNo || befMenu_selecterNo2 != ckMode.selecterNo2) {
        if(ckMode.selecterNo2 == 0) {
            this.DelSprite(PN_mBtn_y_light);
            this.SetSprite(PN_mSelecter, MenuPicPath + "PN_mSelecter",
                BPs._x + 234, BPs._y + 94 + _MenuYSa * ckMode.selecterNo);
        } else {
            if(ckMode.selecterNo2 == 1) {
                if(ckMode.selecterNo > 2 && $gameSwitches.value(SW_FastTrFlg)) {
                    ckMode.selecterNo = ckMode.selectNoMax; 
                    this.SetSprite(PN_mBtn_y_light, MenuPicPath + "PN_mBtn_y_light",
                        BPs._x + 267 - 22 , BPs._y + (_MenuYSa * 5) + 73 - 22);
                    this.SetSprite(PN_mSelecter, MenuPicPath + "PN_mSelecter",
                        BPs._x + 234 + 268, BPs._y + (_MenuYSa * 5) + 94);
                } else {
                    ckMode.selecterNo = 0;
                    this.SetSprite(PN_mBtn_y_light, MenuPicPath + "PN_mBtn_y_light",
                        BPs._x + 267 - 22 , BPs._y + 73 - 22);
                    this.SetSprite(PN_mSelecter, MenuPicPath + "PN_mSelecter",
                        BPs._x + 234 + 268, BPs._y + 94);
                }
            } else {
                ckMode.selecterNo = ckMode.selectNoMax; 
                this.SetSprite(PN_mBtn_y_light, MenuPicPath + "PN_mBtn_y_light",
                    BPs._x + 267 * 2 - 22 , BPs._y + (_MenuYSa * 5) + 73 - 22);
                this.SetSprite(PN_mSelecter, MenuPicPath + "PN_mSelecter",
                    BPs._x + 234 + 267 * 2, BPs._y + (_MenuYSa * 5) + 94);
            }
        }
    }
    befMenu_selecterNo = ckMode.selecterNo;
    befMenu_selecterNo2 = ckMode.selecterNo2;
    if(ckMode.flame >= 10) { 
        let _moveFlg = false;
        let _okFlg = false;
        let _ckPicNo = overPointerSpCkArr(
            [
                PN_mBtn + 0 , PN_mBtn + 1 , PN_mBtn + 2,
                PN_mBtn + 3 , PN_mBtn + 4 , PN_mBtn + 5
            ]
        );
        if(_ckPicNo != -1) {
            ckMode.selecterNo = _ckPicNo - PN_mBtn; ckMode.selecterNo2 = 0;
            _okFlg = TouchInput.isTriggered();
        }
        _ckPicNo = overPointerSpCkArr([PN_mBtn_y , PN_mBtn_w , PN_mBtn_m]);
        if (_ckPicNo != -1) {
            ckMode.selecterNo2 = 1;
            if (_ckPicNo == PN_mBtn_y) ckMode.selecterNo = 0;
            if (_ckPicNo == PN_mBtn_w) ckMode.selecterNo = ckMode.selectNoMax;
            if (_ckPicNo == PN_mBtn_m) {
                ckMode.selecterNo2 = 2;
                if (!$gameSwitches.value(SW_FastTrFlg)) {
                    ckMode.selecterNo2 = 1;
                }
            }
            _okFlg = TouchInput.isTriggered();
        }
        if(Input.isTriggered('up')) {
            if(ckMode.selecterNo2 > 0 && $gameSwitches.value(SW_FastTrFlg)) {
                ckMode.selecterNo = 0;
                _moveFlg = true;
            } else {
                ckMode.selecterNo2 = 0;
                ckMode.selectNo_Up();
            }
        }
        if(Input.isTriggered('down')) {
            if(ckMode.selecterNo2 > 0 && $gameSwitches.value(SW_FastTrFlg)) {
                ckMode.selecterNo = ckMode.selectNoMax;
                _moveFlg = true;
            } else {
                ckMode.selecterNo2 = 0;
                ckMode.selectNo_Down();
            }
        }
        if(Input.isTriggered('left')) {
            ckMode.selectNo_Up2();
        }
        if(Input.isTriggered('right')) {
            ckMode.selectNo_Down2();
        }
        if(ckMode.IsSelecterMove || ckMode.IsSelecterMove2 || _moveFlg) {
            this.Menu_SelectBtn_Move();
            SoundManager.playCursor();
        }
        if(Input.isTriggered('ok') || _okFlg) {
            if (ckMode.selecterNo2 == 1 && ckMode.selecterNo == 5 &&  mBtn_w_notFlg) {
                return;
            }
            if(!(ckMode.selecterNo == 5 && ckMode.selecterNo2 == 0)) SoundManager.playOk();
            DouguMenuPNSetting(PN_mL2Base + 1 , PN_mL2Selecter);
            WazaCkBackPNSetting(PN_mL2End);
            ckMode.select_OkNoCng();
        }
        if(Input.isTriggered('menu') || TouchInput.isCancelled()) {
            menuBox.ModeCng(MenuBox.Close);
        }
    }
}
