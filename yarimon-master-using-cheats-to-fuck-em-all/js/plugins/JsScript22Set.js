var Imported = Imported || {};
Imported.Galv_VisualNovelChoices = true;
var Galv = Galv || {};            
Galv.VNC = Galv.VNC || {};        
/*:
 * @plugindesc 
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Command Width
 * @desc 選択コマンドの幅。これは、VNButtons.pngの幅以下でなければなりません。
 * @default 700
 *
 * @param Command Height
 * @desc 選択コマンドの高さ。これは、VNButtons.pngの高さ以下でなければなりません。
 * @default 48
 *
 * @param Always Middle
 * @desc 「選択肢を表示」ウィンドウの位置に関係なく、中央に選択肢を表示します。false or true;
 * @default true
 *
 * @param Message Gap
 * @desc 選択肢がメッセージウィンドウから離れて表示される距離
 * @default 0
 *
 * @param Disabled Button
 * @desc 無効な選択肢のボタンを表示するために使用される行番号（選択肢を無効にできるプラグインを使用している場合）
 * @default 3
 *
 * @requiredAssets img/system/VNButtons
 *
 * @help 
 */
(function() {
Galv.VNC.width = Number(PluginManager.parameters('JsScript22Set')["Command Width"]);
Galv.VNC.height = Number(PluginManager.parameters('JsScript22Set')["Command Height"]);
Galv.VNC.alwaysMid = PluginManager.parameters('JsScript22Set')["Always Middle"].toLowerCase() == 'true' ? true : false;
Galv.VNC.msgGap = Number(PluginManager.parameters('JsScript22Set')["Message Gap"]);
Galv.VNC.disableBtn = Number(PluginManager.parameters('JsScript22Set')["Disabled Button"]);
Galv.VNC.Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
    ImageManager.reserveSystem('VNButtons');
Galv.VNC.Scene_Boot_loadSystemImages.call(this);
};
Galv.VNC.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
Galv.VNC.Game_System_initialize.call(this);
this.vnChoices = true;
};
Window_ChoiceList.prototype.textHeight = Window_ChoiceList.prototype.lineHeight;
Galv.VNC.Window_ChoiceList_lineHeight = Window_ChoiceList.prototype.lineHeight;
Window_ChoiceList.prototype.lineHeight = function() {return $gameSystem.vnChoices ? Galv.VNC.height : Galv.VNC.Window_ChoiceList_lineHeight.call(this);};
Galv.VNC.Window_ChoiceList_itemHeight = Window_ChoiceList.prototype.itemHeight;
Window_ChoiceList.prototype.itemHeight = function() {return $gameSystem.vnChoices ? Galv.VNC.height : Galv.VNC.Window_ChoiceList_itemHeight.call(this);};
Galv.VNC.Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;
Window_ChoiceList.prototype.drawItem = function(index) {
if ($gameSystem.vnChoices) {
var rect = this.itemRectForText(index);
this.drawButton(index,rect.y);
if (index === this._index) this.drawButton(index,rect.y,true);
var offset = (this.lineHeight() - this.textHeight()) * 0.5;
this.drawTextEx(this.commandName(index), rect.x, rect.y + offset);
} else {
Galv.VNC.Window_ChoiceList_drawItem.call(this,index);
};
};
Galv.VNC.Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
Window_ChoiceList.prototype.updatePlacement = function() {
Galv.VNC.Window_ChoiceList_updatePlacement.call(this);
if ($gameSystem.vnChoices && Galv.VNC.alwaysMid) {
this.x = (Graphics.boxWidth - this.width) / 2;
};
if (this._messageWindow.y >= Graphics.boxHeight / 2) {
this.y -= Galv.VNC.msgGap;
    } else {
        this.y += Galv.VNC.msgGap;
};
};
Galv.VNC.Window_ChoiceList__refreshCursor = Window_ChoiceList.prototype._refreshCursor;
Window_ChoiceList.prototype._refreshCursor = function() {
if ($gameSystem.vnChoices) {
this._windowCursorSprite.opacity = 0;
} else {
Galv.VNC.Window_ChoiceList__refreshCursor.call(this);
};
};
Window_ChoiceList.prototype.drawButton = function(index,y,cursor) {
    var bitmap = ImageManager.loadSystem('VNButtons');
    var pw = Galv.VNC.width;
    var ph = Galv.VNC.height;
    var sx = 0;
if (cursor) {
var bgId = 0;
} else {
if (this._list[index].enabled === false) {
var bgId = Galv.VNC.disableBtn;
} else {
var bgId = this.choice_background[index] ? this.choice_background[index] : 1;
};
};
    var sy = bgId * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, 0, y);
};
Galv.VNC.Window_ChoiceList_start = Window_ChoiceList.prototype.start;
Window_ChoiceList.prototype.start = function() {
this.setupVNChoices();
Galv.VNC.Window_ChoiceList_start.call(this);
};
Window_ChoiceList.prototype.setupVNChoices = function() {
this.ChoiceSprites = [];
this.choice_background = [];
this._vnIndex = this._index;
    if ($gameSystem.vnChoices) {
      this.opacity = 0;
} else {
      this.opacity = 255;
};
};
Galv.VNC.Window_ChoiceList_update = Window_ChoiceList.prototype.update;
Window_ChoiceList.prototype.update = function() {
Galv.VNC.Window_ChoiceList_update.call(this);
if (this._vnIndex != this._index) {
this.refresh();
this._vnIndex = this._index;
}
};
Galv.VNC.Window_ChoiceList_updateBackground = Window_ChoiceList.prototype.updateBackground;
Window_ChoiceList.prototype.updateBackground = function() {
if ($gameSystem.vnChoices) {
this._background = 2;
    this.setBackgroundType(this._background);
} else {
Galv.VNC.Window_ChoiceList_updateBackground.call(this);
};
};
Galv.VNC.Window_ChoiceList_convertEscapeCharacters = Window_ChoiceList.prototype.convertEscapeCharacters;
Window_ChoiceList.prototype.convertEscapeCharacters = function(text,index) {
text = text.replace(/\\/g, '\x1b');
text = text.replace(/\x1b\x1b/g, '\\');
text = text.replace(/\x1bB\[(\d+)\]/gi, function() {
this.choice_background[index] = parseInt(arguments[1]);
        return "";
    }.bind(this));
return Galv.VNC.Window_ChoiceList_convertEscapeCharacters.call(this,text);
};
Window_ChoiceList.prototype.itemRectForText = function(index) {
    var rect = this.itemRect(index);
if ($gameSystem.vnChoices) {
var txt = $gameMessage._choices[index];
var icons = txt.match(/\\i\[/g) || txt.match(/\\I\[/g);
icons = icons ? icons.length * 36 : 0;
txt = this.convertEscapeCharacters(txt,index);
txt = txt.replace(/i\[\d*\]/g,"");
txt = txt.replace(/I\[\d*\]/g,"");
txt = txt.replace(/c\[\d*\]/g,"");
txt = txt.replace(/C\[\d*\]/g,"");
var txtSize = this.textWidth(txt) + icons;
rect.x = (Galv.VNC.width - txtSize) / 2;
} else {
rect.x += this.textPadding();
};
rect.width -= this.textPadding() * 2;
return rect;
};
Window_ChoiceList.prototype.windowWidth = function() {
    var width = this.maxChoiceWidth() + this.padding * 2;
    return Math.min(width, Graphics.boxWidth);
};
Galv.VNC.Window_ChoiceList_maxChoiceWidth = Window_ChoiceList.prototype.maxChoiceWidth;
Window_ChoiceList.prototype.maxChoiceWidth = function() {
if ($gameSystem.vnChoices) {
return Galv.VNC.width;
} else {
return Galv.VNC.Window_ChoiceList_maxChoiceWidth.call(this);
};
};
})();
