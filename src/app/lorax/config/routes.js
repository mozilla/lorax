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

      /* --------- Explore -------- */

      .when('/', {
        templateUrl: '/app/lorax/templates/explore.tpl.html'
      })

      /* -------------------- Detail -------------------- */

      .when('/detail/', {
        templateUrl: '/app/lorax/templates/issue-all.tpl.html'
      })

      .when('/detail/:topic/', {
        templateUrl: '/app/lorax/templates/issue-all.tpl.html'
      })

      .when('/detail/:topic/:issue/', {
        templateUrl: '/app/lorax/templates/issue-all.tpl.html'
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
