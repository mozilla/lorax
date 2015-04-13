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
                controller: 'CoreCtrl',
                page: 'experience'
            })

            .when('/:mode', {
                controller: 'CoreCtrl',
                page: 'experience'
            })

            /* -------------------- Issue Modal -------------------- */

            .when('/:topic/:issue', {
                controller: 'CoreCtrl',
                page: 'modal-issue'
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
