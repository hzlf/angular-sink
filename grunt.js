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
        command: 'compass compile'
      },
	  // open chrome to do end to end testing
	  chrome_e2e_tests: {
		command: 'google-chrome --no-default-browser-check --no-first-run --disable-default-apps http://localhost:3000/test/runner_e2e.html'
	  }
    },

	// generate application cache manifest
    manifest:{
      dest: ''
    },

	// Jasmine headless test through PhantomJS
    // https://github.com/creynders/grunt-jasmine-task
    jasmine: {
      unit: ['test/**/runner.html']
    },



	//server configuration
	//very useful command in combination w/ reload and watch
	server: {
		port: 8000,
		base: 'app'  // points to app/index.html
	},


	// reload configuration
	// be sure to install livereload server on your OS
	// and the livereload extension to your browser
	reload: {
		port: 35729, // LR default
		liveReload: {}
	},

	// default watch configuration
	// On file changes, trigger testing, coffe compilation,
	// compass compilation, reload browser, etc
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
			'app/partials/**/*.html'
        ],
        tasks: 'reload'
      },
	  test: {
		files: [
			'test/**/*.html',
			'test/**/*.js',
			'app/js/**/*.js',
			'app/*.html',
			'app/partials/**/*.html'
		],
		tasks: 'test'
	  }
    },

	// default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
		  src: 'app/js/**/*.js',
		  tests: ['test/unit/**/*.js', 'test/e2e/**/*.js']
    },

	// specifying JSHint options and globals
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
    jshint: {
	  // Defaults (for both src and tests)
      options: {
		  "node"     : true,
		  "es5"      : true,
		  "browser"  : true,
		  "jquery"   : true,
		  "require"  : true,

		  "maxerr"   : 100,
		  "passfail" : false,

		  "asi"      : false,
		  "bitwise"  : true,
		  "boss"     : false,
		  "curly"    : true,
		  "debug"    : true,
		  "devel"    : false,
		  "eqeqeq"   : true,
		  "eqnull"   : false,
		  "evil"     : false,
		  "forin"    : true,
		  "immed"    : true,
		  "laxbreak" : false,
		  "newcap"   : true,
		  "noarg"    : true,
		  "noempty"  : true,
		  "nonew"    : true,
		  "nomen"    : false,
		  "onevar"   : false,
		  "plusplus" : false,
		  "regexp"   : true,
		  "undef"    : true,
		  "sub"      : false,
		  "strict"   : false,
		  "white"    : false,
		  "latedef"  : true,
		  "trailing" : true
		},
		globals: {
			"angular": true
		},
		//just src code
		src: {
			globals: {
				"jQuery": true
			}
		},
		// just for tests
		tests: {
			options: {
				"predef": [
					"jasmine",
					"spyOn",
					"it",
					"xit",
					"describe",
					"xdescribe",
					"expect",
					"beforeEach",
					"afterEach",
					"waitsFor",
					"runs",
				]
			},
			globals: {
				"jasmine": true
			}
		}
	},



    // -------------------
    // Build configuration
    // -------------------
	//
	// TODO: Lots of changes in this section are still needed
	// The ideia is to put a top-level folder 'dist' containing
	// the minified files and build data
	//

	// the staging directory used during the process
    staging: 'intermediate',
    // final build output
    output: 'publish',

	// filter any files matching one of the below pattern during mkdirs task
    // the pattern in the .gitignore file should work too.
    exclude: '.git* build/** node_modules/** grunt.js package.json *.md css/sass/'.split(' '),
    mkdirs: {
      staging: '<config:exclude>'
    },

	// concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'dist/css/style.css': ['app/css/**/*.css']
    },

	// Renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'js/**/*.js',
      css: 'css/**/*.css',
      img: 'img/**'
    },

	// update references in html to revved files
    usemin: {
      html: ['**/*.html'],
      css: ['**/*.css']
    },

	// html minification
    html: {
      files: ['**/*.html']
    },

	// Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.img>'
    },

	// default concat configuration, change this to match your setup:
	// https://github.com/cowboy/grunt/blob/master/docs/task_concat.md
    concat: {
      dist: {
        src: [
			'app/vendor/**/*.js',
			'app/js/**/*.js'
        ],
        dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

	// default min configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_min.md
    min: {
      dist: {
        src: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js',
        dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },

	rjs: {
      modules: [{
        name: 'main'
      }],
      dir: 'js',
      appDir: 'js',
      baseUrl: './',
      pragmas: {
        doExclude: true
      },
      skipModuleInsertion: false,
      optimizeAllPluginResources: true,
      findNestedDependencies: true
    },

    // specifying UglifyJS options:
    // https://github.com/cowboy/grunt/blob/master/docs/task_min.md#specifying-uglifyjs-options
    uglify: {}

  });



  // -------------------
  // Tasks configuration
  // -------------------

  // Default task. Run it w/ plain `grunt`
  // Serve the app on localhost:8000/app and watch for file changes
  grunt.registerTask('default', 'server reload watch');

  //build all-in-one task
  grunt.registerTask('build', 'lint concat min')

  //Additional plugin tasks
  //-----------------------
  grunt.loadNpmTasks('grunt-jasmine-task');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-reload');

  // Testing tasks
  // -------------
  grunt.registerTask('unit', 'jasmine:unit');
  // Default 'test' alias to unit testing
  grunt.registerTask('test', 'unit');
  // This task launches a simple server for testing purposes (e2e mainly)
  var connect = require('connect');
  var path = require('path');
  grunt.registerTask('server_tests', 'server for testing purposes', function() {
	  var base = path.resolve('.'), port = 3000;
	  var middleware = [connect.static(base), connect.directory(base)];
	  grunt.log.writeln('Starting test server at localhost:' + port + '/test/');
	  connect.apply(null, middleware).listen(port);
  });
  // End to end tests are not headless. Use google-chrome by default
  grunt.registerTask('e2e', 'server_tests shell:chrome_e2e_tests');


};
