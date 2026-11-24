/*:
 * @plugindesc 
 * 
 * @author Kameo (Kamesoft)
 *
 * @help 
 */
/*:ja
 * @plugindesc 
 * 
 * @author かめお (Kamesoft)
 *
 * @help 
 */
var KMS = KMS || {};
(function() {
'use strict';
var Const =
{
    debug:      false,          
    pluginCode: 'AreaEvent'     
};
var PluginName = 'KMS_' + Const.pluginCode;
KMS.imported = KMS.imported || {};
KMS.imported[Const.pluginCode] = true;
var AreaEvent = {};
AreaEvent.regex = {
    area: /<(?:エリアイベント|AreaEvent)\s*[:\s]\s*(\d+)\s*x\s*(\d+)>/i
};
AreaEvent.origin =
{
    topLeft:      7,
    topCenter:    8,
    topRight:     9,
    middleLeft:   4,
    middleCenter: 5,
    middleRight:  6,
    bottomLeft:   1,
    bottomCenter: 2,
    bottomRight:  3
};
var debuglog;
if (Const.debug)
{
    debuglog = function() { console.log(arguments); };
}
else
{
    debuglog = function() { };
}
function halfInt(value)
{
    return Math.floor(value / 2);
}
function convertPositionForAreaEvent(x, y, area)
{
    var width  = area.width  - 1;
    var height = area.height - 1;
    switch (area.origin)
    {
    case AreaEvent.origin.topLeft:
        return { x: x, y: y };
    case AreaEvent.origin.topCenter:
        return { x: x - halfInt(width), y: y };
    case AreaEvent.origin.topRight:
        return { x: x - width, y: y };
    case AreaEvent.origin.middleLeft:
        return { x: x, y: y - halfInt(height) };
    case AreaEvent.origin.middleCenter:
        return { x: x - halfInt(width), y: y - halfInt(height) };
    case AreaEvent.origin.middleRight:
        return { x: x - width, y: y - halfInt(height) };
    case AreaEvent.origin.bottomLeft:
        return { x: x, y: y - height };
    case AreaEvent.origin.bottomCenter:
        return { x: x - halfInt(width), y: y - height };
    case AreaEvent.origin.bottomRight:
        return { x: x - width, y: y - height };
    default:
        console.assert('Invalid area origin');
    }
}
var _Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function()
{
    _Game_Event_setupPage.call(this);
    this.setupAreaEventAttribute();
};
/**
 * エリアイベント用属性の設定
 */
Game_Event.prototype.setupAreaEventAttribute = function()
{
    this._areaEventAttribute = { width: 1, height: 1, origin: AreaEvent.origin.topLeft };
    var isComment = function(command)
    {
        return command && (command.code === 108 || command.code === 408);
    };
    var page = this.page();
    if (!page)
    {
        return;
    }
    var commands = page.list;
    var index    = 0;
    var command  = commands[index++];
    while (isComment(command))
    {
        var comment = command.parameters[0];
        var match   = AreaEvent.regex.area.exec(comment);
        if (match)
        {
            this._areaEventAttribute.width  = Math.max(Number(match[1]), 1);
            this._areaEventAttribute.height = Math.max(Number(match[2]), 1);
            debuglog(this._areaEventAttribute);
            break;
        }
        command = commands[index++];
    }
};
/**
 * イベントのトリガー位置とサイズを取得 (他プラグイン用)
 *
 * @return {object} イベントのトリガー位置とサイズを格納したオブジェクト
 */
Game_Event.prototype.getEventTriggerArea = function()
{
    var area = this._areaEventAttribute;
    var pos  = convertPositionForAreaEvent(this._x, this._y, area);
    return { x: pos.x, y: pos.y, width: area.width, height: area.height, origin: area.origin };
};
Game_Event.prototype.pos = function(x, y)
{
    var area = this._areaEventAttribute;
    var pos  = convertPositionForAreaEvent(x, y, area);
    return pos.x >= this._x &&
        pos.x <  this._x + area.width &&
        pos.y >= this._y &&
        pos.y <  this._y + area.height;
};
})();
