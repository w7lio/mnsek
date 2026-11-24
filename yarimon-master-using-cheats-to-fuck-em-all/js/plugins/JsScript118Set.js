var Imported = Imported || {};
Imported.YEP_RegionRestrictions = true;
var Yanfly = Yanfly || {};
Yanfly.RR = Yanfly.RR || {};
 /*:
 * @plugindesc 
 * being able to venture into those spots.
 * @author Yanfly Engine Plugins
 *
 * @param Player Restrict
 * @desc This region ID will restrict the player from entering.
 * Use 0 if you do not wish to make use of this property.
 * @default 0
 *
 * @param Event Restrict
 * @desc This region ID will restrict all events from entering.
 * Use 0 if you do not wish to make use of this property.
 * @default 0
 *
 * @param All Restrict
 * @desc This region ID will restrict players and events.
 * Use 0 if you do not wish to make use of this property.
 * @default 0
 *
 * @param Player Allow
 * @desc This region ID will always allow player passability.
 * Use 0 if you do not wish to make use of this property.
 * @default 0
 *
 * @param Event Allow
 * @desc This region ID will always allow events passability.
 * Use 0 if you do not wish to make use of this property.
 * @default 0
 *
 * @param All Allow
 * @desc This region ID will always allow both passability.
 * Use 0 if you do not wish to make use of this property.
 * @default 0
 *
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author Yanfly Engine Plugins
 *
 * @param Player Restrict
 * @desc ここで指定したリージョンIDは、プレイヤーの進入を制限します。不要な場合は0を入力してください。
 * @default 0
 *
 * @param Event Restrict
 * @desc ここで指定したリージョンIDは、全てのイベントの進入を制限します。不要な場合は0を入力してください。
 * @default 0
 *
 * @param All Restrict
 * @desc ここで指定したリージョンIDは、プレイヤーとイベント両方の進入を制限します。不要な場合は0を入力してください。
 * @default 0
 *
 * @param Player Allow
 * @desc ここで指定したリージョンIDは、プレイヤーの進入を許可します。不要な場合は0を入力してください。
 * @default 0
 *
 * @param Event Allow
 * @desc ここで指定したリージョンIDは、常にイベントの進入を許可します。不要な場合は0を入力してください。
 * @default 0
 *
 * @param All Allow
 * @desc ここで指定したリージョンIDは、常にプレイヤーとイベント両方の進入を許可します。不要な場合は0を入力してください。
 * @default 0
 *
 * @help 
 */
Yanfly.Parameters = PluginManager.parameters('JsScript118Set');
Yanfly.Param = Yanfly.Param || {};
Yanfly.Param.RRAllAllow = Number(Yanfly.Parameters['All Allow']);
Yanfly.Param.RRAllRestrict = Number(Yanfly.Parameters['All Restrict']);
Yanfly.Param.RREventAllow = Number(Yanfly.Parameters['Event Allow']);
Yanfly.Param.RREventRestrict = Number(Yanfly.Parameters['Event Restrict']);
Yanfly.Param.RRPlayerAllow = Number(Yanfly.Parameters['Player Allow']);
Yanfly.Param.RRPlayerRestrict = Number(Yanfly.Parameters['Player Restrict']);
Yanfly.RR.Game_CharacterBase_isMapPassable =
    Game_CharacterBase.prototype.isMapPassable;
Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    if (this.isEventRegionForbid(x, y, d)) return false;
    if (this.isPlayerRegionForbid(x, y, d)) return false;
    if (this.isEventRegionAllow(x, y, d)) return true;
    if (this.isPlayerRegionAllow(x, y, d)) return true;
    return Yanfly.RR.Game_CharacterBase_isMapPassable.call(this, x, y, d);
};
Game_CharacterBase.prototype.isEvent = function() {
    return false;
};
Game_CharacterBase.prototype.isPlayer = function() {
    return false;
};
Game_CharacterBase.prototype.isEventRegionForbid = function(x, y, d) {
    if (this.isPlayer()) return false;
    if (this.isThrough()) return false;
    var regionId = this.getRegionId(x, y, d);
    if (regionId === 0) return false;
    if (regionId === Yanfly.Param.RRAllRestrict) return true;
    return regionId === Yanfly.Param.RREventRestrict;
};
Game_CharacterBase.prototype.isPlayerRegionForbid = function(x, y, d) {
    if (this.isEvent()) return false;
    if (this.isThrough()) return false;
    var regionId = this.getRegionId(x, y, d);
    if (regionId === 0) return false;
    if (regionId === Yanfly.Param.RRAllRestrict) return true;
    return regionId === Yanfly.Param.RRPlayerRestrict;
};
Game_CharacterBase.prototype.isEventRegionAllow = function(x, y, d) {
    if (this.isPlayer()) return false;
    var regionId = this.getRegionId(x, y, d);
    if (regionId === 0) return false;
    if (regionId === Yanfly.Param.RRAllAllow) return true;
    return regionId === Yanfly.Param.RREventAllow;
};
Game_CharacterBase.prototype.isPlayerRegionAllow = function(x, y, d) {
    if (this.isEvent()) return false;
    var regionId = this.getRegionId(x, y, d);
    if (regionId === 0) return false;
    if (regionId === Yanfly.Param.RRAllAllow) return true;
    return regionId === Yanfly.Param.RRPlayerAllow;
};
Game_CharacterBase.prototype.getRegionId = function(x, y, d) {
    switch (d) {
    case 1:
      return $gameMap.regionId(x - 1, y + 1);
      break;
    case 2:
      return $gameMap.regionId(x + 0, y + 1);
      break;
    case 3:
      return $gameMap.regionId(x + 1, y + 1);
      break;
    case 4:
      return $gameMap.regionId(x - 1, y + 0);
      break;
    case 5:
      return $gameMap.regionId(x + 0, y + 0);
      break;
    case 6:
      return $gameMap.regionId(x + 1, y + 0);
      break;
    case 7:
      return $gameMap.regionId(x - 1, y - 1);
      break;
    case 8:
      return $gameMap.regionId(x + 0, y - 1);
      break;
    case 9:
      return $gameMap.regionId(x + 1, y - 1);
      break;
    }
    return 0;
};
Game_Event.prototype.isEvent = function() {
    return true;
};
Game_Player.prototype.isPlayer = function() {
    return true;
};
