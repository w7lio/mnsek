Game_Interpreter.prototype.EvStart = function (_EvId) {
    try {
        $gameMap._events[_EvId].start();
    } catch (e) { 
        console.log("イベント未発見"); 
    }
}
var Nupu_ErrLogUpdate_Add = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    Nupu_ErrLogUpdate_Add.call(this);
    if (Input.isTriggered('tab')) { 
        N_ErrViewFlg = false; 
        N_ErrMsg = [];
        for (var ei = ErrLogPic; ei <= ErrLogPic + 10; ei++) {
            this.DelPict(ei); 
        }
    }
}
