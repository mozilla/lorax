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
        controller: 'ExploreCtrl',
        templateUrl: '/app/lorax/templates/explore.tpl.html',
        reloadOnSearch: false
      })

      /* -------------------- Detail -------------------- */

      .when('/detail', {
        controller: 'DetailCtrl',
        templateUrl: '/app/lorax/templates/detail.tpl.html'
      })

      .when('/detail/availability', {
        controller: 'DetailCtrl',
        templateUrl: '/app/lorax/templates/detail.tpl.html'
      })

      .when('/detail/control', {
        controller: 'DetailCtrl',
        templateUrl: '/app/lorax/templates/detail.tpl.html'
      })

      .when('/detail/safety', {
        controller: 'DetailCtrl',
        templateUrl: '/app/lorax/templates/detail.tpl.html'
      })

      .when('/detail/fairness', {
        controller: 'DetailCtrl',
        templateUrl: '/app/lorax/templates/detail.tpl.html'
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
