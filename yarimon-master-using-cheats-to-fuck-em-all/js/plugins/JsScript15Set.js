/*=============================================================================
 * Steamworks
 * By Visustella
 * Archeia_Steamworks.js
 * Version: 1.00
 *
 * Copyright (C) 2019 Dan "Liqudize" Deptula & Archeia
 *
 * This plugin is licensed to you, the user under the terms that you credit
 * Liquidize and Archeia in your game (commercial or free). The terms also include you leaving all
 * copyrights intact, you are however free to modify this file to add additional
 * functionality or fix bugs. 
 * 
 *=============================================================================*/
/*:
 * @plugindesc 
 * @author Visustella
 *
 * @param Steamworks Debug
 * @desc Enable or disable debug messages
 * @default false
 *
 * @help 
 *=============================================================================*/
// [JoiPlay/Android] greenworks (Steam) không tồn tại -> dùng bản giả, mọi chức năng Steam tự tắt
var steamworks = (function () {
    try {
        if (typeof require === 'function' && typeof process === 'object') return require("./js/libs/greenworks");
    } catch (e) {}
    var noop = function () { return false; };
    return (typeof Proxy === 'function')
        ? new Proxy({}, { get: function () { return noop; } })
        : { initAPI: noop, getSteamId: noop, getCurrentGameLanguage: function () { return ""; }, isCloudEnabled: noop, isCloudEnabledForUser: noop, isGameOverlayEnabled: noop };
})();
var Imported = Imported || {};
var Archeia = Archeia || {};
Archeia.Steamworks = Archeia.Steamworks || {};
Archeia.Utils = Archeia.Utils || {};
var parameters = $plugins.filter(function (plugin) {
        return plugin.description.contains('<Archeia_Steamworks>');
    });
    if (parameters.length === 0) {
        throw new Error("Couldn't find the parameters of Archeia_Steamworks.");
    }
    Archeia.Steamworks.Parameters = parameters[0].parameters;
    Archeia.Steamworks.Param = {};
    Archeia.Steamworks.Param.debugMode = eval(Archeia.Steamworks.Parameters['Steamworks Debug']);
    Archeia.Steamworks.CachedUser = null;
    Archeia.Steamworks.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!Archeia.Steamworks.DataManager_isDatabaseLoaded.call(this)) return false;
        this.processSteamworksItemNotetags($dataItems);
        this.processSteamworksItemNotetags($dataWeapons);
        this.processSteamworksItemNotetags($dataArmors);
        this.processSteamworksClassNotetags($dataClasses);
        return true;
    };
    DataManager.processSteamworksItemNotetags = function(group) {
        var note1 = /<(?:ACHIEVEMENT GRANT|achievement unlocked|achieved):[ ](.*),([+-]\d+)\/>/i;
        var note2 = /<(?:ACHIEVEMENT CLEAR|achievement taken|unachieved):[ ](.*),([-+]\d+)\/>/i;
        for (var n = 1; n < group.length; n++) {
            var obj = group[n];
            var notedata = obj.note.split(/[\r\n]+/);
            obj.steamworks = {};
            obj.steamworks.achievementGrants = {};
            obj.steamworks.achievementClears = {};
            for (var i = 0; i < notedata.length; i++) {
                var line = notedata[i];
                if (line.match(note1)) {
                    var achievement = RegExp.$1;
                    var given = parseInt(RegExp.$2);
                    if (!obj.steamworks.achievementGrants[achievement]) {
                        obj.steamworks.achievementGrants[achievement] = given;
                    }
                } else if (line.match(note2)) {
                    var achievement = RegExp.$1;
                    var given = parseInt(RegExp.$2);
                    if (!obj.steamworks.achievementClears[achievement]) {
                        obj.steamworks.achievementClears[achievement] = given;
                    }
                }
            }
        }
    };
    DataManager.processSteamworksClassNotetags = function(group) {
        var note1 = /<(?:ACHIEVEMENT GRANT|achievement unlocked|achieved):[ ](.*),(LEARN|UNLEARN),(\d+)\/>/i;
        var note2 = /<(?:ACHIEVEMENT CLEAR|achievement taken|unachieved):[ ](.*),(LEARN|UNLEARN),(\d+)\/>/i;
        for (var n = 1; n < group.length; n++) {
            var obj = group[n];
            var notedata = obj.note.split(/[\r\n]+/);
            obj.steamworks = {};
            obj.steamworks.achievementGrants = {};
            obj.steamworks.achievementClears = {};
            for (var i = 0; i < notedata.length; i++) {
                var line = notedata[i];
                if (line.match(note1)) {
                    obj.steamworks.achievementGrants[RegExp.$1] = obj.steamworks.achievementGrants[RegExp.$1] || {};
                    obj.steamworks.achievementGrants[RegExp.$1].learn =  obj.steamworks.achievementGrants[RegExp.$1].learn  || [];
                    obj.steamworks.achievementGrants[RegExp.$1].unlearn = obj.steamworks.achievementGrants[RegExp.$1].unlearn  || [];
                    var type = RegExp.$2.toLowerCase();
                    switch (type)
                    {
                        case "learn":
                            obj.steamworks.achievementGrants[RegExp.$1].learn.push(parseInt(RegExp.$3));
                            break;
                        case "unlearn":
                            obj.steamworks.achievementGrants[RegExp.$1].unlearn.push(parseInt(RegExp.$3));
                            break;
                    }
                } else if (line.match(note2)) {
                    obj.steamworks.achievementClears[RegExp.$1] = obj.steamworks.achievementClears[RegExp.$1] || {};
                    obj.steamworks.achievementClears[RegExp.$1].learn =  obj.steamworks.achievementClears[RegExp.$1].learn  || [];
                    obj.steamworks.achievementClears[RegExp.$1].unlearn =  obj.steamworks.achievementClears[RegExp.$1].unlearn  || [];
                    var type = RegExp.$2.toLowerCase();
                    switch (type)
                    {
                        case "learn":
                            obj.steamworks.achievementClears[RegExp.$1].learn.push(parseInt(RegExp.$3));
                            break;
                        case "unlearn":
                            obj.steamworks.achievementClears[RegExp.$1].unlearn.push(parseInt(RegExp.$3));
                            break;
                    }
                }
            }
        }
    };
    Archeia.Steamworks.SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function() {
        this.initSteamworks();
        Archeia.Steamworks.SceneManager_initialize.call(this);
    };
    SceneManager.initSteamworks = function() {
        this._steamInitialized = steamworks.initAPI();
        if (this.steamworksInitialized() == true) {
            console.warn("Initialized Steamworks API");
        } else {
            console.warn("Steamworks failed to initialize.");
        }
    };
    SceneManager.steamworksInitialized = function() {
      return this._steamInitialized;
    };
    function SteamManager() {
        throw new Error('This is a static class');
    }
    SteamManager.saveTextToCloud = function(file,contents,callback,errorcallback) {
        if (SceneManager.steamworksInitialized()) {
            steamworks.saveTextToFile(file,contents,function() {
                if (callback) {
                    callback();
                }
            }, function(err) {
                if (errorcallback) {
                    errorcallback(err);
                } else {
                    if (Archeia.Steamworks.Param.debugMode) {
                        console.error(Archeia.Utils.sformat("[ARCHEIA STEAMWORKS] Error when trying to save file to cloud. OUTPUT: '{0}'", err));
                    }
                }
            });
        }  else {
            if (Archeia.Steamworks.Param.debugMode){
                console.warn("[ARCHEIA STEAMWORKS] Unable to get save file to cloud. Is Steamworks Initialized? Does the player have cloud sync enabled?");
            }
        }
      };
      SteamManager.readTextFromCloud = function(file,callback,errorcallback) {
          if (SceneManager.steamworksInitialized()) {
              steamworks.readTextFromFile(file,function(contents) {
                  if (callback) {
                      callback(contents);
                  }
              }, function(err) {
                  if (errorcallback) {
                      errorcallback(err);
                  } else {
                      if (Archeia.Steamworks.Param.debugMode) {
                          console.error(Archeia.Utils.sformat("[ARCHEIA STEAMWORKS] Error when trying to read file from cloud. OUTPUT: '{0}'", err));
                      }
                  }
              });
          }  else {
              if (Archeia.Steamworks.Param.debugMode){
                  console.warn("[ARCHEIA STEAMWORKS] Unable to get red file from cloud. Is Steamworks Initialized? Does the player have cloud sync enabled?");
              }
          }
      };
      SteamManager.isCloudSyncEnabledForUser = function() {
          if (SceneManager.steamworksInitialized()) {
              return steamworks.isCloudEnabledForUser();
          }  else {
              if (Archeia.Steamworks.Param.debugMode){
                  console.warn("[ARCHEIA STEAMWORKS] Unable to get if cloud sync is enabled for user. Is Steamworks Initialized?");
              }
              return null;
          }
      };
      SteamManager.isCloudEnabled = function() {
          if (SceneManager.steamworksInitialized()) {
              return steamworks.isCloudEnabled();
          }  else {
              if (Archeia.Steamworks.Param.debugMode){
                  console.warn("[ARCHEIA STEAMWORKS] Unable to get if cloud sync is enabled. Is Steamworks Initialized?");
              }
              return null;
          }
      };
      SteamManager.enableCloud = function(flag) {
          if (SceneManager.steamworksInitialized()) {
              steamworks.enableCloud(flag);
          }  else {
              if (Archeia.Steamworks.Param.debugMode){
                  console.warn("[ARCHEIA STEAMWORKS] Unable to enable/disable cloud sync. Is Steamworks Initialized?");
              }
          }
      };
      SteamManager.getCloudQuota = function(callback,errorcallback) {
          if (SceneManager.steamworksInitialized()) {
             steamworks.getCloudQuota(function(total,available) {
                  if (callback) {
                     callback(total,available);
                  }
             },function(err){
                  if (errorcallback) {
                     errorcallback(err);
                  } else {
                      if (Archeia.Steamworks.Param.debugMode) {
                          console.error(Archeia.Utils.sformat("[ARCHEIA STEAMWORKS] Error when trying to get cloud quota. OUTPUT: '{0}'", err));
                      }
                  }
              });
          }  else {
              if (Archeia.Steamworks.Param.debugMode){
                  console.warn("[ARCHEIA STEAMWORKS] Unable to get if cloud sync is enabled. Is Steamworks Initialized?");
              }
          }
      };
    Game_System.prototype.getSteamUserObject = function() {
        if (SceneManager.steamworksInitialized()) {
            return steamworks.getSteamId();
        } else {
            if (Archeia.Steamworks.Param.debugMode) console.warn("[ARCHEIA STEAMWORKS] Steamworks is not Initialized.");
            return null;
        }
    };
    Game_System.prototype.getSteamName = function() {
        if (this.getCachedSteamUser()) {
            return this.getCachedSteamUser().screenName;
        } else {
            if (Archeia.Steamworks.Param.debugMode) console.warn("[ARCHEIA STEAMWORKS] Unable to obtain Steam Name. Is Steamworks Initialized?");
            return null;
        }
    };
    Game_System.prototype.getSteamLevel = function() {
        if (this.getCachedSteamUser()) {
            return this.getCachedSteamUser().level;
        } else {
            if (Archeia.Steamworks.Param.debugMode) console.warn("[ARCHEIA STEAMWORKS] Unable to obtain Steam Level. Is Steamworks Initialized?");
            return null;
        }
    };
    Game_System.prototype.getSteamAccountId = function() {
        if (this.getCachedSteamUser()) {
            return this.getCachedSteamUser().accountId;
        } else {
            if (Archeia.Steamworks.Param.debugMode) console.warn("[ARCHEIA STEAMWORKS] Unable to obtain Account Id. Is Steamworks Initialized?");
            return null;
        }
    };
    Game_System.prototype.getSteamStaticAccountId = function() {
        if (this.getCachedSteamUser()) {
            return this.getCachedSteamUser().staticAccountId;
        } else {
            if (Archeia.Steamworks.Param.debugMode) console.warn("[ARCHEIA STEAMWORKS] Unable to obtain Static Account Id. Is Steamworks Initialized?");
            return null;
        }
    };
    Game_System.prototype.getCachedSteamUser = function() {
       if (Archeia.Steamworks.CachedUser) {
           return Archeia.Steamworks.CachedUser;
       } else {
           return Archeia.Steamworks.CachedUser = this.getSteamUserObject();
       }
    };
    Game_System.prototype.unlockAchievement = function(achievement,callback,errorcallback) {
      if (SceneManager.steamworksInitialized()) {
          steamworks.activateAchievement(achievement,function() {
              if (callback) {
                  callback(achievement);
              }
          }, function(err) {
              if (errorcallback) {
                  errorcallback(err);
              } else {
                  if (Archeia.Steamworks.Param.debugMode) {
                      console.error(Archeia.Utils.sformat("[ARCHEIA STEAMWORKS] Error when trying to unlock achievement '{0}' OUTPUT: '{1}'", achievement, err));
                  }
              }
          });
      } else {
          if (Archeia.Steamworks.Param.debugMode) {
              console.warn("[ARCHEIA STEAMWORKS] Unable to grant achievement. Is Steamworks Initialized?");
          }
      }
    };
    Game_System.prototype.forceUnlockAllAchievements = function() {
        var achievements = this.getAchievements();
        if (achievements) {
          for (var achievement of achievements) {
             this.unlockAchievement(achievement, null, null);
          }
        }
    };
    Game_System.prototype.getAchievements = function(){
        if (SceneManager.steamworksInitialized()) {
            return steamworks.getAchievementNames();
        } else {
            if (Archeia.Steamworks.Param.debugMode) {
                console.warn("[ARCHEIA STEAMWORKS] Unable to retrieve achievements. Is Steamworks Initialized?");
            }
            return null;
        }
    };
    Game_System.prototype.getNumberOfAchievements = function() {
        if (SceneManager.steamworksInitialized()) {
            return steamworks.getNumberOfAchievements();
        } else {
            if (Archeia.Steamworks.Param.debugMode) {
                console.warn("[ARCHEIA STEAMWORKS] Unable to retrieve achievement count. Is Steamworks Initialized?");
            }
            return null;
        }
    };
    Game_System.prototype.clearAchievement = function(achievement,callback,errorcallback) {
        if (SceneManager.steamworksInitialized()) {
            steamworks.clearAchievement(achievement,function() {
                if (callback) {
                    callback(achievement);
                }
            }, function(err) {
                if (errorcallback) {
                    errorcallback(err);
                } else {
                    if (Archeia.Steamworks.Param.debugMode) {
                        console.error(Archeia.Utils.sformat("[ARCHEIA STEAMWORKS] Error when trying to clear achievement '{0}' OUTPUT: '{1}'", achievement, err));
                    }
                }
            });
        } else {
            if (Archeia.Steamworks.Param.debugMode) {
                console.warn("[ARCHEIA STEAMWORKS] Unable to clear achievement. Is Steamworks Initialized?");
            }
        }
    };
    Game_System.prototype.getAchievement = function(achievement,callback,errorcallback) {
        if (SceneManager.steamworksInitialized()) {
            steamworks.getAchievement(achievement,function(achieved) {
                if (callback) {
                    callback(achieved,achievement);
                }
            }, function(err) {
                if (errorcallback) {
                    errorcallback(err);
                } else {
                    if (Archeia.Steamworks.Param.debugMode) {
                        console.error(Archeia.Utils.sformat("[ARCHEIA STEAMWORKS] Error when trying to get achievement '{0}' OUTPUT: '{1}'", achievement, err));
                    }
                }
            });
        } else {
            if (Archeia.Steamworks.Param.debugMode) {
                console.warn("[ARCHEIA STEAMWORKS] Unable to get achievement. Is Steamworks Initialized?");
            }
        }
    };
    Game_System.prototype.getCurrentGameLanguage = function() {
      if (SceneManager.steamworksInitialized()) {
          return steamworks.getCurrentGameLanguage();
      } else {
          if (Archeia.Steamworks.Param.debugMode){
              console.warn("[ARCHEIA STEAMWORKS] Unable to get game language. Is Steamworks Initialized?");
          }
          return null;
      }
    };
    Game_System.prototype.getNumberOfPlayers = function(callback,errorcallback) {
      if (SceneManager.steamworksInitialized()) {
          steamworks.getNumberOfPlayers(function(numofplayers){
              if (callback) {
                  callback(numofplayers);
              }
          },function(err){
              if (errorcallback) {
                  errorcallback(err);
              } else {
                  if (Archeia.Steamworks.Param.debugMode) {
                      console.error(Archeia.Utils.sformat("[ARCHEIA STEAMWORKS] Error when trying to get number of players. OUTPUT: '{0}'", err));
                  }
              }
          });
      }  else {
          if (Archeia.Steamworks.Param.debugMode){
              console.warn("[ARCHEIA STEAMWORKS] Unable to get number of players. Is Steamworks Initialized?");
          }
          return null;
      }
    };
    Game_System.prototype.activateGameOverlay = function(option) {
      if (SceneManager.steamworksInitialized()) {
          if (!option) {
              option = "Community";
          }
          steamworks.activateGameOverlay(option);
      } else {
          if (Archeia.Steamworks.Param.debugMode){
              console.warn("[ARCHEIA STEAMWORKS] Unable to open steam overlay. Is Steamworks Initialized? Does the player have game overlay enabled?");
          }
      }
    };
    Game_System.prototype.isGameOverlayEnabled = function() {
        if (SceneManager.steamworksInitialized()) {
            return steamworks.isGameOverlayEnabled();
        } else {
            if (Archeia.Steamworks.Param.debugMode){
                console.warn("[ARCHEIA STEAMWORKS] Unable to get if steam overlay is enabled. Is Steamworks Initialized?");
            }
            return null;
        }
    };
    Game_System.prototype.activateGameOverlayToWebpage = function(url) {
        if (SceneManager.steamworksInitialized()) {
            steamworks.activateGameOverlayToWebPage(url);
        } else {
            if (Archeia.Steamworks.Param.debugMode){
                console.warn("[ARCHEIA STEAMWORKS] Unable to get open game overlay to specified url. Is Steamworks Initialized? Does the player have Game overlay Enabled?");
            }
            return null;
        }
    };
    Game_System.prototype.onAchievementUnlocked = function(achievement) {
        $gameParty.members().forEach(function(member) {
           if (member.currentClass().steamworks.achievementGrants[achievement]) {
               if (member.currentClass().steamworks.achievementGrants[achievement].learn) {
                   for (var l = 0; l < member.currentClass().steamworks.achievementGrants[achievement].learn.length; l++ ){
                       member.learnSkill(member.currentClass().steamworks.achievementGrants[achievement].learn[l]);
                   }
               } if (member.currentClass().steamworks.achievementGrants[achievement].unlearn) {
                   for (var u = 0; u < member.currentClass().steamworks.achievementGrants[achievement].unlearn.length; u++ ){
                       member.forgetSkill(member.currentClass().steamworks.achievementGrants[achievement].unlearn[u]);
                   }
               }
           }
        });
        for (var i = 0; i < $dataItems.length; i++) {
            var item = $dataItems[i];
            if (item && item.steamworks) {
                if (item.steamworks.achievementGrants[achievement]) {
                    var given = item.steamworks.achievementGrants[achievement];
                    $gameParty.gainItem(item,given,true);
                }
            }
        }
        for (var w = 0; w < $dataWeapons.length; w++) {
            var weapon = $dataWeapons[w];
            if (weapon && weapon.steamworks) {
                if (weapon.steamworks.achievementGrants[achievement]) {
                    var given = weapon.steamworks.achievementGrants[achievement];
                    $gameParty.gainItem(weapon,given,true);
                }
            }
        }
        for (var a = 0; a < $dataArmors.length; a++) {
            var armor = $dataArmors[a];
            if (armor && armor.steamworks) {
                if (armor.steamworks.achievementGrants[achievement]) {
                    var given = armor.steamworks.achievementGrants[achievement];
                    $gameParty.gainItem(armor,given,true);
                }
            }
        }
    };
    Game_System.prototype.onAchievementCleared = function(achievement) {
        $gameParty.members().forEach(function(member) {
            if (member.currentClass().steamworks.achievementClears[achievement]) {
                if (member.currentClass().steamworks.achievementClears[achievement].learn) {
                    for (var l = 0; l < member.currentClass().steamworks.achievementClears[achievement].learn.length; l++ ){
                        member.learnSkill(member.currentClass().steamworks.achievementGrants[achievement].learn[l]);
                    }
                } if (member.currentClass().steamworks.achievementClears[achievement].unlearn) {
                    for (var u = 0; u < member.currentClass().steamworks.achievementClears[achievement].unlearn.length; u++ ){
                        member.forgetSkill(member.currentClass().steamworks.achievementClears[achievement].unlearn[u]);
                    }
                }
            }
        });
        for (var i = 0; i < $dataItems.length; i++) {
            var item = $dataItems[i];
            if (item && item.steamworks) {
                if (item.steamworks.achievementClears[achievement]) {
                    var given = item.steamworks.achievementClears[achievement];
                    $gameParty.gainItem(item,given,true);
                }
            }
        }
        for (var w = 0; w < $dataWeapons.length; w++) {
            var weapon = $dataWeapons[w];
            if (weapon && weapon.steamworks) {
                if (weapon.steamworks.achievementClears[achievement]) {
                    var given = weapon.steamworks.achievementClears[achievement];
                    $gameParty.gainItem(weapon,given,true);
                }
            }
        }
        for (var a = 0; a < $dataArmors.length; a++) {
            var armor = $dataArmors[a];
            if (armor && armor.steamworks) {
                if (armor.steamworks.achievementClears[achievement]) {
                    var given = armor.steamworks.achievementClears[achievement];
                    $gameParty.gainItem(armor,given,true);
                }
            }
        }
    };
    Archeia.Steamworks.GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command,args) {
      if (command.toLowerCase() == "steamworks") {
          if (args.length < 1) return; 
          var action = args[0].toLowerCase();
          switch (action) {
              case "steamname":
              case "screenname":
              case "name":
                  if (args.length < 2) return; 
                  var steamname = $gameSystem.getSteamName();
                  if (steamname == null) steamname = -1; 
                  $gameVariables.setValue(parseInt(args[1]),steamname);
                  break;
              case "steamid":
              case "accountid":
              case "id":
                  if (args.length < 2) return; 
                  var steamid = $gameSystem.getSteamAccountId();
                  if (steamid == null) steamid = -1;
                  $gameVariables.setValue(parseInt(args[1]),steamid);
                  break;
              case "staticsteamid":
              case "staticid":
              case "staticaccountid":
                  if (args.length < 2) return; 
                  var statid = $gameSystem.getSteamStaticAccountId();
                  if (statid == null) statid = -1;
                  $gameVariables.setValue(parseInt(args[1]),statid);
                  break;
              case "level":
              case "steamlevel":
                  if (args.length < 2) return; 
                  var level = $gameSystem.getSteamLevel();
                  if (level == null) level = -1;
                  $gameVariables.setValue(parseInt(args[1]),level);
                  break;
              case "numofplayers":
              case "playercount":
                  if (args.length < 2) return; 
                  $gameSystem.getNumberOfPlayers(function(count) {
                      $gameVariables.setValue(parseInt(args[1]),count);
                  },function(err){
                      if (Archeia.Steamworks.Param.debugMode) {
                          console.error("[ARCHEIA STEAMWORKS] An error occurred when attempting to get player count. Is Steamworks Initialized?")
                      }
                      $gameVariables.setValue(parseInt(args[1]),-1);
                  });
                  break;
              case "numofachievements":
              case "achievementcount":
                  if (args.length < 2) return; 
                  var achievementcount = $gameSystem.getNumberOfAchievements();
                  if (achievementcount == null) achievementcount = -1;
                  $gameVariables.setValue(parseInt(args[1]),achievementcount);
                  break;
              case "overlayenabled":
              case "gameoverlayenabled":
              case "steamoverlayenabled":
                  if (args.length < 2) return; 
                  var overlayenabled = $gameSystem.isGameOverlayEnabled();
                  if (overlayenabled == null) overlayenabled = -1;
                  if (overlayenabled == true) overlayenabled = 1;
                  if (overlayenabled == false) overlayenabled = 0;
                  $gameVariables.setValue(parseInt(args[1]),overlayenabled);
                  break;
              case "openoverlay":
              case "opensteamoverlay":
              case "opengameoverlay":
                  if (args.length < 2) return; 
                  $gameSystem.activateGameOverlay(args[1]);
                  break;
              case "openoverlaytourl":
              case "opengameoverlayurl":
              case "opensteamovertourl":
                  if (args.length < 2) return; 
                  args = args.splice(1,args.length - 1);
                  $gameSystem.activateGameOverlayToWebpage(args.join(''));
                  break;
              case "activateachievement":
              case "giveachivement":
              case "grantachievement":
                  if (args.length < 2) return; 
                  args = args.splice(1,args.length - 1);
                  $gameSystem.unlockAchievement(args.join(''),$gameSystem.onAchievementUnlocked,null);
                  break;
              case "deactivateachievement":
              case "clearachievement":
                  if (args.length < 2) return; 
                  args = args.splice(1,args.length - 1);
                  $gameSystem.clearAchievement(args.join(''),$gameSystem.onAchievementCleared,null);
                  break;
          }
      } else {
          Archeia.Steamworks.GameInterpreter_pluginCommand.call(this,command,args);
      }
    };
    if (!Archeia.Utils.sformat) {
        Archeia.Utils.sformat = function () {
            var theString = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                theString = theString.replace(regEx, arguments[i]);
            }
            return theString;
        };
    }
Imported["JsScript15Set"] = 1.00;
