/*:
 * @plugindesc 
 * @author Kanji the Grass
 * 
 * @param noShakePictureId
 * @desc Specify some picture ID not-shaking. If specified nothing, all pictures don't shake.
 * @default []
 * @min 1
 * @type number[]
 * 
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author 莞爾の草
 * 
 * @param noShakePictureId
 * @name シェイクしないピクチャID
 * @desc シェイクしないピクチャIDを数値で指定します。何も指定して
 * いないとすべてのピクチャIDがシェイクしなくなります。
 * @default []
 * @min 1
 * @type number[]
 * 
 * @help 
 */
(function () {
var param = PluginManager.parameters('JsScript99Set');
param.noShakePictureId = eval(param['noShakePictureId']) || [];
param.noShakePictureId = [];
for (let i = 399; i <= 472; i++)
param.noShakePictureId.push(i);
param.noShakePictureId.push(PN_TalkWin);
var pictureNeedShake = param.noShakePictureId.length === 0 || 
param.noShakePictureId.map(function(str) {
return parseInt(str)
});
const _Sprite_Picture_init = Sprite_Picture.prototype.initialize;
Sprite_Picture.prototype.initialize = function(pictureId) {
this.needShake = pictureNeedShake === true || pictureNeedShake.contains(pictureId);
_Sprite_Picture_init.apply(this, arguments);
};
const _Sprite_Picture_update = Sprite_Picture.prototype.update;
Sprite_Picture.prototype.update = function() {
_Sprite_Picture_update.apply(this, arguments);
if (this.visible && this.needShake) {
this.updateShake()
}
};
Sprite_Picture.prototype.updateShake = function () {
this.x -= Math.round($gameScreen.shake());
}
})()
