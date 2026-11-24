// (C) 2016 Triacontane
// 1.10.2 2018/11/19 UltraMode7との競合を解消(by けんせい様)
/*:
 * @plugindesc 
 * @author トリアコンタン
 *
 * @param イベント消去無効
 * @desc エンカウント発生時にイベントを一瞬消去するエフェクトを無効にします。
 * @default false
 * @type boolean
 *
 * @help 
 */
(function() {
    'use strict';
    var pluginName = 'JsScript17Set';
    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };
    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };
    var getArgString = function(args, upperFlg) {
        args = convertEscapeCharacters(args);
        return upperFlg ? args.toUpperCase() : args;
    };
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };
    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameActors.actor(parseInt(arguments[1], 10)) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameParty.members()[parseInt(arguments[1], 10) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };
    var paramEventHideInvalid = getParamBoolean(['EventHideInvalid', 'イベント消去無効']);
    var _DataManager_extractMetadata = DataManager.extractMetadata;
    DataManager.extractMetadata      = function(data) {
        _DataManager_extractMetadata.apply(this, arguments);
        this.extractMetadataArray(data);
    };
    DataManager.extractMetadataArray = function(data) {
        var re         = /<([^<>:]+)(:?)([^>]*)>/g;
        data.metaArray = {};
        var match      = true;
        while (match) {
            match = re.exec(data.note);
            if (match) {
                var metaName             = match[1];
                data.metaArray[metaName] = data.metaArray[metaName] || [];
                data.metaArray[metaName].push(match[2] === ':' ? match[3] : true);
            }
        }
    };
    var _Game_System_onAfterLoad      = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        if (!$gamePlayer.hasOwnProperty('_customResource')) {
            $gamePlayer.clearCgInfo();
        }
    };
    var _Game_CharacterBase_initMembers      = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this.clearCgInfo();
    };
    Game_CharacterBase.prototype.clearCgInfo = function() {
        this._customResource  = null;
        this._graphicColumns  = 1;
        this._graphicRows     = 1;
        this._additionalX     = 0;
        this._additionalY     = 0;
        this._customPriority  = -1;
        this._scaleX          = 100;
        this._scaleY          = 100;
        this._tileBlockWidth  = 1;
        this._tileBlockHeight = 1;
        this._angle           = 0;
        this._originX         = null;
        this._originY         = null;
        this._absoluteX       = null;
        this._absoluteY       = null;
        this._customTilesetId = 0;
        this.setBlendMode(0);
    };
    Game_CharacterBase.prototype.customResource = function() {
        return this._customResource;
    };
    Game_CharacterBase.prototype.customTilesetId = function() {
        return this._customTilesetId;
    };
    Game_CharacterBase.prototype.graphicColumns = function() {
        return this._graphicColumns;
    };
    Game_CharacterBase.prototype.graphicRows = function() {
        return this._graphicRows;
    };
    Game_CharacterBase.prototype.scaleX = function() {
        return this._scaleX;
    };
    Game_CharacterBase.prototype.scaleY = function() {
        return this._scaleY;
    };
    Game_CharacterBase.prototype.setScale = function(x, y) {
        this._scaleX = x;
        this._scaleY = y;
    };
    Game_CharacterBase.prototype.originX = function() {
        return this._originX;
    };
    Game_CharacterBase.prototype.originY = function() {
        return this._originY;
    };
    Game_CharacterBase.prototype.setOrigin = function(x, y) {
        this._originX = x / 100;
        this._originY = y / 100;
    };
    Game_CharacterBase.prototype.absoluteX = function() {
        return this._absoluteX;
    };
    Game_CharacterBase.prototype.absoluteY = function() {
        return this._absoluteY;
    };
    Game_CharacterBase.prototype.setAbsolute = function(x, y) {
        this._absoluteX = x;
        this._absoluteY = y;
    };
    Game_CharacterBase.prototype.tone = function() {
        return this._tone;
    };
    Game_CharacterBase.prototype.setTone = function(r, g, b) {
        this._tone = [r, g, b];
    };
    Game_CharacterBase.prototype.angle = function() {
        return this._angle;
    };
    Game_CharacterBase.prototype.setAngle = function(angle) {
        this._angle = angle;
    };
    Game_CharacterBase.prototype.shiftPosition = function(x, y) {
        this._additionalX = x;
        this._additionalY = y;
    };
    Game_CharacterBase.prototype.tileBlockWidth = function() {
        return this._tileBlockWidth;
    };
    Game_CharacterBase.prototype.tileBlockHeight = function() {
        return this._tileBlockHeight;
    };
    Game_CharacterBase.prototype.getTrimRect = function() {
        return this._trimRect || null;
    };
    var _Game_CharacterBase_pos      = Game_CharacterBase.prototype.pos;
    Game_CharacterBase.prototype.pos = function(x, y) {
        if (this.tileBlockWidth() >= 2) {
            return (this._x - this.tileBlockWidth() / 2 <= x && this._x + this.tileBlockWidth() / 2 >= x) && this._y === y;
        } else {
            return _Game_CharacterBase_pos.apply(this, arguments);
        }
    };
    var _Game_CharacterBase_screenX      = Game_CharacterBase.prototype.screenX;
    Game_CharacterBase.prototype.screenX = function() {
        return this._absoluteX > 0 ? this.absoluteX() : _Game_CharacterBase_screenX.apply(this, arguments) + this._additionalX;
    };
    var _Game_CharacterBase_screenY      = Game_CharacterBase.prototype.screenY;
    Game_CharacterBase.prototype.screenY = function() {
        return this._absoluteY > 0 ? this.absoluteY() : _Game_CharacterBase_screenY.apply(this, arguments) + this._additionalY;
    };
    var _Game_CharacterBase_screenZ      = Game_CharacterBase.prototype.screenZ;
    Game_CharacterBase.prototype.screenZ = function() {
        return this._customPriority >= 0 ? this._customPriority : _Game_CharacterBase_screenZ.apply(this, arguments);
    };
    Game_CharacterBase.prototype.changeImage = function(fileName, fileIndex) {
        if (arguments.length < 2) {
            fileIndex = this._characterIndex;
        }
        Game_CharacterBase.prototype.setImage.call(this, fileName, fileIndex);
    };
    Game_Event.blendModeParams = {
        '1': 1, '加算': 1,
        '2': 2, '乗算': 2,
        '3': 3, 'スクリーン': 3
    };
    Game_Event.prototype.getMetaCg = function(names) {
        if (!Array.isArray(names)) names = [names];
        var metaParams = this.getMetaParameter(names);
        if (!metaParams) return null;
        var result = null;
        metaParams.some(function(metaParam) {
            var params = getArgArrayString(metaParam);
            if (this.isValidCgeParam(params)) {
                result = params;
                if (metaParam.match(/\\v/gi)) {
                    this._graphicDynamic = true;
                }
            }
            return result;
        }.bind(this));
        return result;
    };
    Game_Event.prototype.getMetaParameter = function(names) {
        var metaParams = null;
        names.some(function(name) {
            if (!metaParams || metaParams[0] === '') {
                metaParams = this.event().metaArray['CG' + name];
            }
            return metaParams;
        }.bind(this));
        return metaParams;
    };
    Game_Event.prototype.isValidCgeParam = function(params) {
        var pageIndex = getArgNumber(params[0]);
        return params.length > 1 && (pageIndex === this._pageIndex + 1 || params[0].toUpperCase() === 'A');
    };
    var _Game_Event_refresh      = Game_Event.prototype.refresh;
    Game_Event.prototype.refresh = function() {
        var moveRoute        = this._moveRoute;
        var moveRouteIndex   = this._moveRouteIndex;
        var moveRouteForcing = this._moveRouteForcing;
        var starting         = this._starting;
        if (this._graphicDynamic) {
            this._pageIndex = -1;
        }
        _Game_Event_refresh.apply(this, arguments);
        if (this._graphicDynamic) {
            this._moveRoute        = moveRoute;
            this._moveRouteIndex   = moveRouteIndex;
            this._moveRouteForcing = moveRouteForcing;
            this._starting         = starting;
        }
    };
    var _Game_Event_setupPageSettings      = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        this.clearCgInfo();
        _Game_Event_setupPageSettings.apply(this, arguments);
        var cgParams = this.getMetaCg(['シフト', 'Shift']);
        if (cgParams) {
            this.shiftPosition(getArgNumber(cgParams[1]), getArgNumber(cgParams[2]));
        }
        cgParams = this.getMetaCg(['プライオリティ', 'Priority']);
        if (cgParams) {
            this._customPriority = getArgNumber(cgParams[1], 0, 10);
        }
        cgParams = this.getMetaCg(['合成方法', 'BlendType']);
        if (cgParams) {
            var blendMode = Game_Event.blendModeParams[cgParams[1]] || 0;
            this.setBlendMode(blendMode);
        }
        cgParams = this.getMetaCg(['拡大率', 'Scale']);
        if (cgParams) {
            this._scaleX = getArgNumber(cgParams[1]);
            this._scaleY = getArgNumber(cgParams[2]);
        }
        cgParams = this.getMetaCg(['回転角', 'Angle']);
        if (cgParams) {
            this.setAngle(getArgNumber(cgParams[1], 0, 360));
        }
        cgParams = this.getMetaCg(['原点', 'Origin']);
        if (cgParams) {
            this.setOrigin(getArgNumber(cgParams[1]), getArgNumber(cgParams[2]));
        }
        cgParams = this.getMetaCg(['絶対座標', 'Absolute']);
        if (cgParams) {
            this.setAbsolute(getArgNumber(cgParams[1]), getArgNumber(cgParams[2]));
        }
        cgParams = this.getMetaCg(['色調', 'Tone']);
        if (cgParams) {
            this.setTone(getArgNumber(cgParams[1]), getArgNumber(cgParams[2]), getArgNumber(cgParams[3]));
        }
        cgParams = this.getMetaCg(['不透明度', 'Opacity']);
        if (cgParams) {
            this.setOpacity(getArgNumber(cgParams[1]));
        }
        cgParams = this.getMetaCg(['トリミング', 'Trimming']);
        if (cgParams) {
            this._trimRect = new Rectangle(getArgNumber(cgParams[1]), getArgNumber(cgParams[2]), getArgNumber(cgParams[3]), getArgNumber(cgParams[4]));
        }
    };
    var _Game_Event_setTileImage      = Game_Event.prototype.setTileImage;
    Game_Event.prototype.setTileImage = function(tileId) {
        _Game_Event_setTileImage.apply(this, arguments);
        var cgParams = this.getMetaCg(['タイル', 'Tile']);
        if (cgParams) {
            this._tileBlockWidth  = getArgNumber(cgParams[1]);
            this._tileBlockHeight = getArgNumber(cgParams[2]);
        }
        cgParams = this.getMetaCg(['タイルセット', 'Tileset']);
        if (cgParams) {
            this._customTilesetId = getArgNumber(cgParams[1]);
        }
    };
    var _Game_Event_setImage      = Game_Event.prototype.setImage;
    Game_Event.prototype.setImage = function(characterName, characterIndex) {
        var cgParams = this.getMetaCg(['ピクチャ', 'Picture']);
        if (cgParams) {
            this._customResource = 'Picture';
            this._graphicColumns = 1;
            this._graphicRows    = 1;
            arguments[0]         = cgParams[1];
            arguments[1]         = 0;
        }
        cgParams = this.getMetaCg(['敵キャラ', 'Enemy']);
        if (cgParams) {
            this._customResource = $gameSystem.isSideView() ? 'SvEnemy' : 'Enemy';
            this._graphicColumns = 1;
            this._graphicRows    = 1;
            arguments[0]         = cgParams[1];
            arguments[1]         = 0;
        }
        cgParams = this.getMetaCg(['アイコン', 'Icon']);
        if (cgParams) {
            this._customResource = 'System';
            this._graphicColumns = 16;
            this._graphicRows    = 20;
            arguments[0]         = 'IconSet';
            arguments[1]         = getArgNumber(cgParams[1], 0, this._graphicColumns * this._graphicRows - 1);
        }
        cgParams = this.getMetaCg(['フェイス', 'Face']);
        if (cgParams) {
            this._customResource = 'Face';
            this._graphicColumns = 4;
            this._graphicRows    = 2;
            arguments[0]         = cgParams[1];
            arguments[1]         = getArgNumber(cgParams[2], 0, this._graphicColumns * this._graphicRows - 1);
        }
        cgParams = this.getMetaCg(['遠景', 'Parallax']);
        if (cgParams) {
            this._customResource = 'Parallax';
            this._graphicColumns = 1;
            this._graphicRows    = 1;
            arguments[0]         = cgParams[1];
            arguments[1]         = 0;
        }
        cgParams = this.getMetaCg(['アクター', 'Actor']);
        if (cgParams) {
            this._customResource = 'SvActor';
            this._graphicColumns = 9;
            this._graphicRows    = 6;
            arguments[0]         = cgParams[1];
            arguments[1]         = getArgNumber(cgParams[2], 0, this._graphicColumns * this._graphicRows - 1);
        }
        _Game_Event_setImage.apply(this, arguments);
    };
    var _Spriteset_Map_hideCharacters      = Spriteset_Map.prototype.hideCharacters;
    Spriteset_Map.prototype.hideCharacters = function() {
        if (!paramEventHideInvalid) _Spriteset_Map_hideCharacters.apply(this, arguments);
    };
    var _Sprite_Character_tilesetBitmap      = Sprite_Character.prototype.tilesetBitmap;
    Sprite_Character.prototype.tilesetBitmap = function(tileId) {
        var customTilesetId   = this._character.customTilesetId();
        this._customTilesetId = customTilesetId;
        if (customTilesetId) {
            var tileset   = $dataTilesets[customTilesetId];
            var setNumber = 5 + Math.floor(tileId / 256);
            return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
        } else {
            return _Sprite_Character_tilesetBitmap.apply(this, arguments);
        }
    };
    var _Sprite_Character_updateBitmap      = Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap = function() {
        if (this.isImageChanged()) this._customResource = this._character.customResource();
        _Sprite_Character_updateBitmap.apply(this, arguments);
        this.updateExtend();
    };
    var _Sprite_Character_update      = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.apply(this, arguments);
        if (this.updateDashMotion) {
            this.resolveConflictForDashMotion();
        }
        if ($gameMap.useUltraMode7) {
            this.resolveConflictForUltraMode7();
        }
    };
    Sprite_Character.prototype.resolveConflictForUltraMode7 = function() {
        if (this._character.scaleY() !== 100) {
            this.scale.x = this._character.scaleX() / 100 * this.scale.x;
            this.scale.y = this._character.scaleY() / 100 * this.scale.y;
        }
        if (this._character.angle() !== 0) {
            var angle = this._character.angle() * Math.PI / 180;
            if (this.rotation !== angle) this.rotation = angle;
        }
    };
    Sprite_Character.prototype.resolveConflictForDashMotion = function() {
        if (this._character.scaleY() !== 100) {
            this.scale.y = this._character.scaleY() / 100 * this.scale.y;
        }
        if (this._character.angle() !== 0) {
            var angle = this._character.angle() * Math.PI / 180;
            if (this.rotation !== angle) this.rotation = angle;
        }
    };
    Sprite_Character.prototype.updateExtend = function() {
        var scaleX = this._character.scaleX() / 100;
        var scaleY = this._character.scaleY() / 100;
        this.scale.x = scaleX;
        this.scale.y = scaleY;
        if (this._namePop && this._namePopSprite) {
            this._namePopSprite.scale.x = scaleX;
            this._namePopSprite.scale.y = scaleY;
        }
        var originX  = this._character.originX();
        if (originX != null) this.anchor.x = originX;
        var originY = this._character.originY();
        if (originY != null) this.anchor.y = originY;
        var angle = this._character.angle() * Math.PI / 180;
        if (this.rotation !== angle) this.rotation = angle;
        var tone = this._character.tone();
        if (tone) this.setColorTone(tone);
    };
    var _Sprite_Character_updateAngle      = Sprite_Character.prototype.updateAngle;
    Sprite_Character.prototype.updateAngle = function() {
        if (this._character.originY() != null) {
            return;
        }
        _Sprite_Character_updateAngle.apply(this, arguments);
    };
    var _Sprite_Character_setFrame      = Sprite_Character.prototype.setFrame;
    Sprite_Character.prototype.setFrame = function(sx, sy, pw, ph) {
        var rect = this._character.getTrimRect();
        if (rect) {
            _Sprite_Character_setFrame.call(this, sx + rect.x, sy + rect.y, rect.width, rect.height);
        } else {
            _Sprite_Character_setFrame.call(this, sx, sy,
                pw * this._character.tileBlockWidth(), ph * this._character.tileBlockHeight());
        }
    };
    var _Sprite_Character_isImageChanged      = Sprite_Character.prototype.isImageChanged;
    Sprite_Character.prototype.isImageChanged = function() {
        return _Sprite_Character_isImageChanged.apply(this, arguments) || this.isCustomImageChanged();
    };
    Sprite_Character.prototype.isCustomImageChanged = function() {
        return this._customResource !== this._character.customResource() ||
            this._customTilesetId !== this._character.customTilesetId();
    };
    var _Sprite_Character_setCharacterBitmap      = Sprite_Character.prototype.setCharacterBitmap;
    Sprite_Character.prototype.setCharacterBitmap = function() {
        if (this._customResource) {
            this.bitmap = ImageManager['load' + this._customResource](this._characterName);
        } else {
            _Sprite_Character_setCharacterBitmap.apply(this, arguments);
        }
    };
    var _Sprite_Character_characterBlockX      = Sprite_Character.prototype.characterBlockX;
    Sprite_Character.prototype.characterBlockX = function() {
        if (this._customResource) {
            return this._characterIndex % this._character.graphicColumns();
        } else {
            return _Sprite_Character_characterBlockX.apply(this, arguments);
        }
    };
    var _Sprite_Character_characterBlockY      = Sprite_Character.prototype.characterBlockY;
    Sprite_Character.prototype.characterBlockY = function() {
        if (this._customResource) {
            return Math.floor(this._characterIndex / this._character.graphicColumns());
        } else {
            return _Sprite_Character_characterBlockY.apply(this, arguments);
        }
    };
    var _Sprite_Character_patternWidth      = Sprite_Character.prototype.patternWidth;
    Sprite_Character.prototype.patternWidth = function() {
        if (this._customResource) {
            return this.bitmap.width / this._character.graphicColumns();
        } else {
            return _Sprite_Character_patternWidth.apply(this, arguments);
        }
    };
    var _Sprite_Character_patternHeight      = Sprite_Character.prototype.patternHeight;
    Sprite_Character.prototype.patternHeight = function() {
        if (this._customResource) {
            return this.bitmap.height / this._character.graphicRows();
        } else {
            return _Sprite_Character_patternHeight.apply(this, arguments);
        }
    };
    var _Sprite_Character_characterPatternX      = Sprite_Character.prototype.characterPatternX;
    Sprite_Character.prototype.characterPatternX = function() {
        if (this._customResource) {
            return 0;
        } else {
            return _Sprite_Character_characterPatternX.apply(this, arguments);
        }
    };
    var _Sprite_Character_characterPatternY      = Sprite_Character.prototype.characterPatternY;
    Sprite_Character.prototype.characterPatternY = function() {
        if (this._customResource) {
            return 0;
        } else {
            return _Sprite_Character_characterPatternY.apply(this, arguments);
        }
    };
})();
