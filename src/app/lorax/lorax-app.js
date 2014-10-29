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

  // controller
  'lorax/controllers/core',
  'lorax/controllers/explore',
  'lorax/controllers/detail',

  // directives
  'lorax/directives/window',
  'lorax/directives/prevent-default',
  'lorax/directives/detail-section',
  'lorax/directives/detail-scroll',
  'lorax/directives/chart-top-internet-companies',
  'lorax/directives/chart-terms-and-conditions',
  'lorax/directives/chart-common-languages',
  'lorax/directives/chart-lobbying-costs',
  'lorax/directives/explore-canvas',

  // services
  'lorax/services/window',
  'lorax/services/scroll',
  'lorax/services/pubsub',
  'lorax/services/data',
  'lorax/services/explore',

  // filters
  'lorax/filters/unsafe',

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

  // controllers
  CoreCtrl,
  ExploreCtrl,
  DetailCtrl,

  // directives
  WindowDirective,
  PreventDefaultDirective,
  DetailSectionDirective,
  DetailScrollDirective,
  ChartTopInternetCompaniesDirective,
  ChartTermsAndConditionsDirective,
  ChartCommonLanguagesDirective,
  ChartLobbyingCostsDirective,
  ExploreCanvasDirective,

  // services
  windowService,
  scrollService,
  pubSubService,
  dataService,
  exploreService,

  // filters
  unsafeFilter,

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
     * @method lorax/loraxApp~controller
     */
    .controller('CoreCtrl', CoreCtrl)

    /**
     * Injects {@link lorax/controllers/ExploreCtrl} as 'ExploreCtrl'
     * @method lorax/loraxApp~controller
     */
    .controller('ExploreCtrl', ExploreCtrl)

    /**
     * Injects {@link lorax/controllers/ExploreCtrl} as 'ExploreCtrl'
     * @method lorax/loraxApp~controller
     */
    .controller('DetailCtrl', DetailCtrl)

    /**
     * Injects {@link lorax/directives/WindowDirective} as 'WindowDirective'
     * @method lorax/loraxApp~directive
     */
    .directive('loraxWindow', WindowDirective)

    /**
     * Injects {@link lorax/directives/WindowDirective} as 'WindowDirective'
     * @method lorax/loraxApp~directive
     */
    .directive('loraxPreventDefault', PreventDefaultDirective)

    /**
     * Injects {@link lorax/directives/DetailDirective} as 'DetailDirective'
     * @method lorax/loraxApp~directive
     */
    .directive('loraxDetailSection', DetailSectionDirective)

    /**
     * Injects {@link lorax/directives/DetailScrollDirective} as 'DetailScrollDirective'
     * @method lorax/loraxApp~directive
     */
    .directive('loraxDetailScroll', DetailScrollDirective)

    /**
     * Injects {@link lorax/directives/ChartTopInternetCompaniesDirective}
     * as 'ChartTopInternetCompaniesDirective'
     * @method lorax/loraxApp~directive
     */
    .directive('loraxChartTopInternetCompanies', ChartTopInternetCompaniesDirective)

    /**
     * Injects {@link lorax/directives/ChartTermsAndConditionsDirective}
     * as 'ChartTermsAndConditionsDirective'
     * @method lorax/loraxApp~directive
     */
    .directive('loraxChartTermsAndConditions', ChartTermsAndConditionsDirective)

    /**
     * Injects {@link lorax/directives/ChartCommonLanguagesDirective}
     * as 'ChartCommonLanguagesDirective'
     * @method lorax/loraxApp~directive
     */
    .directive('loraxChartCommonLanguages', ChartCommonLanguagesDirective)

    /**
     * Injects {@link lorax/directives/ChartLobbyingCostsDirective}
     * as 'ChartLobbyingCostsDirective'
     * @method lorax/loraxApp~directive
     */
    .directive('loraxChartLobbyingCosts', ChartLobbyingCostsDirective)

    /**
     * Injects {@link lorax/directives/ChartLobbyingCostsDirective}
     * as 'ChartLobbyingCostsDirective'
     * @method lorax/loraxApp~directive
     */
    .directive('loraxExploreCanvas', ExploreCanvasDirective)

    /**
     * Inject {@link lorax/services/locationService} as 'locationService'
     * @method lorax/loraxApp~service
     */
    //.service('locationService', locationService)

    /**
     * Inject {@link lorax/services/windowService} as 'windowService'
     * @method lorax/loraxApp~service
     */
    .service('windowService', windowService)

    /**
     * Inject {@link lorax/services/scrollService} as 'scrollService'
     * @method lorax/loraxApp~service
     */
    .service('scrollService', scrollService)

    /**
     * Inject {@link lorax/services/dataService} as 'dataService'
     * @method lorax/loraxApp~factory
     */
    .service('exploreService', exploreService)

    /**
     * Inject {@link lorax/services/pubSubService} as 'pubSubService'
     * @method lorax/loraxApp~factory
     */
    .factory('pubSubService', pubSubService)

    /**
     * Inject {@link lorax/services/dataService} as 'dataService'
     * @method lorax/loraxApp~factory
     */
    .factory('dataService', dataService)

    .filter('unsafe', unsafeFilter);

  /**
   * Bootstrap the application
   */
  return angular.bootstrap(document, ['loraxApp']);
});
