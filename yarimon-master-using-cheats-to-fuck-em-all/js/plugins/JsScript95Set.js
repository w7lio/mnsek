// (C) 2017 Triacontane
/*:
 * @plugindesc 
 * @author triacontane
 *
 * @help 
 * @noteParam PLM
 * @noteRequire 1
 * @noteDir img/parallaxes
 * @noteType file
 * @noteData events
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 
 * @author トリアコンタン
 *
 * @help 
 * @noteParam PLM
 * @noteRequire 1
 * @noteDir img/parallaxes
 * @noteType file
 * @noteData events
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function() {
    'use strict';
    var metaTagPrefix = 'PLM';
    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        if (!object || !object.meta) {
            return undefined;
        }
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };
    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };
    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };
    var isNotAString = function(args) {
        return String(args) !== args;
    };
    Game_Map.prototype.displayPixelX = function() {
        return this.displayX() * this.tileWidth();
    };
    Game_Map.prototype.displayPixelY = function() {
        return this.displayY() * this.tileHeight();
    };
    Game_CharacterBase.prototype.getMapLayerName = function() {
        return this._mapLayerName;
    };
    Game_CharacterBase.prototype.isMapLayer = function() {
        return !!this._mapLayerName;
    };
    var _Game_CharacterBase_isNearTheScreen = Game_CharacterBase.prototype.isNearTheScreen;
    Game_CharacterBase.prototype.isNearTheScreen = function() {
        return this.isMapLayer() || _Game_CharacterBase_isNearTheScreen.apply(this, arguments);
    };
    Game_CharacterBase.prototype.shiftPosition = function(x, y) {
        this._additionalX = x;
        this._additionalY = y;
    };
    Game_CharacterBase.prototype.existPage = function() {
        return false;
    };
    var _Game_Event_initialize      = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._mapLayerName = getMetaValue(this.getOriginalEvent(), '') || null;
        if (this._mapLayerName) {
            this.initBlendMode();
            this.initOpacity();
        }
    };
    Game_Event.prototype.initBlendMode = function() {
        var blendMode = getMetaValues(this.getOriginalEvent(), ['_Blend', '合成']);
        if (blendMode) {
            this._blendMode = parseInt(blendMode);
        }
    };
    Game_Event.prototype.initOpacity = function() {
        var blendMode = getMetaValues(this.getOriginalEvent(), ['_Opacity', '不透明度']);
        if (blendMode) {
            this._opacity = parseInt(blendMode);
        }
    };
    Game_Event.prototype.getOriginalEvent = function() {
        return $dataMap.events[this._eventId];
    };
    Game_Event.prototype.existPage = function() {
        return this._pageIndex >= 0;
    };
    Game_Event.prototype.getLayerX = function() {
        return (this._additionalX || 0) - Math.round($gameMap.displayPixelX());
    };
    Game_Event.prototype.getLayerY = function() {
        return (this._additionalY || 0) - Math.round($gameMap.displayPixelY());
    };
    var _Spriteset_Map_createCharacters      = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        _Spriteset_Map_createCharacters.apply(this, arguments);
        var layerSprites = this._characterSprites.filter(function(sprite) {
            return sprite.isLayer && sprite.isLayer();
        });
        layerSprites.forEach(function(oldSprite) {
            this.replaceLayerSprite(oldSprite);
        }, this);
    };
    Spriteset_Map.prototype.replaceLayerSprite = function(oldSprite) {
        var deleteIndex = this._characterSprites.indexOf(oldSprite);
        if (deleteIndex >= 0) {
            this._characterSprites.splice(deleteIndex, 1);
        }
        this._tilemap.removeChild(oldSprite);
        var newSprite = new Sprite_MapLayer(oldSprite.getCharacter());
        this._tilemap.addChild(newSprite);
    };
    var _Sprite_Character_character         = Sprite_Character.prototype.setCharacter;
    Sprite_Character.prototype.setCharacter = function(character) {
        _Sprite_Character_character.apply(this, arguments);
        this._layerName = character.getMapLayerName();
    };
    Sprite_Character.prototype.getCharacter = function() {
        return this._character;
    };
    Sprite_Character.prototype.isLayer = function() {
        return !!this._layerName;
    };
    function Sprite_MapLayer() {
        this.initialize.apply(this, arguments);
    }
    Sprite_MapLayer.prototype             = Object.create(Sprite_Character.prototype);
    Sprite_MapLayer.prototype.constructor = Sprite_MapLayer;
    Sprite_MapLayer.prototype.setCharacter = function(character) {
        Sprite_Character.prototype.setCharacter.apply(this, arguments);
        this.loadLayerBitmap();
    };
    Sprite_MapLayer.prototype.initMembers = function() {
        Sprite_Character.prototype.initMembers.apply(this, arguments);
        this.anchor.x = 0;
        this.anchor.y = 0;
    };
    Sprite_MapLayer.prototype.loadLayerBitmap = function() {
        this.bitmap = ImageManager.loadParallax(this._layerName, 0);
    };
    Sprite_MapLayer.prototype.updateVisibility = function() {
        Sprite_Character.prototype.updateVisibility.apply(this, arguments);
        if (!this._character.existPage()) {
            this.visible = false;
        }
    };
    Sprite_MapLayer.prototype.updatePosition = function() {
        this.x = this._character.getLayerX();
        this.y = this._character.getLayerY();
        this.z = this._character.screenZ();
        if (typeof Imported !== 'undefined' && Imported.MOG_ChronoEngine) {
            this.z += 1;
        }
    };
    Sprite_MapLayer.prototype.updateBitmap = function() {
        this._characterName = '';
    };
    Sprite_MapLayer.prototype.updateFrame = function() {
    };
})();
