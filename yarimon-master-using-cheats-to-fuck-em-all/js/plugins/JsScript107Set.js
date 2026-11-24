// Copyright (c) 2016 tomoaky
/*:
 * @plugindesc 
 * 
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @help 
 */
var Imported = Imported || {};
Imported.TMTextEscape = true;
(function() {
  var _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = _Window_Base_convertEscapeCharacters.call(this, text);
    text = text.replace(/\x1b([A-Z]+)\[(\d+)\]/gi, function() {
      switch (arguments[1].toUpperCase()) {
      case 'J':
        return this._className(+arguments[2]);
      case 'AJ':
        return this.actorClassName(+arguments[2]);
      case 'PJ':
        return this.partyMemberClassName(+arguments[2]);
      case 'ANN':
        return this.actorNickname(+arguments[2]);
      case 'PNN':
        return this.partyMemberNickname(+arguments[2]);
      case 'IN':
        return this.itemName(+arguments[2]);
      case 'WN':
        return this.weaponName(+arguments[2]);
      case 'AN':
        return this.armorName(+arguments[2]);
      case 'SN':
        return this.skillName(+arguments[2]);
      case 'ML':
        return this.maxLevel(+arguments[2]);
      case 'INUM':
        return this.itemNumber(+arguments[2]);
      case 'WNUM':
        return this.weaponNumber(+arguments[2]);
      case 'ANUM':
        return this.armorNumber(+arguments[2]);
      case 'MAP':
        return this.mapName(+arguments[2]);
      case 'AF':
        return this.actorFace(+arguments[2]);
      default:
        return '\x1b' + arguments[1] + '[' + arguments[2] + ']';
      }
    }.bind(this));
    return text;
  };
  Window_Base.prototype._className = function(n) {
    var _class = n >= 1 ? $dataClasses[n] : null;
    return _class ? _class.name : '';
  };
  Window_Base.prototype.actorClassName = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.currentClass().name : '';
  };
  Window_Base.prototype.partyMemberClassName = function(n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.currentClass().name : '';
  };
  Window_Base.prototype.actorNickname = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.nickname() : '';
  };
  Window_Base.prototype.partyMemberNickname = function(n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.nickname() : '';
  };
  Window_Base.prototype.itemName = function(n) {
    var item = n >= 1 ? $dataItems[n] : null;
    return item ? '\x1bI[' + item.iconIndex + ']' + item.name : '';
  };
  Window_Base.prototype.weaponName = function(n) {
    var item = n >= 1 ? $dataWeapons[n] : null;
    return item ? '\x1bI[' + item.iconIndex + ']' + item.name : '';
  };
  Window_Base.prototype.armorName = function(n) {
    var item = n >= 1 ? $dataArmors[n] : null;
    return item ? '\x1bI[' + item.iconIndex + ']' + item.name : '';
  };
  Window_Base.prototype.skillName = function(n) {
    var item = n >= 1 ? $dataSkills[n] : null;
    return item ? '\x1bI[' + item.iconIndex + ']' + item.name : '';
  };
  Window_Base.prototype.maxLevel = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.maxLevel() : '';
  };
  Window_Base.prototype.itemNumber = function(n) {
    if (n === 0) return $gameParty.gold();
    var item = n >= 1 ? $dataItems[n] : null;
    return item ? $gameParty.numItems(item) : '';
  };
  Window_Base.prototype.weaponNumber = function(n) {
    var item = n >= 1 ? $dataWeapons[n] : null;
    return item ? $gameParty.numItems(item) : '';
  };
  Window_Base.prototype.armorNumber = function(n) {
    var item = n >= 1 ? $dataArmors[n] : null;
    return item ? $gameParty.numItems(item) : '';
  };
  Window_Base.prototype.mapName = function(n) {
    var mapInfo = n === 0 ? $dataMapInfos[$gameMap.mapId()] : $dataMapInfos[n];
    return mapInfo ? mapInfo.name : '';
  };
  Window_Base.prototype.actorFace = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    if (actor) {
      $gameMessage.setFaceImage(actor.faceName(), actor.faceIndex());
    }
    return '';
  };
  var _Scene_Battle_commandSkill = Scene_Battle.prototype.commandSkill;
  Scene_Battle.prototype.commandSkill = function() {
    _Scene_Battle_commandSkill.call(this);
    this._helpWindow.refresh();
  };
})();
