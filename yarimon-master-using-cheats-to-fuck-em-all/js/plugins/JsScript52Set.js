const VN_GetItemName = 61;
const VN_GetItemKosu = 69;
let command126Ex = Game_Interpreter.prototype.command126;
Game_Interpreter.prototype.command126 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataItems[this._params[0]], value);
    var itemName = $N_Yarimon_DB.douguDatas[this._params[0] - 1].name;
    $gameVariables.setValue(VN_GetItemName , itemName);
    $gameVariables.setValue(VN_GetItemKosu , value);
    return true;
};
