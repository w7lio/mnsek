var Imported = Imported || {};
var Zale = Zale || {};
Zale.GameFocus = Zale.GameFocus || {};
(function(){
  if(Imported["MVCommons"] || Imported["PluginManagement"]){
    var author = [{
      email: "support@razelon.com",
      name: "Zalerinian",
      website: "http:
      }];
    var v = PluginManager.register("JsScript23Set", "1.0.0", PluginManager.getBasicPlugin("JsScript23Set").description, author, "2015-10-12");
    if(v === undefined) {
      throw new Error("Unable to load GameFocus due to mising dependencies!");
    } else if (v === false){
      PluginManager.printPlugin("JsScript23Set")
      throw new Error("Unable to load GameFocus due to registration failure! Is there another version running?");
    }
  } else {
    Imported["JsScript23Set"] = "1.0.0";
    console.log("Neither MVCommons nor PluginManagement are imported - Please install the MVCommons script to maintain an updated list of scripts in the project.");
  }
});
 /*:
  * @plugindesc 
  * @author Zalerinian
  * @param Pause Audio
  * @desc Pause the game audio when the window loses focus.
  * Default: true
  * @default true
  *
  * @param Pause Graphics
  * @desc Pause the game processing when the window loses focus.
  * Default: true
  * @default true
  *
  * @help 
  */
/*:ja
  * @plugindesc 
  * オーディオかビデオ、もしくはその両方を一時停止します。
  * @author Zalerinian
  * @param Pause Audio
  * @desc ウィンドウがアクティブでなくなった際、オーディオを停止します。
  * Default: true
  * @default true
  *
  * @param Pause Graphics
  * @desc ウィンドウがアクティブでなくなった際、ビデオを停止します。
  * Default: true
  * @default true
  *
  * @help 
  */
function GameFocus() {
  throw new Error("GameFocus is a static class!");
}
(function($) {
  // boolFunc(string str)
  function boolFunc(str) {
    return Function("return " + str + " === true")();
  }
  var params = PluginManager.parameters("JsScript23Set");
  Zale.GameFocus.PauseAudio = boolFunc(params["Pause Audio"]);
  Zale.GameFocus.PauseGraphics = boolFunc(params["Pause Graphics"]);
  $._callbacks = {onPause: [], whilePaused: [], onResume: []};
  $._audio = {};
  $._paused = { audio: false, graphics: false };
  // GameFocus.registerCallback(string type, function cb)
  $.registerCallback = function(type, cb) {
    if(typeof cb === 'function' && ["onPause", "whilePaused", "onResume"].contains(type)) {
      this._callbacks[type].push(cb);
    }
  }
  // GameFocus.removeCallback(string type, function cb)
  $.removeCallback = function(type, cb) {
    if(typeof cb === 'function' && ["onPause", "whilePaused", "onResume"].contains(type)) {
      var index = this._callbacks.indexOf(cb);
      this._callbacks[type].splice(index, 1);
    }
  }
  // GameFocus.checkForFocus()
  function checkForFocus() {
    if(document.hasFocus()) {
      var cbs = GameFocus._callbacks.onResume;
      for(var i = 0; i < cbs.length; i++) {
        cbs[i].call(GameFocus);
      }
    } else {
      var cbs = GameFocus._callbacks.whilePaused;
      for(var i = 0; i < cbs.length; i++) {
        cbs[i].call(GameFocus);
      }
      window.requestAnimationFrame(checkForFocus);
    }
  }
  // Input._onLostFocus()
  Zale.GameFocus.Input_update_POJc32oincwoSn = Input.update;
  Input.update = function() {
    Zale.GameFocus.Input_update_POJc32oincwoSn.call(this);
    if(!document.hasFocus()){
      var cbs = GameFocus._callbacks.onPause;
      for(var i = 0; i < cbs.length; i++) {
        cbs[i].call(GameFocus);
      }
      checkForFocus();
    }
  }
  // SceneManager.start()
  //  This function reverts SceneManager.stop() by setting _stopped to false,
  SceneManager.start = function() {
    this._stopped = false;
    this.update();
  }
  $.registerCallback("onPause", function(){
    if(Zale.GameFocus.PauseAudio) {
      this._paused.audio = true;
      this._audio.bgm = AudioManager.saveBgm();
      this._audio.bgs = AudioManager.saveBgs();
      AudioManager.stopMe();
      AudioManager.stopSe();
      if(AudioManager._bgmBuffer) {
        AudioManager._bgmBuffer.stop();
      }
      if(AudioManager._bgsBuffer) {
        AudioManager._bgsBuffer.stop();
      }
    }
    if(Zale.GameFocus.PauseGraphics) {
      this._paused.graphics = true;
      SceneManager.stop();
    }
  });
  $.registerCallback("onResume", function() {
    if(this._paused.audio) {
      this._paused.audio = false;
      var bgm = this._audio.bgm;
      var bgs = this._audio.bgs;
      if(!AudioManager.isCurrentBgm(this._audio.bgm)) {
        AudioManager.playBgm(this._audio.bgm);
      } else if(AudioManager._bgmBuffer) {
        AudioManager._bgmBuffer.play(true, bgm.pos);
      }
      if(!AudioManager.isCurrentBgs(this._audio.bgs)) {
        AudioManager.playBgs(this._audio.bgs);
      } else if(AudioManager._bgsBuffer) {
        AudioManager._bgsBuffer.play(true, bgs.pos);
      }
    }
    if(this._paused.graphics) {
      this._paused.graphics = false;
      SceneManager.start();
    }
  });
})(GameFocus);
