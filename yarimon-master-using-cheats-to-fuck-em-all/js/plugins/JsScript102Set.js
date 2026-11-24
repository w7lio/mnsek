/*:
 * @plugindesc 
 * @author riru
 *
 *
 * @param Auto Ruby
 * @desc 自動ルビ振りをする（する：true　しない：false）
 * @default true
 *
 * @param Help Auto Ruby
 * @desc スキルの説明やヘルプメッセージ等（ヘルプで一部制御文字が使えるところ）も自動ルビ振りをする（する：true　しない：false）
 * @default true
 *
 * @param Database Auto Ruby
 * @desc アクターやアイテム名などウィンドウ内の他すべての場所も自動ルビ振りをする（する：true　しない：false）
 * @default true
 *
 * @param Jisage
 * @desc 字下げを行う（1行目は字下げをしないとルビが切れます。）（する：0　しない：1　ルビがあるときだけ字下げ：2）
 * @default 0
 *
 * @param Ruby Size
 * @desc ルビのサイズ補正。字下げONの場合このサイズに合わせて字下げ、行詰みの度合いが変わります。あまり大きすぎると上の文字に被ります
 * @default -1
 *
 * @help 
 */
(function() {
    var parameters = PluginManager.parameters('JsScript102Set');
    var p_auto_Ruby = Boolean(parameters['Auto Ruby']       === 'true' || false);
    var p_help_auto_Ruby = Boolean(parameters['Help Auto Ruby']       === 'true' || false);
    var p_data_auto_Ruby = Boolean(parameters['Database Auto Ruby']       === 'true' || false);
    var p_Jisage = Number(parameters['Jisage'] || 0);
    var ruby_c_size = Number(parameters['Ruby Size'] || -1);
Game_Message.prototype.rubyDictionary = function() {
var ruby_dic = [];
    return ruby_dic;
};
riru_Ruby_Message_processstartMessage =
Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function() {
    riru_Ruby_Message_processstartMessage.call(this);
    if(p_auto_Ruby)this._textState.text = this.convertEscapeCharacters($gameMessage.createRubytext($gameMessage.allText()));
    if(p_Jisage==0||(p_Jisage==2&&$gameMessage.ruby_e_hantei(this._textState.text)))this._textState.y += 6+ruby_c_size;
};
Game_Message.prototype.ruby_e_hantei = function(text) {
   var text_re = new RegExp("\x1br\\[(.*?),.*?\\]","img");
return text_re.test(text);
};
Game_Message.prototype.createRubytext = function(alltext) {
var ruby_dic = $gameMessage.rubyDictionary();
     var kana = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわをんらりるれろぁぃぅぇぉっゃゅょゎゔがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽアイウエオガギグゲゴカキクケコザジズゼゾサシスセソダヂヅデドタチツテトバビブベボナニヌネノパピプペポハヒフヘホァィゥェォマミムメモッャュョヮヤユヨワンラリルレロヴヲ"; 
     for (var i = 0; i < ruby_dic.length; i++) {
       var text = ruby_dic[i][0];
       var text_re = new RegExp("(\\s|^|\\]|\\\\)"+"([^\\[]*?)"+text+"([^,]*?)"+"(\\s|\\\\|$)","mg");
       if (text_re.test(alltext)) {
         var kana_re = new RegExp("["+kana+"]","mg");
         var kana_ar = text.match(kana_re);
         var okurigana = "";
         if (text.match(kana_re)) {
           for (var j = 0; j < kana_ar.length; j++) {
             okurigana += kana_ar[j][0];
           }
         }    
         var after_text = text.replace(kana_re, "");
         alltext = alltext.replace(text_re, "$1$2\\R["+after_text+","+ruby_dic[i][1]+"]"+okurigana+"$3$4" );
         var text_match = alltext.match(text_re);
         var text_text_re = new RegExp(text,"mg");
         var text_rep_count = 0;
         if (text_match){
           for (var k = 0; k < text_match.length; k++) {
             if(text_match[k].match(text_text_re)){
               var text_match_match = text_match[k].match(text_text_re);
               for (var l = 0; l < text_match_match.length; l++) {
                 text_rep_count++;
               }  
             }
           }  
         }  
         for (var m = 0; m < text_rep_count; m++) {
         alltext = alltext.replace(text_re, "$1$2\\R["+after_text+","+ruby_dic[i][1]+"]"+okurigana+"$3$4" );
         }         
       }  
     } 
   return alltext;  
};
Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
    if (text&&typeof text == "string") {
        var textState = { index: 0, x: x, y: y, left: x };
        if(p_data_auto_Ruby){
          textState.text = this.convertEscapeCharacters($gameMessage.createRubytext(text));
        }else{
           textState.text = this.convertEscapeCharacters(text);
        }    
        textState.height = this.calcTextHeight(textState, false);
        var text_length_text = textState.text;
         var text_length_re = new RegExp("\x1br\\[(.*?),.*?\\]","img");
         text_length_text = text_length_text.replace(text_length_re, "$1" );
        if (this.textWidth(text_length_text)<maxWidth){
          if (align === 'center') {
              textState.x += (maxWidth - this.textWidth(text_length_text)) / 2;
          }else if (align === 'right') {
              textState.x += maxWidth - this.textWidth(text_length_text);
          }
        } 
    if(p_Jisage==0||(p_Jisage==2&&$gameMessage.ruby_e_hantei(textState.text)))textState.y += 6+ruby_c_size;
          hankaku = new RegExp("[ -~｡-ﾟ]","img");
        var hankaku_text = text_length_text.match(hankaku);
        if (hankaku_text == null) hankaku_text = [];
        if (hankaku_text.length == 0){
    var hankaku_width =  Math.min(maxWidth/text_length_text.length,this.textWidth(text_length_text)/text_length_text.length);
    hankaku_width /= 2;
        }else{  
          var hankaku_width = (this.textWidth(text_length_text)-(text_length_text.length-hankaku_text.length)*
              this.contents.fontSize)/text_length_text.length;
        }
     hankaku_textwidth = Math.min(maxWidth/(hankaku_text.length+((text_length_text.length-hankaku_text.length)*2)),
         this.contents.fontSize/2);
     zenkaku_textwidth =  Math.min(maxWidth/((hankaku_text.length+((text_length_text.length-hankaku_text.length)*2))/2),
         this.contents.fontSize);
        while (textState.index < textState.text.length) {
          switch (textState.text[textState.index]) {
          case '\x1b':
           if (this.obtainEscapeCode(textState)=='R') {
             this.makerubydraw(textState);
            }
            break;
          default:
            this.processNormalCharacterruby(textState);
            break;
          }
        }
    }else{  
      if(p_Jisage==0)y += 6+ruby_c_size;
      this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
    }    
};
Window_Base.prototype.processNormalCharacterruby = function(textState) {
    var c = textState.text[textState.index++];
    if (c.match(hankaku)) {
      var w = hankaku_textwidth;
    }else{
      var w = zenkaku_textwidth;
    } 
    this.contents.drawText(c, textState.x, textState.y, w, textState.height);
    textState.x += w;
};
Window_Base.prototype.makerubydraw = function(textState) {
 var ruby = this.obtainEscapeParampex(textState).split(",");
    var ow = this.textWidth(ruby[0]);
    var w = 0;
    if (hankaku.test(ruby[0])){
     for (var i = 0; i < ruby[0].match(hankaku).length; i++) {
       w += hankaku_textwidth;
     } 
     w += (ruby[0].length-ruby[0].match(hankaku).length)*zenkaku_textwidth;
    }else{
    var w = zenkaku_textwidth*ruby[0].length;
    }
         this.contents.fontSize /= 3;
         this.contents.fontSize += ruby_c_size;
    this.contents.drawText(ruby[1], textState.x, textState.y-this.contents.fontSize*2-6+ruby_c_size, w,
        textState.height+10,'center');
         this.contents.fontSize -= ruby_c_size;
         this.contents.fontSize *= 3;
    this.contents.drawText(ruby[0], textState.x, textState.y + NTxtZureY, w, textState.height);
    textState.x += w;
};
Window_Base.prototype.drawTextEx = function(text, x, y) {
    if (text) {
        var textState = { index: 0, x: x, y: y, left: x };
        if(p_help_auto_Ruby){
          textState.text = this.convertEscapeCharacters($gameMessage.createRubytext(text));
        }else{
          textState.text = this.convertEscapeCharacters(text);
        }    
        textState.height = this.calcTextHeight(textState, false);
        this.resetFontSettings();
    if(p_Jisage==0||(p_Jisage==2&&$gameMessage.ruby_e_hantei(textState.text)))textState.y += 6+ruby_c_size;
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState.x - x;
    } else {
        return 0;
    }
};
riru_Ruby_Message_processEscapeCharacter =
Window_Base.prototype.processEscapeCharacter;
Window_Base.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'R':
        this.makeruby(textState);
      break;
    default:
      riru_Ruby_Message_processEscapeCharacter.call(this,
code, textState);
      break;
    }
};
Window_Base.prototype.makeruby = function(textState) {
 var ruby = this.obtainEscapeParampex(textState).split(",");
    var ow = this.textWidth(ruby[0]);
         this.contents.fontSize /= 3;
         this.contents.fontSize += ruby_c_size;
    let ccZureY = 5;
    this.contents.fontSize += ccZureY;
    var w = this.textWidth(ruby[0]);
    this.contents.drawText(ruby[1], textState.x, textState.y +
        NTxtZureY - this.contents.fontSize * 2 - 6 + ruby_c_size + ccZureY, ow, textState.height + 10 , 'center');
    this.contents.fontSize -= ccZureY;
    this.contents.fontSize -= ruby_c_size;
    this.contents.fontSize *= 3;
    w = this.textWidth(ruby[0]);
    this.contents.drawText(ruby[0], textState.x, textState.y + NTxtZureY, w * 2, textState.height);
    textState.x += w;
};
Window_Base.prototype.obtainEscapeParampex = function(textState) {
    var arr = /^\[(.*?)\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return arr[1];
    } else {
        return '';
    }
};
riru_Ruby_Message_processNewLine =
Window_Base.prototype.processNewLine;
Window_Base.prototype.processNewLine = function(textState) {
    riru_Ruby_Message_processNewLine.call(this,textState);
    if(p_Jisage==0||(p_Jisage==2&&$gameMessage.ruby_e_hantei(textState)))textState.height -= Math.max(3+ruby_c_size, 2);
};
Window_Message.prototype.needsNewPage = function(textState) {
    return (!this.isEndOfText(textState) &&
            textState.y + NTxtZureY + textState.height > this.contents.height-ruby_c_size+3);
};
})();
