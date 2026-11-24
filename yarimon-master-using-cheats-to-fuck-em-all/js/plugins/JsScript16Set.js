// Copyright (c) 2015-2017 Triacontane
/*:
 * @plugindesc 
 * @author triacontane
 *
 * @param FreezeSwitchId
 * @desc キャラクターを全停止されるトリガーになるスイッチIDです。
 * @default
 * @type switch
 *
 * @param FreezePictureId
 * @desc 停止中にピクチャを表示する場合のピクチャ番号です。
 * @default 0
 * @type number
 *
 * @param FreezePictureName
 * @desc 停止中に表示するピクチャファイル名です。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param FreezeBgmVolume
 * @desc 停止中のBGM音量です。もとのBGMの音量も考慮されます。
 * @default 100
 * @type number
 *
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param 停止スイッチID
 * @desc キャラクターを全停止されるトリガーになるスイッチIDです。
 * @default
 * @type switch
 *
 * @param 停止中ピクチャID
 * @desc 停止中にピクチャを表示する場合のピクチャ番号です。
 * @default 0
 * @type number
 *
 * @param 停止中ピクチャ名
 * @desc 停止中に表示するピクチャファイル名です。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 停止中BGM音量
 * @desc 停止中のBGM音量の倍率です。もとの音量に対して乗算されます。
 * @default 100
 * @type number
 *
 * @help 
 */
(function() {
    'use strict';
    var pluginName = 'JsScript16Set';
    var userSetting = {
        pictureInfo: {
            opacity  : 255,
            blendMode: 0
        }
    };
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };
    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };
    var param               = {};
    param.freezeSwitchId    = getParamNumber(['FreezeSwitchId', '停止スイッチID']);
    param.freezePictureId   = getParamNumber(['FreezePictureId', '停止中ピクチャID']);
    param.freezePictureName = getParamString(['FreezePictureName', '停止中ピクチャ名']);
    param.freezeBgmVolume    = getParamNumber(['FreezeBgmVolume', '停止中BGM音量']);
    var _Game_Map_update      = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.apply(this, arguments);
        this.updateFreeze();
    };
    Game_Map.prototype.updateFreeze = function() {
        if (this.isFreeze() && !this._lastFreeze) {
            this.startFreeze();
        }
        if (!this.isFreeze() && this._lastFreeze) {
            this.finishFreeze();
        }
        this._lastFreeze = this.isFreeze();
    };
    Game_Map.prototype.startFreeze = function() {
        if (param.freezePictureId) {
            var info = userSetting.pictureInfo;
            $gameScreen.showPicture(param.freezePictureId, param.freezePictureName,
                0, 0, 0, 100, 100, info.opacity, info.blendMode);
        }
        if (param.freezeBgmVolume) {
            var oldBgm = AudioManager.saveBgm();
            var freezeVolume = oldBgm.volume * param.freezeBgmVolume / 100;
            var freezeBgm = {name:oldBgm.name, volume:freezeVolume, pitch:oldBgm.pitch, pan:oldBgm.pan};
            AudioManager.playBgm(freezeBgm);
            this._preFreezeVolume = oldBgm.volume;
        }
    };
    Game_Map.prototype.finishFreeze = function() {
        if (param.freezePictureId) {
            $gameScreen.erasePicture(param.freezePictureId);
        }
        if (param.freezeBgmVolume) {
            var bgm = AudioManager.saveBgm();
            bgm.volume = this._preFreezeVolume;
            AudioManager.playBgm(bgm);
            this._preFreezeVolume = null;
        }
    };
    Game_Map.prototype.isFreeze = function() {
        if (CharaFlzFlame > 0) return true;
        return $gameSwitches.value(param.freezeSwitchId);
    };
    Game_CharacterBase.prototype.isFreeze = function() {
        return $gameMap.isFreeze();
    };
    var _Game_CharacterBase_update      = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        if (this.isFreeze()) return;
        _Game_CharacterBase_update.apply(this, arguments);
    };
    var _Game_Player_canMove      = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        return !this.isFreeze() && _Game_Player_canMove.apply(this, arguments);
    };
})();
