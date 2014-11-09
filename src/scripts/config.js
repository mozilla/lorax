/* global require:true */
(function (require) {
    'use strict';

    require.config({
        baseUrl: '/app/',

        name: '../bower_components/almond/almond',

        paths: {
            'angular': '../bower_components/angular/angular',
            'angular-route': '../bower_components/angular-route/angular-route',
            'jquery': '../bower_components/jquery/dist/jquery',
            'jquery-scrollie': '../scripts/libs/jquery.scrollie.min',
            'modernizr': '../scripts/modernizr',
            'd3': '../bower_components/d3/d3',
            'topojson': '../scripts/libs/topojson.v1.min',
            'pubsub': '../bower_components/jquery-tiny-pubsub/src/tiny-pubsub',
            'utils': '../scripts/utils',
            'lodash': '../bower_components/lodash/dist/lodash.min',
            'pixi': '../bower_components/pixi/bin/pixi',
            'stats': '../bower_components/stats.js/build/stats.min',
            'createjs': '../bower_components/TweenJS/lib/tweenjs-0.5.1.min',
            'explore': '../scripts/explore'
        },

        include: ['lorax/lorax-app'],

        insertRequire: ['lorax/lorax-app'],

        shim: {
            'angular': {
                exports: 'angular',
                deps: ['jquery']
            },
            'angular-route': {
                deps: ['angular']
            },
            'jquery-scrollie': {
                deps: ['jquery']
            },
            'pubsub': {
                deps: ['jquery']
            },
            'modernizr': {
                exports: ['Modernizr']
            },
            'stats': {
                exports: 'Stats'
            },
            'createjs': {
                exports: 'createjs'
            }
        },

        deps: ['lorax/lorax-app'],

        wrap: true

    });

}(require));
