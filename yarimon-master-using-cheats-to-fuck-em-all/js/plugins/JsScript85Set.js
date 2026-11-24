/*:ja
 * @plugindesc 
 */
const PN_MapEn = 180; 
const SetMapPicPath = "pictures/Setting_Map/";
let Setting_Map_Update = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    Setting_Map_Update.call(this);
    if (overPointerSpCkTm(PN_PicFlame)) {
        if (TouchInput.isTriggered()) {
            CharaFlzFlame = 3;
        }
    }
    if ($gameSystem.WinedTrainerArr == undefined) $gameSystem.WinedTrainerArr = [];
}
Game_Interpreter.prototype.波打ちUpdate = function () {
    switch (evRootFlame % 60) {
        case 0:
            this.character(0).setDirection(2);  
            break;
        case 10:
            this.character(0).setDirection(4);  
            break;
        case 20:
            this.character(0).setDirection(6);  
            break;
        case 30:
            this.character(0).setDirection(8);  
            break;
        case 40:
            this.character(0).setDirection(6);  
            break;
        case 50:
            this.character(0).setDirection(4);  
            break;
    }
}
let _吹き出しテンポ戻しFlg = false; 
let _テンポCount = 1;
let Reset吹き出しテンポ = function () {
    _吹き出しテンポ戻しFlg = false;
    _テンポCount = 1;
}
Sprite_Balloon.prototype.speed = function() {
    return 8;
};
Sprite_Balloon.prototype.waitTime = function() {
    return 12;
};
let baseFukidasiWait = 0;
Sprite_Balloon.prototype.setup = function(balloonId) {
    this._balloonId = balloonId;
    this._duration = 8 * this.speed() + this.waitTime();
    this._duration *= _テンポCount;
    baseFukidasiWait = this._duration / 8;
};
Sprite_Balloon.prototype.frameIndex = function () {
    if (_吹き出しテンポ戻しFlg) {
        if (_テンポCount != 1) {
            var index = this._duration / baseFukidasiWait;
            return 7 - Math.max(Math.floor(index), 0);
        } else {
            var index = (this._duration - this.waitTime()) / this.speed();
            return 7 - Math.max(Math.floor(index), 0);
        }
    } else {
        let _ckCnt = 4;
        if (this._duration > 7 * _ckCnt) this._duration = 7 * _ckCnt;
        return 7 - Math.max(Math.floor(this._duration / _ckCnt), 0);
    }
};
let doEventNo = -1;
Game_Interpreter.prototype.GetDoEventNo = function () {
    if (this.character(0) == undefined) return;
    doEventNo = this.character(0)._eventId;
}
Game_Interpreter.prototype.command224 = function () {
    if ($gameSwitches.value(SW_HTalk)) { 
        $gameScreen.startFlash(this._params[0], this._params[1]);
    } else {
        let _ckFlame = Math.floor(this._params[1] / 2);
        this.SetSprite(PN_Ensyutu, "Eff_White", 0, 0, 0);
        this.SpriteCngColor(PN_Ensyutu, [
            this._params[0][0] - 255,
            this._params[0][1] - 255,
            this._params[0][2] - 255,
            0
        ]);
        StacMoveSprite(PN_Ensyutu, 0, 0, _ckFlame, this._params[0][3]);
        StacMoveSprite(PN_Ensyutu, 0, 0, _ckFlame, 0);
    }
    if (this._params[2]) { 
        this.wait(this._params[1]);
    }
    return true;
};
let LevelUp_Yarimon = function (_cngLv) {
    for (let i = 0; i <= $gameSystem.Player.syojiTikemon.length - 1; i++) {
        let _wari = $gameSystem.Player.syojiTikemon[i].hp / MHP($gameSystem.Player.syojiTikemon[i]);
        $gameSystem.Player.syojiTikemon[i].lv += _cngLv;
        let ckYarimon = $gameSystem.Player.syojiTikemon[i];
        let yData = $gameSystem.Player.syojiTikemon[i].YarimonData;
        yData.wazaList.forEach(lnWaza => {
            if (lnWaza.lv == ckYarimon.lv) {
                if (ckYarimon.btlWazas.length < 4) {
                    $N_Yarimon_DB.wazaDatas.forEach(_wazaData => {
                        if (_wazaData.id == lnWaza.id) {
                            ckYarimon.btlWazas.push(new WazaData(_wazaData.id, _wazaData.kaisu));
                        }
                    });
                }
            }
        });
        $gameSystem.Player.syojiTikemon[i].hp = Math.floor(MHP($gameSystem.Player.syojiTikemon[i]) * _wari);
    }
}
let _手動_WazaSet = function (_No, _WazaArr) {
    let ckYarimon = $gameSystem.Player.syojiTikemon[_No];
    ckYarimon.btlWazas = [];
    for (let i = 0; i <= _WazaArr.length - 1; i++) {
        $N_Yarimon_DB.wazaDatas.forEach(_wazaData => {
            if (_wazaData.id == _WazaArr[i]) {
                ckYarimon.btlWazas.push(new WazaData(_wazaData.id, _wazaData.kaisu));
            }
        });
    }
}
let _手動_WazaReSet = function (_No) {
    let ckYarimon = $gameSystem.Player.syojiTikemon[_No];
    let yData = $gameSystem.Player.syojiTikemon[_No].YarimonData;
    ckYarimon.btlWazas = [];
    yData.wazaList.forEach(lnWaza => {
        if (lnWaza.lv <= ckYarimon.lv) {
            if (ckYarimon.btlWazas.length < 4) {
                $N_Yarimon_DB.wazaDatas.forEach(_wazaData => {
                    if (_wazaData.id == lnWaza.id) {
                        ckYarimon.btlWazas.push(new WazaData(_wazaData.id, _wazaData.kaisu));
                    }
                });
            }
        }
    });
}
Game_Interpreter.prototype.command221 = function () {
    if (!$gameMessage.isBusy()) {
        let _waitTime = this.fadeSpeed();
        if ($gameSwitches.value(SW_HTalk)) {
            $gameScreen.startFadeOut(this.fadeSpeed());
        } else {
            this.SetSpriteFIn(PN_FlameEffect, "Black", BPs._x, BPs._y, 0, 0, _waitTime);
        }
        this.wait(_waitTime);
        this._index++;
    }
    return false;
};
Game_Interpreter.prototype.command222 = function () {
    if (!$gameMessage.isBusy()) {
        let _waitTime = this.fadeSpeed();
        if ($gameSwitches.value(SW_HTalk)) {
            $gameScreen.startFadeIn(this.fadeSpeed());
        } else {
            this.MoveSprite(PN_FlameEffect, true, true, _waitTime, 0);
        }
        this.wait(_waitTime);
        this._index++;
    }
    return false;
};
const SW_MapAutoBGMCngOff = 18;
Game_Map.prototype.autoplay = function () {
    if (!$gameSwitches.value(SW_MapAutoBGMCngOff)) {
        if ($dataMap.autoplayBgm) {
            if ($gamePlayer.isInVehicle()) {
                $gameSystem.saveWalkingBgm2();
            } else {
                AudioManager.playBgm($dataMap.bgm);
            }
        }
        if ($dataMap.autoplayBgs) {
            AudioManager.playBgs($dataMap.bgs);
        }
    }
};
Game_Interpreter.prototype.HtoNTalk_ImgDel = function () {
    NN_PAnime = undefined; 
    this.DelSpriteSpan(PN_TalkBack, PN_HTalkWin);
    this.DelSprite(_DbgPicNo); 
}
const PN_Cmn27Base = 30;
const PN_Cmn27Mon = PN_Cmn27Base + 1;
let Cmn_27ヤリモン表示_Flame = 0;
Game_Interpreter.prototype.Cmn_27ヤリモン表示 = function () {
    Cmn_27ヤリモン表示_Flame = 1;
    let _ViewNo = $gameVariables.value(67); 
    this.SetSprite(PN_Cmn27Base, SetMapPicPath + "PN_Cmn27Base", BPs._x, BPs._y);
    this.SetSpriteC(PN_Cmn27Mon, Btl_Yarimon + $N_Yarimon_DB.mZukanDatas[_ViewNo - 1].picPath
        , BPs._x + 184 + 226, BPs._y + 163 + 73);
}
Game_Interpreter.prototype.Cmn_27ヤリモン表示_終了 = function () {
    this.DelSpriteSpan(PN_Cmn27Base, PN_Cmn27Mon);
}
let CheckNewWazaGet_YarimonData = function (_yData, _befLv, _aftLv) {
    let _rtnBool = false;
    _yData.wazaList.forEach(lnWaza => {
        if (_befLv < lnWaza.lv) {
            if (_aftLv >= lnWaza.lv) _rtnBool = true;
        }
    });
    return _rtnBool;
}
const PN_Tutorial = 195;
let Tuto_PicPath = "pictures/Tutorial/";
Game_Interpreter.prototype.Tutorial_PicView = function (_PicStr) {
    this.SetSprite(PN_Tutorial, Tuto_PicPath + _PicStr, BPs._x, BPs._y, 0);
    this.MoveSprite(PN_Tutorial, true, true, 15);
}
Game_Interpreter.prototype.Tutorial_DelPic = function (_PicStr) {
    this.MoveSprite(PN_Tutorial, true, true, 15, 0);
}
let 虫除け_Initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    虫除け_Initialize.call(this);
    this._野生回避Cnt = 0; 
};
Game_Interpreter.prototype.StartFontLoad = function () {
    D_Text_Cng_font = "kdam";
    this.SpriteStrC(500, "　", 22, -100, -100);
    D_Text_Cng_font = "";
}
let _GamePageSetup = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function () {
    _GamePageSetup.apply(this, arguments);
    this.blnSetFlg = false;
    let _List = this.list();
    if (_List[0].code == 108) {
        let _dataStr = _List[0].parameters[0];
        let _strStrArr = _dataStr.split(' ');
        switch (_strStrArr[0]) {
            case "バルーン":
                if (_strStrArr.length > 1) {
                    this.setBalloonLoop(Number(_strStrArr[1]));
                    this.blnSetFlg = true;
                }
                break;
        }
    }
}
const PN_KakeMoney = 30;
Game_Interpreter.prototype.Sc経験値のかけらWin表示 = function () {
    this.SetSprite(PN_KakeMoney + 0 , SetMapPicPath + "PN_KakeMoney" , 0 , 0);
    this.SpriteStrR( PN_KakeMoney + 1 , SCol.Blk0 + " " + $gameSystem.KeikenKakera + NLngStrGet("個 ") ,
        26 , 1093 , 497);
}
Game_Interpreter.prototype.Sc経験値のかけらWin消す = function () {
    this.DelSprite(PN_KakeMoney + 0);
    this.DelSprite(PN_KakeMoney + 1);
}
const YumeBillHikariMaxCount = 8;
const PN_Bill1 = 30;
const PN_Bill2 = PN_Bill1 + YumeBillHikariMaxCount;
const PN_Bill3 = PN_Bill2 + YumeBillHikariMaxCount;
const PN_Bill4 = PN_Bill3 + YumeBillHikariMaxCount;
const PN_BillEnd = PN_Bill4 + YumeBillHikariMaxCount;
let yumeBillFlame = 0;
let yumeBillHikariCount = 0;
let yumeBillPicNo = 0;
Game_Interpreter.prototype.Yume_BillPictSetup = function () {
    yumeBillFlame = yumeBillHikariCount = yumeBillPicNo = 0;
    this.SetSprite(PN_Bill1, "PN_Bill1", 0, 0);
    this.SetSprite(PN_Bill2, "PN_Bill2", 0, 0);
    this.SetSprite(PN_Bill3, "PN_Bill3", 0, 0);
    this.SetSprite(PN_Bill4, "PN_Bill4", 0, 0);
}
let HikariRandPosY = function (rFlg) {
    rFlg = typeof rFlg !== 'undefined' ? rFlg : false;
    let startX = 100;
    if (rFlg) startX += 720;
    return startX + (620) * Math.random();
}
Game_Interpreter.prototype.Yume_BillHikariMove = function () {
    EasingStr = "easeInQuad";
    this.MoveSprite(PN_Bill1 + yumeBillPicNo, true, true, 60, 150, 50);
    this.MoveSprite(PN_Bill2 + yumeBillPicNo, true, true, 60, 150, 50);
    this.MoveSprite(PN_Bill3 + yumeBillPicNo, true, true, 60, 150, 50);
    this.MoveSprite(PN_Bill4 + yumeBillPicNo, true, true, 60, 150, 50);
    EasingStr = "";
}
Game_Interpreter.prototype.Yume_BillDelPict = function () {
    this.DelSpriteSpan(PN_Bill1, PN_BillEnd);
}
let Yume_Bill_StopFlame = 0;
const firstHikariFlame = 60;
Game_Interpreter.prototype.Yume_BillUpdate = function () {
    yumeBillFlame++;
    if (yumeBillFlame == firstHikariFlame) { 
        yumeBillPicNo++;
        this.PlaySe("N_Light");
        this.SetSpriteC(PN_Bill1 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill2 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill3 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.SetSpriteC(PN_Bill4 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.Yume_BillHikariMove();
    }
    if (yumeBillFlame == firstHikariFlame + 60) { 
        yumeBillPicNo++;
        this.PlaySe("N_Light");
        this.SetSpriteC(PN_Bill1 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill2 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.SetSpriteC(PN_Bill3 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.SetSpriteC(PN_Bill4 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.Yume_BillHikariMove();
    }
    if (yumeBillFlame == firstHikariFlame + 90) { 
        yumeBillPicNo++;
        this.PlaySe("N_Light");
        this.SetSpriteC(PN_Bill1 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.SetSpriteC(PN_Bill2 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.SetSpriteC(PN_Bill3 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill4 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.Yume_BillHikariMove();
    }
    if (yumeBillFlame == firstHikariFlame + 120) { 
        yumeBillPicNo++;
        this.PlaySe("N_Light");
        this.SetSpriteC(PN_Bill1 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill2 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.SetSpriteC(PN_Bill3 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill4 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.Yume_BillHikariMove();
    }
    if (yumeBillFlame == firstHikariFlame + 150) { 
        yumeBillPicNo++;
        this.PlaySe("N_Light");
        this.SetSpriteC(PN_Bill1 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.SetSpriteC(PN_Bill2 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill3 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.SetSpriteC(PN_Bill4 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.Yume_BillHikariMove();
    }
    if (yumeBillFlame == firstHikariFlame + 170) { 
        yumeBillPicNo++;
        this.PlaySe("N_Light");
        this.SetSpriteC(PN_Bill1 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.SetSpriteC(PN_Bill2 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill3 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill4 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.Yume_BillHikariMove();
    }
    if (yumeBillFlame == firstHikariFlame + 190) { 
        yumeBillPicNo++;
        this.PlaySe("N_Light");
        this.SetSpriteC(PN_Bill1 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill2 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.SetSpriteC(PN_Bill3 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(), 405, 255, 1);
        this.SetSpriteC(PN_Bill4 + yumeBillPicNo, "PN_BillHikari", HikariRandPosY(true), 405, 255, 1);
        this.Yume_BillHikariMove();
    }
    if (yumeBillFlame == firstHikariFlame + 200) {
        this.PlaySe("NEvHikari");
        this.SetSpriteFIn(PN_BillEnd, "White", 0, 0, 0, 0, 120);
    }
    if (yumeBillFlame == firstHikariFlame + 200 + 120) return false;
    if (yumeBillFlame == Yume_Bill_StopFlame) return false;
    return true;
}
const EventCgPath = "pictures/NEventCG/";
Game_Interpreter.prototype.EvCGView = function (cgPath) {
    this.SetSprite(PN_HScene, EventCgPath + cgPath, 0, 0);
}
Game_Interpreter.prototype.EvCGDel = function () {
    this.DelSprite(PN_HScene);
}
let IdチケープCheck = function (ckNo) {
    if (ckNo == 152) return true;
    if (ckNo == 155) return true;
    if (ckNo == 156) return true;
    if (ckNo == 171) return true;
    return false;
}
let Skipチケープ変化 = function () {
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        var cngFlg = false;
        switch ($gameSystem.Player.syojiTikemon[i].id) {
            case 152:   
            case 153:   
            case 154:   
                let _setYarimon;
                if ($gameSwitches.value(79)) { 
                    _setYarimon = GetYarimonNo(154, $gameSystem.Player.syojiTikemon[i].lv);
                } else if ($gameSwitches.value(80)) { 
                    _setYarimon = GetYarimonNo(153, $gameSystem.Player.syojiTikemon[i].lv);
                } else { 
                    _setYarimon = GetYarimonNo(152, $gameSystem.Player.syojiTikemon[i].lv);
                }
                $gameSystem.Player.syojiTikemon[i] = _setYarimon;
                cngFlg = true;
                break;
        }
        if (cngFlg) break;
    }
}
Game_Interpreter.prototype.Sinkaチケープ2Set = function () {
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        if ($gameSystem.Player.syojiTikemon[i].id == 152) { 
            tkp_i = i;
            let _setYarimon = GetYarimonNo(153, $gameSystem.Player.syojiTikemon[tkp_i].lv); 
            _setYarimon.btlWazas = $gameSystem.Player.syojiTikemon[tkp_i].btlWazas.slice();
            _setYarimon.btlCount = $gameSystem.Player.syojiTikemon[tkp_i].btlCount;
            $gameSystem.Player.syojiTikemon[tkp_i] = _setYarimon;
        }
    }
}
Game_Interpreter.prototype.LastチケフレアSet = function () {
    let tkp_i = -1;
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        if ($gameSystem.Player.syojiTikemon[i].id == 155 || $gameSystem.Player.syojiTikemon[i].id == 152) { 
            tkp_i = i;
            let _setYarimon = GetYarimonNo(154, $gameSystem.Player.syojiTikemon[tkp_i].lv); 
            _setYarimon.btlWazas = $gameSystem.Player.syojiTikemon[tkp_i].btlWazas.slice();
            $gameSystem.Player.syojiTikemon[tkp_i] = _setYarimon;
        }
    }
    let _setWaza0 = null;
    let _setWaza1 = null;
    let _setWaza2 = null;
    let _setWaza3= null;
    $N_Yarimon_DB.wazaDatas.forEach(_wazaData => { 
        if (_wazaData.id == WazaID._未来への翼) _setWaza0 = new WazaData(_wazaData.id, _wazaData.kaisu);
        if (_wazaData.id == 145) _setWaza1 = new WazaData(_wazaData.id, _wazaData.kaisu);
        if (_wazaData.id == 10) _setWaza2 = new WazaData(_wazaData.id, _wazaData.kaisu);
        if (_wazaData.id == 9) _setWaza3 = new WazaData(_wazaData.id, _wazaData.kaisu);
    });
    while ($gameSystem.Player.syojiTikemon[tkp_i].btlWazas.length < 4)
        $gameSystem.Player.syojiTikemon[tkp_i].btlWazas.push(null);
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[0] = _setWaza0; 
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[1] = _setWaza1; 
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[2] = _setWaza2; 
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[3] = _setWaza3; 
    while ($gameSystem.Player.syojiTikemon[0].id != 156) {
        $gameSystem.Player.syojiTikemon.push($gameSystem.Player.syojiTikemon[0]);
        $gameSystem.Player.syojiTikemon.shift();
    }
    if ($gameSystem.Player.syojiTikemon[0].lv < 80) $gameSystem.Player.syojiTikemon[0].lv = 80;
    let _mhp = MHP($gameSystem.Player.syojiTikemon[0]);
    $gameSystem.Player.syojiTikemon[0].hp = _mhp;
}
Game_Interpreter.prototype.LastチケフレアSet2 = function () {
    let tkp_i = -1;
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        if ($gameSystem.Player.syojiTikemon[i].id == 156) {
            tkp_i = i;
            let _setYarimon = GetYarimonNo(169, $gameSystem.Player.syojiTikemon[tkp_i].lv); 
            _setYarimon.btlWazas = $gameSystem.Player.syojiTikemon[tkp_i].btlWazas.slice();
            _setYarimon.btlCount = 999; 
            $gameSystem.Player.syojiTikemon[tkp_i] = _setYarimon;
        }
    }
    let _setWaza0 = null;
    let _setWaza1 = null;
    let _setWaza2 = null;
    let _setWaza3= null;
    $N_Yarimon_DB.wazaDatas.forEach(_wazaData => { 
        if (_wazaData.id == WazaID._チートタックル) _setWaza0 = new WazaData(_wazaData.id, _wazaData.kaisu);
        if (_wazaData.id == 145) _setWaza1 = new WazaData(_wazaData.id, _wazaData.kaisu);
        if (_wazaData.id == 10) _setWaza2 = new WazaData(_wazaData.id, _wazaData.kaisu);
        if (_wazaData.id == 9) _setWaza3 = new WazaData(_wazaData.id, _wazaData.kaisu);
    });
    while ($gameSystem.Player.syojiTikemon[tkp_i].btlWazas.length < 4)
        $gameSystem.Player.syojiTikemon[tkp_i].btlWazas.push(null);
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[0] = _setWaza0; 
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[1] = _setWaza1; 
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[2] = _setWaza2; 
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[3] = _setWaza3; 
}
Game_Interpreter.prototype.LastBlackSet = function () {
    this.SetSpriteC(PN_BtlEn + 0, EventCgPath + "lastBlk1", 0 + 175, 0 + 236);
    this.SetSpriteC(PN_BtlEn + 1, EventCgPath + "lastBlk2", 1 + 399, -2 + 180);
    this.SetSpriteC(PN_BtlEn + 2, EventCgPath + "lastBlk3", 762 + 339, 0 + 204);
    this.SetSpriteC(PN_BtlEn + 3, EventCgPath + "lastBlk4", 0 + 238, 343 + 238);
    this.SetSpriteC(PN_BtlEn + 4, EventCgPath + "lastBlk5", 964 + 238, 60 + 375);
    this.SetSpriteC(PN_BtlEn + 5, EventCgPath + "lastBlk6", 408 + 300, 20 + 326);
    this.SetSpriteC(PN_BtlEn + 6, EventCgPath + "lastBlk7", 721 + 233, 374 + 218);
    this.SetSpriteC(PN_BtlEn + 7, EventCgPath + "lastBlk8", 319 + 288, 576 + 117);
}
Game_Interpreter.prototype.LastBlack落下 = function () {
    EasingStr = "easeInQuad";
    for (let i = 0; i <= 7; i++) {
        $gameScreen.rotatePicture(PN_BtlEn + i, 1.5);
        this.MoveSpriteAdd(PN_BtlEn + i, 0, 1050, 60);
    }
    EasingStr = "";
}
Game_Interpreter.prototype.DLC2チケフレアSet = function () {
    let tkp_i = -1;
    for (let i = 0; i < $gameSystem.Player.syojiTikemon.length; i++) {
        if ($gameSystem.Player.syojiTikemon[i].id == 171 || $gameSystem.Player.syojiTikemon[i].id == 152
            || $gameSystem.Player.syojiTikemon[i].id == 155) { 
            tkp_i = i;
            let _setYarimon = GetYarimonNo(154, $gameSystem.Player.syojiTikemon[tkp_i].lv); 
            _setYarimon.btlWazas = $gameSystem.Player.syojiTikemon[tkp_i].btlWazas.slice();
            $gameSystem.Player.syojiTikemon[tkp_i] = _setYarimon;
        }
    }
    let _setWaza0 = null;
    let _setWaza1 = null;
    let _setWaza2 = null;
    let _setWaza3= null;
    $N_Yarimon_DB.wazaDatas.forEach(_wazaData => { 
        if (_wazaData.id == WazaID._未来への翼 - 1) _setWaza0 = new WazaData(_wazaData.id, _wazaData.kaisu);
        if (_wazaData.id == 145) _setWaza1 = new WazaData(_wazaData.id, _wazaData.kaisu);
        if (_wazaData.id == 10) _setWaza2 = new WazaData(_wazaData.id, _wazaData.kaisu);
        if (_wazaData.id == 9) _setWaza3 = new WazaData(_wazaData.id, _wazaData.kaisu);
    });
    while ($gameSystem.Player.syojiTikemon[tkp_i].btlWazas.length < 4)
        $gameSystem.Player.syojiTikemon[tkp_i].btlWazas.push(null);
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[0] = _setWaza0; 
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[1] = _setWaza1; 
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[2] = _setWaza2; 
    $gameSystem.Player.syojiTikemon[tkp_i].btlWazas[3] = _setWaza3; 
    while ($gameSystem.Player.syojiTikemon[0].id != 156) {
        $gameSystem.Player.syojiTikemon.push($gameSystem.Player.syojiTikemon[0]);
        $gameSystem.Player.syojiTikemon.shift();
    }
    if ($gameSystem.Player.syojiTikemon[0].lv < 150) $gameSystem.Player.syojiTikemon[0].lv = 150;
    let _mhp = MHP($gameSystem.Player.syojiTikemon[0]);
    $gameSystem.Player.syojiTikemon[0].hp = _mhp;
}
let EdgP2Path = EventCgPath + "EdgEv/";
let Draw200年Img_Flame = 0;
Game_Interpreter.prototype.Draw200年Img = function () {
    this.SetSpriteFIn(PN_BtlEn + 0, EdgP2Path + "Tike_EdgBk1", 0, 0, 0, 0, 15);
    this.SetSpriteFInC(PN_BtlEn + 1, EdgP2Path + "Tike_EdgBk2", 585, 318, 0, 0, 15);
    this.SetSpriteFInC(PN_BtlEn + 2, EdgP2Path + "Tike_EdgBk3", 683, 318, 0, 0, 15);
    this.SetSpriteFInC(PN_BtlEn + 3, EdgP2Path + "Tike_EdgBk4", 803, 318, 0, 0, 15);
    this.SetSpriteFInC(PN_BtlEn + 4, EdgP2Path + "Tike_EdgBk5", 948, 318, 0, 0, 15);
    Draw200年Img_Flame = 0;
}
Game_Interpreter.prototype.Draw200年Img_End = function () {
    for (let i = 0; i <= 5 - 1; i++) {
        this.MoveSprite(PN_BtlEn + i, true, true, 60, 0);
    }
}
Game_Interpreter.prototype.Draw200年ImgShake = function (shakeFlame) {
    let shakeX = Math.floor( Math.random() * 30) - 15;
    let shakeY = Math.floor( Math.random() * 30) - 15;
    for (let i = 0; i <= 4; i++) {
        this.SpriteShake(PN_BtlEn + i , shakeX , shakeY , shakeFlame);
    }
}
Game_Interpreter.prototype.SpriteShake = function (_PNo , shakeX , ShakeY , shakeFlame) {
    let moveFlame = Math.floor(shakeFlame / 2);
    StacMoveSpriteAdd(_PNo , shakeX , ShakeY , moveFlame);
    StacMoveSpriteAdd(_PNo , -shakeX , -ShakeY , moveFlame);
}
Game_Interpreter.prototype.Draw200年Img_Update = function () {
    Draw200年Img_Flame++;
    if (Draw200年Img_Flame == 20) {
        this.PlaySe("Bbomb");
        this.Draw200年ImgShake(10);
    }
    if (Draw200年Img_Flame == 40) {
        this.PlaySe("Bbomb");
        this.Draw200年ImgShake(10);
    }
    if (Draw200年Img_Flame == 60) {
        this.PlaySe("Bbomb");
        this.Draw200年ImgShake(10);
    }
    if (Draw200年Img_Flame == 100) {
        this.SetSprite(PN_BtlEn + 5, EdgP2Path + "Tike_Edg1", 1440, 300);
        EasingStr = "easeOutQuad";
        StacMoveSprite(PN_BtlEn + 5, 553, true, 20);
        StacSetSprite(PN_BtlEn + 5, EdgP2Path + "Tike_Edg2", 553, 300);
        EasingStr = "easeOutQuad";
        StacMoveSprite(PN_BtlEn + 5, 543, true, 20);
        StacWaitPict(PN_BtlEn + 5, 50);
        StacSetSprite(PN_BtlEn + 5, EdgP2Path + "Tike_Edg1", 543, 300);
        StacMoveSprite(PN_BtlEn + 5, -500, true, 20);
        EasingStr = "";
    }
    if (Draw200年Img_Flame == 115) this.PlaySe("money_box2");
    if (Draw200年Img_Flame == 115) {
        this.PlaySe("Bbomb");
        $gameScreen.startShake(5, 10, 20);
        $gameScreen.rotatePicture(PN_BtlEn + 1, 30);
        this.MoveSpriteAdd(PN_BtlEn + 1, 1100, -800, 30);
        $gameScreen.rotatePicture(PN_BtlEn + 2, 40);
        this.MoveSpriteAdd(PN_BtlEn + 2, 100, 800, 30);
        $gameScreen.rotatePicture(PN_BtlEn + 3, 50);
        this.MoveSpriteAdd(PN_BtlEn + 3, 100, -800, 30);
        $gameScreen.rotatePicture(PN_BtlEn + 4, 35);
        this.MoveSpriteAdd(PN_BtlEn + 4, 1040, 500, 30);
    }
    if (Draw200年Img_Flame == 200) {
        this.SetSpriteFIn(PN_BtlEn + 1, EdgP2Path + "Tike_EdgBk6", 515, -185, 0, 0, 15);
        EasingStr = "easeOutElastic";
        this.MoveSprite(PN_BtlEn + 1, 515, 237, 50);
        EasingStr = "";
    }
    if (Draw200年Img_Flame == 230) return false; 
    return true; 
}
const TmtPicPath = SetMapPicPath + "Tournament/";
const TmtYPos = 250;
Game_Interpreter.prototype.TournamentCard_Start = function () {
    TournamentCard_Count = 0;
    this.SetSpriteFIn(PN_MapEn + 0, TmtPicPath + "Card_Base", BPs._x, BPs._y, 0, 0, 10);
    this.SetSpriteFInC(PN_MapEn + 1, TmtPicPath + "Card_Back", BPs._x + 178, BPs._y + TmtYPos, 0, 0, 10);
    this.SetSpriteFInC(PN_MapEn + 2, TmtPicPath + "Card_Back", BPs._x + 629, BPs._y + TmtYPos, 0, 0, 10);
}
Game_Interpreter.prototype.TournamentCard_LeftOpen = function (openCardNo , flame) {
    StacMoveSprite(PN_MapEn + 1 , true , true , flame / 2 , 255 , 0 , 100);
    StacSetSpriteC(PN_MapEn + 1 , TmtPicPath + "Card_" + openCardNo , BPs._x + 178 , BPs._y + TmtYPos , 255 , 0 , 100 );
    StacMoveSprite(PN_MapEn + 1 , true , true , flame / 2 , 255 , 93 , 100);
}
Game_Interpreter.prototype.TournamentCard_RightOpen = function (openCardNo , flame) {
    StacMoveSprite(PN_MapEn + 2 , true , true , flame / 2 , 255 , 0 , 100);
    StacSetSpriteC(PN_MapEn + 2 , TmtPicPath + "Card_" + openCardNo , BPs._x + 629, BPs._y + TmtYPos , 255 , 0 , 100 );
    StacMoveSprite(PN_MapEn + 2 , true , true , flame / 2 , 255 , 93 , 100);
}
Game_Interpreter.prototype.TournamentCard_End = function () {
    for (let i = 0; i < 3; i++) {
        MoveSprite(PN_MapEn + i , true, true , 10 , 0);
    }
}
Game_Interpreter.prototype.TmtCutIn_Start = function (lCutIn , rCutIn) {
    this.SetSpriteC(PN_MapEn + 0 , TmtPicPath + lCutIn, BPs._x + 408, BPs._y + 190);
    this.SetSpriteC(PN_MapEn + 1 , TmtPicPath + rCutIn, BPs._x + 408, BPs._y + 450);
}
Game_Interpreter.prototype.TmtCutIn_End = function () {
    this.DelSpriteSpan(PN_MapEn + 0 , PN_MapEn + 1);
}
Game_Interpreter.prototype.TmtKemuri_Start = function () {
    this.SetSprite(2 , "kemuri1", 0, -100);
    this.SetSprite(3 , "kemuri2", 0, -100);
    this.SetSprite(4 , "kemuri3", 0, -100);
    this.SetSprite(5 , "kemuri4", 0, -100);
    this.MoveSpriteAdd(3 , 60 , 0,1200);
    this.MoveSpriteAdd(4 , -60 , 0,1200);
    this.MoveSpriteAdd(5 , -60 , 0,1200);
}
Game_Interpreter.prototype.TmtKemuri_Opa1 = function () {
    this.MoveSprite(2,true,true,1,180);
    this.MoveSprite(3,true,true,1,180);
    this.MoveSprite(4,true,true,1,180);
    this.MoveSprite(5,true,true,1,180);
}
Game_Interpreter.prototype.TmtKemuri_Opa2 = function () {
    this.MoveSprite(2,true,true,1,100);
    this.MoveSprite(3,true,true,1,100);
    this.MoveSprite(4,true,true,1,100);
    this.MoveSprite(5,true,true,1,100);
}
Game_Interpreter.prototype.TmtKemuri_Opa3 = function () {
    this.MoveSprite(2,true,true,120,0);
    this.MoveSprite(3,true,true,120,0);
    this.MoveSprite(4,true,true,120,0);
    this.MoveSprite(5,true,true,120,0);
}
let WMapPicPath = "pictures/WorldMap/";
const VN_WMapFstNo = 396;
const PN_WMapBase = 310;
const PN_WMapPlayer = PN_WMapBase + 1;
const PN_WMapPin = PN_WMapPlayer + 1;
const PN_WMapSelecter = PN_WMapPin + 1;
const PN_WMapTxt = PN_WMapSelecter + 1;
class WMapData {
    constructor(Name , PosX , PosY , CMArr , spaceFlg){
        spaceFlg = typeof spaceFlg !== 'undefined' ? spaceFlg : false;
        this.Name = Name;
        this.PosX = PosX;
        this.PosY = PosY;
        this.CMArr = CMArr;
        this.spaceFlg = spaceFlg;
    }
}
let WMapOverPicArr = [];
let WMapArr = [
    new WMapData("ハジメムラ" , 566,430 , [512,404,103,60]) ,
    new WMapData("ビッグシティ" , 400,295 , [298,238,199,133]) ,
    new WMapData("ハーバータウン" , 110,355 , [25,311,144,108]) ,
    new WMapData("教会" , 230,200 , [200,182,63,60] , true) ,
    new WMapData("セントラル" , 375,55 , [346,16,47,53]) ,
    new WMapData("マキバ牧場" , 485,180 , [441,141,88,85] , true) ,
    new WMapData("シレンの森" , 405,23 , [395,16,24,34] , true) ,
    new WMapData("和の里" , 705,520 , [613,473,176,126]) ,
    new WMapData("神社" , 670,330 , [615,289,106,94] , true) ,
    new WMapData("温泉" , 555,523 , [527,509,58,46] , true) ,
    new WMapData("旧道" , 650,170 , [594,146,104,108] , true) ,
];
let WMapNo = 0;
let WMapPinNo = 0;
let BefWMapPinNo = -1;
let WMapCMArr = [];
Game_Interpreter.prototype.WorldMap_Start = function () {
    WMapNo = $gameVariables.value(VN_WMapFstNo);
    WMapPinNo = BefWMapPinNo = WMapNo;
    WMapCMArr = [];
    this.SetSprite(PN_WMapBase , WMapPicPath + "PN_WMapBase" , BPs._x , BPs._y);
    for (let i = 0; i <= WMapArr.length - 1; i++) {
        let setMapName = NLngStrGet(WMapArr[i].Name);
        if (WMapArr[i].spaceFlg) setMapName = "　" + setMapName;
        while (setMapName.length < 8) setMapName += "　";
        this.SpriteStr( PN_WMapTxt + i , setMapName , 16 , BPs._x + 30 , BPs._y + 75 + 20 * i);
        WMapCMArr.push(
            [
                WMapArr[i].CMArr[0] ,
                WMapArr[i].CMArr[1],
                WMapArr[i].CMArr[2],
                WMapArr[i].CMArr[3]
            ]
        );
    }
    WMapOverPicArr = [];
    for (let i = 0; i < WMapArr.length; i++) WMapOverPicArr.push(PN_WMapTxt + i);
}
Game_Interpreter.prototype.WorldMap_Update = function () {
    menuOffFlame = 5;
    if (Input.isTriggered('up')) WMapPinNo--;
    if (Input.isTriggered('down')) WMapPinNo++;
    var overNo = overPointerSpCkArr(WMapOverPicArr);
    if (overNo != -1) WMapPinNo = overNo - PN_WMapTxt;
    if (overNo == -1) {
        overNo = overSpriteClickable( PN_WMapBase , WMapCMArr);
        if (overNo != -1) WMapPinNo = overSpriteClickable( PN_WMapBase , WMapCMArr);
    }
    if (WMapPinNo < 0) WMapPinNo = WMapArr.length - 1;
    if (WMapPinNo > WMapArr.length - 1) WMapPinNo = 0;
    this.SetSpriteC(PN_WMapPlayer , WMapPicPath + "PN_WMapPlayer" ,
        BPs._x + WMapArr[WMapNo].PosX , BPs._y + WMapArr[WMapNo].PosY);
    this.SetSpriteC(PN_WMapPin , WMapPicPath + "PN_WMapPin" ,
        BPs._x + WMapArr[WMapPinNo].PosX , BPs._y + WMapArr[WMapPinNo].PosY);
    this.SetSpriteC(PN_WMapSelecter , WMapPicPath + "PN_WMapSelecter" ,
        BPs._x + 19 , BPs._y + 87 + 20 * WMapPinNo);
    if (BefWMapPinNo != WMapPinNo) {
        BefWMapPinNo = WMapPinNo;
        SoundManager.playCursor();
    }
    if (TouchInput.isCancelled() || Input.isTriggered('escape')) return false;
    return true;
}
Game_Interpreter.prototype.WorldMap_End = function () {
    this.DelSpriteSpan(PN_WMapBase , PN_WMapTxt + WMapArr.length);
}
