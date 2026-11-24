/*:
 * @plugindesc 
 * @author ぬぷ竜
 */
Game_Interpreter.prototype.SetPlayerImg = function (ImgName, No) {
    this.SetCharaImg(1, ImgName, No)
    $gamePlayer.refresh();
};
Game_Interpreter.prototype.SetCharaImg = function (AcID, ImgName, No) {
    $gameActors.actor(AcID).setCharacterImage(ImgName, No);
};
Game_Interpreter.prototype.EvStart = function (_EvId) {
    try {
        $gameMap._events[_EvId].start();
    } catch (e) { console.log("イベント未発見エラー"); }
}
Game_Interpreter.prototype.PlayerSetPostion = function (setX , setY , direction) {
    direction = typeof direction !== 'undefined' ? direction : -1;
    $gamePlayer.setPosition(setX, setY);
    $gameMap.setDisplayPos($gamePlayer.x - (Graphics.boxWidth / 48 / 2), $gamePlayer.y - (Graphics.boxHeight / 48 / 2));
    if (direction != -1) {
        switch (direction) {
            case "下": $gamePlayer.setDirection(2);
                break;
            case "左": $gamePlayer.setDirection(4);
                break
            case "右": $gamePlayer.setDirection(6);
                break
            case "上": $gamePlayer.setDirection(8);
                break
        }
    }
}
Game_Interpreter.prototype.TouchTriger = function (_Kyori) {
    _Kyori = typeof _Kyori !== 'undefined' ? _Kyori : 1;
    _Kyori = Math.abs(_Kyori);
    let vvX = Math.abs(this.character(0)._realX - this.character(-1)._realX);
    let vvY = Math.abs(this.character(0)._realY - this.character(-1)._realY);
    if (vvX <= _Kyori && vvY <= _Kyori) {
        return true;
    } else {
        return false;
    }
};
let TouchTriger_Lock_Event = {};
Game_Interpreter.prototype.TouchTriger_Lock = function (_Kyori) {
    if(TouchTriger_Lock_Event[this.character(0)._eventId] == undefined) TouchTriger_Lock_Event[this.character(0)._eventId] = false;
    if(this.TouchTriger(_Kyori) && !TouchTriger_Lock_Event[this.character(0)._eventId]) {
        TouchTriger_Lock_Event[this.character(0)._eventId] = true;
        return true;
    } else {
        if(!this.TouchTriger(_Kyori)) {
            TouchTriger_Lock_Event[this.character(0)._eventId] = false;
        }
        return false;
    }
}
let TouchTriger_Lock_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    TouchTriger_Lock_performTransfer.call(this); 
    TouchTriger_Lock_Event = {};
}
Game_Interpreter.prototype.SetPlayerMoveSpeed = function (_Speed) {
    _Speed = typeof _Speed !== 'undefined' ? _Speed : 4;
    this.character(-1).forceMoveRoute({
        "list": [{ "code": 29, "parameters": [_Speed] },
        { "code": 0 }],
        "repeat": false,
        "skippable": true
    });
    this._character = this.character(-1);
    this.setWaitMode('route');
}
let _BefMap = -1;
let NupuBEv_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    NupuBEv_performTransfer.call(this);
    if (_BefMap != $gameMap._mapId) {
        _BefMap = $gameMap._mapId;
        $gameMap._events.forEach(function (_event) {
            try {
                let _ckEv = _event.event();
                let _NZRStr = MetaChecker(_ckEv, "NZure");
                if (_NZRStr != "") {
                    let _NZRArr = _NZRStr.split(',');
                    let _NZR_x = Number(_NZRArr[0]);
                    let _NZR_y = Number(_NZRArr[1]);
                    if (Number.isInteger(_event._x)) {
                        _event._realX += _NZR_x;
                        _event._x += _NZR_x;
                        _event._realY += _NZR_y;
                        _event._y += _NZR_y;
                    }
                }
            } catch (e) {
                console.log("Err:NupuBEv_performTransfer");
            }
        })
    }
}
Game_Interpreter.prototype.CheckAreaEvent = function (xSize , ySize) {
    if (this.character(0)._realX <= this.character(-1)._realX &&
        this.character(0)._realX + xSize > this.character(-1)._realX) {
        if (this.character(0)._realY <= this.character(-1)._realY &&
            this.character(0)._realY + ySize > this.character(-1)._realY) {
            return true;
        }
    }
    return false;
};
let NupuBEv_EvVarCIndexCng = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    NupuBEv_EvVarCIndexCng.call(this);
    $gameMap._events.forEach(function (_event) {
        try {
            let _ckEv = _event.event();
            let _NZRStr = MetaChecker(_ckEv, "画VN");
            if (_NZRStr != "") {
                let _ckStrArr = _NZRStr.split(',');
                let _ckChrStr = ""; 
                let _ckIdxNo = -1; 
                if (_ckStrArr.length > 1){
                    _ckChrStr = $gameVariables.value(Number(_ckStrArr[0]));
                    _event._characterName = _ckChrStr;
                    _ckIdxNo = $gameVariables.value(Number(_ckStrArr[1]));
                } else {
                    _ckIdxNo = $gameVariables.value(Number(_ckStrArr[0]));
                }
                _event._characterIndex = _ckIdxNo;
            }
            _NZRStr = MetaChecker(_ckEv, "画VN2");
            if (_NZRStr != "") {
                _ckChrStr = $gameVariables.value(Number(_NZRStr));
                _event._characterName = _ckChrStr;
            }
        } catch (e) {
            console.log("Err:NupuBEv_EvVarCIndexCng");
        }
    })
}
//使い方：ルートで:this.CGS(_X,_Y);
Game_Character.prototype.CGS = function (PosPX, PosPY) {
    this.StepOff = true;
    this._pattern = PosPX;
    if (PosPY == 0) {
        this._direction = 2;
    }
    if (PosPY == 1) {
        this._direction = 4;
    }
    if (PosPY == 2) {
        this._direction = 6;
    }
    if (PosPY == 3) {
        this._direction = 8;
    }
}
Game_Interpreter.prototype.TmpEvPCall = function (_EvId, _PageId) {
    _PageId = typeof _PageId !== 'undefined' ? _PageId : 1;
    this.NTM_execCallMapEvent([_EvId, _PageId]);
};
Game_Interpreter.prototype.TmpEvPCall_Sec = function (_EvId, _PageId) {
    _PageId = typeof _PageId !== 'undefined' ? _PageId : 1;
    this.NTM_execCallMapEvent([_EvId, _PageId]);
};
let NpCreatePluginParameter = function (pluginName) {
    let paramReplacer = function (key, value) {
        if (value === 'null') {
            return value;
        }
        if (value[0] === '"' && value[value.length - 1] === '"') {
            return value;
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    };
    let parameter = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
    PluginManager.setParameters(pluginName, parameter);
    return parameter;
};
let TmParam = NpCreatePluginParameter('JsScript104Set');
let getArgNumber = function (arg, min, max) {
    if (arguments.length < 2) min = -Infinity;
    if (arguments.length < 3) max = Infinity;
    return (parseInt(arg) || 0).clamp(min, max);
};
Game_Interpreter.prototype.NTM_execCallMapEvent = function (args) {
    let pageIndex = getArgNumber(args[1], 1);
    let eventId = getArgNumber(args[0]);
    if ($gameMap.event(eventId)) {
        this.callMapEventById(pageIndex, eventId);
    } else if (args[0] !== '') {
        this.NTM_callMapEventByName(pageIndex, args[0]);
    } else {
        this.callMapEventById(pageIndex, this._eventId);
    }
};
Game_Interpreter.prototype.NTM_callMapEventByName = function (pageIndex, eventName) {
    let event = DataManager.searchDataItem($dataTemplateEvents, 'name', eventName);
    if (event) {
        this.setupAnotherList(TmParam.KeepEventId ? null : event.id, event.pages, pageIndex);
    }
};
//■マップのイベントをコピーして指定位置に配置(ID or 名前指定)
Game_Interpreter.prototype.CopyEvSet = function (_EvIdorName, _XPos , _YPos) {
    let args = [String(_EvIdorName), String(_XPos), String(_YPos)];
    this.pluginCommand("ERS_MAKE", args);
}
let SetAnimeNo = -1;
Game_Interpreter.prototype.PlayAnime = function (AnimeNo, SetX, SetY) {
    AsetX = SetX / 48 + $gameMap._displayX;
    ASetY = SetY / 48 + $gameMap._displayY;
    if (AsetX <= 0) AsetX = 0;
    if (ASetY <= 0) ASetY = 0;
    let args = [String("NAnime"), String(AsetX), String(ASetY)];
    SetAnimeNo = AnimeNo;
    this.pluginCommand("ERS_MAKE_TEMPLATE", args);
}
Game_Interpreter.prototype.CopyTmpEvSet = function (_EvIdorName, _XPos , _YPos) {
    let args = [String(_EvIdorName), String(_XPos), String(_YPos)];
    this.pluginCommand("ERS_MAKE_TEMPLATE", args);
}
let Nupu_PrefabEvent_initialize = Game_PrefabEvent.prototype.initialize;
Game_PrefabEvent.prototype.initialize = function (mapId, eventId, originalEventId, x, y, isTemplate) {
    Nupu_PrefabEvent_initialize.apply(this, arguments);
};
let Nupu_spawnEvent = Game_Map.prototype.spawnEvent;
Game_Map.prototype.spawnEvent = function (originalEventId, x, y, isTemplate) {
    Nupu_spawnEvent.apply(this, arguments);
    this._events[this._events.length - 1]._animationId = SetAnimeNo; 
    this._events[this._events.length - 1]._animationPlaying = true;
    this._events[this._events.length - 1]._realX = x;
    this._events[this._events.length - 1]._realY = y;
    this._events[this._events.length - 1]._x = x;
    this._events[this._events.length - 1]._y = y;
    SetAnimeNo = -1; 
};
Game_Interpreter.prototype.NAnime = function () {
    if (!this.character(0)._animationPlaying) {
        $gameMap.eraseEvent(this.character(0)._eventId);
    }
};
Game_Interpreter.prototype.FadeOut = function (_Timer, _waitFlg) {
    _waitFlg = typeof _waitFlg !== 'undefined' ? _waitFlg : true;
    $gameScreen.startFadeOut(_Timer);
    if (_waitFlg) this.wait(_Timer);
}
Game_Interpreter.prototype.FadeIn = function (_Timer, _waitFlg) {
    _waitFlg = typeof _waitFlg !== 'undefined' ? _waitFlg : true;
    $gameScreen.startFadeIn(_Timer);
    if (_waitFlg) this.wait(_Timer);
}
Game_Interpreter.prototype.SelfSwCng = function (_EvId, _SwStr , _flg) {
    _EvId = typeof _EvId !== 'undefined' ? _EvId : 0;
    _SwStr = typeof _SwStr !== 'undefined' ? _SwStr : "A";
    _flg = typeof _flg !== 'undefined' ? _flg : true;
    let _mapId = this.character(_EvId)._mapId;
    let _key = [_mapId, _EvId, _SwStr];
    $gameSelfSwitches.setValue(_key, _flg);
}
Game_Interpreter.prototype.セルフスイッチ設定_A = function (_EvId , _flg) {
    let _key = [$gameMap.mapId(), _EvId, "A"]
    $gameSelfSwitches.setValue(_key, _flg)
}
Game_Interpreter.prototype.セルフスイッチ設定_B = function (_EvId , _flg) {
    let _key = [$gameMap.mapId(), _EvId, "B"]
    $gameSelfSwitches.setValue(_key, _flg)
}
Game_Interpreter.prototype.セルフスイッチ設定_C = function (_EvId , _flg) {
    let _key = [$gameMap.mapId(), _EvId, "C"]
    $gameSelfSwitches.setValue(_key, _flg)
}
Game_Interpreter.prototype.セルフスイッチ設定_D = function (_EvId , _flg) {
    let _key = [$gameMap.mapId(), _EvId, "D"]
    $gameSelfSwitches.setValue(_key, _flg)
}
Game_Interpreter.prototype.セルフスイッチ確認_A = function (_EvId) {
    $gameSelfSwitches.value([$gameMap.mapId(), _EvId, 'A'])
}
Game_Interpreter.prototype.セルフスイッチ確認_B = function (_EvId) {
    $gameSelfSwitches.value([$gameMap.mapId(), _EvId, 'B'])
}
Game_Interpreter.prototype.セルフスイッチ確認_C = function (_EvId) {
    $gameSelfSwitches.value([$gameMap.mapId(), _EvId, 'C'])
}
Game_Interpreter.prototype.セルフスイッチ確認_D = function (_EvId) {
    $gameSelfSwitches.value([$gameMap.mapId(), _EvId, 'D'])
}
Game_Interpreter.prototype.セルフスイッチ設定 = function (_MapId , _EvId , _Flg , _SelfArr) {
    for (let i = 0; i <= _SelfArr.length - 1; i++) {
        let _key = [_MapId, _EvId, _SelfArr[i]]
        $gameSelfSwitches.setValue(_key, _Flg);
    }
}
//透明度の変更::_透明度(0~255の透明度指定) _CNo(キャラNo -1:プレイヤー　0:発動イベント)
Game_Character.prototype.C透明度 = function (_透明度) {
    _透明度 = typeof _透明度 !== 'undefined' ? _透明度 : 255;
    this._opacity = _透明度;
}
Game_Character.prototype.Cワープ = function (_psX , _psY) {
    this._realX = _psX; this._x = _psX;
    this._realY = _psY; this._y = _psY;
}
Game_Interpreter.prototype.Ev強制Move = function (_mvX , _mvY) {
    this.character(0)._realX += _mvX;
    this.character(0)._x += _mvX;
    this.character(0)._realY += _mvY;
    this.character(0)._y += _mvY;
}
Game_Interpreter.prototype.Ev吹き出し表示 = function (iconId , waitFlg , evNo) {
    waitFlg = typeof waitFlg !== 'undefined' ? waitFlg : true;
    evNo = typeof evNo !== 'undefined' ? evNo : 0;
    this.character(evNo).requestBalloon(iconId)
    if (waitFlg) {
        this._character = this.character(evNo);
        this.setWaitMode("balloon"); 
    }
}
Game_Interpreter.prototype.SetDirectionEv = function (character , eventId) {
    let event = $gameMap.event(eventId);
    let eventX = event.x;
    let eventY = event.y;
    let charaX = character.x;
    let charaY = character.y;
    if (charaX < eventX) {
        character.setDirection(6); 
    } else if (charaX > eventX) {
        character.setDirection(4); 
    } else if (charaY < eventY) {
        character.setDirection(2); 
    } else if (charaY > eventY) {
        character.setDirection(8); 
    }
}
