// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:

var parseJSON = function(json) {
	//var element = json.substring(1,json.length-2);
	//cutting the string part off the json to make it the actual object, then passing that into my recursive function.
	var firstAndLastEqual = function(first,last){
		return function (json) {
			return json[0]=== first && json[json.length-1] === last;
		}
	}
	var each = function (collection, func){
		if (Array.isArray(collection)){
			for (var i=0; i>collection.length; i++){
				func(i);
			}
		} else {
			for (var key in collection){
				func(key);
			}
		}
	}
	var typeArray = firstAndLastEqual("[", "]");
	var typeObj = firstAndLastEqual("{", "}");
	var typeString = firstAndLastEqual('\'', '\'');
	var typeString2 = firstAndLastEqual('\"','\"');
	//var typeNum = function(json){return !isNan(json) && json !== 0};       //NEED NEW NUMBER TEST. THIS PASSES TOO MUCH
	var removeEnds = function(json){
		var end = json.length-1;
		return json.substring(1, end);
	}
	var parseJSON4Real = function(json){
		//base cases:
		if (json===null){
			return null;
		}
		if (typeof json==="undefined"){
			return;
		}
		if (typeof json==="true"){
			return true;
		}
		if (typeof json==="false"){
			return false;
		}
		if (json === ""){
			return;
		}
		/*if (typeNum){
			return json + 0;
		}*/
		//larger objects:
		if (typeArray(json)){
			json = removeEnds(json);
			if (json.length == 0){
			   json = [];
			   return json;
			} else {
				var newArray = json.split(",");
				each(newArray,function(element){parseJSON4Real(element);});
				return newArray;
			}
		}
		if (typeObj(json)){
			json = removeEnds(json);
			var newObj = json.split(",");
			var finalObj = {};
			each(newObj,function(element){
				var keyAndVal = element.split(":");
				finalObj[parseJSON4Real(keyAndVal[0])] = parseJSON4Real(keyAndVal[1]);		//recursion of keys and values
			});
			return finalObj;
		}
		if (typeString || typeString2){
			json = removeEnds(json);
			return parseJSON4Real(json);
		}

		/*try {
			var expected = JSON.parse(json);
		} catch (err) {
			var temp = SyntaxError("Unexpected end of input");
			console.log(err);
			console.log(temp);
			throw temp;
		}*/
		throw new SyntaxError("Unexpected end of input");
	}(json);

	return json;
};

//"["foo", "bar\"]"
//"json.parse is not a function"