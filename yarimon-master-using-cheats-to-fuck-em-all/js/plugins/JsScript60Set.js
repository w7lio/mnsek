let GetYarimonNo = function (_No , _lv , _starRank ) {
    _lv = typeof _lv !== 'undefined' ? _lv : 5;
    _starRank = typeof _starRank !== 'undefined' ? _starRank : 0;
    return new YarimonData($N_Yarimon_DB.mZukanDatas[_No - 1].id , _lv , _starRank);
}
const StarRankBtlValue = 10;
let YarimonNoFlg = false;
class YarimonData {
    constructor(id , lv , _starRank){
        lv = typeof lv !== 'undefined' ? lv : 5;
        _starRank = typeof _starRank !== 'undefined' ? _starRank : 0;
        this.id = id;
        this.lv = lv;
        this.btlCount = _starRank * StarRankBtlValue; 
        this.ExPowerFlg = false;
        this.YarimonData = GetYarimonData_ID(this.id);
        if(YarimonNoFlg) {
            this.YarimonData = GetYarimonData_No(this.id);
            this.id = this.YarimonData.id;
        }
        this.hp = MHP(this); 
        this.Ijos = [];
        this.exp = 0; 
        this.btlWazas = [];
        for (let i = this.YarimonData.wazaList.length - 1; i >= 0 ; i--) {
            if(this.YarimonData.wazaList[i].lv <= this.lv) {
                $N_Yarimon_DB.wazaDatas.forEach( _wazaData => {
                    if(_wazaData.id == this.YarimonData.wazaList[i].id) {
                        this.btlWazas.push(new WazaData(_wazaData.id , _wazaData.kaisu));
                    }
                });
            }
            if(this.btlWazas.length == 4) break; 
        }
        YarimonNoFlg = false;
    }
    get starRank() {
        let rtnCnt = Math.floor(this.btlCount / StarRankBtlValue);
        if (rtnCnt > 10) rtnCnt = 10; 
        return rtnCnt;
    }
    get data() {
        return this.YarimonData;
    }
}
let GetWazaData = function (id){
    let rtnData = null;
    $N_Yarimon_DB.wazaDatas.forEach( _wazaData => {
        if(_wazaData.id == id) {
            rtnData = _wazaData;
        }
    });
    return rtnData;
}
let MHP = function (yarimonData) {
    let btlYarimonData = new BtlYarimonData(yarimonData);
    return btlYarimonData.MHP;
}
let Atk = function (yarimonData) {
    let btlYarimonData = new BtlYarimonData(yarimonData);
    return btlYarimonData.Atk;
}
let Def = function (yarimonData) {
    let btlYarimonData = new BtlYarimonData(yarimonData);
    return btlYarimonData.Def;
}
let Agi = function (yarimonData) {
    let btlYarimonData = new BtlYarimonData(yarimonData);
    return btlYarimonData.Agi;
}
class WazaData {
    constructor(id , pp){
        pp = typeof pp !== 'undefined' ? pp : 0;
        this.id = id;
        this.pp = pp;
    }
    get data(){
        $N_Yarimon_DB.wazaDatas.forEach(wazaData => {
            if(wazaData.id == this.id) {
                return wazaData;
            }
        });
        return null;
    }
}
