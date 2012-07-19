document.write("<script src='_load/base.js'><\/script>");

// Remember to resolve relative paths to *test root* dir
var baseUrl = '../';


var _testcases = [
	'unit/controllersSpec.js'
];


for(var i = 0; i < _testcases.length; i++) {
    document.write("<script src='" + baseUrl +  _testcases[i] + "'><\/script>");
}

