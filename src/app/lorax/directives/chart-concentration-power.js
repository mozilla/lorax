/**
 * @fileOverview Concentration of Power Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
    'use strict';

    /**
     * Concentration of Power Chart directive
     */
    var ChartConcentrationPowerDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartConcentrationPowerController,
            link: ChartConcentrationPowerLinkFn,
            templateUrl: '/app/lorax/directives/chart-concentration-power.tpl.html'
        };
    };

    /**
     * Controller for Concentration of Power Chart directive
     * @constructor
     */
    var ChartConcentrationPowerController = function (
        $scope,
        $timeout,
        pubSubService,
        windowService
        )
    {
        this._$scope = $scope;
        this._$timeout = $timeout;
        this._pubSubService = pubSubService;
        this._windowService = windowService;

        this._data = $scope.issue.getInfographic().getDataPoints().totalRevenue;

        $scope.revenue = {
            data: this._data
        };

        this._stackMultipliers = {
            'small': 0.85,
            'medium': 1.65,
            'large': 1.65,
            'xlarge': 1.65
        };
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ChartConcentrationPowerController.$inject = [
        '$scope',
        '$timeout',
        'pubSubService',
        'windowService'
    ];

    /**
     * Link function for Concentration of Power Chart directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ChartConcentrationPowerLinkFn = function (scope, iElem, iAttrs, controller) {
        var createStacks = function () {
            var $stacks = $('.concentration-power__stacks');

            // clear stacks
            $stacks.html('');

            $stacks.each(function (idx) {
                var $this = $(this);
                var length = controller._data[idx].amount;
                var numBars = Math.round(length/5) *
                    controller._stackMultipliers[controller._windowService.breakpoint()];

                for (var i = 0; i < numBars; i++) {
                    $this.append('<div class="concentration-power__stacks-item"></div>');
                }
            });
        };

        // init stacks
        controller._$timeout(createStacks);

        // reinit on breakpoint change
        controller._pubSubService.subscribe(
            'windowService.breakpoint',
            createStacks
        );
    };

    return ChartConcentrationPowerDirective;
});
