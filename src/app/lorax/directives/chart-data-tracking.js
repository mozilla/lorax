/**
 * @fileOverview Data Tracking Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery'], function ($) {
    'use strict';

    /**
     * Terms & Conditions Chart directive
     */
    var ChartDataTrackingDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartDataTrackingController,
            link: ChartDataTrackingLinkFn,
            templateUrl: '/app/lorax/directives/chart-data-tracking.tpl.html'
        };
    };

    /**
     * Controller for Data Tracking Chart directive
     * @constructor
     */
    var ChartDataTrackingController = function (
        $scope,
        $timeout
        )
    {
        this._$scope = $scope;
        this._$timeout = $timeout;

        var infographic = $scope.modalIssue.issue.getInfographic();
        this._data = infographic.getDataPoints().tracking;
        this._localeData = infographic.getDataPoints().labels;

        $scope.tracking = {
            infographic: infographic,
            data: this._data,
            localeData: this._localeData
        };
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ChartDataTrackingController.$inject = [
        '$scope',
        '$timeout'
    ];

    /**
     * Link function for Data Tracking Chart directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ChartDataTrackingLinkFn = function (scope, iElem, iAttrs, controller) {
        var createBars = function () {
            var $bars = $('.data-tracking__tracker-bar');
            var maxHeight = 200;

            $bars.each(function(idx) {
                var $this = $(this);
                var length = controller._data[idx].percent;
                var percentBar = document.createElement('div');
                percentBar.style.height = ((length * maxHeight)/100) + 'px';
                percentBar.classList.add('data-tracking__tracker-bar-percent');

                $this.append(percentBar);
            });
        };

        controller._$timeout(createBars);
    };

    return ChartDataTrackingDirective;
});
