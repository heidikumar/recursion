// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className
){
  var ans = document.getElementsByClassName('targetClassName');
  var elementArray = [];
  function walkTheDOM(node, func){
  	func(node);
  	node = node.firstChild;
  	while (node){
  		walkTheDOM(node,func);
  		node = node.nextSibling;
  	}
  };

  walkTheDOM(document.body, function(node){
  	if (node.nodeType==1 && node.classList.contains(className)){
  		elementArray.push(node);
  	}
  });
  return elementArray;
};
