// Copyright (c) 2015 Mokusei Penguin
/*:
 * @plugindesc 
 * @author 木星ペンギン
 *
 * @help 
 * @param Search Limit
 * @desc 移動できる距離
 * @default 12
 *
 */
(function() {
var parameters = PluginManager.parameters('JsScript34Set');
var searchLimit = Number(parameters['Search Limit']);
Game_Character.prototype.movePos = function(x, y, skippable) {
    skippable = skippable || false;
    var direction = this.findDirectionTo(x, y);
    if (direction > 0) {
        this.moveStraight(direction);
        this.setMovementSuccess(false);
    } else if (Math.abs(this._x - x) + Math.abs(this._y - y) < searchLimit) {
        this.setMovementSuccess(skippable || this.pos(x, y));
    }
};
Game_Character.prototype.M_P = function(x, y, skippable) {
    skippable = skippable || false;
    var direction = this.findDirectionTo(x, y);
    if (direction > 0) {
        this.moveStraight(direction);
        this.setMovementSuccess(false);
    } else if (Math.abs(this._x - x) + Math.abs(this._y - y) < searchLimit) {
        this.setMovementSuccess(skippable || this.pos(x, y));
    }
};
Game_Character.prototype.searchLimit = function() {
    return searchLimit;
};
})();
