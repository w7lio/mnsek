/*:
 * @plugindesc 
 * @author Nupuryu
 * @help 
 */
/*:ja
 * @plugindesc 
 * @author Nupuryu
 *
 * @help 
 */
Game_Interpreter.prototype.PlayBgm = function (SetName, SetVol, SetPic, SetPn) {
    PlayBgm(SetName, SetVol, SetPic, SetPn);
}
let PlayBgm_Pos = 0; 
let PlayBgm = function (SetName, SetVol, SetPic, SetPn) {
    SetVol = typeof SetVol !== 'undefined' ? SetVol : 90;
    SetPic = typeof SetPic !== 'undefined' ? SetPic : 100;
    SetPn = typeof SetPn !== 'undefined' ? SetPn : 0;
    AudioManager.playBgm({ "name": SetName, "volume": SetVol, "pitch": SetPic, "pan": SetPn } , PlayBgm_Pos);
    PlayBgm_Pos = 0;
}
Game_Interpreter.prototype.PlayBgmVolumeCng = function (SetVol) {
    if (AudioManager._currentBgm == null) return;
    if (AudioManager._currentBgm.name != "") {
        this.PlayBgm(AudioManager._currentBgm.name , SetVol);
    }
}
Game_Interpreter.prototype.PlaySe = function (SetName, SetVol, SetPic, SetPn) {
    SetVol = typeof SetVol !== 'undefined' ? SetVol : 90;
    SetPic = typeof SetPic !== 'undefined' ? SetPic : 100;
    SetPn = typeof SetPn !== 'undefined' ? SetPn : 0;
    AudioManager.playSe({ "name": SetName, "volume": SetVol, "pitch": SetPic, "pan": SetPn });
}
Game_Interpreter.prototype.StopSeAll = function () {
    AudioManager._seBuffers.forEach(function(buffer) {
        buffer.stop();
    });
    AudioManager._seBuffers = []; 
}
let _AudioWaitUpdate = Game_Interpreter.prototype.NUpdate;
let _AudioWait_SeArr = [];
class _WaitSeData {
    constructor(_flame , _SetName , _SetVol, _SetPic, _SetPn){
        this.SetName = _flame;
        this.flame = _SetName;
        this.SetVol = _SetVol;
        this.SetPic = _SetPic;
        this.SetPn = _SetPn;
    }
}
Game_Interpreter.prototype.PlaySeWait = function (flame , SetName , SetVol, SetPic, SetPn) {
    SetVol = typeof SetVol !== 'undefined' ? SetVol : 90;
    SetPic = typeof SetPic !== 'undefined' ? SetPic : 100;
    SetPn = typeof SetPn !== 'undefined' ? SetPn : 0;
    _AudioWait_SeArr.push(
        new _WaitSeData(flame , SetName , SetVol, SetPic, SetPn)
    );
}
Game_Interpreter.prototype.NUpdate = function () {
    _AudioWaitUpdate.call(this);
    for (let i = 0; i <= _AudioWait_SeArr.length - 1; i++) {
        _AudioWait_SeArr[i].flame--;
        if(_AudioWait_SeArr[i].flame < 0) {
            let _playData = _AudioWait_SeArr[i];
            this.PlaySe(_playData.SetName , _playData.SetVol, _playData.SetPic, _playData.SetPn);
            _AudioWait_SeArr.splice(i , 1); i--;
        }
    }
}
Game_Interpreter.prototype.PlayBgs = function (SetName, SetVol, SetPic, SetPn) {
    SetVol = typeof SetVol !== 'undefined' ? SetVol : 90;
    SetPic = typeof SetPic !== 'undefined' ? SetPic : 100;
    SetPn = typeof SetPn !== 'undefined' ? SetPn : 0;
    AudioManager.playBgs({ "name": SetName, "volume": SetVol, "pitch": SetPic, "pan": SetPn });
}
let NVoice_isSkipFlg = function () {
    return !isFastOff && Input.isPressed('control');
}
let NVoice_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () { 
    NVoice_Game_System_initialize.call(this);
    this.Voice重複禁止 = false; 
};
let voiceOnFlg = false;
let voiceCname = "";
Game_Interpreter.prototype.PVoice = function (cname, vname) {
    if ($gameSwitches.value(VoiceMuteSwNo) || VoiceVol == 0) {
    } else {
        if (NVoice_isSkipFlg()) return;
        let vvol = VoiceVol; 
        let onevol = AudioManager.seVolume;
        AudioManager.seVolume = VoiceVol;
        voiceOnFlg = true;
        voiceCname = cname;
        AudioManager.playSe({ "name": vname, "volume": vvol, "pitch": 100, "pan": 0 });
        voicestflg = true;
        AudioManager.seVolume = onevol;
        if (AudioManager._allBgsBuffer != undefined) {
            if (AudioManager._allBgsBuffer.length >= 2) {
                if(AudioManager._allBgsBuffer[2] != undefined) {
                    if(AudioManager._allBgsBuffer[2]._autoPlay) {
                        voiceReplayBgs = AudioManager._allBgsBuffer[2]._url.replace(".ogg" , "").replace("audio/bgs/","");
                        voiceReplayBgs_url = AudioManager._allBgsBuffer[2]._url;
                        voiceReplayBgsTime = WebAudio._context.currentTime - AudioManager._allBgsBuffer[2]._startTime;
                        voiceReplayBgsVol = AudioManager._allBgsBuffer[2]._volume * 100;
                        this.VBgsStop(0.5 , false); 
                    }
                }
            }
        }
    }
}
AudioManager.createBuffer = function (folder, name) {
    let ext = this.audioFileExt();
    let _nameArr = name.split('/');
    let _folStr = "";
    for (let i = 0; i <= _nameArr.length - 2; i++) {
        _folStr += _nameArr[i] + '/';
    }
    let url = this._path + folder + '/' + _folStr + encodeURIComponent(_nameArr[_nameArr.length - 1]) + ext;
    if (this.shouldUseHtml5Audio() && folder === 'bgm') {
        if (this._blobUrl) Html5Audio.setup(this._blobUrl);
        else Html5Audio.setup(url);
        return Html5Audio;
    } else {
        return new WebAudio(url);
    }
};
let voiceName = 'XXXXXXXXXXXXXXXXXXXXXXX';
let voicestflg = false; 
let voiceBgsOffTime = 0;    
let voiceReplayBgs = "";
let voiceReplayBgs_url = "";
let voiceReplayBgsVol = 0;
let voiceReplayBgsTime = 0;
let VoiceBuffers = []; 
AudioManager.playSe = function (se) {
    if (se.name) {
        this._seBuffers = this._seBuffers.filter(function (audio) {
            return audio.isPlaying();
        });
        let sefilepass = 'se';
        if (voiceOnFlg){
            StopVoice(); 
            sefilepass = "voice/" + voiceCname;
            voiceOnFlg = false;
            voiceCname = "";
            voiceName = se.name;
            StopVoiceFlg = true;
        }
        let buffer = this.createBuffer(sefilepass, se.name);
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        if (StopVoiceFlg) {
            VoiceBuffers.push(buffer);
        } else {
            this._seBuffers.push(buffer);
        }
    }
};
let NAudio_startPlaying = WebAudio.prototype._startPlaying;
WebAudio.prototype._startPlaying = function(loop, offset) {
    NAudio_startPlaying.apply(this, arguments);
    if(voicestflg) {
        if(this._url.indexOf("audio/voice/") != -1) {
            voiceBgsOffTime = this._startTime + this._totalTime / this._pitch;
        }
    }
}
let VoiceStop = WebAudio.prototype.stop;
WebAudio.prototype.stop = function () {
    VoiceStop.call(this);
    if (voicestflg) { 
        this._autoPlay = true;        
    }
};
WebAudio.prototype.play = function (loop, offset) {
    if (this.isReady()) {
        offset = offset || 0;
        this._startPlaying(loop, offset);
    } else if (WebAudio._context) {
        this._autoPlay = true;
        this.addLoadListener(function () {
            if (this._autoPlay) {
                if(voiceReplayBgsTime != 0 && voiceReplayBgs_url == this._url) {
                    offset = voiceReplayBgsTime;
                    voiceReplayBgs = "";
                    voiceReplayBgs_url = "";
                    voiceReplayBgsTime = 0;
                    voiceReplayBgsVol = 0;
                }
                this.play(loop, offset);
                if(this._url)
                    if(this._url.indexOf("audio/voice/") != -1) {
                        voicestflg = false; 
                    }
            }
        }.bind(this));
    }
};
let StopVoiceFlg = false;
Game_Interpreter.prototype.StopVoice = function () {
    StopVoice();
}
Game_Interpreter.prototype.AllStopVoice = function () {
    AllStopVoice();
}
let AllStopVoice = function () {
    for (let i = 0; i <= VoiceBuffers.length - 1; i++) {
        let _CkBuffer = VoiceBuffers[i];
        if(_CkBuffer._url.match("audio/voice/")) {
            console.log(_CkBuffer._url);
            _CkBuffer.stop();
            VoiceBuffers.splice(i , 1);
            i--;
        }
    }
}
let CharaStopVoice = function (_charaName) {
    let encstr = encodeURI(_charaName);
    if(encstr == "") return;
    for (let i = 0; i <= VoiceBuffers.length - 1; i++) {
        let _CkBuffer = VoiceBuffers[i];
        if(_CkBuffer._url.match("audio/voice/" + encstr)) {
            console.log(_CkBuffer._url);
            _CkBuffer.stop();
            VoiceBuffers.splice(i , 1);
            i--;
        }
    }
}
Game_Interpreter.prototype.CharaStopVoice = function (_charaName) {
    CharaStopVoice(_charaName);
}
let StopVoice = function (){
    if($gameSystem.Voice重複禁止) {
        AllStopVoice();
        return; 
    }
    CharaStopVoice(voiceCname)
}
let Voice_NextTxtOff機能_Off = false;
let VUpdateStopFlg = false;
let GInputUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    if ($gameMessage._texts.length != 0 && StopVoiceFlg) {
        StopVoiceFlg = false;
        VUpdateStopFlg = true;
    }
    if ($gameMessage._texts.length == 0 && VUpdateStopFlg) {
        this.StopVoice();
        VUpdateStopFlg = false;
    }
    if (voiceBgsOffTime != 0 && !voicestflg) {
        if (voiceBgsOffTime < WebAudio._context.currentTime) {
            voiceBgsOffTime = 0;
            if (voiceReplayBgs != "") {
                this.VBgsPlay(voiceReplayBgs);
                voiceReplayBgs = "";
            }
        }
    }
    GInputUpdate.call(this); 
}
let FstCmnSaveFlg = false; 
let FstVolCkFlame = 1; 
let StartUpUpdate = Scene_Map.prototype.update;
let GameResetFlame = -1; 
Scene_Map.prototype.update = function () {
    if (FstVolCkFlame > 0) {
        FstVolCkFlame -= 1;
        if (FstVolCkFlame == 0) {
            VoiceVol = $gameVariables.value(VoiceVolVarNo);
            VolMuteFlg = $gameSwitches._data[VoiceMuteSwNo];
            if (VolMuteFlg == undefined) { 
                FirstVolumeSet(); 
                FstCmnSaveFlg = true;
            }
            AudioManager.masterVolume = Math.floor($gameVariables.value(MasterVolVarNo)) / 100;
        }
    }
    if (GameResetFlame >= 0) {
        GameResetFlame -= 1;
        if (GameResetFlame == 0) {
            location.reload();
        }
    }
    StartUpUpdate.call(this); 
}
let FirstVolumeSet = function () {
    $gameSwitches._data[VoiceMuteSwNo] = false;
    VolMuteFlg = false;
    $gameVariables.setValue(MasterVolVarNo, F_MasterVol);
    ConfigManager['bgmVolume'] = F_BGMVol;
    ConfigManager['meVolume'] = F_BGMVol;
    ConfigManager['seVolume'] = F_SEVol;
    ConfigManager['bgsVolume'] = F_SEVol;
    $gameVariables.setValue(VoiceVolVarNo, F_VoiceVol);
    VoiceVol = F_VoiceVol; 
    ConfigManager.save(); 
}
AudioManager.playBgs = function (bgs, pos) {
    if (bgs == undefined) return;
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.stopBgs();
        if (bgs.name) {
            this._bgsBuffer = this.createBuffer('bgs', bgs.name);
            if (vbgsflg) {
                this._bgsBuffer._volume = VoiceVol * 0.01;
            }
            this.updateBgsParameters(bgs);
            this._bgsBuffer.play(true, pos || 0);
        }
    }
    this.updateCurrentBgs(bgs, pos);
};
let vbgsflg = false;
let playingVoice = "";
Game_Interpreter.prototype.VBgsPlay = function (filename, bgsvolume , line) {
    if (VolMuteFlg) {
    } else {
        bgsvolume = typeof bgsvolume !== 'undefined' ? bgsvolume : -1;
        line = typeof line !== 'undefined' ? line : 2;
        if(voicestflg) { 
            voiceReplayBgs = filename;
            voiceReplayBgs_url = "audio/bgs/" + filename;
            if (bgsvolume != -1) {
                voiceReplayBgsVol = bgsvolume;
            } else {
                voiceReplayBgsVol = VoiceVol;
            }
            voiceReplayBgsTime = 0;
            return; 
        }
        if (playingVoice != filename) { 
            let args = new Array(String(line)); 
            vbgsflg = true;
            this.pluginCommand("PB_BGS_CHANGE_LINE", args);
            if (bgsvolume != -1) {
                AudioManager.playBgs({ "name": filename, "volume": bgsvolume, "pitch": 100, "pan": 0 })
            } else {
                AudioManager.playBgs({ "name": filename, "volume": VoiceVol, "pitch": 100, "pan": 0 })
            }
            playingVoice = filename;
            vbgsflg = false;
            args = new Array("1"); 
            this.pluginCommand("PB_BGS_CHANGE_LINE", args);
        }
    }
}
Game_Interpreter.prototype.VBgsStop = function (foutcount , _tarkResetFlg , line) {
    foutcount = typeof foutcount !== 'undefined' ? foutcount : 1;
    line = typeof line !== 'undefined' ? line : 2;
    _tarkResetFlg = typeof _tarkResetFlg !== 'undefined' ? _tarkResetFlg : true;
    if(_tarkResetFlg) {
        voiceReplayBgs = "";
        voiceReplayBgs_url = "";
        voiceReplayBgsTime = 0;
        voiceReplayBgsVol = 0;
    }
    playingVoice = "";
    let args = new Array(String(line)); 
    this.pluginCommand("PB_BGS_CHANGE_LINE", args);
    AudioManager._stopAllBgs = false;
    AudioManager.stopBgs();
    args = new Array("1"); 
    this.pluginCommand("PB_BGS_CHANGE_LINE", args);
}
class BGS_FA {
    constructor(_Line, _EvNo, _Dist, _MaxVol) {
        _MaxVol = typeof _MaxVol !== 'undefined' ? _MaxVol : 70;
        this._Line = _Line;     
        this._EvNo = _EvNo;     
        this._Dist = _Dist;     
        this._MaxVol = _MaxVol; 
    }
}
let BGS_FA_Arr = []; 
let Nupu_BGS_FA_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
    Nupu_BGS_FA_performTransfer.call(this);
    BGS_FA_Arr = []; 
    $gameMap._events.forEach(function (_event) {
        try {
            let _ckEv = _event.event();
            let _LNoStr = MetaChecker(_ckEv, "BGS_FA");
            if (_LNoStr != "") {
                let _BGSArr = _LNoStr.split(',');
                let _LineNo = Number(_BGSArr[0]); 
                let _DistNo = Number(_BGSArr[1]); 
                let _MaxVol = 70
                if (_BGSArr[2] != undefined) {
                    _MaxVol = Number(_BGSArr[2]); 
                }
                BGS_FA_Arr.push(new BGS_FA(_LineNo, _event._eventId, _DistNo, _MaxVol));
            }
        } catch (e) {
            console.log("Err:Nupu_BGS_FA_performTransfer");
        }
    })
}
class Ck_BGSVol {
    constructor(_Line, _Vol) {
        this._Line = _Line; 
        this._Vol = _Vol; 
    }
}
let NupuAudio_NUpdate = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    NupuAudio_NUpdate.call(this);
    if (FstCmnSaveFlg) {
        this.UTA_Save(); 
        FstCmnSaveFlg = false;
    }
    let _CkValArr = []; 
    for (let i = 0; i <= BGS_FA_Arr.length - 1; i++){
        let _ckEv = $gameMap._events[BGS_FA_Arr[i]._EvNo];
        if($gameMap._events[BGS_FA_Arr[i]._EvNo] == null) continue;
        let _SaX = Math.abs(PL_realX - _ckEv._realX);
        let _SaY = Math.abs(PL_realY - _ckEv._realY);
        let _SetVol = BGS_FA_Arr[i]._MaxVol * (1 - ((_SaX + _SaY) / BGS_FA_Arr[i]._Dist));
        if (_SetVol <= 0) _SetVol = 0;
        let _volCntFlg = false;
        for (let j = 0; j <= _CkValArr.length - 1; j++){
            if (_CkValArr[j]._Vol > _SetVol){
                _volCntFlg = true;
            }
        }
        if (_volCntFlg) continue;
        _CkValArr.push(new Ck_BGSVol(BGS_FA_Arr[i]._Line, _SetVol)); 
        let args = new Array(String(BGS_FA_Arr[i]._Line)); 
        this.pluginCommand("PB_BGS_CHANGE_LINE", args);
        let _NCkBGS = AudioManager._currentBgs; 
        if (_NCkBGS != undefined) {
            let _NBGSStr = AudioManager._currentBgs.name; 
            AudioManager.playBgs({ "name": _NBGSStr, "volume": _SetVol, "pitch": 100, "pan": 0 })
        }
    }
}
