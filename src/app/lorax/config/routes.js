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
                redirectTo: '/explore'
            })

            .when('/:mode', {
                controller: 'CoreCtrl',
                page: 'experience'
            })

            /* -------------------- Detail -------------------- */

            .when('/detail/:topic', {
                controller: 'CoreCtrl',
                page: 'detail'
            })

            .when('/detail/:topic/:issue', {
                controller: 'CoreCtrl',
                page: 'detail'
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
