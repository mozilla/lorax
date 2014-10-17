/**
 * loraxApp is the core module.
 * It serves as bootstrap for the app.
 *
 * @mixin lorax/loraxApp
 *
 */
define([
  'lorax/config/routes',
  //'core/config/http',

  'lorax/controllers/core',
  'lorax/controllers/explore',
  'lorax/controllers/detail',

  'lorax/services/window',
  'lorax/services/scroll',
  'lorax/services/pubsub',

  //'core/constants/resource-bundle',

  'angular',
  'angular-route'
  //'angular-animate',
  //'angular-touch',
  //'angular-resource',

  //'core/providers/angular-adaptive-detection'
], function (
  RouteConfig,
  //HTTPConfig,

  CoreCtrl,
  ExploreCtrl,
  DetailCtrl,

  windowService,
  scrollService,
  pubSubService,
  //ResourceBundle,

  angular
) {
  'use strict';

  angular.module('loraxApp', [
    'ngRoute'
    // 'ngAnimate',
    //'ngTouch',
    //'ngResource',

    //'adaptive.detection'
  ])

    // Set up routing
    .config(RouteConfig)

    // Set up HTTP Interception
    //.config(HTTPConfig)

    // Attach environment config object
    //.constant('ENVIRONMENT', ENVIRONMENT)

    // For this simple implementation we can
    // consider the resource bundle as a constant.
    //.constant('ResourceBundle', ResourceBundle)

    /**
     * Injects {@link lorax/controllers/CoreCtrl} as 'CoreCtrl'
     * @method lorax/vxCoreApp~controller
     */
    .controller('CoreCtrl', CoreCtrl)

    /**
     * Injects {@link lorax/controllers/ExploreCtrl} as 'ExploreCtrl'
     * @method lorax/vxCoreApp~controller
     */
    .controller('ExploreCtrl', CoreCtrl)

    /**
     * Injects {@link lorax/controllers/ExploreCtrl} as 'ExploreCtrl'
     * @method lorax/vxCoreApp~controller
     */
    .controller('DetailCtrl', DetailCtrl)

    /**
     * Inject {@link lorax/services/locationService} as 'locationService'
     * @method lorax/vxCoreApp~service
     */
    //.service('locationService', locationService)

    /**
     * Inject {@link lorax/services/windowService} as 'windowService'
     * @method lorax/vxCoreApp~service
     */
    .service('windowService', windowService)

    /**
     * Inject {@link lorax/services/scrollService} as 'scrollService'
     * @method lorax/vxCoreApp~service
     */
    .service('scrollService', scrollService)

    /**
     * Inject {@link lorax/services/pubSubService} as 'pubSubService'
     * @method lorax/vxCoreApp~factory
     */
    .factory('pubSubService', pubSubService);

  /**
   * Bootstrap the application
   */
  return angular.bootstrap(document, ['loraxApp']);
});
