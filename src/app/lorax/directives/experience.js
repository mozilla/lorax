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
        routesService
        )
    {
        this._$scope = $scope;
        this._experienceService = experienceService;
        this._routesService = routesService;

        this._$scope = $scope;
        this._$scope.experience = {
            currentView: 'explore',
            isOpen: false
        };

        // listen to route change
        this._routesService.subscribe('change', this.onRouteChange.bind(this));
        if (this._routesService.page) {
            this.onRouteChange();
        }
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ExperienceCtrl.$inject = [
        '$scope',
        'experienceService',
        'routesService'
    ];

    ExperienceCtrl.prototype.switchView = function (view) {
        this._$scope.experience.isOpen = view !== 'detail';
        this._$scope.experience.currentView = view;
        this._experienceService.switchView(view);
    };

    ExperienceCtrl.prototype.onRouteChange = function () {
        if (this._routesService.page === 'detail') {
            this.switchView('detail');
        } else if (this._routesService.page === 'experience') {
            this.switchView(this._routesService.params.mode);
        }
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
