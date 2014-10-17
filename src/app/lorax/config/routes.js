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

      .when('/detail', {
        redirectTo: '/detail/availability'
      })

      .when('/detail/availability', {
        templateUrl: '/app/lorax/templates/detail-availability.tpl.html'
      })

      .when('/detail/control', {
        templateUrl: '/app/lorax/templates/detail-control.tpl.html'
      })

      .when('/detail/safety', {
        templateUrl: '/app/lorax/templates/detail-safety.tpl.html'
      })

      .when('/detail/fairness', {
        templateUrl: '/app/lorax/templates/detail-fairness.tpl.html'
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
