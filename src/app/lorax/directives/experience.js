/**
 * @fileOverview Experience directive
 * @author <a href="mailto:leandroferreira@moco.to">Leandro Ferreira</a>
 */
define(['jquery'], function ($) {
    'use strict';

    /**
     * directive
     */
    var ExperienceDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            controller: ExperienceCtrl,
            link: ExperienceLinkFn,
            templateUrl: '/app/lorax/directives/experience.tpl.html'
        };
    };

    /**
     * Controller
     * @constructor
     */
    var ExperienceCtrl = function (
        $scope,
        experienceService,
        routesService,
        dataService,
        windowService,
        shareService
        )
    {
        this._$scope = $scope;
        this._experienceService = experienceService;
        this._routesService = routesService;
        this._dataService = dataService;
        this._windowService = windowService;
        this._shareService = shareService;

        this._$scope = $scope;
        this._$scope.experience = {
            currentView: 'ecosystem',
            isOpen: false,
            isSmall: true
        };

        // share event is broadcast from CoreCtrl in:
        // /src/app/lorax/controllers/core.js
        // Here we listen for the event and once triggered, we call
        // the share function in:
        // /src/app/lorax/services/share.js
        $scope.$on('share', this._shareService.share.bind(this));

        // calls the data service in /src/app/lorax/services/data.js
        // which loads all data from /src/data/i18n/main.json
        this._dataService.getMain().then( function (model) {
            // this get's the misc data such as siteTitle, siteHeader
            this._$scope.experience.localeData = model.getMiscLocale();
        }.bind(this));

        // listen to route change
        this._routesService.subscribe('change', this.onRouteChange.bind(this));

        if (this._routesService.page) {
            this.onRouteChange();
        }

        this._windowService.subscribe('breakpoint', this.onBreakpointChange.bind(this));
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ExperienceCtrl.$inject = [
        '$scope',
        'experienceService',
        'routesService',
        'dataService',
        'windowService',
        'shareService'
    ];

    ExperienceCtrl.prototype.switchView = function (view) {
        this._$scope.experience.isSmall = this._windowService.breakpoint() === 'small';
        if (view === 'ecosystem' &&  this._$scope.experience.isSmall) {
            view = 'vitals';
        }
        this._$scope.experience.isOpen = view !== 'detail';
        this._$scope.experience.currentView = view;
        this._experienceService.switchView(view);
    };

    ExperienceCtrl.prototype.onRouteChange = function () {
        if (this._routesService.page === 'modal-issue') {
            this.switchView('modal-issue');
        } else if (this._routesService.page === 'experience') {
            this.switchView(this._routesService.params.mode || 'ecosystem');
        }
    };

    ExperienceCtrl.prototype.onBreakpointChange = function (breakpoint) {
        this._$scope.experience.isSmall = breakpoint === 'small';
    };

    /**
     * Link function
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ExperienceLinkFn = function (scope, iElem, iAttrs, controller) {
        controller._experienceService.setContainer($('#experience-canvas', iElem));
    };

    return ExperienceDirective;
});
