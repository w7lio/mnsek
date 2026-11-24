// (C) 2017 Triacontane
/*:
 * @plugindesc 
 * @author triacontane
 *
 * @param UpperPictureId
 * @desc 指定した番号以上のピクチャはウィンドウより上に表示されるようになります。
 * @default 101
 * @type number
 *
 * @param LowerPictureId
 * @desc 指定した番号以下のピクチャはキャラクター、バトラーより下に表示されるようになります。
 * @default 0
 * @type number
 *
 * @param LowerPictureBattleZ
 * @desc 戦闘画面の下層ピクチャのZ座標です。変更することでより細かい表示優先度の調整ができます。
 * @default 0
 * @type select
 * @option 敵キャラ
 * @value 0
 * @option アニメーション
 * @value 1
 *
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param 上層ピクチャ番号
 * @desc 指定した番号以上のピクチャはウィンドウより上に表示されるようになります。
 * @default 101
 * @type number
 *
 * @param 下層ピクチャ番号
 * @desc 指定した番号以下のピクチャはキャラクター、バトラーより下に表示されるようになります。
 * @default 0
 * @type number
 *
 * @param 戦闘下層ピクチャZ座標
 * @desc 戦闘画面の下層ピクチャのZ座標です。変更することでより細かい表示優先度の調整ができます。
 * @default 0
 * @type select
 * @option 敵キャラ
 * @value 0
 * @option アニメーション
 * @value 1
 *
 * @help 
 */
(function() {
    'use strict';
    const pluginName = 'JsScript98Set';
    const getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };
    const getParamNumber = function(paramNames, min, max) {
        const value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };
    const param               = {};
    param.upperPictureId      = getParamNumber(['UpperPictureId', '上層ピクチャ番号']);
    param.lowerPictureId      = getParamNumber(['LowerPictureId', '下層ピクチャ番号']);
    //param.lowerPictureZ       = getParamNumber(['LowerPictureZ', '下層ピクチャZ座標']);
    param.lowerPictureZ       = 9; 
    param.lowerPictureBattleZ = getParamNumber(['LowerPictureBattleZ', '戦闘下層ピクチャZ座標'], 0);
    var _Scene_Base_createWindowLayer = Scene_Base.prototype.createWindowLayer;
    Scene_Base.prototype.createWindowLayer = function() {
        //_Scene_Base_createWindowLayer.apply(this, arguments); //Nupu改造：Live2Dの上に来れば良いので、修正
        if (this._spriteset) {
            this._spriteset.setUpperPictureContainer(this);
        }
        _Scene_Base_createWindowLayer.apply(this, arguments);
    };
    var _Spriteset_Base_createPictures      = Spriteset_Base.prototype.createPictures;
    Spriteset_Base.prototype.createPictures = function() {
        _Spriteset_Base_createPictures.apply(this, arguments);
        this.removeChild(this._pictureContainer);
        this.createPictureLayer();
    };
    Spriteset_Base.prototype.createPictureLayer = function() {
        var width                   = Graphics.boxWidth;
        var height                  = Graphics.boxHeight;
        var x                       = (Graphics.width - width) / 2;
        var y                       = (Graphics.height - height) / 2;
        this._pictureContainerLower = new Sprite();
        this._pictureContainerLower.setFrame(x, y, width, height);
        this._pictureContainerMiddle = new Sprite();
        this._pictureContainerMiddle.setFrame(x, y, width, height);
        this._pictureContainerUpper = new Sprite();
        this._pictureContainerUpper.setFrame(x, y, width, height);
        var pictureArray = this._pictureContainer.children.clone();
        pictureArray.forEach(function(picture) {
            var pictureId = picture.getPictureId();
            if (pictureId <= param.lowerPictureId) {
                this._pictureContainerLower.addChild(picture);
            } else if (pictureId >= param.upperPictureId) {
                this._pictureContainerUpper.addChild(picture);
            } else {
                this._pictureContainerMiddle.addChild(picture);
            }
        }, this);
        this._pictureContainer.children = pictureArray;
        this.setLowerPictureContainer();
        this.setMiddlePictureContainer();
    };
    Spriteset_Base.prototype.setUpperPictureContainer = function(parentScene) {
        parentScene.addChild(this._pictureContainerUpper);
    };
    Spriteset_Base.prototype.setMiddlePictureContainer = function() {
        this.addChild(this._pictureContainerMiddle);
    };
    Spriteset_Base.prototype.setLowerPictureContainer = function() {
        this.addChildAt(this._pictureContainerLower , this.children.length - 1);
    };
    //Spriteset_Map.prototype.setLowerPictureContainer = function() {
        //this._tilemap.addChild(this._pictureContainerLower);
    Spriteset_Battle.prototype.setLowerPictureContainer = function() {
        this.updateLowerPictureContainerZ();
        if (typeof Imported !== 'undefined' && Imported.Galv_LayerGraphics) {
            this._pictureContainerLower.z = 2;
        }
    };
    Spriteset_Battle.prototype.updateLowerPictureContainerZ = function() {
        var compare = param.lowerPictureBattleZ > 0 ? this._enemySprites[this._enemySprites.length - 1] :
            this._back2Sprite;
        var index = this._battleField.getChildIndex(compare);
        this._battleField.addChildAt(this._pictureContainerLower, index + 1);
    };
    if (typeof Yanfly !== 'undefined' && Yanfly.BEC) {
        var _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
        Spriteset_Battle.prototype.update = function() {
            _Spriteset_Battle_update.apply(this, arguments);
            this.updateLowerPictureContainerZ();
        };
    }
    Sprite_Picture.prototype.getPictureId = function() {
        return this._pictureId;
    };
})();
