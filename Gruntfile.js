'use strict';

module.exports = function (grunt) {

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    src: 'src',
    app: 'src/app'
  };

  var modRewrite = require('connect-modrewrite');

  var connectMiddleware = function (connect, options) {
    var middlewares = [];

    // Mod-rewrite for
    middlewares.push(modRewrite([
      '!api(.*)|cms(.*)|\/status(.*)|' +
      '\\.html|\\.js|\\.css|\\.jpg|\\.ico|\\.json|' +
      '\\.png|\\.gif|\\.pdf|\\.xml$ /index.html [L]'
    ]));

    // Add base directories to middleware array
    var directory = options.directory || options.base[options.base.length - 1];
    if (!Array.isArray(options.base)) {
      options.base = [options.base];
    }

    options.base.forEach(function (base) {
      // Serve static files.
      middlewares.push(connect.static(base));
    });

    // Make directory browse-able.
    middlewares.push(connect.directory(directory));

    return middlewares;
  };

  grunt.initConfig({

    // Project settings
    config: config,

    less: {
      development: {
        options: {
          paths: ['<%= config.src %>/styles']
        },
        files: {
          '<%= config.src %>/css/main.css': '<%= config.src %>/styles/main.less'
        }
      }
    },

    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      server: {
        options: {
          open: 'http://localhost:<%= connect.options.port%>',
          middleware: connectMiddleware,
          base: ['src']
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/**/*.js',
        '<%= config.src %>/scripts/{,*/}*.js',
        '!<%= config.src %>/scripts/utils.js',
        '!<%= config.src %>/bower_components/{,*/}*.js',
        '!node_modules/{,*/}*.js'
      ]
    },

    notify: {
      less: {
        options: {
          message: 'Less refresh complete'
        }
      },
      server: {
        options: {
          message: 'Server started'
        }
      }
    },

    watch: {
      styles: {
        files: ['<%= config.src %>/styles/**/*.less'],
        tasks: [
          'less',
          'notify:less'
        ]
      },
      jshint: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= config.src %>/*.html', // Core pages
          '<%= config.src %>/styles/**/*.less', // Styles
          '<%= config.src %>/scripts/{,*/}*.js', // Global scripts
          '<%= config.app %>/{,**/}*.{js,html}', // ng JS and templates
          '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif}' // Images
        ]
      }
    }
  });

  grunt.registerTask('default', []);

  grunt.registerTask('server', function () {
    grunt.task.run([
      'less',
      'connect:server',
      'notify:server',
      'watch'
    ]);
  });
};
