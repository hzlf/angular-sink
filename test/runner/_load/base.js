// Remember to resolve relative paths to *test root* dir
var baseUrl = '../';

var _css = ['lib/jasmine/jasmine.css'];

var _scripts = [
	// base jasmine js
	'lib/jasmine/jasmine.js',
	'lib/jasmine/jasmine-html.js',

	// base vendor js
	'../app/vendor/angular.min.js',

	// app js
	'../app/js/app.js',
	'../app/js/controllers.js'
];


for(var i = 0; i < _css.length; i++) {
	document.write("<link rel='stylesheet' href='" + baseUrl + _css[i] + "'>");
}

for(var i = 0; i < _scripts.length; i++) {
    document.write("<script src='" + baseUrl +  _scripts[i] + "'><\/script>");
}
