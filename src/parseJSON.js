// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:

var parseJSON = function(json) {

	//doing the reverse of the stringify function by looking for bases cases and converting them to return.
	if (typeOf json==="null"){
		return null;
	}
	if (typeOf json==="undefined"){
		return;
	}
	if (typeOf json==="true"){
		return true;
	}
	if (typeOf json==="false"){
		return false;
	}
	if (typeOf json == "number"){
		return json + 0;
	}

	var stringStart = json.indexOf("\"\"");
	var stringEnd = json.indexOf("\"\"", stringStart);
	if (stringStart){
		var str = json.slice(stringStart, stringEnd + 1);
		return parseJSON(str);
	}

	var arrStart = json.indexOf("[");
	var arrEnd = json.indexOf("]");
	if (arrStart){
		var arr = json.slice(arrStart, arrEnd + 1);
		return parseJSON(arr);
	}

	var objStart = json.indexOf("{");
	var objEnd = json.indexOf("}");
	if (objStart) {
		var obj = json.slice(objStart, objEnd + 1);
		return parseJSON(obj);
	} else {
		throw new SyntaxError("ReferenceError: invalid stringified JSON");
	}

  	/*eval might be useful:
  		Argument is a sring. If the string represents an expression, it evaluates the expression. n 

};
