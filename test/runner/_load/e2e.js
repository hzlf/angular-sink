document.write("<script src='_load/base.js'><\/script>");

// Remember to resolve relative paths to *test root* dir
var baseUrl = '../';

document.write("<script src='" + baseUrl + "lib/angular/angular-scenario.js' ng-autotest><\/script>");

var _testcases = [
	'e2e/scenarios.js'
];

for(var i = 0; i < _testcases.length; i++) {
    document.write("<script src='" + baseUrl + _testcases[i] + "'><\/script>");
}


