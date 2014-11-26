/**
 * loraxApp is the core module.
 * It serves as bootstrap for the app.
 *
 * @mixin lorax/loraxApp
 *
 */
define([
    'lorax/config/routes',

    // controller
    'lorax/controllers/core',
    'lorax/controllers/nav',

    // directives
    'lorax/directives/window',
    'lorax/directives/prevent-default',
    'lorax/directives/modal-email',
    'lorax/directives/modal-share',
    'lorax/directives/modal-about',
    'lorax/directives/modal-legend',
    'lorax/directives/modal-mobile-options',
    'lorax/directives/issue-details',
    'lorax/directives/issue-scroll',
    'lorax/directives/issue-all',
    'lorax/directives/chart-top-internet-companies',
    'lorax/directives/chart-terms-and-conditions',
    'lorax/directives/chart-common-languages',
    'lorax/directives/chart-line-graph',
    'lorax/directives/chart-world-map',
    'lorax/directives/chart-static-image',
    'lorax/directives/chart-accessible',
    'lorax/directives/chart-platform-neutrality',
    'lorax/directives/chart-lobbying',
    'lorax/directives/chart-cyber-threats',
    'lorax/directives/chart-data-portability',
    'lorax/directives/chart-open-source',
    'lorax/directives/chart-surveillance',
    'lorax/directives/chart-data-tracking',
    'lorax/directives/chart-concentration-power',
    'lorax/directives/chart-public-trust',
    'lorax/directives/chart-infrastructure',
    'lorax/directives/chart-identity-control',
    'lorax/directives/chart-cloud-security',
    'lorax/directives/chart-cyber-bullying',
    'lorax/directives/chart-zero-rating',
    'lorax/directives/experience',
    'lorax/directives/detail',
    'lorax/directives/add-infographic-directive',

    // services
    'lorax/services/window',
    'lorax/services/scroll',
    'lorax/services/utils',
    'lorax/services/pubsub',
    'lorax/services/data',
    'lorax/services/experience',
    'lorax/services/routes',

    // filters
    'lorax/filters/encode-uri',

    'angular',
    'angular-route'
], function (
    RouteConfig,

    // controllers
    CoreCtrl,
    NavCtrl,

    // directives
    WindowDirective,
    PreventDefaultDirective,
    ModalEmailDirective,
    ModalShareDirective,
    ModalAboutDirective,
    ModalLegendDirective,
    ModalMobileOptionsDirective,
    IssueDetailsDirective,
    IssueScrollDirective,
    IssueAllDirective,
    ChartTopInternetCompaniesDirective,
    ChartTermsAndConditionsDirective,
    ChartCommonLanguagesDirective,
    ChartLineGraphDirective,
    ChartWorldMapDirective,
    ChartStaticImageDirective,
    ChartAccessibleDirective,
    ChartPlatformNeutralityDirective,
    ChartLobbyingDirective,
    ChartCyberThreatsDirective,
    ChartDataPortabilityDirective,
    ChartOpenSourceDirective,
    ChartSurveillanceDirective,
    ChartDataTrackingDirective,
    ChartConcentrationPowerDirective,
    ChartPublicTrustDirective,
    ChartInfrastructureDirective,
    ChartIdentityControlDirective,
    ChartCloudSecurityDirective,
    ChartCyberBullyingDirective,
    ChartZeroRatingDirective,
    ExperienceDirective,
    DetailDirective,
    AddInfographicDirective,

    // services
    windowService,
    scrollService,
    utilsService,
    pubSubService,
    dataService,
    experienceService,
    routesService,

    // filters
    EncodeUriFilter,

    angular
) {
    'use strict';

    angular.module('loraxApp', [
        'ngRoute'
    ])

        // Set up routing
        .config(RouteConfig)

        /**
         * Injects {@link lorax/controllers/CoreCtrl} as 'CoreCtrl'
         * @method lorax/loraxApp~controller
         */
        .controller('CoreCtrl', CoreCtrl)

        /**
         * Injects {@link lorax/controllers/NavCtrl} as 'NavCtrl'
         * @method lorax/loraxApp~controller
         */
        .controller('NavCtrl', NavCtrl)

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
         * Injects {@link lorax/directives/ModalEmailDirective} as 'ModalEmailDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxModalEmail', ModalEmailDirective)

        /**
         * Injects {@link lorax/directives/ModalShareDirective} as 'ModalShareDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxModalShare', ModalShareDirective)

        /**
         * Injects {@link lorax/directives/ModalAboutDirective} as 'ModalAboutDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxModalAbout', ModalAboutDirective)

        /**
         * Injects {@link lorax/directives/ModalLegendDirective} as 'ModalLegendDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxModalLegend', ModalLegendDirective)

        /**
         * Injects {@link lorax/directives/ModalMobileOptionsDirective} as 'ModalMobileOptionsDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxModalMobileOptions', ModalMobileOptionsDirective)

        /**
         * Injects {@link lorax/directives/IssueDetails} as 'IssueDetails'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxIssueDetails', IssueDetailsDirective)

        /**
         * Injects {@link lorax/directives/IssueScrollDirective} as 'IssueScrollDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxIssueScroll', IssueScrollDirective)

        /**
         * Injects {@link lorax/directives/IssueAll} as 'IssueAllDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxIssueAll', IssueAllDirective)

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
         * Injects {@link lorax/directives/ChartLineGraphDirective}
         * as 'ChartLineGraphDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartLineGraph', ChartLineGraphDirective)

        /**
         * Injects {@link lorax/directives/ChartWorldMapDirective}
         * as 'ChartLineGraphDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartWorldMap', ChartWorldMapDirective)

        /**
         * Injects {@link lorax/directives/ChartStaticImageDirective}
         * as 'ChartStaticImageDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartStaticImage', ChartStaticImageDirective)

        /**
         * Injects {@link lorax/directives/ChartAccessibleDirective}
         * as 'ChartAccessibleDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartAccessible', ChartAccessibleDirective)

        /**
         * Injects {@link lorax/directives/ChartPlatformNeutralityDirective}
         * as 'ChartPlatformNeutralityDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartPlatformNeutrality', ChartPlatformNeutralityDirective)

        /**
         * Injects {@link lorax/directives/ChartLobbyingDirective}
         * as 'ChartLobbyingDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartLobbying', ChartLobbyingDirective)

        /**
         * Injects {@link lorax/directives/ChartCyberThreatsDirective}
         * as 'ChartCyberThreatsDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartCyberThreats', ChartCyberThreatsDirective)

        /**
         * Injects {@link lorax/directives/ChartDataPortabilityDirective}
         * as 'ChartDataPortabilityDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartDataPortability', ChartDataPortabilityDirective)

        /**
         * Injects {@link lorax/directives/ChartOpenSourceDirective}
         * as 'ChartOpenSourceDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartOpenSource', ChartOpenSourceDirective)

        /**
         * Injects {@link lorax/directives/ChartSurveillanceDirective}
         * as 'ChartSurveillanceDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartSurveillance', ChartSurveillanceDirective)

        /**
         * Injects {@link lorax/directives/ChartDataTrackingDirective}
         * as 'ChartDataTrackingDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartDataTracking', ChartDataTrackingDirective)

        /**
         * Injects {@link lorax/directives/ChartConcentrationPowerDirective}
         * as 'ChartConcentrationPowerDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartConcentrationPower', ChartConcentrationPowerDirective)

        /**
         * Injects {@link lorax/directives/ChartPublicTrustDirective}
         * as 'ChartPublicTrustDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartPublicTrust', ChartPublicTrustDirective)

        /**
         * Injects {@link lorax/directives/ChartInfrastructureDirective}
         * as 'ChartInfrastructureDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartInfrastructure', ChartInfrastructureDirective)

        /**
         * Injects {@link lorax/directives/ChartIdentityControlDirective}
         * as 'ChartIdentityControlDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartIdentityControl', ChartIdentityControlDirective)

        /**
         * Injects {@link lorax/directives/ChartCloudSecurityDirective}
         * as 'ChartCloudSecurityDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartCloudSecurity', ChartCloudSecurityDirective)

        /**
         * Injects {@link lorax/directives/ChartCyberBullyingDirective}
         * as 'ChartCyberBullyingDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartCyberBullying', ChartCyberBullyingDirective)

        /**
         * Injects {@link lorax/directives/ChartZeroRatingDirective}
         * as 'ChartZeroRatingDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxChartZeroRating', ChartZeroRatingDirective)

        /**
         * Injects {@link lorax/directives/ExperienceDirective}
         * as 'ExperienceDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxExperience', ExperienceDirective)

        /**
         * Injects {@link lorax/directives/DetailDirective}
         * as 'DetailDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxDetail', DetailDirective)

        /**
         * Injects {@link lorax/directives/AddInfographicDirective}
         * as 'AddInfographicDirective'
         * @method lorax/loraxApp~directive
         */
        .directive('loraxAddInfographicDirective', AddInfographicDirective)

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
         * Inject {@link lorax/services/utilsService} as 'utilsService'
         * @method lorax/loraxApp~service
         */
        .service('utilsService', utilsService)

        /**
         * Inject {@link lorax/services/experienceService} as 'experienceService'
         * @method lorax/loraxApp~service
         */
        .service('experienceService', experienceService)

        /**
         * Inject {@link lorax/services/routesService} as 'routesService'
         * @method lorax/loraxApp~service
         */
        .service('routesService', routesService)

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

        /**
         * Inject {@link lorax/services/encodeUriFilter} as 'encodeUri'
         * @method lorax/loraxApp~filter
         */
        .filter('encodeUri', EncodeUriFilter);

    /**
    * Bootstrap the application
    */
    return angular.bootstrap(document, ['loraxApp']);
});
