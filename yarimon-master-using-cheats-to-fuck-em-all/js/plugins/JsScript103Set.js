// (C)2017 Triacontane
/*:
 * @plugindesc 
 * @author triacontane
 *
 * @param clearTransfer
 * @desc The self-switch is automatically released when the location is moved.
 * @default true
 * @type boolean
 *
 * @param defaultTemporary
 * @desc  A self-switch that is treated as a temporary self-switch even if it is not specified in the memo field.
 * @default []
 * @type select[]
 * @option A
 * @option B
 * @option C
 * @option D
 *
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param clearTransfer
 * @text 場所移動時に自動解除
 * @desc 場所移動したときにセルフスイッチを自動で解除します。
 * @default true
 * @type boolean
 *
 * @param defaultTemporary
 * @text デフォルト一時スイッチ
 * @desc メモ欄に指定がなくても一時セルフスイッチとして扱うセルフスイッチです。全イベントに適用されるので注意してください。
 * @default []
 * @type select[]
 * @option A
 * @option B
 * @option C
 * @option D
 *
 * @help 
 */
(function() {
    'use strict';
    var metaTagPrefix = 'SST_';
    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };
    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };
    var getArgArrayString = function(args) {
        var values = args.split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    };
    var convertEscapeCharacters = function(text) {
        if (String(text) !== text) return text;
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
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
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    var param = createPluginParameter('JsScript103Set');
    /**
     * Game_Interpreter
     * プラグインコマンドを追加定義します。
     */
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (command === 'CLEAR_TEMPORARY_SELF_SWITCH' || command === '一時セルフスイッチ解除') {
            $gameSelfSwitches.clearTemporary();
        }
    };
    /**
     * Game_SelfSwitches
     */
    Game_SelfSwitches.prototype.appendTemporary = function(mapId, eventId, type) {
        if (!this._temporaryList) {
            this._temporaryList = {};
        }
        this._temporaryList[[mapId, eventId, type]] = true;
    };
    Game_SelfSwitches.prototype.clearTemporary = function() {
        if (!this._temporaryList) {
            return;
        }
        Object.keys(this._temporaryList).forEach(function(key) {
            this.setValue(key, false);
        }, this);
    };
    /**
     * Game_Map
     */
    var _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        if (param.clearTransfer) {
            $gameSelfSwitches.clearTemporary();
        }
        _Game_Map_setupEvents.apply(this, arguments);
        this.events().forEach(function(event) {
            event.addTemporarySelfSwitch();
        });
    };
    /**
     * Game_Event
     */
    Game_Event.prototype.addTemporarySelfSwitch = function() {
        var switchList = this.findTemporarySelfSwitch();
        if (!switchList) {
            return;
        }
        switchList.forEach(function(type) {
            $gameSelfSwitches.appendTemporary($gameMap.mapId(), this.eventId(), type.toUpperCase());
        }, this);
    };
    Game_Event.prototype.findTemporarySelfSwitch = function() {
        var metaValue = getMetaValues(this.event(), ['Switch', 'スイッチ']);
        if (!metaValue) {
            return null;
        }
        var list = metaValue === true ? ['A', 'B', 'C', 'D'] : getArgArrayString(metaValue);
        return param.defaultTemporary ? list.concat(param.defaultTemporary) : list;
    };
})();
