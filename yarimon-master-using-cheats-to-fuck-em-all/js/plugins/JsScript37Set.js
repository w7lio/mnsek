/*:ja
 * @plugindesc 
 */
let PL_direction = 0;   
let PL_realX = 0;   
let PL_realY = 0;   
let PL_winX = 0;    
let PL_winY = 0;    
let PL_MouseX = 0;  
let PL_MouseY = 0;  
class Pos2D {
    constructor(_setposx ,_setposy) {
        this._x = _setposx;
        this._y = _setposy;
    }
}
let Pos2DSaGet = function(_Pos1 , _Pos2){
    let _SaX = Math.abs(_Pos1._x - _Pos2._x);
    let _SaY = Math.abs(_Pos1._y - _Pos2._y);
    return _SaX + _SaY;
}
let NUpdateFlame = 0; 
let Bef_PL_MouseX = 0; let Bef_PL_MouseY = 0;
let MouseStopFlame = 0; 
Game_Interpreter.prototype.NUpdate = function () {
    PL_direction = this.character(-1)._direction;
    PL_realX = this.character(-1)._realX;
    PL_realY = this.character(-1)._realY;
    PL_winX = PL_realX * 48 - $gameMap._displayX * 48;
    PL_winY = PL_realY * 48 - $gameMap._displayY * 48;
    PL_MouseX = TouchInput.mouseX;
    PL_MouseY = TouchInput.mouseY;
    if (PL_MouseX == Bef_PL_MouseX && PL_MouseY == Bef_PL_MouseY) {
        MouseStopFlame++; 
    } else {
        Bef_PL_MouseX = PL_MouseX;
        Bef_PL_MouseY = PL_MouseY;
        MouseStopFlame = 0;
    }
    NUpdateFlame++;
}
let NBB_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    NBB_performTransfer.call(this);
    NUpdateFlame = 0;
}
let NBB_Flame = 0;
let _NBB_Game_Screen_update = Game_Screen.prototype.update;
Game_Screen.prototype.update = function () {
    _NBB_Game_Screen_update.call(this);
    NBB_Flame++;
};
let _Nsprite_Skip = false;
Game_Interpreter.prototype.NUpdateSc = function () {
    try {
        if(!_Nsprite_Skip){
            this.spCmp_Update();
        }
    } catch(e) {
        console.log("_Nsprite_Skip:Err");
        _Nsprite_Skip = true;
    }
    KeyFlameUpdate(); 
}
let tabDownFlame = 0;
let okDownFlame = 0;
let shiftDownFlame = 0;
let controlDownFlame = 0;
let escapeDownFlame = 0;
let menuDownFlame = 0;
let upDownFlame = 0;
let downDownFlame = 0;
let leftDownFlame = 0;
let rightDownFlame = 0;
let KeyFlameUpdate = function () {
    Input.isPressed('tab') ? tabDownFlame++ : tabDownFlame = 0;
    Input.isPressed('ok') ? okDownFlame++ : okDownFlame = 0;
    Input.isPressed('shift') ? shiftDownFlame++ : shiftDownFlame = 0;
    Input.isPressed('control') ? controlDownFlame++ : controlDownFlame = 0;
    Input.isPressed('escape') ? escapeDownFlame++ : escapeDownFlame = 0;
    Input.isPressed('menu') ? menuDownFlame++ : menuDownFlame = 0;
    Input.isPressed('up') ? upDownFlame++ : upDownFlame = 0;
    Input.isPressed('down') ? downDownFlame++ : downDownFlame = 0;
    Input.isPressed('left') ? leftDownFlame++ : leftDownFlame = 0;
    Input.isPressed('right') ? rightDownFlame++ : rightDownFlame = 0;
}
let NBB_Flame_ck = 0;
let Nupu_Base_update = Game_Interpreter.prototype.update;
Game_Interpreter.prototype.update = function () {
    Nupu_Base_update.call(this);
    if (NBB_Flame_ck != NBB_Flame){
        this.NUpdateSc(); 
        NBB_Flame_ck = NBB_Flame;
    }
    if (!MapInterpreterFlg) return; 
    this.NUpdate(); 
}
let MapInterpreterFlg = false;
let NupuBase_Game_Map_updateInterpreter = Game_Map.prototype.updateInterpreter;
Game_Map.prototype.updateInterpreter = function () {
    MapInterpreterFlg = true;
    NupuBase_Game_Map_updateInterpreter.call(this);
    MapInterpreterFlg = false;
}
let Nupu_Base_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
    Nupu_Base_reserveTransfer.call(this, mapId, x, y, d, fadeType);
    NUpdateFlame = 0; 
};
let CopyArr = function (_copyArr) {
    return _copyArr.slice(0 , _copyArr.length);
};
let ShuffleArr = function (_SetArr) {
    for (let i = _SetArr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = _SetArr[i];
        _SetArr[i] = _SetArr[j];
        _SetArr[j] = tmp;
    }
}
function ArrGetRandData(arrayData) {
    let arrayIndex = Math.floor(Math.random() * arrayData.length);
    return arrayData[arrayIndex];
}
function ArrGetRandArr(arrayData, count) {
    count = count || 1;
    let result = [];
    for (let i = 0; i < count; i++) {
        let arrayIndex = Math.floor(Math.random() * arrayData.length);
        result[i] = arrayData[arrayIndex];
        arrayData.splice(arrayIndex, 1);
    }
    return result;
}
function ArrRemoveArr(arrayData, delArr) {
    for (let i = 0; i <= arrayData.length - 1; i++) {
        for (let j = 0; j <= delArr.length - 1; j++) {
            if(arrayData[i] == delArr[j]) {
                arrayData.splice(i , 1); i--;
            }
        }
    }
}
Game_Interpreter.prototype.SetCmnEvent = function (CmnNo , _SkipFlg) {
    _SkipFlg = typeof _SkipFlg !== 'undefined' ? _SkipFlg : false;
    if (_SkipFlg) {
        console.log("SetCmnEvent:スキップ");
        return;
    }
    //$gameTemp.reserveCommonEvent(CmnNo);
    try {
        this.setupChild($dataCommonEvents[CmnNo].list, 0);
    }catch(ex){
        console.log("SetCmnEvent:Err");
    }
};
Game_Interpreter.prototype.SetCmnEventSc = function (CmnNo , _SkipFlg) {
    _SkipFlg = typeof _SkipFlg !== 'undefined' ? _SkipFlg : false;
    if (_SkipFlg) {
        console.log("SetCmnEventSc:スキップ");
        return;
    }
    try {
        $gameTemp.reserveCommonEvent(CmnNo);
    } catch (ex) {
        console.log("SetCmnEventSc:Err");
    }
};
Game_Interpreter.prototype.LblJump = function (LblName) {
    for (let i = 0; i < this._list.length; i++) {
        if (this._list[i].parameters[0] == LblName) {
            this.jumpTo(i)
        }
    }
};
//■指定した文字(seq)の文字位置を調べる■■■■■
let counter = function (str, seq) {
    try {
        return str.split(seq).length - 1;
    } catch (e) { return -1; }
};
function isNumber(numVal) {
    let pattern = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
    return pattern.test(numVal);
}
(function () {
    'use strict';
    let _TouchInput__onMouseMove = TouchInput._onMouseMove;
    TouchInput._onMouseMove = function (event) {
        _TouchInput__onMouseMove.apply(this, arguments);
        this.mouseX = Graphics.pageToCanvasX(event.pageX);
        this.mouseY = Graphics.pageToCanvasY(event.pageY);
    };
})();
TouchInput._onWheel = function (event) {
    try {
        this._events.wheelX += event.deltaX;
        this._events.wheelY += event.deltaY;
        //event.preventDefault();
    } catch(e) {
        console.log(e);
    }
};
Game_Interpreter.prototype.SetVN_Arr = function(_Arr , _Var) {
    for (let i = 0; i <= _Arr.length - 1; i++) {
        $gameVariables.setValue(_Arr[i] ,_Var)
    }
}
Game_Interpreter.prototype.SetVN_Span = function(_StartVn , _EndVn , _Var) {
    for (let i = _StartVn; i <= _EndVn; i++) {
        $gameVariables.setValue(i ,_Var)
    }
}
class N_Func {
    constructor(_Siki , _Func) {
        this._Siki = _Siki;
        this._Func = _Func;
    }
}
let RPG_NFunc_Function = function (_script) {
    let _Func = new Function("_ck_this" , _script.replace(/this./g, '_ck_this.'));
    let _NFunc = new N_Func(_script , _Func);
    return _NFunc;
}
let RPG_NFunc_Return = function (_script) {
    let _Func = new Function("_ck_this" , "return " + _script.replace(/this./g, '_ck_this.'));
    let _NFunc = new N_Func(_script , _Func);
    return _NFunc;
}
let _Cmd355_FuncArr = []; 
Game_Interpreter.prototype.command355_Check = function() {
    return false;
}
let _cmd355_keep = false; 
Game_Interpreter.prototype.command355 = function() {
    if (!_cmd355_keep) {
        let script = this.currentCommand().parameters[0] + '\n';
        while (this.nextEventCode() === 655) {
            this._index++;
            script += this.currentCommand().parameters[0] + '\n';
        }
        try {
            for (let i = 0; i <= _Cmd355_FuncArr.length - 1; i++) {
                if(_Cmd355_FuncArr[i]._Siki == script) {
                    _Cmd355_FuncArr[i]._Func(this);
                    _Cmd355_FuncArr.unshift(_Cmd355_FuncArr[i]);
                    _Cmd355_FuncArr.splice(i + 1 , 1);
                    return true;
                }
            }
            let _NFunc = RPG_NFunc_Function(script)
            _NFunc._Func(this);
            _Cmd355_FuncArr.unshift(_NFunc);
        } catch (e) {
            Yanfly.Util.displayError(e, script, 'SCRIPT CALL ERROR');
        }
        _cmd355_keep = true;
        if(this.command355_Check()) return false;
    } else {
        if(this.command355_Check()) return false;
    }
    _cmd355_keep = false;
    return true;
};
let _Cmd122_FuncArr = []; 
Yanfly.Core.Game_Interpreter_command122 = Game_Interpreter.prototype.command122;
Game_Interpreter.prototype.command122 = function() {
    switch (this._params[3]) {
        case 4:  
            let value = 0;
            let code = this._params[4];
            try {
                //eval(script); //nupu::evalを使うとメモリに残り続けるため対応
                let _AddFlg = true;
                for (let i = 0; i <= _Cmd122_FuncArr.length - 1; i++) {
                    if(_Cmd122_FuncArr[i]._Siki == code) {
                        value = _Cmd122_FuncArr[i]._Func(this);
                        _Cmd122_FuncArr.unshift(_Cmd122_FuncArr[i]);
                        _Cmd122_FuncArr.splice(i + 1 , 1);
                        _AddFlg = false;
                    }
                }
                if(_AddFlg){
                    let _NFunc = RPG_NFunc_Return(code)
                    _Cmd122_FuncArr.unshift(_NFunc);
                    value = _NFunc._Func(this);
                }
            } catch (e) {
                Yanfly.Util.displayError(e, code, 'CONTROL VARIABLE SCRIPT ERROR');
            }
            for (let i = this._params[0]; i <= this._params[1]; i++) {
                this.operateVariable(i, this._params[2], value);
            }
            return true;
    }
    return Yanfly.Core.Game_Interpreter_command122.call(this);
};
let _MoveCmd_FuncArr = []; 
Yanfly.Core.Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
Game_Character.prototype.processMoveCommand = function(command) {
    let gc = Game_Character;
    let params = command.parameters;
    switch (command.code) {
        case gc.ROUTE_SCRIPT:
            try {
                let code = params[0];
                //eval(script); //nupu::evalを使うとメモリに残り続けるため対応
                let _AddFlg = true;
                for (let i = 0; i <= _MoveCmd_FuncArr.length - 1; i++) {
                    if(_MoveCmd_FuncArr[i]._Siki == code) {
                        value = _MoveCmd_FuncArr[i]._Func(this);
                        _MoveCmd_FuncArr.unshift(_MoveCmd_FuncArr[i]);
                        _MoveCmd_FuncArr.splice(i + 1 , 1);
                        _AddFlg = false;
                    }
                }
                if(_AddFlg){
                    let _NFunc = RPG_NFunc_Function(code)
                    _MoveCmd_FuncArr.unshift(_NFunc);
                    value = _NFunc._Func(this);
                }
            } catch (e) {
                Yanfly.Util.displayError(e, params[0], 'MOVE ROUTE SCRIPT ERROR');
            }
            return;
    }
    return Yanfly.Core.Game_Character_processMoveCommand.call(this, command);
};
//使用方法 this.N_Plgin([プラグインコマンドをカンマ区切り])
Game_Interpreter.prototype.N_Plgin = function (_CmndStr,_PlginArr) {
    let args = [];
    for (let i = 0; i <= _PlginArr.length - 1; i++) {
        args.push(String(_PlginArr[i]));
    }
    this.pluginCommand(String(_CmndStr), args);
}
let MetaChecker = function (_Obj, _metaStr, _undefineVal) {
    _undefineVal = typeof _undefineVal !== 'undefined' ? _undefineVal : "";
    try {
        if (_Obj.meta[_metaStr] == undefined) return _undefineVal;
        return _Obj.meta[_metaStr];
    }catch(ex){
        return _undefineVal;
    }
}
let factorial = function(_Var , _回数){
    _RtnVar = _Var;
    for (let i = 0; i <= _回数 - 1; i++) {
        _RtnVar *= _Var;
    }
    return _RtnVar;
}
let _以降文字削除 = function(_RtnStr , _ckStr) {
    let _Str = _RtnStr.split(_ckStr)[0];
    return _Str;
}
let EventMetaGet = function (_EvID, _Tag, _undefineVal) {
    _undefineVal = typeof _undefineVal !== 'undefined' ? _undefineVal : "";
    let _eventStr = String(_EvID);
    let noteVar = $dataMap.events[_eventStr].meta[_Tag];
    if (noteVar == undefined) {
        return _undefineVal;
    }
    return noteVar;
}
let _NB_isNearTheScreen = Game_CharacterBase.prototype.isNearTheScreen;
Game_CharacterBase.prototype.isNearTheScreen = function() {
    if(this._customResource == 'Parallax') return true; 
    return _NB_isNearTheScreen.call(this);
}
class ModeBox {
    constructor(_name ,　_modeBoxArr = []){
        this.name = _name; 
        this.flame = 0; 
        this.selModeNo = -1;
        this.modeBoxArr = _modeBoxArr;
        this.preSelModeNo = -1; 
        this.modeBoxArr.forEach(_mode => {
            _mode.parent = this; 
        });
        this.resetModeName = ""; 
        this.autoFlame = -1; 
        this.autoKeepFlg = false;
        this.autoParentFlg = false;
        this.autoModeStr = "";  
    }
    get mode(){
        return this.modeBoxArr[this.selModeNo];
    }
    get modeName() {
        if(this.selModeNo == -1) return "";
        return this.modeBoxArr[this.selModeNo].name;
    }
    get modeflame() {
        if(this.selModeNo == -1) return -1;
        return this.modeBoxArr[this.selModeNo].flame;
    }
    set modeflame(value) {
        this.modeBoxArr[this.selModeNo].flame = value;
    }
    ResetFlame() {
        this.modeBoxArr[this.selModeNo].flame = 0;
    }
    ModeFlameGet (_modeName) {
        this.modeBoxArr.forEach(_mode => {
            if(_mode.name == _modeName) {
                return _mode.flame;
            }
        });
        return -1;
    }
    ModeCng(_modeStr , flameKeepFlg = false) {
        this.preSelModeNo = this.selModeNo;
        if(this.selModeNo != -1 && !flameKeepFlg) {
            this.modeBoxArr[this.selModeNo].Reset();
        }
        for (let i = 0; i <= this.modeBoxArr.length - 1; i++) {
            if(this.modeBoxArr[i].name == _modeStr) {
                this.selModeNo = i;
            }
        }
    }
    ModeCng_Back(flameKeepFlg = false) {
        if(!flameKeepFlg) this.modeBoxArr[this.selModeNo].Reset();
        for (let i = 0; i <= this.modeBoxArr.length - 1; i++) {
            if(this.modeBoxArr[i].name == _modeStr) {
                this.selModeNo = i;
            }
        }
    }
    ModeCng_Flame(_modeStr , _flame , _flameKeepFlg) {
        _flameKeepFlg = typeof _flameKeepFlg !== 'undefined' ? _flameKeepFlg : false;
        this.autoParentFlg = false;
        this.autoModeStr = _modeStr;
        this.autoFlame = _flame;
        this.autoKeepFlg = _flameKeepFlg;
    }
    ModeCngParent_Flame(_modeStr , _flame , _flameKeepFlg) {
        _flameKeepFlg = typeof _flameKeepFlg !== 'undefined' ? _flameKeepFlg : false;
        this.autoParentFlg = true;
        this.autoModeStr = _modeStr;
        this.autoFlame = _flame;
        this.autoKeepFlg = _flameKeepFlg;
    }
    Update() {
        if(this.selModeNo != -1) {
            this.modeBoxArr[this.selModeNo].Update(); 
        }
        this.flame++;
        if(this.autoFlame > 0) {
            this.autoFlame--;
            if(this.autoFlame == 0) {
                if(this.autoParentFlg) {
                    if(this.parent != undefined) {
                        this.parent.ModeCng(this.autoModeStr);
                    }
                } else {
                    this.ModeCng(this.autoModeStr);
                }
            }
        }
    }
    Reset() {
        this.flame = 0;
        this.modeBoxArr.forEach( _mode => {
            _mode.Reset();
        });
        if(this.resetModeName != "") {
            this.ModeCng(this.resetModeName);
        }
    }
}
class Select_ModeBox extends ModeBox {
    constructor(_name ,　_modeBoxArr = []) {
        super(_name , _modeBoxArr);
        this.selecterResetFlg = false;
        this.selecterNo = 0;    
        this.selectNoMax = 3;   
        this.skipSelectNo = []; 
        this.selecterLoopFlg = true; 
        this.selectNoMax2 = 1;
        this.selecterNo2 = 0;
        this.selecterLoopFlg2 = true; 
        this.selectGrid = []; 
        this.selectNoMaxX = 2;
        this.selecterNoX = 0;
        this.selecterLoopFlgX = true; 
        this.selecterNoY = 0;
        this.selectNoMaxY = 2;
        this.selecterLoopFlgY = true; 
        this.befSelecterNo = -1;
        this.befSelecterNo2 = -1;
        this.befSelecterNoX = -1;
        this.befSelecterNoY = -1;
        this.n_Scroll = null;
    }
    selectNo_Up(_Action) {
        _Action = typeof _Action !== 'undefined' ? _Action : null;
        this.selecterNo--;
        if (this.n_Scroll != null) {
            if(this.selecterNo < 0) this.selecterNo = 0;
            let _ckSelNo = this.selecterNo - this.n_Scroll.ZureNo;
            if(_ckSelNo < 0) this.n_Scroll.ZureNo = this.selecterNo;
            return;
        }
        if (this.selecterNo < 0) {
            if (this.selecterLoopFlg) {
                this.selecterNo = this.selectNoMax;
            } else {
                this.selecterNo = 0;
            }
        }
        if (this.skipSelectNo.indexOf(this.selecterNo) != -1) {
            this.selectNo_Up(_Action); 
            return;
        }
        if (_Action != null) _Action();
    }
    selectNo_Down(_Action) {
        _Action = typeof _Action !== 'undefined' ? _Action : null;
        this.selecterNo++;
        if(this.n_Scroll != null) {
            if (this.selecterNo > this.selectNoMax) this.selecterNo = this.selectNoMax;
            let _ckSelNo = this.selecterNo - this.n_Scroll.ZureNo;
            if(_ckSelNo > this.n_Scroll.ViewCount - 1) {
                this.n_Scroll.ZureNo = (this.selecterNo - (this.n_Scroll.ViewCount - 1));
            }
            return;
        }
        if(this.selecterNo > this.selectNoMax) {
            if(this.selecterLoopFlg) {
                this.selecterNo = 0;
            } else {
                this.selecterNo = this.selectNoMax;
            }
        }
        if(this.skipSelectNo.indexOf(this.selecterNo) != -1) {
            this.selectNo_Down(_Action); 
            return;
        }
        if(_Action != null) _Action();
    }
    selectNo_NoSet(_value) {
        this.selecterNo = _value;
    }
    get IsSelecterMove() { 
        return this.befSelecterNo != this.selecterNo;
    }
    selectNo_Up2() {
        this.selecterNo2--;
        if(this.selecterNo2 < 0) {
            if(this.selecterLoopFlg2) {
                this.selecterNo2 = this.selectNoMax2;
            } else {
                this.selecterNo2 = 0;
            }
        }
    }
    selectNo_Down2() {
        this.selecterNo2++;
        if(this.selecterNo2 > this.selectNoMax2) {
            if(this.selecterLoopFlg2) {
                this.selecterNo2 = 0;
            } else {
                this.selecterNo2 = this.selectNoMax2;
            }
        }
    }
    selectNo_NoSet2(_value) {
        this.selecterNo2 = _value;
    }
    get IsSelecterMove2() { 
        return this.befSelecterNo2 != this.selecterNo2;
    }
    selectGrid_Reset(_setBool) {
        _setBool = typeof _setBool !== 'undefined' ? _setBool : true;
        this.selectGrid = [];
        for (let i = 0; i <= this.selectNoMaxY; i++) {
            let _setArr = [];
            for (let j = 0; j <= this.selectNoMaxX; j++) {
                _setArr.push(_setBool);
            }
            this.selectGrid.push(_setArr);
        }
    }
    selecter_Right(){
        var befX = this.selecterNoX;
        let _cnt = 0;
        while (true) {
            this.selecterNoX++;
            if (this.selectNoMaxX < this.selecterNoX) {
                if(this.selecterLoopFlgX) {
                    this.selecterNoX = 0;
                } else {
                    this.selecterNoX = this.selectNoMaxX;
                }
            }
            if(this.selectGrid[this.selecterNoY][this.selecterNoX]) {
                break;
            }
            if(this.selectNoMaxX < _cnt) {
                this.selecterNoX = befX;
                break;
            }
            _cnt++;
        }
    }
    selecter_Left(){
        let _cnt = 0;
        while (true) {
            this.selecterNoX--;
            if (this.selecterNoX < 0) {
                if(this.selecterLoopFlgX) {
                    this.selecterNoX = this.selectNoMaxX;
                } else {
                    this.selecterNoX = 0;
                }
            }
            if(this.selectGrid[this.selecterNoY][this.selecterNoX]) {
                break;
            }
            if(this.selectNoMaxX < _cnt) break;
            _cnt++;
        }
    }
    selecter_Down(){
        let _cnt = 0;
        while (true) {
            this.selecterNoY++;
            if (this.selectNoMaxY < this.selecterNoY) {
                if(this.selecterLoopFlgY) {
                    this.selecterNoY = 0;
                } else {
                    this.selecterNoY = this.selectNoMaxY;
                }
            }
            if(this.selectGrid[this.selecterNoY][this.selecterNoX]) {
                break;
            }
            if(this.selectNoMaxY < _cnt) break;
            _cnt++;
        }
    }
    selecter_Up(){
        let _cnt = 0;
        while (true) {
            this.selecterNoY--;
            if (this.selecterNoY < 0) {
                if(this.selecterLoopFlgY) {
                    this.selecterNoY = this.selectNoMaxY;
                } else {
                    this.selecterNoY = 0;
                }
            }
            if(this.selectGrid[this.selecterNoY][this.selecterNoX]) {
                break;
            }
            if(this.selectNoMaxY < _cnt) break;
            _cnt++;
        }
    }
    get IsSelecterGridMove() { 
        return this.befSelecterNoX != this.selecterNoX || this.befSelecterNoY != this.selecterNoY;
    }
    Update() {
        super.Update();
        this.befSelecterNo = this.selecterNo;
        this.befSelecterNo2 = this.selecterNo2;
        this.befSelecterNoX = this.selecterNoX;
        this.befSelecterNoY = this.selecterNoY;
    }
    Reset() {
        super.Reset();
        if(this.selecterResetFlg) {
            this.selecterNo = 0;
            this.selecterNo2 = 0;
            this.befSelecterNoX = 0;
            this.befSelecterNoY = 0;
        }
    }
}
class OneSelecter {
    constructor(_XMax) {
        this.selecterNo = 0;    
        this.selectNoMax = _XMax;   
        this.skipSelectNo = []; 
        this.befSelecterNo = -1;
        this.loopFlg = true;
        this.n_Scroll = null;
    }
    selectNo_Up(_Action) {
        _Action = typeof _Action !== 'undefined' ? _Action : null;
        this.selecterNo--;
        if(this.n_Scroll != null) {
            if(this.selecterNo < 0) this.selecterNo = 0;
            let _ckSelNo = this.selecterNo - this.n_Scroll.ZureNo;
            if(_ckSelNo < 0) this.n_Scroll.ZureNo = this.selecterNo;
            return;
        }
        if(this.selecterNo < 0) {
            if(this.loopFlg) {
                this.selecterNo = this.selectNoMax;
            } else {
                this.selecterNo = 0;
            }
        }
        if(this.skipSelectNo.indexOf(this.selecterNo) != -1) {
            this.selectNo_Up(_Action); 
            return;
        }
        if(_Action != null) _Action();
    }
    selectNo_Down(_Action) {
        _Action = typeof _Action !== 'undefined' ? _Action : null;
        this.selecterNo++;
        if(this.n_Scroll != null) {
            if (this.selecterNo > this.selectNoMax) this.selecterNo = this.selectNoMax;
            let _ckSelNo = this.selecterNo - this.n_Scroll.ZureNo;
            if(_ckSelNo > this.n_Scroll.ViewCount - 1) {
                this.n_Scroll.ZureNo = (this.selecterNo - (this.n_Scroll.ViewCount - 1));
            }
            return;
        }
        if(this.selecterNo > this.selectNoMax) {
            if(this.loopFlg) {
                this.selecterNo = 0;
            } else {
                this.selecterNo = this.selectNoMax;
            }
        }
        if(this.skipSelectNo.indexOf(this.selecterNo) != -1) {
            this.selectNo_Down(_Action); 
            return;
        }
        if(_Action != null) _Action();
    }
    selectNo_NoSet(_value) {
        this.selecterNo = _value;
    }
    get IsSelecterMove() { 
        let rtnFlg = this.befSelecterNo != this.selecterNo;
        this.befSelecterNo = this.selecterNo;
        return rtnFlg;
    }
}
class ArrSelecter {
    constructor(_XMax , _YMax) {
        this.selectArr = []; 
        this.setArr(_XMax , _YMax); 
        this.selecterX = 0;
        this.selecterY = 0;
        this.befSelecterX = 0;
        this.befSelecterY = 0;
        this.loopFlg = true;
    }
    get IsSelecterMove() { 
        let _rtnBool = this.selecterX != this.befSelecterX || this.selecterY != this.befSelecterY;
        this.befSelecterX = this.selecterX;
        this.befSelecterY = this.selecterY;
        return _rtnBool;
    }
    setArr(_XMax , _YMax) {
        this.selectArr = []; 
        for (let i = 0; i <= _YMax - 1; i++) {
            let _xArr = [];
            for (let i = 0; i <= _XMax - 1; i++) {
                _xArr.push(false);
            }
            this.selectArr.push(_xArr);
        }
    }
    selecter_Up() {
        let befSelNo = this.selecterY;
        if(this.selecterY == 0 && !this.loopFlg) return false;
        while(true) {
            this.selecterY--;
            if (this.selecterY == -1) this.selecterY = this.selectArr.length - 1;
            if (this.selecterY == befSelNo) return false;
            if (this.selectArr[this.selecterY][this.selecterX]) return true;
            if (!this.loopFlg && this.selecterY == 0) {
                this.selecterY = befSelNo;
                return false;
            }
        }
    }
    selecter_Down() {
        let befSelNo = this.selecterY;
        if(this.selecterY == this.selectArr.length - 1 && !this.loopFlg) return false;
        while(true) {
            this.selecterY++;
            if (this.selecterY == this.selectArr.length) this.selecterY = 0;
            if (this.selecterY == befSelNo) return false;
            if (this.selectArr[this.selecterY][this.selecterX]) return true;
            if (!this.loopFlg && this.selecterY == this.selectArr.length) {
                this.selecterY = befSelNo;
                return false;
            }
        }
    }
    selecter_Left() {
        let befSelNo = this.selecterX
        if(this.selecterX == 0 && !this.loopFlg) return false;
        while(true) {
            this.selecterX--;
            if (this.selecterX == -1) this.selecterX = this.selectArr[this.selecterY].length - 1;
            if (this.selecterX == befSelNo) return false;
            if (this.selectArr[this.selecterY][this.selecterX]) return true;
            if (!this.loopFlg && this.selecterX == 0) {
                this.selecterX = befSelNo;
                return false;
            }
        }
    }
    selecter_Right() {
        let befSelNo = this.selecterX;
        if(this.selecterX == this.selectArr[this.selecterY].length - 1 && !this.loopFlg) return false;
        while(true) {
            this.selecterX++;
            if (this.selecterX == this.selectArr[this.selecterY].length) this.selecterX = 0;
            if (this.selecterX == befSelNo) return false;
            if (this.selectArr[this.selecterY][this.selecterX]) return true;
            if (!this.loopFlg && this.selecterX == this.selectArr.length) {
                this.selecterX = befSelNo;
                return false;
            }
        }
    }
}
class ModeArr {
    constructor () {
        this.Mode = [];
        this.ModeNo = -1;
        this.ModeName = "";
    }
    Update () {
        if(this.ModeNo != -1) this.Mode[this.ModeNo].Update();
    }
    ModeGet (_modeName) {
        for (let i = 0; i <= this.Mode.length - 1; i++) {
            if(this.Mode[i].name == _modeName) {
                return this.Mode[i];
            }
        }
    }
    ModeAdd (_modeData) {
        this.Mode.push(_modeData);
    }
    ModeCng (_modeName) {
        if (this.ModeNo != -1) {
            if(this.Mode[this.ModeNo].OutAction != null) {
                this.Mode[this.ModeNo].OutAction();
            }
        }
        for (let i = 0; i <= this.Mode.length - 1; i++) {
            if(this.Mode[i].name == _modeName) {
                this.ModeName = _modeName;
                this.ModeNo = i;
                if(this.Mode[this.ModeNo].InAction != null) {
                    this.Mode[this.ModeNo].InAction();
                }
            }
        }
    }
}
class ModeData {
    constructor(_name) {
        this.name = _name;
        this.flame = 0;
        this.InAction = null;
        this.OutAction = null;
        this.UpdateAction = null;
    }
    Update() {
        if (this.UpdateAction != null) this.UpdateAction();
        this.flame++;
    }
}
function wrapText(text, maxLineLength) {
    if (text == 0 || text == "") return "";
    let words = text.split(' ');
    let currentLine = '';
    let formattedText = '';
    words.forEach(word => {
        if (currentLine.length + word.length + 1 > maxLineLength) {
            formattedText += currentLine + '\n';
            currentLine = word;  
        } else {
            if (currentLine.length > 0) {
                currentLine += ' ';
            }
            currentLine += word;
        }
    });
    if (currentLine.length > 0) {
        formattedText += currentLine;
    }
    return formattedText;
}
class PhaseManager {
    constructor(gameInterpreter) {
        this.gi = gameInterpreter;
        this.doPhase = null; 
        this.exitFlg = false;
    }
    CngPhase(setPhase) {
        if (this.doPhase != null) this.doPhase.Exit(this.gi);
        this.doPhase = setPhase;
        this.doPhase.Enter(this.gi);
    }
    Update() {
        if (this.doPhase != null)
            this.doPhase.Update(this.gi);
    }
}
class PhaseBase {
    constructor() {
    }
    Enter(gi) { }       
    Update(gi) { }   
    Exit(gi) { }      
}
/*---------------------------------------------------------------------------*
 * 2019/09/26 kido
 * Ver.1.0 古いPCでフィルタすると画面が拡大するのを抑止
 *---------------------------------------------------------------------------*/
Sprite.voidFilter.padding = 0;
