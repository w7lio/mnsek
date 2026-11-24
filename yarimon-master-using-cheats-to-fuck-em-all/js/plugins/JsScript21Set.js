// Copyright (c) 2015-2017 Triacontane
/*:ja
 * @plugindesc 
 * @author トリアコンタン
 *
 * @help 
 */
(function() {
    'use strict';
    var _Sprite__renderCanvas = Sprite.prototype._renderCanvas;
    Sprite.prototype._renderCanvas = function(renderer) {
        _Sprite__renderCanvas.apply(this, arguments);
        if (this.isExistLoadingBitmap()) {
            this._renderCanvas_PIXI(renderer);
        }
    };
    var _Sprite__renderWebGL      = Sprite.prototype._renderWebGL;
    Sprite.prototype._renderWebGL = function(renderer) {
        _Sprite__renderWebGL.apply(this, arguments);
        if (this.isExistLoadingBitmap()) {
            if (this._isPicture) {
                this._speedUpCustomBlendModes(renderer);
                renderer.setObjectRenderer(renderer.plugins.picture);
                if (!this.isVideoPicture || !this.isVideoPicture()) {
                    renderer.plugins.picture.render(this);
                }
            } else {
                renderer.setObjectRenderer(renderer.plugins.sprite);
                renderer.plugins.sprite.render(this);
            }
        }
    };
    Sprite.prototype.isExistLoadingBitmap = function() {
        return this.bitmap && !this.bitmap.isReady();
    };
})();
