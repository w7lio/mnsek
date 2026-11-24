/*:
 * @target MV MZ
 * @plugindesc 
 * @author Takeshi Sunagawa (http://newrpg.seesaa.net/)
 * @url http:
 *
 * @help 
 * @command ChangeSpeed
 * @desc Changes the character's speed.
 * 
 * @arg Target
 * @desc Specify the target to change the movement speed.
 * You can specify multiple targets.
 * @type combo
 * @default 0 #This Event
 * @option 0 #This Event
 * @option -1 #Player
 * @option 1,2,3 #Multiple
 * @option 1~3 #Range
 * @option this._eventId + 1 #EventID+1
 * 
 * @arg Speed
 * @desc This is the movement speed to be changed. 4 is the standard speed.
 * @type number
 * @decimals 3
 * @default 4
 * 
 * 
 * @param DefaultAlwaysDash
 * @desc Turn on the default value for Always On Dash in Options.
 * @type boolean
 * 
 * @param PlayerSpeed
 * @desc The movement speed of the player when walking. The initial value is 4.
 * @type number
 * @decimals 3
 * 
 * @param PlusSpeedDash
 * @desc The speed that the player adds when dashing. The default value is 1. If 0, disable dash.
 * @type number
 * @decimals 3
 * 
 * @param <BasicSpeedRate>
 * 
 * @param PlayerBasicSpeedRate
 * @desc Changes the player's base speed to 100 as standard.
 * This changes the overall speed.
 * @type number
 * @default 100
 * 
 * @param EventBasicSpeedRate
 * @desc Changes the basic speed of the events to 100 as standard.
 * This changes the overall speed.
 * @type number
 * @default 100
 * 
 * @param <Vehicles>
 * 
 * @param BoatSpeed
 * @desc The boat's movement speed. The initial value is 4.
 * @type number
 * @decimals 3
 * 
 * @param ShipSpeed
 * @desc The ship's movement speed. The initial value is 5.
 * @type number
 * @decimals 3
 * 
 * @param AirShipSpeed
 * @desc The airship's movement speed. The default value is 6.
 * @type number
 * @decimals 3
 */
/*:ja
 * @target MV MZ
 * @plugindesc 
 * @author 砂川赳（http:
 * @url http:
 *
 * @help 
 * @command ChangeSpeed
 * @text 速度の変更
 * @desc キャラクターの速度を変更します。
 * 
 * @arg Target
 * @text 対象
 * @desc 移動速度を変更する対象を指定します。
 * 複数指定も可能です。
 * @type combo
 * @default 0 #このイベント
 * @option 0 #このイベント
 * @option -1 #プレイヤー
 * @option 1,2,3 #複数指定
 * @option 1~3 #範囲指定
 * @option this._eventId + 1 #イベントID+1
 * 
 * @arg Speed
 * @text 移動速度
 * @desc 変更する移動速度です。4が標準速になります。
 * 小数も指定可能です。
 * @type number
 * @decimals 3
 * @default 4
 * 
 * 
 * @param DefaultAlwaysDash
 * @text 常時ダッシュの初期値
 * @desc オプション画面にある常時ダッシュの初期値をオンにします。
 * @type boolean
 * 
 * @param PlayerSpeed
 * @text プレイヤーの移動速度
 * @desc プレイヤーの歩行時の移動速度です。初期値は4です。
 * 小数も指定可能です。
 * @type number
 * @decimals 3
 * 
 * @param PlusSpeedDash
 * @text ダッシュ時の加算速度
 * @desc プレイヤーがダッシュ時に加算される速度です。初期値は1です。
 * 小数も指定可能です。0ならダッシュ無効化。
 * @type number
 * @decimals 3
 * 
 * @param <BasicSpeedRate>
 * @text ＜基本速度＞
 * 
 * @param PlayerBasicSpeedRate
 * @parent <BasicSpeedRate>
 * @text プレイヤーの基本速度％
 * @desc プレイヤーの基本速度を100を標準として変更します。
 * こちらは全体の速度を変更します。
 * @type number
 * @default 100
 * 
 * @param EventBasicSpeedRate
 * @parent <BasicSpeedRate>
 * @text イベントの基本速度％
 * @desc イベントの基本速度を100を標準として変更します。
 * こちらは全体の速度を変更します。
 * @type number
 * @default 100
 * 
 * @param <Vehicles>
 * @text ＜乗り物＞
 * 
 * @param BoatSpeed
 * @parent <Vehicles>
 * @text 小型船の移動速度
 * @desc 小型船の移動速度です。初期値は4です。
 * 小数も指定可能です。
 * @type number
 * @decimals 3
 * 
 * @param ShipSpeed
 * @parent <Vehicles>
 * @text 大型船の移動速度
 * @desc 大型船の移動速度です。初期値は5です。
 * 小数も指定可能です。
 * @type number
 * @decimals 3
 * 
 * @param AirShipSpeed
 * @parent <Vehicles>
 * @text 飛行船の移動速度
 * @desc 飛行船の移動速度です。初期値は6です。
 * 小数も指定可能です。
 * @type number
 * @decimals 3
 */
(function() {
"use strict";
function toBoolean(val, def) {
    if (val === "" || val === undefined) {
        return def;
    } else if (typeof val === "boolean") {
        return val;
    }
    return val.toLowerCase() == "true";
}
function toNumber(str, def) {
    if (str == undefined || str == "") {
        return def;
    }
    return isNaN(str) ? def : +(str || def);
}
function setDefault(str, def) {
    return str ? str : def;
}
const PLUGIN_NAME = "JsScript35Set";
const parameters = PluginManager.parameters(PLUGIN_NAME);
const pDefaultAlwaysDash = toBoolean(parameters["DefaultAlwaysDash"]);
const pPlayerSpeed = toNumber(parameters["PlayerSpeed"]);
const pPlusSpeedDash = toNumber(parameters["PlusSpeedDash"]);
const pPlayerBasicSpeedRate = toNumber(parameters["PlayerBasicSpeedRate"]);
const pEventBasicSpeedRate = toNumber(parameters["EventBasicSpeedRate"]);
const pBoatSpeed = toNumber(parameters["BoatSpeed"]);
const pShipSpeed = toNumber(parameters["ShipSpeed"]);
const pAirShipSpeed = toNumber(parameters["AirShipSpeed"]);
/**
 * ●プラグインコマンドの値を取得する。
 */
 function getCommandValue(value) {
    if (value === undefined) {
        return value;
    }
    return value.split("#")[0].trim();
}
/**
 * ●引数を元に対象の配列を取得する。
 * ※bindによってinterpreterをthisに渡して用いる。
 */
function makeTargets(targetId) {
    const targets = [];
    for (let id of targetId.split(",")) {
        id = id.trim();
        if (id.indexOf("~") >= 0) {
            const idRange = id.split("~");
            const idRangeStart = eval(idRange[0]);
            const idRangeEnd = eval(idRange[1]);
            if (idRangeEnd < idRangeStart) {
                for (let i = idRangeStart; i >= idRangeEnd; i--) {
                    const evalId = eval(i);
                    if (this.character(evalId)) {
                        targets.push(this.character(evalId));
                    }
                }
            } else {
                for (let i = idRangeStart; i <= idRangeEnd; i++) {
                    const evalId = eval(i);
                    if (this.character(evalId)) {
                        targets.push(this.character(evalId));
                    }
                }
            }
        } else {
            const evalId = eval(id);
            if (this.character(evalId)) {
                targets.push(this.character(evalId));
            }
        }
    }
    return targets;
}
if (!PluginManager.registerCommand) {
    PluginManager.registerCommand = function() {}
}
/**
 * ●移動速度の変更
 */
PluginManager.registerCommand(PLUGIN_NAME, "ChangeSpeed", function(args) {
    const targetId = setDefault(getCommandValue(args.Target), "0");
    const speed = toNumber(getCommandValue(args.Speed), 4);
    const targets = makeTargets.bind(this)(targetId);
    if (targets.length == 0) {
        return;
    }
    for (const target of targets) {
        target.setMoveSpeed(speed);
    }
});
let plTarget;
/**
 * ●ＭＶ用の旧式プラグインコマンド
 */
const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    const lowerCommand = command.toLowerCase();
    if (lowerCommand === "nrp.changecharacterspeed.speed") {
        const speed = toNumber(args[0], 4);
        const targetId = setDefault(plTarget, "0");
        plTarget = undefined;
        const targets = makeTargets.bind(this)(targetId);
        if (targets.length == 0) {
            return;
        }
        for (const target of targets) {
            target.setMoveSpeed(speed);
        }
    } else if (lowerCommand === "nrp.changecharacterspeed.target") {
        plTarget = getCommandValue(String(args.join(" ")));
    }
};
/**
 * ●ページ設定開始
 */
const _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function() {
    _Game_Event_setupPageSettings.apply(this, arguments);
    const speed = this.event().meta.MoveSpeed;
    if (speed) {
        this.setMoveSpeed(toNumber(speed));
    }
};
/**
 * ●乗り物の速度初期化
 */
const _Game_Vehicle_initMoveSpeed = Game_Vehicle.prototype.initMoveSpeed;
Game_Vehicle.prototype.initMoveSpeed = function() {
    if (this.isBoat() && pBoatSpeed) {
        this.setMoveSpeed(pBoatSpeed);
        return;
    } else if (this.isShip() && pShipSpeed) {
        this.setMoveSpeed(pShipSpeed);
        return;
    } else if (this.isAirship() && pAirShipSpeed) {
        this.setMoveSpeed(pAirShipSpeed);
        return;
    }
    _Game_Vehicle_initMoveSpeed.apply(this, arguments);
};
/**
 * ●プレイヤーの速度が設定されている場合
 */
if (pPlayerSpeed) {
    /**
     * ●プレイヤーの速度初期値を設定
     */
    const _Game_Player_initMembers = Game_Player.prototype.initMembers;
    Game_Player.prototype.initMembers = function() {
        _Game_Player_initMembers.apply(this, arguments);
        this._moveSpeed = pPlayerSpeed;
    };
    /**
     * ●乗り物を降りる
     */
    const _Game_Player_getOffVehicle = Game_Player.prototype.getOffVehicle;
    Game_Player.prototype.getOffVehicle = function() {
        const ret = _Game_Player_getOffVehicle.apply(this, arguments);
        if (ret) {
            this.setMoveSpeed(pPlayerSpeed);
        }
        return ret;
    };
}
/**
 * ●ダッシュ時の加算速度が設定されている場合
 */
if (pPlusSpeedDash !== undefined) {
    /**
     * ●ダッシュを考慮した実移動速度の取得
     */
    Game_CharacterBase.prototype.realMoveSpeed = function() {
        return this._moveSpeed + (this.isDashing() ? pPlusSpeedDash : 0);
    };
}
if (pPlayerBasicSpeedRate && pPlayerBasicSpeedRate != 100) {
    Game_Player.prototype.distancePerFrame = function() {
        const ret = Game_CharacterBase.prototype.distancePerFrame.apply(this, arguments);
        return ret * pPlayerBasicSpeedRate / 100;
    };
    Game_Follower.prototype.distancePerFrame = function() {
        const ret = Game_CharacterBase.prototype.distancePerFrame.apply(this, arguments);
        return ret * pPlayerBasicSpeedRate / 100;
    };
}
if (pEventBasicSpeedRate && pEventBasicSpeedRate != 100) {
    Game_Event.prototype.distancePerFrame = function() {
        const ret = Game_CharacterBase.prototype.distancePerFrame.apply(this, arguments);
        return ret * pEventBasicSpeedRate / 100;
    };
}
/**
 * ●常時ダッシュの初期値
 */
if (pDefaultAlwaysDash) {
    ConfigManager.alwaysDash = true;
    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        this.alwaysDash = this.readFlag(config, "alwaysDash", true);
    };
    if (Utils.RPGMAKER_NAME == "MV") {
        ConfigManager.readFlag = function(config, name, defaultValue) {
            if (name in config) {
                return !!config[name];
            } else {
                return defaultValue;
            }
        };
    }
}
})();
