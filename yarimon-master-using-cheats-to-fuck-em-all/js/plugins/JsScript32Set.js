/*:
 * @plugindesc 
 * @author 奏ねこま（おとぶき ねこま）
 *
 * @param 表示切替用スイッチ番号
 * @desc アニメーションをピクチャより前に表示するかどうかを切り替えるスイッチの番号を指定してください。
 * @default 0
 *
 * @help 
 */
var Imported = Imported || {};
Imported.MPI_AnimationOverPictures = true;
var Makonet = Makonet || {};
Makonet.AOP = {};
(function(){
    'use strict';
    var AOP          = Makonet.AOP;
    AOP.product      = 'JsScript32Set';
    AOP.parameters   = PluginManager.parameters(AOP.product);
    AOP.switchId     = +AOP.parameters['表示切替用スイッチ番号'] || 0;
    function _(object) {
        return object[AOP.product] = object[AOP.product] || {}
    }
    var _Spriteset_Base_createPictures = Spriteset_Base.prototype.createPictures;
    Spriteset_Base.prototype.createPictures = function() {
        _Spriteset_Base_createPictures.call(this);
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        var x = (Graphics.width - width) / 2;
        var y = (Graphics.height - height) / 2;
        _(this)._animationContainer = new Sprite();
        _(this)._animationContainer.setFrame(x, y, width, height);
        this.addChild(_(this)._animationContainer);
    };
    var _Sprite_Base_startAnimation = Sprite_Base.prototype.startAnimation;
    Sprite_Base.prototype.startAnimation = function(animation, mirror, delay) {
        _Sprite_Base_startAnimation.call(this, animation, mirror, delay);
        if (!AOP.switchId || $gameSwitches.value(AOP.switchId)) {
            var sprite = this._animationSprites[this._animationSprites.length - 1];
            _(sprite).orgParent = this.parent;
            this.parent.removeChild(sprite);
            _(SceneManager._scene._spriteset)._animationContainer.addChild(sprite);
        }
    };
    var _Sprite_Animation_updatePosition = Sprite_Animation.prototype.updatePosition;
    Sprite_Animation.prototype.updatePosition = function() {
        _Sprite_Animation_updatePosition.call(this);
        if (this._animation.position !== 3) {
            var parent = this._target.parent;
            var grandparent = parent ? parent.parent : null;
            if (_(this).orgParent === grandparent) {
                this.x += parent.x;
                this.y += parent.y;
            }
        }
    };
}());
