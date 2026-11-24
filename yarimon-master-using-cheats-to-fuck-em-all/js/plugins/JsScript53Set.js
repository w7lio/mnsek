const BPs = new Pos2D(311 , 93);
const BSize = new Pos2D(816 , 624);
const MenuPicPath = "pictures/Menu/";   
let NC_SaveValue = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    NC_SaveValue.call(this);
};
const PN_UnderBlack = 40; 
const PN_Fuki = 280;  
const PN_HScene = 490;  
const PN_PicFlame = 400;  
const PN_FlameEffect = PN_PicFlame - 1;
const PN_PicFlameTop = PN_PicFlame + 1;
const PN_TalkBack = PN_HScene - 1; 
const PN_HTalkWin = PN_HScene + 1; 
const PN_Ensyutu = PN_HTalkWin + 2; 
const PN_Staff = PN_Ensyutu + 1; 
_LngImgArr.push("pictures/Title/PN_T2_Sel4");
