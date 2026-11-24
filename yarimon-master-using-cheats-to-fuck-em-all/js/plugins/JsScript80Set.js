class MusicPlayerData {
    constructor(_fileName , _desc){
        this.fileName = _fileName;
        this.desc = _desc;
    }
}
let MusicPlayerSetDatas = [
    new MusicPlayerData("Title","タイトル") ,
    new MusicPlayerData("kari_Futta","フッ太のテーマ") ,
    new MusicPlayerData("kari_Rival","ヒカリのテーマ") ,
    new MusicPlayerData("kari_Rival2","レオのテーマ") ,
    new MusicPlayerData("Battle1","野生戦闘") ,
    new MusicPlayerData("Battle2","戦闘トレーナー") ,
    new MusicPlayerData("Battle3","戦闘ジム師範！") ,
    new MusicPlayerData("Battle4","戦闘原生モンスター") ,
    new MusicPlayerData("Battle_StarTR","戦闘スタートレーナー") ,
    new MusicPlayerData("Battle_StarTR_Wa","戦闘ｽﾀｰﾄﾚｰﾅｰ(和)") ,
    new MusicPlayerData("Rival Battle","戦闘ライバル！") ,
    new MusicPlayerData("Battle_TR_Ex","戦闘覚醒ヒカリ") ,
    new MusicPlayerData("Tension Battle Ex","最終決戦！") ,
    new MusicPlayerData("Title Battle Arrange","戦闘チャンピオン！") ,
    new MusicPlayerData("Fanfare1","ファンファーレ") ,
    new MusicPlayerData("Fanfare2","大ファンファーレ") ,
    new MusicPlayerData("Cave","怪しい洞窟") ,
    new MusicPlayerData("First Town","ハジメムラ") ,
    new MusicPlayerData("Field1","ハジメロード") ,
    new MusicPlayerData("kari_YarimonCenter","ビッグシティ") ,
    new MusicPlayerData("Field2","フィールド") ,
    new MusicPlayerData("kari_BigCity","セントラルタワー") ,
    new MusicPlayerData("City","ハーバータウン") ,
    new MusicPlayerData("JS Town","和の里") ,
    new MusicPlayerData("kari_SecretCave","SecretArea") ,
    new MusicPlayerData("kari_Huon","旧道の廃墟") ,
    new MusicPlayerData("kari_Gym","ジム") ,
    new MusicPlayerData("kari_Dream","夢") ,
    new MusicPlayerData("kari_Central","T-03") ,
    new MusicPlayerData("kari_Champion","チャンピオン登場") ,
    new MusicPlayerData("kari_Panic","パニック") ,
    new MusicPlayerData("kari_Sad","悲しい") ,
    new MusicPlayerData("Last_Battle","白の神") ,
    new MusicPlayerData("Last_Battle_Ex","Exバトル") ,
    new MusicPlayerData("Last_Farewell","別れ") ,
];
let MusicPlayerSetDatasEx = [
    new MusicPlayerData("EndLabo","エンドラボラトリ") ,
    new MusicPlayerData("ResortArea","リゾート島") ,
    new MusicPlayerData("Dlc2Area","リゾートエリア") ,
    new MusicPlayerData("BattleDlc2Yarimon","戦闘Exモンスター") ,
    new MusicPlayerData("BattleEndLabo","戦闘エンドラボ！") ,
    new MusicPlayerData("BossEndLabo","戦闘ｽﾀｰﾄﾚｰﾅｰ(ﾗﾎﾞ)") ,
    new MusicPlayerData("Battle_Tama","戦闘ラボタマちゃん")
];
const MscPlayerPicPath = "pictures/MscPlayer/";
const MscPlayerImgPicPath = MscPlayerPicPath + "Img/";
const PN_MscBack = 120;
const PN_MscSelecter = PN_MscBack + 1;
const PN_MscTxt = PN_MscSelecter + 1;
const PN_MscUp = PN_MscTxt + 8;
const PN_MscDown = PN_MscUp + 1;
const PN_MscSelectImg = PN_MscDown + 1;
const PN_MscSelectTxt = PN_MscSelectImg + 1;
const PN_MscPlayImg = PN_MscSelectTxt + 1;
const PN_MscPlayTxt = PN_MscPlayImg + 1;
let MscOverPicArr = [];
for (let i = 0; i < 8; i++) MscOverPicArr.push(PN_MscTxt + i);
let mscSelectNo = 0;
let mscZureNo = 0;
let mscPlayingNo = -1;
const SW_MusicPlayerEx = 577;
let MusicPlayerDatas = [];
Game_Interpreter.prototype.MusicPlayer_Start = function () {
    mscPlayingNo = -1;
    this.SetSpriteFIn( PN_MscBack , MscPlayerPicPath + "PN_MscBack", 0 , 0 , 0 , 0 , 15);
    MusicPlayerDatas = MusicPlayerSetDatas.slice();
    if ($gameSwitches.value(SW_MusicPlayerEx)) {
        for (let i = 0; i < MusicPlayerSetDatasEx.length; i++) {
            MusicPlayerDatas.push(MusicPlayerSetDatasEx[i]);
        }
    }
    this.MusicPlayer_ReDraw();
};
Game_Interpreter.prototype.MusicPlayer_ReDraw = function () {
    let txtSpan = 37;
    for (let i = 0; i < 8; i++) {
        var setNo = mscZureNo + i;
        var setStr = NLngStrGet(MusicPlayerDatas[setNo].desc);
        if (i ==  mscSelectNo) {
            this.SpriteStrC( PN_MscSelectTxt , setStr , 23 , 869 , 170);
            this.SetSprite(PN_MscSelectImg , MscPlayerImgPicPath + MusicPlayerDatas[setNo].fileName , 757 , 246);
            setStr = SCol.Yel0 + setStr;
        }
        while (setStr.length <= 7) setStr += "　";
        this.SpriteStr( PN_MscTxt + i , setStr , 23 , 381 , 263 + i * txtSpan);
    }
    this.SetSprite(PN_MscSelecter , MscPlayerPicPath + "PN_MscSelecter" , 381 - 32 , 269 + mscSelectNo * txtSpan);
    if (mscZureNo == 0)
        this.SetSpriteC(PN_MscUp , MscPlayerPicPath + "PN_MscUp" , 470 , 234);
    if (mscZureNo + 7 <= MusicPlayerDatas.length)
        this.SetSpriteC(PN_MscDown , MscPlayerPicPath + "PN_MscDown" , 470 , 592);
    if (mscPlayingNo != -1) {
        var playImg = MusicPlayerDatas[mscPlayingNo].fileName;
        this.SetSprite(PN_MscPlayImg , MscPlayerImgPicPath + playImg , 649 , 631 , 255 , 28 , 28);
        this.SpriteStrC(PN_MscPlayTxt , NLngStrGet(MusicPlayerDatas[mscPlayingNo].desc) , 23 , 869 , 666);
    } else {
        this.SpriteStrC(PN_MscPlayTxt , "No Playing" , 23 , 869 , 666);
    }
}
Game_Interpreter.prototype.MusicPlayer_Update = function () {
    menuOffFlame = 5;
    var updateFlg = false;
    var okFlg = false;
    var keyUpFlg = false;
    var keyDownFlg = false;
    if (TouchInput.wheelY < 0) {
        if (mscZureNo > 0) {
            mscZureNo--;
            updateFlg = true;
        }
    }
    if (TouchInput.wheelY > 0) {
        if (mscZureNo < MusicPlayerDatas.length - 7 - 1) {
            mscZureNo++;
            updateFlg = true;
        }
    }
    let ckNo = overPointerSpCkArr(MscOverPicArr);
    if (ckNo != -1) {
        if (mscSelectNo != ckNo - PN_MscTxt) {
            mscSelectNo = ckNo - PN_MscTxt;
            updateFlg = true;
        }
        if (TouchInput.isTriggered()) okFlg = true;
    }
    if (Input.isTriggered('up') || keyUpFlg) {
        if (mscSelectNo > 0) {
            mscSelectNo--;
            updateFlg = true;
        } else {
            if (mscZureNo > 0) {
                mscZureNo--;
                updateFlg = true;
            }
        }
    }
    if (Input.isTriggered('down') || keyDownFlg) {
        if (mscSelectNo < 7) {
            mscSelectNo++;
            updateFlg = true;
        } else {
            if (mscZureNo < MusicPlayerDatas.length - 7 - 1) {
                mscZureNo++;
                updateFlg = true;
            }
        }
    }
    if (Input.isTriggered('ok')) okFlg = true;
    if (okFlg) {
        mscPlayingNo = mscZureNo + mscSelectNo;
        var playFileName = MusicPlayerDatas[mscPlayingNo].fileName;
        this.PlayBgm(playFileName);
        updateFlg = true;
    }
    if (updateFlg) this.MusicPlayer_ReDraw();
    if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
        return false;
    }
    return true; 
};
Game_Interpreter.prototype.MusicPlayer_End = function () {
    this.DelSpriteSpan(PN_MscBack , PN_MscPlayTxt);
};
