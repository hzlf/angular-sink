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
        src: 'js/**/*.coffee',
        dest: 'js'
      }
    },

    // compass compile
    // https://github.com/sindresorhus/grunt-shell#grunt-shell
    shell: {
      compass: {
        command: 'compass compile'
      }
    },

	// generate application cache manifest
    manifest:{
      dest: ''
    },

	// Jasmine headless test through PhantomJS
    // https://github.com/creynders/grunt-jasmine-task
    jasmine: {
      all: ['test/**/*.html']
    },

	// reload configuration
	// be sure to install livereload server on your OS
	// and the livereload extension to your browser
	reload: {
		port: 35729, // LR default
		liveReload: {}
	},
	// default watch configuration
    watch: {
      coffee: {
        files: '<config:coffee.dist.src>',
        tasks: 'coffee'
      },
      compass: {
        files: ['css/sass/**/*.sass', 'css/sass/**/*.scss'],
        tasks: 'shell:compass'
      },
      reload: {
        files: ['css/**/*.css', 'js/**/*.js', 'img/**/*'],
        tasks: 'reload'
      }
    },

	// default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      files: [
		  //'test/spec/*.js',  // uncomment to enable tests lint
		  'js/main.js'
      ]
    },

	// specifying JSHint options and globals
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
    jshint: {
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
		"trailing" : true,

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
		],
      },
      globals: {
		"jQuery": true,
		"jasmine": true,
	  },
    },



    // -------------------
    // Build configuration
    // -------------------

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
      'css/style.min.css': ['css/**/*.css']
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
			'js/plugins.js',
			'js/vendor/**/*.js',
			'js/main.js'
        ],
        dest: 'js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

	// default min configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_min.md
    min: {
      dist: {
        src: 'js/<%= pkg.name %>-<%= pkg.version %>.js',
        dest: 'js/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },

	rjs: {
      modules: [{
        name: 'main',
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

  //Additional tasks
  grunt.loadNpmTasks('grunt-jasmine-task');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-reload');

  // Alias the `test` task to run the `jasmine` task instead
  grunt.registerTask('test', 'jasmine');

  // Default task. Run it w/ `grunt`
  // Serve the app on localhost:8000 and watch for file changes
  grunt.registerTask('default', 'server reload watch');

  //build all-in-one task
  grunt.registerTask('build', 'lint concat min')

};
