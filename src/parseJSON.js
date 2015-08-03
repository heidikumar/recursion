// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:

var parseJSON = function(json) {
	//var element = json.substring(1,json.length-2);
	//cutting the string part off the json to make it the actual object, then passing that into my recursive function.
	var isError = false;
	var err = function(){
		isError = true;
	};
	var firstAndLastEqual = function(first,last){
		return function (json) {
			return json[0]=== first && json[json.length-1] === last;
		}
	}
	var typeArray = firstAndLastEqual("[", "]");
	var typeObj = firstAndLastEqual("{", "}");
	var singeQuotes = firstAndLastEqual('\'', '\'');
	var doubleQuotes = firstAndLastEqual('\"','\"');
	var typeString = function (str) {
    	str = str.trim();
    	return (singeQuotes(str) || doubleQuotes(str)) 
        	&& str[str.length - 2] !== '\\';
	};
	var typeNum = function(json){
		return (+(json)) + '' === json;
	}

	var removeEnds = function(json){
		var end = json.length-1;
		return json.slice(1, end);
	}

  var splitByChar = function (base) {
    return function (json) {
      var result = [];
      var double_string_open = false;
      var single_string_open = false;
      var array_open = false;
      var object_open = false;
      var array_bracket_count = 0;
      var object_bracket_count = 0;

      var curr_str = '';
      var prev_ch = '';

      for (var n = 0; n < json.length; n++) {
        var ch = json[n];
        if (ch === '"') {
          double_string_open = !double_string_open;
        }
        if (ch === "'") {
          single_string_open = !single_string_open;
        }
        if (ch === '[') {
          array_bracket_count += 1;
          array_open = true;
        }
        if (ch === ']') {
          array_bracket_count -= 1;
          if (array_bracket_count === 0) {
            array_open = false;
          }
        }
        if (ch === '{') {
          object_bracket_count += 1;
          object_open = true;
        }
        if (ch === '}') {
          object_bracket_count -= 1;
          if (object_bracket_count === 0) {
            object_open = false;
          }
        }
        if (ch === base && !double_string_open && !single_string_open && !array_open && !object_open) {
          if (curr_str !== '') result.push(curr_str.trim());
          curr_str = '';
          prev_ch = '';
        } else {
          curr_str += ch;
          prev_ch = ch;
        }
      }

      if(array_open || object_open){
      	//err();
      }
      if (curr_str !== '') result.push(curr_str.trim());
      return result;
    };
  };
	var seperateByCommas = splitByChar(",");
	var seperateByColons = splitByChar(":");
	var balanceCheck = splitByChar("");
	var parseJSON4Real = function(json){
		json=json.trim();
		//base cases:
		if (json===null || json==="null"){
			return null;
		}
		if (typeof json==="undefined"||json ==="undefined"){
			return undefined;
		}
		if (json === ""){
			return;
		}

		//larger objects:
		if (typeArray(json)){
			json = removeEnds(json);
			if (json.length == 0){
			   json = [];
			   return json;
			} else {
				var newArray = seperateByCommas(json);
				var finalArray = [];
				for (var j=0; j<newArray.length; j++){
					finalArray.push(parseJSON4Real(newArray[j]));
				}
				return finalArray;
			}

		} else if (typeObj(json)){
			json = removeEnds(json);
			if(json.length == 0){
				json = {};
				return json;
			}
			var newObj = seperateByCommas(json);
			var finalObj = {};
			for (var i=0; i<newObj.length; i++){
				var keyAndVal = seperateByColons(newObj[i]);
				var newKey = parseJSON4Real(keyAndVal[0]);
				var newVal = parseJSON4Real(keyAndVal[1]);
				finalObj[newKey] = newVal;		//recursion of keys and values
			};
			return finalObj;
		} else if (typeNum){
			if (isNaN(+json)){}
			else{return +json;}
		} 
		if (typeString){
			var tempJson = json;

			var quoteSlash_count = 0;
			var quote_count = 0;
			var check = balanceCheck(json);
			json = check.join("");
			if (json=="true"){
				return true;
			}
			if (json=="false"){
				return false;
			}
			json = removeEnds(json);
			var strArr = json.split("");
			var rerun = false;
			for (var k=0; k<strArr.length-1; k++){
				if (strArr[k]==="\\"){
					strArr[k]= strArr[k] + strArr[k+1];
					delete strArr[k+1];
					k--;
					rerun = true;
				}
			};

			if (rerun){
				var slash = "\\" + "\\";
				var quote = "\\" + "\""
				for (var m=0;m<strArr.length;m++){				
					if (strArr[m]===slash){
						strArr[m]=strArr[m].slice(0,1);
					}
					if (strArr[m]===quote){
						strArr[m]=strArr[m].slice(1);			
					}
				}
			}	
			json = strArr.join("");
			for (var x=0; x<json.length; x++){
				var ch = json[x];
				if (ch === '\\' && json[x+1] === '"'){
				    quoteSlash_count++;
				} 
				if (ch === '"') {
					quote_count++;
				}
			};
			if (ch === '\\') {
				quoteSlash_count++;
			};

			if ((quote_count-quoteSlash_count)%2 != 0){
				err();
			}
			
      		return json;
		} else {
			err();
		}
	};

	var result = parseJSON4Real(json);
	console.log(result);
	if (isError) {
		//throw new SyntaxError("Unexpected end of input.");
		return undefined;
	} else {
		return result;
	}
};