function Lietal(dict) {
  this.dict = {en_li:{},li_en:{}};

  for(var id in dict.array) {
    var value = dict.array[id]
    this.dict.li_en[value.lietal] = value.english;
    this.dict.en_li[value.english] = value.lietal;
  }
  
  this.vowel = function(v) {
    switch(v) {
      case 2:
      case "a": 
        return "ä";
      case "e": 
        return "ë";
      case "i": 
        return "ï";
      case "o": 
        return "ö";
      case "u": 
        return "ü";
      case "y": 
        return "ÿ";
      default:
        return "?";
    }
  }

  this.adultspeak = function(childspeak) {
    childspeak = childspeak.toLowerCase();

    if(childspeak.length == 2){
      var c = childspeak.substr(0,1);
      var v = childspeak.substr(1,1);
      return v+c;
    }
    if(childspeak.length == 4){
      var c1 = childspeak.substr(0,1);
      var v1 = childspeak.substr(1,1);
      var c2 = childspeak.substr(2,1);
      var v2 = childspeak.substr(3,1);
      
      if(c1 == c2 && v1 == v2){
        return c1+this.vowel(v1);
      }
      else if(c1 == c2){
        return c1+v1+v2;
      }
      else if(v1 == v2){
        return c1+this.vowel(v1)+c2;
      }
    }
    if(childspeak.length == 6){
      return this.adultspeak(childspeak.substr(0,2))+this.adultspeak(childspeak.substr(2,4));
    }
    if(childspeak.length == 8){
      return this.adultspeak(childspeak.substr(0,4))+this.adultspeak(childspeak.substr(4,4));
    }
    return childspeak
  }

  this.convert = function(word,direction = "li_en") {
    if(word == '\''){ return word; }
    dict = direction == "li_en" ? this.dict.li_en : this.dict.en_li;
    word = word.toUpperCase();
    return dict[word] ? (direction == "en_li" ? this.adultspeak(dict[word]) : dict[word]) : word;
  }

  this.deconstruct = function(childspeak) {
    childspeak = childspeak.toLowerCase();
    switch(childspeak.length) {
      case 2:
        var p1 = childspeak.substr(0,2);
        return `${this.adultspeak(childspeak)} ${this.convert(p1)}`;
      case 4:
        var p1 = childspeak.substr(0,2);
        var p2 = childspeak.substr(2,2);
        return `${this.adultspeak(childspeak)} ${this.convert(p1)}(${this.convert(p2)}) ${this.convert(childspeak)}`;
      case 6:
        var p1 = childspeak.substr(0,2);
        var p2 = childspeak.substr(2,2);
        var p3 = childspeak.substr(4,2);
        return `${this.adultspeak(childspeak)} ${this.convert(p1+p2)}(${this.convert(p3)}) ${this.convert(childspeak)}`;
      default:
        return '??';
    }
  }

  this.construction = function(q) {
    var parts = q.replace(/\./g," ' ").split(" ");
    var s = "";
    for(var id in parts){
      var part = parts[id];
      if(part == "["){ part = "push"; }
      if(part == "]"){ part = "pop"; }
      if(part == "&"){ part = "together"; }
      if(part == "|"){ part = "choice"; }
      if(part == ";"){ part = "position"; }
      if(part.substr(0,1) == "!"){ s += `${part.replace("!","")} `; continue; }
      s += part != "'" ? ` <t title='${part}'>${this.convert(part,"en_li")}</t> ` : part;
    }
    return `<t class='lietal'>${s.replace(/ \' /g,"\'").trim()}</t>`;
  }
}

module.exports = Lietal;