define(function () {
    'use strict';

    var RouteConfig = function (
            $routeProvider,
            $locationProvider
        ) {

        // Invoke HTML5 pushState
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider

            /* --------- Experience -------- */

            .when('/', {
                templateUrl: '/app/lorax/templates/experience.tpl.html'
            })

            .when('/intro', {
                templateUrl: '/app/lorax/templates/experience.tpl.html'
            })

            /* -------------------- Detail -------------------- */

            .when('/detail/:topic', {
                templateUrl: '/app/lorax/templates/issues.tpl.html',
            })

            .when('/detail/:topic/:issue', {
                templateUrl: '/app/lorax/templates/issues.tpl.html',
            })

            .when('/detail/', {
                templateUrl: '/app/lorax/templates/issues.tpl.html',
                reloadOnSearch: false
            })

            /* -------------------- Error -------------------- */

            .when('/error', {
                redirectTo: '/'
                //templateUrl: '/app/lorax/templates/404.tpl.html'
            });

    };


    /**
     * Array of dependencies to preserve Angular DI during rjs minification
     * @type {Array}
     */
    RouteConfig.$inject = [
        '$routeProvider',
        '$locationProvider'
    ];

    return RouteConfig;
});
