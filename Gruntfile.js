'use strict';

module.exports = function (grunt) {

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'app'
  };

  grunt.initConfig({

    // Project settings
    config: config,

    compass: {
      options: {
        //require: ['susy'],
        sassDir: '<%= config.app %>/styles',
        cssDir: '<%= config.app %>/css'
      },
      server: {
        options: {
          debugInfo: false,
          outputStyle: 'compact'
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
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/**/*.js',
        'app/scripts/{,*/}*.js',
        '!app/scripts/libs/{,*/}*.js',
        '!bower_components/{,*/}*.js',
        '!node_modules/{,*/}*.js'
      ]
    },

    watch: {
      compass: {
        files: ['<%= config.app %>/styles/{,*/}*.scss'],
        tasks: [
          'compass:server'
        ]
      },
      jshint: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/*.html', // Core pages
          '<%= config.app %>/styles/{,*/}*.scss', // Styles
          '<%= config.app %>/scripts/{,*/}*.js', // Global scripts
          '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif}' // Images
        ]
      }
    }
  });

  grunt.registerTask('default', []);

  grunt.registerTask('server', function () {
    grunt.task.run([
      'compass:server',
      'connect:livereload',
      'watch'
    ]);
  });
};
