let battle_Class = new Battle_Class(); 
let lookYarimonIdArr = [];  
let getYarimonId = -1;      
let useFlg_チートタックル = false;
let _経験P = 0;   
let _賞金 = 0;    
let btlTrainerId = -1;
let btlWinTrainerId = -1;
let btlItemSyohiArr = []; 
let btlNewWazaSave = [false , false , false];
const PassiveName = {
    _潤いバリア: '潤いバリア',
    _大地に張る根: '大地に張る根',
    _転生の炎: '転生の炎',
    _慧眼: '慧眼',
    _やわらかボディ: 'やわらかボディ',
    _華麗な動き: '華麗な動き',
    _幽体: '幽体',
    _燃え移り: "燃え移り" ,
    _アイスオーラ: "アイスオーラ" ,
    _大地の守り: "大地の守り" ,
    _帯電体質: "帯電体質" ,
    _悪魔の秘術: "悪魔の秘術" ,
    _ナチュルパウダー: "ナチュルパウダー" ,
    _ブラックホール: 'ブラックホール',
    _内燃機関: '内燃機関',
    _祟り目: '祟り目',
    _一発芸: "一発芸",
    _テラーフェイス: "テラーフェイス",
    _汁飛ばし: "汁飛ばし",
    _丈夫な甲殻: '丈夫な甲殻',
    _金属装甲: '金属装甲',
    _神通力: '神通力',
    _プリズムウォール: 'プリズムウォール',
    _ゴリ押し: 'ゴリ押し',
    _悪知恵: '悪知恵',
    _パルスレーダー: 'パルスレーダー',
    _つぎはぎ: 'つぎはぎ',
    _するどい刃: 'するどい刃',
    _エレメント: 'エレメント',
    _きまぐれな風: "きまぐれな風",
    _太陽放射: "太陽放射",
    _惑いの光: '惑いの光',
    _鋼の魂: '鋼の魂',
    _ラスボス特性: 'ラスボス特性',
    _兜締め:"兜締め" ,
    _むしばみ:"むしばみ" ,
    _グライダー:"グライダー" ,
    _ガイアアーマー:"ガイアアーマー" ,
    _アクアクローク:"アクアクローク" ,
    _ネクロフォース:"ネクロフォース" ,
    _こいこい:"こいこい" ,
    _電動ドライブ:"電動ドライブ" ,
    _ダークオーラ:"ダークオーラ" ,
    _腕利き:"腕利き" ,
    _耐熱装甲:"耐熱装甲" ,
    _再生する身体:"再生する身体" ,
    _栄養搾取:"栄養搾取" ,
    _ラブリーボディ:"ラブリーボディ" ,
    _七色ボディ:"七色ボディ" ,
};
let BtlSetup変数Reset = function () {
    _経験P = 0;
    _賞金 = 0;
    btlWinTrainerId = -1;
    btlItemSyohiArr = [];
    lookYarimonIdArr = [];
    useFlg_チートタックル = false;
    getYarimonId = -1;
    picFlameEnemyCharaArr = [];
}
const BattleMapID = 31; 
const WazaID = {
    _チートタックル : 120 ,
    _未来への翼 : 190 ,
    _天からの救済 : 196 ,
    _薙ぎ払い業 : 198 ,
    _終わりの翼  : 199 ,
    _キズナタックル : 211 ,
    _チートタックルEx1 : 204 , 
    _チートタックルEx2 : 205 , 
    _鋼の魂 : 990 ,
}
const SW_Tr演出OFF = 7;
const SW_TrStarTrn = 282; 
const SW_本気Starツアー = 525; 
const VN_TrId手動設定 = 9;
const VN_Tr逃げるTxt = 12;
const Btl_PicPath = "pictures/Battle/";
const Btl_PicBtlBack = "battlebacks1/";
const Btl_EmTatie = "pictures/H_Scene/_DataBase/Battle/BattleTatie/";
const Btl_Yarimon = "pictures/H_Scene/_DataBase/Zukan/Monster/";
const PN_BtlBackGnd = 50;
const PN_BtlStBarLast = 52;
const PN_LastBtlEmHpWin = PN_BtlStBarLast + 2;
const PN_BtlEmTatie = 70;
const PN_BtlPlTatie = PN_BtlEmTatie + 1;
const PN_EmYarimon = PN_BtlPlTatie + 1;
const PN_PlYarimon = PN_EmYarimon + 1;
const PN_EmYarimon_Ex = PN_PlYarimon + 1;
const PN_ExPicEffect = PN_EmYarimon_Ex + 1;
const PN_BtlPtc = 80;
const PN_BtlStBar_R = 110;
const PN_BtlStBar_L = PN_BtlStBar_R + 2;
const PN_BtlStBase = PN_BtlStBar_L + 2;
const PN_BtlStTxt_R = PN_BtlStBase + 1;
const PN_BtlStTxt_L = PN_BtlStTxt_R + 3;
const PN_PLIjoIcon = 123;
const PN_EmIjoIcon = PN_PLIjoIcon + 8;
const PN_BtlTrnLine_R = 140;
const PN_EmGetIcon = PN_BtlTrnLine_R - 1; 
const PN_BtlTrnBall_R = PN_BtlTrnLine_R + 1;
const PN_BtlTrnLine_L = PN_BtlTrnBall_R + 3;
const PN_BtlTrnBall_L = PN_BtlTrnLine_L + 1
const PN_TemotiBoll_R = 150;
const PN_TemotiBoll_L = PN_TemotiBoll_R + 3;
const PN_BtlSkillWin = PN_TemotiBoll_L + 2;
const PN_BtlEmSkillWin = PN_BtlSkillWin + 2;
const PN_BtlBustBack = 239;
const PN_BtlBustUpBack = PN_BtlBustBack + 1;
const PN_BtlBustUpPtc = PN_BtlBustUpBack + 1;
const PN_BtlBustBackEff = PN_BtlBustUpPtc + 1;
const PN_BtlBustUp = PN_BtlBustBackEff + 1;
const PN_BtlEnsyutu = 253;
let PN_BtlTalkWin = PN_BtlEnsyutu + 1;
let PN_BtlTalkText = PN_BtlTalkWin + 1;
let PN_BtlTalkClick = PN_BtlTalkText + 2;
let PN_BtlTalkWin_m = 353;
let PN_BtlTalkText_m = PN_BtlTalkWin_m + 1;
let PN_BtlTalkClick_m = PN_BtlTalkText_m + 2;
const PN_BtlSelectBase = 269;
const PN_BtlSelectTxt = PN_BtlSelectBase + 1;
const PN_BtlSelectBtn = PN_BtlSelectTxt + 1;
Game_Interpreter.prototype.BtlL1PicDel = function () {
    this.DelSpriteSpan(PN_BtlSelectBase , PN_BtlLayer2Base);
}
const PN_BtlLayer2Base = PN_BtlSelectBtn + 5;
const PN_BtlTtkBase = PN_BtlLayer2Base + 1;
const BtlBtnPicCnt = 4; 
const PN_BtlTtkBtn = PN_BtlTtkBase + 1;
const PN_BtlTtkTxt = PN_BtlTtkBtn + 1;
const PN_BtlTtkIcon = PN_BtlTtkTxt + 1;
const PN_BtlTtkIconTxt = PN_BtlTtkIcon + 1;
const PN_BtlTtkSelBtn = 296;
const PN_BtlTtkWazaType = PN_BtlTtkSelBtn + BtlBtnPicCnt + 1;
const PN_BtlTtkWazaTxt = PN_BtlTtkWazaType + 1;
const PN_BtlCngBase = PN_BtlLayer2Base + 1;
const BtlCngPicCnt = 7; 
const PN_BtlCngTikeBar = PN_BtlCngBase + 1;
const PN_BtlCngTikeWin = PN_BtlCngTikeBar + 2;
const PN_BtlCngYarimon = PN_BtlCngTikeWin + 1;
const PN_BtlCngTxt = PN_BtlCngYarimon + 1;
const PN_BtlCngStType = PN_BtlCngTxt + (1 * BtlCngPicCnt) + 4;
const PN_BtlCngStMonster = PN_BtlCngStType + 1;
const PN_BtlCngStBar = PN_BtlCngStMonster + 1;
const PN_BtlCngStBarWin = PN_BtlCngStBar + 2;
const PN_BtlCngStTxt  = PN_BtlCngStBarWin + 1;
const PN_BtlCngStWaza  = PN_BtlCngStTxt + 3;
const PN_BtlCngStWaTxt  = PN_BtlCngStWaza + 4;
const PN_BtlKoseiWin  = 310;
Game_Interpreter.prototype.BtlL2PicDel = function () {
    this.DelSpriteSpan(PN_BtlLayer2Base , PN_BtlLayer3Base);
}
const PN_BtlLayer3Base = 345;
const PN_BtlSelecter = 350;
const PN_BtlEn = 360;
