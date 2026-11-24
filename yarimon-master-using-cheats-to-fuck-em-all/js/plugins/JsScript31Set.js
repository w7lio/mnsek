/*:
 * @plugindesc 
 * @author 奏ねこま（おとぶき ねこま）
 * 
 * @help 
 */
var Imported = Imported || {};
var Makonet = Makonet || {};
(function(){
    'use strict';
    var plugin = 'JsScript31Set';
    Imported[plugin] = true;
    Makonet[plugin] = {};
    var $mpi = Makonet[plugin];
    $mpi.parameters = PluginManager.parameters(plugin);
    (function(o,p){
        var f=o[p];o[p]=function(){
            f.apply(this,arguments);
            if (!$gameTemp.isPlaytest()) {
                for(var i = 0 ; i < this._events.length; i++){
                    if(this._events[i] && this._events[i].event().meta['test']){
                        delete this._events[i];
                    }
                }
                this.refreshTileEvents();
            }
        };
    }(Game_Map.prototype,'setupEvents'));
}());
