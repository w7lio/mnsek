// (C)2015 Triacontane
// 1.3.1 2017/07/03 古いYEP_MessageCore.jsのネーム表示ウィンドウが再表示できない不具合の修正(by DarkPlasmaさま)
/*:
 * @plugindesc 
 * @author triacontane
 *
 * @param triggerButton
 * @desc Trigger buttons
 * (light_click or shift or control)
 * @default ["light_click"]
 * @type combo[]
 * @option light_click
 * @option shift
 * @option control
 * @option tab
 * @option pageup
 * @option pagedown
 * @option debug
 *
 * @param linkPictureNumbers
 * @desc Picture number of window show/hide
 * @default []
 * @type number[]
 *
 * @param linkShowPictureNumbers
 * @desc Picture number of window show/hide
 * @default []
 * @type number[]
 *
 * @param disableSwitchId
 * @desc 指定した番号のスイッチがONのとき、プラグインの機能が無効になります。
 * @default 0
 * @type switch
 *
 * @param disableInBattle
 * @desc trueのとき、戦闘中にプラグインの機能を無効にします。
 * @default false
 * @type boolean
 *
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param triggerButton
 * @text ボタン名称
 * @desc ウィンドウを消去するボタンです。(複数登録可能) プラグイン等で入力可能なボタンを追加した場合は直接入力
 * @default ["右クリック"]
 * @type combo[]
 * @option 右クリック
 * @option shift
 * @option control
 * @option tab
 * @option pageup
 * @option pagedown
 * @option debug
 *
 * @param linkPictureNumbers
 * @text 連動ピクチャ番号
 * @desc ウィンドウ消去時に連動して不透明度を[0]にするピクチャの番号です。
 * @default []
 * @type number[]
 *
 * @param linkShowPictureNumbers
 * @text 連動表示ピクチャ番号
 * @desc ウィンドウ消去時に連動して不透明度を[255]にするピクチャの番号です。
 * @default []
 * @type number[]
 *
 * @param disableSwitchId
 * @text 無効スイッチ番号
 * @desc 指定した番号のスイッチがONのとき、プラグインの機能が無効になります。
 * @default 0
 * @type switch
 *
 * @param disableInBattle
 * @text 戦闘中無効化
 * @desc trueのとき、戦闘中にプラグインの機能を無効にします。
 * @default false
 * @type boolean
 *
 * @help 
 */
(function() {
    'use strict';
    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
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
    var param = createPluginParameter('JsScript28Set');
    Game_Picture.prototype.linkWithMessageWindow = function(opacity) {
        this._opacity       = opacity;
        this._targetOpacity = opacity;
    };
    var _Window_Message_updateWait      = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        if (!this.isClosed() && this.isTriggeredHidden() && !$gameMessage.isChoice()) {
            if ($gameSwitches.value(SW_HTalk)) {   
                if (!this.isHidden()) {
                    this.hideAllWindow();
                } else {
                    this.showAllWindow();
                }
            }
        }
        if(TouchInput.isTriggered()){ 
            if (this.isHidden()) {
                this.showAllWindow();
                TouchInput._triggered = false;
            }
        }
        var wait = _Window_Message_updateWait.apply(this, arguments);
        if (this.isHidden() && this.visible) {
            this.hideAllWindow();
        }
        return wait;
    };
    Window_Message.prototype.hideAllWindow = function() {
        this.hide();
        this.subWindows().forEach(function(subWindow) {
            this.hideSubWindow(subWindow);
        }.bind(this));
        if (this.hasNameWindow() && !this.nameWindowIsSubWindow()) this.hideSubWindow(this._nameWindow);
        this._originalPictureOpacities = {};
        this.linkPictures(0, param.linkPictureNumbers);
        this.linkPictures(255, param.linkShowPictureNumbers);
        this._hideByMessageWindowHidden = true;
    };
    Window_Message.prototype.showAllWindow = function() {
        this.show();
        this.subWindows().forEach(function(subWindow) {
            this.showSubWindow(subWindow);
        }.bind(this));
        if (this.hasNameWindow() && !this.nameWindowIsSubWindow()) this.showSubWindow(this._nameWindow);
        this.linkPictures(null, param.linkShowPictureNumbers);
        this.linkPictures(null, param.linkPictureNumbers);
        this._hideByMessageWindowHidden = false;
    };
    Window_Message.prototype.isHidden = function() {
        return this._hideByMessageWindowHidden;
    };
    Window_Message.prototype.linkPictures = function(opacity, pictureNumbers) {
        if (!pictureNumbers) {
            return;
        }
        pictureNumbers.forEach(function(pictureId) {
            this.linkPicture(opacity, pictureId);
        }, this);
    };
    Window_Message.prototype.linkPicture = function(opacity, pictureId) {
        var picture = $gameScreen.picture(pictureId);
        if (!picture) {
            return;
        }
        if (opacity === null) {
            opacity = this._originalPictureOpacities[pictureId] || 255;
        } else {
            this._originalPictureOpacities[pictureId] = picture.opacity();
        }
        picture.linkWithMessageWindow(opacity);
    };
    Window_Message.prototype.hideSubWindow = function(subWindow) {
        subWindow.prevVisible = subWindow.visible;
        subWindow.hide();
    };
    Window_Message.prototype.showSubWindow = function(subWindow) {
        if (subWindow.prevVisible) subWindow.show();
        subWindow.prevVisible = undefined;
    };
    Window_Message.prototype.hasNameWindow = function() {
        return this._nameWindow && typeof Window_NameBox !== 'undefined';
    };
    Window_Message.prototype.nameWindowIsSubWindow = function() {
        return this.subWindows().filter(function(subWindow) {
            return subWindow === this._nameWindow;
        }, this).length > 0;
    };
    Window_Message.prototype.disableWindowHidden = function () {
        return (param.disableSwitchId > 0 && $gameSwitches.value(param.disableSwitchId)) ||
            (param.disableInBattle && $gameParty.inBattle());
    };
    Window_Message.prototype.isTriggeredHidden = function () {
        if ($gameTemp.isMessageBacklogOpened()) { 
            return false;
        }
        if (this.disableWindowHidden()) {
            return false;
        }
        return param.triggerButton.some(function(button) {
            switch (button) {
                case '':
                case '右クリック':
                case 'right_click':
                    return TouchInput.isCancelled();
                case 'ok':
                    return false;
                default:
                    return Input.isTriggered(button);
            }
        });
    };
    var _Window_Message_updateInput      = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        if (this.isHidden()) return true;
        return _Window_Message_updateInput.apply(this, arguments);
    };
    var _Window_ChoiceList_update      = Window_ChoiceList.prototype.update;
    Window_ChoiceList.prototype.update = function() {
        if (!this.visible) return;
        _Window_ChoiceList_update.apply(this, arguments);
    };
    var _Window_NumberInput_update      = Window_NumberInput.prototype.update;
    Window_NumberInput.prototype.update = function() {
        if (!this.visible) return;
        _Window_NumberInput_update.apply(this, arguments);
    };
    var _Window_EventItem_update      = Window_EventItem.prototype.update;
    Window_EventItem.prototype.update = function() {
        if (!this.visible) return;
        _Window_EventItem_update.apply(this, arguments);
    };
})();
