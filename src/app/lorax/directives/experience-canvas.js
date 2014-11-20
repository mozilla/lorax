/**
 * @fileOverview Experience canvas directive
 * @author <a href="mailto:leandroferreira@moco.to">Leandro Ferreira</a>
 */
define([], function () {
    'use strict';

    /**
     * directive
     */
    var ExperienceCanvasDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            controller: ExperienceCanvasController,
            link: ExperienceCanvasLinkFn,
            templateUrl: '/app/lorax/directives/experience-canvas.tpl.html'
        };
    };

    /**
     * Controller
     * @constructor
     */
    var ExperienceCanvasController = function (
        $scope,
        experienceService
        )
    {
        this._$scope = $scope;
        this._experienceService = experienceService;
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ExperienceCanvasController.$inject = [
        '$scope',
        'experienceService'
    ];

    /**
     * Link function
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ExperienceCanvasLinkFn = function (scope, iElem, iAttrs, controller) {
        controller._experienceService.setContainer(iElem);
    };

    return ExperienceCanvasDirective;
});
