'use strict';

module.exports = function (grunt) {

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        src: 'src',
        dist: 'dist',
        temp: '.tmp'
    };

    var modRewrite = require('connect-modrewrite');

    var connectMiddleware = function (connect, options) {
        var middlewares = [];

        // Mod-rewrite for
        middlewares.push(modRewrite([
            '!api(.*)|cms(.*)|\/status(.*)|' +
            '\\.html|\\.js|\\.css|\\.jpg|\\.ico|\\.json|' +
            '\\.png|\\.gif|\\.pdf|\\.ttf|\\.otf|\\.xml$ /index.html [L]'
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

        config: config,

        bower: {
            options: {
                cleanTargetDir: true,
                cleanBowerDir: false,
                copy: true,
                install: false
            },
            install: {
                options: {
                    targetDir: '<%= config.src %>/scripts/components'
                }
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.temp %>'
                    ]
                }]
            },
            grunticon: {
                files: [{
                    src: [
                        '<%= config.src %>/images/icons-min/'
                    ]
                }]
            }
        },

        concat: {
            headScripts: {
                src: [
                    '<%= config.src %>/scripts/components/modernizr/modernizr.js',
                    '<%= config.src %>/scripts/grunticon.js'
                ],
                dest: '<%= config.dist %>/scripts/lorax-head.min.js'
            }
        },

        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            server: {
                options: {
                    middleware: connectMiddleware,
                    base: ['<%= config.temp %>', '<%= config.src %>']
                }
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.dist %>',
                    src: ['**'],
                    filter: 'isFile'
                    // src: [
                    //     '*.{ico,png,txt}',
                    //     '.htaccess',
                    //     'CNAME',
                    //     'robots.txt',
                    //     'scripts/data/{,*/}*.{js,json}',
                    //     'images/{,*/}*.{ico,gif,png,jpg,pdf,html}',
                    //     'fonts/{,*/}*.{otf,ttf,eot,woff,svg}',
                    //     'data/**/*.json',
                    //     '**/*.tpl.html',
                    //     'index.html'
                    // ]
                }]
            }
        },

        grunticon: {
            options: {
                customselectors:
                    grunt.file.readJSON('src/styles/grunticon/custom-selectors.json')
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/images/icons-min/',
                    src: ['*.svg', '*.png'],
                    dest: '<%= config.dist %>/images/icons/'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/images/icons-min/',
                    src: ['*.svg', '*.png'],
                    dest: '<%= config.temp %>/images/icons/'
                }]
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '!Gruntfile.js',
                'app/**/*.js',
                '<%= config.src %>/scripts/{,*/}*.js',
                '!<%= config.src %>/scripts/libs/{,*/}*.js',
                '!<%= config.src %>/scripts/components/{,*/}*.js',
                '!<%= config.src %>/scripts/utils.js',
                '!bower_components/{,*/}*.js',
                '!node_modules/{,*/}*.js',
                '!**/grunticon.js'
            ]
        },

        less: {
            server: {
                options: {
                    paths: ['<%= config.src %>/styles']
                },
                files: {
                    '<%= config.temp %>/css/main.css': '<%= config.src %>/styles/main.less'
                }
            },
            dist: {
                options: {
                    cleancss: true,
                    paths: ['<%= config.src %>/styles']
                },
                files: {
                    '<%= config.dist %>/css/main.css': '<%= config.src %>/styles/main.less'
                }
            }
        },

        requirejs: {
            dist: {
                options: {
                    baseUrl: '<%= config.src %>/app',
                    mainConfigFile: '<%= config.src %>/scripts/config.js',
                    normalizeDirDefines: 'all',
                    out: '<%= config.temp %>/scripts/lorax.js',
                    preserveLicenseComments: false
                }
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/images/icons-source',
                    src: ['*.svg'],
                    dest: '<%= config.src %>/images/icons-min'
                }]
            }
        },

        uglify: {
            options: {
                compress: {
                    /*jshint camelcase: false */
                    drop_console: true
                }
            },
            dist: {
                files: {
                    '<%= config.dist %>/scripts/lorax.min.js': [
                        '<%= config.temp %>/scripts/lorax.js'
                    ]
                }
            }
        },

        usemin: {
            html: ['<%= config.dist %>/{,*/}*.html'],
            //css: ['<%= config.temp %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= config.dist %>']
            }
        },

        useminPrepare: {
            html: '<%= config.src %>/index.html',
            options: {
                dest: '<%= config.dist %>'
            }
        },

        watch: {
            styles: {
                files: ['<%= config.src %>/styles/**/*.less'],
                tasks: [
                    'less:server',
                ]
            },
            grunticon: {
                files: [
                    '<%= config.src %>/images/icons-source/{,*/}*.svg',
                    '<%= config.src %>/styles/grunticon/custom-selectors.json'
                ],
                tasks: [
                    'clean:grunticon',
                    //'svgmin',
                    'grunticon:server'
                ]
            },
            jshint: {
                files: ['<%= jshint.all %>'],
                tasks: ['jshint']
            }
        },

        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: ['**']
        },

        s3: {
            options: {
                bucket: process.env.AWS_S3_BUCKET,
                access: 'public-read',
                headers: {
                    // Two Hour cache policy (1000 * 60 * 60 * 2)
                    'Cache-Control': 'max-age=7200, public',
                    'Expires': new Date(Date.now() + 7200000).toUTCString()
                }
            },
            prod: {
                upload: [
                    {
                        src: 'dist/**',
                        dest: '',
                        rel: 'dist',
                        options: {
                            verify: true,
                            gzip: true,
                            gzipExclude: ['.png', '.ico', '.txt', '.jpg', '.woff']
                        }
                    }
                ]
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                expand: true,
                cwd: 'dist/',
                dest: 'dist/',
                src: [
                  '**/*.css',
                  '**/*.js',
                  '**/*.eot',
                  '**/*.svg',
                  '**/*.ttf'
                ]
            }
        }
    });

    grunt.registerTask('default', []);

    // Dev
    grunt.registerTask('server', function () {
        grunt.task.run([
            'clean:server',
            'clean:grunticon',
            //'svgmin',
            'grunticon:server',
            'bower:install',
            'less:server',
            'connect:server',
            'watch'
        ]);
    });

    // Build
    grunt.registerTask('build', function () {
        grunt.task.run([
            'clean:dist',
            'clean:grunticon',
            'useminPrepare',
            'copy:dist',
            'bower:install',
            'less:dist',
            'grunticon:dist',
            'requirejs',
            'concat',
            'uglify:dist',
            'usemin'
            // 'compress:main'
        ]);
    });

    // Dev
    grunt.registerTask('icons', function () {
        grunt.task.run([
            'clean:grunticon',
            'svgmin',
            'grunticon:server',
        ]);
    });
};
