/**
 * @fileOverview Experience canvas directive
 * @author <a href="mailto:leandroferreira@moco.to">Leandro Ferreira</a>
 */
define(['experience/experience'], function (Experience) {
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
        dataService,
        experienceService
        )
    {
        this._$scope = $scope;

        dataService.getMain().then(function(model) {
            this._experience = new Experience();
            this._experience.setData(model);
            this._experience.setContainer(this._container);
            experienceService.setCanvas(this._experience);
        }.bind(this));
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ExperienceCanvasController.$inject = [
        '$scope',
        'dataService',
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
        controller._container = iElem;
    };

    return ExperienceCanvasDirective;
});
