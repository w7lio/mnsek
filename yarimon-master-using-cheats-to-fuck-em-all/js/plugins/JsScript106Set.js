// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
/*:
 * @plugindesc 
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @help 
 */
var Imported = Imported || {};
Imported.TMBalloonLoop = true;
if (!Imported.TMEventBase) {
  Imported.TMEventBase = true;
  (function() {
    var _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
      _Game_Event_setupPage.call(this);
      if (this._pageIndex >= 0) {
        this.loadCommentParams();
      }
    };
    Game_Event.prototype.loadCommentParams = function() {
      this._commentParams = {};
      var re = /<([^<>:]+)(:?)([^>]*)>/g;
      var list = this.list();
      for (var i = 0; i < list.length; i++) {
        var command = list[i];
        if (command && command.code == 108 || command.code == 408) {
          for (;;) {
            var match = re.exec(command.parameters[0]);
            if (match) {
              if (match[2] === ':') {
                this._commentParams[match[1]] = match[3];
              } else {
                this._commentParams[match[1]] = true;
              }
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }
    };
    Game_Event.prototype.loadTagParam = function(paramName) {
      if (this._commentParams[paramName]) {
        return this._commentParams[paramName];
      } else if (this.event().meta[paramName]) {
        return this.event().meta[paramName];
      } else {
        return null;
      }
    };
  })();
}
(function() {
  var _Game_CharacterBase_endBalloon = Game_CharacterBase.prototype.endBalloon;
  Game_CharacterBase.prototype.endBalloon = function() {
    _Game_CharacterBase_endBalloon.call(this);
    var balloonLoop = this.balloonLoop();
    if (balloonLoop) {
      this.requestBalloon(balloonLoop);
    }
  };
  Game_CharacterBase.prototype.setBalloonLoop = function(balloonLoop) {
    this._balloonLoop = balloonLoop;
  };
  Game_CharacterBase.prototype.balloonLoop = function() {
    try {
      if ($gameSystem.WinedTrainerArr.indexOf(this.TrainerId) != -1) {
        if (this._balloonLoop == 11) this._balloonLoop = 21;
        if (this._balloonLoop == 12) this._balloonLoop = 22;
        if (this._balloonLoop == 13) this._balloonLoop = 23;
      }
    } catch (e) { }
    return this._balloonLoop;
  };
  var _Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    _Game_Event_setupPage.call(this);
    if (this._pageIndex >= 0) {
      let _ckStr = this.loadTagParam('balloonLoop');
      if (_ckStr == "btl" || _ckStr == "star" || _ckStr == "champ") { 
        let _starFlg = _ckStr == "star";
        let _champFlg = _ckStr == "champ";
        _ckStr = 11;
        this.TrainerId = 0;
        let bIdStr = this.loadTagParam('bId');
        if (bIdStr != null) {
          let _ckId = Number(bIdStr);
          let trData = GetTrainerData(_ckId);
          if ($gameSystem.TrainerLv > Number(trData.suisyoLv)) _ckStr = 11;
          if ($gameSystem.TrainerLv <= Number(trData.suisyoLv)) _ckStr = 12;
          if ($gameSystem.TrainerLv + 5 <= Number(trData.suisyoLv)) _ckStr = 13;
          this.TrainerId = Number(bIdStr);
        }
        if (_starFlg) _ckStr = "star";
        if (_champFlg) _ckStr = "champ";
      }
      if (_ckStr == "ev1") _ckStr = 14;
      if (_ckStr == "ev2") _ckStr = 15;
      if (_ckStr == "ev3") _ckStr = 16;
      if (_ckStr == "ev4") _ckStr = 25;
      if (_ckStr == "shop") _ckStr = 26;
      if (_ckStr == "qu1") _ckStr = 17;
      if (_ckStr == "qu2") _ckStr = 18;
      if (_ckStr == "qu3") _ckStr = 19;
      if (_ckStr == "love") _ckStr = 20;
      if ($gameSystem.WinedTrainerArr.indexOf(this.TrainerId) != -1) {
        if (_ckStr == 11) _ckStr = 21;
        if (_ckStr == 12) _ckStr = 22;
        if (_ckStr == 13) _ckStr = 23;
      }
      if (_ckStr == "star") _ckStr = 24;
      if (_ckStr == "champ") _ckStr = 27;
      if (_ckStr == "hatena") _ckStr = 28;
      if (_ckStr == "mizugi") _ckStr = 29;
      if (_ckStr == "onsen") _ckStr = 30;
      if (_ckStr == "kaihuku") _ckStr = 31;
      var balloonLoop = _ckStr;
      if (balloonLoop) {
        if (!this.blnSetFlg) this.setBalloonLoop(balloonLoop);
      }
    } else {
      if (!this.blnSetFlg) this.setBalloonLoop(0);
    }
    this.blnSetFlg = false;
  };
  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'setBalloonLoop') {
      var character = this.character(+args[0]);
      if (character) {
        character.setBalloonLoop(+args[1]);
      }
    }
  };
  var _Sprite_Character_endBalloon = Sprite_Character.prototype.endBalloon;
  Sprite_Character.prototype.endBalloon = function() {
    var balloonLoop = this._character.balloonLoop();
    if (balloonLoop && !$gameMap.isEventRunning()) {
      this._balloonSprite.setup(balloonLoop);
    } else {
      _Sprite_Character_endBalloon.call(this);
    }
  };
  var _Sprite_Character_Bln_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    _Sprite_Character_Bln_update.call(this);
    var balloonLoop = this._character.balloonLoop(); 
    if　(!balloonLoop) {
    } else {
      if(Math.abs(PL_realX - this._character.x) < 4 &&
          Math.abs(PL_realY - this._character.y) < 4 && !$gameMap.isEventRunning()) {
        if(this._balloonSprite != undefined) {
          if (!this._character._balloonPlaying) {
            this._balloonSprite.setup(balloonLoop);
          }
        }
      } else {
        _Sprite_Character_endBalloon.call(this);
      }
    }
  }
})();
