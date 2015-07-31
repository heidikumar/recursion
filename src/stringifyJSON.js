// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {

  if(obj===null){
    return "null";
  }
  if(obj===undefined){
    return;
  }
  if (typeof obj == "function"){
    return;
  }
  if(typeof obj ==="boolean" || typeof obj === "number"){
    var ans = "" + obj + "";
    return ans;
  }
  if (typeof obj ==="string"){
    var ans = "\"" + obj + "\""
    return ans;
  }
  if (Array.isArray(obj)){
    var ans = [];
    if (obj.length === 0){
      ans = "[]";
    } else {
      for (var i=0; i<obj.length; i++){
         ans.push(stringifyJSON(obj[i]));
      }
      ans = "[" + ans.join(",") + "]";
    }
    return ans;
  } 
  if(Object.getOwnPropertyNames(obj).length === 0){
    var ans = "{"
  } else {
    var ans = "{"
      for (var key in obj){       
        var saveKey = stringifyJSON(key);
        var saveVal = stringifyJSON(obj[key]);
        delete obj[key];
        if(saveVal){
          var temp = saveKey + ":" +saveVal;
            if(Object.getOwnPropertyNames(obj).length>0){
            temp += ",";
            }
          ans += temp;
        }
      }
  }
  ans += "}";
  return ans;
}

