// USAGE:
//
// grunt  --> Grunt keeps watching for file changes (hold terminal)
//     On changes, run headless unit testing, trigger liveReload, lint, compile sass & coffee
//
// grunt test --> Runs full test suite on real browser (unit and end2end tests) (hold terminal)
//
// grunt unit --> Runs unit headless testing and exits
// grunt lint --> Lints files using .jshintrc.json
//


// Grunt configuration:
// https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

/*global module:false*/
module.exports = function(grunt) {

	// ---------------------
	// Project configuration
	// ---------------------

	grunt.initConfig({
		pkg: '<json:package.json>',


		// -------------------------------
		// Dev utilities and configuration
		// -------------------------------

		// coffee to js compilation
		coffee: {
			dist: {
				src: 'app/js/**/*.coffee',
				dest: 'app/js'
			}
		},

		// compass compile
		// https://github.com/sindresorhus/grunt-shell#grunt-shell
		shell: {
			compass: {
				command: 'compass compile -c compass_config.rb'
			},
			// open chrome to do end to end testing and unit testing
			chrome_tests: {
				command: 'google-chrome --no-default-browser-check --no-first-run' +
					'--disable-default-apps ' +
					' http://localhost:3000/test/runner/runner.e2e.html' +
					' http://localhost:3000/test/runner/runner.unit.head.html',
				stdout: true
			}
		},

		// generate application cache manifest
		manifest:{
			dest: ''
		},

		// Jasmine headless test through PhantomJS
		// https://github.com/creynders/grunt-jasmine-task
		jasmine: {
			unit: ['test/**/runner/runner.unit.headless.html']
		},



		// server configuration
		server: {
			port: 8000,
			base: 'app'  // points to app/index.html
		},

		// reload configuration
		// be sure to install livereload server and the livereload browser extension
		reload: {
			port: 35729, // LR default
			liveReload: {}
		},

		// default watch configuration
		// On file changes trigger tests, coffe & compass compilation, reload browser
		watch: {
			coffee: {
				files: '<config:coffee.dist.src>',
				tasks: 'coffee'
			},
			compass: {
				files: ['app/css/sass/**/*.sass', 'app/css/sass/**/*.scss'],
				tasks: 'shell:compass'
			},
			reload: {
				files: [
					'app/css/**/*.css',
					'app/js/**/*.js',
					'app/img/**/*',
					'app/*.html',
					'app/partials/**/*.html',
					'test/**/*.html',
					'test/**/*.js'
				],
				tasks: 'reload'
			},
			lint: {
				files: ['app/js/**/*.js', 'test/**/*.js'],
				tasks: 'lint'
			},
			test: {
				files: [
					'test/**/*.html',
					'test/**/*.js',
					'app/js/**/*.js',
					'app/*.html',
					'app/partials/**/*.html'
				],
				tasks: 'test_headless'
			}
		},



		// Linting JS files
		//-----------------
		// What files to lint
		lint: {
			src: 'app/js/**/*.js',
			tests: ['test/unit/**/*.js', 'test/e2e/**/*.js']
		},
		// JSHint options and globals
		jshint: '<json:.jshintrc.json>',




		// -------------------
		// Build configuration
		// -------------------
		// TODO: Missing rjs task. Needs to configure it.
		//   See:   https://github.com/h5bp/node-build-script/issues/50#issuecomment-7092320
		//     and: http://requirejs.org/docs/optimization.html#wholeproject
		//     and: http://requirejs.org/docs/optimization.html#onejs

		// Folder structure
		//-----------------
		// Build locations
		staging: 'build/staging/', // the staging directory used during the process
		output: 'build/publish/', // final build output
		// create staging (intermediate) directory
		mkdirs: {
			staging: 'app/' // Copy app. Files in .gitignore are not gonna be copied
			// At the end of the build, staging is gonna be copied as publish
		},


		// CSS treatment
		//--------------
		// concat & minify css files (inline @import, output a single minified css)
		css: {
			'css/bundle.min.css': ['css/**/*.css']
		},


		// JS treatment
		//-------------
		// concat js files
		concat: {
			'js/bundle.js': ['js/**/*.js'],
			'js/bundle_vendor.js': ['vendor/**/*.js']
		},
		// minify js files
		min: {
			'js/bundle.min.js': ['js/bundle.js'],
			'js/bundle_vendor.min.js': ['js/bundle_vendor.js']
		},


		// HTML references treatment
		//--------------------------
		// Renames JS/CSS, by prepending a hash of their contents (versioning)
		rev: {
			js: 'js/**/*.js',
			css: 'css/**/*.css',
			img: 'img/**'
		},
		// update references in html to revved files
		// Don't forget to pu the classic comment build notation on the html files
		// <!-- build:css css/bundle.min.css --> ... css block ... <--! endbuild -->
		// <!-- build:js js/bundle.min.js--> ... js block ... <--! endbuild -->
		usemin: {
			html: ['**/*.html'],
			css: ['**/*.css']
		},
		// html minification
		html: {
			files: ['**/*.html']
		},


		// Images treatment
		//-----------------
		// Optimizes JPGs and PNGs (install jpegtran & optipng system-wide)
		img: {
			dist: '<config:rev.img>'
		}

	});



	// -------------------
	// Tasks configuration
	// -------------------

	//Additional plugin tasks
	//-----------------------
	grunt.loadNpmTasks('grunt-jasmine-task');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-coffee');
	grunt.loadNpmTasks('grunt-reload');

	// node-build-script is gonna overwrite grunt server/reload task
	// I want to keep the original grunt tasks
	// TODO: Figure out a way to selectively load npmPlugin tasks
	// so it doesn't need this ugly hack
	grunt.renameTask('reload', '_reload');
	grunt.renameTask('server', '_server');
	grunt.loadNpmTasks('node-build-script');
	grunt.renameTask('server', '_node-build-script_server');
	grunt.renameTask('_server', 'server');
	grunt.renameTask('reload', '_node-build-script_reload');
	grunt.renameTask('_reload', 'reload');




	//Preprocessor tasks
	//------------------
	// `grunt compass`
	grunt.registerTask('compass', 'shell:compass');


	// Testing tasks
	// -------------
	// grunt unit for fast headless unit tests
	// grunt test for full real browser testing (unit and e2e)

	// This task launches a simple server for testing purposes (e2e mainly)
	var connect = require('connect');
	var path = require('path');
	grunt.registerTask('server_testing', 'server for testing purposes', function() {
		var base = path.resolve('.'), port = 3000;
		var middleware = [connect.static(base), connect.directory(base)];
		grunt.log.writeln('Starting test server at localhost:' + port);
		connect.apply(null, middleware).listen(port);
	});
	// `grunt test_headless` & `grunt e2e`
	grunt.registerTask('unit', 'jasmine:unit');
	grunt.registerTask('test_headless', 'unit'); // Executes unit tests w/ phantomjs
	// `test_head` task executes all the testing (unit and e2e) in a real browser
	// End to end tests are not headless. Uses google-chrome by default
	grunt.registerTask('test', 'server_testing shell:chrome_tests watch');


	// Default tasks
	//--------------
	// `grunt` & `grunt build`
	// Sentinel task. Very useful in development mode
	// Serve the app on localhost:8000/app and watch for file changes
	// Run it w/ plain `grunt`
	grunt.registerTask('default', 'server reload watch');

	// Build task
	// Builds a publish folder with the app ready to be deployed
	// Run it with `grunt build`
	grunt.renameTask('build', '_build'); // node-build-script gives a build task
	grunt.registerTask('build', '_build:default');

};
